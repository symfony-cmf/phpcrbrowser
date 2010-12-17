<?php





class jr_cr_nodeiterator  implements phpCR_NodeIterator{

       protected $JRnodeiterator = null;
    /**
     *
     */
    function __construct($jrnodeiterator,$session) {
        $this->session = $session;
        $this->JRnodeiterator = $jrnodeiterator;
    }

    /**
     *
     * @return object
     * @throws {@link NoSuchElementException}
If iteration has no more {@link Node}s.
     * @see phpCR_NodeIterator::nextNode()
     */
    public function nextNode() {

        try {
            $n = $this->JRnodeiterator->nextNode();
        } catch (Exception $e) {
            return null;
        }
        return new jr_cr_node($this->session,$n);
    }


  /**
   *
   * @return int
    * @see phpCR_RangeIterator::getPosition()
*/
  public  function getPosition() {

      //TODO - Insert your code here
  }

  /**
   *
   * @return int
    * @see phpCR_RangeIterator::getSize()
*/
  public  function getSize() {

    return $this->JRnodeiterator->getSize();

  }

  /**
   *
   * @param int
The non-negative number of elements to skip
   * @throws {@link NoSuchElementException}
If skipped past the last element in the iterator.
    * @see phpCR_RangeIterator::skip()
*/
  public  function skip($skipNum) {

      //TODO - Insert your code here
  }

  /**
   *
    * @see Iterator::current()
*/
  public  function current() {

      //TODO - Insert your code here
  }

  /**
   *
    * @see Iterator::key()
*/
  public  function key() {

      //TODO - Insert your code here
  }

  /**
   *
    * @see Iterator::next()
*/
  public  function next() {

      //TODO - Insert your code here
  }

  /**
   *
    * @see Iterator::rewind()
*/
  public  function rewind() {

      //TODO - Insert your code here
  }

  /**
   *
    * @see Iterator::valid()
*/
  public  function valid() {

      //TODO - Insert your code here
  }
}

