<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

require_once('Zend/Auth.php');

/**
 * Implements a PAM authentication class using the Zend Auth
 * classes.
 * @see http://framework.zend.com/manual/zend.auth.html
 */
class api_pam_auth_zend extends api_pam_common  implements api_pam_Iauth {
    /** Zend_Auth instance which is proxied through this class. */
    protected static $zaAuth = null;

    /** Zend_Auth_Adapter: Active adapter which handles the user lookups. */
    private static $zaAdapter;

    /**
     * Constructor.
     */
    public function __construct($opts) {
        parent::__construct($opts);
        self::$zaAuth = Zend_Auth::getInstance();
        self::$zaAuth->setStorage(new Zend_Auth_Storage_Session('Okapi_Auth'));
    }

    /**
     * Check if the user is currently logged in.
     * @return boolean true if authenticated successfuly
     * @see Zend_Auth_Result
     */
    public  function checkAuth() {
        if (self::$zaAuth->hasIdentity()) {
            return true;
        } else if (isset(self::$zaAdapter)) {
            $zaResult = self::$zaAuth->authenticate(self::$zaAdapter);
            $msg = $zaResult->getMessages();
            if($zaResult->getCode() !== 1){
                throw new api_exception_Auth(api_exception::THROW_FATAL, array(), 0, $msg[0]);
            }
            if ($zaResult->isValid()) {
                if (isset($this->opts['container']['usercol'])) {
                    $storage = self::$zaAuth->getStorage();
                    $rows = array(
                            $this->opts['container']['usercol']
                    );
                    if (isset($this->opts['container']['idcol'])) {
                        $rows[] = $this->opts['container']['idcol'];
                    }
                    $storage->write(self::$zaAdapter->getResultRowObject($rows));
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the identity from storage or null if no identity is available
     *
     * @return mixed|null
     */
    public  function getAuthData() {
        return self::$zaAuth->getIdentity();
    }

    /**
     * Returns the user id from storage or null if no identity is available
     *
     * @return mixed|null
     */
    public  function getUserId() {
        if (self::$zaAuth->hasIdentity()) {
            if (isset($this->opts['container']['idcol'])) {
                $idcol = $this->opts['container']['idcol'];
                return self::$zaAuth->getIdentity()->$idcol;
            } else if (isset($this->opts['container']['usercol'])) {
                return $this->getUserName();
            } else {
                return self::$zaAuth->getIdentity();
            }
        }

        return null;
    }

    /**
     * Returns the user name from storage or null if no identity is available
     *
     * @return mixed|null
     */
    public  function getUserName() {
        if (self::$zaAuth->hasIdentity()) {
            if (isset($this->opts['container']['usercol'])) {
                $usercol = $this->opts['container']['usercol'];
                return self::$zaAuth->getIdentity()->$usercol;
            } else {
                return self::$zaAuth->getIdentity();
            }
        }

        return null;
    }

    /**
     * Trigger the Login-Process
     *
     * @param $user string: Username
     * @param $pass string: Password
     * @return boolean true if authenticated successfuly
     * @todo clean up the "very ugly stuff"
     */
    public  function login($user, $pass) {
        self::$zaAuth->clearIdentity();
        $rgOpts = $this->opts['container'];
        $strAdapter = $rgOpts['driver'];

        switch($strAdapter) {
            case "ldap":
                // TODO: Omg this is very ugly
                foreach ($rgOpts as $host => $opts) {
                    if ($host != "driver") {
                        self::$zaAdapter = new Zend_Auth_Adapter_Ldap(Array($host => $opts), $user, $pass);
                    }
                }
                break;

            case "dbtable":
                $this->setZendDbTableAdapter($rgOpts, $user, $pass);
                break;
            default:
                error_log("OKAPI: Zend_Auth_Adapter_".$strAdapter." not yet usable in Okapi");
                return false;
        }

        return $this->checkAuth();
    }

    /**
     * Clears the identity from persistent storage
     *
     * @return void
     */
    public  function logout() {
        self::$zaAuth->clearIdentity();
    }

    /**
    * Authenticate against a database-table
    *
    * Example for the YAML-File:
    *
    * \code
    * pam:
    *   auth:
    *       class: zend
    *       options:
    *           container:
    *               driver: dbtable
    *               adapter: Pdo_Mysql
    *               host: localhost
    *               dbname: modmon
    *               username: dbuser
    *               password: dbpass
    *               table: usertable
    *               usercol: usernamecolumn
    *               passcol: passwordcolumn
    *               passtreatment: MD5(?)
    *               idcol: idcolumn
    * \endcode
    *
    * @param $rgOpts array: Container options.
    * @param $user string: Database username.
    * @param $pass string: Database password.
    * @see http://framework.zend.com/manual/en/zend.auth.adapter.dbtable.html
    */
    private function setZendDbTableAdapter($rgOpts, $user, $pass){
        unset($rgOpts['driver']);
        $adapter = 'Zend_Db_Adapter_'.$rgOpts['adapter'];
        if(!class_exists($adapter)){
            throw new api_exception_Auth(1, $rgOpts, null, 'No such thing as ' . $adapter. '. Please check config.xml');
        }
        $dbAdapter = new $adapter($rgOpts);

        $authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);
        $authAdapter->setTableName($rgOpts['table'])
                    ->setIdentityColumn($rgOpts['usercol'])
                    ->setCredentialColumn($rgOpts['passcol'])
                    ->setIdentity($user)
                    ->setCredential($pass);

        // passtreatment id optional:
        if(array_key_exists('passtreatment', $rgOpts)){
           $authAdapter->setCredentialTreatment($rgOpts['passtreatment']);
        }

        self::$zaAdapter = $authAdapter;

    }

}