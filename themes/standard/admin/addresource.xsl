<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    xmlns="http://www.w3.org/1999/xhtml"
    > 
    <xsl:include href="admin.xsl"/>
    <xsl:include href="adminfields.xsl"/>
    <xsl:param name="webroot" value="'/'"/>
    <xsl:variable name="pluginName" select="/bx/plugin/@name"/>
     
     <xsl:template match="/">
        <html>
            <head><title><i18n:text>Add new Resource</i18n:text></title>
            <link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/formedit.css"/>
            <script type="text/javascript" src="{$webroot}admin/webinc/js/adminfields.js"/>
			<script type="text/javascript" src="{$webroot}admin/webinc/js/showhidelayers.js"/>
            <script type="text/javascript" >
            var requiredFields = new Array();
            <xsl:for-each select="/bx/plugin[@name='admin_addresource']/fields/field[@required='yes']">
            requiredFields.push("<xsl:value-of select="@name"/>");
            </xsl:for-each>
            </script>
            </head>
            <body>
                <xsl:apply-templates/>            
           </body>
        </html>
    </xsl:template>
     
     
    <xsl:template match="plugin[@name='admin_addresource'] | plugin[@name='admin_siteoptions']">
        <form name="adminform" action="" method="POST" enctype="multipart/form-data" onsubmit="return checkForRequired(this);">
            <xsl:apply-templates select="/bx/plugin/fields/field"/>
            <p>
                <input accesskey="s" type="submit" name="send" value="send" />
            </p>
        </form>
		<div id="wait_layer" style="background-color: #ffffff; text-align:center; border:#000000 solid 1px; position:absolute; width:300px; height:115px; z-index:1; left: 200px; top: 200px; visibility: hidden">
			<h3>Upload in progress</h3>
			<p><img src="/themes/standard/admin/images/wait_bar.gif" /><br />
			File is uploading, please wait. This window will be closed after upload.<br />
			</p>
		</div>
    </xsl:template> 
    
    
</xsl:stylesheet>
