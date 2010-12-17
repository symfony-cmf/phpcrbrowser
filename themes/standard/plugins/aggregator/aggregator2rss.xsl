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
        <title><xsl:value-of select="$sitename"/> - RSS Aggregator</title>
        <description>RSS Aggregator of  <xsl:value-of select="$sitename"/> </description>
        <link><xsl:value-of select="$webrootW"/><xsl:value-of select="$collectionUri"/></link>
        <generator>Flux CMS - http://www.flux-cms.org</generator>
            <xsl:for-each select="/bx/plugin[@name='aggregator']/feeds/feed">
                <item><title>
                    <xsl:value-of select="title"/>
                </title>
                <dc:creator>
                    <xsl:value-of select="name"/>
                </dc:creator>
                <dc:date>
                    <xsl:value-of select="dateiso"/>
                </dc:date>
                <guid isPermaLink="false"><xsl:value-of select="link"/></guid>
                <link>
                
                    <xsl:value-of select="link"/>
                </link>
                <content:encoded>
                    <xsl:value-of select="content"/>
                </content:encoded>
                </item>
            </xsl:for-each>
         </channel>
     </rss>
</xsl:template>
</xsl:stylesheet>
