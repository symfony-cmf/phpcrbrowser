<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Wrapper class for Zend_Log which reads configuration from api_config
 * and creates the corresponding Log objects.
 *
 * The configured logger is available through api_log::$logger.
 */
class api_log {

    const EMERG = 0; // Emergency: system is unusable
    const ALERT = 1; // Alert: action must be taken immediately
    const CRIT = 2; // Critical: critical conditions
    const ERR = 3; // Error: error conditions
    const WARN = 4; // Warning: warning conditions
    const NOTICE = 5; // Notice: normal but significant condition
    const INFO = 6; // Informational: informational messages
    const DEBUG = 7; // Debug: debug messages


    /** Log: Configured logger. */
    public static $logger = null;

    /** api_log instance */
    public static $instance = null;

    /** lowest priority **/
    protected $priority = null;

    /** default priority **/
    protected static $defaultPriority = self::ERR;

    /** MockWriter for testing */
    public static $mockWriter = null;

    /**
     * Log a message if a logger is configured
     */
    public static function log($prio) {
        if (self::$instance === false) {
            return false;
        }

        if (self::$instance === null) {
            $config = api_config::getInstance()->log;
            if (empty($config) || !(self::$instance = api_log::getInstance())) {
                self::$instance = false;
                return false;
            }
        }

        $params = func_get_args();
        array_shift($params);

        return self::$instance->logMessage($params, $prio);
    }

    /**
     * Log a message if a logger is configured without having to give a priority
     * Only one parameter is supported, if you need more arguments, use api_log::log();
     *
     * @param $message The message to be logged
     */
    public static function dump($message) {
        return self::log(self::$defaultPriority, $message);
    }
    /**
     * Initialize the logger.
     */
    public function __construct() {
        if (self::$logger !== null) {
            // Already initialized
            return;
        }

        $configs = api_config::getInstance()->log;

        if (empty($configs[0]['class'])) {
            // Logging is not activated
            self::$logger = false;
            return;
        }

        self::$logger = new Zend_Log();

        foreach ($configs as $cfg) {
            $log = $this->createLogObject($cfg['class'], $cfg);
            if ($cfg['class'] == 'Writer_Mock') {
                self::$mockWriter = $log;
            }
            self::$logger->addWriter($log);
        }
    }

    /**
     * Gets an instance of api_log.
     * @param $forceReload bool: If true, forces instantiation of a
     *        new instance. Used for testing.
     * @return api_log an api_log instance;
     */
    public static function getInstance($forceReload = FALSE) {
        if (!self::$instance instanceof api_log || $forceReload) {
            self::$logger = null;
            self::$instance = new api_log();
        }

        return self::$instance;
    }

    public function __call($method, $params) {
        $prio = self::getMaskFromLevel($method);
        $this->logMessage($params, $prio);
    }

    public function isLogging() {
        return self::$instance !== false && self::$logger !== false;
    }

    public function getPriority() {
        return $this->priority;
    }

    protected function createLogObject($name, $config) {
        $classname = 'Zend_Log_' . $name;
        $params = (array) (isset($config['cfg']) ? $config['cfg'] : array());

        if (empty($params)) {
            $object = new $classname();
        } else {
            $class = new ReflectionClass($classname);
            $object = $class->newInstanceArgs($params);
        }

        if (isset($config['priority'])) {
            $prio = $this->getMaskFromLevel($config['priority']);
            $object->addFilter(new Zend_Log_Filter_Priority($prio));
            if ($prio > $this->priority || !$this->priority) {
                $this->priority = $prio;
            }
        }

        return $object;
    }

    /**
     * Return a api_log mask for a string level.
     */
    protected function getMaskFromLevel($level) {
        $masks = array(
                'EMERG' => api_log::EMERG,
                'ALERT' => api_log::ALERT,
                'CRIT' => api_log::CRIT,
                'FATAL' => Zend_Log::CRIT,
                'ERR' => api_log::ERR,
                'ERROR' => Zend_Log::ERR,
                'WARN' => api_log::WARN,
                'NOTICE' => api_log::NOTICE,
                'INFO' => api_log::INFO,
                'DEBUG' => api_log::DEBUG);
        return $masks[strtoupper($level)];
    }

    protected function logMessage($params, $prio) {
        if (self::$logger === false) {
            return false;
        }
        $message = array_shift($params);
        if (!empty($params)) {
            $message = vsprintf($message, $params);
        }

        if (!is_int($prio)) {
            $prio = self::$defaultPriority;
        }

        return self::$logger->log($message, $prio);
    }
}
