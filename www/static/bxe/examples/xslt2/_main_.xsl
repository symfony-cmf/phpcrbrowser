<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    >
    <!--
	-->
	<xsl:include href="news.xsl"/>
	<xsl:include href="systemhouse.xsl"/>
	<xsl:include href="competencecenter.xsl"/>
	<xsl:include href="includes.xsl"/>
	<xsl:output encoding="ISO-8859-1"/>
	<xsl:param name="language"/>
	
	<xsl:template match="document">
		<br/><br/><br/>
	    <div>
	        <xsl:apply-templates select="content"/>
	    </div>
	</xsl:template>
	
	<xsl:template match="content">
        <a name="__top">
        <div class="title">
	        <xsl:value-of select="title"/>
        </div>
        </a>
        <div class="abstract">
        	<xsl:value-of select="abstract"/>
        </div>
	    <xsl:apply-templates select="page"/>
	</xsl:template>
	
	<xsl:template match="page">
	    <div class="page">
	        <xsl:apply-templates select="article"/>
	    </div>
	</xsl:template>
	
	<xsl:template match="article">
	    <div class="article">
	        <xsl:apply-templates select="collection"/>
	    </div>
	</xsl:template>
	
	<xsl:template match="collection">
	    <div class="collection">
	        <table class="collection">
	        <xsl:choose>
	            <xsl:when test="@layout='row'">
	                <tr><xsl:apply-templates select="block"/></tr>
	            </xsl:when>
	            <xsl:otherwise>
	                <xsl:for-each select="block">
	                    <tr>
	                        <td class="block">
	                        	<xsl:attribute name="align"><xsl:value-of select="@align"/></xsl:attribute>
	                            <xsl:apply-templates/>
	                        </td>
	                    </tr>
	                </xsl:for-each>
	            </xsl:otherwise>
	        </xsl:choose>
	        </table>
	    </div>
	</xsl:template>
	
	<xsl:template match="table">
	    <table class="informaltable">
		    <xsl:attribute name="borderlines"><xsl:value-of select="@borderlines"/></xsl:attribute>
		    <xsl:attribute name="colheaders"><xsl:value-of select="@colheaders"/></xsl:attribute>
            <xsl:for-each select="tr">
                <tr>
                    <xsl:for-each select="td">
                        <td class="informaltable">
                            <xsl:for-each select="@*">
                                <xsl:copy/>
                            </xsl:for-each>
                            <xsl:apply-templates/>
                        </td>
                    </xsl:for-each>
                </tr>
            </xsl:for-each>
	    </table>
	</xsl:template>
	
	
	<xsl:template match="person">
	    <table class="person" border="0" cellpadding="0" cellspacing="0">
	        <colgroup>
	            <col width="1%"/>
	            <col width="99%"/>
	        </colgroup>
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
	        <tr>
	            <td>address:&#160;</td>
	            <td>
	                <xsl:apply-templates select="address"/>
	            </td>
	        </tr>
	    </table>
	</xsl:template>

	<xsl:template match="address">
		<b>Address:</b><br/>
		<xsl:value-of select="name"/><br/>
		<xsl:value-of select="postoffice"/><br/>
		<xsl:value-of select="street"/>&#160;<xsl:value-of select="number"/><br/>
		<xsl:value-of select="zipcode"/>-<xsl:value-of select="city"/><br/><br/>
		<xsl:value-of select="country"/>&#160;(<xsl:value-of select="state"/>)<br/>
		Fon::&#160;<xsl:value-of select="fon"/><br/>
		fax:&#160;<xsl:value-of select="fax"/><br/>
		Email:&#160;<xsl:apply-templates select="email"/><br/><br/>
		<b>Roadmap:</b><br/><xsl:apply-templates select="roadmap"/><br/>
	</xsl:template>
	
	<xsl:template match="roadmap">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="chart-xpose">
		<div>
		<link rel="stylesheet" type="text/css" href="http://irp.e-trader.de/bechtle/styles.css"/>
		<xsl:choose>
			<xsl:when test="$language = 'de'">
				<script language="javascript" src="http://irp.e-trader.de/bechtle/xpose.js"></script>
			</xsl:when>
			<xsl:otherwise>
				<script language="javascript" src="http://irp.e-trader.de/bechtle/xpose-en.js"></script>
			</xsl:otherwise>
		</xsl:choose>
		</div>
	</xsl:template>

	<xsl:template match="news_overview_navigator">
		<div>
			<xsl:copy-of select="./*"/>
		</div>
	</xsl:template>
	
	<xsl:template match="block">
		<td class="block">
			<xsl:attribute name="align"><xsl:value-of select="@align"/></xsl:attribute>
			<xsl:apply-templates/>
		</td>
	</xsl:template>
	
	<xsl:template match="system">
		<xsl:copy-of select=" ./*" />
	</xsl:template>
	
	<xsl:template match="paraheadline">
		<div class="paraheadline"><xsl:apply-templates/></div>
	</xsl:template>
	
	<xsl:template match="para">
		<p><xsl:apply-templates/></p>
	</xsl:template>
	
	<xsl:template match="emphasize">
		<i><xsl:apply-templates/></i>
	</xsl:template>
	
	<xsl:template match="bold">
		<b><xsl:apply-templates/></b>
	</xsl:template>
	
	<xsl:template match="subscript">
		<sub><xsl:apply-templates/></sub>
	</xsl:template>
	
	<xsl:template match="superscript">
		<sup><xsl:apply-templates/></sup>
	</xsl:template>
	
	<xsl:template match="nowrap">
		<span class="nowrap"><xsl:apply-templates/></span>
	</xsl:template>
	
	<xsl:template match="spacer">
		<xsl:choose>
			<xsl:when test="@display='line'">
				<div class="spacer"><xsl:value-of select="."/></div>
			</xsl:when>
			<xsl:when test="@display='visibleline'">
				<div class="spacer" display="visibleline"><xsl:value-of select="."/></div>
			</xsl:when>
			<xsl:otherwise>
				<span class="spacer" style="color: #FFFFFF"><xsl:value-of select="."/></span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="docnote">  <!-- are not rendered in view mode -->
		<span class="docnote"><xsl:value-of select="."/></span>
	</xsl:template>
	
	<xsl:template match="anker">
		<a class="anker">
			<xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute>
			<xsl:apply-templates/>
		</a>
	</xsl:template>
	
	<xsl:template match="ankerlink">
		<a class="ankerlink">
			<xsl:attribute name="href">#<xsl:value-of select="@url"/></xsl:attribute>
			<xsl:apply-templates/>
		</a>
	</xsl:template>
	
	<xsl:template match="ilink">
		<a class="ilink" target="m_index">
			<xsl:attribute name="href"><xsl:value-of select="@url"/></xsl:attribute>
			<xsl:apply-templates/>
		</a>
	</xsl:template>
	
	<xsl:template match="elink">
		<a class="elink" target="_blank">
		<xsl:attribute name="href">http://<xsl:value-of select="@url"/></xsl:attribute>
		<xsl:apply-templates/>
		</a>
	</xsl:template>
	
	<xsl:template match="download">
		<a  class="download">
			<xsl:attribute name="href"><xsl:value-of select="@url"/></xsl:attribute>
			<xsl:apply-templates/>
		</a>
	</xsl:template>
	
	<xsl:template match="email">
		<a class="ilink">
			<xsl:attribute name="href">mailto:<xsl:value-of select="@address"/></xsl:attribute>
			<xsl:apply-templates/>
		</a>
	</xsl:template>
	
	<xsl:template match="itemizedlist">
		<ul>
			<xsl:attribute name="bulletin"><xsl:value-of select="@bulletin"/></xsl:attribute>
			<xsl:for-each select="bxlistitem">
				<li><xsl:apply-templates/></li>
			</xsl:for-each>
		</ul>
	</xsl:template>
	
	<xsl:template match="orderedlist">
		<ol>
			<xsl:for-each select="bxlistitem">
				<li><xsl:apply-templates/></li>
			</xsl:for-each>
		</ol>
	</xsl:template>
	
	<!-- which of them, listitem or bxlistitem is no longer in use? -->
	<xsl:template match="listitem">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="bxlistitem">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="media">
		<div class="media">
			<img class="image" width="100" height="100" src="@url">
				<!--<xsl:attribute name="src"><xsl:value-of select="@url"/></xsl:attribute>-->
				<!-- 2do: eval the other parar: x-size, y-size, format -->
			</img>
            <br/>
			<div class="media-caption"><xsl:value-of select="@caption"/></div>
		</div>
	</xsl:template>
	
	<xsl:template match="*"></xsl:template>

</xsl:stylesheet>
