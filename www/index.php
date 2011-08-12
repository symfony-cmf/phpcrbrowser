<?php
/**
 * Enter description here...
 *
 * @return jr_cr_session
 */
include('../ext/jackalope/src/Jackalope/autoloader.php');

function getJRSession($name="default") {
    $parameters = array('jackalope.jackrabbit_uri' => 'http://localhost:8080/server');

    $user = 'admin';
    $pass = 'admin';
    $workspace =  'default';

    $repo = \Jackalope\RepositoryFactoryJackrabbit::getRepository($parameters);
    $cred = new \PHPCR\SimpleCredentials($user, $pass);
    $sess = $repo->login($cred, $workspace);
    return $sess;
}

$start = microtime(true);
require_once dirname(__FILE__) . '/../inc/api/init.php';


api_init::start();
$session = getJRSession();

$rn = $session->getRootNode();

/*
bench();
$sess = getJRSession();
bench("getJRSession");


$root = $sess->getItem('/liip.ch');

foreach($root->getNodes() as $n) {
    print $n->getPath() ."<br/>";
}

$qm = $sess->getWorkspace()->getQueryManager();
bench("getQM");



//$q = $qm->createQuery("select * from nt:file where jcr:path like '/liip.ch/news/2007/05/%'","sql");
//$q = $qm->createQuery("select * from nt:base where jcr:path like '/liip.ch/news/2007/05/%' and","sql");
$q = $qm->createQuery("/jcr:root/liip.ch//*[jcr:contains(@*, 'stocker')]","xpath");

bench("createQ");
$ns = $q->execute()->getNodes();
var_dump($ns->getSize());
bench("getNodes");

while ($n = $ns->nextNode()) {
    var_dump($n->getPath());
    bench();

    print "<br/>";

}

function bench($text = "") {
    global $start;
    print "<br/>$text :". (microtime(true) - $start) * 1 ."<br/>";
}
 //var_dump($n->getPath());


die();*/

require_once API_LIBS_DIR . 'controller.php';
$ctrl = new api_controller();
$ctrl->process();
