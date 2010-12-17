<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Model which returns a DOM with information about the current request
 * from the command.
 *
 * This model is useful for passing the relevant information to the XSLT
 * stylesheets.
 *
 * @author   Patrice Neff
 */
class api_model_queryinfo extends api_model {
    /**
     * Create a new data object which represents the current request.
     *
     * @param $request api_request: Request information.
     * @param $route array: Parsed route as returned by api_routing::getRoute()
     */
    public function __construct($request, $route) {
        $this->request = $request;
        $this->route = $route;

        $this->params = $request->getParameters();
        $this->path = $request->getPath();
        $this->lang = $request->getLang();
        $this->command = $route['command'];
        $this->method = $route['method'];
        $this->sld = $request->getSld();
        $this->tld = $request->getTld();
        $this->host = $request->getHost();
    }

    /**
     * Returns a DOM with the following structure:
     *   - \b queryinfo: (root node)
     *       - \b query:      api_request::getParameters()
     *       - \b self:       api_request::getUrl()
     *       - \b requestURI: api_request::getPath() + api_request::getParameters()
     *       - \b lang:       api_request::getLang()
     *       - \b command:    $route['command']
     *       - \b method:     $route['method']
     *       - \b sld:        api_request::getSld()
     *       - \b tld:        api_request::getTld()
     *       - \b host:       api_request::getHost()
     *       - \b languages:  api_request::getLanguages()
     *       - \b route:      $route
     */
    public function getDOM() {
        $dom = new DOMDocument();
        $dom->loadXML('<queryinfo/>');
        $root = $dom->documentElement;

        $elem = $dom->createElement('query');
        foreach($this->params as $name => $value) {
            try {
                $queryP = $dom->createElement($name);
                if (is_array($value)) {
                    api_helpers_xml::array2dom($value, $dom, $queryP);
                } else {
                    $queryP->nodeValue = htmlspecialchars(urldecode($value), ENT_QUOTES, 'UTF-8');
                }
                $elem->appendChild($queryP);
            } catch (DOMException $e) {
                // silently ignore catched DOM_INVALID_CHARACTER_ERR
                if (DOM_INVALID_CHARACTER_ERR !== $e->getCode()) {
                    // rethrow all other Exceptions
                    throw $e;
                }
            }
        }
        $root->appendChild($elem);

        $self = $dom->createElement('self');
        $self->nodeValue = htmlspecialchars($this->request->getUrl());
        $root->appendChild($self);

        $queryP = $dom->createElement('requestURI');
        $requestUri = $this->path;
        $queryString = http_build_query($this->params);
        if ($queryString !== '') {
            $requestUri .= '?' . $queryString;
        }
        $queryP->nodeValue = str_replace("&","&amp;", substr($requestUri, 1));
        $root->appendChild($queryP);

        foreach(array('lang', 'command', 'method', 'sld', 'tld', 'host') as $key) {
            $node = $dom->createElement($key);
            $node->nodeValue = $this->$key;
            $root->appendChild($node);
        }

        $langs = $this->request->getLanguages();
        $node = $dom->createElement('languages');
        api_helpers_xml::array2dom($langs, $dom, $node);
        $root->appendChild($node);

        $node = $dom->createElement('route');
        api_helpers_xml::array2dom($this->route, $dom, $node);
        $root->appendChild($node);

        return $dom;
    }
}
