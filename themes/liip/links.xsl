<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" exclude-result-prefixes="xhtml">
    <xsl:import href="master.xsl"/>
    <xsl:import href="../standard/common.xsl"/>

    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

    <xsl:template name="content">
        <h1>Links</h1>
        <!-- loop through categories -->
        <xsl:variable name="style" select="/bx/plugin[@name='links']/links/@style"/>

        <xsl:choose>
            <xsl:when test="$style = 'delicious'">
                <xsl:apply-templates select="/bx/plugin[@name='links']/links/result/row" mode="links"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="/bx/plugin[@name='links']/links/result/row" mode="links">
        <!-- select name of the category -->
                    <h2>
            <!-- we want to make it possible, to only show links from one category.
                 We use the id for that, we could do nice uris for a more advanced version...
                 $webrootLangW is to webroot with the language part and without the trailing slash
                 $collectionUri is the path of the collection
                 id is the id of the category
             -->
                        <a href="{$webrootLangW}{$collectionUri}category/{id}.html">
                            <xsl:value-of select="name"/>
                        </a>
                    </h2>

                    <xsl:apply-templates select="row"/>

                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>
    <xsl:template match="row" mode="links">
    
                <!-- and print them -->
        <p>
            <a href="{link}">
                <xsl:value-of select="text"/>
            </a>
                    <!-- if there is a description, show it-->
            <xsl:if test="string-length(description)>0">
                <br/>
                <xsl:value-of select="description"/>
            </xsl:if>
            <br/>
            
            <xsl:if test="tag">
                    Tags:
                    <xsl:for-each select="tag">
                    <a rel="tag" href="{$webrootLangW}{$collectionUri}tag/{.}.html"><xsl:value-of select="."/>
                    </a>
                    <xsl:text> </xsl:text>
                </xsl:for-each>
            </xsl:if>
            <xsl:if test="string-length(date) &gt; 0">
            on <xsl:value-of select="date"/>
            </xsl:if>
            <xsl:if test="related">
                <br/>Related Entries:
                    <xsl:for-each select="related">
                    <a title="{@title}" href="{$webrootLangW}{@href}"><xsl:value-of select="."/>
                    </a>
                    <xsl:if test="position() != last()"> | </xsl:if>
                </xsl:for-each>
            </xsl:if>
        </p>
   

    </xsl:template>

</xsl:stylesheet>
