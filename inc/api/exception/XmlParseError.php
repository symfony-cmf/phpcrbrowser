<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Exception when an XML file could not be parsed.
 */
class api_exception_XmlParseError extends api_exception_LibxmlError {
    public function __construct($severity, $filename) {
        parent::__construct($severity, $filename);
        $this->message = "XML parse error in {$filename}";
    }
}
