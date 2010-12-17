// +--------------------------------------------------------------------------+
// | BXE                                                                      |
// +--------------------------------------------------------------------------+
// | Copyright (c) 2003,2004 Bitflux GmbH                                     |
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
// | Author: Christian Stocker <chregu@bitflux.ch>                            |
// +--------------------------------------------------------------------------+
//
// $Id: bxeNodeElements.js 1664 2007-05-03 14:22:55Z chregu $

var idCounter = 0
var bxe_xml_nodes = new Array();
Node.prototype.init = function() {
	var walker = this.ownerDocument.createTreeWalker(
		this,NodeFilter.SHOW_ALL,
	{
		acceptNode : function(node) {
			return NodeFilter.FILTER_ACCEPT;
		}
	}
	, true);

	var node = this;
	var firstChild = false;
	bxe_xml_nodes = null;
	bxe_xml_nodes = new Array();
	do  {
			if (node.nodeType == 1) {
				node.XMLNode = node.getXMLNode();
				if (!node.hasAttribute("__bxe_id")) {
					var id = "id" + idCounter++;
					node.setAttribute("__bxe_id",id);
					//node.setAttributeNS("http://www.w3.org/XML/1998/namespace","id",id);
				} else {
					var id = node.getAttribute("__bxe_id");
				}
				bxe_xml_nodes[id] = node;
				
			} else if (node.getXMLNode) {
				node.XMLNode = node.getXMLNode();
			}
			
			
		
		node = walker.nextNode();
	}  while(node );
	
	
	
	return this.XMLNode;
}

Element.prototype.setBxeId = function (removeOld) {
	
	if (removeOld || !this.hasAttribute("__bxe_id")) {
		var id = "id" + idCounter++;
		this.setAttribute("__bxe_id", id);
		return id;
	}
	
	return this.getAttribute("__bxe_id");
}

Element.prototype.setBxeIds = function (removeOld) {
	
	var walker = this.ownerDocument.createTreeWalker(
		this,NodeFilter.SHOW_ELEMENT,
	{
		acceptNode : function(node) {
			return NodeFilter.FILTER_ACCEPT;
		}
	}
	, true);

	var node = this;
	do  {
		
		node.setBxeId(removeOld);
		node = walker.nextNode();
	}  while(node );
}


Element.prototype.removeBxeIds = function () {
	
	var walker = this.ownerDocument.createTreeWalker(
		this,NodeFilter.SHOW_ELEMENT,
	{
		acceptNode : function(node) {
			return NodeFilter.FILTER_ACCEPT;
		}
	}
	, true);

	var node = this;
	do  {
		
		node.removeAttribute("__bxe_id");
		node = walker.nextNode();
	}  while(node );
}

Element.prototype.changeContainer = function(namespace, localName) {
	var keep = false;
	if (namespace == XHTMLNS) {
		var removeClass = false;
		//if (lines[i].__container.getAttribute("class"));
		if (this.XMLNode) {
			if (this.XMLNode.nodeName == this.getAttribute("class")) {
				removeClass = true;
			}
		}
		var newNode = documentCreateXHTMLElement(localName)
		if (removeClass) {
			this.removeAttribute("class");
		}
	} else {
		var newNode = document.createElementNS(XHTMLNS,"div");
		this.setAttribute("class", containerName);
	}
	
	for(var i=0; i<this.attributes.length; i++)
	{
		var childAttribute = this.attributes.item(i);
		var childAttributeCopy = childAttribute.cloneNode(true);
		newNode.setAttributeNode(childAttributeCopy);
	}
	var childContents = document.createRange();
	childContents.selectNodeContents(this);

	newNode.appendChild(childContents.extractContents());
	childContents.detach();
	this.parentNode.replaceChild(newNode, this);

	
	newNode.setAttribute("__bxe_ns", namespace);
	return newNode;
	
}

Node.prototype.getXPathString = function(rebuilt) {
	if (this._xpathstring && !rebuilt) {
		return this._xpathstring;
	}
	var prevSibling = this;
	var position = 1;
	var xpathstring = "";
	if (this.parentNode && this.parentNode.nodeType == 1) {
		xpathstring = this.parentNode.getXPathString() ;
	}
	
	prevSibling = prevSibling.previousSibling;
	if (prevSibling && prevSibling.position) {
		position = prevSibling.position+1;
	} else {
		while (prevSibling ) {
			position++;
			prevSibling = prevSibling.previousSibling
		}
	}
	this.position = position; 
	xpathstring += "/node()"  +"[" + position + "]";
	this._xpathstring = xpathstring;
	return xpathstring;
}

Node.prototype.getXMLNode = function() {	
	if (!this.XMLNode) {
		this.XMLNode = new XMLNode(this);
	}
	return this.XMLNode;
}


Element.prototype.getXMLNode = function() {	
	if (!this.XMLNode) {
		this.XMLNode = new XMLNodeElement(this);
	}
	return this.XMLNode;
}

Element.prototype.getCStyle = function(style) {
	return document.defaultView.getComputedStyle(this, null).getPropertyValue(style);
}


Node.prototype.getNamespaceDefinitions = function () {
	
	var node = this;
	var attr;
	var namespaces = new Array();
	while (node.nodeType == 1 ) {
		attr = node.attributes;
		for (var i = 0; i < attr.length; i++) {
			if (attr[i].namespaceURI == XMLNS && !(namespaces[attr[i].localName])) {
				namespaces[attr[i].localName] = attr[i].value;
			}
		}
		node = node.parentNode;
	}
	return namespaces;
}

Node.prototype.getXPathResult = function(xpath) {
	
	var nsRes = this.ownerDocument.createNSResolver(this.ownerDocument.documentElement);
	return this.ownerDocument.evaluate(xpath, this,nsRes, 0, null);
}


Node.prototype.getXPathFirst = function(xpath) {
	
	var res = this.getXPathResult(xpath);
	return res.iterateNext();
}


	
Element.prototype.betterNormalize = function () {
	this.normalize();
	var _child = this.firstChild;
	while (_child) {
			
		if (_child.nodeType == 3 && _child.data == '') {
			var _oldChild = _child;
			this.removeChild(_oldChild);
		} 
		_child = _child.nextSibling;
	}
	
}

Element.prototype.removeElementOnly = function () {
	var _child = this.firstChild
	while (_child) {
		var _oldChild = _child;
		_child = _child.nextSibling;
		this.parentNode.insertBefore(_oldChild,this);
	}
	this.parentNode.removeChild(this);
}

/**
 * Removes all children of an Element
 */ 
Element.prototype.hideAllChildren = function() 
{
	var child = this.firstChild;        
	while (child) {
		if (child.nodeType == 1) {
			child.style.display = 'none';
			
		}
		child = child.nextSibling;
		        
	}
}


Element.prototype.changeElementName = function(namespaceURI, localname) {
	bxe_history_snapshot();
	var newNode = this.ownerDocument.createElementNS(namespaceURI,localname);
	var c = this.firstChild;
	
	while ( c) {
		newNode.appendChild(c); 
		c = this.firstChild;
	}
	 this.parentNode.replaceChild(newNode,this);
	 newNode.init();
	 /*newNode.XMLNode = newNode.getXMLNode();
	
	 var _id = newNode.setBxeId();*/
	 newNode.parentNode.XMLNode.isNodeValid(true,2);
	 
	 newNode.XMLNode.makeDefaultNodes(true);
	 return newNode;
	
}

Node.prototype.getBlockParent = function() {
	var node = this;
	var c = "";
	while (node) {
		
		if (node.nodeType == 1) {
			
			if (node.ownerDocument != document) {
				c = node.XMLNode._htmlnode.getCStyle("display");
			} else {
				c = node.getCStyle("display");
			}
			if  (c == "block" || c  == "table-row" ) {
				return node;
			}
		}
		node = node.parentNode;
	}
	return null;
}

Node.prototype.getParentWithXMLNode = function() {
	var node = this;
	while (node) {
		
		if (node.nodeType == 1) {
			var nodeX = node.XMLNode;
			if (nodeX) {
				if (nodeX._node.nodeType == Node.ATTRIBUTE_NODE) {
					return node;
					
				}
				else if ( nodeX.vdom) {
					return node;
				}
			}
		}
		node = node.parentNode;
	}
	return null;
	
}

Node.prototype.getBlockParentFromXML = function() {
	var node = this;
	var c = "";
	var lastXMLNode = null;
	while (node) {
		if (node.XMLNode) {
			lastXMLNode = node.XMLNode;
		}
		if (node.nodeType == 1) {
			c = node.getCStyle("display");
			if  (c == "block" || c  == "table-row" ) {
				if (lastXMLNode) {
					return lastXMLNode;
				}
			}
		}
		node = node.parentNode;
	}
	return null;
}
			
		
Node.prototype.mergeWith= function (other) {
	
	while ( other.firstChild) {
		this.appendChild(other.firstChild);
	}
	other.parentNode.removeChild(other);
	return this;
}
	

