<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Interface for database drivers.
 */
interface api_Idb {
    /**
     * Return a valid connection to the database.
     * @param $config array: Configuration for the connection to load.
     */
    public function getDBConnection($config);
}
