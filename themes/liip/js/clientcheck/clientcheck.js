
/**
 * clientcheck class 
 * @constructor
 */
var clientcheck = function(options) {
    if(typeof options.imageroot == 'string' && options.imageroot != '') {
        this.options = options;
        this.imageroot = this.options.imageroot;
    }
    this.init();
};

clientcheck.TYPE_TEST = 1;
clientcheck.TYPE_INFO = 2;

clientcheck.prototype = {
    
    options: '',
    imageroot: '',

    runningImageHtml: '',
    completedImageHtml: '',
    failedImageHtml: '',

    /**
     * array containing all checks to be executed
     */
    checks: [],
    
    /**
     * array containing the results of all checks executed
     */
    results: [],
    
    /**
     * the initialization method called when instantiation is completed 
     */
    init: function() {
        this.runningImageHtml = '<img border="0" alt="running" src="'+this.imageroot+'running.gif"/>';
        this.completedImageHtml = '<img border="0" alt="completed" src="'+this.imageroot+'accept.png"/>';
        this.failedImageHtml = '<img border="0" alt="failed" src="'+this.imageroot+'delete.png"/>';
        this.informationImageHtml = '<img border="0" alt="information" src="'+this.imageroot+'information.png"/>';
    },
    
    /**
     * adds a set ot default checks to be executed later 
     */
    addDefaultChecks: function() {
        this.addCheck("userAgent", jQuery("#ccres_userAgent"));
        this.addCheck("platform", jQuery("#ccres_platform"));
        this.addCheck("remoteaddress", jQuery("#ccres_remoteaddress"));
        this.addCheck("popupblocker", jQuery("#ccres_popupblocker"));
        this.addCheck("cookies", jQuery("#ccres_cookies"));
        this.addCheck("ajax", jQuery("#ccres_ajax"));
        this.addCheck("flash", jQuery("#ccres_flash"));
    },
    
    /**
     * launches the client check
     */
    launch: function() {
        jQuery("#cccontainer").show();
        
        // run all checks
         for(var i=0; i<this.checks.length; i++) {
            var check = this.checks[i];
        
            // add test running indicator
            jQuery('.ccright', check.element).html(this.runningImageHtml);
                
            checkResult = check.checkInstance.run();
            
            // save the result for later usage
            this.results.push({
                check: check,
                result: checkResult
            });
            
            if(typeof checkResult == 'object' && checkResult.result === true) {
                // indicate the check was completed successfully if type is test
                if(check.checkInstance.type == clientcheck.TYPE_TEST) {
                    jQuery('.ccright', check.element).html(this.completedImageHtml);
                } else {
                    jQuery('.ccright', check.element).html(this.informationImageHtml);
                }

            } else {
                jQuery('.ccright', check.element).html(this.failedImageHtml);
                
            }
            
            // display info if needed
            if(typeof checkResult.resultInfo != 'undefined') {
                jQuery(check.element).append('<span class="info">' + checkResult.resultInfo + '</span>');
            }
            
        }
        
    },
    
    /**
     * serializes the test results to a string
     */
    serializeResults: function() {
        var results = "";
        
        for(var i=0; i<this.results.length; i++) {
            var result = this.results[i];
            results = results + "Check  : " + result.check.checkInstance.name + "\n";
            results = results + "Result : " + (result.result.result == true ? 'passed' : 'failed') + "\n";
            if(typeof result.result.resultInfo != 'undefined') {
                results = results + "Info   : " + result.result.resultInfo + "\n";
            }
            results = results + "\n";
        }
        
        return results;
    },
    
    /**
     * adds a check to the set of checks to be executed
     *
     * @param {String} name Name of the check to add
     * @param {Object} element List item which will be used by the check
     */
    addCheck: function(name, element) {

        // the class of teh check
        checkClass = 'clientcheck_check_' + name;
        try {
            // create check instance
            eval("_checkInstance = new "+checkClass+"(this);");
        } catch (e) {
            alert(e); 
        }

        this.checks.push({
            checkInstance: _checkInstance,
            element: element    
        });
    }
    
};

/**
 * user agent check class 
 * @constructor
 */
var clientcheck_check_userAgent = function() {
};
clientcheck_check_userAgent.prototype = {
    
    type: clientcheck.TYPE_INFO,
    
    /**
     * name of this check
     */
    name: "userAgent",
    
    /**
     * runs the user agent check
     */
    run: function() {
        if(typeof navigator.userAgent != "undefined") {
            return {result: true, resultInfo: navigator.userAgent};
        }
        return false;
    }
    
};

/**
 * platform check class 
 * @constructor
 */
var clientcheck_check_platform = function() {
};
clientcheck_check_platform.prototype = {
    
    type: clientcheck.TYPE_INFO,

    /**
     * name of this check
     */
    name: "platform",
    
    /**
     * runs the platform check
     */
    run: function() {
        if(typeof navigator.platform != "undefined") {
            return {result: true, resultInfo: navigator.platform};
        }
        return false;
    }
    
};

/**
 * popup blocker check class 
 * @constructor
 */
var clientcheck_check_popupblocker = function() {
};
clientcheck_check_popupblocker.prototype = {
    
    type: clientcheck.TYPE_TEST,
    
    /**
     * name of this check
     */
    name: "popupblocker",
    
    /**
     * runs the popup blocker check
     */
    run: function() {
        
        var pbtest = window.open("about:blank","","directories=no,height=100,width=100,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,top=0,location=no");
        var popupsAllowed;

        if(!pbtest || pbtest == null || typeof pbtest == 'undefined') {
            // if no window object was created, popups are blocked
            popupsAllowed = false;
            
        } else {
            /*
                a popup object was created (which doesn't mean there is a popup 
                as well). so we check the window's close method here because some
                browsers create a window object even if no popup was opened.
            */
            if(typeof pbtest.close == 'function' || typeof pbtest.close == 'object') {
                // looks like this is really a popup
                pbtest.close();
                popupsAllowed = true;
                
            } else {
                popupsAllowed = false;
            }
            
        }
        
        return popupsAllowed === true ? {result: true, resultInfo: "Popups are not blocked."} : {result: false, resultInfo: "Popups are blocked."};

    }
    
};

/**
 * cookies check class 
 * @constructor
 */
var clientcheck_check_cookies = function() {
};
clientcheck_check_cookies.prototype = {
    
    type: clientcheck.TYPE_TEST,
    
    /**
     * name of this check
     */
    name: "cookies",
    
    /**
     * runs the cookies check
     */
    run: function() {
        if(typeof navigator.cookieEnabled != "undefined" && navigator.cookieEnabled === true) {
            return {result: true, resultInfo: "Cookies are enabled."};
        } else {
            return {result: false, resultInfo: "Cookies are disabled."};
        }
    }
    
};

/**
 * ajax check class 
 * @constructor
 */
var clientcheck_check_ajax = function() {
};
clientcheck_check_ajax.prototype = {
    
    type: clientcheck.TYPE_TEST,
    
    /**
     * name of this check
     */
    name: "ajax",
    
    /**
     * runs the ajax check
     */
    run: function() {
        var XHR = null;
        var info = '';
        
        if (window.XMLHttpRequest) {
            XHR = new XMLHttpRequest();
            info = 'Using XMLHttpRequest';
        } else {
            try {
                info = 'Using ActiveX (Microsoft.XMLHTTP)';
                XHR = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                info = 'ActiveX is disabled';
            }
        }
        if(XHR != null) {
            return {result: true, resultInfo: info};
        } else {
            return {result: false, resultInfo: info};
        }
    }
    
};

/**
 * flash check class 
 * @constructor
 */
var clientcheck_check_flash = function() {
};
clientcheck_check_flash.prototype = {
    
    type: clientcheck.TYPE_TEST,
    
    /**
     * name of this check
     */
    name: "flash",
    
    /**
     * runs the flash check
     */
    run: function() {
        
        var flashVersion = GetSwfVer();
        
        if(flashVersion != -1) {
            return {result: true, resultInfo: flashVersion};
        }
        return {result: false, resultInfo: "Flash Plugin is not installed."};
    }
    
};

/**
 * remote ip check class 
 * @constructor
 */
var clientcheck_check_remoteaddress = function(parent) {
    this.parent = parent;
};
clientcheck_check_remoteaddress.prototype = {
    
    type: clientcheck.TYPE_INFO,
    
    /**
     * name of this check
     */
    name: "remote address",
    
    /**
     * runs the flash check
     */
    run: function() {
        
        if(typeof this.parent.options.remoteAddress != 'undefined') {
            return {result: true, resultInfo: this.parent.options.remoteAddress};
        }
        return {result: false, resultInfo: "Not available."};
    }
    
};

