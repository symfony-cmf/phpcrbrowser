<?php
/**
 * @file autoload.php
 * Defines an autoloader function.
 * @see http://www.php.net/autoload
 */

/**
 * Autoloader. When a class is instantiated the autoloader replaces each
 * underline in a classname with a slash and loads the corresponding file
 * from the file system.
 * @param $class string: Name of class to load.
 */
function autoload($class) {
    $incFile = str_replace("_", DIRECTORY_SEPARATOR, $class).".php";
    /* 
    * Well, we could prevent a fatal error with checking if the file exists..
    * This would result in a nice fatal error exception page.. do we want this?
    */
    
    /*  TODO: Look into that:
    <lsmith> chregu: jo .. Wez meinte das kann zu race conditions, locking problemen etc fuehren
    <lsmith> ZF hat das frueher auch so gemacht
    <lsmith> ich glaube jetzt iterieren sie ueber den include path
    */
    
    if (@fopen($incFile, "r", TRUE)) {
        include($incFile);
        
        return $incFile;
    }
    
    return FALSE;
    
}

spl_autoload_register('autoload');
