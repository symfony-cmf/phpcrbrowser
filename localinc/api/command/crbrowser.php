<?php
class api_command_crbrowser extends api_command {

    public function __construct($attribs) {
        $this->path = $attribs['path'];
        parent::__construct($attribs);
    }

    /**
     * Enter description here...
     *
     * @return jr_cr_session
     */

    protected function getSession() {
        if (!$this->session) {
           $this->session = getJRSession();
        }
        return $this->session;

    }

    /**
     * Enter description here...
     *
     * @return jr_cr_node
     */

    protected function getRootNode() {
        $session = $this->getSession();
        return $session->getRootNode();
    }

    /**
     * Enter description here...
     *
     * @return jr_cr_node the requested node
     */
    protected function getNode() {
        $root = $this->getRootNode();
        $path = $_GET['fullpath'];
        if ($path == '/') {
            $node = $root;
        } else {
            $node = $root->getNode($_GET['fullpath']);
        }

        return $node;
    }
    public function index() {
        $mySession = $this->getSession();

/*
        if ($_GET['q']) {
            $qm = $mySession->getWorkspace()->getQueryManager();
            $q = $qm->createQuery($_GET['q'], 'LUCENE');
            foreach ($q->execute()->getNodes() as $n) {
                print $n->getPath();
                print "<br>";
            }
        }

        $root = $mySession->getRootNode();

        $node = $root->getNode($this->path);
        if ($this->request->getVerb() == 'POST') {
            if (! empty($_POST['propname'])) {
                $node->setProperty($_POST['propname'], $_POST['propvalue'],\PHPCR\PropertyType);
            }

            if (! empty($_POST['nodename'])) {
                $node->addNode($_POST['nodename'], 'nt:unstructured');
            }
            $mySession->save();
        }

        $nodes = $node->getNodes();
        $xml = '<node>';
        $xml .= '<name>' . htmlspecialchars($node->getName()) . '</name>';
        $xml .= '<path>' . htmlspecialchars($node->getPath()) . '</path>';
        $xml .= '<subnodes>';
        foreach ($nodes as $n) {
            $xml .= '<node><name>' . htmlspecialchars($n->getName()) . '</name><path>' . htmlspecialchars($n->getPath()) . '</path></node>';
        }

        $xml .= '</subnodes>';
        $xml .= '<properties>';
        foreach ($node->getProperties() as $p) {
            try {
                $val = $p->getString();
                if (strlen($val) > 200) {
                    $val = base64_encode($val);
                }
            } catch (Exception $e) {
                $val = "EXCEPTION";
            }
            $xml .= '<property><name>' . htmlspecialchars($p->getName()) . '</name><value>' . htmlspecialchars($val) . '</value></property>';
        }

        $xml .= '</properties>';
        $xml .= '</node>';

        $d = new DOMDocument();
        $d->loadXML($xml);

        //$mySession->save();
        //$mySession->optimize();
*/

        $this->data[] = new api_model_dom($d);
    }

    function tree() {
        $node = $this->getNode();
        $nodes = $node->getNodes();
        $data = array("ResultSet" => array("Result" => array()));
        foreach ($nodes as $node) {
            $f = array("label" => $node->getName(), "fullpath" => $node->getPath());
            if (! ($node->hasNodes())) {
                $f['isLeaf'] = true;
            }
            $data["ResultSet"]["Result"][] = $f;
        }

        $this->data = json_encode($data);

    }

    function properties() {
        $node = $this->getNode();
        $props = $node->getProperties();

        $data = array("ResultSet" => array("Result" => array()));
        foreach ($props as $prop) {
            try {
                if ($prop->getType() == \PHPCR\PropertyType::BINARY) {
                    $mt =  $node->getProperty("jcr:mimeType");
                    if ($mt && $mt->getString() == 'text/html') {
                        $v = $prop->getString();
                    } else {
                        $v = " ";
                    }
                } else {
                  $v = $prop->getString();
                }
            } catch (Exception $e) {
                $v = '';
                try {
                    $v = $prop->getString();
                } catch (Exception $e) {
                    $v = "__EXCEPTION2__";
                }
            }

            $f = array("name" => $prop->getName(), "value" => $v, "type" => $prop->getType());
            $data["ResultSet"]["Result"][] = $f;
        }

        $this->data = json_encode($data);

    }

    function versions() {

        $node = $this->getNode();
        $data = array("ResultSet" => array("Result" => array()));
                $sess = $this->getSession();

        $vm = $sess->getWorkspace()->getVersionManager();
        $foo = $vm->getVersionHistory($node->getPath());
        foreach ($foo->getAllVersions() as $n) {
            $f = array("name" => $n->getName(), "date" => $n->getProperty("jcr:created")->getString());
            //if ($n->hasNode($n->hasProperty("jcr:content/jcr:data")) {
            try {
                $f['size'] = $n->getProperty("jcr:frozenNode/jcr:content/jcr:data")->getLength();
                //}
            } catch (Exception $e) {
            }

            $data["ResultSet"]["Result"][] = $f;
        }

        $f['name'] = 'base';
     //   $f['date'] = $node->getBaseVersion()->getName();
        $f['size'] = '';
        $data["ResultSet"]["Result"][] = $f;
        $this->data = json_encode($data);

    }

    function nodetypes() {
        $sess = $this->getSession();
        $ntm = $sess->getWorkspace()->getNodeTypeManager();
        $all = $ntm->getAllNodeTypes();
        $data = array("ResultSet" => array("Result" => array()));

        foreach ($all as $nt) {
            $f = array('name' => $nt->getName(), "isMixin" => $nt->isMixin(), "primaryItemName" => $nt->getPrimaryItemName());
            $data["ResultSet"]["Result"][] = $f;
        }

        $data["ResultSet"]["Result"][] = $f;
        $this->data = json_encode($data);

    }

    function restore() {
        $sess = $this->getSession();
        $node = $this->getNode();
        //if (! $node->isCheckedOut()) {
            $vm = $sess->getWorkspace()->getVersionManager();
            
            $vm->checkout($node->getPath());
            
        //}

        $vm->restore(true,$_GET['version'], $node->getPath());
        $sess->save();
        $vm->checkin($node->getPath());
        
        $vm->checkout($node->getPath());
        
        $this->data = json_encode(true);

    /*if (is_object($foo)) {
            error_log($foo->getRootVersion()->getPath());
        }*/

    }

     function addnode() {
         $sess = $this->getSession();
        $node = $this->getNode();
        if (! $node->isCheckedOut()) {
            $vm = $sess->getWorkspace()->getVersionManager();
            $vm->checkout($node->getPath());
        }
        error_log($_POST['name']. " : " .$_POST['type']);

        $node->addNode($_POST['name'],$_POST['type']);
        $sess->save();
          $this->data = json_encode(true);
     }


     function setproperty() {
         $sess = $this->getSession();
        $node = $this->getNode();
       /*if (! $node->isCheckedOut()) {
            $node->checkout();
        }*/
          $vm = $sess->getWorkspace()->getVersionManager();
            $vm->checkout($node->getPath());
        error_log("set property " . $node->getPath() . " " . $_GET['name'] ." = " . $_GET['value']);
        $node->setProperty($_GET['name'],$_GET['value']);
        $sess->save();
          $this->data = json_encode(true);
     }



     function createversion() {
         $sess = $this->getSession();
        $node = $this->getNode();
        //if (! $node->isCheckedOut()) {
            $vm = $sess->getWorkspace()->getVersionManager();
            $vm->checkout($node->getPath());

        //}

        $node->addMixin('mix:versionable');
        $sess->save();

        
        $vm->checkin($node->getPath());
        
        error_log("new version " .$node->getPath());
        $vm->checkout($node->getPath());

        $this->data = json_encode(true);
     }

     function delcache() {
         $sess = $this->getSession();
         $sess->cache->clean();
         error_log("cleaned cache");
        $this->data = json_encode(true);
     }



    public function getData() {
        return $this->data;
    }

}

