<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns="http://www.w3.org/1999/xhtml" 
         
	xmlns:php="http://php.net/xsl"
     xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
	exclude-result-prefixes="xhtml php i18n"
	
	>
    <xsl:import href="../standard/mastercommon.xsl" />
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
        <html lang="{$lang}">
            <head>
                <meta name="generator" content="Flux CMS - http://www.flux-cms.org"/>
                <meta name="author">
                    <xsl:attribute name="content">
                        <xsl:value-of select="php:functionString('bx_helpers_uri::getUriPart',$webroot,'host')"/>
                    </xsl:attribute>
                </meta>
                
                <meta http-equiv="Content-Language" content="{$lang}"/>
                <!--
                <meta name="DC.language" content="{$lang}" />
                <meta name="DC.creator">
                    <xsl:attribute name="content">
                        <xsl:value-of select="php:functionString('bx_helpers_uri::getUriPart',$webroot,'host')"/>
                    </xsl:attribute>
                </meta>
                <meta name="DC.title">
                    <xsl:attribute name="content">
                        <xsl:call-template name="html_head_title"/>
                    </xsl:attribute>
                </meta>
                -->

<xsl:text>
</xsl:text>                
                <xsl:call-template name="html_head_keywords"/>
<xsl:text>
</xsl:text>                
                <xsl:call-template name="html_head_description"/>
<xsl:text>
</xsl:text>                
                <title>
                    <xsl:call-template name="html_head_title"/>
                </title>
<xsl:text>
</xsl:text>                
                <meta http-equiv="imagetoolbar" content="no"/>
<xsl:text>
</xsl:text>                
                <link rel="openid.server" href="{$webroot}admin/webinc/openid/" />
<xsl:text>
</xsl:text>                
                <link type="text/css" href="{$webroot}themes/{$theme}/css/{$themeCss}" rel="stylesheet" media="screen"/>
<xsl:text>
</xsl:text>                
                <link type="text/css" href="{$webroot}themes/{$theme}/css/mobile.css" rel="stylesheet" media="handheld"/>
<xsl:text>
</xsl:text>
  <link rel="stylesheet" href="{$webroot}themes/{$theme}/css/sIFR-screen.css" type="text/css" media="screen"/>
<xsl:text>
</xsl:text>
  <link rel="stylesheet" href="{$webroot}themes/{$theme}/css/sIFR-print.css" type="text/css" media="print"/>
<xsl:text>
</xsl:text>

<xsl:text>
</xsl:text>

  
  <script src="{$webroot}webinc/js/sifr.js" type="text/javascript"></script>
<script src="{$webroot}webinc/js/sifr-addons.js" type="text/javascript"></script>


 
<xsl:text>
</xsl:text>

                <link rel="shortcut icon" href="{$webroot}favicon.ico" type="image/x-icon"/>
                <xsl:call-template name="html_head"/>
                <xsl:call-template name="html_head_scripts"/>
                <xsl:call-template name="html_head_custom"/>

            </head>

            <body id="ng_bitflux_org">
                <xsl:call-template name="body_attributes"/>
                <div id="container">
                  <div id="metanavi"><form id="FormName" action="(EmptyReference!)" method="get" name="FormName">
			<p><input type="text" name="textfieldName" class="captcha" /><img src="/themes/liip/images/go.gif" alt="" border="0" /><img src="/themes/liip/images/mail.gif" alt="" border="0" /><img src="/themes/liip/images/font-xs.gif" alt="" border="0" /><img src="/themes/liip/images/font-big.gif" alt="" border="0" /><img src="/themes/liip/images/printer.gif" alt="" border="0" /><img src="/themes/liip/images/delicious.gif" alt="" border="0" /></p></form></div>
                    <div id="banner">
                      
                        <div id="language"><img src="/themes/liip/images/language/de-s-h.jpg" alt="deutsch" /><img src="/themes/liip/images/language/de-s.jpg" alt="deutsch" /><img src="/themes/liip/images/language/fr-h.jpg" alt="français" /><img src="/themes/liip/images/language/en.jpg" alt="english" />
                       <!--         <xsl:for-each select="$langsAvail/langs/entry[not(.=$lang)]">
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
                                </xsl:for-each> -->
                          
 	                       </div>
                            <a href="{$webrootLang}"><img src="/themes/liip/images/logo-liip.jpg" alt="liip-logo" border="0" />
<!-- <xsl:value-of select="$sitename"/> -->
                            </a>
     <!--             <h2><xsl:value-of select="$sitedescription"/>&#160;</h2> -->

                    </div>
                    <div id="mobile" style="display: none">
                    <a href="{$webroot}mo{$requestUri}">Mobile Mode</a>
                    </div>

           <!--         <div id="topnavi">
                        <xsl:call-template name="topnavi"/>
                    </div> -->

                    <div id="left">
                        <xsl:call-template name="leftnavi"/>
                    </div>
                    <div id="right">
                        <xsl:call-template name="contentRight"/>
                    </div>


                    <div id="content" bxe_xpath="/xhtml:html/xhtml:body">
                        <xsl:call-template name="content"/>
                    </div>

                    <div id="footer"><p class="eins">©2006 liip</p>
<p class="zwei"> fribourg/zürich/bern</p>
<p class="drei"><a href="/contact/">Kontakt</a></p>
                    </div>

                </div>
				
				
				
				<script type="text/javascript">
//<![CDATA[
/* Replacement calls. Please see documentation for more information. */

if(typeof sIFR == "function"){

// This is the preferred "named argument" syntax
	//sIFR.replaceElement(named({sSelector:"body h1", sFlashSrc:"/webinc/js/vandenkeere.swf", sColor:"#000000", sLinkColor:"#000000", sBgColor:"#FFFFFF", sHoverColor:"#CCCCCC", nPaddingTop:20, nPaddingBottom:20, sFlashVars:"textalign=center&offsetTop=6"}));

// This is the older, ordered syntax

/*
	sIFR.replaceElement("h5#pullquote", "/webinc/js/vandenkeere.swf", "#000000", "#000000", "#FFFFFF", "#FFFFFF", 0, 0, 0, 0);
	sIFR.replaceElement("h2", "/webinc/js/tradegothic.swf", "#000000", null, null, null, 0, 0, 0, 0);
	sIFR.replaceElement("h4.subhead", "/webinc/js/tradegothic.swf", "#660000", null, null, null, 0, 0, 0, 0);
	sIFR.replaceElement("h3.sidebox","/webinc/js/tradegothic.swf","#000000", "#000000", "#DCDCDC", "#DCDCDC", 0, 0, 0, 0, null);
	sIFR.replaceElement("h3", "/webinc/js/tradegothic.swf", "#000000", null, null, null, 0, 0, 0, 0, null);
	*/

	// sIFR.replaceElement("#left li", "/webinc/js/profile.swf", "#000000", "#000000", "#000000", "#000000", 0, 0, 0, 0);
	
	
	sIFR.replaceElement(named({sSelector:"#left li", sFlashSrc:"/webinc/js/profile.swf", sColor:"#58656A", sLinkColor:"#58656A", sBgColor:"#FFFFFF", sHoverColor:"#CCCCCC", nPaddingTop:0, nPaddingBottom:0, sFlashVars:"textalign=left&offsetTop=0&case=upper"}));
};

//]]>
</script>
				
				
				
            </body>
        </html>
    </xsl:template>

<xsl:template name="leftnavi">              
<xsl:call-template name="leftnavi2"/>     
</xsl:template>
    <xsl:template name="leftnavi2">
        <xsl:apply-templates select="$navitreePlugin/collection"/>
    </xsl:template>

    <xsl:template match="items/collection| plugin/collection">

        <xsl:variable name="items" select="items/*[(not(@lang) or @lang=$lang) and (not(filename) or filename!='index') and display-order > 0.1]"/>
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

                    <li class="sub1">
                    
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
                        
                    <xsl:if test="local-name()='collection' and ( @selected = 'selected')">
                        <xsl:apply-templates select="."/>
                    </xsl:if>
  <xsl:if test="uri='/blog/' and (local-name()='collection') and ( @selected = 'selected')">

<xsl:call-template name="blognavi"/>
       </xsl:if>   
                    </li>

                </xsl:for-each>
            </ul>
        </xsl:if>

    </xsl:template>

<xsl:template name="blognavi">

    <xsl:apply-templates select="document(concat('portlet://',$collectionUri,'plugin=categories(',$filename,').xml'))/bx/plugin/collection"/>
   </xsl:template>

 
    <xsl:template name="contentRight">
    <!-- we should add the rss feed here... for later-->
     <h3>Related</h3>
        <ul>
	<li>Related Links reinquetschen?</li>
        </ul>
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
      <!-- uncomment this, if you want meta description and keywords from collection properties
           and also adjust the html_head_keywords and html_head_description templates
    -->
    <!-- with inheritance 
    <xsl:variable name="k" select="$selectedCollections/properties/property[@name='subject']"/>
    <xsl:variable name="last" select="$k[position() = last()]/@value"/>
    -->
    <!-- without inheritance 
    <xsl:variable name="k" select="$selectedCollections[position() = last()]"/>
    <xsl:variable name="last" select="$k/properties/property[@name='subject']/@value"/>
    -->
    <!--
    <xsl:if test="$last">
        <meta name="keywords">
            <xsl:attribute name="content"><xsl:value-of select="$last"/></xsl:attribute>
        </meta>
    </xsl:if>
    -->
    </xsl:template>
    
    <xsl:template name="html_head_description">
    <!-- uncomment this, if you want meta description and keywords from collection properties
           and also adjust the html_head_keywords and html_head_description templates
    -->
    <!-- with inheritance
        <xsl:variable name="k" select="$selectedCollections/properties/property[@name='description']"/>
        <xsl:variable name="last" select="$k[position() = last()]/@value"/>
     -->
    <!-- without inheritance
        <xsl:variable name="k" select="$selectedCollections[position() = last()]"/>
        <xsl:variable name="last" select="$k/properties/property[@name='description']/@value"/>
     -->
    <!--
      <xsl:choose>
            <xsl:when test="$last != ''">
                <meta name="description" content="{$last}"/>
            </xsl:when>
            <xsl:otherwise>
                <meta name="description" content="{$sitedescription}"/>
            </xsl:otherwise>
        </xsl:choose>
     -->
    <meta name="description" content="{$sitedescription}"/>
    </xsl:template>
    
    <xsl:template name="html_head_custom"/>
     
</xsl:stylesheet>

