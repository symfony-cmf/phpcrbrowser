<?php
/**
 * View which sets text/plain content type headers.
 */
class api_views_lxcr extends api_views_default {

    /**
     * Returns a merged DOMDocument of the given data and exception list.
     *
     * Data can be any of these three things:
     *    - DOMDocument: Used directly
     *    - string: Treated as an XML string and loaded into a DOMDocument
     *    - array: Converted to a DOMDocument using api_helpers_xml::array2dom
     *
     * The exceptions are merged into the DOM using the method
     * api_views_default::mergeExceptions()
     *
     * @param $data mixed: See above
     * @param $exceptions array: Array of exceptions merged into the DOM.
     * @return DOMDocument: DOM with exceptions
     */
    protected function getDom($data, $exceptions) {
        $xmldom = null;
        // Use DOM or load XML from string or array.
        if ($data instanceof DOMDocument) {
            $xmldom = $data;
        } else if (is_string($data) && !empty($data)) {
            $xmldom = DOMDocument::loadXML($data);
        } else if (is_array($data)) {
            @$xmldom = DOMDocument::loadXML("<command/>");
            api_helpers_xml::array2dom($data, $xmldom, $xmldom->documentElement);
        }

        if (count($exceptions) > 0) {
             $this->mergeExceptions($xmldom, $exceptions);
        }

        return $xmldom;
    }

}
