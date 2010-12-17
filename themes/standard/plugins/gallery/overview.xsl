<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
     xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
     xmlns:php="http://php.net/xsl"
     xmlns:xhtml="http://www.w3.org/1999/xhtml"
     xmlns="http://www.w3.org/1999/xhtml"
     exclude-result-prefixes="xhtml i18n php">


    <xsl:param name="thumbWidth" select="100"/>
    <xsl:param name="numCols" select="4"/>


    <xsl:template name="gallery_header">
        <xsl:param name="gallery" select="''"/>

        <h1>
            <xsl:value-of select="$gallery/parentName" />
        </h1>
    </xsl:template>


    <xsl:template name="gallery_displayGallery">
        <xsl:param name="gallery" select="''"/>

        <div id="gallerie">
            <xsl:for-each select="$gallery/album">

                <div class="thumbnail">
                    <a>
                        <xsl:attribute name="href">
                            <xsl:value-of select="link" />
                        </xsl:attribute>
                        <img border="0">
                            <xsl:attribute name="src">
                                /dynimages/<xsl:value-of select="$thumbWidth" />/<xsl:value-of select="showPicture" />
                            </xsl:attribute>
                        </img>
                    </a>

                    <a class="gallery">
                        <xsl:attribute name="href">
                            <xsl:value-of select="link" />
                        </xsl:attribute>
                        <xsl:value-of select="displayName" />
                    </a>

                </div>

                <xsl:if test="position() mod $numCols = 0">
                    <br class="antileft" />
                </xsl:if>

            </xsl:for-each>
        </div>

    </xsl:template>


</xsl:stylesheet>
