<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Represents the request parameters. Can be used as an array which
 * represents all request parameters combined. In that it works the
 * same way as the global $_REQUEST hash.
 */
class api_params extends ArrayObject {
    /** Hash with all POST parameters. */
    private $post = array();

    /** Hash with all GET parameters. */
    private $get  = array();

    /**
     * Constructor. Initializes the array object.
     * @param $array array: Default contents of the array.
     */
    public function __construct($array = array()) {
        parent::__construct($array, ArrayObject::ARRAY_AS_PROPS);
    }

    /**
     * Set the POST parameters.
     * @param $array hash: Associative array with all POST parameters.
     */
    public function setPost($array) {
        $this->post = $array;
        $this->exchangearray(array_merge($this->getArrayCopy(), $array));
    }

    /**
     * Set the GET parameters.
     * @param $array hash: Associative array with all GET parameters.
     */
    public function setGet($array) {
        $this->get = $array;
        $this->exchangearray(array_merge($this->getArrayCopy(), $array));
    }

    /**
     * Returns a POST parameter with the given key. Returns the whole
     * POST array if no param is given.
     * @param $param string: Key of the POST parameter to return.
     * @return mixed: Individual POST param or whole POST hash.
     */
    public function post($param = null) {
        if (isset($param)) {
            if (!isset($this->post[$param])) {
                return null;
            }

            return $this->post[$param];
        }
        return $this->post;
    }

    /**
     * Returns a GET parameter with the given key. Returns the whole
     * GET array if no param is given.
     * @param $param string: Key of the GET parameter to return.
     * @return mixed: Individual GET param or whole GET hash.
     */
    public function get($param = null) {
        if (isset($param)) {
            if (!isset($this->get[$param])) {
                return null;
            }
            return $this->get[$param];
        }
        return $this->get;
    }
}
