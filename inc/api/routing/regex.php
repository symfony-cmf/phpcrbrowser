<?php
/**
 * Configures how requests are routed to controllers.
 */
class api_routing_regex extends api_routing {   
    public function route($route, $config = array()) {
        $r = new api_routing_regex_route();
        return $this->add($r->route($route, $config));
    }
    
    public function config($params) {
        $r = new api_routing_regex_route();
        return $this->add($r->config($params));
    }
    
    public function when($conditions) {
        $r = new api_routing_regex_route();
        return $this->add($r->when($conditions));
    }
    
    public function map($mappings) {
        $r = new api_routing_regex_route();
        return $this->add($r->map($mappings));
    }
}

/**
 * Regex Route. Tries to match a pattern to a request
 */
class api_routing_regex_route extends api_routing_route {
    protected $routeParams = array();
    
    public function map($mappings) {
        $this->mappings = $mappings;
        return $this;
    }
    
    /**
     * Matches the current route to the given request. Returns null if
     * it doesn't match, returns the extracted parameters otherwise.
     * 
     * A route is set with a pattern, so if the entered pattern (PCRE) matches
     * the route matches as well. The pattern delimiters are "%' so you don't
     * need to escape slashes.
     * It is also possible to use named subpatterns which are then copied
     * into the params array if there was match for them.
     *
     * If you don't want to use named subpatterns, you can map your matches
     * with the ->map function, which maps parameters to the index of the
     * submatches
     * 
     * If the `substitute' route configuration is set, then variables in
     * the configuration are replaced by the extracted parameters.
     * An example route:
     *
     * \code
     * $m = new api_routing_regex();
     * $m->route('/(?<command>[\w\d]+)(/?)test/([\d]*)', array("substitute"=>true))
     *     ->map('id' => 3)
     *     ->config(array('view' => array('xsl' => '{command}.xsl')));
     * \endcode
     * 
     * @param $request api_request: Request object.
     */
    protected function parseRoute($request) {
        if (isset($this->conditions['verb']) && $this->conditions['verb'] != $request->getVerb()) {
            return null;
        }
        
        // Get clean path and route
        $path = $this->getPath($request);
        $route = rtrim($this->route,"/");
        $this->routeParams = $this->params;
        
        // Get the matches
        $paramMatches = array();
        $cnt = preg_match_all("%^".$route."$%", $path, $paramMatches, PREG_SET_ORDER);
        if (!$cnt) { return null; }
        $paramMatches = $paramMatches[0];
        
        // Insert named parameters into the params array
        array_walk_recursive($paramMatches, array($this, 'insertNamedSubpattern'));
        
        // Set the parameters from the url which have a numbered mapping
        $params = $this->routeParams;
        foreach ($this->mappings as $key => $index) {
            if (!isset($paramMatches[$index]) || $paramMatches[$index] == "") {
                continue;
            }
            $params[$key] = $paramMatches[$index];
        }
        $this->routeParams = $params;
        
        // Now replace all the placeholder
        array_walk_recursive($this->routeParams, array($this, 'replacePlaceholder'));
        
        return $this->routeParams;
    }
    
    /**
     * Callback function which replaces all placeholders like {foo} in $item
     * with its counterpart in the params array
     */
    protected function replacePlaceholder(&$item, $key) {
        $replaceRegex = '%\{([\w\d_-]+)\}%e';
        $params = $this->routeParams;
        $item = preg_replace($replaceRegex, '$params[\'$1\']', $item);
    }
    
    /**
     * Inserts a pattern to the params if it is a named subpattern
     */
    protected function insertNamedSubpattern($item, $key) {
        if (is_string($key) && !empty($item)) {
            $this->routeParams[$key] = $item;
            
        }
    }
}
