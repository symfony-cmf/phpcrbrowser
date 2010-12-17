<?php


class lx_cr_querymanager implements phpCR_QueryManager {
	
	/**
	 * Enter description here...
	 *
	 * @var lx_cr_workspace
	 */
	protected $workspace = null;
	
	/**
	 * 
	 */
	function __construct($workspace) {
		
	   $this->workspace = $workspace;
	}
	
	/**
	 * 
	 * @param string 
	 * @param string 
	 * @return object
A {@link Query} object. 
	 * @throws {@link InvalidQueryException}
If statement is invalid or language is unsupported. 
	 * @throws {@link RepositoryException}
If another error occurs 
	 * @see phpCR_QueryManager::createQuery()
	 */
	public function createQuery($statement, $language ) {
		$session = $this->workspace->getSession();
		  return $session->storage->createQuery($statement,$language,$session);
	}
	
	/**
	 * 
	 * @see Query::storeAsNode() 
	 * @param object
A {@link Node} object 
	 * @return object
A {@link Query} object 
	 * @throws {@link InvalidQueryException}
If <i>$node</i> is not a valid persisted query (that is, a node
of type <i>nt:query</i>) 
	 * @throws {@link RepositoryException}
If another error occurs 
	 * @see phpCR_QueryManager::getQuery()
	 */
	public function getQuery(phpCR_Node $node) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return array 
	 * @throws {@link RepositoryException}
If an error occurs 
	 * @see phpCR_QueryManager::getSupportedQueryLanguages()
	 */
	public function getSupportedQueryLanguages() {
		
	//TODO - Insert your code here
	}
}

?>
