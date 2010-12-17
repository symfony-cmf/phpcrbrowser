<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * Memcached interface.
 *
 * Connects to some memcached servers based on the configuration
 * file. The key `memcache' in the configuration is expected to hold
 * this structure:
 *
 * \code
 * memcache:
 *    timeout: int
 *    host: [host1, host2, host3]
 * \endcode
 *
 * Timeout is the connection timeout in seconds. Hosts is an array of
 * memcached to connect to - the port can't currently be specified. If
 * no hosts or no memcache configuration at all is defined, then the class
 * connects to a memcached daemon running on localhost.
 *
 * This class implements the singleton pattern. Use api_cache::getInstance()
 * to get an object.
 *
 * The PHP module for memcache must be installed for this class to work.
 *
 * @see api_config
 * @see http://www.php.net/memcache - PHP memcache module
 */
class api_cache {
    /**
     * api_cache: Instance of this class which is returned in getInstance().
     */
    static protected $instance = null;

    /**
     * string: Prefix which is prefixed to all memcache key. This is
     * useful to invalidate all cache entries at one point by just changing
     * the prefix. The prefix is configured using the config value "revision".
     */
    protected $prefix = '';

    /**
     * Memcache: Memcache object which the object is proxying.
     */
    private $cache;

    /**
     * int: Controls how often a failed server will be retried. Value is
     * specified in seconds.
     */
    protected $timeout = 2;

    /**
     * Constructor. Reads configuration values and connects to the
     * memcached daemons.
     */
    private function __construct() {
        $this->cache = new Memcache();

        $this->prefix = api_config::getInstance()->revision;
        $servers = api_config::getInstance()->memcache;

        if (isset($servers['timeout'])) {
            $this->timeout = intval($servers['timeout']);
        }

        if ($servers && is_array($servers['host'])) {
            foreach($servers['host'] as $host) {
                if ($host) {
                    $this->connect($host);
                }
            }
        } else if ($servers && $servers['host']) {
            $this->connect($servers['host']);
        } else {
            $this->connect('localhost');
        }
    }

    /**
     * Get an object of type api_cache to use.
     * @return api_cache
     */
    public static function getInstance() {
        if (!isset(self::$instance)) {
            self::$instance = new api_cache;
        }

        return self::$instance;
    }

    /**
     * Connect to a memcached daemon. This is usually not required as
     * the constructor already takes care of this based on the
     * configuration.
     *
     * @param $server string - Hostname or IP address of the memcached server.
     * @param $port int: Port connect to.
     * @param $per bool: If the connection is to be kept alive.
     *                    permanently, .i.e. over more than one PHP request.
     * @param $weight int: Probability of this server to be selected.
     * @return bool: True on success
     * @see http://www.php.net/manual/en/function.memcache-addserver.php
     */
    public function connect($server, $port = 11211, $per = true, $weight = 1) {
        return $this->cache->addServer($server, $port, $per, $weight, $this->timeout, 15);
    }

    /**
     * Add a value to memcached but only if the given key doesn't exit
     * yet.
     *
     * @param $key string: Key to identify the value by.
     * @param $val mixed: Value to store.
     * @param $compressed bool: Compress the stored value.
     * @param $expire int: Expiration time of the entry. If set to 0 (default)
     *                     the item doesn't expire. Otherwise use a Unix timestamp
     *                     or number of seconds starting from the current time.
     * @return bool: True on success, false on failure or if the key already exists.
     * @see http://www.php.net/manual/en/function.memcache-add.php
     */
    public function add($key, $val, $compressed = false, $expire = 0) {
        $key = $this->normalizeKey($key);
        return $this->cache->add($this->prefix.$key, $val, $compressed, $expire);
    }

    /**
     * Delete an item in memcache.
     *
     * @param $key string: Key of the item to delete.
     * @param $timeout int: If specified, the item will expire after
     *                      $timeout seconds.
     * @return bool: True on success.
     * @see http://www.php.net/manual/en/function.memcache-delete.php
     */
    public function del($key, $timeout = 0) {
        $key = $this->normalizeKey($key);
        if ($timeout > 0) {
            return $this->cache->delete($this->prefix.$key, $timeout);
        } else {
            return $this->cache->delete($this->prefix.$key);
        }
    }

    /**
     * Delete all items in memcache.
     * @return bool: True on success.
     * @see http://www.php.net/manual/en/function.memcache-flush.php
     */
    public function flush() {
        return $this->cache->flush();
    }

    /**
     * Get an item from memcache. Returns the value which was stored.
     * Returns false if the item can't be found. If the passed keys was an
     * array, the return value with all found key-value pairs.
     * @param $keys string|array: Key of item to find or an array of all
     *                            keys to return.
     * @return mixed|array: Value(s) retrieved from memcached.
     * @see http://www.php.net/manual/en/function.memcache-get.php
     */
    public function get($keys) {
        if (is_array($keys)) {
            return $this->getWithArray($keys);
        } else {
            $keys = $this->prefix . $this->normalizeKey($keys);
            return $this->cache->get($keys);
        }
    }

    /**
     * get() submethod when requested with an array of keys.
     * All keys need to have the prefix added and that prefix
     * needs to be removed again from the returned keys.
     */
    protected function getWithArray($keys) {
        foreach ($keys as $key => $value) {
            $keys[$key] = $this->prefix . $this->normalizeKey($value);
        }

        $retval = $this->cache->get($keys);

        $prefixLen = strlen($this->prefix);
        $newretval = array();
        foreach ($retval as $key => $value) {
            $newretval[substr($key, $prefixLen)] = $value;
        }
        return $newretval;
    }

    /**
     * Replace value of the existing item. Returns false if the key doesn't
     * exist yet.
     * @param $key string: Key of item to replace.
     * @param $val mixed: Value to store.
     * @param $compressed bool: Compress the stored value.
     * @param $expire int: Expiration time of the entry. If set to 0 (default)
     *                     the item doesn't expire. Otherwise use a Unix timestamp
     *                     or number of seconds starting from the current time.
     * @return bool: True when item existed and was replaced.
     * @see http://www.php.net/manual/en/function.memcache-replace.php
     */
    public function replace($key, $val, $compressed = false, $expire = 0) {
        $key = $this->normalizeKey($key);
        return $this->cache->replace($this->prefix.$key, $val, $compressed, $expire);
    }

    /**
     * Store a value in memcache.
     * @param $key string: Key of item to set.
     * @param $val mixed: Value to store.
     * @param $compressed bool: Compress the stored value.
     * @param $expire int: Expiration time of the entry. If set to 0 (default)
     *                     the item doesn't expire. Otherwise use a Unix timestamp
     *                     or number of seconds starting from the current time.
     * @return bool: True on success.
     * @see http://www.php.net/manual/en/function.memcache-set.php
     */
    public function set($key, $val, $compressed = false, $expire = 0) {
        $key = $this->normalizeKey($key);
        return $this->cache->set($this->prefix.$key, $val, $compressed, $expire);
    }

    /**
     * Returns server statistics.
     * @return bool|array: A two-dimensional associative array of server
     *                     statistics or false in case of failure.
     * @see http://www.php.net/manual/en/function.memcache-getextendedstats.php
     */
    public function getExtendedStats() {
        return $this->cache->getExtendedStats();
    }

    /**
     * Increment a value by 1. Sets the value to 1 if it doesn't exist yet.
     * @param $key string: Key of item to increment.
     * @return int: New value of the item.
     * @see http://ch2.php.net/manual/en/function.memcache-increment.php
     */
    public function increment($key) {
        $key = $this->normalizeKey($key);
        $value = $this->cache->increment($this->prefix.$key);
        if (intval($value) > 0) {
            return $value;
        } else {
            $this->set($key, 1);
            return 1;
        }
    }

    /**
     * Normalize the memcache keys.
     */
    protected function normalizeKey($key) {
        return str_replace(' ', '_', $key);
    }
}
