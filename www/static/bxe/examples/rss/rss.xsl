<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:content="http://purl.org/rss/1.0/modules/content/"
 xmlns:xhtml="http://www.w3.org/1999/xhtml"
 xmlns:dc="http://purl.org/dc/elements/1.1/"  
content:ns=""
xhtml:ns=""
dc:ns=""
>
    
    <xsl:template match="content:encoded">
        <p class="content">
       
            <xsl:apply-templates/>
        </p>
    </xsl:template>

    <xsl:template match="/">
        <html>
            <body>
            <div id="container">
            <div id="content">
                <xsl:apply-templates/>
            </div>
            </div>
            </body>
            
        </html>
    </xsl:template>


    <xsl:template match="*|xhtml:a">
        
        <span class="{local-name()}">
        
            <xsl:apply-templates/>
        </span>
    </xsl:template>


    <xsl:template match="channel/link">

        <p>
            Homepage-URL: <xsl:value-of select="."/>
        </p>
    </xsl:template>

    <xsl:template match="channel/description">

        <p>
            Description: <xsl:value-of select="."/>
        </p>
    </xsl:template>
    
    <xsl:template match="channel/title">
        <h1>
            <xsl:value-of select="."/>
        </h1>
   
   </xsl:template>
    <xsl:template match="item">
        <h2 class="post_title">
            <xsl:value-of select="title"/>
        </h2>
        <div class="post_meta_data">
        <span class="right">
        <xsl:for-each select="dc:subject">
        ( <xsl:value-of select="."/> )
        </xsl:for-each> 
        </span>
        <xsl:value-of select="dc:creator"/> @
        <xsl:value-of select="dc:date"/>
        </div>
        <div class="post_content">
            <xsl:apply-templates select="content:encoded"/>
        </div>
        <div class="post_links">
        Permalink: <xsl:value-of select="link"/>
        </div>
    </xsl:template>
    


    <xsl:template match="xhtml:*">
        <xsl:element name="{local-name()}">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>


</xsl:stylesheet>