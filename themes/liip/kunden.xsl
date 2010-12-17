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
        <h1><i18n:text>Kunden</i18n:text>
        </h1>
        <p>Kunden die uns vertrauen sind unsere Referenzen.</p>
        <div id="customers">
            <xsl:for-each select="$s2x/kunden/kunden">
            <xsl:choose>
                <xsl:when test="displayorder = 0">
                
                </xsl:when>
                <xsl:otherwise>
                    <div>
                        <h2><span class="contentH2"><xsl:value-of select="kundentexte/kundename"/>, <xsl:value-of select="kundentexte/ort"/></span></h2>
                        <p>
                            <!--
                            <xsl:if test="kunde2partner/node()">
                                <xsl:for-each select="$s2x/kunden/kunden" >
                                    <xsl:call-template name="partner">
                                        <xsl:with-param name="kundenid" select="id"/>
                                        <xsl:with-param name="pos" select="count(kunde2partner)"/>
                                    </xsl:call-template>
                                </xsl:for-each>
                            </xsl:if>
                            -->
                            <xsl:if test="kunde2partner/node()">
                                in Zusammenarbeit mit
                                <xsl:for-each select="kunde2partner" >
                                    <xsl:choose>
                                    <xsl:when test="position() = last()">
                                        <xsl:call-template name="partnerlast">
                                            <xsl:with-param name="partnerid" select="partnerid"/>
                                            <xsl:with-param name="pos" select="1"/>
                                        </xsl:call-template>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:call-template name="partner">
                                            <xsl:with-param name="partnerid" select="partnerid"/>
                                        </xsl:call-template>
                                    </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:for-each>
                            </xsl:if>
                        </p>
                        <p>
                        <xsl:value-of select="kundentexte/branche"/>
                        </p>
                        <p>
                            <img width="240" src="{kundentexte/kundenlogo}" alt="{kundentexte/kundenlogo}"/>
                        </p>
                       </div>   
                       
                </xsl:otherwise>
            </xsl:choose>
                
           </xsl:for-each>
        </div>
    </xsl:template>
    
    <xsl:template name="partnerlast">
        <xsl:param name="partnerid"/>
        <xsl:param name="pos"/>
        <xsl:for-each select="$s2x/partner/kunden" >
            <xsl:if test="id = $partnerid">
                <xsl:value-of select="kundentexte/kundename"/>
            </xsl:if>
        </xsl:for-each>                          
    </xsl:template>
    
    <xsl:template name="partner">
        <xsl:param name="partnerid"/>
        <xsl:for-each select="$s2x/kunden/kunden" >
            <xsl:if test="id = $partnerid">
                <xsl:value-of select="kundentexte/kundename"/>,
            </xsl:if>
        </xsl:for-each>                  
    </xsl:template>
    
    <!--
    <xsl:template name="partner">
        <xsl:param name="kundenid"/>
        <xsl:param name="pos"/>
        <xsl:value-of select="$pos"/>
       <xsl:choose>
           <xsl:when test="$s2x/kunden/kunden/kunde2partner[number(partnerid/text()) = number($kundenid/text())]">
                <xsl:value-of select="kundentexte/kundename"/>&#160;
                <xsl:if test="$pos != last()">
                ;
                </xsl:if>
           </xsl:when>
           <xsl:otherwise>
           </xsl:otherwise>
       </xsl:choose>                            
    </xsl:template>
    -->
</xsl:stylesheet>
