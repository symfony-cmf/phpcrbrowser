<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * View which sets text/plain content type headers.
 * @author   Silvan Zurbruegg
 */
class api_views_plain extends api_views_default {
    /**
     * Sends text/plain Content-type
     */
    protected function setHeaders() {
        parent::setHeaders();
        $this->response->setContentType('text/plain');
    }
}
