<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Interface with common methods for adding routes which is implemented
 * by all of the different routing classes. This permits consistent
 * adding and configuring of routes.
 */
interface api_Irouting {
    /**
     * Defines the actual route expression for the given route. See
     * api_routing_route::parseRoute() for how the route is parsed.
     *
     * The following configuration values are recognized:
     *    - dynamicview: (See api_routing_route::parseRoute())
     *    - optionalextension: (See api_routing_route::getPath())
     *
     * @param $route string: Route expression.
     * @param $config hash: Configuration for route parsing.
     * @return api_routing_route: The route object (returned to allow chaining)
     */
    public function route($route, $config = array());

    /**
     * Defines the parameters for the given route and returns the
     * object.
     *
     * @param $params hash: Values which will be returned when the
     *        route matches.
     * @return api_routing_route: The route object (returned to allow chaining)
     */
    public function config($params);

    /**
     * Adds conditions to the current route and returns the object.
     *
     * The following conditions can be set:
     *    - verb: HTTP verb must match the value for the route to match.
     *
     * @param $conditions hash: Conditions.
     * @return api_routing_route: The route object (returned to allow chaining)
     */
    public function when($conditions);
}

/**
 * Configures how requests are routed to controllers.
 */
class api_routing implements api_Irouting {
    /** Array of api_routing_route: List of all configured routes. */
    static $routes = array();

    /**
     * Removes all defined routes.
     */
    public function clear() {
        self::$routes = array();
    }

    /**
     * Adds an api_routing_route object to the routing table.
     *
     * This happens automatically with methods which are part
     * of api_Irouting but this method is needed in case
     * you want to manually instantiate api_routing_route objects.
     *
     * @param $route api_routing_route: Route to add.
     */
    public function add($route) {
        self::$routes[] = $route;
        return $route;
    }

    public function route($route, $config = array()) {
        $r = new api_routing_route();
        return $this->add($r->route($route, $config));
    }

    public function config($params) {
        $r = new api_routing_route();
        return $this->add($r->config($params));
    }

    public function when($conditions) {
        $r = new api_routing_route();
        return $this->add($r->when($conditions));
    }

    /**
     * Returns the correct route for the given request. Returns null
     * if no route matches.
     *
     * Returns all parameters (set with api_routing_route::config())
     * merged with parameters extracted from the request.
     *
     * @param $request api_request: api_request object.
     * @return hash: Route params.
     */
    public function getRoute($request) {
        $uri = $request->getPath();

        foreach (self::$routes as $route) {
            if ($retval = $route->match($request)) {
                return $retval;
            }
        }
        return null;
    }
}

/**
 * Standard route. Matches path to commands.
 */
class api_routing_route implements api_Irouting {
    /** Default parameters. */
    protected $default = array(
        'method' => 'process',
        'view' => array());

    /** Route expression to match against the path. */
    protected $route      = null;
    /** Additional route configuration which influences how the route
        is processed. */
    protected $routeConfig = array();
    /** Parameter hash for the route. Returned when the route matches. */
    protected $params     = array();
    /** Additional conditions which does not match the path. */
    protected $conditions = array();

    /**
     * Constructor. Sets the default params.
     */
    public function __construct() {
        $this->params = $this->default;
    }

    /**
     * Returns a deep copy of this route. Can be used when an existing
     * route is to be re-used and modified slightly. Add it to the routing
     * table with api_routing::add().
     */
    public function dup() {
        return clone($this);
    }

    public function route($route, $config = array()) {
        if ($route[0] != '/') {
            $route = '/' . $route;
        }
        $this->route = $route;
        $this->routeConfig = $config;
        return $this;
    }

    public function config($params) {
        $this->params = array_merge($this->params, $params);
        return $this;
    }

    public function when($conditions) {
        $this->conditions = array_merge($this->conditions, $conditions);
        return $this;
    }

    /**
     * Returns the route object for the command if this route matches the
     * passed request. Returns null otherwise.
     * @param $request api_request: Request object.
     */
    public function match($request) {
        $uri = $request->getPath();

        if (isset($this->conditions['verb']) && $this->conditions['verb'] != $request->getVerb()) {
            return null;
        } else if (isset($this->conditions['sld']) && $this->conditions['sld'] != $request->getSld()) {
            return null;
        } else if ($this->route == $uri) {
            return $this->params;
        } else if (($params = $this->parseRoute($request)) !== null) {
            return array_merge($this->params, $params);
        } else {
            return null;
        }
    }

    /**
     * Matches the current route to the given request. Returns null if
     * it doesn't match, returns the extracted parameters otherwise.
     *
     * A route defines different parts separated by slash. Depending on the
     * first character, the parts match like this:
     *    - Colon (:)    - Named parameter, matches the path up to the next
     *                     slash. The paramater name comes after the
     *                     colon. All named parameters are added to the
     *                     paramaters hash.
     *    - Plus (+)     - As named parameters but eats up all the rest
     *                     of the path.
     *    - Asterisk (*) - Same as plus, but optional.
     *    - Others       - Has to match literally in the path.
     *
     * If the `substitute' route configuration is set, then variables in
     * the configuration are replaced by the extracted parameters.
     * An example route:
     *
     * \code
     * $m = new api_routing();
     * $m->route('/:foo/:command/:method', array("substitute"=>true))
     *     ->config(array('view' => array('xsl' => '{foo}.xsl')));
     * \endcode
     *
     * @param $request api_request: Request object.
     */
    protected function parseRoute($request) {
        $path = $this->getPath($request);
        $uriParts = explode('/', $path);
        $routeParts = explode('/', $this->route);

        // If there is a wildcard match at the end, URI may have
        // more components than the route.
        $last = $routeParts[count($routeParts)-1];
        if (strlen($last) && $last[0] != '*' && $last[0] != '+' && count($uriParts) > count($routeParts)) {
            return null;
        }


        // Fill in params from URL
        $params = array();
        foreach ($routeParts as $idx => $part) {
            $partKey = substr($part, 1);

            if ($part != '' && $part[0] == ':') {
                // Named param
                if (count($uriParts) > 0) {
                    // Param can be filled from the URI
                    $param = array_shift($uriParts);
                    if ($param === null || $param === '') {
                        return null;
                    }
                    $params[$partKey] = $param;
                } else if (isset($this->params[$partKey])) {
                    // Last param(s), use default
                    $params[$partKey] = $this->params[$partKey];
                } else {
                    // Param has no match in URL
                    return null;
                }

            } else if ($part != '' && $part[0] == '*') {
                // Wildcard, 0 or more hits
                $param = implode('/', array_slice($uriParts, 0));
                $params[$partKey] = $param;
                $uriParts = array();
                break;

            } else if ($part != '' && $part[0] == '+') {
                // Wildcard, eat up all the rest and return
                // 1 or more hits
                $param = implode('/', array_slice($uriParts, 0));
                if ($param === null || $param === '') {
                    return null;
                }
                $params[$partKey] = $param;
                $uriParts = array();
                break;

            } else if (count($uriParts) > 0 && $part == $uriParts[0]) {
                // URI part - matches exatly
                array_shift($uriParts);
            } else if (count($uriParts) == 0 && $part == "") {
                break;
            } else {

                // URI part doesn't match
                return null;
            }
        }

        // Parses the route to replace placeholders like {command} if `substitute' is set
        if (isset($this->routeConfig['substitute']) && $this->routeConfig['substitute']) {
            foreach ($this->params['view'] as &$setting) {
                $setting = preg_replace("/\{([\w\d]+)\}/e", 'api_helpers_string::clean($params[\'$1\'])', $setting);
            }
            foreach ($this->params as $param => $val) {
                if (!is_array($val)) {
                    $repl = 0;
                    $val = preg_replace("/\{([\w\d]+)\}/e", 'api_helpers_string::clean($params[\'$1\'])', $val, -1, $repl);
                    if ($repl > 0) {
                        $params[$param] = $val;
                    }
                }
            }
        }

        /*
         * This filters out calls to functions in api_command which is definately not intended at this point
         */
        // TODO: This is just a workaround, we should find a clean naming-convention or wait for php to introduce the notion of friends or anything
        if (isset($params['method']) && (!strncmp($params['method'], "__", 2) || in_array($params['method'],get_class_methods("api_command")))) {
            if (isset($this->params['method'])) {
                $params['method'] = $this->params['method'];
            } else {
                $params['method'] = "";
            }
        }

        return $params;
    }

    /**
     * Returns the path of the current request to be used for routing.
     * If optionalextension route configuration is set, then the path
     * is returned without the extensions. So in that case the route
     * matches no matter what extension is used.
     *
     * @param $request api_request: Request to get path of.
     */
    protected function getPath($request) {
        $path = $request->getPath();
        $ext = $request->getExtension();

        // Remove the extension if the user wished so
        if ($ext != '' && isset($this->routeConfig['optionalextension']) && $this->routeConfig['optionalextension']) {
            $path = substr($path, 0, -(strlen($ext)+1));
        }

        $path = rtrim($path, '/');
        return $path;
    }
}
