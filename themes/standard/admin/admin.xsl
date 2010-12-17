<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

    <xsl:include href="plugins/properties.xsl"/>

    <xsl:template match="/">
        <html>
            <xsl:call-template name="htmlhead"/>
            <body>
                <xsl:call-template name="bodyhead"/>
                <xsl:call-template name="middlecol"/>
                <xsl:call-template name="footer"/>
            </body>
        </html>
    </xsl:template>
    

    <xsl:template name="middlecol">
        <div id="admincontent">
            <xsl:call-template name="plugins"/>
        </div>
    </xsl:template>
    
   
 <xsl:template name="bodyhead">
 </xsl:template>
    <xsl:template name="htmlhead">

        <head>
            <title>
                Flux CMS - <xsl:call-template name="htmlheadtitle"/>
            </title>
           
            <xsl:call-template name="admincss"/>
            
        </head>
    </xsl:template>
    
    
    <xsl:template name="htmlheadtitle">
        <xsl:value-of select="/bx/plugin[1]/@name"/>
    </xsl:template>

    <xsl:template name="footer">
    </xsl:template>

    <xsl:template name="plugins">
        <xsl:apply-templates select="/bx/plugin"/>
    </xsl:template>
    
    <xsl:template name="admincss">
        <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/admin.css"/> 
    </xsl:template>
    
</xsl:stylesheet>
