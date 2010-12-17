<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Returns the response of a HTTP request as a DOM. The HTTP response must
 * be valid XML as it's loaded using DOMDocument::load().
 *
 * @author   Patrice Neff
 */
class api_model_http extends api_model {
    /** resource: Initialized CURL resource. */
    protected $curl = null;

    /** string: URL loaded by this object. */
    protected $url = '';

    /** string: Headers to be set to the curl. */
    protected $headers = array();

    /**
     * Create a new data object which returns a HTTP response as DOM.
     *
     * @param $url string: URL to request.
     * @exception api_exception_Backend if the CURL resource can't be
     *            initialized.
     */
    public function __construct($url) {
        $this->curl = $this->prepareCurl($url);
        $this->url = $url;
    }

    public function getCurlObject() {
        return $this->curl;
    }

    /**
     * Read the CURL response and return it in a DOM.
     *
     * @exception api_exception_Backend if the response was empty or
     *            returned a status code different to 200.
     * @exception api_exception_XmlParseError if the response can't be
     *            parsed as XML.
     * @return DOMDocument: XML Document
     */
    public function getDOM() {
        $info = curl_getinfo($this->curl);
        if ($info['request_size'] == 0) {
            // CURL command has not been executed yet
            $xmls = curl_exec($this->curl);
            $info = curl_getinfo($this->curl);
        } else {
            $xmls = curl_multi_getcontent($this->curl);
        }

        $status = (isset($info['http_code'])) ? $info['http_code'] : 0;
        if (empty($xmls)) {
            throw new api_exception_Backend(
                api_exception::THROW_FATAL,
                array('url' => $this->url),
                0,
                "Empty response returned.");
        } else if ($status != 200) {
            throw new api_exception_Backend(
                api_exception::THROW_FATAL,
                array('url' => $this->url),
                0,
                "Got a bad HTTP status: " . $status);
        }

        $dom = DOMDocument::loadXML($xmls);
        if ($dom === false) {
            throw new api_exception_XmlParseError(api_exception::THROW_FATAL, $this->url);
        }

        return $dom;
    }

    /**
     * Create the CURL request for a GET request to the given URL.
     *
     * @param $url string: URL to request.
     * @return resource: CURL resource.
     * @exception api_exception_Backend if the CURL resource can't be
     *            initialized.
     * @see http://www.php.net/manual/en/function.curl-init.php
     */
    protected function prepareCurl($url) {
        $curl = curl_init();
        if (!$curl) {
            throw new api_exception_Backend(
                api_exception::THROW_FATAL,
                array('url' => $this->url),
                0,
                "Could not initialize CURL object");
        }

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);  //return data as string
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);  //follow redirects
        curl_setopt($curl, CURLOPT_MAXREDIRS, 2);       //maximum redirects
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 20); //timeout
        curl_setopt($curl, CURLOPT_TIMEOUT, 20);        //timeout
        curl_setopt($curl, CURLOPT_NOSIGNAL,true);
        curl_setopt($curl, CURLOPT_DNS_USE_GLOBAL_CACHE, FALSE);
        curl_setopt($curl, CURLOPT_FILETIME, TRUE);

        $this->headers[] = 'Accept-Language: en';
        curl_setopt($curl, CURLOPT_HTTPHEADER, $this->headers);

        return $curl;
    }
}
