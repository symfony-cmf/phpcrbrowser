<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Base Okapi exception. Adds severity to the default PHP exceptions.
 *
 * See api_controller::catchException() for the difference of fatal and
 * non-fatal exceptions.
 */
class api_exception extends Exception {
    /** Severity which marks a non-fatal exception. */
    const THROW_NONE    = 0;
    /** Severity which marks a fatal exception. */
    const THROW_FATAL   = 1;

    /** Parameters which are added to the exception summary. */
    protected $params   = array();

    /**
     * Constructor.
     *
     * @param $severity int: Indicates whether the exception is fatal or not.
     *        Use api_exception::THROW_NONE or api_exception::THROW_FATAL.
     * @param $params array: Parameters giving details about the exception.
     * @param $code int: Exception code.
     * @param $message string: Human-readable information about the exception.
     */
    public function __construct($severity=self::THROW_FATAL, $params=array(), $code=0, $message='') {
        parent::__construct($message, $code);
        $this->severity  = $severity;
        $this->params    = $params;
    }

    /**
     * Sets a different human-readable message for this exception.
     * @param $message string: Human-readable information about the exception.
     */
    public function setMessage($message) {
        $this->message = $message;
    }

    /**
     * Get the base name of this exception.
     * @return string: Base name
     */
    public function getName() {
        return api_helpers_class::getBaseName($this);;
    }

    /**
     * Sets a different exception code.
     * @param $code int: Exception code.
     */
    public function setCode($code) {
        $this->code = $code;
    }

    /**
     * Gets the severity.
     * @return int: Severity. api_exception::THROW_NONE or api_exception::THROW_FATAL
     */
    public function getSeverity() {
        return $this->severity;
    }

    /**
     * Sets a different severity.
     * @param $severity int: Indicates whether the exception is fatal or not.
     *        Use api_exception::THROW_NONE or api_exception::THROW_FATAL.
     */
    public function setSeverity($severity) {
        $this->severity = $severity;
    }

    /**
     * Returns all params currently set.
     * @return array: Parameters with details about the exception.
     */
    public function getParams() {
        return $this->params;
    }

    /**
     * Sets a new param array.
     * @param $params array: Parameters giving details about the exception.
     */
    public function setParams($params) {
        $this->params = $params;
    }

    /**
     * Sets one param.
     * @param $name string: Key of the param to set.
     * @param $value string: Value of the param to set.
     */
    public function setParam($name, $value) {
        $this->params[$name] = $value;
    }

    /**
     * Gets the exception summary which is a hash containing all the
     * relevant keys.
     *
     * The returned hash contains the keys code, message, severity and
     * all the keys from the params array.
     *
     * @return array
     */
    public function getSummary() {
        $summary = array(
            'code'      => $this->getCode(),
            'message'   => $this->getMessage(),
            'severity'  => $this->getSeverity()
        );
        return array_merge($summary, $this->params);
    }
}
