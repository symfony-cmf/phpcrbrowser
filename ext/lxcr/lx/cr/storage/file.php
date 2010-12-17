<?php

class lx_cr_storage_file {

    protected $path = null;
    protected $nodes = array();
    protected $uuid = array();
    /**
     * Enter description here...
     *
     * @var lx_cr_indexer_lucene
     */
    protected $indexer = null;

    const UUID = 'uuid.txt';
    /**
     *
     */
    function __construct($path) {
        if (!file_exists($path)) {
              mkdir($path);
        }
        $this->path = $path;
    }

    function getRootNodeValues() {
        if (! file_exists($this->path . self::UUID)) {
            $uuid = lx_cr_node::uuid();

            file_put_contents($this->path . self::UUID, $uuid);
        } else {

            $uuid = file_get_contents($this->path . self::UUID);
        }
        return array('parentuuid' => 0, 'uuid' => $uuid, 'name' => '');
    }

    public function addNode(lx_cr_node $node) {

        if (! file_exists($this->path . $node->getPath())) {
            mkdir($this->path . $node->getPath());
            file_put_contents($this->path . $node->getPath() . "/" . self::UUID, lx_cr_node::uuid());
        }

        $this->getIndexer()->addNode($node);
    }

    public function removeNode(lx_cr_node $node) {
       unlink($this->path.$node->getPath() .'/'. self::UUID);
       rmdir($this->path.$node->getPath());
       $this->getIndexer()->removeNode($node);
    }

    public function getChildNodeUUID(lx_cr_node $node, $name) {
        $path = $node->getPath() . '/' . $name;
        if (isset($this->uuid[$path])) {
            return $this->uuid[$path];
        }
        if (file_exists($this->path . $path)) {
            $uuid = file_get_contents($this->path . $path . "/" . self::UUID);
            $this->nodes[$uuid] = array('parentuuid' => $node->getUUID(), 'name' => $name, 'uuid' => $uuid, 'parentnode' => $node, 'nodetype' => 0);
            $this->uuid[$path] = $uuid;
            return $uuid;
        }
        return null;
    }

    public function registerNode(lx_cr_node $node) {
        $this->uuid[$node->getPath()] = $node->getUUID();
    }

    //FIXME doesn't work, if not saved....
    public function getChildNodesUUID(lx_cr_node $node, $namePattern = null) {

        $dir = new DirectoryIterator($this->path . $node->getPath());
        $uuids = array();
        if ($namePattern) {
            $namePatterns = explode("|",$namePattern);
            if (count($namePatterns) > 1) {
                foreach($namePatterns as $k => $v) {
                    $namePatterns[$k] = '#'. str_replace("\*",".*",preg_quote($v,'#')).'#';
                }
                $namePattern = null;
            } else {
                $namePattern = '#'. str_replace("\*",".*",preg_quote($namePattern,'#')).'#';
            }

        }

        foreach ($dir as $file) {
            $filename = $file->getFilename();
            if ($file->isDir() and ! ($file->isDot()) and $filename != '.svn') {
                $u = null;

                if ($namePattern) {
                    if (preg_match($namePattern,$filename)) {
                       $u = $this->getChildNodeUUID($node, $filename);
                    }
                } else if ($namePatterns) {
                    foreach($namePatterns as $v) {
                        if (preg_match($v,$filename)) {
                            $u = $this->getChildNodeUUID($node, $filename);
                            break;
                        }
                    }
                } else {
                    $u = $this->getChildNodeUUID($node, $filename);
                }

                if ($u) {
                    $uuids[] = $u;
                }
            }
        }
        return $uuids;
    }

    public function getNodeByUUID($uuid) {
        if (isset($this->nodes[$uuid])) {
          return $this->nodes[$uuid];
        } else {
            return null;
        }
    }

    public function getAllProperties(lx_cr_node $node) {
        $props = array();
        if (file_exists($this->path.$node->getPath())) {
            $dir = new DirectoryIterator($this->path . $node->getPath());

            foreach ($dir as $file) {
                if (!$file->isDir() and ! ($file->isDot())) {
                    $filename = $file->getFilename();
                    if (strpos($filename,":") !== false) {
                        list($type, $name) = explode(':',$filename,2);
                        $props[$name]['value'] = '__lazyloading__';
                        $props[$name]['type'] = $type;
                    }
                }
            }
        }
        return $props;
    }

    public function getPropertyValue($name,lx_cr_node $node, $type = 1) {
        $f = $this->path . $node->getPath() . '/' . $type .':'.$name;
        if (file_exists($f)) {
            return file_get_contents($f);
        } else {
            return null;
        }

    }

    public function saveProperty(lx_cr_property $property) {
      $f = $this->path. $property->getParent()->getPath() .'/'.$property->getType() .":".$property->getName();
      file_put_contents($f,$property->getValue());
    }

   public function removeProperty(lx_cr_property $property) {
        $f = $this->path. $property->getParent()->getPath() .'/'.$property->getType()   .":".$property->getName();

        unlink($f);
    }

    public function createQuery($statement,$language,$session) {
        if ($language != 'LUCENE') {
            //FIXME..
            print $language . "not supported";
            return null;
        }

        return new lx_cr_query_lucene($statement,$this->getIndexer(),$session);
    }

    public function sessionSave() {
        $this->getIndexer()->commit();
    }

    public function optimize() {
        $this->getIndexer()->optimize();
    }

    protected function getIndexer() {
        if (!$this->indexer) {
            $this->indexer = new lx_cr_indexer_lucene($this->path .'../index/');
        }
        return $this->indexer;
    }
}
