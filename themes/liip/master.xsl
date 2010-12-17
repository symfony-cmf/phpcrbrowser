<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 

   xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl"  exclude-result-prefixes="xhtml php i18n"
    
    php:ns=""
    xhtml:ns=""
    
    i18n:ns=""
    
    >
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
	<!--<xsl:variable name="langsAvail" select="php:functionString('bx_helpers_config::getLangsAvailXML')"/>
	<xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/>
	<xsl:variable name="sitedescription" select="php:functionString('bx_helpers_config::getOption','sitedescription')"/>
    <xsl:variable name="defaultLanguage" select="php:functionString('constant','BX_DEFAULT_LANGUAGE')"/>
    -->
    
    <xsl:variable name="langsAvail" select="'de'"/>
    <xsl:variable name="sitename" select="'bar'"/>
    <xsl:variable name="sitedescription" select="'foo'"/>
    <xsl:variable name="defaultLanguage" select="'de'"/>
    <xsl:param name="theme" select="'liip'"/>
	<xsl:variable name="themeCss" select="'main.css'"/>
	
    <xsl:variable name="whofirst" select="1"/>
    <xsl:variable name="navitreePlugin" select="/bx/plugin[@name='navitree']"/>
                        
	<xsl:variable name="webrootW" select="substring($webroot,1,string-length($webroot)-1)"/>
	<xsl:variable name="webrootLangW" select="substring($webrootLang,1,string-length($webrootLang)-1)"/>
	<xsl:template match="/">
		<html lang="{$lang}">
			<head>
				<meta name="generator" content="Flux CMS - http://www.flux-cms.org"/>
				<meta http-equiv="Content-Language" content="{$lang}"/>
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

    <link rel="stylesheet" type="text/css" href="{$webroot}themes/{$theme}/css/{$themeCss}" media="screen" />
    <link rel="alternate stylesheet" type="text/css" title="Big text" media="screen,print" href="{$webroot}themes/{$theme}/css/bigchars.css" />
			    <link rel="stylesheet" href="{$webroot}static/bxe/css/editor.css" type="text/css" />
    <link type="text/css" href="{$webroot}themes/{$theme}/css/print.css" rel="stylesheet" media="print"/>
			    <script src="{$webroot}static/bxe/bxeLoader.js" type="text/javascript"></script>
	<link rel="shortcut icon" href="{$webroot}favicon.ico" type="image/x-icon"/>
	<xsl:call-template name="html_head"/>
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
                                                                <a href="#" onclick=" window.print(); return false;"><img src="/themes/liip/images/printer.gif" alt="print this page" border="0"/></a>
                                                                <a href="{$webrootLang}news/rss.xml"><img src="/themes/liip/images/delicious.gif" alt="rss feed" border="0"/></a>
        
        
        <a href="#" onclick="bxe_start('/static/config.xml')"> edit</a>
                                                        </p>

						</form>
					</div>
					<div id="banner">
						<div id="language">
						   </div>
						
						<a href="{$webrootLang}">
							<img  src="/themes/liip/images/logo-liip.gif" width="269" height="129" alt="liip-logo" border="0"/>
							
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
					</div>
					<div id="mobile" style="display: none">
						<a href="{$webroot}mo{$requestUri}">Mobile Mode</a>
					</div>
					<div id="left">
						<xsl:call-template name="leftnavi"/>
					</div>
					<div id="right">
						<xsl:call-template name="contentRight"/>
						
						
                    <div class="side-logo"><a href="/news/liip-grosserfolg-bei-best-of-swiss-web.html"><img src="/themes/liip/images/bosw_1-2008.gif" alt="Best of swiss web 2008 - Technology Quality" /></a></div>
		    
		    
		    
                    <div class="side-logo"><a href="/news/liip-grosserfolg-bei-best-of-swiss-web.html"><img src="/themes/liip/images/bosw_2-2008.gif" alt="Best of swiss web 2008 - Technology Quality" /></a></div>
		    
																				<div class="side-logo"><a href="http://swissmadesoftware.org" target="_blank"><img src="/themes/liip/images/swissmadesoftware.gif" alt="swiss made software" /></a></div>
					</div>
					<div id="content" >
    
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
			    <script src="{$webroot}themes/{$theme}/js/liip.js" type="text/javascript"/>
	<xsl:call-template name="html_head_scripts"/>

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
		<xsl:variable name="items" select="items/*[(not(@lang) or @lang=$lang) and (not(filename) or filename!='index') and display-order >= 0]"/>
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
                           
								<xsl:value-of select="title"/>
                           
							</a>
						</span>
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
	</xsl:template>
	<xsl:template name="contentRight">

       <xsl:call-template name="latestNews"/> 
	</xsl:template>
    
    <xsl:template name="latestNews">
		<h1 class="newstitle">NEWS</h1>
		
        <ul>
        </ul>
        <br/><br/>
        <h1 class="blogtitle"><a href="http://blog.liip.ch">BLOG</a></h1>
    <ul>
    

    </ul>

    
    </xsl:template>
	<xsl:template name="html_head">
		<link rel="alternate" type="application/rss+xml" title="RSS 2.0 Feed" href="{$webroot}news/rss.xml"/>
	</xsl:template>
	<xsl:template name="html_head_title">
		<xsl:value-of select="$sitename"/>
		<xsl:for-each select="$navitreePlugin/collection/items//*[@selected='selected']">
                // <xsl:value-of select="title"/>
			<xsl:if test="position() = last() and $filename != 'index'">
                // <xsl:value-of select="items/*[filename=$filename]/title"/>
			</xsl:if>
		</xsl:for-each>
		<xsl:call-template name="html_head_title_end"/>
	</xsl:template>
	<xsl:template name="body_attributes"/>
	<xsl:template name="html_head_title_end"/>
	<xsl:template name="html_head_keywords">
	    	</xsl:template>
	<xsl:template name="html_head_description">
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
