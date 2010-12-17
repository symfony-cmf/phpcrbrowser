<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Base model class.
 *
 * Data objects abstract the retrieval of data from several sources.
 * The result is always an XML DOM which can be passed directly
 * to XSLT (often merged with other data responses before that).
 *
 * The configuration of the model is expected to be done with the
 * constructor.
 *
 * @author   Patrice Neff
 */
class api_model {
    /**
     * Return a prepared CURL object.
     *
     * All CURL objects returned by the different data objects are
     * fetched in parallel by the default command. When getDOM() is
     * called, this CURL object has been retrieved and the result can
     * be accessed.
     *
     * See api_model_http for an example usage.
     *
     * @return resource: CURL resource
     * @see http://www.php.net/manual/en/function.curl-init.php
     */
    public function getCurlObject() {
        return null;
    }

    /**
     * Return a DOM document representing the data of this model object.
     *
     * @return resource: DOMDocument
     */
    public function getDOM() {
        return null;
    }
}

