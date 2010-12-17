<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    > 
    <xsl:include href="admin.xsl"/>
    <xsl:include href="adminfields.xsl"/>
    <xsl:param name="webroot" value="'/'"/>
    <xsl:variable name="pluginName" select="'admin_collection'"/>
     
     <xsl:template match="/">
        <html>
            <head><title><i18n:text>Add a new Collection</i18n:text></title>
            <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/formedit.css"/>
            </head>
            <body>
                <xsl:apply-templates/>            
           </body>
        </html>
    </xsl:template>
     
    <xsl:template match="plugin[@name='admin_collection']">
        <form name="adminform" action="" method="POST" enctype="multipart/form-data">
            <xsl:apply-templates select="/bx/plugin[@name='admin_collection']/fields/field"/>
            <p>
                <input type="submit" name="send" value="send" i18n:attr="value"/>
            </p>
        </form>
    </xsl:template> 
    
</xsl:stylesheet>
