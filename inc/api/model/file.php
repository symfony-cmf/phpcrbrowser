<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Returns a file as a DOM. The file must be valid XML as it's loaded
 * directly using DOMDocument::load().
 *
 * @author   Patrice Neff
  */
class api_model_file extends api_model {
    /** DOMDocument: The loaded document. */
    protected $dom = null;

    /**
     * Create a new data object which returns a file as DOM.
     *
     * @param $file string: Full name of the file to load on the file system.
     * @exception api_exception_FileNotFound if the file doesn't exist.
     * @exception api_exception_XmlParseError if the file can't be parsed
     *            as XML.
     */
    public function __construct($file) {
        if (! file_exists($file)) {
            throw new api_exception_FileNotFound(api_exception::THROW_FATAL, $file);
            return false;
        }

        $this->dom = DOMDocument::load($file);
        if ($this->dom === false) {
            throw new api_exception_XmlParseError(api_exception::THROW_FATAL, $file);
        }
    }

    public function getDOM() {
        return $this->dom;
    }
}
