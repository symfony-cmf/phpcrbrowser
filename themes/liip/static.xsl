<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:xhtml="http://www.w3.org/1999/xhtml" 
xhtml:ns=""

i18n:ns=""
xmlns="http://www.w3.org/1999/xhtml" exclude-result-prefixes="xhtml">
    <xsl:import href="master.xsl"/>
    
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
    
    <xsl:template name="content">
        <xsl:apply-templates select="/bx/plugin[@name='xhtml']/xhtml:html/xhtml:body/xhtml:div[@id = 'content']" mode="xhtml"/>
       <!-- 
                <xsl:if test="/bx/plugin[@name='metadata']/properties/post_title/text()">
                    <h1><xsl:value-of select="/bx/plugin[@name='metadata']/properties/post_title/text()"/></h1>
                    
                </xsl:if>
                
	    
        <xsl:apply-templates select="/bx/plugin[@name='xhtml']/xhtml:html/xhtml:body/xhtml:div[@id = 'content']/node()" mode="xhtml"/>
        
-->
    </xsl:template>
    
    <xsl:template match="xhtml:div[@id='content']" mode="xhtml">
        
        <xsl:apply-templates mode="xhtml"/> 
        
    </xsl:template>
    
    <!-- add everything from head to the output -->
<!--    <xsl:template name="html_head">
        <xsl:apply-templates select="/bx/plugin[@name='xhtml']/xhtml:html/xhtml:head/node()" mode="xhtml"/>
    </xsl:template>
    -->
    <!-- except the title -->
    <xsl:template match="xhtml:head/xhtml:title" mode="xhtml">
    </xsl:template>

    <!-- except the links -->
    <xsl:template match="xhtml:head/xhtml:link" mode="xhtml">
    </xsl:template>
    
    <!-- do not output meta tags without @content -->
    <xsl:template match="xhtml:head/xhtml:meta[not(@content)]" mode="xhtml">
    </xsl:template>
    
    <xsl:template name="body_attributes">
    <xsl:apply-templates select="/bx/plugin[@name='xhtml']/xhtml:html/xhtml:body/@*" mode="xhtml"/>
    </xsl:template>
    
    <xsl:template match="xhtml:div[@id='newsletter_groups']" mode="xhtml">
        <xsl:for-each select="/bx/plugin[@name='newsletter']/newsletter/group">
        	<input type="checkbox" name="groups[]" checked="checked" value="{@id}"/>
        	<xsl:value-of select="."/><br/>
        </xsl:for-each>
    </xsl:template>
    
    
    <!-- AUS ../standard/common.xsl ZUM TESTEN -->
    
    <xsl:template match="/|comment()|processing-instruction()" mode="xhtml">
        <xsl:copy>
            <xsl:apply-templates mode="xhtml"/>
        </xsl:copy>
    </xsl:template>
    
    <!-- translate links from filename.lang.ext to filename.html -->
   
    
    <xsl:template match="*" mode="xhtml">
        <xsl:element name="{local-name()}">
            <xsl:apply-templates select="@*" mode="xhtml"/>
            <xsl:apply-templates mode="xhtml"/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template name="contentRight">
        
        
        <xsl:apply-templates select="/bx/plugin[@name='xhtml']/xhtml:html/xhtml:body/xhtml:div[@id = 'right']/node()" mode="xhtml"/>
        
        
    </xsl:template>
    
    <xsl:template match="@*" mode="xhtml">
        <xsl:copy-of select="."/>
    </xsl:template>

    <xsl:template name="littleLogin">
       
    </xsl:template>
    
    
</xsl:stylesheet>
