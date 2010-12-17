<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"

xmlns:creativeCommons="http://backend.userland.com/creativeCommonsRssModule"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:blog="http://bitflux.org/doctypes/blog" xmlns:php="http://php.net/xsl"
xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">

    
    <xsl:output method="xml" indent="yes" omit-xml-declaration="no"/>
    <xsl:param name="collectionUri"/>

    <xsl:param name="webroot"/>
<xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/>
    <xsl:variable name="webrootW" select="substring($webroot,1,string-length($webroot)-1)"/>
<xsl:template match="/">
    <rss version="2.0">
        <channel>
        <title><xsl:value-of select="$sitename"/> - Document Managment System</title>
        <description>DMS of  <xsl:value-of select="$sitename"/> </description>
        <link><xsl:value-of select="$webrootW"/><xsl:value-of select="$collectionUri"/></link>
        <generator>Flux CMS - http://www.flux-cms.org</generator>
        <xsl:choose>
            <xsl:when test="/bx/plugin[@name='dms']/dms[@type='file']">
                <xsl:for-each select="/bx/plugin[@name='dms']/dms[@type='file']/logs/log">
                    <item>
                    <title><xsl:value-of select="action"/> <xsl:text> </xsl:text><xsl:value-of select="title"/> </title>
                    <dc:creator>
                        <xsl:value-of select="author"/>
                    </dc:creator>
                    <dc:date>
                        <xsl:value-of select="date"/>
                    </dc:date>
                    <link>
                        <xsl:value-of select="../../item/file/filelink"/>#rev_<xsl:value-of select="rev"/>  
                    </link>
                    <content:encoded>
                    <xsl:choose>
                    <xsl:when test="msg/text()">
                        <xsl:value-of select="msg"/>
                    </xsl:when>
                    <xsl:otherwise>
                        No log message provided.
                        </xsl:otherwise>
                        </xsl:choose>
                    </content:encoded>
                    </item>
                </xsl:for-each>
            </xsl:when>
            <xsl:when test="/bx/plugin[@name='dms']/dms[@type='dir']">
                <xsl:for-each select="/bx/plugin[@name='dms']/dms[@type='dir']/logs/log">
                    <item>
                    <title><xsl:value-of select="action"/> <xsl:text> </xsl:text><xsl:value-of select="title"/> </title>
                    
                    <dc:creator>
                        <xsl:value-of select="author"/>
                    </dc:creator>
                    <dc:date>
                        <xsl:value-of select="date"/>
                    </dc:date>
                    <link>
                        <xsl:value-of select="title"/>
                    </link>
                    <content:encoded>
                    
                        <xsl:value-of select="msg"/>
                    </content:encoded>
                    </item>
                </xsl:for-each>
            </xsl:when>
            </xsl:choose>
        </channel>
     </rss>
</xsl:template>
</xsl:stylesheet>
