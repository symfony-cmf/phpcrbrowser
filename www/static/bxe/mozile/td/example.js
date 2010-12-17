/* you can extend the webdav driver here */

function mozileTransportDriver_example() {
	
}

mozileTransportDriver_example.prototype= new mozileTransportDriver_http(); 

mozileTransportDriver_example.prototype.save = function(filename, content, td)
{
	this.p = new XMLHttpRequest();
	this.p.overrideMimeType("text/xml");
	this.p.onload = this.saveCallback;
	this.p.td = td;
	this.p.open("POST",filename );
	this.p.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	var xmlfile = bxe_config.xmlfile.substring(18,120);
	var encodedContent = "XML=" + encodeURIComponent(xmlfile)  + "&content=" +encodeURIComponent(content);
	encodedContent += "&lang=" + encodeURIComponent(bxe_config.options['lang']);
	this.p.send(encodedContent,true);
}
