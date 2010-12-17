<?php

/*

DROP TABLE IF EXISTS nodes;
CREATE TABLE nodes (
  uuid varchar(36) NOT NULL,
  parentuuid varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  path varchar(1000) NOT NULL,
  PRIMARY KEY  (uuid)
);

DROP TABLE IF EXISTS node_properties;
CREATE TABLE node_properties (
  `name` varchar(100) NOT NULL,
  uuid varchar(36) NOT NULL,
  `type` varchar(100) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY  (`name`,uuid,`type`)
);

*/

class lx_cr_storage_db {

    protected $dsn = null;
    protected $nodes = array();

    /**
     *
     */
    function __construct($dsn)
    {
        $this->dns = $dsn;
        $this->db = new PDO($dsn, 'root');

        // TODO: connect
    }

    function getRootNodeValues()
    {
        $sql = "SELECT parentuuid, uuid, name FROM nodes WHERE parentuuid = '0'";
        $stmt = $this->db->query($sql);
        $rootNode = $stmt->fetch(PDO::FETCH_ASSOC);

        if (empty($rootNode)) {
            $uuid = lx_cr_node::uuid();
            $rootNode = array('parentuuid' => 0, 'uuid' => $uuid, 'name' => '');

            $sql = "INSERT INTO nodes (parentuuid, uuid, name, path) VALUES (:parentuuid, :uuid, :name, :name)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($rootNode);
        }

        return $rootNode;
    }

    public function addNode(lx_cr_node $node)
    {
        $sqlparams = array(
            'parentuuid' => $node->getParent()->getUUID(),
            'uuid' => $node->getUUID(),
            'name' => $node->getName(),
            'path' => $node->getParent()->getPath().'/',
        );

        $sql = "INSERT INTO nodes (parentuuid, uuid, name, path) VALUES (:parentuuid, :uuid, :name, :path)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($sqlparams);
    }

    public function removeNode(lx_cr_node $node)
    {
        $sql = "DELETE FROM WHERE uuid = :uuid";
        $stmt = $this->db->prepare($sql);
        $sqlparams = array(
            'uuid' => $node->getUUID(),
        );
        $stmt->execute($sqlparams);
    }

    public function getChildNodeUUID(lx_cr_node $node, $name)
    {
        $path = $node->getPath() . '/';
        $sql = 'SELECT uuid FROM nodes WHERE path = :path AND name = :name';
        $stmt = $this->db->prepare($sql);
        $sqlparams = array(
            'path' => $path,
            'name' => $name,
        );
        $stmt->execute($sqlparams);
        $childUUID = $stmt->fetch(PDO::FETCH_ASSOC);
        if (empty($childUUID['uuid'])) {
            return null;
        }

        return $childUUID['uuid'];
    }

    public function registerNode($node)
    {
    }

    //TODO implement $namePattern
    public function getChildNodesUUID(lx_cr_node $node, $namePattern = null)
    {
        $path = $node->getPath().'/';
        $sql = 'SELECT uuid FROM nodes WHERE path = :path';
        $sqlparams = array('path' => $path);
        if ($namePattern) {
            $sql.= ' AND name LIKE :name';
            $sqlparams['name'] = $namePattern;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($sqlparams);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getNodeByUUID($uuid)
    {
        $sql = "SELECT parentuuid, uuid, name FROM nodes WHERE uuid = :uuid";
        $stmt = $this->db->prepare($sql);
        $sqlparams = array('uuid' => $uuid);
        $stmt->execute($sqlparams);
        $node = $stmt->fetch(PDO::FETCH_ASSOC);

        $node['nodetype'] = 0;

        return $node;
    }

    public function getAllProperties(lx_cr_node $node)
    {
        $sql = 'SELECT name, type, value FROM node_properties WHERE uuid = :uuid';
        $stmt = $this->db->prepare($sql);
        $sqlparams = array(
            'uuid' => $node->getUUID(),
        );
        $stmt->execute($sqlparams);
        return $stmt->fetchAll(PDO::FETCH_ASSOC|PDO::FETCH_UNIQUE);
    }

    public function getPropertyValue($name,lx_cr_node $node, $type = 1)
    {
        $sql = 'SELECT value FROM node_properties WHERE uuid = :uuid AND name = :name';
        $stmt = $this->db->prepare($sql);
        $sqlparams = array(
            'uuid' => $node->getUUID(),
            'name' => $name,
        );
        $stmt->execute($sqlparams);
        $value = $stmt->fetch();

        if (empty($value['value'])) {
            return null;
        }

        return $value['value'];
    }

    public function saveProperty(lx_cr_property $property)
    {
        $sql = 'SELECT 1 FROM node_properties WHERE uuid = :uuid AND name = :name';
        $stmt = $this->db->prepare($sql);
        $sqlparams = array(
            'uuid' => $property->getParent()->getUUID(),
            'name' => $property->getName(),
        );
        $stmt->execute($sqlparams);

        $sqlparams['value'] = $property->getValue();
        $sqlparams['type'] = $property->getType();
        if ($stmt->fetch()) {
            $sql = 'UPDATE node_properties SET value = :value, type = :type WHERE uuid = :uuid AND name = :name';
            $stmt = $this->db->prepare($sql);
            $stmt->execute($sqlparams);
        } else {
            $sql = 'INSERT INTO node_properties (value, type, uuid, name) VALUES (:value, :type, :uuid, :name)';
            $stmt = $this->db->prepare($sql);
            $stmt->execute($sqlparams);
        }
    }

   public function removeProperty(lx_cr_property $property)
   {
        $sql = 'DELETE FROM node_properties WHERE uuid = :uuid AND name = :name';
        $stmt = $this->db->prepare($sql);
        $sqlparams = array(
            'uuid' => $property->getParent()->getUUID(),
            'name' => $property->getName(),
        );
        $stmt->execute($sqlparams);
    }

    public function createQuery($statement, $language, $session)
    {
        if ($language != 'SQL') {
            //FIXME..
            print $language . "not supported";
            return null;
        }
    }

    public function sessionSave()
    {
    }

    public function optimize()
    {
        $sql = 'OPTIMIZE TABLE nodes, node_properties';
        $stmt = $this->db->prepare($sql);
    }
}
