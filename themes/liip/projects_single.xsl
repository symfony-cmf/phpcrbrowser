<xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
        xmlns="http://www.w3.org/1999/xhtml"
        xmlns:php="http://php.net/xsl"
        exclude-result-prefixes="php xhtml i18n">


<xsl:import href="../standard/common.xsl"/>
    <xsl:import href="master_projects.xsl"/>
    <xsl:variable name="s2x" select="/bx/plugin[@name = 'structure2xml']"/>
    
    <xsl:output method="xhtml" encoding="UTF-8" indent="yes"/>

 
    
    	<xsl:template name="html_head_title_end">
	<xsl:value-of select="$s2x/projekt/projekte/projekttexte/titel"/>
        </xsl:template>
        
<xsl:template name="content">
<xsl:choose><xsl:when test="count($s2x/projekt/projekte) = 1"> 
            <xsl:for-each select="$s2x/projekt/projekte">
                <h1 class="projekttitel"><xsl:value-of select="projekttexte/titel"/></h1>
                <p class="lead"><xsl:value-of select="projekttexte/lead"/></p>
                <!--
                <img onmouseover="document.getElementById('bild').src = '/dynimages/430{bild2}';" src="/dynimages/430{bild1}" alt="bild" id="bild"/><br/>
                -->
                <img class="projectImage" src="{$webroot}dynimages/430{bild1}" alt="bild" id="bild"/><br/>
                <xsl:if test="bild2/text()">
                <a class="noBorder" href="#" onclick="nextImg('{$webroot}dynimages/430{bild2}');return false;">
                    <img src="{$webroot}themes/{$theme}/images/next.png" alt="projectNextButton" class="projectNextButton"/>
                </a>
                </xsl:if>
                <br/>
                <br/>
                <div class="description">
                <xsl:apply-templates select="projekttexte/slogan/node()" mode="xhtml"/>
                </div>
		<!--
                <p>
                    <img alt="/files/images/facts.gif" src="/files/images/facts.gif"/>
                </p>
		
		-->
		<div class="facts">
		<h2 class="facts-title">Facts</h2>
                
                <ul class="facts">
                <li class="facts-left">
                <h4><i18n:text>Endkunde</i18n:text></h4>
                <p>
                <xsl:value-of select="kunden/kunde"/>
                </p>
                </li>
                <li class="facts-right">
                <h4><i18n:text>Zielpublikum</i18n:text></h4>
                <p>
                <xsl:value-of select="projekttexte/zielpublikum"/>
                </p>
                </li>
                <xsl:if test="projektlinks/link/text() or projektlinks/text/text()" >
                <li class="facts-left">
                <h4><i18n:text>Link</i18n:text></h4>
                <p>
                <xsl:variable name="link" select="projektlinks/link"/>
                <xsl:variable name="text" select="projektlinks/text"/>
                <a href="http://{$link}"><xsl:value-of select="$text"/></a>
                </p>
                </li>
                </xsl:if>
		
	<xsl:if test="kunden/kundelogo != ''">
                <li class="clr"/>
                <li>
                <img alt="" src="{kunden/kundelogo}"/>
                </li>
		</xsl:if>
        
        <xsl:if test="$s2x/projektpartner/projekte/projekte2partner/node()">
         <li class="facts-left">
                <h4><i18n:text>Partner</i18n:text></h4>
                <xsl:for-each select="$s2x/projektpartner/projekte/projekte2partner">
                    <xsl:value-of select="kunden/kundentexte/kundename"/>
                    <xsl:if test="position() != last()">
                    ,
                    </xsl:if>
                </xsl:for-each>
                </li>
                </xsl:if>
                </ul>
                </div>
            </xsl:for-each>
            <br clear="left"/>
            
            <xsl:if test="$s2x/projekt/projekte/projekte2projekttags/projekttags">
            <div id="projectTags">
            <h1><i18n:text>Tags</i18n:text>
            </h1>
            
                <xsl:for-each select="$s2x/projekt/projekte/projekte2projekttags/projekttags">
            <a href="{$webrootLangW}{$collectionUri}tags/{php:functionString('bx_helpers_string::makeUri',tag)}_{id}.html" >
                    <xsl:value-of select="tag"/>
                </a>
                    <xsl:if test="position() != last()">
                    <img class="greenPoint" alt="green point" src="/files/images/green_point.jpg"/>
                </xsl:if>
            </xsl:for-each>
            </div>
            </xsl:if>
            <a href="{$webrootLangW}{$collectionUri}" ><i18n:text>back</i18n:text></a>
        </xsl:when>
        <xsl:otherwise>
        <p><i18n:text>Kein Projekt unter diesem Link gefunden.</i18n:text></p>
        <a href="{$webrootLangW}{$collectionUri}" ><i18n:text>back</i18n:text></a>
        </xsl:otherwise>
        
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="xhtml:h2" mode="xhtml">
        <h2><xsl:copy-of select="text()"/></h2>
    </xsl:template>
    
    <xsl:template match="xhtml:p" mode="xhtml">
        <p><xsl:copy-of select="text()" mode="xhtml"/></p>
    </xsl:template>
    
    <xsl:template name="implementierung">
        <xsl:param name="implementierungInfo"/>
        <p>
        implementierung<br/>
        typ-><xsl:value-of select="$implementierungInfo/typ"/><br/>
        text->
        <xsl:choose>
        <xsl:when test="$lang = 'en'">
            <xsl:value-of select="$implementierungInfo/text_en"/>
        </xsl:when>
        <xsl:when test="$lang = 'de'">
            <xsl:value-of select="$implementierungInfo/text_de"/>
        </xsl:when>
        <xsl:otherwise>
            <xsl:value-of select="$implementierungInfo/text_fr"/>
        </xsl:otherwise>
        </xsl:choose>
        </p>
    </xsl:template>
    
    
    
</xsl:stylesheet>
