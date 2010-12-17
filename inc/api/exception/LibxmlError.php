<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Base exception for any libxml errors.
 */
class api_exception_LibxmlError extends api_exception {
    /**
     * Constructor.
     *
     * @param $severity int: Indicates whether the exception is fatal or not.
     *        Use api_exception::THROW_NONE or api_exception::THROW_FATAL.
     * @param $filename string: Name of the file that caused the exception.
     */
    public function __construct($severity, $filename) {
        parent::__construct($severity);

        $this->message = "Libxml error in {$filename}";
        $this->userInfo = "";

        $errors = libxml_get_errors();
        $errorHash = array();

        if ($errors) {
            foreach ($errors as $error) {
                $this->userInfo .= $error->message;
                if ($error->file) {
                    $this->userInfo .= " in file ".$error->file ." line:".$error->line ;
                }
                $this->userInfo .= "<br/>";

                array_push($errorHash, array(
                    'level' => $error->level,
                    'code' => $error->column,
                    'message' => $error->message,
                    'file' => $error->file,
                    'line' => $error->line,
                ));
            }
        }
        libxml_clear_errors();

        $this->setParam('xmlerrors', $errorHash);
    }
}
