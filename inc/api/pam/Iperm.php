<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Interface for permission objects.
 */
interface api_pam_Iperm {
    /**
     * Checks if the user has access to the given object.
     * @param $uid mixed: User ID of the user who's currently logged in.
     * @param $acObject string: Access control object. An arbitrary value
     *        can be passed in, which the permission class uses to determine
     *        if the user has access or not.
     * @param $acValue string: Access control value. Used in the same way as
     *        the $acObject param.
     */
    public function isAllowed($uid, $acObject, $acValue);
}
