<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Exception thrown by api_controller if a command access is not allowed
 * for the current request.
 */
class api_exception_CommandNotAllowed extends api_exception {
    /**
     * Constructor.
     *
     * @param $msg string: User message.
     */
    public function __construct($msg = 'Command Access Not Allowed!') {
        parent::__construct();
        $this->setMessage($msg);
        $this->setSeverity(api_exception::THROW_FATAL);
    }
}
