<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 

   xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl"  exclude-result-prefixes="xhtml php i18n">
	<xsl:import href="../standard/mastercommon.xsl"/>
	<xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
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
    <xsl:variable name="whofirst" select="php:functionString('bx_helpers_liip::whofirst')"/>
                        
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
					<xsl:attribute name="content"><xsl:value-of select="php:functionString('bx_helpers_uri::getUriPart',$webroot,'host')"/></xsl:attribute>
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
				<link rel="openid.server" href="{$webroot}admin/webinc/openid/"/>
				<xsl:text>
</xsl:text>
 <xsl:choose>
 
                        <xsl:when test="$whofirst = 'fr'">
 <meta name="ICBM" content="46.7944, 7.1551" /> 
 <xsl:text>
</xsl:text>
 <meta name="geo.region" content="CH-FR" />
<xsl:text>
</xsl:text> 
 <meta name="geo.placename" content="Fribourg" />
 </xsl:when>
 <xsl:otherwise>
 <meta name="ICBM" content="47.3798, 8.5275" />
 <xsl:text>
</xsl:text>
 <meta name="geo.region" content="CH-ZH" />
<xsl:text>
</xsl:text> 
 <meta name="geo.placename" content="Zurich" />
 </xsl:otherwise>
 </xsl:choose>
<xsl:text>
</xsl:text>

	<link type="text/css" href="{$webroot}themes/{$theme}/css/{$themeCss}" rel="stylesheet" media="screen"/>

	
	<link type="text/css" href="{$webroot}themes/{$theme}/css/print.css" rel="stylesheet" media="print"/>

    <script src="{$webroot}themes/{$theme}/js/liip.js" type="text/javascript"/>
				<link rel="shortcut icon" href="{$webroot}favicon.ico" type="image/x-icon"/>
				<xsl:call-template name="html_head"/>
				<xsl:call-template name="html_head_scripts"/>
				<xsl:call-template name="html_head_custom"/>
			</head>
			<body id="ng_bitflux_org">
				<xsl:call-template name="body_attributes"/>
				<div id="container">
					<div id="metanavi">
						<form id="FormName" action="{$webrootLang}search/" method="get" name="FormName">
    <p>
                                                                <input type="text" name="q" class="captcha"/>
                                                                <a href="#" onclick="document.forms[0].submit(); return false;"><img src="/themes/liip/images/go.gif" alt="" border="0"/></a>
                                                                <a href="http://liip.ch/contact/"><img src="/themes/liip/images/mail.gif" alt="mail us" border="0"/></a>
                                                                <!--<img src="/themes/liip/images/font-xs.gif" alt="smaller font" border="0"/>
                                                                <img src="/themes/liip/images/font-big.gif" alt="bigger font" border="0"/>-->
                                                                <a href="#" onclick=" window.print(); return false;"><img src="/themes/liip/images/printer.gif" alt="print this page" border="0"/></a>
                                                                <a href="{$webrootLang}news/rss.xml"><img src="/themes/liip/images/delicious.gif" alt="rss feed" border="0"/></a>
                                                        </p>

						</form>
					</div>
					<div id="banner">
						<div id="language">
						
							<!--<img src="/themes/liip/images/language/de-s-h.jpg" alt="deutsch"/>
							<img src="/themes/liip/images/language/de-s.jpg" alt="deutsch"/>
							<img src="/themes/liip/images/language/fr-h.jpg" alt="français"/>
							<img src="/themes/liip/images/language/en.jpg" alt="english"/>-->
                              <xsl:for-each select="$langsAvail/langs/entry">
                              <a>
                              <xsl:attribute name="href">
                              <xsl:choose>
                                    <xsl:when test="text() = $defaultLanguage"><xsl:value-of select="concat($webrootW,$collectionUri,$requestUri)"/></xsl:when>
                                    <xsl:otherwise><xsl:value-of select="concat($webroot,.,$collectionUri,.,$requestUri)"/></xsl:otherwise>
                              </xsl:choose>
                              </xsl:attribute>
                              <xsl:choose>
                                    <xsl:when test="text() = $lang">
                                     <img alt="content in {.}" src="/themes/liip/images/language/{.}.gif"/>
                                    </xsl:when>
                                    <xsl:otherwise>
                                      <img alt="content in {.}" src="/themes/liip/images/language/{.}-h.gif"/>
                                    </xsl:otherwise>
                                    </xsl:choose>
                                    </a>
                                </xsl:for-each> 
						</div>
						<a href="{$webrootLang}">
							<img  src="/themes/liip/images/logo-liip.gif" width="269" height="129" alt="liip-logo" border="0"/>
							<!-- <xsl:value-of select="$sitename"/> -->
						</a>
                        <div id="claim">
                        <xsl:choose>
                        <xsl:when test="$whofirst = 'fr'">
                        <i18n:text>Fribourg, Zürich, Bern</i18n:text>
                        </xsl:when>
                        <xsl:otherwise>
                        <i18n:text>Zürich, Fribourg, Bern</i18n:text>
                        </xsl:otherwise>
                        </xsl:choose>
                        </div>
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
					<div id="footer">
						<p class="eins">©2007 Liip AG</p>
						<p class="zwei"> 
                        
                        <xsl:choose>
                        <xsl:when test="$whofirst = 'fr'">
                        <i18n:text>Zürich, Fribourg, Bern</i18n:text>
                        </xsl:when>
                        <xsl:otherwise>
                        <i18n:text>Fribourg, Zürich, Bern</i18n:text>
                        </xsl:otherwise>
                        </xsl:choose>
                        
                        </p>
						<p class="drei">
							<a href="{$webrootLang}contact/">Kontakt</a>
						</p>
					</div>
				</div>
			
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
					<li>
                    
                   
                    

						<xsl:if test="filename=$filename or @selected='selected'">
							<xsl:attribute name="class">selected</xsl:attribute>
						</xsl:if>
						<span>
							<xsl:choose>
								<xsl:when test="filename=$filename or @selected='selected'">
									<xsl:attribute name="class"><xsl:value-of select="concat('leftnaviLevel_', @level, '_selected')"/></xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="class"><xsl:value-of select="concat('leftnaviLevel_', @level)"/></xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							<a href="{$link}">
                             <xsl:choose>
                    <xsl:when test="php:functionString('bx_helpers_globals::COOKIE','noflash') != 1">
                 
                     <img border="0" onmouseover="navimouseover(this);"  onmouseout="navimouseout(this,'{@selected}',{@level});" src="{php:functionString('bx_helpers_liip::getImgSrc',title,@level,@selected)}" alt="{title}">
                     <xsl:choose>
                     <xsl:when test="@level = 3">
                     <xsl:attribute name="height">13</xsl:attribute>
                     </xsl:when>
                     <xsl:otherwise>
                     <xsl:attribute name="height">17</xsl:attribute>
                     </xsl:otherwise>
                     </xsl:choose>
                     </img>
                    </xsl:when>
                    <xsl:otherwise>
								<xsl:value-of select="title"/>
                                </xsl:otherwise>
                                </xsl:choose>
							</a>
						</span>
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

       <xsl:call-template name="latestNews"/> 
	</xsl:template>
    
    <xsl:template name="latestNews">
    		<!-- we should add the rss feed here... for later-->
		<h1 class="newstitle">NEWS</h1>
		
        <ul>
            <xsl:for-each select="document('portlet://news/rss.xml')/bx/plugin/xhtml:html/xhtml:body/xhtml:div[@class='entry' and position() &lt; 6]">
                <li>
                    <a href="{xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href}">
                        <xsl:value-of select="xhtml:h2"/>
                    </a>

                </li>
            </xsl:for-each>
        </ul>
        <br/><br/>
        <h1 class="blogtitle"><a href="http://blog.liip.ch">BLOG</a></h1>
    <ul>
    <xsl:for-each select="php:function('bx_helpers_simplecache::staticHttpReadAsDom','http://blog.liip.ch/en/rss.xml',300)/rss/channel/item[position() &lt; 6]"> 
           <li><a title="{title}" href="{link}"><xsl:value-of select="title"/></a></li>
    </xsl:for-each>


    </ul>

    
    </xsl:template>
	<xsl:template name="html_head">
		<link rel="alternate" type="application/rss+xml" title="RSS 2.0 Feed" href="{$webroot}news/rss.xml"/>
	</xsl:template>
	<xsl:template name="html_head_title">
		<xsl:value-of select="$sitename"/>
		<xsl:for-each select="$navitreePlugin/collection/items//*[@selected='selected']">
                // <xsl:value-of select="title"/>
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
    
    <xsl:template match="xhtml:a" mode="xhtml">
        <a>
        <xsl:choose>
            <xsl:when test="starts-with(@href,'http') and not(contains(@href,$webroot)) and not(contains(@class,'noext'))">
                <xsl:attribute name="class">ext</xsl:attribute>
            </xsl:when>
            <xsl:when test="string-length(substring-before(@href,'.pdf')) &gt; 0">
                <xsl:attribute name="class">pdf</xsl:attribute>
            </xsl:when>
            <xsl:when test="starts-with(@href,'mailto:')">
            <xsl:attribute name="class">mail</xsl:attribute>
            </xsl:when>
            </xsl:choose>
            <xsl:apply-templates select="@*" mode="xhtml"/>

            <xsl:apply-templates mode="xhtml"/>
        </a>
    </xsl:template>
    <!-- 'random' feature :) -->
    <xsl:template match="xhtml:div[@id='random-fr']" mode="xhtml">
        <xsl:choose>
        
        <xsl:when test="$whofirst = 'fr'">
        <xsl:apply-templates mode="xhtml"/>
        <xsl:apply-templates select="../xhtml:div[@id='random-zh']/node()" mode="xhtml"/>
        </xsl:when>
        <xsl:otherwise>
        <xsl:apply-templates select="../xhtml:div[@id='random-zh']/node()" mode="xhtml"/>
        <xsl:apply-templates mode="xhtml"/>
        
        </xsl:otherwise>
        </xsl:choose>
    
    </xsl:template>
    
    <xsl:template match="xhtml:div[@id='random-zh']" mode="xhtml">
    </xsl:template>
    
</xsl:stylesheet>
