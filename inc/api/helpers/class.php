<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Static helper methods for class name handling.
 */
class api_helpers_class {
    /**
     * Returns the base name of a class. The base name is the element
     * after the last underline.
     *
     * @param $class string|object: Name of the class to get the
     *               base name from or an object.
     * @return string: Base name
     */
    public static function getBaseName($class) {
        if (! is_string($class)) {
            $class = get_class($class);
        }

        $arr = explode("_", $class);
        return array_pop($arr);
    }
}
