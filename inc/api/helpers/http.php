<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Static helper methods for HTTP handling.
 */
class api_helpers_http {
    /**
     * Redirects the user to another location. The location can be
     * relative or absolute, but this methods always converts it into
     * an absolute location before sending it to the client.
     *
     * @param $to string: Location to redirect to.
     * @param $status int: HTTP status code to set. Use one of the following: 301, 302, 303.
     * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.3.2 HTTP status codes
     */
    public static function redirectTo($to, $status=301) {
        error_log("api_helpers_http::redirectTo is deprecated. Use api_response->redirect() instead.");

        if (headers_sent()) return false;

        if (strtolower(substr($to, 0, 7)) == 'http://') {
            $url = $to;
        } else {
            $schema = $_SERVER['SERVER_PORT'] == '443' ? 'https' : 'http';
            $host = (isset($_SERVER['HTTP_HOST']) && strlen($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
            $to = strpos($to,'/')===0 ? $to : '/'.$to;
            $url = "$schema://$host$to";
        }

        switch($status) {
            case 303:
                $statusString = 'HTTP/1.1 303 See Other';
                break;
            case 302:
                $statusString = 'HTTP/1.1 302 Found';
                break;
            default:
                $statusString = 'HTTP/1.1 301 Moved Permanently';
                break;
        }
        header($statusString);
        header("Location: $url");
        exit();
    }
}
