<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

    <xsl:param name="webroot" value="'/'"/>
    <xsl:param name="mode"/>
    <xsl:param name="requestUri"/>
    
    <xsl:template match="/">
        <xsl:apply-templates select="/bx/plugin[@name='admin_dbforms2']/*" mode="xhtml"/>
    </xsl:template>

    <xsl:template match="*" mode="xhtml">
        <xsl:element name="{local-name()}">
            <xsl:apply-templates select="@*" mode="xhtml"/>
            <xsl:apply-templates mode="xhtml"/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="@*" mode="xhtml">
        <xsl:copy-of select="."/>
    </xsl:template>

</xsl:stylesheet>
