<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    exclude-result-prefixes="xhtml i18n"
    version="1.0">
    <xsl:import href="master.xsl"/>
    
    
    
    <xsl:template name="page_body_right">
        
    </xsl:template>
    
    <xsl:template name="page_body_content">
                
        <div id="topmenu" class="yuimenubar yuimenubarnav">
            <div class="bd">
                
                <ul class="first-of-type">
                    <li class="yuimenubaritem first-of-type">
                        <a class="yuimenubaritemlabel">Node</a>
                    </li>
                   <!-- <li class="yuimenubaritem">
                        <a class="yuimenubaritemlabel" href="http://entertainment.yahoo.com">Entertainment</a>
                    </li>
                    <li class="yuimenubaritem">
                        <a class="yuimenubaritemlabel" href="#">Information</a>
                    </li>-->
                </ul>
            </div>
        </div>
        

<h2 id="nodePath"><xsl:text> </xsl:text></h2>
        <div  id="propsTable"> <xsl:text> </xsl:text> </div>
        <div  id="versionsTable"> <xsl:text> </xsl:text>  </div>
    </xsl:template>
    
    <xsl:template name="html_body_right">
        <div class="yui-b first" id="treeDiv1">.
            <xsl:call-template name="page_body_right"/>
        </div>
        
    </xsl:template>
    
    <xsl:template name="html_body_content">
        <div id="bd">
            <div id="yui-main">
                <div class="yui-b ">
                    <xsl:call-template name="page_body_content"></xsl:call-template>
                </div>
                
            </div>
            <xsl:call-template name="html_body_right"/>
            
            
        </div>
        
        
        <div id="dialogNewNode" style="visibility:hidden;">
            <div class="hd">Please enter your information</div>
            <div class="bd">
                <form id="dialogNewNodeForm" method="POST" action="">
                    <label for="name">name:</label><input type="textbox" name="name" /><br/>
                    
                    <label for="type">NodeType:</label>
                    <select name="type" id="dialogNodeType">
                        <option value="">Loading...</option>
                        
                    </select> 
          
                </form>
            </div>
        </div>
        
    </xsl:template>
    
    
    <xsl:template name="page_bottom_javascript">
        <script type="text/javascript" src="/static/js/yui/yuiloader/yuiloader-min.js"><xsl:text> </xsl:text></script> 
        
        <!--Use YUI Loader to bring in your other dependencies: --> 
        <script type="text/javascript"> 
            // Instantiate and configure YUI Loader: 
            (function() { 
            var loader = new YAHOO.util.YUILoader({ 
            base: "/static/js/yui/", 
            require: ["treeview","connection","datatable","json","menu","container","button","dragdrop"], 
            loadOptional: false, 
            combine: false, 
            filter: "MIN", 
            allowRollup: true, 
            onSuccess: function() {
            
            E = YAHOO.util.Event;
            D = YAHOO.util.Dom;
            $ = YAHOO.util.Dom.get;
            YAHOO.util.Event.onDOMReady(YAHOO.cr.init);
            } 
            }); 
            
            // Load the files using the insert() method. 
            loader.insert(); 
            })(); 
        </script> 
        <script type="text/javascript" src="/static/js/crbrowser.js"><xsl:text> </xsl:text></script>
        
    </xsl:template>
    </xsl:stylesheet>