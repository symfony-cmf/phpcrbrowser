<?php
/**
 * Base test case class for unit tests.
 */
class api_testing_case_unit extends UnitTestCase {
    
    /**
     * Gets the DOM node matching the given XPath expression.
     */
    protected function getNode($dom, $xpath) {
        return api_helpers_xpath::getNode($dom, $xpath);
    }
    
    /**
     * Asserts that the given node exists.
     */
    public function assertNode($dom, $xpath) {
        $this->assertNotNull($this->getNode($dom, $xpath), "No node found for $xpath");
    }
    
    /**
     * Asserts that the given node does not exist.
     */
    public function assertNotNode($dom, $xpath) {
        $this->assertNull($this->getNode($dom, $xpath), "Node found for $xpath but none was expected.");
    }
    
    /**
     * Gets the first result of the current page by XPath.
     */
    public function getText($dom, $xpath) {
        return api_helpers_xpath::getText($dom, $xpath);
    }
    
    /**
     * Asserts that the text retrieved by an XPath expression matches.
     */
    public function assertText($dom, $xpath, $expected, $message = '%s') {
        return $this->assertEqual($expected, $this->getText($dom, $xpath), $message);
    }
    
    /**
     * Asserts that the texts retrieved by an XPath expression matches.
     * The expected values are an array of texts, which have to match the
     * given XPath.
     */
    public function assertTexts($dom, $xpath, $expected, $message = '%s') {
        $texts = api_helpers_xpath::getTexts($dom, $xpath);
        foreach ($expected as $i => $value) {
            $this->assertEqual($texts[$i], $value, $message);
        }
        return true;
    }
    
    /**
     * Gets the first result of the current page by XPath.
     */
    public function getAttribute($dom, $xpath) {
        return api_helpers_xpath::getAttribute($dom, $xpath);
    }
    
    /**
     * Asserts that the attribute retrieved by an XPath expression matches.
     */
    public function assertAttribute($dom, $xpath, $expected, $message = '%s') {
        return $this->assertEqual($expected, $this->getAttribute($dom, $xpath), $message);
    }
    
    /**
     * Returns a DOM document loaded from the given fixture file.
     * $file can be:
     *    - null: Null is returned
     *    - Empty string: an empty DOMDocument is returned
     *    - Any string: is assumed to be a file name relative to the
     *      tests/fixtures directory
     */
    protected function loadFixtureXML($file) {
        if (is_null($file)) {
            return null;
        } else if ($file == '') {
            return new DOMDocument();
        } else {
            $file = API_PROJECT_DIR . "tests/fixtures/" . $file;
            $dom = new DOMDocument();
            $dom->load($file);
            return $dom;
        }
    }
}
