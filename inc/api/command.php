<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Base command to be extended by all commands.
 *
 * A command is responsible for getting the data and executing all the
 * actions for the current request.
 *
 * @author   Silvan Zurbruegg
 */
abstract class api_command {
    /**
     * api_request: Request object containing information about the current
     * request.
     */
    protected $request = null;

    /**
     * api_response: Response object used to send output to the client.
     */
    protected $response = null;

    /**
     * array: Route definition of the current request. This is the return
     * value of api_routing::getRoute().
     */
    protected $route = array();

    /**
     * array of api_model: Data objects to be passed to the XSLT
     * stylesheets.
     */
    protected $data = array();

    /**
     * string: Default Method. Gets called by api_command::process() when
     * the route does not contain a method.
     */
    protected $defaultMethod = 'defaultRequest';

    /**
     * Constructor. Initializes the object's attributes but does not have
     * any side effects.
     * @param    $route array: The attributes as returned by
     *                         api_routing::getRoute().
     */
    public function __construct(&$route) {
        $this->request = api_request::getInstance();
        $this->response = api_response::getInstance();
        $this->route = &$route;

    }

    /**
     * Get XSL parameters from command. Used to overwrite view configuration
     * from the route.
     * @return  array: Associative array with params.
     */
    public function getXslParams() {
        return array();
    }

    /**
     * Process request. This is the entry point of a command which calls
     * the method as passed in from the routing engine. If no method has
     * been defined, then the method specified by api_command::$defaultMethod
     * is called.
     * @return void
     */
    public function process() {
        $route = $this->route;
        if (isset($route['method']) && $route['method'] != 'process') {
            // __call() may return false, then we go execute the default request
            if ((!method_exists($this, $route['method']) || is_callable(array($this, $route['method'])))
                && $this->{$route['method']}()
            ) {
                return;
            }
        }
        $this->{$this->defaultMethod}();
        return;
    }

    /**
     * Default method called by api_command::process (as specified with
     * api_command::$defaultMethod).
     *
     * If you want a catch-all method that is executed on every request,
     * overwrite api_command::process(). If you just want a fall-back for
     * the case when a method specified in the route doesn't exist in this
     * class, then overwrite api_command::defaultRequest().
     * @return void
     */
    public function defaultRequest() {
    }

    /**
     * Safety purposes __call so that the default command is called when
     * somebody is careless in the route configuration. So if the route
     * configuration specifies a method which doesn't exist in the command,
     * then this no-operation method is called.
     * @param $name string: Method name. Passed in automatically by PHP.
     * @param $argv array:  Method parameters. Passed in automatically by PHP.
     * @return bool: false
     */
    public function __call($name, $argv) {
        return false;
    }

    /**
     * Checks permission. To prevent a user from accessing a command, the
     * command has to redirect the user somewhere else in this method.
     *
     * When this method returns false the controller throws a
     * api_exception_CommandNotAllowed exception.
     *
     * @return bool
     */
    public function isAllowed() {
        return true;
    }

    /**
     * Merge the response of all data objects in api_command::$data into
     * one XML DOM and return the DOM. This calls api_model::$getDOM()
     * on every element of the data array.
     * @return DOMDocument: Document with root tag "command". The root tag
     *                      has an attribute "name" which is set to the base
     *                      name of the command class
     *                      (see api_helpers_class::getBaseName()).
     */
    public function getData() {
        $dom = new DOMDocument();
        $dom->loadXML("<command/>");
        $commandname = api_helpers_class::getBaseName($this);
        $cmdNode = $dom->documentElement;
        $cmdNode->setAttribute("name", $commandname);

        foreach ($this->data as $d) {
            $dataDom = $d->getDOM();
            if (!is_null($dataDom) && $dataDom->documentElement) {
                $node = $dom->importNode($dataDom->documentElement, true);
                $dom->documentElement->appendChild($node);
            }
        }

        return $dom;
    }
}
