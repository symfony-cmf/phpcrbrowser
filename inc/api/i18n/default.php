<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * I18N retriever which loads messages directly from the language catalog
 * files.
 *
 * The catalog files have the following format:
 * \code
 * <?xml version="1.0"?>
 * <catalogue>
 *     <message key="Associate">Link</message>
 *     <message key="CHF">CHF</message>
 * </catalogue>
 * \endcode
 *
 * XIncludes are supported in the catalogue files.
 *
 * The file names are based on the configuration. The file name is
 * constructed like this:
 * <tt>lang['dir'] + "/" + lang['fileprefix'] + "_" + $lang + ".xml"</tt>
 * where lang['dir'] and lang['fileprefix'] are configuration values and
 * <tt>$lang</tt> is the language given to the contructor.
 *
 * @config <b>lang['dir']</b> (string): The directory where the language
 *         files are located.
 * @config <b>lang['fileprefix']</b> (string): Prefix prepended to the
 *         language file names.
 * @config <b>lang['default']</b> (string): The default language.
 */
class api_i18n_default {
    /** DOMXPath: XPath instance for the message catalogue. */
    protected $xp = null;

    /**
     * Constructor.
     *
     * @param $lang string: Language to return strings for.
     * @param $cfg array: Relevant configuration node from the config file.
     */
    public function __construct($lang, $cfg) {
        $this->openFile($lang, $cfg);
    }

    /**
     * Return the language key with the given key.
     *
     * There are three possible return values:
     *    - Empty string: when the key isn't available in the catalogue.
     *    - Array: when the asXML attribute was specified for the given
     *             message. This is used to specify that the value
     *             should be inserted as an XML fragment instead of a
     *             string. This is necessary when the message file should
     *             contain HTML formatting.
     *             The array contains the two keys 'type' which is always
     *             set to 'fragment' and 'xml' which contains the actual
     *             message from the catalogue.
     *    - String: Translated message when it was found and doesn't
     *              have the asXML attribute specified.
     *
     * @param $key string: Key to look up in the catalogue file. Keys are
     *             case sensitive.
     * @return mixed: Message value as described above.
     */
    public function get($key) {
        $nodes = $this->xp->query("/catalogue/message[@key='".$key."']");
        if (!$nodes || $nodes->length == 0) {
            return '';
        }

        $node = $nodes->item(0);
        if ($node->getAttribute("asXML") == 'yes') {
            return array('type' => 'fragment', 'xml' => $node->nodeValue);
        } else {
            return $node->nodeValue;
        }
    }

    /**
     * Open language file and initialize the DOMXPath object.
     *
     * @param $lang string: Language to load catalogue file for.
     * @param $cfg array: Relevant configuration node from the config file.
     */
    protected function openFile($lang, $cfg) {
        $file = $cfg['dir']."/".$cfg['fileprefix']."_".$lang.".xml";

        if (!file_exists($file)) {
            $defL = $cfg['default'];
            $file = $cfg['dir']."/".$cfg['fileprefix']."_".$defL.".xml";
        }

        if (!file_exists($file)) {
            die("Language file not found: $file\n");
        }

        $dom = new DOMDocument();
        if (! $dom->load($file)) {
            die("Could not load language file: $file\n");
        }

        $dom->xinclude();
        $this->xp = new DOMXPath($dom);
    }
}
?>