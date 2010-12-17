<?xml version="1.0"?>
<!DOCTYPE stylesheet [
    <!ENTITY amp "&#252;" >
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:i18n="http://apache.org/cocoon/i18n/2.1" xmlns:php="http://php.net/xsl">
    <xsl:output encoding="utf-8" method="xml" indent="yes" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

    <xsl:param name="webroot" select="webroot"/>
	<xsl:param name="path" select="//bx/plugin[@name='admin_history']/history/@path"/>

    <xsl:template match="/">
        <html>
            <head>
                <title>
                	<i18n:text>History: </i18n:text>
                    <xsl:value-of select="//bx/plugin[@name='admin_history']/history/@path"/>
                </title>
                <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/formedit.css"/>
                <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/admin.css"/>
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
                
            </head>
            <body>
                <div id="admincontent">
                    <xsl:apply-templates select="/bx/plugin"/>
                </div>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="plugin[@name='admin_history']">
        <h2>
            <i18n:translate>
                <i18n:text>History for {0}.</i18n:text>
                <i18n:param>
                    <xsl:value-of select="$path"/>
                </i18n:param>
            </i18n:translate>
        </h2>

        <form action="" method="POST" name="admin" enctype="multipart/form-data">
        				<xsl:if test="count(history/entries/entry) != 0">
				<p>
                	<input type="submit" accesskey="s" name="send" value="Load"/>
            	</p>
            	</xsl:if>
        <input type="hidden" name="load" value="1"/>
            <table class="bigUglyBorderedEditTable" width="550">
            	<xsl:choose>
            	<xsl:when test="count(history/entries/entry) = 0">
            		<tr><td><b>No History</b></td></tr>
            	</xsl:when>
            	<xsl:otherwise>
                <tr>
                    <td align="left" width="50">&#160;</td>
                    <td align="left" width="300"><b>Date</b></td>
                </tr>
                
                <xsl:call-template name="versionList"/>
                </xsl:otherwise>
                </xsl:choose>
				</table>
				<xsl:if test="count(history/entries/entry) != 0">
				<p>
                	<input type="submit" accesskey="s" name="send" value="Load"/>
            	</p>
            	</xsl:if>
        </form>
    </xsl:template>

	<xsl:template name="versionList">
		<xsl:for-each select="//bx/plugin[@name='admin_history']/history/entries/entry">
		<xsl:if test="diff_tohead">
		<tr style="vertical-align: top;"><td>
			<input type="radio" name="id"><xsl:attribute name="value"><xsl:value-of select="diff_id"/></xsl:attribute></input>
		</td><td>
			<xsl:value-of select="diff_timestamp"/>
		</td>
		<td>
		<br/>
		<xsl:for-each select="diff_tohead/*">
			<xsl:if test=". != ''">
			<xsl:choose>
			<xsl:when test="local-name() = 'del'">
				<b>Will delete:</b>
			</xsl:when>
			<xsl:otherwise>
				<b>Will add:</b>
			</xsl:otherwise>
			</xsl:choose>
			<br/><textarea cols="80" rows="10" wrap="off">
				<xsl:for-each select="./entry/entry">
				<xsl:value-of select="."/><xsl:text>
</xsl:text>
				</xsl:for-each>
			</textarea><br/><br/>
			</xsl:if>
		</xsl:for-each>
		</td></tr>
		</xsl:if>
		</xsl:for-each>
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

</xsl:stylesheet>
