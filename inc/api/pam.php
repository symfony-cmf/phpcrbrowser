<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Gateway class to the PAM authentication and permissions functions.
 *
 * Example of a config.yml entry:
 *
 * \code
 * pam:
 *     auth:
 *         class: pearwrapper
 *         options:
 *             container: Array
 *             users:
 *                 local: search4me
 *     perm:
 *         # "everything" is a permission class which always redirects
 *         # to the login page unless the user has a valid session.
 *         # Attention: this class is not part of Okapi but serves as an
 *         # example for the configuration.
 *         class: everything
 *         options:
 *             loginurl: /login/
 * \endcode
 *
 * @config <b>pam</b> (hash): Contains configuration for authentication
 *         and permission.
 * @config <b>pam->auth</b> (hash): Configuration for the authentication.
 * @config <b>pam->auth->class</b> (string): Class to use for
 *         authentication. "api_pam_auth_" is prepended to the string
 *         to get a class name to load.
 * @config <b>pam->auth->options</b> (hash): Options for the authentication
 *         object. This has is passed as argument to the constructor of the
 *         authentication object.
 * @config <b>pam->perm</b> (hash): Configuration for the permission.
 * @config <b>pam->perm->class</b> (string): Class to use for
 *         permission. "api_pam_perm_" is prepended to the string
 *         to get a class name to load.
 * @config <b>pam->perm->options</b> (hash): Options for the permission
 *         object. This has is passed as argument to the constructor of
 *         the permission object.
 *
 * @author   Silvan Zurbruegg
 */
class api_pam {
    /** api_pam: Instance returned by getInstance() */
    private static $instance = null;

    /** string constant: Prefix for all class names in this package. */
    private $clsNameBase = 'api_pam';

    /** string constant: Prefix for the permission classes in this package. */
    private $permprefix = 'perm';

    /** string constant: Prefix for the authentication classes in this package. */
    private $authprefix = 'auth';

    /** array: Configuration of the authentication part. */
    private $authConf = array();

    /** array: Configuration of the permission part. */
    private $permConf = array();

    /** string constant: Key for default settings. */
    private $confDefaultName = 'default';

    /** string: Authentication scheme in use. */
    private $authScheme = '';

    /** string: Permission scheme in use. */
    private $permScheme = '';

    /**
     * Constructor. Loads the PAM configuration.
     */
    private function __construct() {
        $pamConf = api_config::getInstance()->pam;
        $this->pamLoadConfig($pamConf);
    }

    /**
     * Return an instance of this class.
     * @return api_pam: Instance.
     */
    public static function getInstance() {
        if (!self::$instance instanceof api_pam) {
            self::$instance = new api_pam();
        }
        return self::$instance;
    }

    /**
     * Login in with the given username and password. Calls the login
     * method on the authentication object. The authentication object
     * is responsible for handling the session state.
     *
     * @param $user string: User name
     * @param $pass string: Password
     * @return bool: Return value of the authentication login method
     * @see api_pam_Iauth::login()
     */
    public function login($user, $pass) {
        if (($ao = $this->getAuthObj()) !== false) {
            return $ao->login($user, $pass);
        }
        return false;
    }

    /**
     * Log out the current user. Calls the logout method of the
     * authentication object.
     * @return bool: Return value of the authentication logout method
     * @see api_pam_Iauth::logout()
     */
    public function logout() {
        if (($ao = $this->getAuthObj()) !== false) {
            return $ao->logout();
        }
        return false;
    }

    /**
     * Check if the user is currently logged in. Calls the checkAuth
     * method of the authentication object.
     * @return bool: True if the user is logged in.
     * @see api_pam_Iauth::checkAuth()
     */
    public function checkAuth() {
        if (($ao = $this->getAuthObj()) !== false) {
            return $ao->checkAuth();
        }
        return false;
    }

    /**
     * Gets the ID of the currently logged in user. Calls the getUserId()
     * method of the authentication object.
     * @return mixed: User ID. Variable type depends on authentication
     *         class.
     * @see api_pam_Iauth::getUserId()
     */
    public function getUserId() {
        if (($ao = $this->getAuthObj()) !== false) {
            return $ao->getUserId();
        }
        return 0;
    }

    /**
     * Gets the user name of the currently logged in user. Calls the
     * getUserName() method of the authentication object.
     * @return string: User name
     * @see api_pam_Iauth::getUserName()
     */
    public function getUserName() {
        if (($ao = $this->getAuthObj()) !== false) {
            return $ao->getUserName();
        }
        return "";
    }

    /**
     * Gets the additional meta information about the currently logged in
     * user. Calls the getAuthData() method of the authentication object.
     * @return hash: Information key/value pair
     * @see api_pam_Iauth::getAuthData()
     */
    public function getAuthData() {
        if (($ao = $this->getAuthObj()) !== false) {
            return $ao->getAuthData();
        }
        return "";
    }

    /**
     * Checks if the logged in user has access to the given object.
     * Calls isAllowed() of the permission object.
     * @param $acObject string: Access control object. An arbitrary value
     *        can be passed in, which the permission class uses to determine
     *        if the user has access or not.
     * @param $acValue string: Access control value. Used in the same way as
     *        the $acObject param.
     * @return bool: True if the user is allowed to access the object or no
     *        perm container has been defined in the configuration
     * @see api_pam_Iperm::isAllowed()
     */
    public function isAllowed($acObject, $acValue) {
        if (($po = $this->getPermObj()) !== false) {
            $uid = $this->getUserId();
            return $po->isAllowed($uid, $acObject, $acValue);
        }
        return true;
    }

    /**
     * Set an authentication scheme to use. This makes it possible to
     * run more than one different ways of authentication inside the
     * same application.
     *
     * To specify more than the default authentication scheme in the
     * configuration, use an array:
     *
     * \code
     * pam:
     *     auth:
     *         -
     *             name: default
     *             class: lclpearwrapper
     *             # ......
     *         -
     *             name: other
     *             class: lclpearwrapper
     *             # ......
     * \endcode
     *
     * This defines two schemes "default" and "other". To use
     * the other scheme, set it like this:
     *
     * \code
     * $pam = api_pam::getInstance();
     * $pam->setAuthScheme('other');
     * \endcode
     *
     * @param $schemeName string: Name of the scheme to use.
     * @return bool: True if the given scheme exists.
     */
    public function setAuthScheme($schemeName) {
        if (isset($this->authConf[$schemeName]) || $schemeName == $this->confDefaultName) {
            $this->authScheme = $schemeName;
            return true;
        }

        return false;
    }

    /**
     * Returns the name of the currently active authentication
     * scheme. See api_pam::setAuthScheme() for details about
     * schemes.
     * @return string: Current authentication scheme.
     */
    public function getAuthScheme() {
        return (empty($this->authScheme)) ? $this->confDefaultName : $this->authScheme;
    }

    /**
     * Set a permission scheme to use. This works exactly the same way
     * as authentication schemes, documented under api_pam::setAuthScheme().
     * @param $schemeName string: Name of the scheme to use.
     * @return bool: True if the given scheme exists.
     */
    public function setPermScheme($schemeName) {
        if (isset($this->permConf[$schemeName]) || $schemeName == $this->permConfDefault) {
            $this->permScheme = $schemeName;
            return true;
        }

        return false;
    }

    /**
     * Returns the name of the currently active permission
     * scheme. See api_pam::setAuthScheme() for details about
     * schemes.
     * @return string: Current permission scheme.
     */
    public function getPermScheme() {
        return (empty($this->permScheme)) ? $this->confDefaultName : $this->permScheme;
    }

    /**
     * Returns the current permission object.
     * @return api_pam_Iperm: Permission object.
     */
    private function getPermObj() {
        return $this->pamGetObject($this->permprefix, $this->getPermScheme());
    }

    /**
     * Returns the current authentication object.
     * @return api_pam_Iauth: Authentication object.
     */
    private function getAuthObj() {
        return $this->pamGetObject($this->authprefix, $this->getAuthScheme());
    }

    /**
     * Returns a authentication or permission object. Re-uses existing
     * objects if possible.
     * @param $prefix string: Object type to return - "auth" or "perm"
     * @param $scheme string: Configuration scheme to use
     * @return object: Authentication or permission object.
     */
    private function pamGetObject($prefix, $scheme) {
        $objArr = $prefix."Obj";
        $cfgArr = $prefix."Conf";

        $instBase = $this->clsNameBase."_".$prefix;

        if (isset($this->{$objArr}[$scheme]) && ($this->{$objArr}[$scheme] instanceof $instBase)) {
            return $this->{$objArr}[$scheme];
        } else if (isset($this->{$cfgArr}[$scheme])) {
            return $this->pamLoadObject($prefix, $this->{$cfgArr}[$scheme]);
        }
        return false;
    }

    /**
     * Creates a new authentication or permission object.
     * @param $prefix string: Object type to return - "auth" or "perm"
     * @param $cfg hash: Configuration values. The 'class' value is used
     *        to determine the actual class to use for creating the object.
     */
    private function pamLoadObject($prefix, $cfg) {
        $className = $this->clsNameBase . "_" . $prefix . "_" . $cfg['class'];
        if (! class_exists($className)) {
            return false;
        }

        $opts = isset($cfg['options']) ? $cfg['options'] : array();
        $obj = new $className($opts);
        if ($obj instanceof $className) {
            return $obj;
        }
        return false;
    }

    /**
     * Loads the configuration from the configuration file.
     * @param $pamConf hash: PAM configuration from api_config
     */
    private function pamLoadConfig($pamConf) {
        if (isset($pamConf['auth'])) {
            $this->authConf = $this->pamLoadComponentConfig($pamConf['auth']);
        }

        if (isset($pamConf['perm'])) {
            $this->permConf = $this->pamLoadComponentConfig($pamConf['perm']);
        }
    }

    /**
     * Loads the configuration for an individual component (authentication
     * or permission) from the configuration file. Splits the configuration
     * into the configured schemes.
     * @param $compArr hash: Component configuration from the configuration
     * @return hash: Component configurations, scheme names are the keys.
     */
    private function pamLoadComponentConfig($compArr) {
        $cfg = array();


        if (isset($compArr[0]) && is_array($compArr[0])) {
            foreach($compArr as $conf) {
                $confName = (isset($conf['name'])) ? $conf['name'] : $this->confDefaultName;
                $cfg[$confName] = $conf;
            }
        } else {
            $confName = (isset($compArr['name'])) ? $compArr['name'] : $this->confDefaultName;
            $cfg[$confName] = $compArr;
        }


        return $cfg;
    }
}
