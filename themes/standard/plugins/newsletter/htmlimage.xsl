<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl" exclude-result-prefixes="xhtml">

	<xsl:output encoding="ISO-8859-1" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>

	<xsl:template match="/">
		<xsl:apply-templates mode="xhtml"/>
	</xsl:template>
	
	<!-- Finds all image src tags -->
	<xsl:template match="xhtml:img/@src" mode="xhtml">
		<!-- Replace the full path with the filename only, the PHP callback function preloads the images at the same time -->
		<xsl:attribute name="src"><xsl:value-of select="php:functionString('bx_editors_newsmailer_newsmailer::adjustImagePath',.)"/></xsl:attribute>
	</xsl:template>
	
	<xsl:template match="xhtml:table/@background" mode="xhtml">
		<!-- Replace the full path with the filename only, the PHP callback function preloads the images at the same time -->
		<xsl:attribute name="background"><xsl:value-of select="php:functionString('bx_editors_newsmailer_newsmailer::adjustImagePath',.)"/></xsl:attribute>
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
