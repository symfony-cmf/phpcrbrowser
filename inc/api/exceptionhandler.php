<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Handles exceptions based on settings in the configuration file.
 *
 * An example configuration as used at local.ch:
 *
 * \code
 * exceptionhandler:
 *     api_testing_exception: rethrow
 *     404: '404'
 *     NoCommandFound: '404'
 *     "*": local
 * \endcode
 *
 * @config <b>exceptionhandler</b> (hash): Associative array configuring
 *         the exception handler to be used on a per-exception basis.
 *         The key is the exception class name (or the class basename)
 *         and the value is the exception handler name.
 *         "api_exceptionhandler_" is prepended to the string to get a
 *         class name to load. A wildcard rule "*" can be specified as
 *         the default rule.
 */
class api_exceptionhandler {
    /** Wildcard exception. Used in the config file to specify the
        default exception. */
    const EXCEPTION_WILDCARD = "*";

    /** Default exception handler if no exception handler was configured
      * for an exception and the catch-all (wildcard) isn't configured
      * either. */
    const DEFAULT_HANDLER = 'default';

    /** Loaded api_exceptionhandler_base instances. */
    private static $instances = array();

    /**
     * Handle the exception with the appropriate handler as configured
     * in the configuration file.
     *
     * Gets an exception handler using api_exceptionhandler::getInstance()
     * and calles the handle method.
     *
     * @see api_exceptionhandler_base::handle()
     * @param $e Exception: The exception to process.
     * @param $context api_controller: The controller is needed by some
     *        exception handlers to handle XSLT output.
     */
    public static function handle(Exception $e, $context = null) {
        $handler = self::getInstance($e, $context);
        if ($handler instanceof api_exceptionhandler_base) {
            $handler->handle($e);
        }
    }

    /**
     * Log exceptions. This is called for non-fatal exceptions.
     *
     * Gets an exception handler using api_exceptionhandler::getInstance()
     * and calles the log method.
     *
     * @see api_exceptionhandler_base::log()
     * @param $e Exception: The exception to process.
     * @param $context api_controller: The controller is needed by some
     *        exception handlers to handle XSLT output.
     */
    public static function log(api_exception $e, $context = null) {
        $handler = self::getInstance($e, $context);
        if ($handler instanceof api_exceptionhandler_base) {
            $handler->log($e);
        }
    }

    /**
     * Returns the correct exception handler (subclass of
     * api_exceptionhandler_base) for the given class. Always returns the
     * same instance for the same exception class.
     *
     * @param $e Exception: The exception to get it's handler for
     * @param $context api_controller: The controller is needed by some
     *        exception handlers to handle XSLT output.
     * @return api_exceptionhandler_base instance
     */
    private static function getInstance(Exception $e, $context) {
        $class = get_class($e);
        if (!isset(self::$instances[$class])) {
            self::$instances[$class] = self::createInstance($class);
            if (self::$instances[$class] instanceof api_exceptionhandler_base) {
                self::$instances[$class]->setContext($context);
            }
        }

        return self::$instances[$class];
    }

    /**
     * Creates a new exception handler instances for the given class name.
     *
     * Will look up the following keys in that order in the configuration
     * and use the first exception handler for which a handler can be
     * instantiated. Uses api_exceptionhandler::getExceptionHandler().
     *    - $eClassname
     *    - basename of $eClassname (see api_helpers_class::getBaseName)
     *    - Wildcard (api_exceptionhandler::EXCEPTION_WILDCARD)
     *
     * If none of these three tests returns an exception handler then
     * the default handler as specified in api_exceptionhandler::DEFAULT_HANDLER
     * is loaded.
     *
     * @param $eClassName string: Class name of the exception to create the
     *        exception handler for.
     * @return api_exceptionhandler_base instance
     */
    private static function createInstance($eClassName) {
        $variations = array(
            $eClassName,
            api_helpers_class::getBaseName($eClassName),
            self::EXCEPTION_WILDCARD,
        );
        $cfg = api_config::getInstance()->exceptionhandler;
        if (is_array($cfg)) {
            foreach ($variations as $handler) {
                if (isset($cfg[$handler])) {
                    $handler = self::getExceptionHandlerClassName($cfg[$handler]);
                    return new $handler;
                }
            }
        }

        $handler = self::getExceptionHandlerClassName(self::DEFAULT_HANDLER);
        return new $handler;
    }

    /**
     * Prepends the string "api_exceptionhandler_" to the given key.
     * Used to construct the full class name from a configuration value.
     *
     * @param $name string: Exception class name
     * @return string
     */
    private static function getExceptionHandlerClassName($name) {
        return "api_exceptionhandler_" . $name;
    }
}
