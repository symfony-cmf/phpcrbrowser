<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Returns the response of a HTTP request as a DOM. The URL of the
 * request is configured in the configuration file.
 *
 * An example configuration is:
 *
 * \code
 * backend:
 *     extapi:
 *         host: extapi.local.ch
 *         path: /0
 *         cities:
 *             path: /cities.xml
 *             params:
 *                q: A
 *         citiestest:
 *             port: 8080
 *             path: /cities.xml
 * \endcode
 *
 * This configuration defines the server "extapi" and two commands:
 *    - \b cities: http://extapi.local.ch/0/cities.xml?q=A
 *    - \b citiestest: http://extapi.local.ch:8080/0/cities.xml
 *
 *
 * @config <b>backend</b> (hash): Contains all URL configurations. The
 *         hash keys specify the server name.
 * @config <b>backend-><em>exampleserver</em></b> (hash):
 *         Contains configuration for one server. The hash keys specify
 *         the command names.
 * @config <b>backend-><em>...</em>->host</b> (string):
 *         Specify the host name for the URL. The most specific host is used
 *         (i.e. the closest to the actual command definition).
 * @config <b>backend-><em>...</em>->port</b> (int):
 *         Specify the port for the URL. Default is 80. The most specific
 *         port is used.
 * @config <b>backend-><em>...</em>->params</b> (hash):
 *         URL parameters for the URL. More specific param definitions
 *         overwrite global ones.
 * @config <b>backend-><em>...</em>->path</b> (string):
 *         Specify the path for the URL. All the paths down to the command
 *         definition are concatenated.
 *
 * @author   Patrice Neff
 */
class api_model_backend_get extends api_model_http {
    /** string: Configured server to get configuration from. */
    protected $server = '';

    /** string: Command name to get from configuration. */
    protected $command = '';

    /** hash: URL parameters to be added to the URL. */
    protected $params = array();

    /** int: CURL timeout in seconds. */
    protected $timeout = 20;

    /** hash: Attributes which will be added to the root node of the response. */
    protected $nodeAttributes = array();

    /**
     * Create a new data object which returns a HTTP response as DOM.
     *
     * @param $server string: Server name from the configuration file.
     * @param $command string: Command name to look up in the
     *        configuration file.
     * @param $params hash: URL parameters to be added to the URL.
     */
    public function __construct($server, $command, $params = array()) {
        $this->serverName = $server;
        $this->commandName = $command;
        $this->params = $params;
        $url = $this->getUrl($server, $command, $params);
        $this->curl = $this->prepareCurl($url);
        $this->url = $url;
    }

    /**
     * Sets the CURL timeout of the command.
     * @param $timeout int: Timeout in seconds.
     */
    public function setTimeout($timeout) {
        curl_setopt($this->curl, CURLOPT_TIMEOUT, intval($timeout));
        $this->timeout = $timeout;
    }

    /**
     * Sets the node attributes to be added to the root node of the
     * response. The `server' and `command' are always added
     * automatically (see getDOM()).
     * @param $attributes hash: Attributes to add.
     */
    public function setNodeAttributes($attributes) {
        $this->nodeAttributes = $attributes;
    }

    /**
     * Read the CURL response and return it in a DOM. Works the same as
     * api_model_http::getDOM() but adds node attributes to the root
     * node. The added node attributes are `server' and `command'.
     * Additionally all attributes defined by setNodeAttributes() are
     * added.
     *
     * @exception api_exception_Backend if the response was empty or
     *            returned a status code different to 200.
     * @exception api_exception_XmlParseError if the response can't be
     *            parsed as XML.
     * @return DOMDocument: XML Document
     */
    public function getDOM() {
        $dom = parent::getDOM();

        // Add some attributes on the root node
        $doc = $dom->documentElement;
        $doc->setAttribute('server', $this->serverName);
        $doc->setAttribute('command', $this->commandName);
        foreach ($this->nodeAttributes as $key => $value) {
            $doc->setAttribute($key, $value);
        }

        return $dom;
    }

    /**
     * Get the URL based on configuration.
     *
     * @param $server string: Server name from the configuration file.
     * @param $command string: Command name to look up in the
     *        configuration file.
     * @param $params hash: URL parameters to be added to the URL.
     */
    protected function getUrl($server, $command, $params) {
        // Defaults
        $host = '';
        $port = '';
        $path = '';
        $defaultParams = array();

        $cfg = api_config::getInstance()->backend;
        $cmd = $this->getBackendConfig($cfg[$server], $command);
        if (is_null($cmd)) {
            throw new api_exception_Backend(api_exception::THROW_FATAL,
                array('server' => $server, 'command' => $command),
                1,
                "Command $server/$command not found in backend configuration.");
            return null;
        }

        $host = $cmd['host'];
        $port = $cmd['port'];
        $path = $cmd['path'];
        $defaultParams = $cmd['params'];

        if (empty($host) || empty($path)) {
            throw new api_exception_Backend(api_exception::THROW_FATAL,
                array('server' => $server, 'command' => $command),
                2,
                "Command $server/$command does not specify host or path.");
            return null;
        }

        if (isset($cmd['protocol'])) {
            $url = $cmd['protocol'];
        } else {
            $url = 'http://';
        }

        $url .= $host;
        if (!empty($port)) $url .= ':' . $port;
        if ($path[0] != '/') $url .= '/';
        $url .= $path;

        // Add param
        if (is_array($params)) {
            $params = array_merge($defaultParams, $params);
        }
        if (count($params) > 0) {
            api_helpers_string::clearControlChars($params);

            // Replace params in URL. Syntay: {param}
            foreach ($params as $key=>$val) {
                if (strpos($url, '{' . $key . '}') !== FALSE) {
                    $url = str_replace('{' . $key . '}', $val, $url);
                    unset($params[$key]);
                }
            }

            // Build query of remaining params
            if (count($params) > 0) {
                $url .= '?' . $this->buildQueryString($params);
            }
        }

        return $url;
    }

    /**
     * Reads the configuration recursively, adding hosts, paths, etc.
     * to the input parameters.
     *
     * Returns the computed values if the command is found, null
     * otherwise.
     *
     * @param $cfg hash: Configuration array to start looking on.
     * @param $commandName string: Name of the command to look for.
     * @param $values hash: Values collected so far. Used for recursive
     *        invocation of the method.
     */
    protected function getBackendConfig($cfg, $commandName, $values = null) {
        if (is_null($values)) {
            $values = array('host' => '', 'port' => '',
                            'path' => '', 'params' => array());
        }

        if (isset($cfg['host'])) {
            $values['host'] = $cfg['host'];
        }
        if (isset($cfg['port'])) {
            $values['port'] = $cfg['port'];
        }
        if (isset($cfg['protocol'])) {
            $values['protocol'] = $cfg['protocol'];
        }
        if (isset($cfg['path'])) {
            $values['path'] .= $cfg['path'];
        }
        if (isset($cfg['params'])) {
            $values['params'] = array_merge($values['params'], $cfg['params']);
        }

        if (empty($commandName)) {
            return $values;
        } else if (isset($cfg[$commandName])) {
            return $this->getBackendConfig($cfg[$commandName], '', $values);
        } else {
            foreach ($cfg as $key => $subconfig) {
                if (is_array($subconfig)) {
                    $retval = $this->getBackendConfig($subconfig, $commandName, $values);
                    if (!is_null($retval)) {
                        return $retval;
                    }
                }
            }
            return null;
        }
    }

    /**
     * Constructs the query string from the given array. Uses
     * http_build_query by default but is a good candiate to be
     * overwritten if necessary.
     * @param $params mixed: Variable to build query string for.
     * @see http://php.net/manual/en/function.http-build-query.php
     */
    protected function buildQueryString($params) {
        return http_build_query($params);
    }
}
