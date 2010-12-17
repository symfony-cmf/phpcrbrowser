<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    xmlns="http://www.w3.org/1999/xhtml"
exclude-result-prefixes="xhtml i18n xsl"
    > 
    <xsl:output encoding="utf-8" method="xml"/>
    <xsl:param name="webroot" value="'/'"/>
     
     <xsl:template match="/">
                         <xrds:XRDS
                             xmlns:xrds="xri://$xrds"
                             xmlns:openid="http://openid.net/xmlns/1.0"
                             xmlns="xri://$xrd*($v*2.0)">
                           <XRD>
                             <Service priority="0">
                               <Type>http://openid.net/signon/1.0</Type>
                               <Type>http://openid.net/signon/1.1</Type>
                               <Type>http://openid.net/sreg/1.0</Type>
                               <URI><xsl:value-of select="$webroot"/>admin/openid/</URI>
                               <openid:Delegate><xsl:value-of select="$webroot"/></openid:Delegate>
                             </Service>
                           </XRD>
                         </xrds:XRDS>
    </xsl:template>
    
</xsl:stylesheet>
