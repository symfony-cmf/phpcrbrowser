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
        <h1><i18n:text>Projects for Tag: </i18n:text>
    <xsl:value-of select="$s2x/tags/projekttags/tag"/>
        </h1>
        <div id="projectsOverview">
            <xsl:choose>
            <xsl:when test="$s2x/projekt/projekte/node()">
                <xsl:for-each select="$s2x/projekt/projekte">
                <xsl:sort select="displayorder" order="descending" data-type="number"/>
                <div>
                   <!--background-image:url({$webroot}themes/{$theme}/images/projekt-bg.gif);-->
                   <div id="text{id}">
                        <a href="{$webrootLangW}{$collectionUri}{php:functionString('bx_helpers_string::makeUri',projekttexte/titel)}_{id}.html" >
                        <h3><xsl:value-of select="projekttexte/titel"/></h3>
                        </a>
                        <p>
                            <xsl:value-of select="projekttexte/lead"/>
                        </p>
                   </div>
    
               </div>   
               <br/>
                    
               </xsl:for-each>
            </xsl:when>
           <xsl:otherwise>
            <p>
            Zu diesem Tag sind keine Projekte vorhanden
            </p>
           </xsl:otherwise>
           </xsl:choose>
        </div>
    </xsl:template>
    
    
</xsl:stylesheet>
