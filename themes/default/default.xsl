<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns="http://www.w3.org/1999/xhtml" 
        xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
        exclude-result-prefixes="xhtml i18n"
        version="1.0">
    <xsl:param name="dir" select="'/edit'"/>
    
    <xsl:template match="/">
        <html >
	        <head>
	            <title><i18n:text>PageTitle</i18n:text></title>
	        </head>
	        <body>
	        <h1> crbrowser</h1>
	         
	        <h2>  <xsl:value-of select="/command/node/path"/></h2>
	        <xsl:value-of select="/command/node/name"/>
	        <h2> subnodes</h2>
	        <ul>
	        <li><a href="..">..</a></li>
            <xsl:for-each select="/command/node/subnodes/node">
	        <li>
	        <a href="{$dir}{path/text()}/"><xsl:value-of select="name/text()"/></a>
	        </li>
	        </xsl:for-each>
	        </ul>
	        <h2> properties</h2>
            <ul>
            <xsl:for-each select="/command/node/properties/property">
            <li>
            <xsl:value-of select="name/text()"/> =
            <xsl:value-of select="value/text()"/>
            </li>
                
            </xsl:for-each>
            </ul>

	            <h2>New Property</h2>
	            <form name="addprop" method="post">
	                Name: <input name="propname"/><br/>
	                Value: <textarea name="propvalue" cols="80" rows="10"><xsl:text> </xsl:text></textarea>
	                <input accesskey="s"  type="submit"/>
	            </form>
	            
	            <h2>New Node</h2>
	            <form name="addnode" method="post">
	                Name: <input name="nodename"/><br/>
	                
	            </form>
	            
	        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>