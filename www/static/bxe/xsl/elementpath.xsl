<root>
<xsl:template name="elementPath" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:param name="node" select="."/>
<xsl:for-each select="$node">
                <xsl:for-each select="(ancestor-or-self::*)">/*[<xsl:value-of select="1+count(preceding-sibling::*)"/>]</xsl:for-each>
                </xsl:for-each>
</xsl:template>

<xsl:template match="@__bxe_id" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:copy-of select="."/>
</xsl:template>
</root>