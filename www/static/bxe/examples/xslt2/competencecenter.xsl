<!-- special xsl for 'competence center' content element -->
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	>
	<xsl:output encoding="ISO-8859-1"/>

	<xsl:template match="competencecenter">
		<table class="competencecenter">
			<xsl:apply-templates mode="competencecenter"/>
		</table>
	</xsl:template>

	<xsl:template match="title" mode="competencecenter">
		<tr>
			<td class="cctitle" colspan="2"><xsl:value-of select="."/><xsl:value-of select="../name"/></td>
		</tr>
	</xsl:template>

	<xsl:template match="concept" mode="competencecenter">
		<tr>
			<td class="label">Concept:</td>
			<td class="content"><xsl:value-of select="."/></td>
		</tr>
	</xsl:template>

	<xsl:template match="portfolio" mode="competencecenter">
		<tr>
			<td class="label">Portfolio:</td>
			<td class="content"><xsl:apply-templates select="itemizedlist"/></td>
		</tr>
	</xsl:template>

	<xsl:template match="team" mode="competencecenter">
		<tr>
			<td class="label">Team:</td>
			<td class="content"><xsl:value-of select="."/></td>
		</tr>
	</xsl:template>

	<xsl:template match="customers" mode="competencecenter">
		<tr>
			<td class="label">Customers:</td>
			<td class="content"><xsl:value-of select="."/></td>
		</tr>
	</xsl:template>

	<xsl:template match="partner" mode="competencecenter">
		<tr>
			<td class="label">Partner:</td>
			<td class="content"><xsl:value-of select="."/></td>
		</tr>
	</xsl:template>

	<xsl:template match="data" mode="competencecenter">
		<tr>
			<td class="label">Data:</td>
			<td class="content"><xsl:apply-templates/></td>
		</tr>
	</xsl:template>

	<xsl:template match="contact" mode="competencecenter">
		<tr>
			<td class="label">Contact:</td>
			<td class="content">
				<xsl:apply-templates select="person" mode="competencecenter"/>
			</td>
		</tr>
	</xsl:template>
	
	<!-- special display version of person; because of location -->
	<xsl:template match="person" mode="competencecenter">
	    <table class="person" border="0" cellpadding="0" cellspacing="0">
	        <colgroup>
	            <col width="1%"/>
	            <col width="99%"/>
	        </colgroup>
	        <tr>
	            <td colspan="2">
	            	<b><xsl:value-of select="location"/>:</b>
	            </td>
	        </tr>
	        <tr>
	            <td colspan="2">
	            	<xsl:value-of select="title"/>&#160;
	            	<xsl:value-of select="firstname"/>&#160;
	            	<xsl:value-of select="lastname"/>
	            </td>
	        </tr>
	        <tr>
	            <td>fon:&#160;</td>
	            <td><xsl:value-of select="fon"/></td>
	        </tr>
	        <tr>
	            <td>fax:&#160;</td>
	            <td><xsl:value-of select="fax"/></td>
	        </tr>
	        <tr>
	            <td>email:&#160;</td>
	            <td>
	                <a class="ilink">
		                <xsl:attribute name="href">mailto:<xsl:value-of select="./email/@address"/></xsl:attribute>
		                <xsl:value-of select="email"/>
	                </a>
	            </td>
	        </tr>
	    </table><br/>
	</xsl:template>

    <!-- default matcher to discard unknown elements -->
	<xsl:template match="*"></xsl:template>
	<xsl:template match="*" mode="competencecenter"></xsl:template>

</xsl:stylesheet>
