<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" exclude-result-prefixes="xhtml">
    <xsl:import href="master.xsl"/>
    <xsl:import href="../standard/common.xsl"/>

    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
<LINK REL="stylesheet" TYPE="text/css" HREF="main.css"/>
   
<xsl:template name="content">
<xsl:choose>
<xsl:when test="count(/bx/plugin[@name='events']/events/event) = 1">
<xsl:call-template name="singleEvent"/> 
</xsl:when>
<xsl:otherwise>
<xsl:call-template name="overviewEvent"/> 
</xsl:otherwise>
</xsl:choose>
 </xsl:template>
 
<xsl:template name="overviewEvent">

<h1>EVENTS</h1>
    <table>
    <xsl:for-each select="/bx/plugin[@name='events']/events/event">
    <tr>
        <td>
        <xsl:value-of select="@title" />
        </td>
        <td>
        <xsl:value-of select="@von" />
        <xsl:choose>
            <xsl:when test = "string-length(@bis) &gt; 0 and @bis  != '0000-00-00'">
                - <xsl:value-of select="@bis" />
            </xsl:when>
            <xsl:otherwise>
                    
            </xsl:otherwise>
        </xsl:choose>
        </td>
        <td><a href="./{@uri}.html">[read more here]</a></td>   
    </tr>
    </xsl:for-each>
    </table>
    
</xsl:template>

<xsl:template name="singleEvent">
    <xsl:for-each select="/bx/plugin[@name='events']/events/event">
        <h2><xsl:value-of select="@title" /></h2>
        <p>Link: <a href="http://{@link}"><xsl:value-of select="@link" /></a></p>
        <p>vom: <xsl:value-of select="@von" /></p>
        <p>bis am: <xsl:value-of select="@bis" /></p>
        <p>
        <xsl:value-of select="description" />
        
        </p>
     </xsl:for-each>
</xsl:template>

 
    <!-- add everything from head to the output -->
    <xsl:template name="html_head">
        <xsl:apply-templates select="/bx/plugin[@name='xhtml']/xhtml:html/xhtml:head/node()" mode="xhtml"/>
    </xsl:template>
    
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
    
    
</xsl:stylesheet>
