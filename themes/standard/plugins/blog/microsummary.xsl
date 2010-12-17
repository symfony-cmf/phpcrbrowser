<xsl:stylesheet version="1.0"

 xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
xmlns:blog="http://bitflux.org/doctypes/blog" xmlns:bxf="http://bitflux.org/functions" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rss="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" exclude-result-prefixes="php blog bxf xhtml rdf rss dc i18n">
<xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/>
<xsl:variable name="blogname" select="php:functionString('bx_helpers_config::getOption','blogname')"/>
<xsl:template match="/">
<xsl:choose>
            <xsl:when test="string-length($blogname) &gt; 0">
                <xsl:value-of select="$blogname"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$sitename"/>
            </xsl:otherwise>
        </xsl:choose>: <xsl:value-of select="/bx/plugin[@name='blog']/xhtml:html/xhtml:body/xhtml:div[1]/xhtml:h2[1]/text()"/>
</xsl:template>

</xsl:stylesheet>