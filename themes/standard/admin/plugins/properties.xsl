<?xml version="1.0"?>
<!DOCTYPE stylesheet [
    <!ENTITY amp "&#252;" >
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:i18n="http://apache.org/cocoon/i18n/2.1" xmlns:php="http://php.net/xsl">
    <xsl:output encoding="utf-8" method="xml" indent="yes" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

    <xsl:param name="webroot" select="webroot"/>
    <xsl:variable name="path" select="//plugin[@name='admin_properties']/properties/@path"/>

    <xsl:template match="/">
        <html>
        

            <head>
                <title>
                    <i18n:translate>
                        <i18n:text>Edit Properties for {0}.</i18n:text>
                        <i18n:param>
                            <xsl:value-of select="$path"/>
                        </i18n:param>
                    </i18n:translate>
                </title>
                <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/formedit.css"/>
                <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/admin.css"/>

                <xsl:if test="//plugin[@name='admin_properties']/properties/@updateTree">
                    <script type="text/javascript">
            window.parent.navi.Navitree.reload('<xsl:value-of select="substring($path,1,string-length($path)-1)"/>');
            </script>
            
            

                </xsl:if>
                <xsl:if test="/bx/plugin[@name='admin_properties']/properties/property/*[@type='datetime']">
                    <script type="text/javascript" language="JavaScript" src="/webinc/plugins/dbform/js/formxmlcheck.js"></script>
                    <script type="text/javascript" language="JavaScript" src="/webinc/js/sarissa.js"></script>
                    <script type="text/javascript" language="JavaScript" src="/webinc/js/formedit.js"></script>
                    <script type="text/javascript" language="JavaScript" src="/webinc/js/CalendarPopup.js"></script>
                    <script language="JavaScript" type="text/javascript">
                        <xsl:comment>
                    document.write(getCalendarStyles());
                    var cal = new CalendarPopup('caldiv');
                    cal.showYearNavigation();
                </xsl:comment>
                    </script>
                </xsl:if>
            </head>
            <body>
                <div id="admincontent">
                    <xsl:apply-templates select="/bx/plugin"/>
                </div>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="plugin[@name='admin_properties']">
        <h2>
            <i18n:translate>
                <i18n:text>Edit Properties for {0}.</i18n:text>
                <i18n:param>
                    <xsl:value-of select="$path"/>
                </i18n:param>
            </i18n:translate>
        </h2>

        <form action="" method="POST" name="admin" enctype="multipart/form-data">
            <xsl:for-each select="properties/categories/category[@hasProperties != '']">
                <span>
                    <a href="?category={@name}">
                        <xsl:attribute name="class">
                            <xsl:choose>
                                <xsl:when test="@active != ''">buttonStyleActive</xsl:when>
                                <xsl:otherwise>buttonStyle</xsl:otherwise>
                            </xsl:choose>
                        </xsl:attribute>
                        <xsl:value-of select="@name"/>
                    </a>
                    <xsl:text> </xsl:text>
                </span>
            </xsl:for-each>

            <table class="bigUglyBorderedEditTable" width="550">
                <tr>
                    <td align="left" width="100">&#160;</td>
                    <td align="left">&#160;</td>
                </tr>
                <xsl:apply-templates select="properties/property/metadata" mode="propertyfields"/>
            </table>
            <p>
                <input type="submit" accesskey="s" name="send" value="Save"/>
            </p>
        </form>
    </xsl:template>


    <xsl:template name="urlEncodeSlash">
        <xsl:param name="string"/>
        <xsl:if test="contains($string, '/')">
            <xsl:value-of select="substring-before($string, '/')"/>%2F<xsl:call-template name="urlEncodeSlash"><xsl:with-param name="string"><xsl:value-of select="substring-after($string,'/')"/>
                </xsl:with-param>
            </xsl:call-template>
        </xsl:if>
        <xsl:if test="not(contains($string,'/'))">
            <xsl:value-of select="$string"/>
        </xsl:if>
    </xsl:template>

    <xsl:template match="*[@type='datetime']" mode="propertyfields">
        <tr>
            <td>
                <div class="blackH5" title="{concat(../@namespace,':',../@name)}">
                    <xsl:choose>
                        <xsl:when test="../@niceName">
                            <xsl:value-of select="../@niceName"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(../@namespace, ':', ../@name)"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </div>
            </td>
            <td class="blackH5">
                <xsl:variable name="encPath">
                    <xsl:call-template name="urlEncodeSlash">
                        <xsl:with-param name="string">
                            <xsl:value-of select="../../@path"/>
                        </xsl:with-param>
                    </xsl:call-template>
                </xsl:variable>
                <xsl:variable name="inpName" select="concat('bx[plugins][',../../../@name,'][',$encPath,'][',../@fieldname,']')"/>
                <input type="text" id="{../@fieldname}" name="bx[plugins][{../../../@name}][{../../@path}][{../@fieldname}]" size="{@size}" maxlength="{@maxLength}" value="{../@value}"/>
                <a href="#" onClick="cal.select(document.getElementById('{../@fieldname}'),'anchor_{$inpName}','dd.MM.yyyy 00:00:00'); return false;" name="anchor_{$inpName}" id="anchor_{$inpName}">select</a>
                <div id="caldiv" style="position:absolute;visibility:hidden;background-color:white;layer-background-color:white;"></div>
            </td>
        </tr>
    </xsl:template>
       

    <xsl:template match="*[@type='textfield']" mode="propertyfields">
        <tr>
            <td>
                <div class="blackH5" title="{concat(../@namespace, ':', ../@name)}">
                    <xsl:choose>
                        <xsl:when test="../@niceName">
                            <xsl:value-of select="../@niceName"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(../@namespace, ':', ../@name)"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </div>
            </td>
            <td class="blackH5">
                <input type="text" name="bx[plugins][{../../../@name}][{../../@path}][{../@fieldname}]" size="{@size}" maxlength="{@maxLength}" value="{../@value}" />
            </td>
        </tr>
    </xsl:template>

    <xsl:template match="*[@type='textfield' and tags/tag]" mode="propertyfields">
        <tr>
            <td>
                <div class="blackH5" title="{concat(../@namespace, ':', ../@name)}">
                    <xsl:choose>
                        <xsl:when test="../@niceName">
                            <xsl:value-of select="../@niceName"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(../@namespace, ':', ../@name)"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </div>
            </td>
            <td class="blackH5">
                <input type="text" id="tags" name="bx[plugins][{../../../@name}][{../../@path}][{../@fieldname}]" size="{@size}" maxlength="{@maxLength}" value="{../@value}" />
            </td>
        </tr>

        <xsl:if test="count(tags/tag) &gt; 0">
            <tr>
                <td></td>
                <td>
                    <script type="text/javascript">
                    function appendTag() {
                        s = document.getElementById('taglist');
                        if (s) {
                            tag = s.options[s.options.selectedIndex].value;
                            if (tag!="") {
                                tag = (tag.indexOf(' ') &gt; 0) ? '"'+tag+'"' : tag;
                                tagf = document.getElementById('tags');
                                if (tagf) {
                                    tagf.value = (tagf.value=="") ? tag : tagf.value + " " + tag;
                                }
                            }
                        } 
                    }
                </script>
                    <select id="taglist" onchange="appendTag()">
                        <option value="">-------------------------------</option>
                        <xsl:for-each select="tags/tag">
                            <xsl:variable name="tagvar">
                                <xsl:value-of select="@tag" disable-output-escaping="yes"/>
                            </xsl:variable>
                            <option>
                                <xsl:attribute name="value">
                                    <xsl:value-of select="@tag" disable-output-escaping="yes"/>
                                </xsl:attribute>
                                <xsl:choose>
                                    <xsl:when test="not(@displayname='')">
                                        <xsl:value-of select="@displayname" disable-output-escaping="yes"/>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="@tag" disable-output-escaping="yes"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </option>
                        </xsl:for-each>
                    </select>
                </td>
            </tr>
        </xsl:if>

    </xsl:template>

    <xsl:template match="*[@type='textarea']" mode="propertyfields">
        <tr valign="top">
            <td>
                <div class="blackH5" title="{concat(../@namespace, ':', ../@name)}">
                    <xsl:choose>
                        <xsl:when test="../@niceName">
                            <xsl:value-of select="../@niceName"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(../@namespace, ':', ../@name)"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </div>
            </td>
            <td class="blackH5">
                <textarea name="bx[plugins][{../../../@name}][{../../@path}][{../@fieldname}]" rows="6" cols="80">
                    <xsl:value-of select="../@value"/>
                </textarea>
                <!--<input type="text" name="bx[plugins][{../../../@name}][{../../@path}][{../@fieldname}]" size="{@size}" maxlength="{@maxLength}" value="{../@value}" />-->
            </td>
        </tr>
    </xsl:template>

    <xsl:template match="*[@type='readonly']" mode="propertyfields">
        <tr>
            <td>
                <div class="blackH5">
                    <xsl:value-of select="concat(../@namespace, ':', ../@name)"/>
                </div>
            </td>
            <td class="blackH5">
                <xsl:value-of select="../@value"/>
            </td>
        </tr>
    </xsl:template>
    

    <xsl:template match="*[@type='select']" mode="propertyfields">
        <tr>
            <td>
                <div class="blackH5">
                     <xsl:choose>
                        <xsl:when test="../@niceName">
                            <xsl:value-of select="../@niceName"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(../@namespace, ':', ../@name)"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </div>
            </td>
            <td class="blackH5">
                <select name="bx[plugins][{../../../@name}][{../../@path}][{../@fieldname}]">

                    <option value="">-------------------------------</option>
                    <xsl:for-each select="select/option">
                        <option value="{@value}">
                        <xsl:if test="../../../@value = @value">
                        <xsl:attribute name="selected">selected</xsl:attribute>
                        </xsl:if>
                            <xsl:value-of select="."/>
                        </option>
                    </xsl:for-each>
                </select>
            </td>
        </tr>
    </xsl:template>

</xsl:stylesheet>
