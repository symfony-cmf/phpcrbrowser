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
// $Id: bxeXMLNode.js 1814 2007-12-05 17:44:14Z chregu $


function XMLNode  (_xmlnode) {
	this._node = _xmlnode;
}




XMLNode.prototype.__defineGetter__( 
	"namespaceURI",
	function()
	{
	
		if (this._node.namespaceURI == null) {
			return "";
		}
		return this._node.namespaceURI;
		 
	}
);


XMLNode.prototype.__defineGetter__( 
	"parentNode",
	function()
	{
		try{
			return this._node.parentNode.getXMLNode();
		} catch (e) {
			if (this._node.nodeType == 2) {
				return this._node.ownerElement.getXMLNode();
			}
			return null;
		}
	}
);

XMLNode.prototype.__defineGetter__( 
	"firstChild",
	function()
	{
		
		if (this._node.firstChild) {
			if (!this._node.firstChild.XMLNode) {
				this._node.firstChild.XMLNode = this._node.firstChild.getXMLNode();
			}
			return this._node.firstChild.XMLNode;
		} else {
			return null;
		}
	}
);

XMLNode.prototype.__defineGetter__( 
	"nextSibling",
	function()
	{
		if (this._node.nextSibling) {
			if (!this._node.nextSibling.XMLNode) {
				this._node.nextSibling.XMLNode = this._node.nextSibling.getXMLNode();
			}
			return this._node.nextSibling.XMLNode;
		} else {
			return null;
		}
	}
);

XMLNode.prototype.__defineGetter__( 
	"previousSibling",
	function()
	{
		if (this._node.previousSibling) {
			if (!this._node.previousSibling.XMLNode) {
				this._node.previousSibling.XMLNode = this._node.previousSibling.getXMLNode();
			}
			return this._node.previousSibling.XMLNode;
		} else {
			return null;
		}
	}
);

XMLNode.prototype.__defineGetter__( 
	"nodeValue",
	function()
	{
		return this._node.nodeValue;
	}
);


XMLNode.prototype.__defineGetter__(
"isWhitespaceOnly",
function()
{
	if (this._node.nodeType == 3) {
		if(/\S+/.test(this._node.nodeValue)) {// any non white space visible characters
			return false;
		}
		
		return true;
	} else {
		if (this._node.nodeType == 1) {
			var c = this._node.firstChild;
			while (c) {
				if ( c.nodeType != 3) {
					return false;
				}
				if (!c.isWhitespaceOnly) {
					return false;
				}
				c = c.nextSibling;
			}
			return true;
		}
		return false;
	}
}
);



XMLNode.prototype.__defineGetter__( 
	"localName",
	function()
	{
		return this._node.localName;
	}
);


XMLNode.prototype.__defineGetter__( 
	"nodeType",
	function()
	{
		return this._node.nodeType;
	}
);


XMLNode.prototype.__defineGetter__( 
	"nodeName",
	function()
	{
		return this._node.nodeName;
	}
);


XMLNode.prototype.__defineGetter__( 
	"ownerDocument",
	function()
	{
		return this._node.ownerDocument.XMLNode;
	}
);

XMLNode.prototype.hasChildNodes = function() {
	return this._node.hasChildNodes();

}
//"Real" means elements or textnodes without whitespace only textnodes
XMLNode.prototype.hasRealChildNodes = function() {
	if (! this._node.hasChildNodes()) {
		return false;
	}
	
	var _n = this._node.firstChild;
	do {
		if (_n.nodeType == 1) {
			return true;
		} else if (_n.nodeType == 3 && (/\S+/.test(_n.nodeValue))) {
			return true;
		}
		_n = _n.nextSibling;
	} while (_n);
	return false;

}


XMLNode.prototype.__defineGetter__( 
	"allowedChildren",
	function()
	{
		var ac = this.vdom.allowedChildren;
		if (ac) {
			return ac;
		} else {
			return new Array();
		}
	}
);

XMLNode.prototype.isInHTMLDocument = function() {
	return true;
}

// (Node) newNode, (Node) oldNode
XMLNode.prototype.insertBeforeIntern = function(newNode, oldNode) {
	try {
	var _newNode = this._node.insertBefore(newNode,oldNode);
	return _newNode.getXMLNode();
	} catch (e) {
		alert(this._node);
		alert(newNode);
		alert(oldNode);
	}
	
}


// (Node) newNode
XMLNode.prototype.appendChildIntern = function(newNode) {
	try {
	var _newNode = this._node.appendChild(newNode);
	return _newNode.getXMLNode();
	} catch (e) {
		alert(this._node);
		alert(newNode);
		alert(oldNode);
	}
	
}


XMLNode.prototype.unlink = function() {
	this.XMLNode = null;
	var par = this.parentNode;
	par._node.removeChild(this._node);
}

function XMLNodeElement	 (_xmlnode) {
	this._node = _xmlnode;
}

XMLNode.prototype.copy  = function () {
	

	var cssr = bxe_config.xmldoc.createRange();
	cssr.selectNode(this._node);
	// data to save - render as text (temporary thing - move to html later)
	var clipboard = mozilla.getClipboard();

	// clipboard.setData(deletedFragment.saveXML(), "text/html"); // go back to this once, paste supports html paste!
	clipboard.setData(cssr,MozClipboard.TEXT_FLAVOR);
}


XMLNode.prototype.cut  = function () {
	
    this.copy();
    
    var par = this.parentNode
    try {
        var _prev = this._htmlnode.previousSibling;
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
    this.unlink();
    
    bxe_Transform(false,false,par);
    
    
}

XMLNode.prototype.insertAfter = function(newNode, oldNode) {



	return this.insertBefore(newNode,oldNode.nextSibling);
}
// (Node) newNode, (Node) oldNode
XMLNode.prototype.insertBefore = function(newNode,oldNode) {
	//newNode = this._node.appendChild(newNode);
	if (oldNode) {
		newNode._node = this._node.insertBefore(newNode,oldNode);
	} else {
		newNode._node=this._node.insertBefore(newNode,null);
	}
	
	newNode.XMLNode = newNode.getXMLNode();
	
	return newNode.XMLNode;
}


XMLNode.prototype.removeChild = function (child) {
	child.unlink();
	
}
// (XMLNode) newNode
XMLNode.prototype.appendChild = function(newNode) {
/*	
	for( var i in newNode.attributes) {
		newNode._node.setAttribute(i,newNode.attributes[i]);
	}*/
	//FIXME attribues
	
	
	var child = newNode.firstChild;
	while (child) {
		newNode._node.appendChild(child._node);
		child = child.nextSibling;
	}
	
	newNode_node = this._node.appendChild(newNode._node);
	newNode._node = newNode_node;
//	this.appendChildIntern(newNode);
	return newNode;
}

XMLNodeElement.prototype = new XMLNode();

XMLNodeElement.prototype.makeDefaultNodes = function(noPlaceholderText) {
	if (!this.vdom) {
		return false;
	}
	
	if (this.vdom.bxeOnnewType == "function") {
		window.bxe_lastNode = this;
		 return eval(this.vdom.bxeOnnew + "(this)") ;
	}
	return this.makeDefaultNodes2(noPlaceholderText);
}


XMLNodeElement.prototype.makeDefaultNodes2 = function(noPlaceholderText) {
	var ret = false;
	var cHT  =  this.canHaveText;
	if (!noPlaceholderText) {
		if (cHT ) {
			if (this.vdom && this.vdom.bxeDefaultcontent) {
				
				if (this.vdom.bxeDefaultcontentType == "function") {
					this.setContent(eval(this.vdom.bxeDefaultcontent + "(this)"));
				} else if (this.vdom.bxeDefaultcontentType != "element") {
					this.setContent(this.vdom.bxeDefaultcontent);
					this._node.setAttribute("__bxe_defaultcontent","true");
				}
			} else {
				this.setContent("#" + this.localName );
				this._node.setAttribute("__bxe_defaultcontent","true");
			}
			
			
			
		} else {
			if (this.vdom && this.vdom.bxeDefaultcontent && this.vdom.bxeDefaultcontentType == "element") {
				eDOMEventCall("appendChildNode",document,{"noTransform": true, "appendToNode": this, "localName":this.vdom.bxeDefaultcontent,"namespaceURI":this.vdom.bxeDefaultcontentNamespaceUri});
				ret = this;
			} else {
				var ac = this.allowedChildren;
				if (ac.length == 1)  {
					if (!ac[0].optional) {
						eDOMEventCall("appendChildNode",document,{"noTransform": true, "appendToNode": this, "localName":ac[0].localName,"namespaceURI":ac[0].namespaceURI});
					}
					ret = this;
				} else if (ac.length > 1) {
					var _hasMust = false;
					for ( var i in ac) {
						if (!(ac[i].optional ) ) { 
							eDOMEventCall("appendChildNode",document,{"noTransform": true, "appendToNode": this, "localName":ac[i].localName,"namespaceURI":ac[i].namespaceURI});
							_hasMust =true;
						}
						
					}
					if (!_hasMust) {
						bxe_context_menu.buildElementChooserPopup(this,ac);
						return true;
					} else {
						ret = this;
						
					}
				}
			}
			
			
		}
	}
	
	
	if (this.vdom.bxeOnnewType == "popup") {
		bxe_Transform(false,false,this);
		window.bxe_lastNode = this;
		//for BCs sake...
		window.bxe_ContextNode = this;
		var pop = window.open(this.vdom.bxeOnnew,"foobar","width=600,height=600,resizable=yes,scrollbars=yes");
		pop.focus();
		
		return true;
	}
	if (ret) {
		bxe_Transform(false,false,this,2);
		return true;
	}
	
	return false;
}

XMLNodeElement.prototype.setContent = function (text, autocreate) {
	this.removeAllChildren();
	var mmmh = bxe_config.xmldoc.createTextNode(text);
	this._node.appendChild(mmmh);
	mmmh.XMLNode = mmmh.getXMLNode();
}

XMLNodeElement.prototype.removeAllChildren = function() {
	var child = this.firstChild;
	while (child) {
		var oldchild = child;
		child = child.nextSibling;
		oldchild.unlink();
	}
}


XMLNodeElement.prototype.isAllowedNextSibling = function (namespaceURI, localName) {
	var aNS = this.allowedNextSiblings;
	
	for (i = 0; i < aNS.length; i++) {
		if (aNS[i].namespaceURI == namespaceURI && aNS[i].localName == localName) {
			return true;
		}
	}
	return false;
	
}


XMLNodeElement.prototype.getAttribute = function (name) {
	
	return this._node.getAttribute(name);
}

XMLNodeElement.prototype.setAttribute = function (name,value) {
	return this._node.setAttribute(name,value);
}

XMLNodeElement.prototype.removeAttribute = function (name) {
	
	return this._node.removeAttribute(name);
}


