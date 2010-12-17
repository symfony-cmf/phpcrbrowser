<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
 xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
 xmlns:php="http://php.net/xsl"
 xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" exclude-result-prefixes="xhtml i18n php">
    
    <xsl:param name="gallery_collUri" select="/bx/plugin[@name='gallery']/gallery/@collUri"/>    
        <xsl:param name="thumbWidth" select="100"/>
        <xsl:param name="largeWidth" select="430"/>

    <xsl:template name="gallery_displayGallery">
        <xsl:param name="gallery" select="''"/>
        
        <xsl:variable name="parameters" select="$gallery/parameters"/>
        <xsl:variable name="pager" select="$gallery/pager"/>
        <xsl:variable name="images" select="$gallery/images"/>
          <xsl:variable name="numCols" select="$parameters/parameter[@name='columnsPerPage']/@value"/>
          
         <xsl:choose>
            <xsl:when test="$gallery/@mode= 'page'">
            <div id="gallerie">
                    
                <xsl:for-each select="$images/image">
                
                <xsl:call-template name="gallery_displayImageSmall">
                    
                </xsl:call-template>
                <xsl:if test="position() mod $numCols = 0">
                <br class="antileft"/>
                </xsl:if>
                
                </xsl:for-each>
<xsl:if test="count($images/image) mod $numCols > 0">
                <br class="antileft" />
</xsl:if>
        </div>
        

        <br class="antifloat"/>
&#160;
            <!-- preview -->
            <xsl:call-template name="gallerie_preview"/>


            </xsl:when>

            <xsl:when test="$gallery/@mode = 'preview'">
            
                <div id="gallerie_preview">
                    <div id="gallerie_preview_title">
                        <i18n:text>Latest updated Gallery</i18n:text>: <xsl:value-of select="$gallery/@name" />
                    </div>
                        
                    <xsl:for-each select="$images/image">
                        
                        <xsl:call-template name="gallery_displayImageSmall">
                        
                        
                        </xsl:call-template>
                        
                        <xsl:if test="position() mod $numCols = 0">
                        <br class="antileft"/>
                        </xsl:if>

                    </xsl:for-each>
                    <xsl:if test="count($images/image) mod $numCols > 0">
                        <br class="antileft" />
                    </xsl:if>
                    
                  <div id="gallerie_preview_info">
                  <i18n:text>Show the whole gallery</i18n:text> (<xsl:value-of select="$gallery/pager/@numberOfEntries" /><xsl:text> </xsl:text><i18n:text>Pictures</i18n:text>)
                  </div>
                    
            <xsl:call-template name="gallery_displayPager">
                    <xsl:with-param name="gallery" select="$gallery"/> 
            </xsl:call-template>
                </div>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="gallery_displayImageLarge">
                    <xsl:with-param name="gallery" select="$gallery"/>
                </xsl:call-template>
            </xsl:otherwise>
            </xsl:choose>
           <!-- 
            <xsl:call-template name="comments"/>
           -->
    </xsl:template>

    
    <!-- displays the content of cell -->
    <xsl:template name="gallery_displayImageSmall">
        
        <xsl:variable name="href">
            <xsl:choose>
                <xsl:when test="starts-with(@href,'http://')">
                    <xsl:value-of select="@href"/>
                 </xsl:when>
                 <xsl:otherwise>
                    <xsl:value-of select="concat(../../@path, @href)"/>
                 </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:if test="@href != ''">
        <div class="thumbnail">
        <xsl:choose>
            <xsl:when test="@imgsrc">
                <a href="{@href}">
                    <img src="{@imgsrc}" border="0" alt="{@imgsrc}" />
                </a>
            </xsl:when>
            <xsl:when test="starts-with($href,'http://')">
            
                <a href="{@href}">
                    <img src="{$href}" border="0"  alt="{$href}"/>
                </a>
            </xsl:when>
            <xsl:otherwise>
                <a href="{$webrootLangW}{../../@collUri}{@href}">
                    <img src="{$webroot}dynimages/{$thumbWidth}/{$href}" border="0"  alt="{$href}"/>
                </a>             </xsl:otherwise>
        </xsl:choose>
<!-- this code would allow captions in overviews as well. commented out, 'cause we don't want that right now 
                    <br/>
                    <xsl:value-of select="text()"/>
-->
        </div>
        </xsl:if>
    </xsl:template>

    <xsl:template name="gallery_displayImageLarge">
        <xsl:param name="gallery" select="''"/>

      <p class="center">
            
            <xsl:choose>
            <xsl:when test="$gallery/@imageLink">
                <a href="{$gallery/@imageLink}"><xsl:call-template name="gallery_displayImageLargeImg">
                <xsl:with-param name="gallery" select="$gallery"/>
                </xsl:call-template>
                </a>
            </xsl:when>
            <xsl:otherwise>
            <xsl:call-template name="gallery_displayImageLargeImg">
                <xsl:with-param name="gallery" select="$gallery"/>
                </xsl:call-template>
            </xsl:otherwise>
         </xsl:choose>
         
            
          </p>
           <xsl:if test="$gallery/@imageDescription and string-length($gallery/@imageDescription) > 0">
          <p>
             <xsl:value-of select="$gallery/@imageDescription"/>
             </p>
             </xsl:if>
    </xsl:template>
    
    <xsl:template name="gallery_displayImageLargeImg">
     <xsl:param name="gallery" select="''"/>

       <xsl:choose>
   
            <xsl:when test="starts-with($gallery/@imageHref,'http://')">
            <a href="{$gallery/@imageHref}" target="singleimage"><img border="0" src="{$gallery/@imageHref}" alt="{$gallery/@imageTitle}"/></a>
            </xsl:when>
            <xsl:otherwise>
                <a href="{concat($webroot, $gallery/@path, $gallery/@imageHref)}" target="singleimage"><img border="0"  src="{concat($webroot, 'dynimages/',$largeWidth,'/', $gallery/@path, $gallery/@imageHref)}" alt="{$gallery/@imageTitle}"/></a>
                </xsl:otherwise>
                </xsl:choose>
                </xsl:template>
    
    <!-- displays the gallery pager depending on mode --> 
    <xsl:template name="gallery_displayPager">
        <xsl:param name="gallery" select="''"/>
        <xsl:choose>
            <xsl:when test="$gallery/@mode='page'">
                <xsl:call-template name="gallery_displayPagerPageMode">
                    <xsl:with-param name="gallery" select="$gallery"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$gallery/@mode='preview'">
                <xsl:call-template name="gallery_displayPagerPreviewMode">
                    <xsl:with-param name="gallery" select="$gallery"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="gallery_displayPagerImageMode">
                    <xsl:with-param name="gallery" select="$gallery"/>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

        <!-- displays the pager for the page mode -->
    <xsl:template name="gallery_displayPagerPageMode">
        <xsl:param name="gallery" select="''"/>

        <xsl:if test="$gallery/pager/@numberOfPages &gt; 1">
        <span class="right">
           <!-- <a href="?p=1">&lt;&lt;</a>&#160;-->
            
            <xsl:if test="$gallery/pager/@currentPage &gt; 1">
            <a href="?p={$gallery/pager/@prevPage}"><i18n:text>previous page</i18n:text></a>
            </xsl:if>
            [ <xsl:value-of select="$gallery/pager/@currentPage"/> <i18n:text>of</i18n:text> <xsl:value-of select="$gallery/pager/@numberOfPages"/> ] 
            
            <xsl:if test="$gallery/pager/@currentPage &lt; $gallery/pager/@numberOfPages">
            &#160;<a href="?p={$gallery/pager/@nextPage}"><i18n:text>next page</i18n:text></a>&#160;
            </xsl:if>
       <!--     <a href="?p={$gallery/pager/@numberOfPages}">&gt;&gt;</a>-->
            </span>
            
        </xsl:if>
    </xsl:template>
    
    <!-- displays the pager for the image mode -->
    <xsl:template name="gallery_displayPagerImageMode">
        <xsl:param name="gallery" select="''"/>
        <xsl:variable name="precedingImage" select="$gallery/images/image[@id=$gallery/@imageId]/preceding-sibling::*[1]"/>
        <xsl:variable name="followingImage" select="$gallery/images/image[@id=$gallery/@imageId]/following-sibling::*[1]"/>
        <xsl:variable name="currentImage" select="$gallery/images/image[@id=$gallery/@imageId]"/>
<span class="right">
 <xsl:if test="$precedingImage/@href != ''">
            <a href="{$precedingImage/@href}"><i18n:text>previous picture</i18n:text></a>
 </xsl:if>
 [ <xsl:value-of select="1 + count($currentImage/preceding-sibling::*)"/> <i18n:text>of</i18n:text> <xsl:value-of select="count($gallery/images/image)"/> ]
<xsl:if test="$followingImage/@href != ''">
            <a href="{$followingImage/@href}"><i18n:text>next picture</i18n:text></a>
            
            
        </xsl:if>
        </span>
        <a href="index.html?p={$gallery/pager/@currentPage}"><i18n:text>Back to overview</i18n:text></a>
        
        
        
    </xsl:template>
    
    <!-- displays the pager for the image mode -->
        <xsl:template name="gallery_displayPagerPreviewMode">
            <xsl:param name="gallery" select="''"/>
            
           <div id="gallerie_preview_navi">
            <a href="{$gallery/@collUri}"><i18n:text>Show gallery</i18n:text></a>
            </div>
            
            
    </xsl:template>
    
    <!-- displays a list containing all subalbums -->
    <xsl:template name="gallery_displaySubAlbums">
        <xsl:param name="gallery" select="''"/>
        <ul>
            <xsl:for-each select="$gallery/albums/album">
                <li><a href="{@href}"><xsl:value-of select="@name"/></a></li>
            </xsl:for-each>
        </ul>
    </xsl:template>
    
    <xsl:template match="albumTree/collection">
        <ul>
            <xsl:for-each select="items/*[(not(@lang) or @lang=$lang) and (not(filename) or filename!='index')]">
              <xsl:sort select="display-order" order="ascending" data-type="number"/>
                <xsl:variable name="link">
                    <xsl:choose>
                        <xsl:when test="not(ancestor::*[local-name() = 'albumTree'])"><xsl:value-of select="uri"/></xsl:when>
                        <xsl:when test="local-name()='collection'">
                            <xsl:value-of select="concat($gallery_collUri,uri)"/>
                        </xsl:when>
                          
                        <xsl:otherwise>./<xsl:value-of select="filename"/>.html</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <li>
                    <a href="{concat($webrootLangW,$link)}">
                        <xsl:if test="filename=$filename or $collectionUri = uri">
                            <xsl:attribute name="class">selected</xsl:attribute>
                        </xsl:if>
                        <xsl:value-of select="title"/>

                    </a>
                </li>

                <xsl:if test="local-name()='collection' and (@selected='all' or @selected = 'selected')">
                <xsl:apply-templates select="."/>
                </xsl:if>

            </xsl:for-each>
        </ul>

    </xsl:template>
    
    
    <xsl:template name="gallery_header">
        <xsl:param name="gallery" select="''"/>
        <xsl:choose>
            <xsl:when test="$gallery/@imageTitle and string-length($gallery/@imageTitle) > 0">
                <h1><xsl:value-of select="$gallery/@imageTitle"/></h1>           
            </xsl:when>
            <xsl:otherwise>
                <h1>
                <xsl:variable name="title" select="$navitreePlugin/collection/items//*[@selected='selected']"/>
                <xsl:value-of select="$title[position() = last()]/title"/>
                </h1>
            </xsl:otherwise>
         </xsl:choose>
         
   
    </xsl:template>
   
   <xsl:template name="html_head">
        <xsl:if test="php:function('bx_helpers_globals::GET','slideshow') = 1">  
            <xsl:variable name="gallery" select="/bx/plugin[@name = 'gallery']/gallery"/>
            <xsl:variable name="followingImage" select="$gallery/images/image[@id=$gallery/@imageId]/following-sibling::*[1]"/>
            <xsl:choose>
                <xsl:when test="$followingImage/@href != ''">
                   <meta http-equiv="refresh" content="5; URL=./{$followingImage/@href}?slideshow=1" />
                </xsl:when>
                <xsl:otherwise>
                    <meta http-equiv="refresh" content="5; URL=./{$gallery/images/image[position() = 1]/@href}?slideshow=1" />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:if>
   </xsl:template>
   
   <xsl:template name="gallerie_preview">
        <xsl:if test="/bx/plugin[@name='gallery']/gallery/albums/album/@preview">
        <hr/>
        <h1>Subgalleries</h1>
        <div class="subgallery_preview" style="margin:20px 0px 0px 25px;">
        
        <xsl:variable name="path" select="/bx/plugin[@name='gallery']/gallery/@path"/>
        <xsl:variable name="collUri" select="/bx/plugin[@name='gallery']/gallery/@collUri" />
        <xsl:for-each select="/bx/plugin[@name='gallery']/gallery/albums/album">
            <xsl:if test="@preview">
                <div style="margin-top:10px;">
                    <a href="{$gallery_collUri}{@name}">
                    <xsl:value-of select="@name"/>
                    <br/>
                        <img alt="preview" src="{$webroot}{$path}{@name}/{@preview}" width="150px"/>
                    </a>
                </div>
            </xsl:if>
        </xsl:for-each>
    </div>
    </xsl:if>
   </xsl:template>
</xsl:stylesheet>
