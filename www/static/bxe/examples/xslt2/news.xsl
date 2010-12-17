<!-- special xsl for 'news' content element -->
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	>
	<xsl:output encoding="ISO-8859-1"/>

	<xsl:template match="news">
		<a><xsl:attribute name="name"><xsl:value-of select="@coid"/></xsl:attribute></a>
		<div class="news">
		<table width="95%" border="0" cellspacing="2" cellpadding="2" >
			<xsl:apply-templates mode="news"/>
		</table>
		</div>
	</xsl:template>

	<xsl:template match="title" mode="news">
		<tr>
			<td>
				<b><xsl:value-of select="."/></b>
			</td>
		</tr>
	</xsl:template>

	<xsl:template match="timestamp" mode="news">
		<tr>
			<td>
				<xsl:apply-templates select="day" mode="news"/>
				<xsl:apply-templates select="month" mode="news"/>
				<xsl:apply-templates select="year" mode="news"/>
				<xsl:apply-templates select="hour" mode="news"/>
				<xsl:apply-templates select="minute" mode="news"/>
			</td>
		</tr>
	</xsl:template>

	<xsl:template match="day" mode="news"><xsl:value-of select="."/>.</xsl:template>
	<xsl:template match="month" mode="news"><xsl:value-of select="."/>.</xsl:template>
	<xsl:template match="year" mode="news"><xsl:value-of select="."/>&#160;</xsl:template>

	<xsl:template match="hour" mode="news"><xsl:value-of select="."/>:</xsl:template>
	<xsl:template match="minute" mode="news"><xsl:value-of select="."/></xsl:template>

	<xsl:template match="content" mode="news">
		<tr>
			<td>
				<xsl:apply-templates/>
			</td>
		</tr>
	</xsl:template>

	<xsl:template match="source" mode="news">
		<tr>
			<td>
				<xsl:value-of select="."/>
			</td>
		</tr>
	</xsl:template>

	<xsl:template match="author" mode="news">
		<tr>
			<td>
				<xsl:value-of select="."/>
			</td>
		</tr>
	</xsl:template>

	<xsl:template match="contact" mode="news">
		<tr>
			<td>
				<xsl:apply-templates mode="news"/>
			</td>
		</tr>
	</xsl:template>

	<xsl:template match="email" mode="news">
		<a>
			<xsl:attribute name="href">mailto:<xsl:value-of select="@address"/></xsl:attribute>
			Contact:&#160;
			<xsl:value-of select="."/>
		</a>
	</xsl:template>


	<!-- default matcher to discard all unknow elements -->
	<!-- <xsl:template match="*" mode="news"></xsl:template> -->

</xsl:stylesheet>
