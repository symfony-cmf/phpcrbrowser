
<xsl:stylesheet version="1.0" xmlns:bxf="http://bitflux.org/functions" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml"

 exclude-result-prefixes="bxf xhtml"
>

    <xsl:import href="master.xsl"/>
    <xsl:import href="../standard/plugins/gallery.xsl"/>
    
    <xsl:output encoding="utf-8" method="xml"/>
    
    
    <xsl:param name="thumbWidth" select="100"/> 
    <xsl:param name="largeWidth" select="480"/>
    
    <xsl:template name="leftnavi">
     <xsl:apply-templates select="$navitreePlugin/collection/items/collection[@selected = 'selected']"/>
     <div id="googleAd" class="tall"/>
<!--        <xsl:apply-templates select="/bx/plugin[@name = 'gallery']/gallery/albumTree/collection"/>-->
    </xsl:template>

    <xsl:template name="content">
        <xsl:variable name="gallery" select="/bx/plugin[@name = 'gallery']/gallery"/>
         
        
        <xsl:call-template name="gallery_header">
        <xsl:with-param name="gallery" select="$gallery"/> 
        </xsl:call-template>
     <p>
            <xsl:call-template name="gallery_displayPager">
                <xsl:with-param name="gallery" select="$gallery"/> 
            </xsl:call-template>
&#160;     </p>

        <xsl:call-template name="gallery_displayGallery">
            <xsl:with-param name="gallery" select="$gallery"/> 
        </xsl:call-template>
        
    </xsl:template>

</xsl:stylesheet>
