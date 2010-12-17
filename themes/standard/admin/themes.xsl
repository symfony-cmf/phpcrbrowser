<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    xmlns="http://www.w3.org/1999/xhtml"
exclude-result-prefixes="xhtml i18n xsl"
    > 
    <xsl:param name="webroot" value="'/'"/>
    <xsl:variable name="pluginName" select="/bx/plugin/@name"/>
     
     <xsl:template match="/">
        <html>
            <xsl:choose>
            <xsl:when test="/bx/plugin[@name='admin_themes']/installed">
                <head><title><i18n:text>Themes</i18n:text></title>
                <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/formedit.css"/>
                </head>
            </xsl:when>
            <xsl:otherwise>
                <head><title><i18n:text>Themes</i18n:text></title>
                <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/formedit.css"/>
                </head>
            </xsl:otherwise>
            </xsl:choose>
            <body>
                <h2 class="page">Themes</h2>
                <p style="padding-left: 20px; font-style: italic;">Here we provide you the opportunity to install new themes to your Flux CMS installation. 
                You can take a look on a preview by a click on "preview" and install the theme with the install link.<br/>
                Caution: The themes are automatically activated and will overwrite some of your (maybe adjusted) files.</p>
                <xsl:apply-templates/>
                <xsl:if test="/bx/plugin[@name='admin_themes']/installed or /bx/plugin[@name='admin_themes']/notinstalled">
                    <a href="{$webroot}admin/themes/">Go back!</a>
                </xsl:if>
           </body>
        </html>
    </xsl:template>
     
     
    <xsl:template match="plugin[@name='admin_addresource'] | plugin[@name='admin_siteoptions']">
        <form name="adminform" action="" method="POST" enctype="multipart/form-data">
            <xsl:apply-templates select="/bx/plugin/fields/field"/>
            <p>
                <input accesskey="s" type="submit" name="send" value="send"/>
            </p>
        </form>
    </xsl:template> 
    
    <xsl:template match="bx/plugin[@name='admin_themes']/themes">
        <table>
        <xsl:for-each select="theme">
            <tr>
                <td>
                    <img alt="Preview Picture" src="{picLink}" width="150px"/>
                </td>
                <td>
                    <h3><xsl:value-of select="title"/></h3>
                    <p>Provided by: <a href="{authorLink}" target="_blank"><xsl:value-of select="author"/></a></p>
                    <p><a href="{$webroot}admin/themes/?downloadlink={downloadLink}">install and activate</a></p>
                    <p><a href="{view}" target="_blank">preview</a></p>
                </td>
            </tr>
        </xsl:for-each>
        </table>
    </xsl:template>
    
</xsl:stylesheet>
