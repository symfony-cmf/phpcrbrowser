<?php



class lx_cr_property implements phpCR_Property {
	
	/**
	 * Enter description here...
	 *
	 * @var lx_cr_session
	 */
	protected $session = null;
	
	/**
	 * Enter description here...
	 *
	 * @var lx_cr_node
	 */
	protected $parentNode = null;
	protected $name = null;
	protected $value = null;
	protected $new = false;
	protected $modified = false;
	protected $path = null;
		
	/**
	 * Enter description here...
	 *
	 * @param string $name
	 * @param string $value
	 * @param lx_cr_node $parentNode
	 * @param int $type
	 */
    public function __construct($name, $value, lx_cr_node $parentNode, $type = 1) {
    
        $this->name = $name;
        $this->path = $parentNode->getPath() . '@'.$name;
        $this->value = $value;
        $this->type = $type;
        $this->parentNode = $parentNode;
        $this->session = $parentNode->getSession();
    }
	
	/**
	 * 
	 * @see Value::getBoolean() 
	 * @return bool
A boolean representation of the value of this {@link Property}. 
	 * @see phpCR_Property::getBoolean()
	 */
	public function getBoolean() {
		return (bool) $this->value;
	
	}
	
	/**
	 * 
	 * @see Value, Value::getDate() 
	 * @return object 
A date representation of the value of this {@link Property}. 
	 * @see phpCR_Property::getDate()
	 */
	public function getDate() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @see NodeType::getPropertyDefinitions() 
	 * @return object
A {@link PropertyDef} object 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Property::getDefinition()
	 */
	public function getDefinition() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @see getFloat(), Value::getDouble() 
	 * @return float 
	 * @see phpCR_Property::getDouble()
	 */
	public function getDouble() {
	   return (float) $this->value;	

	}
	
	/**
	 * 
	 * @see Value, Value::getFloat(), getDouble() 
	 * @return float
A float representation of the value of this {@link Property}. 
	 * @see phpCR_Property::getFloat()
	 */
	public function getFloat() {
       return (float) $this->value; 
		
	}
	
	/**
	 * 
	 * @see Value::getLong() 
	 * @return int
An integer representation of the value of this {@link Property}. 
	 * @see phpCR_Property::getInt()
	 */
	public function getInt() {
       return (int) $this->value; 
	}
	
	/**
	 * 
	 * @return int 
	 * @see phpCR_Property::getLength()
	 */
	public function getLength() {
       return strlen($this->value); 
	}
	
	/**
	 * 
	 * @see Value::getLong() 
	 * @return int
An integer representation of the value of this {@link Property}. 
	 * @see phpCR_Property::getLong()
	 */
	public function getLong() {
		
       return (int) $this->value; 
		
	}
	
	/**
	 * 
	 * @see Value, Value::getStream() 
	 * @return object|reference
A stream representation of the value of this {@link Property}. 
	 * @see phpCR_Property::getStream()
	 */
	public function getStream() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @see Value 
	 * @return string
A string representation of the value of this {@link Property}. 
	 * @see phpCR_Property::getString()
	 */
	public function getString() {
		     return (string) $this->value; 
	}
	
	/**
	 * 
	 * @return int 
	 * @throws {@link RepositoryException}
If an error occurs 
	 * @see phpCR_Property::getType()
	 */
	public function getType() {
		return $this->type;
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return object 
	 * @throws {@link ValueFormatException}
If the property is multi-valued. 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Property::getValue()
	 */
	public function getValue() {
		if ($this->value == '__lazyloading__') {
			
			$this->value = $this->session->storage->getPropertyValue($this->name,$this->parentNode,$this->type);
			
		}
       return  $this->value; 
		
	}
	
	/**
	 * 
	 * @return array
An array of {@link Value}s. 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Property::getValues()
	 */
	public function getValues() {
		
       return $this->value; 
	}
	
	/**
	 * 
	 * @param mixed
The new value to set the {@link Property} to. 
	 * @throws {@link ValueFormatException}
If the type or format of the specified value is incompatible with the 
type of this {@link Property}. 
	 * @throws {@link RepositoryException}
If another error occurs. 
	 * @see phpCR_Property::setValue()
	 */
	public function setValue($value) {
        $this->value = $value; 
	}
	
	/**
	 * 
	 * @param object
A {@link ItemVisitor} object 
	 * @throws {@link RepositoryException} 
If an error occurs. 
	 * @see phpCR_Item::accept()
	 */
	public function accept(phpCR_ItemVisitor $visitor) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @param int
An integer, 0 &lt;= $degree &lt;= n where 
n is the depth of $this {@link Item} along the
path returned by {@link getPath()}. 
	 * @return object
The ancestor of the specified absolute degree of $this
{@link Item} along the path returned by{@link getPath()}. 
	 * @throws {@link ItemNotFoundException}
If $degree &lt; 0 or $degree &gt; n
where n is the is the depth of $this {@link Item}
along the path returned by {@link getPath()}. 
	 * @throws {@link AccessDeniedException}
If the current {@link Ticket} does not have sufficient access rights to
complete the operation. 
	 * @throws {@link RepositoryException}
If another error occurs. 
	 * @see phpCR_Item::getAncestor()
	 */
	public function getAncestor($degree) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return int
The depth of this {@link Item} in the repository hierarchy. 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Item::getDepth()
	 */
	public function getDepth() {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @return string
The (or a) name of this {@link Item} or an empty string if this 
{@link Item} is the root {@link Node}. 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Item::getName()
	 */
	public function getName() {
        return $this->name;		
	}
	
	/**
	 * 
	 * @return object
The parent of this {@link Item} along the path returned by 
{@link getPath()}. 
	 * @throws {@link ItemNotFoundException}
If there is no parent.  This only happens if $this 
{@link Item} is the root node. 
	 * @throws {@link AccessDeniedException}
If the current {@link Ticket} does not have sufficient access rights to
complete the operation. 
	 * @throws {@link RepositoryException}
If another error occurs. 
	 * @see phpCR_Item::getParent()
	 */
	public function getParent() {
        return $this->parentNode;		
	
	}
	
	/**
	 * 
	 * @return string 
The path (or one of the paths) of this {@link Item}. 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Item::getPath()
	 */
	public function getPath() {
		return $this->path;
	}
	
	/**
	 * 
	 * @return object
A {@link Session} object 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Item::getSession()
	 */
	public function getSession() {
        return $this->session;		
	}
	
	/**
	 * 
	 * @return boolean 
	 * @see phpCR_Item::isModified()
	 */
	public function isModified() {
        return $this->modified;		
	}
	
	public function setModified($mod) {
		$this->modified = $mod;
	}
	
	/**
	 * 
	 * @return boolean 
	 * @see phpCR_Item::isNew()
	 */
	public function isNew() {
        return $this->new;		
	}
	
	 public function setNew($new) {
        $this->new = $new;
     }
	
	
	/**
	 * 
	 * @return bool 
Returns TRUE if this {@link Item} is a {@link Node};
Returns FALSE if this {@link Item} is a {@link Property}. 
	 * @see phpCR_Item::isNode()
	 */
	public function isNode() {
		return false;
	}
	
	/**
	 * 
	 * @param object
A {@link Item} object 
	 * @return boolean 
	 * @throws {@link RepositoryException}
If an error occurs. 
	 * @see phpCR_Item::isSame()
	 */
	public function isSame(phpCR_Item $otherItem) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @param boolean 
	 * @throws {@link InvalidItemStateException}
If this {@link Item} object represents a workspace item that has been
removed (either by this session or another). 
	 * @throws {@link RepositoryException}
If another error occurs. 
	 * @see phpCR_Item::refresh()
	 */
	public function refresh($keepChanges) {
		
	//TODO - Insert your code here
	}
	
	/**
	 * 
	 * @throws {@link VersionException}
If the parent node of this item is versionable and checked-in or is
non-versionable but its nearest versionable ancestor is checked-in 
and this implementation performs this validation immediately instead 
of waiting until {@link save()}. 
	 * @throws {@link LockException}
If a lock prevents the removal of this item and this implementation 
performs this validation immediately instead of waiting until 
{@link save()}. 
	 * @throws {@link ConstraintViolationException}
If removing the specified item would violate a node type or
implementation-specific constraint and this implementation performs 
this validation immediately instead of waiting until {@link save()}. 
	 * @throws {@link RepositoryException}
If another error occurs. 
	 * @see phpCR_Item::remove()
	 */
	public function remove() {
		
	 $this->session->storage->removeProperty($this);
	}
	
	/**
	 * 
	 * @throws {@link AccessDeniedException}
If any of the changes to be persisted would violate the access 
privileges of the this {@link Session}. Also thrown if any of the
changes to be persisted would cause the removal of a node that is
currently referenced by a <i>REFERENCE</i> property that this 
Session <i>does not</i> have read access to. 
	 * @throws {@link ItemExistsException}
If any of the changes to be persisted would be prevented by the
presence of an already existing 	item in the workspace. 
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
	 * @see phpCR_Item::save()
	 */
	public function save() {
		$this->session->storage->saveProperty($this);
		$this->setModified(false);
		$this->setNew(false);
	}
}


