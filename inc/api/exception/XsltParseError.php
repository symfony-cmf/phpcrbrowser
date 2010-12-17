<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Exception when an XSLT file could not be parsed.
 */
class api_exception_XsltParseError extends api_exception_LibxmlError {
    /**
     * Constructor.
     *
     * @param $severity int: Indicates whether the exception is fatal or not.
     *        Use api_exception::THROW_NONE or api_exception::THROW_FATAL.
     * @param $filename string: Name of the file that caused the exception.
     */
    public function __construct($severity, $filename, $xslterrors = null) {
        parent::__construct($severity, $filename);
        $this->message = "XSLT error in {$filename}";

        if (isset($xslterrors)) {
            foreach ($xslterrors as $error) {
                $this->message .= "\n".$error->message;
            }
        }
    }
}
