
var prev = 0;

function prevImg(src) {
    var tmp = document.getElementById('bild').src;
    if(prev == 0) {
        prev = document.getElementById('bild').src;
    }
    if(src != tmp) {
        document.getElementById('bild').src = src;
    } else {
        document.getElementById('bild').src = prev;
    }
}

var next = 0;

function nextImg(src) {
    var tmp = document.getElementById('bild').src;
    if(next == 0) {
        next = document.getElementById('bild').src;
    }
    if(src != tmp) {
        document.getElementById('bild').src = src;
    } else {
        document.getElementById('bild').src = next;
    }
}

function projectsOverviewHover(id) {
    document.getElementById('text'+id).style.display = 'inline';
    document.getElementById('bild'+id).style.border = '1px solid #DAF22F';
}

function projectsOverviewOut(id) {
    document.getElementById('text'+id).style.display = 'none';
    document.getElementById('bild'+id).style.border = '1px solid #ededed';
}
function navimouseover(img) {
    img.src=img.src.replace(/s=[0-9]/,"s=2");
}

function navimouseout(img,selected,level) {
    if (selected && level == 3) {
        var state = 3;
    } else { 
        var state = 1;
    }
    img.src=img.src.replace(/s=[0-9]/,"s="+state);
}

// StyleSwitcher functions written by Paul Sowden
function setActiveSS(title) {
	var i, a, main;
	for (i=0; (a=document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel") && a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
			if (a.getAttribute("title") == title) {
				a.disabled = false;
			}
		}
	}
	if (title.indexOf('Big') != -1) {
		document.getElementById("big_chars_button").className = "char_link_active";
		document.getElementById("small_chars_button").className = "char_link";
	} else {
		document.getElementById('small_chars_button').className = "char_link_active";
		document.getElementById('big_chars_button').className = "char_link";
	}
}

function getActiveSS() {
	var i, a;
	for (i=0; (a=document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel") && a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) {
			return a.getAttribute("title");
		}
	}
	return null;
}

function getPreferredSS() {
	var i, a;
	for (i=0; (a=document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel") && a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("rel").indexOf("alt") == -1 && a.getAttribute("title")) {
			return a.getAttribute("title");
		}
	}
	return null;
}

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	} else {
		expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}
}

function readCookie(name) {
	var nameEQ = name+"=";
	var ca = document.cookie.split(';');
	for (var i = 0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
}

window.onload = function(e) {
	var cookie = readCookie("style");
	var title = cookie ? cookie : getPreferredSS();
	// setActiveSS(title);
};

window.onunload = function(e) {
	var title = getActiveSS();
	createCookie("style", title);
};
