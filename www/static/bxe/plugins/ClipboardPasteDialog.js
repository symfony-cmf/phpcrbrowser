function BxeClipboardPasteDialog() {
	
	this.init = function (options) {
		bxe_config.BxeClipboardPasteDialog = this;
		 this.tabledelimiter = bxe_config.getContentMultiple("/config/tabledelimiter/delimiter",true);
	}
	
	this.start = function() {
		//register event
		document.eDOMaddEventListener( "ClipboardPasteDialog" , BxeTextClipboard_OpenDialog , false);
		
	}
	this.getCss = function() {
		return new Array();
	}
	
	this.getScripts = function() {
		return new Array();
	}
	
	
}

function BxeTextClipboard_OpenDialog(e,node) {
	
	var sel = window.getSelection();
	if (bxe_checkForSourceMode(sel)) {
		return false;
	}
	
	if (node ) {
		var selNode = node;
	} else {
		var cssr = sel.getEditableRange();
	
		var selNode = cssr.startContainer.XMLNode;
	}
	if (selNode.nodeType != 1) {
		var selNode = selNode.parentNode;
	}
	
	var mod = mozilla.getWidgetModalBox("Paste here", function(values) {
		var clipboard = mozilla.getClipboard();
		if (values.delimiter) {
			clipboard.delimiter = values.delimiter;
		} else {
			clipboard.delimiter = '\\t';
		}
		var content = clipboard.setData(values.clipboard);
		clipboard._system = true;
		var mod = mozilla.getWidgetModalBox();
		var _append = true;
		if (_eles[values['element']] == '__text__') {
			_append = false;
		}
		window.getSelection().paste(_eles[values['element']],mod.selNode,_append);
	});
	
	var ac = selNode.parentNode.allowedChildren;
	var _chooser = new Array();
	var _eles = new Array();
	_chooser.push("Insert as text");
	_eles["Insert as text"] = "__text__";
	for (i = 0; i < ac.length; i++) {
		if (ac[i].nodeType != 3 && ac[i].vdom.bxeClipboard ) {
			_chooser.push(ac[i].vdom.bxeName);
			_eles[ac[i].vdom.bxeName] = ac[i].vdom;
		}
	}
	
	mod.selNode = selNode;
	mod.addItem("clipboard", "", "textarea");
	mod.addItem("element", "", "select",null,_chooser,false);
	
	
	var t = bxe_config.BxeClipboardPasteDialog.tabledelimiter;
	if (t.length > 0) {
	_chooser = new Array();
	for (i = 0; i < t.length; i++) {
		_chooser[t[i].name] = t[i].value ;
	}
	
	mod.addItem("delimiter", "", "select",null,_chooser,true);
	}
	var _modBox = document.getElementById("modalBoxclipboard");
	
	 mod.node.style.width = window.innerWidth - 150 + "px"; 
	_modBox.style.width = window.innerWidth - 250 + "px"; 
	
	mod.node.style.height = window.innerHeight - 110 + "px"; 
	_modBox.style.height= window.innerHeight - 210 + "px"; 
	
	
	mod.show(100,50,"fixed");
	_modBox.focus();
	
	document.addEventListener("keypress", BxeTextClipboard_keyhandler, true);
	
}

function BxeTextClipboard_keyhandler(event) {
	
	if(event.ctrlKey || event.metaKey) {
		if(!event.charCode)
			return false;
		
		var _char = String.fromCharCode(event.charCode); 
		if (_char == "v") {
			
		} else if(_char == " " || _char == "b") {
			event.stopPropagation();
			event.returnValue = false;
			event.preventDefault();
			document.removeEventListener("keypress", BxeTextClipboard_keyhandler, true);
			document.getElementById("ModalBoxForm").focus();
			document.getElementById("__submit").click();
			
			return false;
		} else {
			var _e = document.getElementById("ModalBoxForm").element;
			var _o = _e.options;
			var _l = _o.length;
			for (var i = 0; i < _l; i++) {
				if (_o[i].text.substring(0,1).toLowerCase() == _char) {
					_o[i].selected = true;
					_e.selectedIndex = i;
					event.stopPropagation();
					event.returnValue = false;
					event.preventDefault();
					
					return false;
				}
			}
			
		}
	}
}
