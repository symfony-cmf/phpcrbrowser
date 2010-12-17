<?php
class api_command_lxcr extends api_command {

    /**
     * Enter description here...
     *
     * @var jr_cr_session
     */
    protected $session = null;

    /**
     * Enter description here...
     *
     * @var jr_cr_node
     */
    protected $node = null;

    public function __construct(&$attribs) {

        $this->path = "liip.ch/" . $attribs['path'];
        parent::__construct($attribs);

        $this->session = getJRSession('anonym');

        $root = $this->session->getRootNode();
        $this->node = $root->getNode($this->path);

        try {
            //preload lx:metadata
            if ($this->node->hasNode("lx:metadata")) {
                $red = $this->node->getProperty("lx:metadata/lx:redirect")->getString();
                if ($red) {
                    $this->path = $this->node->getPath() . "/" . $red;
                    $this->node = $root->getNode($this->path);

                }
            }
        } catch (Exception $e) {

        }

        $xsl = $this->getFirstMetaProperty("lx:xslt");
        if ($xsl) {
            $attribs['view']['xsl'] = trim($xsl->getString());
        }
        $attribs['view']['theme'] = 'liip';
        $attribs['view']['css'] = 'main.css';
        /*

        if ($this->node->getPrimaryNodeType() == 'nt:folder') {
            $n = $this->node->getNode("index.de.xhtml");
            if ($n instanceof lx_cr_node) {
                $this->node = $n;
            }
        }
        if ($this->node->hasProperty("lx:metadata/lx:xslt")) {
            $xsl = $this->node->getProperty("lx:metadata/lx:xslt")->getString();
        }

        if ($xsl && $xsl = $xsl->getValue()) {
            $attribs['view']['xsl'] = trim($xsl);
        }*/
    }

    protected function getFirstMetaProperty($key) {
        $n = $this->node;
        $ext = '';
        while ($n && ! ($n->hasNode("lx:metadata") && $n->hasProperty("lx:metadata/" . $key))) {
            if ($n->getPath() == '/') {
                $n = null;
            } else {
                $n = $n->getParent();
                if ($n && $n->hasNode("lx:metadata.children") && $n->hasProperty("lx:metadata.children/".$key)) {
                    $ext = ".children";
                    break;
                }
            }

        }

        if ($n) {
            return $n->getProperty("lx:metadata".$ext."/" . $key);
        } else {
            return null;
        }

    }

    public function put() {

        $dom = new domdocument();
        $dom->load("php://input");
        $xp = new DOMXPath($dom);
        $nodes = $xp->query('/bx/plugin[@name="xhtml"]/*');
        $xml = $dom->saveXML($nodes->item(0));


        $newnode = $this->session->getRootNode()->addNode($this->path.'/index.de.xhtml', "nt:file");
        if (! $newnode->isCheckedOut()) {
            $newnode->checkout();
        }
        $newnode->addMixin('mix:versionable');
        $content = $newnode->addNode("jcr:content", "nt:resource");


        $content->setProperty("jcr:data", $xml, phpCR_PropertyType::BINARY);

        if (function_exists('finfo_open')) {

            $finfo = new finfo(FILEINFO_MIME | FILEINFO_CONTINUE);
            $mimes = explode(" ", $finfo->buffer($data));
            if (count($mimes) >= 3) {
                $mimetype = $mimes[2];
            } else {
                $mimetype = $mimes[0];
            }

            $content->setProperty("jcr:mimeType", trim($mimetype));
        } else {
            $content->setProperty("jcr:mimeType", "application/unknown");
        }
        $content->setProperty("jcr:lastModified", time(), phpCR_PropertyType::DATE);

        //$newnode->save();
        //$content->save();
        $this->session->save();

        $newnode->checkin();
        $this->response->setCode(201);



    }

    public function index() {

        $plugins = $this->getFirstMetaProperty("lx:plugins");
        $dom = new domdocument();
        $dom->loadXML("<bx/>");
/*        foreach ($plugins->getValues() as $plugin) {
            $plugin = $plugin->getString();
            $p = call_user_func(array("lx_plugins_" . $plugin, "getInstance"));
            $xml = call_user_func(array($p, "getContentById"), $this->path, $this->session);
            if ($xml instanceof DOMDocument) {
                $frag = $dom->documentElement->appendChild($dom->createElement("plugin"));
                $frag->setAttribute("name", $plugin);
                $frag->appendChild($dom->importNode($xml->documentElement, true));
            }
        }*/

        $this->data = $dom;

        return;
        $xml = '<node>';
        $xml .= '<name>' . htmlspecialchars($this->node->getName()) . '</name>';
        $xml .= '<path>' . htmlspecialchars($this->node->getPath()) . '</path>';

        try {
            $siblings = $this->node->getProperty("lx:getSiblings");
        } catch (phpCR_PathNotFoundException $e) {
            $siblings = false;
        }
        if ($siblings && $siblings->getValue()) {
            $xml .= '<siblings>';
            $nodes = $this->node->getParent()->getNodes();

            foreach ($nodes as $n) {
                $xml .= '<node><name>' . htmlspecialchars($n->getName()) . '</name><path>' . htmlspecialchars($n->getPath()) . '</path>';
                $xml .= '<properties>';
                foreach ($n->getProperties() as $p) {
                    $val = $p->getValue();
                    if (strlen($val) > 200) {
                        $val = base64_encode($val);
                    }
                    $xml .= '<property><name>' . htmlspecialchars($p->getName()) . '</name><value>' . htmlspecialchars($val) . '</value></property>';
                }

                $xml .= '</properties>';
                $xml .= '</node>';
            }
            $xml .= '</siblings>';
        }

        $xml .= '<subnodes>';
        $nodes = $this->node->getNodes();
        foreach ($nodes as $n) {
            $xml .= '<node><name>' . htmlspecialchars($n->getName()) . '</name><path>' . htmlspecialchars($n->getPath()) . '</path></node>';
        }

        $xml .= '</subnodes>';

        $xml .= '<properties>';
        foreach ($this->node->getProperties() as $p) {
            try {
                $val = $p->getString();
            } catch (Exception $e) {
                $val = "__EXCEPTION__";
            }
            if (strlen($val) > 200) {
                $val = base64_encode($val);
            }
            $xml .= '<property><name>' . htmlspecialchars($p->getName()) . '</name><value>' . htmlspecialchars($val) . '</value></property>';
        }

        $xml .= '</properties>';
        try {
            $getContent = $this->node->getProperty("lx:getContent");
        } catch (phpCR_PathNotFoundException $e) {
            $getContent = null;
        }
        if ($getContent && $getContent->getValue()) {
            $xml .= "<content>";
            $xml .= $this->node->getNode("jcr:content")->getProperty("jcr:data")->getValue();
            $xml .= "</content>";
        }

        $xml .= '</node>';

        $d = new DOMDocument();
        $d->loadXML($xml);
        //$node->setProperty("lastAccess",time(),phpCR_PropertyType::LONG);
        /*$n = $node->searchNodes("//hello");

        foreach($n as $b) {
            print "Found: ".$b->getPath()."<br/>";
        }*/
        //$mySession->save();
        //$mySession->optimize();


        $this->data[] = new api_model_dom($d);
    }
    public function getData() {
        return $this->data;
    }
}
