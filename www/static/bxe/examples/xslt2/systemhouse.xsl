<!-- special xsl for 'systemhouse' content element -->
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	>
	<xsl:output encoding="ISO-8859-1"/>

	<xsl:template match="systemhouse" mode="block">
		<a><xsl:attribute name="name"><xsl:value-of select="@coid"/></xsl:attribute></a>
		<table class="systemhouse">
			<tr>
				<td colspan="2" class="shtitle" >
					<div><b>Systemhouse Object:</b></div>
					<h2><xsl:value-of select="./company"/></h2>
				</td>
			</tr>
			<tr>
				<td>
					<div><b>CEOs:</b></div>
					<xsl:apply-templates select="ceo" mode="systemhouse"/>
				</td>
				<td>
					<div><b>Building Picture:</b></div>
					<xsl:apply-templates select="image/media"/>
					<xsl:value-of select="address/name"/>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<xsl:apply-templates select="address"/>
				</td>
			</tr>
		</table>
	</xsl:template>
	
	<xsl:template match="ceo" mode="systemhouse">
		<xsl:apply-templates select="media"/>
		<xsl:value-of select="firstname"/>&#160;
		<xsl:value-of select="lastname"/><br/>
		<xsl:apply-templates select="email"/>
		<br/><br/>
	</xsl:template>
	
	<!-- default matcher to deny all other elements -->
	<xsl:template match="*" mode="systemhouse"></xsl:template>

</xsl:stylesheet>
