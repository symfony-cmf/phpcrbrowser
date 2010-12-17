function cope2_set_coid(node,attrib) {
	
	node.setAttribute(attrib,"id0x"+Math.round(Math.random()*10000) +"0" + Math.round(new Date()));
	
}	

function cope2_getMinute(node) {
	var d = new Date() 
	return d.getMinutes()
}

function cope2_getHour(node) {
	var d = new Date() 
	return d.getHours()
}

function cope2_getDay(node) {
	var d = new Date() 
	return d.getDate()
}

function cope2_getMonth(node) {
	var d = new Date() 
	return d.getMonth() + 1;
}

function cope2_getYear(node) {
	var d = new Date() 
	return d.getFullYear()
}

/* example for onnew function */
function cope2_newPara(node) {
	node.setContent("fooo");
	
	var newNode =  bxe_config.xmldoc.createElement("bold" ) ;
		
	newNode = node._node.appendChild(newNode);
		
	var _id = newNode.setBxeId();
	newNode.appendChild(bxe_config.xmldoc.createTextNode("jjjjj"));
	return false;
}

function cope2_serverIncludeURL(node) {
	var url = "";
	var attr = node.attributes;
	for (var j = 0; j < attr.length; j++) {
			url += attr[j].localName + "=" + attr[j].value + "&";
	}
	
	return "./include.xml?"+url;
		
}


function foo(node) {
	
	alert(node.localName);
}

function cope2_serverClipboardURL(action) {
	if (action == 'POST') {
		return "clipboard.php?action=POST";
	} else {
		return "clipboard.php?action=GET";
	}
}

function emailselector() {
	window.bxe_insertAttributeValue("bar");
	return false;
}


