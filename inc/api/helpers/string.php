<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Static helper methods for string processing.
 */
class api_helpers_string {
    /**
     * Escape string for using in JS values (apostrophe and newlines are
     * escaped)
     * @param $str string: String to escape.
     * @return string: Escaped value.
     */
    static function escapeJSValue($str) {
        return str_replace(
                array("'", "\n", "\r"),
                array("\\'", "\\n", "\\r"),
                $str);
    }

    /**
     * Remove control characters and convert all whitespace chars to
     * spaces. Also converts the string to UTF8.
     * Works recursively on arrays.
     * @param $str mixed: String or array to process.
     * @return mixed: Converted input value.
     */
    static function clearControlChars($str) {
        if (is_array($str)) {
            foreach($str as $key => $value) {
                $str[$key] = self::clearControlChars($value);
            }
        } else {
            $str = self::ensureUtf8($str);
            $str = str_replace(array("\t", "\n", "\r", NULL, "\x00"), " ", $str);
            $str = preg_replace('/\p{Cc}/u', '', $str);
        }
        return $str;
    }

    /**
     * Checks if the given string is UTF-8.
     * @param $str string: String to check.
     * @return bool: True if the string is encoded with UTF-8.
     * @see http://w3.org/International/questions/qa-forms-utf-8.html
     */
    public static function isUtf8($str) {
        return preg_match('%^(?:
              [\x09\x0A\x0D\x20-\x7E]            # ASCII
            | [\xC2-\xDF][\x80-\xBF]             # non-overlong 2-byte
            |  \xE0[\xA0-\xBF][\x80-\xBF]        # excluding overlongs
            | [\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}  # straight 3-byte
            |  \xED[\x80-\x9F][\x80-\xBF]        # excluding surrogates
            |  \xF0[\x90-\xBF][\x80-\xBF]{2}     # planes 1-3
            | [\xF1-\xF3][\x80-\xBF]{3}          # planes 4-15
            |  \xF4[\x80-\x8F][\x80-\xBF]{2}     # plane 16
            )*$%xs', $str);
    }

    /**
     * Takes a string which may be UTF-8 or ISO-8859-1/15 and returns the
     * UTF-8 encoded version.
     * @param $str string: String to convert.
     * @return string: Converted input string.
     */
    static function ensureUtf8($str) {
        if (self::isUtf8($str)) {
            return $str;
        } else {
            $str = iconv("ISO-8859-1", "UTF-8//ignore", $str);
            $str = preg_replace('/\p{Cc}/u', '', $str);
            return $str;
        }
    }

    /**
     * Remove all characters from the string except letters, decimal
     * digits, underlines and dashes.
     * @param $str string: String to clean.
     * @return string: Cleaned input string.
     */
    static function clean($str) {
        return preg_replace("/[^\w^\d^_^-]*/", "", $str);
    }

    /**
     * Replace double-slashes with one slash.
     * @param $str string: String to convert.
     * @return string: Converted string.
     */
    static function removeDoubleSlashes($str) {
        return preg_replace('#/{2,}#', '/', $str);
    }

    /**
     * Compares a wildcard string with an input string and returns returns
     * true if they match.
     *
     * @param $pattern string: Pattern to match against. May contain *
     *        wildcards.
     * @param $input string: Input to compare against the pattern.
     */
    public static function matchWildcard($pattern, $input) {
        if (strpos($pattern, '*') !== false) {
            // Wildcard match
            $pattern = str_replace('\\*', '.*', preg_quote($pattern));
            return (preg_match('/' . $pattern . '/', $input) > 0);
        } else {
            return ($pattern == $input);
        }
    }
}
