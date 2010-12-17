<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"

xmlns:creativeCommons="http://backend.userland.com/creativeCommonsRssModule"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:blog="http://bitflux.org/doctypes/blog" xmlns:php="http://php.net/xsl"
  xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
xmlns:georss="http://www.georss.org/georss" 
 >

    <xsl:output method="xml" indent="yes" omit-xml-declaration="no"/>
    <xsl:param name="webroot"/>
    <xsl:param name="webrootLang"/>
    <xsl:param name="collectionUri"/>
    
    <xsl:variable name="blogroot" select="concat(substring($webroot,1,string-length($webroot)-1),$collectionUri)"/>
    <xsl:variable name="blogdescription" select="php:functionString('bx_helpers_config::getOption','blogdescription')"/>
    <xsl:variable name="blogname" select="php:functionString('bx_helpers_config::getOption','blogname')"/>
    <xsl:variable name="sitename" select="php:functionString('bx_helpers_config::getOption','sitename')"/>
    <xsl:variable name="sitedescription" select="php:functionString('bx_helpers_config::getOption','sitedescription')"/>
    <xsl:variable name="ICBM" select="php:functionString('bx_helpers_config::getOption','ICBM')"/>
<xsl:variable name="ah" select="php:functionString('bx_helpers_globals::GET','ah')"/>


    <xsl:template match="/">
        <rss version="2.0" xmlns:blogChannel="http://backend.userland.com/blogChannelModule">
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
</title>
                <link>
                    <xsl:value-of select="$blogroot"/>
                </link>
<xsl:choose>
<xsl:when test="$blogdescription">
                <description><xsl:value-of select="$blogdescription"/></description>
</xsl:when>
<xsl:when test="$sitedescription">
                <description><xsl:value-of select="$sitedescription"/></description>
</xsl:when>
<xsl:otherwise>
                <description>Blog of <xsl:value-of select="$sitename"/></description>
</xsl:otherwise>
</xsl:choose>
                <generator>Flux CMS - http://www.flux-cms.org</generator>
                <xsl:variable name="cr" select="php:functionString('bx_helpers_config::getOption','copyright')"/>
                <xsl:if test="string-length($cr) > 0">
                <copyright><xsl:value-of select="$cr"/></copyright>
                </xsl:if>
                <xsl:variable name="cc" select="php:functionString('bx_helpers_config::getOption','cclink')"/>
                <xsl:if test="string-length($cc) > 0">
                <creativeCommons:license><xsl:value-of select="$cc"/></creativeCommons:license>
                </xsl:if>
                
                <xsl:if test="string-length($ICBM) &gt; 0">
               <georss:point><xsl:value-of select="substring-before($ICBM,',')"/><xsl:text> </xsl:text><xsl:value-of select="normalize-space(substring-after($ICBM,','))"/></georss:point>

                <geo:lat><xsl:value-of select="substring-before($ICBM,',')"/></geo:lat>
                <geo:long><xsl:value-of select="normalize-space(substring-after($ICBM,','))"/></geo:long>
     </xsl:if>  
                
                <xsl:for-each select="/bx/plugin[@name='blog']/xhtml:html/xhtml:body/xhtml:div[@class = 'entry']">
                    <item>

                        <title>
                        
                            <xsl:if test="@blog:post_status != 1"> 
                                [o]
                            </xsl:if>
                            <xsl:value-of select="xhtml:h2[@class ='post_title']"/>
                        </title>

                        <link>
			
                            <xsl:choose>
                                <xsl:when test="not(contains( xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href,'http://'))">
                                    <xsl:value-of select="concat($blogroot, 'archive/',xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href)"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="xhtml:div[@class='post_links']/xhtml:span[@class='post_uri']/xhtml:a/@href"/>
                               </xsl:otherwise>
                            </xsl:choose>
                            <xsl:if test="$ah !=''">?ah=<xsl:value-of select="$ah"/></xsl:if>
                        </link>   
                       
                       
                        <guid isPermaLink="false">
                            <xsl:choose>
                            <xsl:when test="@blog:post_guid_version &lt; 2">
                                <xsl:value-of select="concat($webroot,'p',substring-after(@id,'entry'),'.html')"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="concat($blogroot,'archive/id/',substring-after(@id,'entry'),'/')"/>
                            </xsl:otherwise>
                            </xsl:choose>
                        </guid>

                        <content:encoded xmlns="http://www.w3.org/1999/xhtml">
                            <xsl:apply-templates select="xhtml:div[@class='post_content']/*|xhtml:div[@class='post_content']/text()" mode="xhtml"/>
                            <xsl:if test="xhtml:div[@class='post_links']/xhtml:span[@class='post_more']">
                            <xsl:call-template name="extended"/>
                            </xsl:if>
                        </content:encoded>  
                        
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
                        <xsl:variable name="plazes" select="blog:info/blog:plazes"/>
                       <xsl:if test="$plazes/blog:plazelat">
                            <geo:lat><xsl:value-of select="$plazes/blog:plazelat"/></geo:lat>
                            <geo:long><xsl:value-of select="$plazes/blog:plazelon"/></geo:long>
                       </xsl:if>
                    </item>
                </xsl:for-each>

            </channel>
        </rss>
    </xsl:template>
    
    <xsl:template name="extended">
        <![CDATA[<br/><br/>
        <a href="]]><xsl:value-of select="xhtml:div[@class='post_links']/xhtml:span[@class='post_more']/xhtml:a[@class='post_more']/@href"/>"&gt;
            <xsl:value-of select="xhtml:div[@class='post_links']/xhtml:span[@class='post_more']/xhtml:a[@class='post_more']/*"/>
        <![CDATA[</a>]]>
        
    </xsl:template>
    
    <xsl:template match="*" mode="xhtml">&lt;<xsl:value-of select="local-name()"/>
        <xsl:apply-templates select="@*" mode="xhtml"/>&gt;<xsl:apply-templates mode="xhtml"/>&lt;/<xsl:value-of select="local-name()"/>&gt;</xsl:template>

    <xsl:template match="*[not(node())]" mode="xhtml">&lt;<xsl:value-of select="local-name()"/>
        <xsl:apply-templates select="@*" mode="xhtml"/>/&gt;</xsl:template>

    <xsl:template match="@*" mode="xhtml">
        <xsl:text> </xsl:text>
        <xsl:value-of select="local-name()"/>="<xsl:value-of select="." />"
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
    

</xsl:stylesheet>
