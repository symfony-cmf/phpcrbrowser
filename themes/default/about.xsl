<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml" 
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    xmlns:lxcr="http://liip.to/lxcr"
    exclude-result-prefixes="xhtml i18n"
    version="1.0">
    <xsl:param name="dir" select="'/edit'"/>
    
    <xsl:template match="/">
        <xsl:apply-templates select="/command/node/content/html"/>
        
    </xsl:template>
    <xsl:template match="lxcr:siblings">
    
    <xsl:for-each select="/command/node/siblings/node[properties/property/name/text() = 'name']">
        <p>
            name: <xsl:value-of select="properties/property[name/text() = 'name']/value"/><br/>
            tel: <xsl:value-of select="properties/property[name/text() = 'tel']/value"/><br/>
            ort: <xsl:value-of select="properties/property[name/text() = 'ort']/value"/><br/>
            <img src="/webdav/{path}/bild.jpg" width="80"/>
        </p>
    </xsl:for-each>
    
    </xsl:template>
    
    <xsl:template match="*" >
        <xsl:element name="{local-name()}">
            <xsl:apply-templates select="@*" />
            <xsl:apply-templates />
        </xsl:element>
    </xsl:template>
    
    
    
    <xsl:template match="@*" >
        <xsl:copy-of select="."/>
    </xsl:template>
    
 </xsl:stylesheet>