<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Default view class. Does XSLT transformations and dispatches output.
 *
 * @config <b>allowDomDump</b> (mixed): True if you want to allow the
 *         DOM to be output to the browser with the XML=1 URL parameter.
 *         This can also be an array of client IP address wildcards to
 *         allow dumping for. Defaults to false.
 *
 * @author   Silvan Zurbruegg
 */
class api_views_default extends api_views_common {
    /** DOMDocument: XSLT document used for the transformations. */
    protected $xsldom = null;

    /** XsltProcessor: Instantiated XSLT processor. */
    protected $xslproc = null;

    /** boolean: True if the XML DOM should be dumped to the browser
        instead of the view transformation result. */
    protected $dumpDom = false;

    /**
     * bool: If set to true, XML data which gives problem in HTML output
     * is stripped from output using api_views_default::cleanXml().
     */
    protected $omitXmlDecl = true;

    /** string: XSLT file used for transforming the output. */
    protected $xslfile = '';

    public function __construct($route) {
        parent::__construct($route);
        $this->dumpDom = $this->parseDumpDomConfig();
    }

    protected function parseDumpDomConfig() {
        if ($this->request->getParam('XML') != '1') {
            return false;
        }

        $cfg = api_config::getInstance()->allowDomDump;
        if ($cfg === true) {
            return true;
        } else if (is_array($cfg)) {
            $ip = $this->request->getClientIp();
            foreach ($cfg as $pattern) {
                if (api_helpers_string::matchWildcard($pattern, $ip)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Outputs the responses by transforming it using the loaded XSLT.
     * If the XML request parameter is set to 1, the DOM is output
     * directly.
     *
     * @param $data mixed: See api_views_default::getDom()
     * @param $exceptions array: Array of exceptions merged into the DOM.
     * @exception api_exception_XsltParseError if the XSLT transformation
     *            did not return a valid XML document.
     */
    public function dispatch($data, $exceptions = null) {
        if ($this->state != API_STATE_READY) {
            $this->prepare();
        }

        $xmldom = $this->getDom($data, $exceptions);

        // ?XML=1 trick
        if ($this->dumpDom) {
            $this->setXMLHeaders();
            /* Ported from popoon: mozilla does not display the XML
               neatly, if there's a xhtml namespace in it, so we spoof it
               here (mainly used for XML=1 purposes) */
            if ($this->request->getParam('notrick') == 1) {
                print $xmldom->saveXML();
            } else {
                print str_replace("http://www.w3.org/1999/xhtml","http://www.w3.org/1999/xhtml#trickMozillaDisplay", $xmldom->saveXML());
            }
            $this->sendResponse();
            return;
        }

        if (! $xmldom instanceof DOMDocument && $this->xsldom && $this->xslproc) {
            return;
        }
        libxml_clear_errors();

        $xml = @$this->xslproc->transformToDoc($xmldom);
        $xslt_errors = libxml_get_errors();
        if (count($xslt_errors) == 0 && $xml instanceof DOMDocument) {
            $this->transformI18n($this->request->getLang(), $xml);
            $this->setHeaders();
            echo $this->getOuputFromDom($xml);
            $this->sendResponse();
            return;
        } else {
            throw new api_exception_XsltParseError(api_exception::THROW_FATAL, $this->xslfile, $xslt_errors);
        }
    }

    /**
     * Return the string to output for the given DOM. By default cleans the
     * XML a bit.
     * @param $dom DOMDocument: DOM to output.
     */
    protected function getOuputFromDom($dom) {
        $xmlstr = $dom->saveXML();
        if ($this->omitXmlDecl) {
            $xmlstr = $this->cleanXml($xmlstr);
        }
        return $xmlstr;
    }

    /**
     * Removes content from the XML which will cause problems in
     * browsers.
     * Called from dispatch right before sending out the response body.
     *
     * @param $xmlstr string: XML string
     */
    protected function cleanXml($xmlstr) {
        $xmlstr = preg_replace("#^<\?xml.*\?>#","", $xmlstr);
        $xmlstr = preg_replace("#<!\[CDATA\[\W*\]\]>#","",$xmlstr);
        // strip CDATA just after <script>
        $xmlstr = preg_replace("#(<script[^>]*>)\W*<!\[CDATA\[#","$1",$xmlstr);
        // strip ]]> just before </script>
        $xmlstr =  preg_replace("#\]\]>\W*(</script>)#","$1",$xmlstr);
        // strip CDATA just after <style>
        $xmlstr = preg_replace("#(<style[^>]*>)\W*<!\[CDATA\[#","$1",$xmlstr);
        // strip ]]> just before </style>
        $xmlstr =  preg_replace("#\]\]>\W*(</style>)#","$1",$xmlstr);

        // Strip namespaces
        $xmlstr = preg_replace('#(<[^>]*)xmlns=""#', "$1", $xmlstr);
        $xmlstr = preg_replace('#(<[^>]*)xmlns:i18n[0-9]*="http://apache.org/cocoon/i18n/2.1"#', "$1", $xmlstr);
        $xmlstr = preg_replace('#(<[^>]*)xmlns="http://www.w3.org/1999/xhtml"#', "$1", $xmlstr);
        $xmlstr = preg_replace('#(<[^>]*)i18n[0-9]*:attr="[^"]+"#', "$1", $xmlstr);

        return trim($xmlstr);
    }

    /**
     * Prepares for the XSLT transformation. Loads the XSLT stylesheet.
     *
     * @exception api_exception_FileNotFound if the XSLT stylesheet does
     *            not exist.
     * @exception api_exception_XmlParseError if the XSLT stylesheet
     *            does not contain valid XML.
     */
    public function prepare() {
        $defaults = array('theme' => 'default', 'css' => 'default',
                          'view' => 'default', 'passdom' => 'no');
        $attrib = $this->route['view'];
        $attrib = array_merge($defaults, $attrib);

        if (!isset($attrib['xsl'])) {
            throw new api_exception_NoXsltFound("No XSLT stylesheet was specified for this route.");
        }

        if (isset($attrib['contenttype']) && !empty($attrib['contenttype'])) {
            $this->response->setContentType($attrib['contenttype']);
        } else {
            $this->response->setContentType('text/html');
        }

        if (isset($attrib['encoding']) && !empty($attrib['encoding'])) {
            $this->response->setCharset($attrib['encoding']);
        }

        $this->xslfile = '';
        if (!isset($attrib['theme'])) {
            $attrib['theme'] = 'default';
        }

        if (isset($attrib['theme'])) {
            $this->xslfile = API_THEMES_DIR.$attrib['theme']."/".$attrib['xsl'];
        }
        if ($this->dumpDom) {
            $this->setXMLHeaders();
            $this->state = API_STATE_READY;
            return true;
        }

        $this->xsldom = new DOMDocument();
        if(!$this->xsldom->load($this->xslfile)) {
            if(!file_exists($this->xslfile)) {
                throw new api_exception_FileNotFound(api_exception::THROW_FATAL, $this->xslfile);
            }
            throw new api_exception_XmlParseError(api_exception::THROW_FATAL, $this->xslfile);
        }

        if ($this->xsldom instanceof DOMDocument) {
            $this->xslproc = new XsltProcessor();
            $this->xslproc->importStylesheet($this->xsldom);

            $this->setXslParameters($this->xslproc, $attrib);
            $this->xslproc->registerPHPFunctions();
            $this->state = API_STATE_READY;

            return true;
        }

        return false;
    }

    /**
     * Set XSLT parameters passed in to the stylesheet.
     *
     * @param $xslproc XsltProcessor: The XSLT object.
     * @param $attrib array: The view attributes from the route.
     */
    protected function setXslParameters($xslproc, $attrib) {
        $this->xslproc->setParameter("", "webroot", API_WEBROOT);
        $this->xslproc->setParameter("", "webrootStatic", API_WEBROOT_STATIC);
        $this->xslproc->setParameter("", "mountpath", API_MOUNTPATH);
        $this->xslproc->setParameter("", "theme", $attrib['theme']);
        $this->xslproc->setParameter("", "themeCss", $attrib['css']);
        $this->xslproc->setParameter("", "lang", $this->request->getLang());
        $this->xslproc->setParameter("", "projectDir", API_PROJECT_DIR);

        if(isset($attrib['xslproc']) && is_array($attrib['xslproc']) ) {
            foreach($attrib['xslproc'] as $key => $val) {
                $this->xslproc->setParameter("", $key, $val);
            }
        }
    }

    /**
     * Sends the response using the methods of api_response.
     */
    protected function sendResponse() {
        $this->response->send();
    }
}
