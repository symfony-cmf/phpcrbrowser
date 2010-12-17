<?php

class lx_plugins_search {

    public static function getInstance($forceReload = false) {
        static $instance;

        if ($forceReload || ! isset($instance) || ! ($instance instanceof lx_plugins_search)) {
            $instance = new lx_plugins_search();
        }

        return $instance;

    }

    public function getContentById($id, phpCR_Session $session) {
        $dom = new DOMDocument();

        $node = $session->getItem($id);

        $id = trim($id, "/");
        //check for redirect


        $xml = '<results>';
        if ($node->hasNode("lx:metadata")) {

            $sprop = $node->getNode("lx:metadata")->getProperty("lx:search");

            if ($sprop) {
                $search = $sprop->getString();

                $qm = $session->getWorkspace()->getQueryManager();
                //$q = $qm->createQuery("/jcr:root/liip.ch//*[jcr:contains(@*, 'stocker')]","xpath");
                // "select * from nt:base where jcr:path like '/liip.ch/news/2007/05/%' and","sql"


                if (isset($_GET['q']) && $_GET['q']) {
                    $search = str_replace("order by", " and contains(*,'".$_GET['q']."') order by", $search);

                    //select post_title from lx:metadata where jcr:path like '/liip.ch/news/2008/%/%/%' and post_lang = 'de' order by post_date DESC
                    $search = "select * from nt:base where jcr:path like '/liip.ch/%'  and  contains(*,'".$_GET['q']."') order by jcr:score DESC";
                }
                $q = $qm->createQuery($search, "sql");

                //$ns = $q->execute()->getNodes();
                $qr = $q->execute();
                $cols = $qr->getColumnNames();
                $ns = $qr->getRows();
                while ($n = $ns->nextRow()) {
                    $xml .= '<node>';


                    foreach ($n->getValues() as $k => $v) {
                        $xml .= '<' . str_replace(":", "_", $cols[$k]) . '>';
                        $xml .= htmlspecialchars($v->getString());
                        $xml .= '</' . str_replace(":", "_", $cols[$k]) . '>';

                    }
try {
 $html = $session->getItem(str_replace("lx:metadata","",$n->getValue("jcr:path")->getString())."index.de.xhtml/jcr:content")->getProperty("jcr:data")->getString();
$xml .= '<html>'.$html.'</html>';

} catch (Exception $e) {
//var_dump($e);
}
                    $xml .= '</node>';
                }

            }

        }
        $xml .= '</results>';
        $dom->loadXML($xml);
        return $dom;

    }
}