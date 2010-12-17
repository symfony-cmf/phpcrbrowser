function i18n (xml) {

	this.xml = xml;
}


i18n.prototype.getText = function (key, replacements) {
	if (this.xml) {
		try {
			var res = this.xml.evaluate("/catalogue/message[@key=\""+key+"\"]/text()", this.xml, null, 
			XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue;
			
			if ( res ) {
				var string = res.nodeValue;
			} else {
				var string = key;
			}
		} catch (e) {
			alert(e + "\n Used key: " + key );
		}
	} else {
		string = key;
	}
	
	if (replacements) {
		string = eval("'"+string.replace(/\{([0-9]+)\}/g,"'+replacements[$1]+'") + "'");
		
	}
	
	return string;
}