<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * View which sets XML content type headers.
 * @author   Silvan Zurbruegg
 */
class api_views_xmlhead extends api_views_default {
    protected function setHeaders() {
        parent::setHeaders();
        $this->setXMLHeaders();
    }
}

