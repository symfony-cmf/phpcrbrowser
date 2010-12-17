<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    exclude-result-prefixes="xhtml i18n"
    version="1.0">
    <xsl:import href="params.xsl"/>
    
    <xsl:variable name="url" select="$queryinfo/query/url"/>
    
    <xsl:template match="/">
        <html lang="{$lang}" xml:lang="{$lang}">
            <head>
                <title>
               flx2
                </title>
                
                <xsl:call-template name="html_head_css"/>
                
            </head>
            <body class="yui-skin-sam">
                <xsl:call-template name="page_body"/>
            </body>
        </html>
        
        
    </xsl:template>
    
    <xsl:template name="page_head_title">
        
    </xsl:template>
    
    <xsl:template name="html_head_css">
        
       
        
        <link rel="stylesheet" type="text/css" href="{$webroot_yui}reset-fonts-grids/reset-fonts-grids.css" />
        <link rel="stylesheet" type="text/css" href="{$webroot_yui}base/base.css" />
        <link rel="stylesheet" type="text/css" href="{$webrootStatic}css/default.css" media="screen" />
        
        <xsl:call-template name="page_head_css"/>
    </xsl:template>
    
    <xsl:template name="page_head_css">
        
    </xsl:template>
    
    <xsl:template name="page_body">
        <div id="doc3" class="yui-t3">
            <xsl:call-template name="html_body_header"/>
            <xsl:call-template name="html_body_content"/>
            <xsl:call-template name="html_body_footer"/>
        </div>
        <xsl:call-template name="page_bottom_javascript"/>
    </xsl:template>
    
    <xsl:template name="html_body_header">
        <div id="hd">
         ..
        </div>
    </xsl:template>
    
    <xsl:template name="page_body_header">
        <h1>
            <i18n:text>WelcomeText</i18n:text>
        </h1>
    </xsl:template>
    
    <xsl:template name="html_body_content">
        <div id="bd">
            <div id="yui-g">
                <div class="yui-u">
                    <xsl:call-template name="page_body_content"></xsl:call-template>
                </div>
                <xsl:call-template name="html_body_right"/>
            </div>
            
            
        </div>
    </xsl:template>
    
    <xsl:template name="page_body_content">
        No content
    </xsl:template>
    
    <xsl:template name="html_body_right">
        <div class="yui-u">
            <xsl:call-template name="page_body_right"/>
        </div>
        
    </xsl:template>
    
    <xsl:template name="page_body_right">
        
    </xsl:template>
    
    <xsl:template name="html_body_footer">
        <div id="ft">
            <xsl:call-template name="page_body_footer"/>
        </div>
    </xsl:template>
    
    <xsl:template name="page_body_footer">
        ffff
    </xsl:template>
    
    <xsl:template name="page_bottom_javascript">
   
        
    </xsl:template>
    
    
</xsl:stylesheet>

<!--

<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml" 
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    exclude-result-prefixes="xhtml i18n"
    version="1.0">
    
    <xsl:param name="webroot" select="'webroot'"/>
    <xsl:param name="webrootStatic" select="'webrootStatic'"/>
    <xsl:param name="lang" select="'lang'"/>
    <xsl:param name="webroot_yui" select="concat($webrootStatic,'js/yui/')"/>
    
    <xsl:template match="/">
        <html lang="{$lang}" xml:lang="{$lang}">
            <head>
                <title><i18n:text>PageTitle</i18n:text></title>
                
            </head>
            <body>
                <h1><i18n:text>WelcomeText</i18n:text></h1>
                
                
                
            </body>
        </html>
    </xsl:template>
    </xsl:stylesheet>
-->