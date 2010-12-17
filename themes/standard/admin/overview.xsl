<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:php="http://php.net/xsl"
        xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
        xmlns="http://www.w3.org/1999/xhtml"
        >
    <xsl:output encoding="utf-8" method="xml"></xsl:output>
    <xsl:param name="webroot" value="'/'"/>
    <xsl:variable name="collectionUri" select="bx/plugin/overview/@collectionUri"/>
    <xsl:template match="/">
        <html>
            <head>
                <title>foo</title>
                <xsl:choose>
                    <xsl:when test="$collectionUri = '/'">
                        <link href="{$webroot}themes/standard/admin/css/overviewhome.css" type="text/css" rel="stylesheet"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <link href="{$webroot}themes/standard/admin/css/overview.css" type="text/css" rel="stylesheet"/>
                    </xsl:otherwise>
                </xsl:choose>
                <script src="{$webroot}admin/webinc/js/overview.js" type="text/javascript">
                    <xsl:text> </xsl:text>
                </script>
            </head>
            <body>
                <xsl:variable name="opentabs" select="php:function('bx_helpers_config::getOpenTabs')"/>

                <div id="container">
                    <xsl:for-each select="/bx/plugin/overview/section[count(tab/links/link) &gt; 0]">
                        <xsl:variable name="openTabType" select="$opentabs/opentabs/tab[@type = current()/@type]"/>
                        <xsl:variable name="openTab" select="tab[concat('li_',@id) = $openTabType/text()]"/>
                        <fieldset>
                            <legend>
                                <xsl:if test="@icon">
                                    <img alt="{title}" title="{title}" src="{$webroot}themes/standard/admin/images/overview/{@icon}.png" height="60" border="0"/>
                                </xsl:if>
                                <i18n:text><xsl:value-of select="title"/></i18n:text>
                            </legend>


                            <div class="navitab" name="{@type}">
                                                    
                                <ul>
                                    <xsl:choose>
                                        <xsl:when test="count(tab) > 1">
                                            <xsl:for-each select="tab[count(links/link) &gt; 0]">
                                                <li id="li_{@id}">
                                                    <a href="#" onclick="switchTab('{@id}')">
                                                        <xsl:choose>
                                                            <xsl:when test="current() = $openTab or (not($openTab) and position() = 1) ">
                                                                <xsl:attribute name="class">selected</xsl:attribute>
                                                            </xsl:when>
                                                    

                                                        </xsl:choose>
                                                        <i18n:text><xsl:value-of select="@title"/></i18n:text>
                                                    </a>
                                                </li>

                                            </xsl:for-each>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <li>
                                                <a href="">&#160;</a>
                                            </li>
                                        </xsl:otherwise>

                                    </xsl:choose>

                                </ul>
                                <br class="clr"/>
                            </div>
                            
                            

                            <xsl:for-each select="tab">
                                <div id="tab_{@id}" class="tabcontent">
                                    <xsl:choose>
                                        <xsl:when test="current() = $openTab or (not($openTab) and position() = 1) ">

                                            <xsl:attribute name="class">tabcontent</xsl:attribute>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="class">tabcontentHidden</xsl:attribute>
                                        </xsl:otherwise>
                                    </xsl:choose>

                                    <xsl:for-each select="links">
                                        <ul>
                                            <xsl:for-each select="link">
                                                <li>
                                                             <xsl:if test="@class">
                                                            <xsl:attribute name="class"><xsl:value-of select="@class"/></xsl:attribute>
                                                            </xsl:if>


                                                    <xsl:choose>
                                                    <xsl:when test="@href =''">
                                                        <span i18n:attr="title">
                                                        <xsl:if test="helptext">
                                                            <xsl:attribute name="title">
                                                                <xsl:value-of select="helptext"/>
                                                            </xsl:attribute>
                                                        </xsl:if>
                                                        <i18n:text><xsl:value-of select="title"/></i18n:text>
                                                        </span>
                                                    </xsl:when>
                                                        <xsl:when test="starts-with(@href,'javascript:')">
                                                            <a href="{@href}" i18n:attr="title">
                                                                <xsl:if test="helptext">
                                                                    <xsl:attribute name="title">
                                                                        <xsl:value-of select="helptext"/>
                                                                    </xsl:attribute>
                                                                </xsl:if>
                                                                <i18n:text><xsl:value-of select="title"/></i18n:text>
                                                            </a>
                                                        </xsl:when>
                                                        
                                                        <xsl:when test="starts-with(@href,'http://') or starts-with(@href, 'https://')">
                                                         <a href="{@href}" i18n:attr="title">
                                                             <xsl:if test="@style">
                                                            <xsl:attribute name="style"><xsl:value-of select="@style"/></xsl:attribute>
                                                            </xsl:if>
                                                            <xsl:if test="@target">
                                                            <xsl:attribute name="target"><xsl:value-of select="@target"/></xsl:attribute>
                                                            </xsl:if>
                                                                <xsl:if test="helptext">
                                                                    <xsl:attribute name="title">
                                                                        <xsl:value-of select="helptext"/>
                                                                    </xsl:attribute>
                                                                </xsl:if>
                                                                <xsl:if test="title">
                                                                    <xsl:attribute name="title">
                                                                        <xsl:value-of select="title"/>
                                                                    </xsl:attribute>
                                                                </xsl:if>

                                                                <i18n:text><xsl:value-of select="title"/></i18n:text>
                                                            </a>
                                                        
                                                        </xsl:when>
                                                        <xsl:otherwise>
                                                            <a href="{$webroot}admin/{@href}" i18n:attr="title">
                                                            <xsl:if test="@target">
                                                            <xsl:attribute name="target" select="@target"/>
                                                            </xsl:if>
                                                                <xsl:if test="helptext">
                                                                    <xsl:attribute name="title">
                                                                        <xsl:value-of select="helptext"/>
                                                                    </xsl:attribute>
                                                                </xsl:if>
                                                                <xsl:if test="title">
                                                                    <xsl:attribute name="title">
                                                                        <xsl:value-of select="title"/>
                                                                    </xsl:attribute>
                                                                </xsl:if>

                                                                <i18n:text><xsl:value-of select="title"/></i18n:text>
                                                            </a>
                                                        </xsl:otherwise>
                                                    </xsl:choose>
                                                </li>

                                            </xsl:for-each>
                                        </ul>
                                    </xsl:for-each>
                                </div>
                            </xsl:for-each>
                        </fieldset>
                        <xsl:if test="$collectionUri = '/' and position() mod 2 = 0">
                            <br class="clr" />

                        </xsl:if>
                    </xsl:for-each>
                </div>
                

                <!--    <span id="tab_{generate-id()}"/>
-->


            </body>
        </html>
    </xsl:template>


</xsl:stylesheet>
  
