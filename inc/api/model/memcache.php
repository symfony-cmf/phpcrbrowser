<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Proxies another model object. Returns the response from memcached
 * if possible, otherwise requests the data from the proxied model and
 * caches the response.
 *
 * @author   Patrice Neff
 * @see api_cache
 */
class api_model_memcache extends api_model {
    /** DOMDocument: The loaded XML response. */
    protected $dom = null;

    /** api_cache: Connection to the memcached server. */
    protected $cache = null;

    /** api_model: The proxied model. */
    protected $dataobj = null;

    /** string: Key by which the response is identified in memcached. */
    protected $key = null;

    /** int: Expiration time of the entry. */
    protected $ttl = null;

    /**
     * Create a new data object which caches responses in memcached.
     *
     * @param $key string: Key by which the response is identified in memcached.
     * @param $ttl int: Expiration time of the entry. If set to 0 (default)
     *                  the item doesn't expire. Otherwise use a Unix timestamp
     *                  or number of seconds starting from the current time.
     * @param $data api_model: Model to be proxied.
     */
    public function __construct($key, $ttl, $data) {
        $this->dataobj = $data;
        $this->key = $key;
        $this->ttl = $ttl;
        $this->cache = api_cache::getInstance();

        if ($xml = $this->cache->get($this->key)) {
            $dom = new DOMDocument();
            $dom->loadXML($xml);
            $this->dom = $dom;
        }
    }

    public function getCurlObject() {
        if (is_null($this->dom)) {
            return $this->dataobj->getCurlObject();
        }
    }

    public function getDOM() {
        if (! is_null($this->dom)) {
            return $this->dom;
        }

        $dom = $this->dataobj->getDOM();
        if (is_null($dom)) {
            // Don't cache
            return null;
        }

        $xml = $dom->saveXML();
        $this->cache->set($this->key, $xml, false, $this->ttl);
        $this->dom = $dom;
        return $dom;
    }
}
