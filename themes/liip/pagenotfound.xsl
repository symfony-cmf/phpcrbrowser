<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet version="1.0" 
 xmlns:error="http://apache.org/cocoon/error/2.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">
    <xsl:import href="master.xsl"/>
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
    <xsl:template name="content">
       <h1>Page Not Found</h1>
       <p>
		 <xsl:value-of select="$webroot"/><xsl:value-of select="/bx/error:notify/error:message"/>
         </p>
		
    </xsl:template>
</xsl:stylesheet>
