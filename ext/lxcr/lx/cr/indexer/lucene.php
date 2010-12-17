<?php

class lx_cr_indexer_lucene {
	
	/**
	 * 
	 * @var Zend_Search_Lucene
	 */
	protected $index = null;
	
	function __construct($path) {
		
        try {		
		  $this->index = Zend_Search_Lucene::open($path);
        } catch( Zend_Search_Lucene_Exception $e) {
        	$this->index = Zend_Search_Lucene::create($path);
        }
        //$this->index->optimize();
	}
	
	public function addNode(lx_cr_node $node) {
		$doc = new Zend_Search_Lucene_Document();
		$doc->addField(Zend_Search_Lucene_Field::Keyword('path', $node->getPath()));
		$doc->addField(Zend_Search_Lucene_Field::Unstored('path2', $node->getPath()));
        
		$doc->addField(Zend_Search_Lucene_Field::Keyword('uuid', $node->getUUID()));
		foreach ($node->getProperties() as $p) {
			$doc->addField(Zend_Search_Lucene_Field::UnStored($p->getName(), $p->getValue()));
		}
		$this->index->addDocument($doc);
	}
	
	public function commit() {
		$this->index->commit();
	}
	
	public function removeNode(lx_cr_node $node) {
		$term = new Zend_Search_Lucene_Index_Term($node->getUUID(), 'uuid');
		$query = new Zend_Search_Lucene_Search_Query_Term($term);
        foreach( $this->index->find($query) as $r) {
        	$this->index->delete($h);
        }
    		
	}
	
	public function optimize() {
		$this->index->optimize();
	}
	
	public function execute($statement) {
        return $this->index->find($statement);		
	}
}


