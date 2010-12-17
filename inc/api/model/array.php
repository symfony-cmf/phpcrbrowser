<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Array model object. Represents an array and returns an XML DOM
 * for that array in getDOM().
 *
 * @author   Patrice Neff
 */
class api_model_array extends api_model {
    /** string: Name of the root node to be set. */
    protected $root = '';

    /** array: Array which is represented in this object. */
    protected $array = null;

    /**
     * Create a new data object which returns an array as DOM.
     *
     * @param $array array: The array to map to the XML DOM.
     * @param $root string: Root node tag name.
     */
    public function __construct($array, $root = 'response') {
        $this->array = $array;
        $this->root = $root;
    }

    public function getDOM() {
        $dom = new DOMDocument();
        $dom->loadXML("<" . $this->root . "/>");
        $dom->documentElement->setAttribute('type', 'array');
        api_helpers_xml::array2dom($this->array, $dom, $dom->documentElement);
        return $dom;
    }
}
