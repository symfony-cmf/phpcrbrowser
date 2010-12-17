<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * This class translates strings from the language files.
 * It is configured by the `lang' nodes in the config file.
 *
 * Implements Cocoon's i18n functions but with some additions and not
 * exactly according to their specifications.
 *
 * The following Cocoon i18n behaviours are implemented:
 *   - i18n:text
 *   - i18n:param
 *   - i18n:attr
 *
 * Additionally a construct called i18n:cleartext is implemented.
 * That is used for cases where the XSLT generates text instead
 * of XML. In that case the normal i18n:text introduces unneeded
 * newlines and paragraphs, which is prevented with i18n:cleartext.
 *
 * The following is an example for i18n:cleartext:
 *
 * \code
 * <i18n:cleartext>
 *     <i18n:text>ClassifiedTitle</i18n:text>
 *     <i18n:prepend>- </i18n:prepend>
 *     <i18n:append>
 *         <xsl:text>: </xsl:text>
 *         <xsl:value-of select="/mail/classified/title" />
 *         <i18n:text> ClassifiedTitlePostfix</i18n:text>
 *     </i18n:append>
 * </i18n:cleartext>
 * \endcode
 *
 * i18n:append and i18n:prepend are added to the basic string without
 * automatic newlines or spaces.
 *
 * @see http://cocoon.apache.org/2.1/userdocs/i18nTransformer.html Cocoon I18N functions
 * @config <b>lang['retriever']</b> (string): Defines the retriever to use. "api_i18n_"
 *         is prepended to the name to get a class name to load. Set to "default" by
 *         by default, thus api_i18n_default is the default retriever.
 */
class api_i18n {
    /** array: Instances as returned by the getInstance() method.
     * One instance is stored for each language. */
    private static $instances = array();

    /** string: Namespace used in the XML documents to find i18n nodes. */
    private $ns = 'http://apache.org/cocoon/i18n/2.1';

    /** api_i18n_*: The retriever used to get language strings.
     * @see api_i18n_default
     */
    private $retriever = null;

    /**
     * Private constructor. Use the getInstance() method to get objects
     * of this class. Loads the retriever class as well.
     *
     * @param $lang string: Language into which this object will translate.
     */
    private function __construct($lang) {
        $this->lang = $lang;
        $this->loadRetriever($lang);
    }

    /**
     * Return a new instance of this class for the given language.
     *
     * @param $lang string: Language into which the object will translate.
     */
    public static function getInstance($lang) {
        if (!isset(self::$instances[$lang])) {
            self::$instances[$lang] = new api_i18n($lang);
        }
        return self::$instances[$lang];
    }

    /**
     * Get the translation for a key for a certain language. This method
     * is intended for commands to retrieve single translations. To
     * transform documents the i18n() must should be used.
     *
     * @param $lang string: Language to translate into.
     * @param $key string: Language key to retrieve translation for.
     */
    public static function getMessage($lang, $key) {
        $i = self::getInstance($lang);
        return $i->i18nGetMessage($key);
    }

    /**
     * Transforms the given XML document by changing all nodes in the i18n
     * namespace to it's translation.
     *
     * @param $xmldoc DOMDocument: XML document to translate.
     */
    public function i18n($xmldoc) {
        $xp = new DOMXPath($xmldoc);
        if (!$xp instanceof DOMXPath) {
            return false;
        }

        $xp->registerNamespace("i18n", $this->ns);
        $nodes = $xp->query("//i18n:*");
        if ($nodes->length > 0) {
            foreach($nodes as $node) {
                // Node may already have been deleted, especially because of i18nTranslate
                if (! $node->parentNode)
                    continue;

                // more types to be added
                switch($node->localName) {
                    case "translate":
                        $this->i18nTranslate($node, $xp);
                        break;
                    case "cleartext":
                        $this->i18nCleartext($node, $xp);
                        break;
                    case "param":
                    case "append":
                    case "prepend":
                        break;
                    case "text":
                    default:
                        $this->i18nTranslateText($node);
                        break;
                }
            }
        }

        $attrs = $xp->query("//@i18n:attr");
        if ($attrs->length > 0) {
            $attrNodes = array();
            foreach($attrs as $attr) {
                $lookupKey = trim($attr->parentNode->getAttribute($attr->nodeValue));
                $value = $this->i18nGetMessage($lookupKey);
                if($value == '') {
                    $value = $lookupKey;
                }

                $attr->parentNode->setAttribute($attr->nodeValue, $value);
                $attrNodes[] = $attr->parentNode;
            }

            // Need to remove attributes outside of for-loop
            foreach ($attrNodes as $node) {
                $node->removeAttribute("i18n:attr");
            }
        }

        return true;
    }


    /**
     * Handles the i18n:translate nodes. Performs translations
     * on all i18n:text nodes inside the parameters as well.
     *
     * If the <i18n:translate> XML node has the asXML attribut set, then
     * the translated content is handled and inserted as XML.
     *
     * @param $node DOMNode: Root node of the i18n:translate construct.
     * @param $xp DOMXPath: Instance of DOMXPath of $node's document.
     *                      Passed in for performance reasons.
     */
    private function i18nTranslate($node, $xp) {
        $i = 0;
        $params = array();

        // Get text to replace params on.
        $text = $xp->query('i18n:text', $node);
        if ($text->length < 1) {
            return false;
        } else {
            $text = $this->i18nGetMessage($text->item(0)->nodeValue);
        }

        // Get all parameter values, translate child i18n:text nodes.
        $prmNodes = $xp->query('i18n:param', $node);
        foreach ($prmNodes as $paramNode) {
            $paramChildren = $xp->query('i18n:text', $paramNode);
            if ($paramChildren->length > 0) {
                foreach ($paramChildren as $paramChild) {
                    $this->i18nTranslateText($paramChild);
                }
            }
            $paramValue = str_replace('&', '&amp;', $paramNode->nodeValue);
            $paramValue = str_replace('"', '&quot;', $paramValue);

            if ($name = $paramNode->getAttribute("name")) {
                $params[$name] = $paramValue;
            }
            $params[$i] = $paramValue;
            $i++;
            $node->removeChild($paramNode);
        }

        // Substitue parameters
        $value = $text;
        $value = preg_replace("/\{([a-zA-Z0-9_]*)\}/e","\$params['$1']",$value);
        if ($node->getAttribute("asXML")) {
            $f = $node->ownerDocument->createDocumentFragment();

            if (is_array($value)) {
                if ($value['type'] == 'fragment') {
                    $f->appendXML($value['xml']);
                }
            } else {
                $f->appendXML($value);
            }
        } else {
            $f = $node->ownerDocument->createTextNode($value);
        }
        $node->parentNode->replaceChild($f,$node);

        return $f;
    }

    /**
     * Handles i18n:cleartext constructs.
     *
     * @param $node DOMNode: Root node of the i18n:cleartext construct.
     * @param $xp DOMXPath: Instance of DOMXPath of $node's document.
     *                      Passed in for performance reasons.
     */
    private function i18nCleartext($node, $xp) {
        $text = '';

        $translateNode = $xp->query('i18n:translate');
        $textNode = $xp->query('i18n:text', $node);
        if ($translateNode->length > 0) {
            $textNode = $this->i18nTranslate($translateNode->item(0), $xp);
            $text = $textNode->nodeValue;
        } else  if ($textNode->length > 0) {
            $textNode = $textNode->item(0);
            $text = $this->i18nGetMessage($textNode->nodeValue);
        } else {
            return;
        }

        $append = $this->getClearTextPart('append', $node, $xp);
        if ($append != '') {
            $text .= $append;
        }

        $prepend = $this->getClearTextPart('prepend', $node, $xp);
        if ($prepend != '') {
            $text = $prepend . $text;
        }

        $f = $node->ownerDocument->createTextNode($text);
        $node->parentNode->replaceChild($f, $node);
    }

    /**
     * Helper for i18nCleartext to get append/prepend parts. Translates
     * all i18n:text nodes inside the found node.
     *
     * @param $part string: Node name to retrieve value for.
     * @param $node DOMNode: Root node of the i18n:translate construct.
     * @param $xp   DOMXPath: Instance of DOMXPath of $node's document.
     *                        Passed in for performance reasons.
     */
    private function getClearTextPart($part, $node, $xp) {
        $partNode = $xp->query('i18n:' . $part, $node);
        if ($partNode->length == 0) {
            return '';
        }
        $partNode = $partNode->item(0);

        // Replace i18n:text children
        $children = $xp->query('i18n:text', $partNode);
        foreach ($children as $child) {
            $this->i18nTranslateText($child);
        }

        return $partNode->nodeValue;
    }

    /**
     * Translate i18n:text constructs. Uses the key attribute of the node
     * as the translation key. If that is not available, uses the
     * nodeValue of the node.
     *
     * The translation for the key replaces the i18n:text node. If
     * the escapejs attribute of the i18n:text node is set, then
     * the translation is escaped using api_helpers_string::escapeJSValue()
     * first.
     *
     * @param $node DOMNode: i18n:text node.
     */
    private function i18nTranslateText($node) {
        $key = $text = '';
        if ($node->hasAttributeNS($this->ns,"key")) {
            $key = $node->getAttributeNS($this->ns,"key");
        } else {
            $key = $node->nodeValue;
        }

        if (!empty($key)) {
            $text = $this->i18nGetMessage($key);
            if ($node->hasAttribute("escapejs")) {
                $text = api_helpers_string::escapeJSValue($text);
            }

            if (is_array($text)) {
                if ($text['type'] == 'fragment') {
                    $f = $node->ownerDocument->createDocumentFragment();
                    $f->appendXML($text['xml']);
                }
            } else {
                $text = (empty($text)) ? $node->nodeValue : $text;
                $f = $node->ownerDocument->createTextNode($text);
            }

            $node->parentNode->replaceChild($f, $node);
        }
    }

    /**
     * Gets the language string with the given key from the retriever.
     *
     * @param $key string: Key of the language string to return.
     * @return string: Translation string from the language file.
     */
    private function i18nGetMessage($key) {
        return $this->retriever->get($key);
    }

    /**
     * Loads the retriever. The i18n retriever defines how to get a
     * translation messages. The default gets them from the language
     * files directly in a case-sensitive way.
     *
     * Other strategies can be defined for example to pre-load
     * language keys into memcached, or to get them from a database.
     *
     * @param $lang string: Language to load the retriever for.
     */
    private function loadRetriever($lang) {
        $cfg = api_config::getInstance()->lang;
        $retriever = 'default';
        if (isset($cfg['retriever'])) {
            $retriever = $cfg['retriever'];
        }

        $classname = 'api_i18n_' . $retriever;
        $this->retriever = new $classname($lang, $cfg);
    }
}
