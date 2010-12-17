<?php


class lx_cr_workspace implements phpCR_Workspace {
	
	/**
	 * The session object
	 *
	 * @var lx_cr_session
	 */
	protected $session = null;
	
	/**
	 * Enter description here...
	 *
	 * @var lx_cr_querymanager
	 */
	protected $querymanager = null;
	

    protected $name = '';
    /**
	 * 
	 */
	function __construct($name,$session) {
		$this->name = $name;
		$this->session = $session;

	}
	
	/**
	 * 
	 * @param string
The name of the workspace from which the node is to be copied. 
	 * @param string 
The path of the node to be copied in <i>$srcWorkspace</i>. 
	 * @param string
The location to which the node at <i>$srcAbsPath</i> is to be
copied in <i>$this</i> workspace. 
	 * @param boolean
If <i>false</i> then this method throws an 
{@link ItemExistsException} on UUID conflict with an incoming node.
If <i>true</i> then a UUID conflict is resolved by removing the
existing node from its location in this workspace and cloning (copying
in) the one from <i>$srcWorkspace</i>. 
	 * @throws {@link NoSuchWorkspaceException}
If <i>$destWorkspace</i> does not exist. 
	 * @throws {@link ConstraintViolationException}
If the operation would violate a node-type or other 
implementation-specific constraint. 
	 * @throws {@link VersionException}
If the parent node of <i>$destAbsPath</i> is versionable and
checked-in, or is non-versionable but its nearest versionable ancestor 
is checked-in. This exception will also be thrown if 
<i>$removeExisting</i> is <i>$true</i>, and a UUID
conflict occurs that would require the moving and/or altering of a
node that is checked-in. 
	 * @throws {@link AccessDeniedException}
If the current session does not have sufficient access rights to 
complete the operation. 
	 * @throws {@link PathNotFoundException}
If the node at <i>$srcAbsPath</i> in <i>$srcWorkspace</i>
or the parent of <i>$destAbsPath</i> in this workspace does not 
exist. 
	 * @throws {@link ItemExistsException}
If a property already exists at <i>$destAbsPath</i> or a node 
already exist there, and same name siblings are not allowed or if
<i>$removeExisting</i> is false and a UUID conflict occurs. 
	 * @throws {@link LockException}
If a lock prevents the clone. 
	 * @throws {@link RepositoryException}
If the last element of <i>$destAbsPath</i> has an index or if
another error occurs. 
	 * @see phpCR_Workspace::clone_()
	 */
	public function clone_($srcWorkspace, $srcAbsPath, $destAbsPath, $removeExisting) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @param string|null
The name of the workspace from which the copy is to be made.  This can
be left <i>NULL</i> if you wish to keep it within the same
workspace. 
	 * @param string
The path of the node to be copied. 
	 * @param string
The location to which the node at <i>$srcAbsPath</i> is to be
copied. 
	 * @throws {@link ConstraintViolationException}
If the operation would violate a node-type or other 
implementation-specific constraint. 
	 * @throws {@link VersionException}
If the parent node of <i>$destAbsPath</i> is versionable and
checked-in, or is non-versionable but its nearest versionable ancestor 
is checked-in. 
	 * @throws {@link AccessDeniedException}
If the current session does not have sufficient access rights to
complete the operation. 
	 * @throws {@link PathNotFoundException}
If the node at <i>$srcAbsPath</i> or the parent of 
<i>$destAbsPath</i> does not exist. 
	 * @throws {@link ItemExistsException}
If a property already exists at <i>$destAbsPath</i> or a
node already exist there, and same name siblings are not allowed. 
	 * @throws {@link LockException}
If a lock prevents the copy. 
	 * @throws {@link RepositoryException}
If the last element of <i>$destAbsPath</i> has an index or if
another error occurs. 
	 * @see phpCR_Workspace::copy()
	 */
	public function copy($srcWorkspace, $srcAbsPath, $destAbsPath) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return array 
Containing names of accessible workspaces. 
	 * @throws {@link RepositoryException} 
	 * @see phpCR_Workspace::getAccessibleWorkspaceNames()
	 */
	public function getAccessibleWorkspaceNames() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @param parentAbsPath the absolute path of a node under which (as child) the imported subtree will be built. 
	 * @param uuidBehavior a four-value flag that governs how incoming UUIDs are handled. 
	 * @return an org.xml.sax.ContentHandler whose methods may be called to feed SAX events into the deserializer. 
	 * @throws {@link PathNotFoundException}
If no node exists at <i>$parentAbsPath</i>. 
	 * @throws {@link ConstraintViolationException}
If the new subtree cannot be added to the node at
<i>$parentAbsPath</i> due to node-type or other implementation-specific constraints,
and this can be determined before the first SAX event is sent. 
	 * @throws {@link VersionException}
If the node at <i>$parentAbsPath</i> is versionable
and checked-in, or is non-versionable but its nearest versionable ancestor is checked-in. 
	 * @throws {@link LockException}
If a lock prevents the addition of the subtree. 
	 * @throws {@link AccessDeniedException}
If the session associated with this {@link Workspace} object does not have
sufficient permissions to perform the import. 
	 * @throws {@link RepositoryException}
If another error occurs. 
	 * @todo Determine if feasiable within PHP 
	 * @see phpCR_Workspace::getImportContentHandler()
	 */
	public function getImportContentHandler( $parentAbsPath,  $uuidBehavior) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return string 
	 * @see phpCR_Workspace::getName()
	 */
	public function getName() {
		return $this->name;
	}
	
	/**
	 * 
	 * @return object
A {@link NamespaceRegisty} object 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Workspace::getNamespaceRegistry()
	 */
	public function getNamespaceRegistry() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return object
A {@link NodeTypeManager} object 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Workspace::getNodeTypeManager()
	 */
	public function getNodeTypeManager() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return object
A {@link ObservationManager} object 
	 * @throws {@link UnsupportedRepositoryOperationException}
If the implementation does not support observation. 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Workspace::getObservationManager()
	 */
	public function getObservationManager() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return lx_cr_querymanager
A {@link QueryManager} object 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Workspace::getQueryManager()
	 */
	public function getQueryManager() {
		
        if (!$this->querymanager) {
        	$this->querymanager = new lx_cr_querymanager($this);
        }
        return $this->querymanager;
	}
	
	/**
	 * 
	 * @return object
A {@link Session} object 
	 * @see phpCR_Workspace::getSession()
	 */
	public function getSession() {
		
        return $this->session;
	}
	
	/**
	 * 
	 * @param parentAbsPath the absolute path of the node below which the deserialized subtree is added. 
	 * @param in The <i>Inputstream</i> from which the XML to be deserilaized is read. 
	 * @param uuidBehavior a four-value flag that governs how incoming UUIDs are handled. 
	 * @throws {@link java}
.io.IOException if an error during an I/O operation occurs. 
	 * @throws {@link PathNotFoundException}
If no node exists at <i>$parentAbsPath</i>. 
	 * @throws {@link ConstraintViolationException}
If node-type or other implementation-specific constraints
prevent the addition of the subtree or if <i>$uuidBehavior</i>
is set to <i>IMPORT_UUID_COLLISION_REMOVE_EXISTING</i> and an incoming node has the same
UUID as the node at <i>$parentAbsPath</i> or one of its ancestors. 
	 * @throws {@link VersionException}
If the node at <i>$parentAbsPath</i> is versionable
and checked-in, or is non-versionable but its nearest versionable ancestor is checked-in. 
	 * @throws {@link InvalidSerializedDataException}
If incoming stream is not a valid XML document. 
	 * @throws {@link ItemExistsException}
If the top-most element of the incoming XML would deserialize
to a node with the same name as an existing child of <i>$parentAbsPath</i> and that
child does not allow same-name siblings, or if a <i>$uuidBehavior</i> is set to
<i>IMPORT_UUID_COLLISION_THROW</i> and a UUID collision occurs. 
	 * @throws {@link LockException}
If a lock prevents the addition of the subtree. 
	 * @throws {@link AccessDeniedException}
If the session associated with this {@link Workspace} object does not have
sufficient permissions to perform the import. 
	 * @throws {@link RepositoryException}
is another error occurs. 
	 * @todo Determine if feasiable within PHP 
	 * @see phpCR_Workspace::importXML()
	 */
	public function importXML( $parentAbsPath,  $in,  $uuidBehavior) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @param string
The path of the node to be moved. 
	 * @param string
The location to which the node at <i>$srcAbsPath</i> is to be
moved. 
	 * @throws {@link ConstraintViolationException}
If the operation would violate a node-type or other 
implementation-specific constraint 
	 * @throws {@link VersionException}
If the parent node of <i>$destAbsPath</i> or the parent node 
of <i>$srcAbsPath</i> is versionable and checked-in, or is
non-versionable but its nearest versionable ancestor is checked-in. 
	 * @throws {@link AccessDeniedException}
If the current session (i.e. the session that was used to aqcuire 
this {@link Workspace} object) does not have sufficient access rights
to complete the operation. 
	 * @throws {@link PathNotFoundException}
If the node at <i>$srcAbsPath</i> or the parent of 
<i>$destAbsPath</i> does not exist. 
	 * @throws {@link ItemExistsException}
If a property already exists at <i>$destAbsPath</i> or a node
already exist there, and same name siblings are not allowed. 
	 * @throws {@link LockException}
If a lock prevents the move. 
	 * @throws {@link RepositoryException}
If the last element of <i>$destAbsPath</i> has an index or if
another error occurs. 
	 * @see phpCR_Workspace::move()
	 */
	public function move($srcAbsPath, $destAbsPath) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @param array
The set of versions to be restored 
	 * @param boolean
Governs what happens on UUID collision. 
	 * @throws {@link ItemExistsException}
If <i>$removeExisting</i> is <i>$false</i> and a UUID
collision occurs with a node being restored. 
	 * @throws {@link UnsupportedRepositoryOperationException}
If one or more of the nodes to be restored is not versionable. 
	 * @throws {@link VersionException}
If the set of versions to be restored is such that the original path 
location of one or more of the versions cannot be determined or if
the <i>$restore</i> would change the state of a existing 
verisonable node that is currently checked-in or if a root version 
(<i>jcr:rootVersion</i>) is among those being restored. 
	 * @throws {@link LockException}
If a lock prevents the restore. 
	 * @throws {@link InvalidItemStateException}
If this {@link Session} (not necessarily this <i>Node</i>) has
pending unsaved changes. 
	 * @throws {@link RepositoryException}
If another error occurs. 
	 * @see phpCR_Workspace::restore()
	 */
	public function restore($versions, $removeExisting) {
		
	//TODO - Insert your code here
	}
}

?>
