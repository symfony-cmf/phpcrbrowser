<?php


class api_views_noview extends api_views_common{
	
  public function setResponse($response) {
   }
    
    /**
     * Set the request object to use.
     * @param $request api_request: Request object.
     */
    public function setRequest($request) {
    }
    
    /**
     * Constructor.
     * @param $route hash: Route parameters.
     */
    public function __construct($route) {
        
    }
    
    /**
     * Prepare for dispatching
     *
     * Gets called before dispatch()
     * Useful for instantiation of DOM objects etc.
     */
    public function prepare() {
       return true;
    }
    
    /**
     * To be implemented by views for outputting response.
     * @param $data DOMDocument: DOM document to transform.
     * @param $exceptions array: Array of exceptions merged into the DOM.
     */
    public function dispatch($data, $exceptions = null) {
    	if ($exceptions) {
    		var_dump($exceptions);
    	}
    }
    
    /**
     * Sends text/xml content type headers.
     *
     * @return   void
     */
    protected function setXMLHeaders() {
    }
    
    /**
     * Usable by views for setting specific headers
     * Should use the $this->response object to set headers.
     */
    protected function setHeaders() {
    }

    
    /**
     * Returns a merged DOMDocument of the given data and exception list.
     * 
     * Data can be any of these three things:
     *    - DOMDocument: Used directly
     *    - string: Treated as an XML string and loaded into a DOMDocument
     *    - array: Converted to a DOMDocument using api_helpers_xml::array2dom
     * 
     * The exceptions are merged into the DOM using the method
     * api_views_default::mergeExceptions()
     * 
     * @param $data mixed: See above
     * @param $exceptions array: Array of exceptions merged into the DOM.
     * @return DOMDocument: DOM with exceptions
     */
    protected function getDom($data, $exceptions) {

    }
    
  
}

?>
