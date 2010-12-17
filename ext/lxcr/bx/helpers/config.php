<?php

class bx_helpers_config {

    protected static $outputLanguages = array("de","fr");

    static function getLangsAvailXML() {
        if (isset(self::$outputLanguages)) {
            $l = implode(",", self::$outputLanguages);
            $ldom = bx_helpers_string::explodeToNode(',', $l, 'entry', 'langs');
            if ($ldom) {
                return $ldom;
            }
        }

    }

    static function getOption($option,$forceTouch = false) {

         return self::getProperty($option, $forceTouch);

    }

    static function getProperty($param, $forceTouch = false ) {
        if (isset($GLOBALS['POOL']->config)) {
            return $GLOBALS['POOL']->config->getConfProperty($param, $forceTouch);
        }
        return "";
    }
    static public function getTimeZoneAsSeconds() {
        $t = $GLOBALS['POOL']->config->timezoneSeconds;
        if ($t === NULL || $t == 'servertime') {
            $t = date('Z');
            $GLOBALS['POOL']->config->timezoneSeconds = $t;
        }
        return $t;
    }

    static public function getTimeZoneAsString() {
        $t = $GLOBALS['POOL']->config->timezoneString;
        if (!$t || $t == 'servertime') {
            $t = date('T');
            $GLOBALS['POOL']->config->timezoneString = $t;
        }
        return $t;
    }

    static public function getOpenTabs() {
         $dom = new DomDocument();
        if (isset($_COOKIE) && isset($_COOKIE['openTabs'])) {

            $root = $dom->appendChild($dom->createElement('opentabs'));
            foreach ($_COOKIE['openTabs'] as $type => $tab) {
                $node = $dom->createElement('tab',$tab);
                $node->setAttribute("type",$type);
                $root->appendChild($node);

            }

        }
        return $dom;

    }

    static public function getBlogName() {
          $blogname = self::getProperty('blogname');
          if ($blogname) {
              return $blogname;
          } else {
              return self::getProperty('sitename');
          }
    }


    static public function getTheme() {
        if ( isset($_COOKIE['bx_theme'])) {

            if (isset($_COOKIE['bx_themecss']) && file_exists(BX_THEMES_DIR.$_COOKIE['bx_theme']."/css/".$_COOKIE['bx_themecss'])) {

                return $_COOKIE['bx_theme'];
            } else {
                setcookie("bx_theme",null,null,"/");
                unset($_COOKIE['bx_theme']);
            }
        }

        return bx_helpers_config::getProperty('theme');
    }
    static public function getThemeCss() {
        if (isset($_COOKIE['bx_themecss']) ) {
            if ( isset($_COOKIE['bx_theme']) && file_exists(BX_THEMES_DIR.$_COOKIE['bx_theme']."/css/".$_COOKIE['bx_themecss'])) {
                return $_COOKIE['bx_themecss'];
            } else {
                setcookie("bx_themecss",null,null,"/");
                unset($_COOKIE['bx_themecss']);
            }
        }
        return bx_helpers_config::getProperty('themeCss');

    }
}


?>
