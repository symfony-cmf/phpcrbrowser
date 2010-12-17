<?php


class lx_plugins_metadata {


    public static function getInstance($forceReload = false)  {
        static $instance;

        if  ($forceReload || !isset($instance) || !($instance instanceof lx_plugins_metadata   )) {
            $instance = new lx_plugins_metadata;
        }

        return $instance;

    }


    public function getContentById($id, phpCR_Session $session) {
        $dom = new DOMDocument();

        $node = $session->getItem($id);

        $id = trim($id,"/");
        //check for redirect

        $xml = '<properties>';
        if ($node->hasNode("lx:metadata")) {

                foreach($node->getNode("lx:metadata")->getProperties() as $p) {
                    $xml .= '<'.str_replace(":","_",$p->getName()) .'>';
                    $xml .= htmlspecialchars($p->getString());
                    $xml .= '</'.str_replace(":","_",$p->getName()) .'>';

                }

        }
        $xml .= '</properties>';
        $dom->loadXML($xml);
        return $dom;

    }
}