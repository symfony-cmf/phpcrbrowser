function BxeServerClipboard() {
	var snippets;
	
	this.init = function (options) {
		bxe_config.ServerClipboard = this;
		
		this.urlfunction = options['urlfunction']; 
		this.clipNode = "_notloaded";
		
		// add button
		// it doesn't run from the filesystem, so don't register anything
		//if (window.location.protocol != "file:" ) {
			//register event	
			document.eDOMaddEventListener("ContextPopup",BxeServerClipboard_menu, false);
		//}
		
	}
	
	this.start = function() {
		if (window.location.protocol != "file:" ) {
			BxeServerClipboard_get();
		}
	}
	
	this.getCss = function() {
		return new Array();
	}
	
	this.getScripts = function() {
		return new Array();
	}
	

}
function BxeServerClipboard_menu(e) {
	
	var popup = e.additionalInfo;
	var node = e.target.XMLNode;
	if (node.vdom && node.vdom.hasAttributes && !popup.hasEditAttributes ) {
		var menui = popup.addMenuItem(bxe_i18n.getText("Edit {0} Attributes",new Array(node.vdom.bxeName)), mozilla.getWidgetGlobals().EditAttributes.popup, null,mozile_root_dir+ "images/editattribute.png");
		menui.MenuPopup._node = node._node;
	
		popup.hasEditAttributes = true;
	}
	
	
	popup.addMenuItem(bxe_i18n.getText("Copy {0} to Server",new Array(node.vdom.bxeName)), function (e) {
		var url = eval(bxe_config.ServerClipboard.urlfunction + "('POST')");
		if (url) {
			var mnode = e.currentTarget.Widget.MenuPopup.MainNode;
			var td = new mozileTransportDriver("http");
			var newnode = mnode._node.cloneNode(true);
			newnode.removeBxeIds();
			//remove internal ids
			var removeAttr = bxe_config.options['removeAttributeOnCopy'];
			if (removeAttr) {
				var res = newnode.ownerDocument.evaluate(".//@"+removeAttr, newnode , null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
				var _l = res.snapshotLength;
				for (var i = 0; i < _l; i++) {
					if (res.snapshotItem(i).ownerElement) {
						res.snapshotItem(i).ownerElement.removeAttributeNode(res.snapshotItem(i));
					}
				}
			}
			var nodestring = newnode.saveXML();
			bxe_config.ServerClipboard.clipNode = newnode;
			td.url = url;
			var req =  td.save(url, "content="+encodeURIComponent(nodestring), BxeServerClipboard_post);
		} 
	});
	var clipNode = bxe_config.ServerClipboard.clipNode;
	if (clipNode == "_notloaded") {
		
		BxeServerClipboard_get();
		
	}
	if (clipNode != "_error") {
		if (node.parentNode.isAllowedChild(clipNode.namespaceURI, clipNode.localName)) {
		
		popup.addMenuItem("Append "  +clipNode.nodeName  + " from Server", function (e) {
			
			//var url = eval(bxe_config.ServerClipboard.urlfunction + "('POST')");
			var node = e.currentTarget.Widget.MenuPopup.MainNode;
			eDOMEventCall("appendNode",document,{"appendToNode":node, "node": bxe_config.ServerClipboard.clipNode.cloneNode(true)})
			
		});
		}
	}
}

function BxeServerClipboard_post(e) {
	
	
}
function BxeServerClipboard_get() {
	var td = new mozileTransportDriver("http");
	var url = eval(bxe_config.ServerClipboard.urlfunction + "('GET')");
	td.url = url;
	var req =  td.load(url,null,false);
	if (req.document) {
		try {
			if (req.document.documentElement.localName == "parsererror") {
				bxe_config.ServerClipboard.clipNode = "_error";
			} else {
				bxe_config.ServerClipboard.clipNode = req.document.documentElement;
			}
		} catch(e) {
			bxe_config.ServerClipboard.clipNode = "_error";
		}
	} else {
		bxe_config.ServerClipboard.clipNode = "_error";
	}
}


