<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">
    <xsl:param name="webroot" value="'/'"/>
    <xsl:param name="mode"/>
    <xsl:param name="requestUri"/>
    
    <xsl:variable name="repl">{}</xsl:variable>
    
    <xsl:template match="/">
        <html>
            <xsl:apply-templates select="xhtml:html"/>
        </html>
    </xsl:template>

    <xsl:template match="xhtml:head">
        <xsl:copy>
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            <xsl:apply-templates/>
            <link href="{$webroot}themes/standard/admin/css/formedit.css" rel="stylesheet" media="screen" type="text/css"/>
        
        </xsl:copy>
    </xsl:template>
            

    <xsl:template match="xhtml:body">
        <xsl:copy>
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            <form name="master" method="POST">
                <input type="submit"/>
                <xsl:apply-templates/>
            </form>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="xhtml:form">
    <!-- take out any form -->
    <xsl:apply-templates/>
    
    </xsl:template>
    

    <xsl:template match="*">
        <xsl:copy>
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>


    <xsl:template match="*[@bxe_xpath]">
 
       <input type="text" value="{text()}" class="{@class}" name="bx[plugins][admin_edit][{translate(@bxe_xpath,'[]',$repl)}]"></input>
    </xsl:template>

    <xsl:template match="*[@bxe_xpath and @bx_type='textarea']">
        <textarea class="{@class}" name="bx[plugins][admin_edit][{translate(@bxe_xpath,'[]',$repl)}]">
            <xsl:apply-templates/>
        </textarea>
    </xsl:template>


</xsl:stylesheet>
