<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl" exclude-result-prefixes="xhtml">
<xsl:param name="webroot"/>
	<xsl:output encoding="ISO-8859-1" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

	<xsl:template match="/">
		<xsl:apply-templates mode="xhtml"/>
	</xsl:template>
	
	<!-- Finds all image src tags -->
	<xsl:template match="xhtml:img/@src[starts-with(.,'/')]" mode="xhtml">
		<!-- Replace the full path with the filename only, the PHP callback function preloads the images at the same time -->
		<xsl:attribute name="src"><xsl:value-of select="$webroot"/><xsl:value-of select="."/></xsl:attribute>
	</xsl:template>
	
	<xsl:template match="xhtml:table/@background[starts-with(.,'/')]" mode="xhtml">
		<!-- Replace the full path with the filename only, the PHP callback function preloads the images at the same time -->
		<xsl:attribute name="background"><xsl:value-of select="$webroot"/><xsl:value-of select="."/></xsl:attribute>
	</xsl:template>
    
    	<xsl:template match="xhtml:a/@href[starts-with(.,'/')]" mode="xhtml">
		<!-- Replace the full path with the filename only, the PHP callback function preloads the images at the same time -->
		<xsl:attribute name="href"><xsl:value-of select="$webroot"/><xsl:value-of select="."/></xsl:attribute>
	</xsl:template>
    
   
	<xsl:template match="*" mode="xhtml">
		<xsl:element name="{local-name()}">
			<xsl:apply-templates select="@*" mode="xhtml"/>
			<xsl:apply-templates mode="xhtml"/>
		</xsl:element>
	</xsl:template>

	<xsl:template match="@*" mode="xhtml">
		<xsl:copy-of select="."/>
	</xsl:template>

</xsl:stylesheet>
