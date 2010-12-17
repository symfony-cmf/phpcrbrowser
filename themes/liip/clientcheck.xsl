<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:i18n="http://apache.org/cocoon/i18n/2.1" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl"  exclude-result-prefixes="xhtml i18n php">
    <xsl:import href="../standard/common.xsl"/>
    <xsl:import href="master.xsl"/>

    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
    
    <xsl:variable name="clientcheck" select="/bx/plugin[@name='clientcheck']"/>
    <xsl:variable name="mode" select="$clientcheck/clientcheck/mode"/>
    <xsl:variable name="resultstext" select="$clientcheck/clientcheck/resultstext"/>
    <xsl:variable name="recipient" select="$clientcheck/clientcheck/recipient"/>
    <xsl:variable name="sender_email" select="$clientcheck/clientcheck/sender_email"/>
    <xsl:variable name="comment" select="$clientcheck/clientcheck/comment"/>
    
    <xsl:variable name="imageRoot" select="concat($webroot,'themes/',$theme,'/images/clientcheck/')"/>

	<xsl:template name="html_head">
		<link rel="alternate" type="application/rss+xml" title="RSS 2.0 Feed" href="{$webroot}news/rss.xml"/>
        <link rel="stylesheet" type="text/css" href="{$webroot}themes/{$theme}/css/clientcheck.css" media="screen" />
        <script src="{$webroot}themes/{$theme}/js/clientcheck/clientcheck.js" type="text/javascript"/>
        <script src="{$webroot}themes/{$theme}/js/clientcheck/AC_OETags.js" type="text/javascript"/>
        <script src="{$webroot}themes/{$theme}/js/lib/jquery-1.2.2.pack.js" type="text/javascript"/>
	</xsl:template>

    <xsl:template name="content">
    
        <h1><i18n:text>Liip Browser Capabilities Checkup</i18n:text></h1>
                
                <p><i18n:text>Der <em>Liip Browser Capabilities Checkup</em> prüft die Konfiguration Ihres aktuell verwendeten Browsers.</i18n:text></p>
            
                <noscript>
                    <p><b><i18n:text>Javascript ist in diesem Browser deaktiviert. Damit der <em>Liip Browser Capabilities Checkup</em> erfolgreich durchgeführt werden kann, muss Javascript aktiviert sein.</i18n:text></b></p>
                </noscript>

                
                <script type="text/javascript">
                
                    jQuery(document).ready(function(){
                    
                        // the (very simple) form validator
                        jQuery('#ccresultsform').submit(function() {
                            if(jQuery('#sender_email', this).val() != '') {
                                return true;
                            } else {
                                jQuery('#sender_email', this).addClass('haserror');
                                if(jQuery('#sender_email_error').size() == 0) {
                                    jQuery('#sender_email', this).before('<label class="error" id="sender_email_error" for="sender_email">Dieses Feld bitte ausfüllen.</label>');
                                }
                                jQuery('#sender_email', this)[0].focus();
                                return false;
                            }
                            return false;
                        });
                    
                        // remove fields used to detect spam bots
                        jQuery('.removebyjs').remove();

                        jQuery('#ccresultsformenabler').click(function() {
                            var results = _check.serializeResults();
                            jQuery('#resultstext').val(results);    
                            jQuery('#resultstextdiv').val(results);    
                            jQuery('#ccresultsform').show();
                        });
                        
                        jQuery('#ccresultsformcommentenabler').click(function() {
                            jQuery('#ccresultsformcomment').toggle();
                        });
                        
                        <xsl:if test="$mode = 'get'">
                        _check = new clientcheck({
                            imageroot: '<xsl:value-of select="$imageRoot"/>',
                            remoteAddress: '<xsl:value-of select="php:function('bx_helpers_liip::SERVER', 'REMOTE_ADDR')"/>'
                        });
                        _check.addDefaultChecks();
                        _check.launch();
                        </xsl:if>
                        
                    });
                    
                </script>
                
                <div id="cccontainer">
                    <xsl:attribute name="style"><xsl:if test="$mode='get'">display: none;</xsl:if></xsl:attribute>
                
                    <xsl:if test="$mode = 'get'">

                        <h2><i18n:text>Resultate</i18n:text></h2>
                        <ul id="ccresults">
                            <li class="ccresult" id="ccres_userAgent"><div class="ccright"></div><span class="testname"><i18n:text>User Agent</i18n:text></span></li>
                            <li class="ccresult" id="ccres_platform"><div class="ccright"></div><span class="testname"><i18n:text>Platform</i18n:text></span></li>
                            <li class="ccresult" id="ccres_remoteaddress"><div class="ccright"></div><span class="testname"><i18n:text>Remote Address</i18n:text></span></li>
                            <li class="ccresult" id="ccres_popupblocker"><div class="ccright"></div><span class="testname"><i18n:text>Popup Blocker</i18n:text></span></li>
                            <li class="ccresult" id="ccres_cookies"><div class="ccright"></div><span class="testname"><i18n:text>Cookies</i18n:text></span></li>
                            <li class="ccresult" id="ccres_ajax"><div class="ccright"></div><span class="testname"><i18n:text>Ajax</i18n:text></span></li>
                            <li class="ccresult" id="ccres_flash"><div class="ccright"></div><span class="testname"><i18n:text>Flash</i18n:text></span></li>
                        </ul>
                        
                        <h2><i18n:text>Resultate senden</i18n:text></h2>
                        <p><i18n:text>Wenn Sie möchten, können Sie uns die Resultate des Checkups per E-Mail zukommen lassen.</i18n:text></p>
                        
                        <p><a id="ccresultsformenabler"><i18n:text>Resultate jetzt senden</i18n:text></a> »</p>
                        
                        <br/>
                    </xsl:if>
                    
                    <form action="" method="post" id="ccresultsform">
                        <xsl:attribute name="style"><xsl:if test="$mode='get'">display: none;</xsl:if></xsl:attribute>
                        <input type="hidden" id="resultstext" name="resultstext" value="{$resultstext}"/>
                        
                        <p class="removebyjs">
                            <label for="link"><i18n:text>Dieses Feld unbedingt leer lassen</i18n:text></label>
                            <input type="text" name="link" id="link" value=""/>
                        </p>

                        <p>
                            <label for="recipient"><i18n:text>Empfänger/in</i18n:text></label>
                            <select name="recipient" id="recipient">
                                <optgroup label="Liip Allgemein">
                                    <option value="928122">Liip Allgemein</option>
                                </optgroup>
                                
                                <optgroup label="Mitarbeitende">
                                    <xsl:for-each select="/bx/plugin[@name='structure2xml']/team/team">
                                        <xsl:sort select="name"/>
                                        <option>
                                            <xsl:attribute name="value"><xsl:value-of select="id"/></xsl:attribute>
                                            <xsl:value-of select="name"/>
                                        </option>
                                    </xsl:for-each>
                                </optgroup>
                            </select>
                        </p>
                        
                        <p>
                            <label for="sender_email"><i18n:text>Absender/in (E-Mail)</i18n:text> *</label>
                            <input type="text" name="sender_email" id="sender_email" value="{$sender_email}"/>
                        </p>

                        <!-- the following field is for spam bot detection -->
                        <p class="dasgseetmernoed">
                            <label for="url"><i18n:text>Dieses Feld unbedingt leer lassen</i18n:text></label>
                            <input type="text" name="url" id="url"/>
                        </p>

                        <p>
                            <label for="resultstextdiv"><i18n:text>Folgendene Daten werden an Liip übermittelt</i18n:text></label>
                            <textarea rows="6" cols="120" id="resultstextdiv" name="resultstextdiv" readonly="readonly"><xsl:value-of select="$resultstext"/></textarea>
                        </p>
                        
                        <br/>
                        
                        <xsl:if test="$comment='' or $mode='get'">
                            <p><a id="ccresultsformcommentenabler"><i18n:text>Kommentar hinzufügen</i18n:text></a> »</p>
                        </xsl:if>
                        
                        <p id="ccresultsformcomment">
                            <xsl:attribute name="style"><xsl:if test="$comment='' or $mode='get'">display: none;</xsl:if></xsl:attribute>
                            <label for="comment"><i18n:text>Ihr Kommentar</i18n:text></label>
                            <textarea cols="80" rows="5" name="comment" id="comment"><xsl:value-of select="$comment"/></textarea>
                        </p>
                        
                        <p><xsl:value-of disable-output-escaping="yes" select="$clientcheck/clientcheck/recaptchahtml"/></p>
                        
                        <br/>
                        <p><input style="width: 45%;" type="submit" value="Testresultate senden"/></p>
                        
                    </form>
                    
                </div>
            
    
    </xsl:template>
    
</xsl:stylesheet>
