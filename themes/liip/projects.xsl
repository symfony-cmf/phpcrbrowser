<xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
        xmlns="http://www.w3.org/1999/xhtml"
        xmlns:php="http://php.net/xsl"
        exclude-result-prefixes="php xhtml i18n">


    <xsl:import href="master.xsl"/>
    <xsl:variable name="s2x" select="/bx/plugin[@name = 'structure2xml']"/>
    <xsl:variable name="getId" select="php:functionString('bx_helpers_globals::GET', 'id')"/>

 <xsl:output encoding="utf-8" method="xml" 
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" 
    doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

    

   
   <xsl:template name="content">
        <h1><i18n:text>Projects</i18n:text>
        </h1>
        <div id="projectsOverview">
            <xsl:for-each select="$s2x/projekt/projekte">
            <xsl:sort select="displayorder" order="descending" data-type="number"/>
            <xsl:choose>
                <xsl:when test="displayorder = 0">
                
                </xsl:when>
                <xsl:otherwise>
                    <div>
                       <a href="{$webrootLangW}{$collectionUri}{php:functionString('bx_helpers_string::makeUri',projekttexte/titel)}_{id}.html" >
                            <img id="bild{id}" src="/dynimages/48{bild1}" alt="{bild1}" width="48" height="36" onmouseover="projectsOverviewHover('{id}');" 
                            onmouseout="projectsOverviewOut('{id}')"/>
                       </a>
                       <!--background-image:url({$webroot}themes/{$theme}/images/projekt-bg.gif);-->
                       <div style="display:none;" id="text{id}" class="projectsSubWindow">
                            <h3><xsl:value-of select="projekttexte/titel"/></h3>
                            <p>
                                <xsl:value-of select="projekttexte/lead"/>
                            </p>
                       </div>
        
                       </div>   
                       
                </xsl:otherwise>
            </xsl:choose>
                
           </xsl:for-each>
        </div>
        
        <!-- Not Live yet -->
        <!--
        <xsl:if test="$s2x/tags/projekttags/projekte2projekttags">
        <div id="projectTags">
        <h1><i18n:text>Tags</i18n:text>
        </h1>
        
        <xsl:for-each select="$s2x/tags/projekttags">
            <xsl:if test="projekte2projekttags/node()">
                <a href="{$webrootLangW}{$collectionUri}tags/{php:functionString('bx_helpers_string::makeUri',tag)}_{id}.html" >
                    <xsl:value-of select="tag"/>
                </a>
                <xsl:if test="position() != last()">
                    <img class="greenPoint" alt="green point" src="/files/images/green_point.jpg"/>
                </xsl:if>
            </xsl:if>
        </xsl:for-each>
        </div>
        </xsl:if>  -->
    </xsl:template>
    
    
</xsl:stylesheet>
