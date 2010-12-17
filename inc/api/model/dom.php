<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Dom model object. Represents an XML DOM and returns an XML DOM
 * for that DOM in getDOM().
 */
class api_model_dom extends api_model {
    /** DOMDocument: The dom-object */
    private $dom = NULL;

    /**
     * Constructor.
     * @param $dom DOMDocument: document to represent.
     */
    public function __construct($dom) {
        $this->dom = $dom;
    }

    /**
     * Returns the DOM for the view
     * @return DOMDocument
     */
    public function getDOM() {
        return $this->dom;
    }
}
