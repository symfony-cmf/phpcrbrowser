<xsl:stylesheet version="1.0"

xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:php="http://php.net/xsl"
>
<xsl:param name="webroot"/>
<xsl:param name="collectionUri"/>
<xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/>
<xsl:variable name="blogroot" select="concat(substring($webroot,1,string-length($webroot)-1),$collectionUri)"/>
<xsl:variable name="blogname" select="php:functionString('bx_helpers_config::getOption','blogname')"/>
    <xsl:variable name="dctitle">
        <xsl:choose>
            <xsl:when test="string-length($blogname) &gt; 0">
                <xsl:value-of select="$blogname"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$sitename"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
<xsl:template match="/">


<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
    <ShortName><xsl:value-of select="$dctitle"/></ShortName>
    <Description>Search for <xsl:value-of select="$dctitle"/></Description>
    <InputEncoding>UTF-8</InputEncoding>
    <Image width="16" height="16"><xsl:value-of select="$webroot"/>favicon.ico</Image>
    <Url type="text/html" method="GET" template="{$blogroot}?q={{searchTerms}}">
        
    </Url>
    <Url type="application/rss+xml" method="GET" template="{$blogroot}rss.xml?q={{searchTerms}}">
        
    </Url>

    <Url type="application/x-suggestions+json" method="GET" template="{$webroot}inc/bx/php/livesearch.php?mode=json&amp;q={{searchTerms}}"/>

    <SearchForm><xsl:value-of select="$blogroot"/></SearchForm> 
</OpenSearchDescription>

</xsl:template>

</xsl:stylesheet>