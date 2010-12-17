<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Initializes the Okapi environment by setting up global constants
 * and include paths.
 *
 *
 */
class api_init {
    /** bool: True if Okapi has been initialized already. Used so that
      * api_init::start() can be called repeatedly without problems. */
    private static $initialized = false;

    /**
     * Sets up the Okapi environment.
     *
     * Defines a whole bunch of constants and sets the include path.
     * The include path contains the following components in this order:
     *    -# API_LOCAL_INCLUDE_DIR - API_LOCAL_VENDOR_DIR
     *    -# All directories in the "ext/" directory. If there are two
     *       directories inside that directory, both are added individually
     *       to the include path.
     *    -# All lib dirs in the exts
     *    -# API_INCLUDE_DIR - API_VENDOR_DIR
     *    -# existing include_path
     *
     * @define API_PROJECT_DIR
     *         Root directory of the project. The Okapi is expected to be in
     *         the inc/api directory of your project, so the project
     *         directory is assumed to be two levels up of the Okapi directory.
     * @define API_INCLUDE_DIR
     *         Include path where additional libraries are expected to be.
     *         Set to the "inc" directory inside API_PROJECT_DIR.
     * @define API_LIBS_DIR
     *         Okapi directory path.
     * @define API_LOCAL_INCLUDE_DIR
     *         Include path where the project's PHP code files are located.
     *         Points to the "localinc" directory inside API_PROJECT_DIR.
     * @define API_LOCAL_VENDOR_DIR
     *         Include path of the lib directory under localinc
     * @define API_VENDOR_DIR
     *         Include path of the lib directory under inc
     * @define API_THEMES_DIR
     *         Include path where the XSLT themes are located. Points to the
     *         "themes" directory inside API_PROJECT_DIR.
     * @define DEVEL
     *         True (1) if Okapi is in DEVEL mode. This may in the future
     *         define some special behaviours. For now this is unused.
     *         Defaults to 0. Set to 1 before calling api_init::start()
     *         if you want to use this.
     * @define API_HOST
     *         Absolute URL to the HTTP root of the current host.
     * @define API_WEBROOT
     *         Absolute URL to the root of the current application. This is
     *         equal to API_HOST with the mount path appended.
     * @define API_MOUNTPATH
     *         Mount path of the current application. This is equal to the
     *         "path" configuration value of the current host.
     * @define API_WEBROOT_STATIC
     *         Absolute URL to the root of the static files. Defaults to the
     *         "static/" directory inside API_WEBROOT but can be configured
     *         using <b>webpaths['static']</b>.
     * @define API_TEMP_DIR
     *         Directory for temporary files on the file system. Configured
     *         using the <b>tmpdir</b> configuration value.
     *
     * @config <b>webpaths['static']</b> (string): Absolute or relative URI to
     *         be used as API_WEBROOT_STATIC value. Used if the static files
     *         are located on another host than the applications.
     * @config <b>tmpdir</b> (string): Directory to store temporary files to.
     *         API_TEMP_DIR is set to this value.
     */
    public static function start() {
        if (self::$initialized) {
            return;
        }
        if (!defined('DEVEL')) {
            define('DEVEL',0);
        }

        define('API_NAMESPACE', "api");
        define('API_PROJECT_DIR', realpath(dirname(__FILE__) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR);
        define('API_INCLUDE_DIR', API_PROJECT_DIR."inc".DIRECTORY_SEPARATOR);
        define('API_LIBS_DIR', API_INCLUDE_DIR."api".DIRECTORY_SEPARATOR);
        define('API_LOCAL_INCLUDE_DIR', API_PROJECT_DIR.'localinc'.DIRECTORY_SEPARATOR);
        define('API_THEMES_DIR', API_PROJECT_DIR.'themes'.DIRECTORY_SEPARATOR);
        define('API_VENDOR_DIR', API_INCLUDE_DIR.'lib'.DIRECTORY_SEPARATOR);
        define('API_LOCAL_VENDOR_DIR', API_LOCAL_INCLUDE_DIR.'lib'.DIRECTORY_SEPARATOR);


        // Set PHP include path (localinc - localinc/lib - ext - ext/lib - inc - inc/lib - include_path)

        $incPath = API_INCLUDE_DIR;
        if (file_exists(API_VENDOR_DIR)){
            $incPath .= PATH_SEPARATOR . API_VENDOR_DIR;
        }
        $incPath .= PATH_SEPARATOR.ini_get("include_path");

        // Prepend extension directories to include path
        if (is_dir(API_PROJECT_DIR . 'ext/')) {
            $lib = "";
            $inc = "";
            foreach (glob(API_PROJECT_DIR . 'ext/*') as $dir) {
                $inc .= $dir . PATH_SEPARATOR;
                if (is_dir($dir."/lib")) {
                    $lib .= $dir."/lib" . PATH_SEPARATOR;
                }
            }
            if ($lib) {
                $incPath = $lib . $incPath;
            }
            if ($inc) {
                $incPath = $inc . $incPath;
            }
        }
        if (file_exists(API_LOCAL_VENDOR_DIR)) {
            $incPath = API_LOCAL_INCLUDE_DIR . PATH_SEPARATOR . API_LOCAL_VENDOR_DIR . PATH_SEPARATOR . $incPath;
        } else {
            $incPath = API_LOCAL_INCLUDE_DIR . PATH_SEPARATOR . $incPath;
        }

        ini_set("include_path", $incPath);

        // Autoloader which converts class name's underscores to slashes
        // on the file system.
        include_once API_LIBS_DIR."autoload.php";

        // Load config
        include_once API_LIBS_DIR."config.php";

        // Read config file
        $cfg = api_config::getInstance();

        // Construct URL for Web home (root of current host)
        $hostname = (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '');
        $hostinfo = self::getHostConfig($hostname);
        $schema = (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == '443') ? 'https' : 'http';
        $reqHostPath = '/';
        if ($hostname != '') {
            $reqHostPath = $schema.'://'.$hostname;
            if (is_null($hostinfo)) {
                $reqHostPath .= '/';
            } else {
                $reqHostPath .= $hostinfo['path'];
            }
        }
        define('API_HOST', $schema.'://' . $hostname . '/');
        define('API_WEBROOT', $reqHostPath);
        define('API_MOUNTPATH', $hostinfo['path']);

        // Define webrootStatic constant. From config file or computed
        // from webroot.
        if (isset($cfg->webpaths['static'])) {
            $static = $cfg->webpaths['static'];
            if (strpos($static, 'http://') === 0 || strpos($static, '/') === 0) {
                // Complete URI or Absolute URL
                define('API_WEBROOT_STATIC', $cfg->webpaths['static']);
            } else {
                // Relative URL
                define('API_WEBROOT_STATIC', API_WEBROOT . $cfg->webpaths['static']);
            }
        } else {
            define('API_WEBROOT_STATIC', API_WEBROOT.'static/');
        }

        // Create temporary directory
        $tmpDir = $cfg->tmpdir;
        if (! is_null($tmpDir)) {
            if (!is_dir($tmpDir)) {
                mkdir($tmpDir, 0777, true);
            }
            define('API_TEMP_DIR', $tmpDir);
        }

        // Enable libxml internal errors
        libxml_use_internal_errors(TRUE);

        // Load routing configuration
        require_once(API_PROJECT_DIR."conf/commandmap.php");

        self::$initialized = true;
    }

    /**
     * Use the given host name to find it's corresponding configuration
     * in the configuration file.
     *
     * If the host is not found in the configuration, null is returned.
     *
     * Returns an associative array with the following keys:
     * @retval host string: The host name to be used for lookups in the
     *         commandmap. This is one of the following values from the
     *         configuration in that order: `host', `sld', hash key.
     * @retval sld string: Subdomain as specified in the config using `sld'.
     * @retval tld string: Topdomain as specified in the config using `tld'.
     *         If tld is not specified but the sld is, then the tld is
     *         extracted from the hostname automatically.
     * @retval path string: Path as specified in the config. Can be used to
     *         "mount" the application at the specified point. Stored in
     *         the global constants API_MOUNTPATH.
     *
     * @config <b>hosts</b> (hash): Contains all host configurations. The
     *         hash keys specify the host name.
     * @config <b>host-><em>hostname</em>->host</b> (string):
     *         Overwrite the host name from the key.
     * @config <b>host-><em>hostname</em>->sld</b> (string):
     *         Specify a sublevel domain for this host. This value can be
     *         accessed using api_request::getSld().
     * @config <b>host-><em>hostname</em>->tld</b> (string):
     *         Specify a top-level domain for this host. This value can be
     *         accessed using api_request::getTld(). If sld is specified but
     *         the value isn't, then the tld is computed automatically.
     * @config <b>host-><em>hostname</em>->path</b> (string):
     *         Path where this application is mounted on. This has
     *         implications for the routing engine (see api_routing). Defaults
     *         to "/".
     * @param $hostname: Host name to return config for.
     */
    public static function getHostConfig($hostname) {
        $hosts = array();
        $host = null;

        // Read config
        $cfg = api_config::getInstance();
        if ($cfg->hosts) {
            $hosts = $cfg->hosts;
            foreach($hosts as $key => &$hostconfig) {
                $lookupName = $key;
                if (isset($hostconfig['host'])) {
                    $lookupName = $hostconfig['host'];
                } else if (isset($hostconfig['sld'])) {
                    $lookupName = $hostconfig['sld'];
                }
                $hostconfig['host'] = $lookupName;

                if ($key == $hostname) {
                    $host = $hostconfig;
                    break;
                } else if (api_helpers_string::matchWildcard($key, $hostname)) {
                    $host = $hostconfig;
                    if ($lookupName == $key) {
                        // Replace host with current hostname
                        $host['host'] = $hostname;
                    }
                    break;
                }
            }
        }

        // Host not found
        if (is_null($host)) {
            return null;
        }

        // Calculate tld from hostname if sld is set.
        if (isset($host['sld']) && !isset($host['tld'])) {
            if (strpos($hostname, $host['sld'] . '.') === 0) {
                // Hostname starts with sld
                $host['tld'] = substr($hostname, strlen($host['sld'])+1);
            }
        }

        // Return values
        $path = (!empty($host['path'])) ? $host['path'] : '/';
        if ($path[0] !== '/') {
            $path = '/' . $path;
        }

        return array('host' => $host['host'],
                     'tld'  => @$host['tld'],
                     'sld'  => @$host['sld'],
                     'path' => $path);
    }
}
