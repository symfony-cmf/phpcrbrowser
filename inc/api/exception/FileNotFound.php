<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Exception thrown when a file on the file system wasn't found.
 */
class api_exception_FileNotFound extends api_exception {
    /**
     * Constructor.
     *
     * @param $severity int: Indicates whether the exception is fatal or not.
     *        Use api_exception::THROW_NONE or api_exception::THROW_FATAL.
     * @param $filename string: Name of the file that couldn't be found.
     *        Put into the message string.
     */
    public function __construct($severity = self::THROW_NONE, $filename = '') {
        parent::__construct($severity);
        $this->message = "File not found: {$filename}";
    }
}
