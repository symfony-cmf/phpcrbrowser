<?php

class lx_plugins_navitree {

    public static function getInstance($forceReload = false) {
        static $instance;

        if ($forceReload || ! isset($instance) || ! ($instance instanceof lx_plugins_navitree)) {
            $instance = new lx_plugins_navitree();
        }

        return $instance;

    }

    public function getContentById($id, phpCR_Session $session) {

        $md5path = md5($id);
        $cacheKey = md5("lx_plugins_navitree::".$md5path);

        if ($p = $session->cache->load($cacheKey)) {
            $d = new domdocument();
             $d->loadXML($p);
             return $d;

        }
        $node = $session->getItem($id);

        $d2 = null;
        /* get children of first node */
        $childrendom = new domdocument();
        $childrendom->loadXML("<items/>");
        $children = $this->getTreeChildren($node,'',$childrendom);
        if ($children) {
                $childrendom->documentElement->appendChild($children);
        }

        while ($node) {

            $d = new domdocument();

            $xml = $this->getXMLFragment($node, true);

            if ($node->getDepth() == 1) {

                $d->loadXML($xml);
                $selNode = $d->documentElement;

            } else {
                $d->loadXML("<items/>");

                $fr = $d->createDocumentFragment();
                $fr->appendXML($xml);
                $selNode = $d->documentElement->appendChild($fr);
            }

            if ($d2) {
                $selNode->appendChild($d->importNode($d2->documentElement, true));

            } else {
                if ($children) {
                    $selNode->appendChild($d->importNode($childrendom->documentElement,true));
                }
            }

            if ($node->getDepth() == 1) {
                break;
            }

            $path = $node->getPath();
            try {
                $node = $node->getParent();
            } catch (phpCR_ItemNotFoundException $e) {
                break;
            }

            $fr = $this->getTreeChildren($node,$path,$d);
            if ($fr) {
                $d->documentElement->appendChild($fr);
            }
            $d2 = $d;

        }
                $session->cache->save($d->saveXML(),$cacheKey,array($md5path));

        return $d;

    }

    protected function getTreeChildren($node,$path,$d) {

            $fr = $d->createDocumentFragment();
            $hasXML = false;
            foreach ($node->getNodes() as $n) {

                if ($n->getPath() == $path) {
                    continue;
                }
                $xml = $this->getXMLFragment($n);
                if ($xml) {
                    $hasXML = true;
                    $fr->appendXML($xml);
                }

            }
            if ($hasXML) {
                return $fr;
            } else {
                return false;
            }
    }

    protected function getXMLFragment(phpCR_Node $node, $selected = false) {

        $type = $node->getPrimaryNodeType();

        if ($type == "lx:metadata") {
            return "";
        }
        $name = $node->getName();

        if (substr($name,0,1) === ".") {
            return "";
        }

        // preload lx:metada


        try {
            if ($node->hasNode("lx:metadata")) {
                        $displayorder = $node->getProperty("lx:metadata/lx:displayorder")->getLong();
            } else {
                $displayorder = 0;
            }
        } catch (Exception $e) {
            $displayorder = 99999;
        }
        if ($displayorder < 0 ) {
            return "";
        }
        $depth = $node->getDepth() - 1;

        if ($type == 'nt:folder' || ! $type) {
            $mimetype = "httpd/unix-directory";
        } elseif ($type == 'nt:file') {
            $mimetype = $node->getProperty("jcr:content/jcr:mimeType")->getString();
        }

        $xml = "<collection  ";

        if ($selected) {
            $xml .= " selected='selected' ";
        }
        $xml .= " mimetype='$mimetype' level='$depth'>
                       <display-name>$name</display-name>
                        <title>$name</title>
                        <uri>" . str_replace("/liip.ch", "", $node->getPath()) . "</uri>
                        <display-order>$displayorder</display-order>
                    </collection>";
        return $xml;

    }
}