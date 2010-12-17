<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns="http://www.w3.org/1999/xhtml"
    > 
    <xsl:include href="admin.xsl"/>
    <xsl:param name="webroot" value="'/'"/>
    <xsl:variable name="pluginName" select="'admin_addresource'"/>
     
     
         <xsl:template match="/">
        <html>
            <head><title>BXCMS-BLOG</title>
            <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/formedit.css"/>
            
            </head>
            <body>
            <h3>BXCMS-BLOG</h3>               
            
            
             
            
            </body>
        </html>
    </xsl:template>
     
     
    
</xsl:stylesheet>
