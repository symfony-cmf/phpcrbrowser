<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:blog="http://bitflux.org/doctypes/blog" xmlns:php="http://php.net/xsl">

    <xsl:output method="xml" indent="yes" omit-xml-declaration="no"/>
    <xsl:param name="webroot"/>
    <xsl:param name="webrootLang"/>
    <xsl:param name="collectionUri"/>
    <xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/>
    <xsl:variable name="sitedescription" select="php:functionString('bx_helpers_config::getOption','sitedescription')"/>
    <xsl:variable name="params" select="/bx/plugin[@name='metainfo']/metainfos/params"/>
   
    <xsl:template match="/">
        <rss version="2.0" xmlns:blogChannel="http://backend.userland.com/blogChannelModule">
            <channel>
                <title>
                    <xsl:choose>
                        <xsl:when test="$params/title and not($params/title='')">
                            <xsl:value-of select="$params/title"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat($sitename,' - podcast')"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </title>
                <link>
                    <xsl:choose>
                        <xsl:when test="$params/link and not($params/link='')">
                            <xsl:value-of select="$params/link"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="$webroot"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </link>
                <description>
                    <xsl:choose>
                        <xsl:when test="$params/desc and not($params/desc='')">
                            <xsl:value-of select="$params/desc"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="$sitedescription"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </description>
                <generator>Bitflux CMS</generator>  
                <xsl:apply-templates select="/bx/plugin[@name='metainfo']/metainfos/result/row">
                    <xsl:sort select="date"/>
                </xsl:apply-templates>
            </channel>
        </rss>
    </xsl:template>
   
    <xsl:template match="row">
        <item>
            <title><xsl:value-of select="concat(Artists,' - ',Name)"/></title>
            <description><xsl:value-of select="Comment"/></description>
            <pubDate><xsl:value-of select="php:functionString('bx_helpers_date::getRFCDate',date)"/></pubDate>
            <enclosure url="{concat($webroot,path)}" type="{mimetype}" length="{filesize}"/>
            <category><xsl:value-of select="Genre"/></category> 
            <guid><xsl:value-of select="concat($webroot, path)"/></guid>
        </item>
    </xsl:template>

</xsl:stylesheet>
