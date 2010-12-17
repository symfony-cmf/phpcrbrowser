<?php


class lx_plugins_xhtml {


    public static function getInstance($forceReload = false)  {
        static $instance;

        if  ($forceReload || !isset($instance) || !($instance instanceof lx_plugins_xhtml   )) {
            $instance = new lx_plugins_xhtml;
        }

        return $instance;

    }


    public function getContentById($id, phpCR_Session $session) {
        $dom = new DOMDocument();

        $node = $session->getItem($id);

        $id = trim($id,"/");
        //check for redirect

        if ($node->getPrimaryNodeType() == "nt:folder" ) {
            $id = $id ."/index.de.xhtml";

        }
        $content = $session->getItem($id."/jcr:content");
        $html = $content->getProperty("jcr:data")->getString();

        $dom->loadXML($html);
        return $dom;

    }
}