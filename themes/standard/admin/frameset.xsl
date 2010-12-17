<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns:php="http://php.net/xsl"
    
    exclude-result-prefixes="php xhtml"
    >
    

<xsl:param name="id" select="id"/>
<xsl:param name="editor" select="editor"/>
<xsl:param name="webroot" select="'/'"/>
<xsl:param name="edit" select="''"/>
<xsl:template match="/">
<xsl:choose>
<xsl:when test="php:functionString('bx_helpers_globals::isSessionCookieSet') != 'false'">
    <xsl:apply-templates />
    </xsl:when>
    <xsl:otherwise>
    <h1>You don't have Cookies enabled for this domain. </h1>
    The admin of Flux CMS needs to be able to set a session cookie, otherwise it doesn't work.<br/>
    Please enable (session)-cookies at least for this domain.<br/>
    </xsl:otherwise>
    </xsl:choose>
</xsl:template>

<xsl:template match="/xhtml:html/xhtml:frame[@name='edit']">

</xsl:template>

<xsl:template match="*">
    <xsl:copy>
        <xsl:for-each select="@*">
            <xsl:copy/>
        </xsl:for-each>
        
        <xsl:apply-templates/> 
    </xsl:copy>
</xsl:template>

<xsl:template match="*[local-name()='frame' and @name='navi']">
     <frame name="navi" scrolling="auto">
        <xsl:attribute name="src">
            <xsl:value-of select="concat($webroot,'admin/navi/', $id)"/>
        </xsl:attribute>
     </frame>
</xsl:template>

<xsl:template match="*[local-name()='script']">
<script src="{$webroot}{@src}"><xsl:text> </xsl:text> </script>

</xsl:template>


<xsl:template match="*[local-name()='frame' and @name='edit']">
    <frame name="edit" id="edit">
        <xsl:attribute name="src">
            <xsl:choose>
                <xsl:when test="not($id='')">
                    <xsl:value-of select="concat($webroot,'admin/edit', $id, '&#38;editor=', $editor)"/>
                </xsl:when>
                
                <xsl:when test="not($edit='') and (not(starts-with($edit,'http')) or starts-with($edit,$webroot))">
                    <xsl:value-of select="$edit"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$webroot"/><xsl:text>admin/overview/</xsl:text>  
                </xsl:otherwise>
            </xsl:choose>
        </xsl:attribute>
    </frame>
</xsl:template>

<xsl:template match="/html/head/title">
<title><xsl:value-of select="php:functionString('bx_helpers_config::getOption','sitename')"/> Admin - Flux CMS</title>
</xsl:template>

</xsl:stylesheet>
