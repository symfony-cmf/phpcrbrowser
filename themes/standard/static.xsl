<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
    <xsl:template match="/">

        <html>

            <xsl:call-template name="htmlhead"/>
            <body>
            <h3> Site Title </h3>
                <xsl:call-template name="bodyhead"/>
<hr noshade="noshade"/>
                <xsl:call-template name="tree"/>
<hr noshade="noshade"/>
                <xsl:call-template name="middlecol"/>
                
                <xsl:call-template name="footer"/>

            </body>
        </html>
    </xsl:template>
    

    <xsl:template name="middlecol">
        <div id="content">
            <xsl:copy-of select="/bx/plugin[@name='xhtml']/xhtml:html/xhtml:body"/>
        </div>
    </xsl:template>
    
   <xsl:template name="tree">
   
    <xsl:for-each select="/bx/plugin[@name='tree']/tree/item[@mimetype='httpd/unix-directory']">
   <a href="{.}/"><xsl:value-of select="."/>/</a> | 
   </xsl:for-each>
   
   
   
   <xsl:for-each select="/bx/plugin[@name='tree']/tree/item[@mimetype='text/html']">
   <a href="{.}.html"><xsl:value-of select="."/></a> | 
   </xsl:for-each>
   </xsl:template>
   
   
 <xsl:template name="bodyhead">
 </xsl:template>
    <xsl:template name="htmlhead">

        <head>
            <title>
BXCMSNG -                 <xsl:call-template name="htmlheadtitle"/>
            </title>
        </head>
    </xsl:template>
    
    
    <xsl:template name="htmlheadtitle">
        <xsl:value-of select="/bx/plugin[@name='xhtml']/xhtml:html/xhtml:head/xhtml:title"/>
    </xsl:template>

    <xsl:template name="footer">
    <hr noshade="noshade"/>
    <xsl:if test="/bx/plugin[@name='time']/xhtml:html/xhtml:body">
    It's now    <xsl:value-of select="/bx/plugin[@name='time']/xhtml:html/xhtml:body"/>
    </xsl:if>
    </xsl:template>
</xsl:stylesheet>
