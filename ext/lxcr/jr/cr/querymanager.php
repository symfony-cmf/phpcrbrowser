<?php


class jr_cr_querymanager implements phpCR_QueryManager {

	/**
	 * Enter description here...
	 *
	 * @var jr_cr_workspace
	 */
	protected $workspace = null;

	protected $JRquerymanager = null;
	/**
	 *
	 */
	function __construct($workspace, $jrquerymanager) {


	   $this->workspace = $workspace;
	   $this->JRquerymanager = $jrquerymanager;
	}

	/**
	 *
	 * @param string
	 * @param string
	 * @return jr_cr_query
A {@link Query} object.
	 * @throws {@link InvalidQueryException}
If statement is invalid or language is unsupported.
	 * @throws {@link RepositoryException}
If another error occurs
	 * @see phpCR_QueryManager::createQuery()
	 */
	public function createQuery($statement, $language ) {
	    return new jr_cr_query($this->JRquerymanager->createQuery($statement,$language),$this->workspace->getSession());
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
        return $this->JRquerymanager->getSupportedQueryLanguages();

	}
}

