<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

require('api/params.php');

/**
 * Parses the request and stores all information it can extract from
 * the request in a easily accessible form.
 */
class api_request {
    /** Hostname of the current request. */
    protected $host = '';
    /** Subdomain of the current request's hostname. */
    protected $sld = '';
    /** Top domain of the current request's hostname. */
    protected $tld = '';
    /** Path of the current request. */
    protected $path = '';
    /** Full URL of the current request. */
    protected $url = '';
    /** HTTP verb of the current request. */
    protected $verb = '';
    /** Language for the current request. */
    protected $lang = '';
    /** api_params: Request parameters. */
    protected $params = null;
    /** Filename extracted from the path. */
    protected $filename = '';
    /** Extension extracted from the path. */
    protected $extension = false;

    /**
     * Gets an instance of api_request.
     * @param $forceReload bool: If true, forces instantiation of a
     *        new instance. Used for testing.
     */
    public static function getInstance($forceReload = false) {
        static $instance;

        if  ($forceReload || !isset($instance) || !($instance instanceof api_request)) {
            $instance = new api_request;
        }

        return $instance;
    }

    /**
     * Constructor. Parses the request and fills in all the
     * values it can.
     */
    protected function __construct() {
        $this->host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';

        $config = api_config::getInstance();
        $this->outputLangs = $config->lang['languages'];
        $this->defaultLang = $config->lang['default'];
        if (is_null($this->outputLangs)) {
            $this->outputLangs = array('en');
        }
        if (is_null($this->defaultLang)) {
            $this->defaultLang = 'en';
        }

        // Parse host, get SLD / TLD
        $hostinfo = api_init::getHostConfig($this->host);
        if ($hostinfo) {
            $this->sld = $hostinfo['sld'];
            $this->tld = $hostinfo['tld'];
        }

        $path = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
        if (strpos($path, '?') !== FALSE) {
            $path = substr($path, 0, strpos($path, '?'));
        }

        // Get language from the beginning of the URL
        $lang = $this->getLanguageFromPath($path);
        if ($lang !== null) {
            $this->lang = $lang['lang'];
            $path = $lang['path'];
        }

        // Strip out path prefix from path
        if (isset($hostinfo['path'])) {
            if (strpos($path, $hostinfo['path']) === 0) {
                $path = substr($path, strlen($hostinfo['path']));
            }
            if (substr($path, 0, 1) !== '/') {
                $path = '/' . $path;
            }
        }

        // HTTP verb - assume GET as default
        $this->verb = isset($_SERVER['REQUEST_METHOD']) ? strtoupper($_SERVER['REQUEST_METHOD']) : 'GET';

        $this->params = new api_params();
        $this->params->setGet($_GET);
        if ($this->verb == 'POST') {
            $this->params->setPost($_POST);
        }

        if ($this->lang === '') {
            $lang = $this->parseLanguage($path);
            $this->lang = $lang['lang'];
            $path = $lang['path'];
        }
        $this->url = API_HOST . $this->lang . API_MOUNTPATH . substr($path, 1);
        $this->path = api_helpers_string::removeDoubleSlashes($path);

        // Path
        $this->filename = $this->parseFilename($this->path);

        $matches = array();
        if ($this->filename != '') {
            /* if you set an extension: [xml, foo, rss, html] node in your
             * config file, only these extensions are valid extensions.
             * the rest is not parsed as an extension */
            preg_match("#\.([a-z]+)$#", $this->filename, $matches);
            $aExtensions = api_config::getInstance()->extensions;
            if (isset($matches[1]) && !empty($matches[1])) {
                if (isset($aExtensions) && is_array($aExtensions)) {
                    if (in_array($matches[1], $aExtensions)) {
                        $this->extension = $matches[1];
                    }
                } else {
                    $this->extension = $matches[1];
                }
            }
        }
    }

    /**
     * Returns the hostname of the current request.
     */
    public function getHost() {
        return $this->host;
    }

    /**
     * Returns the subdomain of the current request's hostname.
     * @see api_init::getHostConfig()
     */
    public function getSld() {
        return $this->sld;
    }

    /**
     * Returns the top domain of the current request's hostname.
     * @see api_init::getHostConfig()
     */
    public function getTld() {
        return $this->tld;
    }

    /**
     * Returns the path of the current request. Language and path prefix
     * are removed.
     */
    public function getPath() {
        return $this->path;
    }

    /**
     * Returns the full URL of the current request. (not
     * including query parameters)
     */
    public function getUrl() {
        return $this->url;
    }

    /**
     * Returns the verb / request method of the current request.
     * The verb is always upper case.
     */
    public function getVerb() {
        return $this->verb;
    }

    /**
     * Returns the detected language of the current request.
     */
    public function getLang() {
        return $this->lang;
    }

    /**
     * Returns a list of all configured languages.
     */
    public function getLanguages() {
        return $this->outputLangs;
    }

    /**
     * Returns the configured default language.
     */
    public function getDefaultLanguage() {
        return $this->defaultLang;
    }

    /**
     * Returns the file name of the current request.
     */
    public function getFilename() {
        return $this->filename;
    }

    /**
     * Returns the extension of the file name. This consists of three or
     * four letters.
     */
    public function getExtension() {
        return $this->extension;
    }

    /**
     * Returns the request parameters.
     */
    public function getParameters() {
        return $this->params;
    }

    /**
     * Returns the client IP address. In case of a clustered (load balancer)
     * setup, this returns the real client IP by looking at the
     * X-Cluster-Client-IP header.
     */
    public function getClientIp() {
        $headers = array('HTTP_X_FORWARDED_FOR', 'HTTP_X_CLUSTER_CLIENT_IP',
                         'HTTP_FORWARDED_FOR', 'HTTP_X_FORWARDED',
                         'HTTP_FORWARDED', 'HTTP_VIA', 'HTTP_X_COMING_FROM',
                         'HTTP_X_COMING_FROM', 'HTTP_COMING_FROM',
                         'REMOTE_ADDR');
        foreach ($headers as $header) {
            if (isset($_SERVER[$header])) {
                return $_SERVER[$header];
            }
        }
    }

    /**
     * Returns a single request parameter.
     * You can pass in a default value which is returned in case the
     * param does not exist. Null is returned by default.
     * @param $param string: Key of the request parameter to return.
     * @param $default string: Default value to return if the key does
     *        not exist in the request parameters.
     * @return string: Request parameter or default.
     */
    public function getParam($param, $default = null) {
        if (isset($this->params[$param])) {
            return $this->params[$param];
        } else {
            return $default;
        }
    }

    /**
     * Parses out a file name from the current path.
     * The last path component is returned if it contains an extension
     * of at least one character.
     * @param $path string: Path to parse.
     * @return string: File name
     */
    private function parseFilename($path) {
        preg_match("#[\s\w\xc0-\xff\-\_\%2F\+]*\.[a-z0-9]{1,}$#i", $path, $matches);
        if (isset($matches[0])) {
            return api_helpers_string::ensureUtf8(urldecode($matches[0]));
        }
        return '';
    }

    /**
     * Gets the language from the given path.
     * On finding a language, an associative array is returned
     * containing the new path and the language.
     * If no language is found, null is returned.
     * @param $path string: Path to parse.
     * @return hash: Parsed path.
     */
    private function getLanguageFromPath($path) {
        // Path
        preg_match("#^\/([a-z]{2})\/#", $path, $matches);
        if (isset($matches[1]) && in_array($matches[1], $this->outputLangs)) {
            $lang = $matches[1];
            $newpath = substr($path, 3);
            return array('path' => $newpath,
                         'lang' => $lang);
        }

        return null;
    }

    /**
     * Gets a language from the current request. The following
     * positions are checked for a language:
     *   - Path (beginning of path).
     *   - HTTP Accept headers.
     *   - Default.
     *
     * @param $path string: Path to parse.
     * @return hash: Parsed path.
     */
    private function parseLanguage($path) {
        $newpath = $path;

        if ($retval = $this->getLanguageFromPath($path)) {
            return $retval;
        }

        // lang is in ACCEPT_LANGUAGE
        $config = api_config::getInstance();
        if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) && $config->acceptLanguage !== false) {
            $accls = explode(",", $_SERVER['HTTP_ACCEPT_LANGUAGE']);
            if (is_array($accls)) {
                foreach($accls as $accl) {
                    // Does not respect coefficient
                    $l = substr($accl, 0, 2);
                    if (in_array($l, $this->outputLangs)) {
                        return array('path' => $newpath,
                                     'lang' => $l);
                    }
                }
            }
        }

        return array('path' => $newpath,
                     'lang' => $this->defaultLang);
    }
}
