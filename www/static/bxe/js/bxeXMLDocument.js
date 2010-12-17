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
// $Id: bxeXMLDocument.js 1799 2007-11-26 07:30:56Z chregu $


XMLDocument.prototype.init = function (startNode) {
	if (!startNode) {
		startNode = this.documentElement;
	}
	/*if (!this.XMLNode) {*/
		this.XMLNode = new XMLNodeDocument();
		this.XMLNode._node = this;
		this.XMLNode.nodeType = 9;
		
	/*}*/
	
	return startNode.init();
}

XMLDocument.prototype.insertIntoHTMLDocument = function(htmlnode) {

	var nsResolver = new bxe_nsResolver(this.documentElement);

	var nodes = bxe_getAllEditableAreas();
	var bxe_areaHolder;
	for (var i = 0; i < nodes.length; i++) {
		if (!nodes[i].parentNode) {
			continue;
		}
		//nodes[i].removeAllChildren();
		var xpath = nodes[i].getAttribute("bxe_xpath");
		
		if (xpath && xpath != "/*[1]") {
			var xmlresult = this.evaluate(xpath, this.documentElement, nsResolver, 0, null);
		}
		//get first xmlnode
		if (xmlresult) {
			xmlnode = xmlresult.iterateNext();
		} else {
			xmlnode = false;
		}
		//FIXME: if node does not exist in XML document, make it editable anyway...
		if (xmlnode) {
			if(nodes[i].parentNode && nodes[i].parentNode.getAttribute("name") == "bxe_areaHolder") {
				bxe_areaHolder = nodes[i].parentNode ;
				var menu = nodes[i].AreaInfo;
			} else {
				if (document.defaultView.getComputedStyle(nodes[i], null).getPropertyValue("display") == "inline") { 
					bxe_areaHolder = document.createElement("span");
					nodes[i].display = "inline";
				} else {
					bxe_areaHolder = document.createElement("div");
					nodes[i].display = "block";
				}
				bxe_areaHolder.setAttribute("name","bxe_areaHolder");
				nodes[i].parentNode.insertBefore(bxe_areaHolder,nodes[i]);
				bxe_areaHolder.appendChild(nodes[i]);
				var menu = new Widget_AreaInfo(nodes[i]);
				bxe_alignAreaNode(menu,nodes[i]);
				nodes[i].AreaInfo = menu;
			}
			menu.editableArea = nodes[i];
			var xmlresults = new Array;
			while (xmlnode) {
				xmlresults.push(xmlnode);
				xmlnode = xmlresult.iterateNext();
			}
			for (var j = 0; j < xmlresults.length; j++) {
				//bxe_dump("result node type " + xmlresults[j].nodeType + xmlresults[j].nodeName+ "\n");
				if (!xmlresults[j].hasChildNodes()) {
					xmlresults[j].XMLNode.setContent("",true);//appendChild(xmlresults[j].ownerDocument.createTextNode("lalaland"));
				}
				
				xmlresults[j].XMLNode.xmlBridge = xmlresults[j]; 
				if (xmlresults[j].nodeType == 1) {
					var fc = xmlresults[j].XMLNode.insertIntoHTMLDocument(nodes[i],true);
					
				} else {
					xmlresults[j].XMLNode.insertIntoHTMLDocument(nodes[i],false);
				}
				menu.MenuPopup.setTitle(xmlresults[j].XMLNode.getXPathString());
				
			}
		} else {
			nodes[i].removeAttribute("bxe_xpath");
			var noticeNode = document.createElementNS(XHTMLNS,"span");
			noticeNode.setAttribute("class","bxe_notice");
			noticeNode.appendChild(document.createTextNode("Node " + xpath + " was not found in the XML document"));
			nodes[i].insertBefore(noticeNode,nodes[i].firstChild);
		}
		
	}
	if (!bxe_widgets_drawn) {
		bxe_draw_widgets();
		bxe_start_plugins();
		bxe_widgets_drawn = true;
	}

}

XMLDocument.prototype.checkParserError = function()
{
	alert("XMLDocument.prototype.checkParserError is deprecated!");
	return true;
}

XMLDocument.prototype.transformToXPathMode = function(xslfile) {
	try {
		bxe_about_box.addText("Load XSLT ...");
		var xsldoc = document.implementation.createDocument("", "", null);
		xsldoc.addEventListener("load", onload_xsl, false);
		xsldoc.xmldoc = this;
		xsldoc.async = true;
		xsldoc.load(xslfile);
	} catch(e) {
		bxe_catch_alert(e);
	}

	function onload_xsl(e) {
		try {
		bxe_about_box.addText("XSLT loaded...");
		xsldoc = e.currentTarget;
		
		if (!xsldoc.documentElement) {
			bxe_alert("Something went wrong during loading the XSLT document.\nSee console for details.");
			bxe_dump( "XSLDoc: " + xsldoc.saveXML());
			bxe_dump( e);
			return false;
		}
		var xsltransformdoc = document.implementation.createDocument("", "", null);
		bxe_about_box.addText("Loading transform XSLT ...");
		xsltransformdoc.addEventListener("load", this.onload_xsltransform, false);
		xsltransformdoc.xsldoc = xsldoc;
		xsltransformdoc.load(mozile_root_dir + "xsl/transformxsl.xsl");
		
		} catch(f) {
			 bxe_catch_alert(f);
		}
	}
	
	
}
XMLDocument.prototype.onload_xsltransform = function(e) {
		var processor = new XSLTProcessor();
		if (bxe_config.xmldoc._originalXslTransformDoc) {
			xsltransformdoc = bxe_config.xmldoc._originalXslTransformDoc;
			if (!bxe_config.xmldoc) {
				bxe_alert("Something went wrong during loading the Transform-XSLT document. (bxe_config.xmldoc undefined) \n Try reloading or see console for details.");
				bxe_dump( "Transform XSLDoc: " + xsltransformdoc.saveXML());
				bxe_dump( e);
				return false;
			}
			bxe_config.xmldoc._originalXslTransformDoc = null;
		} else {
			xsltransformdoc = e.currentTarget;
		}
		if (!xsltransformdoc.documentElement) {
			bxe_alert("Something went wrong during loading the Transform-XSLT document.\n Try reloading or see console for details.");
			bxe_dump( "Transform XSLDoc: " + xsltransformdoc.saveXML());
			bxe_dump( e);
			return false;
		}
		
		try {
			processor.importStylesheet(xsltransformdoc);
			if (!xsltransformdoc.xsldoc) {
				bxe_alert("Something went wrong during loading the Transform-XSLT document. (xsltransformdoc.xsldoc undefined)\n Try reloading or see console for details.");
				bxe_dump( "Transform XSLDoc: " + xsltransformdoc.saveXML());
				bxe_dump( e);
				return false;
			}
			
			var newDocument = processor.transformToDocument(xsltransformdoc.xsldoc);
			// we have to reparse the transformed document, otherwise
			// mozilla has a problem with xsl matchers with namespaces :(
			newDocument = newDocument.saveXML(newDocument);
			var parser = new DOMParser();
			newDocument = parser.parseFromString(newDocument,"text/xml");
		} catch (f) {
			bxe_config.xmldoc._originalXslTransformDoc = xsltransformdoc;
			// try again later, if an error happens in transformations
			if (typeof bxe_config.xmldoc._originalXslTransformCounter == 'undefined') {
				bxe_config.xmldoc._originalXslTransformCounter = 0;
			} 
			if (bxe_config.xmldoc._originalXslTransformCounter > 20) {
				alert ( f + "\n\n "+bxe_i18n.getText("xsltransformdoc.xsldoc is : ") + xsltransformdoc.xsldoc);
			} else {
				bxe_config.xmldoc._originalXslTransformCounter++;
				bxe_about_box.addText(bxe_config.xmldoc._originalXslTransformCounter);
				window.setTimeout("bxe_config.xmldoc.onload_xsltransform(bxe_config.xmldoc._originalXslTransformEvent)",300);
			}
			return;
			//
		}
		processor = new XSLTProcessor();
		try {
			for (var i in bxe_config.xslparams) {
				if (bxe_config.xslparams[i].name && typeof bxe_config.xslparams[i].value != 'undefined') {
					processor.setParameter(null,bxe_config.xslparams[i].name, bxe_config.xslparams[i].value);
				}
			}
		
			processor.importStylesheet(newDocument);
		} catch(e) {
			//bxe_dump(newDocument.saveXML(newDocument));
			var widg = mozilla.getWidgetModalBox("Load Error");
			widg.addText("Something went wrong during importing the XSLT document");
			widg.addText("See console for details.");
			widg.show((window.innerWidth- 500)/2,50, "fixed");
			bxe_dump(bxe_catch_alert_message(e) + "\n" + newDocument.saveXML(newDocument));
			return;
		}
		bxe_config.processor = processor;
		/*
		var xmldoc = processor.transformToFragment(xsltransformdoc.xsldoc.xmldoc,document);
		var bxe_area = document.getElementById("bxe_area");
		bxe_area.removeAllChildren();
		bxe_area.appendChild(xmldoc);
		*/
		
		//bxe_area.parentNode.replaceChild(xmldoc,bxe_area);
		//xsltransformdoc.xsldoc.xmldoc.insertIntoHTMLDocument();
		
			
		if (!bxe_widgets_drawn) {
			bxe_draw_widgets();
			bxe_start_plugins();
			bxe_widgets_drawn = true;
		}
		xml_loaded(xsltransformdoc.xsldoc.xmldoc);
	}
	

XMLDocument.prototype.importXHTMLDocument = function(xhtmlfile) {
	
	function onload_xhtml(e) {
		var xhtmldoc = e.currentTarget;
		debug ("XHTML loaded");
		
		bxe_about_box.addText(bxe_i18n.getText("XHTML loaded..."));
		var bxe_area = document.getElementsByTagName("body")[0];
		var bodyInXhtml = xhtmldoc.getElementsByTagName("body");
		if (!(bodyInXhtml && bodyInXhtml.length > 0)) {
			bxe_about_box.addText(bxe_i18n.getText(" Loading Failed. no 'body' element found in your external XHTML document."));
			alert(bxe_i18n.getText("no 'body' element found in your external XHTML document. "));
			return false; 
		}
		var new_body = document.importNode(bodyInXhtml[0],true);
		bxe_about_box.node = new_body.appendChild(bxe_about_box.node);
		if (bxe_config.options['ExternalXhtmlReplaceBodyChildren'] != 'false') {
		  	bxe_area.removeAllChildren();
		}
		bxe_area.appendAllChildren(new_body);
		xhtmldoc.xmldoc.insertIntoHTMLDocument();
		var links =  xhtmldoc.getElementsByTagName("link");
		
		var head = document.getElementsByTagName("head")[0];
		for (var i = 0; i < links.length; i++) {
			head.appendChild(document.importNode(links[i],true));
		}
			
		xml_loaded(xhtmldoc.xmldoc);
	}
	
	bxe_about_box.addText("Import external XHTML ...");
	var xhtmldoc = document.implementation.createDocument("", "", null);
	xhtmldoc.addEventListener("load", onload_xhtml, false);
	xhtmldoc.xmldoc = this;
	bxe_dump("start loading " + xhtmlfile + "\n");
	try {
		xhtmldoc.load(xhtmlfile);
	} catch(e) {
		alert(bxe_i18n.getText("The xhtmlfile: '{0}' was not found",new Array(xhtmlfile)));
	}

	
}



function XMLNodeDocument () {
	
}


XMLNodeDocument.prototype.__defineGetter__( 
	"documentElement",
	function()
	{
		return this._documentElement;
	}
);

XMLNodeDocument.prototype.__defineSetter__( 
	"documentElement",
	function(value)
	{
		this._documentElement = value;
	}
);

XMLNodeDocument.prototype.buildXML = function() {
	
	var node = this.documentElement.buildXML();
	return node.ownerDocument;
}

XMLNode.prototype.buildXML = function () {
	var nsResolver = new bxe_nsResolver(this.ownerDocument.documentElement);
	
	var walker = new XMLNodeWalker(this);
	var srcNode;
	if (this.xmlBridge) {
		srcNode = this.xmlBridge;
	} else {
		srcNode = this._node;
	}
	
	
	srcNode.removeAllChildren();
	var xmldoc = srcNode.ownerDocument;
	
	var node = walker.nextNode();
	
	srcNode.XMLNode._sernode = srcNode;
	
	var child ;
	var attribs;
	while (node) {
		if (node.nodeType == 1 && node.localName != 0){
			child = xmldoc.createElementNS(node.namespaceURI, node.localName);
			if (node.namespaceURI  != XHTMLNS) {
				child.prefix = nsResolver.lookupNamespacePrefix(node.namespaceURI);
			}
			attribs = node.attributes;
			for (var i = 0; i< attribs.length; i++) {
				child.setAttributeNS(attribs[i].namespaceURI,attribs[i].localName,attribs[i].value);
			}
			if (node.namespaceURI == XHTMLNS && child.getAttribute("class") == node.localName) {
				child.removeAttribute("class");
			}
		} else if (node.nodeType == 3) {
			child = xmldoc.importNode(node._node.cloneNode(true),true);
		} else {
			child = xmldoc.importNode(node._node.cloneNode(true),true);
		}
		
		node._sernode = child;
		if (node.parentNode && node.parentNode._sernode) {
			try {
				node.parentNode._sernode.appendChild(child);
			} catch(e) {
				debug (child + " could not be appended to " + node.parentNode);
			}
		}
		node = walker.nextNode();
	}
	return srcNode;
}


