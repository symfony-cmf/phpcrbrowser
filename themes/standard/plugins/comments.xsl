
<xsl:stylesheet version="1.0"
        xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
        xmlns:blog="http://bitflux.org/doctypes/blog" 
        xmlns:bxf="http://bitflux.org/functions" 
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns="http://www.w3.org/1999/xhtml" 
        xmlns:php="http://php.net/xsl" 
        exclude-result-prefixes="php blog bxf xhtml i18n">
		
    <xsl:output encoding="utf-8" method="xml"/>
	            
	<xsl:variable name="comment" select="bx/plugin[@name='comments']/div[@class='comments_new']/div[@class='comments']"/>
	<xsl:variable name="commentRoot" select="bx/plugin[@name='comments']/div[@class='comments_new']"/>
	
	
    <xsl:template name="comments">
		<h3 class="blog">
            <i18n:text i18n:key="blogComments">Comments</i18n:text>
        </h3>
		<xsl:apply-templates select="$commentRoot"/>
    </xsl:template>
	
	<xsl:template match="span[@class='comment_author_email']">
    <xsl:if test="string-length(.) &gt; 5">
            <img class="blog_gravatar" src="{php:functionString('bx_plugins_blog_gravatar::getLink',text(),'40','aaaaaa')}"/>
        </xsl:if>
    </xsl:template>
	
	<xsl:template match="span[@class='comment_author']">
	<!--add uri plz-->
	<xsl:copy-of select="."/>&#160;
	</xsl:template>
	
	<xsl:template match="span[@class='comment_date']">
		@&#160;<xsl:value-of select="."/>
	</xsl:template>
	
	<xsl:template match="span[@class='comment_date']">
		@&#160;<xsl:value-of select="."/>
		<br/>
	</xsl:template>
	
	<xsl:template match="div[@class='comment_content']">
		<xsl:value-of select="."/>
		<br/><br/>
	</xsl:template>
	
	<xsl:template match="form[@name='bx_foo']">
		<xsl:copy-of select="."/>
		<br/><br/>
	</xsl:template>

</xsl:stylesheet>
