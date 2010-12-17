<?php


class lx_plugins_files {


    public static function getInstance($forceReload = false)  {
        static $instance;

        if  ($forceReload || !isset($instance) || !($instance instanceof lx_plugins_files   )) {
            $instance = new lx_plugins_files;
        }

        return $instance;

    }


    public function getContentById($id, phpCR_Session $session) {
        $dom = new DOMDocument();

        $node = $session->getItem($id);

        $content = $session->getItem($id."/jcr:content");
        $contenttype = $content->getProperty("jcr:mimeType")->getString();;
        header("Content-Type: ".$contenttype);
        print $content->getProperty("jcr:data")->getString();
die();
        $dom->loadXML($html);
        return $dom;

    }
}