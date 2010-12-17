<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:blog="http://bitflux.org/doctypes/blog" xmlns:bxf="http://bitflux.org/functions" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rss="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" exclude-result-prefixes="xhtml">

    
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

    <xsl:template name="content">
        <xsl:call-template name="feeds"/>
    </xsl:template>

   <xsl:template name="html_head">      
       <meta name="robots" content="noindex, nofollow"/>
    </xsl:template>

    <xsl:template name="feeds">
        <xsl:for-each select="/bx/plugin[@name='aggregator']/feeds/feed">
            <h2 class="post_title">
                <a href="{link}">
                    <xsl:value-of select="title"/>
                </a>
            </h2>
            <div class="post_meta_data">
                by <xsl:value-of select="name"/> 
                @ <xsl:value-of select="date"/>
            </div>
            <p>
                <xsl:value-of disable-output-escaping="yes" select="content"/>
            </p>
            <div class="post_links">
                <a href="{link}">Link to Post</a>
            </div>
        </xsl:for-each>
        <span class="right">
            <a href="{/bx/plugin[@name='aggregator']/feeds/span/a/@href}">
                <xsl:value-of select="/bx/plugin[@name='aggregator']/feeds/span/a"/>
            </a>
        </span>
    </xsl:template>
</xsl:stylesheet>

