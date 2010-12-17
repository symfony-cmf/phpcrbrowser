
<xsl:stylesheet version="1.0"
        xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
        xmlns:blog="http://bitflux.org/doctypes/blog" 
        xmlns:bxf="http://bitflux.org/functions" 
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns="http://www.w3.org/1999/xhtml" 
        xmlns:php="http://php.net/xsl" 
        xmlns:atom="http://www.w3.org/2005/Atom" 
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:rss="http://purl.org/rss/1.0/"
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        exclude-result-prefixes="php blog bxf xhtml atom i18n rdf rss dc">


    <xsl:param name="ICBM" select="php:functionString('bx_helpers_config::getOption','ICBM')"/>
    <xsl:param name="webrootFiles"  select="concat($webroot,'files/')"/>
    <xsl:param name="webrootWebinc"  select="concat($webroot,'webinc/')"/>
    <xsl:param name="webrootThemes" select="concat($webroot,'themes/')"/>

    <xsl:variable name="blogname" select="php:functionString('bx_helpers_config::getOption','blogname')"/>
    <xsl:variable name="blogroot" select="concat(substring($webroot,1,string-length($webroot)-1),$collectionUri)"/>



    <xsl:output encoding="utf-8" method="xml"/>
    <xsl:variable name="singlePost">
        <xsl:choose>
            <xsl:when test="count(/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div[@class='entry']) &lt;=1">true</xsl:when>
            <xsl:otherwise>false</xsl:otherwise>
        </xsl:choose>
    </xsl:variable>

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


    <xsl:template name="contentRight">
        <xsl:apply-templates select="/bx/plugin[@name = 'blog']/xhtml:html/sidebar[@sidebar=2]"/>
    </xsl:template>

    <xsl:template name="leftnavi">
        <xsl:apply-templates select="/bx/plugin[@name = 'blog']/xhtml:html/sidebar[@sidebar=1]"/>
    </xsl:template>
    

    <xsl:template name="content">
        <xsl:choose>
            <xsl:when test="$singlePost = 'true'">
                <xsl:call-template name="blogSinglePost"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="blogOverview"/>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>

    <xsl:template match="sidebar">

        <xsl:choose>
            <xsl:when test="@isxml = 1">
                <xsl:apply-templates mode="xhtml" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="text()" disable-output-escaping="yes"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    

    <xsl:template match="categories" mode="xhtml" >
        <xsl:apply-templates select="document(concat('portlet://',$collectionUri,'plugin=categories(',$filename,',count).xml'))/bx/plugin/collection"/>
    </xsl:template>

    <xsl:template match="tags" mode="xhtml">
        <h3>Tags</h3>
        <xsl:copy-of select="php:functionString('bx_helpers_tags::getTags', @entries, $collectionUri)"/>
    </xsl:template>

    <xsl:template match="login" mode="xhtml">
        <xsl:call-template name="littleLogin"/>
    </xsl:template>
    

    <xsl:template match="livesearch" name="livesearch" mode="xhtml">
        <h3 class="blog">LiveSearch</h3>
        <form onsubmit="return liveSearchSubmit()" style="margin:0px;" name="searchform" method="get" action="./">

            <input type="text" id="livesearch" name="q" size="15" accesskey="1" tabindex="1" onkeypress="liveSearchStart()"/>
            <div id="LSResult" style="display: none;">
                <div id="LSShadow">
                
                </div>
            </div>
        </form>
    </xsl:template>

   <xsl:template match="latest_comments" name="latest_comments" mode="xhtml">
<ul>
 <xsl:for-each select="document(concat('portlet://',$collectionUri,'latestcomments.xml'))/bx/plugin/comments/comment">
      <li><xsl:value-of select="author" disable-output-escaping="yes"/>:<br/>
        <cite>"<a title="Am {date} zum Thema: {post_title}" href="{$webrootW}{$collectionUri}archives/{post_permauri}#comments"><xsl:value-of disable-output-escaping="yes" select="substring(php:functionString('strip_tags',content),1,50)"/>
        <xsl:if test="string-length(content) &gt; 50">..</xsl:if>
       </a>"
      </cite></li>
    </xsl:for-each>
    </ul>
</xsl:template>

    <xsl:template name="buttons" match="buttons" mode="xhtml">
        <h3 class="blog">Buttons</h3>
        <div id="buttons">
            <ul>
                <li>
                    <a href="{$blogroot}rss.xml">
                        <img src="{$webrootThemes}{$theme}/buttons/rss.png" width="80" height="15" alt="RSS 2.0 Feed" border="0"/>
                    </a>
                </li>
                <li>
                    <a href="{$blogroot}latestcomments.xml">
                        <img src="{$webroot}themes/{$theme}/buttons/comments.png" width="80" height="15" border="0" alt="Latest comments"/>
                    </a>
                </li>
                <li>
                    <a href="http://validator.w3.org/check?uri=referer">
                        <img src="{$webrootThemes}{$theme}/buttons/xhtml10.png" width="80" height="15" alt="XHTML 1.0 compliant" border="0"/>
                    </a>
                </li>
                <li>
                    <a href="http://www.flux-cms.org">
                        <img src="{$webrootThemes}{$theme}/buttons/fluxcms.png" width="80" height="15" alt="Powered by Flux CMS" border="0"/>
                    </a>
                </li>
                <li>
                    <a href="http://www.popoon.org">
                        <img src="{$webrootThemes}{$theme}/buttons/popoon.png" width="80" height="15" alt="Powered by Popoon" border="0"/>
                    </a>
                    

                </li>
            </ul>

            <xsl:variable name="cclink">
                <xsl:value-of select="php:functionString('bx_helpers_config::getOption','cclink')"/>
            </xsl:variable>
            <xsl:if test="starts-with($cclink,'http://creativecommons.org/')">

                <xsl:comment> Creative Commons License </xsl:comment>
                <ul>
                    <li>
                        <a rel="license" href="{$cclink}">
                            <img alt="Creative Commons License" border="0" src="http://creativecommons.org/images/public/somerights20.gif" />
                        </a>
                        <br />
                    </li>
                </ul>
                <xsl:comment> /Creative Commons License </xsl:comment>
                <xsl:text>
</xsl:text>
                <xsl:comment>

                    <xsl:value-of disable-output-escaping="yes" select="php:functionString('bx_helpers_config::getOption','cclicense')"/>

                </xsl:comment>
                <xsl:text>
</xsl:text>
            </xsl:if>
        </div>
    </xsl:template>

    <xsl:template name="bloglinks" match="bloglinks" mode="xhtml">
        <xsl:for-each select="document(concat('portlet://',$collectionUri,'bloglinks.xml'))/bx/plugin/bloglinks/bloglinkscategories">
            <h3 class="blog">
                <xsl:value-of select="name"/>
            </h3>
            <ul>
                <xsl:for-each select="bloglinks">
                    <li>
                        <a href="{link}">
                            <xsl:if test="rel">
                                <xsl:attribute name="rel">
                                    <xsl:value-of select="rel"/>
                                </xsl:attribute>
                            </xsl:if>

                            <xsl:value-of select="text"/>
                        </a>
                    </li>
                </xsl:for-each>
            </ul>

        </xsl:for-each>
    </xsl:template>

    <xsl:template name="delicious" match="delicious" mode="xhtml">
        <xsl:param name="link" select="@link"/>
        <h3 class="blog">
            <a href="http://del.icio.us/{$link}">
                <xsl:value-of select="$link"/>
            </a>
        </h3>
        <ul>
            <xsl:for-each select="document(concat('portlet://',$collectionUri,'plugin=deliciousrdf(',$link,').xml'))/bx/plugin/rdf:RDF/rss:item[position() &lt; 11]">
                <li>
                    <a title="{rss:description} - Categories: {dc:subject}" class="blogLinkPad" href="{rss:link}">
                        <xsl:value-of select="rss:title"/>
                    </a>
                </li>
            </xsl:for-each>


        </ul>
    </xsl:template>
    
    <xsl:template name="externalFeed" match="externalFeed" mode="xhtml">
    <xsl:param name="title" select="@title"/>
    <xsl:param name="url" select="@url"/>
    <xsl:param name="rss" select="@rss"/>
     <h3 class="blog"><a href="{$url}"><xsl:value-of select="$title"/></a></h3>
         <ul>
    <xsl:variable name="feed" select="php:functionString('bx_helpers_simplecache::staticHttpReadAsDom',$rss)"/>
    <xsl:choose>
      <xsl:when test="$feed/rss">
        <xsl:for-each select="$feed/rss/channel/item[position() &lt; 10]"> 
          <li><a title="{title}" href="{link}"><xsl:value-of select="title"/></a></li>
        </xsl:for-each>
      </xsl:when>
      <xsl:otherwise>
        <xsl:for-each select="$feed/atom:feed/atom:entry[position() &lt; 10]"> 
          <li><a title="{atom:title}" href="{atom:link[@rel='alternate']/@href}"><xsl:value-of select="atom:title"/></a></li>
        </xsl:for-each>
      </xsl:otherwise>
    </xsl:choose>

     
    </ul>

</xsl:template>

    <xsl:template name="archive" match="archive" mode="xhtml">
        <h3 class="blog">Archive</h3>
        <ul>
            <xsl:for-each select="document(concat('portlet://',$collectionUri,'plugin=montharchive.xml'))/bx/plugin/archive/link">
                <li>
                    <a title="{@count} entries" class="blogLinkPad" href="{$collectionUri}archive/{@href}">
                        <xsl:copy-of select="node()"/>
                    </a>  [<xsl:value-of select="@count"/>]  
                </li>
            </xsl:for-each>


        </ul>
    </xsl:template>
    

    <xsl:template name="html_head">
        <xsl:text>
</xsl:text>

        <meta name="DC.title" content="{$dctitle}"/>
        <xsl:text>
</xsl:text>
        <xsl:if test="$ICBM">
            <meta name="ICBM" content="{$ICBM}"/>
            <xsl:text>
</xsl:text>
        </xsl:if>

        <link rel="EditURI" type="application/rsd+xml" title="RSD" href="{$blogroot}xmlrpc.rsd"/>
        <xsl:text>
</xsl:text>

        <meta name="DC.title" content="{$dctitle}"/>
        <xsl:text>
</xsl:text>

<xsl:call-template name="html_head_feeds"/>
<xsl:call-template name="html_head_microsummary"/> 

<xsl:call-template name="html_head_osd"/>        
       

        <xsl:if test="$ICBM">
            <meta name="ICBM" content="{$ICBM}"/>
            <xsl:text>
</xsl:text>
        </xsl:if>

        <script type="text/javascript">
    var liveSearchRoot = '<xsl:value-of select="$webroot"/>';
    var liveSearchParams = 'blogid=<xsl:value-of select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div[@class='entry']/@blog:blog_id"/>&amp;root=<xsl:value-of select="$webrootW"/>
   <xsl:call-template name="html_head_cocomment"/>
        </script>
        
        <xsl:call-template name="html_head_custom"/>

    </xsl:template>


    <xsl:template match="xhtml:span[@class='post_author']" mode="xhtml">
	<!-- 
		if you want to link the post_author to the archive,
		replace following line with:
		 by <xsl:apply-templates mode="xhtml" />
	 -->
    by <xsl:value-of select="."/>
    </xsl:template>

    <xsl:template match="xhtml:span[@class='post_date']" mode="xhtml">
	<!-- 
		if you want to link the post_date to the archive,
		replace following line with:
		 @ <xsl:apply-templates mode="xhtml" />
	 -->
    @ <xsl:value-of select="."/>
    </xsl:template>

    <xsl:template match="xhtml:span[@class='comment_date']" mode="xhtml">
    @ <xsl:value-of select="."/>
    </xsl:template>

    <xsl:template match="xhtml:span[@class='comment_type' ]" mode="xhtml">
        <xsl:if test="text() = 'TRACKBACK'">
    (Trackback)
    </xsl:if>
    </xsl:template>

    <xsl:template match="xhtml:span[@class='comment_author']" mode="xhtml">
        <xsl:apply-templates mode="xhtml"/>
    </xsl:template>

    <xsl:template match="xhtml:div[@class='comment_content' or @class='comments_new']" mode="xhtml">
        <xsl:apply-templates mode="xhtml"/>
    </xsl:template>

    <xsl:template match="xhtml:div[@class='comment_meta_data']" mode="xhtml">
        <strong>
            <xsl:apply-templates mode="xhtml"/>
        </strong>
        <br/>
    </xsl:template>
    <xsl:template match="xhtml:span[@class='openid']" mode="xhtml">
        &#160;
        <a target="_blank" href="http://openid.net/">
            <img src="{$webrootWebinc}images/openid.gif" alt="open_id"/>
        </a>
    </xsl:template>

    <xsl:template match="xhtml:div[@class='comment' or @class='comments_not']" mode="xhtml">
    
        <div class="post_content">
            <xsl:apply-templates mode="xhtml"/>
        </div>
    </xsl:template>

    <xsl:template match="xhtml:span[@class='post_category']" mode="xhtml">
        <xsl:text> </xsl:text>
        <xsl:text> </xsl:text> [ <xsl:apply-templates mode="xhtml"/> ]
    </xsl:template>

    <xsl:template match="xhtml:h2[@class='post_title']" mode="xhtml">
        <xsl:variable name="username" select="php:functionString('bx_helpers_perm::getUsername')"/>
        <xsl:choose>
            <xsl:when test="$singlePost = 'true'">
                <h2 class="post_title">
                    <xsl:if test="$username != ''">
                        <a href="{$webroot}admin/edit{$collectionUri}{../@blog:post_uri}.html">
                            <img style="vertical-align: bottom; border: 0px;" src="{$webrootWebinc}images/editbutton.png" alt="editbutton"/>&#160;
                        </a>
                    </xsl:if>
                    <xsl:if test="../@blog:post_status != 1">
                        <img style="vertical-align: bottom; border: 0px;" src="{$webrootWebinc}/images/privat.gif"/>
                    </xsl:if>
                    <xsl:apply-templates/>
                </h2>
            </xsl:when>
            <xsl:otherwise>
                <h2 class="post_title">
                    <xsl:if test="$username != ''">
                        <a href="{$webroot}admin/edit{$collectionUri}{../@blog:post_uri}.html">
                            <img style="vertical-align: bottom; border: 0px;" src="{$webrootWebinc}/images/editbutton.png" alt="editbutton"/>&#160;
                        </a>
                    </xsl:if>
                    <a href="{../xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href}">
                        <xsl:if test="../@blog:post_status != 1">
                            <img style="vertical-align: bottom; border: 0px;" src="{$webrootWebinc}/images/privat.gif"/>
                        </xsl:if>
                        <xsl:apply-templates/>
                    </a>
                </h2>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="xhtml:span[@class='post_uri']" mode="xhtml">
    &#160;<xsl:apply-templates mode="xhtml"/>

    </xsl:template>

    <xsl:template match="xhtml:span[@class='blog_pager_counter']" mode="xhtml">
        <xsl:value-of select="."/>
    </xsl:template>

    <xsl:template match="xhtml:span[@class='blog_pager_prevnext' or @class='post_categories']" mode="xhtml">
        <span class="right">
            <xsl:apply-templates mode="xhtml"/>
        </span>
    </xsl:template>

    <xsl:template match="xhtml:div[@class='post_links']" mode="xhtml">
        <xsl:call-template name="plazeDiv">
            <xsl:with-param name="blogInfo" select="../blog:info"/>
        </xsl:call-template>
        <div class="post_links">
            <xsl:apply-templates mode="xhtml"/>
        </div>
    </xsl:template>
    

    <xsl:template match="xhtml:span[@class = 'post_comments_count']" mode="xhtml">
        <xsl:variable name="entry" select="../.."/>
        <xsl:if test="$entry[@blog:post_comment_allowed = 1 or @blog:comment_count &gt; 0]">
            <a href="{xhtml:a/@href}"><i18n:text i18n:key="blogComments">Comments</i18n:text> (<xsl:value-of select="."/>)</a>
        </xsl:if>
    </xsl:template>

    <xsl:template match="@blog:*" mode="xhtml"></xsl:template>


    <xsl:template name="body_attributes">
        <xsl:attribute name="onload">liveSearchInit();</xsl:attribute>

    </xsl:template>
    
     

    <xsl:template name="blogSinglePost">
        <xsl:for-each select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div[@class='entry']">
            <xsl:apply-templates select="." mode="xhtml"/>

            <xsl:if test="@blog:post_trackbacks_allowed = 1">
                <xsl:comment>

&lt;rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:dc="http://purl.org/dc/elements/1.1/"
         xmlns:trackback="http://madskills.com/public/xml/rss/module/trackback/">
&lt;rdf:Description
    rdf:about="http://www.foo.com/archive.html#foo"
    dc:identifier="<xsl:value-of select="xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href"/>"
    dc:title="<xsl:value-of select="xhtml:h2"/>"
    trackback:ping="<xsl:value-of select="concat($webrootW,$collectionUri,'plugin=trackback(',substring-after(@id,'entry'),').xml')"/>" />
&lt;/rdf:RDF>
</xsl:comment>
            </xsl:if>
        </xsl:for-each>
    </xsl:template>

    <xsl:template name="blogOverview">


        <xsl:for-each select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div[@class='entry']">
            <xsl:apply-templates select="." mode="xhtml"/>
            <xsl:if test="position() = 1">
                <div id="googleAd"/>
            </xsl:if>
        </xsl:for-each>

        <xsl:apply-templates select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div[@class='blog_pager']" mode="xhtml"/>
    </xsl:template>
    

    <xsl:template match="xhtml:div[@class = 'comments']" mode="xhtml">
        <div id="googleAd"/>
        <h3 class="blog">
            <i18n:text i18n:key="blogComments">Comments</i18n:text>
        </h3>
        <xsl:apply-templates mode="xhtml"/>
        <xsl:if test="not(../xhtml:div[@class='comments_not'])">

            <h3 class="blog">
                <i18n:text>add a comment</i18n:text>
            </h3>
            <xsl:if test="../@blog:post_trackbacks_allowed = 1">

                <p>
                    <i18n:text i18n:key="blockTrackbackUrl">The Trackback URL to this post is</i18n:text>:<br/>
                    <xsl:value-of select="concat($webrootW,$collectionUri,'plugin=trackback(',substring-after(../@id,'entry'),').xml')"/>
                    <br/>
                    <i18n:text i18n:key="blockTrackbackModerated">Trackbacks are moderated.</i18n:text>
                </p>
            </xsl:if>
            <p>
                <i18n:text i18n:key="blogGravatarEnabled"> This blog is <a href="http://www.gravatar.com/">gravatar</a> enabled.</i18n:text>
                <br/>
                <i18n:text i18n:key="blogEmailNotPublished">Your email adress will never be published.</i18n:text>
                <br/>
                <i18n:text i18n:key="blogCommentSpam">Comment spam will be deleted!</i18n:text>
            </p>
        </xsl:if>
    </xsl:template>

    <xsl:template match="xhtml:span[@class='comment_author_email']" mode="xhtml">
        <xsl:if test="string-length(.) &gt; 5">
            <img class="blog_gravatar" src="{php:functionString('bx_plugins_blog_gravatar::getLink',text(),'40','aaaaaa')}" alt=""/>
        </xsl:if>
    </xsl:template>



    <xsl:template name="html_head_title">
        <xsl:value-of select="$dctitle"/>
        <xsl:choose>
            <xsl:when test="$singlePost = 'true'">
         ::   <xsl:value-of select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div[@class='entry']/xhtml:h2"/>
            </xsl:when>

            <xsl:otherwise>
                <xsl:value-of select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:head/xhtml:title"/>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>
 
    <xsl:template name="html_head_feeds">
    
    <link rel="alternate" type="application/rss+xml" title="RSS 2.0 Feed" href="{$blogroot}rss.xml"/>
        <xsl:text>
</xsl:text>
        <link rel="alternate" type="application/rss+xml" title="RSS 2.0 Comments Feed" href="{$blogroot}latestcomments.xml"/>
        <xsl:text>
</xsl:text>
    </xsl:template>
     
    <xsl:template name="html_head_microsummary">
    <link rel="microsummary" type="application/x.microsummary+xml" href="{$blogroot}microsummary.txt" />
        <xsl:text>
</xsl:text>
    </xsl:template>
    
    <xsl:template name="html_head_osd">
     <link rel="search" type="application/opensearchdescription+xml" href="{$blogroot}osd.xml" title="{$dctitle}" />
        <xsl:text>
</xsl:text>
    </xsl:template>
    
      <xsl:template name="html_head_cocomment">
     <xsl:value-of select="$collectionUri"/>';
<xsl:if test="$singlePost = 'true'">
<xsl:variable name="entry" select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div"/>
                <xsl:if test="$entry/@blog:post_comment_allowed='1'">

/* cocomment elements*/
var blogTool               = "Flux CMS";
var blogURL                = "<xsl:value-of select="$blogroot"/>";
var blogTitle              = "<xsl:value-of select="$dctitle"/>";
var postURL                = "<xsl:value-of select="$blogroot"/>archive/<xsl:value-of select="$entry/@blog:post_uri"/>.html";
var postTitle  = "<xsl:value-of select="$entry/xhtml:h2/text()"/>";
var commentAuthorFieldName = "name";
var commentAuthorLoggedIn  = false;

var commentFormID          = "bx_foo";
var commentTextFieldName   = "commentsarea";
var commentButtonName      = "bx_plugins_blog_all";

</xsl:if>
</xsl:if>

</xsl:template>
    
    
    <xsl:template name="plazeDiv">
        <xsl:param name="blogInfo"/>
        <xsl:if test="$blogInfo/blog:plazes">

            <div class="post_tags geo">
                <xsl:call-template name="plaze">
                    <xsl:with-param name="blogInfo" select="$blogInfo"/>
                </xsl:call-template>
            </div>
        </xsl:if>
    </xsl:template>


    <xsl:template name="plaze">
        <xsl:param name="blogInfo"/>
        <xsl:if test="$blogInfo/blog:plazes">
            <i18n:text>Location</i18n:text>:
            <xsl:variable name="plazes" select="$blogInfo/blog:plazes"/>
            <!-- call location part -->
            <xsl:call-template name="plazeLocation">
                <xsl:with-param name="plazes" select="$plazes"/>
            </xsl:call-template>
            <!-- call long lat part -->
            <xsl:call-template name="plazeLongLat">
                <xsl:with-param name="plazes" select="$plazes"/>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>

    <xsl:template name="plazeLocation">
        <xsl:param name="plazes"/>
        <xsl:if test="$plazes/blog:plazename">
            <xsl:choose>
                <xsl:when test="$plazes/blog:plazeurl">
                    <a href="{$plazes/blog:plazeurl}">
                        <xsl:value-of select="$plazes/blog:plazename"/>
                    </a>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$plazes/blog:plazename"/>
                </xsl:otherwise>
            </xsl:choose>
                            <!--
            / <xsl:value-of select="$plazes/blog:plazecity"/>/
            <xsl:value-of select="$plazes/blog:plazecountry"/>/
            -->

        </xsl:if>
    </xsl:template>

    <xsl:template name="plazeLongLat">
        <xsl:param name="plazes"/>
        (<a href="http://maps.google.com/maps?q={$plazes/blog:plazelat},{$plazes/blog:plazelon}"><span class="latitude"><xsl:value-of select="format-number($plazes/blog:plazelat,'#.000')"/></span>,
         <span class="longitude"><xsl:value-of select="format-number($plazes/blog:plazelon,'#.000')"/></span></a>)
    </xsl:template>

    <xsl:template match="xhtml:div[@id = 'captcha']" mode="xhtml">
        <xsl:variable name="date" select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div[@class='entry']/@blog:post_date_iso"/>
        <xsl:variable name="days" select="php:functionString('bx_helpers_config::getBlogCaptchaAfterDays')"/>
        <xsl:variable name="captcha" select="php:functionString('bx_helpers_captcha::isCaptcha', $days, $date)"/>
        <xsl:choose>
            <xsl:when test="$captcha = 1">
                <xsl:apply-templates mode="xhtml"/>
            </xsl:when>
            <xsl:otherwise>

            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="xhtml:div[@id = 'captchaTitle']" mode="xhtml">
        <xsl:variable name="date" select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div[@class='entry']/@blog:post_date_iso"/>
        <xsl:variable name="days" select="php:functionString('bx_helpers_config::getBlogCaptchaAfterDays')"/>
        <xsl:variable name="captcha" select="php:functionString('bx_helpers_captcha::isCaptcha', $days, $date)"/>
        <xsl:choose>
            <xsl:when test="$captcha = 1">
                <xsl:apply-templates mode="xhtml"/>
            </xsl:when>
            <xsl:otherwise>

            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template name="html_head_custom"/>


<xsl:template name="html_head_description">

    <xsl:choose>
            <xsl:when test="$singlePost = 'true'">
<xsl:variable name="entry" select="/bx/plugin[@name = 'blog']/xhtml:html/xhtml:body/xhtml:div/xhtml:div[@class='post_content']"/>
<meta name="description" content="{translate(substring($entry,0,160),'&#10;','')}"/>
</xsl:when>

</xsl:choose>
</xsl:template>

</xsl:stylesheet>
