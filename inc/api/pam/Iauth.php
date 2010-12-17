<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Interface for authentication objects.
 */
interface api_pam_Iauth {
    /**
     * Login in with the given username and password. The authentication
     * object is responsible for handling the session state.
     * @param $user string: User name
     * @param $pass string: Password
     */
    public function login($user, $pass);

    /**
     * Log out the currently logged in user. The authentication object
     * is responsible for handling the session state.
     */
    public function logout();

    /**
     * Check if the user is currently logged in.
     * @return bool: True if the user is logged in.
     */
    public function checkAuth();

    /**
     * Return the user ID of the currently logged in user. This ID
     * is used for the permission checking.
     * @return mixed: User ID. Variable type depends on authentication
     *         class.
     */
    public function getUserId();

    /**
     * Return the user name of the currently logged in user.
     * @return string: User name
     */
    public function getUserName();

    /**
     * Gets the additional meta information about the currently logged in
     * user.
     * @return hash: Information key/value pair
     */
    public function getAuthData();
}
