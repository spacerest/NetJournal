var COMPILED = !0,
    goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
    return void 0 !== a
};
goog.exportPath_ = function(a, b, c) {
    a = a.split(".");
    c = c || goog.global;
    a[0] in c || !c.execScript || c.execScript("var " + a[0]);
    for (var d; a.length && (d = a.shift());) !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
};
goog.define = function(a, b) {
    var c = b;
    COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]));
    goog.exportPath_(a, c)
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.provide = function(a) {
    if (!COMPILED) {
        if (goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');
        delete goog.implicitNamespaces_[a];
        for (var b = a;
            (b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) goog.implicitNamespaces_[b] = !0
    }
    goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
    if (COMPILED && !goog.DEBUG) throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
};
goog.forwardDeclare = function(a) {};
COMPILED || (goog.isProvided_ = function(a) {
    return !goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a))
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
    for (var c = a.split("."), d = b || goog.global, e; e = c.shift();)
        if (goog.isDefAndNotNull(d[e])) d = d[e];
        else return null;
    return d
};
goog.globalize = function(a, b) {
    var c = b || goog.global,
        d;
    for (d in a) c[d] = a[d]
};
goog.addDependency = function(a, b, c) {
    if (goog.DEPENDENCIES_ENABLED) {
        var d;
        a = a.replace(/\\/g, "/");
        for (var e = goog.dependencies_, g = 0; d = b[g]; g++) e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0;
        for (d = 0; b = c[d]; d++) a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
};
goog.useStrictRequires = !1;
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
    if (!COMPILED && !goog.isProvided_(a)) {
        if (goog.ENABLE_DEBUG_LOADER) {
            var b = goog.getPathFromDeps_(a);
            if (b) {
                goog.included_[b] = !0;
                goog.writeScripts_();
                return
            }
        }
        a = "goog.require could not find: " + a;
        goog.global.console && goog.global.console.error(a);
        if (goog.useStrictRequires) throw Error(a);
    }
};
goog.basePath = "";
goog.nullFunction = function() {};
goog.identityFunction = function(a, b) {
    return a
};
goog.abstractMethod = function() {
    throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
    a.getInstance = function() {
        if (a.instance_) return a.instance_;
        goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
        return a.instance_ = new a
    }
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {
    pathToNames: {},
    nameToPath: {},
    requires: {},
    visited: {},
    written: {}
}, goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return "undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH;
    else if (goog.inHtmlDocument_())
        for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1; 0 <= b; --b) {
            var c = a[b].src,
                d = c.lastIndexOf("?"),
                d = -1 == d ? c.length :
                d;
            if ("base.js" == c.substr(d - 7, 7)) {
                goog.basePath = c.substr(0, d - 7);
                break
            }
        }
}, goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
    if (goog.inHtmlDocument_()) {
        var b = goog.global.document;
        if ("complete" == b.readyState) {
            if (/\bdeps.js$/.test(a)) return !1;
            throw Error('Cannot write "' + a + '" after document load');
        }
        b.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
        return !0
    }
    return !1
}, goog.writeScripts_ = function() {
    function a(e) {
        if (!(e in d.written)) {
            if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires))
                for (var f in d.requires[e])
                    if (!goog.isProvided_(f))
                        if (f in d.nameToPath) a(d.nameToPath[f]);
                        else throw Error("Undefined nameToPath for " + f);
            e in c || (c[e] = !0, b.push(e))
        }
    }
    var b = [],
        c = {},
        d = goog.dependencies_,
        e;
    for (e in goog.included_) d.written[e] || a(e);
    for (e = 0; e < b.length; e++)
        if (b[e]) goog.importScript_(goog.basePath + b[e]);
        else throw Error("Undefined script input");
}, goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
    var b = typeof a;
    if ("object" == b)
        if (a) {
            if (a instanceof Array) return "array";
            if (a instanceof Object) return b;
            var c = Object.prototype.toString.call(a);
            if ("[object Window]" == c) return "object";
            if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
            if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
        } else return "null";
    else if ("function" == b && "undefined" == typeof a.call) return "object";
    return b
};
goog.isNull = function(a) {
    return null === a
};
goog.isDefAndNotNull = function(a) {
    return null != a
};
goog.isArray = function(a) {
    return "array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
    var b = goog.typeOf(a);
    return "array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
    return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
    return "string" == typeof a
};
goog.isBoolean = function(a) {
    return "boolean" == typeof a
};
goog.isNumber = function(a) {
    return "number" == typeof a
};
goog.isFunction = function(a) {
    return "function" == goog.typeOf(a)
};
goog.isObject = function(a) {
    var b = typeof a;
    return "object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
    return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.hasUid = function(a) {
    return !!a[goog.UID_PROPERTY_]
};
goog.removeUid = function(a) {
    "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
    try {
        delete a[goog.UID_PROPERTY_]
    } catch (b) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) return a.clone();
        var b = "array" == b ? [] : {},
            c;
        for (c in a) b[c] = goog.cloneObject(a[c]);
        return b
    }
    return a
};
goog.bindNative_ = function(a, b, c) {
    return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
            var c = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(c, d);
            return a.apply(b, c)
        }
    }
    return function() {
        return a.apply(b, arguments)
    }
};
goog.bind = function(a, b, c) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
    return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function() {
        var b = c.slice();
        b.push.apply(b, arguments);
        return a.apply(this, b)
    }
};
goog.mixin = function(a, b) {
    for (var c in b) a[c] = b[c]
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
    return +new Date
};
goog.globalEval = function(a) {
    if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
    else if (goog.global.eval)
        if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) goog.global.eval(a);
        else {
            var b = goog.global.document,
                c = b.createElement("script");
            c.type = "text/javascript";
            c.defer = !1;
            c.appendChild(b.createTextNode(a));
            b.body.appendChild(c);
            b.body.removeChild(c)
        } else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
    var c = function(a) {
            return goog.cssNameMapping_[a] || a
        },
        d = function(a) {
            a = a.split("-");
            for (var b = [], d = 0; d < a.length; d++) b.push(c(a[d]));
            return b.join("-")
        },
        d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
            return a
        };
    return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
    goog.cssNameMapping_ = a;
    goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
    b && (a = a.replace(/\{\$([^}]+)}/g, function(a, d) {
        return d in b ? b[d] : a
    }));
    return a
};
goog.getMsgWithFallback = function(a, b) {
    return a
};
goog.exportSymbol = function(a, b, c) {
    goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
    a[b] = c
};
goog.inherits = function(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.base = function(a, c, g) {
        var f = Array.prototype.slice.call(arguments, 2);
        return b.prototype[c].apply(a, f)
    }
};
goog.base = function(a, b, c) {
    var d = arguments.callee.caller;
    if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
    if (d.superClass_) return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
    for (var e = Array.prototype.slice.call(arguments, 2), g = !1, f = a.constructor; f; f = f.superClass_ && f.superClass_.constructor)
        if (f.prototype[b] === d) g = !0;
        else if (g) return f.prototype[b].apply(a,
        e);
    if (a[b] === d) return a.constructor.prototype[b].apply(a, e);
    throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
    a.call(goog.global)
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.MODIFY_FUNCTION_PROTOTYPES = !0;
goog.MODIFY_FUNCTION_PROTOTYPES && (Function.prototype.bind = Function.prototype.bind || function(a, b) {
    if (1 < arguments.length) {
        var c = Array.prototype.slice.call(arguments, 1);
        c.unshift(this, a);
        return goog.bind.apply(null, c)
    }
    return goog.bind(this, a)
}, Function.prototype.partial = function(a) {
    var b = Array.prototype.slice.call(arguments);
    b.unshift(this, null);
    return goog.bind.apply(null, b)
}, Function.prototype.inherits = function(a) {
    goog.inherits(this, a)
}, Function.prototype.mixin = function(a) {
    goog.mixin(this.prototype,
        a)
});
goog.defineClass = function(a, b) {
    var c = b.constructor,
        d = b.statics;
    c && c != Object.prototype.constructor || (c = function() {
        throw Error("cannot instantiate an interface (no constructor defined).");
    });
    c = goog.defineClass.createSealingConstructor_(c);
    a && goog.inherits(c, a);
    delete b.constructor;
    delete b.statics;
    goog.defineClass.applyProperties_(c.prototype, b);
    null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
    return c
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(a) {
    if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
        var b = function() {
            var c = a.apply(this, arguments) || this;
            this.constructor === b && Object.seal(c);
            return c
        };
        return b
    }
    return a
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(a, b) {
    for (var c in b) Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
    for (var d = 0; d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; d++) c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c])
};
var gdlog = {};
goog.exportSymbol("gdlog", gdlog);
gdlog.Level = {
    SEVERE: 1E3,
    WARNING: 900,
    INFO: 800,
    CONFIG: 700,
    FINE: 500,
    FINER: 400,
    FINEST: 300
};
gdlog.ENABLE_DEBUG_FLAG = !1;
gdlog.DEFAULT_LEVEL_UNCOMPILED_ = gdlog.Level.INFO;
gdlog.DEFAULT_LEVEL_COMPILED_ = gdlog.Level.WARNING;
gdlog.loglevel = gdlog.ENABLE_DEBUG_FLAG ? gdlog.DEFAULT_LEVEL_UNCOMPILED_ : gdlog.DEFAULT_LEVEL_COMPILED_;
goog.exportSymbol("gdlog.loglevel", gdlog.loglevel);
gdlog.msg_ = function(a, b) {
    return a + ": " + b
};
gdlog.isLoggable_ = function(a) {
    return a >= gdlog.loglevel
};
gdlog.error = function(a, b) {
    window.console.error(gdlog.msg_(a, b))
};
gdlog.errorLastErr = function(a, b) {
    window.console.error(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.warn = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.WARNING) && window.console.warn(gdlog.msg_(a, b))
};
gdlog.warnLastErr = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.WARNING) && window.console.warn(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.info = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.INFO) && window.console.info(gdlog.msg_(a, b))
};
gdlog.infoLastErr = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.INFO) && window.console.info(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.fine = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.FINE) && window.console.log(gdlog.msg_(a, b))
};
gdlog.fineLastErr = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.FINE) && window.console.log(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.finer = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.FINER) && window.console.debug(gdlog.msg_(a, b))
};
gdlog.logwarn = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.WARNING, "WARN")
};
goog.exportSymbol("gdlog.logwarn", gdlog.logwarn);
gdlog.loginfo = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.INFO, "INFO")
};
goog.exportSymbol("gdlog.loginfo", gdlog.loginfo);
gdlog.logfine = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.FINE, "FINE")
};
goog.exportSymbol("gdlog.logfine", gdlog.logfine);
gdlog.logfiner = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.FINER, "FINER")
};
goog.exportSymbol("gdlog.logfiner", gdlog.logfiner);
gdlog.setLoggingLevel_ = function(a, b) {
    gdlog.loglevel = a;
    return "Log level is now " + b
};
gdlog.lastErr = function() {
    return chrome.runtime.lastError ? chrome.runtime.lastError.message ? " lastError:" + chrome.runtime.lastError.message : " lastError (no message)" : ""
};
gdlog.prettyPrint = function(a, b) {
    if (!a) return '""';
    var c = b || 100,
        d = {},
        e;
    for (e in a) {
        var g = String(a[e]),
            f = g.length;
        f > c && (g = g.substr(0, c) + " ... (" + f + " bytes)");
        d[e] = g
    }
    return JSON.stringify(d, null, 2)
};
var gdocs = {
    AnimatedBrowserIcon: function(a, b, c) {
        this.browserIconPath_ = a;
        this.browserIconSize_ = b;
        this.params_ = c;
        this.numInProgress_ = 0;
        this.browserIconCanvas_ = document.createElement("canvas");
        this.context_ = this.browserIconCanvas_.getContext("2d");
        this.image_ = new Image;
        this.image_.src = this.browserIconPath_;
        this.lastStart_ = this.intervalId_ = 0;
        this.hasDrawn_ = !1
    }
};
gdocs.AnimatedBrowserIcon.MAX_ANIMATE_MSECS_ = 45E3;
gdocs.AnimatedBrowserIcon.prototype.start = function() {
    gdlog.info("AnimatedBrowserIcon.start", "Initial numInProgress:" + this.numInProgress_);
    0 == this.numInProgress_++ && (this.lastStart_ = Date.now(), this.animate_(), this.intervalId_ = window.setInterval(goog.bind(this.animate_, this), this.params_.getRedrawMsecs()))
};
gdocs.AnimatedBrowserIcon.prototype.stop = function() {
    gdlog.info("AnimatedBrowserIcon.stop", "Initial numInProgress:" + this.numInProgress_);
    if (0 == --this.numInProgress_) {
        window.clearInterval(this.intervalId_);
        this.intervalId_ = 0;
        var a = {};
        a[this.browserIconSize_] = this.browserIconPath_;
        chrome.browserAction.setIcon({
            path: a
        })
    }
};
gdocs.AnimatedBrowserIcon.prototype.animate_ = function() {
    var a = Date.now() - this.lastStart_;
    if (a > gdocs.AnimatedBrowserIcon.MAX_ANIMATE_MSECS_) gdlog.warn("AnimatedBrowserIcon.animate", "Stopping rogue animation. numInProgress:" + this.numInProgress_ + " deltaMsecs:" + a), this.numInProgress_ = 1, this.stop();
    else if (this.image_.complete) {
        this.hasDrawn_ || (this.browserIconCanvas_.width = this.image_.width, this.browserIconCanvas_.height = this.image_.height, this.hasDrawn_ = !0);
        var a = this.mutate_(a, this.image_.width, this.image_.height),
            b = {};
        b[this.browserIconSize_] = a;
        chrome.browserAction.setIcon({
            imageData: b
        })
    } else gdlog.info("AnimatedBrowserIcon.animate", "Image load incomplete")
};
gdocs.AnimatedBrowserIcon.prototype.mutate_ = function(a, b, c) {
    var d = this.params_.computeScale(a);
    a = this.params_.computeRadians(a);
    this.context_.clearRect(0, 0, b, c);
    this.context_.save();
    this.context_.translate(b / 2, c / 2);
    this.context_.globalAlpha = .8;
    this.context_.scale(d, d);
    this.context_.rotate(a);
    this.context_.translate(-b / 2, -c / 2);
    this.context_.drawImage(this.image_, 0, 0);
    this.context_.restore();
    return this.context_.getImageData(0, 0, b, c)
};
gdocs.AnimatedBrowserIconParams = function(a) {
    this.redrawMsecs_ = this.val_("redrawMsecs", 200, a);
    this.alphaBegin_ = this.val_("alphaBegin", .1, a);
    this.alphaEnd_ = this.val_("alphaEnd", .8, a);
    this.scaleBegin_ = this.val_("scaleBegin", .3, a);
    this.scaleEnd_ = this.val_("scaleEnd", 1, a);
    var b = this.val_("period", 4E3, a);
    this.alphaPhasePeriod_ = this.val_("alphaPhasePeriod", b, a);
    this.scalePhasePeriod_ = this.val_("scalePhasePeriod", b, a);
    this.rotationPeriod_ = this.val_("rotationPeriod", b, a)
};
gdocs.AnimatedBrowserIconParams.prototype.getRedrawMsecs = function() {
    return this.redrawMsecs_
};
gdocs.AnimatedBrowserIconParams.prototype.val_ = function(a, b, c) {
    return c && goog.isDefAndNotNull(c[a]) ? c[a] : b
};
gdocs.AnimatedBrowserIconParams.prototype.computeAlpha = function(a) {
    return this.computeOscilation_(a, this.alphaPhasePeriod_, this.alphaBegin_, this.alphaEnd_)
};
gdocs.AnimatedBrowserIconParams.prototype.computeScale = function(a) {
    return this.computeOscilation_(a, this.scalePhasePeriod_, this.scaleBegin_, this.scaleEnd_)
};
gdocs.AnimatedBrowserIconParams.prototype.computeRadians = function(a) {
    a = this.computePercentComplete_(a, this.rotationPeriod_);
    return 2 * Math.PI * a
};
gdocs.AnimatedBrowserIconParams.prototype.computeOscilation_ = function(a, b, c, d) {
    a = this.computePercentComplete_(a, b);
    return c + 2 * (d - c) * (.5 >= a ? a : 1 - a)
};
gdocs.AnimatedBrowserIconParams.prototype.computePercentComplete_ = function(a, b) {
    return a % b / b
};
gdocs.UploadParams = function(a) {
    this.userImpression_ = a
};
goog.exportSymbol("gdocs.UploadParams", gdocs.UploadParams);
gdocs.UploadParams.IMPRESSION_HEADER_ = "X-DriveExt-Action";
gdocs.UploadParams.prototype.getUserImpression = function() {
    return this.userImpression_
};
goog.exportProperty(gdocs.UploadParams.prototype, "getUserImpression", gdocs.UploadParams.prototype.getUserImpression);
gdocs.UploadParams.prototype.createImpressionHeader = function() {
    var a = {};
    a[gdocs.UploadParams.IMPRESSION_HEADER_] = this.userImpression_.toString();
    return a
};
goog.exportProperty(gdocs.UploadParams.prototype, "isUploadOnly", gdocs.UploadParams.prototype.isUploadOnly);
gdocs.CaptureUploadParams = function(a, b) {
    gdocs.UploadParams.call(this, b);
    this.capturer_ = a
};
goog.inherits(gdocs.CaptureUploadParams, gdocs.UploadParams);
goog.exportSymbol("gdocs.CaptureUploadParams", gdocs.CaptureUploadParams);
gdocs.CaptureUploadParams.prototype.getCapturer = function() {
    return this.capturer_
};
goog.exportProperty(gdocs.CaptureUploadParams.prototype, "getCapturer", gdocs.CaptureUploadParams.prototype.getCapturer);
gdocs.CaptureUploadParams.prototype.isUploadOnly = function() {
    return !0
};
gdocs.DownloadResults = function(a, b) {
    this.contentType_ = a;
    this.blobData_ = b
};
goog.exportSymbol("gdocs.DownloadResults", gdocs.DownloadResults);
gdocs.DownloadResults.prototype.getContentType = function() {
    return this.contentType_
};
goog.exportProperty(gdocs.DownloadResults.prototype, "getContentType", gdocs.DownloadResults.prototype.getContentType);
gdocs.DownloadResults.prototype.getBlobData = function() {
    return this.blobData_
};
gdocs.UploadPageState = function(a) {
    this.defaultFilename_ = a;
    this.filename_ = "";
    this.percentage_ = 0;
    this.fatalMsg_ = this.uploadPage_ = null;
    this.fatalMsgHasHtml_ = !1
};
gdocs.UploadPageState.prototype.fatal = function(a) {
    gdlog.info("UploadPageState.fatal", a);
    this.fatalMsg_ = this.fatalMsg_ ? this.fatalMsg_ + ("; " + a) : a;
    this.uploadPage_ && this.uploadPage_.fatal(this.fatalMsg_, this.fatalMsgHasHtml_)
};
gdocs.UploadPageState.prototype.fatalHtml = function(a) {
    this.fatalMsgHasHtml_ = !0;
    this.fatal(a)
};
gdocs.UploadPageState.prototype.hasFailed = function() {
    return !!this.fatalMsg_
};
gdocs.UploadPageState.prototype.isCancel = function() {
    return !!this.uploadPage_ && this.uploadPage_.isCancel()
};
gdocs.UploadPageState.prototype.clearCancel = function() {
    this.uploadPage_ && this.uploadPage_.clearCancel()
};
gdocs.UploadPageState.prototype.setUploadPage = function(a) {
    this.uploadPage_ = a;
    this.fatalMsg_ ? this.uploadPage_.fatal(this.fatalMsg_, this.fatalMsgHasHtml_) : this.updateFilename_()
};
gdocs.UploadPageState.prototype.setPercent = function(a) {
    this.percentage_ = a;
    this.uploadPage_ && this.uploadPage_.setPercent(this.percentage_)
};
gdocs.UploadPageState.prototype.setFilename = function(a) {
    this.filename_ = a;
    this.uploadPage_ && this.updateFilename_()
};
gdocs.UploadPageState.prototype.getFilename = function() {
    return this.filename_ ? this.filename_ : this.defaultFilename_
};
gdocs.UploadPageState.prototype.updateFilename_ = function() {
    var a = this.filename_ ? chrome.i18n.getMessage("DOWNLOAD_KNOWN_NAME", this.filename_) : chrome.i18n.getMessage("DOWNLOAD_UNKNOWN_NAME");
    this.uploadPage_.updateProgressText(a)
};
gdocs.DriveDataController = function(a, b, c, d) {
    this.tab_ = b;
    this.uploadPageState_ = new gdocs.UploadPageState(c);
    this.allowConvert_ = d && a.getOptions().getConvertToGoogleFormat();
    this.resumableUploader_ = this.downloadResults_ = null
};
goog.exportSymbol("gdocs.DriveDataController", gdocs.DriveDataController);
gdocs.DriveDataController.prototype.getTab = function() {
    return this.tab_
};
gdocs.DriveDataController.prototype.getAllowConvert = function() {
    return this.allowConvert_
};
goog.exportProperty(gdocs.DriveDataController.prototype, "getAllowConvert", gdocs.DriveDataController.prototype.getAllowConvert);
gdocs.DriveDataController.prototype.setResumableUploader = function(a) {
    this.resumableUploader_ = a
};
goog.exportProperty(gdocs.DriveDataController.prototype, "setResumableUploader", gdocs.DriveDataController.prototype.setResumableUploader);
gdocs.DriveDataController.prototype.uploadBlob = function(a, b) {
    gdlog.info("DriveDataController.uploadBlob", "Blob size:" + a.size + " contentType:" + b);
    0 >= a.size ? this.fatal(chrome.i18n.getMessage("DOWNLOAD_FAILURE_NO_DATA")) : (this.downloadResults_ = new gdocs.DownloadResults(b, a), this.resumableUploader_ && this.resumableUploader_.startResumableUpload(b))
};
gdocs.DriveDataController.prototype.createDataUriBlob = function(a, b) {
    if (b) {
        a = window.atob(a);
        for (var c = new Uint8Array(new ArrayBuffer(a.length)), d = 0; d < a.length; d++) c[d] = a.charCodeAt(d);
        c = new DataView(c.buffer);
        return this.createBlob(c)
    }
    return this.createBlob(decodeURI(a))
};
gdocs.DriveDataController.prototype.createBlob = function(a) {
    return new Blob(["Hello world"], {"type": "text/plain"});
};
gdocs.DriveDataController.prototype.getDownloadResults = function() {
    return this.downloadResults_
};
goog.exportProperty(gdocs.DriveDataController.prototype, "getDownloadResults", gdocs.DriveDataController.prototype.getDownloadResults);
gdocs.DriveDataController.prototype.setFilename = function(a) {
    this.uploadPageState_.setFilename(a)
};
gdocs.DriveDataController.prototype.getFilename = function() {
    return this.uploadPageState_.getFilename()
};
goog.exportProperty(gdocs.DriveDataController.prototype, "getFilename", gdocs.DriveDataController.prototype.getFilename);
gdocs.DriveDataController.prototype.fatal = function(a) {
    this.uploadPageState_.fatal(a)
};
gdocs.DriveDataController.prototype.fatalHtml = function(a) {
    this.uploadPageState_.fatalHtml(a)
};
gdocs.DriveDataController.prototype.hasFailed = function() {
    return this.uploadPageState_.hasFailed()
};
goog.exportProperty(gdocs.DriveDataController.prototype, "hasFailed", gdocs.DriveDataController.prototype.hasFailed);
gdocs.DriveDataController.prototype.setPercent = function(a) {
    this.uploadPageState_.setPercent(a)
};
gdocs.DriveDataController.prototype.isCancel = function() {
    return this.uploadPageState_.isCancel()
};
gdocs.DriveDataController.prototype.clearCancel = function() {
    this.uploadPageState_.clearCancel()
};
gdocs.DriveDataController.prototype.setUploadPage = function(a) {
    this.uploadPageState_.setUploadPage(a)
};
goog.exportProperty(gdocs.DriveDataController.prototype, "setUploadPage", gdocs.DriveDataController.prototype.setUploadPage);
gdocs.Capturer = function(a, b, c, d) {
    gdocs.DriveDataController.call(this, a, b, c, d)
};
goog.inherits(gdocs.Capturer, gdocs.DriveDataController);
goog.exportSymbol("gdocs.Capturer", gdocs.Capturer);
gdocs.Capturer.createFilenameFromTab = function(a, b) {
    var c = a.title;
    b && (c += b);
    return c
};
goog.math = {};
goog.math.Size = function(a, b) {
    this.width = a;
    this.height = b
};
goog.math.Size.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1
};
goog.math.Size.prototype.clone = function() {
    return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
    return "(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
    return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
    return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
    return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
    return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
    return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
    return !this.area()
};
goog.math.Size.prototype.ceil = function() {
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this
};
goog.math.Size.prototype.fitsInside = function(a) {
    return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this
};
goog.math.Size.prototype.round = function() {
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this
};
goog.math.Size.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.width *= a;
    this.height *= c;
    return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
    a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
    return this.scale(a)
};
gdocs.global = {};
gdocs.Impression = {
    OTHER: 0,
    LINK: 2,
    IMAGE: 3,
    AUDIO: 4,
    VIDEO: 5,
    PAGE_ACTION_URL: 6,
    PAGE_ACTION_DOC: 7,
    PAGE_ACTION_HTML: 8,
    PAGE_ACTION_CAPTURE_IMAGE_VISIBLE: 9,
    PAGE_ACTION_CAPTURE_MHTML: 10,
    PAGE_ACTION_CAPTURE_IMAGE_ENTIRE: 15
};
gdocs.HttpStatus = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    RESUME_INCOMPLETE: 308,
    UNAUTHORIZED: 401
};
gdocs.global.MAX_GENERATED_TITLE_LEN = 50;
gdocs.global.MAX_SUFFIX_LEN = 8;
gdocs.global.SAVE_DIALOG_SIZE = new goog.math.Size(417, 170);
gdocs.MimeType = {
    ATOM: "application/atom+xml",
    HTML: "text/plain", //SADIE changed this from text/html
    MHTML: "text/mhtml",
    JSON: "application/json",
    OCTET_STREAM: "application/octet-stream",
    PLAIN: "text/plain",
    PDF: "application/pdf",
    PNG: "image/png",
    X_PDF: "application/x-pdf",
    XML: "text/xml"
};
gdocs.ActionId = {
    BUG_INTERNAL: "bug-internal",
    CHANGE_FOLDER: "change-folder",
    FEEDBACK_INTERNAL: "feedback-internal",
    HELP: "help",
    HTML: "txt", //SADIE changed this from html
    HTML_DOC: "htmldoc",
    IMAGE_ENTIRE: "image-entire",
    IMAGE_VISIBLE: "image-visible",
    MHTML: "mhtml",
    OPTIONS: "options",
    SEND_FEEDBACK: "send-feedback",
    URL: "url"
};
gdocs.msgutil = {};
gdocs.msgutil.createXhrErrMsg = function(a) {
    var b = a.statusText;
    b || (b = chrome.i18n.getMessage("UNSPECIFIED_ERROR"));
    a.status && (b += " (" + a.status + ")");
    return b
};
gdocs.msgutil.createBaseFilenameFromContentType = function(a) {
    a = a.toLowerCase();
    return 0 == a.indexOf("image") ? chrome.i18n.getMessage("IMAGE_DEFAULT_FILENAME") : 0 == a.indexOf("video") ? chrome.i18n.getMessage("VIDEO_DEFAULT_FILENAME") : 0 == a.indexOf("audio") ? chrome.i18n.getMessage("AUDIO_DEFAULT_FILENAME") : chrome.i18n.getMessage("DEFAULT_FILENAME")
};
gdocs.data = {};
gdocs.data.EXTENSIONS = {
    "application/msword": "doc",
    "application/pdf": "pdf",
    "application/rtf": "rtf",
    "application/vnd.ms-excel": "xls",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/x-chrome-extension": "crx",
    "application/x-gzip": "gzip",
    "application/x-pdf": "pdf",
    "application/zip": "zip",
    "audio/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "audio/vnd.wave": "wav",
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/pjpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/tiff": "tif",
    "image/vnd.microsoft.icon": "ico",
    "text/css": "css",
    "text/csv": "csv",
    "text/html": "html",
    "text/mhtml": "mht",
    "text/plain": "txt",
    "text/tsv": "tsv",
    "text/xml": "xml",
    "video/mp4": "mp4",
    "video/mpeg": "mpg",
    "video/ogg": "ogg"
};
gdocs.data.CONVERTIBLE = {
    "application/msword": !0,
    "application/rtf": !0,
    "application/vnd.ms-excel": !0,
    "application/vnd.ms-powerpoint": !0,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": !0,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": !0,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": !0,
    "text/csv": !0,
    "text/html": !0,
    "text/plain": !0,
    "text/tsv": !0
};
gdocs.TitleComputer = function(a, b, c) {
    if (0 >= a) throw Error("Maximum title length must be > 0");
    if (0 > b) throw Error("Maximum suffix length must be >= 0");
    if (b >= a) throw Error("Maximum suffix length must be less than Maximum title length");
    this.maxTitleLen_ = a;
    this.maxSuffixLen_ = b;
    this.addExtension_ = c
};
gdocs.TitleComputer.TRIM_ = /^\s+|\s+$/g;
gdocs.TitleComputer.COLLAPSE_SPACES_ = /\s+/g;
gdocs.TitleComputer.STRIP_META_ = /<meta[^>]+>/img;
gdocs.TitleComputer.TITLE_CONTENTS_ = /<title>\s*([\s\S]+?)\s*<\/title/im;
gdocs.TitleComputer.prototype.createTitleFromText = function(a, b) {
    var c = this.unescapeHtml_(a);
    if (!c) return null;
    c = c.replace(gdocs.TitleComputer.COLLAPSE_SPACES_, " ");
    c = c.replace(gdocs.TitleComputer.TRIM_, "");
    if (!c.length) return null;
    var c = this.appendContentTypeExtension_(c, b),
        d = "";
    if (c.length > this.maxTitleLen_) {
        var e = this.splitExtension_(c),
            g = this.maxTitleLen_;
        e[1] && (c = e[0], d = "." + e[1], g -= d.length);
        c = c.substr(0, g);
        e = Math.max(c.lastIndexOf(" "), c.lastIndexOf("-"), c.lastIndexOf("_"));
        0 < e && (e = c.substr(0,
            e), 0 < e.length && (c = e))
    }
    return c + d
};
gdocs.TitleComputer.prototype.splitExtension_ = function(a) {
    var b = a.lastIndexOf(".");
    if (0 < b && b + 1 != a.length && a.length - b - 1 <= this.maxSuffixLen_) {
        var c = a.substr(b + 1);
        return [a.substr(0, b), c]
    }
    return [a, ""]
};
gdocs.TitleComputer.prototype.appendContentTypeExtension_ = function(a, b) {
    if (!b || !this.addExtension_) return a;
    var c = gdocs.data.EXTENSIONS[b];
    if (!c) return gdlog.info("TitleComputer.appendContentTypeExtension", "No extension mapping for " + b), a;
    var d = this.splitExtension_(a);
    return d[1].toLocaleLowerCase() != c ? a + "." + c : d[0] + "." + c
};
gdocs.TitleComputer.prototype.unescapeHtml_ = function(a) {
    if (!a) return null;
    a = a.replace(gdocs.TitleComputer.STRIP_META_, "");
    var b = document.createElement("body");
    b.innerHTML = a;
    for (a = b; a.firstChild;) a = a.firstChild;
    return a.nodeValue
};
gdocs.TitleComputer.prototype.createDefaultTitle = function(a, b, c, d, e) {
    return 0 == c.indexOf(gdocs.MimeType.HTML) ? (e = this.createFromHtml(e)) ? e : d ? this.createNoData_(a, c, b) : null : this.createNoData_(a, c, b)
};
gdocs.TitleComputer.prototype.createFromHtml = function(a) {
    a = "<title>Test title hardcoded into gdocs.TitleComputer.prototype.createFromHtml in background_all</title>"
    a = a.match(gdocs.TitleComputer.TITLE_CONTENTS_);
    return !a || 2 > a.length ? null : this.createTitleFromText(a[1], gdocs.MimeType.HTML)
};
gdocs.TitleComputer.prototype.createNoData_ = function(a, b, c) {
    var d = a.lastIndexOf("/");
    if (d + 1 == a.length) return c = this.createNoUrlDefaultTitle_(b, c), this.appendContentTypeExtension_(c, b);
    a = a.substr(d + 1);
    return 0 <= a.indexOf("?") || 0 == a.indexOf("&") ? (c = this.createNoUrlDefaultTitle_(b, c), this.appendContentTypeExtension_(c, b)) : this.createTitleFromText(decodeURI(a), b)
};
gdocs.TitleComputer.prototype.createNoUrlDefaultTitle_ = function(a, b) {
    return 0 == a.indexOf(gdocs.MimeType.PDF) ? chrome.i18n.getMessage("PDF_DEFAULT_FILENAME") : 0 == a.indexOf(gdocs.MimeType.HTML) ? chrome.i18n.getMessage("HTML_DEFAULT_FILENAME") : 0 == a.indexOf(gdocs.MimeType.XML) ? chrome.i18n.getMessage("XML_DEFAULT_FILENAME") : 0 == a.indexOf("text") ? chrome.i18n.getMessage("TEXT_DEFAULT_FILENAME") : 0 == a.indexOf("video") ? chrome.i18n.getMessage("VIDEO_DEFAULT_FILENAME") : 0 == a.indexOf("audio") ? chrome.i18n.getMessage("AUDIO_DEFAULT_FILENAME") :
        0 == a.indexOf("image") ? chrome.i18n.getMessage("IMAGE_DEFAULT_FILENAME") : b
};
gdocs.DataUriCapturer = function(a, b, c, d, e) {
    gdocs.Capturer.call(this, a, b, d, !0);
    this.uri_ = c;
    this.isDefaultFilename_ = e
};
goog.inherits(gdocs.DataUriCapturer, gdocs.Capturer);
gdocs.DataUriCapturer.DATA_URI_ = /^data:([^,]*),(.*)/i;
gdocs.DataUriCapturer.prototype.startCapture = function() {
    var a = this.uri_.match(gdocs.DataUriCapturer.DATA_URI_);
    a && 3 == a.length && a[2] || (gdlog.warn("DataUriCapturer.startCapture", "URI did not parse. URI:" + this.uri_ + " matches:" + gdlog.prettyPrint(a)), this.fatal(chrome.i18n.getMessage("DOWNLOAD_FAILURE_NO_DATA")));
    this.uploadDataUri_(a[1], a[2])
};
gdocs.DataUriCapturer.prototype.uploadDataUri_ = function(a, b) {
    for (var c = !1, d = gdocs.MimeType.PLAIN, e = a.split(";"), g = 0; g < e.length; g++) {
        var f = e[g] || "",
            f = f.toLowerCase();
        "base64" == f ? c = !0 : 0 != f.indexOf("charset=") && -1 != f.indexOf("/") && (d = f)
    }
    this.isDefaultFilename_ && (e = gdocs.msgutil.createBaseFilenameFromContentType(d), (e = (new gdocs.TitleComputer(gdocs.global.MAX_GENERATED_TITLE_LEN, gdocs.global.MAX_SUFFIX_LEN, !0)).createTitleFromText(e, d)) && this.setFilename(e));
    c = this.createDataUriBlob(b, c);
    this.uploadBlob(c,
        d)
};
gdocs.RedirectDetector = function(a) {
    this.seenEnoughData_ = !1;
    this.url_ = "";
    this.compute_(a)
};
gdocs.RedirectDetector.PREAMBLE_ = "<script>window.googleJavaScriptRedirect=1\x3c/script>";
gdocs.RedirectDetector.MAX_CONVERT_LEN_ = 2048;
gdocs.RedirectDetector.REDIRECT_SCRIPT_CONTENTS_ = /<script>window.googleJavaScriptRedirect=1<\/script>(<META [^>]*>)?<script>([^<>]*)<\/script>/;
gdocs.RedirectDetector.SEARCH_RESULT_URL_ = /.*\.navigateTo\(window\.parent,window,"([^"]+)"\).*/;
gdocs.RedirectDetector.prototype.hasEnoughData = function() {
    return this.seenEnoughData_
};
gdocs.RedirectDetector.prototype.getRedirectUrl = function() {
    return this.url_
};
gdocs.RedirectDetector.prototype.compute_ = function(a) {
    if (a && 0 != a.byteLength) {
        a = this.initialStr_(a);
        var b = Math.min(a.length, gdocs.RedirectDetector.PREAMBLE_.length),
            b = gdocs.RedirectDetector.PREAMBLE_.substr(0, b);
        0 != a.indexOf(b) ? (this.url_ = "", this.seenEnoughData_ = !0) : (a = a.match(gdocs.RedirectDetector.REDIRECT_SCRIPT_CONTENTS_)) && 0 != a.length ? (this.seenEnoughData_ = !0, this.extractUrl_(a[0])) : this.seenEnoughData_ = !1
    } else this.seenEnoughData_ = !1
};
gdocs.RedirectDetector.prototype.initialStr_ = function(a) {
    var b = Math.min(a.byteLength, gdocs.RedirectDetector.MAX_CONVERT_LEN_);
    a = new Uint8Array(a, 0, b);
    return String.fromCharCode.apply(null, a)
};
gdocs.RedirectDetector.prototype.extractUrl_ = function(a) {
    this.url_ = (a = a.match(gdocs.RedirectDetector.SEARCH_RESULT_URL_)) && 2 == a.length ? a[1] : ""
};
gdocs.UrlDownloader = function(a, b, c, d, e, g) {
    gdocs.DriveDataController.call(this, a, c, d, g);
    this.url_ = b;
    this.isDefaultFilename_ = e;
    this.contentType_ = this.computedFilename_ = "";
    this.numProgressEvents_ = this.percentage_ = 0;
    this.sentRedirect_ = !1
};
goog.inherits(gdocs.UrlDownloader, gdocs.DriveDataController);
goog.exportSymbol("gdocs.UrlDownloader", gdocs.UrlDownloader);
gdocs.UrlDownloader.LOAD_EVENT = "load";
gdocs.UrlDownloader.PROGRESS_EVENT = "progress";
gdocs.UrlDownloader.STRIP_TO_FINAL_SLASH_ = /.*\//;
gdocs.UrlDownloader.FILENAME_PARM_ = /;\s*filename=".*?([^/]+)"/;
gdocs.UrlDownloader.MAXIMUM_DOWNLOAD_SIZE_ = 52428800;
gdocs.UrlDownloader.MAX_TITLE_SEARCH_BYTES_ = 32768;
gdocs.UrlDownloader.prototype.updatePercent_ = function(a) {
    this.numProgressEvents_++;
    if (a.type == gdocs.UrlDownloader.LOAD_EVENT) this.markUploadDone_();
    else if (!(49 <= this.percentage_)) {
        a = a.lengthComputable ? 50 * a.loaded / a.total : this.percentage_ + this.decayingInc_();
        var b = Math.min(Math.floor(a), 49);
        b > this.percentage_ && this.setPercent(b);
        a > this.percentage_ && (this.percentage_ = a)
    }
};
gdocs.UrlDownloader.prototype.markUploadDone_ = function() {
    this.percentage_ = 50;
    this.setPercent(this.percentage_)
};
gdocs.UrlDownloader.prototype.decayingInc_ = function() {
    return 15 >= this.numProgressEvents_ ? 1 : 35 >= this.numProgressEvents_ ? .25 : 45 >= this.numProgressEvents_ ? .05 : .01
};
gdocs.UrlDownloader.prototype.startDownload = function(a) {
    0 == this.url_.indexOf("file://") ? chrome.extension.isAllowedFileSchemeAccess(goog.bind(this.handleAllowedAccess_, this, a)) : 0 != this.url_.indexOf("http://") && 0 != this.url_.indexOf("https://") ? this.fatal(chrome.i18n.getMessage("INVALID_URL", this.url_)) : this.beginDownload_(a)
};
gdocs.UrlDownloader.prototype.beginDownload_ = function(a) {
    a.addEventListener(gdocs.UrlDownloader.PROGRESS_EVENT, goog.bind(this.onProgress_, this), !1);
    a.addEventListener(gdocs.UrlDownloader.LOAD_EVENT, goog.bind(this.onLoad_, this), !1);
    a.open("GET", this.url_, !0);
    this.addRangeHeader_(a);
    a.responseType = "arraybuffer";
    try {
        console.log("this is where the xml is sent? has been resulting in 'file not found'");
        a.send()
    } catch (b) {
        this.fatal(chrome.i18n.getMessage("START_DOWNLOAD_EXCEPTION", b.toString()))
    }
};
gdocs.UrlDownloader.prototype.handleAllowedAccess_ = function(a, b) {
    b ? this.beginDownload_(a) : this.fatal(chrome.i18n.getMessage("ENABLE_FILE_URL"))
};
gdocs.UrlDownloader.prototype.addRangeHeader_ = function(a) {
    a.setRequestHeader("Range", "bytes=0-" + (0 + gdocs.UrlDownloader.MAXIMUM_DOWNLOAD_SIZE_ - 1))
};
gdocs.UrlDownloader.prototype.onProgress_ = function(a) {
    if (!this.hasFailed()) {
        var b = a.currentTarget;
        this.shouldStop_(b) ? b.abort() : this.isCancel() ? (this.fatal(chrome.i18n.getMessage("DOWNLOAD_CANCELED")), b.abort(), this.clearCancel()) : this.isTooLargeFatal_(b) ? b.abort() : 400 <= b.status ? this.fatal(chrome.i18n.getMessage("DOWNLOAD_FAILURE", gdocs.msgutil.createXhrErrMsg(b))) : (!this.computedFilename_ && this.isDefaultFilename_ && (b = this.createTitle_(b)) && (this.computedFilename_ = b, gdlog.fine("UrlDownloader.onProgress",
            "filename:" + this.computedFilename_), this.setFilename(this.computedFilename_)), this.updatePercent_(a))
    }
};
gdocs.UrlDownloader.prototype.onLoad_ = function(a) {
    if (!this.hasFailed())
        if (this.isCancel()) this.fatal(chrome.i18n.getMessage("DOWNLOAD_CANCELED")), this.clearCancel();
        else {
            var b = a.currentTarget;
            if (!this.shouldStop_(b) && !this.isTooLargeFatal_(b))
                if (200 == b.status || 206 == b.status || 0 == b.status && 0 == this.url_.indexOf("file://")) {
                    var c = this.getContentType_(b);
                    !this.computedFilename_ && this.isDefaultFilename_ && (this.computedFilename_ = this.createTitle_(b) || this.getFilename(), this.setFilename(this.computedFilename_));
                    this.updatePercent_(a);
                    a = new DataView(b.response);
                    a = this.createBlob(a);
                    this.uploadBlob(a, c)
                } else this.fatal(chrome.i18n.getMessage("DOWNLOAD_FAILURE", gdocs.msgutil.createXhrErrMsg(b)))
        }
};
gdocs.UrlDownloader.prototype.shouldStop_ = function(a) {
    if (0 != this.getContentType_(a).indexOf("text/html")) return !1;
    if (!this.sentRedirect_) {
        a = new gdocs.RedirectDetector(a.response);
        if (!a.hasEnoughData()) return !1;
        if (a = a.getRedirectUrl()) return this.startRedirect_(a), !0
    }
    a = chrome.i18n.getMessage("USE_BROWSER_ACTION_TITLE");
    var b = chrome.i18n.getMessage("USE_BROWSER_ACTION", this.url_);
    a = '<img class="use-browser-action-img" src="' + chrome.extension.getURL("images/savearrow.png") + '"><div class="use-browser-action-msg">  <div class="use-browser-action-title">' +
        a + '</div>  <div class="use-browser-action-body">' + b + "</div></div>";
    this.fatalHtml(a);
    return !0
};
gdocs.UrlDownloader.prototype.startRedirect_ = function(a) {
    this.sentRedirect_ = !0;
    this.url_ = a;
    this.contentType_ = this.computedFilename_ = "";
    this.numProgressEvents_ = 0;
    this.startDownload(new XMLHttpRequest)
};
gdocs.UrlDownloader.prototype.isTooLargeFatal_ = function(a) {
    a = a.getResponseHeader("Content-Range");
    if (!a) return !1;
    var b = a.replace(gdocs.UrlDownloader.STRIP_TO_FINAL_SLASH_, "");
    return b >= gdocs.UrlDownloader.MAXIMUM_DOWNLOAD_SIZE_ ? (gdlog.info("UrlDownloader.isTooLargeFatal", "Too large size:" + b + " contentRange:" + a), this.fatal(chrome.i18n.getMessage("DOWNLOAD_FAILURE_TOO_BIG_MB", Math.floor(b / 1048576).toString())), !0) : !1
};
gdocs.UrlDownloader.prototype.createTitle_ = function(a) {
    var b = this.getContentType_(a),
        c = !this.getAllowConvert() || !(b in gdocs.data.CONVERTIBLE),
        c = new gdocs.TitleComputer(gdocs.global.MAX_GENERATED_TITLE_LEN, gdocs.global.MAX_SUFFIX_LEN, c),
        d = this.getContentDisposition_(a);
    if (d) return c.createTitleFromText(d, b);
    d = "";
    if (a.response && 0 == b.indexOf(gdocs.MimeType.HTML))
        for (var e = new Uint8Array(a.response), g = Math.min(e.length, gdocs.UrlDownloader.MAX_TITLE_SEARCH_BYTES_), f = 0; f < g; f++) {
            var h = String.fromCharCode(e[f]),
                d = d + h;
            if (">" == h && 16 <= f && "</title>" == d.substr(f - 8 + 1, 8).toLowerCase()) break
        }
    return c.createDefaultTitle(this.url_, this.getFilename(), b, 4 == a.readyState, d)
};
gdocs.UrlDownloader.prototype.getContentDisposition_ = function(a) {
    return (a = a.getResponseHeader("Content-Disposition")) && (a = a.match(gdocs.UrlDownloader.FILENAME_PARM_)) && 1 < a.length && a[1] ? a[1] : null
};
gdocs.UrlDownloader.prototype.getContentType_ = function(a) {
    this.contentType_ || ((this.contentType_ = a.getResponseHeader("Content-Type")) ? this.contentType_ = this.contentType_.toLowerCase() : (this.contentType_ = gdocs.MimeType.OCTET_STREAM, gdlog.info("UrlDownloader.getContentType", "No Content-Type, using " + this.contentType_)));
    return this.contentType_
};
gdocs.UrlUploadParams = function(a, b) {
    gdocs.UploadParams.call(this, b);
    this.urlDownloader_ = a
};
goog.inherits(gdocs.UrlUploadParams, gdocs.UploadParams);
goog.exportSymbol("gdocs.UrlUploadParams", gdocs.UrlUploadParams);
gdocs.UrlUploadParams.prototype.getUrlDownloader = function() {
    return this.urlDownloader_
};
goog.exportProperty(gdocs.UrlUploadParams.prototype, "getUrlDownloader", gdocs.UrlUploadParams.prototype.getUrlDownloader);
gdocs.UrlUploadParams.prototype.isUploadOnly = function() {
    return !1
};
gdocs.DownloadStarter = {};
gdocs.DownloadStarter.startUrlDownload = function(a, b, c, d, e, g, f) {
    if (0 == b.toLowerCase().indexOf("data:")) return a = new gdocs.DataUriCapturer(a, c, b, g, f), a.startCapture(), new gdocs.CaptureUploadParams(a, e);
    a = new gdocs.UrlDownloader(a, b, c, g, f, d);
    a.startDownload(new XMLHttpRequest);
    return new gdocs.UrlUploadParams(a, e)
};
gdocs.HtmlScrapeCapturer = function(a, b, c) {
    gdocs.Capturer.call(this, a, b, gdocs.HtmlScrapeCapturer.createDefaultFilename_(b, c), !c);
    this.contentScript_ = c ? "js/contentscriptraw.js" : "js/contentscriptexpand.js";
    this.callback_ = null;
    this.toRawHtml_ = c
};
goog.inherits(gdocs.HtmlScrapeCapturer, gdocs.Capturer);
gdocs.HtmlScrapeCapturer.prototype.getAllowConvert = function() {
    return !this.toRawHtml_
};
gdocs.HtmlScrapeCapturer.createDefaultFilename_ = function(a, b) {
    return gdocs.Capturer.createFilenameFromTab(a, b ? ".html" : "")
};
gdocs.HtmlScrapeCapturer.prototype.startCapture = function() {
    this.callback_ = goog.bind(this.onMessageCallback_, this);
    this.callback_();
    //chrome.extension.onMessage.addListener(this.callback_);
    //chrome.tabs.executeScript(this.getTab().id, {
    //    file: this.contentScript_
    //})
};
gdocs.HtmlScrapeCapturer.prototype.onMessageCallback_ = function(a, b, c) {
    //chrome.extension.onMessage.removeListener(this.callback_);
    //gdlog.info("HtmlScrapeCapturer.onHtmlCallback_", "html length:" + a.length);
    (b = (new gdocs.TitleComputer(gdocs.global.MAX_GENERATED_TITLE_LEN, gdocs.global.MAX_SUFFIX_LEN, !this.getAllowConvert())).createFromHtml(a)) && this.setFilename(b);
    a = this.createBlob(a);
    this.uploadBlob(a, gdocs.MimeType.HTML)
};
gdocs.ImageCapturer = function(a, b) {
    gdocs.Capturer.call(this, a, b, gdocs.Capturer.createFilenameFromTab(b, ".txt"), !1);
    this.bg_ = a;
    this.hasDisplayedDialog_ = !1
};
goog.inherits(gdocs.ImageCapturer, gdocs.Capturer);
gdocs.ImageCapturer.prototype.startCapture = function() {
    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {
        format: "png"
    }, goog.bind(this.uploadImageUri, this))
};
gdocs.ImageCapturer.prototype.uploadImageUri = function(a) {
    this.displayDialog();
    if (a) {
        var b = a.indexOf(",");
        a = a.substr(b + 1);
        a = this.createDataUriBlob(a, !0);
        b = new gdocs.TitleComputer(gdocs.global.MAX_GENERATED_TITLE_LEN, gdocs.global.MAX_SUFFIX_LEN, !0);
        this.setFilename(b.createTitleFromText(this.getFilename(), gdocs.MimeType.PNG));
        this.uploadBlob(a, gdocs.MimeType.PNG)
    } else this.fatal(chrome.i18n.getMessage("IMAGE_CAPTURE_FAILED"))
};
gdocs.ImageCapturer.prototype.displayDialog = function() {
    this.hasDisplayedDialog_ || (this.bg_.displayWhenAuthorized(), this.hasDisplayedDialog_ = !0)
};
gdocs.ImageEntireCapturer = function(a, b, c) {
    gdocs.ImageCapturer.call(this, a, c);
    this.animatedBrowserIcon_ = b;
    this.canvas_ = document.createElement("canvas");
    this.context_ = this.canvas_.getContext("2d");
    this.ratio_ = window.devicePixelRatio;
    this.columnNum_ = this.rowNum_ = this.visibleHeight_ = this.visibleWidth_ = 0
};
goog.inherits(gdocs.ImageEntireCapturer, gdocs.ImageCapturer);
gdocs.ImageEntireCapturer.EMPTY_URI_LENGTH_ = 6;
gdocs.ImageEntireCapturer.prototype.startCapture = function() {
    chrome.tabs.executeScript(this.getTab().id, {
        file: "js/contentscriptscroll.js"
    }, goog.bind(this.initiateEntireCapture_, this));
    this.animatedBrowserIcon_.start()
};
gdocs.ImageEntireCapturer.prototype.initiateEntireCapture_ = function() {
    this.sendMessage_({
        msg: "init"
    }, goog.bind(this.processResponse_, this))
};
gdocs.ImageEntireCapturer.prototype.processResponse_ = function(a) {
    if (a) switch (gdlog.fine("ImageEntireCapturer.processResponse", "processResponse_:" + gdlog.prettyPrint(a)), a.msg) {
        case "initialized":
            this.canvas_.width = a.bodyScrollWidth;
            this.canvas_.height = a.bodyScrollHeight;
            if (this.canvas_.toDataURL("image/png").length <= gdocs.ImageEntireCapturer.EMPTY_URI_LENGTH_) {
                this.fatalCapture_(chrome.i18n.getMessage("PAGE_SIZE_NOT_SUPPORTED", this.canvas_.width + "x" + this.canvas_.height));
                break
            }
            this.visibleWidth_ = a.visibleWidth;
            this.visibleHeight_ = a.visibleHeight;
            this.columnNum_ = this.rowNum_ = 0;
            this.startStitch_();
            break;
        case "scrollToDone":
            this.startStitch_();
            break;
        case "endOfPage":
            a = this.canvas_.toDataURL("image/png"), this.animatedBrowserIcon_.stop(), this.uploadImageUri(a)
    } else gdlog.warn("ImageEntireCapturer.processResponse", "No response. lastError:" + gdlog.prettyPrint(chrome.extension.lastError)), this.fatalLastError_()
};
gdocs.ImageEntireCapturer.prototype.startStitch_ = function() {
    chrome.tabs.update(this.getTab().id, {
        active: !0
    }, goog.bind(this.captureVisibleAndContinue_, this))
};
gdocs.ImageEntireCapturer.prototype.captureVisibleAndContinue_ = function() {
    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {
        format: "png"
    }, goog.bind(this.stitchImageAndContinue_, this))
};
gdocs.ImageEntireCapturer.prototype.stitchImageAndContinue_ = function(a) {
    if (a) {
        var b = new Image;
        b.onload = goog.bind(this.handleImageOnLoad_, this);
        b.src = a
    } else gdlog.warn("ImageEntireCapturer.stitchImage", "Capture failure dataUrl:" + a + " lastError:" + gdlog.prettyPrint(chrome.extension.lastError)), this.fatalLastError_()
};
gdocs.ImageEntireCapturer.prototype.handleImageOnLoad_ = function(a) {
    if (a) {
        var b = 0,
            c = 0,
            d = 0,
            e = 0,
            g = 0,
            f = 0;
        (this.columnNum_ + 1) * this.visibleWidth_ > this.canvas_.width ? (b = this.canvas_.width % this.visibleWidth_, d = (this.columnNum_ + 1) * this.visibleWidth_ - this.canvas_.width) : b = this.visibleWidth_;
        (this.rowNum_ + 1) * this.visibleHeight_ > this.canvas_.height ? (c = this.canvas_.height % this.visibleHeight_, e = (this.rowNum_ + 1) * this.visibleHeight_ < this.canvas_.height ? 0 : (this.rowNum_ + 1) * this.visibleHeight_ - this.canvas_.height) :
            c = this.visibleHeight_;
        g = this.columnNum_ * this.visibleWidth_;
        f = this.rowNum_ * this.visibleHeight_;
        this.drawPixelsToDips_(a.target, d, e, g, f, b, c);
        this.columnNum_++;
        if (this.columnNum_ * this.visibleWidth_ >= this.canvas_.width && (this.rowNum_++, this.columnNum_ = 0, this.rowNum_ * this.visibleHeight_ >= this.canvas_.height)) {
            this.sendMessage_({
                msg: "restore"
            }, goog.bind(this.processResponse_, this));
            return
        }
        this.sendMessage_({
                msg: "scrollTo",
                x: this.columnNum_ * this.visibleWidth_,
                y: this.rowNum_ * this.visibleHeight_,
                capturePosition: this.getCornerPosition_()
            },
            goog.bind(this.processResponse_, this))
    } else gdlog.error("ImageEntireCapturer.handleImageOnLoad", "No image data")
};
gdocs.ImageEntireCapturer.prototype.drawPixelsToDips_ = function(a, b, c, d, e, g, f) {
    if (0 == this.rowNum_ && 0 == this.columnNum_) {
        1 == this.ratio_ || this.visibleWidth_ != a.width && this.visibleHeight_ != a.height || (this.ratio_ = 1);
        var h = 1 / this.ratio_;
        this.context_.scale(h, h)
    }
    var h = b * this.ratio_,
        n = c * this.ratio_,
        m = d * this.ratio_,
        p = e * this.ratio_,
        k = g * this.ratio_,
        l = f * this.ratio_;
    this.context_.drawImage(a, h, n, k, l, m, p, k, l);
    gdlog.info("ImageEntireCapturer.drawPixelsToDips", "row:" + this.rowNum_ + " column:" + this.columnNum_ + " visibleWidthxHeight:" +
        this.visibleWidth_ + "x" + this.visibleHeight_ + " devicePixelRatio:" + window.devicePixelRatio + " ratio:" + this.ratio_ + " imageWidthxHeight:" + a.width + "x" + a.height + " imageSize:" + a.src.length + " srcXxY:" + b + "x" + c + " dstXxY:" + d + "x" + e + " widthxheight:" + g + "x" + f + " pixelSrcXxY:" + h + "x" + n + " pixelDstXxY:" + m + "x" + p + " pixelWidthxHeight:" + k + "x" + l)
};
gdocs.ImageEntireCapturer.prototype.getCornerPosition_ = function() {
    var a = (this.columnNum_ + 1) * this.visibleWidth_ >= this.canvas_.width,
        b = (this.rowNum_ + 1) * this.visibleHeight_ >= this.canvas_.height;
    return 0 == this.rowNum_ && a ? "top_right" : 0 == this.columnNum_ && b ? "bottom_left" : a && b ? "bottom_right" : ""
};
gdocs.ImageEntireCapturer.prototype.sendMessage_ = function(a, b) {
    gdlog.fine("ImageEntireCapturer.sendMessage", gdlog.prettyPrint(a));
    chrome.tabs.sendMessage(this.getTab().id, a, b);
    chrome.extension.lastError && (gdlog.warn("ImageEntireCapturer.sendMessage", "chrome.tabs.sendMessage() failed. id:" + this.getTab().id + " lastError:" + gdlog.prettyPrint(chrome.extension.lastError) + "\nFailed sending message:\n" + gdlog.prettyPrint(a)), this.fatalLastError_())
};
gdocs.ImageEntireCapturer.prototype.fatalCapture_ = function(a) {
    this.animatedBrowserIcon_.stop();
    this.fatal(a);
    this.displayDialog()
};
gdocs.ImageEntireCapturer.prototype.fatalLastError_ = function() {
    chrome.extension.lastError && chrome.extension.lastError.message ? this.fatalCapture_(chrome.i18n.getMessage("IMAGE_CAPTURE_FAILED_REASON", chrome.extension.lastError.message)) : this.fatalCapture_(chrome.i18n.getMessage("IMAGE_CAPTURE_FAILED"))
};
gdocs.Notify = function(a, b, c) {
    this.title_ = b || chrome.i18n.getMessage("CHROME_EXTENSION_NAME");
    this.iconUrl_ = c || "images/driveicon128.png";
    this.body_ = a
};
gdocs.Notify.prototype.show = function() {
    chrome && chrome.notifications && chrome.notifications.create ? chrome.notifications.create("", {
        type: "basic",
        title: this.title_,
        message: this.body_,
        iconUrl: this.iconUrl_
    }, function(a) {}) : goog.global.webkitNotifications && goog.global.webkitNotifications.createNotification ? goog.global.webkitNotifications.createNotification(this.iconUrl_, this.title_, this.body_).show() : goog.global.console.log("Could not display notify message:" + this.body_)
};
gdocs.PageCapturer = function(a, b) {
    gdocs.Capturer.call(this, a, b, chrome.i18n.getMessage("MHTML_DEFAULT_FILENAME"), !1)
};
goog.inherits(gdocs.PageCapturer, gdocs.Capturer);
gdocs.PageCapturer.SUBJECT_ = /Subject:\s*(.*)/;
gdocs.PageCapturer.prototype.startCapture = function() {
    chrome.pageCapture.saveAsMHTML({
        tabId: this.getTab().id
    }, goog.bind(this.pageCapturedAsMhtml_, this))
};
gdocs.PageCapturer.prototype.pageCapturedAsMhtml_ = function(a) {
    if (chrome.extension.lastError) this.fatal(chrome.i18n.getMessage("FAILURE_PAGE_CAPTURE", String(chrome.extension.lastError)));
    else if (a) {
        var b = new FileReader;
        b.onloadend = goog.bind(this.onLoadEnd_, this, a);
        b.readAsText(a, "utf-16")
    } else this.fatal(chrome.i18n.getMessage("EMPTY_PAGE_CAPTURE"))
};
gdocs.PageCapturer.prototype.onLoadEnd_ = function(a, b) {
    if (b.target.readyState == FileReader.DONE) {
        var c = this.getTab() ? this.getTab().title : this.getFilename(),
            d = b.target.result.match(gdocs.PageCapturer.SUBJECT_);
        d && 1 < d.length && d[1] && (c = d[1]);
        (c = (new gdocs.TitleComputer(gdocs.global.MAX_GENERATED_TITLE_LEN, gdocs.global.MAX_SUFFIX_LEN, !this.getAllowConvert())).createTitleFromText(c, gdocs.MimeType.MHTML)) && this.setFilename(c);
        this.uploadBlob(a, gdocs.MimeType.MHTML)
    }
};
gdocs.BrowserAction = function(a) {
    this.bg_ = a;
    a = 1 < goog.global.devicePixelRatio ? 38 : 19;
    this.animatedBrowserIcon_ = new gdocs.AnimatedBrowserIcon("images/driveicon" + a + ".png", a, new gdocs.AnimatedBrowserIconParams)
};
gdocs.BrowserAction.prototype.initialize = function() {
    chrome.browserAction.setTitle({
        title: chrome.i18n.getMessage("SAVE_TO_GOOGLE_DRIVE_ACTION")
    });
    chrome.browserAction.onClicked.addListener(goog.bind(this.browserActionHandler_, this))
        console.log("THESE ARE THE THINGS BEING BOUND IN BG ALL");

    console.log(this.browserActionHandler_);
    console.log(this);
    //TODO here's first call when clicking browser button
};
gdocs.BrowserAction.prototype.processTab_ = function(a, b) {
    var c = !1,
        d;
    a = gdocs.ActionId.HTML;
    switch (a) {
        //case gdocs.ActionId.URL:
        //    d = gdocs.DownloadStarter.startUrlDownload(this.bg_, b.url, null, !1, gdocs.Impression.PAGE_ACTION_URL, chrome.i18n.getMessage("DEFAULT_FILENAME"), !0);
        //    break;
        //case gdocs.ActionId.HTML:
        case gdocs.ActionId.HTML:
            d = a == gdocs.ActionId.HTML;
            var e = new gdocs.HtmlScrapeCapturer(this.bg_, b, d);
            e.startCapture();
            d = new gdocs.CaptureUploadParams(e, d ? gdocs.Impression.PAGE_ACTION_HTML : gdocs.Impression.PAGE_ACTION_DOC);
            break;
        case gdocs.ActionId.IMAGE_ENTIRE:
            d = new gdocs.ImageEntireCapturer(this.bg_, this.animatedBrowserIcon_, b);
            d.startCapture();
            c = !0;
            d = new gdocs.CaptureUploadParams(d, gdocs.Impression.PAGE_ACTION_CAPTURE_IMAGE_ENTIRE);
            break;
        case gdocs.ActionId.IMAGE_VISIBLE:
            d = new gdocs.ImageCapturer(this.bg_, b);
            d.startCapture();
            c = !0;
            d = new gdocs.CaptureUploadParams(d, gdocs.Impression.PAGE_ACTION_CAPTURE_IMAGE_VISIBLE);
            break;
        case gdocs.ActionId.MHTML:
            d = new gdocs.PageCapturer(this.bg_, b);
            d.startCapture();
            d = new gdocs.CaptureUploadParams(d,
                gdocs.Impression.PAGE_ACTION_CAPTURE_MHTML);
            break;
        default:
            gdlog.warn("BrowserAction.processTabAction", 'Unsupported feature: "' + a + '"');
            return
    }
    c ? this.bg_.setUploadParams(d) : this.bg_.initiateUploadToDrive(d)
};
gdocs.BrowserAction.prototype.browserActionHandler_ = function(a) {
    a && (this.bg_.getTabContentType().isChromeInternalUrl(a) ? (new gdocs.Notify(chrome.i18n.getMessage("CANNOT_CAPTURE_CHROME"))).show() : this.processTab_(this.getDefaultActionId_(a), a))
};
gdocs.BrowserAction.prototype.getDefaultActionId_ = function(a) {
    if (this.bg_.getTabContentType().isDataUri(a) || this.bg_.getTabContentType().isFileUrl(a)) return gdocs.ActionId.URL;
    if (this.bg_.getTabContentType().isCached(a)) return this.bg_.getTabContentType().isDisplayingHtml(a) ? this.bg_.getOptions().getHtmlFormat() : gdocs.ActionId.URL;
    //gdlog.info("BrowserAction.getDefaultActionId", "Tab is not cached; refresh required after extension is installed. Entire image capture instead.");
    return gdocs.ActionId.IMAGE_ENTIRE
};
goog.debug = {};
goog.debug.Error = function(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, goog.debug.Error);
    else {
        var b = Error().stack;
        b && (this.stack = b)
    }
    a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    CDATA_SECTION: 4,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    PROCESSING_INSTRUCTION: 7,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    NOTATION: 12
};
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.Unicode = {
    NBSP: "\u00a0"
};
goog.string.startsWith = function(a, b) {
    return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
    var c = a.length - b.length;
    return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.caseInsensitiveEquals = function(a, b) {
    return a.toLowerCase() == b.toLowerCase()
};
goog.string.subs = function(a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) d += c.shift() + e.shift();
    return d + c.join("%s")
};
goog.string.collapseWhitespace = function(a) {
    return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
    return /^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
    return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
    return !/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
    return !/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
    return !/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
    return !/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
    return " " == a
};
goog.string.isUnicodeChar = function(a) {
    return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
    return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
    return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
    return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
    return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
    return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
    return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
    var c = String(a).toLowerCase(),
        d = String(b).toLowerCase();
    return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
    if (a == b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), g = 0; g < e; g++) {
        var f = c[g],
            h = d[g];
        if (f != h) return c = parseInt(f, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : f < h ? -1 : 1
    }
    return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
    return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
    return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
    return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
    if (b) a = a.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "&#101;"));
    else {
        if (!goog.string.ALL_RE_.test(a)) return a; - 1 != a.indexOf("&") && (a = a.replace(goog.string.AMP_RE_, "&amp;")); - 1 != a.indexOf("<") && (a = a.replace(goog.string.LT_RE_,
            "&lt;")); - 1 != a.indexOf(">") && (a = a.replace(goog.string.GT_RE_, "&gt;")); - 1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "&quot;")); - 1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;")); - 1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "&#0;"));
        goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "&#101;"))
    }
    return a
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(a) {
    return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesWithDocument = function(a, b) {
    return goog.string.contains(a, "&") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a, b) {
    var c = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"'
        },
        d;
    d = b ? b.createElement("div") : goog.global.document.createElement("div");
    return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, b) {
        var f = c[a];
        if (f) return f;
        if ("#" == b.charAt(0)) {
            var h = Number("0" + b.substr(1));
            isNaN(h) || (f = String.fromCharCode(h))
        }
        f || (d.innerHTML = a + " ", f = d.firstChild.nodeValue.slice(0, -1));
        return c[a] = f
    })
};
goog.string.unescapePureXmlEntities_ = function(a) {
    return a.replace(/&([^;]+);/g, function(a, c) {
        switch (c) {
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            case "quot":
                return '"';
            default:
                if ("#" == c.charAt(0)) {
                    var d = Number("0" + c.substr(1));
                    if (!isNaN(d)) return String.fromCharCode(d)
                }
                return a
        }
    })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
    return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.preserveSpaces = function(a) {
    return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP)
};
goog.string.stripQuotes = function(a, b) {
    for (var c = b.length, d = 0; d < c; d++) {
        var e = 1 == c ? b : b.charAt(d);
        if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1)
    }
    return a
};
goog.string.truncate = function(a, b, c) {
    c && (a = goog.string.unescapeEntities(a));
    a.length > b && (a = a.substring(0, b - 3) + "...");
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
    c && (a = goog.string.unescapeEntities(a));
    if (d && a.length > b) {
        d > b && (d = b);
        var e = a.length - d;
        a = a.substring(0, b - d) + "..." + a.substring(e)
    } else a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.specialEscapeChars_ = {
    "\x00": "\\0",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\x0B": "\\x0B",
    '"': '\\"',
    "\\": "\\\\"
};
goog.string.jsEscapeCache_ = {
    "'": "\\'"
};
goog.string.quote = function(a) {
    a = String(a);
    if (a.quote) return a.quote();
    for (var b = ['"'], c = 0; c < a.length; c++) {
        var d = a.charAt(c),
            e = d.charCodeAt(0);
        b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
    }
    b.push('"');
    return b.join("")
};
goog.string.escapeString = function(a) {
    for (var b = [], c = 0; c < a.length; c++) b[c] = goog.string.escapeChar(a.charAt(c));
    return b.join("")
};
goog.string.escapeChar = function(a) {
    if (a in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[a];
    if (a in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
    var b = a,
        c = a.charCodeAt(0);
    if (31 < c && 127 > c) b = a;
    else {
        if (256 > c) {
            if (b = "\\x", 16 > c || 256 < c) b += "0"
        } else b = "\\u", 4096 > c && (b += "0");
        b += c.toString(16).toUpperCase()
    }
    return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
    for (var b = {}, c = 0; c < a.length; c++) b[a.charAt(c)] = !0;
    return b
};
goog.string.contains = function(a, b) {
    return -1 != a.indexOf(b)
};
goog.string.caseInsensitiveContains = function(a, b) {
    return goog.string.contains(a.toLowerCase(), b.toLowerCase())
};
goog.string.countOf = function(a, b) {
    return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
    var d = a;
    0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
    return d
};
goog.string.remove = function(a, b) {
    var c = new RegExp(goog.string.regExpEscape(b), "");
    return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
    var c = new RegExp(goog.string.regExpEscape(b), "g");
    return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
    return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
    return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
    a = goog.isDef(c) ? a.toFixed(c) : String(a);
    c = a.indexOf("."); - 1 == c && (c = a.length);
    return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
    return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
    return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
    return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
    for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), g = Math.max(d.length, e.length), f = 0; 0 == c && f < g; f++) {
        var h = d[f] || "",
            n = e[f] || "",
            m = RegExp("(\\d*)(\\D*)", "g"),
            p = RegExp("(\\d*)(\\D*)", "g");
        do {
            var k = m.exec(h) || ["", "", ""],
                l = p.exec(n) || ["", "", ""];
            if (0 == k[0].length && 0 == l[0].length) break;
            var c = 0 == k[1].length ? 0 : parseInt(k[1], 10),
                q = 0 == l[1].length ? 0 : parseInt(l[1], 10),
                c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 ==
                    k[2].length, 0 == l[2].length) || goog.string.compareElements_(k[2], l[2])
        } while (0 == c)
    }
    return c
};
goog.string.compareElements_ = function(a, b) {
    return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
    for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
    return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
    return "goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
    var b = Number(a);
    return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.isLowerCamelCase = function(a) {
    return /^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
goog.string.isUpperCamelCase = function(a) {
    return /^([A-Z][a-z]*)+$/.test(a)
};
goog.string.toCamelCase = function(a) {
    return String(a).replace(/\-([a-z])/g, function(a, c) {
        return c.toUpperCase()
    })
};
goog.string.toSelectorCase = function(a) {
    return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
    var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
    return a.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
        return b + c.toUpperCase()
    })
};
goog.string.parseInt = function(a) {
    isFinite(a) && (a = String(a));
    return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.string.splitLimit = function(a, b, c) {
    a = a.split(b);
    for (var d = []; 0 < c && a.length;) d.push(a.shift()), c--;
    a.length && d.push(a.join(b));
    return d
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
    b.unshift(a);
    goog.debug.Error.call(this, goog.string.subs.apply(null, b));
    b.shift();
    this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(a) {
    throw a;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
    var e = "Assertion failed";
    if (c) var e = e + (": " + c),
        g = d;
    else a && (e += ": " + a, g = b);
    a = new goog.asserts.AssertionError("" + e, g || []);
    goog.asserts.errorHandler_(a)
};
goog.asserts.setErrorHandler = function(a) {
    goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = a)
};
goog.asserts.assert = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.fail = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
};
goog.asserts.assertNumber = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertString = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertFunction = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertObject = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertArray = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertBoolean = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertElement = function(a, b, c) {
    !goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
    !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
    return a
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
    for (var a in Object.prototype) goog.asserts.fail(a + " should not be enumerable in Object.prototype.")
};
gdocs.Client = function() {};
goog.exportSymbol("gdocs.Client", gdocs.Client);
gdocs.Client.prototype.sendRequest = function(a, b, c, d, e, g, f, h) {
    gdocs.Client.authAndSend_(a, b, c, d, e, !0, g, f, h)
};
gdocs.Client.prototype.sendRequestJson = function(a, b, c, d, e, g, f, h) {
    d["Content-Type"] = "application/json; charset=UTF-8";
    e = e ? JSON.stringify(e) : null;
    this.sendRequest(a, b, c, d, e, g, f, h)
};
gdocs.Client.authAndSend_ = function(a, b, c, d, e, g, f, h, n) {
    chrome.identity.getAuthToken({
        interactive: !0
    }, function(m) {
        if (chrome.runtime.lastError) gdlog.infoLastErr("Client.authAndSend", "getAuthToken"), h(chrome.runtime.lastError.message || "N/A");
        else {
            var p = n ? n : [gdocs.HttpStatus.OK],
                k = new XMLHttpRequest;
            k.onreadystatechange = function() {
                if (4 == k.readyState)
                    if (g && k.status == gdocs.HttpStatus.UNAUTHORIZED) gdlog.info("Client.authAndSend", "Retry. responseText:" + k.responseText + " errMsg:" + gdocs.msgutil.createXhrErrMsg(k)),
                        goog.asserts.assert(m), chrome.identity.removeCachedAuthToken({
                            token: m
                        }, function() {
                            gdocs.Client.authAndSend_(a, b, c, d, e, !1, f, h)
                        });
                    else if (-1 != p.indexOf(k.status)) f(k);
                else {
                    var l = gdocs.msgutil.createXhrErrMsg(k);
                    gdlog.info("Client.authAndSend", "responseText:" + k.responseText + " errMsg:" + l);
                    h(l)
                }
            };
            var l = b;
            c && (l += "?" + gdocs.Client.encodeParams_(c));
            k.open(a, l, !0);
            d.Authorization = "Bearer " + m;
            for (var q in d) k.setRequestHeader(q, d[q]);
            k.send(e)
        }
    })
};
gdocs.Client.encodeParams_ = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = encodeURIComponent(d) + "=" + encodeURIComponent(a[d]);
    return b.join("&")
};
gdocs.ContextMenu = {};
gdocs.ContextMenu.ContextType = {
    PAGE: "page",
    LINK: "link",
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio"
};
gdocs.ContextMenu.createMenus = function(a) {
    for (var b = [
            [gdocs.ContextMenu.ContextType.LINK, "SAVE_LINK"],
            [gdocs.ContextMenu.ContextType.IMAGE, "SAVE_IMAGE"],
            [gdocs.ContextMenu.ContextType.VIDEO, "SAVE_VIDEO"],
            [gdocs.ContextMenu.ContextType.AUDIO, "SAVE_AUDIO"]
        ], c = 0; c < b.length; c++) {
        var d = b[c];
        gdocs.ContextMenu.createMenu_(d[1], d[0], gdocs.ContextMenu.createMenuClickCallback_(a))
    }
};
gdocs.ContextMenu.createMenuClickCallback_ = function(a) {
    return function(b, c) {
        var d = gdocs.ContextMenu.getUserImpression_(b),
            e = gdocs.ContextMenu.getClickUrl_(b),
            g = gdocs.ContextMenu.createDefaultFilenameFromMediaType_(b),
            d = gdocs.DownloadStarter.startUrlDownload(a, e, c.tabId, !0, d, g, !0);
        a.initiateUploadToDrive(d)
    }
};
gdocs.ContextMenu.createMenu_ = function(a, b, c) {
    a = chrome.i18n.getMessage(a);
    c = chrome.contextMenus.create({
        title: a,
        contexts: [b],
        onclick: c
    });
    gdlog.info("ContextMenu.createMenu", "created ContextMenu context:" + b + ", returned id:" + c);
    return c
};
gdocs.ContextMenu.getClickUrl_ = function(a) {
    if (a.srcUrl) return a.srcUrl;
    if (a.linkUrl) return a.linkUrl;
    if (a.pageUrl) return a.pageUrl;
    if (a.frameUrl) return a.frameUrl;
    gdlog.warn("ContextMenu.getClickUrl", "Unsupported info:" + gdlog.prettyPrint(a));
    return ""
};
gdocs.ContextMenu.getUserImpression_ = function(a) {
    if (!a.mediaType) {
        if (a.linkUrl) return gdocs.Impression.LINK;
        gdlog.info("ContextMenu.getUserImpression", "No mediaType nor linkUrl");
        return gdocs.Impression.OTHER
    }
    switch (a.mediaType) {
        case "image":
            return gdocs.Impression.IMAGE;
        case "video":
            return gdocs.Impression.VIDEO;
        case "audio":
            return gdocs.Impression.AUDIO;
        default:
            return gdlog.info("ContextMenu.getUserImpression", "Unsupported mediaType:" + a.mediaType), gdocs.Impression.OTHER
    }
};
gdocs.ContextMenu.createDefaultFilenameFromMediaType_ = function(a) {
    return a.mediaType ? gdocs.msgutil.createBaseFilenameFromContentType(a.mediaType) : chrome.i18n.getMessage("DEFAULT_FILENAME")
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
    for (var d in a) b.call(c, a[d], d, a)
};
goog.object.filter = function(a, b, c) {
    var d = {},
        e;
    for (e in a) b.call(c, a[e], e, a) && (d[e] = a[e]);
    return d
};
goog.object.map = function(a, b, c) {
    var d = {},
        e;
    for (e in a) d[e] = b.call(c, a[e], e, a);
    return d
};
goog.object.some = function(a, b, c) {
    for (var d in a)
        if (b.call(c, a[d], d, a)) return !0;
    return !1
};
goog.object.every = function(a, b, c) {
    for (var d in a)
        if (!b.call(c, a[d], d, a)) return !1;
    return !0
};
goog.object.getCount = function(a) {
    var b = 0,
        c;
    for (c in a) b++;
    return b
};
goog.object.getAnyKey = function(a) {
    for (var b in a) return b
};
goog.object.getAnyValue = function(a) {
    for (var b in a) return a[b]
};
goog.object.contains = function(a, b) {
    return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = a[d];
    return b
};
goog.object.getKeys = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = d;
    return b
};
goog.object.getValueByKeys = function(a, b) {
    for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1; c < d.length && (a = a[d[c]], goog.isDef(a)); c++);
    return a
};
goog.object.containsKey = function(a, b) {
    return b in a
};
goog.object.containsValue = function(a, b) {
    for (var c in a)
        if (a[c] == b) return !0;
    return !1
};
goog.object.findKey = function(a, b, c) {
    for (var d in a)
        if (b.call(c, a[d], d, a)) return d
};
goog.object.findValue = function(a, b, c) {
    return (b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
    for (var b in a) return !1;
    return !0
};
goog.object.clear = function(a) {
    for (var b in a) delete a[b]
};
goog.object.remove = function(a, b) {
    var c;
    (c = b in a) && delete a[b];
    return c
};
goog.object.add = function(a, b, c) {
    if (b in a) throw Error('The object already contains the key "' + b + '"');
    goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
    return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
    a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
    return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
    var b = {},
        c;
    for (c in a) b[c] = a[c];
    return b
};
goog.object.unsafeClone = function(a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) return a.clone();
        var b = "array" == b ? [] : {},
            c;
        for (c in a) b[c] = goog.object.unsafeClone(a[c]);
        return b
    }
    return a
};
goog.object.transpose = function(a) {
    var b = {},
        c;
    for (c in a) b[a[c]] = c;
    return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
        d = arguments[e];
        for (c in d) a[c] = d[c];
        for (var g = 0; g < goog.object.PROTOTYPE_FIELDS_.length; g++) c = goog.object.PROTOTYPE_FIELDS_[g], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
};
goog.object.create = function(a) {
    var b = arguments.length;
    if (1 == b && goog.isArray(arguments[0])) return goog.object.create.apply(null, arguments[0]);
    if (b % 2) throw Error("Uneven number of arguments");
    for (var c = {}, d = 0; d < b; d += 2) c[arguments[d]] = arguments[d + 1];
    return c
};
goog.object.createSet = function(a) {
    var b = arguments.length;
    if (1 == b && goog.isArray(arguments[0])) return goog.object.createSet.apply(null, arguments[0]);
    for (var c = {}, d = 0; d < b; d++) c[arguments[d]] = !0;
    return c
};
goog.object.createImmutableView = function(a) {
    var b = a;
    Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
    return b
};
goog.object.isImmutableView = function(a) {
    return !!Object.isFrozen && Object.isFrozen(a)
};
gdocs.Options = function() {
    this.htmlFormat_ = gdocs.ActionId.IMAGE_ENTIRE;
    this.convertToGoogleFormat_ = !1;
    this.userFolderMap_ = {};
    chrome.storage.sync.get([gdocs.Options.StorageKeys_.HTML_FORMAT, gdocs.Options.StorageKeys_.CONVERT_TO_GOOGLE_FORMAT, gdocs.Options.StorageKeys_.USER_FOLDER_MAP], goog.bind(this.handleGetStorage_, this));
    chrome.storage.onChanged.addListener(goog.bind(this.handleStorageChange_, this))
};
goog.exportSymbol("gdocs.Options", gdocs.Options);
gdocs.Options.StorageKeys_ = {
    HTML_FORMAT: "htmlFormat",
    CONVERT_TO_GOOGLE_FORMAT: "convertToGoogleFormat",
    USER_FOLDER_MAP: "userFolderMap"
};
gdocs.Options.prototype.getHtmlFormat = function() {
    return this.htmlFormat_
};
gdocs.Options.prototype.setHtmlFormat = function(a) {
    this.htmlFormat_ = a;
    var b = {};
    b[gdocs.Options.StorageKeys_.HTML_FORMAT] = a;
    chrome.storage.sync.set(b)
};
goog.exportProperty(gdocs.Options.prototype, "setHtmlFormat", gdocs.Options.prototype.setHtmlFormat);
gdocs.Options.prototype.getConvertToGoogleFormat = function() {
    return this.convertToGoogleFormat_
};
gdocs.Options.prototype.setConvertToGoogleFormat = function(a) {
    this.convertToGoogleFormat_ = a;
    var b = {};
    b[gdocs.Options.StorageKeys_.CONVERT_TO_GOOGLE_FORMAT] = a;
    chrome.storage.sync.set(b)
};
gdocs.Options.prototype.addDestFolderInfo = function(a, b) {
    this.userFolderMap_[a] = b;
    var c = {};
    c[gdocs.Options.StorageKeys_.USER_FOLDER_MAP] = this.userFolderMap_;
    chrome.storage.sync.set(c)
};
gdocs.Options.prototype.getDestFolderInfo = function(a) {
    return (a = this.userFolderMap_[a]) ? a : null
};
gdocs.Options.prototype.handleGetStorage_ = function(a) {
    chrome.runtime.lastError ? gdlog.errorLastErr("Options.handleGetStorage", "Could not retrieve synchronized storage") : (a ? (a[gdocs.Options.StorageKeys_.HTML_FORMAT] && (this.htmlFormat_ = a[gdocs.Options.StorageKeys_.HTML_FORMAT]), a[gdocs.Options.StorageKeys_.CONVERT_TO_GOOGLE_FORMAT] && (this.convertToGoogleFormat_ = a[gdocs.Options.StorageKeys_.CONVERT_TO_GOOGLE_FORMAT]), a[gdocs.Options.StorageKeys_.USER_FOLDER_MAP] && (goog.object.extend(this.userFolderMap_,
        a[gdocs.Options.StorageKeys_.USER_FOLDER_MAP]), gdlog.info("Options.handleGetStorage", "userFolderMap:" + gdlog.prettyPrint(this.userFolderMap_)))) : ((a = window.localStorage[gdocs.Options.StorageKeys_.HTML_FORMAT]) && this.setConvertToGoogleFormat(a), a = window.localStorage[gdocs.Options.StorageKeys_.CONVERT_TO_GOOGLE_FORMAT], void 0 != a && this.setConvertToGoogleFormat("true" == a)), delete window.localStorage[gdocs.Options.StorageKeys_.HTML_FORMAT], delete window.localStorage[gdocs.Options.StorageKeys_.CONVERT_TO_GOOGLE_FORMAT])
};
gdocs.Options.prototype.handleStorageChange_ = function(a, b) {
    if ("sync" == b) {
        gdlog.fine("Options.handleStorageChange", gdlog.prettyPrint(a));
        for (var c in a) c == gdocs.Options.StorageKeys_.HTML_FORMAT ? (this.htmlFormat_ = a[c].newValue, gdlog.info("Options.handleStorageChange", "htmlFormat sync:" + this.htmlFormat_)) : c == gdocs.Options.StorageKeys_.CONVERT_TO_GOOGLE_FORMAT ? (this.convertToGoogleFormat_ = a[c].newValue, gdlog.info("Options.handleStorageChange", "convertToGoogleFormat sync:" + this.convertToGoogleFormat_)) :
            c == gdocs.Options.StorageKeys_.USER_FOLDER_MAP && (goog.object.extend(this.userFolderMap_, a[c].newValue), gdlog.info("Options.handleStorageChange", "userFolderMap sync:" + gdlog.prettyPrint(this.userFolderMap_)))
    }

    console.log("storage change...");




};
gdocs.TabContentType = function() {
    console.log("tabContentType function defined");
    this.tabContentType_ = {};
    chrome.tabs.onRemoved.addListener(goog.bind(this.removedCallback_, this));
    chrome.webRequest.onResponseStarted.addListener(goog.bind(this.responseStartedCallback_, this), {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    }, ["responseHeaders"])
};
gdocs.TabContentType.prototype.isCached = function(a) {
    var b = a.id;
    return this.tabContentType_[b] ? !0 : (gdlog.warn("TabContentType.isCached", "No cached contentType for tabId:" + b + " (" + a.title + "). Refresh tab"), !1)
};
gdocs.TabContentType.prototype.isChromeInternalUrl = function(a) {
    return false;
    //return 0 == a.url.indexOf("chrome://") || 0 == a.url.indexOf("chrome-devtools://") || 0 == a.url.indexOf("chrome-extension://") || 0 == a.url.indexOf("about:") || 0 == a.url.indexOf("view-source:") || 0 == a.url.indexOf("https://chrome.google.com/webstore/")
};
gdocs.TabContentType.prototype.isFileUrl = function(a) {
    return 0 == a.url.indexOf("file://")
};
gdocs.TabContentType.prototype.isDataUri = function(a) {
    return true;
    //return 0 == a.url.indexOf("data:")
};
gdocs.TabContentType.prototype.isDisplayingHtml = function(a) {
    return 0 == this.tabContentType_[a.id].indexOf("text/html")
};
gdocs.TabContentType.prototype.getContentType = function(a) {
    return this.tabContentType_[a.id]
};
gdocs.TabContentType.prototype.removedCallback_ = function(a, b) {
    this.tabContentType_[a] && delete this.tabContentType_[a]
};
gdocs.TabContentType.prototype.responseStartedCallback_ = function(a) {
    var b = a.responseHeaders;
    if (b) {
        for (var c, d = 0; d < b.length; d++) {
            var e = b[d];
            if ("content-type" == e.name.toLowerCase()) {
                c = e.value;
                break
            }
        }
        c && (a = a.tabId) && (this.tabContentType_[a] = c.toLowerCase())
    }
};
gdocs.DocList = function(a) {
    this.client_ = a
};
gdocs.DocList.MAJOR_VERSION_PATTERN_ = /\d+\.\d+/;
gdocs.DocList.MAJOR_VERSION_ = chrome.runtime.getManifest().version.match(gdocs.DocList.MAJOR_VERSION_PATTERN_)[0];
gdocs.DocList.X_USER_AGENT_ = "google-docschromeextension-" + gdocs.DocList.MAJOR_VERSION_;
gdocs.DocList.Feed = {
    ABOUT: "https://www.googleapis.com/drive/v2/about",
    FILES: "https://www.googleapis.com/drive/v2/files",
    UPLOAD: "https://www.googleapis.com/upload/drive/v2/files",
    USER_INFO: "https://www.googleapis.com/userinfo/v2/me"
};
gdocs.DocList.addHeaders = function(a) {
    a = a || {};
    a["X-User-Agent"] = gdocs.DocList.X_USER_AGENT_;
    return a
};
gdocs.DocList.prototype.loadMetadata = function(a, b) {
    this.client_.sendRequestJson("GET", gdocs.DocList.Feed.USER_INFO, {
        fields: "email"
    }, gdocs.DocList.addHeaders(), null, goog.bind(this.handleMetadataResults_, this, a), b)
};
gdocs.DocList.prototype.handleMetadataResults_ = function(a, b) {
    var c = JSON.parse(b.responseText);
    a(c.email)
};

gdocs.DocList.prototype.renameFile = function(a, b, c, d) {
    a = {
        title: a
    };
    this.client_.sendRequestJson("PUT", gdocs.DocList.Feed.FILES + "/" + b, {
        fileId: b
    }, gdocs.DocList.addHeaders(), a, c, d)
};
gdocs.DocList.prototype.trashFile = function(a, b, c) {
    this.client_.sendRequest("POST", gdocs.DocList.Feed.FILES + "/" + a + "/trash", {
        fileId: a
    }, gdocs.DocList.addHeaders(), null, b, c)
};
gdocs.UserId = function(a) {
    this.docList_ = new gdocs.DocList(a);
    this.currentId_ = "";
    this.seenGoogle_ = !1
};
goog.exportSymbol("gdocs.UserId", gdocs.UserId);
gdocs.UserId.GOOGLE_LC_SUFFIX_ = "@google.com";
gdocs.UserId.prototype.getUserIdStr = function(a) {
    this.currentId_ ? a(this.currentId_) : chrome.identity.getAuthToken({
        interactive: !1
    }, goog.bind(this.userIdAuth_, this, a))
};
goog.exportProperty(gdocs.UserId.prototype, "getUserIdStr", gdocs.UserId.prototype.getUserIdStr);
gdocs.UserId.prototype.isGoogle = function() {
    return this.seenGoogle_
};
goog.exportProperty(gdocs.UserId.prototype, "isGoogle", gdocs.UserId.prototype.isGoogle);
gdocs.UserId.prototype.userIdAuth_ = function(a, b) {
    chrome.runtime.lastError || !b ? a("") : this.docList_.loadMetadata(goog.bind(this.metadataCallback_, this, a), goog.bind(this.metadataFailure_, this, a))
};
gdocs.UserId.prototype.metadataCallback_ = function(a, b) {
    this.endsWith_(b, gdocs.UserId.GOOGLE_LC_SUFFIX_) && (this.seenGoogle_ = !0);
    this.currentId_ = b;
    a(this.currentId_)
};
gdocs.UserId.prototype.metadataFailure_ = function(a, b) {
    gdlog.warn("UserId", "Failure accessing metadata:" + b);
    a("")
};
gdocs.UserId.prototype.endsWith_ = function(a, b) {
    var c = a.length - b.length;
    return 0 > c ? !1 : -1 != a.toLowerCase().indexOf(b, c)
};
gdocs.BackgroundPage = function() {
    gdlog.info("BackgroundPage", "Creating background page extension version " + chrome.runtime.getManifest().version);
    this.client_ = new gdocs.Client;
    this.uploadParams_ = null;
    this.tabContentType_ = new gdocs.TabContentType;
    this.options_ = new gdocs.Options;
    this.browserAction_ = new gdocs.BrowserAction(this);
    this.browserAction_.initialize();
    this.userId_ = new gdocs.UserId(this.client_);
    gdocs.ContextMenu.createMenus(this)
};
goog.exportSymbol("gdocs.BackgroundPage", gdocs.BackgroundPage);
gdocs.BackgroundPage.prototype.getTabContentType = function() {
    return this.tabContentType_
};
gdocs.BackgroundPage.prototype.getUploadParams = function() {
    if (!this.uploadParams_) throw "uploadParams not set";
    return this.uploadParams_
};
goog.exportProperty(gdocs.BackgroundPage.prototype, "getUploadParams", gdocs.BackgroundPage.prototype.getUploadParams);
gdocs.BackgroundPage.prototype.getClient = function() {
    return this.client_
};
goog.exportProperty(gdocs.BackgroundPage.prototype, "getClient", gdocs.BackgroundPage.prototype.getClient);
gdocs.BackgroundPage.prototype.getOptions = function() {
    return this.options_
};
goog.exportProperty(gdocs.BackgroundPage.prototype, "getOptions", gdocs.BackgroundPage.prototype.getOptions);
gdocs.BackgroundPage.prototype.getLogLevel = function() {
    return gdlog.loglevel
};
goog.exportProperty(gdocs.BackgroundPage.prototype, "getLogLevel", gdocs.BackgroundPage.prototype.getLogLevel);
gdocs.BackgroundPage.prototype.showUploadDialog_ = function(a) {
    if (a) {
        a = gdocs.global.SAVE_DIALOG_SIZE.width;
        var b = gdocs.global.SAVE_DIALOG_SIZE.height;
        0 == navigator.platform.indexOf("Win") ? (a += 16, b += 39) : 0 <= navigator.userAgent.indexOf(" CrOS ") && (a += 0, b += 34);
        gdlog.infoLastErr("BackgroundPage.showUploadDialog", "Creating popup window wxh:" + a + "x" + b + " adjusted from " + gdocs.global.SAVE_DIALOG_SIZE);
        chrome.windows.create({
            url: chrome.extension.getURL("upload.html"),
            type: "popup",
            width: a,
            height: b
        })
    } else gdlog.warnLastErr("BackgroundPage.showUploadDialog",
        "OAuth 2 authorization failed"), (new gdocs.Notify(chrome.i18n.getMessage("AUTHORIZATION_NEEDED"))).show()
};
gdocs.BackgroundPage.prototype.initiateUploadToDrive = function(a) {
    this.setUploadParams(a);
    this.displayWhenAuthorized()
};
gdocs.BackgroundPage.prototype.setUploadParams = function(a) {
    gdlog.info("BackgroundPage.setUploadParams", "impression:" + a.getUserImpression());
    this.uploadParams_ = a
};
gdocs.BackgroundPage.prototype.displayWhenAuthorized = function() {
    gdlog.info("BackgroundPage.displayWhenAuthorized", "authorizing");
    chrome.identity.getAuthToken({
        interactive: !0
    }, goog.bind(this.showUploadDialog_, this))
};
gdocs.BackgroundPage.prototype.getUserId = function() {
    return this.userId_
};
goog.exportProperty(gdocs.BackgroundPage.prototype, "getUserId", gdocs.BackgroundPage.prototype.getUserId);
window.addEventListener("load", function() {
    chrome.extension.getBackgroundPage().bg = new gdocs.BackgroundPage;
    
}, !1);






