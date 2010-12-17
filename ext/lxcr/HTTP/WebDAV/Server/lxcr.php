<?php // $Id: Filesystem.php,v 1.46 2007/11/14 13:43:51 hholzgra Exp $
/*
   +----------------------------------------------------------------------+
   | Copyright (c) 2002-2007 Christian Stocker, Hartmut Holzgraefe        |
   | All rights reserved                                                  |
   |                                                                      |
   | Redistribution and use in source and binary forms, with or without   |
   | modification, are permitted provided that the following conditions   |
   | are met:                                                             |
   |                                                                      |
   | 1. Redistributions of source code must retain the above copyright    |
   |    notice, this list of conditions and the following disclaimer.     |
   | 2. Redistributions in binary form must reproduce the above copyright |
   |    notice, this list of conditions and the following disclaimer in   |
   |    the documentation and/or other materials provided with the        |
   |    distribution.                                                     |
   | 3. The names of the authors may not be used to endorse or promote    |
   |    products derived from this software without specific prior        |
   |    written permission.                                               |
   |                                                                      |
   | THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS  |
   | "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT    |
   | LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS    |
   | FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE       |
   | COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,  |
   | INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, |
   | BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;     |
   | LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER     |
   | CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT   |
   | LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN    |
   | ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE      |
   | POSSIBILITY OF SUCH DAMAGE.                                          |
   +----------------------------------------------------------------------+
*/

require_once "HTTP/WebDAV/Server.php";
require_once "System.php";

/**
 * Filesystem access using WebDAV
 *
 * @access  public
 * @author  Hartmut Holzgraefe <hartmut@php.net>
 * @version @package-version@
 */
class HTTP_WebDAV_Server_lxcr extends HTTP_WebDAV_Server {

    /**
     * Enter description here...
     *
     * @var lx_cr_session
     */
    protected $session = null;

    function __construct($session, $root = '/webdav') {
        $this->session = $session;

        $this->_SERVER = $_SERVER;
        $this->_SERVER['SCRIPT_NAME'] = $root;
    }

    function ServeRequest($path) {

        // special treatment for litmus compliance test
        // reply on its identifier header
        // not needed for the test itself but eases debugging
        if (isset($this->_SERVER['HTTP_X_LITMUS'])) {
            header("X-Litmus-reply: " . $this->_SERVER['HTTP_X_LITMUS']);
        }
        //$this->base = $this->_SERVER['DOCUMENT_ROOT'];
        $this->uripath = rawurldecode($path);
        // let the base class do all the work
        //FIXME do not hardcode this :)
        parent::ServeRequest();
    }

    /**
     * No authentication is needed here
     *
     * @access private
     * @param  string  HTTP Authentication type (Basic, Digest, ...)
     * @param  string  Username
     * @param  string  Password
     * @return bool    true on successful authentication
     */
    function check_auth($type, $user, $pass) {
        return true;
    }

    /**
     * PROPFIND method handler
     *
     * @param  array  general parameter passing array
     * @param  array  return array for file properties
     * @return bool   true on success
     */
    function PROPFIND(&$options, &$files) {

        // prepare property array
        $files["files"] = array();
        // store information for the requested path itself
        try {
            $node = $this->session->getItem($this->uripath);
        } catch (Exception $e) {
            return false;
        }

        if (! ($node instanceof phpCR_Node)) {
            return false;
        }
        $files["files"][] = $this->fileinfo($node);
        // information for contained resources requested?


        if (! empty($options["depth"])) {
            // make sure path ends with '/'
            $options["path"] = $this->_slashify($options["path"]);
            $nodes = $node->getNodes();
            foreach ($nodes as $n) {
                try {
                    $type = $n->getPrimaryNodeType();
                if ($type == 'nt:folder' || $type == 'nt:file')  {

                    $files["files"][] = $this->fileinfo($n);
                }
                } catch (Exception $e) {
                }
                // TODO recursion needed if "Depth: infinite"
            }

        }

        // ok, all done


        return true;
    }

    /**
     * Get properties for a single file/resource
     *
     * @param  string  resource path
     * @return array   resource properties
     */
    function fileinfo(phpCR_Node $node) {

        // create result array
        $info = array();
        // TODO remove slash append code when base clase is able to do it itself
        $info["path"] = str_replace(array("+", "%2F"), array("%20", "/"), urlencode($node->getPath()));
        error_log($info["path"]);
        if (! $info['path']) {
            $info['path'] = '/';
        }
        $info["props"] = array();

        // no special beautified displayname here ...
        $info["props"][] = $this->mkprop("displayname", $node->getName());

        // creation and modification time
        try {
            $cr = $node->getProperty("jcr:created");
            if ($cr) {
                $cr = $cr->getDate()->format('U');
                //$cr = strtotime($cr);
            } else {
                $cr = time();
            }
        } catch (phpCR_PathNotFoundException $e) {
            $cr = time();
        }

        $info["props"][] = $this->mkprop("creationdate", $cr);

        // Microsoft extensions: last access time and 'hidden' status
        $info["props"][] = $this->mkprop("lastaccessed", time());
        $info["props"][] = $this->mkprop("ishidden", false);

        // type and size (caller already made sure that path exists)
        $prim = $node->getProperty("jcr:primaryType");

        if ($prim instanceof phpCR_Property) {
            $prim = $prim->getString();
        }

        if ($info['path'] == '/' || trim($prim) == "nt:folder") {
            // directory (WebDAV collection)
            $info["props"][] = $this->mkprop("getlastmodified", $cr);
            $info["props"][] = $this->mkprop("resourcetype", "collection");
            $info["props"][] = $this->mkprop("getcontenttype", "httpd/unix-directory");

        } else {
            // plain file (WebDAV resource)
            $info["props"][] = $this->mkprop("resourcetype", "");
            $info["props"][] = $this->mkprop("getcontenttype", "text/plain");
            $lm = $node->getNode("jcr:content")->getProperty("jcr:lastModified");
            if ($lm) {
                $lm = $lm->getDate()->format('U');
            } else {
                $lm = time();
            }
            $info["props"][] = $this->mkprop("getlastmodified", $lm);

            //$info["props"][] = $this->mkprop("getcontenttype", $this->_mimetype($fspath));
            try {
                $data = $node->getNode("jcr:content")->getProperty("jcr:data");
                if ($data) {
                    $info["props"][] = $this->mkprop("getcontentlength", ($data->getLength()));
                } else {
                    $info["props"][] = $this->mkprop("getcontentlength", 0);
                }
            } catch (Exception $e) {
                $info["props"][] = $this->mkprop("getcontentlength", 0);
            }
        }
        // get additional properties from database
        $props = $node->getProperties();

        foreach ($props as $key => $value) {
            $type = $value->getType();
            switch ($type) {
                case phpCR_PropertyType::NAME :
                    $v = $value->getName();
                break;
                default :
                    try {
                        $v = $value->getString();
                    } catch (Exception $e) {
                        $v = "__EXCEPTION__";
                    }
            }
            /* debug stuff
            if ($info["path"] == '/chregu.jpg') {

                if ($value->getName() == 'jcr:versionHistory') {
                    $n = (string) $value->getString();
                    $hist = $this->session->getNodeByUUID($n);
                    foreach ($hist->getProperties() as $value) {
                        try {
                            $v = $value->getString();
                        } catch (Exception $e) {
                            $v = "__EXCEPTION__";
                        }
                        error_log("hist" . $value->getName() . " " . $v);
                    }

                    foreach ($hist->getNodes() as $value) {

                        error_log("hist" . $value->getName());
                        if ($value->getPrimaryNodeType() == 'nt:version') {
                             foreach ($value->getNodes() as $value2) {

                        error_log("hist2" . $value2->getName());
                             }

                        }

                    }
                }
            }
*/
            $info["props"][] = $this->mkprop('lx', $key, $v);
        }
        return $info;
    }

    /**
     * detect if a given program is found in the search PATH
     *
     * helper function used by _mimetype() to detect if the
     * external 'file' utility is available
     *
     * @param  string  program name
     * @param  string  optional search path, defaults to $PATH
     * @return bool    true if executable program found in path
     */
    function _can_execute($name, $path = false) {
        // path defaults to PATH from environment if not set
        if ($path === false) {
            $path = getenv("PATH");
        }

        // check method depends on operating system
        if (! strncmp(PHP_OS, "WIN", 3)) {
            // on Windows an appropriate COM or EXE file needs to exist
            $exts = array(".exe", ".com");
            $check_fn = "file_exists";
        } else {
            // anywhere else we look for an executable file of that name
            $exts = array("");
            $check_fn = "is_executable";
        }

        // now check the directories in the path for the program
        foreach (explode(PATH_SEPARATOR, $path) as $dir) {
            // skip invalid path entries
            if (! file_exists($dir))
                continue;
            if (! is_dir($dir))
                continue;

            // and now look for the file
            foreach ($exts as $ext) {
                if ($check_fn("$dir/$name" . $ext))
                    return true;
            }
        }

        return false;
    }

    /**
     * try to detect the mime type of a file
     *
     * @param  string  file path
     * @return string  guessed mime type
     */
    function _mimetype($fspath) {
        if (is_dir($fspath)) {
            // directories are easy
            return "httpd/unix-directory";
        } else
            if (function_exists("mime_content_type")) {
                // use mime magic extension if available
                $mime_type = mime_content_type($fspath);
            } else
                if ($this->_can_execute("file")) {
                    // it looks like we have a 'file' command,
                    // lets see it it does have mime support
                    $fp = popen("file -i '$fspath' 2>/dev/null", "r");
                    $reply = fgets($fp);
                    pclose($fp);

                    // popen will not return an error if the binary was not found
                    // and find may not have mime support using "-i"
                    // so we test the format of the returned string


                    // the reply begins with the requested filename
                    if (! strncmp($reply, "$fspath: ", strlen($fspath) + 2)) {
                        $reply = substr($reply, strlen($fspath) + 2);
                        // followed by the mime type (maybe including options)
                        if (preg_match('|^[[:alnum:]_-]+/[[:alnum:]_-]+;?.*|', $reply, $matches)) {
                            $mime_type = $matches[0];
                        }
                    }
                }

        if (empty($mime_type)) {
            // Fallback solution: try to guess the type by the file extension
            // TODO: add more ...
            // TODO: it has been suggested to delegate mimetype detection
            //       to apache but this has at least three issues:
            //       - works only with apache
            //       - needs file to be within the document tree
            //       - requires apache mod_magic
            // TODO: can we use the registry for this on Windows?
            //       OTOH if the server is Windos the clients are likely to
            //       be Windows, too, and tend do ignore the Content-Type
            //       anyway (overriding it with information taken from
            //       the registry)
            // TODO: have a seperate PEAR class for mimetype detection?
            switch (strtolower(strrchr(basename($fspath), "."))) {
                case ".html" :
                    $mime_type = "text/html";
                break;
                case ".gif" :
                    $mime_type = "image/gif";
                break;
                case ".jpg" :
                    $mime_type = "image/jpeg";
                break;
                default :
                    $mime_type = "application/octet-stream";
                break;
            }
        }

        return $mime_type;
    }

    /**
     * HEAD method handler
     *
     * @param  array  parameter passing array
     * @return bool   true on success
     */
    function HEAD(&$options, $node) {
        // get absolute fs path to requested resource
        $fspath = $this->base . $options["path"];
        if ($node) {

            try {
                $options['mimetype'] = $node->getNode("jcr:content")->getProperty("jcr:mimeType")->getString();
            } catch (Exception $e) {
            }
        }
        // detect modification time
        // see rfc2518, section 13.7
        // some clients seem to treat this as a reverse rule
        // requiering a Last-Modified header if the getlastmodified header was set
        //	$options['mtime'] = filemtime($fspath);


        // detect resource size
        //$options['size'] = filesize($fspath);


        return true;
    }

    /**
     * GET method handler
     *
     * @param  array  parameter passing array
     * @return bool   true on success
     */
    function GET(&$options) {
        // get absolute fs path to requested resource


        try {
            $node = $this->session->getItem($this->uripath);
            if ($node instanceof phpCR_Node) {
                if (! $this->HEAD($options, $node)) {
                    return false;
                }
                $options['data'] = $node->getNode("jcr:content")->getProperty("jcr:data")->getString();

            } else {
                return false;
            }
        } catch (phpCR_PathNotFoundException $e) {
            return false;
        }
        return true;
    }

    /**
     * GET method handler for directories
     *
     * This is a very simple mod_index lookalike.
     * See RFC 2518, Section 8.4 on GET/HEAD for collections
     *
     * @param  string  directory path
     * @return void    function has to handle HTTP response itself
     */
    function GetDir($fspath, &$options) {

        //TODO for lxcr
        $path = $this->_slashify($options["path"]);
        if ($path != $options["path"]) {
            header("Location: " . $this->base_uri . $path);
            exit();
        }

        // fixed width directory column format
        $format = "%15s  %-19s  %-s\n";

        if (! is_readable($fspath)) {
            return false;
        }

        $handle = opendir($fspath);
        if (! $handle) {
            return false;
        }

        echo "<html><head><title>Index of " . htmlspecialchars($options['path']) . "</title></head>\n";

        echo "<h1>Index of " . htmlspecialchars($options['path']) . "</h1>\n";

        echo "<pre>";
        printf($format, "Size", "Last modified", "Filename");
        echo "<hr>";

        while ($filename = readdir($handle)) {
            if ($filename != "." && $filename != "..") {
                $fullpath = $fspath . "/" . $filename;
                $name = htmlspecialchars($filename);
                printf($format, number_format(filesize($fullpath)), strftime("%Y-%m-%d %H:%M:%S", filemtime($fullpath)), "<a href='$name'>$name</a>");
            }
        }

        echo "</pre>";

        closedir($handle);

        echo "</html>\n";

        exit();
    }

    /**
     * PUT method handler
     *
     * @param  array  parameter passing array
     * @return bool   true on success
     */
    function PUT(&$options) {
        try {
            $node = $this->session->getItem($this->uripath);
        } catch (Exception $e) {
            $node = null;
        }

        $options["new"] = ! $node;
        /*if ($options["new"] && ! is_writeable($dir)) {
			return "403 Forbidden";
		}
		if (! $options["new"] && ! is_writeable($fspath)) {
			return "403 Forbidden";
		}
		if (! $options["new"] && is_dir($fspath)) {
			return "403 Forbidden";
		}*/
        $stat = $options["new"] ? "201 Created" : "204 No Content";
        $newnode = $this->session->getRootNode()->addNode($this->uripath, "nt:file");
        if (! $newnode->isCheckedOut()) {
            $newnode->checkout();
        }
        $newnode->addMixin('mix:versionable');
        $content = $newnode->addNode("jcr:content", "nt:resource");
        $data = file_get_contents("php://input");
        $fp = fopen("php://input", "r");
        while ($line = fread($fp, 1024)) {
            $data .= $line;
        }
        fclose($fp);
        //           $data = $GLOBALS['DATA'];


        $content->setProperty("jcr:data", $data, phpCR_PropertyType::BINARY);

        if (function_exists('finfo_open')) {

            $finfo = new finfo(FILEINFO_MIME | FILEINFO_CONTINUE);
            $mimes = explode(" ", $finfo->buffer($data));
error_log(var_export($mimes,true));
            if (count($mimes) >= 3) {
                $mimetype = $mimes[2];
            } else {
                $mimetype = $mimes[0];
            }

            $content->setProperty("jcr:mimeType", trim($mimetype));
        } else {
            $content->setProperty("jcr:mimeType", "application/unknown");
        }
        $content->setProperty("jcr:lastModified", time(), phpCR_PropertyType::DATE);

        //$newnode->save();
        //$content->save();
        $this->session->save();

        $newnode->checkin();

        return $stat;

    //$fp = fopen("/tmp/foo", "w");
    //return $fp;
    }

    /**
     * MKCOL method handler
     *
     * @param  array  general parameter passing array
     * @return bool   true on success
     */
    function MKCOL($options) {

        try {
            error_log($this->uripath);
            $node = $this->session->getItem($this->uripath);
            if ($node instanceof phpCR_Node) {
                return "405 Method not allowed";
            }
        } catch (Exception $e) {

        }

        try {
            $newnode = $this->session->getRootNode()->addNode($this->uripath, "nt:folder");
        } catch (Exception $e) {
            return "409 Conflict";
        }

        /*


		if (! file_exists($parent)) {
			return "409 Conflict";
		}

		if (! is_dir($parent)) {
			return "403 Forbidden";
		}



		if (! empty($this->_SERVER["CONTENT_LENGTH"])) { // no body parsing yet
			return "415 Unsupported media type";
		}

		$stat = mkdir($parent . "/" . $name, 0777);
		if (! $stat) {
			return "403 Forbidden";
		}
		*/
        $this->session->save();

        return ("201 Created");
    }

    /**
     * DELETE method handler
     *
     * @param  array  general parameter passing array
     * @return bool   true on success
     */
    function DELETE($options) {

        $node = $this->session->getItem($this->uripath);
        if ($node instanceof phpCR_Node) {
            // no need to check result here, it is handled by the base class
            $node->remove();
        } else {
            return "404 Not found";
        }
        $this->session->save();
        return "204 No Content";

    }

    /**
     * MOVE method handler
     *
     * @param  array  general parameter passing array
     * @return bool   true on success
     */
    function MOVE($options) {
        return $this->COPY($options, true);
    }

    /**
     * COPY method handler
     *
     * @param  array  general parameter passing array
     * @return bool   true on success
     */
    function COPY($options, $move = false) {
        // TODO Property updates still broken (Litmus should detect this?)


        if (! empty($this->_SERVER["CONTENT_LENGTH"])) { // no body parsing yet
            return "415 Unsupported media type";
        }

        // no copying to different WebDAV Servers yet
        if (isset($options["dest_url"])) {
            return "502 bad gateway";
        }

        try {
            $node = $this->session->getItem($this->uripath);
        } catch (Exception $e) {
            return "404 Not found";
        }
        if (! ($node instanceof phpCR_Node)) {
            return "404 Not found";
        }

        try {
            if ($node->getProperty('jcr:primaryType')->getString() == 'nt:folder') { // resource is a collection
                switch ($options["depth"]) {
                    case "infinity" : // valid
                    break;
                    case "0" : // valid for COPY only
                        if ($del) { // MOVE?
                            return "400 Bad request";
                        }
                    break;
                    case "1" : // invalid for both COPY and MOVE
                    default :
                        return "400 Bad request";
                }
            }
        } catch (phpCR_PathNotFoundException $e) {
            return "404 Not found";
        }

        try {
            $dest = $this->session->getItem($options["dest"]);
        } catch (Exception $e) {
            $dest = null;
        }

        if ($move) {
            $this->session->getWorkspace()->move($node->getPath(),$options['dest']);
        } else {
            $this->session->getWorkspace()->copy($node->getPath(),$options['dest']);
        }
        $this->session->save();
        return (! $dest) ? "201 Created" : "204 No Content";

    }

    /**
     * PROPPATCH method handler
     *
     * @param  array  general parameter passing array
     * @return bool   true on success
     */
    function PROPPATCH(&$options) {
        //TODO
        global $prefs, $tab;

        $msg = "";
        $path = $options["path"];
        $dir = dirname($path) . "/";
        $base = basename($path);

        foreach ($options["props"] as $key => $prop) {
            if ($prop["ns"] == "DAV:") {
                $options["props"][$key]['status'] = "403 Forbidden";
            } else {
                if (isset($prop["val"])) {
                    $query = "REPLACE INTO {$this->db_prefix}properties
                                           SET path = '$options[path]'
                                             , name = '$prop[name]'
                                             , ns= '$prop[ns]'
                                             , value = '$prop[val]'";
                } else {
                    $query = "DELETE FROM {$this->db_prefix}properties
                                        WHERE path = '$options[path]'
                                          AND name = '$prop[name]'
                                          AND ns = '$prop[ns]'";
                }
                mysql_query($query);
            }
        }

        return "";
    }

    /**
     * LOCK method handler
     *
     * @param  array  general parameter passing array
     * @return bool   true on success
     */
    function LOCK(&$options) {
        return "200 OK";
        //    return "409 Conflict";
    }

    /**
     * UNLOCK method handler
     *
     * @param  array  general parameter passing array
     * @return bool   true on success
     */
    function UNLOCK(&$options) {
        return "204 No Content";
        //return mysql_affected_rows() ? "204 No Content" : "409 Conflict";
    }
    /**
     * checkLock() helper
     *
     * @param  string resource path to check for locks
     * @return bool   true on success
     */
    function checkLock($path) {
        return true;
    }

}


/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * indent-tabs-mode:nil
 * End:
 */
