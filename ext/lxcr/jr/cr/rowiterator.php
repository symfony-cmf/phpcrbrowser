<?php


class jr_cr_rowiterator implements phpCR_RowIterator {


    protected $JRrowiterator = null;
    /**
     *
     */
    function __construct($jrrowiterator,$session) {
        $this->session = $session;
        $this->JRrowiterator = $jrrowiterator;
    }


    /**
     *
     * @return object
A {@link Row} object
     * @throws {@link NoSuchElementException}
If iteration has no more {@link Row}s.
     * @see phpCR_RowIterator::nextRow()
     */
    public function nextRow() {

      try {
            $n = $this->JRrowiterator->nextRow();
        } catch (Exception $e) {
            return null;
        }
        return new jr_cr_row($n);
    }

    /**
     *
     * @return int
     * @see phpCR_RangeIterator::getPosition()
     */
    public function getPosition() {

    //TODO - Insert your code here
    }

    /**
     *
     * @return int
     * @see phpCR_RangeIterator::getSize()
     */
    public function getSize() {

return $this->JRrowiterator->getSize();

    }

    /**
     *
     * @param int
The non-negative number of elements to skip
     * @throws {@link NoSuchElementException}
If skipped past the last element in the iterator.
     * @see phpCR_RangeIterator::skip()
     */
    public function skip($skipNum) {

    //TODO - Insert your code here
    }

    /**
     *
     * @see Iterator::current()
     */
    public function current() {

    //TODO - Insert your code here
    }

    /**
     *
     * @see Iterator::key()
     */
    public function key() {

    //TODO - Insert your code here
    }

    /**
     *
     * @see Iterator::next()
     */
    public function next() {

    //TODO - Insert your code here
    }

    /**
     *
     * @see Iterator::rewind()
     */
    public function rewind() {

    //TODO - Insert your code here
    }

    /**
     *
     * @see Iterator::valid()
     */
    public function valid() {

    //TODO - Insert your code here
    }
}

