<?php
/**
 * Replaces default api_model::factory by usually returning dummy
 * factories. Tests can set up the usage like this:
 *
 * \code
 * api_model_factory::setFixture('api_model_backend_get', 'test.xml');
 * \endcode
 *
 * This way every request for an api_model_backend_get will return a
 * api_model_dom model instead with the given fixture file loaded.
 * The files are expected to be located under /tests/fixtures/.
 */
class api_model_factory {
    /** array: All loaded fixtures. */
    protected static $fixtures = array();
    
    /** array: List of models which can always be instantiated without fixture. */
    protected static $DEFAULTS = array('config', 'queryinfo', 'userstatus');
    
    /** bool: True if the default behavior should be kept as a fallback. */
    protected static $defaultFallback = true;
    
    /**
     * Does the main magic.
     *
     * @param $name string: Model name.
     * @param $params array: Parameters in order of their appearance in the constructor.
     * @param $namespace string: Namespace, default "api"
     * @return object api_model_givenname object with the called params.
     */
    public static function get($name, $params = array(), $namespace = "api") {
        $model = self::getFixture($name, $params);
        if (!is_null($model)) {
            return $model;
        }
        
        // Hardcoded default for the memcache model:
        // Return the proxied model again instead of using the
        // memcache model.
        if ($name == 'memcache' && count($params) >= 3) {
            $proxy = $params[2];
            if ($proxy instanceof api_model_dom or $proxy instanceof api_model) {
                return $proxy;
            }
        }
        
        if (self::$defaultFallback || in_array($name, self::$DEFAULTS)) {
            // Default: load model normal
            if (class_exists($namespace . '_model_' . $name)) {
                $name = $namespace . '_model_' . $name;
            }
            if (count($params) == 0) {
                return new $name;
            } else {
                $class = new ReflectionClass($name);
                return $class->newInstanceArgs($params);
            }
        } else {
            // Unknown model
            $msg = "Unknown model request: $name.\n";
            $msg .= var_export($params, true);
            throw new api_testing_exception($msg);
        }
    }
    
    /**
     * Assign the given fixture to be loaded in a DOM when the given model
     * is requested.
     * @param $model string: Name of the model for which this fixture will
     *               be returned.
     * @param $file  string: Fixture file to load into the returned DOM model.
     * @param $params hash:  Optional array with parameters. The fixture will
     *                       only be returned if all parameters match exactly.
     */
    public static function setFixture($model, $file, $params = null) {
        if (!isset(self::$fixtures[$model])) {
            self::$fixtures[$model] = array();
        }
        
        // Load the DOM
        $fullFile = API_PROJECT_DIR . "tests/fixtures/" . $file;
        $dom = new DOMDocument();
        $dom->load($fullFile);
        $modelObj = new api_model_dom($dom);
        
        array_push(self::$fixtures[$model], array(
            'file'   => $file,
            'model'  => $modelObj,
            'params' => $params,
        ));
    }
    
    /**
     * Assign the given object to be returned when the given model is
     * requested.
     * @param $model string: Name of the model for which this fixture will
     *               be returned.
     * @param $object object: Fixture object to return.
     * @param $params hash:  Optional array with parameters. The fixture will
     *                       only be returned if all parameters match exactly.
     */
    public static function setModel($model, $object, $params = null) {
        if (!isset(self::$fixtures[$model])) {
            self::$fixtures[$model] = array();
        }
        array_push(self::$fixtures[$model], array(
            'file'   => null,
            'model'  => $object,
            'params' => $params,
        ));
    }
    
    /**
     * Disable the default behavior of instantiating the actual models.
     * When this is deactivated, the factory will only return fixtures
     * or - if no matching fixture can be found - null.
     */
    public static function disableDefault() {
        self::$defaultFallback = false;
    }
    
    /**
     * Remove all the defined fixtures. To be called in setUp() methods
     * of the tests usually.
     */
    public static function reset() {
        self::$fixtures = array();
        self::$defaultFallback = true;
    }
    
    /**
     * Return the fixture for the requested model / params pair.
     */
    protected static function getFixture($model, $params) {
        if (!isset(self::$fixtures[$model])) {
            return null;
        }
        
        
        // array_reverse is here so that later setFixture overwrite
        // earlier ones.
        foreach (array_reverse(self::$fixtures[$model]) as $fixture) {
            if (is_null($fixture['params']) || $fixture['params'] == $params) {
                return $fixture['model'];
            }
        }
        
        return null;
    }
}
