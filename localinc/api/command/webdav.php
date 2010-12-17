<?php
class api_command_webdav extends api_command {

    public function __construct($attribs) {

        $this->path = $attribs['path'];
        parent::__construct($attribs);
    }

    public function index() {

        /*$storage = new lx_cr_storage_file(API_PROJECT_DIR . "/data/");

		$repository = lx_cr::lookup($storage, "myrepo");

		//    Get a Credentials object
		$credentials = new lx_cr_simplecredentials("MyName", "MyPassword");
		//    Get a Session
		$mySession = $repository->login($credentials, "MyWorkspace");
*/
/*
        $credentials = new Java("javax.jcr.SimpleCredentials", "chregu", array("p", "a", "s", "s", "w", "o", "r", "d"));

        $repository = jr_cr::lookup("http://10.211.55.2:7402/crx/server", "webdav");
        $mySession=  $repository->login("lx.default");
*/
$mySession =  jr_cr::api_factory("default");

  /*      $repository = jr_cr::lookup("rmi://localhost:8100/jackrabbit", "myrepo");

        //    Get a Credentials object
        $credentials = new Java("javax.jcr.SimpleCredentials", "chregu", array("p", "a", "s", "s", "w", "o", "r", "d"));
        //    Get a Session
        $mySession = $repository->login($credentials,"default");
*/
        try {
            error_log("M: ".$_SERVER['REQUEST_METHOD']. " ".$this->path);
            $w = new HTTP_WebDAV_Server_lxcr($mySession);
            $w->ServeRequest($this->path);
          //  error_log("S: ".$_SERVER['REQUEST_METHOD']. " ".$this->path);


        } catch (Exception $e) {
            error_log(var_Export($e, true));
        }

    //    $mySession->exportDocumentView("/",new Java("java.io.FileOutputStream","/home/chregu/foo.xml"),false,false);


        return true;
    }

}
