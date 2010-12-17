<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns="http://www.w3.org/1999/xhtml"
    > 

    <xsl:include href="admin.xsl"/>
    <xsl:include href="adminfields.xsl"/>
    <xsl:param name="webroot" value="'/'"/>
    <xsl:variable name="pluginName" select="'admin_listview'"/>
    <xsl:variable name="collectionID" select="/bx/plugin[@name='admin_listview']/listview/@id"/>
     
     <xsl:template match="/">
        <html>
            <head><title><xsl:value-of select="$collectionID"/></title>
            <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/listview.css"/>
            </head>
            <body>
                <div id="header">
                    <h1><xsl:value-of select="$collectionID"/></h1>
                </div>
                <div id="list">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <th>ID</th>
                            <th width="150">Type</th>
                            <th width="150">Display Name</th>
                            <th width="100">Display Order</th>
                        </tr>
                        <xsl:if test="$collectionID != '/'">
                            <tr><td colspan="4"><a href="./..">..</a></td></tr>
                        </xsl:if>
                        <xsl:apply-templates select="/bx/plugin[@name='admin_listview']/listview/collection"/>
                        <xsl:apply-templates select="/bx/plugin[@name='admin_listview']/listview/resource"/>
                    </table>
                </div>
           </body>
        </html>
    </xsl:template>
     
    <xsl:template match="collection|resource">
        <tr>
            <td class="odd">
                <xsl:choose>
                    <xsl:when test="local-name() = 'collection'">
                        <a href="{$webroot}admin/listview{@id}"><xsl:value-of select="substring-after(@id, $collectionID)"/></a>
                    </xsl:when>
                    <xsl:otherwise><xsl:value-of select="substring-after(@id, $collectionID)"/></xsl:otherwise>
                </xsl:choose>
            </td>
            
            <td><xsl:value-of select="@mimeType"/></td>
            <td><xsl:value-of select="@displayName"/></td>
            <td><xsl:value-of select="@displayOrder"/></td>
        </tr>
    </xsl:template> 

</xsl:stylesheet>
