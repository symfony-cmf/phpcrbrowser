<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    xmlns="http://www.w3.org/1999/xhtml"
exclude-result-prefixes="xhtml i18n xsl"
    > 
    <xsl:output encoding="utf-8" method="xml"/>
    <xsl:param name="webroot" value="'/'"/>
     
     <xsl:template match="/">
        <xsl:copy-of select="."/>
    </xsl:template>
    
</xsl:stylesheet>
