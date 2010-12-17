var mozilla=new Moz();
function Moz(){this.__allowedNativeCalls=false
}Moz.prototype.getClipboard=function(){if(this._clipboard){return this._clipboard
}return this._clipboard=new MozClipboard(this.__allowedNativeCalls)
};
function MozClipboard(A){this._clipboard=null;
if(A){this.nativeSupport=true;
this._system=true;
netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
this.clip=Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard)
}else{this.nativeSupport=false;
this._system=false
}}MozClipboard.TEXT_FLAVOR="text/unicode";
MozClipboard.HTML_FLAVOR="text/html";
MozClipboard.prototype.getData=function(C){if(!this.nativeSupport){if(this._clipboard){return this._clipboard.cloneNode(true)
}else{return document.createTextNode("")
}}else{netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
var B=Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
if(C!=MozClipboard.TEXT_FLAVOR){B.addDataFlavor(C)
}B.addDataFlavor(MozClipboard.TEXT_FLAVOR);
this.clip.getData(B,this.clip.kGlobalClipboard);
var E=new Object();
var A=new Object();
try{B.getTransferData(C,E,A)
}catch(D){try{B.getTransferData(MozClipboard.TEXT_FLAVOR,E,A)
}catch(D){return this._clipboard.cloneNode(true)
}}E=E.value.QueryInterface(Components.interfaces.nsISupportsString);
if(E){E=(E.data.substring(0,A.value/2))
}if(E==this._clipboardText){return this._clipboard.cloneNode(true)
}else{return document.createTextNode(E)
}}};
MozClipboard.prototype.setData=function(B,H){this._clipboardRootName=null;
if(typeof B=="string"){B=document.createTextNode(B);
this._clipboard=B;
this._clipboardText=B.data
}else{if(B.nodeType==11){this._clipboard=B;
this._clipboardText=B.saveXML()
}else{this._clipboard=B.cloneContents();
try{var I=B.startContainer.childNodes.item(B.startOffset);
this._clipboardRootName=I.XMLNode.vdom.bxeName
}catch(E){}var D=bxe_config.options["removeAttributeOnCopy"];
if(D){var F=this._clipboard.ownerDocument.evaluate(".//@"+D,this._clipboard.firstChild,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var A=F.snapshotLength;
for(var C=0;
C<A;
C++){if(F.snapshotItem(C).ownerElement){F.snapshotItem(C).ownerElement.removeAttributeNode(F.snapshotItem(C))
}}}this._clipboardText=B.toString()
}}if(this.nativeSupport){B=B.toString();
netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
var G=Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
G.data=B;
var J=Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
J.addDataFlavor(H);
J.setTransferData(H,G,B.length*2);
this.clip.setData(J,null,this.clip.kGlobalClipboard);
this.clip.forceDataToClipboard(this.clip.kGlobalClipboard)
}};
Moz.prototype.enableCaretBrowsing=function(){netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
var A=Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch(null);
if(!A.getBoolPref("accessibility.browsewithcaret")){A.setBoolPref("accessibility.browsewithcaret",true)
}};
Moz.prototype.disableCaretBrowsing=function(){netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
var A=Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch(null);
if(A.getBoolPref("accessibility.browsewithcaret")){A.setBoolPref("accessibility.browsewithcaret",false)
}};
Moz.prototype.createFilePicker=function(B,A){if(!this.__allowedNativeCalls){return null
}return new MozFilePicker(B,A)
};
function MozFilePicker(B,A){netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
this.nsIFilePicker=Components.interfaces.nsIFilePicker;
this.fp=Components.classes["@mozilla.org/filepicker;1"].createInstance(this.nsIFilePicker);
if(B==MozFilePicker.MODE_SAVE){this.fp.init(window,A,this.nsIFilePicker.modeSave)
}this.__file=null
}MozFilePicker.MODE_SAVE=0;
MozFilePicker.FILTER_HTML=1;
MozFilePicker.prototype.addFilter=function(A){netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
if(A==MozFilePicker.FILTER_HTML){this.fp.appendFilters(this.nsIFilePicker.filterHTML)
}};
MozFilePicker.prototype.promptUser=function(){netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
var A=this.fp.show();
if(A==this.nsIFilePicker.returnCancel){return false
}this.__file=new MozLocalFile(this.fp.file);
return true
};
MozFilePicker.prototype.__defineGetter__("file",function(){return this.__file
});
function MozLocalFile(A){this.__native=A
}MozLocalFile.prototype.write=function(C){netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
var B=Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
B.init(this.__native,-1,-1,0);
var A=B.write(C,C.length);
B.flush();
B.close()
};
function Widget(){}Widget.prototype.position=function(C,B,A){if(A){this.node.style.position=A
}this.node.style.left=C+"px";
this.node.style.top=B+"px"
};
Widget.prototype.initNode=function(A,B,D){var C=document.createElement(A);
C.setAttribute("class",B);
C.setAttribute("__bxe_noteditable","true");
if(D){C.setAttribute("id",D)
}C.style.display="none";
C.Widget=this;
this.Display="inline";
return C
};
Widget.prototype.draw=function(B,A){if(B){this.node.style.display=B
}else{this.node.style.display=this.Display
}this.fixOffscreenPosition(A)
};
Widget.prototype.fixOffscreenPosition=function(A){var B=(this.node.offsetTop+this.node.offsetHeight);
this.node.style.maxHeight=window.innerHeight+"px";
if(B>(window.innerHeight+window.scrollY)){this.node.style.top=(this.node.offsetTop-(B-(window.innerHeight+window.scrollY)))+"px"
}if(this.node.offsetTop<0){this.node.style.top=0+"px";
this.node.style.overflow="auto"
}else{if(A){this.node.style.overflowY="auto";
this.node.style.overflowX="hidden"
}else{this.node.style.overflow="hidden"
}}var C=(this.node.offsetLeft+this.node.offsetWidth);
if(C>(window.innerWidth+window.scrollX)){if(!this.isSubpopup){C=C+50
}this.node.style.left=(this.node.offsetLeft-(C-(window.innerWidth+window.scrollX)))+"px"
}};
Widget.prototype.hide=function(){var A=window.getSelection();
if(this.cssr){try{A.selectEditableRange(this.cssr)
}catch(B){}}else{if(A.anchorNode&&A.anchorNode.compareDocumentPosition(this.node)&Node.DOCUMENT_POSITION_CONTAINS){A.collapse(document.documentElement.firstChild,0)
}}this.node.style.display="none"
};
Widget_AreaInfo.prototype=new Widget();
function Widget_AreaInfo(A){}function Widget_AreaInfo_eventHandler(A){this.Widget.MenuPopup.position(A.pageX,A.pageY,"absolute");
this.Widget.MenuPopup.draw();
A.preventDefault();
A.stopPropagation()
}function Widget_MenuPopup(B,A){this.node=this.initNode("div","MenuPopup");
this.isSubpopup=A;
if(B){this.initTitle(B)
}document.getElementsByTagName("body")[0].appendChild(this.node);
this.Display="block";
this.MenuItems=new Array()
}Widget_MenuPopup.prototype=new Widget();
Widget_MenuPopup.prototype.initTitle=function(B){var A=this.node.insertBefore(document.createElement("div"),this.node.firstChild);
A.setAttribute("class","MenuPopupTitle");
A.appendChild(document.createTextNode(B));
this.hasEditAttributes=false;
this.titleSet=true
};
Widget_MenuPopup.prototype.setTitle=function(A){if(!this.titleSet){this.initTitle(A)
}else{this.node.firstChild.firstChild.data=A
}};
Widget_MenuPopup.prototype.draw=function(A){var B=mozilla.getWidgetGlobals();
if(!A){B.addHideOnClick(this);
this.deregisteredKeyHandlers=false
}else{bxe_deregisterKeyHandlers();
this.deregisteredKeyHandlers=true
}this.node.style.display=this.Display;
this.fixOffscreenPosition()
};
Widget_MenuPopup.prototype.addSeparator=function(B){if(!B){B=""
}if(this.MenuItems.length>0){if(this.node.lastChild.getAttribute("class")!="MenuItemSeparator"){var A=document.createElement("div");
A.setAttribute("class","MenuItemSeparator");
A.appendChild(document.createTextNode("--"+B+"--"));
this.node.appendChild(A)
}}};
Widget_MenuPopup.prototype.addMenuItem=function(A,D,C,B){var E=new Widget_MenuItem(A,D,C,B);
E.MenuPopup=this;
this.MenuItems.push(E);
this.node.appendChild(E.node);
E.node.addEventListener("mouseover",Widget_MenuItem_hideSubmenu,false);
E.node.addEventListener("click",function(){if(this.Widget.MenuPopup.deregisteredKeyHandlers){this.Widget.MenuPopup.hide();
bxe_registerKeyHandlers();
this.Widget.MenuPopup.deregisteredKeyHandlers=false
}},false);
return E
};
Widget_MenuPopup.prototype.removeAllMenuItems=function(){this.titleSet=false;
this.node.removeAllChildren();
this.MenuItems=new Array()
};
function Widget_MenuItem(B,E,D,C){this.node=this.initNode("div","MenuItem");
this.node.style.display="block";
if(D){this.node.setAttribute("title",D)
}if(C){var A=this.node.appendChild(document.createElement("img"));
A.src=C;
A.setAttribute("align","right");
this.node.appendChild(A)
}this.node.appendChild(document.createTextNode(B));
this.node.onclick=E;
this.node.Action=E
}Widget_MenuItem.prototype=new Widget();
Widget_MenuItem.prototype.__defineSetter__("Label",function(A){this.node.firstChild.nodeValue=A
});
Widget_MenuItem.prototype.__defineGetter__("Label",function(){return this.node.firstChild.nodeValue
});
Widget_MenuItem.prototype.__defineSetter__("Disabled",function(A){if(A){this.node.onclick=null;
this.node.setAttribute("class","MenuItemDisabled")
}else{this.node.onclick=this.node.Action;
this.node.setAttribute("class","MenuItem")
}});
Widget_MenuItem.prototype.__defineGetter__("Disabled",function(){if(this.node.GetAttribute("class")=="MenuItemDisabled"){return true
}else{return false
}});
Widget_MenuItem.prototype.__defineSetter__("Checked",function(A){if(A){this.node.setAttribute("class","MenuItemChecked")
}else{this.node.setAttribute("class","MenuItem")
}});
Widget_MenuItem.prototype.__defineGetter__("Checked",function(){if(this.node.GetAttribute("class")=="MenuItemChecked"){return true
}else{return false
}});
Widget_MenuItem.prototype.addMenu=function(C,B){var A=this.node.appendChild(document.createElement("img"));
A.src=mozile_root_dir+"images/triangle.png";
A.setAttribute("align","right");
this.node.insertBefore(A,this.node.firstChild);
this.SubMenu=C;
if(B){this.node.addEventListener("mouseover",B,false)
}this.node.addEventListener("mouseover",Widget_MenuItem_showSubmenu,false)
};
function Widget_MenuItem_showSubmenu(B){var A=this.Widget;
var C=0;
if(A.SubMenu.titleSet){C=-14
}var D=0;
if(A.node.parentNode.style.position=="fixed"){D=window.scrollY
}A.SubMenu.position(window.scrollX+A.node.offsetParent.offsetLeft+A.node.offsetLeft+(A.node.offsetWidth/2),D+A.node.offsetParent.offsetTop+A.node.offsetTop+C,"absolute");
A.SubMenu.draw();
if(A.SubMenu.OpenSubMenu){A.SubMenu.OpenSubMenu.hide()
}if(A.MenuPopup.OpenSubMenu&&A.MenuPopup.OpenSubMenu!=A.SubMenu){A.MenuPopup.OpenSubMenu.hide()
}A.MenuPopup.OpenSubMenu=A.SubMenu
}function Widget_MenuItem_hideSubmenu(){var A=this.Widget;
if(A.SubMenu&&A.SubMenu.OpenSubMenu){A.SubMenu.OpenSubMenu.hide()
}if(A.MenuPopup&&A.MenuPopup.OpenSubMenu&&A.MenuPopup.OpenSubMenu!=A.SubMenu){A.MenuPopup.OpenSubMenu.hide()
}}function Widget_Globals(){this.EditAttributes=new Widget_ModalAttributeBox()
}Widget_Globals.prototype.addHideOnClick=function(B,A){if(!this.HideOnClick){this.HideOnClick=new Array()
}if(!this.HideOnClickOther){this.HideOnClickOther=new Array()
}if(A){this.HideOnClickOther.push(B)
}else{this.HideOnClick.push(B);
document.addEventListener("click",Widget_Globals_doHideOnClick,true);
document.addEventListener("contextmenu",Widget_Globals_doHideOnClick,true)
}};
Widget_Globals_doHideOnClickOther=function(C){var D=mozilla.getWidgetGlobals();
if(D.HideOnClickOther&&D.HideOnClickOther.length>0){var A=new Array();
var B=null;
while(B=D.HideOnClickOther.pop()){if(B.isElementChooser&&C.target.className!="MenuItem"){while(!bxe_config.xmldoc.XMLNode.validateDocument(true)){bxe_history_undo()
}}if(B.callbackCancel){B.callbackCancel()
}else{B.hide()
}}if(typeof BxeTextClipboard_keyhandler=="function"){document.removeEventListener("keypress",BxeTextClipboard_keyhandler,true)
}bxe_registerKeyHandlers();
D.HideOnClickOther=A
}};
Widget_Globals_doHideOnClick=function(C){var D=mozilla.getWidgetGlobals();
document.removeEventListener("click",Widget_Globals_doHideOnClick,false);
document.removeEventListener("contextmenu",Widget_Globals_doHideOnClick,true);
if(D.HideOnClick&&D.HideOnClick.length>0){var A=new Array();
var B=null;
while(B=D.HideOnClick.pop()){if(B.isElementChooser&&C.target.className!="MenuItem"){while(!bxe_config.xmldoc.XMLNode.validateDocument(true)){bxe_history_undo()
}}B.hide()
}D.HideOnClick=A
}};
function Widget_MenuBar(){this.node=this.initNode("div","MenuBar");
document.getElementsByTagName("body")[0].appendChild(this.node);
this.position(0,0,"fixed");
this.draw()
}Widget_MenuBar.prototype=new Widget();
Widget_MenuBar.prototype.addMenu=function(A,B){var C=new Widget_Menu(A);
this.node.appendChild(C.node);
C.draw();
C.addMenuPopup(B)
};
function Widget_Menu(A,B){this.node=this.initNode("span","Menu");
this.node.appendChild(document.createTextNode(A))
}Widget_Menu.prototype=new Widget();
Widget_Menu.prototype.addMenuPopup=function(A){var C=new Widget_MenuPopup();
if(A){var B=null;
while(B=A.shift()){C.addMenuItem(B,A.shift())
}}C.position(this.node.offsetLeft+5,this.node.offsetTop+this.node.offsetHeight,"fixed");
this.MenuPopup=C;
this.node.addEventListener("click",function(D){this.Widget.MenuPopup.draw();
var E=mozilla.getWidgetGlobals()
},false)
};
Moz.prototype.getWidgetGlobals=function(){if(this.WidgetGlobals){return this.WidgetGlobals
}this.WidgetGlobals=new Widget_Globals();
return this.WidgetGlobals
};
Moz.prototype.getWidgetModalBox=function(A,C,B){if(this.ModalBox){this.ModalBox.reset(A,C,B)
}else{this.ModalBox=new Widget_ModalBox(A,C,B)
}return this.ModalBox
};
function Widget_ToolBar(){this.node=this.initNode("div","ToolBar");
var A=document.createElement("table");
this.TableRow=A.appendChild(document.createElement("tr"));
this.node.appendChild(A);
this.Display="block";
this.node.appendToBody()
}Widget_ToolBar.prototype=new Widget();
Widget_ToolBar.prototype.addButtons=function(B){for(but in B){if(but!="Dimension"&&but!="_location"){var A=new Widget_ToolBarButton(but,B[but]["ns"]);
this.addItem(A)
}}};
Widget_ToolBar.prototype.addItem=function(A){var B=document.createElement("td");
B.appendChild(A.node);
this.TableRow.appendChild(B);
A.draw()
};
function Widget_MenuList(B,A){this.node=document.createElement("select");
this.node.setAttribute("class","MenuList");
if(A){this.node.addEventListener("change",A,false)
}this.Display="block"
}Widget_MenuList.prototype=new Widget();
Widget_MenuList.prototype.removeAllItems=function(){this.node.options.length=0
};
Widget_MenuList.prototype.appendItem=function(A,C){var B=new Option(A,C);
this.node.options[this.node.options.length]=B;
return B
};
function Widget_ToolBarButton(id,namespaceURI){this.node=this.initNode("div","ToolBarButton",id);
this.node.setAttribute("title",bxe_i18n.getText(id));
this.Display="block";
var buttons=bxe_config.getButtons();
var col=buttons[id]["col"];
var row=buttons[id]["row"];
var clipoffset=[buttons["Dimension"][2]*col,buttons["Dimension"][3]*row];
this.node.style.setProperty("background-image","url("+buttonImgLoc+")","");
this.node.style.setProperty("background-position","-"+clipoffset[0]+"px -"+clipoffset[1]+"px","");
this.node.addEventListener("mousedown",function(e){this.style.border="solid 1px"
},false);
this.node.addEventListener("mouseup",function(e){this.style.border="dotted 1px"
},false);
this.node.addEventListener("mouseout",function(e){this.style.border="dotted 1px #C0C0C0"
},false);
this.node.addEventListener("mouseover",function(e){this.style.border="dotted 1px"
},false);
this.node.ElementNamespaceURI=namespaceURI;
if(buttons[id]["type"]=="function"){this.node.addEventListener("click",function(e){eval(buttons[id]["data"]+"(e)")
},false)
}else{if(buttons[id]["type"]=="insertElement"||buttons[id]["type"]=="InsertElement"){this.node.addEventListener("click",function(e){var sel=window.getSelection();
if(bxe_checkForSourceMode(sel)){return false
}var object=bxe_Node_createNS(1,e.target.ElementNamespaceURI,buttons[id]["data"]);
sel.insertNode(object)
},false)
}else{if(buttons[id]["type"]=="event"){this.node.addEventListener("click",function(e){eDOMEventCall(buttons[id]["data"],document,{"localName":this.getAttribute("title"),"namespaceURI":e.target.ElementNamespaceURI})
},false)
}else{this.node.addEventListener("click",function(e){eDOMEventCall(buttons[id]["action"],document,{"localName":this.getAttribute("title"),"namespaceURI":e.target.ElementNamespaceURI})
},false)
}}}}Widget_ToolBarButton.prototype=new Widget();
Element.prototype.appendToBody=function(){document.getElementsByTagName("body")[0].appendChild(this)
};
function Widget_AboutBox(){var C="400";
var A="220";
this.node=this.initNode("div","AboutBox");
this.Display="block";
this.node.appendToBody();
this.node.style.width=C+"px";
this.position((window.innerWidth-C)/2,(window.innerHeight-A)/3,"fixed");
this.node.onclick=function(F){this.style.display="none"
};
var B="<a href='http://bitfluxeditor.org' target='_new'>http://bitfluxeditor.org</a> <br/> Version: "+BXE_VERSION+"/"+BXE_BUILD+"/"+BXE_REVISION;
B+="<br/><br/>";
B+="<table>";
B+="<tr><td>Credits:</td></tr>";
B+='<tr><td><a href="http://bitflux.ch">Bitflux GmbH</a> </td><td> (Main Development) </td></tr>';
B+='<tr><td><a href="http://playsophy.com">Playsophy</a> </td><td> (<a href="http://mozile.mozdev.org">Mozile/eDOM</a> Development) </td></tr>';
B+='<tr><td><a href="http://twingle.mozdev.org">Twingle</a>/Stephan Richter &nbsp;</td><td> (jsdav.js library) </td></tr>';
B+='<tr><td><a href="http://kupu.oscom.org">Kupu</a> &nbsp;</td><td> (ImageDrawer) </td></tr>';
B+="<tr><td>Ludovic Gasc</td><td> (i18n Support, French Translation) </td></tr>";
B+="<tr><td><br/></td></tr>";
B+="<tr><td><b>Hit F7 to get a cursor.</b></td></tr>";
B+='<tr id="okButton" style="display: none" ><td> </td><td><p/><input type="submit" value="OK"/></td></tr>';
B+='<tr ><td colspan="2" id="AboutBoxScroller" > </td></tr>';
B+="</table>";
var E=this.node.innerHTML=B;
var D=document.getElementById("AboutBoxScroller");
this.TextNode=document.getElementById("AboutBoxScroller").firstChild;
D.style.paddingTop="20px"
}Widget_AboutBox.prototype=new Widget();
Widget_AboutBox.prototype.show=function(B,A){this.showSplash=A;
if(A!="false"){this.node.style.overflow="visible";
this.node.style.MozOpacity=1;
if(B){document.getElementById("okButton").style.display="table-row"
}this.draw()
}};
Widget_AboutBox.prototype.setText=function(A){if(A==""){this.TextNode.parentNode.parentNode.style.display="none"
}this.TextNode.data=A
};
Widget_AboutBox.prototype.addText=function(A){this.TextNode.data=this.TextNode.data+" "+A;
if(this.showSplash!="false"){if(this.TextNode.data.length>120){this.TextNode.data="..."+this.TextNode.data.substr(this.TextNode.data.length-120)
}bxe_dump(A+"\n")
}window.status=this.TextNode.data
};
function Widget_StatusBar_Message(A){this.statusbarNode=A
}Widget_StatusBar_Message.prototype=new Widget();
Widget_StatusBar_Message.prototype.showMessage=function(A){if(!(this.node&&this.node.parentNode)){this.node=this.initNode("div","StatusBarMessage","StatusBarMessage");
this.statusbarNode.appendChild(this.node)
}this.node.removeAllChildren();
this.node.style.display="inline";
this.node.appendChild(document.createTextNode(A))
};
function Widget_StatusBar(){this.node=this.initNode("div","StatusBar","StatusBar");
this.node.appendToBody();
this.positionize();
window.onresize=this.positionize;
this.Display="block";
this.subPopup=new Widget_MenuPopup(null,true);
this.buildXPath(bxe_config.xmldoc.documentElement);
this.draw()
}Widget_StatusBar.prototype=new Widget();
Widget_StatusBar.prototype.showMessage=function(A){if(!this.messageArea){this.messageArea=new Widget_StatusBar_Message(this.node)
}this.messageArea.showMessage(A)
};
Widget_StatusBar.prototype.positionize=function(A){if(A){}else{target=this
}target.position(0,document.documentElement.clientHeight-35,"fixed");
this.Popup=new Widget_MenuPopup()
};
Widget_StatusBar.prototype.buildXPath=function(B){if(!B){this.node.removeAllChildren();
return true
}if(B.nodeType==Node.TEXT_NODE){B=B.parentNode
}if(B.getAttribute("__bxe_defaultcontent")=="true"){if(B.edited){B.removeAttribute("__bxe_defaultcontent");
B.XMLNode._node.removeAttribute("__bxe_defaultcontent");
this.lastDefaultContent=false
}else{var C=window.getSelection();
C.collapse(B.firstChild,0);
C.extend(B.firstChild,B.firstChild.length);
this.lastDefaultContent=B
}}else{this.lastDefaultContent=false
}B=B.XMLNode;
if(B&&B._node&&B._node.nodeType==Node.ATTRIBUTE_NODE){B=B.parentNode
}this.node.removeAllChildren();
this.Popup.position(0,0,"absolute");
this.Popup.StatusBar=this;
while(B&&B._node&&B._node.nodeType==1){var A=document.createElement("span");
try{A.appendChild(document.createTextNode(B.vdom.bxeName.replace(/ /g,STRING_NBSP)))
}catch(D){A.appendChild(document.createTextNode(B.localName))
}this.node.insertBefore(A,this.node.firstChild);
if(B._node){A._node=B._node;
A.addEventListener("mouseover",Widget_XPathMouseOver,false);
A.addEventListener("mouseout",Widget_XPathMouseOut,false);
try{if(B.vdom.bxeHelptext){A.setAttribute("title",B.vdom.bxeHelptext)
}}catch(D){}}A.Widget=this;
A.addEventListener("click",function(E){Widget_Globals_doHideOnClickOther();
this.Widget.buildPopup(this);
bxe_cursorPositionLoad()
},false);
A.addEventListener("contextmenu",function(E){this.Widget.buildPopup(this);
E.stopPropagation()
},false);
A.XMLNode=B;
B=B.parentNode
}};
Widget_StatusBar.prototype.buildPopup=function(A){this.Popup.removeAllMenuItems();
this.Popup.initTitle(A.XMLNode.vdom.bxeName);
eDOMEventCall("ContextPopup",A,this.Popup);
this.Popup.addSeparator(bxe_i18n.getText(" Append "));
this.Popup.appendAllowedSiblings(A,this.subPopup);
this.Popup.draw();
this.Popup.position(A.offsetParent.offsetLeft+A.offsetLeft,A.offsetParent.offsetTop+A.offsetTop-this.Popup.node.offsetHeight,"fixed");
this.Popup.draw();
this.Popup._node=A
};
function Widget_ContextMenu(){this.Popup=new Widget_MenuPopup();
this.Popup.position(0,0,"absolute");
this.Popup.ContextMenu=this;
this.subPopup=new Widget_MenuPopup(null,true);
this.subPopup.subPopup=new Widget_MenuPopup(null,true)
}Widget_ContextMenu.prototype=new Widget();
Widget_ContextMenu.prototype.show=function(B,A){this.buildPopup(B,A)
};
Widget_ContextMenu.prototype.buildElementChooserPopup=function(C,B){this.Popup.removeAllMenuItems();
bxe_history_snapshot();
this.Popup.initTitle(bxe_i18n.getText("Choose Subelement of {0}",new Array(C.vdom.bxeName)));
B.sort(bxe_nodeSort);
for(i=0;
i<B.length;
i++){if(B[i].nodeType!=3&&!(B[i].vdom.bxeDontshow)&&!bxe_config.dontShowInContext[B[i].namespaceURI+":"+B[i].localName]&&B[i].vdom.canHaveChildren){var A=this.Popup.addMenuItem(B[i].vdom.bxeName,function(E){var D=E.currentTarget.Widget;
bxe_snapshots_position--;
bxe_snapshots_last=bxe_snapshots_position;
eDOMEventCall("appendChildNode",document,{"appendToNode":D.AppendToNode,"localName":D.InsertLocalName,"namespaceURI":D.InsertNamespaceURI})
});
A.InsertLocalName=B[i].localName;
A.InsertNamespaceURI=B[i].namespaceURI;
A.AppendToNode=C
}}this.Popup.draw();
this.Popup.position(200,window.scrollY+200);
this.Popup.draw();
this.Popup.isElementChooser=true;
this.Popup._node=C
};
Widget_ContextMenu.prototype.buildPopup=function(G,D){this.Popup.removeAllMenuItems();
if(D.XMLNode._node.nodeType==Node.ATTRIBUTE_NODE){var C=D.XMLNode.parentNode
}else{var C=D.XMLNode
}this.Popup.initTitle(C.vdom.bxeName);
eDOMEventCall("ContextPopup",D,this.Popup);
var A=window.getSelection();
var B=A.getEditableRange();
if(B){var F=B.startContainer.XMLNode;
if(!(A.isCollapsed)&&D.getAttribute("__bxe_defaultcontent")!="true"){var I=C.allowedChildren;
if(I.length>0){this.Popup.addSeparator(" Make ")
}for(i=0;
i<I.length;
i++){if(I[i].nodeType!=3){if(!(I[i].vdom.bxeDontshow)&&!bxe_config.dontShowInContext[I[i].namespaceURI+":"+I[i].localName]&&I[i].vdom.canHaveChildren){var H=this.Popup.addMenuItem(I[i].vdom.bxeName,function(N){var M=N.currentTarget.Widget;
var L=window.getSelection();
L.removeAllRanges();
var K=M.Cssr.cloneRange();
L.addRange(K);
eDOMEventCall("toggleTextClass",document,{"localName":M.InsertLocalName,"namespaceURI":M.InsertNamespaceURI})
});
H.InsertLocalName=I[i].localName;
H.InsertNamespaceURI=I[i].namespaceURI;
H.AppendToNode=C;
H.Cssr=B
}}}}}this.Popup._node=D;
this.Popup.addSeparator(bxe_i18n.getText(" Element Order "));
D=C;
while(D&&D._node&&D._node.nodeType==1){if(D.vdom.bxeHelptext){var E=D.vdom.bxeHelptext
}else{var E=false
}var J=this.Popup.addMenuItem(D.vdom.bxeName,null,E);
J.node.XMLNode=D;
J.node.addEventListener("mouseover",Widget_XPathMouseOver,false);
J.node.addEventListener("mouseout",Widget_XPathMouseOut,false);
J.SubPopup=this.subPopup;
J.addMenu(this.subPopup,function(M){var L=M.currentTarget.Widget.SubPopup;
L.removeAllMenuItems();
var N=M.currentTarget.Widget.node;
var K=N.XMLNode._node;
L.setTitle(bxe_i18n.getText(K.XMLNode.vdom.bxeName));
eDOMEventCall("ContextPopup",N,L);
L.addSeparator(bxe_i18n.getText(" Append "));
L.appendAllowedSiblings(K,L.subPopup)
});
D=D.parentNode
}this.Popup.position(G.pageX,G.pageY,"absolute");
this.Popup.draw();
this.Popup._node=D
};
Widget_MenuPopup.prototype.appendAllowedSiblings=function(D,A){var C=D.XMLNode.allowedNextSiblingsSorted;
for(i=0;
i<C.length;
i++){if(C[i].nodeType!=3&&!C[i].vdom.bxeDontshow&&!C[i].vdom.bxeNoaddappenddelete&&C[i].vdom.bxeTabletype!="table-row"&&C[i].vdom.bxeTabletype!="table-col"){if(i==0||!(C[i].localName==C[i-1].localName&&C[i].namespaceURI==C[i-1].namespaceURI)){if(C[i].vdom.bxeHelptext){var F=C[i].vdom.bxeHelptext
}else{var F=false
}var B=this.addMenuItem(C[i].vdom.bxeName.replace(/ /g,STRING_NBSP),function(H){var G=H.currentTarget.Widget;
eDOMEventCall("appendNode",document,{"appendToNode":G.AppendToNode,"localName":G.InsertLocalName,"namespaceURI":G.InsertNamespaceURI})
},F);
B.InsertLocalName=C[i].localName;
B.InsertNamespaceURI=C[i].namespaceURI;
B.AppendToNode=D.XMLNode
}}}var C=D.XMLNode.allowedChildren;
if(C.length>1||(C.length==1&&C[0].nodeType!=3)){this.addSeparator();
var E=this.addMenuItem(bxe_i18n.getText("Insert ..."));
E.node.XMLNode=D;
E.node.addEventListener("mouseover",Widget_XPathMouseOver,false);
E.node.addEventListener("mouseout",Widget_XPathMouseOut,false);
E.AppendToNode=D;
E.SubPopup=A;
E.addMenu(A,function(I){var H=I.currentTarget.Widget;
var G=H.SubPopup;
G.removeAllMenuItems();
G.setTitle(bxe_i18n.getText("Insert"));
G.appendAllowedChildren(H.AppendToNode,true)
})
}};
Widget_MenuPopup.prototype.appendAllowedChildren=function(E,B){var D=E.XMLNode.allowedChildren;
function A(H,G){if(H.nodeName>G.nodeName){return 1
}else{return -1
}}D.sort(A);
var F=false;
for(i=0;
i<D.length;
i++){if(D[i].nodeType!=3&&!D[i].vdom.bxeDontshow){if(i==0||D[i].vdom!=D[i-1].vdom){if(D[i].vdom.bxeHelptext){F=D[i].vdom.bxeHelptext
}else{F=false
}var C=this.addMenuItem(D[i].vdom.bxeName.replace(/ /g,STRING_NBSP),function(L){var K=L.currentTarget.Widget;
if(B){sel=window.getSelection();
var G=sel.anchorNode;
if(G.nodeType!=1){G=G.parentNode
}G=bxe_getXMLNodeByHTMLNodeRecursive(G);
if(G==K.AppendToNode._node){var J=sel.getEditableRange();
G.betterNormalize();
if(G.childNodes.length&&!(J.startContainer.nodeType==1&&J.startContainer.XMLNode&&J.startContainer.XMLNode._node==G)){var H=bxe_getChildPosition(J.startContainer);
if(G.childNodes[H]){G.childNodes[H].splitText(J.startOffset);
var I=G.childNodes[H]
}else{var I=G.appendChild(G.ownerDocument.createTextNode(""));
I.init()
}}else{var I=G.appendChild(G.ownerDocument.createTextNode(""));
I.init()
}}else{if(!G||!(G.compareDocumentPosition(K.AppendToNode._node)&Node.DOCUMENT_POSITION_CONTAINED_BY)){var I=K.AppendToNode._node.appendChild(K.AppendToNode._node.ownerDocument.createTextNode(""));
I.init()
}else{while(G&&G!=K.AppendToNode._node){if(G.XMLNode){var I=G
}G=G.parentNode
}}}if(I){eDOMEventCall("appendNode",document,{"appendToNode":I.XMLNode,"localName":K.InsertLocalName,"namespaceURI":K.InsertNamespaceURI,"findFirstPosition":true})
}}if(!B||!I){eDOMEventCall("appendChildNode",document,{"atStart":true,"appendToNode":K.AppendToNode,"localName":K.InsertLocalName,"namespaceURI":K.InsertNamespaceURI})
}},F);
C.InsertLocalName=D[i].localName;
C.InsertNamespaceURI=D[i].namespaceURI;
C.AppendToNode=E.XMLNode
}}}};
Widget_ModalBox.prototype=new Widget();
function Widget_ModalBox(A,C,B){this.setup(A,C,B)
}Widget_ModalBox.prototype._draw=Widget.prototype.draw;
Widget_ModalBox.prototype.draw=function(B,A){var C=mozilla.getWidgetGlobals();
C.addHideOnClick(this,true);
this._draw(B,A)
};
Widget_ModalBox.prototype.setup=function(A,C,B){this.doCancel=false;
this.node=this.initNode("div","ModalBox");
this.node.id="ModalBox";
this.Display="block";
this.node.appendToBody();
if(A){this.initTitle(A)
}this.initPane();
this.reset(A,C,B)
};
Widget_ModalBox.prototype.reset=function(A,C,B){this.doCancel=false;
this.node.setAttribute("__bxe_noteditable","true");
if(this.PaneNode.hasChildNodes()){this.PaneNode.removeAllChildren()
}this.hasTable=false;
this.hasForm=false;
this.callback=C;
this.callbackCancel=B;
if(A){this.setTitle(A)
}};
Widget_ModalBox.prototype.addItem=function(A,I,H,J,L,C){this.doCancel=true;
switch(H){case"textfield":var D=this.addFormEntry(A,J);
var G=document.createElement("input");
G.value=I;
G.name=A;
this.node.setAttribute("__bxe_noteditable","false");
D.appendChild(G);
break;
case"textarea":var D=this.addFormEntry(A,J);
this.node.setAttribute("__bxe_noteditable","false");
var G=document.createElement("textarea");
var F=window.innerHeight-150;
if(F>450){F=450
}G.style.height=F+"px";
G.id="modalBox"+A;
var K=document.createTextNode(I);
G.name=A;
G.appendChild(K);
D.appendChild(G);
break;
case"select":var D=this.addFormEntry(A,J);
var G=document.createElement("select");
G.setAttribute("name",A);
var B;
for(var E in L){B=document.createElement("option");
if(C){B.appendChild(document.createTextNode(E))
}else{B.appendChild(document.createTextNode(L[E]))
}B.setAttribute("value",L[E]);
if(L[E]==I){B.setAttribute("selected","selected")
}G.appendChild(B)
}D.appendChild(G);
break;
case"noteditable":var D=this.addFormEntry(A,J);
D.appendChild(document.createTextNode(I));
break;
case"selectorPopup":case"selectorPopupFunction":var D=this.addFormEntry(A,J);
var G=document.createElement("input");
G.setAttribute("disabled","disabled");
G.value=I;
G.name=A;
D.appendChild(G);
var G=document.createElement("input");
G.type="button";
G.value="...";
G.name="__select"+A;
G.setAttribute("class","attributeSelector");
if(H=="selectorPopup"){G.setAttribute("onclick","Widget_openAttributeSelector('"+L+"',this.previousSibling)")
}else{G.setAttribute("onclick","Widget_openAttributeSelectorFunc('"+L+"',this.previousSibling)")
}D.appendChild(G);
break;
default:D.appendChild(document.createTextNode("type "+H+" not defined"))
}return G
};
Widget_ModalBox.prototype.createTable=function(){if(!this.hasTable){var B=document.createElement("form");
B.id="ModalBoxForm";
B.Widget=this;
var A=document.createElement("table");
this.PaneNode.appendChild(B);
B.appendChild(A);
this.hasTable=A
}return this.hasTable
};
Widget_ModalBox.prototype.addFormEntry=function(E,C){var B=this.createTable();
var D=document.createElement("tr");
B.appendChild(D);
var F=document.createElement("td");
if(C&&C["helptext"]){F.setAttribute("title",C["helptext"])
}if(C&&C["displayName"]){F.appendChild(document.createTextNode(C["displayName"]))
}else{F.appendChild(document.createTextNode(E))
}D.appendChild(F);
var A=document.createElement("td");
D.appendChild(A);
return A
};
Widget_ModalBox.prototype.addText=function(D,A){var B=this.createTable();
var C=document.createElement("tr");
B.appendChild(C);
var E=document.createElement("td");
E.setAttribute("colspan",2);
if(D.length>1000){D=D.substring(0,1000)+" ..."
}if(A){E.innerHTML=D
}else{E.appendChild(document.createTextNode(D))
}C.appendChild(E)
};
Widget_ModalBox.prototype.submitAndClose=function(H){if(H){var I=H.currentTarget.Widget;
H.preventDefault()
}else{var I=this
}var A=document.getElementById("__submit");
if(A){A.focus()
}I.hide();
bxe_registerKeyHandlers();
if(H){var D=H.currentTarget.elements;
var B=new Array();
for(var E=0;
E<D.length;
E++ in D){if(D[E].name.substr(0,2)!="__"){B[D[E].name.replace(/ +\*/,"")]=D[E].value
}}var C=window.getSelection();
try{if(C.anchorNode.nodeName=="HEAD"){C.collapse(document.body.firstChild,0)
}else{C.collapse(I.selAnchorNode,I.selAnchorOffset);
C.extend(I.selFocusNode,I.selFocusOffset)
}}catch(G){try{C.selectEditableRange(I.cssr)
}catch(F){}}if(I.callback){I.callback(B)
}H.preventDefault();
H.stopPropagation()
}if(typeof BxeTextClipboard_keyhandler=="function"){document.removeEventListener("keypress",BxeTextClipboard_keyhandler,true)
}};
Widget_ModalBox.prototype.show=function(B,H,A,C){try{if(this.hasTable){var G=document.createElement("input");
G.setAttribute("type","submit");
G.name="__submit";
G.id="__submit";
G.setAttribute("value",bxe_i18n.getText("OK"));
this.hasTable.parentNode.addEventListener("submit",this.submitAndClose,false);
if(this.doCancel){var D=document.createElement("input");
D.setAttribute("type","reset");
D.setAttribute("value",bxe_i18n.getText("Cancel"));
D.name="__cancel";
this.hasTable.parentNode.addEventListener("reset",function(J){if(typeof BxeTextClipboard_keyhandler=="function"){document.removeEventListener("keypress",BxeTextClipboard_keyhandler,true)
}bxe_registerKeyHandlers();
if(J.target.Widget.cssr){var I=window.getSelection();
try{I.selectEditableRange(J.target.Widget.cssr)
}catch(J){}}if(J.target.Widget.callbackCancel){J.target.Widget.callbackCancel()
}J.target.Widget.hide()
},false);
this.hasTable.parentNode.appendChild(D)
}this.hasTable.parentNode.appendChild(G);
this.cssr=window.getSelection().getEditableRange();
var E=window.getSelection();
this.selAnchorNode=E.anchorNode;
this.selFocusNode=E.focusNode;
this.selAnchorOffset=E.anchorOffset;
this.selFocusOffset=E.focusOffset;
G.focus()
}else{this.cssr=window.getSelection().getEditableRange();
this.selAnchorNode=E.anchorNode;
this.selFocusNode=E.focusNode;
this.selAnchorOffset=E.anchorOffset;
this.selFocusOffset=E.focusOffset
}if(!A){A="absolute"
}this.position(B,H,A);
this.draw(null,C)
}catch(F){bxe_catch_alert(F)
}bxe_deregisterKeyHandlers()
};
Widget_ModalBox.prototype.initTitle=function(B){var A=document.createElement("div");
A.setAttribute("class","ModalBoxTitle");
A.appendChild(document.createTextNode(B));
this.node.appendChild(A);
this.TitleNode=A;
this.isElementChooser=false
};
Widget_ModalBox.prototype.initPane=function(){var A=document.createElement("div");
A.setAttribute("class","ModalBoxPane");
this.node.appendChild(A);
this.PaneNode=A
};
Widget_ModalBox.prototype.setTitle=function(A){this.TitleNode.firstChild.data=A
};
function Widget_ModalAttributeBox(){this.setup(bxe_i18n.getText("Edit Attributes"))
}Widget_ModalAttributeBox.prototype=new Widget_ModalBox();
Widget_ModalAttributeBox.prototype.popup=function(C){try{var A=mozilla.getWidgetGlobals().EditAttributes;
var B=C.target.Widget.MenuPopup.MainNode;
A.reset(bxe_i18n.getText("Edit Attributes of {0}",new Array(B.vdom.bxeName)),function(D){this.setAttributes(D)
});
A.RefXMLNode=B;
A.drawAttributes(B);
A.show(C.pageX,C.pageY,"absolute")
}catch(C){bxe_catch_alert(C)
}};
Widget_ModalAttributeBox.prototype.drawAttributes=function(F){var A=F.vdom.attributes;
var G="";
var E=new Array();
for(var D in A){if(!A[D].bxeDontshow&&!bxe_config.dontShowInAttributeDialog[A[D].name]){if(!(A[D].name=="class"&&F.getAttribute(A[D].name)==F.localName)){if(A[D].bxeHelptext){E["helptext"]=A[D].bxeHelptext
}else{E["helptext"]=false
}if(A[D]._bxeName){E["displayName"]=A[D]._bxeName
}else{E["displayName"]=false
}if(A[D].bxeNoteditable){this.addItem(A[D].name,F.getAttribute(A[D].name),"noteditable",E)
}else{if(D=="__bxe_choices"){for(var C in A[D]){for(var B in A[D][C]){this.addAttributeItem(A[D][C][B],F.getAttribute(A[D][C][B].name),true,E)
}}}else{this.addAttributeItem(A[D],F.getAttribute(A[D].name),false,E)
}}}}}};
Widget_ModalAttributeBox.prototype.addAttributeItem=function(A,D,B,C){var E=A.name;
if(B){E=E+""
}else{if(!A.optional){E=E+" *"
}}if(A.dataType=="choice"){var F=A.choices;
if(A.optional){F[0]="--- delete attribute ---"
}this.addItem(E,D,"select",null,F)
}else{if(A.bxeSelector){if(A.bxeSelectorType=="popup"){this.addItem(E,D,"selectorPopup",C,A.bxeSelector)
}else{this.addItem(E,D,"selectorPopupFunction",C,A.bxeSelector)
}}else{this.addItem(E,D,"textfield",C)
}}};
Widget_ModalAttributeBox.prototype.setAttributes=function(A){var C=this.RefXMLNode;
try{for(var B in A){attrValue=A[B];
if(attrValue&&attrValue!="--- delete attribute ---"){C.setAttribute(B,attrValue)
}else{C.removeAttribute(B)
}}}catch(D){bxe_catch_alert(D)
}C.parentNode.isNodeValid(true,2,true);
bxe_Transform(false,false,C.parentNode)
};
function Widget_XPathMouseOver(B){var A=B.currentTarget.XMLNode._htmlnode;
if(A){A.setAttribute("__bxe_highlight","true")
}bxe_cursorPositionSave()
}function Widget_XPathMouseOut(B){var A=B.currentTarget.XMLNode._htmlnode;
if(A){A.removeAttribute("__bxe_highlight")
}}function Widget_openAttributeSelector(B,C){window.bxe_lastAttributeNode=C;
var A=window.open(B,"popup","width=600,height=600,resizable=yes,scrollbars=yes");
A.focus()
}function Widget_openAttributeSelectorFunc(func,inputfield){window.bxe_lastAttributeNode=inputfield;
var value=eval(func+"(inputfield)");
if(value){inputfield.value=value
}}const eDOM_VERSION="0.5";
Document.prototype.supportsEDOM=function(A){if((A==eDOM_VERSION)||(A=="")){return true
}return false
};
Element.prototype.appendAllChildren=function(B){var C=B.firstChild;
while(C){var A=C;
C=C.nextSibling;
this.appendChild(A)
}};
Element.prototype.getContent=function(){var C=document.createTreeWalker(this,NodeFilter.SHOW_TEXT,null,this.ownerDocument);
var A="";
var B=null;
while(B=C.nextNode()){A+=B.nodeValue
}return A
};
Node.prototype.__defineGetter__("offset",function(){var A=this.parentNode;
var B=A.firstChild;
var C=0;
while(B){if(B==this){return C
}C++;
B=A.childNodes[C]
}});
Node.prototype.__defineGetter__("parentElement",function(){if((this.nodeType==Node.TEXT_NODE)||(this.contentType==Element.EMPTY_CONTENTTYPE)){return this.parentNode
}return this
});
Node.prototype.__defineGetter__("topInlineAncestor",function(){var A=this.parentNode;
return this;
if(document.defaultView.getComputedStyle(A,null).getPropertyValue("display")=="inline"){return A.topInlineAncestor
}return this
});
Node.prototype.hasOnlyInternalAttributes=function(){var A=this.attributes;
for(var B=0;
B<A.length;
B++){if(A[B].nodeName.substr(0,5)!="_edom"){return false
}}return true
};
Node.prototype.descendent=function(B){var A=this.parentNode;
while(A){if(A==B){return true
}A=A.parentNode
}return false
};
Node.prototype.__defineGetter__("__nilParentElement",function(){var A=this.parentElement;
while(document.defaultView.getComputedStyle(A,null).getPropertyValue("display")=="inline"){A=A.parentNode
}return A
});
Node.prototype.insertParent=function(B){var A=this.parentNode;
B=A.insertBefore(B,this);
B.appendChild(this);
return B
};
Node.prototype.__defineGetter__("__editablePreviousSibling",function(){var A=this.previousSibling;
while(A){if(__NodeFilter.nonEmptyText(A)==NodeFilter.FILTER_ACCEPT){return A
}A=A.previousSibling
}return null
});
Node.prototype.__defineGetter__("__editableNextSibling",function(){var A=this.nextSibling;
while(A){if(__NodeFilter.nonEmptyText(A)==NodeFilter.FILTER_ACCEPT){return A
}A=A.nextSibling
}return null
});
Node.prototype.__defineGetter__("editablePreviousSibling",function(){var A=this.previousSibling;
while(A){if(__NodeFilter.nonEmptyText(A)==NodeFilter.FILTER_ACCEPT){return A
}A=A.previousSibling
}return null
});
Node.prototype.__defineGetter__("editableNextSibling",function(){var A=this.nextSibling;
while(A){if(__NodeFilter.nonEmptyText(A)==NodeFilter.FILTER_ACCEPT){return A
}A=A.nextSibling
}return null
});
Element.prototype.removeAllChildren=function(){var B=this.firstChild;
while(B){var A=B;
B=B.nextSibling;
this.removeChild(A)
}};
Element.prototype.insertAfter=function(A,B){if(this.lastChild==B){return this.appendChild(A)
}else{return this.insertBefore(A,B.nextSibling)
}};
Element.prototype.split=function(A){if(this.childNodes.length<=A){return null
}if(!this.childNodes[A].__editablePreviousSibling){return null
}if(!this.childNodes[A-1].__editableNextSibling){return null
}var C=this.cloneNode(false);
this.parentNode.insertAfter(C,this);
var B;
while(B=this.childNodes[A]){C.appendChild(B)
}return C
};
Element.prototype.replaceChildOnly=function(G,E){var F=documentCreateXHTMLElement(E);
for(var B=0;
B<G.attributes.length;
B++){var A=G.attributes.item(B);
var D=A.cloneNode(true);
F.setAttributeNode(D)
}var C=document.createRange();
C.selectNodeContents(G);
F.appendChild(C.extractContents());
C.detach();
this.replaceChild(F,G);
return F
};
Element.prototype.removeChildOnly=function(A){if(A.childNodes.length>0){var B=document.createRange();
B.selectNodeContents(A);
this.insertBefore(B.extractContents(),A)
}return this.removeChild(A)
};
Element.prototype.firstInsertionPoint=function(D){if(this.contentType==Element.EMPTY_CONTENTTYPE){return __createInsertionPoint(this.top,this.parentNode,(this.offset+1))
}var B=new __IPNodeIterator(this);
if(B.currentNode){var A=(B.currentNode.nodeType==Node.TEXT_NODE)?__createInsertionPoint(D,B.currentNode,0):__createInsertionPoint(D,B.currentNode.parentNode,B.currentNode.offset);
return A
}var E=document.createTextNode(STRING_NBSP);
this.appendChild(E);
var C=__createInsertionPoint(D,E,0);
return C
};
Element.prototype.lastInsertionPoint=function(D){var A=new __IPNodeIterator(this);
A.setToEnd();
if(A.currentNode){var C=(A.currentNode.nodeType==Node.TEXT_NODE)?__createInsertionPoint(D,A.currentNode,A.currentNode.nodeValue.length):__createInsertionPoint(D,A.currentNode.parentNode,(A.currentNode.offset+1));
return C
}var E=document.createTextNode(STRING_NBSP);
this.appendChild(E);
var B=__createInsertionPoint(D,E,0);
return B
};
Element.prototype.match=function(D){if(!D){return false
}if(this.nodeType!=D.ELEMENT_NODE){return false
}if(this.nodeName.toLowerCase()!=D.nodeName.toLowerCase()){return false
}if(this.attributes.length!=D.attributes.length){return false
}for(var B=0;
B<this.attributes.length;
B++){var C=this.attributes.item(B);
var A=D.attributes.getNamedItem(C.nodeName);
if(!A){return false
}if(A.nodeName=="style"){if(!D.style.match(this.style)){return false
}}else{if(A.nodeValue!=C.nodeValue){return false
}}}return true
};
Element.prototype.setStyle=function(D,B){var G=/(\D?)(\d+)(.*)/i;
var F=G.exec(B);
if(!F){this.style.setProperty(D,B,"");
return 
}var H=F[1];
var E=parseInt(F[2]);
var A=F[3];
var C=parseInt(this.style.getPropertyValue(D));
if(isNaN(C)){if(H!="-"){this.style.setProperty(D,E+A,"")
}return 
}if(H=="+"){C+=E
}else{if(H=="-"){if(C<=E){this.style.removeProperty(D);
if(this.style.length==0){this.attributes.removeNamedItem("style")
}return 
}C-=E
}}this.style.setProperty(D,C+A,"")
};
Element.prototype.nodeNamed=function(A){return(this.nodeName.toLowerCase()==A.toLowerCase())
};
CSSStyleDeclaration.prototype.match=function(D){if(this.length!=D.length){return false
}for(var C=0;
C<this.length;
C++){var E=this.item(C);
var B=D.getPropertyValue(E);
var A=this.getPropertyValue(E);
if(A!=B){return false
}}return true
};
InsertionPoint.SAME_LINE=0;
InsertionPoint.CROSSED_BLOCK=1;
InsertionPoint.AT_TOP=2;
Document.prototype.createInsertionPoint=documentCreateInsertionPoint;
function documentCreateInsertionPoint(D,C,B){if((C.nodeType==Node.ELEMENT_NODE)&&(C.childNodes.length>B)&&(C.childNodes[B].nodeType==Node.TEXT_NODE)){C=C.childNodes[B];
B=0
}var E=__createInsertionPoint(D,C,B);
if((E.__cssWhitespace!="pre")&&E.whitespace){var A=E.backOne();
if((A==InsertionPoint.SAME_LINE)&&E.whitespace&&(E.ipOffset==0)&&E.__ipNode.isWhitespaceOnly){E.__backOne();
E.__ipOffset++;
return E
}if(((A==InsertionPoint.SAME_LINE)&&!E.whitespace&&!E.IPToken)||(A==InsertionPoint.AT_TOP)||(A==InsertionPoint.CROSSED_BLOCK)){E.forwardOne()
}}return E
}function __createInsertionPoint(C,B,A){var D=new InsertionPoint(C,B,A,null,document.defaultView.getComputedStyle(B.parentNode,null).getPropertyValue("white-space"));
return D
}function InsertionPoint(D,C,B,A,E){this.__top=D;
this.__ipNode=C;
this.__ipOffset=B;
this.__cw=A;
this.__cssWhitespace=E
}InsertionPoint.prototype.__defineGetter__("top",function(){return this.__top
});
InsertionPoint.prototype.__defineGetter__("cssWhitespace",function(){return this.__cssWhitespace
});
InsertionPoint.prototype.__defineGetter__("ipNode",function(){return this.__ipNode
});
InsertionPoint.prototype.__defineGetter__("ipOffset",function(){return this.__ipOffset
});
InsertionPoint.prototype.__defineSetter__("ipOffset",function(A){this.__ipOffset=A
});
InsertionPoint.prototype.__defineGetter__("lineOffset",function(){var A=this.line;
var C=A.firstInsertionPoint;
var B=0;
while(!C.equivalent(this)&&B<10){B++;
C.forwardOne()
}return B
});
InsertionPoint.prototype.__defineGetter__("ipReferencedNode",function(){if(this.__ipNode.nodeType==Node.TEXT_NODE){return this.__ipNode
}var A=this.__ipOffset;
if((this.__ipOffset==this.__ipNode.childNodes.length)||(this.__ipNode.childNodes[this.__ipOffset].nodeType==Node.TEXT_NODE)){A=this.__ipOffset-1
}return this.__ipNode.childNodes[A]
});
const SPCHARS="\f\n\r\t\u0020\u2028\u2029";
InsertionPoint.prototype.__defineGetter__("whitespace",function(){var A=this.character;
if(A==null){return false
}if(A==""){return true
}return(SPCHARS.indexOf(A)!=-1)
});
InsertionPoint.prototype.__defineGetter__("startOfLine",function(){var A=this.clone();
var B=A.backOne();
if(B!=InsertionPoint.SAME_LINE){return true
}return false
});
InsertionPoint.prototype.__defineGetter__("endOfLine",function(){var A=this.clone();
var B=A.forwardOne();
if(B!=InsertionPoint.SAME_LINE){return true
}return false
});
InsertionPoint.prototype.__defineGetter__("IPToken",function(){if((this.__ipNode.nodeType==Node.TEXT_NODE)&&(this.__ipOffset<this.__ipNode.nodeValue.length)&&(this.__ipNode.nodeValue.charAt(this.__ipOffset)==STRING_NBSP)){var A=__createCSSLineFromNonBlockIP(this,false);
if(A.tokenLine){return true
}}return false
});
InsertionPoint.prototype.__defineGetter__("line",function(){return documentCreateCSSLine(this)
});
InsertionPoint.prototype.__defineGetter__("character",function(){if(this.__ipNode.nodeType==Node.ELEMENT_NODE){return null
}if(this.__ipOffset<this.__ipNode.length){return this.__ipNode.nodeValue.charAt(this.__ipOffset)
}var C=this.clone();
var A=C.__forwardOne();
var B="";
if(A==InsertionPoint.SAME_LINE){if(C.__ipNode.nodeType==Node.ELEMENT_NODE){return null
}B=C.__ipNode.nodeValue.charAt(0)
}return B
});
InsertionPoint.prototype.equivalent=function(A){if(this.ipNode==A.ipNode){if(this.ipOffset==A.ipOffset){return true
}return false
}if((this.ipNode.nodeType==Node.TEXT_NODE)&&(A.ipNode.nodeType==Node.ELEMENT_NODE)){return __elementReferenceEqualsTextReference(A.ipNode,A.ipOffset,this.ipNode,this.ipOffset)
}if((this.ipNode.nodeType==Node.ELEMENT_NODE)&&(A.ipNode.nodeType==Node.TEXT_NODE)){return __elementReferenceEqualsTextReference(this.ipNode,this.ipOffset,A.ipNode,A.ipOffset)
}return false
};
function __elementReferenceEqualsTextReference(A,E,C,B){var D=C.topInlineAncestor;
if(D.parentNode!=A){return false
}if((B==C.nodeValue.length)&&(E==(D.offset+1))){return true
}if((B==0)&&(E==D.offset)){return true
}return false
}InsertionPoint.prototype.clone=function(){var A=new InsertionPoint(this.__top,this.__ipNode,this.__ipOffset,this.__cw,this.__cssWhitespace);
return A
};
InsertionPoint.prototype.set=function(A){this.__top=A.__top;
this.__ipNode=A.__ipNode;
this.__ipOffset=A.__ipOffset;
this.__cw=A.__cw;
this.__cssWhitespace=A.__cssWhitespace
};
InsertionPoint.prototype.__defineGetter__("tableCellAncestor",function(){var A=this.ipNode.parentElement;
while(A!=this.top){if(document.defaultView.getComputedStyle(A,null).getPropertyValue("display")=="table-cell"){return A
}A=A.parentNode
}return null
});
InsertionPoint.prototype.setToStart=function(){var A=this.__top.firstInsertionPoint(this.__top);
if(A){this.set(A)
}};
InsertionPoint.prototype.__backOne=function(){var C;
if(this.__ipNode.nodeType==Node.TEXT_NODE){if(this.__ipOffset>0){this.__ipOffset--;
return InsertionPoint.SAME_LINE
}C=this.__ipNode
}else{if(this.__ipNode.childNodes.length==this.__ipOffset){this.__ipOffset--;
if(document.defaultView.getComputedStyle(this.__ipNode.childNodes[this.__ipOffset],null).getPropertyValue("display")=="inline"){return InsertionPoint.SAME_LINE
}else{var A=new __IPNodeIterator(this.__top);
A.currentNode=this.__ipNode.childNodes[this.__ipOffset];
var D=A.previousNode();
if(!D&&A.currentNode&&(A.currentNode.nodeType==Node.TEXT_NODE)){this.__ipNode=A.currentNode;
this.__ipOffset=A.currentNode.nodeValue.length
}return InsertionPoint.CROSSED_BLOCK
}}else{C=this.__ipNode.childNodes[this.__ipOffset]
}}var A=new __IPNodeIterator(this.__top);
A.currentNode=C;
var B=A.previousNode();
if(A.currentNode==null){return InsertionPoint.AT_TOP
}this.__cssWhitespace=document.defaultView.getComputedStyle(A.currentNode.parentNode,null).getPropertyValue("white-space");
if(A.currentNode.nodeType==Node.TEXT_NODE){this.__ipNode=A.currentNode;
this.__ipOffset=this.__ipNode.nodeValue.length;
if(B){return InsertionPoint.CROSSED_BLOCK
}this.__ipOffset--;
return InsertionPoint.SAME_LINE
}this.__ipNode=A.currentNode.parentNode;
if(B){if(B==A.currentNode){C=A.currentNode;
D=A.previousNode();
if(!D&&A.currentNode&&(A.currentNode.nodeType==Node.TEXT_NODE)){this.__ipNode=A.currentNode;
this.__ipOffset=A.currentNode.nodeValue.length
}else{this.__ipOffset=C.offset
}}else{this.__ipOffset=A.currentNode.offset+1
}return InsertionPoint.CROSSED_BLOCK
}this.__ipOffset=A.currentNode.offset;
return InsertionPoint.SAME_LINE
};
InsertionPoint.prototype.backOne=function(){var B=this.clone();
var A=this.__backOne();
if(A==InsertionPoint.AT_TOP){return InsertionPoint.AT_TOP
}if((this.__ipNode.nodeType==Node.TEXT_NODE)&&(this.__cssWhitespace!="pre")&&((this.__ipNode.nodeValue.length==this.__ipOffset)||(SPCHARS.indexOf(this.__ipNode.nodeValue.charAt(this.__ipOffset))!=-1))){var C=this.clone();
var E;
var D;
do{E=C.clone();
D=C.__backOne();
if(D!=InsertionPoint.SAME_LINE){A=D
}if(D==InsertionPoint.AT_TOP){break
}}while((C.__ipNode.nodeType==Node.TEXT_NODE)&&(C.__cssWhitespace!="pre")&&((C.__ipNode.nodeValue.length==C.__ipOffset)||(SPCHARS.indexOf(C.__ipNode.nodeValue.charAt(C.__ipOffset))!=-1)));
if(A==InsertionPoint.CROSSED_BLOCK){this.set(C);
if(!((D==InsertionPoint.CROSSED_BLOCK)||this.IPToken)){this.__ipOffset++
}}else{if(A==InsertionPoint.AT_TOP){this.set(B)
}else{if(C.IPToken){this.set(C)
}else{this.set(E)
}}}}return A
};
InsertionPoint.prototype.__forwardOne=function(){if(this.__ipNode.nodeType==Node.TEXT_NODE){if(this.__ipOffset<this.__ipNode.length){this.__ipOffset++;
return InsertionPoint.SAME_LINE
}}var B=this.__ipNode;
if(B.nodeType==Node.ELEMENT_NODE){if(this.__ipOffset>0){B=this.__ipNode.childNodes[this.__ipOffset-1]
}}var A=new __IPNodeIterator(this.__top);
A.currentNode=B;
var C=A.nextNode();
if(A.currentNode==null){return InsertionPoint.AT_TOP
}this.__cssWhitespace=document.defaultView.getComputedStyle(A.currentNode.parentNode,null).getPropertyValue("white-space");
if(A.currentNode.nodeType==Node.TEXT_NODE){this.__ipNode=A.currentNode;
if(C){this.__ipOffset=0;
return InsertionPoint.CROSSED_BLOCK
}this.__ipOffset=1;
return InsertionPoint.SAME_LINE
}var B=A.currentNode;
this.__ipNode=B.parentNode;
if(C){if(C==A.currentNode){C=A.nextNode();
if(!C&&A.currentNode&&(A.currentNode.nodeType==Node.TEXT_NODE)){this.__ipNode=A.currentNode;
this.__ipOffset=0
}else{this.__ipOffset=B.offset+1
}}else{this.__ipOffset=B.offset
}return InsertionPoint.CROSSED_BLOCK
}this.__ipOffset=A.currentNode.offset+1;
return InsertionPoint.SAME_LINE
};
InsertionPoint.prototype.forwardOne=function(){var B=this.clone();
if(B.IPToken){var A;
do{A=this.__forwardOne()
}while(A==InsertionPoint.SAME_LINE);
if(A==InsertionPoint.AT_TOP){this.set(B)
}return A
}var A=this.__forwardOne();
if(A==InsertionPoint.AT_TOP){return A
}if(((this.__cssWhitespace!="pre")&&this.whitespace)&&(B.whitespace||(A==InsertionPoint.CROSSED_BLOCK)||((B.__ipNode.nodeType==Node.ELEMENT_NODE)&&((B.__ipNode.childNodes.length==B.__ipOffset)||(B.__ipNode.childNodes[B.__ipOffset].nodeType!=Node.ELEMENT_NODE))))){var C;
do{resultForward=this.__forwardOne();
if(resultForward!=InsertionPoint.SAME_LINE){A=resultForward
}}while((this.__cssWhitespace!="pre")&&this.whitespace&&(A!=InsertionPoint.AT_TOP));
if(A==InsertionPoint.AT_TOP){this.set(B)
}else{if(A==InsertionPoint.CROSSED_BLOCK){if((this.__cssWhitespace!="pre")&&(this.__ipNode.nodeType==Node.TEXT_NODE)&&(this.__ipNode.nodeValue.length==this.__ipOffset)){this.__forwardOne();
this.__ipOffset--
}}}}return A
};
InsertionPoint.prototype.deletePreviousInLine=function(){var J=this.clone();
var C=J.backOne();
if(C!=InsertionPoint.SAME_LINE){return false
}var E=J.clone();
var D=E.backOne();
var G=this.clone();
var F=G.forwardOne();
if(!(this.__ipNode.previousSibling)&&(D!=InsertionPoint.SAME_LINE)&&(F!=InsertionPoint.SAME_LINE)){var K=this.line.deleteContents();
this.set(K.firstInsertionPoint);
return true
}if(F!=InsertionPoint.SAME_LINE){if(E.whitespace){E.__ipNode.replaceData(E.ipOffset,1,STRING_NBSP)
}}else{if(this.whitespace&&((D!=InsertionPoint.SAME_LINE)||E.whitespace)){if(this.__ipNode.nodeValue.length==this.__ipOffset){G.__ipNode.replaceData(0,1,STRING_NBSP)
}else{this.__ipNode.replaceData(this.__ipOffset,1,STRING_NBSP)
}}}var H=document.createRange();
H.setStart(J.ipNode,J.ipOffset);
H.setEnd(this.__ipNode,this.__ipOffset);
var I=H.cloneRange();
var B=documentCreateCSSTextRange(H,this.__top);
B.includeExclusiveParents();
if(this.__ipNode.previousSibling||(B.startContainer==J.ipNode)||(B.endContainer==this.ipNode)){I.deleteContents()
}else{var A=B.startContainer;
B.deleteContents();
if(A.parentNode.userModifiable){A.parentNode.updateXMLNode()
}else{A.updateXMLNode()
}}this.__top.normalize();
if(D!=InsertionPoint.AT_TOP){E.forwardOne();
this.set(E)
}else{this.setToStart()
}return true
};
InsertionPoint.prototype.splitContainedLine=function(){var B=this.line;
if(B.lineType==CSSLine.BOUNDED_LINE){return 
}if(B.container==this.top){return 
}if(this.__cssWhitespace=="pre"){this.__ipNode.insertData((this.__ipOffset),"\n");
this.__ipOffset++;
return 
}var G=B.container.cloneNode(false);
if(this.equivalent(B.lastInsertionPoint)){var E=document.createTextNode(STRING_NBSP);
G.appendChild(E);
B.container.parentNode.insertAfter(G,B.container);
eDOMEventCall("NodeInsertedBefore",B.container,G);
var A=this.clone();
A.forwardOne();
this.set(A);
return 
}if(this.equivalent(B.firstInsertionPoint)){G.appendChild(document.createTextNode(STRING_NBSP));
B.container.parentNode.insertBefore(G,B.container);
eDOMEventCall("NodeInsertedBefore",B.container,G);
return 
}var D=document.createRange();
D.selectNodeContents(B.container);
D.setStart(this.ipNode,this.ipOffset);
var C=D.extractContents();
B=documentCreateCSSLine(B.firstInsertionPoint);
B.normalizeWhitespace();
G.appendChild(C);
B.container.parentNode.insertAfter(G,B.container);
eDOMEventCall("NodeInsertedBefore",B.container,G);
var F=documentCreateCSSLine(G.firstInsertionPoint(B.top));
F.normalizeWhitespace();
F.forceLineBreaksBeforeAfter();
this.set(F.firstInsertionPoint)
};
InsertionPoint.prototype.insertCharacter=function(H){if(this.__ipNode.nodeType==Node.ELEMENT_NODE){if(this.__ipOffset==this.__ipNode.childNodes.length){this.__ipNode.appendChild(document.createTextNode(""));
this.__ipNode=this.__ipNode.lastChild;
this.__ipOffset=0
}else{var C=this.__ipNode.childNodes[this.__ipOffset];
if(C.nodeType==Node.TEXT_NODE){this.__ipNode=C;
this.__ipOffset=0
}else{if(C.previousSibling&&(C.previousSibling.nodeType==Node.TEXT_NODE)){this.__ipNode=C.previousSibling;
this.__ipOffset=this.__ipNode.nodeValue.length
}else{var A=document.createTextNode("");
this.__ipNode.insertBefore(A,C);
this.__ipNode=A;
this.__ipOffset=0
}}}}else{if(this.__cssWhitespace!="pre"){if(H==CHARCODE_SPACE){if(this.whitespace){H=CHARCODE_NBSP
}else{var G=this.clone();
if((G.backOne()!=InsertionPoint.SAME_LINE)||G.whitespace){H=CHARCODE_NBSP
}}}else{var G=this.clone();
var D=G.backOne();
if((D==InsertionPoint.SAME_LINE)&&(G.character==STRING_NBSP)){var B=G.ipNode;
var E=G.ipOffset;
if((G.backOne()==InsertionPoint.SAME_LINE)&&!G.whitespace){B.replaceData(E,1,STRING_SPACE)
}}if((this.clone().backOne()!=InsertionPoint.SAME_LINE)&&(this.character==STRING_NBSP)){var F=this.clone();
var I=F.forwardOne();
if(I!=InsertionPoint.SAME_LINE){this.__ipNode.replaceData(this.__ipOffset,1,String.fromCharCode(H));
this.__ipOffset++;
return 
}}}}}this.__ipNode.insertData(this.__ipOffset,String.fromCharCode(H));
this.__ipOffset++
};
InsertionPoint.prototype.insertNode=function(E){if(E.nodeType==Node.TEXT_NODE){this.__insertTextNode(E);
return 
}if(E.nodeType==11){var G=E.firstChild;
while(G){var D=G;
G=G.nextSibling;
if(D.nodeType==Node.TEXT_NODE){this.insertNode(D)
}else{this.insertNode(D);
var C=D.lastInsertionPoint(this.top);
this.set(C);
this.forwardOne();
this.backOne()
}}}if(E.nodeType!=Node.ELEMENT_NODE){return 
}if(E.contentType==Element.EMPTY_CONTENTTYPE){this.__insertElement(E);
return 
}var F=document.defaultView.getComputedStyle(E,null).getPropertyValue("display");
if(F=="inline"){this.__insertElement(E);
return 
}if(!((F=="block")||(F=="table"))){return 
}var B=this.line;
if(B.lineType==CSSLine.BOUNDED_LINE){this.__insertElement(E);
return 
}if(B.containedLineType!=ContainedLine.BLOCK){this.__insertElement(E);
return 
}if(this.equivalent(B.firstInsertionPoint)){B.container.parentNode.insertBefore(E,B.container)
}else{if(this.equivalent(B.lastInsertionPoint)){B.container.parentNode.insertAfter(E,B.container)
}else{this.splitContainedLine();
B.container.parentNode.insertAfter(E,B.container)
}}var A=E.firstInsertionPoint(this.top);
this.set(A)
};
InsertionPoint.prototype.__insertElement=function(D){if(this.ipNode.nodeType==Node.ELEMENT_NODE){if(this.ipNode.childNodes.length==this.ipOffset){this.ipNode.appendChild(D)
}else{this.ipNode.childNodes[this.ipOffset].parentNode.insertBefore(D,this.ipNode.childNodes[this.ipOffset])
}}else{var B=this.clone();
B.forwardOne();
var F=this.clone();
F.backOne();
var G=null;
if(document.defaultView.getComputedStyle(this.ipNode.parentNode,null).getPropertyValue("display")=="inline"){G=this.ipNode.parentNode
}if(B.ipNode!=this.ipNode){if(G){G.parentNode.insertAfter(D,G)
}else{this.ipNode.parentNode.insertAfter(D,this.ipNode)
}}else{if(F.ipNode!=this.ipNode){if(G){G.parentNode.insertBefore(D,G)
}else{this.ipNode.parentNode.insertBefore(D,this.ipNode)
}}else{var C=this.ipNode.splitText(this.ipOffset);
if(G){var E=G.cloneNode(false);
G.parentNode.insertAfter(E,G);
E.appendChild(C);
E.parentNode.insertBefore(D,E)
}else{this.ipNode.parentNode.insertBefore(D,C)
}}}}var A=D.firstInsertionPoint(this.top);
this.set(A)
};
InsertionPoint.prototype.__insertTextNode=function(C){if(this.ipNode.nodeType==Node.TEXT_NODE){var B=this.ipNode.splitText(this.ipOffset);
B.parentNode.insertBefore(C,B)
}else{if(this.ipNode.childNodes.length==this.ipOffset){this.ipNode.appendChild(C)
}else{this.ipNode.insertBefore(C,this.ipNode.childNodes[this.ipOffset])
}}var A=documentCreateInsertionPoint(this.top,C,C.nodeValue.length);
this.set(A)
};
function __IPNodeFilter(){this.__crossedBlock=null
}__IPNodeFilter.prototype.__defineGetter__("crossedBlock",function(){return this.__crossedBlock
});
__IPNodeFilter.prototype.reset=function(){this.__crossedBlock=null
};
__IPNodeFilter.prototype.acceptNode=function(A){if(A.nodeType==Node.TEXT_NODE){if(A.nodeValue.length==0){return NodeFilter.FILTER_REJECT
}if(!(/\u00A0+/.test(A.nodeValue))&&A.isWhitespaceOnly){if(document.defaultView.getComputedStyle(A.parentNode,null).getPropertyValue("display")=="inline"){return NodeFilter.FILTER_ACCEPT
}if((A.previousSibling&&(A.previousSibling.nodeType==Node.ELEMENT_NODE)&&(document.defaultView.getComputedStyle(A.previousSibling,null).getPropertyValue("display")=="inline"))&&(A.nextSibling&&(A.nextSibling.nodeType==Node.ELEMENT_NODE)&&(document.defaultView.getComputedStyle(A.nextSibling,null).getPropertyValue("display")=="inline"))){return NodeFilter.FILTER_ACCEPT
}return NodeFilter.FILTER_REJECT
}return NodeFilter.FILTER_ACCEPT
}if(A.nodeType==Node.ELEMENT_NODE){if(document.defaultView.getComputedStyle(A,null).getPropertyValue("display")!="inline"){if(!this.__crossedBlock){this.__crossedBlock=A
}}if(A.contentType==Element.EMPTY_CONTENTTYPE){return NodeFilter.FILTER_ACCEPT
}}return NodeFilter.FILTER_SKIP
};
function __IPNodeIterator(A){this.__ipNodeFilter=new __IPNodeFilter();
this.__root=A;
this.__ipNodeWalker=document.createTreeWalker(A,NodeFilter.SHOW_ALL,this.__ipNodeFilter,false);
this.__currentNode=this.__ipNodeWalker.firstChild()
}__IPNodeIterator.prototype.setToStart=function(){this.__ipNodeWalker.currentNode=this.__root;
this.__currentNode=this.__ipNodeWalker.firstChild();
return this.__currentNode
};
__IPNodeIterator.prototype.setToEnd=function(){this.__ipNodeWalker.currentNode=this.__root;
this.__currentNode=this.__ipNodeWalker.lastChild();
return this.__currentNode
};
__IPNodeIterator.prototype.__defineGetter__("currentNode",function(){return this.__currentNode
});
__IPNodeIterator.prototype.__defineSetter__("currentNode",function(A){this.__currentNode=A;
this.__ipNodeWalker.currentNode=A
});
__IPNodeIterator.prototype.nextNode=function(){this.__ipNodeFilter.reset();
var A=this.__currentNode?this.__currentNode.__nilParentElement:null;
this.__currentNode=this.__ipNodeWalker.nextNode();
if(!this.__ipNodeFilter.crossedBlock||(this.__currentNode&&(this.__ipNodeFilter.crossedBlock==this.__currentNode))){var B=this.__currentNode?this.__currentNode.__nilParentElement:null;
if(B!=A){return B
}}return this.__ipNodeFilter.crossedBlock
};
__IPNodeIterator.prototype.previousNode=function(){this.__ipNodeFilter.reset();
this.__currentNode=this.__ipNodeWalker.previousNode();
return this.__ipNodeFilter.crossedBlock
};
Document.prototype.createCSSLine=documentCreateCSSLine;
function documentCreateCSSLine(B){if(B.ipNode.nodeType==Node.TEXT_NODE){return __createCSSLineFromNonBlockIP(B,true)
}var A=B.ipReferencedNode;
if(document.defaultView.getComputedStyle(A,null).getPropertyValue("display")=="inline"){return __createCSSLineFromNonBlockIP(B,true)
}return __createBoundedLineFromBlockIP(B,true)
}function __createBoundedLineFromBlockIP(G,F){var E=G.ipReferencedNode;
var A=null;
var K=null;
var H;
var J;
var C=0;
var D=new __IPNodeIterator(G.top);
if(E.offset==G.ipOffset){K=E;
J=G.clone();
var I=null;
D.currentNode=E;
while(!D.previousNode()&&D.currentNode){I=D.currentNode;
if(I.nodeType==Node.ELEMENT_NODE){C++
}}if(I){A=I.topInlineAncestor.previousSibling;
if(I.nodeType==Node.ELEMENT_NODE){H=F?documentCreateInsertionPoint(G.top,I.parentNode,I.offset):__createInsertionPoint(G.top,startIPnode.parentNode,I.offset)
}else{H=F?documentCreateInsertionPoint(G.top,I,0):__createInsertionPoint(G.top,I,0)
}}else{H=G.clone();
A=E.topInlineAncestor.previousSibling
}while(A&&(A.nodeType==Node.TEXT_NODE)){A=A.previousSibling
}}else{A=E;
H=G.clone();
var B=null;
D.currentNode=E;
while(!D.nextNode()&&D.currentNode){B=D.currentNode;
if(B.nodeType==Node.ELEMENT_NODE){C++
}}if(B){K=B.topInlineAncestor.nextSibling;
if(B.nodeType==Node.ELEMENT_NODE){J=F?documentCreateInsertionPoint(G.top,B.parentNode,(B.offset+1)):__createInsertionPoint(G.top,endIPnode.parentNode,(B.offset+1))
}else{J=F?documentCreateInsertionPoint(G.top,B,B.nodeValue.length):__createInsertionPoint(G.top,B,B.nodeValue.length)
}}else{J=G.clone();
K=E.topInlineAncestor.nextSibling
}while(K&&(K.nodeType==Node.TEXT_NODE)){K=K.nextSibling
}}return new BoundedLine(G.top,H,J,A,K,C)
}function __createCSSLineFromNonBlockIP(J,I){var G=J.ipReferencedNode;
var E=(G.nodeType==Node.ELEMENT_NODE)?1:0;
var F=new __IPNodeIterator(J.top);
var D=G;
F.currentNode=G;
while(!F.nextNode()&&F.currentNode){D=F.currentNode;
if(D.nodeType==Node.ELEMENT_NODE){E++
}}var O=G;
F.currentNode=G;
while(!F.previousNode()&&F.currentNode){O=F.currentNode;
if(O.nodeType==Node.ELEMENT_NODE){E++
}}var C=O.topInlineAncestor;
var B=C.previousSibling;
while(B&&((B.nodeType==Node.TEXT_NODE)||(document.defaultView.getComputedStyle(B,null).getPropertyValue("display")=="inline"))){B=B.previousSibling
}var A=0;
if(O.nodeType==Node.ELEMENT_NODE){A=O.offset;
O=O.parentNode
}var H=D.topInlineAncestor;
var N=H.nextSibling;
while(N&&((N.nodeType==Node.TEXT_NODE)||N.nodeType==Node.COMMENT_NODE||(document.defaultView.getComputedStyle(N,null).getPropertyValue("display")=="inline"))){N=N.nextSibling
}var L;
if(D.nodeType==Node.ELEMENT_NODE){L=D.offset+1;
D=D.parentNode
}else{L=D.nodeValue.length
}var K;
var M;
if(I){K=documentCreateInsertionPoint(J.top,O,A);
M=documentCreateInsertionPoint(J.top,D,L)
}else{K=__createInsertionPoint(J.top,O,A);
M=__createInsertionPoint(J.top,D,L)
}if(N||B){return new BoundedLine(J.top,K,M,B,N,E)
}return new ContainedLine(J.top,K,M,C.parentNode,E)
}function CSSLine(){}CSSLine.prototype.init=function(E,D,A,C,B,F){this.__top=E;
this.__firstInsertionPoint=D;
this.__lastInsertionPoint=A;
this.__lineRange=C;
this.__elementCount=B;
this.__lineParent=F
};
CSSLine.BOUNDED_LINE=1;
CSSLine.CONTAINED_LINE=2;
CSSLine.prototype.__defineGetter__("lineType",function(){if(this instanceof ContainedLine){return CSSLine.CONTAINED_LINE
}return CSSLine.BOUNDED_LINE
});
CSSLine.prototype.__defineGetter__("top",function(){return this.__top
});
CSSLine.prototype.__defineGetter__("lineParent",function(){return this.__lineParent
});
CSSLine.prototype.__defineGetter__("lineContents",function(){var A=document.createRange();
A.selectNodeContents(this.lineParent);
return A.cloneContents()
});
CSSLine.prototype.__defineGetter__("lineRange",function(){return(this.__lineRange.cloneRange())
});
CSSLine.prototype.equivalent=function(A){if(this.firstInsertionPoint.equivalent(A.firstInsertionPoint)){return true
}return false
};
CSSLine.prototype.toString=function(){return this.__lineRange.toString()
};
CSSLine.prototype.__defineGetter__("length",function(){return(this.toString().length+this.__elementCount)
});
CSSLine.prototype.insertionPointAt=function(B){var D=this.firstInsertionPoint;
while(B){var C=D.clone();
var A=D.forwardOne();
if(A!=InsertionPoint.SAME_LINE){return C
}B--
}return D
};
CSSLine.prototype.__defineGetter__("emptyLine",function(){return(this.firstInsertionPoint.equivalent(this.lastInsertionPoint))
});
CSSLine.prototype.__defineGetter__("tokenLine",function(){if(this.__elementCount>0){return false
}var B=this.__lineRange.toString();
if(/\S+/.test(B)){return false
}var A=B.match(/([\u00A0])/g);
if(!A||(A.length>1)){return false
}return true
});
CSSLine.prototype.__defineGetter__("topLine",function(){return false
});
CSSLine.prototype.__defineGetter__("firstInsertionPoint",function(){return this.__firstInsertionPoint.clone()
});
CSSLine.prototype.__defineGetter__("lastInsertionPoint",function(){return this.__lastInsertionPoint.clone()
});
CSSLine.prototype.__defineGetter__("previousLine",function(){var D=this.firstInsertionPoint;
var C=D.clone();
var A=C.backOne();
if(A==InsertionPoint.AT_TOP){return null
}var B=documentCreateCSSLine(C);
return B
});
CSSLine.prototype.__defineGetter__("nextLine",function(){var D=this.lastInsertionPoint;
var B=D.clone();
var A=B.forwardOne();
if(A==InsertionPoint.AT_TOP){return null
}var C=documentCreateCSSLine(B);
return C
});
CSSLine.prototype.__defineGetter__("listItemAncestor",function(){var A=this.__lineParent;
while(A!=document){if(document.defaultView.getComputedStyle(A,null).getPropertyValue("display")=="list-item"){return A
}A=A.parentNode
}return null
});
CSSLine.prototype.__defineGetter__("tableCellAncestor",function(){var A=this.__lineParent;
while(A!=this.__top){try{if(document.defaultView.getComputedStyle(A,null).getPropertyValue("display")=="table-cell"){return A
}A=A.parentNode
}catch(B){return null
}}return null
});
CSSLine.prototype.setTopToTableCellAncestor=function(){var A=this.tableCellAncestor;
if(A){this.__top=A
}};
CSSLine.prototype.containsNode=function(B){var A=document.createRange();
A.selectNodeContents(B);
if(this.__lineRange.containsRange(A)){return true
}return false
};
CSSLine.prototype.normalizeTextNodes=function(){this.lineParent.normalize();
this.__recalculateLastInsertionPoint();
return this
};
CSSLine.prototype.normalizeInlineElements=function(){var A=document.createRange();
A.selectNode(this.lineParent);
A.normalizeElements("span");
this.__recalculateLastInsertionPoint();
return this
};
CSSLine.prototype.__recalculateLastInsertionPoint=function(){var C=this.firstInsertionPoint.ipReferencedNode;
var D=new __IPNodeIterator(this.lineParent);
var A=((C.nodeType==Node.TEXT_NODE)||(document.defaultView.getComputedStyle(C,null).getPropertyValue("display")=="inline"))?C:null;
D.currentNode=C;
while(!D.nextNode()&&D.currentNode){A=D.currentNode
}var B;
if(!A){this.__lastInsertionPoint=this.__firstInsertionPoint.clone()
}else{if(A.nodeType==Node.ELEMENT_NODE){B=A.offset+1;
A=A.parentNode
}else{B=A.nodeValue.length
}this.__lastInsertionPoint=documentCreateInsertionPoint(this.top,A,B)
}return this.__lastInsertionPoint
};
ContainedLine.prototype=new CSSLine();
ContainedLine.prototype.constructor=ContainedLine;
ContainedLine.superclass=CSSLine.prototype;
function ContainedLine(F,E,B,A,D){var C=document.createRange();
C.selectNodeContents(A);
ContainedLine.superclass.init.call(this,F,E,B,C,D,A);
this.__container=A
}ContainedLine.prototype.__defineGetter__("container",function(){return this.__container
});
ContainedLine.prototype.__defineGetter__("topMostContainer",function(){var B=this.__container;
var A=B.parentNode;
while(oneSignificantChild(A)&&(B!=this.__top)){B=A;
A=A.parentNode
}return B
});
function oneSignificantChild(B){var C=0;
for(var A=0;
A<B.childNodes.length;
A++){if(!((B.childNodes[A].nodeType==Node.TEXT_NODE)&&(B.childNodes[A].isWhitespaceOnly))){C++
}}if(C==1){return true
}return false
}ContainedLine.prototype.__defineGetter__("topLine",function(){if((this.container==this.__top)||(this.topMostContainer==this.__top)){return true
}return false
});
ContainedLine.prototype.__defineGetter__("embeddedLine",function(){if(this.topMostContainer!=this.container){return true
}return false
});
ContainedLine.BLOCK=0;
ContainedLine.LIST_ITEM=1;
ContainedLine.TABLE_CELL=2;
ContainedLine.TOP=3;
ContainedLine.prototype.__defineGetter__("containedLineType",function(){if(this.container==this.__top){return ContainedLine.TOP
}var A=document.defaultView.getComputedStyle(this.__container,null).getPropertyValue("display");
if(A=="block"){return ContainedLine.BLOCK
}else{if(A=="list-item"){return ContainedLine.LIST_ITEM
}else{if(A=="table-cell"){return ContainedLine.TABLE_CELL
}}}return -1
});
ContainedLine.prototype.setContainer=function(C,B){if(B){C=this.__container.parentNode.replaceChildOnly(this.__container,C.nodeName)
}else{this.__container.appendChild(C);
C.appendChild(this.__lineRange.extractContents())
}var A=documentCreateCSSLine(C.firstInsertionPoint(this.top));
A.forceLineBreaksBeforeAfter();
return A
};
ContainedLine.prototype.forceLineBreaksBeforeAfter=function(){if(this.topLine){return 
}if(this.containedLineType==ContainedLine.TABLE_CELL){return 
}if(!this.container.previousSibling||(this.container.previousSibling.nodeType==Node.ELEMENT_NODE)||!(/\n$/.test(this.container.previousSibling.nodeValue))){this.container.parentNode.insertBefore(document.createTextNode(STRING_LINEFEED),this.container)
}if(!this.container.nextSibling||(this.container.nextSibling.nodeType==Node.ELEMENT_NODE)||!(/^\n/.test(this.container.nextSibling.nodeValue))){this.container.parentNode.insertAfter(document.createTextNode(STRING_LINEFEED),this.container)
}};
ContainedLine.prototype.removeContainer=function(){if(this.topLine){return this
}if(this.emptyLine){this.deleteLine;
return null
}var B=this.firstInsertionPoint;
var A=B.backOne();
if(A==InsertionPoint.AT_TOP){B=null
}this.container.parentNode.insertBefore(this.lineContents,this.container);
this.container.parentNode.removeChild(this.container);
if(B){B.forwardOne()
}else{B=this.top.firstInsertionPoint(this.top)
}return documentCreateCSSLine(B)
};
ContainedLine.prototype.normalizeWhitespace=function(){if(document.defaultView.getComputedStyle(this.container,null).getPropertyValue("white-space")=="pre"){return 
}if(this.emptyLine){return 
}var A=document.createRange();
A.selectNode(this.container.lastChild);
A.setStart(this.__lastInsertionPoint.ipNode,this.__lastInsertionPoint.ipOffset);
if(A.toString().replace(/\s*/g,"").length==0){if(this.container.lastChild.childNodes.length==0){A.deleteContents()
}}A.selectNode(this.container.firstChild);
A.setEnd(this.__firstInsertionPoint.ipNode,this.__firstInsertionPoint.ipOffset);
if(A.toString().replace(/\s*/g,"").length==0){if(this.container.firstChild.childNodes.length==0){A.deleteContents()
}}this.__firstInsertionPoint.ipOffset=0;
if(this.__lastInsertionPoint.ipNode.nodeType==Node.ELEMENT_NODE){this.__lastInsertionPoint.ipOffset=this.container.childNodes.length
}else{this.__lastInsertionPoint.ipOffset=this.__lastInsertionPoint.ipNode.nodeValue.length
}if((this.container.lastChild.nodeType==Node.TEXT_NODE)&&(this.container.lastChild.nodeValue.length==0)){this.container.removeChild(this.container.lastChild)
}this.__lineRange.selectNodeContents(this.container);
return this
};
ContainedLine.prototype.deleteLine=function(){var B=document.createRange();
if(this.topMostContainer.localName=="td"||this.topMostContainer.localName=="th"){B.selectNode(this.container);
var A=this.container.parentNode;
eDOMEventCall("NodeBeforeDelete",this.container);
B.deleteContents();
A.appendChild(document.createTextNode(STRING_NBSP))
}else{B.selectNode(this.topMostContainer);
eDOMEventCall("NodeBeforeDelete",this.topMostContainer);
B.deleteContents()
}};
ContainedLine.prototype.deleteContents=function(){this.__lineRange.deleteContents();
var A=document.createTextNode(STRING_NBSP);
this.__container.appendChild(A);
return documentCreateCSSLine(__createInsertionPoint(this.__top,A,0))
};
ContainedLine.prototype.appendContent=function(A){this.normalizeWhitespace();
if(this.emptyLine){this.__lineRange.deleteContents()
}ret=A.firstChild;
this.container.appendChild(A);
eDOMEventCall("NodePositionChanged",ret);
return this.lastInsertionPoint.clone()
};
ContainedLine.prototype.setStyle=function(B,A){this.__container.setStyle(B,A)
};
ContainedLine.prototype.deleteStructure=function(){var F=this.tableCellAncestor;
if(F){this.setTopToTableCellAncestor()
}if(this.containedLineType==ContainedLine.TOP){return this.firstInsertionPoint
}var B=this.previousLine;
if(this.emptyLine){var E=this.top;
this.deleteLine();
var G=B?B.lastInsertionPoint:E.firstInsertionPoint;
return G
}var D=this.listItemAncestor;
if(D){if(this.containedLineType!=ContainedLine.LIST_ITEM){return this.removeContainer().firstInsertionPoint
}if(!B||!B.listItemAncestor){return this.firstInsertionPoint
}var G=B.appendContent(this.lineContents);
this.deleteLine();
return G
}if(this.topMostContainer==this.top){var A=this.removeContainer();
return A.firstInsertionPoint
}if(!B){var A=this.removeContainer();
return A.firstInsertionPoint
}var C=B.tableCellAncestor;
if(C&&(C!=this.top)){var A=this.removeContainer();
return A.firstInsertionPoint
}if((B.lineType==CSSLine.BOUNDED_LINE)&&B.endBoundary&&((B.endBoundary.contentType==Element.EMPTY_CONTENTTYPE)||(B.endBoundary==this.topMostContainer))){var A=this.removeContainer();
return A.firstInsertionPoint
}if(bxe_config.options["mergeDifferentBlocksOnDelete"]!="false"){var G=B.appendContent(this.lineContents);
this.deleteLine()
}else{if(B.container.XMLNode.localName==this.container.XMLNode.localName&&B.container.XMLNode.namespaceUri==this.container.XMLNode.namespaceUri){var G=B.appendContent(this.lineContents);
this.deleteLine()
}else{G=this.firstInsertionPoint.clone();
G.__needBackspace=true
}}return G
};
BoundedLine.prototype=new CSSLine();
BoundedLine.prototype.constructor=BoundedLine;
BoundedLine.superclass=CSSLine.prototype;
function BoundedLine(H,G,D,B,C,F){this.__startBoundary=B;
this.__endBoundary=C;
var A=(this.startBoundary!=null)?this.startBoundary.parentNode:this.endBoundary.parentNode;
var E=document.createRange();
E.selectNodeContents(A);
if(this.startBoundary){E.setStartAfter(this.startBoundary)
}else{E.setStartBefore(A.firstChild)
}if(this.endBoundary){E.setEndBefore(this.endBoundary)
}else{E.setEndAfter(A.lastChild)
}BoundedLine.superclass.init.call(this,H,G,D,E,F,A)
}BoundedLine.prototype.toString=function(){return("sb: "+this.startBoundary+"= eb: "+this.endBoundary+"= lineParent: "+this.lineParent+"= contents: "+this.lineRange.toString())
};
BoundedLine.prototype.__defineGetter__("startBoundary",function(){return this.__startBoundary
});
BoundedLine.prototype.__defineGetter__("endBoundary",function(){return this.__endBoundary
});
BoundedLine.prototype.setContainer=function(B,A){if(this.emptyLine){return this
}var C=this.__lineRange.extractContents();
if(this.__startBoundary){this.__startBoundary.parentNode.insertAfter(B,this.__startBoundary)
}else{this.__endBoundary.parentNode.insertBefore(B,this.__endBoundary)
}B.appendChild(C);
var D=documentCreateCSSLine(B.firstInsertionPoint(this.top));
D.forceLineBreaksBeforeAfter();
return D
};
BoundedLine.prototype.normalizeWhitespace=function(){var A=this.lineParent;
if(document.defaultView.getComputedStyle(A,null).getPropertyValue("white-space")=="pre"){return 
}if(this.empty){return 
}var B=document.createRange();
B.selectNodeContents(A);
B.setStart(this.lastInsertionPoint.ipNode,this.lastInsertionPoint.ipOffset);
if(this.endBoundary){B.setEndBefore(this.endBoundary)
}else{B.setEndAfter(A.lastChild)
}B.deleteContents();
B.selectNodeContents(A);
if(this.startBoundary){B.setStartAfter(this.startBoundary)
}else{B.setStartBefore(A.firstChild)
}B.setEnd(this.firstInsertionPoint.ipNode,this.firstInsertionPoint.ipOffset);
B.deleteContents();
if(this.__firstInsertionPoint.ipNode.nodeType==Node.TEXT_NODE){this.__firstInsertionPoint.ipOffset=0
}this.__recalculateLastInsertionPoint();
this.__lineRange.selectNodeContents(A);
this.__lineRange.setStart(this.firstInsertionPoint.ipNode,this.firstInsertionPoint.ipOffset);
this.__lineRange.setEnd(this.lastInsertionPoint.ipNode,this.lastInsertionPoint.ipOffset)
};
BoundedLine.prototype.deleteStartBoundary=function(){if(this.__startBoundary&&(this.__startBoundary.contentType==Element.EMPTY_CONTENTTYPE)){var B=documentCreateInsertionPoint(this.top,this.__startBoundary.parentNode,this.__startBoundary.offset);
var A=B.backOne();
if(A==InsertionPoint.AT_TOP){B=null
}this.__startBoundary.parentNode.removeChild(this.__startBoundary);
if(B){B.forwardOne()
}else{B=this.top.firstInsertionPoint(this.top)
}return B
}return this.firstInsertionPoint
};
BoundedLine.prototype.deleteContents=function(){if(this.emptyLine){return this
}this.__lineRange.deleteContents();
this.__elementCount=0;
var A=(this.startBoundary&&(this.startBoundary.contentType==Element.EMPTY_CONTENTTYPE))?this.startBoundary:null;
A=(!A&&this.endBoundary&&(this.endBoundary.contentType==Element.EMPTY_CONTENTTYPE))?this.endBoundary:A;
if(A){this.__firstInsertionPoint=__createInsertionPoint(this.top,A.parentNode,(A.offset+1));
this.__lastInsertionPoint=this.__firstInsertionPoint.clone();
return this
}var B=document.createTextNode(STRING_NBSP);
if(this.startBoundary){this.startBoundary.parentNode.insertAfter(B,this.startBoundary)
}else{this.endBoundary.parentNode.insertBefore(B,this.endBoundary)
}this.__firstInsertionPoint=__createInsertionPoint(this.__top,B,0);
this.__lastInsertionPoint=this.__firstInsertionPoint.clone();
this.__lineRange.selectNodeContents(B);
return this
};
BoundedLine.prototype.appendContent=function(A){this.normalizeWhitespace();
if(this.emptyLine&&!this.__lineRange.collapsed){this.__lineRange.deleteContents()
}if(this.endBoundary){this.endBoundary.parentNode.insertBefore(A,this.endBoundary)
}else{this.lineParent.appendChild(A)
}return this.lastInsertionPoint
};
BoundedLine.prototype.deleteLineParent=function(){var B=this.lineParent.firstInsertionPoint;
var A=B.backOne();
if(A!=InsertionPoint.AT_TOP){this.lineParent.parentNode.removeChildOnly(this.lineParent);
B.forwardOne()
}return B
};
BoundedLine.prototype.deleteStructure=function(){if(this.startBoundary&&(this.startBoundary.contentType==Element.EMPTY_CONTENTTYPE)){var D=this.deleteStartBoundary();
return D
}var B=this.previousLine;
if(!B){return this.firstInsertionPoint
}var C=this.tableCellAncestor;
var A=B.tableCellAncestor;
if((C||A)&&(A!=C)){return this.firstInsertionPoint
}if(B.lineType==CSSLine.CONTAINED_LINE){D=B.appendContent(this.lineContents);
this.deleteContents();
return D
}if(B.endBoundary){return this.firstInsertionPoint
}var D=B.appendContent(this.lineContents);
this.deleteContents();
return D
};
BoundedLine.prototype.setToTokenLine=function(){if(!this.emptyLine){this.deleteContents()
}var A=document.createTextNode(STRING_NBSP);
if(this.startBoundary){this.startBoundary.parentNode.insertAfter(A,this.startBoundary)
}else{this.endBoundary.parentNode.insertBefore(A,this.endBoundary)
}return A
};
Document.prototype.createCSSTextRange=documentCreateCSSTextRange;
function documentCreateCSSTextRange(A,B){A.__top=B;
A.__markTextBoundaries(true);
return A
}function __createCSSRangeFromIPs(D,C,B){var A=document.createRange();
A.selectNode(C.ipNode);
A.setStart(C.ipNode,C.ipOffset);
A.setEnd(B.ipNode,B.ipOffset);
A=documentCreateCSSTextRange(A,D);
return A
}Range.prototype.__defineGetter__("firstInsertionPoint",function(){return documentCreateInsertionPoint(this.__top,this.startContainer,this.startOffset)
});
Range.prototype.__defineGetter__("lastInsertionPoint",function(){return documentCreateInsertionPoint(this.__top,this.endContainer,this.endOffset)
});
Range.prototype.__defineGetter__("lines",function(){var A=new Array();
var C=this.firstInsertionPoint;
var B=documentCreateCSSLine(C);
do{A.push(B);
B=B.nextLine
}while(B&&(this.containsInsertionPoint(B.firstInsertionPoint)));
return A
});
Range.prototype.__defineGetter__("firstLine",function(){var A=this.firstInsertionPoint;
return documentCreateCSSLine(A)
});
Range.prototype.containsInsertionPoint=function(C){var A=this.cloneRange();
if(A.startContainer.nodeType==Node.TEXT_NODE){A.setStart(A.startContainer.parentNode,A.startContainer.offset)
}if(A.endContainer.nodeType==Node.TEXT_NODE){A.setEnd(A.endContainer.parentNode,(A.endContainer.offset+1))
}var B=document.createRange();
B.selectNodeContents(C.ipReferencedNode);
if(!A.containsRange(B)){return false
}return true
};
Range.prototype.__defineGetter__("firstInsertionPoint",function(){if(this.startContainer.nodeType==Node.TEXT_NODE){return documentCreateInsertionPoint(this.top,this.startContainer,this.startOffset)
}if(this.startContainer.childNodes.length>this.startOffset){var B=this.startContainer.childNodes[this.startOffset];
if(B.nodeType==Node.TEXT_NODE){return documentCreateInsertionPoint(this.top,B,0)
}if(B.contentType==Element.EMPTY_CONTENTTYPE){return documentCreateInsertionPoint(this.top,this.startContainer,this.startOffset)
}var A=new __IPNodeIterator(this.startContainer);
A.currentNode=B;
A.nextNode();
B=A.currentNode;
if(!B){A.previousNode();
B=A.nextNode()
}if(!B){return null
}return documentCreateInsertionPoint(this.top,B.parentNode,B.offset)
}var A=new __IPNodeIterator(this.startContainer);
var B=A.setToEnd();
if(!B){return null
}return documentCreateInsertionPoint(this.top,B.parentNode,B.offset)
});
Range.prototype.selectInsertionPoint=function(B){try{this.selectNode(B.ipNode)
}catch(A){}this.setStart(B.ipNode,B.ipOffset);
this.collapse(true)
};
Range.prototype.__defineGetter__("top",function(){return this.__top
});
function parentBelow(C,B){var A=B;
var D;
do{D=A;
A=A.parentNode
}while(A!=C);
return D
}Range.prototype.includeExclusiveParents=function(){var J=this.firstInsertionPoint;
var L=J.line;
var C=InsertionPoint.SAME_LINE;
if(!((L.lineType==CSSLine.BOUNDED_LINE)&&L.startBoundary)){var D=J.clone();
C=D.backOne();
if(C==InsertionPoint.AT_TOP){this.setStart(this.top,0)
}else{if(C==InsertionPoint.CROSSED_BLOCK){var I=document.createRange();
I.setStart(D.ipNode,D.ipOffset);
I.setEnd(J.ipNode,J.ipOffset);
var B=I.commonAncestorContainer;
var G=parentBelow(B,J.ipNode).offset;
this.setStart(B,G)
}else{if(D.ipNode!=J.ipNode){this.setStart(D.ipNode,(D.ipOffset+1))
}}}}var K=this.lastInsertionPoint;
var A=K.line;
var F=InsertionPoint.SAME_LINE;
if(!((A.lineType==CSSLine.BOUNDED_LINE)&&A.endBoundary)){var E=K.clone();
F=E.forwardOne();
if(F==InsertionPoint.AT_TOP){this.setEnd(this.top,this.top.childNodes.length)
}else{if(F==InsertionPoint.CROSSED_BLOCK){var I=document.createRange();
I.setStart(K.ipNode,K.ipOffset);
I.setEnd(E.ipNode,E.ipOffset);
var M=I.commonAncestorContainer;
var H=parentBelow(M,K.ipNode).offset+1;
this.setEnd(M,H)
}else{if(E.ipNode!=K.ipNode){this.setEnd(E.ipNode,(E.ipOffset-1))
}}}}return((F==InsertionPoint.AT_TOP)&&(C==InsertionPoint.AT_TOP))
};
Range.prototype.extractContentsByCSS=function(){var D=document.createDocumentFragment();
var C=this.__startTableRanges();
var A=this.__endTableRanges();
for(var B=0;
B<C.length;
B++){D.appendChild(C[B].__simpleExtractContentsByCSS())
}if(!this.collapsed){D.appendChild(this.__simpleExtractContentsByCSS())
}for(var B=0;
B<A.length;
B++){D.appendChild(A[B].__simpleExtractContentsByCSS())
}if(C.length){this.selectInsertionPoint(C[0].firstInsertionPoint)
}return D
};
Range.prototype.__simpleExtractContentsByCSS=function(){if(this.collapsed){return document.createDocumentFragment()
}var I=this.firstInsertionPoint;
var E=I.clone();
var F=false;
var J=this.lastInsertionPoint;
if(this.includeExclusiveParents()){this.top.appendChild(document.createTextNode(STRING_NBSP));
E=null
}else{var K=I.line;
var D=J.line;
var C=InsertionPoint.SAME_LINE;
if((this.startContainer.nodeType==Node.ELEMENT_NODE)||(this.startContainer!=I.ipNode)){C=E.backOne();
if(C==InsertionPoint.AT_TOP){E=null
}}if(!J.equivalent(D.lastInsertionPoint)&&!K.equivalent(D)&&!I.equivalent(K.firstInsertionPoint)){F=true
}}var A=this.extractContents();
if(F){if(E){var G=E.line;
var H=E.lineOffset;
var B=J.line.deleteStructure();
E=documentCreateCSSLine(B).insertionPointAt(H)
}else{J.line.deleteStructure()
}}this.selectInsertionPoint((E?E:this.top.firstInsertionPoint(this.top)));
return A
};
Range.prototype.__startTableRanges=function(){var A=new Array();
while(!this.collapsed){var F=this.firstInsertionPoint;
var C=F.tableCellAncestor;
if(!C){break
}var D=this.lastInsertionPoint.tableCellAncestor;
if(D!=C){var E=C.lastInsertionPoint(this.top);
var B=E.clone();
B.forwardOne();
this.setStart(B.ipNode,B.ipOffset);
startRange=__createCSSRangeFromIPs(C,F,E)
}else{startRange=documentCreateCSSTextRange(this.cloneRange(),C);
this.collapse(false)
}A.push(startRange)
}return A
};
Range.prototype.__endTableRanges=function(){var A=new Array();
while(!this.collapsed){var E=this.lastInsertionPoint;
var C=E.tableCellAncestor;
if(!C){break
}var B=this.firstInsertionPoint.tableCellAncestor;
if(C!=B){var F=C.firstInsertionPoint(this.top);
var D=F.clone();
D.backOne();
this.setEnd(D.ipNode,D.ipOffset);
endRange=__createCSSRangeFromIPs(C,F,E)
}else{endRange=documentCreateCSSTextRange(this,C);
this.collapse(true)
}A.push(endRange)
}return A
};
Range.prototype.__defineGetter__("textNodes",function(){this.normalizeText();
var C=this.startContainer;
if(this.startOffset!=0){this.startContainer.splitText(this.startOffset);
this.__restoreTextBoundaries();
C=this.startContainer
}if(this.endOffset!=this.endContainer.length){this.endContainer.splitText(this.endOffset)
}var A=document.createTreeWalker(this.commonAncestorContainer,NodeFilter.SHOW_TEXT,null,false);
var D=new Array();
A.currentNode=C;
var B=A.currentNode;
while(B){if(__NodeFilter.nonEmptyText(B)==NodeFilter.FILTER_ACCEPT){D[D.length]=B
}if(B==this.endContainer){break
}B=A.nextNode()
}this.__restoreTextBoundaries();
return D
});
Range.prototype.containsRange=function(A){var C=this.cloneRange();
C.__maximizeContext();
var B=C.compareBoundaryPoints(Range.START_TO_START,A);
if(C.compareBoundaryPoints(Range.START_TO_START,A)==1){return false
}if(C.compareBoundaryPoints(Range.END_TO_END,A)==-1){return false
}return true
};
Range.prototype.normalizeElements=function(A){A=A.toLowerCase();
var B=this;
var D=function(G){var F=document.createRange();
F.selectNodeContents(G);
if(!B.containsRange(F)){return NodeFilter.FILTER_REJECT
}F.detach();
if(G.nodeName.toLowerCase()==A){var E=G.__editablePreviousSibling;
if(E&&E.match&&E.match(G)){return NodeFilter.FILTER_ACCEPT
}return NodeFilter.FILTER_SKIP
}return NodeFilter.FILTER_SKIP
};
var C=document.createTreeWalker(this.commonAncestorContainer,NodeFilter.SHOW_ELEMENT,D,false);
this.normalizeElementsInTree=function(H){var I=H.firstChild();
while(I!=null){this.normalizeElementsInTree(H);
H.currentNode=I;
var F=I;
I=H.nextSibling();
var G=F.__editablePreviousSibling;
while(G.nextSibling!=F){G.parentNode.removeChild(G.nextSibling)
}var E=document.createRange();
E.selectNodeContents(F);
G.appendChild(E.extractContents());
G.normalize();
F.parentNode.removeChild(F)
}};
this.normalizeElementsInTree(C)
};
Range.prototype.renameElements=function(B,A){this.__markTextBoundaries(false);
B=B.toLowerCase();
A=A.toLowerCase();
var D=this;
var F=function(H){var G=document.createRange();
G.selectNodeContents(H);
if(!D.containsRange(G)){return NodeFilter.FILTER_REJECT
}G.detach();
if(H.nodeName.toLowerCase()==B){return NodeFilter.FILTER_ACCEPT
}return NodeFilter.FILTER_SKIP
};
var E=document.createTreeWalker(this.commonAncestorContainer,NodeFilter.SHOW_ELEMENT,F,false);
var C=false;
this.renameElementsInTree=function(G){var I=G.firstChild();
while(I!=null){this.renameElementsInTree(G);
G.currentNode=I;
var H=I;
I=G.nextSibling();
H.parentNode.replaceChildOnly(H,A);
C=true
}};
this.renameElementsInTree(E);
if(C){this.__restoreTextBoundaries();
return true
}return false
};
Range.prototype.normalizeText=function(){this.__markTextBoundaries(false);
this.commonAncestorContainer.parentElement.normalize();
this.__restoreTextBoundaries()
};
var keepTxtNodes=null;
Range.prototype.hasStyle=function(B,A){var C=this.textNodes;
keepTxtNodes=C;
for(i=0;
i<C.length;
i++){var D=C[i].parentNode;
if(document.defaultView.getComputedStyle(D,null).getPropertyValue(B)!=A){return false
}}return true
};
Range.prototype.hasClass=function(B){var C=this.textNodes;
keepTxtNodes=C;
for(var A=0;
A<C.length;
A++){var D=C[A].parentNode;
if(!D.hasClassOrIsElement(B)){return false
}}return true
};
Range.prototype.elementsWithDisplay=function(D){var B=this.cloneRange();
if(B.startContainer.nodeType==Node.TEXT_NODE){B.setStart(B.startContainer,0)
}if(B.endContainer.nodeType==Node.TEXT_NODE){B.setEnd(B.endContainer,B.endContainer.nodeValue.length)
}var F=function(H){if(document.defaultView.getComputedStyle(H,null).getPropertyValue("display")!=D){return NodeFilter.FILTER_SKIP
}var G=document.createRange();
G.selectNodeContents(H);
if(!B.containsRange(G)){return NodeFilter.FILTER_REJECT
}return NodeFilter.FILTER_ACCEPT
};
var A=document.createTreeWalker(B.commonAncestorContainer.parentElement,NodeFilter.SHOW_ELEMENT,F,false);
var C=new Array();
var E=A.firstChild();
while(E){C.push(E);
E=A.nextNode()
}return C
};
Range.prototype.__markTextBoundaries=function(A){if(!A&&(this.startTextPointer||this.endTextPointer)){return 
}if(this.startContainer.nodeType==Node.TEXT_NODE){this.startTextPointer=new __TextPointer(this.__top,this.startContainer,this.startOffset)
}else{if(this.startTextPointer){delete this.startTextPointer
}}if(this.endContainer.nodeType==Node.TEXT_NODE){if(this.collapsed){this.endTextPointer=this.startTextPointer
}else{this.endTextPointer=new __TextPointer(this.__top,this.endContainer,this.endOffset)
}}else{if(this.endTextPointer){delete this.endTextPointer
}}};
Range.prototype.__restoreTextBoundaries=function(){if(this.startTextPointer){var A=this.startTextPointer.referencedTextNode;
this.selectNode(A);
this.setStart(this.startTextPointer.referencedTextNode,this.startTextPointer.referencedOffset)
}if(this.endTextPointer){this.setEnd(this.endTextPointer.referencedTextNode,this.endTextPointer.referencedOffset)
}};
Range.prototype.__clearTextBoundaries=function(){if(this.startTextPointer){delete this.startTextPointer
}if(this.endTextPointer){delete this.endTextPointer
}};
Range.prototype.__maximizeContext=function(){if((this.startContainer.nodeType==Node.TEXT_NODE)&&((this.startOffset==0)||(this.startOffset==this.startContainer.nodeValue.length))){var C=1;
if(this.startOffset==0){C=0
}var A=this.startContainer.parentNode;
var B=this.startContainer.offset;
if(this.collapsed){this.selectNode(A);
this.setStart(A,B+C);
this.collapse(true);
return 
}this.setStart(A,B+C)
}if((this.endContainer.nodeType==Node.TEXT_NODE)&&((this.endOffset==0)||(this.endOffset==this.endContainer.nodeValue.length))){var C=1;
if(this.endOffset==0){C=0
}var A=this.endContainer.parentNode;
var B=this.endContainer.offset;
this.setEnd(A,B+C)
}};
function __TextPointer(A,D,C){this.root=A;
this.absTextOffset=0;
this.textNode=D;
this.textOffset=C;
this.currentTextNode=D;
this.currentTextOffset=C;
this.__goToStart=true;
this.textTW=document.createTreeWalker(this.root,NodeFilter.SHOW_TEXT,__NodeFilter.nonEmptyText,false);
this.absTextOffset=0;
this.textTW.currentNode=this.root;
for(var B=this.textTW.firstChild();
B!=null;
B=this.textTW.nextNode()){if(B==this.textNode){this.absTextOffset+=this.textOffset;
break
}this.absTextOffset+=B.nodeValue.length
}this.calculateTextNode=function(){this.textTW.currentNode=this.root;
var E=null;
var G=possEndSoFar=0;
for(var F=this.textTW.firstChild();
F!=null;
F=this.textTW.nextNode()){if(this.__goToStart&&(this.absTextOffset==possEndSoFar)){this.currentTextNode=F;
this.currentTextOffset=0;
return 
}possEndSoFar+=F.nodeValue.length;
if((this.absTextOffset<possEndSoFar)||((!this.__goToStart)&&(this.absTextOffset==possEndSoFar))){this.currentTextNode=F;
this.currentTextOffset=this.absTextOffset-G;
return 
}G=possEndSoFar;
E=F
}this.currentTextNode=E;
this.currentTextOffset=E.nodeValue.length;
return 
}
}__TextPointer.prototype.__defineSetter__("goToStart",function(A){this.__goToStart=A
});
__TextPointer.prototype.__defineGetter__("referencedOffset",function(){return this.currentTextOffset
});
__TextPointer.prototype.__defineGetter__("referencedTextNode",function(){this.calculateTextNode();
return this.currentTextNode
});
__TextPointer.prototype.toString=function(){return("TextPointer: "+this.referencedTextNode.nodeValue+":"+this.referencedOffset)
};
function __NodeFilter(){}__NodeFilter.nonEmptyText=function(A){if(A.nodeType!=Node.TEXT_NODE){return NodeFilter.FILTER_ACCEPT
}if(A.nodeValue.length==0){return NodeFilter.FILTER_REJECT
}if(/\S+/.test(A.nodeValue)){return NodeFilter.FILTER_ACCEPT
}if(/\u00A0+/.test(A.nodeValue)){return NodeFilter.FILTER_ACCEPT
}return NodeFilter.FILTER_REJECT
};
const STRING_NBSP="\u00A0";
const CHARCODE_NBSP=160;
const CHARCODE_SPACE=32;
const STRING_SPACE="\u0020";
const CHARCODE_NEWLINE="012";
const STRING_LINEFEED="\u000A";
const CHARCODE_TAB="009";
var feedback=false;
function __Feedbackack(D){if(!B){return 
}var C=document.getElementById("feedbackArea");
if(!C){return 
}var B=document.createTextNode(D);
var A=documentCreateXHTMLElement("div");
A.appendChild(B);
C.appendChild(A)
}const OPTION_DEFAULTTABLECLASS="defaultTableClass";
const MATHMLNS="http://www.w3.org/1998/Math/MathML";
function bxeConfig(B,D,A){var E=new mozileTransportDriver("http");
this.parseUrlParams();
this.configParams=A;
if(D){B=this.urlParams[B]
}bxe_about_box.addText(" ("+B+") ...");
E.bxeConfig=this;
try{debug("td.load "+B);
E.load(B,bxeConfig.parseConfig,false)
}catch(C){bxe_catch_alert(C)
}return true
}bxeConfig.parseConfig=function(G){if(G.isError){alert("Error loading config file \n"+G.statusText);
return false
}if(G.document.documentElement.nodeName!="config"){alert("doesn't look like a BXE config file.\n Here's the full output:\n "+G.document.saveXML(G.document));
return false
}bxe_about_box.addText("Config Loaded");
var I=G.td.bxeConfig;
I.doc=G.document;
I.xmlfile=I.getContent("/config/files/input/file[@name='BX_xmlfile']");
I.xmlfile_method=I.getContent("/config/files/input/file[@name='BX_xmlfile']/@method");
if(!I.xmlfile_method){I.xmlfile_method="webdav"
}I.xslfile=I.getContent("/config/files/input/file[@name='BX_xslfile']");
I.xhtmlfile=I.getContent("/config/files/input/file[@name='BX_xhtmlfile']");
I.validationfile=I.getContent("/config/files/input/file[@name='BX_validationfile']");
I.langfile=I.getContent("/config/files/input/file[@name='BX_langfile']");
I.exitdestination=I.getContent("/config/files/output/file[@name='BX_exitdestination']");
I.cssfiles=I.getContentMultiple("/config/files/css/file");
I.scriptfiles=I.getContentMultiple("/config/files/scripts/file");
I.xslparams=I.getContentMultiple("/config/files/input/xslparams",true);
var F=I.getContentMultiple("/config/menu/menu",true);
I.menus=new Array();
for(var C=0;
C<F.length;
C++){var D=I.getContentMultiple("/config/menu/menu[@name='"+F[C].name+"']/menu",true);
I.menus.push({"name":F[C].name,"menus":D})
}var A=I.getPlugins();
for(var C=0;
C<A.length;
C++){I.scriptfiles.push("plugins/"+A[C]+".js")
}var H=I.doc.evaluate("/config/context[@type='dontShow']/element",I.doc,null,0,null);
I.dontShowInContext=new Array();
node=H.iterateNext();
while(node){I.dontShowInContext[node.getAttribute("ns")+":"+node.getAttribute("name")]=true;
node=H.iterateNext()
}var H=I.doc.evaluate("/config/context[@type='dontShow']/attribute",I.doc,null,0,null);
I.dontShowInAttributeDialog=new Array();
node=H.iterateNext();
while(node){I.dontShowInAttributeDialog[node.getAttribute("name")]=true;
node=H.iterateNext()
}var B=I.doc.evaluate("/config/callbacks/element",I.doc,null,0,null);
I.callbacks=new Array();
node=B.iterateNext();
while(node){var K=new Array();
K["type"]=node.getAttribute("type");
K["precheck"]=node.getAttribute("precheck");
K["content"]=node.firstChild.data;
I.callbacks[node.getAttribute("ns")+":"+node.getAttribute("name")]=K;
node=B.iterateNext()
}I.events=new Array();
I.events["toggleSourceMode"]="bxe_toggleSourceMode";
I.events["toggleTagMode"]="bxe_toggleTagMode";
I.events["toggleNormalMode"]="bxe_toggleNormalMode";
I.events["DocumentSave"]="__bxeSave";
I.events["ToggleTextClass"]="bxe_toggleTextClass";
I.events["appendNode"]="bxe_appendNode";
I.events["appendChildNode"]="bxe_appendChildNode";
I.events["InsertLink"]="bxe_InsertLink";
I.events["DeleteLink"]="bxe_DeleteLink";
I.events["CleanInline"]="bxe_CleanInline";
I.events["InsertTable"]="bxe_InsertTable";
I.events["InsertImage"]="bxe_InsertObject";
I.events["ShowAssetDrawer"]="bxe_ShowAssetDrawer";
I.events["OrderedList"]="bxe_OrderedList";
I.events["UnorderedList"]="bxe_UnorderedList";
I.events["InsertAsset"]="bxe_InsertAsset";
I.events["InsertSpecialchars"]="bxe_InsertSpecialchars";
I.events["changeLinesContainer"]="bxe_changeLinesContainer";
I.events["Exit"]="bxe_exit";
I.events["Undo"]="bxe_history_undo";
I.events["Redo"]="bxe_history_redo";
I.events["NodeInsertedBefore"]="bxe_NodeInsertedBefore";
I.events["NodeBeforeDelete"]="bxe_NodeBeforeDelete";
I.events["NodePositionChanged"]="bxe_NodePositionChanged";
I.events["ContextPopup"]="bxe_ContextPopup";
var E=I.doc.evaluate("/config/events/event",I.doc,null,0,null);
node=E.iterateNext();
while(node){I.events[node.getAttribute("name")]=node.firstChild.data;
node=E.iterateNext()
}var J=I.doc.evaluate("/config/options/option",I.doc,null,0,null);
I.options=new Array();
I.options[OPTION_DEFAULTTABLECLASS]="ornate";
node=J.iterateNext();
while(node){I.options[node.getAttribute("name")]=node.firstChild.data;
node=J.iterateNext()
}config_loaded(I)
};
bxeConfig.prototype.getButtons=function(){if(!this.buttons){this.buttons=new Array();
var E;
var D=new Array();
var A=this.doc.evaluate("/config/buttons/location",this.doc,null,0,null);
E=A.iterateNext();
if(E){this.buttons["_location"]=E.getAttribute("src")
}var A=this.doc.evaluate("/config/buttons/dimension",this.doc,null,0,null);
E=A.iterateNext();
if(!E){alert("no button definitions found in config.xml\nYour config.xml looks like this:\n"+this.doc.saveXML())
}D.push(E.getAttribute("width"));
D.push(E.getAttribute("height"));
D.push(E.getAttribute("buttonwidth"));
D.push(E.getAttribute("buttonheight"));
this.buttons["Dimension"]=D;
var A=this.doc.evaluate("/config/buttons/button",this.doc,null,0,null);
var B=0;
var C;
while(E=A.iterateNext()){D=new Array();
D["col"]=E.getAttribute("col");
D["row"]=E.getAttribute("row");
D["action"]=E.getAttribute("action");
D["type"]=E.getAttribute("type");
C=E.getAttribute("ns");
if(C!==null){D["ns"]=C
}else{D["ns"]=""
}if(E.firstChild){D["data"]=E.firstChild.data
}this.buttons[E.getAttribute("name")]=D
}}return this.buttons
};
bxeConfig.prototype.getPlugins=function(){if(!this.plugins){this.plugins=new Array();
this.pluginOptions=new Array();
var C=document.getElementsByTagName("head")[0];
var A=this.doc.evaluate("/config/plugins/plugin",this.doc,null,0,null);
while(node=A.iterateNext()){this.plugins.push(node.getAttribute("name"));
this.pluginOptions[node.getAttribute("name")]=new Array();
var B=this.doc.evaluate("option",node,null,0,null);
while(onode=B.iterateNext()){var E=onode.firstChild;
var D="";
while(E){D+=onode.ownerDocument.saveXML(E);
E=E.nextSibling
}this.pluginOptions[node.getAttribute("name")][onode.getAttribute("name")]=D
}}}return this.plugins
};
bxeConfig.prototype.getPluginOptions=function(A){if(!this.plugins){this.getPlugins()
}return this.pluginOptions[A]
};
bxeConfig.prototype.getContentMultiple=function(B,G){var A=this.doc.evaluate(B,this.doc,null,0,null);
var E;
var F=new Array();
var D=0;
while(E=A.iterateNext()){if(G){var C=E.getAttribute("name");
F[D]={"name":C,"value":this.translateUrl(E)}
}else{F[D]=this.translateUrl(E)
}D++
}return F
};
bxeConfig.prototype.translateUrl=function(B){var A;
try{if(B.nodeType!=1){return B.value
}}catch(C){return""
}if(B.getAttribute("isConfigParam")=="true"){A=this.configParams[B.firstChild.data]
}else{if(B.getAttribute("isParam")=="true"){A=this.urlParams[B.firstChild.data]
}else{if(B.firstChild){A=B.firstChild.data
}else{return""
}}}if(B.getAttribute("prefix")){A=B.getAttribute("prefix")+A
}return A
};
bxeConfig.prototype.getContent=function(B){var A=this.doc.evaluate(B,this.doc,null,0,null);
var C=A.iterateNext();
if(!C){return null
}else{return this.translateUrl(C)
}};
bxeConfig.prototype.parseUrlParams=function(){this.urlParams=new Array();
var D=window.location.search.substring(1,window.location.search.length).split("&");
var A=0;
for(var C in D){var B=D[C].split("=");
if(typeof B[1]!="undefined"){this.urlParams[B[0]]=B[1]
}}};
var defaultContainerName="div";
function listLinesToggle(B,O,A){var P=B.lines;
var N=B.commonAncestorContainer.parentElement;
var G=false;
var F=false;
var H;
var C;
for(var D=0;
D<P.length;
D++){var K=P[D].listItemAncestor;
if(!K){if((P[D].lineType==CSSLine.CONTAINED_LINE)&&(P[D].container==N)){N=N.parentNode
}if(P[D].container.getCStyle("display")=="table-cell"){P[D]=P[D].setContainer(documentCreateXHTMLElement(defaultContainerName),false);
if(P[D].container.childNodes[0].data.replace(/ /g,"")==""){P[D].container.childNodes[0].data=STRING_NBSP
}}P[D]=P[D].setContainer(documentCreateXHTMLElement("li"),true);
if(P[D].lineType==CSSLine.CONTAINED_LINE){var J=documentCreateXHTMLElement(O);
P[D].container.insertParent(J);
G=true
}}else{if(!F&&(K!=B.top)&&(K.parentNode!=B.top)){H=K;
F=true
}C=K
}}if(G){var E=document.createRange();
E.selectNodeContents(N);
E.normalizeElements(O)
}else{if(F){var L=__topListContainer(H);
var M=__topListContainer(C);
var E=document.createRange();
E.selectNode(__topListContainer(H));
if(L!=M){E.setEnd(M.parentNode,M.offset+1)
}E=documentCreateCSSTextRange(E,B.top);
var I=E.renameElements(A,O);
if(!I){outdentLines(E)
}else{E.normalizeElements(O)
}}}}function indentLines(H){var A=H.lines;
var D=new Array();
var G=new Array();
for(var C=0;
C<A.length;
C++){var E=A[C].listItemAncestor;
if(E){if((D.length==0)||(D[D.length-1]!=E)){D.push(E)
}}else{G.push(A[C])
}}if(D.length){if((D.length==1)&&(D[0]==H.top)){return 
}var F=H.commonAncestorContainer.parentElement;
for(var C=0;
C<D.length;
C++){if(!D[C].descendent(F)){F=D[C].parentNode
}D[C].insertParent(D[C].parentNode.cloneNode(false))
}var B=document.createRange();
B.selectNodeContents(F);
B.normalizeElements("ul");
B.normalizeElements("ol")
}else{if((G.length==1)&&G[0].topLine){G[0]=G[0].setContainer(documentCreateXHTMLElement(defaultContainerName),true);
G[0].setStyle("margin-left","+40px");
return 
}}for(var C=0;
C<G.length;
C++){if(G[C].lineType==CSSLine.BOUNDED_LINE){if(G[C].emptyLine){continue
}G[C]=G[C].setContainer(documentCreateXHTMLElement(defaultContainerName),true)
}else{if(G[C].containedLineType==ContainedLine.TABLE_CELL){continue
}}G[C].setStyle("margin-left","+40px")
}}function outdentLines(F){var A=F.lines;
var C=new Array();
var E=new Array();
for(var B=0;
B<A.length;
B++){var D=A[B].listItemAncestor;
if(D){if((C.length==0)||(C[C.length-1]!=D)){C.push(D)
}}else{E.push(A[B])
}}if(((C.length==1)&&(C[0]==F.top))||((C.length>0)&&(C[0].parentNode==F.top))||((E.length==1)&&(E[0].topLine))){return 
}for(var B=0;
B<C.length;
B++){__outdentListItem(C[B])
}for(var B=0;
B<E.length;
B++){if(E[B].lineType==CSSLine.BOUNDED_LINE){if(E[B].emptyLine){continue
}E[B]=E[B].setContainer(documentCreateXHTMLElement("p"),true)
}else{if(E[B].containedLineType==ContainedLine.TABLE_CELL){continue
}}E[B].setStyle("margin-left","-40px")
}}__outdentListItem=function(E){var G=E.parentNode.split(E.offset);
if(G){E=G.firstChild
}var A=E.parentNode;
var F=E.__editableNextSibling;
var E=A.parentNode.insertBefore(E,A);
if(!F){var D=A.parentNode;
A.parentNode.removeChild(A)
}if(!(E.parentNode.nodeNamed("ul")||E.parentNode.nodeNamed("ol"))){var B=document.createRange();
B.selectNodeContents(E);
B=documentCreateCSSTextRange(B,E.parentNode);
var C=B.lines;
if(C.length==1){if(C[0].container==E){C[0].setContainer(documentCreateXHTMLElement("p"),false)
}}else{if((C[0].lineType==CSSLine.BOUNDED_LINE)&&!C[0].startBoundary&&!C[0].emptyLine){C[0]=C[0].setContainer(documentCreateXHTMLElement(defaultContainerName),true)
}var H=C.length-1;
if((C[H].lineType==CSSLine.BOUNDED_LINE)&&!C[H].endBoundary&&!C[H].emptyLine){C[H]=C[H].setContainer(documentCreateXHTMLElement(defaultContainerName),true)
}}var D=E.parentNode;
E.parentNode.removeChildOnly(E)
}};
function __topListContainer(B){var A=B;
while(A.parentNode.nodeNamed("ul")||A.parentNode.nodeNamed("ol")){A=A.parentNode
}return A
}Element.prototype.setClass=function(A){this.setAttribute("class",A)
};
Element.prototype.getClass=function(){return this.getAttribute("class")
};
InsertionPoint.prototype.splitXHTMLLine=function(){var A=this.line;
if(A.lineType==CSSLine.BOUNDED_LINE){if(A.emptyLine){var D=A.setToTokenLine();
var C=documentCreateInsertionPoint(A.top,D,0);
this.set(C);
A=this.line
}var B=this.lineOffset;
A=A.setContainer(documentCreateXHTMLElement(defaultContainerName),true);
var C=A.insertionPointAt(B);
this.set(C)
}else{if((A.container==this.top)){return true
}else{if((A.container==this.top)||(A.container==A.tableCellAncestor)){var B=this.lineOffset;
A=A.setContainer(documentCreateXHTMLElement(defaultContainerName),false);
var C=A.insertionPointAt(B);
this.set(C)
}}}this.splitContainedLine()
};
const XHTMLNS="http://www.w3.org/1999/xhtml";
function documentCreateXHTMLElement(A){return bxe_config.xmldoc.createElementNS(null,A)
}Element.prototype.hasXHTMLAttribute=function(A){if(document.body){return this.hasAttribute(A)
}return this.hasAttributeNS(XHTMLNS,A)
};
Element.prototype.getXHTMLAttribute=function(A){if(document.body){return this.getAttribute(A)
}return this.getAttributeNS(XHTMLNS,A)
};
if(typeof eDOM_bxe_mode=="undefined"){var eDOM_bxe_mode=false
}Range.prototype.styleText=function(D,H,F,B){if(this.collapsed){return 
}if(!keepTxtNodes){textNodes=this.textNodes
}else{textNodes=keepTxtNodes
}forLoop:for(i=0;
i<textNodes.length;
i++){var G=textNodes[i].parentNode;
while(G&&G.getCStyle("display")=="inline"){if(G.XMLNode.namespaceURI==B&&G.XMLNode.localName==D){continue forLoop
}G=G.parentNode
}G=textNodes[i].parentNode;
var A;
if(B!=XHTMLNS){var C=new XMLNodeElement(B,D,1,true);
var A=C._node;
A._XMLNode=null
}else{var A=documentCreateXHTMLElement(D)
}G.insertBefore(A,textNodes[i]);
A.appendChild(textNodes[i]);
eDOMEventCall("NodeInserted",A);
textNodes[i]=A.firstChild;
G=A
}this.__restoreTextBoundaries();
var E=this.commonAncestorContainer.parentElement;
if(document.defaultView.getComputedStyle(E,null).getPropertyValue("display")=="inline"){E=E.parentNode
}E.normalize();
E.__normalizeXHTMLTextStyle();
this.__restoreTextBoundaries();
keepTxtNodes=null;
return 
};
Range.prototype.linkText=function(F){if(this.collapsed){return 
}var B=this.textNodes;
for(i=0;
i<B.length;
i++){var E=B[i].parentNode;
if((E.childNodes.length>1)&&(E.nodeNamed("span")||E.nodeNamed("a"))){var D;
if(B[i].previousSibling){var D=E.cloneNode(false);
E.parentNode.insertBefore(D,E);
D.appendChild(B[i].previousSibling)
}if(B[i].nextSibling){var D=E.cloneNode(false);
if(E.nextSibling){E.parentNode.insertBefore(D,E.nextSibling)
}else{E.parentNode.appendChild(D)
}D.appendChild(B[i].nextSibling)
}}if(E.nodeName.toLowerCase()!="a"){if(E.nodeNamed("span")){E=E.parentNode.replaceChildOnly(E,"a")
}else{var A=documentCreateXHTMLElement("a");
E.insertBefore(A,B[i]);
A.appendChild(B[i]);
E=A
}}B[i]=E.firstChild;
E.setAttribute("href",F)
}var C=document.createRange();
C.selectNode(this.commonAncestorContainer);
C.normalizeElements("a");
C.detach();
this.commonAncestorContainer.parentElement.normalize();
this.__restoreTextBoundaries()
};
Range.prototype.clearTextLinks=function(){if(this.collapsed){return 
}var A=this.textNodes;
for(i=0;
i<A.length;
i++){var D=A[i].parentNode;
if(D.nodeNamed("span")&&D.getAttribute("class")=="a"){if(D.childNodes.length>1){var C;
if(A[i].previousSibling){var C=D.cloneNode(false);
D.parentNode.insertBefore(C,D);
C.appendChild(A[i].previousSibling)
}if(A[i].nextSibling){var C=D.cloneNode(false);
if(D.nextSibling){D.parentNode.insertBefore(C,D.nextSibling)
}else{D.parentNode.appendChild(C)
}C.appendChild(A[i].nextSibling)
}}if(D.attributes.length>1){D=D.parentNode.replaceChildOnly(D,"span");
D.removeAttribute("href")
}else{D.parentNode.removeChildOnly(D)
}}}var B=document.createRange();
B.selectNode(this.commonAncestorContainer);
B.normalizeElements("a");
B.detach();
this.commonAncestorContainer.parentElement.normalize();
this.__restoreTextBoundaries()
};
Range.prototype.updateXMLNodes=function(){var A=this.commonAncestorContainer;
if(this.startContainer.nodeType==3){var C=this.startContainer.parentNode
}else{var C=this.startContainer
}if(this.endContainer.nodeType==3){var D=this.endContainer.parentNode
}else{var D=this.endContainer
}if(C.compareDocumentPosition(D)&Node.DOCUMENT_POSITION_PRECEDING){C=D
}var E=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_ELEMENT,null,true);
E.currentNode=C;
var B=E.currentNode;
do{if(D==B){break
}B=E.nextNode()
}while(B);
return A
};
Element.prototype.__normalizeXHTMLTextStyle=function(){var I=function(J){if((J.parentNode.nodeNamed("span")||J.parentNode.nodeNamed("a"))&&(J.parentNode.childNodes.length==1)){return NodeFilter.FILTER_ACCEPT
}return NodeFilter.FILTER_REJECT
};
var E=document.createTreeWalker(this,NodeFilter.SHOW_TEXT,I,false);
var G=E.firstChild();
while(G){var F=G;
G=E.nextNode();
var H=F.parentNode;
H.removeRedundantInlineStyles();
if((__NodeFilter.nonEmptyText(F)==NodeFilter.FILTER_REJECT)||!H.hasAttributes()){var D=document.createRange();
D.selectNodeContents(H);
H.parentNode.insertBefore(D.extractContents(),H);
H.parentNode.normalize();
H.parentNode.removeChild(H)
}else{var A=H.__editablePreviousSibling;
if(A&&A.match&&A.match(H)){var C=H.parentNode;
while(A.nextSibling!=H){C.removeChild(A.nextSibling)
}var B=document.createRange();
B.selectNodeContents(H);
A.appendChild(B.extractContents());
A.normalize();
C.removeChild(H)
}}}};
Element.prototype.removeRedundantInlineStyles=function(){for(var C=0;
C<this.style.length;
C++){var D=this.style.item(C);
var B=this.style.getPropertyValue(D);
var A=document.defaultView.getComputedStyle(this.parentNode,null).getPropertyValue(D);
if(A==B){this.style.removeProperty(D);
if(document.defaultView.getComputedStyle(this,null).getPropertyValue(D)!=A){this.style.setProperty(D,B,"")
}}}if(this.hasXHTMLAttribute("style")&&(this.style.length==0)){this.attributes.removeNamedItem("style")
}};
Document.prototype.createTable=documentCreateTable;
function documentCreateTable(A,B,C){if((/\D+/.test(A))||(/\D+/.test(B))||(A==0)||(B==0)){return null
}if(typeof C!="undefined"&&C.nodeType==1){var D=bxe_createXMLNode(C.namespaceURI,C.localName)
}else{var D=bxe_createXMLNode(null,"table")
}D._node.appendChild(bxe_config.xmldoc.createTextNode("\n"));
return D._node
}function XMLNode(A){this._node=A
}XMLNode.prototype.__defineGetter__("namespaceURI",function(){if(this._node.namespaceURI==null){return""
}return this._node.namespaceURI
});
XMLNode.prototype.__defineGetter__("parentNode",function(){try{return this._node.parentNode.getXMLNode()
}catch(A){if(this._node.nodeType==2){return this._node.ownerElement.getXMLNode()
}return null
}});
XMLNode.prototype.__defineGetter__("firstChild",function(){if(this._node.firstChild){if(!this._node.firstChild.XMLNode){this._node.firstChild.XMLNode=this._node.firstChild.getXMLNode()
}return this._node.firstChild.XMLNode
}else{return null
}});
XMLNode.prototype.__defineGetter__("nextSibling",function(){if(this._node.nextSibling){if(!this._node.nextSibling.XMLNode){this._node.nextSibling.XMLNode=this._node.nextSibling.getXMLNode()
}return this._node.nextSibling.XMLNode
}else{return null
}});
XMLNode.prototype.__defineGetter__("previousSibling",function(){if(this._node.previousSibling){if(!this._node.previousSibling.XMLNode){this._node.previousSibling.XMLNode=this._node.previousSibling.getXMLNode()
}return this._node.previousSibling.XMLNode
}else{return null
}});
XMLNode.prototype.__defineGetter__("nodeValue",function(){return this._node.nodeValue
});
XMLNode.prototype.__defineGetter__("isWhitespaceOnly",function(){if(this._node.nodeType==3){if(/\S+/.test(this._node.nodeValue)){return false
}return true
}else{if(this._node.nodeType==1){var A=this._node.firstChild;
while(A){if(A.nodeType!=3){return false
}if(!A.isWhitespaceOnly){return false
}A=A.nextSibling
}return true
}return false
}});
XMLNode.prototype.__defineGetter__("localName",function(){return this._node.localName
});
XMLNode.prototype.__defineGetter__("nodeType",function(){return this._node.nodeType
});
XMLNode.prototype.__defineGetter__("nodeName",function(){return this._node.nodeName
});
XMLNode.prototype.__defineGetter__("ownerDocument",function(){return this._node.ownerDocument.XMLNode
});
XMLNode.prototype.hasChildNodes=function(){return this._node.hasChildNodes()
};
XMLNode.prototype.hasRealChildNodes=function(){if(!this._node.hasChildNodes()){return false
}var A=this._node.firstChild;
do{if(A.nodeType==1){return true
}else{if(A.nodeType==3&&(/\S+/.test(A.nodeValue))){return true
}}A=A.nextSibling
}while(A);
return false
};
XMLNode.prototype.__defineGetter__("allowedChildren",function(){var A=this.vdom.allowedChildren;
if(A){return A
}else{return new Array()
}});
XMLNode.prototype.isInHTMLDocument=function(){return true
};
XMLNode.prototype.insertBeforeIntern=function(B,D){try{var A=this._node.insertBefore(B,D);
return A.getXMLNode()
}catch(C){alert(this._node);
alert(B);
alert(D)
}};
XMLNode.prototype.appendChildIntern=function(B){try{var A=this._node.appendChild(B);
return A.getXMLNode()
}catch(C){alert(this._node);
alert(B);
alert(oldNode)
}};
XMLNode.prototype.unlink=function(){this.XMLNode=null;
var A=this.parentNode;
A._node.removeChild(this._node)
};
function XMLNodeElement(A){this._node=A
}XMLNode.prototype.copy=function(){var B=bxe_config.xmldoc.createRange();
B.selectNode(this._node);
var A=mozilla.getClipboard();
A.setData(B,MozClipboard.TEXT_FLAVOR)
};
XMLNode.prototype.cut=function(){this.copy();
var C=this.parentNode;
try{var B=this._htmlnode.previousSibling;
var D=window.getSelection();
var A=0;
if(B){A=B.nodeValue.length;
D.collapse(B,A)
}else{D.collapse(C._htmlnode.firstChild,0)
}}catch(E){}this.unlink();
bxe_Transform(false,false,C)
};
XMLNode.prototype.insertAfter=function(A,B){return this.insertBefore(A,B.nextSibling)
};
XMLNode.prototype.insertBefore=function(A,B){if(B){A._node=this._node.insertBefore(A,B)
}else{A._node=this._node.insertBefore(A,null)
}A.XMLNode=A.getXMLNode();
return A.XMLNode
};
XMLNode.prototype.removeChild=function(A){A.unlink()
};
XMLNode.prototype.appendChild=function(A){var B=A.firstChild;
while(B){A._node.appendChild(B._node);
B=B.nextSibling
}newNode_node=this._node.appendChild(A._node);
A._node=newNode_node;
return A
};
XMLNodeElement.prototype=new XMLNode();
XMLNodeElement.prototype.makeDefaultNodes=function(noPlaceholderText){if(!this.vdom){return false
}if(this.vdom.bxeOnnewType=="function"){window.bxe_lastNode=this;
return eval(this.vdom.bxeOnnew+"(this)")
}return this.makeDefaultNodes2(noPlaceholderText)
};
XMLNodeElement.prototype.makeDefaultNodes2=function(noPlaceholderText){var ret=false;
var cHT=this.canHaveText;
if(!noPlaceholderText){if(cHT){if(this.vdom&&this.vdom.bxeDefaultcontent){if(this.vdom.bxeDefaultcontentType=="function"){this.setContent(eval(this.vdom.bxeDefaultcontent+"(this)"))
}else{if(this.vdom.bxeDefaultcontentType!="element"){this.setContent(this.vdom.bxeDefaultcontent);
this._node.setAttribute("__bxe_defaultcontent","true")
}}}else{this.setContent("#"+this.localName);
this._node.setAttribute("__bxe_defaultcontent","true")
}}else{if(this.vdom&&this.vdom.bxeDefaultcontent&&this.vdom.bxeDefaultcontentType=="element"){eDOMEventCall("appendChildNode",document,{"noTransform":true,"appendToNode":this,"localName":this.vdom.bxeDefaultcontent,"namespaceURI":this.vdom.bxeDefaultcontentNamespaceUri});
ret=this
}else{var ac=this.allowedChildren;
if(ac.length==1){if(!ac[0].optional){eDOMEventCall("appendChildNode",document,{"noTransform":true,"appendToNode":this,"localName":ac[0].localName,"namespaceURI":ac[0].namespaceURI})
}ret=this
}else{if(ac.length>1){var _hasMust=false;
for(var i in ac){if(!(ac[i].optional)){eDOMEventCall("appendChildNode",document,{"noTransform":true,"appendToNode":this,"localName":ac[i].localName,"namespaceURI":ac[i].namespaceURI});
_hasMust=true
}}if(!_hasMust){bxe_context_menu.buildElementChooserPopup(this,ac);
return true
}else{ret=this
}}}}}}if(this.vdom.bxeOnnewType=="popup"){bxe_Transform(false,false,this);
window.bxe_lastNode=this;
window.bxe_ContextNode=this;
var pop=window.open(this.vdom.bxeOnnew,"foobar","width=600,height=600,resizable=yes,scrollbars=yes");
pop.focus();
return true
}if(ret){bxe_Transform(false,false,this,2);
return true
}return false
};
XMLNodeElement.prototype.setContent=function(A,C){this.removeAllChildren();
var B=bxe_config.xmldoc.createTextNode(A);
this._node.appendChild(B);
B.XMLNode=B.getXMLNode()
};
XMLNodeElement.prototype.removeAllChildren=function(){var B=this.firstChild;
while(B){var A=B;
B=B.nextSibling;
A.unlink()
}};
XMLNodeElement.prototype.isAllowedNextSibling=function(C,A){var B=this.allowedNextSiblings;
for(i=0;
i<B.length;
i++){if(B[i].namespaceURI==C&&B[i].localName==A){return true
}}return false
};
XMLNodeElement.prototype.getAttribute=function(A){return this._node.getAttribute(A)
};
XMLNodeElement.prototype.setAttribute=function(A,B){return this._node.setAttribute(A,B)
};
XMLNodeElement.prototype.removeAttribute=function(A){return this._node.removeAttribute(A)
};
var idCounter=0;
var bxe_xml_nodes=new Array();
Node.prototype.init=function(){var C=this.ownerDocument.createTreeWalker(this,NodeFilter.SHOW_ALL,{acceptNode:function(E){return NodeFilter.FILTER_ACCEPT
}},true);
var A=this;
var B=false;
bxe_xml_nodes=null;
bxe_xml_nodes=new Array();
do{if(A.nodeType==1){A.XMLNode=A.getXMLNode();
if(!A.hasAttribute("__bxe_id")){var D="id"+idCounter++;
A.setAttribute("__bxe_id",D)
}else{var D=A.getAttribute("__bxe_id")
}bxe_xml_nodes[D]=A
}else{if(A.getXMLNode){A.XMLNode=A.getXMLNode()
}}A=C.nextNode()
}while(A);
return this.XMLNode
};
Element.prototype.setBxeId=function(A){if(A||!this.hasAttribute("__bxe_id")){var B="id"+idCounter++;
this.setAttribute("__bxe_id",B);
return B
}return this.getAttribute("__bxe_id")
};
Element.prototype.setBxeIds=function(A){var C=this.ownerDocument.createTreeWalker(this,NodeFilter.SHOW_ELEMENT,{acceptNode:function(D){return NodeFilter.FILTER_ACCEPT
}},true);
var B=this;
do{B.setBxeId(A);
B=C.nextNode()
}while(B)
};
Element.prototype.removeBxeIds=function(){var B=this.ownerDocument.createTreeWalker(this,NodeFilter.SHOW_ELEMENT,{acceptNode:function(C){return NodeFilter.FILTER_ACCEPT
}},true);
var A=this;
do{A.removeAttribute("__bxe_id");
A=B.nextNode()
}while(A)
};
Element.prototype.changeContainer=function(C,D){var A=false;
if(C==XHTMLNS){var H=false;
if(this.XMLNode){if(this.XMLNode.nodeName==this.getAttribute("class")){H=true
}}var G=documentCreateXHTMLElement(D);
if(H){this.removeAttribute("class")
}}else{var G=document.createElementNS(XHTMLNS,"div");
this.setAttribute("class",containerName)
}for(var E=0;
E<this.attributes.length;
E++){var F=this.attributes.item(E);
var I=F.cloneNode(true);
G.setAttributeNode(I)
}var B=document.createRange();
B.selectNodeContents(this);
G.appendChild(B.extractContents());
B.detach();
this.parentNode.replaceChild(G,this);
G.setAttribute("__bxe_ns",C);
return G
};
Node.prototype.getXPathString=function(D){if(this._xpathstring&&!D){return this._xpathstring
}var B=this;
var A=1;
var C="";
if(this.parentNode&&this.parentNode.nodeType==1){C=this.parentNode.getXPathString()
}B=B.previousSibling;
if(B&&B.position){A=B.position+1
}else{while(B){A++;
B=B.previousSibling
}}this.position=A;
C+="/node()["+A+"]";
this._xpathstring=C;
return C
};
Node.prototype.getXMLNode=function(){if(!this.XMLNode){this.XMLNode=new XMLNode(this)
}return this.XMLNode
};
Element.prototype.getXMLNode=function(){if(!this.XMLNode){this.XMLNode=new XMLNodeElement(this)
}return this.XMLNode
};
Element.prototype.getCStyle=function(A){return document.defaultView.getComputedStyle(this,null).getPropertyValue(A)
};
Node.prototype.getNamespaceDefinitions=function(){var C=this;
var A;
var D=new Array();
while(C.nodeType==1){A=C.attributes;
for(var B=0;
B<A.length;
B++){if(A[B].namespaceURI==XMLNS&&!(D[A[B].localName])){D[A[B].localName]=A[B].value
}}C=C.parentNode
}return D
};
Node.prototype.getXPathResult=function(A){var B=this.ownerDocument.createNSResolver(this.ownerDocument.documentElement);
return this.ownerDocument.evaluate(A,this,B,0,null)
};
Node.prototype.getXPathFirst=function(A){var B=this.getXPathResult(A);
return B.iterateNext()
};
Element.prototype.betterNormalize=function(){this.normalize();
var A=this.firstChild;
while(A){if(A.nodeType==3&&A.data==""){var B=A;
this.removeChild(B)
}A=A.nextSibling
}};
Element.prototype.removeElementOnly=function(){var A=this.firstChild;
while(A){var B=A;
A=A.nextSibling;
this.parentNode.insertBefore(B,this)
}this.parentNode.removeChild(this)
};
Element.prototype.hideAllChildren=function(){var A=this.firstChild;
while(A){if(A.nodeType==1){A.style.display="none"
}A=A.nextSibling
}};
Element.prototype.changeElementName=function(A,C){bxe_history_snapshot();
var B=this.ownerDocument.createElementNS(A,C);
var D=this.firstChild;
while(D){B.appendChild(D);
D=this.firstChild
}this.parentNode.replaceChild(B,this);
B.init();
B.parentNode.XMLNode.isNodeValid(true,2);
B.XMLNode.makeDefaultNodes(true);
return B
};
Node.prototype.getBlockParent=function(){var A=this;
var B="";
while(A){if(A.nodeType==1){if(A.ownerDocument!=document){B=A.XMLNode._htmlnode.getCStyle("display")
}else{B=A.getCStyle("display")
}if(B=="block"||B=="table-row"){return A
}}A=A.parentNode
}return null
};
Node.prototype.getParentWithXMLNode=function(){var A=this;
while(A){if(A.nodeType==1){var B=A.XMLNode;
if(B){if(B._node.nodeType==Node.ATTRIBUTE_NODE){return A
}else{if(B.vdom){return A
}}}}A=A.parentNode
}return null
};
Node.prototype.getBlockParentFromXML=function(){var B=this;
var C="";
var A=null;
while(B){if(B.XMLNode){A=B.XMLNode
}if(B.nodeType==1){C=B.getCStyle("display");
if(C=="block"||C=="table-row"){if(A){return A
}}}B=B.parentNode
}return null
};
Node.prototype.mergeWith=function(A){while(A.firstChild){this.appendChild(A.firstChild)
}A.parentNode.removeChild(A);
return this
};
XMLDocument.prototype.init=function(A){if(!A){A=this.documentElement
}this.XMLNode=new XMLNodeDocument();
this.XMLNode._node=this;
this.XMLNode.nodeType=9;
return A.init()
};
XMLDocument.prototype.insertIntoHTMLDocument=function(G){var C=new bxe_nsResolver(this.documentElement);
var A=bxe_getAllEditableAreas();
var K;
for(var F=0;
F<A.length;
F++){if(!A[F].parentNode){continue
}var J=A[F].getAttribute("bxe_xpath");
if(J&&J!="/*[1]"){var L=this.evaluate(J,this.documentElement,C,0,null)
}if(L){xmlnode=L.iterateNext()
}else{xmlnode=false
}if(xmlnode){if(A[F].parentNode&&A[F].parentNode.getAttribute("name")=="bxe_areaHolder"){K=A[F].parentNode;
var B=A[F].AreaInfo
}else{if(document.defaultView.getComputedStyle(A[F],null).getPropertyValue("display")=="inline"){K=document.createElement("span");
A[F].display="inline"
}else{K=document.createElement("div");
A[F].display="block"
}K.setAttribute("name","bxe_areaHolder");
A[F].parentNode.insertBefore(K,A[F]);
K.appendChild(A[F]);
var B=new Widget_AreaInfo(A[F]);
bxe_alignAreaNode(B,A[F]);
A[F].AreaInfo=B
}B.editableArea=A[F];
var H=new Array;
while(xmlnode){H.push(xmlnode);
xmlnode=L.iterateNext()
}for(var E=0;
E<H.length;
E++){if(!H[E].hasChildNodes()){H[E].XMLNode.setContent("",true)
}H[E].XMLNode.xmlBridge=H[E];
if(H[E].nodeType==1){var D=H[E].XMLNode.insertIntoHTMLDocument(A[F],true)
}else{H[E].XMLNode.insertIntoHTMLDocument(A[F],false)
}B.MenuPopup.setTitle(H[E].XMLNode.getXPathString())
}}else{A[F].removeAttribute("bxe_xpath");
var I=document.createElementNS(XHTMLNS,"span");
I.setAttribute("class","bxe_notice");
I.appendChild(document.createTextNode("Node "+J+" was not found in the XML document"));
A[F].insertBefore(I,A[F].firstChild)
}}if(!bxe_widgets_drawn){bxe_draw_widgets();
bxe_start_plugins();
bxe_widgets_drawn=true
}};
XMLDocument.prototype.checkParserError=function(){alert("XMLDocument.prototype.checkParserError is deprecated!");
return true
};
XMLDocument.prototype.transformToXPathMode=function(D){try{bxe_about_box.addText("Load XSLT ...");
var A=document.implementation.createDocument("","",null);
A.addEventListener("load",B,false);
A.xmldoc=this;
A.async=true;
A.load(D)
}catch(C){bxe_catch_alert(C)
}function B(G){try{bxe_about_box.addText("XSLT loaded...");
A=G.currentTarget;
if(!A.documentElement){bxe_alert("Something went wrong during loading the XSLT document.\nSee console for details.");
bxe_dump("XSLDoc: "+A.saveXML());
bxe_dump(G);
return false
}var F=document.implementation.createDocument("","",null);
bxe_about_box.addText("Loading transform XSLT ...");
F.addEventListener("load",this.onload_xsltransform,false);
F.xsldoc=A;
F.load(mozile_root_dir+"xsl/transformxsl.xsl")
}catch(E){bxe_catch_alert(E)
}}};
XMLDocument.prototype.onload_xsltransform=function(F){var D=new XSLTProcessor();
if(bxe_config.xmldoc._originalXslTransformDoc){xsltransformdoc=bxe_config.xmldoc._originalXslTransformDoc;
if(!bxe_config.xmldoc){bxe_alert("Something went wrong during loading the Transform-XSLT document. (bxe_config.xmldoc undefined) \n Try reloading or see console for details.");
bxe_dump("Transform XSLDoc: "+xsltransformdoc.saveXML());
bxe_dump(F);
return false
}bxe_config.xmldoc._originalXslTransformDoc=null
}else{xsltransformdoc=F.currentTarget
}if(!xsltransformdoc.documentElement){bxe_alert("Something went wrong during loading the Transform-XSLT document.\n Try reloading or see console for details.");
bxe_dump("Transform XSLDoc: "+xsltransformdoc.saveXML());
bxe_dump(F);
return false
}try{D.importStylesheet(xsltransformdoc);
if(!xsltransformdoc.xsldoc){bxe_alert("Something went wrong during loading the Transform-XSLT document. (xsltransformdoc.xsldoc undefined)\n Try reloading or see console for details.");
bxe_dump("Transform XSLDoc: "+xsltransformdoc.saveXML());
bxe_dump(F);
return false
}var C=D.transformToDocument(xsltransformdoc.xsldoc);
C=C.saveXML(C);
var G=new DOMParser();
C=G.parseFromString(C,"text/xml")
}catch(E){bxe_config.xmldoc._originalXslTransformDoc=xsltransformdoc;
if(typeof bxe_config.xmldoc._originalXslTransformCounter=="undefined"){bxe_config.xmldoc._originalXslTransformCounter=0
}if(bxe_config.xmldoc._originalXslTransformCounter>20){alert(E+"\n\n "+bxe_i18n.getText("xsltransformdoc.xsldoc is : ")+xsltransformdoc.xsldoc)
}else{bxe_config.xmldoc._originalXslTransformCounter++;
bxe_about_box.addText(bxe_config.xmldoc._originalXslTransformCounter);
window.setTimeout("bxe_config.xmldoc.onload_xsltransform(bxe_config.xmldoc._originalXslTransformEvent)",300)
}return 
}D=new XSLTProcessor();
try{for(var B in bxe_config.xslparams){if(bxe_config.xslparams[B].name&&typeof bxe_config.xslparams[B].value!="undefined"){D.setParameter(null,bxe_config.xslparams[B].name,bxe_config.xslparams[B].value)
}}D.importStylesheet(C)
}catch(F){var A=mozilla.getWidgetModalBox("Load Error");
A.addText("Something went wrong during importing the XSLT document");
A.addText("See console for details.");
A.show((window.innerWidth-500)/2,50,"fixed");
bxe_dump(bxe_catch_alert_message(F)+"\n"+C.saveXML(C));
return 
}bxe_config.processor=D;
if(!bxe_widgets_drawn){bxe_draw_widgets();
bxe_start_plugins();
bxe_widgets_drawn=true
}xml_loaded(xsltransformdoc.xsldoc.xmldoc)
};
XMLDocument.prototype.importXHTMLDocument=function(A){function B(I){var L=I.currentTarget;
debug("XHTML loaded");
bxe_about_box.addText(bxe_i18n.getText("XHTML loaded..."));
var K=document.getElementsByTagName("body")[0];
var J=L.getElementsByTagName("body");
if(!(J&&J.length>0)){bxe_about_box.addText(bxe_i18n.getText(" Loading Failed. no 'body' element found in your external XHTML document."));
alert(bxe_i18n.getText("no 'body' element found in your external XHTML document. "));
return false
}var H=document.importNode(J[0],true);
bxe_about_box.node=H.appendChild(bxe_about_box.node);
if(bxe_config.options["ExternalXhtmlReplaceBodyChildren"]!="false"){K.removeAllChildren()
}K.appendAllChildren(H);
L.xmldoc.insertIntoHTMLDocument();
var E=L.getElementsByTagName("link");
var G=document.getElementsByTagName("head")[0];
for(var F=0;
F<E.length;
F++){G.appendChild(document.importNode(E[F],true))
}xml_loaded(L.xmldoc)
}bxe_about_box.addText("Import external XHTML ...");
var D=document.implementation.createDocument("","",null);
D.addEventListener("load",B,false);
D.xmldoc=this;
bxe_dump("start loading "+A+"\n");
try{D.load(A)
}catch(C){alert(bxe_i18n.getText("The xhtmlfile: '{0}' was not found",new Array(A)))
}};
function XMLNodeDocument(){}XMLNodeDocument.prototype.__defineGetter__("documentElement",function(){return this._documentElement
});
XMLNodeDocument.prototype.__defineSetter__("documentElement",function(A){this._documentElement=A
});
XMLNodeDocument.prototype.buildXML=function(){var A=this.documentElement.buildXML();
return A.ownerDocument
};
XMLNode.prototype.buildXML=function(){var D=new bxe_nsResolver(this.ownerDocument.documentElement);
var A=new XMLNodeWalker(this);
var G;
if(this.xmlBridge){G=this.xmlBridge
}else{G=this._node
}G.removeAllChildren();
var I=G.ownerDocument;
var E=A.nextNode();
G.XMLNode._sernode=G;
var C;
var B;
while(E){if(E.nodeType==1&&E.localName!=0){C=I.createElementNS(E.namespaceURI,E.localName);
if(E.namespaceURI!=XHTMLNS){C.prefix=D.lookupNamespacePrefix(E.namespaceURI)
}B=E.attributes;
for(var F=0;
F<B.length;
F++){C.setAttributeNS(B[F].namespaceURI,B[F].localName,B[F].value)
}if(E.namespaceURI==XHTMLNS&&C.getAttribute("class")==E.localName){C.removeAttribute("class")
}}else{if(E.nodeType==3){C=I.importNode(E._node.cloneNode(true),true)
}else{C=I.importNode(E._node.cloneNode(true),true)
}}E._sernode=C;
if(E.parentNode&&E.parentNode._sernode){try{E.parentNode._sernode.appendChild(C)
}catch(H){debug(C+" could not be appended to "+E.parentNode)
}}E=A.nextNode()
}return G
};
function mozileTransportDriver(container,option){this.container=eval(" new mozileTransportDriver_"+container+"(option)")
}mozileTransportDriver.prototype.load=function(A,D,B){var C="mozileTransportDriver.load";
this.callback=this.loadCallback;
this.userLoadCallback=D;
this.filename=A;
debug("load "+A,{"evalArguments":true});
return this.container.load(A,this,B)
};
mozileTransportDriver.prototype.save=function(A,B,C){this.callback=this.saveCallback;
this.userSaveCallback=C;
this.filename=A;
debug("save "+A,{"evalArguments":true});
this.container.save(A,B,this)
};
mozileTransportDriver.prototype.loadCallback=function(A){A.td=this;
A.filename=this.filename;
this.document=A.document;
if(this.userLoadCallback){this.userLoadCallback(A)
}};
mozileTransportDriver.prototype.saveCallback=function(A){A.td=this;
A.filename=this.filename;
if(this.userSaveCallback){this.userSaveCallback(A)
}};
mozileTransportDriver.prototype.parseResponseXML=function(F,A){var D=new Object();
var E=F.getElementsByTagNameNS("http://www.mozilla.org/newlayout/xml/parsererror.xml","parsererror")[0];
if(E){alerttext=E.firstChild.data;
var C=E.getElementsByTagName("sourcetext")[0];
if(C){alerttext+="<pre style='white-space: -moz-pre-wrap'>\n"+C.firstChild.data+"\n</pre>"
}}else{alerttext="Something went wrong:\n\n"+A+"\n\n";
var B=new XMLSerializer;
var G=B.serializeToString(F.documentElement);
alerttext+="<pre style='white-space: -moz-pre-wrap'>\n"+G+"</pre>"
}D.isError=true;
D.statusText=alerttext;
D.document=F;
if(A===0){D.status=400
}else{D.status=A
}return D
};
mozileTransportDriver.prototype.parseResponseText=function(C,A){var B=new Object();
alerttext="Something went wrong:\n\n";
alerttext+=C;
B.isError=true;
B.statusText=alerttext;
if(A===0){B.status=400
}else{B.status=A
}return B
};
function mozileTransportDriver_http(A){}mozileTransportDriver_http.prototype.load=function(B,G,D){if(typeof D=="undefined"){D=true
}var E=document.implementation.createDocument("","",null);
E.loader=this.parent;
E.td=G;
bxe_config.td=G;
E.addEventListener("load",this.loadCallback,false);
E.async=D;
var C=new Object();
C.document=E;
try{E.load(B)
}catch(F){C.isError=true;
C.status=404;
var A=B+" could not be loaded\n"+F.message+"\n";
try{if(F.filename){A+="In File: "+F.filename+"\n"
}else{A+="In File: "+F.fileName+"\n"
}}catch(F){A+="In File: "+F.fileName+"\n"
}try{A+="Linenumber: "+F.lineNumber+"\n"
}catch(F){}C.statusText=A;
if(G.loadCallback){G.loadCallback(C)
}else{return C
}}if(G.loadCallback){}else{C.isError=false;
C.status=200;
C.statusText="OK"
}return C
};
mozileTransportDriver_http.prototype.loadCallback=function(C){var B=C.currentTarget;
var E=B.td;
if(!E){E=bxe_config.td
}var A=new Object();
if(B.getElementsByTagNameNS("http://www.mozilla.org/newlayout/xml/parsererror.xml","parsererror").length==0){try{B.documentElement.nodeName
}catch(C){var D=document.implementation.createDocument("","",null);
D.appendChild(D.adoptNode(B.documentElement,true));
D.td=B.td;
D.loader=B.loader;
B=D
}A.document=B;
A.isError=false;
A.status=200;
A.statusText="OK"
}else{A=E.container.parseResponseXML(B)
}E.loadCallback(A)
};
mozileTransportDriver_http.prototype.parseResponseXML=function(F,A){var D=new Object();
var E=F.getElementsByTagNameNS("http://www.mozilla.org/newlayout/xml/parsererror.xml","parsererror")[0];
if(E){alerttext=E.firstChild.data;
var C=E.getElementsByTagName("sourcetext")[0];
if(C){alerttext+="\n"+C.firstChild.data
}alerttext+=G
}else{alerttext="Something went wrong:\n\n"+A+"\n\n";
var B=new XMLSerializer;
var G=B.serializeToString(F.documentElement);
alerttext+=G
}D.isError=true;
D.statusText=alerttext;
D.document=F;
if(A===0){D.status=400
}else{D.status=A
}return D
};
mozileTransportDriver_http.prototype.save=function(A,B,C){this.p=new XMLHttpRequest();
this.p.onload=this.saveCallback;
this.p.td=C;
this.p.open("POST",A);
this.p.setRequestHeader("Content-type","application/x-www-form-urlencoded");
this.p.overrideMimeType("text/xml");
this.p.send(B,true)
};
mozileTransportDriver_http.prototype.saveCallback=function(C){var B=C.currentTarget;
var D=B.td;
var A=new Object();
if(B.status==204){A.document=B.responseXML;
A.isError=false;
A.status=200;
A.statusText="OK"
}else{if(B.status==201){A.document=B.responseXML;
A.isError=false;
A.status=201;
A.statusText="Created"
}else{if(B.responseXML){A=D.parseResponseXML(B.responseXML,B.status)
}else{A=D.parseResponseText(B.responseText,B.status)
}}}A.originalStatus=B.status;
A.originalStatusTest=B.statusText;
D.saveCallback(A)
};
Document.prototype.saveXML=documentSaveXML;
Document.prototype.saveChildrenXML=documentSaveChildrenXML;
function documentSaveXML(A){if(!A){return""
}var C=new XMLSerializer();
var D=A.getNamespaceDefinitions();
for(var B in D){if(B=="xmlns"){A.setAttributeNS(XMLNS,"xmlns",D[B])
}else{A.setAttributeNS(XMLNS,"xmlns:"+B,D[B])
}}strXML=C.serializeToString(A);
return strXML.replace(/^(<\?xml[^>]*) encoding="[^"]+"([^>]*\?>)/,'$1 encoding="UTF-8" $2')
}function documentSaveChildrenXML(C,E){var F;
var G;
var H;
if(C&&C.nodeType!=Node.DOCUMENT_NODE){G=C.ownerDocument;
F=C
}else{G=this;
F=this.documentElement
}if(E){H=G.saveXML(F);
var A=new DOMParser();
var I=A.parseFromString(H,"text/xml");
H=H.replace(/^<[^>]+>/,"").replace(/<\/[^>]+>$/,"");
return{"str":H,"rootPrefix":I.documentElement.prefix,"rootNamespace":I.documentElement.namespaceURI}
}H="";
var B=C.childNodes;
for(var D=0;
D<B.length;
D++){H+=G.saveXML(B[D])
}return H
}function documentLoadXML(B){var C=new DOMParser();
var A=C.parseFromString(B,"text/xml");
if(A.documentElement.nodeName=="parsererror"){alert("XML source has a parse error \n"+A.documentElement.getContent());
return false
}else{return A
}}Node.prototype.saveXML=function(){var A=new XMLSerializer;
var B=A.serializeToString(this);
return B
};
DocumentFragment.prototype.saveXML=function(){var A=new XMLSerializer;
var B=A.serializeToString(this);
return B
};
Element.prototype.__defineGetter__("markupContent",function(){var A=new XMLSerializer;
var B=A.serializeToString(this);
return B
});
Element.EMPTY_CONTENTTYPE=0;
Element.SIMPLE_CONTENTTYPE=1;
Element.ANY_CONTENTTYPE=2;
Element.MIXED_CONTENTTYPE=3;
Element.ELEMENTS_CONTENTTYPE=4;
Element.prototype.__defineGetter__("contentType",function(){if(this.childNodes.length==0){if(__isXHTMLNonChildBearingElement(this)){return Element.EMPTY_CONTENTTYPE
}else{return Element.ANY_CONTENTTYPE
}}if((this.childNodes.length==1)&&(this.childNodes[0].nodeType==Node.TEXT_NODE)){return Element.SIMPLE_CONTENTTYPE
}for(var A=0;
A<this.childNodes.length;
A++){if(this.childNodes[A].nodeType==Node.TEXT_NODE){return Element.MIXED_CONTENTTYPE
}}return Element.ELEMENTS_CONTENTTYPE
});
function __isXHTMLNonChildBearingElement(A){switch(A.nodeName.toUpperCase()){case"AREA":case"BASE":case"BASEFONT":case"BR":case"COL":case"FRAME":case"HR":case"IMG":case"INPUT":case"ISINDEX":case"LINK":case"META":case"PARAM":case"OBJECT":return true
}return false
}Text.prototype.__defineGetter__("isWhitespaceOnly",function(){if(this.nodeValue.length==0){return true
}if(/\S+/.test(this.nodeValue)){return false
}return true
});
Element.prototype.__defineGetter__("mozUserModify",function(){return document.defaultView.getComputedStyle(this,null).MozUserModify
});
Element.prototype.__defineGetter__("mozUserModifiable",function(){if(!this._mozUserModify){var A=this.mozUserModify;
if(A=="read-write"){this._mozUserModify=true;
return true
}return false
}return true
});
Element.prototype.__defineGetter__("userModify",function(){if(!this._userModify){if(this.isContentEditable){return("read-write")
}var A=this.mozUserModify;
this._userModify=A;
return A
}return this._userModify
});
Element.prototype.__defineGetter__("userModifiable",function(){if(this._userModify){return true
}else{if(this.userModify=="read-write"){this._userModify=true;
return true
}}return false
});
Element.prototype.__defineGetter__("userModifiableContext",function(){if(this.mozUserModifiable){var B=this;
contextUserModify=this.mozUserModify;
while(B.parentNode){var A=B.parentNode.mozUserModify;
if(A!=contextUserModify){break
}B=B.parentNode;
contextUserModify=A
}return B
}return this.contentEditableContext
});
Selection.prototype.deleteSelection=function(D,L){var A=this.getEditableRange();
var J=false;
if(!A){return 
}var d=null;
if(A.collapsed){if(A.startContainer.nodeValue.strip().length==1){try{var Y=window.getSelection();
A=this.getEditableRange();
var T=A.startContainer.parentNode.XMLNode._node;
T.normalize();
if(T.childNodes.length<=1){if(T.nodeType==2){var B=T.ownerElement;
B.removeAttributeNode(T)
}else{var B=T.parentNode;
var R=T.nextSibling;
bxe_checkEmpty(T.XMLNode,L)
}if(!B.XMLNode.isNodeValid(true,2,true)){var a=B.insertBefore(B.ownerDocument.createElementNS(T.namespaceURI,T.localName),R);
a.XMLNode=a.getXMLNode();
bxe_checkEmpty(a.XMLNode,L)
}B.normalize();
var C=T.XMLNode._htmlnode;
if(!L){var U=bxe_goToNextNode(A,true);
if(U&&U.nodeType==1){U=U.lastChild
}if(U&&U.nodeValue){Y.collapse(U,U.nodeValue.length)
}else{}}Y.collapseToStart();
bxe_Transform();
return 
}Y.collapse(A.startContainer,0);
Y.extend(A.startContainer,A.startContainer.length);
Y.deleteSelection(D);
return 
}catch(c){bxe_catch_alert(c)
}}var K=documentCreateInsertionPoint(A.top,A.startContainer,A.startOffset);
var T=A.startContainer.parentNode;
if(!D&&A.startOffset==0){if(!A.startContainer.previousSibling){var W=T.previousSibling;
while(W&&W.nodeType!=1){W=W.previousSibling
}if(W){var Y=window.getSelection();
Y.collapse(W.lastChild,W.lastChild.length);
Y.extend(A.startContainer,0);
A=this.getEditableRange();
Y.deleteSelection()
}return 
}else{var Y=window.getSelection();
this.collapse(A.startContainer.previousSibling.lastChild,A.startContainer.previousSibling.lastChild.length);
var A=this.getEditableRange();
K=documentCreateInsertionPoint(A.top,A.startContainer,A.startOffset)
}}else{if(D&&A.startContainer.length==A.startOffset){if(!A.startContainer.nextSibling){var W=T.nextSibling;
while(W&&W.nodeType!=1){W=W.nextSibling
}if(W){var Y=window.getSelection();
Y.collapse(A.startContainer,A.startContainer.length);
Y.extend(W.firstChild,0);
A=this.getEditableRange();
Y.deleteSelection()
}return 
}else{var Y=window.getSelection();
this.collapse(A.startContainer.nextSibling.firstChild,0);
var A=this.getEditableRange();
K=documentCreateInsertionPoint(A.top,A.startContainer,A.startOffset)
}}}if(D){K.forwardOne()
}var Q=K.deletePreviousInLine();
if(Q){var I=A.startContainer;
var T=I.parentNode;
var P=T.XMLNode._node;
P.betterNormalize();
T.edited=true;
if(P.nodeType==2){P.value=T.getContent()
}else{var E=bxe_getChildPosition(I);
P.replaceChild(bxe_config.xmldoc.importNode(I,true),P.childNodes[E])
}}}else{this.fixFocus();
var f=bxe_getXMLNodeByHTMLNodeRecursive(this.anchorNode.parentNode);
if(f.betterNormalize){f.betterNormalize()
}if(f.nodeType==2){A.extractContentsByCSS();
f.nodeValue=this.anchorNode.nodeValue
}else{if(f.XMLNode.vdom&&f.XMLNode.vdom.bxeTabletype=="table-cell"){if(f.XMLNode._node!=this.focusNode.parentNode.XMLNode._node){this.collapse(this.anchorNode,1);
this.extend(this.anchorNode,this.anchorNode.length)
}}var E=bxe_getChildPosition(this.anchorNode);
var X=f.childNodes[E];
if(this.anchorNode!=this.focusNode){var V=bxe_getXMLNodeByHTMLNodeRecursive(this.focusNode.parentNode);
V.betterNormalize();
var N=bxe_getChildPosition(this.focusNode);
var G=V.childNodes[N];
if(G.splitText){G.splitText(this.focusOffset)
}else{var H=G.childNodes[this.focusOffset];
if(H&&H.nodeType==3){G=H;
G.splitText(0);
V=G.parentNode
}}var Z=document.createTreeWalker(X.ownerDocument.documentElement,NodeFilter.SHOW_ALL,null,true);
Z.currentNode=X;
var O;
node=Z.nextNode();
do{if(node==G){break
}O=node;
if(!(O.compareDocumentPosition(G)&Node.DOCUMENT_POSITION_CONTAINED_BY)){if(O.hasChildNodes()){while(O.firstChild){O.removeChild(O.firstChild)
}}node=Z.nextNode();
O.parentNode.removeChild(O)
}else{node=Z.nextNode()
}}while(node)
}else{X.splitText(this.focusOffset)
}X=X.splitText(this.anchorOffset);
if(this.anchorNode!=this.focusNode){V.removeChild(G);
var g=f.getBlockParent();
var M=V.getBlockParent();
if(g.nextSibling.nextSibling==M||g.nextSibling==M){g.mergeWith(M)
}J=true
}else{A.extractContentsByCSS();
this.anchorNode.parentNode.removeAttribute("__bxe_defaultcontent");
if(this.anchorNode.parentNode.XMLNode){this.anchorNode.parentNode.XMLNode._node.removeAttribute("__bxe_defaultcontent")
}}if(X.parentNode==f){var F=X.previousSibling;
f.removeChild(X);
bxe_checkEmptyParent(f.XMLNode)
}else{delete X
}if(g){g.betterNormalize()
}}}var S=null;
if(this.focusNode.nodeValue&&this.focusNode.nodeValue.substr(this.focusOffset,1)==" "){d=this.anchorOffset;
S=this.anchorNode
}else{if(this.focusOffset>=this.focusNode.length&&this.focusNode.nodeValue.substr(this.focusNode.length-1,1)==" "){d=this.focusNode.length
}else{if(this.anchorOffset==0){d=0
}}}this.removeAllRanges();
this.addRange(A.cloneRange());
if(typeof d=="number"){if(S){this.collapse(S,d)
}else{this.collapse(this.anchorNode,d)
}}if(J){bxe_Transform()
}};
Selection.prototype.toggleTextStyle=function(D,C,A,B){var E=this.getEditableRange();
if(!E){return 
}if(E.hasStyle(D,C)){E.styleText(D,A,B)
}else{E.styleText(D,C,B)
}this.selectEditableRange(E)
};
Selection.prototype.toggleTextClass=function(A,B){if(typeof B=="undefined"){B=""
}var C=this.getEditableRange();
if(!C){return 
}C.styleText(A,true,true,B);
this.selectEditableRange(C)
};
Selection.prototype.styleText=function(B,A){var C=this.getEditableRange();
if(!C){return 
}C.styleText(B,A);
this.selectEditableRange(C)
};
Selection.prototype.linkText=function(A){var B=this.getEditableRange();
if(!B){return 
}B.linkText(A);
this.selectEditableRange(B)
};
Selection.prototype.clearTextLinks=function(){var A=this.getEditableRange();
if(!A){return 
}A.clearTextLinks();
this.selectEditableRange(A)
};
Selection.prototype.styleLines=function(D,B){var E=this.getEditableRange();
if(!E){return 
}var A=E.lines;
for(var C=0;
C<A.length;
C++){if((A[C].lineType==CSSLine.BOUNDED_LINE)||A[C].topLine){if(A[C].emptyLine){continue
}A[C]=A[C].setContainer(documentCreateXHTMLElement(defaultContainerName),false)
}A[C].setStyle(D,B)
}this.selectEditableRange(E)
};
Selection.prototype.changeLinesContainer=function(C,E){var D=this.getEditableRange();
if(!D){return 
}var A=new Array();
var J=D.lines;
for(var F=0;
F<J.length;
F++){var B=false;
if(E==XHTMLNS){var H=false;
if(J[F].__container.XMLNode){if(J[F].__container.XMLNode.nodeName==J[F].__container.getAttribute("class")){H=true
}}var I=J[F].setContainer(documentCreateXHTMLElement(C),!B);
if(H){I.__container.removeAttribute("class")
}}else{var G=document.createElementNS(XHTMLNS,"div");
var I=J[F].setContainer(G,true);
I.__container.setAttribute("class",C)
}I.__container.setAttribute("__bxe_ns",E);
A.push(I.__container)
}this.selectEditableRange(D);
return A
};
Selection.prototype.removeLinesContainer=function(){var C=this.getEditableRange();
if(!C){return 
}var A=C.lines;
for(var B=0;
B<A.length;
B++){if((A[B].lineType==CSSLine.CONTAINED_LINE)&&!A[B].topLine){A[B].removeContainer()
}}this.selectEditableRange(C)
};
Selection.prototype.indentLines=function(){var A=this.getEditableRange();
if(!A){return 
}indentLines(A);
this.selectEditableRange(A)
};
Selection.prototype.outdentLines=function(){var A=this.getEditableRange();
if(!A){return 
}outdentLines(A);
this.selectEditableRange(A)
};
Selection.prototype.toggleListLines=function(D,B){var A=false;
if(this.isCollapsed&&this.anchorOffset>0){this.collapse(this.anchorNode,this.anchorOffset-1);
A=true
}var C=this.getEditableRange();
if(!C){return 
}listLinesToggle(C,D,B);
this.selectEditableRange(C);
if(A){this.collapse(this.anchorNode,this.anchorOffset+1)
}return C.lines
};
Selection.prototype.insertNodeRaw=function(E,G){var C=this;
var D=this.getEditableRange();
if(!D){return 
}if(!D.collapsed){bxe_deleteEventKey(window.getSelection(),false,false,true)
}try{if(this.anchorNode.parentNode.getAttribute("__bxe_defaultcontent")=="true"){var K=bxe_getXMLNodeByHTMLNode(this.anchorNode.parentNode);
K.removeChild(K.firstChild);
K.appendChild(K.ownerDocument.createTextNode(" "));
K.removeAttribute("__bxe_defaultcontent");
if(this.anchorNode.length>0){this.anchorNode.nodeValue=" "
}}}catch(J){alert(J)
}var H=bxe_getXMLNodeByHTMLNode(C.anchorNode.parentNode);
H.betterNormalize();
var I=bxe_getChildPosition(C.anchorNode);
H.childNodes[I].splitText(C.focusOffset);
if(!C.isCollapsed){H.childNodes[I].splitText(C.anchorOffset)
}var F=H.childNodes[I+1];
if(E.nodeType==11){var B=E.firstChild;
var E=null;
while(B){E=B;
B=B.nextSibling;
H.insertBefore(E,F)
}}else{E=H.insertBefore(E,F)
}H.normalize();
if(E.nodeType==1){var A=E.setBxeId();
E.XMLNode=E.getXMLNode()
}return E
};
Selection.prototype.insertNode=function(B){var A=B;
if(B.nodeType==11){A=B.firstChild
}if(A&&A.XMLNode){if(!bxe_checkIsAllowedChild(A.XMLNode.namespaceURI,A.XMLNode.localName,this)){return false
}}return this.insertNodeRaw(B)
};
Selection.prototype.paste=function(paraElementVdom,selNode,alwaysAppend){var clipboard=mozilla.getClipboard();
var cntnt=clipboard.getData(MozClipboard.TEXT_FLAVOR);
if(cntnt.nodeType==11&&cntnt.firstChild.nodeType==3&&cntnt.childNodes.length==1){cntnt.data=cntnt.firstChild.data
}for(var i in cntnt.childNodes){if(cntnt.childNodes[i].nodeType==1){cntnt.childNodes[i].setBxeIds(true)
}}if(cntnt&&cntnt.data){var elementNameParent=null;
var elementNameGrandParent=null;
var elementNamespace=null;
var elementName=null;
if(paraElementVdom=="__text__"){}else{if(paraElementVdom){if(paraElementVdom.namespaceURI){elementNamespace=paraElementVdom.namespaceURI
}if(paraElementVdom.bxeClipboardGrandChild){elementName=paraElementVdom.bxeClipboardGrandChild;
elementNameParent=paraElementVdom.bxeClipboardChild;
elementNameGrandParent=paraElementVdom.localName
}else{if(paraElementVdom.bxeClipboardChild){elementName=paraElementVdom.bxeClipboardChild;
elementNameParent=paraElementVdom.localName
}else{elementName=paraElementVdom.localName
}}}else{elementName=bxe_config.options["autoParaElementName"];
elementNamespace=bxe_config.options["autoParaElementNamespace"]
}}cntnt.data=cntnt.data.replace(/\r/g,"\n").replace(/\n+/g,"\n");
if(elementName&&clipboard._system&&(alwaysAppend||cntnt.data.search(/[\n]./)>-1)){cntnt=cntnt.data;
cntnt=cntnt.replace(/&/g,"&amp;").replace(/</g,"&lt;");
var elementName_start=elementName;
if(elementNamespace){elementName_start+=" xmlns='"+elementNamespace+"'"
}if(elementNameGrandParent){cntnt=cntnt+"\n";
var row=cntnt.match(/(.*[\n$]+)/g);
var cntnt="<"+elementNameGrandParent;
if(elementNamespace){cntnt2+=" xmlns='"+elementNamespace+"'"
}cntnt+=">";
var delimiter=eval("'"+clipboard.delimiter+"'");
var _starti=0;
if(paraElementVdom.bxeClipboardFirstChild){if(!paraElementVdom.bxeClipboardEmptyFirstRow){_starti=1
}cntnt+="<"+paraElementVdom.bxeClipboardFirstChild+">";
var cell=row[0].split(delimiter);
for(var j=0;
j<cell.length;
j++){cntnt+="<"+paraElementVdom.bxeClipboardFirstGrandChild+">";
if(!paraElementVdom.bxeClipboardEmptyFirstRow){cntnt+=cell[j]
}cntnt+="</"+paraElementVdom.bxeClipboardFirstGrandChild+">\n"
}cntnt+="</"+paraElementVdom.bxeClipboardFirstChild+">\n"
}var max=0;
for(var i=_starti;
i<row.length;
i++){row[i]=row[i].replace(/[\n\t\r]+$/,"");
var cell=row[i].split(delimiter);
if(cell.length>max){max=cell.length
}}for(var i=_starti;
i<row.length;
i++){cntnt+="<"+elementNameParent+">";
var cell=row[i].split(delimiter);
for(var j=0;
j<max;
j++){cntnt+="<"+elementName_start+">";
if(cell[j]){cntnt+=cell[j]
}else{cntnt+="#"
}cntnt+="</"+elementName+">\n"
}cntnt+="</"+elementNameParent+">\n"
}cntnt+="</"+elementNameGrandParent+">\n"
}else{cntnt=cntnt.replace(/\n+$/,"");
cntnt="<"+elementName_start+">"+cntnt.replace(/[\n]+/g,"</"+elementName+"><"+elementName_start+" >")+"</"+elementName+">";
if(elementNameParent){var cntnt2="<"+elementNameParent;
if(elementNamespace){cntnt2+=" xmlns='"+elementNamespace+"'"
}cntnt=cntnt2+">"+cntnt+"</"+elementNameParent+">"
}}if(alwaysAppend){var docfrag=cntnt.convertToXML();
var e={"additionalInfo":{"node":docfrag,"appendToNode":selNode}};
bxe_appendNode(e)
}else{bxe_insertContent_async(cntnt,BXE_SELECTION,BXE_SPLIT_IF_INLINE,selNode._node)
}}else{window.getSelection().insertNode(cntnt)
}}else{window.getSelection().insertNode(cntnt)
}var node=window.getSelection().anchorNode;
if(node&&node.nodeType==3){node.XMLNode._node.normalize();
bxe_checkEmptyParent(node.parentNode.XMLNode)
}else{bxe_checkEmptyParent(node.XMLNode)
}bxe_history_snapshot_async();
if(node&&node.XMLNode){bxe_Transform(false,false,node.XMLNode.parentNode)
}else{bxe_Transform(false,false)
}return node
};
Selection.prototype.copy=function(A){var C=this.getXMLFragment();
if(!C||C.collapsed){return 
}var B=mozilla.getClipboard();
B._system=false;
if(A){B.setData(C.toString(),MozClipboard.TEXT_FLAVOR)
}else{B.setData(C,MozClipboard.TEXT_FLAVOR)
}};
Selection.prototype.cut=function(A){this.copy(A);
bxe_history_snapshot();
var B=window.getSelection();
bxe_deleteEventKey(B,false)
};
Selection.prototype.getEditableRange=function(){try{var A=window.getSelection().getRangeAt(0);
var C=A.commonAncestorContainer;
if(!C.parentElement.userModifiable){return null
}var B=C.parentElement.userModifiableContext;
var D=documentCreateCSSTextRange(A.cloneRange(),B);
return D
}catch(E){return null
}};
Selection.prototype.getXMLFragment=function(){var F=bxe_config.xmldoc.createDocumentFragment();
this.fixFocus();
if(this.anchorNode!=this.focusNode){var E=bxe_getXMLNodeByHTMLNodeRecursive(this.anchorNode.parentNode);
if(E.betterNormalize){E.betterNormalize()
}var C=bxe_getChildPosition(this.anchorNode);
var H=E.childNodes[C];
var G=bxe_getXMLNodeByHTMLNode(this.focusNode.parentNode);
G.betterNormalize();
var B=bxe_getChildPosition(this.focusNode);
var D=G.childNodes[B];
var A=bxe_config.xmldoc.createRange();
A.setStart(H,this.anchorOffset);
A.setEnd(D,this.focusOffset);
return A
}else{return this.getEditableRange()
}};
Selection.prototype.selectEditableRange=function(A){if(A){if(!(A.startContainer.nodeType==3&&A.startContainer.data.length==A.startOffset&&A.collapsed==true)){A.__restoreTextBoundaries()
}this.removeAllRanges();
this.addRange(A.cloneRange())
}};
Selection.prototype.fixFocus=function(){if((!this.isCollapsed&&this.focusNode.nodeType==3&&this.focusNode.compareDocumentPosition(this.anchorNode)&4)||(this.focusNode==this.anchorNode&&this.focusOffset<this.anchorOffset)){var B=this.anchorNode;
var A=this.anchorOffset;
this.collapse(this.focusNode,this.focusOffset);
this.extend(B,A)
}};
Document.prototype.execCommand=function(C,A,B){switch(C){case"FormatBlock":window.getSelection().changeLinesContainer(B);
break;
case"RemoveFormat":window.getSelection().removeLinesContainer();
break;
case"FontName":window.getSelection().styleText("font-family",B);
break;
case"FontSize":window.getSelection().styleText("font-size",B);
break;
case"FontColor":window.getSelection().styleText("color",B);
break;
case"BackColor":window.getSelection().styleText("background-color",B);
break;
case"Unlink":window.getSelection().clearTextLinks();
break;
case"CreateLink":window.getSelection().linkText();
break;
case"SaveAs":mozileSave();
break;
case"Bold":window.getSelection().toggleTextStyle("font-weight","bold","400");
break;
case"Italic":window.getSelection().toggleTextStyle("font-style","italic","normal");
break;
case"Underline":window.getSelection().toggleTextStyle("text-decoration","underline","none");
break;
case"InsertOrderedList":window.getSelection().toggleListLines("ol","ul");
break;
case"InsertUnorderedList":window.getSelection().toggleListLines("ul","ol");
break;
case"Indent":window.getSelection().indentLines();
break;
case"Outdent":window.getSelection().outdentLines();
break;
case"JustifyLeft":window.getSelection().styleLines("text-align","left");
break;
case"JustifyRight":window.getSelection().styleLines("text-align","right");
break;
case"JustifyCenter":window.getSelection().styleLines("text-align","center");
break
}};
Element.prototype.__defineGetter__("contentEditable",function(){return this.isContentEditable
});
Element.prototype.__defineGetter__("isContentEditable",function(){var A=this;
while(A){if(A.nodeType!=Node.ELEMENT_NODE){return false
}if(A.hasXHTMLAttribute("contentEditable")){if(A.getXHTMLAttribute("contentEditable")=="true"){return true
}return false
}A=A.parentNode
}return false
});
Element.prototype.__defineSetter__("contentEditable",function(A){if(A){this.style.MozUserModify="read-write";
this.style.MozUserInput="enabled";
this.style.MozUserFocus="normal"
}else{this.style.MozUserModify="read-only";
this.style.MozUserInput="disabled"
}});
Element.prototype.__defineGetter__("contentEditableContext",function(){if(!this.isContentEditable){return null
}var A=this;
while(A.parentNode){if(!A.parentNode.isContentEditable){break
}else{A=A.parentNode
}}return A
});
Node.prototype.eDOMaddEventListener=function(C,D,B){if(!this._events){this._events=new Array()
}C=C.toLowerCase();
if(!this._events[C]){this._events[C]=new Array()
}var A=D.name;
if(!A){A=this._events[C].length
}this._events[C][A]=D
};
Node.prototype.eDOMremoveEventListener=function(C,D,B){var A=D.name;
C=C.toLowerCase();
if(!A){A=this._events[C].length
}if(this._events&&this._events[C]&&this._events[C][A]){this._events[C][A]=null
}};
Node.prototype.doEvents=function(B){B.currentTarget=this;
if(this._events&&this._events[B.eventType]){for(var A in this._events[B.eventType]){if(this._events[B.eventType][A]){this._events[B.eventType][A](B)
}}}if(this.parentNode){try{this.parentNode.doEvents(B)
}catch(C){}}};
function eDOMEvent(){}eDOMEvent.prototype.initEvent=function(A){this.eventType=A.toLowerCase();
bxe_dump("Event: "+A+" "+this.target+" "+this.additionalInfo+"\n");
this.target.doEvents(this)
};
eDOMEvent.prototype.setTarget=function(A){this.target=A
};
function eDOMEventCall(B,D,A){var C=new eDOMEvent();
if(A){C.additionalInfo=A
}C.setTarget(D);
C.initEvent(B)
}const BXENS="http://bitfluxeditor.org/namespace";
const XMLNS="http://www.w3.org/2000/xmlns/";
const E_FATAL=1;
const BXE_SELECTION=1;
const BXE_APPEND=2;
const BXE_SPLIT_IF_INLINE=1;
var bxe_snapshots=new Array();
var bxe_snapshots_position=0;
var bxe_snapshots_last=0;
const BXE_SNAPSHOT_LENGTH=20;
function __bxeSave(e){if(bxe_bug248172_check()){alert(bxe_i18n.getText("THIS DOCUMENT COULD NOT BE SAVED!\n You are using a Mozilla release with a broken XMLSerializer implementation.\n Mozilla 1.7 and Firefox 0.9/0.9.1 are known to have this bug.\n Please up- or downgrade."));
return false
}var td=new mozileTransportDriver(bxe_config.xmlfile_method);
td.Docu=this;
if(e.additionalInfo&&e.additionalInfo.exit){td.Exit=e.additionalInfo.exit
}else{td.Exit=null
}if(e.additionalInfo&&e.additionalInfo.reload){td.Reload=e.additionalInfo.reload
}else{td.Reload=null
}var xml=bxe_getXmlDomDocument(true);
if(!xml){alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"))
}if(bxe_config.options["onSaveBefore"]){eval(bxe_config.options["onSaveBefore"]+"(xml,'onSaveBefore')")
}bxe_status_bar.showMessage(bxe_i18n.getText("Document saving..."));
var widg=mozilla.getWidgetModalBox(bxe_i18n.getText("Saving"));
widg.addText(bxe_i18n.getText("Document saving..."));
widg.show((window.innerWidth-500)/2,50,"fixed");
var xmlstr=xml.saveXML(xml);
function callback(e){if(e.isError){var widg=mozilla.getWidgetModalBox(bxe_i18n.getText("Saving"));
widg.addText(bxe_i18n.getText("Document couldn't be saved"));
widg.addText(e.statusText,true);
widg.show((window.innerWidth-500)/2,50,"fixed");
return 
}bxe_lastSavedXML=bxe_getXmlDocument();
bxe_status_bar.showMessage(bxe_i18n.getText("Document successfully saved"));
var widg=mozilla.getWidgetModalBox();
widg.submitAndClose();
bxe_history_reset();
if(e.status==201&&bxe_config.options["onSaveFileCreated"]){eval(bxe_config.options["onSaveFileCreated"])
}if(bxe_config.options["onSaveAfter"]){xml=bxe_getXmlDocument();
eval(bxe_config.options["onSaveAfter"]+"(xml,'onSaveAfter')")
}if(e.td.Reload){document.location.reload()
}if(e.td.Exit){eDOMEventCall("Exit",document)
}}var url=bxe_config.xmlfile;
if(td.Exit){url=bxe_addParamToUrl(url,"exit=true")
}else{url=bxe_addParamToUrl(url,"exit=false")
}td.save(url,xmlstr,callback)
}function bxe_addParamToUrl(A,B){if(A.indexOf("?")==-1){A+="?"+B
}else{A+="&"+B
}return A
}function bench(E,C,B){var F=new Date();
for(var D=0;
D<B;
D++){E()
}var A=new Date();
debug(bxe_i18n.getText("Benchmark ")+C);
debug(bxe_i18n.getText("Total ")+(A-F)+" / "+B+" = "+(A-F)/B)
}function bxe_bench(){bench(function(){xmlstr=bxe_getXmlDocument()
},"getXML",2)
}function bxe_history_snapshot_async(){window.setTimeout("bxe_history_snapshot()",1)
}function bxe_history_snapshot(){var B=bxe_getXmlDocument();
if(!B){return false
}bxe_snapshots_position++;
bxe_snapshots_last=bxe_snapshots_position;
bxe_snapshots[bxe_snapshots_position]=B;
var C=bxe_snapshots_last+1;
while(bxe_snapshots[C]){bxe_snapshots[C]=null;
C++
}if(bxe_snapshots.length>BXE_SNAPSHOT_LENGTH){var A=new Array();
for(var C=bxe_snapshots_last;
C>=bxe_snapshots_last-BXE_SNAPSHOT_LENGTH;
C--){A[C]=bxe_snapshots[C]
}bxe_snapshots=A
}return(B)
}function bxe_history_redo(){if(bxe_snapshots_position>=0&&bxe_snapshots[(bxe_snapshots_position+1)]){var B=bxe_getXmlDocument();
if(!B){alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"));
return false
}bxe_snapshots_position++;
var A=bxe_snapshots[bxe_snapshots_position];
if(B==A&&bxe_snapshots[bxe_snapshots_position+1]){bxe_snapshots_position++;
var A=bxe_snapshots[bxe_snapshots_position]
}var C=new DOMParser();
var D=bxe_config.xmldoc.documentElement.XMLNode.vdom;
bxe_config.xmldoc=C.parseFromString(A,"text/xml");
bxe_config.xmldoc.init();
bxe_config.xmldoc.documentElement.XMLNode.vdom=D;
bxe_Transform()
}}function bxe_history_reset(){bxe_snapshots=new Array();
bxe_snapshots_position=0;
bxe_snapshots_last=0;
bxe_history_snapshot()
}function bxe_history_undo(){if(bxe_snapshots_position>=0){if(bxe_snapshots_position==bxe_snapshots_last){var B=bxe_history_snapshot();
bxe_snapshots_position--
}else{var B=bxe_getXmlDocument()
}if(!B){alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"));
return false
}var A=bxe_snapshots[bxe_snapshots_position];
if(A){bxe_snapshots_position--;
while(B==A&&bxe_snapshots[bxe_snapshots_position]){A=bxe_snapshots[bxe_snapshots_position];
bxe_snapshots_position--
}}if(bxe_snapshots_position<0){bxe_snapshots_position=0;
return false
}var C=new DOMParser();
if(A){var D=bxe_config.xmldoc.documentElement.XMLNode.vdom;
bxe_config.xmldoc=C.parseFromString(A,"text/xml");
bxe_config.xmldoc.init();
bxe_config.xmldoc.documentElement.XMLNode.vdom=D;
bxe_Transform()
}}}function bxe_getXmlDomDocument(E){if(E){var F=bxe_config.xmldoc.cloneNode(true);
var D=F.evaluate("//@__bxe_id",F,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
var C=D.snapshotLength;
for(var B=0;
B<C;
B++){if(D.snapshotItem(B).ownerElement){D.snapshotItem(B).ownerElement.removeAttributeNode(D.snapshotItem(B))
}}var D=F.evaluate("//@__bxe_invalid",F,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
var C=D.snapshotLength;
for(var B=0;
B<C;
B++){if(D.snapshotItem(B).ownerElement){D.snapshotItem(B).ownerElement.removeAttributeNode(D.snapshotItem(B))
}}D=F.evaluate("//@__bxe_defaultcontent",F,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
C=D.snapshotLength;
for(var B=0;
B<C;
B++){var A=D.snapshotItem(B).ownerElement;
if(A){if(A.firstChild&&A.firstChild.nodeValue=="#empty"){A.removeChild(A.firstChild)
}D.snapshotItem(B).ownerElement.removeAttributeNode(D.snapshotItem(B))
}}return F
}return bxe_config.xmldoc
}function bxe_getXmlDocument(B){var A=bxe_getXmlDomDocument(B);
if(!A){return A
}if(B){xml2=A.saveXML(A);
delete A;
return xml2
}else{return A.saveXML(A)
}}function bxe_getRelaxNGDocument(){var A=bxe_config.DocumentVDOM.xmldoc;
return A.saveXML(A)
}function bxe_toggleTagMode(D){try{var B=D.target;
if(B._SourceMode){D=new eDOMEvent();
D.setTarget(B);
D.initEvent("toggleSourceMode")
}var A=document.implementation.createDocument("","",null);
if(!B._TagMode){createTagNameAttributes(B);
B._TagMode=true;
B.AreaInfo.TagModeMenu.Checked=true;
B.AreaInfo.NormalModeMenu.Checked=false
}else{var E=document.createTreeWalker(B,NodeFilter.SHOW_ELEMENT,null,true);
var C=B;
do{if(C.hasChildNodes()){C.removeAttribute("_edom_tagnameopen")
}C.removeAttribute("_edom_tagnameclose");
C=E.nextNode()
}while(C);
B._TagMode=false;
B.AreaInfo.TagModeMenu.Checked=false;
B.AreaInfo.NormalModeMenu.Checked=true
}}catch(D){alert(D)
}}function bxe_toggleNormalMode(B){try{var A=B.target;
if(A._SourceMode){B=new eDOMEvent();
B.setTarget(A);
B.initEvent("toggleSourceMode")
}if(A._TagMode){B=new eDOMEvent();
B.setTarget(A);
B.initEvent("toggleTagMode")
}A.AreaInfo.NormalModeMenu.Checked=true
}catch(B){alert(B)
}}function addTagnames_bxe(B){B.currentTarget.removeEventListener("DOMAttrModified",addTagnames_bxe,false);
var A=B.target;
try{createTagNameAttributes(A.parentNode.parentNode)
}catch(B){bxe_catch_alert(B)
}B.currentTarget.addEventListener("DOMAttrModified",addTagnames_bxe,false)
}function createTagNameAttributes(B,A){var E=B.XMLNode.createTreeWalker();
if(!A){var C=E.nextNode()
}else{var C=E.currentNode
}while(C){if(C.nodeType==1){var D=C.getBeforeAndAfterString(false,true);
C._node.setAttribute("_edom_tagnameopen",D[0]);
if(D[1]){C._node.setAttribute("_edom_tagnameclose",D[1])
}}C=E.nextNode()
}}function bxe_toggleAllToSourceMode(){var A=bxe_getAllEditableAreas();
for(var B=0;
B<A.length;
B++){var C=new Object();
C.target=A[B];
bxe_toggleSourceMode(C)
}}function bxe_toggleSourceMode(J){try{var B=J.target;
if(B._TagMode){J=new eDOMEvent();
J.setTarget(B);
J.initEvent("toggleTagMode")
}if(!B._SourceMode){var N=B.convertToXMLDocFrag();
var D=document.createElement("textarea");
D.setAttribute("name","sourceArea");
D.setAttribute("wrap","soft");
D.style.backgroundColor="rgb(255,255,200)";
D.style.border="0px";
D.style.height=B.getCStyle("height");
D.style.width=B.getCStyle("width");
B.removeAllChildren();
var M=document.saveChildrenXML(N,true);
D.value=M.str;
var K=D.value.match(/[\n\r]/g);
if(K){K=K.length;
D.style.minHeight=((K+1)*13)+"px"
}B.appendChild(D);
D.focus();
B.XMLNode.prefix=M.rootPrefix;
B._SourceMode=true;
B.AreaInfo.SourceModeMenu.Checked=true;
B.AreaInfo.NormalModeMenu.Checked=false;
bxe_updateXPath(B)
}else{var E=B.XMLNode.localName;
if(B.XMLNode.prefix!=null){E=B.XMLNode.prefix+":"+E
}var L="<"+E;
ns=B.XMLNode.xmlBridge.getNamespaceDefinitions();
for(var G in ns){if(G=="xmlns"){L+=' xmlns="'+ns[G]+'"'
}else{L+=" xmlns:"+G+'="'+ns[G]+'"'
}}L+=">"+B.firstChild.value+"</"+E+">";
var F=documentLoadXML(L);
if(F){B.XMLNode._node=B.XMLNode.xmlBridge;
B.XMLNode.removeAllChildren();
B.XMLNode._node.removeAllChildren();
B.XMLNode._node.appendAllChildren(F.firstChild);
B._SourceMode=false;
var C=B.XMLNode._vdom;
B.XMLNode=B.XMLNode._node.ownerDocument.init(B.XMLNode._node);
B.XMLNode.vdom=C;
B.removeAllChildren();
B.setStyle("white-space",null);
var I=B.XMLNode._node;
B.XMLNode.insertIntoHTMLDocument(B,true);
B.XMLNode.xmlBridge=I;
B.AreaInfo.SourceModeMenu.Checked=false;
B.AreaInfo.NormalModeMenu.Checked=true;
if(B.XMLNode.xmlBridge.parentNode.nodeType==1){nsparent=B.XMLNode.xmlBridge.parentNode.getNamespaceDefinitions();
for(var H in nsparent){if(nsparent[H]==ns[H]){I.removeAttributeNS(XMLNS,H)
}}}var A=B.XMLNode.isNodeValid(true);
if(!A){bxe_toggleSourceMode(J)
}bxe_updateXPath(B)
}}}catch(J){bxe_catch_alert(J)
}}function bxe_toggleTextClass(K){var C=window.getSelection();
var D=C.getEditableRange();
if(typeof K.additionalInfo.namespaceURI=="undefined"){K.additionalInfo.namespaceURI=""
}if(bxe_checkForSourceMode(C)){alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"));
return false
}var E=C.anchorNode.parentNode.XMLNode;
while(E){if(E.localName==K.additionalInfo.localName&&E.namespaceURI==K.additionalInfo.namespaceURI){return bxe_CleanInlineIntern(K.additionalInfo.localName,K.additionalInfo.namespaceURI)
}E=E.parentNode
}if(C.isCollapsed){var M=new XMLNodeElement(K.additionalInfo.namespaceURI,K.additionalInfo.localName,1,true);
C.insertNode(M._node);
M.makeDefaultNodes(false);
if(M._node.firstChild){var C=window.getSelection();
var L=M._node.firstInsertionPoint();
var I=M._node.lastInsertionPoint();
C.collapse(L.ipNode,L.ipOffset);
C.extend(I.ipNode,I.ipOffset)
}}else{C.fixFocus();
if(C.anchorNode!=C.focusNode){var O=C.anchorNode.nodeValue.length-C.anchorOffset;
var G=C.focusNode.nodeValue.length-C.focusOffset;
if(O>G){C.extend(C.anchorNode,C.anchorNode.nodeValue.length)
}else{var B=C.focusOffset;
C.collapse(C.focusNode,0);
C.extend(C.focusNode,B)
}}C.anchorNode.parentNode.normalize();
var N=bxe_config.xmldoc.createElementNS(K.additionalInfo.namespaceURI,K.additionalInfo.localName);
var H=bxe_getXMLNodeByHTMLNode(C.anchorNode.parentNode);
H.betterNormalize();
var J=bxe_getChildPosition(C.anchorNode);
H.childNodes[J].splitText(C.focusOffset);
H.childNodes[J].splitText(C.anchorOffset);
var F=H.childNodes[J+1];
H.insertBefore(N,F);
N.appendChild(F);
var A=N.setBxeId();
N.XMLNode=N.getXMLNode();
N.parentNode.XMLNode.isNodeValid(true,2);
if(!(N.XMLNode.makeDefaultNodes(true))){bxe_Transform(A,"select",N.parentNode.XMLNode)
}}C=window.getSelection();
D=C.getEditableRange();
debug("isValid?"+N.XMLNode.isNodeValid());
bxe_history_snapshot_async()
}function bxe_NodeInsertedParent(C){var B=C.target.XMLNode;
var A=C.additionalInfo;
A.XMLNode=bxe_XMLNodeInit(A);
A.XMLNode.previousSibling=B.previousSibling;
A.XMLNode.nextSibling=B.nextSibling;
if(A.XMLNode.previousSibling){A.XMLNode.previousSibling.nextSibling=A.XMLNode
}if(A.XMLNode.nextSibling){A.XMLNode.nextSibling.previousSibling=A.XMLNode
}A.XMLNode.firstChild=B;
A.XMLNode.lastChild=B;
A.XMLNode.parentNode=B.parentNode;
B.parentNode=A.XMLNode;
B.previousSibling=null;
B.nextSibling=null
}function bxe_NodeRemovedChild(C){var A=C.target.XMLNode;
var B=C.additionalInfo.XMLNode;
B.unlink()
}function bxe_NodeBeforeDelete(B){var A=B.target.XMLNode;
A.unlink()
}function bxe_NodePositionChanged(B){var A=B.target;
A.updateXMLNode()
}function bxe_NodeAppendedChild(C){var B=C.target.XMLNode;
var A=C.additionalInfo;
if(A.nodeType==11){var D=A.firstChild;
while(D){this.appendChildIntern(D.XMLNode);
D=D.nextSibling
}}else{A=A.XMLNode;
B.appendChildIntern(A)
}}function bxe_NodeRemovedChildOnly(C){var A=C.target.XMLNode;
var B=C.additionalInfo.XMLNode;
var E=B.lastChild;
if(B.firstChild){var D=B.firstChild;
while(D){D.parentNode=B.parentNode;
D=D.nextSibling
}B.previousSibling.nextSibling=B.firstChild;
B.nextSibling.previousSibling=B.lastChild;
B.firstChild.previousSibling=B.previousSibling;
B.lastChild.nextSibling=B.nextSibling
}else{B.previousSibling.nextSibling=old.nextSibling;
B.nextSibling.previousSibling=old.previousSibling
}if(A.firstChild==B){A.firstChild=B.nextSibling
}if(A.lastChild==B){A.lastChild=B.previousSibling
}}function bxe_ContextPopup(e){try{var node=e.target.XMLNode;
var popup=e.additionalInfo;
if(node.xmlBridge){return 
}if(node._node.nodeType==Node.ATTRIBUTE_NODE){node=node.parentNode
}if(node.vdom&&node.vdom.hasAttributes&&!popup.hasEditAttributes){var menui=popup.addMenuItem(bxe_i18n.getText("Edit {0} Attributes",new Array(node.vdom.bxeName)),mozilla.getWidgetGlobals().EditAttributes.popup);
menui.MenuPopup._node=node._node;
popup.hasEditAttributes=true
}if(node._node.firstChild&&node._node.firstChild.nodeType==3&&node._node.childNodes.length==1){var menui=popup.addMenuItem(bxe_i18n.getText("Edit text in popup"),function(e){var mod=mozilla.getWidgetModalBox("Edit text here",function(values){menui.MenuPopup.MainNode._node.firstChild.nodeValue=values.text;
bxe_checkEmptyParent(menui.MenuPopup.MainNode);
bxe_Transform()
});
var inputfield=mod.addItem("text","","textarea");
if(node.firstChild){inputfield.value=node.firstChild.nodeValue
}var _modBox=document.getElementById("modalBoxtext");
mod.node.style.width=window.innerWidth-150+"px";
_modBox.style.width=window.innerWidth-250+"px";
mod.node.style.height=window.innerHeight-110+"px";
_modBox.style.height=window.innerHeight-190+"px";
mod.show(100,50,"fixed");
_modBox.focus()
})
}if(typeof BxeClipboardPasteDialog=="function"){popup.addMenuItem(bxe_i18n.getText("Paste from Extern"),function(e){var widget=e.currentTarget.Widget;
BxeTextClipboard_OpenDialog(e,widget.MenuPopup.MainNode)
})
}if(node.canHaveText){popup.addMenuItem(bxe_i18n.getText("Insert Default Content"),function(e){var widget=e.currentTarget.Widget;
widget.MenuPopup.MainNode.makeDefaultNodes();
bxe_Transform(false,false,widget.MenuPopup.MainNode)
})
}if(!node.vdom.bxeNoaddappenddelete){popup.addMenuItem(bxe_i18n.getText("Copy {0} Element",new Array(node.vdom.bxeName)),function(e){var widget=e.currentTarget.Widget;
var delNode=widget.MenuPopup.MainNode;
delNode.copy()
})
}var tabletype=node.vdom.bxeTabletype;
if(tabletype!="table-row"&&tabletype!="table-cell"&&tabletype!="table-col"&&!node.vdom.bxeNoaddappenddelete){popup.addMenuItem(bxe_i18n.getText("Cut {0} Element",new Array(node.vdom.bxeName)),function(e){var widget=e.currentTarget.Widget;
var delNode=widget.MenuPopup.MainNode;
delNode.cut()
})
}var clip=mozilla.getClipboard();
if(clip._clipboard){var _clipboardNodeName="";
var _clipboardNamespaceUri="";
var _clipboardBxeName="";
var _textOnly="";
if(clip._clipboard.firstChild&&clip._clipboard.firstChild.nodeType==1){_clipboardNodeName=clip._clipboard.firstChild.nodeName;
_clipboardNamespaceUri=clip._clipboard.firstChild.namespaceURI
}else{if(clip._clipboard.nodeType==1){_clipboardNodeName=clip._clipboard.nodeName;
_clipboardNamespaceUri=XHTMLNS
}}if(clip._clipboardRootName){_clipboardBxeName=clip._clipboardRootName
}else{_clipboardBxeName=_clipboardNodeName
}if(!_clipboardNamespaceUri){_clipboardNamespaceUri=""
}if(_clipboardNodeName&&node.parentNode&&node.parentNode.isAllowedChild(_clipboardNamespaceUri,_clipboardNodeName)){popup.addMenuItem(bxe_i18n.getText("Append {0} from Clipboard",new Array(_clipboardBxeName)),function(e){var widget=e.currentTarget.Widget;
var appNode=widget.MenuPopup.MainNode;
var clip=mozilla.getClipboard();
var clipNode=clip.getData(MozClipboard.TEXT_FLAVOR);
eDOMEventCall("appendNode",document,{"appendToNode":appNode,"node":clipNode})
})
}}if(tabletype!="table-row"&&tabletype!="table-cell"&&tabletype!="table-col"&&!node.vdom.bxeNoaddappenddelete){popup.addMenuItem(bxe_i18n.getText("Delete {0} Element",new Array(node.vdom.bxeName)),function(e){var widget=e.currentTarget.Widget;
var delNode=widget.MenuPopup.MainNode;
var par=delNode.parentNode;
try{var _prev=delNode._htmlnode.previousSibling;
var sel=window.getSelection();
var _pos=0;
if(_prev){_pos=_prev.nodeValue.length;
sel.collapse(_prev,_pos)
}else{sel.collapse(par._htmlnode.firstChild,0)
}}catch(e){}delNode.unlink();
bxe_checkEmptyParent(par);
if(par.parentNode){bxe_Transform(false,false,par.parentNode)
}else{bxe_Transform(false,false,par)
}},bxe_i18n.getText("Deletes the Element and all its children"))
}if(node.parentNode&&node.parentNode.canHaveText){popup.addMenuItem(bxe_i18n.getText("Clean "),function(e){var widget=e.currentTarget.Widget;
var delNode=widget.MenuPopup.MainNode;
var par=delNode.parentNode;
try{var _prev=delNode._htmlnode.previousSibling;
var sel=window.getSelection();
var _pos=0;
if(_prev){_pos=_prev.nodeValue.length;
sel.collapse(_prev,_pos)
}else{sel.collapse(par._htmlnode.firstChild,0)
}}catch(e){}delNode._node.removeElementOnly();
par._node.betterNormalize();
bxe_Transform(false,false,par)
},bxe_i18n.getText("Removes the Element, but not its children"))
}var previousSibling=node.previousSibling;
while(previousSibling&&previousSibling.nodeType!=1){previousSibling=previousSibling.previousSibling
}var nextSibling=node.nextSibling;
while(nextSibling&&nextSibling.nodeType!=1){nextSibling=nextSibling.nextSibling
}if(!(node.vdom.bxeTabletype&&node.vdom.bxeTabletype=="table-cell"||node.vdom.bxeTabletype=="table-col")){bxe_doMoveUpDownMenu(node,popup,e,previousSibling,nextSibling,false)
}if(node.vdom.bxeMenuentry){popup.addSeparator();
var _entries=node.vdom.bxeMenuentry;
for(var i in _entries){var n=popup.addMenuItem(_entries[i]["name"],function(e){var widget=e.currentTarget.Widget;
var appNode=widget.MenuPopup.MainNode;
if(widget.bxeType&&widget.bxeType=="popup"){var pop=window.open(widget.bxeCall,"foobar","width=600,height=600,resizable=yes,scrollbars=yes");
window.bxe_lastNode=appNode;
pop.focus()
}else{return eval(widget.bxeCall+"(appNode)")
}});
n.bxeCall=_entries[i]["call"];
n.bxeType=_entries[i]["type"]
}}if(node.vdom.bxeTabletype&&(node.vdom.bxeTabletype=="table-cell"||node.vdom.bxeTabletype=="table-col")){popup.addSeparator(" Table Editing ");
bxe_doMoveUpDownMenu(node,popup,e,previousSibling,nextSibling,true);
if(node._node.getAttribute("colspan")>1){var menui=popup.addMenuItem(bxe_i18n.getText("Split right"),function(e){var widget=e.currentTarget.Widget;
var _par=widget.MenuPopup.MainNode._node.parentNode;
widget.MenuPopup.MainNode._node.TableCellSplitRight();
bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode)
})
}if(node._node.getAttribute("rowspan")>1){var menui=popup.addMenuItem(bxe_i18n.getText("Split down"),function(e){var widget=e.currentTarget.Widget;
var _par=widget.MenuPopup.MainNode._node.parentNode;
widget.MenuPopup.MainNode._node.TableCellSplitDown();
bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode)
})
}if(nextSibling&&(nextSibling.vdom.bxeTabletype=="table-cell"||nextSibling.vdom.bxeTabletype=="table-col")){var menui=popup.addMenuItem(bxe_i18n.getText("Merge right"),function(e){var widget=e.currentTarget.Widget;
var _par=widget.MenuPopup.MainNode._node.parentNode;
widget.MenuPopup.MainNode._node.TableCellMergeRight();
bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode)
})
}var _par=node.parentNode;
while(_par&&_par.vdom&&_par.vdom.bxeTabletype=="table-row"){_par=_par.parentNode
}if(node.vdom.bxeTabletype!="table-col"){var menui=popup.addMenuItem(bxe_i18n.getText("Merge down"),function(e){var widget=e.currentTarget.Widget;
var _par=widget.MenuPopup.MainNode._node.parentNode;
widget.MenuPopup.MainNode._node.TableCellMergeDown();
bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode)
});
var menui=popup.addMenuItem(bxe_i18n.getText("Append Row"),function(e){var widget=e.currentTarget.Widget;
widget.MenuPopup.MainNode._node.TableAppendRow();
bxe_Transform(false,false,widget.MenuPopup.MainNode.parentNode.parentNode)
})
}var menui=popup.addMenuItem(bxe_i18n.getText("Append Col"),function(e){var widget=e.currentTarget.Widget;
var _par=widget.MenuPopup.MainNode._node.parentNode.parentNode;
widget.MenuPopup.MainNode._node.TableAppendCol();
bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode.parentNode)
});
var menui=popup.addMenuItem(bxe_i18n.getText("Remove Row"),function(e){var widget=e.currentTarget.Widget;
var _par=widget.MenuPopup.MainNode._node.parentNode.parentNode;
widget.MenuPopup.MainNode._node.TableRemoveRow();
bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode.parentNode)
});
var menui=popup.addMenuItem(bxe_i18n.getText("Remove Col"),function(e){var widget=e.currentTarget.Widget;
var _par=widget.MenuPopup.MainNode._node.parentNode.parentNode;
widget.MenuPopup.MainNode._node.TableRemoveCol();
bxe_Transform(true,false,widget.MenuPopup.MainNode.parentNode.parentNode)
})
}popup.MainNode=node
}catch(e){bxe_catch_alert(e)
}}function bxe_doMoveUpDownMenu(E,A,H,D,G,C){if(D){if(C){var F="Move cell left"
}else{var F="Move up"
}A.addMenuItem(bxe_i18n.getText(F),function(K){var J=K.currentTarget.Widget;
var I=J.MenuPopup.MainNode;
bxe_moveUp(I)
});
if(C&&D.vdom.bxeTabletype=="table-cell"||D.vdom.bxeTabletype=="table-col"){var B=A.addMenuItem(bxe_i18n.getText("Move column left"),function(K){var J=K.currentTarget.Widget;
var I=J.MenuPopup.MainNode._node.parentNode;
J.MenuPopup.MainNode._node.TableCellMoveLeft();
bxe_Transform(true,false,J.MenuPopup.MainNode.parentNode)
})
}}if(G){if(C){var F="Move cell right"
}else{var F="Move down"
}A.addMenuItem(bxe_i18n.getText(F),function(K){var J=K.currentTarget.Widget;
var I=J.MenuPopup.MainNode;
bxe_moveDown(I)
});
if(C&&G.vdom&&(G.vdom.bxeTabletype=="table-cell"||G.vdom.bxeTabletype=="table-col")){var B=A.addMenuItem(bxe_i18n.getText("Move column right"),function(K){var J=K.currentTarget.Widget;
var I=J.MenuPopup.MainNode._node.parentNode;
J.MenuPopup.MainNode._node.TableCellMoveRight();
bxe_Transform(true,false,J.MenuPopup.MainNode.parentNode)
})
}}}function bxe_NodeChanged(C){var A=C.target;
var B=C.additionalInfo.XMLNode;
A.XMLNode=bxe_XMLNodeInit(A);
A.XMLNode.previousSibling=B.previousSibling;
A.XMLNode.nextSibling=B.nextSibling;
A.XMLNode.parentNode=B.parentNode;
A.XMLNode.firstChild=B.firstChild;
A.XMLNode.lastChild=B.lastChild;
if(!A.XMLNode.previousSibling){A.XMLNode.parentNode.firstChild=A.XMLNode
}else{A.XMLNode.previousSibling.nextSibling=A.XMLNode
}if(!A.XMLNode.nextSibling){A.XMLNode.parentNode.lastChild=A.XMLNode
}else{A.XMLNode.nextSibling.previousSibling=A.XMLNode
}B.unlink()
}function bxe_NodeInsertedBefore(A){}function bxe_appendNode(E){var A=E.additionalInfo.appendToNode;
bxe_history_snapshot();
if(E.additionalInfo.node){var C=E.additionalInfo.node;
if(C.nodeType==11){while(C.lastChild){if(C.lastChild.nodeType==1){C.lastChild.setBxeIds(true)
}newXMLNode=A.parentNode.insertBeforeIntern(C.lastChild,A._node.nextSibling)
}}else{newXMLNode=A.parentNode.insertBeforeIntern(C,A._node.nextSibling)
}newXMLNode.parentNode.isNodeValid(true,2);
bxe_Transform()
}else{var C=bxe_config.xmldoc.createElementNS(E.additionalInfo.namespaceURI,E.additionalInfo.localName,1);
if(E.additionalInfo.findFirstPosition){C=A.parentNode.insertAfter(C,A._node);
var D=C.parentNode.isNodeValid(true,2,true);
var D=C.parentNode.isNodeValid(true,2,true);
if(!D){var F=A.parentNode.firstChild;
C=A.parentNode.insertBefore(C._node,F._node);
F=F.nextSibling;
while(!C.parentNode.isNodeValid(true,2,true)&&F&&F._node){C=F.parentNode.insertBefore(C._node,F._node);
F=F.nextSibling
}}}else{C=A.parentNode.insertAfter(C,A._node)
}var B=C._node.setBxeId();
C.parentNode.isNodeValid(true,2);
if(!C.makeDefaultNodes(E.additionalInfo.noPlaceholderText)){if(!E.additionalInfo.noTransform){bxe_Transform(B,"select",C.parentNode)
}}}}function bxe_appendChildNode(E){var B=E.additionalInfo.appendToNode;
var C=bxe_createXMLNode(E.additionalInfo.namespaceURI,E.additionalInfo.localName);
if(E.additionalInfo.atStart&&B.firstChild){var D=B.firstChild._node;
while(D){C=B.insertBefore(C._node,D);
if(!C.parentNode.isNodeValid(true,2,true)){B.removeChild(C);
D=D.nextSibling
}else{D=null;
break
}}}else{C=B.appendChild(C)
}if(C&&C.parentNode){C.parentNode.isNodeValid(true,2);
var A=bxe_getCallback(E.additionalInfo.localName,E.additionalInfo.namespaceURI);
if(A){bxe_doCallback(A,C)
}else{if(!C.makeDefaultNodes(E.additionalInfo.noPlaceholderText)){if(!E.additionalInfo.noTransform){bxe_Transform(false,false,C.parentNode)
}}}}}function bxe_changeLinesContainer2(C){bxe_history_snapshot();
var A=C.split("=");
if(A.length<2){A[1]=null
}var B=window.bxe_ContextNode._node.changeContainer(A[1],A[0]);
B.XMLNode=new XMLNodeElement(A[1],A[0],window.bxe_ContextNode._node.nodeType);
try{B.updateXMLNode()
}catch(C){alert(B+" can't be updateXMLNode()'ed\n"+C)
}B.XMLNode.parentNode.isNodeValid(false,2,false,true);
bxe_history_snapshot_async();
window.bxe_ContextNode=B.XMLNode
}function bxe_changeLinesContainer(E){bxe_history_snapshot();
var A=E.additionalInfo.split("=");
if(A.length<2){A[1]=null
}var D=window.getSelection().getEditableRange();
var B=D.startContainer.getBlockParentFromXML();
if(B){var C=B._node.changeElementName(A[1],A[0]);
bxe_Transform(C.getAttribute("__bxe_id"),D.startOffset,C.parentNode.XMLNode)
}}function bxe_getAllEditableAreas(){var B=new bxe_nsResolver(document.documentElement);
var A=document.evaluate("/html/body//*[@bxe_xpath]",document.documentElement,B,0,null);
var D=null;
var C=new Array();
D=A.iterateNext();
while(D){C.push(D);
D=A.iterateNext()
}return C
}function bxe_getAll_bxeId(){var B=new bxe_nsResolver(document.documentElement);
var A=document.evaluate("/html/body//*[@__bxe_id ]",document.documentElement,B,0,null);
var F=null;
var C=new Array();
F=A.iterateNext();
var E=new Array();
var G=new Array();
while(F){var H=F.getAttribute("__bxe_id");
if(F.hasAttribute("__bxe_attribute")){H+="/"+F.getAttribute("__bxe_attribute")
}if(H==""){G.push(F)
}else{if(!E[H]){C.push(F);
E[H]=true
}}F=A.iterateNext()
}for(var D=0;
D<G.length;
D++){G[D].removeAttribute("__bxe_id")
}return C
}function bxe_alignAllAreaNodes(){var A=bxe_getAllEditableAreas();
for(var B=0;
B<A.length;
B++){bxe_alignAreaNode(A[B].parentNode,A[B])
}}function bxe_alignAreaNode(B,A){if(A.display=="block"){B.position("-8","5")
}else{B.position("0","0")
}B.draw()
}function BX_debug(object){var win=window.open("","debug");
bla="";
for(b in object){bla+=b;
try{bla+=": "+object.eval(b)
}catch(e){bla+=": NOT EVALED"
}bla+="\n"
}win.document.innerHTML="";
win.document.writeln("<pre>");
win.document.writeln(bla);
win.document.writeln("<hr>")
}function BX_showInWindow(A){var B=window.open("","debug");
B.document.innerHTML="";
B.document.writeln("<html>");
B.document.writeln("<body>");
B.document.writeln("<pre>");
if(typeof A=="string"){B.document.writeln(A.replace(/</g,"&lt;"))
}B.document.writeln("</pre>");
B.document.writeln("</body>");
B.document.writeln("</html>")
}function bxe_about_box_fade_out(A){bxe_about_box.node.style.display="none";
window.status=null
}function bxe_draw_widgets(){bxe_menubar=new Widget_MenuBar();
var img=document.createElement("img");
img.setAttribute("src",mozile_root_dir+"images/bxe.png");
img.setAttribute("align","right");
bxe_menubar.node.appendChild(img);
var submenu=new Array(bxe_i18n.getText("Save"),function(){eDOMEventCall("DocumentSave",document)
});
submenu.push(bxe_i18n.getText("Save & Reload"),function(){eDOMEventCall("DocumentSave",document,{"reload":true})
});
submenu.push(bxe_i18n.getText("Save & Exit"),function(){eDOMEventCall("DocumentSave",document,{"exit":true})
});
submenu.push(bxe_i18n.getText("Exit"),function(){eDOMEventCall("Exit",document)
});
bxe_menubar.addMenu(bxe_i18n.getText("File"),submenu);
var submenu2=new Array(bxe_i18n.getText("Undo"),function(){eDOMEventCall("Undo",document)
},bxe_i18n.getText("Redo"),function(){eDOMEventCall("Redo",document)
});
bxe_menubar.addMenu(bxe_i18n.getText("Edit"),submenu2);
var submenu3=new Array();
submenu3.push(bxe_i18n.getText("Show XML Document"),function(e){BX_showInWindow(bxe_getXmlDocument(true))
});
submenu3.push(bxe_i18n.getText("Show RNG Document"),function(e){BX_showInWindow(bxe_getRelaxNGDocument())
});
bxe_menubar.addMenu(bxe_i18n.getText("Debug"),submenu3);
for(var i=0;
i<bxe_config.menus.length;
i++){var _sub=new Array();
for(var j=0;
j<bxe_config.menus[i].menus.length;
j++){_sub.push(bxe_config.menus[i].menus[j].name,eval(bxe_config.menus[i].menus[j].value))
}bxe_menubar.addMenu(bxe_config.menus[i].name,_sub)
}var submenu4=new Array();
submenu4.push(bxe_i18n.getText("About BXE"),function(e){bxe_about_box.setText("");
bxe_about_box.show(true)
});
submenu4.push(bxe_i18n.getText("Help"),function(e){bla=window.open("http://wiki.bitfluxeditor.org/BXE_2.0","help","width=800,height=600,left=0,top=0");
bla.focus()
});
submenu4.push(bxe_i18n.getText("BXE Website"),function(e){bla=window.open("http://www.bitfluxeditor.org","help","width=800,height=600,left=0,top=0");
bla.focus()
});
submenu4.push(bxe_i18n.getText("Show System Info"),function(e){var modal=new Widget_ModalBox();
modal.node=modal.initNode("div","ModalBox");
modal.Display="block";
modal.node.appendToBody();
modal.position(100,100,"absolute");
modal.initTitle(bxe_i18n.getText("System Info"));
modal.initPane();
var innerhtml="<br/>"+bxe_i18n.getText("BXE Version: ")+BXE_VERSION+"<br />";
innerhtml+=bxe_i18n.getText("BXE Build Date: ")+BXE_BUILD+"<br/>";
innerhtml+=bxe_i18n.getText("BXE Revision: ")+BXE_REVISION+"<br/><br/>";
innerhtml+=bxe_i18n.getText("User Agent: ")+navigator.userAgent+"<br/><br/>";
modal.PaneNode.innerHTML=innerhtml;
modal.draw();
var subm=document.createElement("input");
subm.setAttribute("type","submit");
subm.setAttribute("value",bxe_i18n.getText("OK"));
subm.onclick=function(e){var Widget=e.target.parentNode.parentNode.Widget;
e.target.parentNode.parentNode.style.display="none"
};
modal.PaneNode.appendChild(subm)
});
submenu4.push(bxe_i18n.getText("Report Bug"),function(e){bla=window.open("http://bugs.bitfluxeditor.org/enter_bug.cgi?product=Editor&version="+BXE_VERSION+"&priority=P3&bug_severity=normal&bug_status=NEW&assigned_to=&cc=&bug_file_loc=http%3A%2F%2F&short_desc=&comment=***%0DVersion: "+BXE_VERSION+"%0DBuild: "+BXE_BUILD+"%0DUser Agent: "+navigator.userAgent+"%0D***&maketemplate=Remember+values+as+bookmarkable+template&form_name=enter_bug","help","");
bla.focus()
});
bxe_menubar.addMenu(bxe_i18n.getText("Help"),submenu4);
bxe_menubar.draw();
bxe_toolbar=new Widget_ToolBar();
bxe_format_list=new Widget_MenuList("m",function(e){bxe_changeLinesContainer2(this.value)
});
bxe_toolbar.addItem(bxe_format_list);
bxe_toolbar.addButtons(bxe_config.getButtons());
bxe_toolbar.draw();
bxe_status_bar=new Widget_StatusBar();
window.setTimeout(bxe_about_box_fade_out,1000)
}function MouseClickEvent(B){B.stopPropagation();
var A=B.currentTarget;
if(A.userModifiable&&bxe_editable_page){return bxe_updateXPath(A)
}return true
}function bxe_updateXPath(F){var A=window.getSelection();
try{var B=A.getRangeAt(0)
}catch(F){return false
}if(F&&F.localName=="TEXTAREA"){bxe_format_list.removeAllItems();
bxe_format_list.appendItem("-Source Mode-","");
bxe_status_bar.buildXPath(F.parentNode)
}else{if(B){if(F){bxe_status_bar.buildXPath(F)
}else{bxe_status_bar.buildXPath(A.anchorNode)
}bxe_format_list.removeAllItems();
var C=B.startContainer.getBlockParentFromXML();
if(C){var D=C;
if(!D){bxe_format_list.appendItem(bxe_i18n.getText("no block found"),"");
return false
}window.bxe_ContextNode=D;
var I=D.parentNode.allowedChildren;
var H;
var G=D.localName;
var E=D.namespaceURI;
if(I){for(i=0;
i<I.length;
i++){if(I[i].nodeType!=3&&!I[i].bxeDontshow&&I[i].vdom.canHaveChildren){H=bxe_format_list.appendItem(I[i].vdom.bxeName,I[i].localName+"="+I[i].namespaceURI);
if(I[i].localName==G&&I[i].namespaceURI==E){H.selected=true
}}}}}else{bxe_format_list.appendItem(bxe_i18n.getText("no block found"),"")
}}}}function bxe_delayedUpdateXPath(){if(bxe_delayedUpdate){window.clearTimeout(bxe_delayedUpdate)
}bxe_delayedUpdate=window.setTimeout("bxe_updateXPath()",100)
}function bxe_ContextMenuEvent(C){var A=C.target.getParentWithXMLNode();
if(!A){return true
}if(A.XMLNode._node.nodeType!=Node.ATTRIBUTE_NODE&&A.XMLNode.vdom.bxeNoteditableContextMenu==false){return false
}var B=window.getSelection();
if(B.anchorNode!=C.rangeParent&&B.isCollapsed){try{B.collapse(C.rangeParent,C.rangeOffset)
}catch(C){B.collapse(C.target,0)
}}bxe_context_menu.show(C,A);
C.stopPropagation();
C.returnValue=false;
C.preventDefault();
return false
}function bxe_UnorderedList(){var E=window.getSelection();
if(bxe_checkForSourceMode(E)){return false
}var C=window.getSelection().toggleListLines("ul","ol");
C[0].container.updateXMLNode();
var B=C[0].container;
while(B){if(B.nodeName=="li"){B.XMLNode.namespaceURI=XHTMLNS
}var A=B.XMLNode.attributes;
for(var D in A){if(!B.XMLNode.isAllowedAttribute(A[D].nodeName)){B.XMLNode.removeAttribute(A[D].nodeName)
}}B=B.nextSibling
}C[0].container.parentNode.setAttribute("class","type1");
bxe_updateXPath()
}function bxe_OrderedList(){var E=window.getSelection();
if(bxe_checkForSourceMode(E)){return false
}var C=window.getSelection().toggleListLines("ol","ul");
C[0].container.updateXMLNode();
var B=C[0].container;
while(B){if(B.nodeName=="li"){B.XMLNode.namespaceURI=XHTMLNS
}var A=B.XMLNode.attributes;
for(var D in A){if(!B.XMLNode.isAllowedAttribute(A[D].nodeName)){B.XMLNode.removeAttribute(A[D].nodeName)
}}B=B.nextSibling
}C[0].container.parentNode.setAttribute("class","type1");
bxe_updateXPath()
}function bxe_InsertObject(){var B=window.getSelection();
if(bxe_checkForSourceMode(B)){return false
}var A=documentCreateXHTMLElement("object");
B.insertNode(A)
}function bxe_InsertAsset(){var E=window.getSelection();
if(bxe_checkForSourceMode(E)){return false
}var D=E.getEditableRange();
var B=D.startContainer.parentNode;
if((B.XMLNode.localName=="highlight-title"&&B.XMLNode.namespaceURI=="http://unizh.ch/doctypes/elements/1.0")||(B.XMLNode.localName=="asset"&&B.XMLNode.namespaceURI=="http://apache.org/cocoon/lenya/page-envelope/1.0")){alert("Asset is not allowed here");
return false
}if(!bxe_checkIsAllowedChild("http://apache.org/cocoon/lenya/page-envelope/1.0","asset",E,true)&&!bxe_checkIsAllowedChildOfNode("http://apache.org/cocoon/lenya/page-envelope/1.0","asset",B.parentNode,true)){alert("Asset is not allowed here");
return false
}var C=document.createElementNS("http://apache.org/cocoon/lenya/page-envelope/1.0","asset");
var A=bxe_getCallback("asset","http://apache.org/cocoon/lenya/page-envelope/1.0");
if(A){bxe_doCallback(A,C)
}else{E.insertNode(C)
}}function bxe_InsertImage(){var B=window.getSelection();
if(bxe_checkForSourceMode(B)){return false
}var A=mozilla.getWidgetModalBox(bxe_i18n.getText("Enter the image url or file name:"),function(D){if(D.imgref==null){return 
}if(D.imgref==""){return 
}var C=documentCreateXHTMLElement("img");
C.firstChild.setAttribute("src",D.imgref);
B.insertNode(C);
C.updateXMLNode();
C.setAttribute("src",D.imgref)
});
A.addItem("imgref","","textfield",bxe_i18n.getText("Image URL:"));
A.show(100,50,"fixed")
}function bxe_checkForSourceMode(B){if(bxe_format_list.node.options.length==1&&bxe_format_list.node.options.selectedIndex==0){if(bxe_format_list.node.options[0].text=="-Source Mode-"){alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"));
return true
}}var A=B.getEditableRange();
if(A&&A.top&&A.top._SourceMode){alert(bxe_i18n.getText("You're in Source Mode. Not possible to use this button"));
return true
}return false
}function bxe_checkIsAllowedChild(C,A,F,E){if(!F){F=window.getSelection()
}else{if(typeof F=="object"&&F.nodeType&&F.nodeType==1){return bxe_checkIsAllowedChildOfNode(C,A,F,E)
}else{var D=F.getEditableRange();
var B=null;
if(D.startContainer.nodeType!=1){B=D.startContainer.parentNode
}else{B=D.startContainer
}return bxe_checkIsAllowedChildOfNode(C,A,B,E)
}}}function bxe_checkIsAllowedChildOfNode(B,A,C,D){if(A=="#text"){A=null
}if(A==null||C.XMLNode.isAllowedChild(B,A)){return true
}else{if(!D){alert(bxe_i18n.getText("{0} is not allowed as child of {1}",new Array(A,C.XMLNode.localName)))
}return false
}}function bxe_InsertTable(){var C=window.getSelection();
var B=C.getEditableRange();
if(!bxe_checkIsAllowedChild("","table",C,true)&&!bxe_checkIsAllowedChildOfNode("","table",B.startContainer.parentNode.parentNode,true)){alert(bxe_i18n.getText("Table is not allowed here"));
return false
}var A=documentCreateXHTMLElement("table");
window.bxe_ContextNode=BXE_SELECTION;
bxe_InsertTableCallback()
}function bxe_InsertTableCallback(C){var B=window.getSelection();
if(bxe_checkForSourceMode(B)){return false
}var A=mozilla.getWidgetModalBox(bxe_i18n.getText("Create Table"),function(D){if(C&&C._node){var G=documentCreateTable(D["rows"],D["cols"],C._node)
}else{var G=documentCreateTable(D["rows"],D["cols"])
}if(!G){alert(bxe_i18n.getText("Can't create table: invalid data"))
}else{if(window.bxe_ContextNode==BXE_SELECTION){var F=window.getSelection();
if(!bxe_checkIsAllowedChild("","table",F,true)){var E=bxe_splitAtSelection();
E.parentNode.insertBefore(G,E)
}else{F.insertNodeRaw(G,true)
}bxe_table_createTableFinish(G,D["rows"],D["cols"]);
bxe_Transform()
}else{if(C){C._node.parentNode.replaceChild(G,C._node);
bxe_table_createTableFinish(G,D["rows"],D["cols"]);
bxe_Transform()
}}}},function(){if(C&&C._node){C._node.parentNode.removeChild(C._node)
}bxe_Transform()
});
A.addItem("rows",2,"textfield",bxe_i18n.getText("number of rows"));
A.addItem("cols",2,"textfield",bxe_i18n.getText("number of cols"));
A.show(100,50,"fixed");
return true
}function bxe_CleanInline(A){bxe_CleanInlineIntern()
}function bxe_CleanInlineIntern(G,J,K){if(!K){K=0
}K++;
if(K>10){bxe_Transform();
bxe_dump("recursive protection\n");
return 
}var C=window.getSelection();
var F=0;
if(bxe_checkForSourceMode(C)){return false
}var E=C.getEditableRange();
if(!E){return 
}if(E.collapsed){return 
}var I=E.textNodes;
var H=I.length;
for(i=0;
i<H;
i++){if(I[i].parentNode.XMLNode){var D=I[i].parentNode.XMLNode._node;
if(I[i].parentNode&&I[i].parentNode.getCStyle("display")=="inline"){if(G){if(D.parentNode&&D.parentNode.firstChild==D){I.push(D)
}if(!(D.XMLNode.localName==G&&D.XMLNode.namespaceURI==J)){continue
}}if(D.childNodes.length>1){var B;
if(I[i].previousSibling){if(I[i].previousSibling.nodeType==3){var B=D.cloneNode(false);
D.parentNode.insertBefore(B,D);
B.appendChild(I[i].previousSibling)
}}if(I[i].nextSibling){if(I[i].nextSibling.nodeType==3){var B=D.cloneNode(false);
if(D.nextSibling){D.parentNode.insertBefore(B,D.nextSibling)
}else{D.parentNode.appendChild(B)
}B.appendChild(I[i].nextSibling)
}else{D.split(1)
}}}if(D.parentNode){F++;
var L=D.parentNode;
L.removeChildOnly(D);
L.normalize()
}}}}if(D.parentNode==null){var A=C.anchorNode.parentNode.previousSibling;
var C=window.getSelection();
var M=0;
if(A){M=A.nodeValue.length;
C.collapse(A,M)
}else{C.collapse(C.anchorNode.parentNode.parentNode.firstChild,0)
}}bxe_Transform()
}function bxe_DeleteLink(D){var B=window.getSelection();
if(bxe_checkForSourceMode(B)){return false
}var A=B.getEditableRange();
var C=B.anchorNode.parentNode;
if(C.nodeNamed("span")&&C.getAttribute("class")=="a"){C.parentNode.removeChildOnly(C)
}B.selectEditableRange(A);
B.anchorNode.updateXMLNode()
}function bxe_InsertLink(D){var C=window.getSelection();
if(bxe_checkForSourceMode(C)){return false
}var B="";
if(C.anchorNode.parentNode.XMLNode.localName=="a"){B=C.anchorNode.parentNode.getAttribute("href")
}else{if(C.isCollapsed){return 
}}if(!bxe_checkIsAllowedChild(XHTMLNS,"a",C)){return false
}var A=mozilla.getWidgetModalBox(bxe_i18n.getText("Enter a URL:"),function(F){var E=F["href"];
if(E==null){return 
}var G=window.getSelection();
if(G.anchorNode.parentNode.XMLNode.localName=="a"){G.anchorNode.parentNode.setAttribute("href",E);
return true
}if(E!=""){G.linkText(E)
}else{G.clearTextLinks()
}G.anchorNode.parentNode.updateXMLNode()
});
A.addItem("href",B,"textfield",bxe_i18n.getText("Enter a URL:"));
A.show(100,50,"fixed");
return 
}function bxe_insertLibraryLink(){drawertool.cssr=window.getSelection().getEditableRange();
drawertool.openDrawer("liblinkdrawer");
return 
}function bxe_catch_alert(A){alert(bxe_catch_alert_message(A))
}function bxe_catch_alert_message(B){var A="ERROR in BXE:\n"+B.message+"\n";
try{if(B.filename){A+=("In File: ")+B.filename+"\n"
}else{A+=("In File: ")+B.fileName+"\n"
}}catch(B){A+=("In File: ")+B.fileName+"\n"
}try{A+=("Linenumber: ")+B.lineNumber+"\n"
}catch(B){}A+=("Type: ")+B.name+"\n";
A+=("Stack:")+B.stack+"\n";
return A
}function bxe_exit(A){if(bxe_checkChangedDocument()){if(confirm(bxe_i18n.getText("You have unsaved changes.\n Click cancel to return to the document.\n Click OK to really leave to page."))){bxe_lastSavedXML=bxe_getXmlDocument();
window.location=bxe_config.exitdestination
}}else{bxe_lastSavedXML=bxe_getXmlDocument();
window.location=bxe_config.exitdestination
}}function bxe_checkChangedDocument(){var A=bxe_getXmlDocument();
if(bxe_editable_page&&A&&A!=bxe_lastSavedXML){return true
}else{return false
}}function bxe_not_yet_implemented(){alert(bxe_i18n.getText("not yet implemented"))
}function bxe_nsResolver(A){this.metaTagNSResolver=null;
this.metaTagNSResolverUri=null;
this.xmlDocNSResolver=null;
this.node=A
}bxe_nsResolver.prototype.lookupNamespaceURI=function(D){var A=null;
if(!this.metaTagNSResolver){var E=document.getElementsByName("bxeNS");
this.metaTagNSResolver=new Array();
for(var B=0;
B<E.length;
B++){if(E[B].localName.toLowerCase()=="meta"){var C=E[B].getAttribute("content").split("=");
this.metaTagNSResolver[C[0]]=C[1]
}}}if(this.metaTagNSResolver[D]){return this.metaTagNSResolver[D]
}if(!this.xmlDocNSResolver){this.xmlDocNSResolver=this.node.ownerDocument.createNSResolver(this.node.ownerDocument.documentElement)
}A=this.xmlDocNSResolver.lookupNamespaceURI(D);
if(A){return A
}if(D=="bxe"){return BXENS
}if(D=="xhtml"){return XHTMLNS
}return null
};
bxe_nsResolver.prototype.lookupNamespacePrefix=function(C){if(!this.metaTagNSResolverUri){var D=document.getElementsByName("bxeNS");
this.metaTagNSResolverUri=new Array();
for(var A=0;
A<D.length;
A++){if(D[A].localName.toLowerCase()=="meta"){var B=D[A].getAttribute("content").split("=");
this.metaTagNSResolverUri[B[1]]=B[0]
}}}if(this.metaTagNSResolverUri[C]){return this.metaTagNSResolverUri[C]
}return null
};
documentCreateXHTMLElement=function(A,D){var C=document.createElementNS(null,A);
if(D){for(var B=0;
B<D.length;
B++){C.setAttributeNS(D[B].namespaceURI,D[B].localName,D[B].value)
}}return C
};
function bxe_InternalChildNodesAttrChanged(E){var C=E.target;
var F=C.attributes;
var B=document.createElementNS(C.InternalChildNode.namespaceURI,C.InternalChildNode.localName);
for(var A=0;
A<F.length;
A++){var D=F[A].localName.substr(0,5);
if(D!="_edom"&&D!="__bxe"){B.setAttributeNS(F[A].namespaceURI,F[A].localName,F[A].value)
}}C.replaceChild(B,C.InternalChildNode);
B.setAttribute("_edom_internal_node","true");
C.InternalChildNode=B;
createTagNameAttributes(C,true)
}function bxe_registerKeyHandlers(){if(bxe_editable_page){document.addEventListener("keypress",keyPressHandler,true);
document.addEventListener("contextmenu",bxe_ContextMenuEvent,false)
}}function bxe_disableEditablePage(){bxe_deregisterKeyHandlers();
bxe_editable_page=false;
document.removeEventListener("contextmenu",bxe_ContextMenuEvent,false)
}function bxe_deregisterKeyHandlers(){document.removeEventListener("contextmenu",bxe_ContextMenuEvent,false);
document.removeEventListener("keypress",keyPressHandler,true)
}function bxe_insertContent(B,C,A){window.setTimeout(function(){bxe_insertContent_async(B,C,A)
},1)
}function bxe_insertContent_async(F,L,N,G){var I;
if(typeof F=="string"){I=F.convertToXML()
}else{I=F
}var H=false;
try{if(L==BXE_SELECTION){var D=window.getSelection();
if(N&BXE_SPLIT_IF_INLINE){var A=I.lastChild;
while(A&&A.nodeType==3){A=A.previousSibling
}if(!A){A=I.lastChild
}if(G){var C=G
}else{var C=D
}if(!bxe_checkIsAllowedChild(A.namespaceURI,A.localName,C,true)){var E=D.getEditableRange();
if(G){var B=G
}else{var B=D.anchorNode.parentNode.XMLNode._node
}var K=I.firstChild;
B.parentNode.insertBefore(I,B.nextSibling);
var M=B.parentNode;
var D=window.getSelection();
var E=D.getEditableRange();
M.XMLNode.isNodeValid(true,2,true);
if(K){if(K.firstChild){D.collapse(K.firstChild,0)
}}bxe_Transform();
return 
}}D.insertNodeRaw(I);
bxe_Transform();
return 
}else{if(L){newNode=I.firstChild;
L._node.parentNode.replaceChild(newNode,L._node);
bxe_Transform(false,false,L.parentNode)
}else{var D=window.getSelection();
var E=D.getEditableRange();
eDOMEventCall("appendNode",document,{"appendToNode":E.startContainer.parentNode.XMLNode,"node":I.firstChild})
}}}catch(J){bxe_catch_alert(J)
}}String.prototype.strip=function(){var A=/^\s*(\S.*)$/;
var C=/^(.*\S)\s+$/;
try{var D=A.exec(this)[1];
return C.exec(D)[1]
}catch(B){return this
}};
String.prototype.convertToXML=function(){var A=new DOMParser();
var B=this.toString();
if(B.indexOf("<")>=0){B=A.parseFromString("<?xml version='1.0'?><rooot>"+B+"</rooot>","text/xml");
B=B.documentElement;
BX_tmp_r1=document.createRange();
BX_tmp_r1.selectNodeContents(B);
B=BX_tmp_r1.extractContents()
}else{B=document.createTextNode(B)
}return B
};
function bxe_getCallback(B,A){if(bxe_config.callbacks[A+":"+B]){return bxe_config.callbacks[A+":"+B]
}else{return null
}}function bxe_doCallback(cb,node){window.bxe_ContextNode=node;
if(cb["precheck"]){if(!(eval(cb["precheck"]+"(node)"))){return false
}}if(cb["type"]=="popup"){var pop=window.open(cb["content"],"popup","width=600,height=600,resizable=yes,scrollbars=yes");
pop.focus()
}else{if(cb["type"]=="function"){return eval(cb["content"]+"(node)")
}}}function bxe_InsertSpecialchars(){var A=window.open(mozile_root_dir+"/plugins/specialchars/specialcharacters.xml","popup","width=400,height=500,resizable=yes,scrollbars=yes");
A.focus()
}function bxe_checkIfNotALink(A){var B=window.getSelection();
if(B.anchorNode.parentNode.XMLNode.localName=="a"||B.focusNode.parentNode.XMLNode.localName=="a"){alert(bxe_i18n.getText("There is already a link here, please use the 'Edit Attributes' function, to edit the link."));
return false
}return true
}function bxe_alert(B){var A=mozilla.getWidgetModalBox(bxe_i18n.getText("Alert"));
A.addText(B);
A.show(100,50,"fixed")
}function bxe_validationAlert(B){var A=mozilla.getWidgetModalBox(bxe_i18n.getText("Validation Alert"));
for(i in B){A.addText(B[i]["text"])
}A.show((window.innerWidth-500)/2,50,"fixed",true)
}function bxe_getDirPart(A){return A.substring(0,A.lastIndexOf("/")+1)
}function bxe_nodeSort(B,A){if(B.nodeName>A.nodeName){return 1
}else{return -1
}}function bxe_showImageDrawer(){drawertool.cssr=window.getSelection().getEditableRange();
drawertool.openDrawer("imagedrawer")
}function bxe_ShowAssetDrawer(){drawertool.cssr=window.getSelection().getEditableRange();
if(drawertool.cssr){drawertool.openDrawer("assetdrawer")
}}function bxe_start_plugins(){var C=bxe_config.getPlugins();
if(C.length>0){for(var A=0;
A<C.length;
A++){var B=bxe_plugins[C[A]];
if(B.start){B.start(bxe_config.getPluginOptions(C[A]))
}}}}function bxe_Transform_async(){window.setTimeout("bxe_Transform()",10)
}function bxe_Transform(xpath,position,validateNode,wFValidityCheckLevel){startTimer=new Date();
bxe_dump("TRANSFORM\n");
var xml=bxe_config.xmldoc;
if(bxe_config.options["onTransformBefore"]){eval(bxe_config.options["onTransformBefore"]+"(xml,'onTransformBefore')")
}var node=xml.documentElement;
var sel=window.getSelection();
if(sel&&sel.anchorNode){var _topId=bxe_getBxeId(sel.anchorNode.parentNode);
if(sel.anchorNode.parentNode.hasAttribute("__bxe_attribute")){var _topAttr=sel.anchorNode.parentNode.getAttribute("__bxe_attribute")
}else{var _topAttr=null
}}var _childPosition=bxe_getChildPosition(sel.anchorNode);
var _offset=sel.anchorOffset;
bxe_config.xmldoc.documentElement.init();
bxe_dump("getDomDocument "+(new Date()-startTimer)/1000+" sec\n");
try{var xmldoc=bxe_config.processor.transformToFragment(xml,document)
}catch(e){BX_debug(e)
}bxe_dump("transformToFragment "+(new Date()-startTimer)/1000+" sec\n");
var bxe_area=document.getElementById("bxe_area");
bxe_area.removeAllChildren();
bxe_area.style.display="none";
bxe_area.appendChild(xmldoc);
var b=document.evaluate("./*[local-name() = 'html']/*[local-name() = 'body']",bxe_area,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null);
if(b.singleNodeValue){var c=b.singleNodeValue.firstChild;
while(c){var cthis=c;
c=c.nextSibling;
bxe_area.appendChild(cthis)
}var c=document.evaluate("./*[local-name() = 'html']/*[local-name() = 'head']/*[local-name() = 'link' and @rel='stylesheet' and @type='text/css' and not(@media = 'print')]",bxe_area,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
if(bxe_firstTransform){for(var i=0;
i<c.snapshotLength;
i++){var x=document.body.appendChild(document.createElement("link"));
x.setAttribute("type","text/css");
x.setAttribute("rel","stylesheet");
x.setAttribute("href",c.snapshotItem(i).getAttribute("href"));
x.setAttribute("media",c.snapshotItem(i).getAttribute("media"))
}}b.singleNodeValue.parentNode.parentNode.removeChild(b.singleNodeValue.parentNode)
}bxe_dump("remove and Append "+(new Date()-startTimer)/1000+" sec\n");
bxe_init_serverIncludes(bxe_area);
bxe_dump("serverIncludes "+(new Date()-startTimer)/1000+" sec\n");
bxe_area.style.display="block";
bxe_dump("display=block "+(new Date()-startTimer)/1000+" sec\n");
bxe_init_htmldocument();
bxe_status_bar.positionize();
bxe_dump("bxe_init_htmldocument  "+(new Date()-startTimer)/1000+" sec\n");
var valid=false;
if(validateNode){if(valid=validateNode.isNodeValid(true,wFValidityCheckLevel)){bxe_dump("node is valid \n")
}else{bxe_dump("node is not valid \n")
}}else{valid=xml.XMLNode.validateDocument()
}bxe_dump("validateDocument "+(new Date()-startTimer)/1000+" sec\n");
if(!valid){bxe_dump("Document not valid. Do it again...\n");
return bxe_history_undo()
}if(bxe_config.options["onTransformAfter"]){eval(bxe_config.options["onTransformAfter"]+"(xml,'onTransformAfter')")
}if(_topId){var _topNode=bxe_getHTMLNodeByBxeId(_topId,_topAttr)
}if(typeof xpath=="string"){var _node=bxe_getHTMLNodeByBxeId(xpath);
sel=window.getSelection();
if(_node){try{if(position=="select"){sel.collapse(_node.firstChild,0);
sel.extend(_node.firstChild,_node.firstChild.length)
}else{sel.collapse(_node.firstChild,position)
}}catch(e){bxe_dump("Cursor selection didn't work (somehow expected behaviour). Exception dump: \n");
bxe_dump(e);
bxe_dump("\n")
}}}else{if(!_topNode){}else{if(xpath){if(_topNode.nextSibling&&_topNode.nextSibling.firstChild){sel.collapse(_topNode.nextSibling.firstChild,0)
}else{if(_topNode.nextSibling){sel.collapse(_topNode.nextSibling,0)
}}}else{try{sel.collapse(_topNode.childNodes[_childPosition],_offset)
}catch(e){}}}}var sel=window.getSelection();
if(sel.isCollapsed&&sel.anchorNode&&sel.anchorNode.parentNode.getAttribute("__bxe_defaultcontent")=="true"){var node=sel.anchorNode.parentNode;
sel.collapse(node.firstChild,0);
sel.extend(node.firstChild,node.firstChild.length)
}bxe_dump("cursor selection "+(new Date()-startTimer)/1000+" sec\n");
bxe_firstTransform=false;
bxe_history_snapshot();
bxe_dump("history snapshot "+(new Date()-startTimer)/1000+" sec\n")
}function bxe_Transform_first(){bxe_firstTransform=true;
bxe_Transform();
var A=window.getSelection();
var B=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_ELEMENT,null,true);
node=B.nextNode();
do{if(node.userModifiable&&node.XMLNode&&node.XMLNode.canHaveText){A.collapse(node.firstChild,0);
bxe_updateXPath(node);
break
}node=B.nextNode()
}while(node)
}function bxe_getXMLNodeByHTMLNode(A){return A.XMLNode._node
}function bxe_getXMLNodeByHTMLNodeRecursive(A){while(A){if(A.XMLNode&&A.XMLNode._node){return A.XMLNode._node
}A=A.parentNode
}return null
}function bxe_getBxeId(A){return A.getAttribute("__bxe_id")
}function bxe_getHTMLNodeByBxeId(B,A){if(A){return document.evaluate("//*[@__bxe_id = '"+B+"' and @__bxe_attribute = '"+A+"']",document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue
}else{return document.evaluate("//*[@__bxe_id = '"+B+"']",document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue
}}function bxe_getChildPosition(A){if(!A){return 0
}if(A._childPosition){return A._childPosition
}var C=0;
var B=A.previousSibling;
while(B){B=B.previousSibling;
C++
}A._childPosition=C;
return C
}function bxe_init_htmldocument(){var A=bxe_getAll_bxeId();
for(var E in A){var C=A[E];
var B=C.getAttribute("__bxe_id");
var F=bxe_xml_nodes[B];
if(F){var J=false;
if(C.hasAttribute("__bxe_attribute")){var H=C.getAttribute("__bxe_attribute");
var K=F.getAttributeNode(H);
if(K){C.XMLNode=K.getXMLNode();
var G=F.getXMLNode();
if(G&&G.vdom&&G.vdom.attributes&&G.vdom.attributes[H]&&F.getXMLNode().vdom.attributes[H].bxeNoteditable){J=true
}}else{J=true
}}else{C.XMLNode=F.getXMLNode();
if(C.XMLNode.vdom&&C.XMLNode.vdom.bxeNoteditable){J=true
}}if(J){if(C.XMLNode&&C.XMLNode.nodeType!=2&&!C.XMLNode.vdom.bxeNoteditableContextMenu){C.removeAttribute("__bxe_id");
C.XMLNode=null
}else{C.addEventListener("click",MouseClickEvent,false)
}C.setAttribute("__bxe_noteditable","true")
}else{C.XMLNode._htmlnode=C;
var D=C.firstChild;
var I=0;
while(D){if(D.nodeType==3){if(F.childNodes.item(I)){D.XMLNode=F.childNodes.item(I).getXMLNode()
}}I++;
D=D.nextSibling
}C.addEventListener("click",MouseClickEvent,false)
}}}}function bxe_init_serverIncludesCallback(A){if(A.document.documentElement.localName=="html4"){bxe_config.serverIncludes[A.td.url]=A.document.documentElement.firstChild.nodeValue
}else{bxe_config.serverIncludes[A.td.url]=A.document.documentElement.saveXML()
}bxe_init_serverIncludesReplaceNode(A.td.url,A.td.htmlNode)
}function bxe_init_serverIncludes(ctx){var includeName=bxe_config.options["serverIncludeElement"];
if(!includeName){return false
}var includeFunction=bxe_config.options["serverIncludeFunction"];
if(!bxe_config.serverIncludes){bxe_config.serverIncludes=new Array()
}var res=document.evaluate("//"+includeName,ctx,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
for(var i=0;
i<res.snapshotLength;
i++){var node=res.snapshotItem(i);
var url=eval(includeFunction+"(node)");
if(!bxe_config.serverIncludes[url]){var td=new mozileTransportDriver("http");
td.htmlNode=node;
td.url=url;
var req=td.load(url,bxe_init_serverIncludesCallback,true)
}else{bxe_init_serverIncludesReplaceNode(url,node)
}}}function bxe_init_serverIncludesReplaceNode(A,C){var D=C.getAttribute("__bxe_id");
divnode=document.createElement("div");
divnode.setAttribute("__bxe_id",D);
divnode.innerHTML=bxe_config.serverIncludes[A];
var B=bxe_xml_nodes[D];
if(B){divnode.XMLNode=B.getXMLNode();
divnode.XMLNode._htmlnode=divnode
}C.parentNode.replaceChild(divnode,C);
divnode.addEventListener("click",MouseClickEvent,false)
}function bxe_createXMLNode(B,A){var C=bxe_config.xmldoc.createElementNS(B,A);
C.XMLNode=C.getXMLNode();
return C.XMLNode
}function bxe_splitAtSelection(C){var F=window.getSelection();
var E=F.getEditableRange();
var D=bxe_getXMLNodeByHTMLNode(E.startContainer.parentNode);
D.betterNormalize();
var A=bxe_getChildPosition(E.startContainer);
D.childNodes[A].splitText(E.startOffset);
if(D.childNodes[A+1].nodeValue==""){D.appendChild(bxe_config.xmldoc.createTextNode(STRING_NBSP))
}D.split(A+1);
if(D.nextSibling){if(D.nextSibling.nodeType==3){var B=D.nextSibling.parentNode;
B.XMLNode.makeDefaultNodes()
}else{var B=D.nextSibling
}B.removeAttribute("__bxe_id");
B.setBxeId()
}if(C){bxe_dump(D.localName+"\n");
while(D&&D!=C){A=bxe_getChildPosition(D);
bxe_dump(A+"\n");
bxe_dump(D.localName+"\n");
D=D.parentNode;
D.split(A+1);
if(D.nextSibling){D.nextSibling.removeAttribute("__bxe_id");
D.nextSibling.setBxeId()
}}}return D
}function bxe_insertAttributeValue(A){window.bxe_lastAttributeNode.value=A
}function bxe_getAttributeValue(){return window.bxe_lastAttributeNode.value
}function bxe_moveUp(A){var B=A.previousSibling;
while(B&&B._node.nodeType!=1){if(B._node.nodeType==3&&!B._node.isWhitespaceOnly){break
}B=B.previousSibling
}if(B){A.parentNode.insertBefore(A._node,B._node)
}bxe_Transform(false,false,A.parentNode)
}function bxe_moveDown(A){var B=A.nextSibling;
while(B&&B._node.nodeType!=1){if(B._node.nodeType==3&&!B._node.isWhitespaceOnly){break
}B=B.nextSibling
}if(B){A.parentNode.insertAfter(A._node,B._node)
}bxe_Transform(false,false,A.parentNode)
}function html_get_current_XMLNode(A){return A.getParentWithXMLNode().XMLNode
}function bxe_onEmptyAddDefaultContent(B){if(B.vdom.bxeDefaultcontent){B.setContent(B.vdom.bxeDefaultcontent)
}else{B.setContent("#"+B.nodeName)
}B._node.setAttribute("__bxe_defaultcontent","true");
bxe_Transform();
var C=window.getSelection();
var A=B._htmlnode;
C.collapse(A.firstChild,0);
C.extend(A.firstChild,A.firstChild.length);
this.lastDefaultContent=A;
return true
}var bxe_lastCursorPositionAnchorNode=null;
var bxe_lastCursorPositionAnchorOffset=null;
var bxe_lastCursorPositionFocusNode=null;
var bxe_lastCursorPositionFocusOffset=null;
function bxe_cursorPositionSave(){var A=window.getSelection();
bxe_lastCursorPositionAnchorNode=A.anchorNode;
bxe_lastCursorPositionAnchorOffset=A.anchorOffset;
if(A.isCollapsed){bxe_lastCursorPositionFocusNode=null;
bxe_lastCursorPositionFocusOffset=null
}else{bxe_lastCursorPositionFocusNode=A.focusNode;
bxe_lastCursorPositionFocusOffset=A.focusOffset
}}function bxe_cursorPositionLoad(){var A=window.getSelection();
try{A.collapse(bxe_lastCursorPositionAnchorNode,bxe_lastCursorPositionAnchorOffset);
if(bxe_lastCursorPositionFocusNode){A.extend(bxe_lastCursorPositionFocusNode,bxe_lastCursorPositionFocusOffset)
}}catch(B){return false
}}function bxe_checkEmpty(xmlnode,makeDefault){if(!makeDefault&&xmlnode.vdom&&xmlnode.vdom.bxeOnemptyType){var par=xmlnode.parentNode;
if(xmlnode.vdom.bxeOnemptyType=="function"){if(eval(xmlnode.vdom.bxeOnempty+"(xmlnode)")){bxe_checkEmptyParent(par);
return true
}}else{if(xmlnode.vdom.bxeOnemptyType=="delete"){par.removeChild(xmlnode);
bxe_checkEmptyParent(par);
return true
}}}if(makeDefault||xmlnode.vdom&&(xmlnode.vdom.bxeDefaultcontent||xmlnode.vdom.bxeTabletype=="table-cell"||xmlnode.vdom.bxeTabletype=="table-col")){xmlnode.makeDefaultNodes()
}else{var par=xmlnode.parentNode;
par.removeChild(xmlnode);
bxe_checkEmptyParent(par)
}}function bxe_checkEmptyParent(A){if(A._node.childNodes.length==0){bxe_checkEmpty(A)
}else{if(A.vdom&&!A.vdom.bxeOnemptyAllowWhitespace&&A.isWhitespaceOnly){A.removeAllChildren();
bxe_checkEmpty(A)
}}}function bxe_empty_para(A){A.setContent("content via callback function");
A._node.setAttribute("__bxe_defaultcontent","true");
bxe_Transform(false,false,A);
return true
}function i18n(A){this.xml=A
}i18n.prototype.getText=function(key,replacements){if(this.xml){try{var res=this.xml.evaluate('/catalogue/message[@key="'+key+'"]/text()',this.xml,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue;
if(res){var string=res.nodeValue
}else{var string=key
}}catch(e){alert(e+"\n Used key: "+key)
}}else{string=key
}if(replacements){string=eval("'"+string.replace(/\{([0-9]+)\}/g,"'+replacements[$1]+'")+"'")
}return string
};
Element.prototype.TableRemoveRow=function(){bxe_history_snapshot();
return bxe_table_delete_row(this)
};
Element.prototype.TableRemoveCol=function(){bxe_history_snapshot();
return bxe_table_delete_col(this)
};
Element.prototype.TableAppendRow=function(){bxe_history_snapshot();
return bxe_table_insert_row(this)
};
Element.prototype.TableAppendCol=function(){bxe_history_snapshot();
return bxe_table_insert_col(this)
};
Element.prototype.findPosition=function(){var A=this.previousSibling;
var C=1;
while(A){if(A.nodeType==1&&(A.XMLNode.vdom.bxeTabletype=="table-cell"||A.XMLNode.vdom.bxeTabletype=="table-col")){var B=A.getAttribute("colspan");
if(B>0){C+=parseInt(B)
}else{C++
}}A=A.previousSibling
}return C
};
Element.prototype.TableCellMergeRight=function(){var F=bxe_table_getRowAndColPosition(this);
var H=F["matrix"];
var A=F["row"];
var E=F["col"];
var I=bxe_table_getSpanCount(this.getAttribute("colspan"));
var B=H[A][E+I][1];
if(!B){alert(bxe_i18n.getText("There's no right cell to be merged"));
return 
}var J=bxe_table_getSpanCount(B.getAttribute("rowspan"));
var G=bxe_table_getSpanCount(this.getAttribute("rowspan"));
if(J!=G){alert(bxe_i18n.getText("Right cell's rowspan is different to this cell's rowspan, merging not possible"));
return 
}var C=B.firstChild;
while(C){var D=C.nextSibling;
this.appendChild(C);
C=D
}this.normalize();
B.parentNode.removeChild(B);
this.setAttribute("colspan",I+1);
return this.parentNode.parentNode
};
Element.prototype.TableCellMoveRight=function(){var B=bxe_table_getRowAndColPosition(this);
var C=B["matrix"];
var E=B["row"];
var F=B["col"];
var A=bxe_table_getSpanCount(this.getAttribute("colspan"));
var H=C[E][F+A][1];
if(!H){alert(bxe_i18n.getText("There's no right cell to be moved"));
return 
}for(var G=1;
G<=C[0][0][0];
G++){var D=C[G][F];
C[G][F]=C[G][F+1];
C[G][F+1]=D
}return bxe_rebuildTableByTableMatrix(this,C)
};
Element.prototype.TableCellMoveLeft=function(){var A=bxe_table_getRowAndColPosition(this);
var B=A["matrix"];
var D=A["row"];
var E=A["col"];
if(E==1){alert(bxe_i18n.getText("There's no left cell to be moved"));
return 
}for(var F=1;
F<=B[0][0][0];
F++){var C=B[F][E];
B[F][E]=B[F][E-1];
B[F][E-1]=C
}return bxe_rebuildTableByTableMatrix(this,B)
};
Element.prototype.TableCellMergeDown=function(){var H=bxe_table_getRowAndColPosition(this);
var J=H["matrix"];
var A=H["row"];
var F=H["col"];
var B=bxe_table_getSpanCount(this.getAttribute("rowspan"));
if(!J[A+B]){alert(bxe_i18n.getText("There's no cell below to be merged"));
return 
}var G=J[A+B][F][1];
if(!G){alert(bxe_i18n.getText("There's no cell below to be merged"));
return 
}var L=bxe_table_getSpanCount(G.getAttribute("colspan"));
var I=bxe_table_getSpanCount(this.getAttribute("colspan"));
if(L!=I){alert(bxe_i18n.getText("Down cell's colspan is different to this cell's colspan, merging not possible"));
return 
}this.setAttribute("rowspan",B+1);
var C=G.firstChild;
while(C){var E=C.nextSibling;
this.appendChild(C);
C=E
}this.normalize();
var K=G.parentNode;
K.removeChild(G);
if(K.XMLNode.isWhitespaceOnly){K.parentNode.removeChild(K);
var C=this.parentNode.firstChild;
while(C){var E=C.nextSibling;
if(C.nodeType==1){var D=bxe_table_getSpanCount(C.getAttribute("rowspan"));
if(D>1){C.setAttribute("rowspan",D-1)
}}C=E
}}return this.parentNode.parentNode
};
Element.prototype.TableCellSplitRight=function(){var B=bxe_splitAtSelection(this);
var C=parseInt(B.getAttribute("colspan"));
if(C>1){B.setAttribute("colspan",C-1)
}else{B.removeAttribute("colspan")
}var A=B.nextSibling;
while(A&&A.nodeType!=1){A=A.nextSibling
}if(A){A.setAttribute("colspan","1");
A.betterNormalize();
if(!A.firstChild||A.firstChild.isWhitespaceOnly){A.init();
A.XMLNode.makeDefaultNodes()
}}return B.parentNode.parentNode
};
Element.prototype.TableCellSplitDown=function(){var I=this.findPosition();
var E=bxe_table_getRowAndColPosition(this);
var J=E["matrix"];
var A=E["row"];
var B=E["col"];
var H=this.parentNode;
var F=bxe_splitAtSelection(this);
var C=bxe_table_getSpanCount(F.getAttribute("rowspan"));
if(C>1){F.setAttribute("rowspan",C-1)
}else{F.removeAttribute("rowspan")
}if(F.nextSibling){var D=F.nextSibling
}while(D&&D.nodeType!=1){D=D.nextSibling
}if(D){D.setAttribute("rowspan","1");
D.betterNormalize();
if(!D.firstChild||D.firstChild.isWhitespaceOnly){D.init();
D.XMLNode.makeDefaultNodes()
}}var K=J[A+C-1][B+1];
if(K){K=K[1]
}if(K){K.parentNode.insertBefore(D,K)
}else{var G=J[A+C-1][1][1].parentNode;
G.appendChild(D)
}return F.parentNode.parentNode
};
Element.prototype.findCellPosition=function(D){var A=this.firstChild;
var C=1;
while(A){if(A.nodeType==1&&(A.XMLNode.vdom.bxeTabletype=="table-cell"||A.XMLNode.vdom.bxeTabletype=="table-col")){if(C>=D){return A
}var B=parseInt(A.getAttribute("colspan"));
if(B>0){C+=parseInt(B)
}else{C++
}}A=A.nextSibling
}};
var mouseX=0;
var mouseY=0;
function bxe_table_insert(B){var A="";
BX_popup_start("Create Table",0,90);
if(BX_range){A="<form action=\"javascript:bxe_table_newtable('"+B+"');\" id='bxe_tabelle' name='tabelle'><table class=\"usual\"><tr>";
A+="<td >"+bxe_i18n.getText("Columns")+'</td><td ><input value=\'5\' size="3" name="cols" /></td>\n';
A+="</tr><tr>\n";
A+="<td>"+bxe_i18n.getText("Rows")+'</td><td ><input value=\'5\' size="3" name="rows" /></td>\n';
A+="</tr><tr>\n";
A+="<td colspan='2' align='right'>\n";
A+="<input type='submit' class=\"usual\" value='"+bxe_i18n.getText("create")+"' /> </td>";
A+="</tr></table></form>";
BX_popup_addHtml(A)
}else{A="<span class='usual'>"+bxe_i18n.getText("Nothing selected, please select the point, where you want the table inserted")+"</span>";
BX_popup_addHtml(A)
}BX_removeEvents();
BX_popup_show()
}function bxe_table_InsertTableOnNew(A){return bxe_InsertTableCallback(A)
}function bxe_table_InsertRowOnNew(A){alert("bxe_table_InsertRowOnNew is deprecated!");
var B=bxe_config.doc.createElement("td");
B=A._node.appendChild(B);
bxe_table_insert_row(B);
bxe_table_delete_row(B)
}function bxe_table_InsertCellOnNew(C){var F=C._node;
var D=F.parentNode;
var A=null;
var E;
for(var B=0;
B<D.childNodes.length;
B++){if(D.childNodes[B].XMLNode&&D.childNodes[B].XMLNode.vdom&&(D.childNodes[B].XMLNode.vdom.bxeTabletype=="table-cell"||D.childNodes[B].XMLNode.vdom.bxeTabletype=="table-col")){if(D.childNodes[B]==F){E=B;
break
}}}A=D.childNodes[E-1];
D.removeChild(F);
if(A){bxe_table_insert_col(A)
}}function bxe_table_createTableFinish(F,A,D){if((/\D+/.test(A))||(/\D+/.test(D))||(A==0)||(D==0)){return null
}var E=F.XMLNode.allowedChildren;
if(E.length>=1){var B=false;
for(var C in E){if(!(E[C].optional)){if(E[C].vdom.bxeTabletype=="table-colgroup"){bxe_table_createTableFinishInitRows(F,E[C],1,D)
}else{if(E[C].vdom.bxeTabletype=="table-row"){bxe_table_createTableFinishInitRows(F,E[C],A,D)
}else{eDOMEventCall("appendChildNode",document,{"noTransform":true,"appendToNode":F.XMLNode,"localName":E[C].localName,"namespaceURI":E[C].namespaceURI})
}}B=true
}}if(!B){bxe_context_menu.buildElementChooserPopup(this,E)
}else{ret=this
}}F.XMLNode.parentNode.isNodeValid(true,2,true);
return F
}function bxe_table_createTableFinishInitRows(H,G,A,E){for(var D=0;
D<A;
D++){var C=bxe_config.doc.createElementNS(G.namespaceURI,G.localName);
H.appendChild(C);
C.XMLNode=C.getXMLNode();
C.XMLNode.isNodeValid(true,2);
C.appendChild(document.createTextNode("\n"));
for(var B=0;
B<E;
B++){C.appendChild(document.createTextNode("  "));
var F=C.createNewTableCell();
C.appendChild(F);
C.appendChild(document.createTextNode("\n"))
}H.appendChild(document.createTextNode("\n"));
C.XMLNode.isNodeValid(true,2,true)
}}function bxe_table_newtable(A){alert("bxe_table_newtable. this part is commented out. please report if still needed")
}function bxe_table_insert_row_or_col(B){if(BX_popup.style.visibility=="visible"){if(document.getElementById("bxe_tabelle").ch[0].checked){bxe_table_insert_row()
}else{bxe_table_insert_col()
}BX_popup.style.visibility="hidden";
BX_addEvents();
return 
}if(!(BX_range)){alert(bxe_i18n.getText("Nothing selected, please select a table cell"));
return 
}if(BX_range.startContainer.parentNode.XMLNode.vdom.bxeTabletype=="table-cell"||BX_range.startContainer.parentNode.XMLNode.vdom.bxeTabletype=="table-col"){alert(bxe_i18n.getText("No table-cell (but {0}) selected, please choose one",new Array(BX_range.startContainer.parentNode.nodeName)));
return 
}BX_popup_start("Add Row or Col",110,90);
var A="";
A+="<form action='javascript:bxe_table_insert_row_or_col();' id='bxe_tabelle' name='tabelle'><table class=\"usual\"><tr>";
A+="<td ><input name='ch' type='radio' value='row' checked='checked' /></td><td >"+bxe_i18n.getText("add row")+"</td>\n";
A+="</tr><tr><td ><input name='ch' type='radio' value='col' /></td><td >"+bxe_i18n.getText("add col")+"</td>\n";
A+="</tr><tr><td colspan='2'><input type='submit' class=\"usual\" value='"+bxe_i18n.getText("add")+"' /> </td>";
A+="</tr></table></form>";
BX_popup_addHtml(A);
BX_popup_show();
BX_popup.style.top=BX_popup.offsetTop-1+"px"
}function bxe_table_insert_row(K){var E=bxe_table_getRowAndColPosition(K);
var J=E["matrix"];
var A=E["row"];
var D=E["col"];
var L=bxe_createInitialTableMatrix(J[0][0][0]-0+1,J[0][0][1]);
var G=0;
var F=0;
var C=1;
var B=1;
for(var H=1;
H<=J[0][0][0];
H++){F++;
G=0;
for(var I=1;
I<=J[0][0][1];
I++){G++;
C=0;
if(J[H][I][0]>0&&J[H][I][0]<3){if((J[H][I][1].getAttribute("rowspan")-1+H)>A&&H<=A){C=bxe_table_getSpanCount(J[H][I][1].getAttribute("rowspan"))
}}L[F][G][0]=J[H][I][0];
L[F][G][1]=J[H][I][1];
L[F][G][2]=J[H][I][2];
L[F][G][3]=J[H][I][3];
if(C){L[F][G][0]=2;
L[F][G][1].setAttribute("rowspan",C+1)
}if(H==A){L[F+1][G][0]=1;
L[F+1][G][1]=K.parentNode.createNewTableCell();
if(C){L[F+1][G][0]=3;
L[F+1][G][1]=false
}if(H+1<=J[0][0][0]){if(J[H][I][0]==3&&J[H+1][I][0]==3){L[F+1][G][0]=3;
L[F+1][G][1]=false
}}}}if(H==A){F++
}}return bxe_rebuildTableByTableMatrix(K,L)
}function bxe_table_delete_row(M){var F=bxe_table_getRowAndColPosition(M);
var L=F["matrix"];
if(L[0][0][0]==1){alert("Last row, deletion not possible");
return L
}if(L[0][0][0]==2&&L[1][1][1].parentNode.localName!=L[2][1][1].parentNode.localName){alert("Last row, deletion not possible");
return L
}var A=F["row"];
var E=F["col"];
var O=bxe_createInitialTableMatrix(L[0][0][0]-1,L[0][0][1]);
var H=0;
var G=0;
var D=1;
var B=1;
for(var J=1;
J<=L[0][0][0];
J++){G++;
H=0;
for(var K=1;
K<=L[0][0][1];
K++){H++;
D=0;
if(L[J][K][0]>0&&L[J][K][0]<3){if((bxe_table_getSpanCount(L[J][K][1].getAttribute("rowspan"))-1+J)>=A&&J<A){D=bxe_table_getSpanCount(L[J][K][1].getAttribute("rowspan"))
}}if(J==A){var C=0;
var I=0;
if(L[J][K][0]>0&&L[J][K][0]<3){C=bxe_table_getSpanCount(L[J][K][1].getAttribute("rowspan"));
I=bxe_table_getSpanCount(L[J][K][1].getAttribute("colspan"))
}if(C>1||I>1){for(var P=0;
P<C;
P++){for(var N=0;
N<I;
N++){L[G+P][H+N][0]=1;
L[G+P][H+N][1]=M.parentNode.createNewTableCell()
}}}if(J<L[0][0][0]){O[G][H][0]=L[J+1][K][0];
O[G][H][1]=L[J+1][K][1];
O[G][H][2]=L[J+1][K][2];
O[G][H][3]=L[J+1][K][3]
}}else{O[G][H][0]=L[J][K][0];
O[G][H][1]=L[J][K][1];
O[G][H][2]=L[J][K][2];
O[G][H][3]=L[J][K][3];
if(D){O[G][H][0]=2;
O[G][H][1].setAttribute("rowspan",D-1)
}}}if(J==A){J++
}}return bxe_rebuildTableByTableMatrix(M,O)
}function bxe_table_insert_col(K){var E=bxe_table_getRowAndColPosition(K);
var J=E["matrix"];
var A=E["row"];
var D=E["col"];
var L=bxe_createInitialTableMatrix(J[0][0][0],J[0][0][1]-0+1);
var G=0;
var F=0;
var C=1;
var B=1;
for(var H=1;
H<=J[0][0][0];
H++){F++;
G=0;
for(var I=1;
I<=J[0][0][1];
I++){G++;
B=0;
if(J[H][I][0]>0&&J[H][I][0]<3){if((J[H][I][1].getAttribute("colspan")-1+I)>D&&I<=D){B=bxe_table_getSpanCount(J[H][I][1].getAttribute("colspan"))
}}L[F][G][0]=J[H][I][0];
L[F][G][1]=J[H][I][1];
L[F][G][2]=J[H][I][2];
L[F][G][3]=J[H][I][3];
if(B){L[F][G][0]=2;
L[F][G][1].setAttribute("colspan",B+1)
}if(I==D){G++;
L[F][G][0]=1;
L[F][G][1]=L[F][1][1].parentNode.createNewTableCell();
if(B){L[F][G][0]=3;
L[F][G][1]=false
}if(I+1<=J[0][0][1]){if(J[H][I][0]==3&&J[H][I+1][0]==3){L[F][G][0]=3;
L[F][G][1]=false
}}}}}return bxe_rebuildTableByTableMatrix(K,L)
}function bxe_table_delete_col(M){var F=bxe_table_getRowAndColPosition(M);
var L=F["matrix"];
if(L[0][0][1]==1){alert("Last col, deletion not possible");
return L
}var A=F["row"];
var E=F["col"];
var O=bxe_createInitialTableMatrix(L[0][0][0],L[0][0][1]-0-1);
var H=0;
var G=0;
var D=1;
var B=1;
for(var J=1;
J<=L[0][0][0];
J++){G++;
H=0;
for(var K=1;
K<=L[0][0][1];
K++){H++;
B=0;
if(L[J][K][0]>0&&L[J][K][0]<3){if((bxe_table_getSpanCount(L[J][K][1].getAttribute("colspan"))-1+K)>=E&&K<E){B=bxe_table_getSpanCount(L[J][K][1].getAttribute("colspan"))
}}if(K==E){var C=0;
var I=0;
if(L[J][K][0]>0&&L[J][K][0]<3){C=bxe_table_getSpanCount(L[J][K][1].getAttribute("rowspan"));
I=bxe_table_getSpanCount(L[J][K][1].getAttribute("colspan"))
}if(C>1||I>1){for(var P=0;
P<C;
P++){for(var N=0;
N<I;
N++){L[G+P][H+N][0]=1;
L[G+P][H+N][1]=M.parentNode.createNewTableCell()
}}}if(K<L[0][0][1]){K++;
O[G][H][0]=L[J][K][0];
O[G][H][1]=L[J][K][1];
O[G][H][2]=L[J][K][2];
O[G][H][3]=L[J][K][3]
}}else{O[G][H][0]=L[J][K][0];
O[G][H][1]=L[J][K][1];
O[G][H][2]=L[J][K][2];
O[G][H][3]=L[J][K][3];
if(B){O[G][H][0]=2;
O[G][H][1].setAttribute("colspan",B-1)
}}}}return bxe_rebuildTableByTableMatrix(M,O)
}function bxe_table_getRowAndColPosition(H){var K=H.parentNode;
var D=K.parentNode;
var J=D;
var G=bxe_createTableMatrix(H);
var B=0;
var A=0;
var I=0;
for(var C=0;
C<D.childNodes.length;
C++){if(!(D.childNodes[C].XMLNode&&D.childNodes[C].XMLNode.vdom&&(D.childNodes[C].XMLNode.vdom.bxeTabletype=="table-row"||D.childNodes[C].XMLNode.vdom.bxeTabletype=="table-colgroup"))){continue
}I++;
if(D.childNodes[C]==K){A=I;
break
}}var E=G[A];
for(var C=1;
C<E.length;
C++){if(H==E[C][1]){B=C;
break
}}if(B==0){alert(bxe_i18n.getText("ERROR: could not find the cell in matrix!"));
alert(bxe_i18n.getText("rowPos: {0}",new Array(A)));
return false
}var F=new Array();
F["row"]=A;
F["col"]=B;
F["matrix"]=G;
return F
}function bxe_createInitialTableMatrix(C,D){var B=new Array(C+1);
for(var A=0;
A<=C;
A++){B[A]=new Array(D+1);
for(var E=0;
E<=D;
E++){B[A][E]=new Array(4);
B[A][E][0]=0;
B[A][E][1]=false;
B[A][E][2]=0;
B[A][E][3]=0
}}B[0][0]=new Array(2);
B[0][0][0]=C;
B[0][0][1]=D;
return B
}function bxe_table_getTableRowInfo(B,E){var D=B.XMLNode.allowedChildren;
if(typeof E!="undefined"&&E.XMLNode.vdom.bxeTabletype=="table-col"){var A="table-colgroup"
}else{var A="table-row"
}for(var C=0;
C<D.length;
C++){if(D[C].vdom.bxeTabletype==A){return D[C]
}}return null
}function bxe_rebuildTableByTableMatrix(D,J){var G=D.parentNode.parentNode;
var K=G;
while(G.childNodes.length){G.removeChild(G.childNodes[0])
}var E=bxe_table_getTableRowInfo(G,J[1][1][1]);
var B=bxe_table_getTableRowInfo(G);
for(var A=1;
A<=J[0][0][0];
A++){if(A==1){var C=bxe_config.doc.createElementNS(E.namespaceURI,E.localName)
}else{var C=bxe_config.doc.createElementNS(B.namespaceURI,B.localName)
}if(J[A][1][1].parentNode){var F=J[A][1][1].parentNode.attributes;
for(var I=0;
I<F.length;
I++){C.setAttributeNS(F[I].namespaceURI,F[I].localName,F[I].value)
}}G.appendChild(C);
for(var H=1;
H<=J[0][0][1];
H++){if(J[A][H][0]==1||J[A][H][0]==2){if(J[A][H][1]==false){alert(bxe_i18n.getText("no cell node at r={0} c={1}",new Array(A,H)))
}else{C.appendChild(J[A][H][1])
}}}}K.XMLNode.isNodeValid(true,2,true);
bxe_history_snapshot_async();
return K
}function bxe_table_getDimensions(A){var C=0;
var E=0;
var F=null;
for(var B=0;
B<A.childNodes.length;
B++){row=A.childNodes[B];
if(!(row.XMLNode&&row.XMLNode.vdom&&(row.XMLNode.vdom.bxeTabletype=="table-row"||row.XMLNode.vdom.bxeTabletype=="table-colgroup"))){continue
}if(!F){F=row
}C+=bxe_table_getSpanCount(row.getAttribute("rowspan"))
}var G="";
for(var B=0;
B<F.childNodes.length;
B++){cell=F.childNodes[B];
if(!(cell.XMLNode&&cell.XMLNode.vdom&&(cell.XMLNode.vdom.bxeTabletype=="table-cell"||cell.XMLNode.vdom.bxeTabletype=="table-col"))){continue
}E+=bxe_table_getSpanCount(cell.getAttribute("colspan"))
}var D=new Array();
D["rows"]=C;
D["cols"]=E;
return D
}function bxe_createTableMatrix(B){var A=B.parentNode.parentNode;
if(A.XMLNode.vdom.bxeTabletype!="table"){alert(bxe_i18n.getText("got no table body!"))
}return bxe_createTableMatrixFromTable(A)
}function bxe_createTableMatrixFromTable(C){var D=bxe_table_getDimensions(C);
var H=D["cols"];
var K=D["rows"];
var J=bxe_createInitialTableMatrix(K,H);
var F=0;
var B=0;
for(var A=0;
A<C.childNodes.length;
A++){row=C.childNodes[A];
debug("hhh "+F+"\n");
if(!(row.XMLNode&&row.XMLNode.vdom&&(row.XMLNode.vdom.bxeTabletype=="table-row"||row.XMLNode.vdom.bxeTabletype=="table-colgroup"))){continue
}F++;
B=0;
for(var E=0;
E<row.childNodes.length;
E++){cell=row.childNodes[E];
if(!(cell.XMLNode&&cell.XMLNode.vdom&&(cell.XMLNode.vdom.bxeTabletype=="table-cell"||cell.XMLNode.vdom.bxeTabletype=="table-col"))){continue
}B++;
if(!J[F][B]){continue
}while(J[F][B][0]>0){B++
}colspan=bxe_table_getSpanCount(cell.getAttribute("colspan"));
rowspan=bxe_table_getSpanCount(cell.getAttribute("rowspan"));
for(var I=0;
I<colspan;
I++){for(var G=0;
G<rowspan;
G++){J[F+G][B+I][0]=3;
J[F+G][B+I][1]=false;
J[F+G][B+I][2]=F;
J[F+G][B+I][3]=B
}}if(J[F][B][0]==3&&(colspan>1||rowspan>1)){J[F][B][0]=2
}else{J[F][B][0]=1
}J[F][B][1]=cell;
J[F][B][2]=F;
J[F][B][3]=B
}}return J
}function bxe_table_getSpanCount(A){A=parseInt(A);
if(!A&&A!=0){A=1
}return A
}Element.prototype.createNewTableCell=function(){var C=this.XMLNode.allowedChildren;
if(this.XMLNode.vdom.bxeTabletype=="table-row"){var A="table-cell"
}else{var A="table-col"
}for(var B=0;
B<C.length;
B++){if(C[B].vdom.bxeTabletype==A){var E=bxe_config.doc.createElementNS(C[B].namespaceURI,C[B].localName);
break
}}var D=bxe_config.doc.createTextNode("#");
if(!E){alert("no newCell in "+this.XMLNode.localName)
}E.appendChild(D);
return E
};
const DAV_RESOURCE_DEPTH="0";
const DAV_CHILDREN_DEPTH="1";
const DAV_INFINITY_DEPTH="infinity";
const DAV_TIMETYPE_SECOND="Second-";
const DAV_TIMETYPE_INFINITE="Infinite";
const DAV_TIMETYPE_EXTEND="Extend";
const DAV_SHARED_LOCKSCOPE="shared";
const DAV_EXCLUSIVE_LOCKSCOPE="exclusive";
const DAV_WRITE_LOCKTYPE="write";
const xml_decl='<?xml version="1.0" encoding="utf-8" ?>\n';
var statusCodes=new Array();
statusCodes[102]="Processing";
statusCodes[207]="Multi-Status";
statusCodes[422]="Unprocessable Entity";
statusCodes[423]="Locked";
statusCodes[424]="Failed Dependency";
statusCodes[507]="Insufficient Storage";
function serialize(A){var B=new XMLSerializer();
var D=document.implementation.createDocument("DAV:","dummy",null);
var C=D.documentElement;
A.createXML(C,D);
return xml_decl+B.serializeToString(C.firstChild)
}function DavClient(){this.request=new XMLHttpRequest();
this.request.overrideMimeType("text/xml")
}DavClient.prototype.__defineGetter__("responseObjects",function(){if(this.request.responseXML){status=new DavMultiStatus();
status.parseXML(this.request.responseXML.documentElement);
return status
}});
DavClient.prototype.PROPFIND=function(A,B,C){if(!A){throw new Error("You must supply a URL.")
}this.request.open("PROPFIND",A);
this.request.setRequestHeader("Content-type","text/xml");
if(!C){C=0
}this.request.setRequestHeader("Depth",this.createDepthHeader(C));
if(!B){this.request.send("")
}else{this.request.send(serialize(B))
}return 
};
DavClient.prototype.PROPPATCH=function(A,B){if(!A){throw new Error("You must supply a URL.")
}this.request.open("PROPPATCH",A);
this.request.setRequestHeader("Content-type","text/xml");
this.request.send(serialize(B))
};
DavClient.prototype.MKCOL=function(A){if(!A){throw new Error("You must supply a URL.")
}this.request.open("MKCOL",A);
this.request.setRequestHeader("Content-type","text/xml");
this.request.send("")
};
DavClient.prototype.GET=function(A){if(!A){throw new Error("You must supply a URL.")
}this.request.open("GET",A);
this.request.setRequestHeader("Content-type","text/xml");
this.request.send("")
};
DavClient.prototype.HEAD=function(A){if(!A){throw new Error("You must supply a URL.")
}this.request.open("HEAD",A);
this.request.setRequestHeader("Content-type","text/xml");
this.request.send("")
};
DavClient.prototype.OPTIONS=function(A){if(!A){throw new Error("You must supply a URL.")
}this.request.open("OPTIONS",A);
this.request.send("")
};
DavClient.prototype.POST=function(A,B,C){if(!A){throw new Error("You must supply a URL.")
}};
DavClient.prototype.DELETE=function(A){if(!A){throw new Error("You must supply a URL.")
}this.request.open("DELETE",A);
this.request.setRequestHeader("Content-type","text/xml");
this.request.send("")
};
DavClient.prototype.PUT=function(A,B){if(!A){throw new Error("You must supply a URL.")
}this.request.open("PUT",A);
this.request.setRequestHeader("Content-type","text/xml");
this.request.send(B)
};
DavClient.prototype.COPY=function(C,B,D,E,A){if(!C){throw new Error("You must supply a URL.")
}this.request.open("COPY",C);
this.request.setRequestHeader("Content-type","text/plain");
this.request.setRequestHeader("Destination",this.createDestinationHeader(B));
if(!A){this.request.setRequestHeader("Overwrite",this.createOverwriteHeader(A))
}if(!E){this.request.setRequestHeader("Depth",this.createDepthHeader(E))
}if(!D){this.request.send("")
}else{this.request.send(D.createXML())
}};
DavClient.prototype.MOVE=function(C,B,D,E,A){if(!C){throw new Error("You must supply a URL.")
}this.request.open("MOVE",C);
this.request.setRequestHeader("Content-type","text/xml");
this.request.setRequestHeader("Destination",this.createDestinationHeader(B));
if(!A){this.request.setRequestHeader("Overwrite",this.createOverwriteHeader(A))
}if(!E){this.request.setRequestHeader("Depth",this.createDepthHeader(E))
}if(!D){this.request.send("")
}else{this.request.send(D.createXML())
}};
DavClient.prototype.LOCK=function(C,A,D,B,E,F){if(!C){throw new Error("You must supply a URL.")
}this.request.open("LOCK",C);
this.request.setRequestHeader("Content-type","text/xml");
if(!E){this.request.setRequestHeader("Depth",this.createDepthHeader(E))
}this.request.send(A.createXML())
};
DavClient.prototype.UNLOCK=function(A){if(!A){throw new Error("You must supply a URL.")
}this.request.open("UNLOCK",A);
this.request.setRequestHeader("Content-type","text/xml");
this.request.send(lockinfo.createXML())
};
DavClient.prototype.createDAVHeader=function(B){var C="";
for(var A=0;
A<B.length;
A++){C+=B[A];
if(A!=B[length]){C+=","
}}return C
};
DavClient.prototype.createDepthHeader=function(A){return A
};
DavClient.prototype.createDestinationHeader=function(A){return A
};
DavClient.prototype.createIfHeader=function(){};
DavClient.prototype.createLockTokenHeader=function(A){return A
};
DavClient.prototype.createOverwriteHeader=function(A){if(A==true){return"T"
}else{return"F"
}};
DavClient.prototype.handleStatusURIHeader=function(A){};
DavClient.prototype.createTimeoutHeader=function(A,B){return A+"-"+B
};
function DavActiveLock(C,B,F,A,D,E){this.lockscope=C||null;
this.locktype=B||null;
this.depth=F||null;
this.owner=A||null;
this.timeout=D||null;
this.locktoken=E||null
}DavActiveLock.prototype={getLockScope:function(){return this.lockscope
},getLockType:function(){return this.locktype
},getDepth:function(){return this.depth
},getOwner:function(){return this.owner
},getTimeout:function(){return this.timeout
},getLockToken:function(){return this.locktoken
},setLockScope:function(A){this.lockscope=A
},setLockType:function(A){this.locktype=A
},setDepth:function(A){this.depth=A
},setOwner:function(A){this.owner=A
},setTimeout:function(A){this.timeout=A
},setLockToken:function(A){this.locktoken=A
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="lockscope"){this.lockscope=new DavLockScope();
this.lockscope.parseXML(sub)
}if(sub.localName=="locktype"){this.locktype=new DavLockType();
this.locktype.parseXML(sub)
}if(sub.localName=="depth"){this.depth=new DavDepth();
this.depth.parseXML(sub)
}if(sub.localName=="owner"){this.owner=new DavOwner();
this.owner.parseXML(sub)
}if(sub.localName=="timeout"){this.timeout=new DavTimeout();
this.timeout.parseXML(sub)
}if(sub.localName=="locktoken"){this.locktoken=new DavLockToken();
this.locktoken.parseXML(sub)
}}},createXML:function(A,C){var B=C.createElementNS("DAV:","activelock");
A.appendChild(B);
B.appendChild(this.lockscope.createXML(B,C));
B.appendChild(this.locktype.createXML(B,C));
B.appendChild(this.depth.createXML(B,C));
B.appendChild(this.owner.createXML(B,C));
B.appendChild(this.timeout.createXML(B,C));
B.appendChild(this.locktoken.createXML(B,C))
}};
function DavDepth(A){if(!A){A=DAV_RESOURCE_DEPTH
}this.setValue(A)
}DavDepth.prototype={getValue:function(){return this.value
},setValue:function(A){if(A in [DAV_RESOURCE_DEPTH,DAV_CHILDREN_DEPTH,DAV_INFINITY_DEPTH]){this.value=A
}else{throw new DavInvalidDepthValueError(A)
}},parseXML:function(A){this.xmlNode=A;
this.value=A.firstChild.nodeValue
},createXML:function(A,C){var B=C.createElementNS("DAV:","depth");
A.appendChild(B);
B.appendChild(C.createTextNode(this.value))
}};
function DavLockToken(A){if(!A){A=null
}this.setHref(A)
}DavLockToken.prototype={getHref:function(){return this.href
},setHref:function(A){if(typeof A=="object"){this.href=A
}else{throw new DavWrongTypeError("object",typeof A)
}},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="href"){this.href=new DavHref();
this.href.parseXML(sub)
}}},createXML:function(A,C){var B=C.createElementNS("DAV:","locktoken");
A.appendChild(B);
this.href.createXML(B,C)
}};
function DavTimeout(A,B){if(!A){A=DAV_TIMETYPE_SECOND
}this.setTimeout(A,B)
}DavTimeout.prototype={getValue:function(){return this.value
},getType:function(){return this.type
},setTimeout:function(A,B){this.type=A;
if((A==DAV_TIMETYPE_SECOND)&&(typeof B!="number")){B=0
}if(A==DAV_TIMETYPE_INFINITE){B=null
}if((A==DAV_TIMETYPE_EXTEND)&&(typeof B!="string")){B=""
}this.value=B
},parseXML:function(A){this.xmlNode=A;
var B=A.firstChild.nodeValue.split("-");
this.unit=B[0];
this.value=B[1]
},createXML:function(A,C){var B=C.createElementNS("DAV:","timeout");
A.appendChild(B);
value=this.value;
if(value==null){value=""
}B.appendChild(C.createTextNode(this.type+value))
}};
function DavCollection(){}DavCollection.prototype={parseXML:function(A){this.xmlNode=A
},createXML:function(A,C){var B=C.createElementNS("DAV:","collection");
A.appendChild(B)
}};
function DavHref(A){if(!A){A=null
}this.url=A
}DavHref.prototype={getURL:function(){return this.url
},setURL:function(A){this.url=A
},parseXML:function(A){this.xmlNode=A;
this.url=A.firstChild.nodeValue
},createXML:function(A,C){var B=C.createElementNS("DAV:","href");
B.appendChild(C.createTextNode(this.url));
A.appendChild(B)
}};
function DavLink(){this.sources=new Array();
this.destinations=new Array()
}DavLink.prototype={getSources:function(){return this.sources
},addSource:function(A){this.sources[this.sources.length]=A
},getDestinations:function(){return this.sources
},addDestination:function(A){this.destinations[this.destinations.length]=A
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="src"){src=new DavSrc();
src.parseXML(sub);
this.sources[this.sources.length]=src
}if(sub.localName=="dst"){dst=new DavDst();
dst.parseXML(sub);
this.destinations[this.destinations.length]=dst
}}},createXML:function(B,D){var C=D.createElementNS("DAV:","link");
var A;
for(A=0;
A<this.sources.length;
A++){this.sources[A].createXML(C,D)
}for(A=0;
A<this.destinations.length;
A++){this.destinations[A].createXML(C,D)
}B.appendChild(C)
}};
function DavDst(A){if(!A){A=null
}this.url=A
}DavDst.prototype={getURL:function(){return this.url
},setURL:function(A){this.url=A
},parseXML:function(A){this.xmlNode=A;
this.url=A.firstChild.nodeValue
},createXML:function(A,C){var B=C.createElementNS("DAV:","dst");
B.appendChild(C.createTextNode(this.url));
A.appendChild(B)
}};
function DavSrc(A){if(!A){A=null
}this.url=A
}DavSrc.prototype={getURL:function(){return this.url
},setURL:function(A){this.url=A
},parseXML:function(A){this.xmlNode=A;
this.url=A.firstChild.nodeValue
},createXML:function(A,C){var B=C.createElementNS("DAV:","src");
B.appendChild(C.createTextNode(this.url));
A.appendChild(B)
}};
function DavLockEntry(B,A){if(!B){B=new DavLockScope()
}if(!A){A=new DavLockType()
}this.setLockScope(B);
this.setLockType(A)
}DavLockEntry.prototype={getLockScope:function(){return this.lockscope
},getLockType:function(){return this.locktype
},setLockScope:function(A){this.lockscope=A
},setLockType:function(A){this.locktype=A
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="lockscope"){this.lockscope=new DavLockScope();
this.lockscope.parseXML(sub)
}if(sub.localName=="locktype"){this.lockType=new DavLockType();
this.lockType.parseXML(sub)
}}},createXML:function(A,C){var B=C.createElementNS("DAV:","lockentry");
this.lockscope.createXML(B,C);
this.locktype.createXML(B,C);
A.appendChild(B)
}};
function DavLockInfo(C,B,A){this.lockscope=C;
this.locktype=B;
this.owner=A
}DavLockInfo.prototype={getLockScope:function(){return this.lockscope
},getLockType:function(){return this.locktype
},getOwner:function(){return this.owner
},setLockScope:function(A){this.lockscope=A
},setLockType:function(A){this.locktype=A
},setOwner:function(A){this.owner=A
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="lockscope"){this.lockscope=new DavLockScope();
this.lockscope.parseXML(sub)
}if(sub.localName=="locktype"){this.lockType=new DavLockType();
this.lockType.parseXML(sub)
}if(sub.localName=="owner"){this.owner=new DavOwner();
this.owner.parseXML(sub)
}}},createXML:function(){var B=document.implementation.createDocument("DAV:","D:lockinfo",null);
var A=B.documentElement;
A.appendChild(this.lockscope.createXML(A,B));
A.appendChild(this.locktype.createXML(A,B));
A.appendChild(this.owner.createXML(A,B));
return B
}};
function DavLockScope(A){if(!A){A=DAV_SHARED_LOCKSCOPE
}this.setScope(A)
}DavLockScope.prototype={getScope:function(){return this.scope
},isExclusive:function(){return this.scope==DAV_EXCLUSIVE_LOCKSCOPE
},isShared:function(){return this.scope==DAV_SHARED_LOCKSCOPE
},setScope:function(A){if((A==DAV_EXCLUSIVE_LOCKSCOPE)||(A==DAV_SHARED_LOCKSCOPE)){this.scope=A
}else{throw new DavInvalidScopeValueError(A)
}},parseXML:function(A){this.xmlNode=A;
this.scope=A.firstChild.localName
},createXML:function(A,C){var B=C.createElementNS("DAV:","lockscope");
B.appendChild(C.createElementNS("DAV:",this.scope));
A.appendChild(B)
}};
function DavLockType(A){if(!A){A=DAV_WRITE_LOCKTYPE
}this.setType(A)
}DavLockType.prototype={getType:function(){return this.type
},setType:function(A){if(A==DAV_WRITE_LOCKTYPE){this.type=A
}else{DavInvalidLockTypeError(A)
}},isWrite:function(){return this.type==DAV_WRITE_LOCKTYPE
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName!=null){this.type=sub.localName
}}},createXML:function(A,C){var B=C.createElementNS("DAV:","locktype");
B.appendChild(C.createElementNS("DAV:",this.type));
A.appendChild(B)
}};
function DavMultiStatus(){this.responsedescription="";
this.responses=new Array()
}DavMultiStatus.prototype={getDescription:function(){return this.responsedescription
},getResponses:function(){return this.responses
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="responsrdescription"){this.responsedescription=sub.firstChild.nodeValue
}if(sub.localName=="response"){var C=new DavResponse();
C.parseXML(sub);
this.responses[this.responses.length]=C
}}},createXML:function(A,B){}};
function DavResponse(){this.responsedescription="";
this.href=null;
this.propstats=new Array()
}DavResponse.prototype={getDescription:function(){return this.responsedescription
},getHRef:function(){return this.href
},getPropStats:function(){return this.propstats
},parseXML:function(C){this.xmlNode=C;
for(var A=0;
A<C.childNodes.length;
A++){sub=C.childNodes[A];
if(sub.localName=="responsrdescription"){this.responsrdescription=sub.firstChild.nodeValue
}if(sub.localName=="href"){this.href=new DavHref();
this.href.parseXML(sub)
}if(sub.localName=="propstat"){var B=new DavPropStat();
B.parseXML(sub);
this.propstats[this.propstats.length]=B
}}},createXML:function(A,B){}};
function DavPropStat(){this.responsedescription="";
this.status=null;
this.prop=null
}DavPropStat.prototype={getDescription:function(){return this.responsedescription
},getStatus:function(){return this.status
},getProp:function(){return this.prop
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="responsrdescription"){this.responsrdescription=sub.firstChild.nodeValue
}if(sub.localName=="status"){this.status=sub.firstChild.nodeValue
}if(sub.localName=="prop"){this.prop=new DavProp();
this.prop.parseXML(sub)
}}},createXML:function(A,B){}};
function DavOwner(A){this.name=A
}DavOwner.prototype={getName:function(){return this.name
},setName:function(A){this.name=A
},parseXML:function(A){this.xmlNode=A;
this.name=A.firstChild.nodeValue
},createXML:function(A,B){node=B.createElementNS("DAV:","owner");
node.appendChild(B.createTextNode(this.name));
A.appendChild(node)
}};
function DavProp(){this.properties=new Array()
}DavProp.prototype={getProperties:function(){return this.properties
},addProperty:function(A){this.properties[this.properties.length]=A
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName!=null){this.properties[this.properties.length]=sub.localName
}}},createXML:function(B,C){node=C.createElementNS("DAV:","prop");
for(var A=0;
A<this.properties.length;
A++){this.properties[A].createXML(node,C)
}B.appendChild(node)
}};
function Property(B,A,C){this.namespace=B||"DAV:";
this.name=A||null;
this.value=C||null;
this.properties=new Array()
}Property.prototype={getNamespace:function(){return this.namespace
},getName:function(){return this.name
},getValue:function(){return this.value
},getProperties:function(){return this.properties
},addProperty:function(A){this.properties[this.properties.length]=A
},setNamespace:function(A){this.namespace=A
},setName:function(A){this.name=A
},setValue:function(A){this.value=A
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName!=null){this.properties[this.properties.length]=sub.localName
}else{if(sub.nodeValue!=""){this.setValue(sub.nodeValue)
}}}},createXML:function(B,D){var C=D.createElementNS(this.getNamespace(),this.getName());
if(this.getValue()){C.appendChild(D.createTextNode(this.getValue()))
}for(var A=0;
A<this.properties.length;
A++){this.properties[A].createXML(C,D)
}B.appendChild(C)
}};
function DavPropertyBehavior(A){this.rule=A
}DavPropertyBehavior.prototype={getRule:function(){return this.rule
},setRule:function(A){this.rule=A
},getOmit:function(){if(this.rule instanceof Omit){return this.rule
}return null
},getKeepAlive:function(){if(this.rule instanceof KeepAlive){return this.rule
}return null
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="omit"){this.rule=new DavOmit();
this.rule.parseXML(sub)
}if(sub.localName=="keepalive"){this.rule=new DavKeepAlive();
this.rule.parseXML(sub)
}}},createXML:function(A,B){node=B.createElementNS("DAV:","propertybehavior");
this.rule.createXML(node,B);
A.appendChild(node)
},};
function DavKeepAlive(A,B){this.all=A;
this.hrefs=B
}DavKeepAlive.prototype={isKeepingAllAlive:function(){return this.all
},addHref:function(A){this.hrefs[this.hrefs.length]=A
},getHrefs:function(){return this.hrefs
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName!="href"){href=new DavHref();
href.parseXML(sub);
this.hrefs[this.hrefs.length]=href
}if(sub.nodeValue!="*"){this.all=true
}}},createXML:function(B,C){node=C.createElementNS("DAV:","propertybehavior");
for(var A=0;
A<this.hrefs.length;
A++){this.hrefs[A].createXML(node,C)
}if(this.all==true){node.appendChild(C.createTextNode("*"))
}B.appendChild(node)
},};
function DavOmit(){}DavOmit.prototype={parseXML:function(A){this.xmlNode=A
},createXML:function(A,B){node=B.createElementNS("DAV:","omit");
A.appendChild(node)
}};
function DavPropertyUpdate(){this.removes=new Array();
this.sets=new Array()
}DavPropertyUpdate.prototype={getRemoves:function(){return this.removes
},getSets:function(){return this.sets
},setRemove:function(A){this.removes[this.removes.length]=A
},setSet:function(A){this.sets[this.sets.length]=A
},removeProperty:function(A){this.setRemove(new DavRemove(A))
},setProperty:function(A){this.setSet(new DavSet(A))
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="remove"){remove=new DavRemove();
remove.parseXML(set);
this.removes[this.removes.length]=remove
}if(sub.localName=="set"){set=new DavSet();
set.parseXML(set);
this.sets[this.sets.length]=set
}}},createXML:function(B,C){node=C.createElementNS("DAV:","propertyupdate");
for(var A=0;
A<this.removes.length;
A++){this.removes[A].createXML(node,C)
}for(var A=0;
A<this.sets.length;
A++){this.sets[A].createXML(node,C)
}B.appendChild(node)
},};
function DavRemove(A){this.prop=A
}DavRemove.prototype={setProp:function(A){this.prop=A
},getProp:function(){return this.prop
},parseXML:function(A){this.xmlNode=A;
this.prop=new DavProp();
this.prop.parseXML(A.firstChild)
},createXML:function(A,B){node=B.createElementNS("DAV:","remove");
this.prop.createXML(node,B);
A.appendChild(node)
}};
function DavSet(A){this.prop=A
}DavSet.prototype={setProp:function(A){this.prop=A
},getProp:function(){return this.prop
},parseXML:function(A){this.xmlNode=A;
this.prop=new Prop();
this.prop.parseXML(A.firstChild)
},createXML:function(A,B){node=B.createElementNS("DAV:","set");
this.prop.createXML(node,B);
A.appendChild(node)
}};
function DavPropFind(){this.allprop=false;
this.propname=false;
this.props=new DavProp()
}DavPropFind.prototype={addProperty:function(A){if((this.allprop==false)&&(this.propname==false)){this.props.addProperty(A)
}},setAllProp:function(){if((this.props.length==0)&&(this.propname==false)){this.allprop=true
}},setPropName:function(){if((this.props.length==0)&&(this.allprop==false)){this.propname=true
}},createXML:function(A,C){var B=C.createElementNS("DAV:","propfind");
if(this.allprop==true){B.appendChild(C.createElementNS("DAV:","D:allprop"))
}if(this.propname==true){B.appendChild(C.createElementNS("DAV:","D:propname"))
}if(this.props.properties.length>0){this.props.createXML(B,C)
}A.appendChild(B)
},};
function DavCreationDate(A){this.value=A
}DavCreationDate.prototype={getValue:function(){return this.value
},setValue:function(A){this.value=A
},parseXML:function(A){this.xmlNode=A;
this.value=A.firstChild.nodeValue
},createXML:function(A,C){var B=C.createElementNS("DAV:","creationdate");
B.appendChild(C.createTextNode(this.value));
A.appendChild(B)
}};
function DavDisplayName(A){this.value=A
}DavDisplayName.prototype={getValue:function(){return this.value
},setValue:function(A){this.value=A
},parseXML:function(A){this.xmlNode=A;
this.value=A.firstChild.nodeValue
},createXML:function(A,C){var B=C.createElementNS("DAV:","displayname");
B.appendChild(C.createTextNode(this.value));
A.appendChild(B)
}};
function DavGetContentLanguage(A){this.value=A
}DavGetContentLanguage.prototype={getValue:function(){return this.value
},setValue:function(A){this.value=A
},parseXML:function(A){this.xmlNode=A;
this.value=A.firstChild.nodeValue
},createXML:function(A,B){node=B.createElementNS("DAV:","getcontentlanguage");
node.appendChild(B.createTextNode(this.value));
A.appendChild(node)
}};
function DavGetContentLength(A){this.value=A
}DavGetContentLength.prototype={getValue:function(){return this.value
},setValue:function(A){this.value=A
},parseXML:function(A){this.xmlNode=A;
this.value=A.firstChild.nodeValue
},createXML:function(A,B){node=B.createElementNS("DAV:","getcontentlength");
node.appendChild(B.createTextNode(this.value));
A.appendChild(node)
}};
function DavGetContentType(A){this.value=A
}DavGetContentType.prototype={getValue:function(){return this.value
},setValue:function(A){this.value=A
},parseXML:function(A){this.xmlNode=A;
this.value=A.firstChild.nodeValue
},createXML:function(A,B){node=B.createElementNS("DAV:","getcontenttype");
node.appendChild(B.createTextNode(this.value));
A.appendChild(node)
}};
function DavGetEtag(A){this.value=A
}DavGetEtag.prototype={getValue:function(){return this.value
},setValue:function(A){this.value=A
},parseXML:function(A){this.xmlNode=A;
this.value=A.firstChild.nodeValue
},createXML:function(A,B){node=B.createElementNS("DAV:","getetag");
node.appendChild(B.createTextNode(this.value));
A.appendChild(node)
}};
function DavGetLastModified(A){this.value=A
}DavGetLastModified.prototype={getValue:function(){return this.value
},setValue:function(A){this.value=A
},parseXML:function(A){this.xmlNode=A;
this.value=A.firstChild.nodeValue
},createXML:function(A,B){node=B.createElementNS("DAV:","getlastmodified");
node.appendChild(B.createTextNode(this.value));
A.appendChild(node)
}};
function DavLockDiscovery(){this.locks=new Array()
}DavLockDiscovery.prototype={getActiveLocks:function(){return this.locks
},addActiveLock:function(A){this.locks[this.locks.length]=A
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="activelock"){lock=new DavActiveLock();
lock.parseXML(sub);
this.locks[this.locks.length]=lock
}}},createXML:function(B,C){node=C.createElementNS("DAV:","lockdiscovery");
for(var A=0;
A<this.locks.length;
A++){this.locks[A].createXML(node,C)
}B.appendChild(node)
}};
function DavResourceType(A){if(!A){A=""
}this.value=A
}DavResourceType.prototype={getValue:function(){return this.value
},setValue:function(A){this.value=A
},parseXML:function(A){this.xmlNode=A;
this.value=A.firstChild.nodeValue
},createXML:function(A,C){var B=C.createElementNS("DAV:","resourcetype");
B.appendChild(C.createTextNode(this.value));
A.appendChild(B)
}};
function DavSource(){this.links=new Array()
}DavSource.prototype={getLinks:function(){return this.links
},addLink:function(A){this.links[this.links.length]=A
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="link"){link=new DavLink();
link.parseXML(sub);
this.links[this.links.length]=link
}}},createXML:function(B,D){var C=D.createElementNS("DAV:","source");
for(var A=0;
A<this.links.length;
A++){this.links[A].createXML(C,D)
}B.appendChild(C)
}};
function DavSupportedLock(){this.entries=new Array()
}DavSupportedLock.prototype={getEntries:function(){return this.entries
},addEntry:function(A){this.entries[this.entries.length]=A
},parseXML:function(B){this.xmlNode=B;
for(var A=0;
A<B.childNodes.length;
A++){sub=B.childNodes[A];
if(sub.localName=="lockentry"){entry=new DavLockEntry();
entry.parseXML(sub);
this.entries[this.entries.length]=entry
}}},createXML:function(B,D){var C=D.createElementNS("DAV:","supportedlock");
for(var A=0;
A<this.entries.length;
A++){this.entries[A].createXML(C,D)
}B.appendChild(C)
}};
function DavInvalidDepthValueError(A){this.value=A
}DavInvalidDepthValueError.prototype={serialize:function(){return("The value '"+this.value+"' is not a valid depth. Use one of the following values instead: 0, 1, infinity")
}};
function DavWrongTypeError(A,B){this.expected=A;
this.received=B
}DavWrongTypeError.prototype={serialize:function(){return("Expected object type to be ["+this.expected+"], but is ["+this.received+"].")
}};
function DavInvalidScopeValueError(A){this.value=A
}DavInvalidScopeValueError.prototype={serialize:function(){return("The value '"+this.value+"' is not a valid scope. Use one of the following values instead: shared, exclusive")
}};
function DavInvalidLockTypeError(A){this.value=A
}DavInvalidLockTypeError.prototype={serialize:function(){return("The lock type '"+this.value+"' is not valid. Use one of the following values instead: write")
}};
function mozileTransportDriver_webdav(){this.p=new DavClient()
}mozileTransportDriver_webdav.prototype.load=function(A,B){this.p.request.td=B;
bxe_config.td=B;
this.p.request.onload=this.loadCallback;
this.p.GET(A)
};
mozileTransportDriver_webdav.prototype.save=function(A,B,C){this.p.request.td=C;
this.p.request.onload=this.saveCallback;
this.p.PUT(A,B)
};
mozileTransportDriver_webdav.prototype.loadCallback=function(C){var B=C.currentTarget;
var D=B.td;
if(!D){D=bxe_config.td
}var A=new Object();
if(!B.responseXML){A=D.container.parseResponseText(B.responseText)
}else{if(B.responseXML.getElementsByTagNameNS("http://www.mozilla.org/newlayout/xml/parsererror.xml","parsererror").length==0){A.document=B.responseXML;
A.isError=false;
A.status=200;
A.statusText="OK"
}else{if(B.responseXML){A=D.container.parseResponseXML(B.responseXML)
}else{A=D.container.parseResponseText(B.responseText)
}}}D.loadCallback(A)
};
mozileTransportDriver_webdav.prototype.saveCallback=function(C){var B=C.currentTarget;
var D=B.td;
var A=new Object();
if(B.status==204){A.document=B.responseXML;
A.isError=false;
A.status=200;
A.statusText="OK"
}else{if(B.status==201){A.document=B.responseXML;
A.isError=false;
A.status=201;
A.statusText="Created"
}else{if(B.responseXML){A=D.container.parseResponseXML(B.responseXML,B.status)
}else{A=D.container.parseResponseText(B.responseText,B.status)
}}}A.originalStatus=B.status;
A.originalStatusTest=B.statusText;
D.saveCallback(A)
};
mozileTransportDriver_webdav.prototype.parseResponseXML=function(F,A){var D=new Object();
var E=F.getElementsByTagNameNS("http://www.mozilla.org/newlayout/xml/parsererror.xml","parsererror")[0];
if(E){alerttext=E.firstChild.data;
var C=E.getElementsByTagName("sourcetext")[0];
if(C){alerttext+="\n"+C.firstChild.data
}alerttext+=G
}else{alerttext="Something went wrong:\n\n"+A+"\n\n";
var B=new XMLSerializer;
var G=B.serializeToString(F.documentElement);
alerttext+=G
}D.isError=true;
D.statusText=alerttext;
D.document=F;
if(A===0){D.status=400
}else{D.status=A
}return D
};
mozileTransportDriver_webdav.prototype.parseResponseText=function(C,A){var B=new Object();
alerttext="Something went wrong:\n\n";
alerttext+=C;
B.isError=true;
B.statusText=alerttext;
if(A===0){B.status=400
}else{B.status=A
}return B
};
bxe_registerKeyHandlers();
function keyPressHandler(A){var B=false;
if(A.ctrlKey||A.metaKey){B=ctrlKeyPressHandler(A)
}else{B=nonctrlKeyPressHandler(A)
}if(B){A.stopPropagation();
A.returnValue=false;
A.preventDefault();
return false
}return true
}function ctrlKeyPressHandler(A){var C;
if(!A.charCode){return false
}if(String.fromCharCode(A.charCode).toLowerCase()=="v"){if(A.target.localName=="TEXTAREA"){return false
}return window.getSelection().paste(true)
}else{if(String.fromCharCode(A.charCode)=="T"){bxe_Transform();
return true
}else{if(String.fromCharCode(A.charCode)==" "||String.fromCharCode(A.charCode)=="b"){if(BxeClipboardPasteDialog){BxeTextClipboard_OpenDialog(A);
return true
}}else{if(String.fromCharCode(A.charCode).toLowerCase()=="x"){if(A.target.localName=="TEXTAREA"){return false
}return window.getSelection().cut(true)
}else{if(String.fromCharCode(A.charCode)=="c"){if(A.target.localName=="TEXTAREA"){return false
}return window.getSelection().copy(true)
}else{if(String.fromCharCode(A.charCode)=="C"){var B=window.getSelection();
B.collapse(document.body.firstChild,0);
return true
}else{if(String.fromCharCode(A.charCode).toLowerCase()=="s"){eDOMEventCall("DocumentSave",document);
return true
}else{if(String.fromCharCode(A.charCode)=="z"){bxe_history_undo();
return true
}else{if(String.fromCharCode(A.charCode)=="y"){bxe_history_redo();
return true
}}}}}}}}}return false
}function nonctrlKeyPressHandler(U){var S=window.getSelection();
var J;
var B;
var I;
if(U.target.localName=="TEXTAREA"){return false
}if((U.keyCode==8)||(U.keyCode==46)){try{return bxe_deleteEventKey(S,(U.keyCode==46))
}catch(V){bxe_dump(V+"\n");
return true
}}if(U.keyCode==37&&!U.shiftKey){B=S.getEditableRange();
if(!B){return false
}if(!B.collapsed){B.collapse(true)
}J=documentCreateInsertionPoint(B.top,B.startContainer,B.startOffset);
J.backOne();
B.selectInsertionPoint(J);
S.removeAllRanges();
I=B.cloneRange();
S.addRange(I);
bxe_delayedUpdateXPath();
return true
}if(U.keyCode==39&&!U.shiftKey){B=S.getEditableRange();
if(!B){return false
}if(!B.collapsed){B.collapse(false)
}var F=B.top;
J=documentCreateInsertionPoint(F,B.startContainer,B.startOffset);
J.forwardOne();
B.setEnd(J.ipNode,J.ipOffset);
B.collapse(false);
S.removeAllRanges();
I=B.cloneRange();
S.addRange(I);
bxe_delayedUpdateXPath();
return true
}if(U.keyCode==38||U.keyCode==40){bxe_delayedUpdateXPath();
return false
}if(U.keyCode==13){B=S.getEditableRange();
if(!B){return false
}if(!B.startContainer.parentNode.XMLNode||B.startContainer.parentNode.XMLNode.vdom.bxeNoteditable){return false
}var N=B.startContainer.parentNode.XMLNode;
if(N.vdom.bxeNextelement){if(!B.collapsed){bxe_deleteWholeSelection(S,false)
}S.removeAllRanges();
J=documentCreateInsertionPoint(B.top,B.startContainer,B.startOffset);
if(B.top._SourceMode){J.insertCharacter(10)
}else{td=false;
var K=J.line.container;
if(K==J.line.tableCellAncestor){td=true
}var R=J.ipNode.parentNode;
if(U.shiftKey){if(R.XMLNode.isAllowedChild(XHTMLNS,"br")){var T=J.ipNode.splitText(J.ipOffset);
J.ipNode.parentNode.insertBefore(documentCreateXHTMLElement("br"),T);
J.forwardOne();
R.updateXMLNode()
}}else{var M=0;
var Q=B.startContainer;
while(Q){Q=Q.previousSibling;
M++
}Q=N._node.childNodes[M-1];
if(Q.data.replace(/[\s\n\t\r]*$/,"").length<=B.startOffset){if(N.vdom.bxeNextelement){eDOMEventCall("appendNode",document,{"appendToNode":N,"localName":N.vdom.bxeNextelement,"namespaceURI":N.vdom.bxeNextelementNS})
}else{eDOMEventCall("appendNode",document,{"appendToNode":N,"localName":N.localName,"namespaceURI":N.namespaceURI})
}}else{Q.splitText(B.startOffset);
N._node.split(M);
N._node.nextSibling.removeAttribute("__bxe_id");
var D=N._node.nextSibling.setBxeId();
bxe_Transform(D,0,N.parentNode)
}}bxe_history_snapshot_async()
}bxe_delayedUpdateXPath()
}return true
}if(U.keyCode==U.DOM_VK_TAB){B=S.getEditableRange();
if(!B){return false
}bxe_goToNextNode(B,U.shiftKey);
return true
}if(U.keyCode==U.DOM_VK_HOME){var B=S.getEditableRange();
if(!B){return false
}var E=B.lines[0].firstInsertionPoint;
S.collapse(E.ipNode,E.ipOffset);
return true
}if(U.keyCode==U.DOM_VK_END){var B=S.getEditableRange();
if(!B){return false
}var L=B.lines[0].lastInsertionPoint;
S.collapse(L.ipNode,L.ipOffset);
return true
}if(U.charCode){B=S.getRangeAt(0);
if(!B){return false
}var O=B.startContainer.parentNode;
if(!B.collapsed){bxe_deleteEventKey(S,false,false,true);
S=window.getSelection();
try{B=S.getRangeAt(0);
var H=S.anchorNode.parentNode;
if(H.getAttribute("__bxe_defaultcontent")=="true"){H.removeAttribute("__bxe_defaultcontent");
H.firstChild.nodeValue=" ";
H.XMLNode._node.firstChild.nodeValue=" ";
H.XMLNode._node.removeAttribute("__bxe_defaultcontent");
S=window.getSelection();
S.collapse(H.firstChild,0);
B=S.getRangeAt(0);
O=B.startContainer.parentNode
}O=B.startContainer.parentNode
}catch(V){}}var N=bxe_getXMLNodeByHTMLNodeRecursive(O);
if(!N.XMLNode.canHaveText){return false
}var G=B.startContainer;
var P=B.startOffset;
if(G.nodeType==1&&G.firstChild.nodeType==3){G=G.firstChild;
P=0
}var A=String.fromCharCode(U.charCode);
if(P>0){if(G.substringData&&G.substringData(P-1,1)==STRING_NBSP){G.replaceData(P-1,1," ")
}}if(U.charCode==CHARCODE_SPACE){G.insertData(P,STRING_NBSP)
}else{G.insertData(P,A)
}S.collapse(G,P+1);
if(N.nodeType==2){N.value=O.getContent()
}else{var C=bxe_getChildPosition(G);
var Q=N.childNodes[C];
if(!Q){return false
}try{Q.insertData(P,A)
}catch(V){try{Q.parentNode.betterNormalize();
Q.insertData(P,A)
}catch(V){}}}return true
}return false
}function bxe_deleteWholeSelection(B,A){bxe_history_snapshot();
var E=B.focusNode;
var D=B.focusOffset;
B.collapse(B.anchorNode,1);
try{B.extend(E,D);
B.deleteSelection(A)
}catch(C){}}function bxe_deleteEventKey(F,B,H,C){if(F.isCollapsed){F.deleteSelection(B);
return true
}F.fixFocus();
if(F.anchorOffset>=F.anchorNode.nodeValue.strip().length){var A=F.focusOffset;
F.collapse(F.focusNode,0);
F.extend(F.focusNode,A)
}if(F.anchorNode.nodeType==3&&F.anchorOffset==0){if(F.anchorNode==F.focusNode){if(F.focusOffset>=F.anchorNode.nodeValue.strip().length){var E=bxe_getXMLNodeByHTMLNodeRecursive(F.anchorNode);
var D=bxe_getXMLNodeByHTMLNodeRecursive(F.anchorNode.parentNode);
if(D){if(D.nodeType==2){if(D.XMLNode.vdom&&D.XMLNode.vdom.bxeDefaultcontent){D.nodeValue=D.XMLNode.vdom.bxeDefaultcontent
}else{D.nodeValue="#"
}}else{if(D.childNodes.length==1){D.removeChild(D.firstChild);
bxe_checkEmpty(D.XMLNode,C)
}else{if(D.childNodes.length==0){bxe_checkEmpty(D.XMLNode,C)
}else{D.replaceChild(D.ownerDocument.createTextNode(" "),E);
bxe_checkEmptyParent(D.XMLNode)
}}}}else{bxe_deleteWholeSelection(F,B);
F=window.getSelection();
F.deleteSelection(false)
}}else{bxe_history_snapshot();
F.deleteSelection(B)
}}else{var E=bxe_getXMLNodeByHTMLNode(F.anchorNode);
var D=E.parentNode;
F=window.getSelection();
bxe_deleteWholeSelection(F,B);
F.deleteSelection(false,true);
try{if(D.childNodes.length==1&&D.firstChild.nodeValue.strip().length==0){D.removeChild(D.firstChild);
bxe_checkEmpty(D.XMLNode,C)
}}catch(G){}}bxe_Transform()
}else{bxe_history_snapshot();
F.deleteSelection(B);
if(!H){}}return true
}function bxe_goToNextNode(E,A){if(E.startContainer.nodeType==1){var C=E.startContainer.firstChild
}else{var C=E.startContainer
}var G=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT,null,true);
G.currentNode=C;
if(A){C=G.previousNode()
}else{C=G.nextNode()
}var D=window.getSelection();
do{var B=C.parentNode;
if(B.userModifiable&&B.XMLNode&&(B.XMLNode.canHaveText||B.hasAttribute("__bxe_attribute"))){try{D.collapse(C,0)
}catch(F){B.appendChild(B.ownerDocument.createTextNode(" "));
D.collapse(C,0)
}bxe_updateXPath(C);
return C;
break
}if(A){C=G.previousNode()
}else{C=G.nextNode()
}}while(C)
}function AttributeVDOM(E,D){this.type="RELAXNG_ATTRIBUTE";
this.name=E.getAttribute("name");
this.dataType="NCName";
if(D=="optional"||E.getAttribute("type")=="optional"){this.optional=true
}else{this.optional=false
}var F=E.childNodes;
for(var C=0;
C<F.length;
C++){if((F[C].nodeType==1&&F[C].namespaceURI=="http://bitfluxeditor.org/schema/2.0")){switch(F[C].localName){case"name":this._bxeName=F[C].firstChild.data;
break;
case"defaultcontent":this.bxeDefaultcontent=F[C].firstChild.data;
this.bxeDefaultcontentType=F[C].getAttribute("type");
break;
case"onnew":this.bxeOnnew=F[C].firstChild.data;
break;
case"dontshow":this.bxeDontshow=true;
break;
case"noteditable":this.bxeNoteditable=true;
break;
case"helptext":this.bxeHelptext=F[C].firstChild.data;
break;
case"selector":this.bxeSelector=F[C].firstChild.data;
this.bxeSelectorType=F[C].getAttribute("type")
}}else{if(F[C].nodeName=="data"){this.dataType=F[C].getAttribute("type")
}else{if(F[C].nodeName=="choice"){this.dataType="choice";
this.choices=new Array();
var A=F[C].childNodes;
if(this.optional){this.choices.push("")
}for(var B=0;
B<A.length;
B++){if(A[B].localName=="value"&&A[B].firstChild){this.choices.push(A[B].firstChild.data)
}}}}}}}AttributeVDOM.prototype.isValid=function(ctxt){var o=null;
if(ctxt.node._node){o=ctxt.node._node
}if(o!=null&&!this.optional&&!(o.hasAttribute(this.name))){if(ctxt.wFValidityCheckLevel&2){if(this.bxeOnnew){eval(this.bxeOnnew+"(ctxt.node, this.name)");
return this.isValid(ctxt)
}else{if(this.bxeDefaultcontentType=="function"){o.setAttribute(this.name,eval(this.bxeDefaultcontent+"(ctxt.node)"));
return this.isValid(ctxt)
}else{if(this.bxeDefaultcontent){o.setAttribute(this.name,this.bxeDefaultcontent);
return this.isValid(ctxt)
}else{var newValue=prompt(ctxt.node.nodeName+" does not have the required attribute "+this.name+"\nPlease provide one");
if(newValue){o.setAttribute(this.name,newValue);
return this.isValid(ctxt)
}}}}}ctxt.setErrorMessage(ctxt.node.nodeName+" does not have the required attribute "+this.name);
return false
}else{if(o&&this.choices){var value=o.getAttribute(this.name);
if(value){for(var i=0;
i<this.choices.length;
i++){if(this.choices[i]==value){return true
}}var errMsg="'"+value+"' is not an allowed value for attribute '"+this.name+"' in '"+ctxt.node.nodeName+"'";
ctxt.setErrorMessage(errMsg);
return false
}else{return true
}}else{return true
}}};
function NodeVDOM(A){this.node=A;
this.minOccurs=null;
this.maxOccurs=null
}NodeVDOM.prototype.getVdomForChild=function(B){var A=B.parentNode._isNodeValid(false);
return B._vdom
};
NodeVDOM.prototype.allowedElements=function(A){return this.localName
};
NodeVDOM.prototype.parseChildren=function(){};
NodeVDOM.prototype.appendChild=function(A){A.parentNode=this;
if(typeof this.firstChild=="undefined"||this.firstChild==null){this.firstChild=A;
this.lastChild=A;
A.nextSibling=null;
A.previousSibling=null
}else{A.previousSibling=this.lastChild;
A.previousSibling.nextSibling=A;
A.nextSibling=null;
this.lastChild=A
}};
NodeVDOM.prototype.isValid=function(A){return true
};
NodeVDOM.prototype.__defineGetter__("bxeName",function(){if(this._bxeName){return this._bxeName
}else{return this.localName
}});
function DocumentVDOM(){}DocumentVDOM.prototype=new NodeVDOM();
DocumentVDOM.prototype.parseSchema=function(){if(!this.xmldoc.documentElement){bxe_alert("Something went wrong during importing the Validation/RelaxNG document\n.See console for details.");
bxe_dump("RNG Doc:"+this.xmldoc.saveXML());
return false
}try{this.xmldoc.documentElement.localName
}catch(A){var B=document.implementation.createDocument("","",null);
B.appendChild(B.adoptNode(this.xmldoc.documentElement,true));
this.xmldoc=B
}if(this.xmldoc.documentElement.localName=="schema"&&this.xmldoc.documentElement.namespaceURI=="http://www.w3.org/2001/XMLSchema"){alert("XML Schema validation is not supported. You have to use Relax NG")
}else{if(this.xmldoc.documentElement.localName=="grammar"&&this.xmldoc.documentElement.namespaceURI=="http://relaxng.org/ns/structure/1.0"){this.parseRelaxNG()
}else{bxe_alert("Validation/RelaxNG document is not valid.\n See console for details.");
bxe_dump(this.xmldoc.saveXML(this.xmldoc));
return false
}}this.onparse(this);
return true
};
DocumentVDOM.prototype.loadSchema=function(B,D){this.onparse=D;
this.xmldoc=document.implementation.createDocument("","",null);
this.xmldoc.onload=function(E){E.currentTarget.DocumentVDOM.parseSchema()
};
this.xmldoc.DocumentVDOM=this;
this.filename=B;
if(B.substring(0,1)=="/"||B.indexOf("://")>0){this.directory=bxe_getDirPart(B)
}else{var A=bxe_getDirPart(window.location.toString());
this.directory=bxe_getDirPart(A+B)
}try{this.xmldoc.load(B)
}catch(C){return false
}return true
};
DocumentVDOM.prototype.getAllowedChildren=function(A){return this.globalElements[A.toLowerCase()].allowedChildren
};
DocumentVDOM.prototype.isGlobalElement=function(A){if(this.globalElements[A.toLowerCase()]){return true
}else{return false
}};
function ElementVDOM(A){this.node=A;
this._allowedChildren=new Array();
this.type="RELAXNG_ELEMENT";
this.canBeRoot=false;
this.nextSibling=null;
this.previousSibling=null;
this.minOccurs=1;
this.maxOccurs=1;
this._attributes=new Array()
}ElementVDOM.prototype=new NodeVDOM();
NodeVDOM.prototype.addAttributeNode=function(A){try{this._attributes[A.name]=A
}catch(B){try{this._attributes=new Array();
this._attributes[A.name]=A
}catch(B){}}};
ElementVDOM.prototype.__defineGetter__("hasAttributes",function(){for(var A in this.attributes){return true
}return false
});
ElementVDOM.prototype.addAllowedChild=function(A){this._allowedChildren[A.name]=A
};
NodeVDOM.prototype.getAllAttributes=function(){var D=this.firstChild;
var A=this._attributes;
while(D){if(D.nodeName=="RELAXNG_REF"&&D.DefineVDOM){var C=D.DefineVDOM.getAllAttributes();
if(C&&A){for(i in C){A[C[i].name]=C[i]
}}}else{if(D.nodeName=="RELAXNG_CHOICE"){var C=D.getAllAttributes();
if(C){if(!A["__bxe_choices"]){A["__bxe_choices"]=new Array()
}var B=new Array();
for(i in C){B[C[i].name]=C[i]
}A["__bxe_choices"].push(B)
}}}D=D.nextSibling
}return A
};
ElementVDOM.prototype.__defineGetter__("attributes",function(){if(typeof this._cachedAttributes=="undefined"){this._cachedAttributes=this.getAllAttributes()
}return this._cachedAttributes
});
ElementVDOM.prototype.isValid=function(J){if(J.node._node.localName==this.localName&&J.node.namespaceURI==this.namespaceURI){var D=this.attributes;
var E=J.node.attributes;
var K=new Array();
if(!(J.wFValidityCheckLevel&8)){for(var H in D){if(H=="__bxe_choices"){for(var G in D["__bxe_choices"]){var L=D["__bxe_choices"][G];
var F=0;
var B="";
for(var C in L){B+=", "+L[C].name;
if(J.node.getAttribute&&J.node.getAttribute(L[C].name)){L[C].isValid(J);
F++
}K[L[C].name]=true
}if(F>1){var I="Only one of the following attributes is allowed in "+J.node.nodeName+": ";
I+=B.substring(1,B.length);
J.setErrorMessage(I)
}else{if(F==0){var I=J.node.nodeName+" needs one of the following attributes : ";
I+=B.substring(1,B.length);
J.setErrorMessage(I)
}}}}else{D[H].isValid(J);
K[D[H].name]=true
}}for(var H in E){if(typeof K[E[H].nodeName]=="undefined"){var I="The attribute "+E[H].nodeName+" is not allowed in "+J.node.nodeName;
if(J.wFValidityCheckLevel&2){if(confirm(I+"\n Should it be removed?")){J.node.removeAttribute(E[H].nodeName);
return this.isValid(J)
}}J.setErrorMessage(I)
}}}if(!(J.wFValidityCheckLevel&2)&&!J.node.hasRealChildNodes()&&!J.node.canHaveText){var A=new ContextVDOM(this.node,this);
A.wFValidityCheckLevel=J.wFValidityCheckLevel;
if(A.vdom){vdomLoop:do{switch(A.vdom.type){case"RELAXNG_ELEMENT":J.setErrorMessage("The element '"+A.vdom.bxeName+"' in '"+this.bxeName+"' is missing.");
break;
case"RELAXNG_ONEORMORE":J.setErrorMessage("One or more Elements in '"+this.bxeName+"' are missing.");
break
}A.nextVDOM()
}while(A.vdom)
}}J.node.vdom=this;
J.nextVDOM();
return true
}else{return false
}};
XMLNodeDocument.prototype.loadSchema=function(A,B){this._vdom=new DocumentVDOM();
return this._vdom.loadSchema(A,B)
};
XMLNodeDocument.prototype.validateDocument=function(B){if(!this.vdom){this.vdom=bxe_config.DocumentVDOM
}if(!this.vdom){alert("no Schema assigned to Document, but "+this.vdom);
return false
}if(!this.documentElement){this.documentElement=this._node.documentElement.XMLNode
}var D=this.documentElement.isNodeValid(true,null,B);
var A=bxe_getAllEditableAreas();
for(var C=0;
C<A.length;
C++){if((A[C]._SourceMode)){return false
}if(A[C].XMLNode){D=D&A[C].XMLNode.isNodeValid(true,null,B)
}}return D
};
XMLNodeDocument.prototype.getVdom=function(A){return this._vdom.globalElements[A.toLowerCase()]
};
XMLNodeDocument.prototype.__defineGetter__("vdom",function(){return this._vdom
});
XMLNodeDocument.prototype.__defineSetter__("vdom",function(A){this._vdom=A
});
const BXE_VALID_NOMESSAGE=1;
XMLNode.prototype.isNodeValid=function(B,C,A){if(this._node&&this._node._SourceMode==true){return true
}var D=this._isNodeValid(B,C);
if(D.isError){D.dumpErrorMessages();
if(!A){for(i in D.errormsg){if(D.errormsg[i]["node"]._node&&D.errormsg[i]["node"]._node.nodeType==1){D.errormsg[i]["node"]._node.setAttribute("__bxe_invalid","true")
}}if(!(C&1)){bxe_validationAlert(D.errormsg)
}}return false
}else{return true
}};
Attr.prototype._isNodeValid=function(A){};
XMLNode.prototype._isNodeValid=function(H,G){if(this._node.parentNode&&this._node.parentNode.nodeType==9){if(!this.vdom.canBeRoot){alert("root element is not allowed to be root");
return false
}}else{}try{if(this.vdom){var F=new ContextVDOM(this,this.vdom);
F.wFValidityCheckLevel=G
}else{return false
}}catch(E){bxe_dump("couldn't make new context..\n")
}if(F&&F.node){do{var C=F.node._node.nodeType;
if(C==3&&F.node.isWhitespaceOnly){continue
}if(C==Node.COMMENT_NODE){continue
}if(C==Node.CDATA_SECTION_NODE){continue
}if(F.isValid()){var I=F.node._node;
if(I.hasChildNodes()){if(H){var A=F.refs.length;
var B=F.node._isNodeValid(H,G);
if(B.isError){F.addErrorMessages(B.errormsg)
}}}else{if(I.nodeType==1&&F.node.canHaveText){F.node.setContent("#empty");
I.setAttribute("__bxe_defaultcontent","true")
}}}else{var D="";
if(C==3){D="text ('"+F.node.nodeValue+"')"
}else{D=F.node.localName+"("+F.node.namespaceURI+") "
}if(F.node.parentNode.isAllowedChild(F.node.namespaceURI,F.node.localName)){D+="is not allowed at this position as child of  "+this.localName
}else{D+=" is not allowed as child of  "+this.localName+"("+this.namespaceURI+")"
}F.setErrorMessage(D)
}}while(F.next())
}return F
};
ctxtcounter=0;
function ContextVDOM(A,B){this.node=A.firstChild;
this.nr=ctxtcounter++;
this.isError=false;
this.errormsg=new Array();
this.refs=new Array();
if(B&&typeof B.firstChild!="undefined"){this.vdom=B.getFirstChild(this)
}else{this.vdom=null
}}ContextVDOM.prototype.next=function(){if(this.node.nextSibling){this.node=this.node.nextSibling;
if(this.node._node.nodeType==3){debug("ctxt.next next.nodeName is null...");
return this.next()
}return this.node
}else{debug("no next sibling...");
return null
}};
ContextVDOM.prototype.setErrorMessage=function(B){if(!this.errormsg){this.errormsg=new Array()
}this.isError=true;
var A=new Array();
A["text"]=B;
A["node"]=this.node;
this.errormsg.push(A)
};
ContextVDOM.prototype.addErrorMessages=function(A){this.isError=true;
this.errormsg=this.errormsg.concat(A)
};
ContextVDOM.prototype.getErrorMessagesAsText=function(){var A="";
for(i in this.errormsg){A+=this.errormsg[i]["text"]+"\n"
}return A
};
ContextVDOM.prototype.dumpErrorMessages=function(){bxe_dump("Error :\n"+this.getErrorMessagesAsText())
};
ContextVDOM.prototype.nextVDOM=function(){if(this.vdom==null||typeof this.vdom=="undefined"){return null
}var A=this.vdom.getNextSibling(this);
if(A){this.vdom=A
}else{this.vdom=null;
return null
}return this.vdom
};
ContextVDOM.prototype.isValid=function(){if(this.vdom){return this.vdom.isValid(this)
}else{if(this.node._node.hasChildNodes()){this.setErrorMessage(this.node.nodeName+" is not allowed to have children");
return false
}else{this.node.vdom=this.vdom;
return false
}}};
ContextVDOM.prototype.setVDOM=function(B,C){if(C&&this.refs.length>0){while(this.refs.length>C){var A=this.refs.pop();
debug("this.refs.pop"+A.name)
}}this.vdom=B
};
XMLNode.prototype.__defineGetter__("vdom",function(){if(typeof this._vdom=="undefined"||!this._vdom){if(this.parentNode){if(this.parentNode._node.nodeType==9){if(this.localName==this.ownerDocument.vdom.firstChild.localName){this._vdom=this.ownerDocument.vdom.firstChild
}else{alert(" Document has root node named "+this.localName+"\n RelaxNG expects  "+this.ownerDocument.vdom.firstChild.nodeName);
this._vdom=null
}}else{if(this.parentNode.vdom){this._vdom=this.parentNode.vdom.getVdomForChild(this)
}else{return null
}}}else{return null
}}return this._vdom
});
XMLNode.prototype.__defineSetter__("vdom",function(A){this._vdom=A
});
XMLNodeElement.prototype.__defineGetter__("allowedChildren",function(){if(typeof this._allowedChildren=="undefined"){var A=new ContextVDOM(this,this.vdom);
var C=new Array();
var E=null;
try{if(A.vdom){do{E=A.vdom.allowedElements(A);
if(E&&E.nodeName){C.push(E)
}else{if(E){for(var B=0;
B<E.length;
B++){C.push(E[B])
}}}}while(A.nextVDOM())
}this._allowedChildren=C;
return C
}catch(D){debug("end with catch get allowed Children for "+this.nodeName);
bxe_catch_alert(D);
return C
}}else{return this._allowedChildren
}});
XMLNodeElement.prototype.isValidNextSibling=function(A){if(!A){try{if(this.parentNode.vdom){A=new ContextVDOM(this.parentNode,this.parentNode.vdom);
A.wFValidityCheckLevel=8
}else{return false
}}catch(D){bxe_catch_alert(D);
debug("couldn't make new context..")
}}do{var B=A.node._node.nodeType;
if(B=="3"&&A.node.isWhitespaceOnly){continue
}if(B==Node.COMMENT_NODE){continue
}if(B==Node.CDATA_SECTION_NODE){continue
}var C=A.vdom;
if(A.isValid()){}else{A.isError=true
}if(A.node==this){break
}}while(A.next());
return(!A.isError)
};
XMLNodeElement.prototype.__defineGetter__("allowedNextSiblingsSorted",function(){if(typeof this._allowedNextSiblingsSorted=="undefined"){this._allowedNextSiblingsSorted=this.allowedNextSiblings;
this._allowedNextSiblingsSorted.sort(bxe_nodeSort)
}return this._allowedNextSiblingsSorted
});
XMLNodeElement.prototype.__defineGetter__("allowedNextSiblings",function(){if(typeof this._allowedNextSiblings=="undefined"){var E=this._node.parentNode.XMLNode;
if(E._node.nodeType==9){return new Array()
}var A=new ContextVDOM(E,E.vdom);
var D=new Array();
var G=null;
try{if(A.vdom){do{G=A.vdom.allowedElements(A);
if(G&&G.nodeName){if(G.localName!="#text"){var B=bxe_config.xmldoc.createElementNS(G.namespaceURI,G.localName,1);
if(this.nextSibling){B=E.insertBeforeIntern(B,this.nextSibling._node)
}else{B=E.appendChildIntern(B)
}if(B.isValidNextSibling()){D.push(G)
}B.unlink();
B=null
}}else{if(G){for(var C=0;
C<G.length;
C++){if(G[C].localName!="#text"){var B=bxe_config.xmldoc.createElementNS(G[C].namespaceURI,G[C].localName);
if(this.nextSibling){B=E.insertBeforeIntern(B,this.nextSibling._node)
}else{B=E.appendChildIntern(B)
}if(B.isValidNextSibling()){D.push(G[C])
}B.unlink();
B=null
}}}}}while(A.nextVDOM())
}if(D.length>0){this._allowedNextSiblings=D
}return D
}catch(F){bxe_dump("end with catch get allowed nextSibling for "+this.nodeName);
bxe_catch_alert(F);
return D
}}else{return this._allowedNextSiblings
}});
XMLNodeElement.prototype.__defineGetter__("canHaveText",function(){if(this._vdom==null||typeof this._vdom=="undefined"){return false
}else{if(typeof this.vdom._canHaveText=="undefined"){var B=this.allowedChildren;
if(B){for(var A=0;
A<B.length;
A++){if(B[A].nodeType==3){this.vdom._canHaveText=true;
return true
}}}this.vdom._canHaveText=false;
return false
}else{return this.vdom._canHaveText
}}return true
});
XMLNodeElement.prototype.isAllowedChild=function(B,A){var D=this.allowedChildren;
if(typeof B=="undefined"||B==null){B=""
}if(D){for(var C=0;
C<D.length;
C++){if(D[C].localName==A&&D[C].namespaceURI==B){return true
}}}return false
};
const RELAXNGNS="http://relaxng.org/ns/structure/1.0";
DocumentVDOM.prototype.parseRelaxNG=function(){this.xmldoc.documentElement.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:rng","http://relaxng.org/ns/structure/1.0");
bxe_config.DocumentVDOM=this;
rng_nsResolver=new bxe_RelaxNG_nsResolver(this.xmldoc.documentElement);
bxe_dump("Start parseIncludes "+(new Date()-startTimer)/1000+" sec\n");
this.parseIncludes();
bxe_dump("Start derefAttributes "+(new Date()-startTimer)/1000+" sec\n");
this.dereferenceAttributes();
var A=new Date();
bxe_dump("Start parsing RNG "+(A-startTimer)/1000+" sec\n");
if(DebugOutput){}var D=this.xmldoc.documentElement.childNodes;
var C=false;
for(var B=0;
B<D.length;
B++){if(D[B].isRelaxNGElement("start")){this.parseStart(D[B]);
C=true;
break
}}if(!C){alert("No <start> element found.")
}bxe_dump("End parsing RNG "+(new Date()-startTimer)/1000+" sec\n");
return true
};
DocumentVDOM.prototype.dereferenceAttributes=function(){var D="/rng:grammar//rng:interleave[rng:optional/rng:attribute]";
var B=this.xmldoc.documentElement.getXPathResult(D);
var C=B.iterateNext();
var A=new Array();
while(C){A.push(C);
C=B.iterateNext()
}for(j in A){var F=A[j].firstChild;
while(F){var E=F.nextSibling;
A[j].parentNode.insertBefore(F,A[j]);
F=E
}A[j].parentNode.removeChild(A[j])
}var D="/rng:grammar//rng:optional[rng:attribute]";
var B=this.xmldoc.documentElement.getXPathResult(D);
var C=B.iterateNext();
var A=new Array();
while(C){A.push(C);
C=B.iterateNext()
}for(j in A){var F=A[j].firstChild;
while(F){var E=F.nextSibling;
if(F.nodeType==Node.ELEMENT_NODE){F.setAttribute("type","optional")
}A[j].parentNode.insertBefore(F,A[j]);
F=E
}A[j].parentNode.removeChild(A[j])
}var D="/rng:grammar//rng:group";
var B=this.xmldoc.documentElement.getXPathResult(D);
var C=B.iterateNext();
var A=new Array();
while(C){A.push(C);
C=B.iterateNext()
}for(j in A){A[j].parentNode.removeChild(A[j])
}if(A.length>0){debug("!!! Removed "+A.length+" unsupported group nodes")
}return true
};
DocumentVDOM.prototype.parseIncludes=function(){var L=this.xmldoc.documentElement.firstChild;
var C;
this.replaceIncludePaths(this.xmldoc,this.directory);
var I=new Array();
while(L){C=false;
if(L.nodeType==Node.TEXT_NODE&&L.isWhitespaceOnly){var O=L;
var L=L.nextSibling;
C=true;
O.parentNode.removeChild(O)
}else{if(L.isRelaxNGElement("include")){var E=L.nextSibling;
var K=new mozileTransportDriver("http");
var P=L.getAttribute("href");
bxe_about_box.addText(L.getAttribute("href")+" ");
if(I[P]){debug(P+" was already loaded...")
}else{var A=K.load(P,null,false);
if(A.isError){debug("!!!RelaxNG file "+L.getAttribute("href")+" could not be loaded!!!")
}else{if(K.document.documentElement.isRelaxNGElement("grammar")){this.replaceIncludePaths(K.document,P);
this.replacePrefixes(K.document);
var N=L.firstChild;
while(N){var G=N.nextSibling;
if(N.isRelaxNGElement("define")||N.isRelaxNGElement("start")){N.setAttribute("__bxe_includeChild","true");
E.parentNode.insertBefore(N,E)
}N=G
}var H=K.document.documentElement.firstChild;
while(H){if(H.isRelaxNGElement("define")||H.isRelaxNGElement("start")){if(H.localName=="define"){var M="/rng:grammar/rng:define[@name = '"+H.getAttribute("name")+"']"
}else{var M="/rng:grammar/rng:start"
}var Q=this.xmldoc.documentElement.getXPathFirst(M);
if(H.hasAttribute("combine")||(Q&&Q.hasAttribute("combine"))){var D=H.getAttribute("combine");
if(!D){D=Q.getAttribute("combine")
}if(Q&&!Q.hasAttribute("__bxe_includeChild")){var F=Q.getXPathFirst("*[position() = 1]");
if(F.nodeName==D){var B=this.xmldoc.importNode(H,true);
var J=B.getXPathFirst("*[position() = 1]");
if(J.localName==D){F.appendAllChildren(J)
}else{F.appendAllChildren(B)
}}else{var B=this.xmldoc.createElementNS(RELAXNGNS,D);
B.appendAllChildren(Q);
Q.appendChild(B);
var R=this.xmldoc.importNode(H,true);
B.appendAllChildren(R)
}}else{if(Q&&Q.hasAttribute("__bxe_includeChild")){debug("!!!overriden by include directive")
}else{var B=this.xmldoc.importNode(H,true);
L.parentNode.insertBefore(B,E)
}}}else{if(Q){debug("!!! "+H.getAttribute("name")+" already defined !!!!");
if(Q.hasAttribute("__bxe_includeChild")){debug("!!!overriden by include directive")
}}else{var B=this.xmldoc.importNode(H,true);
L.parentNode.insertBefore(B,E)
}}}else{var B=this.xmldoc.importNode(H,true);
L.parentNode.insertBefore(B,E)
}H=H.nextSibling
}}else{debug("!!!!"+P+" is not a Relax NG Document\n"+K.document.saveXML(K.document),E_FATAL)
}}}var O=L;
var L=L.nextSibling;
C=true;
O.parentNode.removeChild(O)
}}if(!C){L=L.nextSibling
}}};
DocumentVDOM.prototype.replacePrefixes=function(F){F.documentElement.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:rng","http://relaxng.org/ns/structure/1.0");
var E=new bxe_RelaxNG_nsResolver(F.documentElement);
var B=F.getElementsByTagNameNS(RELAXNGNS,"element");
var D;
for(var A=0;
A<B.length;
A++){var C=E.parseNodeNameOnElement(B[A]);
D=rng_nsResolver.lookupPrefix(C.namespaceURI);
if(typeof D=="string"&&D!=""){B[A].setAttribute("name",D+":"+C.localName)
}else{if(D==""){B[A].setAttribute("name",C.localName)
}}}};
DocumentVDOM.prototype.replaceIncludePaths=function(F,B){var E=F.documentElement.getElementsByTagNameNS(RELAXNGNS,"include");
var C=bxe_getDirPart(B);
var A;
for(var D=0;
D<E.length;
D++){A=E[D].getAttribute("href");
if(A.indexOf("/")!=0&&A.indexOf("://")<0){A=C+A
}E[D].setAttribute("href",A)
}};
var rng_nsResolver;
DocumentVDOM.prototype.parseStart=function(F){var G=F.childNodes;
var A=null;
Ende:for(var C=0;
C<G.length;
C++){if(G[C].isRelaxNGElement("element")){A=G[C];
break Ende
}if(G[C].isRelaxNGElement("ref")){var E="/rng:grammar/rng:define[@name = '"+G[C].getAttribute("name")+"']/rng:element";
A=this.xmldoc.documentElement.getXPathFirst(E);
break Ende
}}if(A){var D=new ElementVDOM(A);
this.firstChild=D;
D.parentNode=this;
var B=rng_nsResolver.parseNodeNameOnElement(A);
D.nodeName=B.nodeName;
D.localName=B.localName;
D.namespaceURI=B.namespaceURI;
D.prefix=B.prefix;
D.canBeRoot=true;
D.nextSibling=null;
D.previousSibling=null
}D.parseChildren()
};
function bxe_RelaxNG_nsResolver(B){var C=B.attributes;
this.defaultNamespace="";
this.namespaces=new Array();
this.prefixes=new Array();
for(var A=0;
A<C.length;
A++){if(C[A].namespaceURI=="http://www.w3.org/2000/xmlns/"){this.namespaces[C[A].localName]=C[A].value;
this.prefixes[C[A].value]=C[A].localName
}else{if(C[A].localName=="ns"){this.defaultNamespace=C[A].value;
this.prefixes[C[A].value]="default"
}}}}bxe_RelaxNG_nsResolver.prototype.lookupNamespaceURI=function(A){if(this.namespaces[A]){return this.namespaces[A]
}return null
};
bxe_RelaxNG_nsResolver.prototype.lookupPrefix=function(A){if(this.prefixes[A]){return this.prefixes[A]
}return null
};
bxe_RelaxNG_nsResolver.prototype.parseNodeNameOnElement=function(C){var A=C.getAttribute("name");
if(A){return this.parseNodeName(A)
}var D=C.firstChild;
var B=new Object();
while(D){if(D.nodeType==Node.ELEMENT_NODE&&D.localName=="name"){D.getAttribute("ns");
B.namespaceURI=D.getAttribute("ns");
B.localName=D.firstChild.data;
B.prefix="";
return B
}D=D.nextSibling
}};
bxe_RelaxNG_nsResolver.prototype.parseNodeName=function(A){var C=A.split(":");
var B=new Object;
B.nodeName=A;
if(C.length>1){B.localName=C[1];
B.namespaceURI=this.lookupNamespaceURI(C[0]);
B.prefix=C[0]
}else{B.localName=C[0];
B.namespaceURI=this.defaultNamespace;
B.prefix="default"
}return B
};
Node.prototype.__defineGetter__("hasRelaxNGNamespace",function(){if(this.namespaceURI==RELAXNGNS){return true
}else{return false
}});
Node.prototype.isRelaxNGElement=function(A){if(this.nodeType==Node.ELEMENT_NODE&&this.nodeName==A&&this.hasRelaxNGNamespace){return true
}else{return false
}};
NodeVDOM.prototype.parseChildren=function(D){var M;
if(D){M=D.childNodes
}else{M=this.node.childNodes
}var K;
var E;
this._hasEmpty=true;
for(var I=0;
I<M.length;
I++){if((M[I].nodeType==1&&M[I].namespaceURI=="http://bitfluxeditor.org/schema/2.0")){switch(M[I].localName){case"name":this._bxeName=M[I].firstChild.data;
break;
case"defaultcontent":this.bxeDefaultcontent=M[I].firstChild.data;
this.bxeDefaultcontentType=M[I].getAttribute("type");
if(this.bxeDefaultcontentType=="element"){var H=M[I].getAttribute("ns");
if(H){this.bxeDefaultcontentNamespaceUri=H
}else{this.bxeDefaultcontentNamespaceUri=""
}}break;
case"nextelement":this.bxeNextelement=M[I].firstChild.data;
this.bxeNextelementNS=M[I].getAttribute("ns");
break;
case"onnew":this.bxeOnnewType=M[I].getAttribute("type");
if(M[I].firstChild){this.bxeOnnew=M[I].firstChild.data
}break;
case"onnewafter":this.bxeOnnewafterType=M[I].getAttribute("type");
if(M[I].firstChild){this.bxeOnnewafter=M[I].firstChild.data
}break;
case"onempty":this.bxeOnemptyType=M[I].getAttribute("type");
if(M[I].firstChild){this.bxeOnempty=M[I].firstChild.data
}else{this.bxeOnempty=true
}if(M[I].getAttribute("allowwhitespaceonly")=="true"){this.bxeOnemptyAllowWhitespace=true
}break;
case"dontshow":this.bxeDontshow=true;
break;
case"noaddappenddelete":this.bxeNoaddappenddelete=true;
break;
case"noteditable":this.bxeNoteditable=true;
if(M[I].getAttribute("contextmenu")=="true"){this.bxeNoteditableContextMenu=true
}else{this.bxeNoteditableContextMenu=false
}break;
case"helptext":this.bxeHelptext=M[I].firstChild.data;
break;
case"menuentry":var N=Array();
N["call"]=M[I].firstChild.data;
N["type"]=M[I].getAttribute("type");
N["name"]=M[I].getAttribute("name");
if(!this.bxeMenuentry){this.bxeMenuentry=new Array()
}this.bxeMenuentry.push(N);
break;
case"tabletype":this.bxeTabletype=M[I].firstChild.data;
break;
case"clipboard":this.bxeClipboard=M[I].firstChild.data;
if(M[I].hasAttribute("child")){if(M[I].hasAttribute("grandchild")){this.bxeClipboardGrandChild=M[I].getAttribute("grandchild");
if(M[I].hasAttribute("firstgrandchild")){this.bxeClipboardFirstGrandChild=M[I].getAttribute("firstgrandchild")
}}if(M[I].hasAttribute("firstchild")){this.bxeClipboardFirstChild=M[I].getAttribute("firstchild");
if(M[I].hasAttribute("emptyfirstrow")){this.bxeClipboardEmptyFirstRow=M[I].getAttribute("emptyfirstrow")
}}this.bxeClipboardChild=M[I].getAttribute("child")
}else{this.bxeClipboardChild=false
}break
}}if(!(M[I].nodeType==1&&M[I].hasRelaxNGNamespace)){continue
}switch(M[I].localName){case"element":var J=new ElementVDOM(M[I]);
var C=rng_nsResolver.parseNodeNameOnElement(M[I]);
J.nodeName=C.nodeName;
J.localName=C.localName;
J.namespaceURI=C.namespaceURI;
J.prefix=C.prefix;
this.appendChild(J);
J.parseChildren();
this._hasEmpty=false;
break;
case"ref":var G="/rng:grammar/rng:define[@name = '"+M[I].getAttribute("name")+"']";
var B=this.node.ownerDocument.documentElement.getXPathFirst(G);
if(B){if(!B.isParsed){var L=new DefineVDOM(B);
B.isParsed=true;
B.vdom=L;
L.parseChildren(B)
}var A=new RefVDOM(M[I]);
A.DefineVDOM=B.vdom;
this.appendChild(A)
}break;
case"oneOrMore":E=new OneOrMoreVDOM(M[I]);
this.appendChild(E);
this._hasEmpty=false;
E.parseChildren(M[I]);
break;
case"text":case"data":this.appendChild(new TextVDOM(M[I]));
this._hasEmpty=false;
break;
case"zeroOrMore":newZeroOrMore=new ZeroOrMoreVDOM(M[I]);
this.appendChild(newZeroOrMore);
newZeroOrMore.parseChildren(M[I]);
break;
case"attribute":this.addAttributeNode(new AttributeVDOM(M[I]));
break;
case"optional":K=new ChoiceVDOM(M[I]);
K.optional=true;
this.appendChild(K);
K.appendChild(new EmptyVDOM());
this._hasEmpty=false;
K.parseChildren();
break;
case"choice":K=new ChoiceVDOM(M[I]);
K.optional=true;
this.appendChild(K);
K.parseChildren();
this._hasEmpty=false;
break;
case"interleave":var F=new InterleaveVDOM(M[I]);
this.appendChild(F);
F.parseChildren();
this._hasEmpty=false;
break;
case"empty":this.appendChild(new EmptyVDOM());
break;
case"data":break;
default:alert("Unknown/not-implemented RelaxNG element: "+M[I].localName)
}}};
RefVDOM.prototype=new NodeVDOM();
function RefVDOM(A){this.node=A;
this.type="RELAXNG_REF";
this.nodeName="RELAXNG_REF";
this.name=A.getAttribute("name")
}RefVDOM.prototype.isValid=function(B){var C=this.getFirstChild(B);
var A;
if(C){A=C.isValid(B)
}return A
};
NodeVDOM.prototype.getFirstChild=function(A){var B=this.firstChild;
if(B&&B.nodeName=="RELAXNG_REF"){return B.getFirstChild(A)
}return B
};
RefVDOM.prototype.getFirstChild=function(A){var B=this.DefineVDOM;
if(B&&B.firstChild){A.refs.push(this);
return B.getFirstChild(A)
}else{return this.getNextSibling(A)
}};
NodeVDOM.prototype.getNextSibling=function(A){var B=this.nextSibling;
if(!B&&this.parentNode&&this.parentNode.nodeName=="RELAXNG_DEFINE"){return this.parentNode.getNextSibling(A)
}if(B){if(B.nodeName=="RELAXNG_REF"){B=B.getFirstChild(A)
}}return B
};
NodeVDOM.prototype.getParentNode=function(A){if(this.parentNode&&this.parentNode.nodeName=="RELAXNG_DEFINE"){debug("getParentNode"+this.parentNode.name);
return this.parentNode.getParentNode(A)
}return this.parentNode
};
RefVDOM.prototype.allowedElements=function(A){return this.DefineVDOM.allowedElements(A)
};
DefineVDOM.prototype=new NodeVDOM();
DefineVDOM.prototype.allowedElements=function(A){var E=this.getFirstChild(A);
var C=new Array();
while(E){var D=E.allowedElements(A);
if(D){if(D.nodeName){C.push(D)
}else{if(D){for(var B=0;
B<D.length;
B++){C.push(D[B])
}}}}E=E.getNextSibling(A)
}return C
};
DefineVDOM.prototype.getNextSibling=function(A){if(A.refs.length==0){debug("	: "+A.nr+"... 0");
return null
}var B=A.refs.pop();
return B.getNextSibling(A)
};
DefineVDOM.prototype.getParentNode=function(A){return A.refs.pop()
};
function DefineVDOM(A){this.node=A;
this.type="RELAXNG_DEFINE";
this.nodeName="RELAXNG_DEFINE";
this._attributes=new Array();
this.name=A.getAttribute("name")
}DefineVDOM.prototype.isValid=function(A,B){};
ZeroOrMoreVDOM.prototype=new NodeVDOM();
function ZeroOrMoreVDOM(A){this.node=A;
this.type="RELAXNG_ZEROORMORE";
this.nodeName="RELAXNG_ZEROORMORE"
}ZeroOrMoreVDOM.prototype.isValid=function(A){var C=A.refs.length;
var D=this.getFirstChild(A);
while(D){if(D.isValid(A)){A.setVDOM(this,C);
return true
}D=D.getNextSibling(A)
}A.setVDOM(this,C);
var B=A.nextVDOM();
if(B){return B.isValid(A)
}else{return false
}};
ZeroOrMoreVDOM.prototype.allowedElements=function(A){var F=this.getFirstChild(A);
var C=new Array();
try{while(F){var E=F.allowedElements(A);
if(E){if(E.nodeName){C.push(E)
}else{for(var B=0;
B<E.length;
B++){C.push(E[B])
}}}F=F.getNextSibling(A)
}}catch(D){bxe_catch_alert(D);
alert(F.nodeName+" "+E)
}return C
};
ChoiceVDOM.prototype=new NodeVDOM();
ChoiceVDOM.prototype.isValid=function(A){var E=A.refs.length;
var F=this.getFirstChild(A);
var C=false;
while(F){if(F.type=="RELAXNG_EMPTY"){C=true
}if(F.isValid(A)){return true
}F=F.getNextSibling(A)
}if(C||this._attributes){var D=A.nextVDOM();
if(D){var B=D.isValid(A);
return B
}}return false
};
function ChoiceVDOM(A){this.node=A;
this.type="RELAXNG_CHOICE";
this.nodeName="RELAXNG_CHOICE"
}InterleaveVDOM.prototype=new NodeVDOM();
InterleaveVDOM.prototype.isValid=function(A){var D=A.refs.length;
var E=this.getFirstChild(A);
var C=false;
while(E){debug("Interleave.child: "+E.nodeName);
if(E.isValid(A)){var B=A.next();
if(B==null){return true
}A.setVDOM(this,D);
E=this.getFirstChild(A);
this.hit=true
}E=E.getNextSibling(A)
}A.setVDOM(this,D);
A.nextVDOM();
if(this.hit){return true
}else{return false
}};
InterleaveVDOM.prototype.allowedElements=function(A){try{var F=this.getFirstChild(A);
var C=new Array();
while(F){var E=F.allowedElements(A);
if(E){if(E.nodeName){C.push(E)
}else{for(var B=0;
B<E.length;
B++){C.push(E[B])
}}}F=F.getNextSibling(A)
}return C
}catch(D){bxe_catch_alert(D)
}};
function InterleaveVDOM(A){this.node=A;
this.type="RELAXNG_INTERLEAVE";
this.nodeName="RELAXNG_INTERLEAVE"
}EmptyVDOM.prototype=new NodeVDOM();
function EmptyVDOM(A){this.node=A;
this.type="RELAXNG_EMPTY";
this.nodeName="RELAXNG_EMPTY"
}EmptyVDOM.prototype.isValid=function(){return false
};
EmptyVDOM.prototype.allowedElements=function(){return null
};
TextVDOM.prototype=new NodeVDOM();
function TextVDOM(A){this.node=A;
this.type="RELAXNG_TEXT";
this.nodeName="RELAXNG_TEXT";
this.localName="#text"
}TextVDOM.prototype.isValid=function(A){if(A.node._node.nodeType==Node.TEXT_NODE){return true
}else{return false
}};
TextVDOM.prototype.allowedElements=function(A){return{"nodeName":"#text","namespaceURI":null,"localName":"#text","nodeType":3}
};
OneOrMoreVDOM.prototype=new NodeVDOM();
function OneOrMoreVDOM(A){this.type="RELAXNG_ONEORMORE";
this.nodeName="RELAXNG_ONEORMORE";
this.node=A;
this.hit=false
}OneOrMoreVDOM.prototype.isValid=function(A){var D=A.refs.length;
var E=this.getFirstChild(A);
var C=false;
while(E){if(E.isValid(A)){this.hit=true;
A.setVDOM(this,D);
return true
}if(E.nodeName=="RELAXNG_EMPTY"){C=true
}E=E.getNextSibling(A)
}A.setVDOM(this,D);
if(this.hit){var B=A.nextVDOM();
if(B){return B.isValid(A)
}else{return false
}}if(C){this.hit=true;
return true
}return false
};
ChoiceVDOM.prototype.allowedElements=function(A){var F=this.getFirstChild(A);
var C=new Array();
try{while(F){var E=F.allowedElements(A);
if(E){if(E.nodeName){if(this.optional){E.optional=true
}C.push(E)
}else{for(var B=0;
B<E.length;
B++){if(this.optional){E[B].optional=true
}C.push(E[B])
}}}F=F.getNextSibling(A)
}}catch(D){bxe_catch_alert(D);
alert(F.nodeName+" "+E)
}return C
};
OneOrMoreVDOM.prototype.allowedElements=function(A){var E=this.getFirstChild(A);
var C=new Array();
while(E){var D=E.allowedElements(A);
if(D){if(D.nodeName){C.push(D)
}else{for(var B=0;
B<D.length;
B++){C.push(D[B])
}}}E=E.getNextSibling(A)
}return C
};
ElementVDOM.prototype.allowedElements=function(A){var B="";
if(this.prefix){B=this.prefix+":"
}return{"nodeName":B+this.localName,"namespaceURI":this.namespaceURI,"localName":this.localName,"vdom":this}
};
ElementVDOM.prototype.__defineSetter__("nodeName",function(A){var B=true;
if(B){this._xmlnodeName=A
}});
ElementVDOM.prototype.__defineGetter__("nodeName",function(A){return this._xmlnodeName
});
ElementVDOM.prototype.__defineGetter__("canHaveChildren",function(){if(this._hasEmpty){return !(this._hasEmpty)
}return true
});
DocumentVDOM.prototype.getStructure=function(){return"\n"+this.getFirstChild(ctxt).getStructure()
}
