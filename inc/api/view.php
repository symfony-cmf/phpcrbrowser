<?php
/* Licensed under the Apache License, Version 2.0
 * See the LICENSE and NOTICE file for further information
 */

/**
 * View factory.
 *
 * Instantiates and returns a view object according to name.
 *
 * @author   Silvan Zurbruegg
 */
class api_view {
    /** Prefix for view class names. */
    private static $classNameBase    = "_views_";

    /**
     * String: The default namespace
     * @todo this would be nice in the config file with a default value
     */
    private static $defaultNamespace = API_NAMESPACE;

    /** Protected constructor. Use api_view::factory(). */
    protected function __construct() {
    }

    /**
     * Return view object according to name.
     *
     * If a filename with extension is part of the request uri, the
     * class name of the view is attempted to be resolved  considering
     * the extension (i.e. /foo.rss -> api_views_default_rss). If no
     * subview matching the extension is available, try again for a
     * standard view for the particular extension (i.e. api_views_ext).
     * Default is to instantiate the configured view.
     *
     * @param $name string: View name to instantiate.
     * @param $request api_request: Request object.
     * @param $route hash: Route which matched the current request.
     * @param $response api_response: Response object.
     * @todo  Is omitextension still needed here?
     */
    public static function factory($name, $request, $route, $response) {
        $rgNamespace = Array();
        $ext = $request->getExtension();

        if (isset($route['namespace']) && $route['namespace'] != API_NAMESPACE) {
            $rgNamespace[] = $route['namespace'];
        }

        $rgNamespace[] = api_view::$defaultNamespace;

        foreach ($rgNamespace as $ns) {
            if (($obj = api_view::getViewWithNamespace($ns, $ext, $name, $route, $response)) != false) {
                return $obj;
            }
        }

        return false;
    }

    /**
     * Returns a view object according to the namespace. The default namespace
     * is `api'. If you set your namespace to `foo' then the views named
     * foo_views_bar_baz will be searched first.
     * The order in which the views are searched is the following:
     * {namespace}_views_{name}_{ext} , {namespace}_views_{ext} , {namespace}_
     * views_default, api_views_{name}_{ext}, api_views_{ext} , api_views default.
     *
     *
     *
     * @param $ns String: Namespace of the view
     * @param $ext String: Extension String (like xml, json..)
     * @param $name String: View name to instantiate
     * @param $route hash: Route which matched the current request.
     * @param $response api_response: Response object.
     * @return api_view|false
     */
    private static function getViewWithNamespace($ns, $ext, $name, $route, $response) {
        $omitExt = (!empty($route['view']['omitextension']) && $route['view']['omitextension']) ? true : false;
        $className = $ns.api_view::$classNameBase.strtolower($name);

        if ($ext != null && $omitExt === false) {
            /**
             * Try with view api_views_viewname_ext.
             * View is a subview of defined view
             **/
            $classNameExt = $className."_".$ext;
            if (class_exists($classNameExt)) {
                $className = $classNameExt;
            } else {
                /**
                 * Try with api_views_ext
                 * View is a standard view for ext
                 */
                $classNameExt = $ns.api_view::$classNameBase.$ext;
                if (class_exists($classNameExt)) {
                    $className = $classNameExt;
                }
            }
        }

        if (class_exists($className)) {
            $obj = new $className($route);
            $obj->setResponse($response);
            return $obj;
        }

        return false;
    }
}
