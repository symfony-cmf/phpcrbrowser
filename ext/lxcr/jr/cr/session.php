<?php

class jr_cr_session implements phpCR_Session {

    public $storage = null;
    protected $rootNode = null;
    protected $nodes = array();
    protected $modifiedNodes = array();
    public $JRsession = null;

    /**
     * Enter description here...
     *
     * @var Zend_Cache_Core
     */
    public $cache = null;
    /**
     * Workspace
     *
     * @var jr_cr_workspace
     */
    protected $workspace = null;
    /**
     *
     */
    function __construct($session, $workspacename, $storage) {
        $this->JRsession = $session;
        $this->workspace = new jr_cr_workspace($this->JRsession->getWorkspace(), $this);

        $frontendOptions = array('lifetime' => 1800, // cache lifetime in seconds
'automatic_serialization' => true);

        $backendOptions = array('cache_dir' => '/tmp/')// Directory where to put the cache files
;

        // getting a Zend_Cache_Core object
        $this->cache = Zend_Cache::factory('Core', 'File', $frontendOptions, $backendOptions);

    //TODO - Insert your code here
    }

    /**
     *
     * @param string
     * @see phpCR_Session::addLockToken()
     */
    public function addLockToken($lt) {

    //TODO - Insert your code here
    }

    /**
     *
     * @throws {@link AccessControlException}
If permission is denied.
     * @throws {@link RepositoryException}
If another error occurs.
     * @see phpCR_Session::checkPermission()
     */
    public function checkPermission($absPath, $actions) {

    //TODO - Insert your code here
    }

    /**
     *
     * @param absPath The path of the root of the subtree to be serialized.
This must be the path to a node, not a property
     * @param out The <i>OutputStream</i> to which the XML
serialization of the subtree will be output.
     * @param skipBinary A <i>boolean</i> governing whether binary
properties are to be serialized.
     * @param noRecurse A <i>boolean</i> governing whether the subtree at
absPath is to be recursed.
     * @throws {@link PathNotFoundException}
If no node exists at <i>absPath</i>.
     * @throws {@link IOException}
If an error during an I/O operation occurs.
     * @throws {@link RepositoryException}
If another error occurs.
     * @todo Determine how to handle this
     * @see phpCR_Session::exportDocumentView()
     */
    public function exportDocumentView($absPath, $out, $skipBinary, $noRecurse) {

        $this->JRsession->exportDocumentView($absPath, $out, $skipBinary, $noRecurse);
    }

    /**
     *
     * @param absPath The path of the root of the subtree to be serialized.
This must be the path to a node, not a property
     * @param skipBinary A <i>boolean</i> governing whether binary
properties are to be serialized.
     * @param noRecurse A <i>boolean</i> governing whether the subtree at
absPath is to be recursed.
     * @return object
A {@link http://us3.php.net/manual/en/ref.dom.php DOMDocument} object.
     * @throws {@link PathNotFoundException}
If no node exists at <i>$absPath</i>.
     * @throws {@link RepositoryException}
If another error occurs.
     * @see phpCR_Session::exportSystemView()
     */
    public function exportSystemView($absPath, $skipBinary, $noRecurse) {

    //TODO - Insert your code here
    }

    /**
     *
     * @param string
The name of an attribute passed in the credentials used to acquire
this session.
     * @return object
     * @see phpCR_Session::getAttribute()
     */
    public function getAttribute($name) {

    //TODO - Insert your code here
    }

    /**
     *
     * @return array
     * @see phpCR_Session::getAttributeNames()
     */
    public function getAttributeNames() {

    //TODO - Insert your code here
    }

    /**
     *
     * @param parentAbsPath the absolute path of a node under which (as child) the imported subtree will be
built.
     * @param uuidBehavior a four-value flag that governs how incoming UUIDs are handled.
     * @return an org.xml.sax.ContentHandler whose methods may be called to feed SAX events
into the deserializer.
     * @throws {@link PathNotFoundException}
If no node exists at <i>parentAbsPath</i> and this
implementation performs this validation immediately instead of waiting until {@link save()}.
     * @throws {@link ConstraintViolationException}
If the new subtree cannot be added to the node at
<i>parentAbsPath</i> due to node-type or other implementation-specific constraints,
and this implementation performs this validation immediately instead of waiting until {@link save()}.
     * @throws {@link VersionException}
If the node at <i>parentAbsPath</i> is versionable
and checked-in, or is non-versionable but its nearest versionable ancestor is checked-in and this
implementation performs this validation immediately instead of waiting until {@link save()}..
     * @throws {@link LockException}
If a lock prevents the addition of the subtree and this
implementation performs this validation immediately instead of waiting until {@link save()}..
     * @throws {@link RepositoryException}
If another error occurs.
     * @todo Determine how to handle this...
     * @see phpCR_Session::getImportContentHandler()
     */
    public function getImportContentHandler($parentAbsPath, $uuidBehavior) {

    //TODO - Insert your code here
    }

    /**
     *
     * @param string
     * @return object
A {@link Item} object
     * @throws {@link PathNotFoundException}
If the specified path cannot be found.
     * @throws {@link RepositoryException}
If another error occurs.
     * @see phpCR_Session::getItem()
     */
    public function getItem($absPath) {
        if ($absPath == '' || $absPath == '/') {
            return $this->getRootNode();
        }

        return $this->getRootNode()->getNode($absPath);
    }

    /**
     *
     * @return array
     * @see phpCR_Session::getLockTokens()
     */
    public function getLockTokens() {

    //TODO - Insert your code here
    }

    /**
     *
     * @param string
     * @return string
     * @throws {@link NamespaceException}
If the URI is unknown.
     * @throws {@link RepositoryException}
If another error occurs
     * @see phpCR_Session::getNamespacePrefix()
     */
    public function getNamespacePrefix($uri) {

    //TODO - Insert your code here
    }

    /**
     *
     * @return array
     * @throws {@link RepositoryException}
If an error occurs
     * @see phpCR_Session::getNamespacePrefixes()
     */
    public function getNamespacePrefixes() {

    //TODO - Insert your code here
    }

    /**
     *
     * @param string
     * @return string
     * @throws {@link NamespaceException}
If the prefix is unknown.
     * @throws {@link RepositoryException}
If another error occurs
     * @see phpCR_Session::getNamespaceURI()
     */
    public function getNamespaceURI($prefix) {

    //TODO - Insert your code here
    }

    /**
     * Returns the node specifed by the given UUID.
     *
     * Only applies to nodes that expose a UUID, in other words, those of
     * mixin node type <i>mix:referenceable</i>
     *
     * @param string
     * @return object
     *  A {@link Node} object
     *
     * @throws {@link ItemNotFoundException}
     *    If the specified UUID is not found.
     * @throws {@link RepositoryException}
     *    If another error occurs.
     */

    public function getNodeByUUID($uuid) {
        $JRnode = $this->JRsession->getNodeByUUID($uuid);
        $node = new jr_cr_node($this, $JRnode);
        if ($node) {
            $this->addNodeToList($node);
            return $node;
        } else {
            return null;
        }

    }

    /**
     * Returns the node specifed by the given UUID.
     *
     * Only applies to nodes that expose a UUID, in other words, those of
     * mixin node type <i>mix:referenceable</i>
     *
     * @param string
     * @return object
     *  A {@link Node} object
     *
     * @throws {@link ItemNotFoundException}
     *    If the specified UUID is not found.
     * @throws {@link RepositoryException}
     *    If another error occurs.
     */

    public function getNodeByPath($JRnode) {
        $path = $JRnode->getPath();
        if (! $path) {
            return null;
        }
        $node = $this->getFromNodesList($path);
        if ($node) {
            return $node;
        }

        $node = new jr_cr_node($this, $JRnode);
        if ($node) {
            $this->addNodeToList($node);
            return $node;
        } else {
            return null;
        }
    }

    /**
     *
     * @return object
A {@link Repository} object
     * @see phpCR_Session::getRepository()
     */
    public function getRepository() {

    //TODO - Insert your code here
    }

    /**
     * Returns the root node of the workspace.
     *
     * The root node, "/", is the main access point to the content of the
     * workspace.
     *
     * @return jr_cr_node The root node of the workspace: a {@link Node} object.
     *
     * @throws {@link RepositoryException}
     *    If an error occurs.
     */

    public function getRootNode() {
        if ($this->rootNode === null) {
            $this->rootNode = new jr_cr_node($this, $this->JRsession->getRootNode());
            $this->addNodeToList($this->rootNode);
        }

        return $this->rootNode;
    }

    /**
     *
     * @return string
     * @see phpCR_Session::getUserID()
     */
    public function getUserID() {

    //TODO - Insert your code here
    }

    /**
     *
     * @return object
A {@link ValueFactory} object
     * @throws {@link UnsupportedRepositoryOperationException}
If writing to the repository is not supported.
     * @throws {@link RepositoryException}
If another error occurs.
     * @see phpCR_Session::getValueFactory()
     */
    public function getValueFactory() {
        return $this->JRsession->getValueFactory();
        //TODO - Insert your code here
    }

    /**
     *
     * @return jr_cr_workspace
A {@link Workspace} object
     * @see phpCR_Session::getWorkspace()
     */
    public function getWorkspace() {

        return $this->workspace;
    }

    /**
     *
     * @return boolean
     * @throws {@link RepositoryException}
If an error occurs
     * @see phpCR_Session::hasPendingChanges()
     */
    public function hasPendingChanges() {

    //TODO - Insert your code here
    }

    /**
     *
     * @param object
A {@link Credentials} object
     * @return object
A {@link Session} object
     * @throws {@link LoginException}
If the current session does not have sufficient rights.
     * @throws {@link RepositoryException}
If another error occurs.
     * @see phpCR_Session::impersonate()
     */
    public function impersonate(phpCR_Credentials $credentials) {

    //TODO - Insert your code here
    }

    /**
     *
     * @param parentAbsPath the absolute path of the node below which the deserialized subtree is added.
     * @param in The <i>Inputstream</i> from which the XML to be deserilaized is read.
     * @param uuidBehavior a four-value flag that governs how incoming UUIDs are handled.
     * @throws {@link java}
.io.IOException if an error during an I/O operation occurs.
     * @throws {@link PathNotFoundException}
If no node exists at <i>parentAbsPath</i> and this
implementation performs this validation immediately instead of waiting until {@link save()}..
     * @throws {@link ItemExistsException}
If deserialization would overwrite an existing item and this
implementation performs this validation immediately instead of waiting until {@link save()}..
     * @throws {@link ConstraintViolationException}
If a node type or other implementation-specific
constraint is violated that would be checked on a normal write method or if
<i>uuidBehavior</i> is set to <i>IMPORT_UUID_COLLISION_REMOVE_EXISTING</i>
and an incoming node has the same UUID as the node at <i>parentAbsPath</i> or one
of its ancestors.
     * @throws {@link VersionException}
If the node at <i>parentAbsPath</i> is versionable
and checked-in, or its nearest versionable ancestor is checked-in and this
implementation performs this validation immediately instead of waiting until {@link save()}..
     * @throws {@link InvalidSerializedDataException}
If incoming stream is not a valid XML document.
     * @throws {@link LockException}
If a lock prevents the addition of the subtree and this
implementation performs this validation immediately instead of waiting until {@link save()}..
     * @throws {@link RepositoryException}
if another error occurs.
     * @todo Determine how to handle this...
     * @see phpCR_Session::importXML()
     */
    public function importXML($parentAbsPath, $in, $uuidBehavior) {

    //TODO - Insert your code here
    }

    /**
     *
     * @return boolean
     * @see phpCR_Session::isLive()
     */
    public function isLive() {

    //TODO - Insert your code here
    }

    /**
     *
     * @param string
     * @return boolean
     * @throws {@link RepositoryException}
If an error occurs.
     * @see phpCR_Session::itemExists()
     */
    public function itemExists($absPath) {

    //TODO - Insert your code here
    }

    /**
     *
     * @see phpCR_Session::logout()
     */
    public function logout() {
        $this->JRsession->logout();
    }

    /**
     *
     * @param string
     * @param string
     * @throws {@link ItemExistsException}
If a property already exists at <i>destAbsPath</i> or a node
already exist there, and same name siblings are not allowed and this
implementation performs this validation immediately instead of
waiting until {@link save()}.
     * @throws {@link PathNotFoundException}
If either <i>srcAbsPath</i> or <i>destAbsPath</i> cannot
be found and this implementation performs this validation immediately
instead of waiting until {@link save()}.
     * @throws {@link VersionException}
If the parent node of <i>destAbsPath</i> or the parent node of
<i>srcAbsPath</i> is versionable and checked-in, or or is
non-verionable and its nearest versionable ancestor is checked-in and
this implementation performs this validation immediately instead of
waiting until {@link save()}.
     * @throws {@link ConstraintViolationException}
If a node-type or other constraint violation is detected immediately
and this implementation performs this validation immediately instead
of waiting until {@link save()}.
     * @throws {@link LockException}
If the move operation would violate a lock and this implementation
performs this validation immediately instead of waiting until
{@link save()}.
     * @throws {@link RepositoryException}
If the last element of <i>destAbsPath</i> has an index or
if another error occurs.
     * @see phpCR_Session::move()
     */
    public function move($srcAbsPath, $destAbsPath) {

    //TODO - Insert your code here
    }

    /**
     *
     * @param boolean
     * @throws {@link RepositoryException}
If an error occurs.
     * @see phpCR_Session::refresh()
     */
    public function refresh($keepChanges) {

    //TODO - Insert your code here
    }

    /**
     *
     * @param string
     * @see phpCR_Session::removeLockToken()
     */
    public function removeLockToken($lt) {

    //TODO - Insert your code here
    }

    /**
     *
     * @throws {@link AccessDeniedException}
If any of the changes to be persisted would violate the access
privileges of the this {@link Session}. Also thrown if  any of the
changes to be persisted would cause the removal of a node that is
currently referenced by a <i>REFERENCE</i> property that this
Session <i>does not</i> have read access to.
     * @throws {@link ItemExistsException}
If any of the changes to be persisted would be prevented by the
presence of an already existing item in the workspace.
     * @throws {@link LockException}
If any of the changes to be persisted would violate a lock.
     * @throws {@link ConstraintViolationException}
If any of the changes to be persisted would violate a node type or
restriction. Additionally, a repository may use this exception to
enforce implementation- or configuration-dependent restrictions.
     * @throws {@link InvalidItemStateException}
If any of the changes to be persisted conflicts with a change already
persisted through another session and the implementation is such that
this conflict can only be detected at save-time and therefore was not
detected earlier, at change-time.
     * @throws {@link ReferentialIntegrityException}
If any of the changes to be persisted would cause the removal of a
node that is currently referenced by a <i>REFERENCE</i> property
that this {@link Session} has read access to.
     * @throws {@link VersionException}
If the {@link save()} would make a result in a change to persistent
storage that would violate the read-only status of a checked-in node.
     * @throws {@link LockException}
If the {@link save()} would result in a change to persistent storage
that would violate a lock.
     * @throws {@link NoSuchNodeTypeException}
If the {@link save()} would result in the addition of a node with an
unrecognized node type.
     * @throws {@link RepositoryException}
If another error occurs.
     * @see phpCR_Session::save()
     */
    public function save() {
        foreach ($this->modifiedNodes as $node) {
            try {
                //$node->save();
            } catch (Exception $e) {
                //FIXME: throw an exception, if it can't be saved
                error_log(var_export($e, true));
            }
        }
        $this->JRsession->save();
        $this->modifiedNodes = array();
    }

    public function optimize() {
        $this->storage->optimize();
    }

    /**
     *
     * @param string
     * @param string
     * @throws {@link NamespaceException}
If the specified uri is not registered or an attempt is made to remap
to an illegal prefix.
     * @throws {@link RepositoryException}
If another error occurs.
     * @see phpCR_Session::setNamespacePrefix()
     */
    public function setNamespacePrefix($prefix, $uri) {

    //TODO - Insert your code here
    }

    public function addNodeToList($node) {
        $this->nodes[$node->getPath()] = $node;
    }

    public function addNodeToModifiedList($node) {

        $this->modifiedNodes[$node->getPath()] = $node;
    }

    public function getFromNodesList($path) {

        if (! isset($this->nodes[$path])) {
            return null;
        }
        return $this->nodes[$path];
    }

    public function parsePath($path, jr_cr_node $node, $noAbsolute = false) {
        if (! $noAbsolute && substr($path, 0, 1) == '/') {
            $node = $this->getRootNode();
            $path = substr($path, 1);
        }

        $parts = explode('/', $path);
        if (count($parts) == 1) {
            return array(array("node" => $node, "name" => $parts[0]));
        }

        $firstname = array_shift($parts);
        $paths = array();

        if ($firstname == '') {
            $nodes = $this->getAllDescendants($node);

            foreach ($nodes as $n) {
                $subnode = $n->getNode($parts[0]);

                if ($subnode) {

                    $ps = $this->parsePath($path, $n, true);
                    $paths = array_merge($paths, $ps);

                }

            }
            $firstname = array_shift($parts);
        }

        $subnode = $node->getNode($firstname);
        if ($subnode) {
            return array_merge($paths, $this->parsePath(substr($path, strlen($firstname) + 1), $subnode, true));
        } else {
            return $paths;
        }
        //return array("node" => $subnode, "name" => $parts[1]);
    /*var_dump($subnode->getName());
		var_dump($parts);
        if (count($parts) == 1) {
            return array("node"=>$subnode,"name" => $parts[0]);
        }
        */
    }

    protected function getAllDescendants(jr_cr_node $node) {
        $nodes = $node->getNodes();

        if (count($nodes) > 0) {
            foreach ($nodes as $n) {
                $nodes = array_merge($nodes, $this->getAllDescendants($n));
            }
        } else {
            $nodes = array();
        }
        return $nodes;
    }
}


