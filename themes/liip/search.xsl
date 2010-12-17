<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
      xmlns:i18n="http://apache.org/cocoon/i18n/2.1"  xmlns:php="http://php.net/xsl" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" exclude-result-prefixes="xhtml php i18n">
    <xsl:import href="master.xsl"/>
    <xsl:import href="../standard/common.xsl"/>

    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

    <xsl:template name="content">
        <h1>Suchresultate / NEWS</h1>
        <xsl:variable name="results" select="/bx/plugin[@name='search']/results"/>
        <p>
            <form action="./" method="get">
                <input type="text" name="q" value=""/>
                <xsl:text> </xsl:text>

                <input type="submit" value="Suche"/>

            </form>

        </p>
        <br/>
<xsl:choose>
        <xsl:when test="$results/*">
        
            <p>

                    <xsl:apply-templates select="$results/node"/>

                </p>
      
        </xsl:when>
<xsl:otherwise>
        <p> 
          <i18n:text>Nichts gefunden. Versuchen Sie es bitte mit einem anderen Suchbegriff</i18n:text> 
        </p> 
  
</xsl:otherwise>
</xsl:choose>
    </xsl:template>
    <xsl:template match="node">

        <div>
            <h1>
                    <xsl:choose>
                        <xsl:when test="post_title">
                            <xsl:value-of select="post_title"/>
                            
                    </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="php:functionString('preg_replace','#/liip.ch(.*)(lx:metadata|/jcr:content)#','$1',jcr_path)"/>
                                
                            
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:text> </xsl:text>
                    <!--<xsl:value-of select="name"/>-->
                
                
                
                
            </h1>

            <p>
                <xsl:value-of select="post_date" disable-output-escaping="yes"/> <br/>
                
                <xsl:if test="html">
                    
                    <xsl:apply-templates select="html/xhtml:html/xhtml:body/xhtml:div/node()" mode="xhtml"/>  
                </xsl:if>
                
                <a href="{php:functionString('preg_replace','#/liip.ch(.*)(lx:metadata|/jcr:content)#','$1',jcr_path)}">
Permalink
</a>
    
    
            </p>
            <br/><br/>
        </div>


    </xsl:template>

    <xsl:template name="contentRight">
    </xsl:template>

</xsl:stylesheet>
