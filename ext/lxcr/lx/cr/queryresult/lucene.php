<?php


class lx_cr_queryresult_lucene implements phpCR_QueryResult {
	
	protected $result = array();
	protected $nodes = null;
	   /**
     * Enter description here...
     *
     * @var lx_cr_session
     */
	protected $session = null; 
    
	function __construct($result,$session) {
		$this->result = $result;
		$this->session = $session;

	}
	
	/**
	 * 
	 * @return array 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_QueryResult::getColumnNames()
	 */
	public function getColumnNames() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return object
A {@link NodeIterator} object 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_QueryResult::getNodes()
	 */
	public function getNodes() {
		if (!$this->nodes) {
			$this->nodes = array();
            foreach ($this->result as $r) {
            	try {
            	$this->nodes[] = $this->session->getItem($r->path);
            	} catch (phpCR_PathNotFoundException $e) {
            	}
            		
            }
		}
		return $this->nodes;

	}
	
	/**
	 * 
	 * @return object
A {@link RowIterator} object 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_QueryResult::getRows()
	 */
	public function getRows() {
		
	//TODO - Insert your code here
	}
}

?>
