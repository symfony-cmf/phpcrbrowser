<?xml version="1.0" encoding="utf-8"?>
<!-- $Id: transformxsl.xsl 1808 2007-11-26 16:19:21Z chregu $ -->
<xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xslt="output.xsl"
 xmlns:doap="http://usefulinc.com/ns/doap#"
 xmlns="http://www.w3.org/1999/xhtml" 
 
        >
    
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
    
    <xsl:namespace-alias stylesheet-prefix="xslt" result-prefix="xsl"/>

    <xsl:template match="/">

        <xsl:apply-templates/>

    </xsl:template>

    <xsl:template match="xsl:stylesheet">
        <xsl:copy>
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            
           <!-- <xsl:copy-of select="document('elementpath.xsl')/root/*"/>-->

            <xsl:apply-templates/>
        </xsl:copy>

    </xsl:template>

<!--
<xsl:template match="xsl:apply-templates">
    <xhtml:div id="{generate-id()}" bxe_xpath="{@select}"></xhtml:div>
</xsl:template>-->

    <xsl:template match="*">
        <xsl:copy>

            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>

            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="xsl:include|xsl:import">
        <xsl:variable name="doc" select="document(@href)"/>
        <xsl:copy-of select="$doc/xsl:stylesheet/xsl:param"/>
        <xsl:copy-of select="$doc/xsl:stylesheet/xsl:variable"/>
        <xsl:apply-templates select="$doc/xsl:stylesheet/xsl:include"/>
        <xsl:apply-templates select="$doc/xsl:stylesheet/xsl:import"/>
        <xsl:apply-templates select="$doc/xsl:stylesheet/xsl:template"/>
        
    </xsl:template>

    <xsl:template match="xsl:value-of[ not(ancestor::xsl:attribute) and 
                                       not(contains(@select,'$')) and 
                                       not(contains(@select,'(')) and
                                       not(number(@select) = @select) 
                                       
                                       ]
                         |xsl:copy-of">
        <xsl:choose>
            <xsl:when test="not(../@__bxe_id)">
                <xsl:variable name="xpath">
                    <xsl:choose>
                        <xsl:when test="contains(@select, '@')"><xsl:value-of select="@select"/>/parent::*/@__bxe_id</xsl:when>
                        <xsl:when test="@select = '.' and ../xsl:template[match='text()']">../@__bxe_id</xsl:when>
                        
                        <xsl:when test="@select"><xsl:value-of select="@select"/>/@__bxe_id</xsl:when>
                        
                        <xsl:otherwise>@__bxe_id</xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>             
                <xsl:element name="choose" namespace="http://www.w3.org/1999/XSL/Transform">
                   <xsl:element name="when" namespace="http://www.w3.org/1999/XSL/Transform">
                       <xsl:attribute name="test"><xsl:value-of select="$xpath"/> != ''</xsl:attribute>
                       
                                
                    <span>
                    <xsl:element name="attribute" namespace="http://www.w3.org/1999/XSL/Transform">
                        <xsl:attribute name="name">__bxe_id</xsl:attribute>
                        <xsl:element name="value-of" namespace="http://www.w3.org/1999/XSL/Transform">
                            <xsl:attribute name="select"><xsl:value-of select="$xpath"/></xsl:attribute>
                        </xsl:element>
                    </xsl:element>
                    <xsl:call-template name="copyValueOfNode"/>
                </span>
                </xsl:element>
                    <xsl:element name="otherwise" namespace="http://www.w3.org/1999/XSL/Transform">   
                    
                        <xsl:call-template name="copyValueOfNode"/>
                    </xsl:element>
                    </xsl:element>
                    
                
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="copyValueOfNode"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="copyValueOfNode">
                <!-- attribute nodes... -->
        <xsl:if test="contains(@select, '@')">
            <xsl:element name="attribute" namespace="http://www.w3.org/1999/XSL/Transform">
                <xsl:attribute name="name">__bxe_attribute</xsl:attribute>
                <xsl:value-of select="substring-after(@select,'@')"/>
            </xsl:element>
    

        </xsl:if>
        <xsl:element name="copy-of" namespace="http://www.w3.org/1999/XSL/Transform">
            <xsl:attribute name="select">
                <xsl:choose>
                    <xsl:when test="@select">
                        <xsl:value-of select="@select"/>/@__bxe_defaultcontent</xsl:when>
                    <xsl:otherwise>@__bxe_defaultcontent</xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
        </xsl:element>

        <xsl:copy>
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
    

            <xsl:apply-templates/>
        </xsl:copy>

    </xsl:template>
    

    <xsl:template match="*[((namespace-uri() = '' and xsl:apply-templates) or 
                            (namespace-uri()='http://www.w3.org/1999/XSL/Transform' and local-name()='element')) 
                            and not(@__bxe_id and @__bxe_id = 'none')]">

        <xsl:copy>
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            <xsl:element name="attribute" namespace="http://www.w3.org/1999/XSL/Transform">
                <xsl:attribute name="name">__bxe_id</xsl:attribute>
                <xsl:element name="value-of" namespace="http://www.w3.org/1999/XSL/Transform">
                    <xsl:choose>
                        <xsl:when test="@select">
                            <xsl:attribute name="select">
                                <xsl:value-of select="@select"/>/@__bxe_id</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="select">@__bxe_id</xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:element>
            <xsl:element name="copy-of" namespace="http://www.w3.org/1999/XSL/Transform">
                <xsl:attribute name="select">@__bxe_defaultcontent</xsl:attribute>
            </xsl:element>

            <xsl:apply-templates/>
        </xsl:copy>

    </xsl:template>

    <xsl:template match="*[namespace-uri() = '' and (ancestor::xsl:template ) and not(descendant::xsl:value-of[not(contains(@select,'@') and not (contains(@select,'[')) and not( contains(substring-before(@select,'['),'@')))]) and not (descendant::xsl:apply-templates)]">

        <xsl:copy>
            <xsl:call-template name="descendantOfTemplate"/>
        </xsl:copy>

    </xsl:template>

    <xsl:template name="descendantOfTemplate">
        <xsl:for-each select="@*">
            <xsl:copy/>
        </xsl:for-each>
        <xsl:if test="not(following-sibling::*/@__bxe_id) and (.//*[namespace-uri() = 'http://www.w3.org/1999/XSL/Transform'])">

            <xsl:element name="attribute" namespace="http://www.w3.org/1999/XSL/Transform">

                <xsl:attribute name="name">__bxe_id</xsl:attribute>
                <xsl:element name="value-of" namespace="http://www.w3.org/1999/XSL/Transform">
                    <xsl:choose>
                        <xsl:when test="@select">
                            <xsl:attribute name="select">
                                <xsl:value-of select="@select"/>/@__bxe_id</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="select">@__bxe_id</xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:element>
        </xsl:if>
        <xsl:element name="copy-of" namespace="http://www.w3.org/1999/XSL/Transform">
            <xsl:attribute name="select">@__bxe_defaultcontent</xsl:attribute>
        </xsl:element>
                

        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="xsl:value-of[starts-with(@select,'php:')]">
        <xsl:value-of select="@select"/>
    </xsl:template>
  
    

    <xsl:template match="xsl:for-each[@select='@*']">
        <xsl:copy>

            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            <xsl:attribute name="select">@*[local-name() != '__bxe_id']</xsl:attribute>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
                            
  
  
  
<!-- rewrite a tags -->
   <xsl:template match="a|xhtml:a|script|xhtml:script">

        <span class="{local-name()}" __bxe_ns="{namespace-uri()}">
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            <xsl:apply-templates/>
        </span>
    </xsl:template>

    <xsl:template match="xsl:value-of[starts-with(@select,'php:')]">
        <xsl:value-of select="@select"/>
    </xsl:template>
</xsl:stylesheet>

