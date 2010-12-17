<?php


class lx_cr_query_lucene implements phpCR_Query {
	
	
	protected $statement = '';
	
	/**
	 * Enter description here...
	 *
	 * @var lx_cr_indexer_lucene
	 */
	protected $indexer = null;
	
	/**
	 * Enter description here...
	 *
	 * @var lx_cr_session
	 */
	protected $session = null; 
    
	/**
	 * 
	 */
	function __construct($statement,$indexer,$session) {
		$this->indexer = $indexer;
		$this->statement = $statement;
		$this->session = $session;
	}
	
	/**
	 * 
	 * @return object
A {@link QueryResult} object 
	 * @throws {@link RepositoryException}
If an error occurs 
	 * @see phpCR_Query::execute()
	 */
	public function execute() {
		return new lx_cr_queryresult_lucene($this->indexer->execute($this->statement),$this->session);
		
	}
	
	/**
	 * 
	 * @see QueryLanguage 
	 * @return int 
	 * @see phpCR_Query::getLanguage()
	 */
	public function getLanguage() {
		return "LUCENE";
	}
	
	/**
	 * 
	 * @return string 
	 * @see phpCR_Query::getStatement()
	 */
	public function getStatement() {
		return $this->statement;
	}
	
	/**
	 * 
	 * @return string
Path of the {@link Node} representing this query. 
	 * @throws {@link ItemNotFoundException}
If this query is not a stored query. 
	 * @throws {@link RepositoryException}
If another error occurs. 
	 * @see phpCR_Query::getStoredQueryPath()
	 */
	public function getStoredQueryPath() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @param string
The absolute path to store this at 
	 * @return object
A {@link Node} object 
	 * @throws {@link ItemExistsException}
If an item at the specified path already exists, same-name siblings 
are not allowed and this implementation performs this validation 
immediately instead of waiting until {@link Item::save()}. 
	 * @throws {@link PathNotFoundException}
If the specified path implies intermediary {@link Node}s that do not
exist or the last element of <i>$relPath</i> has an index, and
this implementation performs this validation immediately instead of 
waiting until {@link Item::save()}. 
	 * @throws {@link ConstraintViolationException}
If a node type or implementation-specific constraint is violated or
if an attempt is made to add a node as the child of a property and 
this implementation performs this validation immediately instead of 
waiting until {@link Item::save()}. 
	 * @throws {@link VersionException}
If the node to which the new child is being added is versionable and
checked-in or is non-versionable but its nearest versionable ancestor 
is checked-in and this implementation performs this validation 
immediately instead of waiting until {@link Item::save()}. 
	 * @throws {@link LockException}
If a lock prevents the addition of the node and this implementation 
performs this validation immediately instead of waiting until 
{@link Item::save()}. 
	 * @throws {@link UnsupportedRepositoryOperationException}
In a level 1 implementation. 
	 * @throws {@link RepositoryException}
If another error occurs or if the <i>$relPath</i> provided has
an index on its final element. 
	 * @see phpCR_Query::storeAsNode()
	 */
	public function storeAsNode($absPath) {
		
	//TODO - Insert your code here
	}
}

?>
