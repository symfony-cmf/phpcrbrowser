<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Implements a PAM authentication class using the PEAR Auth
 * classes.
 * @see http://pear.php.net/package/Auth
 */
class api_pam_auth_pearwrapper extends api_pam_common implements api_pam_Iauth {
    /** Instance of PEAR Auth. */
    private $pAuth = null;

    /** Field to treat as ID field from the auth data hash. */
    private $pIdField = 'id';

    /**
     * Constructor.
     */
    public function __construct($opts) {
        parent::__construct($opts);
        $this->pAuth = $this->getPearAuth();
        $this->setPearDefaults();
    }

    public function login($username, $passwd) {
        if ($this->pAuth) {
            $this->pAuth->username = $username;
            $this->pAuth->password = $passwd;
            $this->pAuth->login();
            return $this->checkAuth();
        }
        return false;
    }

    public function logout() {
        if ($this->pAuth) {
            return $this->pAuth->logout();
        }
        return false;
    }

    public function checkAuth() {
        if ($this->pAuth) {
            return $this->pAuth->checkAuth();
        }
        return false;
    }

    public function getUserName() {
        if ($this->pAuth) {
            return $this->pAuth->getUsername();
        }
        return null;
    }

    /**
     * Returns the user's ID. Not all containers support this. For
     * containers that have no ID, the user name is returned instead.
     */
    public function getUserId() {
        $authData = $this->getAuthData();

        if (isset($authData[$this->pIdField])) {
            return $authData[$this->pIdField];
        } else {
            return $this->getUserName();
        }
    }

    public function getAuthData() {
        if ($this->pAuth) {
            return $this->pAuth->getAuthData();
        }
        return array();
    }

    /**
     * Sets default PEAR Auth configuration. Currently calls
     * setShowLogin(false).
     */
    private function setPearDefaults() {
        if ($this->pAuth) {
            $this->pAuth->setShowLogin(false);
        }
    }

    /**
     * Returns a new PEAR Auth object. Uses the configured container,
     * defaults to the MDB2 container.
     * @return Auth: Auth object.
     */
    private function getPearAuth() {
        $container = $this->getOpt('container', 'MDB2');
        $a = new Auth($container, $this->opts);
        if ($a instanceof Auth) {
            return $a;
        }
        return false;
    }
}
