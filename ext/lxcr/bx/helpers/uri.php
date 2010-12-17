<?php

class bx_helpers_uri {
    
    private static $uri = null;
     
    static function escapeUriAndSlashes($uri) {
        $uri = str_replace("/",'$_$',$uri);
        $uri = urlencode($uri);
        return $uri;
    }
    
    static function translateUri($uri) {
        $host = (defined('BX_WEBROOT')) ? BX_WEBROOT : $_SERVER['HTTP_HOST']; 
        preg_match("#\.(\w{2}\.(\w{3,}))$#", $uri, $matches);
        if (isset($matches[1]) && !empty($matches[1]) && strpos($uri, $host) !== FALSE) {
            $uri = sprintf("%s%s", str_replace($matches[1], "", $uri), $matches[2]);
        } 

        return $uri; 
    }    

    static function getLocationUri($filename) {
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") {
            $uri = 'https';
        } else {
            $uri = 'http';
        }
        return $uri.'://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['REQUEST_URI'])."/".$filename;
    }
    
    static function getRequestUri($q = '',$random = false) {
        
         if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") {
            $uri = 'https';
        } else {
            $uri = 'http';
        }
        
        if ($random) {
            if ($q) {
                $q .= '&st='.mt_rand(1,1000);
            } else {
                $q = 'st='.mt_rand(1,1000);
            }
        }
        if ($q) {
            if (strpos($_SERVER['REQUEST_URI'],'?') === false) {
                $q = '?'.$q;
            } else {
                $q = '&'.$q;
            }
        } 
        return $uri.'://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'].$q;
    }
    
  

    static function getUriPart($uri, $part) {
        $parts = parse_url($uri);
        if (isset($parts[$part])) {
            return $parts[$part];
        }
    
        return null;
    }

    static function getTopLevelCollectionUri($colluri,$default = '') {
        $parts = explode("/", $colluri);
        if (!isset($parts[1]) || !$parts[1]) {
            return $default;
        }
        return $parts[1];
    }

    static function getCollectionUriPart($colluri, $part=null) {
        $parts = explode("/", $colluri);
        if (sizeof($parts > 0)) {
            if ($part!=null && isset($parts[$part])) {
                return $parts[$part];
            } else {
                foreach(array_reverse($parts) as $part) {
                    if (!empty($part)) {
                        return $part;
                    }
                }
            }
        }
       
        return $colluri;
    }

    static function getCollectionUriLevel($colluri, $filename=null) {
        $parts = explode("/", $colluri);
        $cleanParts = array();
        foreach($parts as $part) {
            if (!empty($part)) {
                array_push($cleanParts, $part);
            }
        }
        $level = sizeof($cleanParts);
        
        return ($filename!=null && $filename!='index') ? $level+1:$level;
    }
}
