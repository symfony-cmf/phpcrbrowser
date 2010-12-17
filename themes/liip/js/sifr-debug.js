/*=:project
    scalable Inman Flash Replacement (sIFR) version 3.

    Provides debug information about sIFR.

  =:file
    Copyright: 2006 Mark Wubben.
    Author: Mark Wubben, <http://novemberborn.net/>

  =:license
    * This software is licensed and provided under the CC-GNU LGPL
    * See <http://creativecommons.org/licenses/LGPL/2.1/>    
*/

sIFR.debug = new function() {
  function log(msg) {
    if(!sIFR.ua.safari && window.console && console.log) console.log(msg);
    else alert(msg);
  }
  
  this.ua = function() {
    var info = [];
    
    for(var prop in sIFR.ua) {
      if(sIFR.ua[prop] == Object.prototype[prop]) continue;
      
      info.push(prop, ': ', sIFR.ua[prop], '\n');
    }
    
    log(info.join(''));
  };
  
  this.domains = function() {
    var valid = sIFR.domains.length == 0;
    
    // The validation code is copied from the private sIFR code. Please keep 
    // up to date!
    
    var domain = '';
    try { // When trying to access document.domain on a Google-translated page with Firebug, I got an exception.
      domain = document.domain;
    } catch(e) {};

    for(var i = 0; i < sIFR.domains.length; i++) {
      if(sIFR.domains[i] == '*' || sIFR.domains[i] == domain) {
        valid = true;
        break;
      }
    }
    
    log(['The domain "', domain, '" is ', valid ? 'valid' : 'invalid', '.\nList of checked domains: ', sIFR.domains].join(''));
  };
};