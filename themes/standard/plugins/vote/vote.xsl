<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rss="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" exclude-result-prefixes="xhtml">
<xsl:variable name="voteWidth" select="'220'"/>
                            
    <xsl:template match="plugin[@name='vote']" mode="vote">

        
            <xsl:choose>
                <xsl:when test="vote/@results = 'true'">
        

                    
                        <div class="votesubdiv">
                            <xsl:variable name="total" select="sum(/bx/plugin[@name='vote']/vote/answer/@count)"/>
                            <xsl:if test="vote/@thanks"> 
                            <b><xsl:value-of select="/bx/plugin[@name='vote']/vote/response"/></b><br/><br/>
                            </xsl:if>
<b>                            <xsl:value-of select="/bx/plugin[@name='vote']/vote/question"/></b><br/><br/>
                            <xsl:for-each select="/bx/plugin[@name='vote']/vote/answer">
                                <xsl:variable name="balkenwidth">
                                    <xsl:choose>
                                        <xsl:when test="not(@count)">0</xsl:when>
<!--                                        <xsl:when test="floor($voteWidth * (number(@count) div $total))= 100">99</xsl:when>-->
                                        <xsl:otherwise>
                                            <xsl:value-of select="floor($voteWidth * (number(@count) div $total))"/>
                                            <br/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:variable>
 <xsl:value-of select="text()"/>:
                                

                                <div class="speicher">
                                    <div class="balken" style="position: relative; width: {($voteWidth - $balkenwidth )}px; left:{$balkenwidth  }px;">
                                    <xsl:choose>
                                    <xsl:when test="number(@count)">
                                      <xsl:value-of select="@count"/>%
                                            
                                    </xsl:when>
                                    <xsl:otherwise>
                                        0%
                                    </xsl:otherwise>
                                </xsl:choose>
                                    </div>
                                </div>
                            </xsl:for-each>
                        </div>
                    
                </xsl:when>
                <xsl:otherwise>
                  
                  
                    <div class="votesubdiv">
                        <form onsubmit="return voteSubmit();" name="voteform" method="post" action="{vote/@collectionUri}index.html">
<b>                        <xsl:value-of select="vote/question"/></b>
                        <br/>
                        <br/>
                        <table>
                        <xsl:for-each select="vote/answer">
                                <tr>
                                  <td  valign="top" >
                                        <input type="radio" name="selection" value="{@key}"/>
                                    </td>
                                    <td >
                                        <xsl:value-of select="text()"/>.
                                    </td>
                                  
                                </tr>
                        </xsl:for-each>
                        </table>
                            <input type="submit" class="votesubmit" value="votesubmit" i18n:attr="value" name="votesubmit" />
                        </form><br/>
                        <a href="#" onclick="voteSubmit();"><i18n:text>View results</i18n:text></a>
                    </div>
                    
                </xsl:otherwise>

            </xsl:choose>
        
    </xsl:template>
    
    <xsl:template match="/">
    <xsl:apply-templates select="/bx/plugin[@name='vote']" mode="vote"/>
    
    </xsl:template>



</xsl:stylesheet>
