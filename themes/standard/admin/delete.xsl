<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns="http://www.w3.org/1999/xhtml"
    >

<xsl:output encoding="utf-8" method="xml" indent="yes"
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" 
    doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
    />
    
<xsl:param name="webroot" select="$webroot"/>   
    
<xsl:template match="/">
<html>
<head>
<title/>
<link rel="stylesheet" type="text/css" href="{$webroot}themes/standard/admin/css/admin.css"/>
<!--
<xsl:if test="//plugin/response/@updateTree">
   <script type="text/javascript">
            window.parent.navi.Navitree.reload('/<xsl:value-of select="substring(//plugin/response/@updateTree,1,string-length(//plugin/response/@updateTree)-1)"/>');
        </script>
</xsl:if>

<xsl:if test="//plugin/response/@updateTree2">
   <script type="text/javascript">
            window.parent.navi.Navitree.reload('/<xsl:value-of select="substring(//plugin/response/@updateTree2,1,string-length(//plugin/response/@updateTree2)-1)"/>');
        </script>
</xsl:if>-->
</head>
<body>

         
<xsl:choose>
    <xsl:when test="/bx/plugin[@name='admin_delete']/response = 'ok' ">
        Deleted!
    </xsl:when>
    <xsl:when test="/bx/plugin/response[@status = 'ok']">
       <xsl:value-of select = "/bx/plugin/response[@status = 'ok']"/>
    </xsl:when>
    <xsl:when test="/bx/plugin/response/text() != 'failed'">
        <xsl:value-of select = "/bx/plugin/response"/>
    </xsl:when>
    <xsl:otherwise>
        Something went wrong!
    </xsl:otherwise>
</xsl:choose>

</body>
</html>
</xsl:template>


</xsl:stylesheet>
