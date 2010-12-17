<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
    xmlns="http://www.w3.org/1999/xhtml"
    >

<xsl:output encoding="utf-8" method="xml" indent="yes"
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" 
    doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
    />
    
<xsl:param name="webroot" select="$webroot"/>   
    
<xsl:template match="/">
<html>
    
    <head>
    <title>Flux CMS Admin</title>
    <link rel="stylesheet" type="text/css" media="screen" href="{$webroot}themes/standard/admin/css/navi.css"/>
    <link rel="stylesheet" type="text/css" media="screen" href="{$webroot}admin/webinc/xlt/xtree.css" />
    <script type="text/javascript">
    var webFXTreeConfig = new Object();
    </script>
    <script type="text/javascript" src="{$webroot}admin/webinc/xlt/xmlextras.js"/>
    <script type="text/javascript" src="{$webroot}admin/webinc/xlt/xtree.js"/>
    <script type="text/javascript" src="{$webroot}admin/webinc/xlt/xloadtree.js"/>
    <script type="text/javascript" src="{$webroot}admin/webinc/js/navi.js"/>
    <script type="text/javascript" src="{$webroot}admin/webinc/js/navi.xtree.js"/>
    <script type="text/javascript" src="{$webroot}admin/webinc/js/adminpopup.js"/>
    <script type="text/javascript" src="{$webroot}admin/webinc/js/admin.js"/>
    
    
    <script type="text/javascript">
     
     
    webFXTreeConfig.rootIcon        = "<xsl:value-of select="$webroot"/>admin/webinc/img/icons/root.gif";
    webFXTreeConfig.openRootIcon    = "<xsl:value-of select="$webroot"/>admin/webinc/img/icons/root.gif";
    webFXTreeConfig.folderIcon      = "<xsl:value-of select="$webroot"/>admin/webinc/img/icons/fileicon_folder.gif";
    webFXTreeConfig.openFolderIcon  = "<xsl:value-of select="$webroot"/>admin/webinc/img/icons/fileicon_folder.gif";
    webFXTreeConfig.fileIcon        = "<xsl:value-of select="$webroot"/>admin/webinc/img/icons/fileicon_folder.gif";
    webFXTreeConfig.lMinusIcon      = "<xsl:value-of select="$webroot"/>admin/webinc/img/open_breit.gif";
    webFXTreeConfig.lPlusIcon       = "<xsl:value-of select="$webroot"/>admin/webinc/img/closed_breit.gif";
    webFXTreeConfig.tMinusIcon      = "<xsl:value-of select="$webroot"/>admin/webinc/img/open_breit.gif";  
    webFXTreeConfig.tPlusIcon       = "<xsl:value-of select="$webroot"/>admin/webinc/img/closed_breit.gif";
    webFXTreeConfig.iIcon           = "<xsl:value-of select="$webroot"/>admin/webinc/img/empty.gif";
    webFXTreeConfig.lIcon           = "<xsl:value-of select="$webroot"/>admin/webinc/img/empty.gif";
    webFXTreeConfig.tIcon           = "<xsl:value-of select="$webroot"/>admin/webinc/img/empty.gif";
    webFXTreeConfig.blankIcon       = "<xsl:value-of select="$webroot"/>admin/webinc/img/empty.gif";
    
    webFXTreeConfig.requestPath     = "<xsl:value-of select="/bx/plugin[@name='admin_navi']/id"/>";
    webFXTreeConfig.webroot         = "<xsl:value-of select="$webroot"/>";
    
    <!-- CSS class for active Navitree Item --> 
    webFXTreeConfig.itemActiveClass = "itemactive";
    <!-- bgcolor for active Item's div -->
    webFXTreeConfig.itemActiveBgColor = "#ccc";
    <!-- bgcolor for inactive Item's div -->
    webFXTreeConfig.itemBgColor = "#fff";

    webFXTreeConfig.usePersistence  = false;
    webFXTreeConfig.naviTreePath    = "/admin/navi/tree";
    webFXTreeConfig.pathStore = new Array();
    var tree = new WebFXLoadTree(" home ","../navi/tree/" ,"<xsl:value-of select="$webroot"/>admin/overview/");
    
  
    /*tree.add(new WebFXTreeItem("Tree Item 1"));
    tree.add(new WebFXLoadTreeItem("Tree Item 2", "tree.xml"));
    tree.add(rti = new WebFXLoadTreeItem("Tree Item 3 (Reload)", "date.xml.pl"));
    tree.add(new WebFXTreeItem("Tree Item 4"));
    */
    var bx_webroot = '<xsl:value-of select="$webroot"/>';
    
    document.write(tree);
    
    function testopen(path, object) {
        WebFXTreeObjectId = object;
        WebFXTreeOpenId = WebFXTreeObjectId.getAttribute('id').match(/[0-9]{1,}/);
        ap = adminPopUp.create('<xsl:value-of select="$webroot"/>admin/navi/popup');
        ap.load(path);
    } 
    
    
</script>
   
   </head>
    
   <body>
   </body>
</html>
</xsl:template>


</xsl:stylesheet>
