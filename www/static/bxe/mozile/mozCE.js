/* ***** BEGIN LICENSE BLOCK *****
 * Licensed under Version: MPL 1.1/GPL 2.0/LGPL 2.1
 * Full Terms at http://mozile.mozdev.org/license.html
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Playsophy code.
 *
 * The Initial Developer of the Original Code is Playsophy
 * Portions created by the Initial Developer are Copyright (C) 2002-2003
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * ***** END LICENSE BLOCK ***** */

// $Id: mozCE.js 1840 2008-06-09 13:18:30Z chregu $

/* 
 * mozCE V0.5
 * 
 * Mozilla Inline text editing that relies on eDOM, extensions to the standard w3c DOM.
 *
 * This file implements contenteditable/user modify in Mozilla by leverging
 * Mozilla's proprietary Selection object as well as eDOM, a set of browser independent
 * extensions to the w3c DOM for building editors. 
 *
 * POST05:
 * - refactor userModify code as part of "EditableElement" 
 * - IE's "ContentEditable" means that an element is editable whenever its "ContentEditable"
 * setting is true. However, we may change this so that you have to set editing on for a
 * document as a whole before its individual editable sections become editable. This would
 * allow a user to browse an editable document and explicitly choose to edit it or not.
 * - see if can move to using DOM events and away from Window.getSelection() if possible 
 * (effects how generic it can be!)
 * - selection model: word, line etc. Write custom handlers of clicks and use new Range
 * expansion methods
 */

/****************************************************************************************
 *
 * MozUserModify and ContentEditable: allow precise designation of editing scope. This
 * file implements user-modify/contentEditable. The following utilities let the implementation
 * determine scope.
 *
 * - http://www.w3.org/TR/1999/WD-css3-userint-19990916#user-modify
 *
 * POST04
 * - rename to be "mozSelection.js"
 * - remove need to spec ContentEditable as equivalent to mozUserModify: do mapping in
 * style sheet: *[contentEditable="true"] 
 * - to change as part of "editableElement": may also move Selection methods into EditableElement
 * - support for tracking whether changes were made to elements or not ie/ does a user
 * need to save? Should MozCE warn a user to save before exiting the browser? Some of
 * this may go into eDOM itself in enhancements to document or to all elements ie/ changed?
 *
 ****************************************************************************************/

/**
 * Start of "EditableElement": this will move into eDOM once it is fleshed out.
 *
 * POST04: set user-input and user-select properly as a side effect of setting user-modify. 
 * Need to chase to explicit parent of the editable area and check if true
 * Also for contentEditable - make sure set moz user modify and other properties!
 */
Element.prototype.__defineGetter__(
	"mozUserModify",
	function()
	{
		return document.defaultView.getComputedStyle(this, null).MozUserModify;
	}
);

/**
 * Does MozUserModify set this element modifiable
 */
Element.prototype.__defineGetter__(
		"mozUserModifiable",
		function()
		{
			// first check user modify!
			if (!this._mozUserModify) {
				var mozUserModify = this.mozUserModify;
				if(mozUserModify == "read-write")
				{	
					this._mozUserModify = true;
					return true;
				}
				
				return false;
			}
			return true;
		}
);

/**
 * mozUserModify and contentEditable both count
 */
Element.prototype.__defineGetter__(
	"userModify",
	function()
	{
		if (!this._userModify) {
		// special case: allow MS attribute to set modify level
			if(this.isContentEditable)
				return("read-write");
			var mozUserModify = this.mozUserModify;
			this._userModify = mozUserModify;
			return mozUserModify;
		}
		return this._userModify;
	}
);

/**
 * If either contentEditable is true or userModify is not read-only then return true. This makes
 * it easy to support a single approach to user modification of elements in a page using either
 * the W3c or Microsoft approaches.
 * 
 * POST04:
 * - consider not supporting contentEditable here
 */
Element.prototype.__defineGetter__(
		"userModifiable",
		function()
		{
			// first check user modify!
			if (this._userModify) {
				return true;
			} else {
				if(this.userModify == "read-write")
				{
					this._userModify = true;
					return true;
				}
			}
			return false;
		}
);

/*
 * UserModifiableContext means a parent element that is explicitly set to userModifiable. Note that this accounts for
 * different degrees of userModify. If say "writetext" is inside a "write" then context will stop at the writetext
 * element. That is the context for that level of usermodify. 
 */ 
Element.prototype.__defineGetter__(
	"userModifiableContext",
	function()
	{
		// Moz route (userModify) 
		if(this.mozUserModifiable)
		{
			var context = this;
			contextUserModify = this.mozUserModify;
			while(context.parentNode)
			{
				var contextParentUserModify = context.parentNode.mozUserModify;
				if(contextParentUserModify != contextUserModify)
					break;
				context = context.parentNode;
				contextUserModify = contextParentUserModify;
			}
			return context;
		}

		// try IE route
		return this.contentEditableContext;
	}
);

/***************************************************************************************************************
 * New Selection methods to support styling the current selection
 *
 * POST05:
 * - move alot of the content here (the XHTML specific stuff) to eDOMXHTML leaving these methods as just Selection
 * wrappers for Range methods.
 ***************************************************************************************************************/

/**
 * "Delete" for selected XHTML represents three behaviors:
 * - if range isn't collapsed then delete contents of the range - treat table contents properly (see code for behavior)
 * - if range is collapsed
 *   - if at start of line then merge line with previous line if there is one and this is appropriate
 *   - otherwise delete character or element before the selected point in the line
 *
 * Note: this is an XHTML compliant deletion. It is driven solely by CSS settings. This works for XHTML selections but
 * it is unlikely to work for semantically rich and restrictive XML. Deletion of an XML document would have to pay 
 * attention to that document's semantics.
 */
Selection.prototype.deleteSelection = function(backspace, makeDefault)
{
	var cssr = this.getEditableRange();
	var doTransform = false;
	if(!cssr)
		return;
	var _posPlus = null;
	if(cssr.collapsed) {
		if (cssr.startContainer.nodeValue.strip().length == 1) {
			try {
			var sel = window.getSelection();
			cssr = this.getEditableRange();
			var par = cssr.startContainer.parentNode.XMLNode._node;
			par.normalize();
			if (par.childNodes.length <= 1) {
				// if attributenode
				if (par.nodeType == 2) {
					var parpar = par.ownerElement;
					parpar.removeAttributeNode(par);
				} else {
					var parpar = par.parentNode;
					var nextSibling = par.nextSibling;
					bxe_checkEmpty(par.XMLNode,makeDefault);
				}
				if (!parpar.XMLNode.isNodeValid(true,2,true)) {
					var _new = parpar.insertBefore(parpar.ownerDocument.createElementNS(par.namespaceURI,par.localName),nextSibling);
					_new.XMLNode = _new.getXMLNode();
					bxe_checkEmpty(_new.XMLNode,makeDefault);
				}
				parpar.normalize();
				var _h = par.XMLNode._htmlnode;
				if (!makeDefault) {
					var _pref = bxe_goToNextNode(cssr,true);
					if (_pref && _pref.nodeType == 1) { _pref = _pref.lastChild;}
					if (_pref && _pref.nodeValue) { 
						sel.collapse(_pref,_pref.nodeValue.length);
					} else {
						//alert(_pref);
					}
				}
				sel.collapseToStart();
				
				bxe_Transform();
				return;
				
			}
			sel.collapse(cssr.startContainer,0);
			
			sel.extend(cssr.startContainer,cssr.startContainer.length);
			sel.deleteSelection(backspace);
			
			return;
			} catch (e) { bxe_catch_alert(e);}
		}
		
		var ip = documentCreateInsertionPoint(cssr.top, cssr.startContainer, cssr.startOffset);
		var par = cssr.startContainer.parentNode;
		if (!backspace && cssr.startOffset == 0  ) {
			if ( !cssr.startContainer.previousSibling) {
				var prev = par.previousSibling;
				while (prev && prev.nodeType != 1) {
					prev = prev.previousSibling;
				}
				if (prev) {
					var sel = window.getSelection();
					sel.collapse(prev.lastChild,prev.lastChild.length);
					sel.extend(cssr.startContainer,0);
					cssr = this.getEditableRange();
					sel.deleteSelection();
					
				}
				return;
			} else {
				
				var sel = window.getSelection();
				this.collapse(cssr.startContainer.previousSibling.lastChild,cssr.startContainer.previousSibling.lastChild.length);
				var cssr = this.getEditableRange();
				ip = documentCreateInsertionPoint(cssr.top, cssr.startContainer, cssr.startOffset);
			}
			
		} else if (backspace && cssr.startContainer.length == cssr.startOffset ) {
			if ( !cssr.startContainer.nextSibling) {
				var prev = par.nextSibling;
				while (prev && prev.nodeType != 1) {
					prev = prev.nextSibling;
				}
				if (prev) {
					var sel = window.getSelection();
					sel.collapse(cssr.startContainer,cssr.startContainer.length);
					sel.extend(prev.firstChild,0);
					cssr = this.getEditableRange();
					sel.deleteSelection();
					
				}
				return;
			}  else {
				
				var sel = window.getSelection();
				this.collapse(cssr.startContainer.nextSibling.firstChild,0);
				var cssr = this.getEditableRange();
				ip = documentCreateInsertionPoint(cssr.top, cssr.startContainer, cssr.startOffset);
			}
		}
		if (backspace) {
			ip.forwardOne();
		}
		
		var result = ip.deletePreviousInLine();
		
		if (result) {
			//cssr.selectInsertionPoint(ip);
			
			var startC =   cssr.startContainer;
			var par = startC.parentNode
			
			
			var lala = par.XMLNode._node;
			lala.betterNormalize(); 
			par.edited = true ;
			if (lala.nodeType == 2) {
				lala.value =  par.getContent();
			} else {
				
				var _position = bxe_getChildPosition(startC);
				lala.replaceChild(bxe_config.xmldoc.importNode( startC,true),lala.childNodes[_position]);
			}
		} 
		
	
	} else {
		//TESTME
		this.fixFocus();
		
		var xmlnode = bxe_getXMLNodeByHTMLNodeRecursive(this.anchorNode.parentNode);
		if (xmlnode.betterNormalize) {
			xmlnode.betterNormalize();
		}
		
		
		if (xmlnode.nodeType == 2) {
			//FIXME 2.0
			//xmlnode._node.value =  xmlnode._node.ownerElement.getContent();
			cssr.extractContentsByCSS();
			xmlnode.nodeValue =  this.anchorNode.nodeValue;
		} else {
			if (xmlnode.XMLNode.vdom && xmlnode.XMLNode.vdom.bxeTabletype == "table-cell") {
				if (xmlnode.XMLNode._node != this.focusNode.parentNode.XMLNode._node ) {
					this.collapse(this.anchorNode,1);
					this.extend(this.anchorNode,this.anchorNode.length);
				}
			}
			var _position = bxe_getChildPosition(this.anchorNode);
			
			var textNode = xmlnode.childNodes[_position];
			
			// first delete all subnodes, if we have
			if (this.anchorNode != this.focusNode) {
				
				var endxmlnode = bxe_getXMLNodeByHTMLNodeRecursive(this.focusNode.parentNode);
				endxmlnode.betterNormalize();
				var _endposition = bxe_getChildPosition(this.focusNode);
				var endtextNode = endxmlnode.childNodes[_endposition ];
				if(endtextNode.splitText) {
					endtextNode.splitText(this.focusOffset);
				} else {
					var _next = endtextNode.childNodes[this.focusOffset];
					if (_next && _next.nodeType == 3) {
						endtextNode = _next;
						endtextNode.splitText(0);
						endxmlnode = endtextNode.parentNode;
					}
				}
					
				var walker = document.createTreeWalker(
				textNode.ownerDocument.documentElement, NodeFilter.SHOW_ALL,
				null, 
				true);
				walker.currentNode = textNode;
				var oldnode;
				node = walker.nextNode();
				do {
					if (node == endtextNode) {
						break;
					}
					oldnode = node;
					if (!(oldnode.compareDocumentPosition(endtextNode) & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
						// if children, delete all of them first
						if (oldnode.hasChildNodes()) {
							while (oldnode.firstChild) {
								oldnode.removeChild(oldnode.firstChild);
							}
						}
						node =   walker.nextNode();
						oldnode.parentNode.removeChild(oldnode);
					} else {
						node =   walker.nextNode();
					}
					
					
				} while(node);
				// merge nodes
				
			} else {
				
				textNode.splitText(this.focusOffset);
			}
			textNode = textNode.splitText(this.anchorOffset);
						// delete last node
			if (this.anchorNode != this.focusNode) {
				//endxmlnode.betterNormalize();
				endxmlnode.removeChild(endtextNode);
				var blockparent = xmlnode.getBlockParent();
				var endblockparent = endxmlnode.getBlockParent();
				
				if (blockparent.nextSibling.nextSibling == endblockparent || blockparent.nextSibling == endblockparent ) {
					//merge nodes
					 blockparent.mergeWith(endblockparent);
				}
				doTransform = true;
				
			} else {
				cssr.extractContentsByCSS();
				this.anchorNode.parentNode.removeAttribute("__bxe_defaultcontent");
				if (this.anchorNode.parentNode.XMLNode) {
					this.anchorNode.parentNode.XMLNode._node.removeAttribute("__bxe_defaultcontent");
				}
			}
			if (textNode.parentNode == xmlnode) {
				var _prev = textNode.previousSibling;
				xmlnode.removeChild(textNode);
				bxe_checkEmptyParent(xmlnode.XMLNode);
				
			} else {
				delete textNode;
			}
			if (blockparent) {
				blockparent.betterNormalize(); 
			}
		}
	}
	
	//this.selectEditableRange(cssr);
	var _posAnchor = null;
	if ( this.focusNode.nodeValue && this.focusNode.nodeValue.substr(this.focusOffset,1) == " ") {
		 _posPlus = this.anchorOffset;
		 _posAnchor = this.anchorNode;
	} else if (this.focusOffset >= this.focusNode.length && this.focusNode.nodeValue.substr(this.focusNode.length -1 ,1) == " ") {
		_posPlus = this.focusNode.length;
	} else if (this.anchorOffset == 0) {
		_posPlus = 0;	
	}
	this.removeAllRanges();
	this.addRange(cssr.cloneRange());
	if (typeof _posPlus == 'number') {
		if (_posAnchor) {
				this.collapse(_posAnchor, _posPlus );
		} else {
        	this.collapse(this.anchorNode, _posPlus );
		}
	}
	if (doTransform) {
		
		bxe_Transform();
	}
	
	
}

/**
 * POST05: change so defaultValue doesn't have to be passed in; think about toggling whole line if selection collapsed
 */
Selection.prototype.toggleTextStyle = function(styleName, styleValue, defaultValue, styleClass)
{
	var cssr = this.getEditableRange();

	if(!cssr)
		return;

	if(cssr.hasStyle(styleName, styleValue))
		cssr.styleText(styleName, defaultValue, styleClass);
	else
		cssr.styleText(styleName, styleValue, styleClass);

	this.selectEditableRange(cssr);
}
/**
* adds or removes a class from a selection
*/
Selection.prototype.toggleTextClass = function(styleClass, namespaceURI)
{
	if (typeof namespaceURI == "undefined") {
		namespaceURI = "";
	}
	var cssr = this.getEditableRange();

	if(!cssr)
		return;


	cssr.styleText(styleClass, true, true, namespaceURI);

	this.selectEditableRange(cssr);
}



/**
 * POST05: think about toggling whole line if selection collapsed
 */
Selection.prototype.styleText = function(styleName, styleValue)
{
	var cssr = this.getEditableRange();

	if(!cssr)
		return;

	cssr.styleText(styleName, styleValue);

	this.selectEditableRange(cssr);
}

Selection.prototype.linkText = function(href)
{
	
	
	var cssr = this.getEditableRange();

	if(!cssr)
		return;

	cssr.linkText(href);

	this.selectEditableRange(cssr);
}

Selection.prototype.clearTextLinks = function()
{
	var cssr = this.getEditableRange();

	if(!cssr)
		return;

	cssr.clearTextLinks();

	this.selectEditableRange(cssr);
}

/**
 * This will only style contained lines
 */
Selection.prototype.styleLines = function(styleName, styleValue)
{
	var cssr = this.getEditableRange();

	if(!cssr)
		return;

	var lines = cssr.lines;	

	for(var i=0; i<lines.length; i++)
	{
		// turn bounded line into contained line or put in container for top line
		if((lines[i].lineType == CSSLine.BOUNDED_LINE) || lines[i].topLine)
		{
			// special case: empty bounded line - don't try to style this!
			if(lines[i].emptyLine)
				continue;
			lines[i] = lines[i].setContainer(documentCreateXHTMLElement(defaultContainerName), false);
		}

		lines[i].setStyle(styleName, styleValue);
	}

	this.selectEditableRange(cssr);
}



Selection.prototype.changeLinesContainer = function(containerName, namespace)
{
	var cssr = this.getEditableRange();

	if(!cssr)
		return;
	var newContainer = new Array();
	var lines = cssr.lines;
	for(var i=0; i<lines.length; i++)
	{
		// keep container if it is a contained line but not a block:
		// - it is top
		// - it is a table cell
		// - it is a list item
		//var keep = ((lines[i].lineType == CSSLine.CONTAINED_LINE) && (lines[i].containedLineType != ContainedLine.BLOCK));
		var keep = false;
		if (namespace == XHTMLNS) {
			var removeClass = false;
			//if (lines[i].__container.getAttribute("class"));
			if (lines[i].__container.XMLNode) {
				if (lines[i].__container.XMLNode.nodeName == lines[i].__container.getAttribute("class")) {
					removeClass = true;
					
				}
			}
			var line = lines[i].setContainer(documentCreateXHTMLElement(containerName), !keep);
			if (removeClass) {
				line.__container.removeAttribute("class");
			}
		} else {
			var newNode = document.createElementNS(XHTMLNS,"div");
			var line = lines[i].setContainer( newNode,true);
			line.__container.setAttribute("class", containerName);
		}
		line.__container.setAttribute("__bxe_ns", namespace);
	
		
		newContainer.push(line.__container)

	}

	this.selectEditableRange(cssr);
	return newContainer;
}

Selection.prototype.removeLinesContainer = function()
{
	var cssr = this.getEditableRange();

	if(!cssr)
		return;

	var lines = cssr.lines;
	for(var i=0; i<lines.length; i++)
	{
		if((lines[i].lineType == CSSLine.CONTAINED_LINE) && !lines[i].topLine) // as long as contained line and container isn't top then remove it
			lines[i].removeContainer();
	}

	this.selectEditableRange(cssr);
}

Selection.prototype.indentLines = function()
{	
	var cssr = this.getEditableRange();

	if(!cssr)
		return;

	indentLines(cssr);	

	this.selectEditableRange(cssr);
}

Selection.prototype.outdentLines = function()
{	
	var cssr = this.getEditableRange();

	if(!cssr)
		return;

	outdentLines(cssr);	

	this.selectEditableRange(cssr);
}

Selection.prototype.toggleListLines = function(requestedList, alternateList)
{	
	var _moved = false;
	//if cursor at end, shit happens. prevent that here
	// see http://cvs.wyona.org/cgi-bin/bugzilla/show_bug.cgi?id=3188
	if(this.isCollapsed && this.anchorOffset > 0) {
		this.collapse(this.anchorNode, this.anchorOffset -1);
		 _moved = true;
	}
	var cssr = this.getEditableRange();

	if(!cssr)
		return;
	listLinesToggle(cssr, requestedList, alternateList);
	this.selectEditableRange(cssr);
	if (_moved) {
		this.collapse(this.anchorNode, this.anchorOffset +1);
		 
	}
	return  cssr.lines;

}

Selection.prototype.insertNodeRaw = function (node, oldStyleInsertion) {
	var sel = this
	var cssr = this.getEditableRange();
	
		if(!cssr)
		return;
	// if there's a selection then delete it
	if(!cssr.collapsed)
	{
		bxe_deleteEventKey(window.getSelection(), false,false,true);
		
	}
	
	try {
		if (this.anchorNode.parentNode.getAttribute("__bxe_defaultcontent") == "true") {
			var _parx = bxe_getXMLNodeByHTMLNode(this.anchorNode.parentNode);
			_parx.removeChild(_parx.firstChild);
			_parx.appendChild(_parx.ownerDocument.createTextNode(" "));
			_parx.removeAttribute("__bxe_defaultcontent");
			if (this.anchorNode.length > 0) {
				this.anchorNode.nodeValue = " ";
			}
		}
	} catch (e) {
		alert(e);
	}
			
	
	var xmlnode = bxe_getXMLNodeByHTMLNode(sel.anchorNode.parentNode);
	xmlnode.betterNormalize();
	var _position = bxe_getChildPosition(sel.anchorNode);
	xmlnode.childNodes[_position].splitText(sel.focusOffset);
	if (!sel.isCollapsed) {
		xmlnode.childNodes[_position].splitText(sel.anchorOffset);
	} 
		
	var textNode = xmlnode.childNodes[_position + 1];
	
	if (node.nodeType == 11) {
		var child = node.firstChild;
		var node = null;
		while (child) {
			 node = child;
			 child = child.nextSibling;
			 xmlnode.insertBefore(node,textNode);
		}
	} else {
		node = xmlnode.insertBefore(node, textNode);
	}
	xmlnode.normalize();
	
	
	if (node.nodeType == 1) {
		var id = node.setBxeId();
		node.XMLNode = node.getXMLNode();
	}
	/*if (!node.parentNode.XMLNode) {
		node.parentNode.XMLNode = node.parentNode.getXMLNode();
	}
	node.parentNode.XMLNode.isNodeValid(true,2);
	*/
	
	return node;
}

Selection.prototype.insertNode = function(node)
{
	var checkNode = node;
	if (node.nodeType == 11 ) {
		checkNode = node.firstChild;
	}
	if (checkNode && checkNode.XMLNode) {
		if (!bxe_checkIsAllowedChild(checkNode.XMLNode.namespaceURI,checkNode.XMLNode.localName,this)) {
			return false;
		}
	}
/*	var cb = bxe_getCallback(node.XMLNode.localName, node.XMLNode.namespaceURI);
	if (cb ) {
		bxe_doCallback(cb, BXE_SELECTION);
		return;
	}
	*/
	return this.insertNodeRaw(node);

	
}

/**
 * POST05: paste more than text
 */
Selection.prototype.paste = function(paraElementVdom,selNode,alwaysAppend)
{
	var clipboard = mozilla.getClipboard();
	var cntnt = clipboard.getData(MozClipboard.TEXT_FLAVOR);

	
	if (cntnt.nodeType == 11 && cntnt.firstChild.nodeType == 3 && cntnt.childNodes.length == 1) {
		
		cntnt.data = cntnt.firstChild.data;
	}
	for (var i in cntnt.childNodes) {
		
		if (cntnt.childNodes[i].nodeType == 1) {
			cntnt.childNodes[i].setBxeIds(true);
		}
	}
	
	if (cntnt && cntnt.data) {
		var elementNameParent = null;
		var elementNameGrandParent = null;
		var elementNamespace = null;
		var elementName = null;
		if (paraElementVdom == "__text__") {
			
		} else if (paraElementVdom) {
			if (paraElementVdom.namespaceURI) {
				elementNamespace = paraElementVdom.namespaceURI;
			}
			
			if (paraElementVdom.bxeClipboardGrandChild) {
				elementName = paraElementVdom.bxeClipboardGrandChild;
				elementNameParent = paraElementVdom.bxeClipboardChild;
				elementNameGrandParent = paraElementVdom.localName;
			}
			else if (paraElementVdom.bxeClipboardChild) {
				elementName = paraElementVdom.bxeClipboardChild;
				elementNameParent = paraElementVdom.localName;
			} else {
				elementName = paraElementVdom.localName;
			}
		} else {
			elementName = bxe_config.options['autoParaElementName'];
			elementNamespace = bxe_config.options['autoParaElementNamespace']
		}
		cntnt.data = cntnt.data.replace(/\r/g,"\n").replace(/\n+/g,"\n");
		if (elementName && clipboard._system && (alwaysAppend || cntnt.data.search(/[\n]./) > -1)) {
			cntnt = cntnt.data;
			cntnt = cntnt.replace(/&/g,"&amp;").replace(/</g,"&lt;");
			var elementName_start = elementName;
			if (elementNamespace) {
				elementName_start += " xmlns='"+elementNamespace +"'";
			}
			if (elementNameGrandParent) {
				cntnt = cntnt + "\n";
				var row = cntnt.match(/(.*[\n$]+)/g);
				var cntnt = "<" + elementNameGrandParent;
				if (elementNamespace) {
					cntnt2 += " xmlns='"+elementNamespace +"'";
				}
				cntnt += ">";
				var delimiter = eval("'" + clipboard.delimiter + "'");
				var _starti = 0;
				if (paraElementVdom.bxeClipboardFirstChild) {
					if (! paraElementVdom.bxeClipboardEmptyFirstRow ) {
						_starti = 1;
					}
					cntnt += "<"+ paraElementVdom.bxeClipboardFirstChild +">";
					
					var cell = row[0].split(delimiter);
					for (var j = 0; j < cell.length; j++) {
						cntnt += "<"+paraElementVdom.bxeClipboardFirstGrandChild + ">";
						if (! paraElementVdom.bxeClipboardEmptyFirstRow  ) {
							cntnt += cell[j];
						}
						cntnt += "</" + paraElementVdom.bxeClipboardFirstGrandChild + ">\n";
					}
					cntnt += "</"+ paraElementVdom.bxeClipboardFirstChild +">\n";
					
				}
				//find largest row
				var max = 0;
				for (var i = _starti; i < row.length; i++) {
				  	row[i] = row[i].replace(/[\n\t\r]+$/,"");
					var cell = row[i].split(delimiter);
					
					if (cell.length > max) {
						max = cell.length;
					}
				}
				for (var i = _starti; i < row.length; i++) {
					cntnt += "<"+ elementNameParent +">";
					var cell = row[i].split(delimiter);
					for (var j = 0; j < max; j++) {
						cntnt += "<"+elementName_start + ">";
						if (cell[j]) {
							cntnt += cell[j];
						} else {
							cntnt += "#";
						}
							
						cntnt += "</" + elementName + ">\n";
					}
					cntnt += "</"+ elementNameParent +">\n";
				}
				cntnt += "</" + elementNameGrandParent + ">\n";
			} else {
				cntnt = cntnt.replace(/\n+$/,"");
				cntnt = "<"+elementName_start + ">"+ cntnt.replace(/[\n]+/g,"</"+elementName+"><"+elementName_start+" >")+"</"+elementName+">";
				
				if (elementNameParent) {
					var cntnt2 = "<" + elementNameParent;
					if (elementNamespace) {
						cntnt2 += " xmlns='"+elementNamespace +"'";
					}
					cntnt = cntnt2 + ">" + cntnt + "</" + elementNameParent + ">";
				}
			}
			if (alwaysAppend) {
				var docfrag = cntnt.convertToXML();
				var e = {'additionalInfo': {'node': docfrag ,'appendToNode': selNode} };
				
				bxe_appendNode(e);
			} else {
				bxe_insertContent_async(cntnt,BXE_SELECTION,BXE_SPLIT_IF_INLINE,selNode._node);
			}
		} else {
			window.getSelection().insertNode(cntnt);
		}
	} else {
		window.getSelection().insertNode(cntnt);
	} 
	
	var node = window.getSelection().anchorNode;
	if( node && node.nodeType == 3) {
		node.XMLNode._node.normalize();
		bxe_checkEmptyParent(node.parentNode.XMLNode);
	} else {
		bxe_checkEmptyParent(node.XMLNode);
		
	}
	
	
	bxe_history_snapshot_async();
	if (node && node.XMLNode) {
		bxe_Transform(false,false,node.XMLNode.parentNode);
	} else {
		bxe_Transform(false,false);
	}
	return node;
	
}
// creates a hidden form field for interapp copy/paste support without native-method support
/*Selection.prototype._createHiddenForm = function() {
		var iframe = document.createElement("div");
		iframe.setAttribute("ID","ClipboardIFrame");
		iframe.setAttribute("style","  -moz-user-input: enabled; position: fixed; width: 0px; height: 0px; top: 0px; left: 0px; overflow: hidden; ");
		iframe =  document.getElementsByTagName("body")[0].appendChild(iframe);
		var input = document.createElement("textarea");
		input.id =  'hiddenform';
		input.setAttribute("style","height: 3000px;");
		// don't know of any other solution to get a Range object for the input value
		// therefore we create a span element, so we can use selectNodeContents on that later
		var placeholder = document.createElement("span");
		iframe.appendChild(input);
		iframe.appendChild(placeholder);
		iframe._placeholder = placeholder;
		iframe._input = input;
		return iframe;
}
*/
/**
 * copies the selection to the hidden form field on key down
 */
/*Selection.prototype.copyKeyDown = function() {
	
	//copy the selection into the internal clipboard
	this.copy();
	
	//clipboard._clipboardText.replace(/[\n\r]+/," ");
	//check if hidden form already exists
	var iframe = document.getElementById("ClipboardIFrame");
	if (!iframe) {
		iframe = this._createHiddenForm();
	}
	
	//store the editable range for later retrieval
	var clipboard = mozilla.getClipboard();
	var cssr = this.getEditableRange();
	iframe._cssr = cssr;  
	
	//remove all children in the placeholder span
	iframe._placeholder.removeAllChildren();
	//get the clipboard object
	clipboard = mozilla.getClipboard();
	
	//insert the text from the internal clipboard in the placeholder span
	iframe._placeholder.appendChild(document.createTextNode(clipboard._clipboardText));
	
	//select the content of the placeholder span, so the ctrl+c keypress event can catch it
	var rng = document.createRange();
    rng.selectNodeContents(iframe._placeholder);
    this.removeAllRanges();
	this.addRange(rng);
	
}
*/
/**
 * restores the selection back to what it was before the copy event
 */
/*Selection.prototype.copyKeyUp = function() {
	
	var iframe = document.getElementById("ClipboardIFrame");
	this.selectEditableRange(iframe._cssr);
}
*/
/**
 * sets the focus to the hidden form on a paste key down event
 */
/*Selection.prototype.pasteKeyDown = function() {
	var iframe = document.getElementById("ClipboardIFrame");
	if (!iframe) {
		iframe = this._createHiddenForm();
	}
	// delete value of hidden form
	iframe._input.value = "";
	// delete childnodes of placeholder
	iframe._placeholder.removeAllChildren();
	//store the range for later retrieval
	
	var cssr = this.getEditableRange();

	iframe._cssr = cssr;
	iframe._input.focus();
}*/
/**
 * pastes the stuff from the hidden form field in to the internal clipboard
 */
/*Selection.prototype.pasteKeyUp = function () {
	
	var iframe = document.getElementById("ClipboardIFrame");
	iframe._input.blur();

	//copy the content of the hidden form into the placeholder span
	var text = iframe._placeholder.appendChild(document.createTextNode(iframe._input.value));
	
	//make a range with the content of the placesholder span
	var rng = document.createRange();
	rng.selectNodeContents(iframe._placeholder);
	
	//put the data of the placeholder span in the internal clipboard, if it's different
	// than the content in the internal clipboard (then we assume, it's newer..)
	var clipboard = mozilla.getClipboard();
	
	if (!clipboard._clipboardText) {
		clipboard.setData(rng);
		clipboard._system = true;
	}
	else if (rng.toString().replace(/[\n\r\s]+/g," ") != clipboard._clipboardText.replace(/[\n\r\s]+/g," ")) {
		var promptText = "Internal and System-Clipboard are differing: \n\n";
		var _sysString = rng.toString();
		var _intString = clipboard._clipboardText;
		if (_sysString.length > 200) {
			_sysString = _sysString.substr(0,200) + " \n<too long, rest snipped>";
		}
		if (_intString.length > 200) {
			_intString = _intString.substr(0,200) + " \n<too long, rest snipped> ";
		}
		promptText += "******************\n";
		promptText += "System   (Cancel): \n'" + _sysString  +"'\n\n";
		promptText += "******************\n";
		promptText += "Internal   (OK)  : \n'" + _intString  + "'\n\n";
		promptText += "******************\n";
		promptText += "If you want to use the Internal, click OK, otherwise (using System) Cancel\n";
		//this try/catch is here, because we had some problems with confirm and absolutely unrelated errors
		
		try {
			var internal = confirm( promptText)
		} catch(e) {}
		
		if(!internal) {
			clipboard.setData(rng);
			clipboard._system = true;
		} else {
			clipboard._system = false;
		}
	}
	//restore the selection
	var cssr = iframe._cssr;
	var _eol = cssr.firstInsertionPoint.endOfLine;
	this.selectEditableRange(cssr);
	
	if (_eol && !cssr.firstInsertionPoint.endOfLine) {
		ip = documentCreateInsertionPoint(cssr.top, cssr.startContainer, cssr.startOffset);
		
		if(ip != InsertionPoint.SAME_LINE)
		ip.backOne();
		cssr.selectInsertionPoint(ip);
		this.removeAllRanges();
		rng = cssr.cloneRange();
		this.addRange(rng);
	}
	
	// paste the content of the internal clipboard
	this.paste();
}
*/
Selection.prototype.copy = function(textOnly)
{
	var cssr = this.getXMLFragment();

	if(!cssr || cssr.collapsed) // not an editable area or nothing selected
		return; 

	// data to save - render as text (temporary thing - move to html later)
	//var text = cssr.toString().replace(/\n/g," ");

	var clipboard = mozilla.getClipboard();
	clipboard._system = false;
	
	if (textOnly) {
		clipboard.setData(cssr.toString(),MozClipboard.TEXT_FLAVOR);
	} else {
		clipboard.setData(cssr,MozClipboard.TEXT_FLAVOR);
	}
}

Selection.prototype.cut = function(textOnly)
{
	this.copy(textOnly);
	bxe_history_snapshot();
	var sel = window.getSelection();
	bxe_deleteEventKey(sel, false);
}

/*
 * Shorthand way to get CSS Range for the current selection. This range will be marked
 * ie/ it can easily be restored.
 *
 * POST04: 
 * - consider not calculating textpointers here (createCSSTextRange) but only within the
 *   editing functions in eDOM where the context can be given more precisely.
 * - allow text selection to only begin and end on word boundaries (part of CSSTextRange 
 * selection methods)
 * - consider moving into Selection (bad for XUL/XML?)
 * - account for empty editable area (maybe in isContentEditable); account for selection
 * type ie/ element or object or text.
 */
Selection.prototype.getEditableRange = function()
{	
	try 
	{
		var selr = window.getSelection().getRangeAt(0);
		var commonAncestor = selr.commonAncestorContainer;

		if(!commonAncestor.parentElement.userModifiable) {
			return null;
		}
		var cec = commonAncestor.parentElement.userModifiableContext;
		var cssr = documentCreateCSSTextRange(selr.cloneRange(), cec);
		return cssr;
	}
	catch(e)
	{
		return null;
	}
}

Selection.prototype.getXMLFragment = function() {
	
	var docfrag = bxe_config.xmldoc.createDocumentFragment();
	this.fixFocus();
	if (this.anchorNode != this.focusNode) {
		var xmlnode = bxe_getXMLNodeByHTMLNodeRecursive(this.anchorNode.parentNode);
		if (xmlnode.betterNormalize) {
			xmlnode.betterNormalize();
		
		}
		var _position = bxe_getChildPosition(this.anchorNode);
			
		var textNode = xmlnode.childNodes[_position];
		var endxmlnode = bxe_getXMLNodeByHTMLNode(this.focusNode.parentNode);
		endxmlnode.betterNormalize();
		var _endposition = bxe_getChildPosition(this.focusNode);
		var endtextNode = endxmlnode.childNodes[_endposition ];
		//endtextNode.splitText(this.focusOffset);
		
		var rng = bxe_config.xmldoc.createRange();
		rng.setStart(textNode,this.anchorOffset);
		rng.setEnd(endtextNode,this.focusOffset);
		
		return rng;
		
	} else {
		return this.getEditableRange();
	}
	
}

/*
 * Restore the range
 */
Selection.prototype.selectEditableRange = function(cssr)
{
	if (cssr) {
	//TESTME: I'm not sure about the sideeffects of just leaving restoreTextBoundaries out for some
	// special cases. See http://cvs.wyona.org/cgi-bin/bugzilla/show_bug.cgi?id=1185 for the actual test case
	if (!(cssr.startContainer.nodeType == 3 && cssr.startContainer.data.length == cssr.startOffset && cssr.collapsed == true)) {
		cssr.__restoreTextBoundaries(); // POST04: required cause of line manip that effects range but makes rest more complex
	}
	this.removeAllRanges();
	this.addRange(cssr.cloneRange());
	}	
}

Selection.prototype.fixFocus = function() {
	if ((!this.isCollapsed && this.focusNode.nodeType == 3 && this.focusNode.compareDocumentPosition(this.anchorNode) & 4) ||
			(this.focusNode == this.anchorNode && this.focusOffset < this.anchorOffset) ) {
			var n = this.anchorNode;
			var o = this.anchorOffset;
			this.collapse(this.focusNode, this.focusOffset)
			this.extend(n,o);
		}
}
