<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 

xmlns="http://www.w3.org/1999/xhtml"
>

  <xsl:param name="webroot"/>
    <xsl:param name="webrootLang"/>
    <xsl:output encoding="utf-8" method="xml" >
      </xsl:output>
    
    <xsl:template match="/">

    <xsl:apply-templates select="/bx/plugin[@name='metasearch']/*"/>
    </xsl:template>
    <xsl:template match="result">
    
    <div id="metaSearch_result">
    
    <xsl:apply-templates select="resource"/>
    </div>
    
    </xsl:template>
    
    <xsl:template match="resource">
    
    <div class="metaSearch_resource">
    <h2><a href="{$webroot}{@uri}"><xsl:value-of select="title"/></a></h2>
    <div><a href="{$webroot}{@uri}"><xsl:value-of select="@uri"/></a></div>
    </div>
    
    </xsl:template>
    
  
    </xsl:stylesheet>
  