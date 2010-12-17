<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">
    <xsl:param name="webroot" value="'/'"/>
    <xsl:param name="mode"/>
    <xsl:param name="requestUri"/>
    <xsl:param name="admin"/>
    <xsl:template match="/">

        <html>
            <xsl:apply-templates select="xhtml:html"/>
        </html>
      

    </xsl:template>


    <xsl:template match="*">
        <xsl:copy>
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="xhtml:head">
        <xsl:copy>
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            <xsl:apply-templates/>
            <link href="{$webroot}themes/standard/admin/css/admin.css" id="adminrcss" rel="stylesheet" media="screen" type="text/css"/>
            <script src="{$webroot}webinc/js/editpopup.js">
                <xsl:text> </xsl:text>
            </script>
            <script src="{$webroot}webinc/js/admin.js">
                <xsl:text> </xsl:text>
            </script>
            <script src="{$webroot}webinc/js/sarissa.js">
                <xsl:text> </xsl:text>
            </script>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="xhtml:body">
        <xsl:copy>
            <xsl:if test="$mode != 'admin'">
                <xsl:attribute name="onload"><xsl:value-of select="@onload"/>; editPopup.init('<xsl:value-of select="$webroot"/>', '<xsl:value-of select="$requestUri"/>');</xsl:attribute>
            </xsl:if>
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            <xsl:apply-templates/>
            <xsl:call-template name="editpopup"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template name="editpopup">

        <xsl:if test="$admin != 'true'">
            <div id="editpopuplink">
                <p>
                    <a href="#" onClick="editPopup.toggle();">Admin</a>
                </p>
            </div>
            <div id="editpopup" onmouseout="editPopup.mouseOut();" onmouseover="editPopup.mouseOver();" border="5">
                <p id="editpopupchild" class="menuentry"><img alt="..." src="{$webroot}admin/webinc/img/icons/loading.gif" />  Loading ...</p>
            </div>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
