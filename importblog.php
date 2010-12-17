<?php
/**
 * Enter description here...
 *
 * @return jr_cr_session
 */

include('./ext/jackalope/src/jackalope/autoloader.php');

function getJRSession($name="default") {


  $server = "http://localhost:8080/server";
    $user = 'admin';
    $pass = 'admin';
    $workspace =  'default';

    $cred = new \PHPCR\SimpleCredentials($user, $pass);
    $repo = new \Jackalope\Repository($server, null); //let jackalope factory create the transport

    $sess = $repo->login($cred, $workspace);

    return $sess;
}


require_once dirname(__FILE__) . '/inc/api/init.php';
api_init::start();
$sess = getJRSession();
$root = $sess->getRootNode();
if (!$sess->nodeExists("/liip.ch")) {
    $liip = $root->addNode("liip.ch");
    
}
if (!$sess->nodeExists("/liip.ch/news")) {
   $liip->addNode("news");
   
}


$root = $sess->getItem("/liip.ch/news");
/*

$root = $sess->getItem("/liip.ch/news/2004/01/15/conference-de-hannes-gassert/lx:metadata");

//$root->setProperty("lx:foo","heläää",PHPCR\PropertyType::STRING);

print $root->getProperty("lx:foo")->getString();
$sess->save();
die();*/
print "got root\n";
foreach ($root->getNodes() as $n) {
    if (strlen($n->getName()) == 4 ) {
      print "remove ". $n->getPath() ."\n";
    }
  //  $n->remove();
}
$sess->save();

 $db = new PDO('mysql:host=localhost;dbname=liip_ch', "root", "leakbug");
 $db->query("set names utf8 ");
    foreach($db->query('SELECT * from fluxcms_blogposts  ') as $row) {
           try {

        $day = createDateHierarchy($row['post_date'],$root);
        var_dump($day->getPath()."/".$row['post_uri']);
        } catch (PHPCR\RepositoryException $e) {

        $n = $day->addNode(bx_helpers_string::makeUri($row['post_uri']) ,"nt:folder");
        }
        if ($row['post_lang']) {
            $lang = $row['post_lang'];
        } else {
            $lang = 'de';
        }

        try {
         $file = $n->addNode("index.".$lang.".xhtml","nt:file");
        } catch (PHPCR\RepositoryException $e) {
        }
        try {
        $cont = $file->addNode("jcr:content","nt:unstructured");
        } catch (PHPCR\RepositoryException $e) {
        }
        
        $cont->setProperty("jcr:data",'<html xmlns="http://www.w3.org/1999/xhtml"><body><div id="content">'.$row["post_content"].'</div></body></html>',PHPCR\PropertyType::BINARY);
       var_dump($cont->getProperty("jcr:data")->getString());
        $cont->setProperty("jcr:mimeType","text/html",PHPCR\PropertyType::STRING);
      /*  $meta = $n->addNode("lx:metadata","lx:metadata");
        foreach($row as $key => $val) {
            if ($key != 'post_content' && $val && !is_numeric($key)) {
                if ($key == 'post_date') {
                       $meta->setProperty($key,date_create($val),PHPCR\PropertyType::DATE);
                } else {

 if ($key == 'post_title') {
     print $val ."\n";
 }
                    $meta->setProperty($key,$val,PHPCR\PropertyType::STRING);


                }


            }
        }*/
                 try {

        $sess->save();
        } catch (PHPCR\RepositoryException $e) {
        }
            }
    $sess->save();

   

    function createDateHierarchy($date,$root) {

            $date = explode("-",substr($date,0,10)) ;

        try {
            $year = $root->getNode($date[0]);
        } catch(PHPCR\PathNotFoundException $e) {
            $year = $root->addNode($date[0],"nt:folder");
        }

        try {
            $month = $year->getNode($date[1]);
        } catch(PHPCR\PathNotFoundException $e) {
            $month = $year->addNode($date[1],"nt:folder");
        }

        try {
            $day = $month->getNode($date[2]);
        } catch(PHPCR\PathNotFoundException $e) {
            $day = $month->addNode($date[2],"nt:folder");
        }
        return $day;
    }