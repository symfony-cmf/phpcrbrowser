<?php
/**
 * Base class for functional tests. Provides methods to trigger a
 * complete Okapi request without actually doing any HTTP request.
 * Instead api_controller::process() is called directly.
 */
class api_testing_case_functional extends UnitTestCase {
    /** api_controller: Controller to handle requests. */
    protected $controller = null;
    /** DOMDocument: DOM returned by the previous request. */
    protected $responseDom = null;
    /** string: Original include path before setUp() was called. Used to
        recover the include path in the tearDown() method. */
    protected $includepathOriginal = '';
    
    /**
     * Sets up the testing environment for the functional tests.
     * Prepends the directory mocks/functional to the include
     * path to make sure that the mock api_model_factory and
     * api_response are used in all functional tests.
     */
    function setUp() {
        api_init::start();

        // Set include path to include mock objects.
        $this->includepathOriginal = get_include_path();
        set_include_path(dirname(__FILE__).'/../mocks/functional/' .
            PATH_SEPARATOR . get_include_path());
        api_model_factory::reset();
        
        parent::setUp();
    }
    
    /**
     * Resets the testing environment. Reverts to the original include path.
     */
    function tearDown() {
        set_include_path($this->includepathOriginal);
        parent::tearDown();
    }

    /**
     * Executes the given request internally using the GET method.
     * @param $path string: Path relative to the application root to
     *                      request. This path is passed to the routing
     *                      engine. Path can include query string parameters.
     */
    protected function get($path) {
        $_SERVER['REQUEST_METHOD'] = 'GET';
        $this->request($path, array());
    }

    /**
     * Executes the given request internally using the HEAD method.
     * @param $path string: Path relative to the application root to
     *                      request. This path is passed to the routing
     *                      engine. Path can include query string parameters.
     */
    protected function head($path) {
        $_SERVER['REQUEST_METHOD'] = 'HEAD';
        $this->request($path, array());
    }

    /**
     * Executes the given request internally using the POST method.
     * @param $path string: Path relative to the application root to
     *                      request. This path is passed to the routing
     *                      engine. Path can include query string parameters.
     * @param $params array: POST parameters to pass to the request.
     */
    protected function post($path, $params) {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $this->request($path, $params);
    }
    
    /**
     * Executes the given request internally using the PUT method.
     * @param $path string: Path relative to the application root to
     *                      request. This path is passed to the routing
     *                      engine. Path can include query string parameters.
     * @param $params array: POST parameters to pass to the request.
     */
    protected function put($path, $params) {
        $_SERVER['REQUEST_METHOD'] = 'PUT';
        $this->request($path, $params);
    }
    
    /**
     * Executes the given request internally using the DELETE method.
     * @param $path string: Path relative to the application root to
     *                      request. This path is passed to the routing
     *                      engine. Path can include query string parameters.
     * @param $params array: POST parameters to pass to the request.
     */
    protected function delete($path) {
        $_SERVER['REQUEST_METHOD'] = 'DELETE';
        $this->request($path, array());
    }
    
    /**
     * Common request handling for get/post.
     * @param $path string: Path relative to the application root to
     *                      request. This path is passed to the routing
     *                      engine. Path can include query string parameters.
     * @param $params array: POST parameters to pass to the request.
     */
    private function request($path, $params) {
        $_SERVER["REQUEST_URI"] = $path;
        $components = parse_url($path);
        $_GET = $_POST = $_REQUEST = $_FILES = array();
        
        if (isset($components['query'])) {
            $query = array();
            parse_str($components['query'], $query);
            $_GET = $query;
        }
        $_POST = $params;
        $this->uploadFiles($_POST, $_FILES);
        $_REQUEST = array_merge($_GET, $_POST);
        
        api_request::getInstance(true);
        api_response::getInstance(true);
        $this->controller = new api_controller();
        $this->controller->process();
        $this->loadResponse();
        $this->removeUploadedFiles();
    }
    
    /**
     * Loads the response into the DOM.
     * May be overwritten in implementations where the response
     * is not expected to be XML.
     */
    protected function loadResponse() {
        $response = api_response::getInstance();
        $resp = $response->getContents();
        $this->responseDom = DOMDocument::loadXML($resp);
        $this->assertIsA($this->responseDom, 'DOMDocument',
            "The view didn't output valid XML. (%s)");
    }
    
    /**
     * Takes all paramaters form the POST array whose value's
     * start with an `@' and interprets those as file uploads.
     * This is compatible with the way curl handles uploads.
     *
     * Example usage with file uploads:
     * \code
     * $this->post('/test', array(
     *     'Type' => 'IMAGE',
     *     'File' => '@vw_golf.jpg',
     * ));
     * \endcode
     *
     * This passes a normal POST parameter "Type" and additionally
     * uploads the picture vw_golf.jpg (which has to exist in the
     * current working directory for that example).
     */
    private function uploadFiles(&$post, &$files) {
        foreach ($post as $key => $value) {
            if (strlen($value) >= 1 && $value[0] == '@') {
                $orig_file = substr($value, 1);
                $upload_file = '';
                if (file_exists($orig_file)) {
                    $upload_file = sys_get_temp_dir() . '/_file_' . count($files);
                    copy($orig_file, $upload_file);
                }
                
                // Get MIME type
                if (function_exists('finfo_open')) {
                    $finfo = finfo_open(FILEINFO_MIME);
                    $type = finfo_file($finfo, $orig_file);
                    finfo_close($finfo);
                } else if (function_exists('mime_content_type')) {
                    $type = mime_content_type($orig_file);
                } else {
                    $type = '';
                }
                
                // File upload
                $files[$key] = array(
                    'name' => basename($orig_file),
                    'type' => $type,
                    'size' => filesize($orig_file),
                    'tmp_name' => $upload_file,
                    'error' => 0,
                );
                unset($_POST[$key]);
            }
        }
    }
    
    /**
     * Remove all uploaded files from the current request.
     */
    private function removeUploadedFiles() {
        foreach ($_FILES as $key => $arr) {
            if (is_file($arr['tmp_name'])) {
                unlink($arr['tmp_name']);
            }
        }
    }
    
    /**
     * Constructs the correct URI for the given route path.
     * @param $route string: Relative URL from the application root.
     * @param $lang string: Language to include in the path.
     */
    protected function getURI($route, $lang = 'de') {
        return API_HOST . $lang . API_MOUNTPATH . substr($route, 1);
    }
    
    /**
     * Constructs the correct path relative to the root of the host for
     * the given route path. Prepends the mount path and language.
     * @param $route string: Relative URL from the application root.
     * @param $lang string: Language to include in the path.
     */
    protected function getPath($route, $lang = 'de') {
        return '/' . $lang . API_MOUNTPATH . substr($route, 1);
    }

    /**
     * Gets the DOM node matching the given XPath expression.
     * @param $xpath string: XPath expression to return node for.
     * @see api_helpers_xpath::getNode()
     */
    protected function getNode($xpath) {
        return api_helpers_xpath::getNode($this->responseDom, $xpath);
    }
    
    /**
     * Asserts that the given node exists.
     * @param $xpath string: XPath expression to test.
     * @param $message string: Message to output in case of failure.
     */
    public function assertNode($xpath, $message = null) {
        if ($message != null) {
            $message = "$message :: ";
        }
        $this->assertNotNull($this->getNode($xpath), "{$message}No node found for $xpath");
    }
    
    /**
     * Asserts that the given node does not exist.
     * @param $xpath string: XPath expression to test.
     * @param $message string: Message to output in case of failure.
     */
    public function assertNotNode($xpath, $message = null) {
        if ($message != null) {
            $message = "$message :: ";
        }
        $this->assertNull($this->getNode($xpath), "{$message}Node found for $xpath but none was expected.");
    }
    
    /**
     * Gets the first result of the current page by XPath.
     * @param $xpath string: XPath expression to return text for.
     * @see api_helpers_xpath::getText()
     */
    public function getText($xpath) {
        return api_helpers_xpath::getText($this->responseDom, $xpath);
    }
    
    /**
     * Asserts that the text retrieved by an XPath expression matches.
     * @param $xpath string: XPath expression to test.
     * @param $expected string: Expected value returned by the XPath
     *                          expression.
     * @param $message string: Message to output in case of failure.
     */
    public function assertText($xpath, $expected, $message = '%s') {
        return $this->assertEqual($expected, $this->getText($xpath), $message);
    }
    
    /**
     * Gets the first result of the current page by XPath.
     * @param $xpath string: XPath expression to return attribute for. The
     *                       XPath expression must contain two components
     *                       separated by `a'. First the expression to find
     *                       the node, then the attribute to return the value
     *                       for.
     * @see api_helpers_xpath::getAttribute()
     */
    public function getAttribute($xpath) {
        return api_helpers_xpath::getAttribute($this->responseDom, $xpath);
    }
    
    /**
     * Asserts that the attribute retrieved by an XPath expression matches.
     * @param $xpath string: XPath expression.
     *                       @see api_testing_case_functional::getAttribute().
     * @param $expected string: Expected value returned by the XPath
     *                          expression.
     * @param $message string: Message to output in case of failure.
     */
    public function assertAttribute($xpath, $expected, $message = '%s') {
        return $this->assertEqual($expected, $this->getAttribute($xpath), $message);
    }

    /**
     * Expect the next request to redirect to the given page.
     * @param $path string: Path to the page where the redirect should go to.
     * @param $absolute bool: True if the given path is absolute. Otherwise
     *                 the redirect is assumed to be inside the current
     *                 application relative to the application root.
     * @param $lang string: Language to which the redirect is expected. Only
     *                      relevant is $absolute=false.
     */
    public function expectRedirect($path, $absolute = false, $lang = 'de') {
        if (!$absolute) {
            $path = '/' . $lang . API_MOUNTPATH . substr($path, 1);
        }
        $this->expectException(new api_testing_exception("Redirect 301 => $path"));
    }
}
