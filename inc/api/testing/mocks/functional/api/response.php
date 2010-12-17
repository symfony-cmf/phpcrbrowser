<?php
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
    
    /**
     * Re-implements send of api_response with a no-op.
     */
    public function send() {
        // NOOP
    }
    
    /**
     * Returns the output data.
     */
    public function getContents() {
        return ob_get_clean();
    }
    
    /**
     * Catch redirects and thrown a testing exception for that.
     */
    public function redirect($to, $status=301) {
        throw new api_testing_exception("Redirect $status => $to");
    }
    
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
     * @param string Name of the cookie
     * @param string Value of the cookie
     * @param int Maxage of the cookie
     * @param string Path where the cookie can be used
     * @param string Domain which can read the cookie
     * @param bool Secure mode?
     * @param bool Only allow HTTP usage?
     */
    public function setCookie($name, $value = '', $maxage = 0, $path = '', $domain = '', 
                              $secure = false, $HTTPOnly = false) {
        $this->cookies[rawurlencode($name)] = rawurlencode($value)
                                            . (empty($domain) ? '' : '; Domain='.$domain)
                                            . (empty($maxage) ? '' : '; Max-Age='.$maxage)
                                            . (empty($path) ? '' : '; Path='.$path)
                                            . (!$secure ? '' : '; Secure')
                                            . (!$HTTPOnly ? '' : '; HttpOnly');
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
     * Get the content type of the current request.
     */
    public function getContentType() {
        return $this->contenttype;
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
     * Gets the character set of the current request.
     */
    public function getCharset($charset) {
        return $this->charset;
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
     * Gets the response code of the current request.
     */
    public function getCode() {
        return $this->code;
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
}
