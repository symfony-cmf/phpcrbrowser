<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Base class for exception handlers.
 */
abstract class api_exceptionhandler_base {
    /** Base directory for all exception handler XSLT files. */
    const VIEWDIR = 'exceptionhandler';

    /** api_controller: Controller. Used to paint the exception using XSLT. */
    protected $context = null;

    /**
     * Process the exception.
     * @param $e Exception: The exception to handle.
     */
    abstract public function handle(Exception $e);

    /**
     * Sets the controller which is used for paint the exception.
     * @param $context api_controller
     */
    public function setContext($context) {
        $this->context = $context;
    }

    /**
     * Extracts source lines from the given files. This is used to extract
     * some context of the exception.
     *
     * @param $file string: Full path to the file to get source lines.
     * @param $start int: Line number of the first line to return.
     * @param $end int: Line number of the last line to return.
     * @return array: Requested lines of the file.
     */
    public function getSourceFromFile($file, $start, $end) {
        if (file_exists($file)) {
            $lines = file($file);
            $source = array_slice($lines, $start, ($end - $start), true);
            if (is_array($source)) {
                return $source;
            }
        }
        return array();
    }

    /**
     * Dumps the exception to the browser. Used if the context can't be
     * used to draw the exception.
     * @param $e Exception: The exception to dump.
     */
    public function dump(Exception $e) {
        print "<div class='exception'>";
        print "<h1>Exception: " . api_helpers_class::getBaseName($e) . "</h1>";
        print "<p>Message: ".$e->getMessage()."</p>";
        print "<p>File: ".$e->getFile()." (".$e->getLine().")</p>";
        if(!empty($e->userInfo)) {
            print "<p>User Info: ".$e->userInfo."</p>";
        }
        print "<h3>Trace:</h3><ul>";
        foreach($e->getTrace() as $trace) {

            print "<li>".(isset($trace['class']) ? $trace['class'] : '') . "::".$trace['function'];
            print "<br/>".$trace['file']." (".$trace['line'].")</li>";
        }

        print "</ul></div>";
    }

    /**
     * Log the exception. This is called for all non-fatal exceptions.
     * @param $e Exception: The exception to log.
     */
    public function log(Exception $e) {
        error_log("Extension encountered: " . (string) $e);
    }

    /**
     * Returns the relative path to the XSLT file for this exception
     * handler. Passed on to api_controller::setXsl().
     * @return string: XSLT file name.
     */
    public function getXsl() {
        $xslName = api_helpers_class::getBaseName($this);
        return self::VIEWDIR . DIRECTORY_SEPARATOR . $xslName.'.xsl';
    }

    /**
     * Uses the context to display the data collect for the current
     * exception. Uses the XSLT file as returned by
     * api_exceptionhandler_base::getXsl().
     * @param $data array: Hash with some data to pass on to the XSLT.
     */
    public function dispatch($data) {
        try {
            $this->context->setXsl($this->getXsl());
            $this->context->prepare();
            $this->context->dispatch($data);
        } catch (Exception $e) {
            $this->dump($e);
        }
    }
}