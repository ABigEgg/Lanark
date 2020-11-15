if (Function.prototype.bind == null) Function.prototype.bind = function(object) {
    var __method = this;
    return function() {
        return __method.apply(object, arguments)
    }
};
if (typeof Wicket == "undefined") Wicket = {};
if (typeof Wicket.Browser == "undefined") Wicket.Browser = {
    isKHTML: function() {
        return /Konqueror|KHTML/.test(navigator.userAgent) && !/Apple/.test(navigator.userAgent)
    },
    isSafari: function() {
        return /KHTML/.test(navigator.userAgent) && /Apple/.test(navigator.userAgent)
    },
    isOpera: function() {
        return !Wicket.Browser.isSafari() && typeof window.opera != "undefined"
    },
    isIE: function() {
        return !Wicket.Browser.isSafari() && typeof document.all != "undefined" && typeof window.opera == "undefined"
    },
    isIEQuirks: function() {
        return Wicket.Browser.isIE() &&
            document.documentElement.clientHeight == 0
    },
    isIELessThan7: function() {
        var index = navigator.userAgent.indexOf("MSIE");
        var version = parseFloat(navigator.userAgent.substring(index + 5));
        return Wicket.Browser.isIE() && version < 7
    },
    isIE7: function() {
        var index = navigator.userAgent.indexOf("MSIE");
        var version = parseFloat(navigator.userAgent.substring(index + 5));
        return Wicket.Browser.isIE() && version >= 7
    },
    isGecko: function() {
        return /Gecko/.test(navigator.userAgent) && !Wicket.Browser.isSafari()
    }
};
if (typeof Wicket.Event == "undefined") Wicket.Event = {
    idCounter: 0,
    getId: function(element) {
        var current = element.getAttribute("id");
        if (typeof current == "string" && current.length > 0) return current;
        else {
            current = "wicket-generated-id-" + Wicket.Event.idCounter++;
            element.setAttribute("id", current);
            return current
        }
    },
    handler: function() {
        var id = this[0];
        var original = this[1];
        var element = Wicket.$(id);
        original.bind(element)()
    },
    fire: function(element, event) {
        if (document.createEvent) {
            var e = document.createEvent("Event");
            e.initEvent(event,
                true, true);
            return element.dispatchEvent(e)
        } else return element.fireEvent("on" + event)
    },
    add: function(element, type, fn) {
        if (element == window && type == "domready") Wicket.Event.addDomReadyEvent(fn);
        else if (element.addEventListener) element.addEventListener(type == "mousewheel" && Wicket.Browser.isGecko() ? "DOMMouseScroll" : type, fn, false);
        else {
            if (element == window || element == document) fn = fn.bind(element);
            else fn = Wicket.Event.handler.bind([Wicket.Event.getId(element), fn]);
            element.attachEvent("on" + type, fn)
        }
        return element
    },
    domReadyHandlers: new Array,
    fireDomReadyHandlers: function() {
        var h = Wicket.Event.domReadyHandlers;
        while (h.length > 0) {
            var c = h.shift();
            c()
        }
        Wicket.Event.domReadyHandlers = null
    },
    addDomReadyEvent: function(fn) {
        if (window.loaded) fn();
        else if (!window.events || !window.events.domready) {
            Wicket.Event.domReadyHandlers.push(fn);
            var domReady = function() {
                if (window.loaded) return;
                window.loaded = true;
                Wicket.Event.fireDomReadyHandlers()
            }.bind(this);
            if (document.readyState && (Wicket.Browser.isKHTML() || Wicket.Browser.isSafari())) {
                var domCheck =
                    function() {
                        if (document.readyState == "loaded" || document.readyState == "complete") domReady();
                        else window.setTimeout(domCheck, 10)
                    };
                window.setTimeout(domCheck, 10)
            } else if (document.readyState && Wicket.Browser.isIE()) {
                if (document.getElementById("ie_ready") == null) {
                    var src = window.location.protocol == "https:" ? "//:" : "javascript:void(0)";
                    document.write('\x3cscript id\x3d"ie_ready" defer src\x3d"' + src + '"\x3e\x3c/script\x3e');
                    document.getElementById("ie_ready").onreadystatechange = function() {
                        if (this.readyState == "complete") domReady()
                    }
                }
            } else Wicket.Event.add(document,
                "DOMContentLoaded", domReady)
        } else window.addEventListener("domready", fn, false)
    }
};
if (Function.prototype.bind == null) Function.prototype.bind = function(object) {
    var __method = this;
    return function() {
        return __method.apply(object, arguments)
    }
};
if (typeof Wicket == "undefined") Wicket = {};
Wicket.$ = function(arg) {
    if (arg == null || typeof arg == "undefined") return null;
    if (arguments.length > 1) {
        var e = [];
        for (var i = 0; i < arguments.length; i++) e.push(Wicket.$(arguments[i]));
        return e
    } else if (typeof arg == "string") return document.getElementById(arg);
    else return arg
};
Wicket.$$ = function(element) {
    if (typeof element == "string") element = Wicket.$(element);
    if (element == null || typeof element == "undefined" || element.tagName == null || typeof element.tagName == "undefined") return true;
    var id = element.getAttribute("id");
    if (typeof id == "undefined" || id == null || id == "") return element.ownerDocument == document;
    else return document.getElementById(id) == element
};
Wicket.isPortlet = function() {
    return Wicket.portlet == true
};
Wicket.emptyFunction = function() {};
Wicket.Class = {
    create: function() {
        return function() {
            this.initialize.apply(this, arguments)
        }
    }
};
if (typeof DOMParser == "undefined" && Wicket.Browser.isSafari()) {
    DOMParser = function() {};
    DOMParser.prototype.parseFromString = function(str, contentType) {
        alert("You are using an old version of Safari.\nTo be able to use this page you need at least version 2.0.1.")
    }
}
Wicket.Log = {
    enabled: function() {
        return wicketAjaxDebugEnabled()
    },
    info: function(msg) {
        if (Wicket.Log.enabled()) WicketAjaxDebug.logInfo(msg)
    },
    error: function(msg) {
        if (Wicket.Log.enabled()) WicketAjaxDebug.logError(msg)
    },
    log: function(msg) {
        if (Wicket.Log.enabled()) WicketAjaxDebug.log(msg)
    }
}, Wicket.FunctionsExecuter = Wicket.Class.create();
Wicket.FunctionsExecuter.prototype = {
    initialize: function(functions) {
        this.functions = functions;
        this.current = 0;
        this.depth = 0
    },
    processNext: function() {
        if (this.current < this.functions.length) {
            var f = this.functions[this.current];
            var run = function() {
                try {
                    f(this.notify.bind(this))
                } catch (e) {
                    Wicket.Log.error("Wicket.FunctionsExecuter.processNext: " + e);
                    this.notify()
                }
            }.bind(this);
            this.current++;
            if (this.depth > 50 || Wicket.Browser.isKHTML() || Wicket.Browser.isSafari()) {
                this.depth = 0;
                window.setTimeout(run, 1)
            } else {
                this.depth++;
                run()
            }
        }
    },
    start: function() {
        this.processNext()
    },
    notify: function() {
        this.processNext()
    }
};
Wicket.functionExecuterSeq = 0;
Wicket.functionExecuterCallbacks = {};
Wicket.replaceOuterHtmlIE = function(element, text) {
    var marker = "__WICKET_JS_REMOVE_X9F4A__";

    function markIframe(text) {
        var t = text;
        var r = /<\s*iframe/i;
        while ((m = t.match(r)) != null) t = Wicket.replaceAll(t, m[0], "\x3c" + marker + m[0].substring(1));
        return t
    }

    function removeIframeMark(text) {
        return Wicket.replaceAll(text, marker, "")
    }
    if (element.tagName == "SCRIPT") {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = "\x3ctable\x3e" + text + "\x3c/table\x3e";
        var script = tempDiv.childNodes[0].childNodes[0].innerHTML;
        element.outerHtml =
            text;
        try {
            eval(script)
        } catch (e) {
            Wicket.Log.error("Wicket.replaceOuterHtmlIE: " + e + ": eval -\x3e " + script)
        }
        return
    } else if (element.tagName == "TITLE") {
        var titleText = />(.*?)</.exec(text)[1];
        document.title = titleText;
        return
    }
    var parent = element.parentNode;
    var tn = element.tagName;
    var tempDiv = document.createElement("div");
    var tempParent;
    var scripts = new Array;
    if (window.parent == window || window.parent == null) document.body.appendChild(tempDiv);
    if (tn != "TBODY" && tn != "TR" && tn != "TD" && tn != "THEAD" && tn != "TFOOT" && tn != "TH") {
        tempDiv.innerHTML =
            '\x3ctable style\x3d"display:none"\x3e' + markIframe(text) + "\x3c/table\x3e";
        var s = tempDiv.getElementsByTagName("script");
        for (var i = 0; i < s.length; ++i) scripts.push(s[i]);
        tempDiv.innerHTML = '\x3cdiv style\x3d"display:none"\x3e' + text + "\x3c/div\x3e";
        tempParent = tempDiv.childNodes[0];
        tempParent.parentNode.removeChild(tempParent)
    } else {
        tempDiv.innerHTML = '\x3cdiv style\x3d"display:none"\x3e' + markIframe(text) + "\x3c/div\x3e";
        var s = tempDiv.getElementsByTagName("script");
        for (var i = 0; i < s.length; ++i) scripts.push(s[i]);
        tempDiv.innerHTML = '\x3ctable style\x3d"display: none"\x3e' + text + "\x3c/table\x3e";
        tempParent = tempDiv.getElementsByTagName(tn).item(0).parentNode
    }
    while (tempParent.childNodes.length > 0) {
        var tempElement = tempParent.childNodes[0];
        if (tempElement.tagName != "SCRIPT") parent.insertBefore(tempElement, element);
        else tempParent.removeChild(tempElement);
        tempElement = null
    }
    if (element.style.backgroundImage) element.style.backgroundImage = "";
    parent.removeChild(element);
    element.outerHTML = "";
    element = "";
    if (window.parent == window ||
        window.parent == null) {
        if (tempDiv.style.backgroundImage) tempDiv.style.backgroundImage = "";
        document.body.removeChild(tempDiv)
    }
    tempDiv.outerHTML = "";
    parent = null;
    tempDiv = null;
    tempParent = null;
    for (i = 0; i < scripts.length; ++i) Wicket.Head.addJavascripts(scripts[i], removeIframeMark)
};
Wicket.replaceOuterHtmlSafari = function(element, text) {
    if (element.tagName == "SCRIPT") {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = text;
        var script = tempDiv.childNodes[0].innerHTML;
        if (typeof script != "string") script = tempDiv.childNodes[0].text;
        element.outerHTML = text;
        try {
            eval(script)
        } catch (e) {
            Wicket.Log.error("Wicket.replaceOuterHtmlSafari: " + e + ": eval -\x3e " + script)
        }
        return
    }
    var parent = element.parentNode;
    var next = element.nextSibling;
    while (next !== null && next.nodeType == 3) next = next.nextSibling;
    var index = 0;
    while (parent.childNodes[index] != element) ++index;
    element.outerHTML = text;
    element = parent.childNodes[index];
    while (element != next) {
        try {
            Wicket.Head.addJavascripts(element)
        } catch (ignore) {}
        element = element.nextSibling
    }
};
Wicket.replaceOuterHtml = function(element, text) {
    if (Wicket.Browser.isIE() || Wicket.Browser.isOpera()) Wicket.replaceOuterHtmlIE(element, text);
    else if (Wicket.Browser.isSafari()) Wicket.replaceOuterHtmlSafari(element, text);
    else {
        var range = element.ownerDocument.createRange();
        range.selectNode(element);
        var fragment = range.createContextualFragment(text);
        element.parentNode.replaceChild(fragment, element)
    }
};
Wicket.decode = function(encoding, text) {
    if (encoding == "wicket1") return Wicket.decode1(text)
};
Wicket.decode1 = function(text) {
    return Wicket.replaceAll(text, "]^", "]")
};
Wicket.replaceAll = function(str, from, to) {
    eval("var regex \x3d /" + from.replace(/\W/g, "\\$\x26") + "/g ;");
    return str.replace(regex, to)
};
Wicket.show = function(e) {
    var e = Wicket.$(e);
    if (e != null) e.style.display = ""
};
Wicket.hide = function(e) {
    var e = Wicket.$(e);
    if (e != null) e.style.display = "none"
};
Wicket.showIncrementally = function(e) {
    var e = Wicket.$(e);
    if (e == null) return;
    var count = e.getAttribute("showIncrementallyCount");
    count = parseInt(count == null ? 0 : count);
    if (count >= 0) Wicket.show(e);
    e.setAttribute("showIncrementallyCount", count + 1)
};
Wicket.hideIncrementally = function(e) {
    var e = Wicket.$(e);
    if (e == null) return;
    var count = e.getAttribute("showIncrementallyCount");
    count = parseInt(count == null ? 0 : count - 1);
    if (count <= 0) Wicket.hide(e);
    e.setAttribute("showIncrementallyCount", count)
};
Wicket.Form = {};
Wicket.Form.encode = function(text) {
    if (encodeURIComponent) return encodeURIComponent(text);
    else return escape(text)
};
Wicket.Form.serializeSelect = function(select) {
    if (select.multiple == false) return Wicket.Form.encode(select.name) + "\x3d" + Wicket.Form.encode(select.value) + "\x26";
    var result = "";
    for (var i = 0; i < select.options.length; ++i) {
        var option = select.options[i];
        if (option.selected) result += Wicket.Form.encode(select.name) + "\x3d" + Wicket.Form.encode(option.value) + "\x26"
    }
    return result
};
Wicket.Form.serializeInput = function(input) {
    var type = input.type.toLowerCase();
    if ((type == "checkbox" || type == "radio") && input.checked) return Wicket.Form.encode(input.name) + "\x3d" + Wicket.Form.encode(input.value) + "\x26";
    else if (type == "text" || type == "password" || type == "hidden" || type == "textarea" || type == "search") return Wicket.Form.encode(input.name) + "\x3d" + Wicket.Form.encode(input.value) + "\x26";
    else return ""
};
Wicket.Form.excludeFromAjaxSerialization = {};
Wicket.Form.serializeElement = function(e) {
    if (Wicket.Form.excludeFromAjaxSerialization && e.id && Wicket.Form.excludeFromAjaxSerialization[e.id] == "true") return "";
    var tag = e.tagName.toLowerCase();
    if (tag == "select") return Wicket.Form.serializeSelect(e);
    else if (tag == "input" || tag == "textarea") return Wicket.Form.serializeInput(e);
    else return ""
};
Wicket.Form.doSerialize = function(form) {
    var result = "";
    for (var i = 0; i < form.elements.length; ++i) {
        var e = form.elements[i];
        if (e.name && e.name != "" && !e.disabled) result += Wicket.Form.serializeElement(e)
    }
    return result
};
Wicket.Form.serialize = function(element, dontTryToFindRootForm) {
    if (element.tagName.toLowerCase() == "form") return Wicket.Form.doSerialize(element);
    else {
        var elementBck = element;
        if (dontTryToFindRootForm != true) {
            do element = element.parentNode; while (element.tagName.toLowerCase() != "form" && element.tagName.toLowerCase() != "body")
        }
        if (element.tagName.toLowerCase() == "form") return Wicket.Form.doSerialize(element);
        else {
            var form = document.createElement("form");
            var parent = elementBck.parentNode;
            parent.replaceChild(form,
                elementBck);
            form.appendChild(elementBck);
            var result = Wicket.Form.doSerialize(form);
            parent.replaceChild(elementBck, form);
            return result
        }
    }
};
Wicket.DOM = {};
Wicket.DOM.serializeNodeChildren = function(node) {
    if (node == null) return "";
    var result = "";
    for (var i = 0; i < node.childNodes.length; i++) {
        var thisNode = node.childNodes[i];
        switch (thisNode.nodeType) {
            case 1:
            case 5:
                result += Wicket.DOM.serializeNode(thisNode);
                break;
            case 8:
                result += "\x3c!--" + thisNode.nodeValue + "--\x3e";
                break;
            case 4:
                result += "\x3c![CDATA[" + thisNode.nodeValue + "]]\x3e";
                break;
            case 3:
            case 2:
                result += thisNode.nodeValue;
                break;
            default:
                break
        }
    }
    return result
};
Wicket.DOM.serializeNode = function(node) {
    if (node == null) return "";
    var result = "";
    result += "\x3c" + node.nodeName;
    if (node.attributes && node.attributes.length > 0)
        for (var i = 0; i < node.attributes.length; i++) result += " " + node.attributes[i].name + '\x3d"' + node.attributes[i].value + '"';
    result += "\x3e";
    result += Wicket.DOM.serializeNodeChildren(node);
    result += "\x3c/" + node.nodeName + "\x3e";
    return result
};
Wicket.DOM.containsElement = function(element) {
    var id = element.getAttribute("id");
    if (id != null) return Wicket.$(id) != null;
    else return false
};
Wicket.Channel = Wicket.Class.create();
Wicket.Channel.prototype = {
    initialize: function(name) {
        var res = name.match(/^([^|]+)\|(d|s)$/);
        if (res == null) this.type = "s";
        else this.type = res[2];
        this.callbacks = new Array;
        this.busy = false
    },
    schedule: function(callback) {
        if (this.busy == false) {
            this.busy = true;
            try {
                return callback()
            } catch (exception) {
                this.busy = false;
                Wicket.Log.error("An error occurred while executing Ajax request:" + exception)
            }
        } else {
            Wicket.Log.info("Channel busy - postponing...");
            if (this.type == "s") this.callbacks.push(callback);
            else this.callbacks[0] =
                callback;
            return null
        }
    },
    done: function() {
        var c = null;
        if (this.callbacks.length > 0) c = this.callbacks.shift();
        if (c != null && typeof c != "undefined") {
            Wicket.Log.info("Calling posponed function...");
            window.setTimeout(c, 1)
        } else this.busy = false
    }
};
Wicket.ChannelManager = Wicket.Class.create();
Wicket.ChannelManager.prototype = {
    initialize: function() {
        this.channels = new Array
    },
    schedule: function(channel, callback) {
        var c = this.channels[channel];
        if (c == null) {
            c = new Wicket.Channel(channel);
            this.channels[channel] = c
        }
        return c.schedule(callback)
    },
    done: function(channel) {
        var c = this.channels[channel];
        if (c != null) c.done()
    }
};
Wicket.channelManager = new Wicket.ChannelManager;
Wicket.Ajax = {
    createTransport: function() {
        var transport = null;
        if (window.XMLHttpRequest) {
            transport = new XMLHttpRequest;
            Wicket.Log.info("Using XMLHttpRequest transport")
        } else if (window.ActiveXObject) {
            transport = new ActiveXObject("Microsoft.XMLHTTP");
            Wicket.Log.info("Using ActiveX transport")
        }
        if (transport == null) Wicket.Log.error("Wicket.Ajax.createTransport: Could not locate ajax transport. Your browser does not support the required XMLHttpRequest object or wicket could not gain access to it.");
        return transport
    },
    transports: [],
    getTransport: function() {
        var t = Wicket.Ajax.transports;
        for (var i = 0; i < t.length; ++i)
            if (t[i].readyState == 0) return t[i];
        t.push(Wicket.Ajax.createTransport());
        return t[t.length - 1]
    },
    preCallHandlers: [],
    postCallHandlers: [],
    failureHandlers: [],
    registerPreCallHandler: function(handler) {
        var h = Wicket.Ajax.preCallHandlers;
        h.push(handler)
    },
    registerPostCallHandler: function(handler) {
        var h = Wicket.Ajax.postCallHandlers;
        h.push(handler)
    },
    registerFailureHandler: function(handler) {
        var h = Wicket.Ajax.failureHandlers;
        h.push(handler)
    },
    invokePreCallHandlers: function() {
        var h = Wicket.Ajax.preCallHandlers;
        if (h.length > 0) Wicket.Log.info("Invoking pre-call handler(s)...");
        for (var i = 0; i < h.length; ++i) h[i]()
    },
    invokePostCallHandlers: function() {
        var h = Wicket.Ajax.postCallHandlers;
        if (h.length > 0) Wicket.Log.info("Invoking post-call handler(s)...");
        for (var i = 0; i < h.length; ++i) h[i]()
    },
    invokeFailureHandlers: function() {
        var h = Wicket.Ajax.failureHandlers;
        if (h.length > 0) Wicket.Log.info("Invoking failure handler(s)...");
        for (var i = 0; i < h.length; ++i) h[i]()
    }
};
Wicket.Ajax.Request = Wicket.Class.create();
Wicket.Ajax.Request.prototype = {
    initialize: function(url, loadedCallback, parseResponse, randomURL, failureHandler, channel, successHandler) {
        this.url = url;
        this.loadedCallback = loadedCallback;
        this.parseResponse = parseResponse != null ? parseResponse : true;
        this.randomURL = randomURL != null ? randomURL : true;
        this.failureHandler = failureHandler != null ? failureHandler : function() {};
        this.successHandler = successHandler != null ? successHandler : function() {};
        this.async = true;
        this.channel = channel;
        this.precondition = function() {
            return true
        };
        this.suppressDone = false;
        this.instance = Math.random();
        this.debugContent = true
    },
    done: function() {
        Wicket.channelManager.done(this.channel)
    },
    createUrl: function() {
        if (this.randomURL == false) return this.url;
        else return this.url + (this.url.indexOf("?") > -1 ? "\x26" : "?") + "random\x3d" + Math.random()
    },
    log: function(method, url) {
        var log = Wicket.Log.info;
        log("");
        log("Initiating Ajax " + method + " request on " + url)
    },
    failure: function() {
        this.failureHandler();
        Wicket.Ajax.invokePostCallHandlers();
        Wicket.Ajax.invokeFailureHandlers()
    },
    get: function() {
        if (Wicket.isPortlet()) {
            var qs = this.url.indexOf("?");
            if (qs == -1) qs = this.url.indexOf("\x26");
            if (qs > -1) {
                var query = this.url.substring(qs + 1);
                if (query && query.length > 0) {
                    this.url = this.url.substring(0, qs);
                    if (query.charAt(query.length - 1) != "\x26") query += "\x26";
                    return this.post(query)
                }
            }
        }
        if (this.channel != null) {
            var res = Wicket.channelManager.schedule(this.channel, this.doGet.bind(this));
            return res != null ? res : true
        } else return this.doGet()
    },
    doGet: function() {
        if (this.precondition()) {
            this.transport = Wicket.Ajax.getTransport();
            var url = this.createUrl();
            this.log("GET", url);
            Wicket.Ajax.invokePreCallHandlers();
            var t = this.transport;
            if (t != null) {
                t.open("GET", url, this.async);
                t.onreadystatechange = this.stateChangeCallback.bind(this);
                t.setRequestHeader("Wicket-Ajax", "true");
                if (typeof Wicket.Focus.lastFocusId != "undefined" && Wicket.Focus.lastFocusId != "" && Wicket.Focus.lastFocusId != null) t.setRequestHeader("Wicket-FocusedElementId", Wicket.Focus.lastFocusId);
                t.setRequestHeader("Accept", "text/xml");
                t.send(null);
                return true
            } else {
                this.failure();
                return false
            }
        } else {
            Wicket.Log.info("Ajax GET stopped because of precondition check, url:" + this.url);
            this.done();
            return true
        }
    },
    post: function(body) {
        if (this.channel != null) {
            var res = Wicket.channelManager.schedule(this.channel, function() {
                this.doPost(body)
            }.bind(this));
            return res != null ? res : true
        } else return this.doPost(body)
    },
    doPost: function(body) {
        if (this.precondition()) {
            this.transport = Wicket.Ajax.getTransport();
            var url = this.createUrl();
            this.log("POST", url);
            Wicket.Ajax.invokePreCallHandlers();
            var t = this.transport;
            if (t != null) {
                if (typeof body == "function") body = body();
                t.open("POST", url, this.async);
                t.onreadystatechange = this.stateChangeCallback.bind(this);
                t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                t.setRequestHeader("Wicket-Ajax", "true");
                if (typeof Wicket.Focus.lastFocusId != "undefined" && Wicket.Focus.lastFocusId != "" && Wicket.Focus.lastFocusId != null) t.setRequestHeader("Wicket-FocusedElementId", Wicket.Focus.lastFocusId);
                t.setRequestHeader("Accept", "text/xml");
                t.send(body);
                return true
            } else {
                this.failure();
                return false
            }
        } else {
            Wicket.Log.info("Ajax POST stopped because of precondition check, url:" + this.url);
            this.done();
            return true
        }
    },
    stateChangeCallback: function() {
        var t = this.transport;
        var status;
        if (t != null && t.readyState == 4) {
            try {
                status = t.status
            } catch (e) {
                Wicket.Log.error("Wicket.Ajax.Request.stateChangeCallback: Exception evaluating AJAX status: " + e);
                status = "unavailable"
            }
            if (status == 200 || status == "") {
                var responseAsText = t.responseText;
                var redirectUrl;
                try {
                    redirectUrl = t.getResponseHeader("Ajax-Location")
                } catch (ignore) {}
                if (typeof redirectUrl !=
                    "undefined" && redirectUrl != null && redirectUrl != "") {
                    t.onreadystatechange = Wicket.emptyFunction;
                    this.done();
                    this.successHandler();
                    if (redirectUrl.charAt(0) == "/" || redirectUrl.match("^http://") == "http://" || redirectUrl.match("^https://") == "https://") window.location = redirectUrl;
                    else {
                        var urlDepth = 0;
                        while (redirectUrl.substring(0, 3) == "../") {
                            urlDepth++;
                            redirectUrl = redirectUrl.substring(3)
                        }
                        var calculatedRedirect = window.location.pathname;
                        while (urlDepth > -1) {
                            urlDepth--;
                            i = calculatedRedirect.lastIndexOf("/");
                            if (i > -1) calculatedRedirect =
                                calculatedRedirect.substring(0, i)
                        }
                        calculatedRedirect += "/" + redirectUrl;
                        if (Wicket.Browser.isGecko()) calculatedRedirect = window.location.protocol + "//" + window.location.host + calculatedRedirect;
                        window.location = calculatedRedirect
                    }
                } else {
                    var log = Wicket.Log.info;
                    log("Received ajax response (" + responseAsText.length + " characters)");
                    if (this.debugContent != false) log("\n" + responseAsText);
                    if (this.parseResponse == true) {
                        var xmldoc;
                        if (typeof window.XMLHttpRequest != "undefined" && typeof DOMParser != "undefined") {
                            var parser =
                                new DOMParser;
                            xmldoc = parser.parseFromString(responseAsText, "text/xml")
                        } else if (window.ActiveXObject) xmldoc = t.responseXML;
                        this.loadedCallback(xmldoc)
                    } else this.loadedCallback(responseAsText);
                    if (this.suppressDone == false) this.done()
                }
            } else {
                var log = Wicket.Log.error;
                log("Received Ajax response with code: " + status);
                if (status == 500) log("500 error had text: " + t.responseText);
                this.done();
                this.failure()
            }
            t.onreadystatechange = Wicket.emptyFunction;
            t.abort();
            this.transport = null
        }
    }
};
Wicket.Ajax.Call = Wicket.Class.create();
Wicket.Ajax.Call.prototype = {
    initialize: function(url, successHandler, failureHandler, channel) {
        this.successHandler = successHandler != null ? successHandler : function() {};
        this.failureHandler = failureHandler != null ? failureHandler : function() {};
        var c = channel != null ? channel : "0|s";
        this.request = new Wicket.Ajax.Request(url, this.loadedCallback.bind(this), true, true, failureHandler, c, successHandler);
        this.request.suppressDone = true
    },
    failure: function(message) {
        if (message != null) Wicket.Log.error("Wicket.Ajax.Call.failure: Error while parsing response: " +
            message);
        this.request.done();
        this.failureHandler();
        Wicket.Ajax.invokePostCallHandlers();
        Wicket.Ajax.invokeFailureHandlers()
    },
    call: function() {
        return this.request.get()
    },
    post: function(body) {
        return this.request.post(body)
    },
    submitFormById: function(formId, submitButton) {
        var form = Wicket.$(formId);
        if (form == null || typeof form == "undefined") Wicket.Log.error("Wicket.Ajax.Call.submitFormById: Trying to submit form with id '" + formId + "' that is not in document.");
        return this.submitForm(form, submitButton)
    },
    submitForm: function(form,
        submitButton) {
        var submittingAttribute = "data-wicket-submitting";
        if (form.onsubmit && !form.getAttribute(submittingAttribute)) {
            form.setAttribute(submittingAttribute, submittingAttribute);
            var retValue = form.onsubmit();
            form.removeAttribute(submittingAttribute);
            if (!retValue) return
        }
        if (this.handleMultipart(form, submitButton)) return true;
        var body = function() {
            var s = Wicket.Form.serialize(form);
            if (submitButton != null) s += Wicket.Form.encode(submitButton) + "\x3d1";
            return s
        };
        return this.request.post(body)
    },
    handleMultipart: function(form,
        submitButton) {
        var multipart = false;
        if (form.tagName.toLowerCase() != "form") {
            do {
                if (multipart == false && Wicket != undefined && Wicket.Forms != undefined) {
                    var meta = Wicket.Forms[form.id];
                    if (meta != undefined)
                        if (meta["multipart"] != undefined) multipart = multipart || meta["multipart"]
                }
                form = form.parentNode
            } while (form.tagName.toLowerCase() != "form" && form !== document.body)
        }
        if (form.tagName.toLowerCase() != "form") return false;
        multipart = multipart || form.enctype == "multipart/form-data";
        if (multipart == false) return false;
        var originalFormAction =
            form.action;
        var originalFormTarget = form.target;
        var originalFormMethod = form.method;
        var originalFormEnctype = form.enctype;
        var originalFormEncoding = form.encoding;
        var iframeName = "wicket-submit-" + ("" + Math.random()).substr(2);
        var iframe = Wicket._createIFrame(iframeName);
        document.body.appendChild(iframe);
        form.target = iframe.name;
        var separator = this.request.url.indexOf("?") > -1 ? "\x26" : "?";
        form.action = this.request.url + separator + "wicket:ajax\x3dtrue";
        form.method = "post";
        form.enctype = "multipart/form-data";
        form.encoding =
            "multipart/form-data";
        if (submitButton != null) {
            try {
                var btn = document.createElement("\x3cinput type\x3d'hidden' name\x3d'" + submitButton + "' id\x3d'" + iframe.id + "-btn' value\x3d'1'/\x3e")
            } catch (ex) {
                var btn = document.createElement("input");
                btn.type = "hidden";
                btn.name = submitButton;
                btn.id = iframe.id + "-btn";
                btn.value = "1"
            }
            form.appendChild(btn)
        }
        Wicket.Ajax.invokePreCallHandlers();
        form.submit();
        Wicket.Event.add(iframe, "load", this.handleMultipartComplete.bind(this));
        form.action = originalFormAction;
        form.target = originalFormTarget;
        form.method = originalFormMethod;
        form.enctype = originalFormEnctype;
        form.encoding = originalFormEncoding;
        return true
    },
    handleMultipartComplete: function(event) {
        if (event == null) event = window.event;
        if (event.target != null) var iframe = event.target;
        else var iframe = event.srcElement;
        var envelope = iframe.contentWindow.document;
        if (envelope.XMLDocument != null) envelope = envelope.XMLDocument;
        this.loadedCallback(envelope);
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        if (iframe.detachEvent) iframe.detachEvent("onload",
            this.handleMultipartComplete);
        else iframe.removeEventListener("load", this.handleMultipartComplete, false);
        setTimeout(function() {
            var e = document.getElementById(iframe.id + "-btn");
            if (e != null) e.parentNode.removeChild(e);
            iframe.parentNode.removeChild(iframe)
        }, 250)
    },
    loadedCallback: function(envelope) {
        try {
            var root = envelope.getElementsByTagName("ajax-response")[0];
            if (root == null || root.tagName != "ajax-response") {
                this.failure("Could not find root \x3cajax-response\x3e element");
                return
            }
            var steps = new Array;
            steps.push(function(notify) {
                window.setTimeout(notify,
                    2)
            }.bind(this));
            if (Wicket.Browser.isKHTML()) steps.push = function(method) {
                method(function() {})
            };
            var stepIndexOfLastReplacedComponent = -1;
            for (var i = 0; i < root.childNodes.length; ++i) {
                var node = root.childNodes[i];
                if (node.tagName == "component") {
                    if (stepIndexOfLastReplacedComponent == -1) this.processFocusedComponentMark(steps);
                    stepIndexOfLastReplacedComponent = steps.length;
                    this.processComponent(steps, node)
                } else if (node.tagName == "evaluate") this.processEvaluation(steps, node);
                else if (node.tagName == "header-contribution") this.processHeaderContribution(steps,
                    node);
                else if (node.tagName == "redirect") this.processRedirect(steps, node)
            }
            if (stepIndexOfLastReplacedComponent != -1) this.processFocusedComponentReplaceCheck(steps, stepIndexOfLastReplacedComponent);
            this.success(steps);
            if (Wicket.Browser.isKHTML() == false) {
                Wicket.Log.info("Response parsed. Now invoking steps...");
                var executer = new Wicket.FunctionsExecuter(steps);
                executer.start()
            }
        } catch (e) {
            this.failure(e.message)
        }
    },
    success: function(steps) {
        steps.push(function(notify) {
            Wicket.Log.info("Response processed successfully.");
            Wicket.Ajax.invokePostCallHandlers();
            Wicket.Focus.attachFocusEvent();
            this.request.done();
            this.successHandler();
            setTimeout("Wicket.Focus.requestFocus();", 0);
            notify()
        }.bind(this))
    },
    processComponent: function(steps, node) {
        steps.push(function(notify) {
            var compId = node.getAttribute("id");
            var text = Wicket._readTextNode(node);
            var encoding = node.getAttribute("encoding");
            if (encoding != null && encoding != "") text = Wicket.decode(encoding, text);
            var element = Wicket.$(compId);
            if (element == null || typeof element == "undefined") Wicket.Log.error("Wicket.Ajax.Call.processComponent: Component with id [[" +
                compId + "]] was not found while trying to perform markup update. Make sure you called component.setOutputMarkupId(true) on the component whose markup you are trying to update.");
            else Wicket.replaceOuterHtml(element, text);
            notify()
        })
    },
    processEvaluation: function(steps, node) {
        steps.push(function(notify) {
            var text = Wicket._readTextNode(node);
            var encoding = node.getAttribute("encoding");
            if (encoding != null) text = Wicket.decode(encoding, text);
            var res = text.match(new RegExp("^([a-z|A-Z_][a-z|A-Z|0-9_]*)\\|((.|\\n)*)$"));
            if (res != null) {
                text = "var f \x3d function(" + res[1] + ") {" + res[2] + "};";
                try {
                    eval(text);
                    f(notify)
                } catch (exception) {
                    Wicket.Log.error("Wicket.Ajax.Call.processEvaluation: Exception evaluating javascript: " + exception)
                }
            } else {
                try {
                    eval(text)
                } catch (exception) {
                    Wicket.Log.error("Wicket.Ajax.Call.processEvaluation: Exception evaluating javascript: " + exception)
                }
                notify()
            }
        })
    },
    processHeaderContribution: function(steps, node) {
        var c = new Wicket.Head.Contributor;
        c.processContribution(steps, node)
    },
    processRedirect: function(steps,
        node) {
        var text = Wicket._readTextNode(node);
        Wicket.Log.info("Redirecting to: " + text);
        window.location = text
    },
    processFocusedComponentMark: function(steps) {
        steps.push(function(notify) {
            Wicket.Focus.markFocusedComponent();
            notify()
        })
    },
    processFocusedComponentReplaceCheck: function(steps, lastReplaceComponentStep) {
        steps.splice(lastReplaceComponentStep + 1, 0, function(notify) {
            Wicket.Focus.checkFocusedComponentReplaced();
            notify()
        })
    }
};
Wicket.Head = {};
Wicket.Head.Contributor = Wicket.Class.create();
Wicket.Head.Contributor.prototype = {
    initialize: function() {},
    parse: function(headerNode) {
        var text = Wicket._readTextNode(headerNode);
        var encoding = headerNode.getAttribute("encoding");
        if (encoding != null && encoding != "") text = Wicket.decode(encoding, text);
        if (Wicket.Browser.isKHTML()) {
            text = text.replace(/<script/g, "\x3cSCRIPT");
            text = text.replace(/<\/script>/g, "\x3c/SCRIPT\x3e")
        }
        var xmldoc;
        if (window.DOMParser) {
            var parser = new DOMParser;
            xmldoc = parser.parseFromString(text, "text/xml")
        } else if (window.ActiveXObject) {
            xmldoc =
                new ActiveXObject("Microsoft.XMLDOM");
            if (!xmldoc.loadXML(text)) Wicket.Log.error("Error parsing response: " + text)
        }
        return xmldoc
    },
    _checkParserError: function(node) {
        var result = false;
        if (node.tagName != null && node.tagName.toLowerCase() == "parsererror") {
            Wicket.Log.error("Error in parsing: " + node.textContent);
            result = true
        }
        return result
    },
    processContribution: function(steps, headerNode) {
        var xmldoc = this.parse(headerNode);
        var rootNode = xmldoc.documentElement;
        if (this._checkParserError(rootNode)) return;
        for (var i = 0; i <
            rootNode.childNodes.length; i++) {
            var node = rootNode.childNodes[i];
            if (this._checkParserError(node)) return;
            if (node.tagName != null) {
                var name = node.tagName.toLowerCase();
                if (name == "wicket:link")
                    for (var j = 0; j < node.childNodes.length; ++j) {
                        var childNode = node.childNodes[j];
                        if (childNode.nodeType == 1) {
                            node = childNode;
                            name = node.tagName.toLowerCase();
                            break
                        }
                    }
                if (name == "link") this.processLink(steps, node);
                else if (name == "script") this.processScript(steps, node);
                else if (name == "style") this.processStyle(steps, node)
            } else if (node.nodeType ===
                8) this.processComment(steps, node)
        }
    },
    processLink: function(steps, node) {
        steps.push(function(notify) {
            if (Wicket.Head.containsElement(node, "href")) {
                notify();
                return
            }
            var css = Wicket.Head.createElement("link");
            css.id = node.getAttribute("id");
            css.rel = node.getAttribute("rel");
            css.href = node.getAttribute("href");
            css.type = node.getAttribute("type");
            Wicket.Head.addElement(css);
            var img = document.createElement("img");
            var notifyCalled = false;
            img.onerror = function() {
                if (!notifyCalled) {
                    notifyCalled = true;
                    notify()
                }
            };
            img.src =
                css.href;
            if (img.complete)
                if (!notifyCalled) {
                    notifyCalled = true;
                    notify()
                }
        })
    },
    processStyle: function(steps, node) {
        steps.push(function(notify) {
            if (Wicket.DOM.containsElement(node)) {
                notify();
                return
            }
            var content = Wicket.DOM.serializeNodeChildren(node);
            var style = Wicket.Head.createElement("style");
            style.id = node.getAttribute("id");
            if (Wicket.Browser.isIE()) try {
                document.createStyleSheet().cssText = content
            } catch (ignore) {
                var run = function() {
                    try {
                        document.createStyleSheet().cssText = content
                    } catch (e) {
                        Wicket.Log.error("Wicket.Head.Contributor.processStyle: " +
                            e)
                    }
                };
                window.setTimeout(run, 1)
            } else {
                var textNode = document.createTextNode(content);
                style.appendChild(textNode)
            }
            Wicket.Head.addElement(style);
            notify()
        })
    },
    processScript: function(steps, node) {
        steps.push(function(notify) {
            if (Wicket.DOM.containsElement(node) || Wicket.Head.containsElement(node, "src")) {
                notify();
                return
            }
            var src = node.getAttribute("src");
            if (src != null && src != "") {
                var callBackIdentifier = "script" + Wicket.functionExecuterSeq++;
                var onLoad = function(content) {
                    Wicket.functionExecuterCallbacks[callBackIdentifier] =
                        function() {
                            Wicket.Ajax.invokePostCallHandlers();
                            notify()
                        };
                    Wicket.Head.addJavascript(content + "; Wicket.functionExecuterCallbacks['" + callBackIdentifier + "'](); delete Wicket.functionExecuterCallbacks['" + callBackIdentifier + "']; ", null, src)
                };
                window.setTimeout(function() {
                    var req = new Wicket.Ajax.Request(src, onLoad, false, false);
                    req.debugContent = false;
                    if (Wicket.Browser.isKHTML()) req.async = false;
                    req.get()
                }, 1)
            } else {
                var text = Wicket.DOM.serializeNodeChildren(node);
                text = text.replace(/^\x3c!--\/\*--\x3e<!\[CDATA\[\/\*>\x3c!--\*\//,
                    "");
                text = text.replace(/\/\*--\x3e]]\x3e\*\/$/, "");
                var id = node.getAttribute("id");
                if (typeof id == "string" && id.length > 0) Wicket.Head.addJavascript(text, id);
                else try {
                    eval(text)
                } catch (e) {
                    Wicket.Log.error("Wicket.Head.Contributor.processScript: " + e + ": eval -\x3e " + text)
                }
                notify()
            }
        })
    },
    processComment: function(steps, node) {
        steps.push(function(notify) {
            var comment = document.createComment(node.nodeValue);
            Wicket.Head.addElement(comment);
            notify()
        })
    }
};
Wicket.Head.createElement = function(name) {
    return document.createElement(name)
};
Wicket.Head.addElement = function(element) {
    var head = document.getElementsByTagName("head");
    if (head[0]) head[0].appendChild(element)
};
Wicket.Head.containsElement = function(element, mandatoryAttribute) {
    var attr = element.getAttribute(mandatoryAttribute);
    if (attr == null || attr == "" || typeof attr == "undefined") return false;
    var head = document.getElementsByTagName("head")[0];
    if (element.tagName == "script") head = document;
    var nodes = head.getElementsByTagName(element.tagName);
    for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];
        if (node.tagName.toLowerCase() == element.tagName.toLowerCase() && (node.getAttribute(mandatoryAttribute) == attr || node.getAttribute(mandatoryAttribute +
                "_") == attr)) return true
    }
    return false
};
Wicket.Head.addJavascript = function(content, id, fakeSrc) {
    var script = Wicket.Head.createElement("script");
    script.id = id;
    script.setAttribute("src_", fakeSrc);
    if (null == script.canHaveChildren || script.canHaveChildren) {
        var textNode = document.createTextNode(content);
        script.appendChild(textNode)
    } else script.text = content;
    Wicket.Head.addElement(script)
};
Wicket.Head.addJavascripts = function(element, contentFilter) {
    function add(element) {
        var src = element.getAttribute("src");
        if (src != null && src.length > 0) {
            var e = document.createElement("script");
            e.setAttribute("type", "text/javascript");
            e.setAttribute("src", src);
            Wicket.Head.addElement(e)
        } else {
            var content = Wicket.DOM.serializeNodeChildren(element);
            if (content == null || content == "") content = element.text;
            if (typeof contentFilter == "function") content = contentFilter(content);
            Wicket.Head.addJavascript(content)
        }
    }
    if (typeof element !=
        "undefined" && typeof element.tagName != "undefined" && element.tagName.toLowerCase() == "script") add(element);
    else if (element.childNodes.length > 0) {
        var scripts = element.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; ++i) add(scripts[i])
    }
};
Wicket.ThrottlerEntry = Wicket.Class.create();
Wicket.ThrottlerEntry.prototype = {
    initialize: function(func) {
        this.func = func;
        this.timestamp = (new Date).getTime();
        this.timeoutVar = undefined
    },
    getTimestamp: function() {
        return this.timestamp
    },
    getFunc: function() {
        return this.func
    },
    setFunc: function(func) {
        this.func = func
    },
    getTimeoutVar: function() {
        return this.timeoutVar
    },
    setTimeoutVar: function(timeoutVar) {
        this.timeoutVar = timeoutVar
    }
};
Wicket.Throttler = Wicket.Class.create();
Wicket.Throttler.prototype = {
    initialize: function(postponeTimerOnUpdate) {
        this.entries = new Array;
        if (postponeTimerOnUpdate != undefined) this.postponeTimerOnUpdate = postponeTimerOnUpdate;
        else this.postponeTimerOnUpdate = false
    },
    throttle: function(id, millis, func) {
        var entry = this.entries[id];
        var me = this;
        if (entry == undefined) {
            entry = new Wicket.ThrottlerEntry(func);
            entry.setTimeoutVar(window.setTimeout(function() {
                me.execute(id)
            }, millis));
            this.entries[id] = entry
        } else {
            entry.setFunc(func);
            if (this.postponeTimerOnUpdate ==
                true) {
                window.clearTimeout(entry.getTimeoutVar());
                entry.setTimeoutVar(window.setTimeout(function() {
                    me.execute(id)
                }, millis))
            }
        }
    },
    execute: function(id) {
        var entry = this.entries[id];
        if (entry != undefined) {
            var func = entry.getFunc();
            this.entries[id] = undefined;
            var tmp = func()
        }
    }
};
Wicket.throttler = new Wicket.Throttler;
Wicket.stopEvent = function(e) {
    e = Wicket.fixEvent(e);
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation()
};
Wicket.fixEvent = function(e) {
    if (typeof e == "undefined") e = window.event;
    return e
};
Wicket.Drag = {
    init: function(element, onDragBegin, onDragEnd, onDrag) {
        if (typeof onDragBegin == "undefined") onDragBegin = Wicket.emptyFunction;
        if (typeof onDragEnd == "undefined") onDragEnd = Wicket.emptyFunction;
        if (typeof onDrag == "undefined") onDrag = Wicket.emptyFunction;
        element.wicketOnDragBegin = onDragBegin;
        element.wicketOnDrag = onDrag;
        element.wicketOnDragEnd = onDragEnd;
        Wicket.Event.add(element, "mousedown", Wicket.Drag.mouseDownHandler)
    },
    mouseDownHandler: function(e) {
        e = Wicket.fixEvent(e);
        var element = this;
        if (typeof e.ignore ==
            "undefined") {
            Wicket.stopEvent(e);
            if (e.preventDefault) e.preventDefault();
            element.wicketOnDragBegin(element);
            element.lastMouseX = e.clientX;
            element.lastMouseY = e.clientY;
            element.old_onmousemove = document.onmousemove;
            element.old_onmouseup = document.onmouseup;
            element.old_onselectstart = document.onselectstart;
            element.old_onmouseout = document.onmouseout;
            document.onselectstart = function() {
                return false
            };
            document.onmousemove = Wicket.Drag.mouseMove;
            document.onmouseup = Wicket.Drag.mouseUp;
            document.onmouseout = Wicket.Drag.mouseOut;
            Wicket.Drag.current = element;
            return false
        }
    },
    clean: function(element) {
        element.onmousedown = null
    },
    mouseMove: function(e) {
        e = Wicket.fixEvent(e);
        var o = Wicket.Drag.current;
        if (e.clientX < 0 || e.clientY < 0) return;
        if (o != null) {
            var deltaX = e.clientX - o.lastMouseX;
            var deltaY = e.clientY - o.lastMouseY;
            var res = o.wicketOnDrag(o, deltaX, deltaY, e);
            if (res == null) res = [0, 0];
            o.lastMouseX = e.clientX + res[0];
            o.lastMouseY = e.clientY + res[1]
        }
        return false
    },
    mouseUp: function(e) {
        e = Wicket.fixEvent(e);
        var o = Wicket.Drag.current;
        if (o != null && typeof o !=
            "undefined") {
            o.wicketOnDragEnd(o);
            o.lastMouseX = null;
            o.lastMouseY = null;
            document.onmousemove = o.old_onmousemove;
            document.onmouseup = o.old_onmouseup;
            document.onselectstart = o.old_onselectstart;
            document.onmouseout = o.old_onmouseout;
            o.old_mousemove = null;
            o.old_mouseup = null;
            o.old_onselectstart = null;
            o.old_onmouseout = null;
            Wicket.Drag.current = null
        }
    },
    mouseOut: function(e) {
        if (false && Wicket.Browser.isGecko()) {
            e = Wicket.fixEvent(e);
            if (e.target.tagName == "HTML") Wicket.Drag.mouseUp(e)
        }
    }
};
Wicket.ChangeHandler = function(elementId) {
    var KEY_BACKSPACE = 8;
    var KEY_TAB = 9;
    var KEY_ENTER = 13;
    var KEY_ESC = 27;
    var KEY_LEFT = 37;
    var KEY_UP = 38;
    var KEY_RIGHT = 39;
    var KEY_DOWN = 40;
    var KEY_SHIFT = 16;
    var KEY_CTRL = 17;
    var KEY_ALT = 18;
    var KEY_END = 35;
    var KEY_HOME = 36;
    var obj = Wicket.$(elementId);
    obj.setAttribute("autocomplete", "off");
    obj.onchangeoriginal = obj.onchange;
    if (Wicket.Browser.isIE() || Wicket.Browser.isKHTML() || Wicket.Browser.isSafari()) {
        var objonchange = obj.onchange;
        obj.onkeyup = function(event) {
            switch (wicketKeyCode(Wicket.fixEvent(event))) {
                case KEY_ENTER:
                case KEY_UP:
                case KEY_DOWN:
                case KEY_ESC:
                case KEY_TAB:
                case KEY_RIGHT:
                case KEY_LEFT:
                case KEY_SHIFT:
                case KEY_ALT:
                case KEY_CTRL:
                case KEY_HOME:
                case KEY_END:
                    return Wicket.stopEvent(event);
                    break;
                default:
                    if (typeof objonchange == "function") objonchange()
            }
            return null
        };
        obj.onpaste = function(event) {
            if (typeof objonchange == "function") setTimeout(function() {
                objonchange()
            }, 10);
            return null
        };
        obj.oncut = function(event) {
            if (typeof objonchange == "function") setTimeout(function() {
                objonchange()
            }, 10);
            return null
        }
    } else obj.addEventListener("input", obj.onchange, true);
    obj.onchange = function(event) {
        Wicket.stopEvent(event)
    }
};
var wicketThrottler = Wicket.throttler;

function wicketAjaxGet(url, successHandler, failureHandler, precondition, channel) {
    var call = new Wicket.Ajax.Call(url, successHandler, failureHandler, channel);
    if (typeof precondition != "undefined" && precondition != null) call.request.precondition = precondition;
    return call.call()
}

function wicketAjaxPost(url, body, successHandler, failureHandler, precondition, channel) {
    var call = new Wicket.Ajax.Call(url, successHandler, failureHandler, channel);
    if (typeof precondition != "undefined" && precondition != null) call.request.precondition = precondition;
    return call.post(body)
}

function wicketSubmitForm(form, url, submitButton, successHandler, failureHandler, precondition, channel) {
    var call = new Wicket.Ajax.Call(url, successHandler, failureHandler, channel);
    if (typeof precondition != "undefined" && precondition != null) call.request.precondition = precondition;
    return call.submitForm(form, submitButton)
}

function wicketSubmitFormById(formId, url, submitButton, successHandler, failureHandler, precondition, channel) {
    var call = new Wicket.Ajax.Call(url, successHandler, failureHandler, channel);
    if (typeof precondition != "undefined" && precondition != null) call.request.precondition = precondition;
    return call.submitFormById(formId, submitButton)
}
wicketSerialize = Wicket.Form.serializeElement;
wicketSerializeForm = Wicket.Form.serialize;
wicketEncode = Wicket.Form.encode;
wicketDecode = Wicket.decode;
wicketAjaxGetTransport = Wicket.Ajax.getTransport;
Wicket.Ajax.registerPreCallHandler(function() {
    if (typeof window.wicketGlobalPreCallHandler != "undefined") {
        var global = wicketGlobalPreCallHandler;
        if (global != null) global()
    }
});
Wicket.Ajax.registerPostCallHandler(function() {
    if (typeof window.wicketGlobalPostCallHandler != "undefined") {
        var global = wicketGlobalPostCallHandler;
        if (global != null) global()
    }
});
Wicket.Ajax.registerFailureHandler(function() {
    if (typeof window.wicketGlobalFailureHandler != "undefined") {
        var global = wicketGlobalFailureHandler;
        if (global != null) global()
    }
});
Wicket.Focus = {
    lastFocusId: "",
    refocusLastFocusedComponentAfterResponse: false,
    focusSetFromServer: false,
    setFocus: function(event) {
        event = Wicket.fixEvent(event);
        var target = event.target ? event.target : event.srcElement;
        if (target) {
            Wicket.Focus.refocusLastFocusedComponentAfterResponse = false;
            Wicket.Focus.lastFocusId = target.id;
            Wicket.Log.info("focus set on " + Wicket.Focus.lastFocusId)
        }
    },
    blur: function(event) {
        event = Wicket.fixEvent(event);
        var target = event.target ? event.target : event.srcElement;
        if (target && Wicket.Focus.lastFocusId ==
            target.id)
            if (Wicket.Focus.refocusLastFocusedComponentAfterResponse) Wicket.Log.info("focus removed from " + target.id + " but ignored because of component replacement");
            else {
                Wicket.Focus.lastFocusId = null;
                Wicket.Log.info("focus removed from " + target.id)
            }
    },
    getFocusedElement: function() {
        if (typeof Wicket.Focus.lastFocusId != "undefined" && Wicket.Focus.lastFocusId != "" && Wicket.Focus.lastFocusId != null) {
            Wicket.Log.info("returned focused element: " + Wicket.$(Wicket.Focus.lastFocusId));
            return Wicket.$(Wicket.Focus.lastFocusId)
        }
        return
    },
    setFocusOnId: function(id) {
        if (typeof id != "undefined" && id != "" && id != null) {
            Wicket.Focus.refocusLastFocusedComponentAfterResponse = true;
            Wicket.Focus.focusSetFromServer = true;
            Wicket.Focus.lastFocusId = id;
            Wicket.Log.info("focus set on " + Wicket.Focus.lastFocusId + " from serverside")
        } else {
            Wicket.Focus.refocusLastFocusedComponentAfterResponse = false;
            Wicket.Log.info("refocus focused component after request stopped from serverside")
        }
    },
    markFocusedComponent: function() {
        var focusedElement = Wicket.Focus.getFocusedElement();
        if (typeof focusedElement != "undefined" && focusedElement != null) {
            focusedElement.wasFocusedBeforeComponentReplacements = true;
            Wicket.Focus.refocusLastFocusedComponentAfterResponse = true;
            Wicket.Focus.focusSetFromServer = false
        } else Wicket.Focus.refocusLastFocusedComponentAfterResponse = false
    },
    checkFocusedComponentReplaced: function() {
        var focusedElement = Wicket.Focus.getFocusedElement();
        if (Wicket.Focus.refocusLastFocusedComponentAfterResponse == true)
            if (typeof focusedElement != "undefined" && focusedElement != null) {
                if (typeof focusedElement.wasFocusedBeforeComponentReplacements !=
                    "undefined") Wicket.Focus.refocusLastFocusedComponentAfterResponse = false
            } else {
                Wicket.Focus.refocusLastFocusedComponentAfterResponse = false;
                Wicket.Focus.lastFocusId = ""
            }
    },
    requestFocus: function() {
        if (Wicket.Focus.refocusLastFocusedComponentAfterResponse && typeof Wicket.Focus.lastFocusId != "undefined" && Wicket.Focus.lastFocusId != "" && Wicket.Focus.lastFocusId != null) {
            var toFocus = Wicket.$(Wicket.Focus.lastFocusId);
            if (toFocus != null && typeof toFocus != "undefined") {
                Wicket.Log.info("Calling focus on " + Wicket.Focus.lastFocusId);
                try {
                    if (Wicket.Focus.focusSetFromServer) toFocus.focus();
                    else {
                        var temp = toFocus.onfocus;
                        toFocus.onfocus = null;
                        toFocus.focus();
                        setTimeout(function() {
                            toFocus.onfocus = temp
                        }, 0)
                    }
                } catch (ignore) {}
            } else {
                Wicket.Focus.lastFocusId = "";
                Wicket.Log.info("Couldn't set focus on " + Wicket.Focus.lastFocusId + " not on the page anymore")
            }
        } else if (Wicket.Focus.refocusLastFocusedComponentAfterResponse) Wicket.Log.info("last focus id was not set");
        else Wicket.Log.info("refocus last focused component not needed/allowed");
        Wicket.Focus.refocusLastFocusedComponentAfterResponse =
            false
    },
    setFocusOnElements: function(elements) {
        var len = elements.length;
        for (var i = 0; i < len; i++)
            if (elements[i].wicketFocusSet != true) {
                Wicket.Event.add(elements[i], "focus", Wicket.Focus.setFocus);
                Wicket.Event.add(elements[i], "blur", Wicket.Focus.blur);
                elements[i].wicketFocusSet = true
            }
    },
    attachFocusEvent: function() {
        Wicket.Focus.setFocusOnElements(document.getElementsByTagName("input"));
        Wicket.Focus.setFocusOnElements(document.getElementsByTagName("select"));
        Wicket.Focus.setFocusOnElements(document.getElementsByTagName("textarea"));
        Wicket.Focus.setFocusOnElements(document.getElementsByTagName("button"));
        Wicket.Focus.setFocusOnElements(document.getElementsByTagName("a"))
    }
};
Wicket.Event.addDomReadyEvent(Wicket.Focus.attachFocusEvent);

function wicketAjaxDebugEnabled() {
    if (typeof wicketAjaxDebugEnable == "undefined") return false;
    else return wicketAjaxDebugEnable == true
}

function wicketKeyCode(event) {
    if (typeof event.keyCode == "undefined") return event.which;
    else return event.keyCode
}

function wicketGet(id) {
    return Wicket.$(id)
}

function wicketShow(id) {
    var e = wicketGet(id);
    if (e != null) e.style.display = ""
}

function wicketHide(id) {
    var e = wicketGet(id);
    if (e != null) e.style.display = "none"
}
Wicket._readTextNode = function(node) {
    var text = "";
    if (node.hasChildNodes())
        for (i = 0; i < node.childNodes.length; i++) text = text + node.childNodes[i].nodeValue;
    return text
};
Wicket._createIFrame = function(iframeName) {
    try {
        var iframe = document.createElement("\x3ciframe name\x3d'" + iframeName + "' id\x3d'" + iframeName + "' src\x3d'about:blank'/\x3e")
    } catch (ex) {
        var iframe = document.createElement("iframe");
        iframe.name = iframeName;
        iframe.id = iframe.name;
        iframe.src = "about:blank"
    }
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    return iframe
};
Wicket.portlet = true;
if (typeof Wicket == "undefined") Wicket = {};
Wicket.AutoCompleteSettings = {
    enterHidesWithNoSelection: false
};
Wicket.AutoComplete = function(elementId, callbackUrl, cfg, indicatorId) {
    var KEY_TAB = 9;
    var KEY_ENTER = 13;
    var KEY_ESC = 27;
    var KEY_LEFT = 37;
    var KEY_UP = 38;
    var KEY_RIGHT = 39;
    var KEY_DOWN = 40;
    var KEY_SHIFT = 16;
    var KEY_CTRL = 17;
    var KEY_ALT = 18;
    var selected = -1;
    var elementCount = 0;
    var visible = 0;
    var mouseactive = 0;
    var hidingAutocomplete = 0;
    var objonkeydown;
    var objonkeyup;
    var objonkeypress;
    var objonchange;
    var objonchangeoriginal;
    var objonfocus;
    var initialElement;
    var initialDelta = -1;
    var usefulDimensionsInitialized = false;
    var containerBorderWidths = [0, 0];
    var scrollbarSize = 0;
    var selChSinceLastRender = false;
    var lastStablePopupBounds = [0, 0, 0, 0];
    var ignoreOneFocusGain = false;
    var localThrottler = new Wicket.Throttler(true);
    var throttleDelay = cfg.throttleDelay;

    function initialize() {
        var isShowing = false;
        var choiceDiv = document.getElementById(getMenuId());
        if (choiceDiv != null) {
            isShowing = choiceDiv.showingAutocomplete;
            choiceDiv.parentNode.parentNode.removeChild(choiceDiv.parentNode)
        }
        var obj = wicketGet(elementId);
        initialElement = obj;
        objonkeydown = obj.onkeydown;
        objonkeyup =
            obj.onkeyup;
        objonkeypress = obj.onkeypress;
        objonfocus = obj.onfocus;
        objonchangeoriginal = obj.onchange;
        obj.onchange = function(event) {
            event = Wicket.fixEvent(event);
            if (mouseactive == 1) return false;
            if (typeof objonchangeoriginal == "function") return objonchangeoriginal.apply(this, [event])
        };
        objonchange = obj.onchange;
        Wicket.Event.add(obj, "blur", function(event) {
            event = Wicket.fixEvent(event);
            if (mouseactive == 1) {
                ignoreOneFocusGain = true;
                Wicket.$(elementId).focus();
                return killEvent(event)
            }
            window.setTimeout(hideAutoComplete,
                500)
        });
        obj.onfocus = function(event) {
            event = Wicket.fixEvent(event);
            if (mouseactive == 1) {
                ignoreOneFocusGain = false;
                return killEvent(event)
            }
            var input = event.target;
            if (!ignoreOneFocusGain && (cfg.showListOnFocusGain || cfg.showListOnEmptyInput && (input.value == null || input.value == "")) && visible == 0) {
                getAutocompleteMenu().showingAutocomplete = true;
                if (cfg.showCompleteListOnFocusGain) updateChoices(true);
                else updateChoices()
            }
            ignoreOneFocusGain = false;
            if (typeof objonfocus == "function") return objonfocus.apply(this, [event])
        };
        obj.onkeydown = function(event) {
            event = Wicket.fixEvent(event);
            switch (wicketKeyCode(event)) {
                case KEY_UP:
                    if (selected > -1) setSelected(selected - 1);
                    if (selected == -1) hideAutoComplete();
                    else render(true, false);
                    if (Wicket.Browser.isSafari()) return killEvent(event);
                    break;
                case KEY_DOWN:
                    if (selected < elementCount - 1) setSelected(selected + 1);
                    if (visible == 0) updateChoices();
                    else {
                        render(true, false);
                        showAutoComplete()
                    }
                    if (Wicket.Browser.isSafari()) return killEvent(event);
                    break;
                case KEY_ESC:
                    if (visible == 1) {
                        hideAutoComplete();
                        return killEvent(event)
                    }
                    break;
                case KEY_TAB:
                case KEY_ENTER:
                    if (selected > -1) {
                        var value = getSelectedValue();
                        value = handleSelection(value);
                        hideAutoComplete();
                        hidingAutocomplete = 1;
                        if (value) {
                            obj.value = value;
                            if (typeof objonchange == "function") objonchange.apply(this, [event])
                        }
                    } else if (Wicket.AutoCompleteSettings.enterHidesWithNoSelection) {
                        hideAutoComplete();
                        hidingAutocomplete = 1
                    } else hideAutoComplete();
                    mouseactive = 0;
                    if (typeof objonkeydown == "function") return objonkeydown.apply(this, [event]);
                    return true;
                    break;
                default:
            }
        };
        obj.onkeyup = function(event) {
            event = Wicket.fixEvent(event);
            switch (wicketKeyCode(event)) {
                case KEY_TAB:
                case KEY_ENTER:
                    return killEvent(event);
                case KEY_UP:
                case KEY_DOWN:
                case KEY_ESC:
                case KEY_RIGHT:
                case KEY_LEFT:
                case KEY_SHIFT:
                case KEY_ALT:
                case KEY_CTRL:
                    break;
                default:
                    updateChoices()
            }
            if (typeof objonkeyup == "function") return objonkeyup.apply(this, [event])
        };
        obj.onkeypress = function(event) {
            event = Wicket.fixEvent(event);
            if (wicketKeyCode(event) == KEY_ENTER)
                if (selected > -1 || hidingAutocomplete == 1) {
                    hidingAutocomplete =
                        0;
                    return killEvent(event)
                } if (typeof objonkeypress == "function") return objonkeypress.apply(this, [event])
        };
        if (Wicket.Focus.getFocusedElement() === obj && isShowing == true)
            if (cfg.showListOnFocusGain)
                if (cfg.showCompleteListOnFocusGain) updateChoices(true);
                else updateChoices()
    }

    function clearMenu() {
        var choiceDiv = document.getElementById(getMenuId());
        if (choiceDiv != null) choiceDiv.parentNode.parentNode.removeChild(choiceDiv.parentNode)
    }

    function setSelected(newSelected) {
        if (newSelected != selected) {
            selected = newSelected;
            selChSinceLastRender = true
        }
    }

    function handleSelection(input) {
        var attr = getSelectableElement(selected).attributes["onselect"];
        return attr ? eval(attr.value) : input
    }

    function getSelectableElements() {
        var menu = getAutocompleteMenu();
        var firstChild = menu.firstChild;
        var selectableElements = [];
        if (firstChild.tagName.toLowerCase() == "table") {
            var selectableInd = 0;
            for (var i = 0; i < firstChild.childNodes.length; i++) {
                var tbody = firstChild.childNodes[i];
                for (var j = 0; j < tbody.childNodes.length; j++) selectableElements[selectableInd++] =
                    tbody.childNodes[j]
            }
            return selectableElements
        } else return firstChild.childNodes
    }

    function getSelectableElement(selected) {
        var menu = getAutocompleteMenu();
        var firstChild = menu.firstChild;
        if (firstChild.tagName.toLowerCase() == "table") {
            var selectableInd = 0;
            for (var i = 0; i < firstChild.childNodes.length; i++) {
                var tbody = firstChild.childNodes[i];
                for (var j = 0; j < tbody.childNodes.length; j++) {
                    if (selectableInd == selected) return tbody.childNodes[j];
                    selectableInd++
                }
            }
        } else return firstChild.childNodes[selected]
    }

    function getMenuId() {
        return elementId +
            "-autocomplete"
    }

    function getAutocompleteMenu() {
        var choiceDiv = document.getElementById(getMenuId());
        if (choiceDiv == null) {
            var container = document.createElement("div");
            container.className = "wicket-aa-container";
            if (cfg.className) container.className += " " + cfg.className;
            document.body.appendChild(container);
            container.style.display = "none";
            container.style.overflow = "auto";
            container.style.position = "absolute";
            container.style.margin = "0px";
            container.style.padding = "0px";
            container.id = getMenuId() + "-container";
            container.show =
                function() {
                    wicketShow(this.id)
                };
            container.hide = function() {
                wicketHide(this.id)
            };
            choiceDiv = document.createElement("div");
            container.appendChild(choiceDiv);
            choiceDiv.id = getMenuId();
            choiceDiv.className = "wicket-aa";
            container.onmouseout = function() {
                mouseactive = 0
            };
            container.onmousemove = function() {
                mouseactive = 1
            }
        }
        return choiceDiv
    }

    function getAutocompleteContainer() {
        var node = getAutocompleteMenu().parentNode;
        return node
    }

    function killEvent(event) {
        if (!event) event = window.event;
        if (!event) return false;
        if (event.cancelBubble !=
            null) event.cancelBubble = true;
        if (event.returnValue) event.returnValue = false;
        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        return false
    }

    function updateChoices(showAll) {
        setSelected(-1);
        if (showAll) localThrottler.throttle(getMenuId(), throttleDelay, actualUpdateChoicesShowAll);
        else localThrottler.throttle(getMenuId(), throttleDelay, actualUpdateChoices)
    }

    function actualUpdateChoicesShowAll() {
        showIndicator();
        var request = new Wicket.Ajax.Request(callbackUrl + "\x26q\x3d",
            doUpdateAllChoices, false, true, false, "wicket-autocomplete|d");
        request.get()
    }

    function actualUpdateChoices() {
        showIndicator();
        var value = wicketGet(elementId).value;
        var request = new Wicket.Ajax.Request(callbackUrl + (callbackUrl.indexOf("?") > -1 ? "\x26" : "?") + "q\x3d" + processValue(value), doUpdateChoices, false, true, false, "wicket-autocomplete|d");
        request.get()
    }

    function showIndicator() {
        if (indicatorId != null) Wicket.$(indicatorId).style.display = ""
    }

    function hideIndicator() {
        if (indicatorId != null) Wicket.$(indicatorId).style.display =
            "none"
    }

    function processValue(param) {
        return encodeURIComponent ? encodeURIComponent(param) : escape(param)
    }

    function showAutoComplete() {
        var input = wicketGet(elementId);
        var container = getAutocompleteContainer();
        var index = getOffsetParentZIndex(elementId);
        container.show();
        if (!isNaN(new Number(index))) container.style.zIndex = new Number(index) + 1;
        if (!usefulDimensionsInitialized) initializeUsefulDimensions(input, container);
        if (cfg.adjustInputWidth) {
            var newW = input.offsetWidth - containerBorderWidths[0];
            container.style.width =
                (newW >= 0 ? newW : input.offsetWidth) + "px"
        }
        calculateAndSetPopupBounds(input, container);
        if (visible == 0) {
            visible = 1;
            hideShowCovered(true, lastStablePopupBounds[0], lastStablePopupBounds[1], lastStablePopupBounds[2], lastStablePopupBounds[3])
        }
    }

    function initializeUsefulDimensions(input, container) {
        usefulDimensionsInitialized = true;
        if (typeof container.clientWidth != "undefined" && typeof container.clientHeight != "undefined" && container.clientWidth > 0 && container.clientHeight > 0) {
            var tmp = container.style.overflow;
            container.style.overflow =
                "visible";
            containerBorderWidths[0] = container.offsetWidth - container.clientWidth;
            containerBorderWidths[1] = container.offsetHeight - container.clientHeight;
            if (cfg.useSmartPositioning) {
                container.style.overflow = "scroll";
                scrollbarSize = container.offsetWidth - container.clientWidth - containerBorderWidths[0]
            }
            container.style.overflow = tmp
        }
    }

    function hideAutoComplete() {
        visible = 0;
        setSelected(-1);
        var entry = localThrottler.entries[getMenuId()];
        if (typeof entry != "undefined") window.clearTimeout(entry.getTimeoutVar());
        localThrottler.entries[getMenuId()] =
            undefined;
        mouseactive = 0;
        var container = getAutocompleteContainer();
        if (container) {
            hideShowCovered(false, lastStablePopupBounds[0], lastStablePopupBounds[1], lastStablePopupBounds[2], lastStablePopupBounds[3]);
            container.hide();
            if (!cfg.adjustInputWidth && container.style.width != "auto") container.style.width = "auto"
        }
    }

    function getWindowWidthAndHeigth() {
        var myWidth = 0,
            myHeight = 0;
        if (typeof window.innerWidth == "number") {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight
        } else if (document.documentElement && (document.documentElement.clientWidth ||
                document.documentElement.clientHeight)) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight
        } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight
        }
        return [myWidth, myHeight]
    }

    function getWindowScrollXY() {
        var scrOfX = 0,
            scrOfY = 0;
        if (typeof window.pageYOffset == "number") {
            scrOfY = window.pageYOffset;
            scrOfX = window.pageXOffset
        } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
            scrOfY =
                document.body.scrollTop;
            scrOfX = document.body.scrollLeft
        } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
            scrOfY = document.documentElement.scrollTop;
            scrOfX = document.documentElement.scrollLeft
        }
        return [scrOfX, scrOfY]
    }

    function calculateAndSetPopupBounds(input, popup) {
        var leftPosition = 0;
        var topPosition = 0;
        var inputPosition = getPosition(input);
        if (cfg.useSmartPositioning) {
            if (popup.style.width == "auto") {
                popup.style.left = "0px";
                popup.style.top = "0px"
            }
            var windowScrollXY =
                getWindowScrollXY();
            var windowWH = getWindowWidthAndHeigth();
            var windowScrollX = windowScrollXY[0];
            var windowScrollY = windowScrollXY[1];
            var windowWidth = windowWH[0];
            var windowHeight = windowWH[1];
            var dx1 = windowScrollX + windowWidth - inputPosition[0] - popup.offsetWidth;
            var dx2 = inputPosition[0] + input.offsetWidth - popup.offsetWidth - windowScrollX;
            if (popup.style.width == "auto" && dx1 < 0 && dx2 < 0) {
                var newW = popup.offsetWidth + Math.max(dx1, dx2) - containerBorderWidths[0];
                popup.style.width = (newW >= 0 ? newW : popup.offsetWidth + Math.max(dx1,
                    dx2)) + "px";
                dx1 = windowScrollX + windowWidth - inputPosition[0] - popup.offsetWidth;
                dx2 = inputPosition[0] + input.offsetWidth - popup.offsetWidth - windowScrollX
            }
            var dy1 = windowScrollY + windowHeight - inputPosition[1] - input.offsetHeight - popup.offsetHeight;
            var dy2 = inputPosition[1] - popup.offsetHeight - windowScrollY;
            if (dy1 < 0 && dy2 < 0) {
                var newH = popup.offsetHeight + Math.max(dy1, dy2) - containerBorderWidths[1];
                popup.style.height = (newH >= 0 ? newH : popup.offsetHeight + Math.max(dy1, dy2)) + "px";
                var dy1 = windowScrollY + windowHeight - inputPosition[1] -
                    input.offsetHeight - popup.offsetHeight;
                var dy2 = inputPosition[1] - popup.offsetHeight - windowScrollY
            }
            if (dx1 < 0 && dx1 < dx2)
                if (dy1 < 0 && dy1 < dy2) {
                    leftPosition = inputPosition[0] + input.offsetWidth - popup.offsetWidth;
                    topPosition = inputPosition[1] - popup.offsetHeight
                } else {
                    leftPosition = inputPosition[0] + input.offsetWidth - popup.offsetWidth;
                    topPosition = inputPosition[1] + input.offsetHeight
                }
            else if (dy1 < 0 && dy1 < dy2) {
                leftPosition = inputPosition[0];
                topPosition = inputPosition[1] - popup.offsetHeight
            } else {
                leftPosition = inputPosition[0];
                topPosition = inputPosition[1] + input.offsetHeight
            }
            if (popup.style.width == "auto") {
                var newW = popup.offsetWidth - containerBorderWidths[0];
                popup.style.width = (newW >= 0 ? newW + (popup.scrollWidth - popup.clientWidth) : popup.offsetWidth) + "px"
            }
        } else {
            leftPosition = inputPosition[0];
            topPosition = inputPosition[1] + input.offsetHeight
        }
        popup.style.left = leftPosition + "px";
        popup.style.top = topPosition + "px";
        if (visible == 1 && (lastStablePopupBounds[0] != popup.offsetLeft || lastStablePopupBounds[1] != popup.offsetTop || lastStablePopupBounds[2] !=
                popup.offsetWidth || lastStablePopupBounds[3] != popup.offsetHeight)) {
            hideShowCovered(false, lastStablePopupBounds[0], lastStablePopupBounds[1], lastStablePopupBounds[2], lastStablePopupBounds[3]);
            hideShowCovered(true, popup.offsetLeft, popup.offsetTop, popup.offsetWidth, popup.offsetHeight)
        }
        lastStablePopupBounds = [popup.offsetLeft, popup.offsetTop, popup.offsetWidth, popup.offsetHeight]
    }

    function getPosition(obj) {
        var leftPosition = obj.offsetLeft || 0;
        var topPosition = obj.offsetTop || 0;
        obj = obj.offsetParent;
        while (obj &&
            obj != document.documentElement && obj != document.body) {
            topPosition += obj.offsetTop || 0;
            topPosition -= obj.scrollTop || 0;
            leftPosition += obj.offsetLeft || 0;
            leftPosition -= obj.scrollLeft || 0;
            obj = obj.offsetParent
        }
        return [leftPosition, topPosition]
    }

    function doUpdateAllChoices(resp) {
        doUpdateChoices(resp, -1)
    }

    function doUpdateChoices(resp, defaultSelection) {
        getAutocompleteMenu().showingAutocomplete = false;
        var input = wicketGet(elementId);
        if (input != initialElement || (Wicket.Focus.getFocusedElement() != input || !cfg.showListOnEmptyInput &&
                (input.value == null || input.value == ""))) {
            hideAutoComplete();
            Wicket.Ajax.invokePostCallHandlers();
            hideIndicator();
            if (input != initialElement) clearMenu();
            return
        }
        var element = getAutocompleteMenu();
        if (!cfg.adjustInputWidth && element.parentNode && element.parentNode.style.width != "auto") {
            element.parentNode.style.width = "auto";
            selChSinceLastRender = true
        }
        element.innerHTML = resp;
        var selectableElements = getSelectableElements();
        if (selectableElements) {
            elementCount = selectableElements.length;
            var clickFunc = function(event) {
                event =
                    Wicket.fixEvent(event);
                mouseactive = 0;
                var value = getSelectedValue();
                var input = wicketGet(elementId);
                if (value = handleSelection(value)) {
                    input.value = value;
                    if (typeof objonchange == "function") objonchange.apply(input, [event])
                }
                hideAutoComplete();
                if (Wicket.Focus.getFocusedElement() != input) {
                    ignoreOneFocusGain = true;
                    input.focus()
                }
            };
            var mouseOverFunc = function(event) {
                event = Wicket.fixEvent(event);
                setSelected(getElementIndex(this));
                render(false, false);
                showAutoComplete()
            };
            for (var i = 0; i < elementCount; i++) {
                var node = selectableElements[i];
                node.onclick = clickFunc;
                node.onmouseover = mouseOverFunc
            }
        } else elementCount = 0;
        if (elementCount > 0) {
            if (cfg.preselect == true) {
                var selectedIndex = defaultSelection ? defaultSelection : 0;
                for (var i = 0; i < elementCount; i++) {
                    var node = selectableElements[i];
                    var attr = node.attributes["textvalue"];
                    var value;
                    if (attr == undefined) value = node.innerHTML;
                    else value = attr.value;
                    if (stripHTML(value) == input.value) {
                        selectedIndex = i;
                        break
                    }
                }
                setSelected(selectedIndex)
            }
            showAutoComplete()
        } else hideAutoComplete();
        render(false, true);
        scheduleEmptyCheck();
        Wicket.Log.info("Response processed successfully.");
        Wicket.Ajax.invokePostCallHandlers();
        hideIndicator();
        if (Wicket.Browser.isIE()) {
            var range = document.selection.createRange();
            if (range != null) range.select()
        }
    }

    function scheduleEmptyCheck() {
        window.setTimeout(function() {
            var input = wicketGet(elementId);
            if (!cfg.showListOnEmptyInput && (input.value == null || input.value == "")) hideAutoComplete()
        }, 100)
    }

    function getSelectedValue() {
        var element = getAutocompleteMenu();
        var selectableElement = getSelectableElement(selected);
        var attr = selectableElement.attributes["textvalue"];
        var value;
        if (attr == undefined) value = selectableElement.innerHTML;
        else value = attr.value;
        return stripHTML(value)
    }

    function getElementIndex(element) {
        var selectableElements = getSelectableElements();
        for (var i = 0; i < selectableElements.length; i++) {
            var node = selectableElements[i];
            if (node == element) return i
        }
        return -1
    }

    function stripHTML(str) {
        return str.replace(/<[^>]+>/g, "")
    }

    function adjustScrollOffset(menu, item) {
        if (item.offsetTop + item.offsetHeight > menu.scrollTop + menu.offsetHeight) menu.scrollTop =
            item.offsetTop + item.offsetHeight - menu.offsetHeight;
        else if (item.offsetTop < menu.scrollTop) menu.scrollTop = item.offsetTop
    }

    function render(adjustScroll, adjustHeight) {
        var menu = getAutocompleteMenu();
        var height = 0;
        var node = getSelectableElement(0);
        var re = /\bselected\b/gi;
        var sizeAffected = false;
        for (var i = 0; i < elementCount; i++) {
            var origClassNames = node.className;
            var classNames = origClassNames.replace(re, "");
            if (selected == i) {
                classNames += " selected";
                if (adjustScroll) adjustScrollOffset(menu.parentNode, node)
            }
            if (classNames !=
                origClassNames) node.className = classNames;
            if (cfg.maxHeight > -1) height += node.offsetHeight;
            node = node.nextSibling
        }
        if (cfg.maxHeight > -1) {
            if (initialDelta == -1) initialDelta = menu.parentNode.offsetHeight - height;
            if (height + initialDelta > cfg.maxHeight) {
                var newH = cfg.maxHeight - containerBorderWidths[1];
                menu.parentNode.style.height = (newH >= 0 ? newH : cfg.maxHeight) + "px";
                sizeAffected = true
            } else if (menu.parentNode.style.height != "auto") {
                if (adjustHeight) menu.parentNode.style.height = "auto";
                sizeAffected = true
            }
        }
        if (cfg.useSmartPositioning &&
            !cfg.adjustInputWidth && menu.parentNode.style.width != "auto" && selChSinceLastRender) {
            selChSinceLastRender = false;
            menu.parentNode.style.width = "auto";
            sizeAffected = true
        }
        if (sizeAffected) calculateAndSetPopupBounds(wicketGet(elementId), menu.parentNode)
    }

    function getStyle(obj, cssRule) {
        var cssRuleAlt = cssRule.replace(/\-(\w)/g, function(strMatch, p1) {
            return p1.toUpperCase()
        });
        var value = obj.style[cssRuleAlt];
        if (!value)
            if (document.defaultView && document.defaultView.getComputedStyle) value = document.defaultView.getComputedStyle(obj,
                "").getPropertyValue(cssRule);
            else if (obj.currentStyle) value = obj.currentStyle[cssRuleAlt];
        return value
    }

    function isVisible(obj) {
        return getStyle(obj, "visibility")
    }

    function getOffsetParentZIndex(obj) {
        obj = typeof obj == "string" ? Wicket.$(obj) : obj;
        obj = obj.offsetParent;
        var index = "auto";
        do {
            var pos = getStyle(obj, "position");
            if (pos == "relative" || pos == "absolute" || pos == "fixed") index = getStyle(obj, "z-index");
            obj = obj.offsetParent
        } while (obj && index == "auto");
        return index
    }

    function hideShowCovered(popupVisible, acLeftX, acTopY,
        acWidth, acHeight) {
        if (!cfg.useHideShowCoveredIEFix || !/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) return;
        var hideTags = new Array("select", "iframe", "applet");
        var acRightX = acLeftX + acWidth;
        var acBottomY = acTopY + acHeight;
        for (var j = 0; j < hideTags.length; j++) {
            var tagsFound = document.getElementsByTagName(hideTags[j]);
            for (var i = 0; i < tagsFound.length; i++) {
                var tag = tagsFound[i];
                var p = getPosition(tag);
                var leftX = p[0];
                var rightX = leftX + tag.offsetWidth;
                var topY = p[1];
                var bottomY = topY + tag.offsetHeight;
                if (!tag.wicket_element_visibility) tag.wicket_element_visibility = isVisible(tag);
                if (popupVisible == 0 || leftX > acRightX || rightX < acLeftX || topY > acBottomY || bottomY < acTopY) tag.style.visibility = tag.wicket_element_visibility;
                else tag.style.visibility = "hidden"
            }
        }
    }
    initialize()
};
if (typeof Wicket == "undefined") Wicket = {};
Wicket.WUPB = Wicket.Class.create();
Wicket.WUPB.prototype = {
    initialize: function(def) {
        this.def = def
    },
    bind: function(formid) {
        formElement = Wicket.$(formid);
        this.originalCallback = formElement.onsubmit;
        formElement.onsubmit = this.submitCallback.bind(this)
    },
    submitCallback: function() {
        if (this.originalCallback && !this.originalCallback()) return false;
        else {
            this.start();
            return true
        }
    },
    start: function() {
        this.displayprogress = true;
        if (this.def.fileid) {
            var fileupload = Wicket.$(this.def.fileid);
            this.displayprogress = fileupload && fileupload.value && fileupload.value !=
                ""
        }
        if (this.displayprogress) {
            this.setStatus("Upload starting...");
            Wicket.$(this.def.barid).firstChild.firstChild.style.width = "0%";
            Wicket.$(this.def.statusid).style.display = "block";
            Wicket.$(this.def.barid).style.display = "block";
            this.scheduleUpdate()
        }
    },
    setStatus: function(status) {
        var label = document.createElement("label");
        label.innerHTML = status;
        var oldLabel = Wicket.$(this.def.statusid).firstChild;
        if (oldLabel != null) Wicket.$(this.def.statusid).removeChild(oldLabel);
        Wicket.$(this.def.statusid).appendChild(label)
    },
    scheduleUpdate: function() {
        window.setTimeout(this.ajax.bind(this), 1E3)
    },
    ajax: function() {
        var URL = this.def.url + "?anticache\x3d" + Math.random();
        this.iframe = Wicket._createIFrame("" + Math.random());
        document.body.appendChild(this.iframe);
        Wicket.Event.add(this.iframe, "load", this.update.bind(this));
        this.iframe.src = URL
    },
    update: function() {
        if (this.iframe.contentDocument) var responseAsText = this.iframe.contentDocument.body.innerHTML;
        else var responseAsText = this.iframe.contentWindow.document.body.innerHTML;
        var update =
            responseAsText.split("|");
        var completed_upload_size = update[2];
        var total_upload_size = update[3];
        var progressPercent = update[1];
        var transferRate = update[4];
        var timeRemaining = update[5];
        if (timeRemaining != "" && completed_upload_size != 0) {
            Wicket.$(this.def.barid).firstChild.firstChild.style.width = progressPercent + "%";
            this.setStatus(progressPercent + "% finished, " + completed_upload_size + " of " + total_upload_size + " at " + transferRate + "; " + timeRemaining)
        }
        this.iframe.parentNode.removeChild(this.iframe);
        this.iframe = null;
        if (progressPercent == 100 || timeRemaining == 0) {
            if (progressPercent == 100) Wicket.$(this.def.barid).firstChild.firstChild.style.width = "100%";
            wicketHide(this.def.statusid);
            wicketHide(this.def.barid)
        } else this.scheduleUpdate()
    }
};
Wicket.WUPB.Def = Wicket.Class.create();
Wicket.WUPB.Def.prototype = {
    initialize: function(formid, statusid, barid, url, fileid) {
        this.formid = formid;
        this.statusid = statusid;
        this.barid = barid;
        this.url = url;
        this.fileid = fileid
    }
};
if (typeof Wicket == "undefined") Wicket = {};
if (typeof Wicket.Palette == "undefined") Wicket.Palette = {};
Wicket.Palette.$ = function(id) {
    return document.getElementById(id)
};
Wicket.Palette.choicesOnFocus = function(choicesId, selectionId, recorderId) {
    Wicket.Palette.clearSelectionHelper(Wicket.Palette.$(selectionId))
};
Wicket.Palette.selectionOnFocus = function(choicesId, selectionId, recorderId) {
    Wicket.Palette.clearSelectionHelper(Wicket.Palette.$(choicesId))
};
Wicket.Palette.add = function(choicesId, selectionId, recorderId) {
    var choices = Wicket.Palette.$(choicesId);
    var selection = Wicket.Palette.$(selectionId);
    if (Wicket.Palette.moveHelper(choices, selection)) {
        var recorder = Wicket.Palette.$(recorderId);
        Wicket.Palette.updateRecorder(selection, recorder)
    }
};
Wicket.Palette.remove = function(choicesId, selectionId, recorderId) {
    var choices = Wicket.Palette.$(choicesId);
    var selection = Wicket.Palette.$(selectionId);
    if (Wicket.Palette.moveHelper(selection, choices)) {
        var recorder = Wicket.Palette.$(recorderId);
        Wicket.Palette.updateRecorder(selection, recorder)
    }
};
Wicket.Palette.moveHelper = function(source, dest) {
    var dirty = false;
    for (var i = 0; i < source.options.length; i++)
        if (source.options[i].selected) {
            dest.appendChild(source.options[i]);
            i--;
            dirty = true
        } return dirty
};
Wicket.Palette.moveUp = function(choicesId, selectionId, recorderId) {
    var selection = Wicket.Palette.$(selectionId);
    if (Wicket.Palette.moveUpHelper(selection)) {
        var recorder = Wicket.Palette.$(recorderId);
        Wicket.Palette.updateRecorder(selection, recorder)
    }
};
Wicket.Palette.moveUpHelper = function(box) {
    var dirty = false;
    for (var i = 0; i < box.options.length; i++)
        if (box.options[i].selected && i > 0)
            if (!box.options[i - 1].selected) {
                box.insertBefore(box.options[i], box.options[i - 1]);
                dirty = true;
                box.focus()
            } return dirty
};
Wicket.Palette.moveDown = function(choicesId, selectionId, recorderId) {
    var selection = Wicket.Palette.$(selectionId);
    if (Wicket.Palette.moveDownHelper(selection)) {
        var recorder = Wicket.Palette.$(recorderId);
        Wicket.Palette.updateRecorder(selection, recorder)
    }
};
Wicket.Palette.moveDownHelper = function(box) {
    var dirty = false;
    for (var i = box.options.length - 1; i >= 0; i--)
        if (box.options[i].selected && i < box.options.length - 1)
            if (!box.options[i + 1].selected) {
                box.insertBefore(box.options[i + 1], box.options[i]);
                dirty = true
            } return dirty
};
Wicket.Palette.updateRecorder = function(selection, recorder) {
    recorder.value = "";
    for (var i = 0; i < selection.options.length; i++) {
        recorder.value = recorder.value + selection.options[i].value;
        if (i + 1 < selection.options.length) recorder.value = recorder.value + ","
    }
    if (recorder.onchange != null) recorder.onchange()
};
Wicket.Palette.clearSelectionHelper = function(box) {
    for (var i = 0; i < box.options.length; i++) box.options[i].selected = false
};
if (typeof Wicket == "undefined") Wicket = {};
if (Wicket.Class == null) Wicket.Class = {
    create: function() {
        return function() {
            this.initialize.apply(this, arguments)
        }
    }
};
if (Wicket.Object == null) Wicket.Object = {};
if (Wicket.Object.extend == null) Wicket.Object.extend = function(destination, source) {
    for (property in source) destination[property] = source[property];
    return destination
};
Wicket.Iframe = {
    findPosX: function(e) {
        if (e.offsetParent) {
            var c = 0;
            while (e) {
                c += e.offsetLeft;
                e = e.offsetParent
            }
            return c
        } else if (e.x) return e.x;
        else return 0
    },
    findPosY: function(e) {
        if (e.offsetParent) {
            var c = 0;
            while (e) {
                c += e.offsetTop;
                e = e.offsetParent
            }
            return c
        } else if (e.y) return e.y;
        else return 0
    },
    forwardEvents: function(doc, iframe, revertList) {
        try {
            var idoc = iframe.contentWindow.document;
            idoc.old_onmousemove = idoc.onmousemove;
            idoc.onmousemove = function(evt) {
                if (evt == null) evt = iframe.contentWindow.event;
                var e = new Object;
                var dx = 0;
                var dy = 0;
                if (Wicket.Browser.isIE() || Wicket.Browser.isGecko) {
                    dx = Wicket.Window.getScrollX();
                    dy = Wicket.Window.getScrollY()
                }
                e.clientX = evt.clientX + Wicket.Iframe.findPosX(iframe) - dx;
                e.clientY = evt.clientY + Wicket.Iframe.findPosY(iframe) - dy;
                doc.onmousemove(e)
            };
            idoc.old_onmouseup = idoc.old_onmousemove;
            idoc.onmouseup = function(evt) {
                if (evt == null) evt = iframe.contentWindow.event;
                var e = new Object;
                var dx = 0;
                var dy = 0;
                if (Wicket.Browser.isIE() || Wicket.Browser.isGecko()) {
                    dx = Wicket.Window.getScrollX();
                    dy = Wicket.Window.getScrollY()
                }
                e.clientX =
                    evt.clientX + Wicket.Iframe.findPosX(iframe) - dx;
                e.clientY = evt.clientY + Wicket.Iframe.findPosY(iframe) - dy;
                doc.onmouseup(e)
            };
            revertList.push(iframe);
            Wicket.Iframe.documentFix(idoc, revertList)
        } catch (ignore) {}
    },
    revertForward: function(iframe) {
        var idoc = iframe.contentWindow.document;
        idoc.onmousemove = idoc.old_onmousemove;
        idoc.onmouseup = idoc.old_onmouseup;
        idoc.old_onmousemove = null;
        idoc.old_onmouseup = null
    },
    documentFix: function(doc, revertList) {
        var iframes = doc.getElementsByTagName("iframe");
        for (var i = 0; i < iframes.length; ++i) {
            var iframe =
                iframes[i];
            if (iframe.tagName != null) Wicket.Iframe.forwardEvents(doc, iframe, revertList)
        }
    },
    documentRevert: function(revertList) {
        for (var i = 0; i < revertList.length; ++i) {
            var iframe = revertList[i];
            Wicket.Iframe.revertForward(iframe)
        }
    }
};
Wicket.Window = Wicket.Class.create();
Wicket.Window.unloadConfirmation = true;
Wicket.Window.create = function(settings) {
    var win;
    if (typeof settings.src != "undefined" && Wicket.Browser.isKHTML() == false) try {
        win = window.parent.Wicket.Window
    } catch (ignore) {}
    if (typeof win == "undefined") win = Wicket.Window;
    return new win(settings)
};
Wicket.Window.get = function() {
    var win = null;
    if (typeof Wicket.Window.current != "undefined") win = Wicket.Window.current;
    else try {
        win = window.parent.Wicket.Window.current
    } catch (ignore) {}
    return win
};
Wicket.Window.close = function() {
    var win;
    try {
        win = window.parent.Wicket.Window
    } catch (ignore) {}
    if (typeof win != "undefined" && typeof win.current != "undefined") window.parent.setTimeout(function() {
        win.current.close()
    }, 0)
};
Wicket.Window.prototype = {
    initialize: function(settings) {
        this.settings = Wicket.Object.extend({
            minWidth: 200,
            minHeight: 150,
            className: "w_blue",
            width: 600,
            height: 300,
            resizable: true,
            widthUnit: "px",
            heightUnit: "px",
            src: null,
            element: null,
            iframeName: null,
            cookieId: null,
            title: null,
            onCloseButton: function() {
                this.caption.getElementsByTagName("a")[0].focus();
                this.caption.getElementsByTagName("a")[0].blur();
                this.close();
                return false
            }.bind(this),
            onClose: function() {},
            mask: "semi-transparent"
        }, settings || {})
    },
    isIframe: function() {
        return this.settings.src !=
            null
    },
    createDOM: function() {
        var idWindow = this.newId();
        var idClassElement = this.newId();
        var idCaption = this.newId();
        var idFrame = this.newId();
        var idTop = this.newId();
        var idTopLeft = this.newId();
        var idTopRight = this.newId();
        var idLeft = this.newId();
        var idRight = this.newId();
        var idBottomLeft = this.newId();
        var idBottomRight = this.newId();
        var idBottom = this.newId();
        var idCaptionText = this.newId();
        var markup = Wicket.Window.getMarkup(idWindow, idClassElement, idCaption, idFrame, idTop, idTopLeft, idTopRight, idLeft, idRight,
            idBottomLeft, idBottomRight, idBottom, idCaptionText, this.isIframe());
        var element = document.createElement("div");
        document.body.appendChild(element);
        Wicket.replaceOuterHtml(element, markup);
        var _ = function(name) {
            return document.getElementById(name)
        };
        this.window = _(idWindow);
        this.classElement = _(idClassElement);
        this.caption = _(idCaption);
        this.content = _(idFrame);
        this.top = _(idTop);
        this.topLeft = _(idTopLeft);
        this.topRight = _(idTopRight);
        this.left = _(idLeft);
        this.right = _(idRight);
        this.bottomLeft = _(idBottomLeft);
        this.bottomRight =
            _(idBottomRight);
        this.bottom = _(idBottom);
        this.captionText = _(idCaptionText);
        if (Wicket.Browser.isIE())
            if (Wicket.Browser.isIE7() == false || Wicket.Browser.isIEQuirks()) {
                this.topLeft.style.marginRight = "-3px";
                this.topRight.style.marginLeft = "-3px";
                this.bottomLeft.style.marginRight = "-3px";
                this.bottomRight.style.marginLeft = "-3px"
            } if (Wicket.Browser.isIE() || Wicket.Browser.isGecko()) this.window.style.position = "absolute";
        if (this.settings.resizable == false) this.top.style.cursor = this.topLeft.style.cursor = this.topRight.style.cursor =
            this.bottom.style.cursor = this.bottomLeft.style.cursor = this.bottomRight.style.cursor = this.left.style.cursor = this.right.style.cursor = "default"
    },
    newId: function() {
        return "_wicket_window_" + Wicket.Window.idCounter++
    },
    bind: function(element, handler) {
        Wicket.Drag.init(element, this.onBegin.bind(this), this.onEnd.bind(this), handler.bind(this))
    },
    unbind: function(element) {
        Wicket.Drag.clean(element)
    },
    bindInit: function() {
        this.bind(this.caption, this.onMove);
        if (this.settings.resizable) {
            this.bind(this.bottomRight, this.onResizeBottomRight);
            this.bind(this.bottomLeft, this.onResizeBottomLeft);
            this.bind(this.bottom, this.onResizeBottom);
            this.bind(this.left, this.onResizeLeft);
            this.bind(this.right, this.onResizeRight);
            this.bind(this.topLeft, this.onResizeTopLeft);
            this.bind(this.topRight, this.onResizeTopRight);
            this.bind(this.top, this.onResizeTop)
        } else {
            this.bind(this.bottomRight, this.onMove);
            this.bind(this.bottomLeft, this.onMove);
            this.bind(this.bottom, this.onMove);
            this.bind(this.left, this.onMove);
            this.bind(this.right, this.onMove);
            this.bind(this.topLeft,
                this.onMove);
            this.bind(this.topRight, this.onMove);
            this.bind(this.top, this.onMove)
        }
        this.caption.getElementsByTagName("a")[0].onclick = this.settings.onCloseButton.bind(this)
    },
    bindClean: function() {
        this.unbind(this.caption);
        this.unbind(this.bottomRight);
        this.unbind(this.bottomLeft);
        this.unbind(this.bottom);
        this.unbind(this.left);
        this.unbind(this.right);
        this.unbind(this.topLeft);
        this.unbind(this.topRight);
        this.unbind(this.top);
        this.caption.getElementsByTagName("a")[0].onclick = null
    },
    getContentDocument: function() {
        if (this.isIframe() ==
            true) return this.content.contentWindow.document;
        else return document
    },
    center: function() {
        var scTop = 0;
        var scLeft = 0;
        if (Wicket.Browser.isIE() || Wicket.Browser.isGecko()) {
            scLeft = Wicket.Window.getScrollX();
            scTop = Wicket.Window.getScrollY()
        }
        var width = Wicket.Window.getViewportWidth();
        var height = Wicket.Window.getViewportHeight();
        var modalWidth = this.window.offsetWidth;
        var modalHeight = this.window.offsetHeight;
        if (modalWidth > width - 10) {
            this.window.style.width = width - 10 + "px";
            modalWidth = this.window.offsetWidth
        }
        if (modalHeight >
            height - 40) {
            this.content.style.height = height - 40 + "px";
            modalHeight = this.window.offsetHeight
        }
        var left = width / 2 - modalWidth / 2 + scLeft;
        var top = height / 2 - modalHeight / 2 + scTop;
        if (left < 0) left = 0;
        if (top < 0) top = 0;
        this.window.style.left = left + "px";
        this.window.style.top = top + "px"
    },
    cookieKey: "wicket-modal-window-positions",
    cookieExp: 31,
    findPositionString: function(remove) {
        var cookie = Wicket.Cookie.get(this.cookieKey);
        var entries = cookie != null ? cookie.split("|") : new Array;
        for (var i = 0; i < entries.length; ++i)
            if (entries[i].indexOf(this.settings.cookieId +
                    "::") == 0) {
                var string = entries[i];
                if (remove) {
                    entries.splice(i, 1);
                    Wicket.Cookie.set(this.cookieKey, entries.join("|"), this.cookieExp)
                }
                return string
            } return null
    },
    savePosition: function() {
        this.savePositionAs(this.window.style.left, this.window.style.top, this.window.style.width, this.content.style.height)
    },
    savePositionAs: function(x, y, width, height) {
        if (typeof this.settings.cookieId != "undefined" && this.settings.cookieId != null) {
            this.findPositionString(true);
            if (cookie == null || cookie.length == 0) cookie = "";
            else cookie =
                cookie + "|";
            var cookie = this.settings.cookieId;
            cookie += "::";
            cookie += x + ",";
            cookie += y + ",";
            cookie += width + ",";
            cookie += height;
            var rest = Wicket.Cookie.get(this.cookieKey);
            if (rest != null) cookie += "|" + rest;
            Wicket.Cookie.set(this.cookieKey, cookie, this.cookieExp)
        }
    },
    loadPosition: function() {
        if (typeof this.settings.cookieId != "undefined" && this.settings.cookieId != null) {
            var string = this.findPositionString(false);
            if (string != null) {
                var array = string.split("::");
                var positions = array[1].split(",");
                if (positions.length == 4) {
                    this.window.style.left =
                        positions[0];
                    this.window.style.top = positions[1];
                    this.window.style.width = positions[2];
                    this.content.style.height = positions[3]
                }
            }
        }
    },
    createMask: function() {
        if (this.settings.mask == "transparent") this.mask = new Wicket.Window.Mask(true);
        else if (this.settings.mask == "semi-transparent") this.mask = new Wicket.Window.Mask(false);
        if (typeof this.mask != "undefined") this.mask.show()
    },
    destroyMask: function() {
        this.mask.hide();
        this.mask = null
    },
    load: function() {
        if (this.settings.title == null) this.update = window.setInterval(this.updateTitle.bind(this),
            100);
        if (Wicket.Browser.isOpera()) this.content.onload = function() {
            this.content.contentWindow.name = this.settings.iframeName
        }.bind(this);
        else this.content.contentWindow.name = this.settings.iframeName;
        try {
            this.content.contentWindow.location.replace(this.settings.src)
        } catch (ignore) {
            this.content.src = this.settings.src
        }
    },
    show: function() {
        this.createDOM();
        this.classElement.className = this.settings.className;
        if (this.isIframe()) this.load();
        else {
            if (this.settings.element == null) throw "Either src or element must be set.";
            this.oldParent = this.settings.element.parentNode;
            this.settings.element.parentNode.removeChild(this.settings.element);
            this.content.appendChild(this.settings.element);
            this.content.style.overflow = "auto"
        }
        this.bindInit();
        if (this.settings.title != null) this.captionText.innerHTML = this.settings.title;
        this.window.style.width = this.settings.width + (this.settings.resizable ? "px" : this.settings.widthUnit);
        if (this.settings.height != null) this.content.style.height = this.settings.height + (this.settings.resizable ? "px" : this.settings.heightUnit);
        this.center();
        this.loadPosition();
        var doShow = function() {
            this.adjustOpenWindowZIndexesOnShow();
            this.window.style.visibility = "visible"
        }.bind(this);
        this.adjustOpenWindowsStatusOnShow();
        if (Wicket.Browser.isGecko() && this.isIframe()) window.setTimeout(function() {
            doShow()
        }, 0);
        else doShow();
        if (this.content.focus) {
            this.content.focus();
            this.content.blur()
        }
        this.old_onunload = window.onunload;
        window.onunload = function() {
            this.close(true);
            if (this.old_onunload != null) return this.old_onunload()
        }.bind(this);
        this.old_onbeforeunload =
            window.onbeforeunload;
        if (Wicket.Window.unloadConfirmation == true) window.onbeforeunload = function() {
            return "Reloading this page will cause the modal window to disappear."
        };
        this.createMask()
    },
    adjustOpenWindowZIndexesOnShow: function() {
        if (this.oldWindow != null && typeof this.oldWindow != "undefined") this.oldWindow.window.style.zIndex = Wicket.Window.Mask.zIndex - 1
    },
    adjustOpenWindowsStatusOnShow: function() {
        if (Wicket.Window.current != null) this.oldWindow = Wicket.Window.current;
        Wicket.Window.current = this
    },
    canClose: function() {
        return true
    },
    canCloseInternal: function() {
        try {
            if (this.isIframe() == true) {
                var current = this.content.contentWindow.Wicket.Window.current;
                if (typeof current != "undefined" && current != null) {
                    alert("You can't close this modal window. Close the top-level modal window first.");
                    return false
                }
            }
        } catch (ignore) {}
        return true
    },
    close: function(force) {
        if (force != true && (!this.canClose() || !this.canCloseInternal())) return;
        if (typeof this.update != "undefined") window.clearInterval(this.update);
        this.bindClean();
        this.window.style.display = "none";
        if (typeof this.oldParent != "undefined") try {
            this.content.removeChild(this.settings.element);
            this.oldParent.appendChild(this.settings.element);
            this.oldParent = null
        } catch (ignore) {}
        this.window.parentNode.removeChild(this.window);
        this.window = this.classElement = this.caption = this.bottomLeft = this.bottomRight = this.bottom = this.left = this.right = this.topLeft = this.topRight = this.top = this.captionText = null;
        window.onunload = this.old_onunload;
        this.old_onunload = null;
        window.onbeforeunload = this.old_onbeforeunload;
        this.old_onbeforeunload =
            null;
        this.destroyMask();
        if (force != true) this.settings.onClose();
        this.adjustOpenWindowsStatusAndZIndexesOnClose();
        if (Wicket.Browser.isIE()) {
            var e = document.createElement("input");
            var x = Wicket.Window.getScrollX();
            var y = Wicket.Window.getScrollY();
            e.style.position = "absolute";
            e.style.left = x + "px";
            e.style.top = y + "px";
            document.body.appendChild(e);
            e.focus();
            document.body.removeChild(e)
        }
    },
    adjustOpenWindowsStatusAndZIndexesOnClose: function() {
        if (this.oldWindow != null) {
            Wicket.Window.current = this.oldWindow;
            Wicket.Window.current.window.style.zIndex =
                Wicket.Window.Mask.zIndex + 1;
            this.oldWindow = null
        } else Wicket.Window.current = null
    },
    destroy: function() {
        this.settings = null
    },
    updateTitle: function() {
        try {
            if (this.content.contentWindow.document.title != null)
                if (this.captionText.innerHTML != this.content.contentWindow.document.title) {
                    this.captionText.innerHTML = this.content.contentWindow.document.title;
                    if (Wicket.Browser.isKHTML()) {
                        this.captionText.style.display = "none";
                        window.setTimeout(function() {
                            this.captionText.style.display = "block"
                        }.bind(this), 0)
                    }
                }
        } catch (ignore) {
            Wicket.Log.info(ignore)
        }
    },
    onBegin: function(object) {
        if (this.isIframe() && (Wicket.Browser.isGecko() || Wicket.Browser.isIE() || Wicket.Browser.isSafari())) {
            this.revertList = new Array;
            Wicket.Iframe.documentFix(document, this.revertList)
        }
    },
    onEnd: function(object) {
        if (typeof this.revertList != "undefined" && this.revertList != null) {
            Wicket.Iframe.documentRevert(this.revertList);
            this.revertList = null;
            if (Wicket.Browser.isKHTML() || this.content.style.visibility == "hidden") {
                this.content.style.visibility = "hidden";
                window.setTimeout(function() {
                    this.content.style.visibility =
                        "visible"
                }.bind(this), 0)
            }
            this.revertList = null
        }
        this.savePosition()
    },
    onMove: function(object, deltaX, deltaY) {
        var w = this.window;
        this.left_ = parseInt(w.style.left, 10) + deltaX;
        this.top_ = parseInt(w.style.top, 10) + deltaY;
        if (this.left_ < 0) this.left_ = 0;
        if (this.top_ < 0) this.top_ = 0;
        w.style.left = this.left_ + "px";
        w.style.top = this.top_ + "px";
        this.moving()
    },
    moving: function() {},
    resizing: function() {},
    clipSize: function(swapX, swapY) {
        this.res = [0, 0];
        if (this.width < this.settings.minWidth) {
            this.left_ -= this.settings.minWidth - this.width;
            this.res[0] = this.settings.minWidth - this.width;
            this.width = this.settings.minWidth
        }
        if (this.height < this.settings.minHeight) {
            this.top_ -= this.settings.minHeight - this.height;
            this.res[1] = this.settings.minHeight - this.height;
            this.height = this.settings.minHeight
        }
        if (swapX == true) this.res[0] = -this.res[0];
        if (swapY == true) this.res[1] = -this.res[1]
    },
    onResizeBottomRight: function(object, deltaX, deltaY) {
        var w = this.window;
        var f = this.content;
        this.width = parseInt(w.style.width, 10) + deltaX;
        this.height = parseInt(f.style.height,
            10) + deltaY;
        this.clipSize();
        w.style.width = this.width + "px";
        f.style.height = this.height + "px";
        this.resizing();
        return this.res
    },
    onResizeBottomLeft: function(object, deltaX, deltaY) {
        var w = this.window;
        var f = this.content;
        this.width = parseInt(w.style.width, 10) - deltaX;
        this.height = parseInt(f.style.height, 10) + deltaY;
        this.left_ = parseInt(w.style.left, 10) + deltaX;
        this.clipSize(true);
        w.style.width = this.width + "px";
        w.style.left = this.left_ + "px";
        f.style.height = this.height + "px";
        this.moving();
        this.resizing();
        return this.res
    },
    onResizeBottom: function(object, deltaX, deltaY) {
        var f = this.content;
        this.height = parseInt(f.style.height, 10) + deltaY;
        this.clipSize();
        f.style.height = this.height + "px";
        this.resizing();
        return this.res
    },
    onResizeLeft: function(object, deltaX, deltaY) {
        var w = this.window;
        this.width = parseInt(w.style.width, 10) - deltaX;
        this.left_ = parseInt(w.style.left, 10) + deltaX;
        this.clipSize(true);
        w.style.width = this.width + "px";
        w.style.left = this.left_ + "px";
        this.moving();
        this.resizing();
        return this.res
    },
    onResizeRight: function(object, deltaX,
        deltaY) {
        var w = this.window;
        this.width = parseInt(w.style.width, 10) + deltaX;
        this.clipSize();
        w.style.width = this.width + "px";
        this.resizing();
        return this.res
    },
    onResizeTopLeft: function(object, deltaX, deltaY) {
        var w = this.window;
        var f = this.content;
        this.width = parseInt(w.style.width, 10) - deltaX;
        this.height = parseInt(f.style.height, 10) - deltaY;
        this.left_ = parseInt(w.style.left, 10) + deltaX;
        this.top_ = parseInt(w.style.top, 10) + deltaY;
        this.clipSize(true, true);
        w.style.width = this.width + "px";
        w.style.left = this.left_ + "px";
        f.style.height =
            this.height + "px";
        w.style.top = this.top_ + "px";
        this.moving();
        this.resizing();
        return this.res
    },
    onResizeTopRight: function(object, deltaX, deltaY) {
        var w = this.window;
        var f = this.content;
        this.width = parseInt(w.style.width, 10) + deltaX;
        this.height = parseInt(f.style.height, 10) - deltaY;
        this.top_ = parseInt(w.style.top, 10) + deltaY;
        this.clipSize(false, true);
        w.style.width = this.width + "px";
        f.style.height = this.height + "px";
        w.style.top = this.top_ + "px";
        this.moving();
        this.resizing();
        return this.res
    },
    onResizeTop: function(object, deltaX,
        deltaY) {
        var f = this.content;
        var w = this.window;
        this.height = parseInt(f.style.height, 10) - deltaY;
        this.top_ = parseInt(w.style.top, 10) + deltaY;
        this.clipSize(false, true);
        f.style.height = this.height + "px";
        w.style.top = this.top_ + "px";
        this.moving();
        this.resizing();
        return this.res
    }
};
Wicket.Window.idCounter = 0;
Wicket.Window.getMarkup = function(idWindow, idClassElement, idCaption, idContent, idTop, idTopLeft, idTopRight, idLeft, idRight, idBottomLeft, idBottomRight, idBottom, idCaptionText, isFrame) {
    var s = '\x3cdiv class\x3d"wicket-modal" id\x3d"' + idWindow + '" style\x3d"top: 10px; left: 10px; width: 100px;"\x3e\x3cform style\x3d\'background-color:transparent;padding:0px;margin:0px;border-width:0px;position:static\'\x3e' + '\x3cdiv id\x3d"' + idClassElement + '"\x3e' + '\x3cdiv class\x3d"w_top_1"\x3e' + '\x3cdiv class\x3d"w_topLeft" id\x3d"' +
        idTopLeft + '"\x3e' + "\x3c/div\x3e" + '\x3cdiv class\x3d"w_topRight" id\x3d"' + idTopRight + '"\x3e' + "\x3c/div\x3e" + '\x3cdiv class\x3d"w_top" id\x3d\'' + idTop + "'\x3e" + "\x3c/div\x3e" + "\x3c/div\x3e" + '\x3cdiv class\x3d"w_left" id\x3d\'' + idLeft + "'\x3e" + '\x3cdiv class\x3d"w_right_1"\x3e' + '\x3cdiv class\x3d"w_right" id\x3d\'' + idRight + "'\x3e" + '\x3cdiv class\x3d"w_content_1" onmousedown\x3d"if (Wicket.Browser.isSafari()) { event.ignore \x3d true; }  else { Wicket.stopEvent(event); } "\x3e' + '\x3cdiv class\x3d"w_caption"  id\x3d"' +
        idCaption + '"\x3e' + '\x3ca class\x3d"w_close" href\x3d"#"\x3e\x3c/a\x3e' + '\x3cspan id\x3d"' + idCaptionText + '" class\x3d"w_captionText"\x3e\x3c/span\x3e' + "\x3c/div\x3e" + '\x3cdiv class\x3d"w_content_2"\x3e' + '\x3cdiv class\x3d"w_content_3"\x3e' + '\x3cdiv class\x3d"w_content"\x3e';
    if (isFrame) {
        s += "\x3ciframe";
        if (Wicket.Browser.isIELessThan7()) s += ' src\x3d"about:blank"';
        s += ' frameborder\x3d"0" id\x3d"' + idContent + '" allowtransparency\x3d"false" style\x3d"height: 200px" class\x3d"wicket_modal"\x3e\x3c/iframe\x3e'
    } else s +=
        "\x3cdiv id\x3d'" + idContent + "' class\x3d'w_content_container'\x3e\x3c/div\x3e";
    s += "\x3c/div\x3e" + "\x3c/div\x3e" + "\x3c/div\x3e" + "\x3c/div\x3e" + "\x3c/div\x3e" + "\x3c/div\x3e" + "\x3c/div\x3e" + '\x3cdiv class\x3d"w_bottom_1" id\x3d"' + idBottom + '"\x3e' + '\x3cdiv class\x3d"w_bottomRight"  id\x3d"' + idBottomRight + '"\x3e' + "\x3c/div\x3e" + '\x3cdiv class\x3d"w_bottomLeft" id\x3d"' + idBottomLeft + '"\x3e' + "\x3c/div\x3e" + '\x3cdiv class\x3d"w_bottom" id\x3d"' + idBottom + '"\x3e' + "\x3c/div\x3e" + "\x3c/div\x3e" + "\x3c/div\x3e" +
        "\x3c/form\x3e\x3c/div\x3e";
    return s
};
Wicket.Window.Mask = Wicket.Class.create();
Wicket.Window.Mask.zIndex = 2E4;
Wicket.Window.Mask.prototype = {
    initialize: function(transparent) {
        this.transparent = transparent
    },
    show: function() {
        if (typeof Wicket.Window.Mask.element == "undefined" || Wicket.Window.Mask.element == null) {
            var e = document.createElement("div");
            document.body.appendChild(e);
            if (this.transparent) e.className = "wicket-mask-transparent";
            else e.className = "wicket-mask-dark";
            e.style.zIndex = Wicket.Window.Mask.zIndex;
            if (this.transparent == false)
                if (Wicket.Browser.isKHTML() == false) e.style.backgroundImage = "none";
                else e.style.backgroundColor =
                    "transparent";
            if (Wicket.Browser.isIE() || Wicket.Browser.isGecko()) e.style.position = "absolute";
            this.element = e;
            this.old_onscroll = window.onscroll;
            this.old_onresize = window.onresize;
            window.onscroll = this.onScrollResize.bind(this);
            window.onresize = this.onScrollResize.bind(this);
            this.onScrollResize(true);
            Wicket.Window.Mask.element = e
        } else this.dontHide = true;
        this.shown = true;
        this.focusDisabled = false;
        this.disableCoveredContent()
    },
    hide: function() {
        this.cancelPendingTasks();
        if (typeof Wicket.Window.Mask.element != "undefined" &&
            typeof this.dontHide == "undefined") {
            document.body.removeChild(this.element);
            this.element = null;
            window.onscroll = this.old_onscroll;
            window.onresize = this.old_onresize;
            Wicket.Window.Mask.element = null
        }
        this.shown = false;
        this.reenableCoveredContent()
    },
    disableCoveredContent: function() {
        var doc = document;
        var old = Wicket.Window.current.oldWindow;
        if (typeof old != "undefined" && old != null) doc = old.getContentDocument();
        this.doDisable(doc, Wicket.Window.current)
    },
    tasks: [],
    startTask: function(fn, delay) {
        var taskId = setTimeout(function() {
            fn();
            this.clearTask(taskId)
        }.bind(this), delay);
        this.tasks.push(taskId)
    },
    clearTask: function(taskId) {
        var index = -1;
        for (var i = 0; i < this.tasks.length; i++)
            if (this.tasks[i] == taskId) {
                index = i;
                break
            } if (index >= 0) this.tasks.splice(index, 1)
    },
    cancelPendingTasks: function() {
        while (this.tasks.length > 0) {
            var taskId = this.tasks.shift();
            clearTimeout(taskId)
        }
    },
    doDisable: function(doc, win) {
        this.startTask(function() {
            this.hideSelectBoxes(doc, win)
        }.bind(this), 300);
        this.startTask(function() {
            this.disableTabs(doc, win)
        }.bind(this), 400);
        this.startTask(function() {
            this.disableFocus(doc, win)
        }.bind(this), 1E3)
    },
    reenableCoveredContent: function() {
        this.showSelectBoxes();
        this.restoreTabs();
        this.enableFocus()
    },
    onScrollResize: function(dontChangePosition) {
        if (this.element.style.position == "absolute") {
            var w = Wicket.Window.getViewportWidth();
            var h = Wicket.Window.getViewportHeight();
            var scTop = 0;
            var scLeft = 0;
            scLeft = Wicket.Window.getScrollX();
            scTop = Wicket.Window.getScrollY();
            this.element.style.top = scTop + "px";
            this.element.style.left = scLeft + "px";
            if (document.all) this.element.style.width =
                w;
            this.element.style.height = h
        }
    },
    isParent: function(element, parent) {
        if (element.parentNode == parent) return true;
        if (typeof element.parentNode == "undefined" || element.parentNode == document.body) return false;
        return this.isParent(element.parentNode, parent)
    },
    hideSelectBoxes: function(doc, win) {
        if (!this.shown) return;
        if (Wicket.Browser.isIE() && Wicket.Browser.isIE7() == false) {
            this.boxes = new Array;
            var selects = doc.getElementsByTagName("select");
            for (var i = 0; i < selects.length; i++) {
                var element = selects[i];
                if (win.isIframe() ==
                    false && this.isParent(element, win.content)) continue;
                if (element.style.visibility != "hidden") {
                    element.style.visibility = "hidden";
                    this.boxes.push(element)
                }
            }
        }
    },
    showSelectBoxes: function() {
        if (typeof this.boxes != "undefined") {
            for (var i = 0; i < this.boxes.length; ++i) {
                var element = this.boxes[i];
                element.style.visibility = "visible"
            }
            this.boxes = null
        }
    },
    disableFocusElement: function(element, revertList, win) {
        if (typeof win != "undefined" && win != null && win.window != element) {
            revertList.push([element, element.onfocus]);
            element.onfocus =
                function() {
                    element.blur()
                };
            for (var i = 0; i < element.childNodes.length; ++i) this.disableFocusElement(element.childNodes[i], revertList, win)
        }
    },
    disableFocus: function(doc, win) {
        if (!this.shown) return;
        if (Wicket.Browser.isIE() == false) {
            this.focusRevertList = new Array;
            var body = doc.getElementsByTagName("body")[0];
            for (var i = 0; i < body.childNodes.length; ++i) this.disableFocusElement(body.childNodes[i], this.focusRevertList, win)
        }
        this.focusDisabled = true
    },
    enableFocus: function() {
        if (this.focusDisabled == false) return;
        if (typeof this.focusRevertList !=
            "undefined")
            for (var i = 0; i < this.focusRevertList.length; ++i) {
                var item = this.focusRevertList[i];
                item[0].onfocus = item[1]
            }
        this.focusRevertList = null
    },
    disableTabs: function(doc, win) {
        if (!this.shown) return;
        if (typeof this.tabbableTags == "undefined") this.tabbableTags = new Array("A", "BUTTON", "TEXTAREA", "INPUT", "IFRAME", "SELECT");
        if (Wicket.Browser.isIE()) {
            this.disabledTabsRevertList = new Array;
            for (var j = 0; j < this.tabbableTags.length; j++) {
                var tagElements = doc.getElementsByTagName(this.tabbableTags[j]);
                for (var k = 0; k < tagElements.length; k++)
                    if (win.isIframe() ==
                        true || this.isParent(tagElements[k], win.content) == false) {
                        var element = tagElements[k];
                        element.hiddenTabIndex = element.tabIndex;
                        element.tabIndex = "-1";
                        this.disabledTabsRevertList.push(element)
                    }
            }
        }
    },
    restoreTabs: function() {
        if (typeof this.disabledTabsRevertList != "undefined" && this.disabledTabsRevertList != null) {
            for (var i = 0; i < this.disabledTabsRevertList.length; ++i) {
                var element = this.disabledTabsRevertList[i];
                if (typeof element.hiddenTabIndex != "undefined") {
                    element.tabIndex = element.hiddenTabIndex;
                    try {
                        delete element.hiddenTabIndex
                    } catch (e) {
                        element.hiddenTabIndex =
                            undefined
                    }
                }
            }
            this.disabledTabsRevertList = null
        }
    }
};
Wicket.Window.getViewportHeight = function() {
    if (typeof window.innerHeight != "undefined") return window.innerHeight;
    if (document.compatMode == "CSS1Compat") return document.documentElement.clientHeight;
    if (document.body) return document.body.clientHeight;
    return undefined
};
Wicket.Window.getViewportWidth = function() {
    if (typeof window.innerWidth != "undefined") return window.innerWidth;
    if (document.compatMode == "CSS1Compat") return document.documentElement.clientWidth;
    if (document.body) return document.body.clientWidth;
    return undefined
};
Wicket.Window.getScrollX = function() {
    var iebody = document.compatMode && document.compatMode != "BackCompat" ? document.documentElement : document.body;
    return document.all ? iebody.scrollLeft : pageXOffset
};
Wicket.Window.getScrollY = function() {
    var iebody = document.compatMode && document.compatMode != "BackCompat" ? document.documentElement : document.body;
    return document.all ? iebody.scrollTop : pageYOffset
};
Wicket.Cookie = {
    get: function(name) {
        if (document.cookie.length > 0) {
            var start = document.cookie.indexOf(name + "\x3d");
            if (start != -1) {
                start = start + name.length + 1;
                end = document.cookie.indexOf(";", start);
                if (end == -1) end = document.cookie.length;
                return unescape(document.cookie.substring(start, end))
            }
        } else return null
    },
    set: function(name, value, expiredays) {
        var exdate = new Date;
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = name + "\x3d" + escape(value) + (expiredays == null ? "" : ";expires\x3d" + exdate)
    }
};