<?php


class jr_cr_row implements phpCR_Row {


    protected $JRrow = null;
    /**
     *
     */
    function __construct($jrrow) {
        $this->JRrow = $jrrow;


    }

    /**
     *
     * @return object
A {@link Value} object
     * @throws {@link ItemNotFoundException}
If <i>$propertyName</i> s not among the column names of the
query result table.
     * @throws {@link RepositoryException}
If another error occurs
     * @see phpCR_Row::getValue()
     */
    public function getValue($propertyName) {
        return $this->JRrow->getValue($propertyName);
    }

    /**
     *
     * @return array
     * @throws {@link RepositoryException}
If an error occurs
     * @see phpCR_Row::getValues()
     */
    public function getValues() {
         return $this->JRrow->getValues();
    }
}