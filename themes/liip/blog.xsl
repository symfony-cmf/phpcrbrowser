<xsl:stylesheet version="1.0"
        xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
        xmlns:blog="http://bitflux.org/doctypes/blog" xmlns:bxf="http://bitflux.org/functions" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rss="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" exclude-result-prefixes="php blog bxf xhtml rdf rss dc i18n">
    <xsl:import href="../standard/common.xsl"/>
    <xsl:import href="master.xsl"/>
    <xsl:import href="../standard/plugins/blog.xsl"/>

    
    <!-- 
    
    if you want to change some of the blog xsl-templates, look at
    themes/standard/plugins/blog.xsl, copy those you want to change into this file
    and change them.
    
    This will overwrite the standard templates.
    
    We do not advise to change stuff in themes/standard/, but to overwrite/extend them 
    here, as this will make future upgrades much easier. 
    
    -->
    
     <xsl:template name="leftnavi">
        <xsl:call-template name="leftnavi2"/>
    </xsl:template>

   <xsl:template name="body_attributes">
    </xsl:template>
   
<xsl:template name="contentRight">
		<xsl:call-template name="latestNews"/> 
        
	</xsl:template>
    
        <xsl:template match="xhtml:div[ @class='comments_not']" mode="xhtml">
    
        
    </xsl:template>
    
       <xsl:template match="xhtml:div[@class = 'comments']" mode="xhtml">
    <xsl:if test="not(../xhtml:div[@class='comments_not'])">    
    <h3 class="blog">
            <i18n:text i18n:key="blogComments">Comments</i18n:text>
        </h3>
        <xsl:apply-templates mode="xhtml"/>
        </xsl:if>
        <xsl:if test="not(../xhtml:div[@class='comments_not'])">

            <h3 class="blog">
                <i18n:text>add a comment</i18n:text>
            </h3>
            <xsl:if test="../@blog:post_trackbacks_allowed = 1">

                <!--<p>
                    <i18n:text i18n:key="blockTrackbackUrl">The Trackback URL to this post is</i18n:text>:<br/>
                    <xsl:value-of select="concat($webrootW,$collectionUri,'plugin=trackback(',substring-after(../@id,'entry'),').xml')"/>
                    <br/>
                    <i18n:text i18n:key="blockTrackbackModerated">Trackbacks are moderated.</i18n:text>
                </p>-->
            </xsl:if>
            <p>
                <!--  <i18n:text i18n:key="blogGravatarEnabled"> This blog is <a href="http://www.gravatar.com/">gravatar</a> enabled.</i18n:text>
                <br/>-->
                <i18n:text i18n:key="blogEmailNotPublished">Your email adress will never be published.</i18n:text>
                <br/>
                <i18n:text i18n:key="blogCommentSpam">Comment spam will be deleted!</i18n:text>
            </p>
        </xsl:if>
    </xsl:template>
    
    
    
      <xsl:template name="blogPost">
      <div>
        
      <xsl:apply-templates select="@*" mode="xhtml"/>
        <xsl:apply-templates select="*[not(@class = 'post_tags')]" mode="xhtml"/>
      <xsl:apply-templates select="*[@class = 'post_tags']" mode="xhtml"/>
           </div> 
    </xsl:template>
    
    <xsl:template match="*[@class = 'post_tag']" mode="xhtml">
        <xsl:choose>
        <xsl:when test="position() = 2">
            &#160;
        </xsl:when>
        <xsl:otherwise>
            <span class="blogbar"> | </span>
        </xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates select="*[@rel = 'tag']" mode="xhtml"/>
        <xsl:if test="position()+1 = last()">
            <span class="blogbar"> |</span>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="xhtml:span[@class = 'post_comments_count']" mode="xhtml">
        <xsl:variable name="entry" select="../.."/>
        <xsl:if test="$entry[@blog:post_comment_allowed = 1 or @blog:comment_count &gt; 0]">
            <a href="{xhtml:a/@href}"><i18n:text i18n:key="blogComments">Comments</i18n:text> (<xsl:value-of select="."/>)</a><span class="blogbar"> |</span>
        </xsl:if>
    </xsl:template>
    
    
    
    
    <xsl:template match="xhtml:span[@class='post_category']" mode="xhtml">
        <xsl:text> </xsl:text>
        <xsl:text> </xsl:text><span class="blogbar"> | </span> <xsl:apply-templates mode="xhtml"/> 
    </xsl:template>

    
    <xsl:template match="xhtml:div[@class='post_meta_data']" mode="xhtml">
    <xsl:element name="{local-name()}">
    <xsl:apply-templates select="@*" mode="xhtml"/>
    <xsl:apply-templates select="*[not(@class = 'post_categories')]" mode="xhtml"/>
    <xsl:apply-templates select="*[@class = 'post_categories']" mode="xhtml"/>
</xsl:element>
 
    </xsl:template>
   <xsl:template match="xhtml:span[@class='post_author']" mode="xhtml">
   </xsl:template>
    <xsl:template match="xhtml:span[@class='post_date']" mode="xhtml">
    <xsl:value-of select="."/>

    </xsl:template>

<xsl:template name="html_head_description">

    <xsl:choose>
            <xsl:when test="$singlePost = 'true'">
<xsl:variable name="entry" select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div/xhtml:div[@class='post_content']"/>
<meta name="description" content="{translate(substring($entry,0,160),'&#10;','')}"/>
</xsl:when>

</xsl:choose>          
</xsl:template>    
</xsl:stylesheet>
