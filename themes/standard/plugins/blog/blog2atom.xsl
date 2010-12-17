<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:blog="http://bitflux.org/doctypes/blog" xmlns:php="http://php.net/xsl" exclude-result-prefixes="xhtml blog php">

    <xsl:output method="xml" indent="yes" omit-xml-declaration="no"/>
    <xsl:param name="webroot"/>
    <xsl:param name="webrootLang"/>
    <xsl:param name="collectionUri"/>
    
    <xsl:variable name="blogroot" select="concat(substring($webroot,1,string-length($webroot)-1),$collectionUri)"/>
    <xsl:variable name="blogdescription" select="php:functionString('bx_helpers_config::getOption','blogdescription')"/>
    <xsl:variable name="blogname" select="php:functionString('bx_helpers_config::getOption','blogname')"/>
    <xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/>
<xsl:variable name="sitedescription" select="php:functionString('bx_helpers_config::getOption','sitedescription')"/>


    <xsl:template match="/">


	<feed>       
		<title>
		<xsl:choose>
            	<xsl:when test="$blogname">
            		<xsl:value-of select="$blogname"/>
     			</xsl:when>
       			<xsl:otherwise>
       				<xsl:value-of select="$sitename"/>
				</xsl:otherwise>
			</xsl:choose>
		</title>
                
		<xsl:choose>
			<xsl:when test="$blogdescription">
                <subtitle>
		<xsl:value-of select="$blogdescription"/>
                </subtitle>
			</xsl:when>
			<xsl:when test="$sitedescription">
                <subtitle>
                <xsl:value-of select="$sitedescription"/>
                </subtitle>
			</xsl:when>
			<xsl:otherwise>
                <subtitle>
                Blog of <xsl:value-of select="$sitename"/>
                </subtitle>
			</xsl:otherwise>
		</xsl:choose>

		
		<id><xsl:value-of select="$webroot"/></id>
		<link rel="alternate" type="text/html" hreflang="{$lang}" href="{$blogroot}" />
		<link rel="self" type="application/atom+xml" href="{$blogroot}atom.xml" />

		<generator uri="http://www.flux-cms.org/" version="{php:functionString('constant','BXCMS_VERSION')}">Flux CMS</generator>


                
                <xsl:variable name="cr" select="php:functionString('bx_helpers_config::getOption','copyright')"/>
                <xsl:variable name="cc" select="php:functionString('bx_helpers_config::getOption','cclink')"/>


                <xsl:choose>
                <xsl:when test="string-length($cc) &gt; 0 and string-length($cr) &gt; 0">
	                <rights>Copyright by <xsl:value-of select="$cr"/>, licensed under <xsl:value-of select="$cc"/></rights>
                </xsl:when>
                <xsl:when test="string-length($cr) > 0">
                	<rights>Copyright by <xsl:value-of select="$cr"/></rights>
                </xsl:when>
                </xsl:choose>
              
		<updated><xsl:value-of select="/bx/plugin[@name='blog']/xhtml:html/xhtml:body/xhtml:div[position() = 1]/@blog:post_date_iso" /></updated>

<!-- content -->                
	<xsl:for-each select="/bx/plugin[@name='blog']/xhtml:html/xhtml:body/xhtml:div[@class = 'entry']">


	<entry>

		<title>
			<xsl:value-of select="xhtml:h2[@class ='post_title']"/>
		</title>

		
			<xsl:variable name="post_link">
				<xsl:choose>
				<xsl:when test="not(contains( xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href,'http://'))">
					<xsl:value-of select="concat($blogroot, 'archive/',xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href)"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href"/>
				</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>

		<link rel="alternate" href="{$post_link}" />
		<id><xsl:value-of select="concat($webroot,'p',substring-after(@id,'entry'),'.html')"/></id>
		<published><xsl:value-of select="@blog:post_date_iso"/></published>
		<updated><xsl:value-of select="@blog:post_date_iso"/></updated>


		<author>
			<name><xsl:value-of select="xhtml:div[@class='post_meta_data']/xhtml:span[@class ='post_author']"/></name>
			<uri><xsl:value-of select="$webroot" /></uri>
			<!--email></email-->
		</author>



                        <!--guid isPermaLink="false">
                            <xsl:value-of select="concat($webroot,'p',substring-after(@id,'entry'),'.html')"/>
                        </guid-->

<content type="html">
<xsl:apply-templates select="xhtml:div[@class='post_content']/*|xhtml:div[@class='post_content']/text()" mode="xhtml"/>
   <xsl:if test="xhtml:div[@class='post_links']/xhtml:span[@class='post_more']">
                            <xsl:call-template name="extended"/>
                            </xsl:if>
</content>

                        <!--content:encoded xmlns="http://www.w3.org/1999/xhtml">
                            <xsl:apply-templates select="xhtml:div[@class='post_content']/*|xhtml:div[@class='post_content']/text()" mode="xhtml"/>
                        </content:encoded-->

                        
                        <xsl:for-each select="xhtml:div[@class='post_meta_data']/xhtml:span[@class='post_categories']/xhtml:span[@class='post_category']">
                            <dc:subject>
                                <xsl:value-of select="xhtml:a"/>
                            </dc:subject>

                        </xsl:for-each>
                        <!-- Tags -->
                        <xsl:for-each select="xhtml:div[@class='post_tags']/xhtml:span[@class='post_tag']">
                            <dc:subject>
                                <xsl:value-of select="xhtml:a"/>
                            </dc:subject>

                        </xsl:for-each>
        
                        <xsl:if test="not(xhtml:div[@class = 'post_date'] = '')">
                            <dc:creator>
                                <xsl:value-of select="xhtml:div[@class='post_meta_data']/xhtml:span[@class ='post_author']"/>
                            </dc:creator>
                            <dc:date>
                                <xsl:value-of select="@blog:post_date_iso"/>
                            </dc:date>
                        </xsl:if>

                        <xsl:for-each select="xhtml:div[@class='post_content']//xhtml:a[@rel = 'enclosure' or substring(@href,string-length(@href)-7) = '.torrent']">
                            
                            <xsl:variable name="enclurl">
                                <xsl:choose>
                                    <xsl:when test="contains(@href, 'http://')">
                                        <xsl:value-of select="@href"/>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="concat($webroot,@href)"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:variable>
                            <enclosure url="{$enclurl}" length="{php:functionString('bx_helpers_file::getFileSize',@href,0)}" type="{php:functionString('popoon_helpers_mimetypes::getFromFileLocation',@href)}">
<!--type="application/x-bittorrent"-->
</enclosure>
                        </xsl:for-each>

                    </entry>
                </xsl:for-each>
                
        </feed>
    </xsl:template>

    <xsl:template match="*" mode="xhtml">&lt;<xsl:value-of select="local-name()"/>
        <xsl:apply-templates select="@*" mode="xhtml"/>&gt;<xsl:apply-templates mode="xhtml"/>&lt;/<xsl:value-of select="local-name()"/>&gt;</xsl:template>

    <xsl:template match="*[not(node())]" mode="xhtml">&lt;<xsl:value-of select="local-name()"/>
        <xsl:apply-templates select="@*" mode="xhtml"/>/&gt;</xsl:template>

    <xsl:template match="@*" mode="xhtml">
        <xsl:text> </xsl:text>
        <xsl:value-of select="local-name()"/>="<xsl:value-of select="."/>"
    </xsl:template>
    
    <xsl:template match="@src|@href" mode="xhtml">
        <xsl:text> </xsl:text>
        <xsl:value-of select="local-name()"/>="<xsl:choose>
        <xsl:when test="starts-with(.,'/')"><xsl:value-of select="$webroot" /><xsl:value-of select="." />
        </xsl:when>
        <xsl:otherwise><xsl:value-of select="." /></xsl:otherwise>
        </xsl:choose>"
    </xsl:template>
    
     <xsl:template match="text()" mode="xhtml">
     <xsl:value-of select="php:functionString('htmlspecialchars',.,0,'UTF-8')"  />
    </xsl:template>
    
    <xsl:template name="extended">
        <![CDATA[<br/><br/>
        <a href="]]><xsl:value-of select="xhtml:div[@class='post_links']/xhtml:span[@class='post_more']/xhtml:a[@class='post_more']/@href"/>"&gt;
            <xsl:value-of select="xhtml:div[@class='post_links']/xhtml:span[@class='post_more']/xhtml:a[@class='post_more']/*"/>
        <![CDATA[</a>]]>
        
    </xsl:template>
</xsl:stylesheet>
