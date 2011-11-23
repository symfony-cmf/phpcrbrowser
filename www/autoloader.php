<?php
/**
 * Simple local autoloader for jackalope libs, since the one in Jackalope depends on Symfony's UniversalClassLoader
 * component, and PHPCRBrowser isn't.
 *
 * @author Gerard van Helden <drm@melp.nl>
 */

$autoloadMappings = array(
    'Jackalope'     => __DIR__ . '/../ext/jackalope/src/',
    'PHPCR\Util'    => __DIR__ . '/../ext/jackalope/lib/phpcr-utils/src',
    'PHPCR'         => __DIR__ . '/../ext/jackalope/lib/phpcr/src/'
);

spl_autoload_register(function($cn) use ($autoloadMappings) {
    $strippedCn = trim($cn, '\\');
    foreach($autoloadMappings as $prefix => $path) {
        if (substr($strippedCn, 0, strlen($prefix)) == $prefix ) {
            $fn = $path . str_replace('\\', '//', $strippedCn) . '.php';
            if(is_file($fn)) {
                require_once $fn;
                return true;
            }
        }
    }
    return false;
});