<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns="http://www.w3.org/1999/xhtml"
    >
    
    <xsl:param name="webroot" value="'/'"/>
    <xsl:param name="mode"/>
    <xsl:param name="requestUri"/>
    
    <xsl:variable name="repl">{}</xsl:variable>
    
    <xsl:template match="/">
        <html>
            <xsl:apply-templates select="xhtml:html"/>
        </html>
    </xsl:template>



</xsl:stylesheet>
