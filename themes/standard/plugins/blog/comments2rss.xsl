<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
     xmlns:php="http://php.net/xsl"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:param name="webroot"/>
    <xsl:param name="webrootLang"/>
    <xsl:param name="collectionUri"/>

    <xsl:variable name="blogroot" select="concat(substring($webroot,1,string-length($webroot)-1),$collectionUri)"/>
    <xsl:variable name="blogname" select="php:functionString('bx_helpers_config::getOption','blogname')"/>   
<xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/>
<xsl:variable name="ah" select="php:functionString('bx_helpers_globals::GET','ah')"/>

    <xsl:template match="/">

        <rss version="2.0" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:admin="http://webns.net/mvcb/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  

            <channel>
                <title>
                  <xsl:choose>
            <xsl:when test="$blogname">
            <xsl:value-of select="$blogname"/>
            </xsl:when>
            <xsl:otherwise>
            <xsl:value-of select="$sitename"/>
            </xsl:otherwise>
            </xsl:choose>
                
                Comments</title>
                <link>
                    <xsl:value-of select="$blogroot"/>
                </link>
                <description>Comments </description>
    <!--<dc:language>de</dc:language>
    -->

                <generator>Flux CMS - http://www.flux-cms.org/</generator>
   <!-- <managingEditor>flux@bitflux.ch</managingEditor>
   <admin:errorReportsTo rdf:resource="mailto:flux@bitflux.ch" />

<webMaster>flux@bitflux.ch</webMaster>-->
                <ttl>60</ttl>

                <xsl:for-each select="/bx/plugin[@name='blog']/comments/comment">
                    <item>
                        <title>
                        <xsl:if test="post_status != 1"> 
                                [o]
                            </xsl:if>
                            
                            <xsl:value-of select="author"/>: <xsl:value-of select="post_title"/>
                        </title>
                        <link>
                            <xsl:value-of select="$blogroot"/>archive/<xsl:value-of select="post_permauri"/><xsl:if test="$ah !=''">?ah=<xsl:value-of select="$ah"/></xsl:if>#c<xsl:value-of select="@id"/></link>
                        <comments>
                            <xsl:value-of select="$blogroot"/>archive/<xsl:value-of select="post_permauri"/><xsl:if test="$ah !=''">?ah=<xsl:value-of select="$ah"/></xsl:if>#c<xsl:value-of select="@id"/></comments>
                            
                        <author>
                            <xsl:value-of select="author"/> &lt;undisclosed@example.org&gt;
                        </author>

                        <content:encoded xmlns="http://www.w3.org/1999/xhtml">
                            <xsl:apply-templates select="content/node()" mode="xhtml"/>
                        </content:encoded>

                        <dc:date>
                            <xsl:value-of select="date_iso"/>
                        </dc:date>

                        <guid isPermaLink="false">
                            <xsl:value-of select="$blogroot"/><xsl:value-of select="post_uri"/>.html#c<xsl:value-of select="@id"/>
                        </guid>
                    </item>
    

                </xsl:for-each>
            </channel>
        </rss>
    </xsl:template>

    <xsl:template match="*" mode="xhtml">&lt;<xsl:value-of select="local-name()"/>
        <xsl:apply-templates select="@*" mode="xhtml"/>&gt;<xsl:apply-templates mode="xhtml"/>&lt;/<xsl:value-of select="local-name()"/>&gt;</xsl:template>

    <xsl:template match="*[not(node())]" mode="xhtml">&lt;<xsl:value-of select="local-name()"/>
        <xsl:apply-templates select="@*" mode="xhtml"/>/&gt;</xsl:template>

    <xsl:template match="@*" mode="xhtml">
        <xsl:text> </xsl:text>
        <xsl:value-of select="local-name()"/>="<xsl:value-of select="."/>"
    </xsl:template>

</xsl:stylesheet>
