<?xml version="1.0" encoding="utf-8"?>
<!--
	- Uses the html.xsl stylesheet for HTML generation.
-->
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns="http://www.w3.org/1999/xhtml" 
	xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
	exclude-result-prefixes="xhtml i18n"
	version="1.0">
	
	<xsl:param name="webroot" select="'webroot'"/>
	<xsl:param name="webrootStatic" select="'webrootStatic'"/>
	<xsl:param name="lang" select="'lang'"/>
	<xsl:param name="webroot_yui" select="concat($webrootStatic,'js/yui/')"/>
	
	<!--
		<xsl:param name="yuiDir" select="'http://yui.yahooapis.com/2.5.1/build/'"/>
	-->
	<!-- Shared paths in the XML DOM. -->
	<xsl:variable name="queryinfo" select="/command/queryinfo[1]" />
	
	<!-- Current page URI (not including host name) -->
	<xsl:variable name="requestURI" select="$queryinfo/requestURI" />
</xsl:stylesheet>
