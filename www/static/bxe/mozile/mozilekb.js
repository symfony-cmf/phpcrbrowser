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

// $Id: mozilekb.js 1806 2007-11-26 16:18:05Z chregu $

/* 
 * mozilekb V0.46
 * 
 * Keyboard handling for Mozile. You can replace this if you want different keyboard
 * behaviors.
 *
 * POST04:
 * - reimplement ip use: reuse ip whereever possible. Big performance gain.
 * - support keyboard shortcuts for navigation and style settings
 * - consider xbl equivalent
 * - make sure event handlers aren't loaded twice: if user includes script twice, should
 * not register handlers twice (spotted by Chris McCormick)
 * - see if can move to using DOM events and away from Window.getSelection() if possible 
 * (effects how generic it can be!)
 * - selection model: word, line etc. Write custom handlers of clicks and use new Range
 * expansion methods
 */

/*
 * Handle key presses
 *
 * POST04:
 * - IP isn't recreated everytime with its own text pointer; text pointer isn't (in Range
 * create) set up for every key press.
 * - need up and down arrows to be implemented here too (via eDOM!): that way, no problem with
 * not deselecting toolbar at right time
 * - add in support for typical editing shortcuts based on use of ctrl key or tabs; can synthesize events to
 * force selection. http://www.mozilla.org/docs/end-user/moz_shortcuts.html and ctrl-v seems to effect caret mode?
 * - arrow keys: mode concept where if in text mode then only traverse text AND do not traverse objects. If
 * mixed mode, then select objects too.
 * - each editable area gets a CP? If valid (add method that checks TextNode validity?)
 */
bxe_registerKeyHandlers();
   
function keyPressHandler(event)
{	
	var handled = false;
//Mac OSX standard is using the "Apple"-Key for Copy/Paste operation and not the Ctrl-Key
// the Apple Key is event.metaKey in JS Terms
	if(event.ctrlKey || event.metaKey)
		handled = ctrlKeyPressHandler(event);
	else
		handled = nonctrlKeyPressHandler(event);

	// handled event so do let things go any further.
	if(handled)
	{
		//cancel event: TODO02: why all three?
		event.stopPropagation();
		event.returnValue = false;
  		event.preventDefault();
  		return false;
	}
	return true;
}
/*
function keyDownHandler(event)
{	
	var handled = false;
//Mac OSX standard is using the "Apple"-Key for Copy/Paste operation and not the Ctrl-Key
// the Apple Key is event.metaKey in JS Terms
	if(event.ctrlKey || event.metaKey)
		handled = ctrlKeyDownHandler(event);

	// handled event so do let things go any further.
	if(handled)
	{
		//cancel event: TODO02: why all three?
		event.stopPropagation();
		event.returnValue = false;
  		event.preventDefault();
  		return false;
	}
	return true;
}

function keyUpHandler(event)
{	
	var handled = false;
//Mac OSX standard is using the "Apple"-Key for Copy/Paste operation and not the Ctrl-Key
// the Apple Key is event.metaKey in JS Terms
	if(event.ctrlKey || event.metaKey)
		handled = ctrlKeyUpHandler(event);

	// handled event so do let things go any further.
	if(handled)
	{
		//cancel event: TODO02: why all three?
		event.stopPropagation();
		event.returnValue = false;
  		event.preventDefault();
  		return false;
	}
	return true;
}
*/
function ctrlKeyPressHandler(event)
{
	var cssr;
	if(!event.charCode)
		return false;

	if(String.fromCharCode(event.charCode).toLowerCase() == "v")
	{
		//don't handle it, if we're in a textarea
		if (event.target.localName == "TEXTAREA") {
			return false;
		}
		return window.getSelection().paste(true);
		
	} else if(String.fromCharCode(event.charCode) == "T") {
		bxe_Transform();
		return true;
	}
	else if(String.fromCharCode(event.charCode) == " " || String.fromCharCode(event.charCode) == "b")
	{
		if (BxeClipboardPasteDialog) {
			BxeTextClipboard_OpenDialog(event);
			return true;
		}
	}
	else if(String.fromCharCode(event.charCode).toLowerCase() == "x")
	{
		//don't handle it, if we're in a textarea
		if (event.target.localName == "TEXTAREA") {
			return false;
		}
		return window.getSelection().cut(true);
		/*if (mozilla.__allowedNativeCalls) {
			return window.getSelection().cut();
		} else {
			return false;
		}*/
	}
	else if(String.fromCharCode(event.charCode) == "c")
	{
		//don't handle it, if we're in a textarea
		if (event.target.localName == "TEXTAREA") {
			return false;
		}
			return window.getSelection().copy(true);
		/*if (mozilla.__allowedNativeCalls) {
			return window.getSelection().copy();
			else {
			return false;
		}*/
	}
	
	else if(String.fromCharCode(event.charCode) == "C")
	{
	  var sel = window.getSelection();
	  sel.collapse(document.body.firstChild, 0);
	  return true;
	}
	else if(String.fromCharCode(event.charCode).toLowerCase() == "s")
	{
		eDOMEventCall("DocumentSave",document);
		return true;
	}
	else if(String.fromCharCode(event.charCode)==  "z")
	{
		bxe_history_undo();
		return true;
	} else if(String.fromCharCode(event.charCode)==  "y")
	{
		bxe_history_redo();
		return true;
	}
	
	return false;
}

/*
function ctrlKeyDownHandler(event,cssr) {
	
	if(!event.keyCode)
		return false;
	
	if(String.fromCharCode(event.keyCode).toLowerCase() == "v")
	{
		//don't handle it, if we're in a textarea
		if (event.target.localName == "TEXTAREA" && event.target.id != 'hiddenform') {
			return false;
		}		
		if (!mozilla.__allowedNativeCalls) {
			window.getSelection().pasteKeyDown();
			return true;
		}
		return false;
	}
	if(String.fromCharCode(event.keyCode).toLowerCase() == "c")
	{
		//don't handle it, if we're in a textarea
		if (event.target.localName == "TEXTAREA" && event.target.id != 'hiddenform') {
			return false;
		}
		if (!mozilla.__allowedNativeCalls) {
			window.getSelection().copyKeyDown();
			return true;
		}
		return false;
	}
	
	// cut doesn't work yet
	
	if(String.fromCharCode(event.keyCode).toLowerCase() == "x")
	{
		if (!mozilla.__allowedNativeCalls) {
			window.getSelection().copyKeyDown();
			return true;
		}
		return false;
	}
	return false;
}

function ctrlKeyUpHandler(event,cssr) {
	
	if(!event.keyCode)
		return false;
	
	if(String.fromCharCode(event.keyCode).toLowerCase() == "v")
	{
		//don't handle it, if we're in a textarea
		if (event.target.localName == "TEXTAREA" && event.target.id != 'hiddenform') {
			return false;
		}
		if (!mozilla.__allowedNativeCalls) {
			window.getSelection().pasteKeyUp();
			return true;
		}
		return false;
	}
	if(String.fromCharCode(event.keyCode).toLowerCase() == "c")
	{
		//don't handle it, if we're in a textarea
		if (event.target.localName == "TEXTAREA" && event.target.id != 'hiddenform') {
			return false;
		}
		if (!mozilla.__allowedNativeCalls) {
			window.getSelection().copyKeyUp();
			return true;
		}
		return false;
	}
	//cut doesn't work yet, 'cause we can't cut from html-selections, just from forms
	if(String.fromCharCode(event.keyCode).toLowerCase() == "x")
	{
		if (!mozilla.__allowedNativeCalls) {
			window.getSelection().copyKeyUp();
			window.getSelection().cut();
			return true;
		}
		return false;
	}
	return false;
}
*/
/**
 * POST04: 
 * - carefully move selectEditableRange in here
 * - distinguish editable range of deleteOne at start of line and deleteOne
 * on same line [need to stop merge but allow character deletion]. Perhaps
 * need to change eDOM granularity.
 */
function nonctrlKeyPressHandler(event)
{

	var sel = window.getSelection();
	var ip;
	var cssr;
	var rng;
	
	//don't handle it, if we're in a textarea
	if (event.target.localName == "TEXTAREA") {
		return false;
	}
	// BACKSPACE AND DELETE (DOM_VK_BACK_SPACE, DOM_VK_DELETE)
	if((event.keyCode == 8) || (event.keyCode == 46)) {
		try {
			
		return bxe_deleteEventKey(sel,(event.keyCode == 46));
		} catch (e) {
			bxe_dump(e + "\n");
			return true;
		}
	}

	
	// PREV (event.DOM_VK_LEFT) Required as Moz left/right doesn't handle white space properly
	if(event.keyCode == 37 && !event.shiftKey)
	{
		cssr = sel.getEditableRange();
		if(!cssr)
		{
			return false;
		}

		if(!cssr.collapsed)
			cssr.collapse(true);

		ip = documentCreateInsertionPoint(cssr.top, cssr.startContainer, cssr.startOffset);
		ip.backOne();
		cssr.selectInsertionPoint(ip);
		sel.removeAllRanges();
		rng = cssr.cloneRange();
		sel.addRange(rng);
		bxe_delayedUpdateXPath();
		return true;
		
	}

	// NEXT (event.DOM_VK_RIGHT) Required as Moz left/right doesn't handle white space properly
	if(event.keyCode == 39 && !event.shiftKey)
	{	
		cssr = sel.getEditableRange();
		if(!cssr)
		{
			return false;
		}

		if(!cssr.collapsed)
			cssr.collapse(false);

		var caretTop = cssr.top;

		ip = documentCreateInsertionPoint(caretTop, cssr.startContainer, cssr.startOffset);
	
		ip.forwardOne();
		
		cssr.setEnd(ip.ipNode, ip.ipOffset);
		cssr.collapse(false);

		sel.removeAllRanges();
		rng = cssr.cloneRange();
		sel.addRange(rng);

		bxe_delayedUpdateXPath();
		return true;
	}

	// UP/DOWN (event.DOM_VK_UP/DOWN)
	if (event.keyCode == 38 || event.keyCode == 40) {
		bxe_delayedUpdateXPath();
		return false;
	}
	// RETURN OR ENTER (event.DOM_VK_ENTER DOM_VK_RETURN)
	if(event.keyCode == 13)
	{
		cssr = sel.getEditableRange();
		if(!cssr)
		{
			return false;
		}
		if (!cssr.startContainer.parentNode.XMLNode || cssr.startContainer.parentNode.XMLNode.vdom.bxeNoteditable) {
			return false;
		}
		var lala = cssr.startContainer.parentNode.XMLNode;
		if (lala.vdom.bxeNextelement) {
			if(!cssr.collapsed)
			{ // POST04: delete text when write over it!	
				bxe_deleteWholeSelection(sel,false);
			}
			sel.removeAllRanges();
			ip = documentCreateInsertionPoint(cssr.top, cssr.startContainer, cssr.startOffset);
			
			// POST04: support concept of not splitting line if mozUserModify indicates writeText ...
			if (cssr.top._SourceMode) {
				ip.insertCharacter(10);
			}
			else {
				td = false;
				var _con = ip.line.container;
				if (_con == ip.line.tableCellAncestor) {
					td = true
				}  
				var _par = ip.ipNode.parentNode;
				//FIXME make soft breaks configurable
				if (  event.shiftKey) {
					if (_par.XMLNode.isAllowedChild(XHTMLNS,"br")) {
						var secondTextNode = ip.ipNode.splitText(ip.ipOffset);
						ip.ipNode.parentNode.insertBefore(documentCreateXHTMLElement("br"), secondTextNode);
						ip.forwardOne();
						_par.updateXMLNode();
					}
				}
				else {
					//only split if bxeNextelement is set
					var z = 0;
					var textNode = cssr.startContainer;
					while (textNode) {
						textNode = textNode.previousSibling;
						z++;
					}
					textNode = lala._node.childNodes[z-1];
					
					//we're at the end of the line
					if (textNode.data.replace(/[\s\n\t\r]*$/,"").length <= cssr.startOffset) {
						if (lala.vdom.bxeNextelement) {
						eDOMEventCall("appendNode",document,{"appendToNode": lala, "localName":lala.vdom.bxeNextelement, "namespaceURI":lala.vdom.bxeNextelementNS});// ,"namespaceURI":widget.InsertNamespaceURI})
						}
						// useless for now, bt maybe needed again later
						// FIXME: check, if allowed :)
						else {
						eDOMEventCall("appendNode",document,{"appendToNode": lala, "localName":lala.localName, "namespaceURI":lala.namespaceURI});// ,"namespaceURI":widget.InsertNamespaceURI})
						}
					}
					else {
						//FIXME: check if allowed
						textNode.splitText(cssr.startOffset);
						lala._node.split(z);
						lala._node.nextSibling.removeAttribute("__bxe_id");
						var _id = lala._node.nextSibling.setBxeId();
						/** doesn't work the if here... **/
						
						bxe_Transform(_id,0,lala.parentNode);
					}
					
				}
				bxe_history_snapshot_async();
			}
			bxe_delayedUpdateXPath();
		}
		return true;
	}

	// POST04: for non-pre, may change to mean switch to next editable area
	if(event.keyCode == event.DOM_VK_TAB)
	{
		cssr = sel.getEditableRange();
		if(!cssr)
		{
			return false;
		}

		
		bxe_goToNextNode(cssr,event.shiftKey);
		//ip.insertCharacter(CHARCODE_SPACE); // POST05: may change to insert a set of spaces
		
		return true;
	}
	if(event.keyCode == event.DOM_VK_HOME) {
		var cssr = sel.getEditableRange();
		if(!cssr )
		{
			return false;
		}
		var startip = cssr.lines[0].firstInsertionPoint;
		sel.collapse(startip.ipNode, startip.ipOffset); 	
		return true;
	}
	if (event.keyCode == event.DOM_VK_END) {
		var cssr = sel.getEditableRange();
		if(!cssr )
		{
			return false;
		}
		var endip = cssr.lines[0].lastInsertionPoint; 
		sel.collapse(endip.ipNode, endip.ipOffset); 	
		return true;
	}
	
	// ALPHANUM
	if(event.charCode)
	{
		cssr = sel.getRangeAt(0);
		if(!cssr)
		{
			return false;
		}
		
		var par = cssr.startContainer.parentNode;
			
		// if there's a selection then delete it
		if(!cssr.collapsed)
		{
			//if !collapsed, get the editable Range, it has a saner check, the getRangeAt(0) does not always work
			bxe_deleteEventKey(sel,false,false,true);
			sel = window.getSelection();
			//sel.selectEditableRange(cssr);
			
			try {
			cssr = sel.getRangeAt(0);
			var _node = sel.anchorNode.parentNode;
			if (_node.getAttribute("__bxe_defaultcontent") == "true") {
				_node.removeAttribute("__bxe_defaultcontent");
				_node.firstChild.nodeValue = " ";
				_node.XMLNode._node.firstChild.nodeValue = " ";
				_node.XMLNode._node.removeAttribute("__bxe_defaultcontent");
				
				sel = window.getSelection();
				
				sel.collapse(_node.firstChild,0);
				cssr = sel.getRangeAt(0);
				par = cssr.startContainer.parentNode;
				
			}
			par = cssr.startContainer.parentNode;
			} catch(e) {
			}

		}
		
		var lala = bxe_getXMLNodeByHTMLNodeRecursive(par);
		if (!lala.XMLNode.canHaveText) {
			return false;
		}
		var startC = cssr.startContainer;
		
		var startOff = cssr.startOffset;
		if (startC.nodeType == 1 && startC.firstChild.nodeType == 3) {
			startC = startC.firstChild;
			startOff = 0;
		}
		var _ch = String.fromCharCode(event.charCode);
		if(startOff > 0) {
			if (startC.substringData && startC.substringData(startOff-1,1) == STRING_NBSP) {
				startC.replaceData(startOff-1,1," ");
			}
		}
		//FIXME, not sure, if that works correctly...
		if (event.charCode  == CHARCODE_SPACE ) {
			startC.insertData(startOff, STRING_NBSP);
		} else  {
			startC.insertData(startOff, _ch);
		}
		sel.collapse(startC,startOff+1);
		if (lala.nodeType == 2 ) {
			
			lala.value =  par.getContent();
		} else {
			//var lala = par.XMLNode._node; 
			var _position = bxe_getChildPosition(startC);
			var textNode = lala.childNodes[_position];
			if (!textNode) {
				return false;
			}
			try {
				textNode.insertData(startOff , _ch);
			} catch (e) {
				//try again with normalized
				try {
					textNode.parentNode.betterNormalize();
					textNode.insertData(startOff , _ch);
				} catch (e) {
				}
				
			}
			//textNode._childPosition = _position;
		}
		
		return true;
	}

	return false;
}

function bxe_deleteWholeSelection(sel,backspace) {
	bxe_history_snapshot();
	var n = sel.focusNode;
	var o = sel.focusOffset;
	sel.collapse(sel.anchorNode,1)
	try {
		sel.extend(n,o);
		sel.deleteSelection(backspace);
	} catch (e) {
	}
//	sel.anchorNode.parentNode.updateXMLNode();
}

function bxe_deleteEventKey(sel, backspace, noTransform,makeDefault) {
	if (sel.isCollapsed) {
		sel.deleteSelection(backspace);
		return true;
	}
	
	//switch focus and anchor, if focus is before anchor
	
	sel.fixFocus();
	if (sel.anchorOffset >= sel.anchorNode.nodeValue.strip().length) {
		var _pos = sel.focusOffset;
		sel.collapse(sel.focusNode,0);
		sel.extend(sel.focusNode,_pos);
		
	}
	if (sel.anchorNode.nodeType == 3 && sel.anchorOffset == 0) {
		// if only one textnode and fully selected
		
		if (sel.anchorNode == sel.focusNode) {
			
			if (sel.focusOffset >= sel.anchorNode.nodeValue.strip().length) {
				
				var xmlnode = bxe_getXMLNodeByHTMLNodeRecursive(sel.anchorNode);
				//xmlnode.parentNode.appendChild(xmlnode.ownerDocument.createTextNode(" "));
				var _par = bxe_getXMLNodeByHTMLNodeRecursive(sel.anchorNode.parentNode);
				if (_par) {
					if (_par.nodeType == 2) {
						if (_par.XMLNode.vdom && _par.XMLNode.vdom.bxeDefaultcontent) {
							_par.nodeValue = _par.XMLNode.vdom.bxeDefaultcontent;
						} else {
							_par.nodeValue = "#";
							
						}
						//sel.anchorNode.nodeValue = _par.nodeValue;
						//_par.XMLNode.makeDefaultNodes();
					} else {
						if (_par.childNodes.length == 1) {
							_par.removeChild(_par.firstChild);
							bxe_checkEmpty(_par.XMLNode,makeDefault);
						} else if (_par.childNodes.length == 0) {
							bxe_checkEmpty(_par.XMLNode,makeDefault);
						} else {
							_par.replaceChild(_par.ownerDocument.createTextNode(" "),xmlnode);
							bxe_checkEmptyParent(_par.XMLNode);
						}
					}
					
					
				} else {
					bxe_deleteWholeSelection(sel,backspace);
					sel = window.getSelection();
					sel.deleteSelection(false);
				}
			} else {
				bxe_history_snapshot();
				sel.deleteSelection(backspace);
				
			}
		} else  {
			var xmlnode = bxe_getXMLNodeByHTMLNode(sel.anchorNode);
			var _par = xmlnode.parentNode;
			
			sel = window.getSelection();
			bxe_deleteWholeSelection(sel,backspace);
			sel.deleteSelection(false,true);
			try {
				if (_par.childNodes.length == 1 && _par.firstChild.nodeValue.strip().length == 0) {
					_par.removeChild(_par.firstChild);
					bxe_checkEmpty(_par.XMLNode,makeDefault);
				}
			} catch(e) {
			}
			
		}
		bxe_Transform();
		
	} else {
		bxe_history_snapshot();
		sel.deleteSelection(backspace);
		
		if (!noTransform) {
			//	bxe_Transform();
		}
		
	}
	return true;
}

function bxe_goToNextNode(cssr,shift) {
	if (cssr.startContainer.nodeType == 1) {
		var node = cssr.startContainer.firstChild;
	} else {
		var node = cssr.startContainer;
	}
	var walker = document.createTreeWalker(
	document.documentElement, NodeFilter.SHOW_TEXT,
	null, 
	true);
	
	walker.currentNode = node;
	
	if (shift) {
		node =   walker.previousNode();
	} else {
		node =   walker.nextNode();
	}
	var sel=window.getSelection();
	do {
		var par = node.parentNode;
		if (par.userModifiable && par.XMLNode && ( par.XMLNode.canHaveText || par.hasAttribute("__bxe_attribute"))) {
			try {
				sel.collapse(node,0);
			} catch (e) {
				par.appendChild(par.ownerDocument.createTextNode(" "));
				sel.collapse(node,0);
			}
			bxe_updateXPath(node);
			return node;
			break;
		}
		if (shift) {
			node =   walker.previousNode();
		} else { 
			node =   walker.nextNode();
		}
	} while(node);
	
}
