<?php
/**
 * Exception used by the testing framework to test redirection.
 * 
 * When you set exception handler configuration this exception
 * should be rethrown.
 *
 * Example:
 * \code
 * exceptionhandler:
 *     api_testing_exception: rethrow
 * \endcode
 */
class api_testing_exception extends api_exception {
    /**
     * Constructor.
     *
     * @param $message string: Human-readable information about the exception.
     * @param $code int: Exception code.
     */
    public function __construct($message, $code = 0) {
        parent::__construct(api_exception::THROW_FATAL, array(), $code, $message);
    }
}
