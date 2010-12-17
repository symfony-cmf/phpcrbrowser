// +--------------------------------------------------------------------------+
// | BXE                                                                      |
// +--------------------------------------------------------------------------+
// | Copyright (c) 2003-2008 Liip AG                                          |
// +--------------------------------------------------------------------------+
// | Licensed under the Apache License, Version 2.0 (the "License");          |
// | you may not use this file except in compliance with the License.         |
// | You may obtain a copy of the License at                                  |
// |     http://www.apache.org/licenses/LICENSE-2.0                           |
// | Unless required by applicable law or agreed to in writing, software      |
// | distributed under the License is distributed on an "AS IS" BASIS,        |
// | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
// | See the License for the specific language governing permissions and      |
// | limitations under the License.                                           |
// +--------------------------------------------------------------------------+
// | Author: Christian Stocker <chregu@liip.ch>                            |
// +--------------------------------------------------------------------------+
//
// $Id: bxeFunctions.js 1852 2009-01-30 08:32:46Z chregu $

const BXENS = "http://bitfluxeditor.org/namespace";
const XMLNS = "http://www.w3.org/2000/xmlns/";

const E_FATAL = 1;

const BXE_SELECTION = 1;
const BXE_APPEND = 2;
const BXE_SPLIT_IF_INLINE = 1;

var bxe_snapshots = new Array();
var bxe_snapshots_position = 0;
var bxe_snapshots_last = 0;
const BXE_SNAPSHOT_LENGTH = 20;
function __bxeSave(e) {
    if (bxe_bug248172_check()) {
		alert (bxe_i18n.getText("THIS DOCUMENT COULD NOT BE SAVED!\n You are using a Mozilla release with a broken XMLSerializer implementation.\n Mozilla 1.7 and Firefox 0.9/0.9.1 are known to have this bug.\n Please up- or downgrade."));
		return false;
	}
console.log("METHOD"  + bxe_config.xmlfile_method);
	var td = new mozileTransportDriver(bxe_config.xmlfile_method);
	td.Docu = this;
	if (e.additionalInfo && e.additionalInfo.exit ) {
		td.Exit = e.additionalInfo.exit;
	} else {
		td.Exit = null;
	}
	
	if (e.additionalInfo && e.additionalInfo.reload ) {
		td.Reload = e.additionalInfo.reload;
	} else {
		td.Reload = null;
	}

	var xml = bxe_getXmlDomDocument(true);
	
	if (!xml) {
		alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"));
	}
	
	if ( bxe_config.options['onSaveBefore']) {
		 eval(bxe_config.options['onSaveBefore'] +"(xml,'onSaveBefore')");
	}
	bxe_status_bar.showMessage(bxe_i18n.getText("Document saving..."));
	var widg = mozilla.getWidgetModalBox(bxe_i18n.getText("Saving"));
	widg.addText(bxe_i18n.getText("Document saving..."));
	widg.show((window.innerWidth- 500)/2,50, "fixed");
	
	var xmlstr =xml.saveXML(xml);
	
	function callback (e) {
		
		
		if (e.isError) {
			var widg = mozilla.getWidgetModalBox(bxe_i18n.getText("Saving"));
			widg.addText(bxe_i18n.getText("Document couldn't be saved"));
			widg.addText(e.statusText,true);
			widg.show((window.innerWidth- 500)/2,50, "fixed");
			return;
		}
		bxe_lastSavedXML = bxe_getXmlDocument();
		bxe_status_bar.showMessage(bxe_i18n.getText("Document successfully saved"));
		var widg = mozilla.getWidgetModalBox();
	
		widg.submitAndClose();
		bxe_history_reset();
		if	(e.status == 201 && bxe_config.options['onSaveFileCreated']) {
			eval(bxe_config.options['onSaveFileCreated']);
			
		}
		
		if ( bxe_config.options['onSaveAfter']) {
			xml = bxe_getXmlDocument();
			eval(bxe_config.options['onSaveAfter'] +"(xml,'onSaveAfter')");
		}
		if (e.td.Reload) {
			document.location.reload();
		}
		if (e.td.Exit) {
			eDOMEventCall("Exit",document);
		}
	}
	var url = bxe_config.xmlfile;
	if (td.Exit) {
		url = bxe_addParamToUrl(url,"exit=true");
	} else {
		url = bxe_addParamToUrl(url,"exit=false");
	}
	td.save(url, xmlstr, callback);
}


function bxe_addParamToUrl(url, param) {
	if (url.indexOf("?") == -1) {
		url += "?" + param;
	} else {
		url += "&" + param;
	}
	return url;
}

function bench(func, string,iter) {
	
	
	var start = new Date();
	for (var i = 0; i< iter; i++) {
		func();
	}
	var end = new Date();
	

	debug (bxe_i18n.getText("Benchmark ") + string);
//	debug ("Start " + start.getTime());
//	debug ("End   " + end.getTime() );
	debug (bxe_i18n.getText("Total ") +(end-start) + " / " +  iter + " = " + (end-start)/iter); 
}

function bxe_bench() {
	
	bench(function() {xmlstr = bxe_getXmlDocument()}, "getXML", 2);
}

function bxe_history_snapshot_async()  {
	window.setTimeout("bxe_history_snapshot()",1);
}


function bxe_history_snapshot() {
	var xmlstr = bxe_getXmlDocument();
	if (!xmlstr) { return false;}
	bxe_snapshots_position++;
	bxe_snapshots_last = bxe_snapshots_position;
	bxe_snapshots[bxe_snapshots_position] = xmlstr;
	var i = bxe_snapshots_last + 1;
	while (bxe_snapshots[i]) {
		bxe_snapshots[i] = null;
		i++;
	}
	if (bxe_snapshots.length >  BXE_SNAPSHOT_LENGTH ) {
		var _temp = new Array();
		
		for (var i = bxe_snapshots_last; i >= bxe_snapshots_last - BXE_SNAPSHOT_LENGTH; i--) {
			_temp[i] = bxe_snapshots[i];
		}
		bxe_snapshots = _temp;
	}
	return (xmlstr);
}

function bxe_history_redo() {
	if (bxe_snapshots_position >= 0 && bxe_snapshots[( bxe_snapshots_position + 1)]) {
		var currXmlStr = bxe_getXmlDocument();
		if (!currXmlStr) { alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button")); return false;} 
		bxe_snapshots_position++;
		var xmlstr = bxe_snapshots[bxe_snapshots_position];
		if (currXmlStr == xmlstr && bxe_snapshots[bxe_snapshots_position + 1]) {
			bxe_snapshots_position++;
			var xmlstr = bxe_snapshots[bxe_snapshots_position];
		}
		var BX_parser = new DOMParser();
		
		var vdom = bxe_config.xmldoc.documentElement.XMLNode.vdom;
		bxe_config.xmldoc= BX_parser.parseFromString(xmlstr,"text/xml");
		bxe_config.xmldoc.init();
		bxe_config.xmldoc.documentElement.XMLNode.vdom = vdom;
		bxe_Transform();
		
	}
	
}

function bxe_history_reset() {
	bxe_snapshots = new Array();
	bxe_snapshots_position = 0;
	bxe_snapshots_last = 0;
	bxe_history_snapshot()
}

function bxe_history_undo() {
				
	if (bxe_snapshots_position >= 0) {
		if (bxe_snapshots_position == bxe_snapshots_last) {
			var currXmlStr = bxe_history_snapshot();
			bxe_snapshots_position--;
		} else {
			var currXmlStr = bxe_getXmlDocument();
		}
		
		if (!currXmlStr) { alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button")); return false;} 
		var xmlstr = bxe_snapshots[bxe_snapshots_position];
		if (xmlstr) {
			bxe_snapshots_position--;
			while(currXmlStr == xmlstr && bxe_snapshots[bxe_snapshots_position ] ) {
				xmlstr = bxe_snapshots[bxe_snapshots_position];
				bxe_snapshots_position--;
			}
		}
		
		if (bxe_snapshots_position < 0) {
			bxe_snapshots_position = 0;
			return false;
		}
		var BX_parser = new DOMParser();
		if (xmlstr) {
			var vdom = bxe_config.xmldoc.documentElement.XMLNode.vdom;
			bxe_config.xmldoc= BX_parser.parseFromString(xmlstr,"text/xml");
			bxe_config.xmldoc.init();
			bxe_config.xmldoc.documentElement.XMLNode.vdom = vdom;
			bxe_Transform();
		}
	} 

}

function bxe_getXmlDomDocument(clean) {
	
	if ( clean) {
		
		var doc = bxe_config.xmldoc.cloneNode(true);
		var res = doc.evaluate("//@__bxe_id", doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
		var _l = res.snapshotLength;
		for (var i = 0; i < _l; i++) {
			if (res.snapshotItem(i).ownerElement) {
				res.snapshotItem(i).ownerElement.removeAttributeNode(res.snapshotItem(i));
			}
			
		}
		
		var res = doc.evaluate("//@__bxe_invalid", doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
		var _l = res.snapshotLength;
		for (var i = 0; i < _l; i++) {
			if (res.snapshotItem(i).ownerElement) {
				res.snapshotItem(i).ownerElement.removeAttributeNode(res.snapshotItem(i));
			}
			
		}
		
		res = doc.evaluate("//@__bxe_defaultcontent", doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
		_l = res.snapshotLength;
		for (var i = 0; i < _l; i++) {
			var ownE = res.snapshotItem(i).ownerElement;
			if (ownE) {
				if (ownE.firstChild && ownE.firstChild.nodeValue == "#empty") {
					ownE.removeChild(ownE.firstChild);
				}
				res.snapshotItem(i).ownerElement.removeAttributeNode(res.snapshotItem(i));
			}
			
		}
		
		return doc;
	}
	
	return bxe_config.xmldoc;
}
	

function bxe_getXmlDocument(clean) {
	
	var xml = bxe_getXmlDomDocument(clean);
	if (!xml ) { return xml;}
	if (clean) {
		xml2 = xml.saveXML(xml);
		delete xml;
		return xml2;
	} else {
		return xml.saveXML(xml);
	}

}

function bxe_getRelaxNGDocument() {
	
	//var areaNodes = bxe_getAllEditableAreas();
	var xml = bxe_config.DocumentVDOM.xmldoc;
	return xml.saveXML(xml);
}



/* Mode toggles */

function bxe_toggleTagMode(e) {
	try {
	var editableArea = e.target;
	if (editableArea._SourceMode) {
			e = new eDOMEvent();
			e.setTarget(editableArea);
			e.initEvent("toggleSourceMode");
	}
	var xmldoc = document.implementation.createDocument("","",null);
	
	if (!editableArea._TagMode) {
		createTagNameAttributes(editableArea);
		editableArea._TagMode = true;
		editableArea.AreaInfo.TagModeMenu.Checked = true;
		editableArea.AreaInfo.NormalModeMenu.Checked = false;
	} else {
		var walker = document.createTreeWalker(
			editableArea, NodeFilter.SHOW_ELEMENT,
			null, 
			true);
		var node = editableArea;
		
		do {
			if (node.hasChildNodes()) {
				node.removeAttribute("_edom_tagnameopen");
			}
			node.removeAttribute("_edom_tagnameclose");
			node =   walker.nextNode() 
		} while(node)
		editableArea._TagMode = false;
		editableArea.AreaInfo.TagModeMenu.Checked = false;
		editableArea.AreaInfo.NormalModeMenu.Checked = true;
	}
	}
	catch(e) {alert(e);}

}

function bxe_toggleNormalMode (e) {
	try {
	var editableArea = e.target;
	if (editableArea._SourceMode) {
			e = new eDOMEvent();
			e.setTarget(editableArea);
			e.initEvent("toggleSourceMode");
	}
	if (editableArea._TagMode) {
			e = new eDOMEvent();
			e.setTarget(editableArea);
			e.initEvent("toggleTagMode");
	}
	editableArea.AreaInfo.NormalModeMenu.Checked = true;
	}
	catch(e) {alert(e);}

}

function addTagnames_bxe (e) {		
	
	e.currentTarget.removeEventListener("DOMAttrModified",addTagnames_bxe,false);
	
	var nodeTarget = e.target; 
try {
	createTagNameAttributes(nodeTarget.parentNode.parentNode);
} catch (e) {bxe_catch_alert(e);}
	e.currentTarget.addEventListener("DOMAttrModified",addTagnames_bxe,false);
	
}

function createTagNameAttributes(startNode, startHere) {
	var walker = startNode.XMLNode.createTreeWalker();
	if (!startHere) {
		var node = walker.nextNode();
	} else {
		var node = walker.currentNode;
	}
	
	while( node) {
		if (node.nodeType == 1) {
			var xmlstring = node.getBeforeAndAfterString(false,true);
			node._node.setAttribute("_edom_tagnameopen",xmlstring[0]);
			if (xmlstring[1]) {
				node._node.setAttribute("_edom_tagnameclose",xmlstring[1]);
			}
		}
		node = walker.nextNode();
	}
}

function bxe_toggleAllToSourceMode() {
	var nodes = bxe_getAllEditableAreas();
	for (var i = 0; i < nodes.length; i++) {
		var e = new Object();
		e.target =  nodes[i];
		bxe_toggleSourceMode(e);
	}
	
}

function bxe_toggleSourceMode(e) {
	try {
	var editableArea = e.target;

	if (editableArea._TagMode) {
			e = new eDOMEvent();
			e.setTarget(editableArea);
			e.initEvent("toggleTagMode");
	}
	if (!editableArea._SourceMode) {
		var xmldoc = editableArea.convertToXMLDocFrag();
		
		var form = document.createElement("textarea");
		//some stuff could go into a css file
		form.setAttribute("name","sourceArea");
		form.setAttribute("wrap","soft");
		form.style.backgroundColor = "rgb(255,255,200)";
		form.style.border = "0px";
		form.style.height = editableArea.getCStyle("height");
		form.style.width = editableArea.getCStyle("width");

		editableArea.removeAllChildren();
		
		var xmlstr = document.saveChildrenXML(xmldoc,true);
		form.value = xmlstr.str;
		
		var breaks = form.value.match(/[\n\r]/g);
		if (breaks) {
			breaks = breaks.length;
			form.style.minHeight = ((breaks + 1) * 13) + "px";
		}
		
		editableArea.appendChild(form)
		form.focus();
		//editableArea.appendChild(document.createTextNode(xmlstr.str));
		editableArea.XMLNode.prefix = xmlstr.rootPrefix;
		editableArea._SourceMode = true;
		editableArea.AreaInfo.SourceModeMenu.Checked = true;
		editableArea.AreaInfo.NormalModeMenu.Checked = false;
		bxe_updateXPath(editableArea);
		
	} else {
		var rootNodeName = editableArea.XMLNode.localName;
		if (editableArea.XMLNode.prefix != null) {
			rootNodeName = editableArea.XMLNode.prefix +":"+rootNodeName;
		}
		var innerHTML = '<'+rootNodeName;
		ns = editableArea.XMLNode.xmlBridge.getNamespaceDefinitions();
		for (var i in ns ) {
			if  (i == "xmlns") {
				innerHTML += ' xmlns="'+ ns[i] + '"';
			} else {
				innerHTML += ' xmlns:' + i + '="' + ns[i] +'"';
			}
		}
		
		innerHTML += '>'+editableArea.firstChild.value +'</'+rootNodeName +'>';
		
		var innerhtmlValue = documentLoadXML( innerHTML);
		if (innerhtmlValue) {
			editableArea.XMLNode._node = editableArea.XMLNode.xmlBridge;
			
			editableArea.XMLNode.removeAllChildren();
			editableArea.XMLNode._node.removeAllChildren();
			
			editableArea.XMLNode._node.appendAllChildren(innerhtmlValue.firstChild);

			
			
			editableArea._SourceMode = false;
			//preserve vdom...
			var eaVDOM = editableArea.XMLNode._vdom;
			editableArea.XMLNode = editableArea.XMLNode._node.ownerDocument.init(editableArea.XMLNode._node);
			editableArea.XMLNode.vdom = eaVDOM;

			editableArea.removeAllChildren();

			editableArea.setStyle("white-space",null);
			var xmlnode = editableArea.XMLNode._node;
			
			editableArea.XMLNode.insertIntoHTMLDocument(editableArea,true);
			editableArea.XMLNode.xmlBridge = xmlnode;
			
			editableArea.AreaInfo.SourceModeMenu.Checked = false;
			editableArea.AreaInfo.NormalModeMenu.Checked = true;
			/*normalize namesapces */
			if (editableArea.XMLNode.xmlBridge.parentNode.nodeType == 1) {
				nsparent = editableArea.XMLNode.xmlBridge.parentNode.getNamespaceDefinitions();
				for (var prefix in nsparent) {
					if (nsparent[prefix] == ns[prefix]) {
						xmlnode.removeAttributeNS(XMLNS,prefix);
					}
				}
			}
			var valid = editableArea.XMLNode.isNodeValid(true);
			if ( ! valid) {
				bxe_toggleSourceMode(e);
			}
			bxe_updateXPath(editableArea);
			
		}
	}
	}
	catch (e) {bxe_catch_alert(e);}

}

function bxe_toggleTextClass(e) {
	var sel = window.getSelection();
	var cssr = sel.getEditableRange();
	if (typeof e.additionalInfo.namespaceURI == "undefined") {
		e.additionalInfo.namespaceURI = "";
	}
	if (bxe_checkForSourceMode(sel)) {
		alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"));
		return false;
	}
	//search, if we are already in this mode for anchorNode
	var node = sel.anchorNode.parentNode.XMLNode;
	
	while (node) {
		if (node.localName == e.additionalInfo.localName && node.namespaceURI == e.additionalInfo.namespaceURI) {
			return bxe_CleanInlineIntern(e.additionalInfo.localName,e.additionalInfo.namespaceURI);
		}
		node = node.parentNode;
	}
	
	
	if (sel.isCollapsed) {
			var newNode = new XMLNodeElement(e.additionalInfo.namespaceURI,e.additionalInfo.localName, 1 , true) ;
		
			sel.insertNode(newNode._node);
			newNode.makeDefaultNodes(false);
			if (newNode._node.firstChild) {
				var sel = window.getSelection();
				var startip = newNode._node.firstInsertionPoint();
				var lastip = newNode._node.lastInsertionPoint();
				sel.collapse(startip.ipNode, startip.ipOffset);
				sel.extend(lastip.ipNode, lastip.ipOffset);
				
			}
	} else {
		sel.fixFocus();		
		
		if (sel.anchorNode != sel.focusNode) {
			var anchorLength = sel.anchorNode.nodeValue.length - sel.anchorOffset;
			var focusLength = sel.focusNode.nodeValue.length - sel.focusOffset;
			if (anchorLength > focusLength) {
				sel.extend(sel.anchorNode,sel.anchorNode.nodeValue.length);
			} else {
				var _o = sel.focusOffset;
				sel.collapse(sel.focusNode,0);
				sel.extend(sel.focusNode,_o)
			}
		
		}
		sel.anchorNode.parentNode.normalize();
		var _node = bxe_config.xmldoc.createElementNS(e.additionalInfo.namespaceURI,e.additionalInfo.localName);
		var xmlnode = bxe_getXMLNodeByHTMLNode(sel.anchorNode.parentNode);
		xmlnode.betterNormalize();
		var _position = bxe_getChildPosition(sel.anchorNode);
		xmlnode.childNodes[_position].splitText(sel.focusOffset);
		xmlnode.childNodes[_position].splitText(sel.anchorOffset);
		var textNode = xmlnode.childNodes[_position + 1];
		xmlnode.insertBefore(_node, textNode);
		_node.appendChild(textNode);
		
		var id = _node.setBxeId();
		_node.XMLNode = _node.getXMLNode();
		_node.parentNode.XMLNode.isNodeValid(true,2);
		
		if(!(_node.XMLNode.makeDefaultNodes(true))) {
			bxe_Transform(id,"select",_node.parentNode.XMLNode);
			
		}
		
		//sel.toggleTextClass(e.additionalInfo.localName,e.additionalInfo.namespaceURI);
	}
	sel = window.getSelection();
	cssr = sel.getEditableRange();
	
//	var _node = cssr.updateXMLNodes();
	debug("isValid?" + _node.XMLNode.isNodeValid());
	bxe_history_snapshot_async();
}


function bxe_NodeInsertedParent(e) {
//	alert("document wide");
	var oldNode = e.target.XMLNode;
	var parent = e.additionalInfo;
	
	parent.XMLNode =  bxe_XMLNodeInit(parent);
	parent.XMLNode.previousSibling = oldNode.previousSibling;
	parent.XMLNode.nextSibling = oldNode.nextSibling;
	if (parent.XMLNode.previousSibling) {
		parent.XMLNode.previousSibling.nextSibling = parent.XMLNode;
	} 
	if (parent.XMLNode.nextSibling) {
		parent.XMLNode.nextSibling.previousSibling = parent.XMLNode;
	}
	parent.XMLNode.firstChild = oldNode;
	parent.XMLNode.lastChild = oldNode;
	parent.XMLNode.parentNode = oldNode.parentNode;
	oldNode.parentNode = parent.XMLNode;
	oldNode.previousSibling = null;
	oldNode.nextSibling = null;
	
}

function bxe_NodeRemovedChild (e) {
	var parent = e.target.XMLNode;
	var oldNode  = e.additionalInfo.XMLNode;
	oldNode.unlink();
}

function bxe_NodeBeforeDelete (e) {
	var node = e.target.XMLNode;
	node.unlink();
}

function bxe_NodePositionChanged(e) {
	var node = e.target;
	node.updateXMLNode();
}
	

function bxe_NodeAppendedChild(e) {
	var parent = e.target.XMLNode;
	var newNode  = e.additionalInfo;
	if (newNode.nodeType == 11) {
		var child = newNode.firstChild;
		while (child) {
			this.appendChildIntern(child.XMLNode);
			child = child.nextSibling;
			
		}
	} else {
		newNode  = newNode.XMLNode;
		parent.appendChildIntern(newNode);
	}
	
}

function bxe_NodeRemovedChildOnly (e) {
	var parent = e.target.XMLNode;
	var oldNode  = e.additionalInfo.XMLNode;

	var div = oldNode.lastChild;
	if (oldNode.firstChild) {
		var child = oldNode.firstChild;
		while (child ) {
			child.parentNode = oldNode.parentNode;
			child = child.nextSibling;
		}
		oldNode.previousSibling.nextSibling = oldNode.firstChild;
		oldNode.nextSibling.previousSibling = oldNode.lastChild;
		oldNode.firstChild.previousSibling = oldNode.previousSibling;
		oldNode.lastChild.nextSibling = oldNode.nextSibling;
		
	} else {
		oldNode.previousSibling.nextSibling = old.nextSibling;
		oldNode.nextSibling.previousSibling = old.previousSibling;
	}
	if (parent.firstChild == oldNode) {
		parent.firstChild = oldNode.nextSibling;
	}
	if (parent.lastChild == oldNode) {
		parent.lastChild = oldNode.previousSibling;
	}
	//oldNode.unlink();

	
}
function bxe_ContextPopup(e) {
	
	try {
	var node = e.target.XMLNode;
	var popup = e.additionalInfo;
	
	//return on xmlBridge Root nodes
	if (node.xmlBridge) {
		return 
	}
	if (node._node.nodeType == Node.ATTRIBUTE_NODE) {
		node = node.parentNode;
	}

	if (node.vdom && node.vdom.hasAttributes && !popup.hasEditAttributes ) {
		var menui = popup.addMenuItem(bxe_i18n.getText("Edit {0} Attributes",new Array(node.vdom.bxeName)), mozilla.getWidgetGlobals().EditAttributes.popup);
		menui.MenuPopup._node = node._node;
		popup.hasEditAttributes = true;
	}
	if (node._node.firstChild && node._node.firstChild.nodeType == 3 && node._node.childNodes.length == 1) {
		var menui = popup.addMenuItem(bxe_i18n.getText("Edit text in popup"), function (e) {
			var mod = mozilla.getWidgetModalBox("Edit text here", function(values) {
				menui.MenuPopup.MainNode._node.firstChild.nodeValue = values.text;
				bxe_checkEmptyParent(menui.MenuPopup.MainNode);
				bxe_Transform();
			});
			var inputfield = mod.addItem("text", "", "textarea");
			if (node.firstChild) {
				inputfield.value = node.firstChild.nodeValue;
			}
			var _modBox = document.getElementById("modalBoxtext");
	
			mod.node.style.width = window.innerWidth - 150 + "px"; 
			_modBox.style.width = window.innerWidth - 250 + "px"; 
			
			mod.node.style.height = window.innerHeight - 110 + "px"; 
			_modBox.style.height= window.innerHeight - 190 + "px"; 
			
			
			mod.show(100,50,"fixed");
			_modBox.focus();
			
			
			
	    });
    }
	
	if (typeof BxeClipboardPasteDialog == 'function') {
		popup.addMenuItem(bxe_i18n.getText("Paste from Extern"), function (e) {
				var widget = e.currentTarget.Widget;
			BxeTextClipboard_OpenDialog(e,widget.MenuPopup.MainNode);
		});
	}
	
	if (node.canHaveText) {
		popup.addMenuItem(bxe_i18n.getText("Insert Default Content"), function (e) {
			var widget = e.currentTarget.Widget;
			widget.MenuPopup.MainNode.makeDefaultNodes();
			bxe_Transform(false,false,widget.MenuPopup.MainNode);
			
	    });
    }
	
	if (!node.vdom.bxeNoaddappenddelete) {
		popup.addMenuItem(bxe_i18n.getText("Copy {0} Element", new Array(node.vdom.bxeName)), function (e) {
			var widget = e.currentTarget.Widget;
			var delNode = widget.MenuPopup.MainNode;
			delNode.copy();
	    });
    }
    var tabletype = node.vdom.bxeTabletype;
        
	if (tabletype != "table-row" && tabletype != "table-cell"  && tabletype != "table-col" && !node.vdom.bxeNoaddappenddelete) {
	
        
		popup.addMenuItem(bxe_i18n.getText("Cut {0} Element", new Array(node.vdom.bxeName)), function (e) {
			var widget = e.currentTarget.Widget;
			var delNode = widget.MenuPopup.MainNode;
			delNode.cut();
	    });
    }
	
    var clip = mozilla.getClipboard();
	
	if (clip._clipboard) {
		var _clipboardNodeName = "";
		var _clipboardNamespaceUri = "";
		var _clipboardBxeName = "";
		var _textOnly  = "";
		if (clip._clipboard.firstChild && clip._clipboard.firstChild.nodeType == 1)  {
			_clipboardNodeName = clip._clipboard.firstChild.nodeName;
			_clipboardNamespaceUri = clip._clipboard.firstChild.namespaceURI;
		} else if (clip._clipboard.nodeType == 1) {
			_clipboardNodeName = clip._clipboard.nodeName;
			_clipboardNamespaceUri = XHTMLNS;
		}
		
		if (clip._clipboardRootName) {
			_clipboardBxeName = clip._clipboardRootName;
		} else {
			_clipboardBxeName = _clipboardNodeName;
		}
		
		if (!_clipboardNamespaceUri) { _clipboardNamespaceUri = ""};
		if (_clipboardNodeName && node.parentNode && node.parentNode.isAllowedChild(_clipboardNamespaceUri, _clipboardNodeName)) {
			popup.addMenuItem(bxe_i18n.getText("Append {0} from Clipboard",new Array(_clipboardBxeName)), function (e) {
				var widget = e.currentTarget.Widget;
				var appNode = widget.MenuPopup.MainNode;
				var clip = mozilla.getClipboard();
				var clipNode = clip.getData(MozClipboard.TEXT_FLAVOR);
				eDOMEventCall("appendNode",document,{"appendToNode":appNode, "node": clipNode})
				
			});
		} 
	}
    if (tabletype != "table-row" && tabletype != "table-cell"  && tabletype != "table-col" && !node.vdom.bxeNoaddappenddelete) {
		popup.addMenuItem(bxe_i18n.getText("Delete {0} Element",new Array(node.vdom.bxeName)), function (e) {
			var widget = e.currentTarget.Widget;
			var delNode = widget.MenuPopup.MainNode;
			var par = delNode.parentNode
			try {
				var _prev = delNode._htmlnode.previousSibling;
				var sel = window.getSelection();
				var _pos = 0;
				
				if (_prev) {
					_pos = _prev.nodeValue.length;
					sel.collapse(_prev,_pos);
				} else {
					sel.collapse(par._htmlnode.firstChild,0);
				}
			} catch(e) {
			}
			delNode.unlink();
			bxe_checkEmptyParent(par);
				
			if (par.parentNode) {
				bxe_Transform(false,false,par.parentNode);
			} else {
				bxe_Transform(false,false,par);
			}
		},bxe_i18n.getText("Deletes the Element and all its children"));
	}
	if (node.parentNode && node.parentNode.canHaveText) {
		popup.addMenuItem(bxe_i18n.getText("Clean "), function (e) {
			var widget = e.currentTarget.Widget;
			var delNode = widget.MenuPopup.MainNode;
			
			
			var par = delNode.parentNode;
			try {
				var _prev = delNode._htmlnode.previousSibling;
				var sel = window.getSelection();
				var _pos = 0;
				
				if (_prev) {
					_pos = _prev.nodeValue.length;
					sel.collapse(_prev,_pos);
				} else {
					sel.collapse(par._htmlnode.firstChild,0);
				}
			} catch(e) {
			}
			
			delNode._node.removeElementOnly();
			 
			par._node.betterNormalize();
			bxe_Transform(false,false,par);
		}, bxe_i18n.getText("Removes the Element, but not its children"));
	}

	var previousSibling = node.previousSibling;
	while (previousSibling && previousSibling.nodeType != 1) {
		previousSibling = previousSibling.previousSibling;
	}
	
	var nextSibling = node.nextSibling;
	while (nextSibling && nextSibling.nodeType != 1) {
		nextSibling = nextSibling.nextSibling;
	}
	if (! (node.vdom.bxeTabletype &&  node.vdom.bxeTabletype == "table-cell" || node.vdom.bxeTabletype == "table-col")) {
	
		bxe_doMoveUpDownMenu(node,popup,e,previousSibling, nextSibling, false);
	}
	
	if (node.vdom.bxeMenuentry) {
		popup.addSeparator();
		var _entries = node.vdom.bxeMenuentry;
		for (var i in _entries) {
			
			var n = popup.addMenuItem(_entries[i]['name'], function (e) {
				var widget = e.currentTarget.Widget;
				var appNode = widget.MenuPopup.MainNode;
				if (widget.bxeType && widget.bxeType == "popup") {
					var pop = window.open(widget.bxeCall,"foobar","width=600,height=600,resizable=yes,scrollbars=yes");
					window.bxe_lastNode = appNode;
					pop.focus();
				} else {
					return eval(widget.bxeCall + "(appNode)") ;
				}
			})
			n.bxeCall = _entries[i]['call'];
			n.bxeType = _entries[i]['type'];
			
		}
		
	}

	if (node.vdom.bxeTabletype && (node.vdom.bxeTabletype == "table-cell" || node.vdom.bxeTabletype == "table-col" )) {
		popup.addSeparator(" Table Editing ");
		bxe_doMoveUpDownMenu(node,popup,e,previousSibling, nextSibling, true);
		//split
		if (node._node.getAttribute("colspan") > 1) {
		var menui = popup.addMenuItem(bxe_i18n.getText("Split right"), function(e) {
			var widget = e.currentTarget.Widget;
			var _par = widget.MenuPopup.MainNode._node.parentNode;
			widget.MenuPopup.MainNode._node.TableCellSplitRight();
			bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode);
			
		});
		}
		
		if (node._node.getAttribute("rowspan") > 1) {
			
			var menui = popup.addMenuItem(bxe_i18n.getText("Split down"), function(e) {
				var widget = e.currentTarget.Widget;
				var _par = widget.MenuPopup.MainNode._node.parentNode;
				widget.MenuPopup.MainNode._node.TableCellSplitDown();
				bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode);
				//_par.updateXMLNode();
				
			});
		}
		
		
		
		if (nextSibling && (nextSibling.vdom.bxeTabletype == "table-cell" || nextSibling.vdom.bxeTabletype == "table-col" )) {
			var menui = popup.addMenuItem(bxe_i18n.getText("Merge right"), function(e) {
				var widget = e.currentTarget.Widget;
				var _par = widget.MenuPopup.MainNode._node.parentNode;
				widget.MenuPopup.MainNode._node.TableCellMergeRight();
				bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode);
				//_par.updateXMLNode();
			});

		}
	
		var _par = node.parentNode;
		while(_par && _par.vdom &&  _par.vdom.bxeTabletype == "table-row") {
			 _par = _par.parentNode;
		}
		if ( node.vdom.bxeTabletype != "table-col") {
		
			var menui = popup.addMenuItem(bxe_i18n.getText("Merge down"), function(e) {
				var widget = e.currentTarget.Widget;
				var _par = widget.MenuPopup.MainNode._node.parentNode;
				widget.MenuPopup.MainNode._node.TableCellMergeDown();
				bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode);
				//_par.updateXMLNode();
			});
			
			var menui = popup.addMenuItem(bxe_i18n.getText("Append Row"), function(e) {
				var widget = e.currentTarget.Widget;
				
				widget.MenuPopup.MainNode._node.TableAppendRow();
				bxe_Transform(false,false,widget.MenuPopup.MainNode.parentNode.parentNode);
				
			});
		}
		var menui = popup.addMenuItem(bxe_i18n.getText("Append Col"), function(e) {
			var widget = e.currentTarget.Widget;
			var _par = widget.MenuPopup.MainNode._node.parentNode.parentNode;
			widget.MenuPopup.MainNode._node.TableAppendCol();
			bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode.parentNode);
			
		});
		var menui = popup.addMenuItem(bxe_i18n.getText("Remove Row"), function(e) {
			var widget = e.currentTarget.Widget;
			var _par = widget.MenuPopup.MainNode._node.parentNode.parentNode;
			widget.MenuPopup.MainNode._node.TableRemoveRow();
			bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode.parentNode);
			
		});
		
		var menui = popup.addMenuItem(bxe_i18n.getText("Remove Col"), function(e) {
			var widget = e.currentTarget.Widget;
			var _par = widget.MenuPopup.MainNode._node.parentNode.parentNode;
			widget.MenuPopup.MainNode._node.TableRemoveCol();
			bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode.parentNode);
			
		});
		
		
	}
	popup.MainNode = node;
	} catch (e) { bxe_catch_alert(e);}
}
		
function bxe_doMoveUpDownMenu(node,popup,e,previousSibling,nextSibling,table) {
	if (previousSibling) {
		if (table) {
			var _t = "Move cell left";
		} else {
			var _t = "Move up";
		}
		popup.addMenuItem(bxe_i18n.getText(_t), function (e) {
			var widget = e.currentTarget.Widget;
			var appNode = widget.MenuPopup.MainNode;
			bxe_moveUp(appNode);
		});
		if (table && previousSibling.vdom.bxeTabletype == "table-cell" || previousSibling.vdom.bxeTabletype == "table-col" ) {
				var menui = popup.addMenuItem(bxe_i18n.getText("Move column left"), function(e) {
				var widget = e.currentTarget.Widget;
				var _par = widget.MenuPopup.MainNode._node.parentNode;
				widget.MenuPopup.MainNode._node.TableCellMoveLeft();
				bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode);
			});
		}
		
	}
	if (nextSibling) {
		if (table) {
			var _t = "Move cell right";
		} else {
			var _t = "Move down";
		}
		popup.addMenuItem(bxe_i18n.getText(_t), function (e) {
			var widget = e.currentTarget.Widget;
			var appNode = widget.MenuPopup.MainNode;
			bxe_moveDown(appNode);
		});
		if (table && nextSibling.vdom && (nextSibling.vdom.bxeTabletype == "table-cell" || nextSibling.vdom.bxeTabletype == "table-col" )) {
					var menui = popup.addMenuItem(bxe_i18n.getText("Move column right"), function(e) {
				var widget = e.currentTarget.Widget;
				var _par = widget.MenuPopup.MainNode._node.parentNode;
				widget.MenuPopup.MainNode._node.TableCellMoveRight();
				bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode);
			});
		}
	}
	
}

function bxe_NodeChanged(e) {

	var newNode = e.target;
	var oldNode = e.additionalInfo.XMLNode;
	newNode.XMLNode = bxe_XMLNodeInit(newNode);
	newNode.XMLNode.previousSibling = oldNode.previousSibling;
	newNode.XMLNode.nextSibling = oldNode.nextSibling;
	newNode.XMLNode.parentNode = oldNode.parentNode;
	newNode.XMLNode.firstChild = oldNode.firstChild;
	newNode.XMLNode.lastChild = oldNode.lastChild;

	if (!newNode.XMLNode.previousSibling ) {
		newNode.XMLNode.parentNode.firstChild = newNode.XMLNode;
	} else {
		newNode.XMLNode.previousSibling.nextSibling = newNode.XMLNode;
	}
	if (!newNode.XMLNode.nextSibling ) {
		newNode.XMLNode.parentNode.lastChild = newNode.XMLNode;
	} else {
		newNode.XMLNode.nextSibling.previousSibling = newNode.XMLNode;
	}
		
	oldNode.unlink();
	
}

function bxe_NodeInsertedBefore(e) {

}

function bxe_appendNode(e) {
	var aNode = e.additionalInfo.appendToNode;
	bxe_history_snapshot();
	if (e.additionalInfo.node) {
		var newNode = e.additionalInfo.node;
		if (newNode.nodeType == 11) {
			while (newNode.lastChild) {
				if (newNode.lastChild.nodeType == 1) {
					newNode.lastChild.setBxeIds(true);
				}
				newXMLNode= aNode.parentNode.insertBeforeIntern(newNode.lastChild,aNode._node.nextSibling);
			}
		} else {
			newXMLNode= aNode.parentNode.insertBeforeIntern(newNode,aNode._node.nextSibling);
			
		}
		newXMLNode.parentNode.isNodeValid(true,2);
		
		bxe_Transform();
	} else {

		var newNode =  bxe_config.xmldoc.createElementNS(e.additionalInfo.namespaceURI,e.additionalInfo.localName, 1 ) ;
		
		
		if (e.additionalInfo.findFirstPosition) {
			
			newNode = aNode.parentNode.insertAfter(newNode,aNode._node);
			//FIXME: we have to check it twice... WHY??
			var _test = newNode.parentNode.isNodeValid(true,2,true);
			var _test = newNode.parentNode.isNodeValid(true,2,true);
			
			if (!_test) {
				var _nS = aNode.parentNode.firstChild;
				newNode = aNode.parentNode.insertBefore(newNode._node,_nS._node);
				_nS = _nS.nextSibling;
				while (!newNode.parentNode.isNodeValid(true,2,true) && _nS && _nS._node) {
					newNode = _nS.parentNode.insertBefore(newNode._node,_nS._node);
					_nS = _nS.nextSibling;
					
				}
			}
			
		} else {
			newNode = aNode.parentNode.insertAfter(newNode,aNode._node);
		}
		var _id = newNode._node.setBxeId();
		newNode.parentNode.isNodeValid(true,2);
		
		if( !newNode.makeDefaultNodes(e.additionalInfo.noPlaceholderText)) {
			
			if (!e.additionalInfo.noTransform) {
				bxe_Transform(_id,"select",newNode.parentNode);
			}
		}
	}

}


function bxe_appendChildNode(e) {
		var aNode = e.additionalInfo.appendToNode;
		var newNode = bxe_createXMLNode(e.additionalInfo.namespaceURI,e.additionalInfo.localName) ;
		if (e.additionalInfo.atStart && aNode.firstChild) {
			var _child = aNode.firstChild._node;
			while (_child) {
				newNode = aNode.insertBefore(newNode._node,_child);
				if (!newNode.parentNode.isNodeValid(true,2,true)) {
					
					aNode.removeChild(newNode);
					_child = _child.nextSibling;
				} else {
					_child = null;
					break;
				}
			}
		} else {
			newNode = aNode.appendChild(newNode);
		}
		if (newNode && newNode.parentNode) {
			newNode.parentNode.isNodeValid(true,2);
			var cb = bxe_getCallback(e.additionalInfo.localName, e.additionalInfo.namespaceURI);
			if (cb ) {
				bxe_doCallback(cb, newNode);
			} else {
				if( !newNode.makeDefaultNodes(e.additionalInfo.noPlaceholderText)) {
					
					if (!e.additionalInfo.noTransform) {
						bxe_Transform(false,false,newNode.parentNode);
					}
				}
			}
		}
}

function bxe_changeLinesContainer2(e) {
	bxe_history_snapshot();
	//alert (window.bxe_ContextNode.nodeName);
	
	var nodeParts = e.split("=");
	if (nodeParts.length < 2 ) {
		nodeParts[1] = null;
	}
	
	var newContainer = window.bxe_ContextNode._node.changeContainer(nodeParts[1],  nodeParts[0]);
	
		newContainer.XMLNode = new XMLNodeElement( nodeParts[1], nodeParts[0], window.bxe_ContextNode._node.nodeType);
		try {
			newContainer.updateXMLNode();
		} catch(e) {alert(newContainer + " can't be updateXMLNode()'ed\n" + e);
		}
	
	newContainer.XMLNode.parentNode.isNodeValid(false, 2,false,true);
	bxe_history_snapshot_async();
	window.bxe_ContextNode = newContainer.XMLNode;
	//bxe_delayedUpdateXPath();
}



function bxe_changeLinesContainer(e) {
	bxe_history_snapshot();
	var nodeParts = e.additionalInfo.split("=");
	if (nodeParts.length < 2 ) {
		nodeParts[1] = null;
	}
	
	var cssr=window.getSelection().getEditableRange();
	var node = cssr.startContainer.getBlockParentFromXML();
	if (node) {
		var newContainer = node._node.changeElementName(nodeParts[1],nodeParts[0]);
		bxe_Transform(newContainer.getAttribute("__bxe_id"),cssr.startOffset,newContainer.parentNode.XMLNode);
	}
}



/* end mode toggles */

/* area mode stuff */

function bxe_getAllEditableAreas() {
	var nsResolver = new bxe_nsResolver(document.documentElement);
	var result = document.evaluate("/html/body//*[@bxe_xpath]", document.documentElement,nsResolver, 0, null);
	var node = null;
	var nodes = new Array();
	node = result.iterateNext()
	while (node) {
		//bxe_dump(result2.snapshotItem(result2.snapshotLength -1).saveXML() + "\n");
		nodes.push(node);
		node = result.iterateNext()
		
	}
	return nodes;
}

function bxe_getAll_bxeId() {
	var nsResolver = new bxe_nsResolver(document.documentElement);
	var result = document.evaluate("/html/body//*[@__bxe_id ]", document.documentElement,nsResolver, 0, null);
	var node = null;
	var nodes = new Array();
	node = result.iterateNext();
	var _ids = new Array();
	var emptyNodes = new Array();
	while (node) {
		//bxe_dump(result2.snapshotItem(result2.snapshotLength -1).saveXML() + "\n");
		var id = node.getAttribute('__bxe_id');
		
		if (node.hasAttribute("__bxe_attribute")) {
			id += "/"+node.getAttribute('__bxe_attribute');
		}
		if (id == '') {
			emptyNodes.push(node);
		} else {
			if (! _ids[id]) {
				nodes.push(node);
				_ids[id] = true;
			}
		}
		node = result.iterateNext()
		
	}
	for (var i = 0; i < emptyNodes.length; i++) {
		emptyNodes[i].removeAttribute("__bxe_id");
	}
	return nodes;
}

function bxe_alignAllAreaNodes() {
	var nodes = bxe_getAllEditableAreas();
	for (var i = 0; i < nodes.length; i++) {
		bxe_alignAreaNode(nodes[i].parentNode,nodes[i]);
	}
}

function bxe_alignAreaNode(menuNode,areaNode) {
	if (areaNode.display == "block") {
		menuNode.position("-8","5");
	} else {
		menuNode.position("0","0");
	}
	menuNode.draw();
}

/* debug stuff */
function BX_debug(object)
{
    var win = window.open("","debug");
	bla = "";
    for (b in object)
    {

        bla += b;
        try {

            bla +=  ": "+object.eval(b) ;
        }
        catch(e)
        {
            bla += ": NOT EVALED";
        };
        bla += "\n";
    }
    win.document.innerHTML = "";

    win.document.writeln("<pre>");
    win.document.writeln(bla);
    win.document.writeln("<hr>");
}

function BX_showInWindow(string)
{
    var win = window.open("","debug");

    win.document.innerHTML = "";
	win.document.writeln("<html>");
	win.document.writeln("<body>");

    win.document.writeln("<pre>");
	if (typeof string == "string") {
		win.document.writeln(string.replace(/</g,"&lt;"));
	}
	win.document.writeln("</pre>");
	win.document.writeln("</body>");
	win.document.writeln("</html>");
}

function bxe_about_box_fade_out (e) {
	bxe_about_box.node.style.display = "none";
	window.status = null;
}

function bxe_draw_widgets() {
	
	
	// make menubar
	bxe_menubar = new Widget_MenuBar();
	var img = document.createElement("img");
	img.setAttribute("src",mozile_root_dir + "images/bxe.png");
	
	img.setAttribute("align","right");
	bxe_menubar.node.appendChild(img);
	var submenu = new Array(bxe_i18n.getText("Save"),function() {eDOMEventCall("DocumentSave",document);});
	submenu.push(bxe_i18n.getText("Save & Reload"),function() {eDOMEventCall("DocumentSave",document,{"reload": true});});
	
	submenu.push(bxe_i18n.getText("Save & Exit"),function() {eDOMEventCall("DocumentSave",document,{"exit": true});});
	
	submenu.push(bxe_i18n.getText("Exit"),function() {eDOMEventCall("Exit",document);});
	bxe_menubar.addMenu(bxe_i18n.getText("File"),submenu);

	var submenu2 = new Array(bxe_i18n.getText("Undo"),function() {eDOMEventCall("Undo",document);},bxe_i18n.getText("Redo"),function () {eDOMEventCall("Redo",document)});
	bxe_menubar.addMenu(bxe_i18n.getText("Edit"),submenu2);
	
	var submenu3 = new Array();
	submenu3.push(bxe_i18n.getText("Show XML Document"),function(e) {BX_showInWindow(bxe_getXmlDocument(true));})
	submenu3.push(bxe_i18n.getText("Show RNG Document"),function(e) {BX_showInWindow(bxe_getRelaxNGDocument());})
	
	bxe_menubar.addMenu(bxe_i18n.getText("Debug"),submenu3);
	
	for (var i=0; i < bxe_config.menus.length; i++) {
		var _sub = new Array();
		for (var j=0; j < bxe_config.menus[i].menus.length; j++) {
			_sub.push(bxe_config.menus[i].menus[j].name,eval(bxe_config.menus[i].menus[j].value));
		}
		bxe_menubar.addMenu(bxe_config.menus[i].name,_sub);
    }
    
	var submenu4 = new Array();
	
	submenu4.push(bxe_i18n.getText("About BXE"),function(e) { 
		bxe_about_box.setText("");
		bxe_about_box.show(true);
		
	});
	
	submenu4.push(bxe_i18n.getText("Help"),function (e) { 
		bla = window.open("http://wiki.bitfluxeditor.org/BXE_2.0","help","width=800,height=600,left=0,top=0");
		bla.focus();
	
	});

	submenu4.push(bxe_i18n.getText("BXE Website"),function (e) { 
		bla = window.open("http://www.bitfluxeditor.org","help","width=800,height=600,left=0,top=0");
		bla.focus();
	
	});

	submenu4.push(bxe_i18n.getText("Show System Info"), function(e) {
		var modal = new Widget_ModalBox();
		modal.node = modal.initNode("div","ModalBox");
		modal.Display = "block";
		modal.node.appendToBody();
		modal.position(100,100,"absolute");
		modal.initTitle(bxe_i18n.getText("System Info"));
		modal.initPane();
		var innerhtml =  "<br/>" + bxe_i18n.getText("BXE Version: ") + BXE_VERSION  + "<br />";
		innerhtml += bxe_i18n.getText("BXE Build Date: ") + BXE_BUILD + "<br/>";
		innerhtml += bxe_i18n.getText("BXE Revision: ") + BXE_REVISION + "<br/><br/>";
		innerhtml += bxe_i18n.getText("User Agent: ") + navigator.userAgent + "<br/><br/>";
		modal.PaneNode.innerHTML = innerhtml;
		modal.draw();
		var subm = document.createElement("input");
		subm.setAttribute("type","submit");
		subm.setAttribute("value",bxe_i18n.getText("OK"));
		subm.onclick = function(e) {
			var Widget = e.target.parentNode.parentNode.Widget;
			e.target.parentNode.parentNode.style.display = "none";
		}
		modal.PaneNode.appendChild(subm);
		
	});

	submenu4.push(bxe_i18n.getText("Report Bug"),function(e) { 
		bla = window.open("http://bugs.bitfluxeditor.org/enter_bug.cgi?product=Editor&version="+BXE_VERSION+"&priority=P3&bug_severity=normal&bug_status=NEW&assigned_to=&cc=&bug_file_loc=http%3A%2F%2F&short_desc=&comment=***%0DVersion: "+BXE_VERSION + "%0DBuild: " + BXE_BUILD +"%0DUser Agent: "+navigator.userAgent + "%0D***&maketemplate=Remember+values+as+bookmarkable+template&form_name=enter_bug","help","");
		bla.focus();
		
	});
	
	
	bxe_menubar.addMenu(bxe_i18n.getText("Help"),submenu4);
	
	bxe_menubar.draw();
	
	//make toolbar
	
	bxe_toolbar = new Widget_ToolBar();
	bxe_format_list = new Widget_MenuList("m",function(e) {
		bxe_changeLinesContainer2(this.value);
	//	eDOMEventCall("changeLinesContainer",document,this.value)
	});

	bxe_toolbar.addItem(bxe_format_list);
	
	bxe_toolbar.addButtons(bxe_config.getButtons());
	
	
	bxe_toolbar.draw();

	bxe_status_bar = new Widget_StatusBar();

	// if not content editable and ptb is enabled then hide the toolbar (watch out
	// for selection within the toolbar itself though!)
	
	
	window.setTimeout(bxe_about_box_fade_out, 1000);
}

function MouseClickEvent(e) {
	
	e.stopPropagation();
	
	var target = e.currentTarget;
	if(target.userModifiable && bxe_editable_page) {
		return bxe_updateXPath(target);
	}
	return true;
}

function bxe_updateXPath(e) {
	var sel = window.getSelection();
	try {
		var cssr = sel.getRangeAt(0);
	} catch (e) {
		return false;
	}
	if (e && e.localName == "TEXTAREA") {
		bxe_format_list.removeAllItems();
		bxe_format_list.appendItem("-Source Mode-","");
		bxe_status_bar.buildXPath(e.parentNode);
		
	}
	
	else if (cssr) {
		/*if ( cssr.top._SourceMode) {
			//clear list
			bxe_format_list.removeAllItems();
			bxe_format_list.appendItem("-Source Mode-","");
			bxe_status_bar.buildXPath(cssr.top);

		} else */{
			if (e) {
				bxe_status_bar.buildXPath(e);
			} else {
				
				bxe_status_bar.buildXPath(sel.anchorNode);
			}
			
			
			bxe_format_list.removeAllItems();
			var block = cssr.startContainer.getBlockParentFromXML();
			if (block  ) {
				var thisNode = block;
				if (!thisNode) {
					bxe_format_list.appendItem(bxe_i18n.getText("no block found"),"");
					return false;
				}
				window.bxe_ContextNode = thisNode;
				var ac = thisNode.parentNode.allowedChildren;
				var menuitem;
				var thisLocalName = thisNode.localName;
				var thisNamespaceURI = thisNode.namespaceURI;
				if (ac) {
					for (i = 0; i < ac.length; i++) {
						if (ac[i].nodeType != 3 && !ac[i].bxeDontshow && ac[i].vdom.canHaveChildren)  {
							menuitem = bxe_format_list.appendItem(ac[i].vdom.bxeName, ac[i].localName + "=" + ac[i].namespaceURI);
							if (ac[i].localName == thisLocalName &&  ac[i].namespaceURI == thisNamespaceURI) {
								menuitem.selected=true;
							}
						}
					}
				}
				
				
			} else {
				bxe_format_list.appendItem(bxe_i18n.getText("no block found"),"");
			}
		}
	}
}

function bxe_delayedUpdateXPath() {
	if (bxe_delayedUpdate) {
		window.clearTimeout(bxe_delayedUpdate);
	}
	bxe_delayedUpdate = window.setTimeout("bxe_updateXPath()",100);
}

function bxe_ContextMenuEvent(e) {
	var node = e.target.getParentWithXMLNode();
		
	if (!node) {
		return true;
	}
	
	if (node.XMLNode._node.nodeType != Node.ATTRIBUTE_NODE && node.XMLNode.vdom.bxeNoteditableContextMenu == false) {
		return false;
	}

	var sel = window.getSelection();
	if (sel.anchorNode != e.rangeParent && sel.isCollapsed) {
		try {
			sel.collapse(e.rangeParent,e.rangeOffset);
		} catch (e) {
			sel.collapse(e.target,0);
		}
	}
	bxe_context_menu.show(e,node);
	e.stopPropagation();
	e.returnValue = false;
	e.preventDefault();
	return false;
}

function bxe_UnorderedList() {
	var sel = window.getSelection();
	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	var lines = window.getSelection().toggleListLines("ul", "ol");
	lines[0].container.updateXMLNode();
	var li = lines[0].container;
	while (li ) {
		if (li.nodeName == "li") {
			li.XMLNode.namespaceURI = XHTMLNS;
		}
		var attr = li.XMLNode.attributes;
		for (var i in attr) {
			if (! li.XMLNode.isAllowedAttribute(attr[i].nodeName)) {
				li.XMLNode.removeAttribute(attr[i].nodeName);
			}
		}

		li = li.nextSibling;
	}
	lines[0].container.parentNode.setAttribute("class","type1");
	bxe_updateXPath();
}

function bxe_OrderedList() {
	var sel = window.getSelection();
	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	
	var lines = window.getSelection().toggleListLines("ol", "ul");

	lines[0].container.updateXMLNode();
	
	var li = lines[0].container;
	while (li ) {
		if (li.nodeName == "li") {
			li.XMLNode.namespaceURI = XHTMLNS;
		}
		var attr = li.XMLNode.attributes;
		for (var i in attr) {
			if (! li.XMLNode.isAllowedAttribute(attr[i].nodeName)) {
				li.XMLNode.removeAttribute(attr[i].nodeName);
			}
		}
		li = li.nextSibling;
	}
	
	// needed by unizh
	lines[0].container.parentNode.setAttribute("class","type1");
	bxe_updateXPath();
}

function bxe_InsertObject() {
	var sel = window.getSelection();
	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	var object = documentCreateXHTMLElement("object");
	
	sel.insertNode(object);
}

function bxe_InsertAsset() {
	//this code is quite lenya specific....
	// especially the unizh: check
	var sel = window.getSelection();
	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	
	var cssr = sel.getEditableRange();
	var pN = cssr.startContainer.parentNode;
	//FIXME: unizh code should be outsourced...
	if ((pN.XMLNode.localName == "highlight-title" && pN.XMLNode.namespaceURI == "http://unizh.ch/doctypes/elements/1.0") ||
	(pN.XMLNode.localName == "asset" && pN.XMLNode.namespaceURI == "http://apache.org/cocoon/lenya/page-envelope/1.0")) {
		alert("Asset is not allowed here");
		return false;
	}
	
	if (!bxe_checkIsAllowedChild("http://apache.org/cocoon/lenya/page-envelope/1.0","asset",sel, true) && !bxe_checkIsAllowedChildOfNode("http://apache.org/cocoon/lenya/page-envelope/1.0","asset",pN.parentNode, true)) {
		alert ("Asset is not allowed here");
		return false;
	}
	var object = document.createElementNS("http://apache.org/cocoon/lenya/page-envelope/1.0","asset");
	var cb = bxe_getCallback("asset","http://apache.org/cocoon/lenya/page-envelope/1.0");
	if (cb ) {
		bxe_doCallback(cb, object);
	} 
	else {
	
		sel.insertNode(object);
	}
}

function bxe_InsertImage() {
	
	var sel = window.getSelection();
	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	
	var mod = mozilla.getWidgetModalBox(bxe_i18n.getText("Enter the image url or file name:"), function(values) {
		if(values.imgref == null) // null href means prompt canceled
			return;
		if(values.imgref == "") 
			return; // ok with no name filled in

		
		var img = documentCreateXHTMLElement("img");
		img.firstChild.setAttribute("src",values.imgref);
		sel.insertNode(img);
		img.updateXMLNode();
		img.setAttribute("src",values.imgref);
	});
	
	mod.addItem("imgref", "", "textfield",bxe_i18n.getText("Image URL:"));
	mod.show(100,50,"fixed");
	
}

function bxe_checkForSourceMode(sel) {
	if (bxe_format_list.node.options.length == 1 && bxe_format_list.node.options.selectedIndex == 0) {
		if ( bxe_format_list.node.options[0].text == "-Source Mode-") {
			alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"));
			return true;
		}
	}
	// the following is legacy code. actually not needed anymore, AFAIK..
	var cssr = sel.getEditableRange();
	if (cssr && cssr.top && cssr.top._SourceMode) {
		alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"));
		return true;
	}
	return false;
}

function bxe_checkIsAllowedChild(namespaceURI, localName, sel, noAlert) {

	if (!sel) {
		sel = window.getSelection();
	} else if (typeof sel == 'object' && sel.nodeType && sel.nodeType == 1) {
		return bxe_checkIsAllowedChildOfNode(namespaceURI,localName, sel, noAlert);
	} else {
		var cssr = sel.getEditableRange();
		var parentnode = null;
		if (cssr.startContainer.nodeType != 1) {
			parentnode = cssr.startContainer.parentNode;
		} else {
			parentnode = cssr.startContainer;
		}
		
		return bxe_checkIsAllowedChildOfNode(namespaceURI,localName, parentnode, noAlert);
	}
	
}

function bxe_checkIsAllowedChildOfNode(namespaceURI,localName, node, noAlert) {
	if (localName == "#text") {
		localName = null;
	}
	if (localName == null || node.XMLNode.isAllowedChild(namespaceURI, localName) ) {
		return true;
	} else {
		if (!noAlert) {
			alert (bxe_i18n.getText("{0} is not allowed as child of {1}",new Array(localName,node.XMLNode.localName)));
		}
		return false;
	}
}

function bxe_InsertTable() {
	var sel = window.getSelection();
	var cssr = sel.getEditableRange();
	
	if (!bxe_checkIsAllowedChild("","table",sel, true) &&  !bxe_checkIsAllowedChildOfNode("","table",cssr.startContainer.parentNode.parentNode, true)) {
		alert (bxe_i18n.getText("Table is not allowed here"));
		return false;
	}

	var object = documentCreateXHTMLElement("table");
	//sel.insertNode(object);
	window.bxe_ContextNode = BXE_SELECTION;
	bxe_InsertTableCallback();
}


function bxe_InsertTableCallback(replaceNode) {
	var sel = window.getSelection();

	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	
	var mod = mozilla.getWidgetModalBox(bxe_i18n.getText("Create Table"), function(values) {
		
		if (replaceNode && replaceNode._node) {
			var te = documentCreateTable(values["rows"], values["cols"],replaceNode._node);
		} else {
			var te = documentCreateTable(values["rows"], values["cols"]);
		}
		
		if(!te) {
			alert(bxe_i18n.getText("Can't create table: invalid data"));
		}
		else if (window.bxe_ContextNode == BXE_SELECTION) {
			var sel = window.getSelection(); 	
			if (!bxe_checkIsAllowedChild("","table",sel, true)) {
				
				var xmlnode = bxe_splitAtSelection();
				xmlnode.parentNode.insertBefore(te,xmlnode);
			} else {
				
				sel.insertNodeRaw(te, true);
			}
			
			bxe_table_createTableFinish(te,  values["rows"], values["cols"]);
			
			bxe_Transform();
		} else if (replaceNode) {
			replaceNode._node.parentNode.replaceChild(te, replaceNode._node);
			
			bxe_table_createTableFinish(te,  values["rows"], values["cols"]);
			bxe_Transform();
		}
	}, function() {
		if (replaceNode && replaceNode._node) {
			replaceNode._node.parentNode.removeChild(replaceNode._node);
		}
		bxe_Transform();
		
	});
	
	mod.addItem("rows",2,"textfield",bxe_i18n.getText("number of rows"));
	mod.addItem("cols",2,"textfield",bxe_i18n.getText("number of cols"));
	mod.show(100,50, "fixed");
	return true;
}

function bxe_CleanInline(e) {
	bxe_CleanInlineIntern();
}
function bxe_CleanInlineIntern(localName, namespaceUri, z) {
	if (!z) {z = 0;}
	z++;
	if (z > 10) {
		bxe_Transform();
		bxe_dump("recursive protection\n");
		return;
	}
	var sel = window.getSelection();
	var doitagain = 0;
	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	
	var cssr = sel.getEditableRange();
	if (!cssr) {
		return;
	}

	if(cssr.collapsed)
		return;
 
	// go through all text nodes in the range and link to them unless already set to cssr link
	var textNodes = cssr.textNodes;
	var len = textNodes.length;
	for(i=0; i<len; i++) {
		// figure out cssr and then it's on to efficiency before subroutines ... ex of sub ... 
		// try text nodes returning one node ie/ node itself! could cut down on normalize calls ...
		
		if (textNodes[i].parentNode.XMLNode) {
			var textContainer = textNodes[i].parentNode.XMLNode._node;
			if (textNodes[i].parentNode && textNodes[i].parentNode.getCStyle("display") == "inline") {
				if (localName) {
					if (textContainer.parentNode && textContainer.parentNode.firstChild == textContainer) {
						textNodes.push(textContainer);
					}
					if(!(textContainer.XMLNode.localName == localName &&
					textContainer.XMLNode.namespaceURI == namespaceUri)) {
						continue;
					}
				}
				
				if(textContainer.childNodes.length > 1) {
				
					var siblingHolder;
					
					// leave any nodes before or after cssr one with their own copy of the container
					if(textNodes[i].previousSibling) {
						if (textNodes[i].previousSibling.nodeType == 3) {
							var siblingHolder = textContainer.cloneNode(false);
							textContainer.parentNode.insertBefore(siblingHolder, textContainer);
							siblingHolder.appendChild(textNodes[i].previousSibling);
						}
					}
					if(textNodes[i].nextSibling) {
						if (textNodes[i].nextSibling.nodeType == 3) {
							var siblingHolder = textContainer.cloneNode(false);
							if(textContainer.nextSibling) {
								textContainer.parentNode.insertBefore(siblingHolder, textContainer.nextSibling);
							} else {  
								textContainer.parentNode.appendChild(siblingHolder);
							}
							siblingHolder.appendChild(textNodes[i].nextSibling);
						} else {
							textContainer.split(1);
						}
						
					}
				}
				if (textContainer.parentNode) {
					doitagain++;
					var _par = textContainer.parentNode;
					_par.removeChildOnly(textContainer);
					_par.normalize();
				} 
				
			}
			
		}
	}
	if (textContainer.parentNode == null) {
		var _prev = sel.anchorNode.parentNode.previousSibling;
		var sel = window.getSelection();
		var _pos = 0;
		
		if (_prev) {
			_pos = _prev.nodeValue.length;
			sel.collapse(_prev,_pos);
		} else {
			sel.collapse(sel.anchorNode.parentNode.parentNode.firstChild,0);
		}
	}
	bxe_Transform();
	
	
	/*
	
	FIXME: It doesn't clean nested inline styles right now.... This would be the way to do it, 
	if we could keep selections over transformations. Look into it later
	if (doitagain > 1 || (!localName && cssr.startContainer.parentNode.getCStyle("display") == "inline")) {
		bxe_Transform();
		bxe_CleanInlineIntern(localName,namespaceUri,z);
	} else {
		bxe_Transform();
		
	}*/
}


function bxe_DeleteLink(e) {
	var sel = window.getSelection();
	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	
	var cssr = sel.getEditableRange();
	
	var textContainer = sel.anchorNode.parentNode;
	
	if(textContainer.nodeNamed("span") && textContainer.getAttribute("class") == "a" )
	{
		textContainer.parentNode.removeChildOnly(textContainer);
		
	}
	
	
	
	sel.selectEditableRange(cssr);
	
	
	sel.anchorNode.updateXMLNode();
}


function bxe_InsertLink(e) {
	
	var sel = window.getSelection();
	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	var aValue = "";
	if (sel.anchorNode.parentNode.XMLNode.localName == "a") {
		aValue = sel.anchorNode.parentNode.getAttribute("href");
	}
	else if(sel.isCollapsed) { // must have a selection or don't prompt
		return;
	}
	
	if (!bxe_checkIsAllowedChild(XHTMLNS,"a",sel)) {
		return false;
	}
	
	
	var mod = mozilla.getWidgetModalBox(bxe_i18n.getText("Enter a URL:"), function(values) {
		var href = values["href"];
		if(href == null) // null href means prompt canceled - BUG FIX FROM Karl Guertin
			return;
		var sel = window.getSelection();
		if (sel.anchorNode.parentNode.XMLNode.localName == "a") {
		 sel.anchorNode.parentNode.setAttribute("href", href);
		 return true;
		}
		if(href != "") 
			sel.linkText(href);
		else
			sel.clearTextLinks();
		
		sel.anchorNode.parentNode.updateXMLNode();
	}
	);
		
	
	mod.addItem("href",aValue,"textfield",bxe_i18n.getText("Enter a URL:"));
	mod.show(100,50, "fixed");
	
	
	return;
}

function bxe_insertLibraryLink() {
	drawertool.cssr = window.getSelection().getEditableRange();
	drawertool.openDrawer( 'liblinkdrawer' );
	return;

}

function bxe_catch_alert(e ) {
	
	alert(bxe_catch_alert_message(e));
}

function bxe_catch_alert_message(e) {
	var mes = "ERROR in BXE:" + "\n" + e.message +"\n";
	try
	{
		if (e.filename) {
			mes += ("In File: ") + e.filename +"\n";
		} else {
			mes += ("In File: ") + e.fileName +"\n";
		}
		
	}
	catch (e)
	{
		mes += ("In File: ") + e.fileName +"\n";
	}
	try
	{
		mes += ("Linenumber: ") + e.lineNumber + "\n";
	}
	catch(e) {}
	
	mes += ("Type: ") + e.name + "\n";
	mes += ("Stack:") + e.stack + "\n";
	return mes;
}

function bxe_exit(e) {
	if (bxe_checkChangedDocument()) {
		if (confirm(bxe_i18n.getText("You have unsaved changes.\n Click cancel to return to the document.\n Click OK to really leave to page."))) {
			bxe_lastSavedXML = bxe_getXmlDocument();
			window.location = bxe_config.exitdestination;
		}
	} else {
		bxe_lastSavedXML = bxe_getXmlDocument();
		window.location = bxe_config.exitdestination;
	}
	
}

function bxe_checkChangedDocument() {
	var xmlstr = bxe_getXmlDocument();
	if (bxe_editable_page && xmlstr && xmlstr != bxe_lastSavedXML) {
		return true;
	} else {
		return false;
	}
}

function bxe_not_yet_implemented() {
	alert(bxe_i18n.getText("not yet implemented"));
}


/* bxe_nsResolver */

function bxe_nsResolver (node) {
	this.metaTagNSResolver = null;
	this.metaTagNSResolverUri = null;
	
	//this.htmlDocNSResolver = null;
	this.xmlDocNSResolver = null;
	this.node = node;
	
	
}

bxe_nsResolver.prototype.lookupNamespaceURI = function (prefix) {
	var url = null;
	// if we never checked for meta bxeNS tags, do it here and save the values in an array for later reusal..
	if (!this.metaTagNSResolver) {
		var metas = document.getElementsByName("bxeNS");
		this.metaTagNSResolver = new Array();
		for (var i=0; i < metas.length; i++) {
			if (metas[i].localName.toLowerCase() == "meta") {
				var ns = metas[i].getAttribute("content").split("=");
				this.metaTagNSResolver[ns[0]] = ns[1]
			}
		}
	}
	//check if the prefix was there and return it
	if (this.metaTagNSResolver[prefix]) {
		return this.metaTagNSResolver[prefix];
	}
	
	//create NSResolver, if not done yet
	if (! this.xmlDocNSResolver) {
		this.xmlDocNSResolver = this.node.ownerDocument.createNSResolver(this.node.ownerDocument.documentElement);
	}
	
	//lookup the prefix
	url = this.xmlDocNSResolver.lookupNamespaceURI(prefix);
	if (url) {
		return url;
	}
	// if still not found and we want the bxe prefix.. return that
	if (prefix == "bxe") {
		return BXENS;
	}
	
	if (prefix == "xhtml") {
		return XHTMLNS;
	}
	
	//prefix not found
	return null;
}

bxe_nsResolver.prototype.lookupNamespacePrefix = function (uri) {
	
	if (!this.metaTagNSResolverUri) {
		var metas = document.getElementsByName("bxeNS");
		this.metaTagNSResolverUri = new Array();
		for (var i=0; i < metas.length; i++) {
			if (metas[i].localName.toLowerCase() == "meta") {
				var ns = metas[i].getAttribute("content").split("=");
				this.metaTagNSResolverUri[ns[1]] = ns[0]
			}
		}
	}
	//check if the prefix was there and return it
	if (this.metaTagNSResolverUri[uri]) {
		return this.metaTagNSResolverUri[uri];
	}
	return null;
}
// replaces the function from mozile...
documentCreateXHTMLElement = function (elementName,attribs) {

	var newNode = document.createElementNS(null, elementName);
	if (attribs) {
		for (var i = 0; i < attribs.length ;  i++) {
			newNode.setAttributeNS(attribs[i].namespaceURI, attribs[i].localName,attribs[i].value);
		}
	}
	return newNode;
	
	
}

function bxe_InternalChildNodesAttrChanged(e) {
	var node = e.target;
	var attribs = node.attributes;
	//we have to replace the old internalnode, redrawing of new object-sources seem not to work...
	var newNode = document.createElementNS(node.InternalChildNode.namespaceURI, node.InternalChildNode.localName);
	for (var i = 0; i < attribs.length ;  i++) {
		var prefix = attribs[i].localName.substr(0,5);
		if (prefix != "_edom" && prefix != "__bxe") {
			newNode.setAttributeNS(attribs[i].namespaceURI,attribs[i].localName,attribs[i].value);
		}
	}
	node.replaceChild(newNode,node.InternalChildNode);
	newNode.setAttribute("_edom_internal_node","true");
	node.InternalChildNode = newNode;
	createTagNameAttributes(node,true)
	
	
	
	
}

function bxe_registerKeyHandlers() {
	if (bxe_editable_page) {
		document.addEventListener("keypress", keyPressHandler, true);
//key up and down handlers are needed for interapplication copy/paste without having native-methods access
//if you're sure you have native-methods access you can turn them off
		//document.addEventListener("keydown", keyDownHandler, true);
		//document.addEventListener("keyup", keyUpHandler, true);
		document.addEventListener("contextmenu",bxe_ContextMenuEvent, false);
	
	}
}

function bxe_disableEditablePage() {
	
	bxe_deregisterKeyHandlers();
	bxe_editable_page = false;
	document.removeEventListener("contextmenu",bxe_ContextMenuEvent, false);
	
}

function bxe_deregisterKeyHandlers() {
	document.removeEventListener("contextmenu",bxe_ContextMenuEvent, false);
	document.removeEventListener("keypress", keyPressHandler, true);
//key up and down handlers are needed for interapplication copy/paste without having native-methods access
//if you're sure you have native-methods access you can turn them off
	//document.removeEventListener("keydown", keyDownHandler, true);
	//document.removeEventListener("keyup", keyUpHandler, true);
}

function bxe_insertContent(content, replaceNode, options) {
	window.setTimeout(function() {bxe_insertContent_async(content,replaceNode,options);},1);
}
// (string || node) node, (node) replaceNode
function bxe_insertContent_async(node,replaceNode, options,selNode) {
	var docfrag;
	if (typeof node == "string") {
        docfrag = node.convertToXML();
		
	} else {
		docfrag = node;
	}
	var oldStyleInsertion = false;
	try {
	if (replaceNode == BXE_SELECTION) {
		//FIXME 2.0 doesn't work yet
		
		var sel = window.getSelection();
		;
		//var _node = _currentNode.prepareForInsert();
		if (options & BXE_SPLIT_IF_INLINE) {
			var  _currentNode = docfrag.lastChild
			while (_currentNode && _currentNode.nodeType == 3) {
				_currentNode = _currentNode.previousSibling;
			}
			if (!_currentNode) {
				_currentNode = docfrag.lastChild;
			}
			if (selNode) {
				var selCheck = selNode;
			} else {
				var selCheck = sel;
			}
			if (!bxe_checkIsAllowedChild(_currentNode.namespaceURI,_currentNode.localName,selCheck, true)) {
				var cssr = sel.getEditableRange();

				if (selNode) {
					var lala = selNode;
				} else {
					var lala = sel.anchorNode.parentNode.XMLNode._node;
				}
				//lala.split(_position);
				var fC = docfrag.firstChild;
			    lala.parentNode.insertBefore(docfrag,lala.nextSibling);
				var par = lala.parentNode;
				var sel = window.getSelection();
				var cssr = sel.getEditableRange();
				// shouldn't have big consequences, it just doesn't delete selected text, not sure, if that is used anywhere anyway
				/* if(!cssr.collapsed) {
					bxe_deleteEventKey(sel, false,false,false);
				}*/
				
				par.XMLNode.isNodeValid(true,2,true);
				if (fC) {
					if (fC.firstChild) {
						sel.collapse(fC.firstChild,0);
					}
				}
					
	
				bxe_Transform();
				return ;
			}
		}
		sel.insertNodeRaw(docfrag);
		bxe_Transform();
		return ;
	} else if (replaceNode) {
		
		//var newNode = docfrag.firstChild.init();
		newNode = docfrag.firstChild;
		replaceNode._node.parentNode.replaceChild(newNode,replaceNode._node);
		//newNode._node.updateXMLNode();
		//debug("valid? : " + newNode.getXMLNode().isNodeValid());
		bxe_Transform(false,false,replaceNode.parentNode);
	} else {
		//FIXME 2.0
		//docfrag.firstChild.init();
		var sel= window.getSelection();
		var cssr =sel.getEditableRange();
		eDOMEventCall("appendNode",document,{"appendToNode":cssr.startContainer.parentNode.XMLNode, "node": docfrag.firstChild})
	}
		} catch(e) {
		bxe_catch_alert(e);
	}
}
String.prototype.strip = function() {
    var stripspace = /^\s*(\S.*)$/;
	var stripspaceend = /^(.*\S)\s+$/;
	try { 
		var _f = stripspace.exec(this)[1]
		return stripspaceend.exec(_f)[1]
	} catch(e) {
		return this;
	}
};

String.prototype.convertToXML = function() {
	var BX_parser = new DOMParser();
	var content = this.toString();
	if (content.indexOf("<") >= 0) {
		
		content = BX_parser.parseFromString("<?xml version='1.0'?><rooot>"+content+"</rooot>","text/xml");
		content = content.documentElement;
		
		BX_tmp_r1 = document.createRange();
		
		BX_tmp_r1.selectNodeContents(content);
		content = BX_tmp_r1.extractContents();
		
	} else {
		content = document.createTextNode(content);
	}
	return content;
	
}

function bxe_getCallback (nodeName, namespaceURI) {
	
	if (bxe_config.callbacks[namespaceURI + ":" + nodeName]) {
		return bxe_config.callbacks[namespaceURI + ":" + nodeName];
	} else {
		return null;
	}
}

function bxe_doCallback(cb, node ) {
	window.bxe_ContextNode = node;
	//this is for prechecking, if an eventual popup should be called at all
	if (cb["precheck"]) {
		if (!(eval(cb["precheck"] +"(node)"))) {
			return false;
		} 
	}
	if (cb["type"] == "popup") {
		
		
		var pop = window.open(cb["content"],"popup","width=600,height=600,resizable=yes,scrollbars=yes");
		pop.focus();
		
	} else if (cb["type"] == "function") {
		return eval(cb["content"] +"(node)");
	}
}

function bxe_InsertSpecialchars() {
	var pop = window.open(mozile_root_dir+'/plugins/specialchars/specialcharacters.xml',"popup","width=400,height=500,resizable=yes,scrollbars=yes");
		pop.focus();
}
		
function bxe_checkIfNotALink (node) {
	var sel = window.getSelection();
	if (sel.anchorNode.parentNode.XMLNode.localName == "a" || sel.focusNode.parentNode.XMLNode.localName == "a") {
		alert(bxe_i18n.getText("There is already a link here, please use the 'Edit Attributes' function, to edit the link."));
		return false;
	}
	return true;
}

function bxe_alert(text) {
	var widg = mozilla.getWidgetModalBox(bxe_i18n.getText("Alert"));
	widg.addText(text);
	widg.show(100,50, "fixed");
}

function bxe_validationAlert(messages) {
	var widg = mozilla.getWidgetModalBox(bxe_i18n.getText("Validation Alert"));

	for (i in messages) {
		widg.addText( messages[i]["text"] );
	}
	widg.show((window.innerWidth- 500)/2,50, "fixed",true);
	
}
function bxe_getDirPart(path) {
	
	return path.substring(0,path.lastIndexOf("/") + 1);
}

function bxe_nodeSort(a,b) {
	if (a.nodeName > b.nodeName) {
		return 1;
	} else {
		return -1;
	}
}

function bxe_showImageDrawer() {
	drawertool.cssr = window.getSelection().getEditableRange();
	drawertool.openDrawer('imagedrawer');
}

function bxe_ShowAssetDrawer() {
    drawertool.cssr = window.getSelection().getEditableRange();
    if (drawertool.cssr) {
        drawertool.openDrawer('assetdrawer');
    }
}

function bxe_start_plugins () {
	
	var ps = bxe_config.getPlugins();
	
	if (ps.length > 0) {
		for (var i = 0; i < ps.length; i++) {
			var p = bxe_plugins[ps[i]];
			if (p.start) {
				p.start(bxe_config.getPluginOptions(ps[i]));
			}
		}
	}
}


function bxe_Transform_async() {
	window.setTimeout("bxe_Transform()",10);
}
	

function bxe_Transform(xpath, position, validateNode,wFValidityCheckLevel) {
	startTimer = new Date();
	bxe_dump("TRANSFORM\n");
	var xml = bxe_config.xmldoc;
	if ( bxe_config.options['onTransformBefore']) {
		 eval(bxe_config.options['onTransformBefore'] +"(xml,'onTransformBefore')");
	}
	
	
	var node = xml.documentElement;
	var sel = window.getSelection();
	if (sel && sel.anchorNode) {
		var _topId = bxe_getBxeId(sel.anchorNode.parentNode);
		if (sel.anchorNode.parentNode.hasAttribute("__bxe_attribute")) {
			var _topAttr = sel.anchorNode.parentNode.getAttribute("__bxe_attribute");
		} else {
			var _topAttr = null;
		}
	} 
	
	
	var _childPosition = bxe_getChildPosition(sel.anchorNode);
	var _offset =sel.anchorOffset;
	
	bxe_config.xmldoc.documentElement.init();
	
	bxe_dump("getDomDocument " + (new Date() - startTimer)/1000 + " sec\n");
	try {
	var xmldoc = bxe_config.processor.transformToFragment(xml,document);
	} catch (e) {
		
		BX_debug(e);
	}
	bxe_dump("transformToFragment " + (new Date() - startTimer)/1000 + " sec\n");
	
	var bxe_area = document.getElementById("bxe_area");
	if (!bxe_area) {
	   bxe_area = document.getElementById("container");
	}
	if (!bxe_area) {
        alert("no element with id 'bxe_area' or 'container' found");
    } 
	bxe_area.removeAllChildren();
	bxe_area.style.display="none";
	
	bxe_area.appendChild(xmldoc);
	
	var b = document.evaluate("./*[local-name() = 'html']/*[local-name() = 'body']", bxe_area, null, XPathResult.ANY_UNORDERED_NODE_TYPE,null);
	if (b.singleNodeValue) {
		var c = b.singleNodeValue.firstChild;
		
		while (c) {
			var cthis = c;
			c = c.nextSibling;
			bxe_area.appendChild(cthis);
			
		}
		//try to find css :)
		var c = document.evaluate("./*[local-name() = 'html']/*[local-name() = 'head']/*[local-name() = 'link' and @rel='stylesheet' and @type='text/css' and not(@media = 'print')]", bxe_area, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
		if (bxe_firstTransform) {
			for (var i = 0; i < c.snapshotLength; i++) {
				
				var x = document.body.appendChild(document.createElement("link"));
				x.setAttribute("type","text/css");
				x.setAttribute("rel","stylesheet");
				
				x.setAttribute("href",c.snapshotItem(i).getAttribute("href"));
				x.setAttribute("media",c.snapshotItem(i).getAttribute("media"));
			}
		}
		b.singleNodeValue.parentNode.parentNode.removeChild(b.singleNodeValue.parentNode);
		
	}
	bxe_dump("remove and Append " + (new Date() - startTimer)/1000 + " sec\n");
	
	bxe_init_serverIncludes(bxe_area);
	bxe_dump("serverIncludes " + (new Date() - startTimer)/1000 + " sec\n");
	
	bxe_area.style.display="block";
	bxe_dump("display=block " + (new Date() - startTimer)/1000 + " sec\n");
	
	bxe_init_htmldocument();
	
	//status bar neu positionieren
	bxe_status_bar.positionize();
	
	bxe_dump("bxe_init_htmldocument  " + (new Date() - startTimer)/1000 + " sec\n");
	var valid = false;
	if (validateNode) {
		if (valid = validateNode.isNodeValid(true,wFValidityCheckLevel)) {
			bxe_dump("node is valid \n");
		} else {
			bxe_dump("node is not valid \n");
		}
	} else {
		 valid = xml.XMLNode.validateDocument();
	}
	bxe_dump("validateDocument " + (new Date() - startTimer)/1000 + " sec\n");
	if (!valid) {
		bxe_dump("Document not valid. Do it again...\n");
		
		return bxe_history_undo();
		
	}
	
	if ( bxe_config.options['onTransformAfter']) {
		 eval(bxe_config.options['onTransformAfter'] +"(xml,'onTransformAfter')");
	}
	
	
	
	
	//bxe_config.xmldoc.insertIntoHTMLDocument();
	//bxe_dump("insertIntoHTMLDocument " + (new Date() - startTimer)/1000 + " sec\n");
	if (_topId) {
		
		var _topNode = bxe_getHTMLNodeByBxeId(_topId,_topAttr);
	}
	//var ip = documentCreateInsertionPoint(_topNode, _topNode.childNodes[_childPosition], _offset);
	if (typeof xpath == "string") {
		var _node = bxe_getHTMLNodeByBxeId(xpath);
		sel = window.getSelection();
		// the selection stuff does not always work
		if (_node) {
			try {
				if (position == "select") {
					sel.collapse(_node.firstChild,0);
					sel.extend(_node.firstChild,_node.firstChild.length);
				} else {
					sel.collapse(_node.firstChild,position);
				}
			} catch(e) {
				bxe_dump("Cursor selection didn't work (somehow expected behaviour). Exception dump: \n");
				bxe_dump(e);
				bxe_dump("\n");
			}
		}
		
	}
	else if (!_topNode) {
		
	}
	else if (xpath) {
		if (_topNode.nextSibling && _topNode.nextSibling.firstChild) {
			sel.collapse(_topNode.nextSibling.firstChild,0);//childNodes[_childPosition], _offset);
		} else if (_topNode.nextSibling) {
			sel.collapse(_topNode.nextSibling,0);
		}
	} else {
		try {
			
		sel.collapse(_topNode.childNodes[_childPosition], _offset);
		} catch(e) {
			//didn't work
			
		}
	}
	var sel = window.getSelection();
	if (sel.isCollapsed && sel.anchorNode && sel.anchorNode.parentNode.getAttribute("__bxe_defaultcontent") == "true" ) {
			var node = sel.anchorNode.parentNode;
			sel.collapse(node.firstChild,0);
			sel.extend(node.firstChild,node.firstChild.length);
		
	}
	bxe_dump("cursor selection " + (new Date() - startTimer)/1000 + " sec\n");
	bxe_firstTransform = false;
	bxe_history_snapshot();
	bxe_dump("history snapshot " + (new Date() - startTimer)/1000 + " sec\n");
}


function bxe_Transform_first() {
	bxe_firstTransform = true;
	bxe_Transform();
	var sel = window.getSelection();
	var walker = document.createTreeWalker(
	document.documentElement, NodeFilter.SHOW_ELEMENT,
	null, 
	true);
	
	node =   walker.nextNode();
	
	do {
		if (node.userModifiable && node.XMLNode &&  node.XMLNode.canHaveText) {
			sel.collapse(node.firstChild,0);
			bxe_updateXPath(node);
			break;
		}
		node =   walker.nextNode();
		
	} while(node);
}

function bxe_getXMLNodeByHTMLNode(node) {
	return node.XMLNode._node;
}


function bxe_getXMLNodeByHTMLNodeRecursive(node) {
	
	while (node) {
		if (node.XMLNode && node.XMLNode._node) {
			return node.XMLNode._node;
		}
		node = node.parentNode;
	}
	return null;
}


function bxe_getBxeId(node) {
	return node.getAttribute("__bxe_id");
}

function bxe_getHTMLNodeByBxeId(bxe_id, bxe_attr) {
	if (bxe_attr) {
		return document.evaluate("//*[@__bxe_id = '" + bxe_id + "' and @__bxe_attribute = '" + bxe_attr + "']", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue;
	} else {
		return document.evaluate("//*[@__bxe_id = '" + bxe_id + "']", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue;
	}
}

function bxe_getChildPosition(node) {
	if (!node) {
		return 0;
	}
	if (node._childPosition) {
		return node._childPosition;
	}
	var z = 0;
	var textNode = node.previousSibling;
	while (textNode) {
		textNode = textNode.previousSibling;
		z++;
	}
	node._childPosition = z;
	return z;
}

function bxe_init_htmldocument() {
	//	if (bxe_config.options['serverIncludes']) {
			
	//	}
		// init root 
		var nodes = bxe_getAll_bxeId();
	 	for (var i in nodes) {
			var node = nodes[i];
			var id = node.getAttribute("__bxe_id");
			var  _existingNode =  bxe_xml_nodes[id];
			if (_existingNode) {
				var notEditable = false;
				if (node.hasAttribute("__bxe_attribute")) {
					var attr = node.getAttribute("__bxe_attribute");
					var _attrNode = _existingNode.getAttributeNode(attr);
					if (_attrNode) {
						node.XMLNode = _attrNode.getXMLNode();
						var _e = _existingNode.getXMLNode();
						if (_e && _e.vdom && _e.vdom.attributes && _e.vdom.attributes[attr] && _existingNode.getXMLNode().vdom.attributes[attr].bxeNoteditable) {
							notEditable = true;
						}
					} else {
						notEditable = true;
					}
				} else {
					node.XMLNode = _existingNode.getXMLNode();
					if (node.XMLNode.vdom && node.XMLNode.vdom.bxeNoteditable) {
						notEditable = true;
						
					}
				}
				
				if (notEditable) {
					
					if (node.XMLNode && node.XMLNode.nodeType != 2 && !node.XMLNode.vdom.bxeNoteditableContextMenu) {
						node.removeAttribute("__bxe_id");
						node.XMLNode = null;
						
					} else {
						node.addEventListener("click",MouseClickEvent,false);
					}
					node.setAttribute("__bxe_noteditable","true");
				} else {
					node.XMLNode._htmlnode = node;
					var _child = node.firstChild;
					var _z = 0;
					while (_child) {
						if (_child.nodeType == 3) {
							if (_existingNode.childNodes.item(_z)) {
								_child.XMLNode = _existingNode.childNodes.item(_z).getXMLNode();
							}
						}
						_z++;
						_child = _child.nextSibling;
					}
			
					node.addEventListener("click",MouseClickEvent,false);
					
				}
				
			}
			
			
		}
}

function bxe_init_serverIncludesCallback(e) {
		if (e.document.documentElement.localName == "html4") {
			bxe_config.serverIncludes[e.td.url] = e.document.documentElement.firstChild.nodeValue;
		} else {
			bxe_config.serverIncludes[e.td.url] = e.document.documentElement.saveXML();
		}
		  
		  bxe_init_serverIncludesReplaceNode(e.td.url, e.td.htmlNode);
}



function bxe_init_serverIncludes(ctx) { 
	var includeName = bxe_config.options['serverIncludeElement'];
	if (!includeName) {
		return false;
	}
	var includeFunction = bxe_config.options['serverIncludeFunction'];
	if (!bxe_config.serverIncludes) {
		bxe_config.serverIncludes = new Array();
	}
	var res = document.evaluate("//"+ includeName, ctx,  null,     XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
	for (var i = 0; i < res.snapshotLength; i++) {
		var node = res.snapshotItem(i);
		var url = eval(includeFunction + "(node)");
		if (!bxe_config.serverIncludes[url]) {
			var td = new mozileTransportDriver("http");
			td.htmlNode = node;
			td.url = url;
			var req =  td.load(url, bxe_init_serverIncludesCallback, true);
		} else {
			
			bxe_init_serverIncludesReplaceNode(url,node);
		}
	}
}

function bxe_init_serverIncludesReplaceNode(url, node) {
	var __bxe_id = node.getAttribute("__bxe_id");
	divnode = document.createElement("div");
	
	divnode.setAttribute("__bxe_id",__bxe_id);
	divnode.innerHTML = bxe_config.serverIncludes[url];
	
	var  _existingNode =  bxe_xml_nodes[__bxe_id];
	if (_existingNode) {
		divnode.XMLNode = _existingNode.getXMLNode();
		divnode.XMLNode._htmlnode = divnode;
	}
	
	node.parentNode.replaceChild(divnode,node);
	divnode.addEventListener("click",MouseClickEvent,false);
	
}


	
function bxe_createXMLNode(namespaceURI,localName) {
		
		var _new = bxe_config.xmldoc.createElementNS(namespaceURI,localName);
		
		_new.XMLNode = _new.getXMLNode();
		return _new.XMLNode;
}

function bxe_splitAtSelection(node) {
	
	var sel= window.getSelection();
	var cssr = sel.getEditableRange();
	var xmlnode = bxe_getXMLNodeByHTMLNode(cssr.startContainer.parentNode);
	xmlnode.betterNormalize();
	var _position = bxe_getChildPosition(cssr.startContainer);
	xmlnode.childNodes[_position].splitText(cssr.startOffset);
	if (xmlnode.childNodes[_position + 1].nodeValue == '') {
		xmlnode.appendChild(bxe_config.xmldoc.createTextNode(STRING_NBSP));
	}
	xmlnode.split(_position+1);
	if (xmlnode.nextSibling) {
		if (xmlnode.nextSibling.nodeType == 3) {
			var _n = xmlnode.nextSibling.parentNode;
			_n.XMLNode.makeDefaultNodes();
		} else {
			var _n = xmlnode.nextSibling;
		}
		_n.removeAttribute("__bxe_id");
		_n.setBxeId();
	}
	if (node) {
		bxe_dump(xmlnode.localName + "\n");
		while (xmlnode && xmlnode != node) {
			_position = bxe_getChildPosition(xmlnode);
			bxe_dump(_position + "\n");
			bxe_dump(xmlnode.localName + "\n");
			xmlnode = xmlnode.parentNode
			xmlnode.split(_position + 1);
			if (xmlnode.nextSibling) {
				xmlnode.nextSibling.removeAttribute("__bxe_id");
				xmlnode.nextSibling.setBxeId();
			}
		}
	} 
	return xmlnode;
}

function bxe_insertAttributeValue(value) {
	window.bxe_lastAttributeNode.value = value;
}

function bxe_getAttributeValue() {
	return window.bxe_lastAttributeNode.value;
}

function bxe_moveUp(appNode) {
	var prevSibling = appNode.previousSibling;
		while (prevSibling && prevSibling._node.nodeType != 1 ) {
			if (prevSibling._node.nodeType == 3 && !prevSibling._node.isWhitespaceOnly) {
				break;
			}
			prevSibling = prevSibling.previousSibling;
		}
		if (prevSibling) {
		appNode.parentNode.insertBefore(appNode._node, prevSibling._node);
	}
	bxe_Transform(false,false,appNode.parentNode);
}

function bxe_moveDown(appNode) {
	
	var nextSibling = appNode.nextSibling;
	while (nextSibling && nextSibling._node.nodeType != 1) {
		if (nextSibling._node.nodeType == 3 && !nextSibling._node.isWhitespaceOnly) {
			break;
		}
		nextSibling = nextSibling.nextSibling;
	}
	if (nextSibling) {
		appNode.parentNode.insertAfter(appNode._node, nextSibling._node);
	}
	bxe_Transform(false,false,appNode.parentNode);
}

function html_get_current_XMLNode(element) {

return element.getParentWithXMLNode().XMLNode;
}

function bxe_onEmptyAddDefaultContent(node) {
	if (node.vdom.bxeDefaultcontent) {
		node.setContent(node.vdom.bxeDefaultcontent);
	} else {
		node.setContent("#" + node.nodeName);
	}
	node._node.setAttribute("__bxe_defaultcontent","true");
	bxe_Transform();
	
	var sel = window.getSelection();
	var _htmlnode = node._htmlnode; 
	
	sel.collapse(_htmlnode.firstChild,0);
	sel.extend(_htmlnode.firstChild,_htmlnode.firstChild.length);
	this.lastDefaultContent = _htmlnode;
				
	return true;
	
}
var bxe_lastCursorPositionAnchorNode = null;
var bxe_lastCursorPositionAnchorOffset = null;
var bxe_lastCursorPositionFocusNode = null;
var bxe_lastCursorPositionFocusOffset = null;


function bxe_cursorPositionSave() {
	
	var sel = window.getSelection();
	
	bxe_lastCursorPositionAnchorNode = sel.anchorNode;
	bxe_lastCursorPositionAnchorOffset = sel.anchorOffset;
	if (sel.isCollapsed) {
		bxe_lastCursorPositionFocusNode = null;
		bxe_lastCursorPositionFocusOffset = null;
	} else {
		bxe_lastCursorPositionFocusNode = sel.focusNode;
		bxe_lastCursorPositionFocusOffset = sel.focusOffset;;
	}
		
}

function bxe_cursorPositionLoad() {
	var sel = window.getSelection();
	try {
		sel.collapse(bxe_lastCursorPositionAnchorNode, bxe_lastCursorPositionAnchorOffset);
	
		if (bxe_lastCursorPositionFocusNode) {
			sel.extend(bxe_lastCursorPositionFocusNode, bxe_lastCursorPositionFocusOffset);
		}
	} catch (e) {
		return false;
	}
}


function bxe_checkEmpty(xmlnode, makeDefault) {
	if (!makeDefault && xmlnode.vdom && xmlnode.vdom.bxeOnemptyType) {
		var par = xmlnode.parentNode;
		if (xmlnode.vdom.bxeOnemptyType == "function") {
			if (eval(xmlnode.vdom.bxeOnempty + "(xmlnode)")) {
				bxe_checkEmptyParent(par);
				return true;
			}
		}
		else if (xmlnode.vdom.bxeOnemptyType == "delete") {
			par.removeChild(xmlnode);
			bxe_checkEmptyParent(par);
			return true;
		}
	}
	if (makeDefault ||  xmlnode.vdom && (xmlnode.vdom.bxeDefaultcontent || xmlnode.vdom.bxeTabletype == "table-cell" || xmlnode.vdom.bxeTabletype == "table-col" )) {
		xmlnode.makeDefaultNodes();
	} else {
		var par = xmlnode.parentNode;
		par.removeChild(xmlnode);
		bxe_checkEmptyParent(par);
	}
/* old way....	
	if (!makeDefault && (! (xmlnode.vdom.bxeTabletype == "table-cell" || xmlnode.vdom.bxeTabletype == "table-col" ))){
		//FIXME ondelete
		xmlnode.parentNode.removeChild(xmlnode);
	} else {
		xmlnode.makeDefaultNodes();
	}*/
}



function bxe_checkEmptyParent(par) {
	//par._node.betterNormalize();
	if (par._node.childNodes.length == 0) {
		bxe_checkEmpty(par);
	} else if (par.vdom && !par.vdom.bxeOnemptyAllowWhitespace && par.isWhitespaceOnly) {
		par.removeAllChildren();
		bxe_checkEmpty(par);
	}
}

/* example function for onEmpty Function callback with
<bxe:onempty type="function">bxe_empty_para</bxe:onempty>			
can be removed later
*/

function bxe_empty_para(e) {
	e.setContent("content via callback function");
	e._node.setAttribute("__bxe_defaultcontent","true");
	bxe_Transform(false,false,e);
	return true;
}
/* end example function */

