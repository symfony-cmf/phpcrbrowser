<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Base class for PAM components.
 */
class api_pam_common {
    /** Component configuration, passed in through the constructor. */
    protected $opts = array();

    /**
     * Constructor. Sets the configuration for the component.
     * @param $opts hash: Options for the component.
     */
    public function __construct($opts) {
        $this->opts = $opts;
    }

    /**
     * Returns the value for a component configuration key.
     * @param $name string: Configuration key
     * @param $default mixed: Default value if the configuration
     *        key does not exist.
     * @return mixed: Configuration value.
     */
    protected function getOpt($name, $default=null) {
        if (isset($this->opts[$name]) && !empty($this->opts[$name])) {
            return $this->opts[$name];
        }
        return $default;
    }
}
