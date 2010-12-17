<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Default exception handler. Includes a very detailled backtrace in the
 * collected data including source file information.
 */
class api_exceptionhandler_default extends api_exceptionhandler_base {
    /** Number of code lines included before and after the relevant code line
      * in the back trace.
      */
    const BACKTRACE_CONTEXT = 8;

    /**
     * Calls getTrace and does api_exceptionhandler_base::dispatch()
     * with the collected data.
     * @param $e Exception: The exception to handle.
     */
    public function handle(Exception $e) {
        $this->data['exception'] = $this->getTrace($e);;
        $this->dispatch($this->data);
        return true;
    }

    /**
     * Process the exception. Calls the Exception::getTrace() method to
     * get the backtrace. Gets the relevant lines of code for each step
     * in the backtrace.
     */
    public function getTrace($e) {
        $trace = $e->getTrace();
        foreach($trace as $i => &$entry) {
            if (isset($entry['class'])) {
                try {
                    $refl = new ReflectionMethod($entry['class'], $entry['function']);
                    if (isset($trace[$i -1])) {
                        $entry['caller'] = (int) $trace[$i -1]['line'] -1;
                    } else if ($i === 0) {
                        $entry['caller'] = (int) $e->getLine() -1;
                    }

                    $start = $entry['caller'] - self::BACKTRACE_CONTEXT;
                    if ($start < $refl->getStartLine()) { $start = $refl->getStartLine() - 1; }
                    $end = $entry['caller'] + self::BACKTRACE_CONTEXT;
                    if ($end > $refl->getEndLine()) { $end = $refl->getEndLine(); }
                    $entry['source'] = $this->getSourceFromFile($refl->getFileName(), $start, $end);
                } catch (Exception $e) {
                    $entry['caller'] = null;
                    $entry['source'] = '';
                }
            }

            if (isset($entry['args'])) {
                // Duplicate so we don't overwrite by-reference variables
                $args = array();
                foreach($entry['args'] as $i => $arg) {
                    $args[$i] = gettype($arg);
                }
                $entry['args'] = $args;
            }
        }

        $exceptionParams = array();
        if (method_exists($e, 'getParams')) {
            $exceptionParams = $e->getParams();
        }

        $d = array('backtrace'  => $trace,
                   'message'    => $e->getMessage(),
                   'code'       => $e->getCode(),
                   'file'       => $e->getFile(),
                   'line'       => $e->getLine(),
                   'name'       => api_helpers_class::getBaseName($e),
                   'params'     => $exceptionParams,
                   );

        if(!empty($e->userInfo)) {
            $d['userInfo'] = $e->userInfo;
        }
        return $d;
    }
}
