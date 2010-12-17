<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns="http://www.w3.org/1999/xhtml" 
        xmlns:forms="http://bitflux.org/forms" 
	xmlns:php="http://php.net/xsl"
     xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
	exclude-result-prefixes="xhtml forms php i18n"
	
	>
    <xsl:import href="../../../standard/mastercommon.xsl" />
    <xsl:output encoding="utf-8" method="xml" 
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" 
    doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
    <xsl:param name="webroot"/>
    <xsl:param name="webrootLang"/>
    <xsl:param name="requestUri"/>
    <xsl:param name="mode"/>
    <xsl:param name="admin" select="'false'"/>
    <xsl:param name="lang" select="'de'"/>
    <xsl:param name="collectionUri"/>
    <xsl:param name="filename"/>
    <xsl:param name="fileNumber"/>
    <xsl:variable name="langsAvail" select="php:functionString('bx_helpers_config::getLangsAvailXML')"/>
    <xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/>
    <xsl:variable name="sitedescription" select="php:functionString('bx_helpers_config::getOption','sitedescription')"/>
    <xsl:param name="theme" select="php:functionString('bx_helpers_config::getOption','theme')"/>
    <xsl:param name="themeCss" select="php:functionString('bx_helpers_config::getOption','themeCss')"/>
    
  <xsl:variable name="defaultLanguage" select="php:functionString('constant','BX_DEFAULT_LANGUAGE')"/>

    <xsl:variable name="navitreePlugin" select="/bx/plugin[@name='navitree']"/>
    <!-- uncomment this, if you want meta description and keywords from collection properties
           and also adjust the html_head_keywords and html_head_description templates
    -->
    <!--
    <xsl:variable name="selectedCollections" select="$navitreePlugin/collection|$navitreePlugin/collection//items/collection[@selected='selected']"/>
    -->
    
    <xsl:variable name="webrootW" select="substring($webroot,1,string-length($webroot)-1)"/>
    <xsl:variable name="webrootLangW" select="substring($webrootLang,1,string-length($webrootLang)-1)"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <title>Google Maps JavaScript API Example</title>
<style type="text/css">


BODY { font-family: Arial; font-size: small;
background-color: #CCCCFF;}

A:hover {color: red; }

#sidebar {cursor: default}


</style>
                <meta name="generator" content="Flux CMS - http://www.flux-cms.org"/>
                <meta http-equiv="Content-Language" content="{$lang}"/>

                
<xsl:text>
</xsl:text>                
                <meta http-equiv="imagetoolbar" content="no"/>
<xsl:text>
</xsl:text>                
                <link rel="openid.server" href="{$webroot}/admin/openid/" />
<xsl:text>
</xsl:text>                
                <link type="text/css" href="{$webroot}themes/{$theme}/css/{$themeCss}" rel="stylesheet" media="screen"/>
<xsl:text>
</xsl:text>                
                <link type="text/css" href="{$webroot}themes/{$theme}/css/mobile.css" rel="stylesheet" media="handheld"/>
<xsl:text>
</xsl:text>                
                <link rel="shortcut icon" href="{$webroot}favicon.ico" type="image/x-icon"/>
                
                <meta http-equiv="content-type" content="text/xhtml; charset=utf-8"/>
                
                <xsl:call-template name="html_head_scripts"/>
                
            </head>

            <body id="ng_bitflux_org" onload="load()">
                <xsl:call-template name="body_attributes"/>
                <div id="container">
                
                    <div id="banner">

                        <div id="metanavi">
                                <xsl:for-each select="$langsAvail/langs/entry[not(.=$lang)]">
                                <xsl:choose>
                                    <xsl:when test="text() = $defaultLanguage">
                                    <a href="{concat($webrootW,$collectionUri)}">
                                       [ <xsl:value-of select="."/> ]&#160;
                                    </a>
                                    </xsl:when>
                                    <xsl:otherwise>
                                    <a href="{concat($webroot,.,$collectionUri)}">
                                      [  <xsl:value-of select="."/> ]
                                    </a>
                                    </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:for-each>
                          
 	                       </div>
                        <h1>
                            <a href="{$webrootLang}">
                                <xsl:value-of select="$sitename"/>
                            </a>
                        </h1>
                        <h2><xsl:value-of select="$sitedescription"/>&#160;</h2>

                    </div>
                    <div id="mobile" style="display: none">
                    <a href="{$webroot}mo{$requestUri}">Mobile Mode</a>
                    </div>

                    <div id="topnavi">
                        <xsl:call-template name="topnavi"/>
                    </div>

                    <!--div id="left">
                        <xsl:call-template name="leftnavi"/>
                    </div>
                    <div id="right">
                        <xsl:call-template name="contentRight"/>
                    </div-->

<div id="content" >
<div id="map" style="width:512px; height:440px; text-align:center;"><h4>Map coming...</h4></div>

<div id="sidebar" style="width:120px; height:440px;  margin-top:0px; 
background:white; overflow:auto;">No geo posts or the data is still loading ...</div>

</div>
</div>

                    <!--div id="content2">
                            <div id="map" style="width: 512px; height: 440px; text-align: center; position: relative; background-color: rgb(229, 227, 223);"></div>
                            <div id="sidebar" style="display:block; width:120px; height:440px; top:0px; left:512px;
background:white; overflow:auto;">Data coming from Google Spreadsheets...</div>


<div id="map" style="width:512px; height:440px; text-align:center;"><h4>Map coming...</h4></div>

<div id="sidebar" style="float:left; width:120px; height:440px; position: absolute; top:176px; left:710px;
background:white; overflow:auto;">Data coming from Google Spreadsheets...</div>
                    </div>

                </div-->
            </body>
        </html>
    </xsl:template>
    <xsl:template name="leftnavi">
        <xsl:apply-templates select="$navitreePlugin/collection/items/collection[@selected = 'selected']"/>
    </xsl:template>

    <xsl:template match="items/collection| plugin/collection">
        <xsl:variable name="items" select="items/*[(not(@lang) or @lang=$lang) and (not(filename) or filename!='index') and display-order > 0]"/>
        <xsl:if test="$items">

            <ul>

                <xsl:for-each select="$items">
                    <xsl:sort select="display-order" order="ascending" data-type="number"/>
                    <xsl:variable name="link">
                        <xsl:choose>
                            <xsl:when test="@relink">
                                <xsl:value-of select="@relink"/>
                            </xsl:when>
                            <xsl:when test="local-name()='collection'">
                                <xsl:if test="not(starts-with(uri,'http://') or starts-with(uri,'https://') )">
                                    <xsl:value-of select="$webrootLangW"/>
                                </xsl:if>
                                <xsl:value-of select="uri"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="concat($webrootLangW,../../uri,filename)"/>.html</xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>

                    <li>
                    
                        <a href="{$link}">
                            <xsl:if test="filename=$filename or @selected='selected'">
                                <xsl:attribute name="class">selected</xsl:attribute>
                            </xsl:if>
                            <xsl:value-of select="title"/>
                        </a>
                        <!-- uncomment the following, if you want a counter for 
                                the number of posts per category on blog pages 
                             You also have to adjust the blog.xsl.
                             See http://wiki.bitflux.org/How_to_show_number_of_posts_in_a_category
                             for details
                             
                         -->
                         <!--
                        <xsl:if test="@count">
                                [<xsl:value-of select="@count"/>]
                        </xsl:if>
                        -->
                    </li>

                    <xsl:if test="local-name()='collection' and ( @selected = 'selected')">
                        <xsl:apply-templates select="."/>
                    </xsl:if>

                </xsl:for-each>
            </ul>
        </xsl:if>

    </xsl:template>

    <xsl:template name="topnavi">

        <xsl:for-each select="$navitreePlugin/collection/items/collection[display-order != 0]">
            <xsl:sort select="display-order" order="ascending" data-type="number"/>
            <xsl:choose>
                <xsl:when test="@relink">
                    <a href="{@relink}">
                        <xsl:value-of select="title"/>
                    </a>
                </xsl:when>
                <xsl:otherwise>
                    <a href="{$webrootLang}{substring-after(uri,'/')}">
                        <xsl:if test="@selected='selected'">
                            <xsl:attribute name="class">selected</xsl:attribute>
                        </xsl:if>
                        <xsl:value-of select="title"/>
                    </a>
                </xsl:otherwise>
            </xsl:choose>


               
                <!--<xsl:if test="position() != last()">|</xsl:if>-->
        </xsl:for-each>

    </xsl:template>
    <xsl:template name="contentRight">
    <!-- we should add the rss feed here... for later-->
     <h3>Latest Blog Posts</h3>
        <ul>
            <xsl:for-each select="document('portlet://blog/rss.xml')/bx/plugin/xhtml:html/xhtml:body/xhtml:div[@class='entry' and position() &lt; 6]">
                <li>
                    <a href="{xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href}">
                        <xsl:value-of select="xhtml:h2"/>
                    </a>

                </li>
            </xsl:for-each>
        </ul>

<p>
        <a href="{$webroot}blog/rss.xml">
            <img border="0" src="{$webroot}themes/{$theme}/buttons/rss.png" alt="RSS 2.0 feed"/>
        </a>
</p>
    </xsl:template>
    <xsl:template name="html_head">
        <link rel="alternate" type="application/rss+xml" title="RSS 2.0 Feed" href="{$webroot}blog/rss.xml"/>
    </xsl:template>
    <xsl:template name="html_head_title">
        <xsl:value-of select="$sitename"/>
        <xsl:for-each select="$navitreePlugin/collection/items//*[@selected='selected']">
                :: <xsl:value-of select="title"/>
                <!-- resource do not have selected -> search them with the filename -->
            <xsl:if test="position() = last() and $filename != 'index'">
                :: <xsl:value-of select="items/*[filename=$filename]/title"/>
            </xsl:if>
            
            
            
        </xsl:for-each>
        <xsl:call-template name="html_head_title_end"/>
    </xsl:template>
    
    <xsl:template name="body_attributes"/>
    
    <xsl:template name="html_head_title_end"/>

    <xsl:template name="html_head_keywords">
      
    </xsl:template>
    
    <xsl:template name="html_head_scripts">
    <!--script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAA-iuXXHqJ4EHMP0HEaIyFwhQ4zBPGwAlTAZhv0Zs-gp845UxNeRROP25zfiN9Q2s6PBcngC8UVT0hzg"
      type="text/javascript"></script>
      
      <script src="http://www.google.com/uds/api?file=uds.js&amp;v=1.0"
        type="text/javascript"></script-->

    
        <script type="text/javascript">
        var locations = new Array();
        var selectedPost = '<xsl:value-of select="/bx/plugin[@name='blog_map']/locations/post/selectedpost" />'
        
        <xsl:for-each select="/bx/plugin[@name='blog_map']/locations/location">
            <xsl:variable name="locationId" select="position()"/>
            <xsl:if test="name/text() and lon/text() and lat/text()">
                locations[<xsl:value-of select="$locationId"/>] = new Object();
                locations[<xsl:value-of select="$locationId"/>]['id'] = '<xsl:value-of select="id"/>';
                locations[<xsl:value-of select="$locationId"/>]['name'] = '<xsl:value-of select="name"/>';
                locations[<xsl:value-of select="$locationId"/>]['lon'] = '<xsl:value-of select="lon"/>';
                locations[<xsl:value-of select="$locationId"/>]['lat'] = '<xsl:value-of select="lat"/>';
                locations[<xsl:value-of select="$locationId"/>]['title'] = '<xsl:value-of select="title"/>';
                locations[<xsl:value-of select="$locationId"/>]['link'] = '<xsl:value-of select="concat($webrootW,$collectionUri,link)"/>';
                locations[<xsl:value-of select="$locationId"/>]['content'] = '<xsl:value-of select="php:functionString('bx_helpers_string::escapeJSValue',content)" disable-output-escaping="yes"/>';
                locations[<xsl:value-of select="$locationId"/>]['author'] = '<xsl:value-of select="author"/>';
                locations[<xsl:value-of select="$locationId"/>]['date'] = '<xsl:value-of select="date"/>';
                
                
                <xsl:if test="image/text()">
                locations[<xsl:value-of select="$locationId"/>]['image'] = '<xsl:value-of select="image"/>';
                </xsl:if>
                
            </xsl:if>
        </xsl:for-each>
        
        </script>
    
<script src="{$webroot}webinc/js/blogmap.js" type="text/javascript"></script>

<xsl:for-each select="/bx/plugin[@name='blog_map']/locations/key">
<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key={key}"
      type="text/javascript"></script>
      
      <script 
src="http://maps.google.com/maps?file=api&amp;v=2.75&amp;key={key}" type="text/javascript">
</script>
</xsl:for-each>
      <!--
       <script type="text/javascript" src="http://www.google.com/jsapi?key=ABQIAAAA-iuXXHqJ4EHMP0HEaIyFwhQ4zBPGwAlTAZhv0Zs-gp845UxNeRROP25zfiN9Q2s6PBcngC8UVT0hzg"></script>
    -->
  
    </xsl:template>
    
    <xsl:template name="html_head_description">
    <meta name="description" content="{$sitedescription}"/>
    </xsl:template>
    
    <xsl:template name="html_head_custom"/>
     
</xsl:stylesheet>

