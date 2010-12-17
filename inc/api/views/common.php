<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Abstract class to be extended by views
 *
 * @author   Silvan Zurbruegg
 */
abstract class api_views_common {
    /** api_response: Response object. */
    protected $response = null;
    /** api_request: Request object. */
    protected $request = null;
    /** Route parameters. */
    protected $route = array();

    /**
     * Set the response object to use.
     * @param $response api_response: Response object.
     */
    public function setResponse($response) {
        $this->response = $response;
    }

    /**
     * Set the request object to use.
     * @param $request api_request: Request object.
     */
    public function setRequest($request) {
        $this->request = $request;
    }

    /**
     * Constructor.
     * @param $route hash: Route parameters.
     */
    public function __construct($route) {
        $this->request = api_request::getInstance();
        $this->route = $route;
        $this->response = api_response::getInstance();
    }

    /**
     * Prepare for dispatching
     *
     * Gets called before dispatch()
     * Useful for instantiation of DOM objects etc.
     */
    public function prepare() {
       return true;
    }

    /**
     * To be implemented by views for outputting response.
     * @param $data DOMDocument: DOM document to transform.
     * @param $exceptions array: Array of exceptions merged into the DOM.
     */
    abstract function dispatch($data, $exceptions = null);

    /**
     * Sends text/xml content type headers.
     *
     * @return   void
     */
    protected function setXMLHeaders() {
        $this->response->setContentType('text/xml');
        $this->response->setCharset('utf-8');
    }

    /**
     * Usable by views for setting specific headers
     * Should use the $this->response object to set headers.
     */
    protected function setHeaders() {
    }

    /**
     * Translates content in the given DOM using api_i18n.
     *
     * @param $lang string: Language to translate to.
     * @param $xmlDoc DOMDocument: DOM to translate.
     * @config <b>lang['i18ntransform']</b> (bool): If set to false,
     *         no transformations are done. Defaults to true.
     */
    protected function transformI18n($lang, $xmlDoc) {
        $cfg = api_config::getInstance()->lang;
        if(isset($cfg['i18ntransform']) && $cfg['i18ntransform'] === false){
            return;
        }

        $i = api_i18n::getInstance($lang);
        $i->i18n($xmlDoc);
    }

    /**
     * Returns a merged DOMDocument of the given data and exception list.
     *
     * Data can be any of these three things:
     *    - DOMDocument: Used directly
     *    - string: Treated as an XML string and loaded into a DOMDocument
     *    - array: Converted to a DOMDocument using api_helpers_xml::array2dom
     *
     * The exceptions are merged into the DOM using the method
     * api_views_default::mergeExceptions()
     *
     * @param $data mixed: See above
     * @param $exceptions array: Array of exceptions merged into the DOM.
     * @return DOMDocument: DOM with exceptions
     */
    protected function getDom($data, $exceptions) {
        $xmldom = null;
        // Use DOM or load XML from string or array.
        if ($data instanceof DOMDocument) {
            $xmldom = $data;
        } else if (is_string($data) && !empty($data)) {
            $xmldom = DOMDocument::loadXML($data);
        } else if (is_array($data)) {
            @$xmldom = DOMDocument::loadXML("<command/>");
            api_helpers_xml::array2dom($data, $xmldom, $xmldom->documentElement);
        }

        if (count($exceptions) > 0) {
             $this->mergeExceptions($xmldom, $exceptions);
        }

        return $xmldom;
    }

    /**
     * Merges exceptions into the DOM Document.
     * Appends a node \<exceptions> to the root node of the given DOM
     * document.
     *
     * @param $xmldom DOMDocument: Response DOM document.
     * @param $exceptions array: List of exceptions
    */
    protected function mergeExceptions(&$xmldom, $exceptions) {
        if (count($exceptions) == 0) {
            return;
        }

        $exceptionsNode = $xmldom->createElement('exceptions');
        foreach($exceptions as $exception) {
            $exceptionNode = $xmldom->createElement('exception');
            foreach($exception->getSummary() as $name => $value) {
                $child = $xmldom->createElement($name);
                $child->nodeValue = $value;
                $exceptionNode->appendChild($child);
            }
            $exceptionsNode->appendChild($exceptionNode);
        }

        $xmldom->documentElement->appendChild($exceptionsNode);
    }
}
