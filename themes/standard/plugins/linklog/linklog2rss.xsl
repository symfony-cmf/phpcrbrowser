<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"

xmlns:creativeCommons="http://backend.userland.com/creativeCommonsRssModule"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
 xmlns:xhtml="http://www.w3.org/1999/xhtml" 
 xmlns:content="http://purl.org/rss/1.0/modules/content/" 
 xmlns:dc="http://purl.org/dc/elements/1.1/" 
 xmlns:php="http://php.net/xsl"
 
 >

    <xsl:output method="xml" indent="yes" omit-xml-declaration="no"/>
    <xsl:param name="webroot"/>
    <xsl:param name="webrootLang"/>
    <xsl:param name="collectionUri"/>
    <xsl:variable name="linklogroot" select="concat(substring($webroot,1,string-length($webroot)-1),$collectionUri)"/>
    <xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/> 
  
    <xsl:template match="/">
        <rss version="2.0" xmlns:blogChannel="http://backend.userland.com/blogChannelModule">
            <channel>
                <title><xsl:value-of select="$sitename"/> - Linklog</title>
                <link><xsl:value-of select="$linklogroot"/></link>
                <description>collected links</description>
                <generator>Flux CMS - http://www.flux-cms.org</generator>
				<!-- apply the items -->
				<xsl:apply-templates select="/bx/plugin[@name='linklog']/links/link" mode="links"/>    
            </channel>
        </rss>
    </xsl:template>
     <xsl:template match="text()" mode="xhtml">
     	<xsl:value-of select="php:functionString('htmlspecialchars',.,0,'UTF-8')"  />
    </xsl:template>
     
<!-- here is the single item: -->    
    			<xsl:template match="link" mode="links">
                    <item>
                        <title>
                            <xsl:value-of select="title"/>
                        </title>
                        <link><xsl:value-of select="url"/></link>   

						<!-- howto insert some html here? -->
                        <content:encoded xmlns="http://www.w3.org/1999/xhtml">
                            <xsl:apply-templates select="description/text()" mode="xhtml"/>
                        </content:encoded>  
                        
                        <dc:date><xsl:value-of select="isotime"/></dc:date>

                        <!-- Tags -->
                        <xsl:for-each select="tags/tag">
                            <dc:subject><xsl:value-of select="name"/></dc:subject>
                        </xsl:for-each>                        

                    </item>
		</xsl:template>


<!-- wtf does all this? -->
    <xsl:template match="*" mode="xhtml">&lt;<xsl:value-of select="local-name()"/>
        <xsl:apply-templates select="@*" mode="xhtml"/>&gt;<xsl:apply-templates mode="xhtml"/>&lt;/<xsl:value-of select="local-name()"/>&gt;</xsl:template>

    <xsl:template match="*[not(node())]" mode="xhtml">&lt;<xsl:value-of select="local-name()"/>
        <xsl:apply-templates select="@*" mode="xhtml"/>/&gt;</xsl:template>

    <xsl:template match="@*" mode="xhtml">
        <xsl:text> </xsl:text>
        <xsl:value-of select="local-name()"/>="<xsl:value-of select="." />"
    </xsl:template>
    
    <xsl:template match="text()" mode="xhtml">
     <xsl:value-of select="php:functionString('htmlspecialchars',.,0,'UTF-8')"  />
    </xsl:template>
    

</xsl:stylesheet>
