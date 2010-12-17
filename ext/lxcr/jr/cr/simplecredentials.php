<?php

class jr_cr_simplecredentials {

    protected $JRcredentials;
    /**
     *
     */
    function __construct($user,$pass) {



        $this->JRcredentials = new Java("javax.jcr.SimpleCredentials", $user , str_split($pass));

    }

    public function getJRcredentials() {
        return $this->JRcredentials;
    }
}

?>