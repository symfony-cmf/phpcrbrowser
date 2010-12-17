<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Response class which handles outputting the header and body.
 *
 * Output buffering is used and the buffer is flushed only when calling
 * api_response::send().
 */
class api_response {
    /** Headers to send to the client. */
    protected $headers = array();
    /** Cookies to set. */
    protected $cookies = array();
    /** Content type to send to the client as header. */
    protected $contenttype = null;
    /** Character set of the response, sent together with the response type. */
    protected $charset = 'utf-8';
    /** HTTP response code sent to the client. */
    protected $code = null;
    /** Whether to specify the content length in the response header. This is
        off by default. If this is turned on, it will turn off HTTP chunked
        encoding. */
    protected $setContentLengthOutput = false;

    /**
     * Gets an instance of api_response.
     * @param $forceReload bool: If true, forces instantiation of a new
     *        instance. Used for testing.
     */
    public static function getInstance($forceReload = false) {
        static $instance;
        if ((!isset($instance) || !($instance instanceof api_response)) || $forceReload) {
            $instance = new api_response();
        }
        return $instance;
    }

    /**
     * Constructor. Turns on output buffering.
     */
    public function __construct() {
        ob_start();
    }

    /**
     * Set a single header. Overwrites an existing header of the same
     * name if it exists.
     * @param $header string: Header name.
     * @param $value string: Value of the header.
     */
    public function setHeader($header, $value) {
        $this->headers[$header] = $value;
    }

    /**
     * Returns an associative array of all set headers.
     * @return hash: All headers which have been set.
     */
    public function getHeaders() {
        $headers = $this->headers;

        if (!is_null($this->contenttype)) {
            $ct = $this->contenttype;
            if (!is_null($this->charset)) {
                $ct .= '; charset=' . $this->charset;
            }
            $headers['Content-Type'] = $ct;
        }

        return $headers;
    }

    /**
     * Sets a cookie with the given value.
     * Overwrites an existing Cookie if it's the same name
     *
     * @param $name string: Name of the cookie
     * @param $value string: Value of the cookie
     * @param $maxage int: Maxage of the cookie
     * @param $path string: Path where the cookie can be used
     * @param $domain: string: Domain which can read the cookie
     * @param $secure bool: Secure mode?
     * @param $httponly bool: Only allow HTTP usage?
     */
    public function setCookie($name, $value = '', $maxage = 0, $path = '', $domain = '',
                              $secure = false, $httponly = false) {
        $this->cookies[rawurlencode($name)] = rawurlencode($value)
                                              . (empty($domain) ? '' : '; Domain='.$domain)
                                              . (empty($maxage) ? '' : '; Max-Age='.$maxage)
                                              . (empty($path) ? '' : '; Path='.$path)
                                              . (!$secure ? '' : '; Secure')
                                              . (!$httponly ? '' : '; HttpOnly');
    }

    /**
     * Returns an associative array of all set cookies.
     * @return hash: All Cookies which have been set.
     */
    public function getCookies() {
        return $this->cookies;
    }

    /**
     * Sets the content type of the current request. By default no
     * content type header is sent to the client.
     * @param $contenttype string: Content type to send.
     */
    public function setContentType($contenttype) {
        $this->contenttype = $contenttype;
    }

    /**
     * Sets the character set of the current request. The character
     * set is only used when content type has been set. The default
     * character set is utf-8 - set to null if you want to send
     * a Content-Type header without character set information.
     * @param $charset string: Character set to send.
     */
    public function setCharset($charset) {
        $this->charset = $charset;
    }

    /**
     * Sets the response code of the current request.
     * @param $code int: Response code to send.
     * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html HTTP status codes
     */
    public function setCode($code) {
        $this->code = $code;
    }

    /**
     * Returns whether the content length will be specified in the response
     * header.
     */
    public function isContentLengthOutput() {
        return $this->setContentLengthOutput;
    }

    /**
     * Output the content length in the output.
     * @param $cl boolean: True if the content length should be set.
     */
    public function setContentLengthOutput($cl) {
        $this->setContentLengthOutput = $cl;
    }

    /**
     * Redirects the user to another location. The location can be
     * relative or absolute, but this methods always converts it into
     * an absolute location before sending it to the client.
     *
     * Calls the api_response::send() method to force output of all
     * headers set so far.
     *
     * @param $to string: Location to redirect to.
     * @param $status int: HTTP status code to set. Use one of the following: 301, 302, 303.
     * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.2 HTTP status codes
     */
    public function redirect($to, $status=301) {
        if (strpos($to, 'http://') === 0 || strpos($to, 'https://') === 0) {
            $url = $to;
        } else {
            $schema = $_SERVER['SERVER_PORT'] == '443' ? 'https' : 'http';
            $host = (isset($_SERVER['HTTP_HOST']) && strlen($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
            $to = strpos($to,'/')===0 ? $to : '/'.$to;
            $url = "$schema://$host$to";
        }

        $this->setCode($status);
        $this->setHeader('Location', $url);
        $this->send();
        exit();
    }

    /**
     * Sends the status code, and all headers to the client. Then flushes
     * the output buffer and thus sends the content out.
     */
    public function send() {
        if (!is_null($this->code)) {
            $this->sendStatus($this->code);
        }

        foreach ($this->getHeaders() as $header => $value) {
            header("$header: $value");
        }

        foreach ($this->getCookies() as $cookie => $value) {
            header("Set-Cookie: $cookie=$value", false);
        }

        if ($this->setContentLengthOutput) {
            header("Content-Length: " . ob_get_length());
        }

        ob_end_flush();

        if ($this->setContentLengthOutput) {
            die();
        }
    }

    /**
     * Send the status header line.
     * @param $code int: Response code to send.
     * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html HTTP status codes
     */
    protected function sendStatus($code) {
        header(' ', true, $code);
    }
}
