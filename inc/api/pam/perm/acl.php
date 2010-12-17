<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * ACL permission scheme - currently does nothing.
 * @todo Implement a permission scheme based on configuration.
 */
class api_pam_perm_acl extends api_pam_common implements api_pam_Iperm {
    public function __construct($opts) {
        parent::__construct($opts);
    }

    public function isAllowed($uid, $acObject, $acValue) {
        return true;
    }
}
