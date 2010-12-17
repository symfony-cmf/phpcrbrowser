<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:blogChannel="http://backend.userland.com/blogChannelModule" xmlns:creativeCommons="http://backend.userland.com/creativeCommonsRssModule" xmlns:blog="http://bitflux.org/doctypes/blog" xmlns:php="http://php.net/xsl" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" exclude-result-prefixes="xhtml,dc,content,blogChannel,creativeCommons,blog,php,geo,wfw">

	<xsl:strip-space elements="*"/>
	<xsl:output method="text" indent = "no"/>

	<!-- Timestamp of the last RSS entry that was already processed -->
	<xsl:param name="lastdate"/>

	<xsl:template match="/">
		<html>
			<head>
        		<title>Newsletter Feed</title>
    		</head>
			<body id="test">
				<div id="content">
					<xsl:apply-templates select="/rss/channel" mode="xhtml"/>
				</div>
			</body>	
		</html>		
	</xsl:template>
	
	<xsl:template match="/rss/channel" mode="xhtml">
		<xsl:for-each select="item">
        	<xsl:if test="$lastdate &lt; dc:date">
				<xsl:value-of select="title"/><xsl:text>&#xa;&#xa;</xsl:text>
				<xsl:apply-templates select="content:encoded/node()" mode="xhtml"/><xsl:text>&#xa;&#xa;</xsl:text>
				<xsl:text>Link: &lt;</xsl:text><xsl:value-of select="link"/><xsl:text>&gt;&#xa;&#xa;</xsl:text>
				<xsl:text>------------------------------------------------------------------------</xsl:text><xsl:text>&#xa;&#xa;</xsl:text>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
    
	<xsl:template match="xhtml:a[xhtml:img]" mode="xhtml"></xsl:template>
	<xsl:template match="xhtml:img" mode="xhtml"></xsl:template>
	<xsl:template match="xhtml:b" mode="xhtml"><xsl:apply-templates select="."/></xsl:template>
	<xsl:template match="xhtml:i" mode="xhtml"><xsl:apply-templates select="."/></xsl:template>
	<xsl:template match="xhtml:sup" mode="xhtml"><xsl:apply-templates select="."/></xsl:template>
	<xsl:template match="xhtml:sub" mode="xhtml"><xsl:apply-templates select="."/></xsl:template>
	<xsl:template match="xhtml:ol/xhtml:li" mode="xhtml"><xsl:apply-templates select="."/></xsl:template>
	<xsl:template match="xhtml:ul/xhtml:li" mode="xhtml"><xsl:apply-templates select="."/></xsl:template>
    
	<xsl:template match="xhtml:br" mode="xhtml">
		<xsl:text>&#xa;</xsl:text>
	</xsl:template>

	<xsl:template match="xhtml:a" mode="xhtml">
		<xsl:value-of select="." mode="xhtml"/>
	</xsl:template>
	
	<xsl:template match="xhtml:p" mode="xhtml">
		<xsl:text>&#xa;</xsl:text><xsl:apply-templates mode="xhtml"/><xsl:text>&#xa;</xsl:text>
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
