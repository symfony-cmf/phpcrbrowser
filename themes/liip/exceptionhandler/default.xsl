<?xml version="1.0"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
        xmlns="http://www.w3.org/1999/xhtml"
        exclude-result-prefixes="xhtml"
        version="1.0">
    
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
    
    <xsl:variable name="exception" select="/command/exception"/>
    
    <xsl:template match="/">
        <html>
            <head>
                <title>
                    <i18n:text>Exception</i18n:text>
                </title>
                <link rel="stylesheet" type="text/css" href="{$webrootStatic}css/exceptionhandler.css"/>
            </head>
            <body>
                <xsl:call-template name="content"/>
            </body>
        </html>
    </xsl:template>

    <xsl:template name="content">
        <div id="content">
            <h1><xsl:value-of select="$exception/name"/>&#xA0;<i18n:text>Exception</i18n:text></h1>
            <p>
                <i18n:text>With message:</i18n:text>
            </p>
            <h2>
                <xsl:value-of select="$exception/message"/>
            </h2>
            <p>
                <i18n:text>Thrown at:</i18n:text>&#xA0;<xsl:value-of select="$exception/file"/>&#xA0;(<xsl:value-of select="$exception/line"/>)
	        </p>
	        
            <table class="stacktrace">
                <thead>
                    <th/>
                    <th>Class/Method</th>
                    <th>File</th>
                    <th>Line</th>
                </thead>
                <tbody>
                    <xsl:apply-templates select="$exception/backtrace/entry" />
                </tbody>
            </table>
        </div>
    </xsl:template>
    
    <xsl:template match="backtrace/entry">
        <xsl:variable name="caller" select="caller"/>
        
        <tr class="exceptionInfo">
            <td/>
            <td>
                <xsl:if test="class != ''">
                    <xsl:value-of select="class"/>
                    <xsl:text>::</xsl:text>
                </xsl:if>
                <xsl:value-of select="function"/>
            </td>
            <td><xsl:value-of select="substring-after(file,$projectDir)"/></td>
            <td><xsl:value-of select="line"/></td>
        </tr>
        
        <xsl:if test="source/entry">
            <tr class="exceptionCode">
                <td colspan="4">
                    <div class="codeblock">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <xsl:apply-templates select="source/entry" />
                        </table>
                    </div>
                </td>
            </tr>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="backtrace/entry/source/entry">
        <xsl:variable name="caller" select="../../caller" />
        
        <tr>
            <td width="40">
                <xsl:value-of select="@key"/>
            </td>
            <td>
                <xsl:if test="$caller != '' and @key=$caller">
                    <xsl:attribute name="class">caller</xsl:attribute>
                </xsl:if>
                <pre>
                    <xsl:value-of select="." disable-output-escaping="yes"/>
                </pre>
            </td>
        </tr>
    </xsl:template>
    
    <xsl:template match="xhtml:h1" mode="xhtml">
    </xsl:template>
    
    <!-- add everything from head to the output -->
    <xsl:template name="html_head">
    </xsl:template>
    
    <!-- except the title -->
    <xsl:template match="xhtml:head/xhtml:title" mode="xhtml">
    </xsl:template>
    
    <!-- except the links -->
    <xsl:template match="xhtml:head/xhtml:link" mode="xhtml">
    </xsl:template>
    
    <!-- do not output meta tags without @content -->
    <xsl:template match="xhtml:head/xhtml:meta[not(@content)]" mode="xhtml">
    </xsl:template>
    
    <xsl:template name="body_attributes">
    </xsl:template>
</xsl:stylesheet>
