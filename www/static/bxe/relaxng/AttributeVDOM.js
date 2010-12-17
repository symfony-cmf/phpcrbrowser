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
// $Id: AttributeVDOM.js 1682 2007-05-22 14:15:29Z chregu $

function AttributeVDOM(node, option) {
	this.type = "RELAXNG_ATTRIBUTE";
	this.name = node.getAttribute("name");
	this.dataType = "NCName";
	if (option == "optional" || node.getAttribute("type") == "optional") {
		this.optional = true;
	} else {
		this.optional = false;
	}
	var childNodes = node.childNodes;
	for (var i = 0; i < childNodes.length;i++  ) {
		if ((childNodes[i].nodeType == 1 && childNodes[i].namespaceURI == "http://bitfluxeditor.org/schema/2.0")) {
			switch (childNodes[i].localName) {
				case "name":
					this._bxeName = childNodes[i].firstChild.data;
					break;
				case "defaultcontent":
					this.bxeDefaultcontent = childNodes[i].firstChild.data;
					this.bxeDefaultcontentType = childNodes[i].getAttribute("type");
					break;
				case "onnew":
					this.bxeOnnew = childNodes[i].firstChild.data;
					break;
				case "dontshow":
					this.bxeDontshow = true;
					break;
				case "noteditable":
					this.bxeNoteditable = true;
					break;
				case "helptext":
					this.bxeHelptext = childNodes[i].firstChild.data;
					break;
				case "selector":
					this.bxeSelector = childNodes[i].firstChild.data;
					this.bxeSelectorType = childNodes[i].getAttribute("type");
			}
		}
		else if (childNodes[i].nodeName == "data") {
			this.dataType = childNodes[i].getAttribute("type");
		}
		else if (childNodes[i].nodeName == "choice") {
			this.dataType = "choice";
			this.choices = new Array();
			var choice = childNodes[i].childNodes;
			if (this.optional) {
				this.choices.push("");
			}
			for (var j = 0; j < choice.length; j++) {
				if (choice[j].localName == "value" && choice[j].firstChild) {
					this.choices.push(choice[j].firstChild.data);
				}
			}
		} 
	}
	
	
}

AttributeVDOM.prototype.isValid = function(ctxt) {
	var o = null;
	if (ctxt.node._node) {
		o = ctxt.node._node;
	} 
	if (o != null && !this.optional && !(o.hasAttribute(this.name))) {
		if (ctxt.wFValidityCheckLevel & 2) {
			if (this.bxeOnnew) {
				eval(this.bxeOnnew +"(ctxt.node, this.name)");
				return this.isValid(ctxt);
			} else if (this.bxeDefaultcontentType == "function") {
				o.setAttribute(this.name, eval(this.bxeDefaultcontent +"(ctxt.node)"));
				return this.isValid(ctxt);
			} else if (this.bxeDefaultcontent) {
				o.setAttribute(this.name, this.bxeDefaultcontent);
				return this.isValid(ctxt);
			} else {
				var newValue = prompt(ctxt.node.nodeName + " does not have the required attribute " + this.name + "\nPlease provide one");
				if (newValue) {
					o.setAttribute(this.name, newValue);
					return this.isValid(ctxt);
				}
			}
		} 
		ctxt.setErrorMessage(ctxt.node.nodeName + " does not have the required attribute " + this.name);
		return false;
	} else if (o && this.choices) {
		var value = o.getAttribute(this.name);
		if (value) {
			for (var i = 0; i < this.choices.length; i++) {
				if (this.choices[i] == value) {
					return true;
				}
			}
			var errMsg = "'" +value + "' is not an allowed value for attribute '" + this.name + "' in '" + ctxt.node.nodeName +"'";
			ctxt.setErrorMessage(errMsg);
			return false
		} else {
			return true;
		}
	} else {
		return true;
	}
	
}
