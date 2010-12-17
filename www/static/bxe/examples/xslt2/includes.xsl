<!--
SDI ("server dynamic includes", not strategic defence system ;-)

this is a very important xsl... the server dynamic includes!
there are content elements, which consists only as tag...
no content within because the content is the result of a dynamic server-side process

first we transform the tags in a special representation for the inner cope2 rendering pipeline:
cope2 will detect these <include _type="thetype">params</include>
the include-tag must NOT be empty but in the form of <include ...></include>
because we replace the include tags by the dynamicly evaluates content by using
fast string replace and split funktions.

this is dirty - I know - but fast. may be, I will use xpath/dom in future versions... (yes my lord)
-->

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	>
<xsl:output encoding="ISO-8859-1"/>

	<xsl:template match="bechtleshopnavigator">
	   	<include _type="navi_bechtleshops">bechtle shop navigator</include>
	</xsl:template>
	
	<xsl:template match="systemhousenavigator">
	   	<include _type="navi_systemhouses">bechtle systemhouse navigator</include>
	</xsl:template>

	<xsl:template match="competencecenternavigator">
	   	<include _type="navi_competencecenters">bechtle competence center navigator</include>
	</xsl:template>

	<xsl:template match="xform">
        <xsl:choose>
            <xsl:when test="@type='ir_mailservice'">
                <include _type="form_ir_mailservice">
                	<xsl:choose>
                		<xsl:when test="contains(@recipient,'@')"><xsl:value-of select="@recipient"/></xsl:when>
			            <xsl:otherwise>joe.mueller@bechtle.com</xsl:otherwise>
			        </xsl:choose>
                </include>
            </xsl:when>
            <xsl:when test="@type='press_mailservice'">
                <include _type="form_press_mailservice">
                	<xsl:choose>
                		<xsl:when test="contains(@recipient,'@')"><xsl:value-of select="@recipient"/></xsl:when>
			            <xsl:otherwise>joe.mueller@bechtle.com</xsl:otherwise>
			        </xsl:choose>
                </include>
            </xsl:when>
            <xsl:when test="@type='contact_standard'">
                <include _type="form_contact_standard">
                	<xsl:choose>
                		<xsl:when test="contains(@recipient,'@')"><xsl:value-of select="@recipient"/></xsl:when>
			            <xsl:otherwise>joe.mueller@bechtle.com</xsl:otherwise>
			        </xsl:choose>
                </include>
            </xsl:when>
            <xsl:otherwise>
                
            </xsl:otherwise>
        </xsl:choose>
	</xsl:template>

</xsl:stylesheet>
