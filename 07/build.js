/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _rafLoop = __webpack_require__(/*! raf-loop */ 1);
	
	var _rafLoop2 = _interopRequireDefault(_rafLoop);
	
	var _controlkit = __webpack_require__(/*! controlkit */ 8);
	
	var _controlkit2 = _interopRequireDefault(_controlkit);
	
	var _glMat = __webpack_require__(/*! gl-mat4 */ 66);
	
	var _glMat2 = _interopRequireDefault(_glMat);
	
	var _glVec = __webpack_require__(/*! gl-vec3 */ 90);
	
	var _glVec2 = _interopRequireDefault(_glVec);
	
	var _mouse = __webpack_require__(/*! ./mouse */ 123);
	
	var _mouse2 = _interopRequireDefault(_mouse);
	
	var _MultiTriangles = __webpack_require__(/*! ./webgl/shapes/MultiTriangles */ 130);
	
	var _MultiTriangles2 = _interopRequireDefault(_MultiTriangles);
	
	var _Engine = __webpack_require__(/*! ./webgl/Engine */ 125);
	
	var _Engine2 = _interopRequireDefault(_Engine);
	
	var _Camera = __webpack_require__(/*! ./webgl/Camera */ 131);
	
	var _Camera2 = _interopRequireDefault(_Camera);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* ========================================================= *
	 * Global
	 * ========================================================= */
	var $canvas = document.querySelector('canvas');
	var params = {
	  tx: 0.0,
	  ty: 0.0,
	  tz: 0.0,
	  tRange: [-1, 1],
	  sx: 1.0,
	  sy: 1.0,
	  sz: 1.0,
	  sRange: [0, 5],
	  rx: 0.0,
	  ry: 0.0,
	  rz: 0.0,
	  rRange: [-Math.PI, Math.PI]
	};
	var engine = (0, _rafLoop2.default)(update);
	var transformMatrix = _glMat2.default.identity([]);
	var shape = void 0;
	
	/* ========================================================= *
	 * Main
	 * ========================================================= */
	onResize();
	window.addEventListener('resize', onResize);
	document.addEventListener('mousemove', onMouseMove);
	
	var camera = new _Camera2.default();
	camera.setEye(0.2, 0.25, 0.25);
	camera.setLookAt(0, 0, 0);
	camera.setUp(0, 1, 0);
	
	var webgl = new _Engine2.default($canvas);
	webgl.initContext();
	webgl.initProgram();
	webgl.bindAttributes(['a_Position', 'a_Color']);
	webgl.bindUniforms(['u_ViewMatrix', 'u_TransformMatrix']);
	webgl.gl.uniformMatrix4fv(webgl.uniforms['u_ViewMatrix'], false, camera.getViewMatrix());
	setTransformMatrix();
	webgl.gl.uniformMatrix4fv(webgl.uniforms['u_TransformMatrix'], false, transformMatrix);
	
	shape = new _MultiTriangles2.default(webgl.gl, webgl.attributes['a_Position'], webgl.attributes['a_Color']);
	
	// initGUI();
	engine.start();
	
	/* ========================================================= *
	 * Functions
	 * ========================================================= */
	function onResize() {
	  $canvas.width = window.innerHeight;
	  $canvas.height = window.innerHeight;
	}
	
	function onMouseMove(e) {
	  _mouse2.default.set(e.clientX, e.clientY);
	  var nMouse = _mouse2.default.getNormalizedCoords($canvas.width, $canvas.height);
	  camera.setEye(nMouse.x, nMouse.y, 0.25);
	}
	
	function setTransformMatrix() {
	  var out = [];
	  _glMat2.default.rotateX(out, _glMat2.default.identity([]), params.rx);
	  _glMat2.default.rotateY(out, out, params.ry);
	  _glMat2.default.rotateZ(out, out, params.rz);
	  _glMat2.default.scale(out, out, _glVec2.default.set([], params.sx, params.sy, params.sz));
	  _glMat2.default.translate(out, out, _glVec2.default.set([], params.tx, params.ty, params.tz));
	
	  transformMatrix = out;
	}
	
	function update() {
	  // Clear stage
	  webgl.clear();
	  // Update
	  setTransformMatrix();
	  webgl.gl.uniformMatrix4fv(webgl.uniforms['u_ViewMatrix'], false, camera.getViewMatrix());
	  webgl.gl.uniformMatrix4fv(webgl.uniforms['u_TransformMatrix'], false, transformMatrix);
	  // Draw
	  webgl.gl.drawArrays(shape.drawMode, 0, shape.verticeCount);
	}
	
	function initGUI() {
	  var gui = new _controlkit2.default();
	  gui.addPanel().addGroup({ label: 'Translation' }).addSlider(params, 'tx', 'tRange').addSlider(params, 'ty', 'tRange').addSlider(params, 'tz', 'tRange').addGroup({ label: 'Scale' }).addSlider(params, 'sx', 'sRange').addSlider(params, 'sy', 'sRange').addSlider(params, 'sz', 'sRange').addGroup({ label: 'Rotation' }).addSlider(params, 'rx', 'rRange').addSlider(params, 'ry', 'rRange').addSlider(params, 'rz', 'rRange');
	}

/***/ },
/* 1 */
/*!*****************************!*\
  !*** ./~/raf-loop/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(/*! inherits */ 2)
	var EventEmitter = __webpack_require__(/*! events */ 3).EventEmitter
	var now = __webpack_require__(/*! right-now */ 4)
	var raf = __webpack_require__(/*! raf */ 5)
	
	module.exports = Engine
	function Engine(fn) {
	    if (!(this instanceof Engine)) 
	        return new Engine(fn)
	    this.running = false
	    this.last = now()
	    this._frame = 0
	    this._tick = this.tick.bind(this)
	
	    if (fn)
	        this.on('tick', fn)
	}
	
	inherits(Engine, EventEmitter)
	
	Engine.prototype.start = function() {
	    if (this.running) 
	        return
	    this.running = true
	    this.last = now()
	    this._frame = raf(this._tick)
	    return this
	}
	
	Engine.prototype.stop = function() {
	    this.running = false
	    if (this._frame !== 0)
	        raf.cancel(this._frame)
	    this._frame = 0
	    return this
	}
	
	Engine.prototype.tick = function() {
	    this._frame = raf(this._tick)
	    var time = now()
	    var dt = time - this.last
	    this.emit('tick', dt)
	    this.last = time
	}

/***/ },
/* 2 */
/*!****************************************!*\
  !*** ./~/inherits/inherits_browser.js ***!
  \****************************************/
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 3 */
/*!****************************!*\
  !*** ./~/events/events.js ***!
  \****************************/
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 4 */
/*!********************************!*\
  !*** ./~/right-now/browser.js ***!
  \********************************/
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports =
	  global.performance &&
	  global.performance.now ? function now() {
	    return performance.now()
	  } : Date.now || function now() {
	    return +new Date
	  }
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/*!************************!*\
  !*** ./~/raf/index.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(/*! performance-now */ 6)
	  , root = typeof window === 'undefined' ? global : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = root['request' + suffix]
	  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]
	
	for(var i = 0; !raf && i < vendors.length; i++) {
	  raf = root[vendors[i] + 'Request' + suffix]
	  caf = root[vendors[i] + 'Cancel' + suffix]
	      || root[vendors[i] + 'CancelRequest' + suffix]
	}
	
	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60
	
	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }
	
	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}
	
	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  return raf.call(root, fn)
	}
	module.exports.cancel = function() {
	  caf.apply(root, arguments)
	}
	module.exports.polyfill = function() {
	  root.requestAnimationFrame = raf
	  root.cancelAnimationFrame = caf
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 6 */
/*!**************************************************!*\
  !*** ./~/performance-now/lib/performance-now.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.7.1
	(function() {
	  var getNanoSeconds, hrtime, loadTime;
	
	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }
	
	}).call(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./~/process/browser.js */ 7)))

/***/ },
/* 7 */
/*!******************************!*\
  !*** ./~/process/browser.js ***!
  \******************************/
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 8 */
/*!*******************************!*\
  !*** ./~/controlkit/index.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var ControlKit        = __webpack_require__(/*! ./lib/ControlKit */ 9);
		ControlKit.Canvas = __webpack_require__(/*! ./lib/component/Canvas */ 62);
		ControlKit.SVG    = __webpack_require__(/*! ./lib/component/SVG */ 63);
	
	module.exports = ControlKit;

/***/ },
/* 9 */
/*!****************************************!*\
  !*** ./~/controlkit/lib/ControlKit.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Node    = __webpack_require__(/*! ./core/document/Node */ 10),
	    Panel   = __webpack_require__(/*! ./group/Panel */ 11),
	    Options = __webpack_require__(/*! ./component/Options */ 43),
	    Picker  = __webpack_require__(/*! ./component/Picker */ 52);
	
	var CSS = __webpack_require__(/*! ./core/document/CSS */ 17);
	
	var EventDispatcher = __webpack_require__(/*! ./core/event/EventDispatcher */ 14),
	    Event_          = __webpack_require__(/*! ./core/event/Event */ 21),
	    DocumentEvent   = __webpack_require__(/*! ./core/document/DocumentEvent */ 18),
	    NodeEvent       = __webpack_require__(/*! ./core/document/NodeEvent */ 19),
	    ComponentEvent  = __webpack_require__(/*! ./core/ComponentEvent */ 25),
	    HistoryEvent    = __webpack_require__(/*! ./core/HistoryEvent */ 28),
	    MenuEvent       = __webpack_require__(/*! ./group/MenuEvent */ 41);
	
	var History = __webpack_require__(/*! ./core/History */ 27),
	    State   = __webpack_require__(/*! ./core/State */ 64);
	
	var Mouse   = __webpack_require__(/*! ./core/document/Mouse */ 20);
	
	var ValuePlotter = __webpack_require__(/*! ./component/ValuePlotter */ 33);
	var StringOutput = __webpack_require__(/*! ./component/StringOutput */ 61),
	    NumberOutput = __webpack_require__(/*! ./component/NumberOutput */ 59);
	
	var DEFAULT_HISTORY = false,
	    DEFAULT_OPACITY = 1.0,
	    DEFAULT_PANELS_CLOSABLE = false,
	    DEFAULT_ENABLE = true,
	    DEFAULT_LOAD_AND_SAVE = false;
	
	var DEFAULT_TRIGGER_SHORTCUT_CHAR = 'h';
	
	var initiated = false;
	
	/**
	 * Initializes ControlKit.
	 * @param {Object} [options] - ControlKit options
	 * @param {Number} [options.opacity=1.0] - Overall opacity
	 * @param {Boolean} [options.enable=true] - Initial ControlKit state, enabled / disabled
	 * @param {Boolean} [options.useExternalStyle=false] - If true, an external style is used instead of the build-in one
	 * @param {String} [options.styleString] - If true, an external style is used instead of the build-in one
	 * @param {Boolean}[options.history=false] - (Experimental) Enables a value history for all components
	 */
	function ControlKit(options) {
	    if(initiated){
	        throw new Error('ControlKit is already initialized.');
	    }
	    options                  = options || {};
	    options.history          = options.history === undefined ? DEFAULT_HISTORY : options.history;
	    options.loadAndSave      = options.loadAndSave === undefined ? DEFAULT_LOAD_AND_SAVE : options.loadAndSave;
	    options.opacity          = options.opacity === undefined ? DEFAULT_OPACITY : options.opacity;
	    options.panelsClosable   = options.panelsClosable === undefined ? DEFAULT_PANELS_CLOSABLE : options.panelsClosable;
	    options.useExternalStyle = options.useExternalStyle === undefined ? false : options.useExternalStyle;
	    options.enable           = options.enable === undefined ? DEFAULT_ENABLE : options.enable;
	
	    EventDispatcher.apply(this, arguments);
	
	    var node = null;
	    if (!options.parentDomElementId) {
	        node = new Node();
	        document.body.appendChild(node.getElement());
	    } else {
	        node = Node.getNodeById(options.parentDomElementId);
	    }
	
	    if(!options.useExternalStyle){
	        var style = document.createElement('style');
	            style.type = 'text/css';
	        var css = !options.style ? __webpack_require__(/*! ./core/document/Style */ 65).string : options.styleString;
	        if(style.stylesheet){
	            style.stylesheet.cssText = css;
	        } else {
	            style.appendChild(document.createTextNode(css));
	        }
	        (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
	    }
	
	    node.setProperty('id', CSS.ControlKit);
	
	    this._node = node;
	    this._panels = [];
	    this._enabled = options.enable;
	    this._historyEnabled = options.history;
	    this._statesEnabled = options.loadAndSave;
	    this._panelsClosable = options.panelsClosable;
	
	    var history = History.setup();
	
	    if (!this._historyEnabled){
	        history.disable();
	    } else {
	        history.addEventListener(HistoryEvent.STATE_PUSH, this, 'onHistoryStatePush');
	        history.addEventListener(HistoryEvent.STATE_POP, this, 'onHistoryStatePop');
	    }
	
	    Mouse.setup();
	    Picker.setup(node);
	    Options.setup(node);
	
	    var opacity = options.opacity;
	    if (opacity != 1.0 && opacity != 0.0) {
	        node.setStyleProperty('opacity', opacity);
	    }
	
	    this._canUpdate = true;
	
	    var self = this;
	
	    var interval,
	        count = 0,
	        countMax = 10;
	
	    window.addEventListener(DocumentEvent.WINDOW_RESIZE,function(){
	        self._canUpdate = false;
	        clearInterval(interval);
	        interval = setInterval(function(){
	            if(count >= countMax){
	                count = 0;
	                self._canUpdate = true;
	                clearInterval(interval);
	            }
	            count++;
	        },25)
	    });
	
	    this._shortcutEnable = DEFAULT_TRIGGER_SHORTCUT_CHAR;
	
	    document.addEventListener('keydown',function(e){
	        if(!(e.ctrlKey && String.fromCharCode(e.which || e.keyCode).toLowerCase() == self._shortcutEnable)){
	            return;
	        }
	        self._enabled = !self._enabled;
	        if(self._enabled){
	            self._enable();
	        } else {
	            self._disable();
	        }
	    });
	
	    if(!this._enabled){
	        this._disable();
	    }
	
	    initiated = true;
	}
	ControlKit.prototype = Object.create(EventDispatcher.prototype);
	ControlKit.prototype.constructor = ControlKit;
	
	/**
	 * Adds a panel.
	 * @param {Object} [params] - Panel options
	 * @param {String} [params.label='Control Panel'] - The panel label
	 * @param {Number} [params.width=300] - The width
	 * @param {Number} [params.height] - Constrained panel height
	 * @param {Number} [params.ratio=40] - The ratio of label (default:40%) and component (default:60%) width
	 * @param {String} [params.align='right'] - Float 'left' or 'right', multiple panels get aligned next to each other
	 * @param {Boolean} [params.fixed=true] - If false the panel can be moved
	 * @param {Array} [params.position=[0,0]] - If unfixed, the panel panel position relative to alignment (eg. if 'left' 0 + position[0] or if 'right' window.innerHeight - position[0] - panelWidth)
	 * @param {Number} [params.opacity=1.0] - The panel´s opacity
	 * @param {String} [params.dock=false] - (Experimental) Indicates whether the panel should be docked to either the left or right window border (depending on params.align), docked panels height equal window height
	  * @returns {Panel}
	 */
	ControlKit.prototype.addPanel = function (params) {
	    var panel = new Panel(this, params);
	    this._panels.push(panel);
	    return panel;
	};
	
	/**
	 * Updates all ControlKit components if the wat
	 */
	ControlKit.prototype.update = function () {
	    if (!this._enabled || !this._canUpdate){
	        return;
	    }
	    var i, j, k;
	    var l, m, n;
	    var panels = this._panels,
	        panel,
	        groups,
	        components,
	        component;
	
	    i = -1; l = panels.length;
	    while (++i < l) {
	        panel = panels[i];
	
	        if (panel.isDisabled()){
	            continue;
	        }
	        groups = panel.getGroups();
	        j = -1; m = groups.length;
	
	        while (++j < m) {
	            components = groups[j].getComponents();
	            k = -1; n = components.length;
	
	            while (++k < n) {
	                component = components[k];
	                if (component.isDisabled()){
	                    continue;
	                }
	                if (component instanceof ValuePlotter ||
	                    component instanceof StringOutput ||
	                    component instanceof NumberOutput) {
	                    component.update();
	                }
	            }
	        }
	    }
	};
	
	ControlKit.prototype.historyIsEnabled = function () {
	    return this._historyEnabled;
	};
	
	ControlKit.prototype.statesAreEnabled = function(){
	    return this._statesEnabled;
	};
	
	ControlKit.prototype.panelsAreClosable = function () {
	    return this._panelsClosable;
	};
	
	ControlKit.prototype._enable = function(){
	    var i = -1, p = this._panels, l = p.length;
	    while (++i < l){
	        p[i].enable();
	    }
	    this._node.setStyleProperty('visibility', '');
	};
	
	ControlKit.prototype._disable = function(){
	    var i = -1, p = this._panels, l = p.length;
	    while (++i < l){
	        p[i].disable();
	    }
	    this._node.setStyleProperty('visibility', 'hidden');
	};
	
	/**
	 * Enables and shows controlKit.
	 */
	
	ControlKit.prototype.enable = function () {
	    this._enable();
	    this._enabled = true;
	};
	
	/**
	 * Disable and hides controlKit.
	 */
	
	ControlKit.prototype.disable = function () {
	    this._disable();
	    this._enabled = false;
	};
	
	
	/**
	 * Specifies the key to be used with ctrl & char, to trigger ControlKits visibility.
	 * @param char
	 */
	
	ControlKit.prototype.setShortcutEnable = function(char){
	    this._shortcutEnable = char;
	};
	
	ControlKit.prototype.onHistoryStatePush = function () {
	    this.dispatchEvent(new Event_(this, MenuEvent.UPDATE_MENU, null));
	};
	
	ControlKit.prototype.onHistoryStatePop = function () {
	    this.dispatchEvent(new Event_(this, ComponentEvent.UPDATE_VALUE, {origin: null}));
	    this.dispatchEvent(new Event_(this, MenuEvent.UPDATE_MENU, null));
	};
	
	ControlKit.prototype.loadSettings = function(data){
	    var i = -1, l = data.length;
	    var panels = this._panels;
	    while(++i < l){
	        panels[i].setData(data[i]);
	    }
	};
	
	ControlKit.prototype._loadState = function(){
	    State.load(this.loadSettings.bind(this));
	};
	
	ControlKit.prototype._saveState = function(){
	    this.update(); //force sync
	    var p = this._panels, i = -1, l = p.length;
	    var data = new Array(l);
	    while(++i < l){
	        data[i] = p[i].getData();
	    }
	    State.save({data:data});
	};
	
	/**
	 * Returns the root element.
	 * @returns {*}
	 */
	
	ControlKit.prototype.getNode = function () {
	    return this._node;
	};
	
	ControlKit.destroy = function(){
	    Mouse.get().destroy();
	    Options.get().destroy();
	    Picker.get().destroy();
	    initiated = false;
	};
	
	module.exports = ControlKit;

/***/ },
/* 10 */
/*!************************************************!*\
  !*** ./~/controlkit/lib/core/document/Node.js ***!
  \************************************************/
/***/ function(module, exports) {

	function Node() {
	    this._element = null;
	
	    switch (arguments.length){
	        case 1 :
	            var arg = arguments[0];
	            if (arg != Node.INPUT_TEXT &&
	                arg != Node.INPUT_BUTTON &&
	                arg != Node.INPUT_SELECT &&
	                arg != Node.INPUT_CHECKBOX) {
	                this._element = document.createElement(arg);
	            }
	            else {
	                this._element = document.createElement('input');
	                this._element.type = arg;
	            }
	            break;
	        case 0:
	            this._element = document.createElement('div');
	            break;
	    }
	}
	
	Node.DIV            = 'div';
	Node.INPUT_TEXT     = 'text';
	Node.INPUT_BUTTON   = 'button';
	Node.INPUT_SELECT   = 'select';
	Node.INPUT_CHECKBOX = 'checkbox';
	Node.OPTION         = 'option';
	Node.LIST           = 'ul';
	Node.LIST_ITEM      = 'li';
	Node.SPAN           = 'span';
	Node.TEXTAREA       = 'textarea';
	
	Node.prototype = {
	    addChild: function (node) {
	        this._element.appendChild(node.getElement());
	        return node;
	    },
	    addChildren: function () {
	        var i = -1, l = arguments.length, e = this._element;
	        while (++i < l) {
	            e.appendChild(arguments[i].getElement());
	        }
	        return this;
	    },
	    addChildAt: function (node, index) {
	        this._element.insertBefore(node.getElement(), this._element.children[index]);
	        return node;
	    },
	    removeChild: function (node) {
	        if (!this.contains(node))return null;
	        this._element.removeChild(node.getElement());
	        return node;
	    },
	    removeChildren: function () {
	        var i = -1, l = arguments.length, e = this._element;
	        while (++i < l) {
	            e.removeChild(arguments[i].getElement());
	        }
	        return this;
	    },
	    removeChildAt: function (node, index) {
	        if (!this.contains(node))return null;
	        this._element.removeChild(node.getElement());
	        return node;
	    },
	    removeAllChildren: function () {
	        var element = this._element;
	        while (element.hasChildNodes())element.removeChild(element.lastChild);
	        return this;
	    },
	    setWidth: function (value) {
	        this._element.style.width = value + 'px';
	        return this;
	    },
	    getWidth: function () {
	        return this._element.offsetWidth;
	    },
	    setHeight: function (value) {
	        this._element.style.height = value + 'px';
	        return this;
	    },
	    getHeight: function () {
	        return this._element.offsetHeight;
	    },
	    setPosition: function (x, y) {
	        return this.setPosition(x).setPosition(y);
	    },
	    setPositionX: function (x) {
	        this._element.style.marginLeft = x + 'px';
	        return this;
	    },
	    setPositionY: function (y) {
	        this._element.style.marginTop = y + 'px';
	        return this;
	    },
	    setPositionGlobal: function (x, y) {
	        return this.setPositionGlobalX(x).setPositionGlobalY(y);
	    },
	    setPositionGlobalX: function (x) {
	        this._element.style.left = x + 'px';
	        return this;
	    },
	    setPositionGlobalY: function (y) {
	        this._element.style.top = y + 'px';
	        return this;
	    },
	    getPosition: function () {
	        return [this.getPositionX(), this.getPositionY()];
	    },
	    getPositionX: function () {
	        return this._element.offsetLeft;
	    },
	    getPositionY: function () {
	        return this._element.offsetTop;
	    },
	    getPositionGlobal: function () {
	        var offset = [0, 0],
	            element = this._element;
	
	        while (element) {
	            offset[0] += element.offsetLeft;
	            offset[1] += element.offsetTop;
	            element = element.offsetParent;
	        }
	
	        return offset;
	    },
	    getPositionGlobalX: function () {
	        var offset = 0,
	            element = this._element;
	
	        while (element) {
	            offset += element.offsetLeft;
	            element = element.offsetParent;
	        }
	
	        return offset;
	    },
	    getPositionGlobalY: function () {
	        var offset = 0,
	            element = this._element;
	
	        while (element) {
	            offset += element.offsetTop;
	            element = element.offsetParent;
	        }
	
	        return offset;
	    },
	    addEventListener: function (type, listener, useCapture) {
	        this._element.addEventListener(type, listener, useCapture);
	        return this;
	    },
	    removeEventListener: function (type, listener, useCapture) {
	        this._element.removeEventListener(type, listener, useCapture);
	        return this;
	    },
	    dispatchEvent : function(event) {
	        this._element.dispatchEvent(event);
	        return this;
	    },
	    setStyleClass: function (style) {
	        this._element.className = style;
	        return this;
	    },
	    setStyleProperty: function (property, value) {
	        this._element.style[property] = value;
	        return this;
	    },
	    getStyleProperty: function (property) {
	        return this._element.style[property];
	    },
	    setStyleProperties: function (properties) {
	        for (var p in properties){
	            this._element.style[p] = properties[p];
	        }
	        return this;
	    },
	    deleteStyleClass: function () {
	        this._element.className = '';
	        return this
	    },
	    deleteStyleProperty: function (property) {
	        this._element.style[property] = '';
	        return this;
	    },
	    deleteStyleProperties: function (properties) {
	        for (var p in properties){
	            this._element.style[p] = '';
	        }
	        return this;
	    },
	    getChildAt: function (index) {
	        return new Node().setElement(this._element.children[index]);
	    },
	    getChildIndex: function (node) {
	        return this._indexOf(this._element, node.getElement());
	    },
	    getNumChildren: function () {
	        return this._element.children.length;
	    },
	    getFirstChild: function () {
	        return new Node().setElement(this._element.firstChild);
	    },
	    getLastChild: function () {
	        return new Node().setElement(this._element.lastChild);
	    },
	    hasChildren: function () {
	        return this._element.children.length != 0;
	    },
	    contains: function (node) {
	        return this._indexOf(this._element, node.getElement()) != -1;
	    },
	    _indexOf: function (parentElement, element) {
	        return Array.prototype.indexOf.call(parentElement.children, element);
	    },
	    setProperty: function (property, value) {
	        this._element[property] = value;
	        return this;
	    },
	    setProperties: function (properties) {
	        for (var p in properties){
	            this._element[p] = properties[p];
	        }
	        return this;
	    },
	    getProperty: function (property) {
	        return this._element[property];
	    },
	    setElement: function (element) {
	        this._element = element;
	        return this;
	    },
	    getElement: function () {
	        return this._element;
	    },
	    getStyle: function () {
	        return this._element.style;
	    },
	    getParent: function () {
	        return new Node().setElement(this._element.parentNode);
	    }
	};
	
	Node.getNodeByElement = function (element) {
	    return new Node().setElement(element);
	};
	Node.getNodeById = function (id) {
	    return new Node().setElement(document.getElementById(id));
	};
	
	module.exports = Node;

/***/ },
/* 11 */
/*!*****************************************!*\
  !*** ./~/controlkit/lib/group/Panel.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Node      = __webpack_require__(/*! ../core/document/Node */ 10),
	    Group     = __webpack_require__(/*! ./Group */ 12),
	    ScrollBar = __webpack_require__(/*! ../core/layout/ScrollBar */ 15);
	
	var CSS        = __webpack_require__(/*! ../core/document/CSS */ 17);
	var LayoutMode = __webpack_require__(/*! ../core/layout/LayoutMode */ 40);
	var History    = __webpack_require__(/*! ../core/History */ 27);
	
	var EventDispatcher = __webpack_require__(/*! ../core/event/EventDispatcher */ 14),
	    Event_          = __webpack_require__(/*! ../core/event/Event */ 21),
	    DocumentEvent   = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    NodeEvent       = __webpack_require__(/*! ../core/document/NodeEvent */ 19),
	    PanelEvent      = __webpack_require__(/*! ./PanelEvent */ 23),
	    MenuEvent       = __webpack_require__(/*! ./MenuEvent */ 41);
	
	var Mouse = __webpack_require__(/*! ../core/document/Mouse */ 20);
	
	var StringInput     = __webpack_require__(/*! ../component/StringInput */ 42),
	    NumberInput     = __webpack_require__(/*! ../component/NumberInput */ 47),
	    Range           = __webpack_require__(/*! ../component/Range */ 49),
	    Checkbox        = __webpack_require__(/*! ../component/Checkbox */ 50),
	    Color           = __webpack_require__(/*! ../component/Color */ 51),
	    Button          = __webpack_require__(/*! ../component/Button */ 54),
	    Select          = __webpack_require__(/*! ../component/Select */ 55),
	    Slider          = __webpack_require__(/*! ../component/Slider */ 56),
	    FunctionPlotter = __webpack_require__(/*! ../component/FunctionPlotter */ 36),
	    Pad             = __webpack_require__(/*! ../component/Pad */ 58),
	    ValuePlotter    = __webpack_require__(/*! ../component/ValuePlotter */ 33),
	    NumberOutput    = __webpack_require__(/*! ../component/NumberOutput */ 59),
	    StringOutput    = __webpack_require__(/*! ../component/StringOutput */ 61),
	    Canvas_         = __webpack_require__(/*! ../component/Canvas */ 62),
	    SVG_            = __webpack_require__(/*! ../component/SVG */ 63);
	
	var DEFAULT_PANEL_POSITION = null,
	    DEFAULT_PANEL_WIDTH      = 200,
	    DEFAULT_PANEL_HEIGHT     = null,
	    DEFAULT_PANEL_WIDTH_MIN  = 100,
	    DEFAULT_PANEL_WIDTH_MAX  = 600,
	    DEFAULT_PANEL_RATIO      = 40,
	    DEFAULT_PANEL_LABEL      = 'Control Panel',
	    DEFAULT_PANEL_VALIGN     = LayoutMode.TOP,
	    DEFAULT_PANEL_ALIGN      = LayoutMode.RIGHT,
	    DEFAULT_PANEL_DOCK       = {align:LayoutMode.RIGHT,resizable:true},
	    DEFAULT_PANEL_ENABLE     = true,
	    DEFAULT_PANEL_OPACITY    = 1.0,
	    DEFAULT_PANEL_FIXED      = true,
	    DEFAULT_PANEL_VCONSTRAIN = true;
	
	function Panel(controlKit,params){
	    EventDispatcher.apply(this,arguments);
	    this._parent = controlKit;
	
	
	    params            = params           || {};
	    params.valign     = params.valign    || DEFAULT_PANEL_VALIGN;
	    params.align      = params.align     || DEFAULT_PANEL_ALIGN;
	    params.position   = params.position  || DEFAULT_PANEL_POSITION;
	    params.width      = params.width     || DEFAULT_PANEL_WIDTH;
	    params.height     = params.height    || DEFAULT_PANEL_HEIGHT;
	    params.ratio      = params.ratio     || DEFAULT_PANEL_RATIO;
	    params.label      = params.label     || DEFAULT_PANEL_LABEL;
	    params.opacity    = params.opacity   || DEFAULT_PANEL_OPACITY;
	    params.fixed      = params.fixed      === undefined ? DEFAULT_PANEL_FIXED      : params.fixed;
	    params.enable     = params.enable     === undefined ? DEFAULT_PANEL_ENABLE     : params.enable;
	    params.vconstrain = params.vconstrain === undefined ? DEFAULT_PANEL_VCONSTRAIN : params.vconstrain;
	
	    if (params.dock) {
	        params.dock.align = params.dock.align || DEFAULT_PANEL_DOCK.align;
	        params.dock.resizable = params.dock.resizable || DEFAULT_PANEL_DOCK.resizable;
	    }
	
	    this._width      = Math.max(DEFAULT_PANEL_WIDTH_MIN,
	                       Math.min(params.width,DEFAULT_PANEL_WIDTH_MAX));
	    this._height     = params.height ?  Math.max(0,Math.min(params.height,window.innerHeight)) : null;
	    this._fixed      = params.fixed;
	    this._dock       = params.dock;
	    this._position   = params.position;
	    this._vConstrain = params.vconstrain;
	    this._label      = params.label;
	    this._enabled    = params.enable;
	    this._groups     = [];
	
	
	    var width    = this._width,
	        isFixed  = this._fixed,
	        dock     = this._dock,
	        position = this._position,
	        label    = this._label,
	        align    = params.align,
	        opacity  = params.opacity;
	
	
	    var root = this._node     = new Node().setStyleClass(CSS.Panel),
	        head = this._headNode = new Node().setStyleClass(CSS.Head),
	        menu      = new Node().setStyleClass(CSS.Menu),
	        labelWrap = new Node().setStyleClass(CSS.Wrap),
	        label_    = new Node(Node.SPAN).setStyleClass(CSS.Label),
	        wrap = this._wrapNode = new Node(Node.DIV).setStyleClass(CSS.Wrap),
	        list = this._listNode = new Node(Node.LIST).setStyleClass(CSS.GroupList);
	
	    root.setWidth(width);
	    label_.setProperty('innerHTML', label);
	
	    labelWrap.addChild(label_);
	    head.addChild(menu);
	    head.addChild(labelWrap);
	    wrap.addChild(list);
	    root.addChild(head);
	    root.addChild(wrap);
	
	    controlKit.getNode().addChild(root);
	
	
	    if (!dock) {
	        var menuHide = this._menuHide = new Node(Node.INPUT_BUTTON);
	            menuHide.setStyleClass(CSS.ButtonMenuHide);
	            menuHide.addEventListener(NodeEvent.MOUSE_DOWN, this._onMenuHideMouseDown.bind(this));
	
	        menu.addChild(menuHide);
	
	        if (this._parent.panelsAreClosable()) {
	            var menuClose = new Node(Node.INPUT_BUTTON);
	            menuClose.setStyleClass(CSS.ButtonMenuClose);
	            menuClose.addEventListener(NodeEvent.MOUSE_DOWN, this.disable.bind(this));
	
	            menu.addChild(menuClose);
	        }
	
	
	        if (this.hasMaxHeight()) {
	            this._addScrollWrap();
	        }
	
	        if (!isFixed) {
	            if (position) {
	                if (align == LayoutMode.LEFT ||
	                    align == LayoutMode.TOP ||
	                    align == LayoutMode.BOTTOM) {
	                    root.setPositionGlobal(position[0], position[1]);
	                }
	                else {
	                    root.setPositionGlobal(window.innerWidth - width - position[0], position[1]);
	                    this._position = root.getPosition();
	                }
	            }
	            else this._position = root.getPosition();
	
	            this._mouseOffset = [0, 0];
	
	            root.setStyleProperty('position', 'absolute');
	            head.addEventListener(NodeEvent.MOUSE_DOWN, this._onHeadDragStart.bind(this));
	        }
	        else {
	            if (position) {
	                var positionX = position[0],
	                    positionY = position[1];
	
	                if (positionY != 0)root.setPositionY(positionY);
	                if (positionX != 0)if (align == LayoutMode.RIGHT)root.getElement().marginRight = positionX;
	                else root.setPositionX(positionX);
	            }
	
	            root.setStyleProperty('float', align);
	        }
	    }
	    else {
	        var dockAlignment = dock.align;
	
	        if (dockAlignment == LayoutMode.LEFT ||
	            dockAlignment == LayoutMode.RIGHT) {
	            align = dockAlignment;
	            this._height = window.innerHeight;
	        }
	
	        if (dockAlignment == LayoutMode.TOP ||
	            dockAlignment == LayoutMode.BOTTOM) {
	
	        }
	
	        /*
	         if(dock.resizable)
	         {
	         var sizeHandle = new ControlKit.Node(ControlKit.NodeType.DIV);
	         sizeHandle.setStyleClass(ControlKit.CSS.SizeHandle);
	         rootNode.addChild(sizeHandle);
	         }
	         */
	
	        root.setStyleProperty('float', align);
	    }
	
	    var parent = this._parent;
	    var historyIsEnabled = parent.historyIsEnabled(),
	        statesAreEnabled = parent.statesAreEnabled();
	
	    if(historyIsEnabled || statesAreEnabled){
	        menu.addChildAt(new Node(),0).setStyleClass(CSS.Wrap);//.setStyleProperty('display','none');
	    }
	
	    if (historyIsEnabled) {
	        this._menuUndo = menu.getChildAt(0)
	            .addChild(new Node(Node.INPUT_BUTTON))
	                .setStyleClass(CSS.ButtonMenuUndo)
	                .setProperty('value',History.get().getNumStates())
	                .addEventListener(NodeEvent.MOUSE_DOWN,function(){
	                    History.get().popState();
	                });
	        parent.addEventListener(MenuEvent.UPDATE_MENU,this, 'onUpdateMenu');
	    }
	    if(statesAreEnabled){
	        menu.getChildAt(0)
	            .addChild(new Node(Node.INPUT_BUTTON))
	                .setStyleClass(CSS.ButtonMenuLoad)
	                .setProperty('value','Load')
	                .addEventListener(NodeEvent.MOUSE_DOWN,function(){
	                    controlKit._loadState();
	                });
	        menu.getChildAt(0)
	            .addChild(new Node(Node.INPUT_BUTTON))
	                .setStyleClass(CSS.ButtonMenuSave)
	                .setProperty('value','Save')
	                .addEventListener(NodeEvent.MOUSE_DOWN,function(){
	                    controlKit._saveState();
	                });
	    }
	    if(historyIsEnabled || statesAreEnabled){
	        head.addEventListener(NodeEvent.MOUSE_OVER,function(){
	            menu.setStyleClass(CSS.MenuActive);
	        });
	        head.addEventListener(NodeEvent.MOUSE_OUT,function(){
	            menu.setStyleClass(CSS.Menu);
	        });
	    }
	    if (opacity != 1.0 && opacity != 0.0) {
	        root.setStyleProperty('opacity', opacity);
	    }
	    window.addEventListener(DocumentEvent.WINDOW_RESIZE,this._onWindowResize.bind(this));
	    this._updateAppearance();
	}
	Panel.prototype = Object.create(EventDispatcher.prototype);
	Panel.prototype.constructor = Panel;
	
	Panel.prototype._onMenuHideMouseDown = function () {
	    this._enabled = !this._enabled;
	    this._updateAppearance();
	};
	
	Panel.prototype.onUpdateMenu = function () {
	    this._menuUndo.setProperty('value', History.get().getNumStates());
	};
	
	Panel.prototype._onMenuUndoTrigger = function () {
	    History.get().popState();
	};
	
	
	Panel.prototype._updateAppearance = function () {
	    var rootNode = this._node,
	        headNode = this._headNode,
	        menuHide = this._menuHide;
	
	    if (!this._enabled) {
	        headNode.getStyle().borderBottom = 'none';
	        rootNode.setHeight(headNode.getHeight());
	        menuHide.setStyleClass(CSS.ButtonMenuShow);
	        this.dispatchEvent(new Event_(this, PanelEvent.PANEL_HIDE, null));
	    }
	    else {
	        rootNode.setHeight(headNode.getHeight() + this._wrapNode.getHeight());
	        rootNode.deleteStyleProperty('height');
	        menuHide.setStyleClass(CSS.ButtonMenuHide);
	        headNode.setStyleClass(CSS.Head);
	        this.dispatchEvent(new Event_(this, PanelEvent.PANEL_SHOW, null));
	    }
	};
	
	Panel.prototype._onHeadDragStart = function(){
	    var parentNode = this._parent.getNode(),
	        node       = this._node;
	
	    var nodePos   = node.getPositionGlobal(),
	        mousePos  = Mouse.get().getPosition(),
	        offsetPos = this._mouseOffset;
	
	        offsetPos[0] = mousePos[0] - nodePos[0];
	        offsetPos[1] = mousePos[1] - nodePos[1];
	
	    var eventMouseMove = DocumentEvent.MOUSE_MOVE,
	        eventMouseUp   = DocumentEvent.MOUSE_UP;
	
	    var self = this;
	
	    var onDrag = function () {
	            self._updatePosition();
	        },
	        onDragEnd = function () {
	            document.removeEventListener(eventMouseMove, onDrag, false);
	            document.removeEventListener(eventMouseUp, onDragEnd, false);
	            self.dispatchEvent(new Event_(this, PanelEvent.PANEL_MOVE_END, null));
	        };
	
	    parentNode.removeChild(node);
	    parentNode.addChild(   node);
	
	    document.addEventListener(eventMouseMove, onDrag,    false);
	    document.addEventListener(eventMouseUp,   onDragEnd, false);
	
	    this.dispatchEvent(new Event_(this,PanelEvent.PANEL_MOVE_BEGIN,null));
	};
	
	Panel.prototype._updatePosition = function () {
	    var mousePos = Mouse.get().getPosition(),
	        offsetPos = this._mouseOffset;
	
	    var position = this._position;
	    position[0] = mousePos[0] - offsetPos[0];
	    position[1] = mousePos[1] - offsetPos[1];
	
	    this._constrainHeight();
	    this._constrainPosition();
	
	    this.dispatchEvent(new Event_(this, PanelEvent.PANEL_MOVE, null));
	};
	
	Panel.prototype._onWindowResize = function () {
	    if (this.isDocked()) {
	        var dock = this._dock;
	
	        if (dock.align == LayoutMode.RIGHT ||
	            dock.align == LayoutMode.LEFT) {
	            var windowHeight = window.innerHeight,
	                listHeight = this._listNode.getHeight(),
	                headHeight = this._headNode.getHeight();
	
	            this._height = windowHeight;
	
	            if ((windowHeight - headHeight) > listHeight){
	                this._scrollBar.disable();
	            }
	            else{
	                this._scrollBar.enable();
	            }
	
	            this.dispatchEvent(new Event_(this, PanelEvent.PANEL_SIZE_CHANGE));
	        }
	    }
	    else {
	        if (!this.isFixed()){
	            this._constrainPosition();
	        }
	    }
	    this._constrainHeight();
	    this.dispatchEvent(new Event_(this, DocumentEvent.WINDOW_RESIZE));
	};
	
	Panel.prototype._constrainPosition = function () {
	    var node = this._node;
	
	    var maxX = window.innerWidth - node.getWidth(),
	        maxY = window.innerHeight - node.getHeight();
	
	    var position = this._position;
	    position[0] = Math.max(0, Math.min(position[0], maxX));
	    position[1] = Math.max(0, Math.min(position[1], maxY));
	
	    node.setPositionGlobal(position[0], position[1]);
	};
	
	Panel.prototype._constrainHeight = function () {
	    if (!this._vConstrain)return;
	
	    var hasMaxHeight = this.hasMaxHeight(),
	        hasScrollWrap = this.hasScrollWrap();
	
	    var head = this._headNode,
	        wrap = this._wrapNode;
	
	    var scrollBar = this._scrollBar;
	
	    var panelTop = this.isDocked() ? 0 :
	        this.isFixed() ? 0 :
	            this._position[1];
	
	    var panelHeight = hasMaxHeight ? this.getMaxHeight() :
	        hasScrollWrap ? scrollBar.getTargetNode().getHeight() :
	            wrap.getHeight();
	
	    var panelBottom = panelTop + panelHeight;
	    var headHeight = head.getHeight();
	
	    var windowHeight = window.innerHeight,
	        heightDiff = windowHeight - panelBottom - headHeight,
	        heightSum;
	
	    if (heightDiff < 0.0) {
	        heightSum = panelHeight + heightDiff;
	
	        if (!hasScrollWrap) {
	            this._addScrollWrap(heightSum);
	            this.dispatchEvent(new Event_(this, PanelEvent.PANEL_SCROLL_WRAP_ADDED, null));
	            return;
	        }
	
	        scrollBar.setWrapHeight(heightSum);
	        wrap.setHeight(heightSum);
	    }
	    else {
	        if (!hasMaxHeight && hasScrollWrap) {
	            scrollBar.removeFromParent();
	            wrap.addChild(this._listNode);
	            wrap.deleteStyleProperty('height');
	            this._scrollBar.removeMouseListener();
	            this._scrollBar = null;
	
	            this.dispatchEvent(new Event_(this, PanelEvent.PANEL_SCROLL_WRAP_REMOVED, null));
	        }
	    }
	};
	
	Panel.prototype.onGroupListSizeChange = function () {
	    if (this.hasScrollWrap()){
	        this._updateScrollWrap();
	    }
	    this._constrainHeight();
	};
	
	Panel.prototype._updateScrollWrap = function () {
	    var wrap   = this._wrapNode,
	        scrollBar  = this._scrollBar,
	        height     = this.hasMaxHeight() ? this.getMaxHeight() : 100,
	        listHeight = this._listNode.getHeight();
	
	    wrap.setHeight(listHeight < height ? listHeight : height);
	
	    scrollBar.update();
	
	    if (!scrollBar.isValid()) {
	        scrollBar.disable();
	        wrap.setHeight(wrap.getChildAt(1).getHeight());
	    }
	    else {
	        scrollBar.enable();
	        wrap.setHeight(height);
	    }
	};
	
	Panel.prototype._addScrollWrap = function () {
	    var wrapNode = this._wrapNode,
	        listNode = this._listNode,
	        height = arguments.length == 0 ?
	            this.getMaxHeight() :
	            arguments[0];
	
	    this._scrollBar = new ScrollBar(wrapNode, listNode, height);
	    if (this.isEnabled()){
	        wrapNode.setHeight(height);
	    }
	};
	
	Panel.prototype.hasScrollWrap = function () {
	    return this._scrollBar != null;
	};
	
	
	Panel.prototype.preventSelectDrag = function () {
	    if (!this.hasScrollWrap()){
	        return;
	    }
	    this._wrapNode.getElement().scrollTop = 0;
	};
	
	Panel.prototype.enable = function () {
	    this._node.setStyleProperty('display', 'block');
	    this._enabled = true;
	    this._updateAppearance();
	};
	
	
	Panel.prototype.disable = function () {
	    this._node.setStyleProperty('display', 'none');
	    this._enabled = false;
	    this._updateAppearance();
	};
	
	Panel.prototype.isEnabled = function () {
	    return this._enabled;
	};
	
	Panel.prototype.isDisabled = function () {
	    return !this._enabled;
	};
	
	Panel.prototype.hasMaxHeight = function () {
	    return this._height != null;
	};
	
	Panel.prototype.getMaxHeight = function () {
	    return this._height;
	};
	
	Panel.prototype.isDocked = function () {
	    return this._dock;
	};
	
	Panel.prototype.isFixed = function () {
	    return this._fixed;
	};
	
	Panel.prototype.getGroups = function () {
	    return this._groups;
	};
	
	Panel.prototype.getNode = function () {
	    return this._node;
	};
	
	Panel.prototype.getList = function () {
	    return this._listNode;
	};
	
	Panel.prototype.getWidth = function () {
	    return this._width;
	};
	
	Panel.prototype.getPosition = function () {
	    return this._position;
	};
	
	Panel.prototype.getParent = function(){
	    return this._parent;
	};
	
	/**
	 * Adds a new Group to the Panel.
	 * @param {Object} [params] - Group options
	 * @param {String} [params.label=''] - The Group label string
	 * @param {Boolean} [params.useLabel=true] - Trigger whether all contained SubGroups and Components should use labels
	 * @param {Boolean} [params.enable=true] - Defines initial state open / closed
	 * @param {Number} [params.height=null] - Defines if the height of the Group should be constrained to certain height
	 * @returns {Panel}
	 */
	
	Panel.prototype.addGroup = function (params) {
	    var group = new Group(this, params);
	    this._groups.push(group);
	    if (this.isDocked()){
	        this.dispatchEvent(new Event_(this, PanelEvent.PANEL_SIZE_CHANGE));
	    }
	    return this;
	};
	
	/**
	 * Adds a new SubGroup to the last added Group.
	 * @param {Object} [params] - SubGroup options
	 * @param {String} [params.label=''] - The SubGroup label string
	 * @param {Boolean} [params.useLabel=true] - Trigger whether all Components should use labels
	 * @param {Boolean} [params.enable=true] - Defines initial state open / closed
	 * @param {Number} [params.height=null] - Defines if the height of the SubGroup should be constrained to certain height
	 * @returns {Panel}
	 */
	
	Panel.prototype.addSubGroup = function(params){
	    var groups = this._groups;
	    if(groups.length == 0){
	        this.addGroup();
	    }
	    groups[groups.length - 1].addSubGroup(params);
	    return this;
	};
	
	Panel.prototype._addComponent = function(){
	    var groups = this._groups,
	        group;
	    if(groups.length == 0){
	        groups.push(new Group(this));
	    }
	    group = groups[groups.length-1];
	
	    group.addComponent.apply(group,arguments);
	    return this;
	};
	
	/**
	 * Adds a new StringInput to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {Object} [params] - StringInput options
	 * @param {String} [params.label=value] - StringInput label
	 * @param {Function} [params.onChange] - Callback on change
	 * @param {Array} [params.presets] - A set of presets
	 * @returns {Panel}
	 */
	
	Panel.prototype.addStringInput = function (object, value, params) {
	    return this._addComponent(StringInput,object,value,params);
	};
	
	/**
	 * Adds a new NumberInput to last added SubGroup.
	 * @param {Object} object - The object.
	 * @param {String} value - The property key.
	 * @param {Object} [params] - Component options.
	 * @param {String} [params.label=value] - NumberInput label
	 * @param {Function} [params.onChange] - Callback on change
	 * @param {Number} [params.step] - Amount subbed/added on arrowDown/arrowUp press
	 * @param {Number} [params.dp] - Decimal places displayed
	 * @param {Array} [params.presets] - A set of presets
	 * @returns {Panel}
	 */
	
	Panel.prototype.addNumberInput = function (object, value, params) {
	    return this._addComponent(NumberInput,object,value,params);
	};
	
	/**
	 * Adds a new Range input to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Range label
	 * @param {Function} [params.onChange] - Callback on change
	 * @param {Number} [params.step] - Amount subbed/added on arrowDown/arrowUp press
	 * @param {Number} [params.dp] - Decimal places displayed
	 * @returns {Panel}
	 */
	
	Panel.prototype.addRange = function (object, value, params) {
	    return this._addComponent(Range,object,value,params);
	};
	
	/**
	 * Adds a new Checkbox to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Checkbox label
	 * @param {Function} [params.onChange] - Callback on change
	 * @returns {Panel}
	 */
	
	Panel.prototype.addCheckbox = function (object, value, params) {
	    return this._addComponent(Checkbox,object,value,params);
	};
	
	/**
	 * Adds a new Color modifier to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Color label
	 * @param {Function} [params.onChange] - Callback on change
	 * @param {String} [params.colorMode='rgb'] - The colorMode to be used: 'hex' #ff00ff, 'rgb' [255,0,255], 'rgbfv' [1,0,1]
	 * @param {Array} [params.presets] - A set of preset colors matching params.colorMode
	 * @returns {Panel}
	 */
	
	Panel.prototype.addColor = function (object, value, params) {
	    return this._addComponent(Color,object,value, params);
	};
	
	/**
	 * Adds a new Button to last added SubGroup.
	 * @param {String} label - The object
	 * @param {Function} onPress - Callback
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Button label
	 * @returns {Panel}
	 */
	
	Panel.prototype.addButton = function (label, onPress, params) {
	    return this._addComponent(Button,label,onPress,params);
	};
	
	/**
	 * Adds a new Select to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Button label
	 * @param {Function} [params.onChange] - Callback on change - function(index){}
	 * @param {String} [params.target] - The property to be set on select
	 * @returns {Panel}
	 */
	
	Panel.prototype.addSelect = function (object, value, params) {
	    return this._addComponent(Select,object,value,params);
	};
	
	/**
	 * Adds a new Slider to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {String} range - The min/max array key to be used
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Slider label
	 * @param {Function} [params.onChange] - Callback on change
	 * @param {Function} [params.onFinish] - Callback on finish
	 * @param {Number} [params.step] - Amount subbed/added on arrowDown/arrowUp press inside the input
	 * @param {Number} [params.dp] - Decimal places displayed
	 * @returns {Panel}
	 */
	
	Panel.prototype.addSlider = function (object, value, range, params) {
	    return this._addComponent(Slider,object,value,range,params);
	};
	
	/**
	 * Adds a new FunctionPlotter to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key - f(x), f(x,y)
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - FunctionPlotter label
	 * @returns {Panel}
	 */
	
	Panel.prototype.addFunctionPlotter = function (object, value, params) {
	    return this._addComponent(FunctionPlotter,object,value,params);
	};
	
	/**
	 * Adds a new XY-Pad to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Pad label
	 * @returns {Panel}
	 */
	
	Panel.prototype.addPad = function (object, value, params) {
	    return this._addComponent(Pad,object,value,params);
	};
	
	/**
	 * Adds a new ValuePlotter to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Plotter label
	 * @param {Number} [params.height] - Plotter height
	 * @param {Number} [params.resolution] - Graph resolution
	 * @returns {Panel}
	 */
	
	Panel.prototype.addValuePlotter = function (object, value, params) {
	    return this._addComponent(ValuePlotter,object,value,params);
	};
	
	/**
	 * Adds a new NumberOutput to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Output label
	 * @param {Number} [params.dp] - Decimal places displayed
	 * @returns {Panel}
	 */
	
	Panel.prototype.addNumberOutput = function (object, value, params) {
	    return this._addComponent(NumberOutput,object,value,params);
	};
	
	/**
	 * Adds a new StringOutput to last added SubGroup.
	 * @param {Object} object - The object
	 * @param {String} value - The property key
	 * @param {Object} [params] - Component options
	 * @param {String} [params.label=value] - Output label
	 * @returns {Panel}
	 */
	
	Panel.prototype.addStringOutput = function (object, value, params) {
	    return this._addComponent(StringOutput,object,value,params);
	};
	
	Panel.prototype.addCanvas = function (params) {
	    return this._addComponent(Canvas_,params);
	};
	
	Panel.prototype.addSVG = function (params) {
	    return this._addComponent(SVG_,params);
	};
	
	Panel.prototype.setData = function(data){
	    var groups = this._groups,
	        i = -1, l = groups.length;
	    while(++i < l){
	        groups[i].setData(data[i]);
	    }
	};
	
	Panel.prototype.getData = function(){
	    var groups = this._groups,
	        i = -1, l = groups.length;
	    var data = [];
	    while(++i  < l){
	        data.push(groups[i].getData());
	    }
	    return data;
	};
	
	module.exports = Panel;

/***/ },
/* 12 */
/*!*****************************************!*\
  !*** ./~/controlkit/lib/group/Group.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var AbstractGroup = __webpack_require__(/*! ./AbstractGroup */ 13);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	
	var SubGroup = __webpack_require__(/*! ./SubGroup */ 22);
	
	var Event_ = __webpack_require__(/*! ../core/event/Event */ 21),
	    DocumentEvent = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    NodeEvent = __webpack_require__(/*! ../core/document/NodeEvent */ 19),
	    PanelEvent = __webpack_require__(/*! ./PanelEvent */ 23),
	    GroupEvent = __webpack_require__(/*! ./GroupEvent */ 24);
	
	var ObjectComponent = __webpack_require__(/*! ../core/ObjectComponent */ 26),
	    ValuePlotter    = __webpack_require__(/*! ../component/ValuePlotter */ 33),
	    FunctionPlotter = __webpack_require__(/*! ../component/FunctionPlotter */ 36);
	
	function Group(parent,params) {
	    params           = params || {};
	    params.label     = params.label     || null;
	    params.useLabels = params.useLabels || true;
	    params.enable    = params.enable     === undefined ? true : params.enable;
	
	    AbstractGroup.apply(this,arguments);
	
	    this._components = [];
	    this._subGroups  = [];
	
	    var root = this._node,
	        wrap = this._wrapNode,
	        list = this._listNode;
	
	        root.setStyleClass(CSS.Group);
	        wrap.setStyleClass(CSS.Wrap);
	        list.setStyleClass(CSS.SubGroupList);
	
	        wrap.addChild(list);
	
	    var label = params.label;
	
	    if(label){
	        var head  = new Node(),
	            wrap_ = new Node(),
	            label_  = new Node(Node.SPAN),
	            indicator = this._indiNode = new Node();
	
	            head.setStyleClass(CSS.Head);
	            wrap_.setStyleClass(CSS.Wrap);
	            label_.setStyleClass(CSS.Label);
	            indicator.setStyleClass(CSS.ArrowBMax);
	            label_.setProperty('innerHTML',label);
	
	            head.addChild(indicator);
	            wrap_.addChild(label_);
	            head.addChild(wrap_);
	            root.addChild(head);
	
	        head.addEventListener(NodeEvent.MOUSE_DOWN,this._onHeadTrigger.bind(this));
	        this.addEventListener(GroupEvent.GROUP_LIST_SIZE_CHANGE,parent,'onGroupListSizeChange');
	
	        this._updateAppearance();
	    }
	
	    if(this.hasMaxHeight()){
	        this.addScrollWrap();
	    }
	
	    root.addChild(wrap);
	
	    if(this.hasMaxHeight()){
	        if(!label){
	            var bufferTop = this._scrollBufferTop = new Node();
	                bufferTop.setStyleClass(CSS.ScrollBuffer);
	
	            root.addChildAt(bufferTop,0);
	        }
	        var bufferBottom = this._scrollBufferBottom = new Node();
	            bufferBottom.setStyleClass(CSS.ScrollBuffer);
	
	        root.addChild(bufferBottom);
	    }
	
	    parent = this._parent;
	
	    parent.addEventListener(PanelEvent.PANEL_MOVE_BEGIN, this, 'onPanelMoveBegin');
	    parent.addEventListener(PanelEvent.PANEL_MOVE, this, 'onPanelMove');
	    parent.addEventListener(PanelEvent.PANEL_MOVE_END, this, 'onPanelMoveEnd');
	    parent.addEventListener(PanelEvent.PANEL_HIDE, this, 'onPanelHide');
	    parent.addEventListener(PanelEvent.PANEL_SHOW, this, 'onPanelShow');
	    parent.addEventListener(PanelEvent.PANEL_SCROLL_WRAP_ADDED, this, 'onPanelScrollWrapAdded');
	    parent.addEventListener(PanelEvent.PANEL_SCROLL_WRAP_REMOVED, this, 'onPanelScrollWrapRemoved');
	    parent.addEventListener(PanelEvent.PANEL_SIZE_CHANGE, this, 'onPanelSizeChange');
	    parent.addEventListener(DocumentEvent.WINDOW_RESIZE, this, 'onWindowResize');
	
	    this.addEventListener(GroupEvent.GROUP_SIZE_CHANGE,parent,'onGroupListSizeChange');
	}
	Group.prototype = Object.create(AbstractGroup.prototype);
	Group.prototype.constructor = Group;
	
	Group.prototype.onPanelMoveBegin = function () {
	    this.dispatchEvent(new Event_(this, PanelEvent.PANEL_MOVE_BEGIN, null));
	};
	
	Group.prototype.onPanelMove = function () {
	    this.dispatchEvent(new Event_(this, PanelEvent.PANEL_MOVE, null));
	};
	
	Group.prototype.onPanelMoveEnd = function () {
	    this.dispatchEvent(new Event_(this, PanelEvent.PANEL_MOVE_END, null));
	};
	
	Group.prototype.onPanelScrollWrapAdded = function () {
	    this.dispatchEvent(new Event_(this, GroupEvent.GROUP_SIZE_CHANGE, null));
	};
	
	Group.prototype.onPanelScrollWrapRemoved = function () {
	    this.dispatchEvent(new Event_(this, GroupEvent.GROUP_SIZE_CHANGE, null));
	};
	
	Group.prototype.onPanelHide = function () {
	    this.dispatchEvent(new Event_(this, GroupEvent.SUBGROUP_DISABLE, null));
	};
	
	Group.prototype.onPanelShow = function () {
	    this.dispatchEvent(new Event_(this, GroupEvent.SUBGROUP_ENABLE, null));
	};
	
	Group.prototype.onPanelSizeChange = function () {
	    this.dispatchEvent(new Event_(this, GroupEvent.GROUP_SIZE_CHANGE, null));
	};
	
	Group.prototype.onWindowResize = function (e) {
	    this.dispatchEvent(e);
	};
	
	Group.prototype.onSubGroupTrigger = function () {
	    this._updateHeight();
	
	    if(!this.hasMaxHeight()){
	        return;
	    }
	    var scrollBar = this._scrollBar,
	        wrap  = this._wrapNode;
	    var bufferTop    = this._scrollBufferTop,
	        bufferBottom = this._scrollBufferBottom;
	
	    scrollBar.update();
	
	    if (!scrollBar.isValid()) {
	        scrollBar.disable();
	        wrap.setHeight(wrap.getChildAt(1).getHeight());
	        if (bufferTop){
	            bufferTop.setStyleProperty('display', 'none');
	        }
	        if (bufferBottom){
	            bufferBottom.setStyleProperty('display', 'none');
	        }
	    }
	    else {
	        scrollBar.enable();
	        wrap.setHeight(this.getMaxHeight());
	
	        if (bufferTop){
	            bufferTop.setStyleProperty('display', 'block');
	        }
	        if (bufferBottom){
	            bufferBottom.setStyleProperty('display', 'block');
	        }
	    }
	    this.dispatchEvent(new Event_(this,GroupEvent.GROUP_SIZE_CHANGE,null));
	};
	
	Group.prototype._onHeadTrigger = function () {
	    this._enabled = !this._enabled;
	    this._updateAppearance();
	    this.dispatchEvent(new Event_(this, GroupEvent.GROUP_LIST_SIZE_CHANGE, null));
	};
	
	Group.prototype.addComponent = function(){
	    var Class_ = arguments[0];
	    var args   = Array.prototype.slice.call(arguments);
	        args.shift();
	        args.unshift(this._getSubGroup());
	
	    var instance = Object.create(Class_.prototype);
	    Class_.apply(instance,args);
	
	    this._components.push(instance);
	    this._updateHeight();
	};
	
	Group.prototype._updateHeight = function () {
	    this._getSubGroup().update();
	    this.dispatchEvent(new Event_(this,GroupEvent.GROUP_SIZE_CHANGE,null));
	    if(this.hasMaxHeight()){
	        this._scrollBar.update();
	    }
	};
	
	Group.prototype._updateAppearance = function () {
	    var wrap = this._wrapNode,
	        indicator = this._indiNode;
	
	    var scrollBar = this._scrollBar;
	
	    var bufferTop    = this._scrollBufferTop,
	        bufferBottom = this._scrollBufferBottom;
	
	    if (this.isDisabled()) {
	        wrap.setHeight(0);
	        if (indicator){
	            indicator.setStyleClass(CSS.ArrowBMin);
	        }
	
	        if (scrollBar) {
	            if (bufferTop){
	                bufferTop.setStyleProperty('display', 'none');
	            }
	            if (bufferBottom){
	                bufferBottom.setStyleProperty('display', 'none');
	            }
	        }
	        return;
	    }
	
	    if (this.hasMaxHeight()) {
	        var maxHeight = this.getMaxHeight(),
	            listHeight = wrap.getChildAt(1).getHeight();
	
	        wrap.setHeight(listHeight < maxHeight ? listHeight : maxHeight);
	
	        if (scrollBar.isValid()) {
	            if (bufferTop){
	                bufferTop.setStyleProperty('display', 'block');
	            }
	            if (bufferBottom){
	                bufferBottom.setStyleProperty('display', 'block');
	            }
	        }
	    }
	    else {
	        wrap.deleteStyleProperty('height');
	    }
	    if (indicator){
	        indicator.setStyleClass(CSS.ArrowBMax);
	    }
	};
	
	Group.prototype.onGroupSizeUpdate = function () {
	    this._updateAppearance();
	    if (this.hasMaxHeight()){
	        this._scrollBar.update();
	    }
	};
	
	Group.prototype.addSubGroup = function (params) {
	    this._subGroups.push(new SubGroup(this, params));
	    this._updateHeight();
	    return this;
	};
	
	Group.prototype._getSubGroup = function () {
	    var subGroups = this._subGroups;
	    if (subGroups.length == 0){
	        subGroups.push(new SubGroup(this));
	    }
	    return subGroups[subGroups.length - 1];
	};
	
	Group.prototype.getComponents = function () {
	    return this._components;
	};
	
	function isDataComp(comp){
	    return  (comp instanceof ObjectComponent) &&
	           !(comp instanceof ValuePlotter) &&
	           !(comp instanceof FunctionPlotter);
	}
	
	
	Group.prototype.setData = function(data){
	    var comps = this._components, comp, data_;
	    var i = -1, j = 0, l = comps.length;
	    while(++i < l){
	        comp = comps[i];
	        if(!isDataComp(comp)){
	            continue;
	        }
	        data_ = data[j++];
	        comp.setValue(data_[Object.keys(data_)[0]]);
	    }
	};
	
	Group.prototype.getData = function(){
	    var comps = this._components,
	        i = -1, l = comps.length;
	    var values = [];
	    var comp;
	    while(++i < l){
	        comp = comps[i];
	        if(!isDataComp(comp)){
	            continue;
	        }
	        values.push(comp.getData());
	    }
	    return values;
	};
	
	module.exports = Group;


/***/ },
/* 13 */
/*!*************************************************!*\
  !*** ./~/controlkit/lib/group/AbstractGroup.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventDispatcher = __webpack_require__(/*! ../core/event/EventDispatcher */ 14);
	var Node            = __webpack_require__(/*! ../core/document/Node */ 10);
	var ScrollBar       = __webpack_require__(/*! ../core/layout/ScrollBar */ 15);
	
	function AbstractGroup(parent, params) {
	    EventDispatcher.apply(this, arguments);
	
	    params = params || {};
	    params.height = params.height || null;
	    params.enable = params.enable === undefined ? true : params.enable;
	
	    this._parent = parent;
	    this._height = params.height;
	    this._enabled = params.enable;
	    this._scrollBar = null;
	
	    this._node = new Node(Node.LIST_ITEM);
	    this._wrapNode = new Node();
	    this._listNode = new Node(Node.LIST);
	
	    this._parent.getList().addChild(this._node);
	}
	AbstractGroup.prototype = Object.create(EventDispatcher.prototype);
	AbstractGroup.prototype.constructor = AbstractGroup;
	
	AbstractGroup.prototype.addScrollWrap = function () {
	    var wrapNode = this._wrapNode,
	        maxHeight = this.getMaxHeight();
	
	    this._scrollBar = new ScrollBar(wrapNode, this._listNode, maxHeight);
	    if (this.isEnabled()) {
	        wrapNode.setHeight(maxHeight);
	    }
	};
	
	AbstractGroup.prototype.preventSelectDrag = function () {
	    this._parent.preventSelectDrag();
	
	    if (!this.hasScrollWrap()) {
	        return;
	    }
	    this._wrapNode.getElement().scrollTop = 0;
	};
	
	AbstractGroup.prototype.hasMaxHeight = function () {
	    return this._height != null;
	};
	
	AbstractGroup.prototype.getMaxHeight = function () {
	    return this._height;
	};
	
	AbstractGroup.prototype.hasScrollWrap = function () {
	    return this._scrollBar != null;
	};
	
	AbstractGroup.prototype.hasLabel = function () {
	    return this._lablNode != null;
	};
	
	AbstractGroup.prototype.disable = function () {
	    this._enabled = false;
	    this._updateAppearance();
	};
	
	AbstractGroup.prototype.enable = function () {
	    this._enabled = true;
	    this._updateAppearance();
	};
	
	AbstractGroup.prototype.isDisabled = function () {
	    return !this._enabled;
	};
	
	AbstractGroup.prototype.isEnabled = function () {
	    return this._enabled;
	};
	
	AbstractGroup.prototype.getList = function () {
	    return this._listNode;
	};
	
	module.exports = AbstractGroup;
	


/***/ },
/* 14 */
/*!********************************************************!*\
  !*** ./~/controlkit/lib/core/event/EventDispatcher.js ***!
  \********************************************************/
/***/ function(module, exports) {

	function EventDispatcher() {
	    this._listeners = [];
	};
	
	EventDispatcher.prototype = {
	    addEventListener: function (eventType, listener, callbackMethod) {
	        this._listeners[eventType] = this._listeners[eventType] || [];
	        this._listeners[eventType].push({obj: listener, method: callbackMethod});
	    },
	
	    dispatchEvent: function (event) {
	        var type = event.type;
	
	        if (!this.hasEventListener(type)){
	            return;
	        }
	
	        var listeners = this._listeners[type];
	        var i = -1, l = listeners.length;
	
	        var obj, method;
	
	        while (++i < l) {
	            obj = listeners[i].obj;
	            method = listeners[i].method;
	
	            if (!obj[method]){
	                throw obj + ' has no method ' + method;
	            }
	
	            obj[method](event);
	        }
	    },
	
	    removeEventListener: function (type, obj, method) {
	        if (!this.hasEventListener(type)){
	            return;
	        }
	
	        var listeners = this._listeners[type];
	
	        var i = listeners.length;
	        while (--i > -1) {
	            if (listeners[i].obj == obj && listeners[i].method == method) {
	                listeners.splice(i, 1);
	                if (listeners.length == 0){
	                    delete this._listeners[type];
	                }
	                break;
	            }
	        }
	    },
	
	    removeAllEventListeners: function () {
	        this._listeners = [];
	    },
	
	    hasEventListener: function (type) {
	        return this._listeners[type] != undefined && this._listeners[type] != null;
	    }
	};
	
	module.exports = EventDispatcher;

/***/ },
/* 15 */
/*!***************************************************!*\
  !*** ./~/controlkit/lib/core/layout/ScrollBar.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Node   = __webpack_require__(/*! ../document/Node */ 10);
	var Metric = __webpack_require__(/*! ../../component/Metric */ 16);
	var CSS    = __webpack_require__(/*! ../document/CSS */ 17);
	var DocumentEvent = __webpack_require__(/*! ../document/DocumentEvent */ 18),
	    NodeEvent     = __webpack_require__(/*! ../document/NodeEvent */ 19);
	var Mouse  = __webpack_require__(/*! ../document/Mouse */ 20);
	
	function ScrollBar(parentNode,targetNode,wrapHeight) {
	    this._parentNode = parentNode;
	    this._targetNode = targetNode;
	    this._wrapHeight = wrapHeight;
	
	    var wrap   = this._wrapNode   = new Node().setStyleClass(CSS.ScrollWrap),
	        node   = this._node       = new Node().setStyleClass(CSS.ScrollBar),
	        track  = this._trackNode  = new Node().setStyleClass(CSS.ScrollBarTrack),
	        thumb  = this._thumbNode  = new Node().setStyleClass(CSS.ScrollBarThumb);
	
	    parentNode.removeChild(targetNode);
	    parentNode.addChild(wrap);
	    parentNode.addChildAt(node,0);
	
	    wrap.addChild(targetNode);
	    node.addChild(track);
	    track.addChild(thumb);
	
	    this._mouseThumbOffset = 0;
	    this._scrollHeight = 0;
	    this._scrollUnit   = 0;
	    this._scrollMin    = 0;
	    this._scrollMax    = 0;
	
	    thumb.setPositionY(Metric.SCROLLBAR_TRACK_PADDING);
	    thumb.addEventListener(DocumentEvent.MOUSE_DOWN,this._onThumbDragStart.bind(this));
	
	    this._isValid  = false;
	    this._enabled = false;
	
	    var nodeElement = node.getElement(),
	        thumbElement = thumb.getElement();
	    var self = this;
	    this._onMouseWheel = function(e){
	        var sender = e.sender,
	            hoverElement = sender.getHoverElement();
	        if(hoverElement != nodeElement && hoverElement != thumbElement){
	            return;
	        }
	        var scrollStep = self._scrollHeight * 0.0125;
	        self._scroll(thumb.getPositionY() + sender.getWheelDirection() * scrollStep * -1);
	        e.data.preventDefault();
	    };
	
	    this.addMouseListener();
	}
	
	ScrollBar.prototype.update = function(){
	    var target = this._targetNode,
	        thumb = this._thumbNode;
	
	    var padding = Metric.SCROLLBAR_TRACK_PADDING;
	
	    var targetWrapHeight = this._wrapHeight,
	        targetHeight = target.getHeight(),
	        trackHeight = targetWrapHeight - padding * 2;
	
	    thumb.setHeight(trackHeight);
	
	    var ratio = targetWrapHeight / targetHeight;
	
	    this._isValid = false;
	
	    if (ratio > 1.0){
	        return;
	    }
	    var thumbHeight = trackHeight * ratio;
	
	    this._scrollHeight = trackHeight;
	    this._scrollUnit   = targetHeight - this._scrollHeight - padding * 2;
	    this._scrollMin    = padding;
	    this._scrollMax    = padding + trackHeight - thumbHeight;
	
	    thumb.setHeight(thumbHeight);
	
	    this._isValid = true;
	};
	
	ScrollBar.prototype._scroll = function(y){
	    var min  = this._scrollMin,
	        max  = this._scrollMax,
	        pos  = Math.max(min, Math.min(y,max)),
	        pos_ = (pos-min)/(max-min);
	
	    this._thumbNode.setPositionY(pos);
	    this._targetNode.setPositionY(pos_ * this._scrollUnit * -1);
	};
	
	
	ScrollBar.prototype._onThumbDragStart = function () {
	    if (!this._isValid || this._enabled){
	        return;
	    }
	    var eventMove = DocumentEvent.MOUSE_MOVE,
	        eventUp = DocumentEvent.MOUSE_UP;
	
	    var mouse = Mouse.get();
	    var trackOffset = this._trackNode.getPositionGlobalY();
	
	    this._mouseThumbOffset = mouse.getY() - this._thumbNode.getPositionGlobalY();
	
	    var self = this;
	    var onDrag = function () {
	            self._scroll(mouse.getY() - trackOffset - self._mouseThumbOffset);
	        },
	        onDragEnd = function () {
	            document.removeEventListener(eventMove, onDrag, false);
	            document.removeEventListener(eventUp, onDragEnd, false);
	        };
	
	    document.addEventListener(eventMove, onDrag, false);
	    document.addEventListener(eventUp, onDragEnd, false);
	    this._scroll(mouse.getY() - trackOffset - self._mouseThumbOffset);
	};
	
	
	ScrollBar.prototype.enable = function () {
	    this._enabled = false;
	    this._updateAppearance();
	};
	
	ScrollBar.prototype.disable = function () {
	    this._enabled = true;
	    this._updateAppearance();
	};
	ScrollBar.prototype.reset = function () {
	    this._scroll(0);
	};
	
	ScrollBar.prototype._updateAppearance = function () {
	    if (this._enabled) {
	        this._node.setStyleProperty('display', 'none');
	        this._targetNode.setPositionY(0);
	        this._thumbNode.setPositionY(Metric.SCROLLBAR_TRACK_PADDING);
	    } else {
	        this._node.setStyleProperty('display', 'block');
	    }
	};
	
	ScrollBar.prototype.isValid = function () {
	    return this._isValid;
	};
	
	ScrollBar.prototype.setWrapHeight = function (height) {
	    this._wrapHeight = height;
	    this.update();
	};
	
	ScrollBar.prototype.removeTargetNode = function () {
	    return this._wrapNode.removeChild(this._targetNode);
	};
	
	ScrollBar.prototype.removeMouseListener = function(){
	    Mouse.get().removeEventListener(DocumentEvent.MOUSE_WHEEL,this,'_onMouseWheel');
	};
	
	ScrollBar.prototype.addMouseListener = function(){
	    Mouse.get().addEventListener(DocumentEvent.MOUSE_WHEEL,this,'_onMouseWheel');
	};
	
	ScrollBar.prototype.removeFromParent = function () {
	    var parentNode = this._parentNode,
	        rootNode = this._node,
	        targetNode = this._targetNode;
	
	    rootNode.removeChild(targetNode);
	    parentNode.removeChild(this._wrapNode);
	    parentNode.removeChild(rootNode);
	
	    return targetNode;
	};
	
	ScrollBar.prototype.getWrapNode = function () {
	    return this._wrapNode;
	};
	
	ScrollBar.prototype.getNode = function () {
	    return this._node;
	};
	
	ScrollBar.prototype.getTargetNode = function () {
	    return this._targetNode;
	};
	
	
	module.exports = ScrollBar;

/***/ },
/* 16 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/component/Metric.js ***!
  \**********************************************/
/***/ function(module, exports) {

	var Metric = {
		COMPONENT_MIN_HEIGHT: 25,
		STROKE_SIZE: 1,
		PADDING_WRAPPER: 12,
		PADDING_OPTIONS: 2,
		PADDING_PRESET: 20,
	
		SCROLLBAR_TRACK_PADDING: 2,
		FUNCTION_PLOTTER_LABEL_TICK_SIZE: 6
	};
	
	module.exports = Metric;

/***/ },
/* 17 */
/*!***********************************************!*\
  !*** ./~/controlkit/lib/core/document/CSS.js ***!
  \***********************************************/
/***/ function(module, exports) {

	var CSS = {
	    ControlKit: 'controlKit',
	
	    Panel: 'panel',
	    Head: 'head',
	    Label: 'label',
	    Menu: 'menu',
	    Wrap: 'wrap',
	
	    ButtonMenuClose: 'button-menu-close',
	    ButtonMenuHide: 'button-menu-hide',
	    ButtonMenuShow: 'button-menu-show',
	    ButtonMenuUndo: 'button-menu-undo',
	    ButtonMenuLoad: 'button-menu-load',
	    ButtonMenuSave: 'button-menu-save',
	    MenuActive: 'menu-active',
	
	    Button: 'button',
	    ButtonPreset: 'button-preset',
	    ButtonPresetActive: 'button-preset-active',
	
	    WrapInputWPreset: 'input-with-preset-wrap',
	    WrapColorWPreset: 'color-with-preset-wrap',
	
	    HeadInactive: 'head-inactive',
	    PanelHeadInactive: 'panel-head-inactive',
	
	    GroupList: 'group-list',
	    Group: 'group',
	    SubGroupList: 'sub-group-list',
	    SubGroup: 'sub-group',
	
	
	    TextAreaWrap: 'textarea-wrap',
	
	    WrapSlider: 'wrap-slider',
	    SliderWrap: 'slider-wrap',
	    SliderSlot: 'slider-slot',
	    SliderHandle: 'slider-handle',
	
	    ArrowBMin: 'arrow-b-min',
	    ArrowBMax: 'arrow-b-max',
	    ArrowBSubMin: 'arrow-b-sub-min',
	    ArrowBSubMax: 'arrow-b-sub-max',
	    ArrowSMin: 'arrow-s-min',
	    ArrowSMax: 'arrow-s-max',
	
	    Select: 'select',
	    SelectActive: 'select-active',
	
	    Options: 'options',
	    OptionsSelected: 'li-selected',
	
	    CanvasListItem: 'canvas-list-item',
	    CanvasWrap: 'canvas-wrap',
	
	    SVGListItem: 'svg-list-item',
	    SVGWrap: 'svg-wrap',
	
	    GraphSliderXWrap: 'graph-slider-x-wrap',
	    GraphSliderYWrap: 'graph-slider-y-wrap',
	    GraphSliderX: 'graph-slider-x',
	    GraphSliderY: 'graph-slider-y',
	    GraphSliderXHandle: 'graph-slider-x-handle',
	    GraphSliderYHandle: 'graph-slider-y-handle',
	
	    Picker: 'picker',
	    PickerFieldWrap: 'field-wrap',
	    PickerInputWrap: 'input-wrap',
	    PickerInputField: 'input-field',
	    PickerControlsWrap: 'controls-wrap',
	    PickerColorContrast: 'color-contrast',
	    PickerHandleField: 'indicator',
	    PickerHandleSlider: 'indicator',
	
	    Color: 'color',
	
	    ScrollBar: 'scrollBar',
	    ScrollWrap: 'scroll-wrap',
	    ScrollBarBtnUp: 'btnUp',
	    ScrollBarBtnDown: 'btnDown',
	    ScrollBarTrack: 'track',
	    ScrollBarThumb: 'thumb',
	    ScrollBuffer: 'scroll-buffer',
	};
	
	module.exports = CSS;


/***/ },
/* 18 */
/*!*********************************************************!*\
  !*** ./~/controlkit/lib/core/document/DocumentEvent.js ***!
  \*********************************************************/
/***/ function(module, exports) {

	var DocumentEvent = {
	    MOUSE_MOVE: 'mousemove',
	    MOUSE_UP: 'mouseup',
	    MOUSE_DOWN: 'mousedown',
	    MOUSE_WHEEL: 'mousewheel',
	    WINDOW_RESIZE: 'resize'
	};
	
	module.exports = DocumentEvent;

/***/ },
/* 19 */
/*!*****************************************************!*\
  !*** ./~/controlkit/lib/core/document/NodeEvent.js ***!
  \*****************************************************/
/***/ function(module, exports) {

	var NodeEvent = {
	    MOUSE_DOWN   : 'mousedown',
	    MOUSE_UP     : 'mouseup',
	    MOUSE_OVER   : 'mouseover',
	    MOUSE_MOVE   : 'mousemove',
	    MOUSE_OUT    : 'mouseout',
	    KEY_DOWN     : 'keydown',
	    KEY_UP       : 'keyup',
	    CHANGE       : 'change',
	    FINISH       : 'finish',
	    DBL_CLICK    : 'dblclick',
	    ON_CLICK     : 'click',
	    SELECT_START : 'selectstart',
	    DRAG_START   : 'dragstart',
	    DRAG         : 'drag',
	    DRAG_END     : 'dragend',
	
	    DRAG_ENTER   : 'dragenter',
	    DRAG_OVER    : 'dragover',
	    DRAG_LEAVE   : 'dragleave',
	
	    RESIZE       : 'resize'
	};
	
	module.exports = NodeEvent;

/***/ },
/* 20 */
/*!*************************************************!*\
  !*** ./~/controlkit/lib/core/document/Mouse.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventDispatcher = __webpack_require__(/*! ../event/EventDispatcher */ 14),
	    Event_ = __webpack_require__(/*! ../event/Event */ 21),
	    DocumentEvent = __webpack_require__(/*! ./DocumentEvent */ 18);
	var instance = null;
	
	function Mouse() {
	    EventDispatcher.apply(this);
	    this._pos = [0,0];
	    this._wheelDirection = 0;
	    this._hoverElement = null;
	
	    var self = this;
	    this._onDocumentMouseMove = function(e){
	        var dx = 0,
	            dy = 0;
	
	        if (!e)e = window.event;
	        if (e.pageX) {
	            dx = e.pageX;
	            dy = e.pageY;
	        }
	        else if (e.clientX) {
	            dx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	            dy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	        }
	        self._pos[0] = dx;
	        self._pos[1] = dy;
	
	        self._hoverElement = document.elementFromPoint(dx,dy);
	    };
	
	    this._onDocumentMouseWheel = function(event){
	        self._wheelDirection = (event.detail < 0) ? 1 : (event.wheelDelta > 0) ? 1 : -1;
	        self.dispatchEvent(new Event_(self,DocumentEvent.MOUSE_WHEEL,event));
	    };
	
	    document.addEventListener(DocumentEvent.MOUSE_MOVE, this._onDocumentMouseMove);
	    document.addEventListener(DocumentEvent.MOUSE_WHEEL,this._onDocumentMouseWheel);
	}
	Mouse.prototype = Object.create(EventDispatcher.prototype);
	Mouse.prototype.constructor = Mouse;
	
	Mouse.prototype._removeDocumentListener = function(){
	    document.removeEventListener(DocumentEvent.MOUSE_MOVE, this._onDocumentMouseMove);
	    document.removeEventListener(DocumentEvent.MOUSE_WHEEL,this._onDocumentMouseWheel);
	};
	
	Mouse.prototype.getPosition = function () {
	    return this._pos;
	};
	
	Mouse.prototype.getX = function () {
	    return this._pos[0];
	};
	
	Mouse.prototype.getY = function () {
	    return this._pos[1];
	};
	
	Mouse.prototype.getWheelDirection = function(){
	    return this._wheelDirection;
	};
	
	Mouse.prototype.getHoverElement = function(){
	    return this._hoverElement;
	};
	
	Mouse.setup = function () {
	    instance = instance || new Mouse();
	    return instance;
	};
	
	Mouse.get = function () {
	    return instance;
	};
	
	Mouse.destroy = function(){
	    instance._removeDocumentListener();
	    instance = null;
	};
	
	module.exports = Mouse;

/***/ },
/* 21 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/core/event/Event.js ***!
  \**********************************************/
/***/ function(module, exports) {

	function Event_(sender,type,data) {
	    this.sender = sender;
	    this.type   = type;
	    this.data   = data;
	}
	module.exports = Event_;

/***/ },
/* 22 */
/*!********************************************!*\
  !*** ./~/controlkit/lib/group/SubGroup.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var AbstractGroup = __webpack_require__(/*! ./AbstractGroup */ 13);
	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	var CSS  = __webpack_require__(/*! ../core/document/CSS */ 17);
	
	var Event_         = __webpack_require__(/*! ../core/event/Event */ 21),
	    DocumentEvent  = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    PanelEvent     = __webpack_require__(/*! ./PanelEvent */ 23),
	    GroupEvent     = __webpack_require__(/*! ./GroupEvent */ 24),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	function SubGroup(parent,params){
	    params            = params          || {};
	    params.label      = params.label    || null;
	    params.useLabels  = params.useLabels  === undefined ? true : params.useLabels;
	
	    AbstractGroup.apply(this,arguments);
	
	    var rootNode = this._node,
	        wrapNode = this._wrapNode,
	        listNode = this._listNode;
	
	        rootNode.setStyleClass(CSS.SubGroup);
	        wrapNode.setStyleClass(CSS.Wrap);
	
	        wrapNode.addChild(listNode);
	        rootNode.addChild(wrapNode);
	
	    this._useLabels  = params.useLabels;
	
	    var label = params.label;
	
	    if (label && label.length != 0 && label != 'none') {
	        var headNode = this._headNode = new Node(),
	            lablWrap = new Node(),
	            lablNode = new Node(Node.SPAN);
	
	        headNode.setStyleClass(CSS.Head);
	        lablWrap.setStyleClass(CSS.Wrap);
	        lablNode.setStyleClass(CSS.Label);
	
	        lablNode.setProperty('innerHTML', label);
	
	        lablWrap.addChild(lablNode);
	        headNode.addChild(lablWrap);
	
	
	        var indiNode = this._indiNode = new Node();
	        indiNode.setStyleClass(CSS.ArrowBSubMax);
	        headNode.addChildAt(indiNode, 0);
	
	        rootNode.addChildAt(headNode, 0);
	
	        this.addEventListener(GroupEvent.SUBGROUP_TRIGGER, this._parent, 'onSubGroupTrigger');
	        headNode.addEventListener(DocumentEvent.MOUSE_DOWN, this._onHeadMouseDown.bind(this));
	
	        this._updateAppearance();
	
	    }
	
	    if(this.hasMaxHeight()){
	        this.addScrollWrap();
	    }
	
	    this._parent.addEventListener(GroupEvent.SUBGROUP_ENABLE,  this, 'onEnable');
	    this._parent.addEventListener(GroupEvent.SUBGROUP_DISABLE, this, 'onDisable');
	    this._parent.addEventListener(PanelEvent.PANEL_MOVE_END,   this, 'onPanelMoveEnd');
	    this._parent.addEventListener(GroupEvent.GROUP_SIZE_CHANGE,this, 'onGroupSizeChange');
	    this._parent.addEventListener(PanelEvent.PANEL_SIZE_CHANGE,this, 'onPanelSizeChange');
	    this._parent.addEventListener(DocumentEvent.WINDOW_RESIZE,    this, 'onWindowResize');
	
	    this.addEventListener(GroupEvent.GROUP_SIZE_UPDATE,this._parent,'onGroupSizeUpdate');
	}
	SubGroup.prototype = Object.create(AbstractGroup.prototype);
	SubGroup.prototype.constructor = SubGroup;
	
	//FIXME
	SubGroup.prototype._onHeadMouseDown = function () {
	    this._enabled = !this._enabled;
	    this._onTrigger();
	
	    var event = DocumentEvent.MOUSE_UP,
	        self  = this;
	    var onDocumentMouseUp = function () {
	        self._onTrigger();
	        document.removeEventListener(event, onDocumentMouseUp);
	    };
	
	    document.addEventListener(event,onDocumentMouseUp);
	};
	
	SubGroup.prototype._onTrigger = function() {
	    this._updateAppearance();
	    this.dispatchEvent(new Event_(this,GroupEvent.SUBGROUP_TRIGGER,null));
	};
	
	
	SubGroup.prototype._updateAppearance = function () {
	    if (this.isDisabled()) {
	        this._wrapNode.setHeight(0);
	        if (this.hasLabel()) {
	            this._headNode.setStyleClass(CSS.HeadInactive);
	            this._indiNode.setStyleClass(CSS.ArrowBSubMin);
	        }
	    }
	    else {
	        if (this.hasMaxHeight()) {
	            this._wrapNode.setHeight(this.getMaxHeight());
	        } else {
	            this._wrapNode.deleteStyleProperty('height');
	        }
	        if (this.hasLabel()) {
	            this._headNode.setStyleClass(CSS.Head);
	            this._indiNode.setStyleClass(CSS.ArrowBSubMax);
	        }
	    }
	};
	
	SubGroup.prototype.update = function () {
	    if (this.hasMaxHeight()){
	        this._scrollBar.update();
	    }
	};
	
	SubGroup.prototype.onComponentSelectDrag = function () {
	    this.preventSelectDrag();
	};
	
	SubGroup.prototype.onEnable = function () {
	    if (this.isDisabled()){
	        return;
	    }
	    this.dispatchEvent(new Event_(this, ComponentEvent.ENABLE, null));
	};
	SubGroup.prototype.onDisable = function () {
	    if (this.isDisabled()){
	        return;
	    }
	    this.dispatchEvent(new Event_(this, ComponentEvent.DISABLE, null));
	};
	
	//bubble
	SubGroup.prototype.onGroupSizeChange = function () {
	    this.dispatchEvent(new Event_(this, GroupEvent.GROUP_SIZE_CHANGE, null));
	};
	SubGroup.prototype.onGroupSizeUpdate = function () {
	    this.dispatchEvent(new Event_(this, GroupEvent.GROUP_SIZE_UPDATE, null));
	};
	SubGroup.prototype.onPanelMoveEnd = function () {
	    this.dispatchEvent(new Event_(this, PanelEvent.PANEL_MOVE_END, null));
	};
	SubGroup.prototype.onPanelSizeChange = function () {
	    this._updateAppearance();
	};
	SubGroup.prototype.onWindowResize = function (e) {
	    this.dispatchEvent(e);
	};
	
	SubGroup.prototype.hasLabel = function () {
	    return this._headNode != null;
	};
	SubGroup.prototype.addComponentNode = function (node) {
	    this._listNode.addChild(node);
	};
	SubGroup.prototype.usesLabels = function () {
	    return this._useLabels;
	};
	
	module.exports = SubGroup;

/***/ },
/* 23 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/group/PanelEvent.js ***!
  \**********************************************/
/***/ function(module, exports) {

	var PanelEvent = {
		PANEL_MOVE_BEGIN          : 'panelMoveBegin',
		PANEL_MOVE                : 'panelMove',
		PANEL_MOVE_END            : 'panelMoveEnd',
	
		PANEL_SHOW                : 'panelShow',
		PANEL_HIDE                : 'panelHide',
	
		PANEL_SCROLL_WRAP_ADDED   : 'panelScrollWrapAdded',
		PANEL_SCROLL_WRAP_REMOVED : 'panelScrollWrapRemoved',
	
		PANEL_SIZE_CHANGE        : 'panelSizeChange'
	};
	module.exports = PanelEvent;

/***/ },
/* 24 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/group/GroupEvent.js ***!
  \**********************************************/
/***/ function(module, exports) {

	var GroupEvent = {
		GROUP_SIZE_CHANGE        : 'groupSizeChange',
		GROUP_LIST_SIZE_CHANGE   : 'groupListSizeChange',
		GROUP_SIZE_UPDATE        : 'groupSizeUpdate',
		SUBGROUP_TRIGGER         : 'subGroupTrigger',
	
		SUBGROUP_ENABLE          : 'enableSubGroup',
		SUBGROUP_DISABLE         : 'disableSubGroup'
	};
	
	module.exports = GroupEvent;

/***/ },
/* 25 */
/*!*************************************************!*\
  !*** ./~/controlkit/lib/core/ComponentEvent.js ***!
  \*************************************************/
/***/ function(module, exports) {

	var ComponentEvent = {
		VALUE_UPDATED: 'valueUpdated',
		UPDATE_VALUE: 'updateValue',
	
		INPUT_SELECT_DRAG: 'inputSelectDrag',
	
		ENABLE  : 'enable',
		DISABLE : 'disable'
	};
	
	module.exports = ComponentEvent;

/***/ },
/* 26 */
/*!**************************************************!*\
  !*** ./~/controlkit/lib/core/ObjectComponent.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var History = __webpack_require__(/*! ./History */ 27);
	var Component = __webpack_require__(/*! ./Component */ 29),
	    ComponentEvent = __webpack_require__(/*! ./ComponentEvent */ 25),
	    ObjectComponentNotifier = __webpack_require__(/*! ./ObjectComponentNotifier */ 30),
	    ComponentObjectError = __webpack_require__(/*! ./ComponentObjectError */ 32);
	var Event_ = __webpack_require__(/*! ./event/Event */ 21);
	
	function ObjectComponent(parent, obj, key, params) {
	    if (obj[key] === undefined) {
	        throw new ComponentObjectError(obj, key);
	    }
	    params = params || {};
	    params.label = params.label || key;
	
	    Component.apply(this, [parent, params.label]);
	
	    this._obj = obj;
	    this._key = key;
	    this._onChange = function(){};
	
	    ObjectComponentNotifier.get().addEventListener(ComponentEvent.UPDATE_VALUE, this, 'onValueUpdate');
	    this.addEventListener(ComponentEvent.VALUE_UPDATED, ObjectComponentNotifier.get(), 'onValueUpdated');
	}
	ObjectComponent.prototype = Object.create(Component.prototype);
	ObjectComponent.prototype.constructor = ObjectComponent;
	
	//Override in Subclass
	ObjectComponent.prototype.applyValue = function() {};
	ObjectComponent.prototype.onValueUpdate = function (e) {};
	
	ObjectComponent.prototype.pushHistoryState = function () {
	    var obj = this._obj, key = this._key;
	    History.get().pushState(obj, key, obj[key]);
	};
	
	ObjectComponent.prototype.setValue = function (value) {
	    this._obj[this._key] = value;
	    this.dispatchEvent(new Event_(this,ComponentEvent.VALUE_UPDATED,null));
	};
	
	ObjectComponent.prototype.getData = function(){
	    var obj = {};
	        obj[this._key] = this._obj[this._key];
	    return obj;
	};
	
	module.exports = ObjectComponent;


/***/ },
/* 27 */
/*!******************************************!*\
  !*** ./~/controlkit/lib/core/History.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventDispatcher = __webpack_require__(/*! ./event/EventDispatcher */ 14),
	    Event_ = __webpack_require__(/*! ./event/Event */ 21),
	    HistoryEvent = __webpack_require__(/*! ./HistoryEvent */ 28);
	
	var MAX_STATES = 30;
	
	function History() {
	    EventDispatcher.apply(this, arguments);
	    this._states = [];
	    this._enabled = false;
	}
	History.prototype = Object.create(EventDispatcher.prototype);
	History.prototype.constructor = History;
	
	History.prototype.pushState = function (object, key, value) {
	    if (this._enabled){
	        return;
	    }
	
	    var states = this._states;
	    if (states.length >= MAX_STATES){
	        states.shift();
	    }
	    states.push({object: object, key: key, value: value});
	    this.dispatchEvent(new Event_(this, HistoryEvent.STATE_PUSH, null));
	};
	
	History.prototype.getState = function (object, key) {
	    var states = this._states,
	        statesLen = states.length;
	
	    if (statesLen == 0){
	        return null;
	    }
	
	    var state, value;
	    var i = -1;
	    while (++i < statesLen) {
	        state = states[i];
	        if (state.object === object) {
	            if (state.key === key) {
	                value = state.value;
	                break;
	            }
	        }
	    }
	    return value;
	};
	
	History.prototype.popState = function () {
	    if (this._enabled){
	        return;
	    }
	
	    var states = this._states;
	    if (states.length < 1){
	        return;
	    }
	
	    var lastState = states.pop();
	    lastState.object[lastState.key] = lastState.value;
	
	    this.dispatchEvent(new Event_(this, HistoryEvent.STATE_POP, null));
	};
	
	History.prototype.getNumStates = function () {
	    return this._states.length;
	};
	
	History._instance = null;
	
	History.setup = function () {
	    return History._instance = new History();
	};
	
	History.get = function () {
	    return History._instance;
	};
	
	History.prototype.enable = function () {
	    this._enabled = false;
	};
	History.prototype.disable = function () {
	    this._enabled = true;
	};
	
	module.exports = History;

/***/ },
/* 28 */
/*!***********************************************!*\
  !*** ./~/controlkit/lib/core/HistoryEvent.js ***!
  \***********************************************/
/***/ function(module, exports) {

	var HistoryEvent = {
		STATE_PUSH: 'historyStatePush',
		STATE_POP: 'historyStatePop'
	};
	
	module.exports = HistoryEvent;

/***/ },
/* 29 */
/*!********************************************!*\
  !*** ./~/controlkit/lib/core/Component.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(/*! ./document/Node */ 10),
	    CSS = __webpack_require__(/*! ./document/CSS */ 17);
	var EventDispatcher = __webpack_require__(/*! ./event/EventDispatcher */ 14),
	    ComponentEvent  = __webpack_require__(/*! ./ComponentEvent */ 25);
	
	function Component(parent,label) {
	    EventDispatcher.apply(this,arguments);
	
	    label = parent.usesLabels() ? label : 'none';
	
	    this._parent  = parent;
	    this._enabled = true;
	
	    var root = this._node = new Node(Node.LIST_ITEM),
	        wrap = this._wrapNode = new Node();
	        wrap.setStyleClass(CSS.Wrap);
	        root.addChild(wrap);
	
	    if (label !== undefined) {
	        if (label.length != 0 && label != 'none') {
	            var label_ = this._lablNode = new Node(Node.SPAN);
	                label_.setStyleClass(CSS.Label);
	                label_.setProperty('innerHTML', label);
	                root.addChild(label_);
	        }
	
	        if (label == 'none') {
	            wrap.setStyleProperty('marginLeft', '0');
	            wrap.setStyleProperty('width', '100%');
	        }
	    }
	
	    this._parent.addEventListener(ComponentEvent.ENABLE, this,'onEnable');
	    this._parent.addEventListener(ComponentEvent.DISABLE,this,'onDisable');
	    this._parent.addComponentNode(root);
	}
	Component.prototype = Object.create(EventDispatcher.prototype);
	Component.prototype.constructor = Component;
	
	Component.prototype.enable = function () {
	    this._enabled = true;
	};
	
	Component.prototype.disable = function () {
	    this._enabled = false;
	};
	
	Component.prototype.isEnabled = function () {
	    return this._enabled;
	};
	Component.prototype.isDisabled = function () {
	    return !this._enabled;
	};
	
	Component.prototype.onEnable = function () {
	    this.enable();
	};
	
	Component.prototype.onDisable = function () {
	    this.disable();
	};
	
	module.exports = Component;

/***/ },
/* 30 */
/*!**********************************************************!*\
  !*** ./~/controlkit/lib/core/ObjectComponentNotifier.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventDispatcher = __webpack_require__(/*! ./event/EventDispatcher */ 14),
		Event_ 			= __webpack_require__(/*! ./event/Event */ 21);
	var ComponentEvent  = __webpack_require__(/*! ./ComponentEvent */ 25),
		OptionEvent		= __webpack_require__(/*! ./OptionEvent */ 31);
	
	function ObjectComponentNotifier(){
		EventDispatcher.apply(this);
	}
	ObjectComponentNotifier.prototype = Object.create(EventDispatcher.prototype);
	ObjectComponentNotifier.prototype.constructor = ObjectComponentNotifier;
	
	ObjectComponentNotifier.prototype.onValueUpdated = function (e) {
		this.dispatchEvent(new Event_(this, ComponentEvent.UPDATE_VALUE, {origin: e.sender}));
	};
	
	ObjectComponentNotifier.prototype.onOptionTriggered = function(e) {
		this.dispatchEvent(new Event_(this, OptionEvent.TRIGGER, {origin: e.sender}));
	};
	
	var instance = null;
	
	ObjectComponentNotifier.get = function(){
		if(!instance){
			instance = new ObjectComponentNotifier();
		}
		return instance;
	};
	
	ObjectComponentNotifier.destroy = function(){
		instance = null;
	};
	
	module.exports = ObjectComponentNotifier;

/***/ },
/* 31 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/core/OptionEvent.js ***!
  \**********************************************/
/***/ function(module, exports) {

	var OptionEvent = {
		TRIGGERED: 'selectTrigger',
		TRIGGER: 'triggerSelect'
	};
	module.exports = OptionEvent;

/***/ },
/* 32 */
/*!*******************************************************!*\
  !*** ./~/controlkit/lib/core/ComponentObjectError.js ***!
  \*******************************************************/
/***/ function(module, exports) {

	function ComponentObjectError(object,key) {
		Error.apply(this);
		Error.captureStackTrace(this,ComponentObjectError);
		this.name = 'ComponentObjectError';
		this.message = 'Object of type ' + object.constructor.name + ' has no member ' + key + '.';
	}
	ComponentObjectError.prototype = Object.create(Error.prototype);
	ComponentObjectError.prototype.constructor = ComponentObjectError;
	
	module.exports = ComponentObjectError;

/***/ },
/* 33 */
/*!****************************************************!*\
  !*** ./~/controlkit/lib/component/ValuePlotter.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Plotter = __webpack_require__(/*! ./Plotter */ 34);
	var Metric  = __webpack_require__(/*! ./Metric */ 16);
	
	var DEFAULT_RESOLUTION = 1;
	
	function ValuePlotter(parent,object,value,params) {
	    Plotter.apply(this,arguments);
	
	    var svg       = this._svg,
	        svgWidth  = Number(svg.getAttribute('width')),
	        svgHeight = Number(svg.getAttribute('height'));
	
	    params            = params            || {};
	    params.height     = params.height     || svgHeight;
	    params.resolution = params.resolution || DEFAULT_RESOLUTION;
	
	    var resolution = params.resolution,
	        length     = Math.floor(svgWidth / resolution);
	
	    var points     = this._points  = new Array(length * 2),
	        buffer0    = this._buffer0 = new Array(length),
	        buffer1    = this._buffer1 = new Array(length);
	
	    var min = this._lineWidth * 0.5;
	
	    var i = -1;
	    while (++i < length) {
	        buffer0[i] = buffer1[i] = points[i * 2] = points[i * 2 + 1] = min;
	    }
	
	    this._height = params.height = params.height  < Metric.COMPONENT_MIN_HEIGHT ?
	                   Metric.COMPONENT_MIN_HEIGHT : params.height;
	
	    this._svgSetSize(svgHeight,Math.floor(params.height));
	    this._grid.style.stroke = 'rgb(39,44,46)';
	
	    this._updateHeight();
	    this._drawValue();
	}
	ValuePlotter.prototype = Object.create(Plotter.prototype);
	ValuePlotter.prototype.constructor = ValuePlotter;
	
	ValuePlotter.prototype._redraw = function () {
	    var points = this._points,
	        bufferLen = this._buffer0.length;
	
	    var width = Number(this._svg.getAttribute('width')),
	        ratio = width / (bufferLen - 1);
	
	    var i = -1;
	    while (++i < bufferLen) {
	        points[i * 2] = width - i * ratio;
	    }
	
	    this._drawValue();
	};
	
	ValuePlotter.prototype.onGroupSizeChange = function () {
	    var width = this._wrapNode.getWidth(),
	        height = this._height;
	
	    this._svgSetSize(width, height);
	    this._updateHeight();
	    this._drawGrid();
	    this._redraw();
	};
	
	ValuePlotter.prototype._drawValue = function () {
	    this._drawCurve();
	};
	
	ValuePlotter.prototype._drawGrid = function () {
	    var svg = this._svg;
	
	    var svgWidth = Number(svg.getAttribute('width')),
	        svgHeightHalf = Math.floor(Number(svg.getAttribute('height')) * 0.5);
	
	    var pathCmd = '';
	        pathCmd += this._pathCmdMoveTo(0, svgHeightHalf);
	        pathCmd += this._pathCmdLineTo(svgWidth, svgHeightHalf);
	
	    this._grid.setAttribute('d', pathCmd);
	};
	
	//TODO: merge update + pathcmd
	ValuePlotter.prototype._drawCurve = function () {
	    var svg = this._svg;
	
	    var value = this._obj[this._key];
	
	    var buffer0 = this._buffer0,
	        buffer1 = this._buffer1,
	        points = this._points;
	
	    var bufferLength = buffer0.length;
	
	    var pathCmd = '';
	
	    var heightHalf = Number(svg.getAttribute('height')) * 0.5,
	        unit = heightHalf - this._lineWidth * 0.5;
	
	    points[1] = buffer0[0];
	    buffer0[bufferLength - 1] = (value * unit) * -1 + Math.floor(heightHalf);
	
	    pathCmd += this._pathCmdMoveTo(points[0], points[1]);
	
	    var i = 0, index;
	
	    while (++i < bufferLength) {
	        index = i * 2;
	
	        buffer1[i - 1] = buffer0[i];
	        points[index + 1] = buffer0[i - 1] = buffer1[i - 1];
	
	        pathCmd += this._pathCmdLineTo(points[index], points[index + 1]);
	    }
	
	    this._path.setAttribute('d', pathCmd);
	};
	
	ValuePlotter.prototype.update = function () {
	    if (this._parent.isDisabled())return;
	    this._drawValue();
	}
	
	
	module.exports = ValuePlotter;
	


/***/ },
/* 34 */
/*!***********************************************!*\
  !*** ./~/controlkit/lib/component/Plotter.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var SVGComponent = __webpack_require__(/*! ./SVGComponent */ 35);
	
	function Plotter(parent,object,value,params) {
	    params = params || {};
	    params.lineWidth  = params.lineWidth  || 2;
	    params.lineColor  = params.lineColor  || [255,255,255];
	
	    SVGComponent.apply(this,arguments);
	
	    var lineWidth = this._lineWidth = params.lineWidth;
	    var lineColor = params.lineColor;
	
	    var grid = this._grid = this._svgRoot.appendChild(this._createSVGObject('path'));
	        grid.style.stroke = 'rgb(26,29,31)';
	
	    var path = this._path = this._svgRoot.appendChild(this._createSVGObject('path'));
	        path.style.stroke      = 'rgb('+lineColor[0]+','+lineColor[1]+','+lineColor[2]+')';
	        path.style.strokeWidth = lineWidth ;
	        path.style.fill        = 'none';
	}
	Plotter.prototype = Object.create(SVGComponent.prototype);
	Plotter.prototype.constructor = Plotter;
	
	module.exports = Plotter;


/***/ },
/* 35 */
/*!****************************************************!*\
  !*** ./~/controlkit/lib/component/SVGComponent.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectComponent = __webpack_require__(/*! ../core/ObjectComponent */ 26);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	var GroupEvent = __webpack_require__(/*! ../group/GroupEvent */ 24);
	var Metric = __webpack_require__(/*! ./Metric */ 16);
	
	function SVGComponent(parent,object,value,params){
	    ObjectComponent.apply(this,arguments);
	
	    var wrap = this._wrapNode;
	        wrap.setStyleClass(CSS.SVGWrap);
	    var wrapSize = wrap.getWidth();
	
	    var svg = this._svg = this._createSVGObject('svg');
	        svg.setAttribute('version', '1.2');
	        svg.setAttribute('baseProfile', 'tiny');
	
	        wrap.getElement().appendChild(svg);
	
	    var svgRoot = this._svgRoot = svg.appendChild(this._createSVGObject('g'));
	        svgRoot.setAttribute('transform','translate(0.5 0.5)');
	
	    this._svgSetSize(wrapSize,wrapSize);
	    this._updateHeight();
	
	    this._node.setStyleClass(CSS.SVGListItem);
	
	    this._parent.addEventListener(GroupEvent.GROUP_SIZE_CHANGE, this, 'onGroupSizeChange');
	    this.addEventListener(GroupEvent.GROUP_SIZE_UPDATE, this._parent, 'onGroupSizeUpdate');
	}
	SVGComponent.prototype = Object.create(ObjectComponent.prototype);
	SVGComponent.prototype.constructor = SVGComponent;
	
	SVGComponent.prototype._updateHeight = function(){
	    var svgHeight = Number(this._svg.getAttribute('height'));
	
	    this._wrapNode.setHeight(svgHeight);
	    this._node.setHeight(svgHeight + Metric.PADDING_WRAPPER);
	};
	
	SVGComponent.prototype._redraw = function(){};
	
	SVGComponent.prototype.onGroupSizeChange = function(){
	    var width = this._wrapNode.getWidth();
	
	    this._svgSetSize(width,width);
	    this._updateHeight();
	    this._redraw();
	};
	
	SVGComponent.prototype._createSVGObject = function(type) {
	    return document.createElementNS("http://www.w3.org/2000/svg",type);
	};
	
	SVGComponent.prototype._svgSetSize = function(width,height) {
	    var svg = this._svg;
	        svg.setAttribute('width',  width);
	        svg.setAttribute('height', height);
	        svg.setAttribute('viewbox', '0 0 ' + width + ' ' + height);
	};
	
	
	SVGComponent.prototype._pathCmdMoveTo = function (x, y) {
	    return 'M ' + x + ' ' + y + ' ';
	};
	
	SVGComponent.prototype._pathCmdLineTo = function (x, y) {
	    return 'L ' + x + ' ' + y + ' ';
	};
	
	SVGComponent.prototype._pathCmdClose = function () {
	    return 'Z';
	};
	
	SVGComponent.prototype._pathCmdLine = function (x0, y0, x1, y1) {
	    return 'M ' + x0 + ' ' + y0 + ' L ' + x1 + ' ' + y1;
	};
	
	SVGComponent.prototype._pathCmdBezierCubic = function (cmd, x0, y0, cx0, cy0, cx1, cy1, x1, y1) {
	    return 'M ' + x0 + ' ' + y0 + ' C ' + cx0 + ' ' + cy0 + ', ' + cx1 + ' ' + cy1 + ', ' + x1 + ' ' + y1;
	};
	
	SVGComponent.prototype._pathCmdBezierQuadratic = function (cmd, x0, y0, cx, cy, x1, y1) {
	    return 'M ' + x0 + ' ' + y0 + ' Q ' + cx + ' ' + cy + ', ' + x1 + ' ' + y1;
	};
	
	module.exports = SVGComponent;

/***/ },
/* 36 */
/*!*******************************************************!*\
  !*** ./~/controlkit/lib/component/FunctionPlotter.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Plotter = __webpack_require__(/*! ./Plotter */ 34);
	
	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	var FunctionPlotType = __webpack_require__(/*! ./FunctionPlotType */ 37);
	
	
	var Mouse = __webpack_require__(/*! ../core/document/Mouse */ 20);
	var Metric = __webpack_require__(/*! ./Metric */ 16);
	
	var DocumentEvent  = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25),
	    NodeEvent      = __webpack_require__(/*! ../core/document/NodeEvent */ 19);
	
	var FunctionPlotterObjectError       = __webpack_require__(/*! ./FunctionPlotterObjectError */ 38),
	    FunctionPlotterFunctionArgsError = __webpack_require__(/*! ./FunctionPlotterFunctionArgsError */ 39);
	
	var ObjectComponentNotifier = __webpack_require__(/*! ../core/ObjectComponentNotifier */ 30);
	
	var DEFAULT_SHOW_MIN_MAX_LABELS = true;
	
	var DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_UNIT_X  =  1,
	    DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_UNIT_Y  =  1,
	    DEFAULT_FUNCTION_PLOTTER_IMPLICIT_UNIT_X  = 0.25,
	    DEFAULT_FUNCTION_PLOTTER_IMPLICIT_UNIT_Y  = 0.25,
	    DEFAULT_FUNCTION_PLOTTER_UNIT_MIN  = 0.15,
	    DEFAULT_FUNCTION_PLOTTER_UNIT_MAX  = 4,
	    DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_SCALE  = 10.0,
	    DEFAULT_FUNCTION_PLOTTER_IMPLICIT_SCALE = 1.0,
	    DEFAULT_FUNCTION_PLOTTER_SCALE_MIN = 0.02,
	    DEFAULT_FUNCTION_PLOTTER_SCALE_MAX = 25,
	
	    DEFAULT_FUNCTION_PLOTTER_IMPLICIT_AXES_COLOR = 'rgba(255,255,255,0.75)',
	    DEFAULT_FUNCTION_PLOTTER_IMPLICIT_GRID_COLOR = 'rgba(25,25,25,0.75)',
	
	    DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_AXES_COLOR = 'rgb(54,60,64)',
	    DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_GRID_COLOR = 'rgb(25,25,25)',
	
	    DEFAULT_FUNCTION_PLOTTER_CIRCLE_LABEL_RADIUS = 3,
	    DEFAULT_FUNCTION_PLOTTER_CIRCLE_LABEL_FILL   = 'rgb(255,255,255)',
	    DEFAULT_FUNCTION_PLOTTER_CIRCLE_STROKE       = '#b12334';
	
	function FunctionPlotter(parent, object, value, params) {
	    params = params || {};
	    params.showMinMaxLabels = params.showMinMaxLabels === undefined ? DEFAULT_SHOW_MIN_MAX_LABELS : params.showMinMaxLabels;
	
	    Plotter.apply(this, arguments);
	
	    if (typeof object[value] !== 'function') {
	        throw new FunctionPlotterObjectError(object,value);
	    }
	
	    var funcArgLength = object[value].length;
	
	    if (funcArgLength > 2 || funcArgLength == 0) {
	        throw new FunctionPlotterFunctionArgsError();
	    }
	
	    var svgRoot = this._svgRoot,
	        path = this._path;
	
	    var axes = this._axes = svgRoot.insertBefore(this._createSVGObject('path'), path);
	        axes.style.strokeWidth = 1;
	
	    var axesLabels = this._axesLabels = svgRoot.insertBefore(this._createSVGObject('path'), path);
	        axesLabels.style.stroke = 'rgb(43,48,51)';
	        axesLabels.style.strokeWidth = 1;
	
	    var grid = this._grid;
	
	    var svg = this._svg,
	        size = Number(svg.getAttribute('width'));
	
	    var sliderXWrap = new Node();
	        sliderXWrap.setStyleClass(CSS.GraphSliderXWrap);
	
	    var sliderYWrap = new Node();
	        sliderYWrap.setStyleClass(CSS.GraphSliderYWrap);
	
	    var sliderXTrack = this._sliderXTrack = new Node();
	        sliderXTrack.setStyleClass(CSS.GraphSliderX);
	
	    var sliderYTrack = this._sliderYTrack = new Node();
	        sliderYTrack.setStyleClass(CSS.GraphSliderY);
	
	    var sliderXHandle = this._sliderXHandle = new Node();
	        sliderXHandle.setStyleClass(CSS.GraphSliderXHandle);
	
	    var sliderYHandle = this._sliderYHandle = new Node();
	        sliderYHandle.setStyleClass(CSS.GraphSliderYHandle);
	
	    sliderXTrack.addChild(sliderXHandle);
	    sliderYTrack.addChild(sliderYHandle);
	    sliderXWrap.addChild(sliderXTrack);
	    sliderYWrap.addChild(sliderYTrack);
	
	    var wrapNode = this._wrapNode;
	
	    var plotMode = this._plotMode = funcArgLength == 1 ?
	        FunctionPlotType.NON_IMPLICIT :
	        FunctionPlotType.IMPLICIT;
	
	    if (plotMode == FunctionPlotType.IMPLICIT) {
	        var canvas = this._canvas = document.createElement('canvas');
	        canvas.style.width = canvas.style.height = size + 'px';
	        canvas.width = canvas.height = size;
	
	        wrapNode.getElement().insertBefore(canvas, svg);
	
	        this._canvasContext = canvas.getContext('2d');
	        this._canvasImageData = this._canvasContext.getImageData(0, 0, size, size);
	
	        axes.style.stroke = DEFAULT_FUNCTION_PLOTTER_IMPLICIT_AXES_COLOR;
	        grid.style.stroke = DEFAULT_FUNCTION_PLOTTER_IMPLICIT_GRID_COLOR;
	    }
	    else {
	        axes.style.stroke = DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_AXES_COLOR;
	        grid.style.stroke = DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_GRID_COLOR;
	    }
	
	    wrapNode.addChild(sliderXWrap);
	    wrapNode.addChild(sliderYWrap);
	
	    sliderXHandle.addEventListener(NodeEvent.MOUSE_DOWN, this._onSliderXHandleDown.bind(this));
	    sliderYHandle.addEventListener(NodeEvent.MOUSE_DOWN, this._onSliderYHandleDown.bind(this));
	
	    var units = this._units = [null, null];
	    this._scale = null;
	
	    if (plotMode == FunctionPlotType.NON_IMPLICIT) {
	        units[0] = DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_UNIT_X;
	        units[1] = DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_UNIT_Y;
	
	        this._scale = DEFAULT_FUNCTION_PLOTTER_NON_IMPLICIT_SCALE;
	    }
	    else if (plotMode == FunctionPlotType.IMPLICIT) {
	        units[0] = DEFAULT_FUNCTION_PLOTTER_IMPLICIT_UNIT_X;
	        units[1] = DEFAULT_FUNCTION_PLOTTER_IMPLICIT_UNIT_Y;
	
	        this._scale = DEFAULT_FUNCTION_PLOTTER_IMPLICIT_SCALE;
	    }
	
	    this._unitsMinMax = [DEFAULT_FUNCTION_PLOTTER_UNIT_MIN, DEFAULT_FUNCTION_PLOTTER_UNIT_MAX]; //1/8->4
	
	    this._scaleMinMax = [DEFAULT_FUNCTION_PLOTTER_SCALE_MIN, DEFAULT_FUNCTION_PLOTTER_SCALE_MAX]; //1/50 -> 25
	
	    this._center = [Math.round(size * 0.5),Math.round(size * 0.5)];
	    this._svgPos = [0, 0];
	
	    this._func = null;
	    this.setFunction(this._obj[this._key]);
	
	    this._sliderXHandleUpdate();
	    this._sliderYHandleUpdate();
	
	    svg.addEventListener(DocumentEvent.MOUSE_DOWN, this._onDragStart.bind(this), false);
	    this._wrapNode.getElement().addEventListener("mousewheel", this._onScale.bind(this, false));
	
	    ObjectComponentNotifier.get().addEventListener(ComponentEvent.UPDATE_VALUE, this, 'onValueUpdate');
	}
	FunctionPlotter.prototype = Object.create(Plotter.prototype);
	FunctionPlotter.prototype.constructor = FunctionPlotter;
	
	FunctionPlotter.prototype._updateCenter = function () {
	    var svg = this._svg,
	        width = Number(svg.getAttribute('width')),
	        height = Number(svg.getAttribute('height'));
	
	    var mousePos = Mouse.get().getPosition(),
	        svgPos = this._svgPos,
	        center = this._center;
	
	    center[0] = Math.max(0, Math.min(mousePos[0] - svgPos[0], width));
	    center[1] = Math.max(0, Math.min(mousePos[1] - svgPos[1], height));
	
	    this._plotGraph();
	};
	
	FunctionPlotter.prototype._onDragStart = function (e) {
	    var svgPos = this._svgPos;
	    svgPos[0] = 0;
	    svgPos[1] = 0;
	
	    //skip to container
	    var element = this._svg.parentNode;
	
	    while (element) {
	        svgPos[0] += element.offsetLeft;
	        svgPos[1] += element.offsetTop;
	        element = element.offsetParent;
	    }
	
	    var eventMove = DocumentEvent.MOUSE_MOVE,
	        eventUp = DocumentEvent.MOUSE_UP;
	
	    var onDrag = this._updateCenter.bind(this),
	        onDragEnd = function () {
	            this._updateCenter.bind(this);
	            document.removeEventListener(eventMove, onDrag, false);
	            document.removeEventListener(eventUp, onDragEnd, false);
	
	        }.bind(this);
	
	    document.addEventListener(eventMove, onDrag, false);
	    document.addEventListener(eventUp, onDragEnd, false);
	
	    this._updateCenter();
	};
	
	FunctionPlotter.prototype._onScale = function (e) {
	    e = window.event || e;
	    this._scale += Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * -1;
	
	    var scaleMinMax = this._scaleMinMax;
	    this._scale = Math.max(scaleMinMax[0], Math.min(this._scale, scaleMinMax[1]));
	
	    this._plotGraph();
	
	    e.preventDefault();
	
	};
	
	FunctionPlotter.prototype.onValueUpdate = function () {
	    this.setFunction(this._obj[this._key]);
	};
	
	FunctionPlotter.prototype._redraw = function () {
	    if (this._plotMode == FunctionPlotType.IMPLICIT) {
	        var size = this._wrapNode.getWidth(),
	            canvas = this._canvas;
	
	        canvas.style.width = canvas.style.height = size + 'px';
	        canvas.width = canvas.height = size;
	
	        this._canvasImageData = this._canvasContext.getImageData(0, 0, size, size);
	    }
	
	    this._sliderXHandleUpdate();
	    this._sliderYHandleUpdate();
	
	    this.setFunction(this._obj[this._key]);
	};
	
	FunctionPlotter.prototype.setFunction = function (func) {
	    this._func = func.bind(this._obj);
	    this._plotGraph();
	};
	
	FunctionPlotter.prototype._plotGraph = function () {
	    this._drawGrid();
	    this._drawAxes();
	    this._drawPlot();
	};
	
	FunctionPlotter.prototype._drawAxes = function () {
	    var svg = this._svg,
	        svgWidth = Number(svg.getAttribute('width')),
	        svgHeight = Number(svg.getAttribute('height'));
	
	    var center = this._center,
	        centerX = center[0],
	        centerY = center[1];
	
	    var pathCmd = '';
	    pathCmd += this._pathCmdLine(0, centerY, svgWidth, centerY);
	    pathCmd += this._pathCmdLine(centerX, 0, centerX, svgHeight);
	
	    this._axes.setAttribute('d', pathCmd);
	};
	
	FunctionPlotter.prototype._drawPlot = function () {
	    var width, height;
	
	    var center = this._center,
	        centerX = center[0],
	        centerY = center[1];
	
	    var units = this._units,
	        unitX, unitY;
	
	    var scale = this._scale;
	    var normval, scaledVal, value, index;
	    var offsetX, offsetY;
	
	    var i;
	
	    if (this._plotMode == FunctionPlotType.NON_IMPLICIT) {
	        var svg = this._svg;
	
	        width = Number(svg.getAttribute('width'));
	        height = Number(svg.getAttribute('height'));
	        unitX = units[0] * scale;
	        unitY = height / (units[1] * scale);
	        offsetX = centerX / width;
	
	        var len = Math.floor(width),
	            points = new Array(len * 2);
	
	        i = -1;
	        while (++i < len) {
	            normval = (-offsetX + i / len);
	            scaledVal = normval * unitX;
	            value = centerY - this._func(scaledVal) * unitY;
	
	            index = i * 2;
	
	            points[index] = i;
	            points[index + 1] = value;
	        }
	
	        var pathCmd = '';
	        pathCmd += this._pathCmdMoveTo(points[0], points[1]);
	
	        i = 2;
	        while (i < points.length) {
	            pathCmd += this._pathCmdLineTo(points[i], points[i + 1]);
	            i += 2;
	        }
	
	        this._path.setAttribute('d', pathCmd);
	    }
	    else {
	        var canvas = this._canvas,
	            context = this._canvasContext,
	            imgData = this._canvasImageData;
	
	        width = canvas.width;
	        height = canvas.height;
	
	        unitX = units[0] * scale;
	        unitY = units[1] * scale;
	
	        offsetX = centerX / width;
	        offsetY = centerY / height;
	
	        var invWidth = 1 / width,
	            invHeight = 1 / height;
	        var rgb = [0, 0, 0];
	
	        var col0 = [30, 34, 36],
	            col1 = [255, 255, 255];
	
	        i = -1;
	        var j;
	        while (++i < height) {
	            j = -1;
	
	            while (++j < width) {
	                value = this._func((-offsetX + j * invWidth) * unitX,
	                    (-offsetY + i * invHeight) * unitY);
	
	                rgb[0] = Math.floor((col1[0] - col0[0]) * value + col0[0]);
	                rgb[1] = Math.floor((col1[1] - col0[1]) * value + col0[1]);
	                rgb[2] = Math.floor((col1[2] - col0[2]) * value + col0[2]);
	
	                index = (i * width + j) * 4;
	
	                imgData.data[index] = rgb[0];
	                imgData.data[index + 1] = rgb[1];
	                imgData.data[index + 2] = rgb[2];
	                imgData.data[index + 3] = 255;
	            }
	        }
	
	        context.clearRect(0, 0, width, height);
	        context.putImageData(imgData, 0, 0);
	    }
	};
	
	FunctionPlotter.prototype._drawGrid = function () {
	    var svg = this._svg,
	        width = Number(svg.getAttribute('width')),
	        height = Number(svg.getAttribute('height'));
	
	    var scale = this._scale;
	
	    var gridRes = this._units,
	        gridSpacingX = width / (gridRes[0] * scale),
	        gridSpacingY = height / (gridRes[1] * scale);
	
	    var center = this._center,
	        centerX = center[0],
	        centerY = center[1];
	
	    var gridNumTop = Math.round(centerY / gridSpacingY) + 1,
	        gridNumBottom = Math.round((height - centerY) / gridSpacingY) + 1,
	        gridNumLeft = Math.round(centerX / gridSpacingX) + 1,
	        gridNumRight = Math.round((width - centerX) / gridSpacingX) + 1;
	
	    var pathCmdGrid = '',
	        pathCmdAxesLabels = '';
	
	    var i, temp;
	
	    var strokeSize = Metric.STROKE_SIZE;
	
	    var labelTickSize = Metric.FUNCTION_PLOTTER_LABEL_TICK_SIZE,
	        labelTickPaddingRight = width - labelTickSize - strokeSize,
	        labelTickPaddingBottom = height - labelTickSize - strokeSize,
	        labelTickPaddingRightOffset = labelTickPaddingRight - labelTickSize,
	        labelTickPaddingBottomOffset = labelTickPaddingBottom - labelTickSize,
	        labelTickOffsetRight = labelTickPaddingRight - (labelTickSize + strokeSize) * 2,
	        labelTickOffsetBottom = labelTickPaddingBottom - (labelTickSize + strokeSize) * 2;
	
	    i = -1;
	    while (++i < gridNumTop) {
	        temp = Math.round(centerY - gridSpacingY * i);
	        pathCmdGrid += this._pathCmdLine(0, temp, width, temp);
	
	        if (temp > labelTickSize){
	            pathCmdAxesLabels += this._pathCmdLine(labelTickPaddingRight, temp,
	                labelTickPaddingRightOffset, temp);
	        }
	    }
	
	    i = -1;
	    while (++i < gridNumBottom) {
	        temp = Math.round(centerY + gridSpacingY * i);
	        pathCmdGrid += this._pathCmdLine(0, temp, width, temp);
	
	        if (temp < labelTickOffsetBottom){
	            pathCmdAxesLabels += this._pathCmdLine(labelTickPaddingRight, temp,
	                labelTickPaddingRightOffset, temp);
	        }
	    }
	
	    i = -1;
	    while (++i < gridNumLeft) {
	        temp = Math.round(centerX - gridSpacingX * i);
	        pathCmdGrid += this._pathCmdLine(temp, 0, temp, height);
	
	        if (temp > labelTickSize){
	            pathCmdAxesLabels += this._pathCmdLine(temp, labelTickPaddingBottom,
	                temp, labelTickPaddingBottomOffset);
	        }
	    }
	
	    i = -1;
	    while (++i < gridNumRight) {
	        temp = Math.round(centerX + gridSpacingX * i);
	        pathCmdGrid += this._pathCmdLine(temp, 0, temp, height);
	
	        if (temp < labelTickOffsetRight){
	            pathCmdAxesLabels += this._pathCmdLine(temp, labelTickPaddingBottom,
	                temp, labelTickPaddingBottomOffset);
	        }
	    }
	
	    this._grid.setAttribute('d', pathCmdGrid);
	    this._axesLabels.setAttribute('d', pathCmdAxesLabels);
	};
	
	
	FunctionPlotter.prototype._sliderXStep = function (mousePos) {
	    var mouseX = mousePos[0];
	
	    var handle = this._sliderXHandle,
	        handleWidth = handle.getWidth(),
	        handleWidthHalf = handleWidth * 0.5;
	
	    var track = this._sliderXTrack,
	        trackWidth = track.getWidth(),
	        trackLeft = track.getPositionGlobalX();
	
	    var strokeSize = Metric.STROKE_SIZE;
	
	    var max = trackWidth - handleWidthHalf - strokeSize * 2;
	
	    var pos = Math.max(handleWidthHalf, Math.min(mouseX - trackLeft, max)),
	        handlePos = pos - handleWidthHalf;
	
	    handle.setPositionX(handlePos);
	
	    var unitsMin = this._unitsMinMax[0],
	        unitsMax = this._unitsMinMax[1];
	
	    var normVal = (pos - handleWidthHalf) / (max - handleWidthHalf),
	        mappedVal = unitsMin + (unitsMax - unitsMin) * normVal;
	
	    this._units[0] = mappedVal;
	
	    this._plotGraph();
	};
	
	FunctionPlotter.prototype._sliderYStep = function (mousePos) {
	    var mouseY = mousePos[1];
	
	    var handle = this._sliderYHandle,
	        handleHeight = handle.getHeight(),
	        handleHeightHalf = handleHeight * 0.5;
	
	    var track = this._sliderYTrack,
	        trackHeight = track.getHeight(),
	        trackTop = track.getPositionGlobalY();
	
	    var max = trackHeight - handleHeightHalf - 2;
	
	    var pos = Math.max(handleHeightHalf, Math.min(mouseY - trackTop, max)),
	        handlePos = pos - handleHeightHalf;
	
	    handle.setPositionY(handlePos);
	
	    var unitsMax = this._unitsMinMax[0],
	        unitsMin = this._unitsMinMax[1];
	
	    var normVal = (pos - handleHeightHalf) / (max - handleHeightHalf),
	        mappedVal = unitsMin + (unitsMax - unitsMin) * normVal;
	
	    this._units[1] = mappedVal;
	
	    this._plotGraph();
	};
	
	FunctionPlotter.prototype._onSliderXHandleDown = function () {
	    this._onSliderHandleDown(this._sliderXStep.bind(this));
	};
	
	FunctionPlotter.prototype._onSliderYHandleDown = function () {
	    this._onSliderHandleDown(this._sliderYStep.bind(this));
	};
	
	FunctionPlotter.prototype._onSliderHandleDown = function (sliderStepFunc) {
	    var eventMouseMove = DocumentEvent.MOUSE_MOVE,
	        eventMouseUp = DocumentEvent.MOUSE_UP;
	
	    var mouse = Mouse.get();
	
	    var onDrag = function () {
	            sliderStepFunc(mouse.getPosition())
	        },
	        onDragEnd = function () {
	            document.removeEventListener(eventMouseMove, onDrag, false);
	            document.removeEventListener(eventMouseUp, onDragEnd, false);
	        };
	
	    sliderStepFunc(mouse.getPosition());
	    document.addEventListener(eventMouseMove, onDrag, false);
	    document.addEventListener(eventMouseUp, onDragEnd, false);
	};
	
	FunctionPlotter.prototype._sliderXHandleUpdate = function () {
	    var unitMin = this._unitsMinMax[0],
	        unitMax = this._unitsMinMax[1],
	        unitX = this._units[0];
	
	    var handleX = this._sliderXHandle,
	        handleXWidth = handleX.getWidth(),
	        handleXWidthHalf = handleXWidth * 0.5,
	        trackXWidth = this._sliderXTrack.getWidth();
	
	    var strokeSize = Metric.STROKE_SIZE;
	
	    var handleXMin = handleXWidthHalf,
	        handleXMax = trackXWidth - handleXWidthHalf - strokeSize * 2;
	
	    handleX.setPositionX((handleXMin + (handleXMax - handleXMin) * ((unitX - unitMin) / (unitMax - unitMin))) - handleXWidthHalf);
	};
	
	FunctionPlotter.prototype._sliderYHandleUpdate = function () {
	    var unitMin = this._unitsMinMax[0],
	        unitMax = this._unitsMinMax[1],
	        unitY = this._units[1];
	
	    var handleY = this._sliderYHandle,
	        handleYHeight = handleY.getHeight(),
	        handleYHeightHalf = handleYHeight * 0.5,
	        trackYHeight = this._sliderYTrack.getHeight();
	
	    var strokeSize = Metric.STROKE_SIZE;
	
	    var handleYMin = trackYHeight - handleYHeightHalf - strokeSize * 2,
	        handleYMax = handleYHeightHalf;
	
	    handleY.setPositionY((handleYMin + (handleYMax - handleYMin) * ((unitY - unitMin) / (unitMax - unitMin))) - handleYHeightHalf);
	};
	
	module.exports = FunctionPlotter;

/***/ },
/* 37 */
/*!********************************************************!*\
  !*** ./~/controlkit/lib/component/FunctionPlotType.js ***!
  \********************************************************/
/***/ function(module, exports) {

	var FunctionPlotType = {
	    IMPLICIT: 'implicit',
	    NON_IMPLICIT: 'nonImplicit'
	};
	
	module.exports = FunctionPlotType;

/***/ },
/* 38 */
/*!******************************************************************!*\
  !*** ./~/controlkit/lib/component/FunctionPlotterObjectError.js ***!
  \******************************************************************/
/***/ function(module, exports) {

	function FunctionPlotterObjectError(object,key){
		Error.apply(this);
		Error.captureStackTrace(this,FunctionPlotterObjectError);
		this.name = 'ComponentObjectError';
		this.message = 'Object ' + object.constructor.name + ' ' + key + 'should be of type Function.';
	}
	FunctionPlotterObjectError.prototype = Object.create(Error.prototype);
	FunctionPlotterObjectError.prototype.constructor = FunctionPlotterObjectError;
	
	module.exports = FunctionPlotterObjectError;

/***/ },
/* 39 */
/*!************************************************************************!*\
  !*** ./~/controlkit/lib/component/FunctionPlotterFunctionArgsError.js ***!
  \************************************************************************/
/***/ function(module, exports) {

	function FunctionPlotterFunctionArgsError(){
		Error.apply(this);
		Error.captureStackTrace(this,FunctionPlotterFunctionArgsError);
		this.name = 'FunctionPlotterFunctionArgsError';
		this.message = 'Function should be of form f(x) or f(x,y).';
	}
	FunctionPlotterFunctionArgsError.prototype = Object.create(Error.prototype);
	FunctionPlotterFunctionArgsError.prototype.constructor = FunctionPlotterFunctionArgsError;
	
	module.exports = FunctionPlotterFunctionArgsError;

/***/ },
/* 40 */
/*!****************************************************!*\
  !*** ./~/controlkit/lib/core/layout/LayoutMode.js ***!
  \****************************************************/
/***/ function(module, exports) {

	var LayoutMode = {
	    LEFT   : 'left',
	    RIGHT  : 'right',
	    TOP    : 'top',
	    BOTTOM : 'bottom',
	    NONE   : 'none'
	};
	
	module.exports = LayoutMode;

/***/ },
/* 41 */
/*!*********************************************!*\
  !*** ./~/controlkit/lib/group/MenuEvent.js ***!
  \*********************************************/
/***/ function(module, exports) {

	var MenuEvent = {
		UPDATE_MENU: 'updateMenu'
	};
	module.exports = MenuEvent;

/***/ },
/* 42 */
/*!***************************************************!*\
  !*** ./~/controlkit/lib/component/StringInput.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectComponent = __webpack_require__(/*! ../core/ObjectComponent */ 26);
	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	var Options = __webpack_require__(/*! ./Options */ 43);
	var ButtonPreset = __webpack_require__(/*! ./ButtonPreset */ 46);
	var Metric = __webpack_require__(/*! ./Metric */ 16);
	
	var Event_ = __webpack_require__(/*! ../core/event/Event */ 21),
	    DocumentEvent = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    NodeEvent = __webpack_require__(/*! ../core/document/NodeEvent */ 19),
	    ComponentEvent =  __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	var DEFAULT_PRESET = null;
	
	function StringInput(parent,object,value,params) {
	    ObjectComponent.apply(this,arguments);
	
	    params          = params || {};
	    params.onChange = params.onChange || this._onChange;
	    params.presets  = params.presets  || DEFAULT_PRESET;
	
	    this._onChange   = params.onChange;
	
	    var input = this._input = new Node(Node.INPUT_TEXT);
	
	    var wrap = this._wrapNode;
	
	    var presets = params.presets;
	    if (!presets) {
	        wrap.addChild(input);
	    }
	    else {
	        var wrap_ = new Node();
	        wrap_.setStyleClass(CSS.WrapInputWPreset);
	
	        wrap.addChild(wrap_);
	        wrap_.addChild(input);
	
	        var options = Options.get(),
	            btnPreset = new ButtonPreset(this._wrapNode);
	
	        var onPresetDeactivate = function () {
	            options.clear();
	            btnPreset.deactivate();
	        };
	
	        var self = this;
	        var onPresetActivate = function () {
	            options.build(presets,
	                input.getProperty('value'),
	                input,
	                function () {
	                    input.setProperty('value', presets[options.getSelectedIndex()]);
	                    self.pushHistoryState();
	                    self.applyValue();
	                },
	                onPresetDeactivate,
	                Metric.PADDING_PRESET,
	                false);
	        };
	
	        btnPreset.setOnActive(onPresetActivate);
	        btnPreset.setOnDeactive(onPresetDeactivate)
	    }
	
	    input.setProperty('value',this._obj[this._key]);
	
	    input.addEventListener(NodeEvent.KEY_UP, this._onInputKeyUp.bind(this));
	    input.addEventListener(NodeEvent.CHANGE, this._onInputChange.bind(this));
	
	    input.addEventListener(NodeEvent.MOUSE_DOWN, this._onInputDragStart.bind(this));
	    this.addEventListener(ComponentEvent.INPUT_SELECT_DRAG,this._parent,'onComponentSelectDrag');
	}
	StringInput.prototype = Object.create(ObjectComponent.prototype);
	StringInput.prototype.constructor = StringInput;
	
	StringInput.prototype._onInputKeyUp = function (e) {
	    if (this._keyIsChar(e.keyCode)){
	        this.pushHistoryState();
	    }
	    this.applyValue();
	    this._onChange();
	};
	
	StringInput.prototype._onInputChange = function (e) {
	    if (this._keyIsChar(e.keyCode)){
	        this.pushHistoryState();
	    }
	    this.applyValue();
	};
	
	//TODO: Finish check
	StringInput.prototype._keyIsChar = function (keyCode) {
	    return keyCode != 17 &&
	        keyCode != 18 &&
	        keyCode != 20 &&
	        keyCode != 37 &&
	        keyCode != 38 &&
	        keyCode != 39 &&
	        keyCode != 40 &&
	        keyCode != 16;
	};
	
	
	StringInput.prototype.applyValue = function () {
	    this._obj[this._key] = this._input.getProperty('value');
	    this.dispatchEvent(new Event_(this, ComponentEvent.VALUE_UPDATED, null));
	};
	
	StringInput.prototype.onValueUpdate = function (e) {
	    if (e.data.origin == this)return;
	    this._input.setProperty('value', this._obj[this._key]);
	};
	
	//Prevent chrome select drag
	StringInput.prototype._onInputDragStart = function () {
	    var eventMove = DocumentEvent.MOUSE_MOVE,
	        eventUp = DocumentEvent.MOUSE_UP;
	
	    var event = ComponentEvent.INPUT_SELECT_DRAG;
	    var self = this;
	    var onDrag = function () {
	            self.dispatchEvent(new Event_(this, event, null));
	        },
	
	        onDragFinish = function () {
	            self.dispatchEvent(new Event_(this, event, null));
	
	            document.removeEventListener(eventMove, onDrag, false);
	            document.removeEventListener(eventMove, onDragFinish, false);
	        };
	
	    this.dispatchEvent(new Event_(this, event, null));
	
	    document.addEventListener(eventMove, onDrag, false);
	    document.addEventListener(eventUp, onDragFinish, false);
	};
	
	module.exports = StringInput;

/***/ },
/* 43 */
/*!***********************************************!*\
  !*** ./~/controlkit/lib/component/Options.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	var DocumentEvent = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    NodeEvent     = __webpack_require__(/*! ../core/document/NodeEvent */ 19);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	var ColorMode = __webpack_require__(/*! ../core/color/ColorMode */ 44);
	var ColorUtil = __webpack_require__(/*! ../core/color/ColorUtil */ 45);
	var Metric = __webpack_require__(/*! ./Metric */ 16);
	
	function Options(parentNode) {
	    this._parenNode = parentNode;
	
	    var node = this._node = new Node();
	    var listNode = this._listNode = new Node(Node.LIST);
	
	    node.setStyleClass(CSS.Options);
	    node.addChild(listNode);
	
	    this._selectedIndex = null;
	    this._callbackOut = function () { };
	
	    this._unfocusable = false;
	
	    document.addEventListener(DocumentEvent.MOUSE_DOWN, this._onDocumentMouseDown.bind(this));
	    document.addEventListener(DocumentEvent.MOUSE_UP, this._onDocumentMouseUp.bind(this));
	
	    this.clear();
	}
	
	Options.prototype = {
	    _onDocumentMouseDown: function () {
	        if (!this._unfocusable)return;
	        this._callbackOut();
	    },
	
	    _onDocumentMouseUp: function () {
	        this._unfocusable = true;
	    },
	
	    build: function (entries, selected, element, callbackSelect, callbackOut, paddingRight, areColors, colorMode) {
	        this._clearList();
	
	        this._parenNode.addChild(this.getNode());
	
	        var rootNode = this._node,
	            listNode = this._listNode;
	
	        paddingRight = paddingRight || 0;
	
	        var self = this;
	
	        // build list
	        var itemNode, entry;
	        var i = -1;
	
	        if (areColors) {
	            colorMode = colorMode || ColorMode.HEX;
	
	            listNode.setStyleClass(CSS.Color);
	
	            var color, nodeColor;
	
	            while (++i < entries.length) {
	                entry = entries[i];
	                itemNode = listNode.addChild(new Node(Node.LIST_ITEM));
	                color = itemNode.addChild(new Node());
	
	                switch (colorMode) {
	                    case ColorMode.HEX:
	                        nodeColor = entry;
	                        break;
	                    case ColorMode.RGB:
	                        nodeColor = ColorUtil.RGB2HEX(entry[0], entry[1], entry[2]);
	                        break;
	                    case ColorMode.RGBfv:
	                        nodeColor = ColorUtil.RGBfv2HEX(entry[0], entry[1], entry[2]);
	                        break;
	                    case ColorMode.HSV:
	                        nodeColor = ColorUtil.HSV2RGB(entry[0], entry[1], entry[2]);
	                        break;
	                }
	
	                color.getStyle().backgroundColor = nodeColor;
	                color.getStyle().backgroundImage = 'linear-gradient( rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)';
	                color.setProperty('innerHTML', entry);
	
	                if (entry == selected)itemNode.setStyleClass(CSS.OptionsSelected);
	
	                itemNode.addEventListener(NodeEvent.MOUSE_DOWN,
	                    function () {
	                        self._selectedIndex = Array.prototype.indexOf.call(this.parentNode.children, this);
	                        callbackSelect();
	                    });
	            }
	
	        }
	        else {
	            listNode.deleteStyleClass();
	
	            while (++i < entries.length) {
	                entry = entries[i];
	
	                itemNode = listNode.addChild(new Node(Node.LIST_ITEM));
	                itemNode.setProperty('innerHTML', entry);
	                if (entry == selected)itemNode.setStyleClass(CSS.OptionsSelected);
	
	                itemNode.addEventListener(NodeEvent.MOUSE_DOWN,
	                    function () {
	                        self._selectedIndex = Array.prototype.indexOf.call(this.parentNode.children, this);
	                        callbackSelect();
	                    });
	            }
	        }
	
	        //position, set width and enable
	
	        var elementPos = element.getPositionGlobal(),
	            elementWidth = element.getWidth() - paddingRight,
	            elementHeight = element.getHeight();
	
	        var listWidth = listNode.getWidth(),
	            listHeight = listNode.getHeight(),
	            strokeOffset = Metric.STROKE_SIZE * 2;
	
	        var paddingOptions = Metric.PADDING_OPTIONS;
	
	        var width = (listWidth < elementWidth ? elementWidth : listWidth) - strokeOffset,
	            posX = elementPos[0],
	            posY = elementPos[1] + elementHeight - paddingOptions;
	
	        var windowWidth = window.innerWidth,
	            windowHeight = window.innerHeight;
	
	        var rootPosX = (posX + width) > windowWidth ? (posX - width + elementWidth - strokeOffset) : posX,
	            rootPosY = (posY + listHeight) > windowHeight ? (posY - listHeight * 0.5 - elementHeight * 0.5) : posY;
	
	        listNode.setWidth(width);
	        rootNode.setPositionGlobal(rootPosX, rootPosY);
	
	        this._callbackOut = callbackOut;
	        this._unfocusable = false;
	    },
	
	    _clearList: function () {
	        this._listNode.removeAllChildren();
	        this._listNode.deleteStyleProperty('width');
	        this._selectedIndex = null;
	        this._build = false;
	    },
	
	    clear: function () {
	        this._clearList();
	        this._callbackOut = function () {
	        };
	        this._parenNode.removeChild(this.getNode());
	
	    },
	
	    isBuild: function () {
	        return this._build;
	    },
	    getNode: function () {
	        return this._node;
	    },
	    getSelectedIndex: function () {
	        return this._selectedIndex;
	    }
	};
	
	Options.setup = function(parentNode){return Options._instance = new Options(parentNode);};
	Options.get   = function(){return Options._instance;};
	Options.destroy = function(){Options._instance = null;};
	
	module.exports = Options;

/***/ },
/* 44 */
/*!**************************************************!*\
  !*** ./~/controlkit/lib/core/color/ColorMode.js ***!
  \**************************************************/
/***/ function(module, exports) {

	var ColorMode = {
		RGB  : 'rgb',
		HSV  : 'hsv',
		HEX  : 'hex',
		RGBfv: 'rgbfv'
	};
	
	module.exports = ColorMode;

/***/ },
/* 45 */
/*!**************************************************!*\
  !*** ./~/controlkit/lib/core/color/ColorUtil.js ***!
  \**************************************************/
/***/ function(module, exports) {

	var ColorUtil = {
		HSV2RGB: function (hue, sat, val) {
			var max_hue = 360.0,
				max_sat = 100.0,
				max_val = 100.0;
	
			var min_hue = 0.0,
				min_sat = 0,
				min_val = 0;
	
			hue = hue % max_hue;
			val = Math.max(min_val, Math.min(val, max_val)) / max_val * 255.0;
	
			if (sat <= min_sat) {
				val = Math.round(val);
				return [val, val, val];
			}
			else if (sat > max_sat)sat = max_sat;
	
			sat = sat / max_sat;
	
			//http://d.hatena.ne.jp/ja9/20100903/128350434
	
			var hi = Math.floor(hue / 60.0) % 6,
				f = (hue / 60.0) - hi,
				p = val * (1 - sat),
				q = val * (1 - f * sat),
				t = val * (1 - (1 - f) * sat);
	
			var r = 0,
				g = 0,
				b = 0;
	
			switch (hi) {
				case 0:
					r = val;
					g = t;
					b = p;
					break;
				case 1:
					r = q;
					g = val;
					b = p;
					break;
				case 2:
					r = p;
					g = val;
					b = t;
					break;
				case 3:
					r = p;
					g = q;
					b = val;
					break;
				case 4:
					r = t;
					g = p;
					b = val;
					break;
				case 5:
					r = val;
					g = p;
					b = q;
					break;
				default:
					break;
			}
	
			r = Math.round(r);
			g = Math.round(g);
			b = Math.round(b);
	
			return [r, g, b];
	
		},
	
		RGB2HSV: function (r, g, b) {
			var h = 0,
				s = 0,
				v = 0;
	
			r = r / 255.0;
			g = g / 255.0;
			b = b / 255.0;
	
			var minRGB = Math.min(r, Math.min(g, b)),
				maxRGB = Math.max(r, Math.max(g, b));
	
			if (minRGB == maxRGB) {
				v = minRGB;
				return [0, 0, Math.round(v)];
			}
	
			var dd = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r),
				hh = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
	
			h = Math.round(60 * (hh - dd / (maxRGB - minRGB)));
			s = Math.round((maxRGB - minRGB) / maxRGB * 100.0);
			v = Math.round(maxRGB * 100.0);
	
			return [h, s, v];
		},
	
		RGB2HEX: function (r, g, b) {
			return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		},
	
		RGBfv2HEX: function (r, g, b) {
			return ColorUtil.RGB2HEX(Math.floor(r * 255.0),
				Math.floor(g * 255.0),
				Math.floor(b * 255.0));
		},
	
		HSV2HEX: function (h, s, v) {
			var rgb = ControlKit.ColorUtil.HSV2RGB(h, s, v);
			return ControlKit.ColorUtil.RGB2HEX(rgb[0], rgb[1], rgb[2]);
		},
	
		HEX2RGB: function (hex) {
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function (m, r, g, b) {
				return r + r + g + g + b + b;
			});
	
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
	
		},
	
		isValidHEX: function (hex) {
			return /^#[0-9A-F]{6}$/i.test(hex);
		},
	
		isValidRGB: function (r, g, b) {
			return r >= 0 && r <= 255 &&
				g >= 0 && g <= 255 &&
				b >= 0 && b <= 255;
		},
	
		isValidRGBfv: function (r, g, b) {
			return r >= 0 && r <= 1.0 &&
				g >= 0 && g <= 1.0 &&
				b >= 0 && b <= 1.0;
		}
	};
	
	module.exports = ColorUtil;

/***/ },
/* 46 */
/*!****************************************************!*\
  !*** ./~/controlkit/lib/component/ButtonPreset.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventDispatcher         = __webpack_require__(/*! ../core/event/EventDispatcher */ 14);
	var ObjectComponentNotifier = __webpack_require__(/*! ../core/ObjectComponentNotifier */ 30);
	
	var Event_      = __webpack_require__(/*! ../core/event/Event */ 21),
	    OptionEvent = __webpack_require__(/*! ../core/OptionEvent */ 31),
	    NodeEvent   = __webpack_require__(/*! ../core/document/NodeEvent */ 19);
	
	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	
	function ButtonPreset(parentNode) {
	    EventDispatcher.apply(this);
	    var node    = this._btnNode = new Node(Node.INPUT_BUTTON),
	        imgNode = this._indiNode = new Node();
	
	    this._onActive = function () {};
	    this._onDeactive = function () {};
	    this._isActive = false;
	
	    node.setStyleClass(CSS.ButtonPreset);
	    node.addEventListener(NodeEvent.MOUSE_DOWN, this._onMouseDown.bind(this));
	
	    node.addChild(imgNode);
	    parentNode.addChildAt(node, 0);
	
	    ObjectComponentNotifier.get().addEventListener(OptionEvent.TRIGGER, this, 'onOptionTrigger');
	    this.addEventListener(OptionEvent.TRIGGERED, ObjectComponentNotifier.get(), 'onOptionTriggered');
	}
	ButtonPreset.prototype = Object.create(EventDispatcher.prototype);
	ButtonPreset.prototype.constructor = ButtonPreset;
	
	ButtonPreset.prototype.onOptionTrigger = function(e){
	    if(e.data.origin == this){
	        if(!this._isActive){
	            this._onActive();
	            this._btnNode.setStyleClass(CSS.ButtonPresetActive);
	            this._isActive = true;
	        } else{
	            this._onDeactive();
	        }
	        return;
	    }
	
	    if(this._isActive){
	        this.deactivate();
	    }
	};
	
	ButtonPreset.prototype._onMouseDown = function(){
	    this.dispatchEvent(new Event_(this, OptionEvent.TRIGGERED, null));
	};
	
	ButtonPreset.prototype.setOnActive = function(func){
	    this._onActive = func;
	};
	
	ButtonPreset.prototype.setOnDeactive = function(func){
	    this._onDeactive = func;
	};
	
	ButtonPreset.prototype.deactivate = function(){
	    this._isActive = false;
	    this._btnNode.setStyleClass(CSS.ButtonPreset);
	};
	
	module.exports = ButtonPreset;


/***/ },
/* 47 */
/*!***************************************************!*\
  !*** ./~/controlkit/lib/component/NumberInput.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectComponent = __webpack_require__(/*! ../core/ObjectComponent */ 26);
	var NumberInput_Internal = __webpack_require__(/*! ./NumberInput_Internal */ 48);
	
	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	
	var Options = __webpack_require__(/*! ./Options */ 43);
	var ButtonPreset = __webpack_require__(/*! ./ButtonPreset */ 46);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17),
	    Metric = __webpack_require__(/*! ./Metric */ 16);
	
	var Event_ = __webpack_require__(/*! ../core/event/Event */ 21),
	    DocumentEvent = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    NodeEvent = __webpack_require__(/*! ../core/document/NodeEvent */ 19),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	var DEFAULT_INPUT_DP     = 2,
	    DEFAULT_INPUT_STEP   = 1,
	    DEFAULT_INPUT_PRESET = null;
	
	
	
	function NumberInput(parent,object,value,params) {
	    ObjectComponent.apply(this,arguments);
	
	    params          = params || {};
	    params.onBegin  = params.onBegin || null;
	    params.onChange = params.onChange || this._onChange;
	    params.onFinish = params.onFinish || null;
	    params.onError  = params.onError || null;
	    params.dp       = (params.dp === undefined || params.dp == null) ? DEFAULT_INPUT_DP : params.dp;
	    params.step     = params.step     || DEFAULT_INPUT_STEP;
	    params.presets  = params.presets  || DEFAULT_INPUT_PRESET;
	
	    this._onBegin     = params.onBegin;
	    this._onChange    = params.onChange;
	    this._presetsKey  = params.presets;
	
	    var input = this._input = new NumberInput_Internal(params.step,
	                                                       params.dp,
	                                                       params.onBegin,
	                                                       this._onInputChange.bind(this),
	                                                       params.onFinish,
	                                                       params.onError);
	
	    var wrap = this._wrapNode;
	
	    var presets =  params.presets;
	    if (!presets) {
	        wrap.addChild(input.getNode());
	    }
	    else {
	        var wrap_ = new Node();
	            wrap_.setStyleClass(CSS.WrapInputWPreset);
	
	        wrap.addChild(wrap_);
	        wrap_.addChild(input.getNode());
	
	        var options   = Options.get();
	        var presetBtn = this._btnPreset = new ButtonPreset(this._wrapNode);
	
	        var onPresetDeactivate = function(){
	            options.clear();
	            presetBtn.deactivate();
	        };
	
	        var self = this;
	        var onPresetActivate = function () {
	            options.build(presets, input.getValue(), input.getNode(),
	                function () {
	                    input.setValue(presets[options.getSelectedIndex()]);
	                    self.applyValue();
	                    self._onChange(self._obj[self._key]);
	                },
	                onPresetDeactivate, Metric.PADDING_PRESET,
	                false);
	        };
	        presetBtn.setOnActive(onPresetActivate);
	        presetBtn.setOnDeactive(onPresetDeactivate)
	    }
	
	    input.getNode().addEventListener(NodeEvent.MOUSE_DOWN,   this._onInputDragStart.bind(this));
	    this.addEventListener(ComponentEvent.INPUT_SELECT_DRAG,this._parent,'onComponentSelectDrag');
	
	    input.setValue(this._obj[this._key]);
	}
	NumberInput.prototype = Object.create(ObjectComponent.prototype);
	NumberInput.prototype.constructor = NumberInput;
	
	NumberInput.prototype._onInputChange = function () {
	    this.applyValue();
	    this._onChange(this._obj[this._key]);
	};
	
	NumberInput.prototype.applyValue = function() {
	    this.pushHistoryState();
	    this._obj[this._key] = this._input.getValue();
	    this.dispatchEvent(new Event_(this,ComponentEvent.VALUE_UPDATED,null));
	};
	
	NumberInput.prototype.onValueUpdate = function (e) {
	    if (e.data.origin == this){
	        return;
	    }
	    this._input.setValue(this._obj[this._key]);
	};
	
	//Prevent chrome select drag
	NumberInput.prototype._onInputDragStart = function () {
	    var eventMove = DocumentEvent.MOUSE_MOVE,
	        eventUp = DocumentEvent.MOUSE_UP;
	
	    var event = ComponentEvent.INPUT_SELECT_DRAG;
	
	    var self = this;
	
	    var onDrag = function () {
	            self.dispatchEvent(new Event_(this, event, null));
	        },
	        onDragFinish = function () {
	            self.dispatchEvent(new Event_(this, event, null));
	            document.removeEventListener(eventMove, onDrag, false);
	            document.removeEventListener(eventMove, onDragFinish, false);
	        };
	
	    this.dispatchEvent(new Event_(this, event, null));
	
	    document.addEventListener(eventMove, onDrag, false);
	    document.addEventListener(eventUp, onDragFinish, false);
	};
	
	module.exports = NumberInput;

/***/ },
/* 48 */
/*!************************************************************!*\
  !*** ./~/controlkit/lib/component/NumberInput_Internal.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventDispatcher = __webpack_require__(/*! ../core/event/EventDispatcher */ 14),
	    NodeEvent = __webpack_require__(/*! ../core/document/NodeEvent */ 19);
	var Node      = __webpack_require__(/*! ../core/document/Node */ 10);
	
	var PRESET_SHIFT_MULTIPLIER  = 10;
	var NUM_REGEX = /^-?\d*\.?\d*$/;
	
	var setCaretPos = null,
	    selectAll = null;
	
	function inputSetValue(input,value){
	    input.setProperty('value',value);
	    input.dispatchEvent(new Event('input'));
	}
	
	NumberInput_Internal = function (stepValue, dp, onBegin, onChange, onFinish, onError) {
	    EventDispatcher.apply(this, null);
	
	    this._value = 0;
	    this._valueStep = stepValue;
	    this._valueDp   = dp;
	
	    this._onBegin = onBegin || function (){};
	    this._onChange = onChange || function () {};
	    this._onFinish = onFinish || function() {};
	    this._onError = onError || function() {};
	
	    this._keyCode = null;
	    this._caretOffset = 0;
	
	    var input = this._input = new Node('text');
	        input.setProperty('value', this._value);
	
	    input.addEventListener('input',this._onInput.bind(this));
	    input.addEventListener('keydown',this._onKeydown.bind(this));
	
	    if(!setCaretPos){
	        if(input.getElement().setSelectionRange){
	            setCaretPos = function(input,pos){
	                input.getElement().setSelectionRange(pos,pos);
	            };
	            selectAll = function(input){
	                input.getElement().setSelectionRange(0,input.getProperty('value').length);
	            };
	        } else {
	            setCaretPos = function(input,pos){
	                var range = input.getElement().createTextRange();
	                    range.collapse(true);
	                    range.moveEnd('character',pos);
	                    range.moveStart('character',pos);
	                    range.select();
	            };
	            selectAll = function(input){
	                var range = input.getElement().createTextRange();
	                    range.collapse(true);
	                    range.moveStart('character',0);
	                    range.moveEnd('character',input.getProperty('value').length);
	                    range.select();
	            }
	        }
	    }
	};
	NumberInput_Internal.prototype = Object.create(EventDispatcher.prototype);
	NumberInput_Internal.prototype.constructor = NumberInput_Internal;
	
	NumberInput_Internal.prototype._setValue = function(value){
	    var prefix =  ((value = +value) || 1 / value) < 0 && value == 0 ? '-' : ''; //-0
	        value = Number(value).toFixed(this._valueDp);
	    this._input.setProperty('value',prefix + value);
	    this._value = Number(value);
	};
	
	NumberInput_Internal.prototype._onInput = function(){
	    var input = this._input,
	        value = input.getProperty('value'),
	        start = input.getProperty('selectionStart'),
	        dp    = this._valueDp;
	
	    var first = value[0];
	
	    if(value == ''){
	        value = 0;
	    } else if(first === '.'){
	        value = '0' + value;
	    }
	
	    if(!NUM_REGEX.test(value) || value == '-'){
	        input.setProperty('value',this._value.toFixed(dp));
	        setCaretPos(input,Math.max(--start,0));
	        this._onError(this._keyCode);
	        return;
	    }
	    this._onBegin(this._value);
	    this._setValue(value);
	    setCaretPos(input,start - this._caretOffset);
	    this._onChange();
	};
	
	NumberInput_Internal.prototype._onKeydown = function(e){
	    var keyCode = this._keyCode = e.keyCode;
	
	    if(keyCode == 13){
	        this._onFinish();
	        e.preventDefault();
	        return;
	    }
	
	    var input  = this._input,
	        value  = input.getProperty('value');
	    var start  = input.getProperty('selectionStart'),
	        end    = input.getProperty('selectionEnd');
	    var length = value.length;
	
	    var isBackspaceDelete = keyCode == 8 || keyCode == 45,
	        isMetaKey = e.metaKey,
	        isCtrlKey = e.ctrlKey,
	        isLeft = keyCode == 37,
	        isRight = keyCode == 39,
	        isLeftRight = isLeft || isRight,
	        isShift = e.shiftKey,
	        isUpDown = keyCode == 38 || keyCode == 40,
	        isSelectAll = (isMetaKey || isCtrlKey) && keyCode == 65,
	        isRangeSelected = start != end,
	        isAllSelected = start == 0 && end == length,
	        isMinus = keyCode == 189;
	
	    var indexDecimalMark = value.indexOf('.');
	
	    this._caretOffset = 0;
	
	    //prevent cmd-z || ctrl-z
	    if((isMetaKey || isCtrlKey) && keyCode == 90){
	        e.preventDefault();
	        return;
	    }
	    //select all cmd+a || ctrl+a
	    if(isSelectAll){
	        selectAll(input);
	        e.preventDefault();
	        return;
	    }
	    //everything is selected
	    if(isAllSelected) {
	        if (isMinus) {
	            //set negative zero, as starting point for negative number
	            inputSetValue(input, '-0');
	            //set caret after  '-'
	            setCaretPos(input, 1);
	        } else {
	            //delete number / replace / ignore
	            inputSetValue(input, isBackspaceDelete ? 0 : String.fromCharCode(keyCode));
	            //jump to start <--> end
	            setCaretPos(input, isLeft ? start : end);
	        }
	        e.preventDefault();
	        return;
	    }
	    //jump over decimal mark
	    if(isBackspaceDelete && (start-1 == indexDecimalMark)){
	        setCaretPos(input,start-1);
	        return;
	    }
	    // 0|. enter first dp without jumping over decimal mark
	    if(!isLeftRight && (value[0] == '0' && start == 1)){
	        setCaretPos(input,1);
	        this._caretOffset = 1;
	        return;
	    }
	    //increase / decrease number by (step up / down) * multiplier on shift down
	    if(isUpDown){
	        var step = (isShift ? PRESET_SHIFT_MULTIPLIER : 1) * this._valueStep,
	            mult = keyCode == 38 ? 1.0 : -1.0;
	        inputSetValue(input,Number(value) + (step * mult));
	        setCaretPos(input,start);
	        e.preventDefault();
	        return;
	    }
	    //range selected, not in selection process
	    if(isRangeSelected && !(isShift && isLeftRight)){
	        //jump to start <--> end
	        if(isLeftRight){
	            setCaretPos(input,isLeft ? start : end);
	        } else { //replace complete range, not just parts
	            value = value.substr(0,start) + String.fromCharCode(keyCode) + value.substr(end,length-end);
	            inputSetValue(input,value);
	            setCaretPos(input,end);
	        }
	        e.preventDefault();
	        return;
	    }
	    //caret within fractional part, not moving caret, selecting, deleting
	    if(!isShift && !isLeftRight && !isBackspaceDelete && (start > indexDecimalMark && start < length)){
	        value = value.substr(0,start) + String.fromCharCode(keyCode) + value.substr(start+1,length-1);
	        inputSetValue(input,value);
	        setCaretPos(input,Math.min(start+1,length-1));
	        e.preventDefault();
	        return;
	    }
	    //caret at end of number, do nothing
	    if(!isBackspaceDelete && !isLeftRight && !isUpDown && start >= length){
	        e.preventDefault();
	    }
	};
	
	NumberInput_Internal.prototype.getValue = function () {
	    return this._value;
	};
	
	NumberInput_Internal.prototype.setValue = function (n) {
	    this._setValue(n);
	};
	
	NumberInput_Internal.prototype.getNode = function () {
	    return this._input;
	};
	
	module.exports = NumberInput_Internal;


/***/ },
/* 49 */
/*!*********************************************!*\
  !*** ./~/controlkit/lib/component/Range.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectComponent = __webpack_require__(/*! ../core/ObjectComponent */ 26);
	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	var NumberInput_Internal = __webpack_require__(/*! ./NumberInput_Internal */ 48);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	
	var Event_         = __webpack_require__(/*! ../core/event/Event */ 21),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	var DEFAULT_STEP = 1.0,
	    DEFAULT_DP   = 2;
	
	function Range(parent, object, value, params) {
	    ObjectComponent.apply(this,arguments);
	
	    params          = params          || {};
	    params.onChange = params.onChange || this._onChange;
	    params.step     = params.step || DEFAULT_STEP;
	    params.dp       = (params.dp != null) ? params.dp : DEFAULT_DP;
	
	    this._onChange  = params.onChange;
	
	    var step = this._step = params.step,
	        dp   = this._dp   = params.dp;
	
	    //FIXME: history push pop
	
	    var labelMin = new Node();
	    var inputMin = this._inputMin = new NumberInput_Internal(step,dp, this.pushHistoryState.bind(this),
	                                                                         this._onInputMinChange.bind(this));
	
	    var labelMax = new Node();
	    var inputMax = this._inputMax = new NumberInput_Internal(step,dp, this.pushHistoryState.bind(this),
	                                                                         this._onInputMaxChange.bind(this));
	
	    var labelMinWrap = new Node().setStyleClass(CSS.Wrap),
	        inputMinWrap = new Node().setStyleClass(CSS.Wrap),
	        labelMaxWrap = new Node().setStyleClass(CSS.Wrap),
	        inputMaxWrap = new Node().setStyleClass(CSS.Wrap);
	
	    labelMin.setStyleClass(CSS.Label).setProperty('innerHTML', 'MIN');
	    labelMax.setStyleClass(CSS.Label).setProperty('innerHTML', 'MAX');
	
	    var values = this._obj[this._key];
	
	    inputMin.setValue(values[0]);
	    inputMax.setValue(values[1]);
	
	    var wrap = this._wrapNode;
	
	    labelMinWrap.addChild(labelMin);
	    inputMinWrap.addChild(inputMin.getNode());
	    labelMaxWrap.addChild(labelMax);
	    inputMaxWrap.addChild(inputMax.getNode());
	
	    wrap.addChild(labelMinWrap);
	    wrap.addChild(inputMinWrap);
	    wrap.addChild(labelMaxWrap);
	    wrap.addChild(inputMaxWrap);
	}
	Range.prototype = Object.create(ObjectComponent.prototype);
	Range.prototype.constructor = Range;
	
	Range.prototype._onInputChange = function () {
	    this.dispatchEvent(new Event_(this, ComponentEvent.VALUE_UPDATED, null));
	    this._onChange();
	};
	
	Range.prototype._updateValueMin = function () {
	    var values = this._obj[this._key];
	
	    var inputMin = this._inputMin,
	        inputValue = inputMin.getValue();
	
	    if (inputValue >= this._inputMax.getValue()) {
	        inputMin.setValue(values[0]);
	        return;
	    }
	    values[0] = inputValue;
	
	};
	
	Range.prototype._updateValueMax = function () {
	    var values = this._obj[this._key];
	
	    var inputMax = this._inputMax,
	        inputValue = inputMax.getValue();
	
	    if (inputValue <= this._inputMin.getValue()) {
	        inputMax.setValue(values[1]);
	        return;
	    }
	    values[1] = inputValue;
	};
	
	
	Range.prototype.onValueUpdate = function (e) {
	    if (e.data.origin == this){
	        return;
	    }
	    if (e.data.origin == null) {
	    }
	    var o = this._obj,k = this._key;
	    this._inputMin.setValue(o[k][0]);
	    this._inputMax.setValue(o[k][1]);
	};
	
	Range.prototype.setValue = function(value){
	    var o = this._obj,k = this._key;
	    o[k][0] = value[0];
	    o[k][1] = value[1];
	    this.dispatchEvent(new Event_(this,ComponentEvent.VALUE_UPDATED,null));
	};
	
	Range.prototype._onInputMinChange = function () {
	    this._updateValueMin();
	    this._onInputChange();
	};
	
	Range.prototype._onInputMaxChange = function () {
	    this._updateValueMax();
	    this._onInputChange();
	};
	
	module.exports = Range;

/***/ },
/* 50 */
/*!************************************************!*\
  !*** ./~/controlkit/lib/component/Checkbox.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectComponent = __webpack_require__(/*! ../core/ObjectComponent */ 26),
	    Node            = __webpack_require__(/*! ../core/document/Node */ 10);
	
	var Event_         = __webpack_require__(/*! ../core/event/Event */ 21),
	    NodeEvent      = __webpack_require__(/*! ../core/document/NodeEvent */ 19),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	function Checkbox(parent, object, value, params) {
	    ObjectComponent.apply(this,arguments);
	
	    params = params || {};
	    params.onChange = params.onChange || this._onChange;
	    this._onChange = params.onChange;
	
	    var node = this._input = new Node(Node.INPUT_CHECKBOX);
	    node.setProperty('checked',this._obj[this._key]);
	    node.addEventListener(NodeEvent.CHANGE,this._onInputChange.bind(this));
	
	    this._wrapNode.addChild(this._input);
	}
	Checkbox.prototype = Object.create(ObjectComponent.prototype);
	Checkbox.prototype.constructor = Checkbox;
	
	Checkbox.prototype.applyValue = function () {
	    this.pushHistoryState();
	
	    var obj = this._obj, key = this._key;
	    obj[key] = !obj[key];
	
	    this.dispatchEvent(new Event_(this, ComponentEvent.VALUE_UPDATED, null));
	};
	
	Checkbox.prototype._onInputChange = function () {
	    this.applyValue();
	    this._onChange();
	};
	
	Checkbox.prototype.onValueUpdate = function (e) {
	    if (e.data.origin == this){
	        return;
	    }
	    this._input.setProperty('checked', this._obj[this._key]);
	};
	
	module.exports = Checkbox;

/***/ },
/* 51 */
/*!*********************************************!*\
  !*** ./~/controlkit/lib/component/Color.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectComponent = __webpack_require__(/*! ./../core/ObjectComponent */ 26);
	
	var Node      = __webpack_require__(/*! ../core/document/Node */ 10);
	var ColorMode = __webpack_require__(/*! ../core/color/ColorMode */ 44);
	var Picker    = __webpack_require__(/*! ./Picker */ 52);
	var ColorUtil = __webpack_require__(/*! ../core/color/ColorUtil */ 45);
	var Options   = __webpack_require__(/*! ./Options */ 43);
	var ButtonPreset = __webpack_require__(/*! ./ButtonPreset */ 46);
	var Metric = __webpack_require__(/*! ./Metric */ 16),
	    CSS    = __webpack_require__(/*! ../core/document/CSS */ 17);
	
	var Event_         = __webpack_require__(/*! ../core/event/Event */ 21),
	    NodeEvent      = __webpack_require__(/*! ../core/document/NodeEvent */ 19),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	var ColorFormatError = __webpack_require__(/*! ../core/color/ColorFormatError */ 53);
	
	var DEFAULT_COLOR_MODE = ColorMode.HEX,
	    DEFAULT_PRESETS = null;
	
	var MSG_COLOR_FORMAT_HEX = 'Color format should be hex. Set colorMode to rgb, rgbfv or hsv.',
	    MSG_COLOR_FORMAT_RGB_RGBFV_HSV = 'Color format should be rgb, rgbfv or hsv. Set colorMode to hex.',
	    MSG_COLOR_PRESET_FORMAT_HEX = 'Preset color format should be hex.',
	    MSG_COLOR_PRESET_FORMAT_RGB_RGBFV_HSV = 'Preset color format should be rgb, rgbfv or hsv.';
	
	function Color(parent, object, value, params){
	    ObjectComponent.apply(this, arguments);
	
	    params = params || {};
	    params.presets = params.presets || DEFAULT_PRESETS;
	    params.colorMode = params.colorMode || DEFAULT_COLOR_MODE;
	    params.onChange = params.onChange || this._onChange;
	
	
	    this._presetsKey = params.presets;
	    this._onChange = params.onChange;
	
	    var color = this._color = new Node();
	    value = this._value = this._obj[this._key];
	
	    var colorMode = this._colorMode = params.colorMode;
	
	    this._validateColorFormat(value, MSG_COLOR_FORMAT_HEX, MSG_COLOR_FORMAT_RGB_RGBFV_HSV);
	
	    var wrap = this._wrapNode;
	
	    if(!this._presetsKey){
	        color.setStyleClass(CSS.Color);
	        wrap.addChild(color);
	    }
	    else{
	        color.setStyleClass(CSS.Color);
	
	        var wrap_ = new Node();
	        wrap_.setStyleClass(CSS.WrapColorWPreset);
	
	        wrap.addChild(wrap_);
	        wrap_.addChild(color);
	
	        var presets = this._obj[this._presetsKey];
	
	        var i = -1;
	        while(++i < presets.length){
	            this._validateColorFormat(presets[i], MSG_COLOR_PRESET_FORMAT_HEX,
	                MSG_COLOR_PRESET_FORMAT_RGB_RGBFV_HSV);
	        }
	
	        var options = Options.get(),
	            presetBtn = new ButtonPreset(wrap);
	
	        var onPresetDeactivate = function(){
	            options.clear();
	            presetBtn.deactivate();
	        };
	
	        var self = this;
	        var onPresetActivate = function(){
	            options.build(presets,
	                self._value,
	                color,
	                function(){
	                    self.pushHistoryState();
	                    self._value = presets[options.getSelectedIndex()];
	                    self.applyValue();
	                    self._onChange(self._obj[self._key]);
	                },
	                onPresetDeactivate,
	                Metric.PADDING_PRESET,
	                true,
	                colorMode);
	        };
	        presetBtn.setOnActive(onPresetActivate);
	        presetBtn.setOnDeactive(onPresetDeactivate);
	    }
	
	    color.addEventListener(NodeEvent.MOUSE_DOWN, this._onColorTrigger.bind(this));
	    this._updateColor();
	}
	Color.prototype = Object.create(ObjectComponent.prototype);
	Color.prototype.constructor = Color;
	
	Color.prototype._onColorTrigger = function(){
	    var colorMode = this._colorMode,
	        colorModeHEX = ColorMode.HEX,
	        colorModeRGB = ColorMode.RGB,
	        colorModeRGBfv = ColorMode.RGBfv,
	        colorModeHSV = ColorMode.HSV;
	
	    var value = this._value,
	        temp;
	
	    var onPickerPick = function(){
	        this.pushHistoryState();
	
	        switch(colorMode){
	            case colorModeHEX:
	                this._value = Picker.get().getHEX();
	                break;
	            case colorModeRGB:
	                //if val = Float32array or so
	                temp = Picker.get().getRGB();
	                value[0] = temp[0];
	                value[1] = temp[1];
	                value[2] = temp[2];
	                break;
	
	            case colorModeRGBfv:
	                temp = Picker.get().getRGBfv();
	                value[0] = temp[0];
	                value[1] = temp[1];
	                value[2] = temp[2];
	                break;
	
	            case colorModeHSV:
	                this._value = Picker.get().getHSV();
	                break;
	        }
	
	        this.applyValue();
	
	    }.bind(this);
	
	    var picker = Picker.get();
	
	    switch(colorMode){
	        case colorModeHEX:
	            picker.setColorHEX(value);
	            break;
	        case colorModeRGB:
	            picker.setColorRGB(value[0], value[1], value[2]);
	            break;
	        case colorModeRGBfv:
	            picker.setColorRGBfv(value[0], value[1], value[2]);
	            break;
	        case colorModeHSV:
	            picker.setColorHSV(value[0], value[1], value[2]);
	            break;
	    }
	
	    picker.setCallbackPick(onPickerPick);
	    picker.open();
	};
	
	Color.prototype.applyValue = function(){
	    this._obj[this._key] = this._value;
	    this._updateColor();
	    this.dispatchEvent(new Event_(this, ComponentEvent.VALUE_UPDATED, null));
	    this._onChange(this._obj[this._key]);
	};
	
	Color.prototype.onValueUpdate = function(e){
	    if(e.data.origin == this)return;
	    this._value = this._obj[this._key];
	    this._updateColor();
	};
	
	Color.prototype._updateColor = function(){
	    var color = this._value,
	        colorNode = this._color,
	        nodeColor;
	
	    colorNode.setProperty('innerHTML', color);
	
	    switch(this._colorMode){
	        case ColorMode.HEX:
	            nodeColor = color;
	            break;
	
	        case ColorMode.RGB:
	            nodeColor = ColorUtil.RGB2HEX(color[0], color[1], color[2]);
	            break;
	
	        case ColorMode.RGBfv:
	            nodeColor = ColorUtil.RGBfv2HEX(color[0], color[1], color[2]);
	            break;
	
	        case ColorMode.HSV:
	            nodeColor = ColorUtil.HSV2RGB(color[0], color[1], color[2]);
	            break;
	    }
	
	    colorNode.getStyle().backgroundColor = nodeColor;
	};
	
	Color.prototype._validateColorFormat = function(value, msgHex, msgArr){
	    var colorMode = this._colorMode;
	
	    if(colorMode == ColorMode.HEX && Object.prototype.toString.call(value) === '[object Array]' ||
	        colorMode == ColorMode.HEX && Object.prototype.toString.call(value) === '[object Float32Array]'){
	        throw new ColorFormatError(msgHex);
	    }
	    if((colorMode == ColorMode.RGB ||
	        colorMode == ColorMode.RGBfv ||
	        colorMode == ColorMode.HSV) &&
	        Object.prototype.toString.call(value) !== '[object Array]' ||
	        colorMode == ColorMode.HSV &&
	        Object.prototype.toString.call(value) !== '[object Float32Array]'){
	        throw new ColorFormatError(msgArr);
	    }
	};
	
	module.exports = Color;


/***/ },
/* 52 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/component/Picker.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	var NumberInput_Internal = __webpack_require__(/*! ./NumberInput_Internal */ 48);
	var Mouse = __webpack_require__(/*! ../core/document/Mouse */ 20);
	var ColorUtil = __webpack_require__(/*! ../core/color/ColorUtil */ 45);
	var DocumentEvent = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    NodeEvent     = __webpack_require__(/*! ../core/document/NodeEvent */ 19);
	
	var DEFAULT_VALUE_HUE = 200.0,
	    DEFAULT_VALUE_SAT = 50.0,
	    DEFAULT_VALUE_VAL = 50.0;
	
	function Picker(parentNode){
	    var root = this._node     = new Node().setStyleClass(CSS.Picker),
	        head = this._headNode = new Node().setStyleClass(CSS.Head),
	        labelWrap = new Node().setStyleClass(CSS.Wrap),
	        label = new Node().setStyleClass(CSS.Label),
	        menu = new Node().setStyleClass(CSS.Menu),
	        menuWrap = new Node().setStyleClass(CSS.Wrap);
	
	    var menuClose = new Node(Node.INPUT_BUTTON);
	        menuClose.setStyleClass(CSS.ButtonMenuClose);
	
	    var fieldWrap  = new Node().setStyleClass( CSS.PickerFieldWrap),
	        sliderWrap = new Node().setStyleClass(CSS.SliderWrap),
	        inputWrap  = new Node().setStyleClass( CSS.PickerInputWrap);
	
	    var canvasField  = this._canvasField  = document.createElement('canvas'),
	        canvasSlider = this._canvasSlider = document.createElement('Canvas');
	
	        fieldWrap.getElement().appendChild(canvasField);
	        sliderWrap.getElement().appendChild(canvasSlider);
	
	        this._setSizeCanvasField(154,154);
	        this._setSizeCanvasSlider(14,154);
	
	    var contextCanvasField  = this._contextCanvasField  = canvasField.getContext('2d'),
	        contextCanvasSlider = this._contextCanvasSlider = canvasSlider.getContext('2d');
	
	    var handleField  = this._handleField  = new Node();
	        handleField.setStyleClass(CSS.PickerHandleField);
	
	    var handleSlider = this._handleSlider = new Node();
	        handleSlider.setStyleClass(CSS.PickerHandleSlider);
	
	    var step = 1.0,
	        dp   = 0;
	
	    var callbackHue = this._onInputHueChange.bind(this),
	        callbackSat = this._onInputSatChange.bind(this),
	        callbackVal = this._onInputValChange.bind(this),
	        callbackR   = this._onInputRChange.bind(this),
	        callbackG   = this._onInputGChange.bind(this),
	        callbackB   = this._onInputBChange.bind(this);
	
	
	    var inputHue = this._inputHue = new NumberInput_Internal(step,dp,null,callbackHue),
	        inputSat = this._inputSat = new NumberInput_Internal(step,dp,null,callbackSat),
	        inputVal = this._inputVal = new NumberInput_Internal(step,dp,null,callbackVal),
	        inputR   = this._inputR   = new NumberInput_Internal(step,dp,null,callbackR),
	        inputG   = this._inputG   = new NumberInput_Internal(step,dp,null,callbackG),
	        inputB   = this._inputB   = new NumberInput_Internal(step,dp,null,callbackB);
	
	    var controlsWrap = new Node().setStyleClass(CSS.PickerControlsWrap);
	
	    var buttonPick   = new Node(Node.INPUT_BUTTON).setStyleClass(CSS.Button).setProperty('value','pick'),
	        buttonCancel = new Node(Node.INPUT_BUTTON).setStyleClass(CSS.Button).setProperty('value','cancel');
	
	
	    var colorContrast = new Node().setStyleClass(CSS.PickerColorContrast);
	
	    var color0 = this._colorCurrNode = new Node(),
	        color1 = this._colorPrevNode = new Node();
	
	    colorContrast.addChild(color0);
	    colorContrast.addChild(color1);
	
	    controlsWrap.addChild(buttonCancel);
	    controlsWrap.addChild(buttonPick);
	    controlsWrap.addChild(colorContrast);
	
	    this._setContrasPrevColor(0,0,0);
	
	    var inputFieldWrapHue = new Node().setStyleClass(CSS.PickerInputField),
	        inputFieldWrapSat = new Node().setStyleClass(CSS.PickerInputField),
	        inputFieldWrapVal = new Node().setStyleClass(CSS.PickerInputField);
	
	    var inputFieldWrapHueLabel = new Node(Node.SPAN).setStyleClass(CSS.Label).setProperty('innerHTML','H'),
	        inputFieldWrapSatLabel = new Node(Node.SPAN).setStyleClass(CSS.Label).setProperty('innerHTML','S'),
	        inputFieldWrapValLabel = new Node(Node.SPAN).setStyleClass(CSS.Label).setProperty('innerHTML','V');
	
	        inputFieldWrapHue.addChildren(inputFieldWrapHueLabel,inputHue.getNode());
	        inputFieldWrapSat.addChildren(inputFieldWrapSatLabel,inputSat.getNode());
	        inputFieldWrapVal.addChildren(inputFieldWrapValLabel,inputVal.getNode());
	
	    var inputFieldWrapR = new Node().setStyleClass(CSS.PickerInputField),
	        inputFieldWrapG = new Node().setStyleClass(CSS.PickerInputField),
	        inputFieldWrapB = new Node().setStyleClass(CSS.PickerInputField);
	
	    var inputFieldWrapRLabel = new Node(Node.SPAN).setStyleClass(CSS.Label).setProperty('innerHTML','R'),
	        inputFieldWrapGLabel = new Node(Node.SPAN).setStyleClass(CSS.Label).setProperty('innerHTML','G'),
	        inputFieldWrapBLabel = new Node(Node.SPAN).setStyleClass(CSS.Label).setProperty('innerHTML','B');
	
	        inputFieldWrapR.addChildren(inputFieldWrapRLabel,inputR.getNode());
	        inputFieldWrapG.addChildren(inputFieldWrapGLabel,inputG.getNode());
	        inputFieldWrapB.addChildren(inputFieldWrapBLabel,inputB.getNode());
	
	
	        inputWrap.addChildren(inputFieldWrapR,inputFieldWrapHue,
	                              inputFieldWrapG,inputFieldWrapSat,
	                              inputFieldWrapB,inputFieldWrapVal,colorContrast);
	
	    var hexInputWrap = new Node();
	        hexInputWrap.setStyleClass(CSS.PickerInputWrap);
	
	    var inputHEX = this._inputHEX = new Node(Node.INPUT_TEXT),
	        inputFieldWrapHEX         = new Node().setStyleClass(CSS.PickerInputField),
	        inputFieldWrapHEXLabel    = new Node(Node.SPAN).setStyleClass(CSS.Label);
	
	        inputFieldWrapHEXLabel.setProperty('innerHTML','#');
	        inputFieldWrapHEX.addChildren(inputFieldWrapHEXLabel,inputHEX);
	
	        hexInputWrap.addChild(inputFieldWrapHEX);
	
	        inputHEX.addEventListener(NodeEvent.CHANGE,this._onInputHEXFinish.bind(this));
	
	        label.setProperty('innerHTML','Color Picker');
	
	        menu.addChild(menuClose);
	        head.addChild(menu);
	        labelWrap.addChild(label);
	        head.addChild(labelWrap);
	        root.addChild(head);
	        root.addChild(menuWrap);
	
	        //wrapNode.addChild(paletteWrap);
	
	        menuWrap.addChild(fieldWrap);
	        menuWrap.addChild(sliderWrap);
	        menuWrap.addChild(inputWrap);
	        menuWrap.addChild(hexInputWrap);
	        menuWrap.addChild(controlsWrap);
	
	        fieldWrap.addChild( handleField);
	        sliderWrap.addChild(handleSlider);
	
	    var eventMouseDown = NodeEvent.MOUSE_DOWN,
	        callback       = this._onCanvasFieldMouseDown.bind(this);
	
	        fieldWrap.addEventListener(  eventMouseDown, callback);
	        handleField.addEventListener(eventMouseDown, callback);
	
	        callback = this._onCanvasSliderMouseDown.bind(this);
	
	        sliderWrap.addEventListener(  eventMouseDown, callback);
	        handleSlider.addEventListener(eventMouseDown, callback);
	
	        menuClose.addEventListener(   eventMouseDown, this._onClose.bind(this));
	        buttonPick.addEventListener(  eventMouseDown, this._onPick.bind(this));
	        buttonCancel.addEventListener(eventMouseDown, this._onClose.bind(this));
	
	        head.addEventListener(NodeEvent.MOUSE_DOWN, this._onHeadDragStart.bind(this));
	
	    this._parentNode = parentNode;
	
	    this._mouseOffset = [0,0];
	    this._position    = [null,null];
	
	    this._canvasSliderPos = [0,0];
	    this._canvasFieldPos  = [0,0];
	    this._handleFieldSize    = 12;
	    this._handleSliderHeight = 7;
	
	    this._imageDataSlider = contextCanvasSlider.createImageData(canvasSlider.width,canvasSlider.height);
	    this._imageDataField  = contextCanvasField.createImageData( canvasField.width, canvasField.height);
	
	    this._valueHueMinMax = [0,360];
	    this._valueSatMinMax = this._valueValMinMax = [0,100];
	    this._valueRGBMinMax = [0,255];
	
	    this._valueHue = DEFAULT_VALUE_HUE;
	    this._valueSat = DEFAULT_VALUE_SAT;
	    this._valueVal = DEFAULT_VALUE_VAL;
	    this._valueR   = 0;
	    this._valueG   = 0;
	    this._valueB   = 0;
	
	    this._valueHEX = '#000000';
	    this._valueHEXValid = this._valueHEX;
	
	    this._callbackPick = function(){};
	
	    //this._canvasFieldImageDataFunc = function(i,j){return this._HSV2RGB(this._valueHue,j)}
	
	    this._drawCanvasField();
	    this._drawCanvasSlider();
	
	    this._setColorHSV(this._valueHue,this._valueSat,this._valueVal);
	
	    this._updateColorRGBFromHSV();
	    this._updateColorHEXFromRGB();
	
	    this._updateHandles();
	}
	
	Picker.prototype =
	{
	    _drawHandleField: function () {
	        var canvas = this._canvasField,
	            nodePos = this._canvasFieldPos,
	            mousePos = Mouse.get().getPosition();
	
	        var posX = Math.max(0, Math.min(mousePos[0] - nodePos[0], canvas.width)),
	            posY = Math.max(0, Math.min(mousePos[1] - nodePos[1], canvas.height)),
	            posXNorm = posX / canvas.width,
	            posYNorm = posY / canvas.height;
	
	        var sat = Math.round(posXNorm * this._valueSatMinMax[1]),
	            val = Math.round((1.0 - posYNorm) * this._valueValMinMax[1]);
	
	        this._setColorHSV(this._valueHue, sat, val);
	
	        this._updateColorRGBFromHSV();
	        this._updateColorHEXFromRGB();
	
	        this._updateHandleField();
	    },
	
	    _updateHandleField: function () {
	        var width = this._canvasField.width,
	            height = this._canvasField.height,
	            offsetHandle = this._handleFieldSize * 0.25;
	
	        var satNorm = this._valueSat / this._valueSatMinMax[1],
	            valNorm = this._valueVal / this._valueValMinMax[1];
	
	        this._handleField.setPositionGlobal(satNorm * width - offsetHandle,
	            (1.0 - valNorm) * height - offsetHandle);
	
	    },
	
	    _drawHandleSlider: function () {
	        var canvas = this._canvasSlider,
	            canvasPosY = this._canvasSliderPos[1],
	            mousePosY = Mouse.get().getY();
	
	        var posY = Math.max(0, Math.min(mousePosY - canvasPosY, canvas.height)),
	            posYNorm = posY / canvas.height;
	
	        var hue = Math.floor((1.0 - posYNorm) * this._valueHueMinMax[1]);
	
	        this._setColorHSV(hue, this._valueSat, this._valueVal);
	
	        this._updateColorRGBFromHSV();
	        this._updateColorHEXFromRGB();
	
	        this._updateHandleSlider();
	    },
	
	    _updateHandleSlider: function () {
	        var height = this._canvasSlider.height,
	            offsetHandle = this._handleSliderHeight * 0.25;
	
	        var hueNorm = this._valueHue / this._valueHueMinMax[1];
	
	        this._handleSlider.setPositionGlobalY((height - offsetHandle) * (1.0 - hueNorm));
	    },
	
	    _updateHandles: function () {
	        this._updateHandleField();
	        this._updateHandleSlider();
	    },
	
	    /*---------------------------------------------------------------------------------*/
	
	    _setHue: function (value) {
	        var minMax = this._valueHueMinMax;
	
	        this._valueHue = value == minMax[1] ? minMax[0] : value;
	        this._updateColorHSV();
	        this._drawCanvasField();
	    },
	
	    _setSat: function (value) {
	        this._valueSat = Math.round(value);
	        this._updateColorHSV();
	    },
	
	    _setVal: function (value) {
	        this._valueVal = Math.round(value);
	        this._updateColorHSV();
	    },
	
	    _setR: function (value) {
	        this._valueR = Math.round(value);
	        this._updateColorRGB();
	    },
	
	    _setG: function (value) {
	        this._valueG = Math.round(value);
	        this._updateColorRGB();
	    },
	
	    _setB: function (value) {
	        this._valueB = Math.round(value);
	        this._updateColorRGB();
	    },
	
	    /*---------------------------------------------------------------------------------*/
	
	    _onInputHueChange: function () {
	        var input = this._inputHue,
	            inputVal = this._getValueContrained(input, this._valueHueMinMax);
	
	        var minMax = this._valueHueMinMax;
	
	        if (inputVal == minMax[1]) {
	            inputVal = minMax[0];
	            input.setValue(inputVal);
	        }
	
	        this._setHue(inputVal);
	        this._updateColorRGBFromHSV();
	        this._updateColorHEXFromRGB();
	        this._updateHandleSlider();
	
	        this._drawCanvasField();
	    },
	
	    _onInputSatChange: function () {
	        this._setSat(this._getValueContrained(this._inputSat, this._valueSatMinMax));
	        this._onInputSVChange();
	    },
	
	    _onInputValChange: function () {
	        this._setVal(this._getValueContrained(this._inputVal, this._valueValMinMax));
	        this._onInputSVChange();
	    },
	
	    _onInputRChange: function () {
	        this._setR(this._getValueContrained(this._inputR, this._valueRGBMinMax));
	        this._onInputRGBChange();
	    },
	
	    _onInputGChange: function () {
	        this._setG(this._getValueContrained(this._inputG, this._valueRGBMinMax));
	        this._onInputRGBChange();
	    },
	
	    _onInputBChange: function () {
	        this._setB(this._getValueContrained(this._inputB, this._valueRGBMinMax));
	        this._onInputRGBChange();
	    },
	
	    _onInputHEXFinish: function () {
	        var input = this._inputHEX,
	            value = input.getProperty('value');
	
	        if (!ColorUtil.isValidHEX(value)) {
	            input.setProperty('value', this._valueHEXValid);
	            return;
	        }
	
	        this._valueHEX = this._valueHEXValid = value;
	        this._updateColorFromHEX();
	    },
	
	    _onInputSVChange: function () {
	        this._updateColorRGBFromHSV();
	        this._updateColorHEXFromRGB();
	        this._updateHandleField();
	    },
	
	    _onInputRGBChange: function () {
	        this._updateColorHSVFromRGB();
	        this._updateColorHEXFromRGB();
	        this._updateHandles();
	    },
	
	    _getValueContrained: function (input, minMax) {
	        var inputVal = Math.round(input.getValue()),
	            min = minMax[0],
	            max = minMax[1];
	
	        if (inputVal <= min) {
	            inputVal = min;
	            input.setValue(inputVal);
	        }
	        if (inputVal >= max) {
	            inputVal = max;
	            input.setValue(inputVal);
	        }
	
	        return inputVal;
	    },
	
	
	    _updateInputHue: function () {
	        this._inputHue.setValue(this._valueHue);
	    },
	    _updateInputSat: function () {
	        this._inputSat.setValue(this._valueSat);
	    },
	    _updateInputVal: function () {
	        this._inputVal.setValue(this._valueVal);
	    },
	    _updateInputR: function () {
	        this._inputR.setValue(this._valueR);
	    },
	    _updateInputG: function () {
	        this._inputG.setValue(this._valueG);
	    },
	    _updateInputB: function () {
	        this._inputB.setValue(this._valueB);
	    },
	    _updateInputHEX: function () {
	        this._inputHEX.setProperty('value', this._valueHEX);
	    },
	
	
	    _setColorHSV: function (hue, sat, val) {
	        this._valueHue = hue;
	        this._valueSat = sat;
	        this._valueVal = val;
	
	        this._updateInputHue();
	        this._updateInputSat();
	        this._updateInputVal();
	
	        this._updateContrastCurrColor();
	    },
	
	    _setColorRGB: function (r, g, b) {
	        this._valueR = r;
	        this._valueG = g;
	        this._valueB = b;
	
	        this._updateInputR();
	        this._updateInputG();
	        this._updateInputB();
	
	        this._updateContrastCurrColor();
	    },
	
	    _setColorHEX: function (hex) {
	        this._valueHEX = hex;
	        this._updateInputHEX();
	    },
	
	    _updateColorHSV: function () {
	        this._setColorHSV(this._valueHue, this._valueSat, this._valueVal);
	        this._updateContrastCurrColor();
	    },
	
	    _updateColorRGB: function () {
	        this._setColorRGB(this._valueR, this._valueG, this._valueB);
	        this._updateContrastCurrColor();
	    },
	
	    _updateColorHSVFromRGB: function () {
	        var hsv = ColorUtil.RGB2HSV(this._valueR, this._valueG, this._valueB);
	        this._setColorHSV(hsv[0], hsv[1], hsv[2]);
	    },
	
	    _updateColorRGBFromHSV: function () {
	        var rgb = ColorUtil.HSV2RGB(this._valueHue, this._valueSat, this._valueVal);
	        this._setColorRGB(rgb[0], rgb[1], rgb[2]);
	    },
	
	    _updateColorHEXFromRGB: function () {
	        var hex = ColorUtil.RGB2HEX(this._valueR, this._valueG, this._valueB);
	        this._setColorHEX(hex);
	    },
	
	    _updateColorFromHEX: function () {
	        var rgb = ColorUtil.HEX2RGB(this._valueHEX);
	
	        this._setColorRGB(rgb[0], rgb[1], rgb[2]);
	        this._updateColorHSVFromRGB();
	        this._updateHandles();
	    },
	
	    _updateContrastCurrColor: function () {
	        this._setContrastCurrColor(this._valueR, this._valueG, this._valueB);
	    },
	    _updateContrastPrevColor: function () {
	        this._setContrasPrevColor(this._valueR, this._valueG, this._valueB)
	    },
	
	    _setContrastCurrColor: function (r, g, b) {
	        this._colorCurrNode.setStyleProperty('background', 'rgb(' + r + ',' + g + ',' + b + ')')
	    },
	    _setContrasPrevColor: function (r, g, b) {
	        this._colorPrevNode.setStyleProperty('background', 'rgb(' + r + ',' + g + ',' + b + ')')
	    },
	
	    _onHeadDragStart: function () {
	        var node = this._node,
	            parentNode = this._parentNode;
	
	        var nodePos = node.getPositionGlobal(),
	            mousePos = Mouse.get().getPosition(),
	            offsetPos = this._mouseOffset;
	
	        offsetPos[0] = mousePos[0] - nodePos[0];
	        offsetPos[1] = mousePos[1] - nodePos[1];
	
	        var eventMouseMove = DocumentEvent.MOUSE_MOVE,
	            eventMouseUp = DocumentEvent.MOUSE_UP;
	
	        var self = this;
	
	        var onDrag = function () {
	                self._updatePosition();
	                self._updateCanvasNodePositions();
	            },
	
	            onDragEnd = function () {
	                self._updateCanvasNodePositions();
	                document.removeEventListener(eventMouseMove, onDrag, false);
	                document.removeEventListener(eventMouseUp, onDragEnd, false);
	            };
	
	        parentNode.removeChild(node);
	        parentNode.addChild(node);
	
	        document.addEventListener(eventMouseMove, onDrag, false);
	        document.addEventListener(eventMouseUp, onDragEnd, false);
	
	        this._updateCanvasNodePositions();
	    },
	
	    _updatePosition: function () {
	        var mousePos = Mouse.get().getPosition(),
	            offsetPos = this._mouseOffset;
	
	        var currPositionX = mousePos[0] - offsetPos[0],
	            currPositionY = mousePos[1] - offsetPos[1];
	
	        var node = this._node,
	            head = this._headNode,
	            position = this._position;
	
	        var maxX = window.innerWidth - node.getWidth(),
	            maxY = window.innerHeight - head.getHeight();
	
	        position[0] = Math.max(0, Math.min(currPositionX, maxX));
	        position[1] = Math.max(0, Math.min(currPositionY, maxY));
	
	        node.setPositionGlobal(position[0], position[1]);
	    },
	
	    _drawCanvasField: function () {
	        var canvas = this._canvasField,
	            context = this._contextCanvasField;
	
	        var width = canvas.width,
	            height = canvas.height,
	            invWidth = 1 / width,
	            invHeight = 1 / height;
	
	        var imageData = this._imageDataField,
	            rgb = [],
	            index = 0;
	
	        var valueHue = this._valueHue;
	
	        var i = -1, j;
	        while (++i < height) {
	            j = -1;
	
	            while (++j < width) {
	                rgb = ColorUtil.HSV2RGB(valueHue, j * invWidth * 100.0, ( 1.0 - i * invHeight ) * 100.0);
	                index = (i * width + j) * 4;
	
	                imageData.data[index] = rgb[0];
	                imageData.data[index + 1] = rgb[1];
	                imageData.data[index + 2] = rgb[2];
	                imageData.data[index + 3] = 255;
	            }
	        }
	
	        context.putImageData(imageData, 0, 0);
	    },
	
	    _drawCanvasSlider: function () {
	        var canvas = this._canvasSlider,
	            context = this._contextCanvasSlider;
	
	        var width = canvas.width,
	            height = canvas.height,
	            invHeight = 1 / height;
	
	        var imageData = this._imageDataSlider,
	            rgb = [],
	            index = 0;
	
	        var i = -1, j;
	        while (++i < height) {
	            j = -1;
	
	            while (++j < width) {
	                rgb = ColorUtil.HSV2RGB((1.0 - i * invHeight) * 360.0, 100.0, 100.0);
	                index = (i * width + j) * 4;
	
	                imageData.data[index] = rgb[0];
	                imageData.data[index + 1] = rgb[1];
	                imageData.data[index + 2] = rgb[2];
	                imageData.data[index + 3] = 255;
	            }
	        }
	
	        context.putImageData(imageData, 0, 0);
	
	    },
	
	    _onCanvasFieldMouseDown: function () {
	        var eventMouseMove = DocumentEvent.MOUSE_MOVE,
	            eventMouseUp = DocumentEvent.MOUSE_UP;
	
	        var self = this;
	
	        var onDrag = function () {
	                self._drawHandleField();
	            },
	            onDragEnd = function () {
	                document.removeEventListener(eventMouseMove, onDrag, false);
	                document.removeEventListener(eventMouseUp, onDragEnd, false);
	            };
	
	        document.addEventListener(eventMouseMove, onDrag, false);
	        document.addEventListener(eventMouseUp, onDragEnd, false);
	
	        self._drawHandleField();
	    },
	
	    _onCanvasSliderMouseDown: function () {
	        var eventMouseMove = DocumentEvent.MOUSE_MOVE,
	            eventMouseUp = DocumentEvent.MOUSE_UP;
	
	        var self = this;
	
	        var onDrag = function () {
	                self._drawHandleSlider();
	                self._drawCanvasField();
	            },
	
	            onDragEnd = function () {
	                document.removeEventListener(eventMouseMove, onDrag, false);
	                document.removeEventListener(eventMouseUp, onDragEnd, false);
	                self._drawCanvasField();
	            };
	
	        document.addEventListener(eventMouseMove, onDrag, false);
	        document.addEventListener(eventMouseUp, onDragEnd, false);
	
	        self._drawHandleSlider();
	        self._drawCanvasField();
	    },
	
	    _setSizeCanvasField: function (width, height) {
	        var canvas = this._canvasField;
	        canvas.style.width = width + 'px';
	        canvas.style.height = height + 'px';
	        canvas.width = width;
	        canvas.height = height;
	
	    },
	
	    _setSizeCanvasSlider: function (width, height) {
	        var canvas = this._canvasSlider;
	        canvas.style.width = width + 'px';
	        canvas.style.height = height + 'px';
	        canvas.width = width;
	        canvas.height = height;
	    },
	
	    open: function () {
	        var node = this._node;
	
	        this._parentNode.addChild(node);
	
	        var position = this._position;
	        if(position[0] === null || position[1] === null){
	            position[0] = window.innerWidth * 0.5 - node.getWidth() * 0.5;
	            position[1] = window.innerHeight * 0.5 - node.getHeight() * 0.5;
	        } else {
	            position[0] = Math.max(0,Math.min(position[0],window.innerWidth - node.getWidth()));
	            position[1] = Math.max(0,Math.min(position[1],window.innerHeight - node.getHeight()));
	        }
	
	        node.setPositionGlobal(position[0],position[1]);
	        this._updateCanvasNodePositions();
	    },
	
	    close: function () {
	        this._parentNode.removeChild(this._node);
	    },
	
	    _onClose: function (e) {
	        e.cancelBubble = true;
	        this.close();
	    },
	    _onPick: function () {
	        this._callbackPick();
	        this.close();
	    },
	
	    _updateCanvasNodePositions: function () {
	        var canvasSliderPos = this._canvasSliderPos,
	            canvasFieldPos = this._canvasFieldPos;
	
	        canvasSliderPos[0] = canvasSliderPos[1] = 0;
	        canvasFieldPos[0] = canvasFieldPos[1] = 0;
	
	        var element = this._canvasSlider;
	
	        while (element) {
	            canvasSliderPos[0] += element.offsetLeft;
	            canvasSliderPos[1] += element.offsetTop;
	            element = element.offsetParent;
	        }
	
	        element = this._canvasField;
	
	        while (element) {
	            canvasFieldPos[0] += element.offsetLeft;
	            canvasFieldPos[1] += element.offsetTop;
	            element = element.offsetParent;
	        }
	    },
	
	    setCallbackPick: function (func) {
	        this._callbackPick = func;
	    },
	
	    setColorHEX: function (hex) {
	        this._setColorHEX(hex);
	        this._updateColorFromHEX();
	        this._setColor();
	    },
	
	    setColorRGB: function (r, g, b) {
	        this._setColorRGB(r, g, b);
	        this._updateColorHEXFromRGB();
	        this._updateColorHSVFromRGB();
	        this._setColor();
	    },
	
	    setColorRGBfv: function (r, g, b) {
	        this.setColorRGB(Math.floor(r * 255.0),
	            Math.floor(g * 255.0),
	            Math.floor(b * 255.0));
	    },
	
	    setColorHSV: function (h, s, v) {
	        this._setColorHSV(h, s, v);
	        this._updateColorRGBFromHSV();
	        this._updateColorHEXFromRGB();
	        this._setColor();
	    },
	
	    _setColor: function () {
	        this._drawCanvasField();
	        this._drawCanvasSlider();
	        this._updateHandles();
	        this._setContrasPrevColor(this._valueR, this._valueG, this._valueB);
	    },
	
	    getR: function () {
	        return this._valueR;
	    },
	    getG: function () {
	        return this._valueG;
	    },
	    getB: function () {
	        return this._valueB;
	    },
	    getRGB: function () {
	        return [this._valueR, this._valueG, this._valueB];
	    },
	    getHue: function () {
	        return this._valueHue;
	    },
	    getSat: function () {
	        return this._valueSat;
	    },
	    getVal: function () {
	        return this._valueVal;
	    },
	    getHSV: function () {
	        return [this._valueHue, this._valueSat, this._valueVal];
	    },
	    getHEX: function () {
	        return this._valueHEX;
	    },
	    getRGBfv: function () {
	        return [this._valueR / 255.0, this._valueG / 255.0, this._valueB / 255.0];
	    },
	
	    getNode: function () {
	        return this._node;
	    }
	};
	
	Picker.setup = function (parentNode) {
	    return Picker._instance = new Picker(parentNode);
	};
	Picker.get = function () {
	    return Picker._instance;
	};
	Picker.destroy = function(){
	    Picker._instance = null;
	};
	
	module.exports = Picker;

/***/ },
/* 53 */
/*!*********************************************************!*\
  !*** ./~/controlkit/lib/core/color/ColorFormatError.js ***!
  \*********************************************************/
/***/ function(module, exports) {

	function ColorFormatError(msg) {
		Error.apply(this);
		Error.captureStackTrace(this,ColorFormatError);
		this.name = 'ColorFormatError';
		this.message = msg;
	}
	ColorFormatError.prototype = Object.create(Error.prototype);
	ColorFormatError.prototype.constructor = ColorFormatError;
	
	module.exports = ColorFormatError;

/***/ },
/* 54 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/component/Button.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Event_         = __webpack_require__(/*! ../core/event/Event */ 21),
	    NodeEvent      = __webpack_require__(/*! ../core/document/NodeEvent */ 19),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	var Node      = __webpack_require__(/*! ../core/document/Node */ 10),
	    Component = __webpack_require__(/*! ../core/Component */ 29);
	
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	
	var DEFAULT_LABEL = '';
	
	function Button(parent,label,onPress,params) {
	    onPress      = onPress || function(){};
	    params       = params       || {};
	    params.label = params.label || DEFAULT_LABEL;
	
	    Component.apply(this,[parent,params.label]);
	
	    var node = this._inputNode = new Node(Node.INPUT_BUTTON);
	
	    node.setStyleClass(CSS.Button);
	    node.setProperty('value',label);
	
	    var self = this;
	    node.addEventListener(NodeEvent.ON_CLICK,
	                           function() {
	                               onPress.bind(self)();
	                               self.dispatchEvent(new Event_(self,ComponentEvent.VALUE_UPDATED));
	                           });
	
	    this._wrapNode.addChild(node);
	}
	Button.prototype = Object.create(Component.prototype);
	Button.prototype.constructor = Button;
	
	Button.prototype.getButtonLabel = function(){
	    return this._inputNode.getProperty('value');
	};
	
	Button.prototype.setButtonLabel = function(label){
	    this._inputNode.setProperty('value',label);
	};
	
	module.exports = Button;


/***/ },
/* 55 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/component/Select.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectComponent = __webpack_require__(/*! ../core/ObjectComponent */ 26);
	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	var CSS  = __webpack_require__(/*! ../core/document/CSS */ 17);
	
	var Options = __webpack_require__(/*! ./Options */ 43);
	
	var History = __webpack_require__(/*! ../core/History */ 27);
	
	var Event_         = __webpack_require__(/*! ../core/event/Event */ 21),
	    NodeEvent      = __webpack_require__(/*! ../core/document/NodeEvent */ 19),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25),
	    OptionEvent    = __webpack_require__(/*! ../core/OptionEvent */ 31);
	
	var ObjectComponentNotifier = __webpack_require__(/*! ../core/ObjectComponentNotifier */ 30);
	
	var STR_CHOOSE = 'Choose ...';
	
	function Select(parent, object, value, params) {
	    ObjectComponent.apply(this, arguments);
	
	    params = params || {};
	    params.onChange = params.onChange || this._onChange;
	    this._onChange = params.onChange;
	
	    var obj = this._obj,
	        key = this._key;
	
	    var targetKey = this._targetKey = params.target,
	        values = this._values = obj[key];
	
	
	    this._selectedIndex = -1;
	    this._selected = null;
	
	    var select = this._select = new Node(Node.INPUT_BUTTON);
	        select.setStyleClass(CSS.Select);
	        select.addEventListener(NodeEvent.MOUSE_DOWN, this._onOptionTrigger.bind(this));
	
	    if(this._hasTarget()) {
	        var targetObj = obj[targetKey] || '';
	        var i = -1;
	        while (++i < values.length) {
	            if (targetObj == values[i]){
	                this._selected = values[i];
	            }
	        }
	        select.setProperty('value', targetObj.toString().length > 0 ? targetObj : values[0]);
	    }
	    else {
	        select.setProperty('value', params.selected ? values[params.selected] : STR_CHOOSE);
	    }
	
	    this._wrapNode.addChild(select);
	
	    ObjectComponentNotifier.get().addEventListener(OptionEvent.TRIGGER, this, 'onOptionTrigger');
	    this.addEventListener(OptionEvent.TRIGGERED, ObjectComponentNotifier.get(), 'onOptionTriggered');
	}
	Select.prototype = Object.create(ObjectComponent.prototype);
	Select.prototype.constructor = Select;
	
	Select.prototype.onOptionTrigger = function (e) {
	    if (e.data.origin == this) {
	        this._active = !this._active;
	        this._updateAppearance();
	
	        if (this._active) {
	            this._buildOptions();
	        }
	        else {
	            Options.get().clear();
	        }
	        return;
	    }
	    this._active = false;
	    this._updateAppearance();
	};
	
	Select.prototype._buildOptions = function () {
	    var options = Options.get();
	    var self = this;
	
	    options.build(this._values, this._selected, this._select,
	        function(){
	            self.applyValue();
	            self._active = false;
	            self._updateAppearance();
	            self._selectedIndex = options.getSelectedIndex();
	            self._onChange(self._selectedIndex);
	            options.clear();
	        },
	        function(){
	            self._active = false;
	            self._updateAppearance();
	            options.clear()
	        }, false);
	};
	
	Select.prototype._applySelected = function(selected){
	    this._select.setProperty('value',selected);
	    this.dispatchEvent(new Event_(this,ComponentEvent.VALUE_UPDATED),null);
	}
	
	Select.prototype.applyValue = function () {
	    var index = Options.get().getSelectedIndex(),
	        selected = this._selected = this._values[index];
	
	    if (this._hasTarget()) {
	        this.pushHistoryState();
	        this._obj[this._targetKey] = selected;
	    }
	
	    this._applySelected(selected);
	};
	
	Select.prototype.pushHistoryState = function () {
	    var obj = this._obj,
	        key = this._targetKey;
	    History.get().pushState(obj, key, obj[key]);
	};
	
	Select.prototype._onOptionTrigger = function () {
	    this.dispatchEvent(new Event_(this, OptionEvent.TRIGGERED, null));
	};
	
	Select.prototype._updateAppearance = function () {
	    this._select.setStyleClass(this._active ? CSS.SelectActive : CSS.Select);
	};
	
	Select.prototype.onValueUpdate = function (e) {
	    if (!this._hasTarget()){
	        return;
	    }
	    this._selected = this._obj[this._targetKey];
	    this._select.setProperty('value', this._selected.toString());
	};
	
	Select.prototype._hasTarget = function () {
	    return this._targetKey != null;
	};
	
	Select.prototype.setValue = function(value){
	    this._selectedIndex = value;
	    if(value == -1){
	        this._selected = null;
	        this._select.setProperty('value', STR_CHOOSE);
	        return;
	    }
	    this._selected = this._values[this._selectedIndex];
	    this._applySelected(this._selected);
	};
	
	Select.prototype.getData = function(){
	    var obj = {};
	        obj['selectedIndex'] = this._selectedIndex;
	    return obj;
	};
	
	module.exports = Select;


/***/ },
/* 56 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/component/Slider.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectComponent = __webpack_require__(/*! ../core/ObjectComponent */ 26);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	var Slider_Internal = __webpack_require__(/*! ./Slider_Internal */ 57);
	
	var History = __webpack_require__(/*! ../core/History */ 27);
	var Range = __webpack_require__(/*! ./Range */ 49);
	var NumberInput_Internal = __webpack_require__(/*! ./NumberInput_Internal */ 48);
	
	var Event_         = __webpack_require__(/*! ../core/event/Event */ 21),
	    DocumentEvent  = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    PanelEvent     = __webpack_require__(/*! ../group/PanelEvent */ 23),
	    GroupEvent     = __webpack_require__(/*! ../group/GroupEvent */ 24),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	var DEFAULT_STEP = 1.0,
	    DEFAULT_DP   = 2;
	
	
	function Slider(parent,object,value,range,params) {
	    params          = params          || {};
	    params.label    = params.label    || value;
	
	    ObjectComponent.apply(this,[parent,object,range,params]);
	
	    this._values  = this._obj[this._key];
	    this._targetKey = value;
	
	    params.step     = params.step     || DEFAULT_STEP;
	    params.dp       = (params.dp === undefined || params.dp == null) ?  DEFAULT_DP : params.dp;
	    params.onChange = params.onChange || this._onChange;
	    params.onFinish = params.onFinish || function(){};
	
	    this._dp       = params.dp;
	    this._onChange = params.onChange;
	    this._onFinish = params.onFinish;
	
	    var values    = this._values,
	        obj       = this._obj,
	        targetKey = this._targetKey;
	
	    var wrap  = this._wrapNode;
	        wrap.setStyleClass(CSS.WrapSlider);
	
	    var slider = this._slider = new Slider_Internal(wrap,
	                                                    this._onSliderBegin.bind(this),
	                                                    this._onSliderMove.bind(this),
	                                                    this._onSliderEnd.bind(this));
	
	    slider.setBoundMax(values[1]);
	    slider.setBoundMin(values[0]);
	    slider.setValue(obj[targetKey]);
	
	    var input  = this._input = new NumberInput_Internal(params.step, params.dp, null,
	                                                        this._onInputChange.bind(this));
	
	    input.setValue(obj[targetKey]);
	
	    wrap.addChild(input.getNode());
	
	    this._parent.addEventListener(PanelEvent.PANEL_MOVE_END,    this, 'onPanelMoveEnd');
	    this._parent.addEventListener(GroupEvent.GROUP_SIZE_CHANGE, this, 'onGroupWidthChange');
	    this._parent.addEventListener(DocumentEvent.WINDOW_RESIZE,  this, 'onWindowResize');
	}
	Slider.prototype = Object.create(ObjectComponent.prototype);
	Slider.prototype.constructor = Slider;
	
	Slider.prototype.pushHistoryState = function () {
	    var obj = this._obj,
	        key = this._targetKey;
	    History.get().pushState(obj, key, obj[key]);
	};
	
	Slider.prototype._onSliderBegin = function () {
	    this.pushHistoryState();
	};
	
	Slider.prototype._onSliderMove = function () {
	    this.applyValue();
	    this._updateValueField();
	    this.dispatchEvent(new Event_(this, ComponentEvent.VALUE_UPDATED, null));
	    this._onChange();
	};
	
	Slider.prototype._onSliderEnd = function () {
	    this.applyValue();
	    this._updateValueField();
	    this.dispatchEvent(new Event_(this, ComponentEvent.VALUE_UPDATED, null));
	    this._onFinish();
	};
	
	Slider.prototype._onInputChange = function () {
	    var input = this._input,
	        valueMin = this._values[0],
	        valueMax = this._values[1];
	
	    if (input.getValue() >= valueMax){
	        input.setValue(valueMax);
	    }
	    if (input.getValue() <= valueMin){
	        input.setValue(valueMin);
	    }
	
	    var value = input.getValue();
	
	    this._slider.setValue(value);
	    this._obj[this._targetKey] = value;
	    this.dispatchEvent(new Event_(this, ComponentEvent.VALUE_UPDATED, null));
	    this._onFinish();
	};
	
	Slider.prototype.applyValue = function () {
	    var value  = this._slider.getValue();
	    this._obj[this._targetKey] = parseFloat(value.toFixed(this._dp));
	    this._input.setValue(value);
	};
	
	
	Slider.prototype.onValueUpdate = function (e) {
	    var origin = e.data.origin;
	    if (origin == this){
	        return;
	    }
	    var slider = this._slider;
	    if (!(origin instanceof Slider)) {
	        var values = this._values;
	        slider.setBoundMin(values[0]);
	        slider.setBoundMax(values[1]);
	        if (!(origin instanceof Range)) {
	            slider.setValue(this._obj[this._targetKey]);
	        }
	    }
	    else {
	        slider.setValue(this._obj[this._targetKey]);
	    }
	    this.applyValue();
	};
	
	
	Slider.prototype._updateValueField = function () {
	    this._input.setValue(this._slider.getValue());
	};
	
	Slider.prototype.onPanelMoveEnd =
	    Slider.prototype.onGroupWidthChange =
	        Slider.prototype.onWindowResize = function () {
	            this._slider.resetOffset();
	        };
	
	Slider.prototype.setValue = function(value){
	    if(value == -1){
	        return;
	    }
	    this._obj[this._targetKey] = value;
	    this.dispatchEvent(new Event_(this,ComponentEvent.VALUE_UPDATED,null));
	};
	
	Slider.prototype.getData = function(){
	    var obj = {};
	        obj[this._targetKey] = this._obj[this._targetKey];
	    return obj;
	};
	
	module.exports = Slider;

/***/ },
/* 57 */
/*!*******************************************************!*\
  !*** ./~/controlkit/lib/component/Slider_Internal.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	
	var DocumentEvent = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    NodeEvent = __webpack_require__(/*! ../core/document/NodeEvent */ 19);
	
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	var Mouse = __webpack_require__(/*! ../core/document/Mouse */ 20);
	
	function Slider_Internal(parentNode,onBegin,onChange,onFinish) {
	    this._bounds = [0,1];
	    this._value  = 0;
	    this._intrpl = 0;
	    this._focus  = false;
	
	
	    this._onBegin  = onBegin  || function(){};
	    this._onChange = onChange || function(){};
	    this._onFinish = onFinish || function(){};
	
	
	    var wrap = new Node().setStyleClass(CSS.SliderWrap);
	    parentNode.addChild(wrap);
	
	    var slot   = this._slot   = {node:    new Node().setStyleClass(CSS.SliderSlot),
	                                 offsetX: 0,
	                                 width:   0,
	                                 padding: 3};
	
	    var handle = this._handle = {node    : new Node().setStyleClass(CSS.SliderHandle),
	                                 width   : 0,
	                                 dragging: false};
	
	    wrap.addChild(slot.node);
	    slot.node.addChild(handle.node);
	
	    slot.offsetX = slot.node.getPositionGlobalX();
	    slot.width   = Math.floor(slot.node.getWidth() - slot.padding * 2) ;
	
	    handle.node.setWidth(handle.width);
	
	    slot.node.addEventListener(NodeEvent.MOUSE_DOWN,this._onSlotMouseDown.bind(this));
	    slot.node.addEventListener(NodeEvent.MOUSE_UP,  this._onSlotMouseUp.bind(this));
	
	    document.addEventListener(DocumentEvent.MOUSE_MOVE,this._onDocumentMouseMove.bind(this));
	    document.addEventListener(DocumentEvent.MOUSE_UP,  this._onDocumentMouseUp.bind(this));
	}
	
	Slider_Internal.prototype._onDocumentMouseMove = function(){
	    if(!this._handle.dragging){
	        return;
	    }
	    this._update();
	    this._onChange();
	};
	
	Slider_Internal.prototype._onDocumentMouseUp = function(){
	    if(this._handle.dragging){
	        this._onFinish();
	    }
	    this._handle.dragging = false;
	};
	
	Slider_Internal.prototype._onSlotMouseDown = function(){
	    this._onBegin();
	    this._focus = true;
	    this._handle.dragging = true;
	    this._handle.node.getElement().focus();
	    this._update();
	};
	
	Slider_Internal.prototype._onSlotMouseUp = function(){
	    if (this._focus) {
	        var handle = this._handle;
	        if (handle.dragging){
	            this._onFinish();
	        }
	        handle.dragging = false;
	    }
	    this._focus = false;
	};
	
	Slider_Internal.prototype._update = function(){
	    var mx = Mouse.get().getX(),
	        sx = this._slot.offsetX,
	        sw = this._slot.width,
	        px = (mx < sx) ? 0 : (mx > (sx + sw)) ? sw : (mx - sx);
	
	    this._handle.node.setWidth(Math.round(px));
	    this._intrpl = px / sw;
	    this._interpolateValue();
	};
	
	Slider_Internal.prototype._updateHandle = function(){
	    var slotWidth   = this._slot.width,
	        handleWidth = Math.round(this._intrpl * slotWidth);
	    this._handle.node.setWidth(Math.min(handleWidth,slotWidth));
	};
	
	Slider_Internal.prototype._interpolateValue = function () {
	    var intrpl = this._intrpl,
	        bounds = this._bounds;
	    this._value = bounds[0] * (1.0 - intrpl) + bounds[1] * intrpl;
	};
	
	Slider_Internal.prototype.resetOffset = function () {
	    var slot = this._slot;
	    slot.offsetX = slot.node.getPositionGlobalX();
	    slot.width = Math.floor(slot.node.getWidth() - slot.padding * 2)
	};
	
	Slider_Internal.prototype.setBoundMin = function (value) {
	    var bounds = this._bounds;
	    if (value >= bounds[1]){
	        return;
	    }
	    bounds[0] = value;
	    this._updateFromBounds();
	};
	
	Slider_Internal.prototype.setBoundMax = function (value) {
	    var bounds = this._bounds;
	    if (value <= bounds[0]){
	        return;
	    }
	    bounds[1] = value;
	    this._updateFromBounds();
	};
	
	Slider_Internal.prototype._updateFromBounds = function () {
	    var boundsMin = this._bounds[0],
	        boundsMax = this._bounds[1];
	    this._value = Math.max(boundsMin,Math.min(this._value,boundsMax));
	    this._intrpl = Math.abs((this._value - boundsMin) / (boundsMin - boundsMax));
	    this._updateHandle();
	};
	
	Slider_Internal.prototype.setValue = function (value) {
	    var boundsMin = this._bounds[0],
	        boundsMax = this._bounds[1];
	
	    if (value < boundsMin || value > boundsMax){
	        return;
	    }
	    this._intrpl = Math.abs((value - boundsMin) / (boundsMin - boundsMax));
	    this._updateHandle();
	    this._value = value;
	};
	
	Slider_Internal.prototype.getValue = function () {
	    return this._value;
	};
	
	
	module.exports = Slider_Internal;

/***/ },
/* 58 */
/*!*******************************************!*\
  !*** ./~/controlkit/lib/component/Pad.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Plotter = __webpack_require__(/*! ./Plotter */ 34);
	var Mouse = __webpack_require__(/*! ../core/document/Mouse */ 20);
	
	var Event_         = __webpack_require__(/*! ../core/event/Event */ 21),
	    DocumentEvent  = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	var DEFAULT_BOUNDS_X = [-1,1],
	    DEFAULT_BOUNDS_Y = [-1,1],
	    DEFAULT_LABEL_X  = '',
	    DEFAULT_LABEL_Y  = '';
	
	function Pad(parent, object, value, params) {
	    Plotter.apply(this,arguments);
	
	    params            = params            || {};
	    params.boundsX    = params.boundsX    || DEFAULT_BOUNDS_X;
	    params.boundsY    = params.boundsY    || DEFAULT_BOUNDS_Y;
	    params.labelX     = params.labelX     || DEFAULT_LABEL_X;
	    params.labelY     = params.labelY     || DEFAULT_LABEL_Y;
	
	    params.showCross  = params.showCross  || true;
	
	
	    this._onChange     = params.onChange || this._onChange;
	    this._onFinish     = params.onFinish || function(){};
	
	    this._boundsX      = params.boundsX;
	    this._boundsY      = params.boundsY;
	    this._labelAxisX   = params.labelX != '' && params.labelX != 'none' ? params.labelX : null;
	    this._labelAxisY   = params.labelY != '' && params.labelY != 'none' ? params.labelY : null;
	
	    var path = this._path;
	        path.style.strokeWidth = 1;
	        path.style.stroke      = '#363c40';
	
	    this._grid.style.stroke = 'rgb(25,25,25)';
	
	    this._svgPos = [0,0];
	
	
	    var handle = this._handle = this._svgRoot.appendChild(this._createSVGObject('g'));
	    var handleCircle0 = handle.appendChild(this._createSVGObject('circle'));
	        handleCircle0.setAttribute('r',String(11));
	        handleCircle0.setAttribute('fill','rgba(0,0,0,0.05)');
	    var handleCircle1 = handle.appendChild(this._createSVGObject('circle'));
	        handleCircle1.setAttribute('r',String(10));
	        handleCircle1.setAttribute('fill','rgb(83,93,98)');
	
	    var handleCircle2 = handle.appendChild(this._createSVGObject('circle'));
	        handleCircle2.setAttribute('r',String(9));
	        handleCircle2.setAttribute('fill','rgb(57,69,76)');
	        handleCircle2.setAttribute('cy',String(0.75));
	
	    var handleCircle3 = handle.appendChild(this._createSVGObject('circle'));
	        handleCircle3.setAttribute('r',String(10));
	        handleCircle3.setAttribute('stroke','rgb(17,19,20)');
	        handleCircle3.setAttribute('stroke-width',String(1));
	        handleCircle3.setAttribute('fill','none');
	
	    var handleCircle4 = handle.appendChild(this._createSVGObject('circle'));
	        handleCircle4.setAttribute('r',String(6));
	        handleCircle4.setAttribute('fill','rgb(30,34,36)');
	    var handleCircle5 = handle.appendChild(this._createSVGObject('circle'));
	        handleCircle5.setAttribute('r',String(3));
	        handleCircle5.setAttribute('fill','rgb(255,255,255)');
	
	        handle.setAttribute('tranform','translate(0 0)');
	
	    this._svg.addEventListener(DocumentEvent.MOUSE_DOWN,this._onDragStart.bind(this),false);
	    this._drawValue(this._obj[this._key]);
	}
	Pad.prototype = Object.create(Plotter.prototype);
	Pad.prototype.constructor = Pad;
	
	Pad.prototype._onDragStart = function () {
	    var svgPos = this._svgPos;
	    svgPos[0] = 0;
	    svgPos[1] = 0;
	
	    //skip to container
	    var element = this._svg.parentNode;
	
	    while (element) {
	        svgPos[0] += element.offsetLeft;
	        svgPos[1] += element.offsetTop;
	        element = element.offsetParent;
	    }
	
	    var eventMove = DocumentEvent.MOUSE_MOVE,
	        eventUp   = DocumentEvent.MOUSE_UP;
	
	    var onDrag = function () {
	        this._drawValueInput();
	        this.applyValue();
	        this._onChange();
	    }.bind(this);
	
	    var onDragEnd = function () {
	        this.pushHistoryState();
	        this._drawValueInput();
	        this.applyValue();
	        this._onFinish();
	
	        document.removeEventListener(eventMove, onDrag, false);
	        document.removeEventListener(eventUp, onDragEnd, false);
	    }.bind(this);
	
	    document.addEventListener(eventMove, onDrag,    false);
	    document.addEventListener(eventUp,   onDragEnd, false);
	
	    this._drawValueInput();
	    this.applyValue();
	    this._onChange();
	};
	
	Pad.prototype._redraw = function () {
	    this._drawValue(this._obj[this._key]);
	};
	
	Pad.prototype._drawValueInput = function () {
	    this._drawValue(this._getMouseNormalized());
	};
	
	Pad.prototype._drawValue = function (value) {
	    this._obj[this._key] = value;
	    this._drawGrid();
	    this._drawPoint();
	};
	
	Pad.prototype._drawGrid = function () {
	    var svgSize = Number(this._svg.getAttribute('width')),
	        svgMidX = Math.floor(svgSize * 0.5),
	        svgMidY = Math.floor(svgSize * 0.5);
	
	    var pathCmd = '';
	    pathCmd += this._pathCmdLine(0, svgMidY, svgSize, svgMidY);
	    pathCmd += this._pathCmdLine(svgMidX, 0, svgMidX, svgSize);
	
	    this._grid.setAttribute('d', pathCmd);
	};
	
	
	Pad.prototype._drawPoint = function () {
	    var svgSize = Number(this._svg.getAttribute('width'));
	
	    var value = this._obj[this._key];
	
	    var localX = ( 0.5 + value[0] * 0.5 ) * svgSize,
	        localY = ( 0.5 + -value[1] * 0.5 ) * svgSize;
	
	    var pathCmd = '';
	        pathCmd += this._pathCmdLine(0, localY, svgSize, localY);
	        pathCmd += this._pathCmdLine(localX, 0, localX, svgSize);
	
	    this._path.setAttribute('d', pathCmd);
	    this._handle.setAttribute('transform', 'translate(' + localX + ' ' + localY + ')');
	};
	
	Pad.prototype._getMouseNormalized = function () {
	    var offset = this._svgPos,
	        mouse = Mouse.get().getPosition(),
	        svgSize = Number(this._svg.getAttribute('width'));
	
	    return [-1 + Math.max(0, Math.min(mouse[0] - offset[0], svgSize)) / svgSize * 2,
	            ( 1 - Math.max(0, Math.min(mouse[1] - offset[1], svgSize)) / svgSize * 2)];
	
	};
	
	Pad.prototype.applyValue = function () {
	    this.dispatchEvent(new Event_(this, ComponentEvent.VALUE_UPDATED, null));
	};
	
	Pad.prototype.onValueUpdate = function (e) {
	    if (e.data.origin == this)return;
	    this._drawValue(this._obj[this._key]);
	};
	
	module.exports = Pad;


/***/ },
/* 59 */
/*!****************************************************!*\
  !*** ./~/controlkit/lib/component/NumberOutput.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Output = __webpack_require__(/*! ./Output */ 60);
	
	var DEFAULT_OUTPUT_DP = 2;
	
	function NumberOutput(parent, object, value, params) {
		params = params || {};
		params.dp = params.dp || DEFAULT_OUTPUT_DP;
	
		Output.apply(this, arguments);
		this._valueDp = params.dp + 1;
	}
	NumberOutput.prototype = Object.create(Output.prototype);
	NumberOutput.prototype.constructor = NumberOutput;
	
	//FIXME
	NumberOutput.prototype._setValue = function () {
		if (this._parent.isDisabled()){
			return;
		}
	
		var value = this._obj[this._key],
			textArea = this._textArea,
			dp = this._valueDp;
	
		var index,
			out;
	
		if (typeof(value) === 'object' &&
			typeof(value.length) === 'number' &&
			typeof(value.splice) === 'function' &&
			!value.propertyIsEnumerable('length')) {
	
			out = value.slice();
	
			var i = -1;
			var temp;
			var wrap = this._wrap;
	
			while (++i < out.length) {
				temp = out[i] = out[i].toString();
				index = temp.indexOf('.');
				if (index > 0){
					out[i] = temp.slice(0, index + dp);
				}
			}
	
			if (wrap) {
				textArea.setStyleProperty('white-space', 'nowrap');
				out = out.join('\n');
			}
	
			textArea.setProperty('value', out);
		}else {
			out = value.toString();
			index = out.indexOf('.');
			textArea.setProperty('value', index > 0 ? out.slice(0, index + dp) : out);
		}
	
	};
	
	module.exports = NumberOutput;

/***/ },
/* 60 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/component/Output.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectComponent = __webpack_require__(/*! ../core/ObjectComponent */ 26);
	var Node = __webpack_require__(/*! ../core/document/Node */ 10);
	
	var CSS       = __webpack_require__(/*! ../core/document/CSS */ 17);
	var Metric    = __webpack_require__(/*! ./Metric */ 16);
	var ScrollBar = __webpack_require__(/*! ../core/layout/ScrollBar */ 15);
	
	var Event_         = __webpack_require__(/*! ../core/event/Event */ 21),
	    DocumentEvent  = __webpack_require__(/*! ../core/document/DocumentEvent */ 18),
	    NodeEvent      = __webpack_require__(/*! ../core/document/NodeEvent */ 19),
	    ComponentEvent = __webpack_require__(/*! ../core/ComponentEvent */ 25);
	
	var DEFAULT_HEIGHT = null,
	    DEFAULT_WRAP   = false,
	    DEFAULT_UPDATE = true;
	
	function Output(parent,object,value,params) {
	    ObjectComponent.apply(this,arguments);
	
	    params        = params        || {};
	    params.height = params.height || DEFAULT_HEIGHT;
	    params.wrap   = params.wrap   === undefined ? DEFAULT_WRAP : params.wrap;
	    params.update = params.update === undefined ? DEFAULT_UPDATE : params.update;
	
	    this._wrap   = params.wrap;
	    this._update = params.update;
	
	    var textArea = this._textArea = new Node(Node.TEXTAREA),
	        wrap = this._wrapNode,
	        root = this._node;
	
	        textArea.setProperty('readOnly',true);
	        wrap.addChild(textArea);
	
	        textArea.addEventListener(NodeEvent.MOUSE_DOWN,this._onInputDragStart.bind(this));
	        this.addEventListener(ComponentEvent.INPUT_SELECT_DRAG,this._parent,'onComponentSelectDrag');
	
	
	    if(params.height){
	        var textAreaWrap = new Node();
	            textAreaWrap.setStyleClass(CSS.TextAreaWrap);
	            textAreaWrap.addChild(textArea);
	            wrap.addChild(textAreaWrap);
	
	        //FIXME
	        var height  = this._height = params.height,
	            padding = 4;
	
	            textArea.setHeight(Math.max(height + padding  ,Metric.COMPONENT_MIN_HEIGHT));
	            wrap.setHeight(textArea.getHeight());
	            root.setHeight(wrap.getHeight() + padding);
	
	        this._scrollBar = new ScrollBar(textAreaWrap,textArea,height - padding)
	    }
	
	    if(params.wrap){
	        textArea.setStyleProperty('white-space','pre-wrap');
	    }
	
	    this._prevString = '';
	    this._prevScrollHeight = -1;
	    this._setValue();
	}
	Output.prototype = Object.create(ObjectComponent.prototype);
	Output.prototype.constructor = Output;
	
	//Override in subclass
	Output.prototype._setValue = function () {};
	
	Output.prototype.onValueUpdate = function () {
	    this._setValue();
	};
	
	Output.prototype.update = function () {
	    if(!this._update){
	        return;
	    }
	    this._setValue();
	};
	
	//Prevent chrome select drag
	
	Output.prototype._onDrag = function(){
	    this.dispatchEvent(new Event_(this, ComponentEvent.INPUT_SELECT_DRAG, null));
	};
	
	Output.prototype._onDragFinish = function(){
	    this.dispatchEvent(new Event_(this, ComponentEvent.INPUT_SELECT_DRAG, null));
	
	    document.removeEventListener(DocumentEvent.MOUSE_MOVE, this._onDrag, false);
	    document.removeEventListener(DocumentEvent.MOUSE_MOVE, this._onDragFinish, false);
	};
	
	Output.prototype._onInputDragStart = function() {
	    this.dispatchEvent(new Event_(this, ComponentEvent.INPUT_SELECT_DRAG, null));
	    document.addEventListener(DocumentEvent.MOUSE_MOVE, this._onDrag.bind(this), false);
	    document.addEventListener(DocumentEvent.MOUSE_UP,   this._onDragFinish.bind(this), false);
	};
	
	
	module.exports = Output;


/***/ },
/* 61 */
/*!****************************************************!*\
  !*** ./~/controlkit/lib/component/StringOutput.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Output = __webpack_require__(/*! ./Output */ 60);
	
	StringOutput = function (parent, object, value, params) {
	    Output.apply(this, arguments);
	};
	StringOutput.prototype = Object.create(Output.prototype);
	StringOutput.prototype.constructor = StringOutput;
	
	StringOutput.prototype._setValue = function () {
	    if (this._parent.isDisabled()) {
	        return;
	    }
	    var textAreaString = this._obj[this._key];
	
	    if (textAreaString == this._prevString){
	        return;
	    }
	    var textArea = this._textArea,
	        textAreaElement = textArea.getElement(),
	        textAreaScrollHeight;
	
	    textArea.setProperty('value', textAreaString);
	    textAreaScrollHeight = textAreaElement.scrollHeight;
	    textArea.setHeight(textAreaScrollHeight);
	
	    var scrollBar = this._scrollBar;
	
	    if (scrollBar) {
	        if (textAreaScrollHeight <= this._wrapNode.getHeight()) {
	            scrollBar.disable();
	        }
	        else {
	            scrollBar.enable();
	            scrollBar.update();
	            scrollBar.reset();
	        }
	    }
	    this._prevString = textAreaString;
	};
	
	module.exports = StringOutput;


/***/ },
/* 62 */
/*!**********************************************!*\
  !*** ./~/controlkit/lib/component/Canvas.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component = __webpack_require__(/*! ../core/Component */ 29);
	var CSS       = __webpack_require__(/*! ../core/document/CSS */ 17),
	    Metric    = __webpack_require__(/*! ./Metric */ 16);
	
	var Event_     = __webpack_require__(/*! ../core/event/Event */ 21),
	    GroupEvent = __webpack_require__(/*! ../group/GroupEvent */ 24);
	
	function Canvas(parent,params) {
	    Component.apply(this,arguments);
	
	    var wrap = this._wrapNode;
	        wrap.setStyleClass(CSS.CanvasWrap);
	    var canvas = this._canvas = document.createElement('canvas');
	        wrap.getElement().appendChild(canvas);
	
	    var width = wrap.getWidth();
	    this._canvasWidth = this._canvasHeight = 0;
	    this._setCanvasSize(width,width);
	    this._updateHeight();
	
	    this._node.setStyleClass(CSS.CanvasListItem);
	    this._parent.addEventListener(GroupEvent.GROUP_SIZE_CHANGE,this,  'onGroupSizeChange');
	    this.addEventListener(GroupEvent.GROUP_SIZE_UPDATE,this._parent,'onGroupSizeUpdate');
	}
	Canvas.prototype = Object.create(Component.prototype);
	Canvas.prototype.constructor = Canvas;
	
	Canvas.prototype._updateHeight = function () {
	    var canvasHeight = this._canvas.height;
	
	    this._wrapNode.setHeight(canvasHeight);
	    this._node.setHeight(canvasHeight + Metric.PADDING_WRAPPER);
	};
	
	Canvas.prototype.onGroupSizeChange = function () {
	    var width = this._wrapNode.getWidth();
	
	    this._setCanvasSize(width, width);
	    this._updateHeight();
	    this._redraw();
	
	    this.dispatchEvent(new Event_(this, GroupEvent.GROUP_SIZE_UPDATE, null));
	};
	
	Canvas.prototype._setCanvasSize = function (width, height) {
	    var canvasWidth = this._canvasWidth = width,
	        canvasHeight = this._canvasHeight = height;
	
	    var canvas = this._canvas;
	        canvas.style.width = canvasWidth + 'px';
	        canvas.style.height = canvasHeight + 'px';
	        canvas.width = canvasWidth;
	        canvas.height = canvasHeight;
	};
	
	Canvas.prototype.getCanvas = function () {
	    return this._canvas;
	};
	
	Canvas.prototype.getContext = function () {
	    return this._canvas.getContext('2d');
	};
	
	module.exports = Canvas;


/***/ },
/* 63 */
/*!*******************************************!*\
  !*** ./~/controlkit/lib/component/SVG.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component = __webpack_require__(/*! ./../core/Component */ 29);
	var CSS = __webpack_require__(/*! ../core/document/CSS */ 17);
	var Metric = __webpack_require__(/*! ./Metric */ 16);
	var GroupEvent = __webpack_require__(/*! ../group/GroupEvent */ 24);
	
	function SVG(parent, params) {
	    Component.apply(this, arguments);
	
	    var wrap = this._wrapNode;
	        wrap.setStyleClass(CSS.CanvasWrap);
	    var wrapSize = wrap.getWidth();
	
	    var svg = this._svg = this._createSVGObject('svg');
	        svg.setAttribute('version', '1.2');
	        svg.setAttribute('baseProfile', 'tiny');
	        svg.setAttribute('preserveAspectRatio', 'true');
	
	    wrap.getElement().appendChild(svg);
	
	    this._svgSetSize(wrapSize, wrapSize);
	    this._updateHeight();
	
	    this._node.setStyleClass(CSS.CanvasListItem);
	
	    this._parent.addEventListener(GroupEvent.GROUP_SIZE_CHANGE, this, 'onGroupSizeChange');
	    this.addEventListener(GroupEvent.GROUP_SIZE_UPDATE, this._parent, 'onGroupSizeUpdate');
	}
	SVG.prototype = Object.create(Component.prototype);
	SVG.prototype.constructor = SVG;
	
	SVG.prototype._updateHeight = function () {
	    var svgHeight = Number(this._svg.getAttribute('height'));
	    this._wrapNode.setHeight(svgHeight);
	    this._node.setHeight(svgHeight + Metric.PADDING_WRAPPER);
	};
	
	SVG.prototype.onGroupSizeChange = function () {
	    var width = this._wrapNode.getWidth();
	    this._svgSetSize(width, width);
	    this._updateHeight();
	};
	
	SVG.prototype._svgSetSize = function (width, height) {
	    var svg = this._svg;
	    svg.setAttribute('width', width);
	    svg.setAttribute('height', height);
	    svg.setAttribute('viewbox', '0 0 ' + width + ' ' + height);
	};
	
	SVG.prototype.getSVG = function () {
	    return this._svg;
	};
	
	module.exports = SVG;

/***/ },
/* 64 */
/*!****************************************!*\
  !*** ./~/controlkit/lib/core/State.js ***!
  \****************************************/
/***/ function(module, exports) {

	var DialogTemplate =
	    '<head>\n' +
	    '   <title>ControlKit State</title>\n' +
	    '   <style type="text/css">\n' +
	    '      body{\n' +
	    '          box-sizing: border-box;\n' +
	    '          padding: 20px;\n' +
	    '          margin: 0;\n' +
	    '          font-family: Arial, sans-serif;\n' +
	    '          width: 100%;\n' +
	    '      }\n' +
	    '      textarea{\n' +
	    '          margin-bottom:10px;\n' +
	    '          box-sizing: border-box;\n' +
	    '          padding: 0;\n' +
	    '          border: 0;\n' +
	    '          border: 1px solid #dedede;\n' +
	    '          outline: none;\n' +
	    '          font-family: Monaco, monospace;\n' +
	    '          font-size: 11px;\n' +
	    '          resize: none;\n' +
	    '          word-wrap: break-word;\n' +
	    '          display: block;\n' +
	    '          width: 100%;\n' +
	    '          overflow-y: scroll;\n' +
	    '          height: 125px;\n' +
	    '      }\n' +
	    '      button{\n' +
	    '          margin: 0;\n' +
	    '          padding: 0 5px 3px 5px;\n' +
	    '          height: 20px;\n' +
	    '      }\n'+
	    '      #save,#filename,#load{\n' +
	    '          float: right;\n' +
	    '      }\n' +
	    '      input[type="text"]{\n' +
	    '          margin: 0;\n' +
	    '          padding: 0;\n' +
	    '          width: 45%;\n' +
	    '          height:20px;\n' +
	    '      }\n'+
	    '   </style>\n' +
	    '</head>\n' +
	    '<body>\n' +
	    '   <textarea name="state" id="state"></textarea>\n' +
	    '</body>';
	
	var SaveDialogTemplate =
	    '<button type="button" id="save">Save</button>\n' +
	    '<input type="text" id="filename" value="ck-state.json"></input>';
	
	var LoadDialogTemplate =
	    '<input type="file" id="load-disk"></button>' +
	    '<button type="button" id="load">Load</button>';
	
	function createWindow(){
	    var width = 320, height = 200;
	    var window_ = window.open('','','\
	        width=' + width + ',\
	        height=' + height + ',\
	        left=' + (window.screenX + window.innerWidth * 0.5 - width * 0.5) + ',\
	        top=' + (window.screenY + window.innerHeight * 0.5 - height * 0.5) + ',\
	        location=0,\
	        titlebar=0,\
	        resizable=0');
	    window_.document.documentElement.innerHTML = DialogTemplate;
	    return window_;
	}
	
	function save(data){
	    var window_ = createWindow();
	    var document_ = window_.document;
	        document_.body.innerHTML += SaveDialogTemplate;
	        document_.getElementById('save').addEventListener('click',function(){
	            //log & save in main window
	            var str  = document_.getElementById('state').value,
	                blob = new Blob([str],{type:'application:json'}),
	                name = document_.getElementById('filename').value;
	            var a = document.createElement('a');
	            a.download = name;
	            if(window.webkitURL){
	                a.href = window.webkitURL.createObjectURL(blob);
	            } else {
	                a.href = window.createObjectURL(blob);
	                a.style.display = 'none';
	                a.addEventListener('click',function(){
	                    document_.body.removeChild(a);
	                });
	                document_.body.appendChild(a);
	            }
	            a.click();
	        });
	    document_.getElementById('state').innerText = JSON.stringify(data);
	}
	
	function load(callback){
	    var window_ = createWindow();
	    var document_ = window_.document;
	        document_.body.innerHTML += LoadDialogTemplate;
	    var input   = document_.getElementById('state');
	    var btnLoad = document_.getElementById('load');
	        btnLoad.disabled = true;
	
	    function validateInput(){
	        try{
	            var obj = JSON.parse(input.value);
	            if(obj && typeof obj === 'object' && obj !== null){
	                btnLoad.disabled = false;
	            }
	        } catch (e){
	            btnLoad.disabled = true;
	        }
	    }
	
	    input.addEventListener('input',function(){
	        validateInput();
	    });
	    document_.getElementById('load').addEventListener('click',function(){
	        var str = input.value;
	        callback(JSON.parse(str).data);
	        window_.close();
	    });
	    var loadFromDisk = document_.getElementById('load-disk');
	        loadFromDisk.addEventListener('change',function(){
	            var reader = new FileReader();
	            reader.addEventListener('loadend',function(e){
	                input.value = e.target.result;
	                validateInput();
	            });
	            reader.readAsText(loadFromDisk.files[0],'utf-8');
	        });
	}
	
	module.exports = {
	    load : load,
	    save : save
	};

/***/ },
/* 65 */
/*!*************************************************!*\
  !*** ./~/controlkit/lib/core/document/Style.js ***!
  \*************************************************/
/***/ function(module, exports) {

	var Style = { 
		string : "#controlKit{position:absolute;top:0;left:0;width:100%;height:100%;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}#controlKit .panel{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;pointer-events:auto;position:relative;z-index:1;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;opacity:1;float:left;width:200px;border-radius:3px;-moz-border-radius:3px;box-shadow:0 2px 2px rgba(0,0,0,.25);margin:0;padding:0;background-color:#1a1a1a;font-family:Arial,sans-serif}#controlKit .panel .wrap{width:auto;height:auto;margin:0;padding:0;position:relative;overflow:hidden}#controlKit .panel ul{margin:0;padding:0;list-style:none}#controlKit .panel .color,#controlKit .panel input[type=text],#controlKit .panel textarea,#controlKit .picker input[type=text]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;height:25px;padding:0 0 0 8px;font-family:Arial,sans-serif;font-size:11px;color:#fff;text-shadow:1px 1px #000;outline:0;background:#222729;background-image:-o-linear-gradient(rgba(0,0,0,.075) 0,rgba(0,0,0,.125) 100%);background-image:linear-gradient(rgba(0,0,0,.075) 0,rgba(0,0,0,.125) 100%);border:none;box-shadow:0 0 0 1px #1f1f1f inset;border-radius:2px;-moz-border-radius:2px}#controlKit .panel .button,#controlKit .panel .select,#controlKit .panel .select-active,#controlKit .picker .button{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;cursor:pointer;width:100%;height:26px;margin:0;background-image:-o-linear-gradient(#404040 0,#3b3b3b 100%);background-image:linear-gradient(#404040 0,#3b3b3b 100%);border:none;outline:0;border-radius:2px;box-shadow:0 0 0 1px #1f1f1f inset,-1px 2px 0 0 #4a4a4a inset;font-family:Arial,sans-serif;color:#fff}#controlKit .panel textarea{padding:5px 8px 2px;overflow:hidden;resize:none;vertical-align:top;white-space:nowrap}#controlKit .panel .textarea-wrap{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;padding:0;float:left;height:100%;overflow:hidden;border:none;border-radius:2px;-moz-border-radius:2px;background-color:#222729;box-shadow:0 0 1px 2px rgba(0,0,0,.0125) inset,0 0 1px 1px #111314 inset;background-image:-o-linear-gradient(rgba(0,0,0,.075) 0,rgba(0,0,0,.125) 100%);background-image:linear-gradient(rgba(0,0,0,.075) 0,rgba(0,0,0,.125) 100%)}#controlKit .panel .textarea-wrap textarea{border:none;border-radius:2px;-moz-border-radius:2px;box-shadow:none;background:0 0}#controlKit .panel .textarea-wrap .scrollBar{border:1px solid #101213;border-bottom-right-radius:2px;border-top-right-radius:2px;border-left:none;box-shadow:0 0 1px 2px rgba(0,0,0,.0125) inset,0 0 1px 1px #111314 inset}#controlKit .panel canvas{cursor:pointer;vertical-align:bottom;border:none;box-shadow:0 0 0 1px #1f1f1f inset;border-radius:2px;-moz-border-radius:2px}#controlKit .panel .canvas-wrap,#controlKit .panel .svg-wrap{margin:6px 0 0;position:relative;width:70%;float:right;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border:none;border-radius:2px;-moz-border-radius:2px;background:#1e2224;background-image:-o-linear-gradient(transparent 0,rgba(0,0,0,.05) 100%);background-image:linear-gradient(transparent 0,rgba(0,0,0,.05) 100%)}#controlKit .panel .canvas-wrap svg,#controlKit .panel .svg-wrap svg{position:absolute;left:0;top:0;cursor:pointer;vertical-align:bottom;border:none;box-shadow:0 0 0 1px #1f1f1f inset;border-radius:2px;-moz-border-radius:2px}#controlKit .panel .button,#controlKit .picker .button{font-size:10px;font-weight:700;text-shadow:0 1px #000;text-transform:uppercase}#controlKit .panel .button:hover,#controlKit .picker .button:hover{background-image:-o-linear-gradient(#454545 0,#3b3b3b 100%);background-image:linear-gradient(#454545 0,#3b3b3b 100%)}#controlKit .panel .button:active,#controlKit .picker .button:active{background-image:-o-linear-gradient(#404040 0,#3b3b3b 100%);background-image:linear-gradient(#404040 0,#3b3b3b 100%)}#controlKit .panel .color-with-preset-wrap,#controlKit .panel .input-with-preset-wrap{width:100%;float:left}#controlKit .panel .color-with-preset-wrap .color,#controlKit .panel .input-with-preset-wrap input[type=text]{padding-right:25px;border-top-right-radius:2px;border-bottom-right-radius:2px;float:left}#controlKit .panel .button-preset,#controlKit .panel .button-preset-active{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;right:0;width:20px;height:25px;margin:0;cursor:pointer;float:right;border:none;border-top-right-radius:2px;border-bottom-right-radius:2px;box-shadow:0 0 0 1px #1f1f1f inset,-1px 2px 0 0 #4a4a4a inset;outline:0}#controlKit .panel .button-preset-active,#controlKit .panel .button-preset:hover{background:url(data:image/png;base64,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) 50% 50% no-repeat,linear-gradient(#454545 0,#3b3b3b 100%)}#controlKit .panel .button-preset{background:url(data:image/png;base64,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) 50% 50% no-repeat,linear-gradient(#404040 0,#3b3b3b 100%)}#controlKit .panel input[type=checkbox]{margin:6px 0 0}#controlKit .panel .select,#controlKit .panel .select-active{padding-left:10px;padding-right:20px;font-size:11px;text-align:left;text-shadow:1px 1px #000;cursor:pointer;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}#controlKit .panel .select{background:url(data:image/png;base64,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) 100% 50% no-repeat,linear-gradient(#404040 0,#3b3b3b 100%)}#controlKit .panel .select-active,#controlKit .panel .select:hover{background:url(data:image/png;base64,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) 100% 50% no-repeat,linear-gradient(#454545 0,#3b3b3b 100%)}#controlKit .panel .slider-handle,#controlKit .panel .slider-slot,#controlKit .panel .slider-wrap,#controlKit .panel .wrap-slider{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}#controlKit .panel .wrap-slider{width:70%;padding:6px 0 0;float:right;height:100%}#controlKit .panel .wrap-slider input[type=text]{width:25%;text-align:center;padding:0;float:right}#controlKit .panel .slider-wrap{float:left;cursor:ew-resize;width:70%}#controlKit .panel .slider-slot{width:100%;height:25px;padding:3px;background-color:#1e2224;border:none;box-shadow:0 0 0 1px #1f1f1f inset;border-radius:2px;-moz-border-radius:2px}#controlKit .panel .slider-handle{position:relative;width:100%;height:100%;background:#b32435;background-image:-o-linear-gradient(transparent 0,rgba(0,0,0,.1) 100%);background-image:linear-gradient(transparent 0,rgba(0,0,0,.1) 100%);box-shadow:0 1px 0 0 #0f0f0f}#controlKit .panel .color{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;width:100%;height:25px;padding:0;border:none;background:#fff;box-shadow:0 0 0 1px #111314 inset;text-align:center;line-height:25px;border-radius:2px;-moz-border-radius:2px}#controlKit .panel .graph-slider-x-wrap,#controlKit .panel .graph-slider-y-wrap{position:absolute;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}#controlKit .panel .graph-slider-x-wrap{bottom:0;left:0;width:100%;padding:6px 20px 6px 6px}#controlKit .panel .graph-slider-y-wrap{top:0;right:0;height:100%;padding:6px 6px 20px}#controlKit .panel .graph-slider-x,#controlKit .panel .graph-slider-y{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border-radius:2px;-moz-border-radius:2px;background:rgba(24,27,29,.5);border:1px solid #181b1d}#controlKit .panel .graph-slider-x{height:8px}#controlKit .panel .graph-slider-y{width:8px;height:100%}#controlKit .panel .graph-slider-x-handle,#controlKit .panel .graph-slider-y-handle{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;cursor:pointer;border:1px solid #181b1d;background:#303639}#controlKit .panel .graph-slider-x-handle{width:20px;height:100%;border-top:none;border-bottom:none}#controlKit .panel .graph-slider-y-handle{width:100%;height:20px;border-left:none;border-right:none}#controlKit .sub-group .wrap .wrap .wrap{width:25%!important;padding:0!important;float:left!important}#controlKit .sub-group .wrap .wrap .wrap .label{width:100%!important;padding:8px 0 0!important;color:#878787!important;text-align:center!important;text-transform:uppercase!important;font-weight:700!important;text-shadow:1px 1px #1a1a1a!important}#controlKit .sub-group .wrap .wrap .wrap input[type=text]{padding:0;text-align:center}#controlKit .options{pointer-events:auto;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border:1px solid #1f1f1f;border-radius:2px;-moz-border-radius:2px;position:absolute;z-index:2147483638;left:0;top:0;width:auto;height:auto;box-shadow:0 1px 0 0 #4a4a4a inset;background-color:#454545;font-family:Arial,sans-serif;font-size:11px;color:#fff;text-shadow:1px 1px #000;overflow:hidden}#controlKit .options ul{width:100%;list-style:none;margin:0;padding:0}#controlKit .options ul li{margin:0;width:100%;height:25px;line-height:25px;padding:0 20px 0 10px;overflow:hidden;white-space:normal;text-overflow:ellipsis;cursor:pointer}#controlKit .options ul li:hover{background-color:#1f2325}#controlKit .options ul .li-selected{background-color:#292d30}#controlKit .options .color{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}#controlKit .options .color .li-selected,#controlKit .options .color li{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0;height:25px;line-height:25px;text-align:center}#controlKit .options .color .li-selected:hover,#controlKit .options .color li:hover{background:0 0;font-weight:700}#controlKit .options .color .li-selected{font-weight:700}#controlKit .panel .label,#controlKit .picker .label{width:100%;float:left;font-size:11px;font-weight:700;text-shadow:0 1px #000;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;cursor:default}#controlKit .panel .head,#controlKit .panel .panel-head-inactive,#controlKit .picker .head{height:30px;padding:0 10px;background:#1a1a1a;overflow:hidden}#controlKit .panel .head .wrap,#controlKit .panel .panel-head-inactive .wrap,#controlKit .picker .head .wrap{width:auto;height:auto;margin:0;padding:0;position:relative;overflow:hidden}#controlKit .panel .head .label,#controlKit .picker .head .label{cursor:pointer;line-height:30px;color:#65696b}#controlKit .panel .group-list .group .head{height:38px;padding:0 10px;border-top:1px solid #4f4f4f;border-bottom:1px solid #262626;background-image:-o-linear-gradient(#454545 0,#3b3b3b 100%);background-image:linear-gradient(#454545 0,#3b3b3b 100%);cursor:pointer}#controlKit .panel .group-list .group .head .label{font-size:12px;line-height:38px;color:#fff}#controlKit .panel .group-list .group .head:hover{border-top:1px solid #525252;background-image:-o-linear-gradient(#454545 0,#404040 100%);background-image:linear-gradient(#454545 0,#404040 100%)}#controlKit .panel .group-list .group li{height:35px;padding:0 10px}#controlKit .panel .group-list .group .sub-group-list .sub-group:last-of-type{border-bottom:none}#controlKit .panel .group-list .group .sub-group-list .sub-group{padding:0;height:auto;border-bottom:1px solid #242424}#controlKit .panel .group-list .group .sub-group-list .sub-group ul{overflow:hidden}#controlKit .panel .group-list .group .sub-group-list .sub-group ul li{background:#2e2e2e;border-bottom:1px solid #222729}#controlKit .panel .group-list .group .sub-group-list .sub-group ul li:last-of-type{border-bottom:none}#controlKit .panel .group-list .group .sub-group-list .sub-group:first-child{margin-top:0}#controlKit .panel .group-list .group .sub-group-list .sub-group .head,#controlKit .panel .group-list .group .sub-group-list .sub-group .head-inactive{cursor:pointer}#controlKit .panel .group-list .group .sub-group-list .sub-group .head{height:27px;padding:0 10px;border-top:none;border-bottom:1px solid #242424;background-image:none;background-color:#272727}#controlKit .panel .group-list .group .sub-group-list .sub-group .head:hover{background-image:none;background-color:#272727}#controlKit .panel .group-list .group .sub-group-list .sub-group .head-inactive{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;height:27px;padding:0 10px;box-shadow:0 1px 0 0 #404040 inset;background-image:-o-linear-gradient(#3b3b3b 0,#383838 100%);background-image:linear-gradient(#3b3b3b 0,#383838 100%)}#controlKit .panel .group-list .group .sub-group-list .sub-group .head-inactive:hover{box-shadow:0 1px 0 0 #474747 inset;background-image:none;background-image:-o-linear-gradient(#404040 0,#3b3b3b 100%);background-image:linear-gradient(#404040 0,#3b3b3b 100%)}#controlKit .panel .group-list .group .sub-group-list .sub-group .head .label,#controlKit .panel .group-list .group .sub-group-list .sub-group .head-inactive .label{margin:0;padding:0;line-height:27px;color:#fff;font-weight:700;font-size:11px;text-shadow:1px 1px #000;text-transform:capitalize}#controlKit .panel .group-list .group .sub-group-list .sub-group .head .wrap .label,#controlKit .panel .group-list .group .sub-group-list .sub-group .head-inactive .wrap .label{width:100%;font-weight:700;color:#fff;padding:0}#controlKit .panel .group-list .group .sub-group-list .sub-group .wrap .label{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;height:100%;width:30%;padding:12px 5px 0 0;float:left;font-size:11px;font-weight:400;color:#aeb5b8;text-shadow:1px 1px #000}#controlKit .panel .group-list .group .sub-group-list .sub-group .wrap .wrap{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:70%;padding:5px 0 0;float:right;height:100%}#controlKit .panel .group-list .group:last-child .scroll-buffer:nth-of-type(3),#controlKit .panel .group-list .group:last-child .sub-group-list{border-bottom:none}#controlKit .panel .scroll-wrap{position:relative;overflow:hidden}#controlKit .panel .scroll-buffer{width:100%;height:8px;border-top:1px solid #3b4447;border-bottom:1px solid #1e2224}#controlKit .panel .scrollBar{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;width:15px;height:100%;float:right;top:0;padding:0;margin:0;position:relative;background:#212628;background-image:linear-gradient(to right,#242424 0,#2e2e2e 100%)}#controlKit .panel .scrollBar .track{padding:0 3px 0 2px}#controlKit .panel .scrollBar .track .thumb{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:11px;position:absolute;cursor:pointer;background-color:#343434;border:1px solid #1b1f21;border-radius:10px;-moz-border-radius:10px;box-shadow:inset 0 1px 0 0 #434b50}#controlKit .panel .menu,#controlKit .panel .menu-active,#controlKit .picker .menu{float:right;padding:5px 0 0}#controlKit .panel .menu input[type=button],#controlKit .panel .menu-active input[type=button],#controlKit .picker .menu input[type=button]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;cursor:pointer;height:20px;border:none;vertical-align:top;border-radius:2px;-moz-border-radius:2px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#aaa;text-shadow:0 -1px #000;text-transform:uppercase;box-shadow:0 0 0 1px #131313 inset,-1px 2px 0 0 #212527 inset;outline:0}#controlKit .panel .menu .button-menu-close,#controlKit .panel .menu .button-menu-hide,#controlKit .panel .menu .button-menu-show,#controlKit .panel .menu-active .button-menu-close,#controlKit .panel .menu-active .button-menu-hide,#controlKit .panel .menu-active .button-menu-show,#controlKit .picker .menu .button-menu-close,#controlKit .picker .menu .button-menu-hide,#controlKit .picker .menu .button-menu-show{width:20px;margin-left:4px}#controlKit .panel .menu .button-menu-hide,#controlKit .panel .menu-active .button-menu-hide,#controlKit .picker .menu .button-menu-hide{background:url(data:image/png;base64,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) 50% 50% no-repeat,#1a1d1f}#controlKit .panel .menu .button-menu-hide:hover,#controlKit .panel .menu-active .button-menu-hide:hover,#controlKit .picker .menu .button-menu-hide:hover{background:url(data:image/png;base64,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) 50% 50% no-repeat,#000;box-shadow:#fff 0,#000 100%}#controlKit .panel .menu .button-menu-show,#controlKit .panel .menu-active .button-menu-show,#controlKit .picker .menu .button-menu-show{background:url(data:image/png;base64,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) 50% 50% no-repeat,#1a1d1f}#controlKit .panel .menu .button-menu-show:hover,#controlKit .panel .menu-active .button-menu-show:hover,#controlKit .picker .menu .button-menu-show:hover{background:url(data:image/png;base64,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) 50% 50% no-repeat,#000;box-shadow:#fff 0,#000 100%}#controlKit .panel .menu .button-menu-close,#controlKit .panel .menu-active .button-menu-close,#controlKit .picker .menu .button-menu-close{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAJCAYAAAAPU20uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAQ1JREFUeNpM0D9LAmEAx/HvPXeDTqeXpVeYYjpYGQ1hBQ7SnxfQ0pA1FEVbr6FeRgZuCb2EoOCgm26spoIgiKBQQaIUnuceW27wt36HD/wMO+ncAna1Vl9jbIHvtYANa2lltYJhuIHvXVVr9ZMoHpXmFw/tpCOtWCx+L0xzv1heOA58Lw68pqdnzlNpl1DKNws40GH4kJrKXAphNgZ/v2TzBZSUbaAhIrLZ/f66m8y4zBaK/PT7XaABICLzbDgcbOkwJFQKPdITge+1AQw76dy42dxufq5EqFQLeBdCXPR6HV6eHz+M9fr2Z8JxXCVlEziNyD3Tsq6VksosV5Y3tdYdYGfshqeR1jkDI/E/AO8rYRlwXBquAAAAAElFTkSuQmCC) 50% 50% no-repeat,#1a1d1f}#controlKit .panel .menu .button-menu-close:hover,#controlKit .panel .menu-active .button-menu-close:hover,#controlKit .picker .menu .button-menu-close:hover{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAJCAYAAAAPU20uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAQ1JREFUeNpM0D9LAmEAx/HvPXeDTqeXpVeYYjpYGQ1hBQ7SnxfQ0pA1FEVbr6FeRgZuCb2EoOCgm26spoIgiKBQQaIUnuceW27wt36HD/wMO+ncAna1Vl9jbIHvtYANa2lltYJhuIHvXVVr9ZMoHpXmFw/tpCOtWCx+L0xzv1heOA58Lw68pqdnzlNpl1DKNws40GH4kJrKXAphNgZ/v2TzBZSUbaAhIrLZ/f66m8y4zBaK/PT7XaABICLzbDgcbOkwJFQKPdITge+1AQw76dy42dxufq5EqFQLeBdCXPR6HV6eHz+M9fr2Z8JxXCVlEziNyD3Tsq6VksosV5Y3tdYdYGfshqeR1jkDI/E/AO8rYRlwXBquAAAAAElFTkSuQmCC) 50% 50% no-repeat,#000;box-shadow:#fff 0,#000 100%}#controlKit .panel .menu .button-menu-undo,#controlKit .panel .menu-active .button-menu-undo{background:url(data:image/png;base64,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) 20% 50% no-repeat,#1a1d1f;padding:0 6px 1px 0;width:38px;vertical-align:top;text-align:end}#controlKit .panel .menu .button-menu-undo:hover,#controlKit .panel .menu-active .button-menu-undo:hover{background:url(data:image/png;base64,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) 20% 50% no-repeat,#000;box-shadow:#fff 0,#000 100%}#controlKit .panel .menu .button-menu-load,#controlKit .panel .menu-active .button-menu-load{margin-right:2px}#controlKit .panel .menu .button-menu-load,#controlKit .panel .menu .button-menu-save,#controlKit .panel .menu-active .button-menu-load,#controlKit .panel .menu-active .button-menu-save{background:#1a1d1f;font-size:9px!important}#controlKit .panel .menu .button-menu-load:hover,#controlKit .panel .menu .button-menu-save:hover,#controlKit .panel .menu-active .button-menu-load:hover,#controlKit .panel .menu-active .button-menu-save:hover{background:#000}#controlKit .panel .menu .wrap{display:none}#controlKit .panel .menu-active{width:100%;float:left}#controlKit .panel .menu-active .wrap{display:inline}#controlKit .panel .menu-active .button-menu-close,#controlKit .panel .menu-active .button-menu-hide,#controlKit .panel .menu-active .button-menu-show{float:right}#controlKit .panel .arrow-s-max{background:url(data:image/png;base64,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) center no-repeat}#controlKit .panel .arrow-s-min{background:url(data:image/png;base64,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) center no-repeat}#controlKit .panel .arrow-s-max,#controlKit .panel .arrow-s-min{width:100%;height:20px}#controlKit .panel .arrow-b-max{background:url(data:image/png;base64,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) center no-repeat}#controlKit .panel .arrow-b-min{background:url(data:image/png;base64,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) center no-repeat}#controlKit .panel .arrow-b-sub-max{background:url(data:image/png;base64,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) center no-repeat}#controlKit .panel .arrow-b-sub-min{background:url(data:image/png;base64,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) center no-repeat}#controlKit .panel .arrow-b-max,#controlKit .panel .arrow-b-min,#controlKit .panel .arrow-b-sub-max,#controlKit .panel .arrow-b-sub-min{width:10px;height:100%;float:right}#controlKit .picker{pointer-events:auto;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border-radius:3px;-moz-border-radius:3px;background-color:#3b3b3b;font-family:Arial,sans-serif;font-size:11px;color:#fff;text-shadow:1px 1px #000;overflow:hidden;position:absolute;z-index:2147483631;width:360px;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;box-shadow:0 2px 2px rgba(0,0,0,.25)}#controlKit .picker canvas{vertical-align:bottom;cursor:pointer}#controlKit .picker .wrap{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:10px;float:left}#controlKit .picker .field-wrap{padding:3px}#controlKit .picker .slider-wrap{padding:3px 13px 3px 3px}#controlKit .picker .field-wrap,#controlKit .picker .input-wrap,#controlKit .picker .slider-wrap{height:auto;overflow:hidden;float:left}#controlKit .picker .input-wrap{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border:1px solid #242424;border-radius:2px;-moz-border-radius:2px;width:140px;float:right;padding:5px 10px 1px 0}#controlKit .picker .input-field{width:50%;float:right;margin-bottom:4px}#controlKit .picker .input-field .label{padding:8px 0 0;color:#878787;text-align:center;text-transform:uppercase;font-weight:700;text-shadow:1px 1px #1a1a1a;width:40%}#controlKit .picker .input-field .wrap{padding:0;width:60%;height:auto;float:right}#controlKit .picker .controls-wrap{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%;height:auto;float:right;padding:9px 0 0}#controlKit .picker .controls-wrap input[type=button]{float:right;width:65px;margin:0 0 0 10px}#controlKit .picker .color-contrast{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border:none;box-shadow:0 0 0 1px #1f1f1f inset;border-radius:2px;-moz-border-radius:2px;height:25px;padding:3px;width:80%;margin-bottom:4px;float:right}#controlKit .picker .color-contrast div{width:50%;height:100%;float:left}#controlKit .picker input[type=text]{padding:0;text-align:center;width:60%;float:right}#controlKit .picker .wrap .input-wrap:nth-of-type(3){border-bottom-left-radius:0;border-bottom-right-radius:0}#controlKit .picker .wrap .input-wrap:nth-of-type(4){border-top:none;border-top-left-radius:0;border-top-right-radius:0}#controlKit .picker .wrap .input-wrap:nth-of-type(4) .input-field{width:100%}#controlKit .picker .wrap .input-wrap:nth-of-type(4) .input-field .label{width:20%}#controlKit .picker .wrap .input-wrap:nth-of-type(4) input[type=text]{width:80%}#controlKit .picker .field-wrap,#controlKit .picker .slider-wrap{background:#1e2224;border:none;box-shadow:0 0 0 1px #1f1f1f inset;border-radius:2px;-moz-border-radius:2px;position:relative;margin-right:5px}#controlKit .picker .field-wrap .indicator,#controlKit .picker .slider-wrap .indicator{position:absolute;border:2px solid #fff;box-shadow:0 1px black,0 1px #000 inset;cursor:pointer}#controlKit .picker .field-wrap .indicator{width:8px;height:8px;left:50%;top:50%;border-radius:50%;-moz-border-radius:50%}#controlKit .picker .slider-wrap .indicator{width:14px;height:3px;border-radius:8px;-moz-border-radius:8px;left:1px;top:1px}#controlKit .picker .slider-wrap .indicator:after{content:'';width:0;height:0;border-top:4.5px solid transparent;border-bottom:4.5px solid transparent;border-right:4px solid #fff;float:right;position:absolute;top:-2px;left:19px}#controlKit .picker .slider-wrap .indicator:before{content:'';width:0;height:0;border-top:4.5px solid transparent;border-bottom:4.5px solid transparent;border-right:4px solid #000;float:right;position:absolute;top:-3px;left:19px}"
	}; 
	module.exports = Style;

/***/ },
/* 66 */
/*!****************************!*\
  !*** ./~/gl-mat4/index.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  create: __webpack_require__(/*! ./create */ 67)
	  , clone: __webpack_require__(/*! ./clone */ 68)
	  , copy: __webpack_require__(/*! ./copy */ 69)
	  , identity: __webpack_require__(/*! ./identity */ 70)
	  , transpose: __webpack_require__(/*! ./transpose */ 71)
	  , invert: __webpack_require__(/*! ./invert */ 72)
	  , adjoint: __webpack_require__(/*! ./adjoint */ 73)
	  , determinant: __webpack_require__(/*! ./determinant */ 74)
	  , multiply: __webpack_require__(/*! ./multiply */ 75)
	  , translate: __webpack_require__(/*! ./translate */ 76)
	  , scale: __webpack_require__(/*! ./scale */ 77)
	  , rotate: __webpack_require__(/*! ./rotate */ 78)
	  , rotateX: __webpack_require__(/*! ./rotateX */ 79)
	  , rotateY: __webpack_require__(/*! ./rotateY */ 80)
	  , rotateZ: __webpack_require__(/*! ./rotateZ */ 81)
	  , fromRotationTranslation: __webpack_require__(/*! ./fromRotationTranslation */ 82)
	  , fromQuat: __webpack_require__(/*! ./fromQuat */ 83)
	  , frustum: __webpack_require__(/*! ./frustum */ 84)
	  , perspective: __webpack_require__(/*! ./perspective */ 85)
	  , perspectiveFromFieldOfView: __webpack_require__(/*! ./perspectiveFromFieldOfView */ 86)
	  , ortho: __webpack_require__(/*! ./ortho */ 87)
	  , lookAt: __webpack_require__(/*! ./lookAt */ 88)
	  , str: __webpack_require__(/*! ./str */ 89)
	}

/***/ },
/* 67 */
/*!*****************************!*\
  !*** ./~/gl-mat4/create.js ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = create;
	
	/**
	 * Creates a new identity mat4
	 *
	 * @returns {mat4} a new 4x4 matrix
	 */
	function create() {
	    var out = new Float32Array(16);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

/***/ },
/* 68 */
/*!****************************!*\
  !*** ./~/gl-mat4/clone.js ***!
  \****************************/
/***/ function(module, exports) {

	module.exports = clone;
	
	/**
	 * Creates a new mat4 initialized with values from an existing matrix
	 *
	 * @param {mat4} a matrix to clone
	 * @returns {mat4} a new 4x4 matrix
	 */
	function clone(a) {
	    var out = new Float32Array(16);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

/***/ },
/* 69 */
/*!***************************!*\
  !*** ./~/gl-mat4/copy.js ***!
  \***************************/
/***/ function(module, exports) {

	module.exports = copy;
	
	/**
	 * Copy the values from one mat4 to another
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function copy(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

/***/ },
/* 70 */
/*!*******************************!*\
  !*** ./~/gl-mat4/identity.js ***!
  \*******************************/
/***/ function(module, exports) {

	module.exports = identity;
	
	/**
	 * Set a mat4 to the identity matrix
	 *
	 * @param {mat4} out the receiving matrix
	 * @returns {mat4} out
	 */
	function identity(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

/***/ },
/* 71 */
/*!********************************!*\
  !*** ./~/gl-mat4/transpose.js ***!
  \********************************/
/***/ function(module, exports) {

	module.exports = transpose;
	
	/**
	 * Transpose the values of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function transpose(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1], a02 = a[2], a03 = a[3],
	            a12 = a[6], a13 = a[7],
	            a23 = a[11];
	
	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a01;
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a02;
	        out[9] = a12;
	        out[11] = a[14];
	        out[12] = a03;
	        out[13] = a13;
	        out[14] = a23;
	    } else {
	        out[0] = a[0];
	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a[1];
	        out[5] = a[5];
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a[2];
	        out[9] = a[6];
	        out[10] = a[10];
	        out[11] = a[14];
	        out[12] = a[3];
	        out[13] = a[7];
	        out[14] = a[11];
	        out[15] = a[15];
	    }
	    
	    return out;
	};

/***/ },
/* 72 */
/*!*****************************!*\
  !*** ./~/gl-mat4/invert.js ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = invert;
	
	/**
	 * Inverts a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function invert(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],
	
	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,
	
	        // Calculate the determinant
	        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	
	    if (!det) { 
	        return null; 
	    }
	    det = 1.0 / det;
	
	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
	
	    return out;
	};

/***/ },
/* 73 */
/*!******************************!*\
  !*** ./~/gl-mat4/adjoint.js ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = adjoint;
	
	/**
	 * Calculates the adjugate of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function adjoint(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
	
	    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
	    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
	    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
	    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
	    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
	    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
	    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
	    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
	    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
	    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
	    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
	    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
	    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
	    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
	    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
	    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
	    return out;
	};

/***/ },
/* 74 */
/*!**********************************!*\
  !*** ./~/gl-mat4/determinant.js ***!
  \**********************************/
/***/ function(module, exports) {

	module.exports = determinant;
	
	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant(a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],
	
	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32;
	
	    // Calculate the determinant
	    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	};

/***/ },
/* 75 */
/*!*******************************!*\
  !*** ./~/gl-mat4/multiply.js ***!
  \*******************************/
/***/ function(module, exports) {

	module.exports = multiply;
	
	/**
	 * Multiplies two mat4's
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	function multiply(out, a, b) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
	
	    // Cache only the current line of the second matrix
	    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
	    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	
	    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
	    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	
	    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
	    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	
	    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
	    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	    return out;
	};

/***/ },
/* 76 */
/*!********************************!*\
  !*** ./~/gl-mat4/translate.js ***!
  \********************************/
/***/ function(module, exports) {

	module.exports = translate;
	
	/**
	 * Translate a mat4 by the given vector
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	function translate(out, a, v) {
	    var x = v[0], y = v[1], z = v[2],
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23;
	
	    if (a === out) {
	        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	    } else {
	        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];
	
	        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
	        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
	        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;
	
	        out[12] = a00 * x + a10 * y + a20 * z + a[12];
	        out[13] = a01 * x + a11 * y + a21 * z + a[13];
	        out[14] = a02 * x + a12 * y + a22 * z + a[14];
	        out[15] = a03 * x + a13 * y + a23 * z + a[15];
	    }
	
	    return out;
	};

/***/ },
/* 77 */
/*!****************************!*\
  !*** ./~/gl-mat4/scale.js ***!
  \****************************/
/***/ function(module, exports) {

	module.exports = scale;
	
	/**
	 * Scales the mat4 by the dimensions in the given vec3
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/
	function scale(out, a, v) {
	    var x = v[0], y = v[1], z = v[2];
	
	    out[0] = a[0] * x;
	    out[1] = a[1] * x;
	    out[2] = a[2] * x;
	    out[3] = a[3] * x;
	    out[4] = a[4] * y;
	    out[5] = a[5] * y;
	    out[6] = a[6] * y;
	    out[7] = a[7] * y;
	    out[8] = a[8] * z;
	    out[9] = a[9] * z;
	    out[10] = a[10] * z;
	    out[11] = a[11] * z;
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

/***/ },
/* 78 */
/*!*****************************!*\
  !*** ./~/gl-mat4/rotate.js ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = rotate;
	
	/**
	 * Rotates a mat4 by the given angle
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	function rotate(out, a, rad, axis) {
	    var x = axis[0], y = axis[1], z = axis[2],
	        len = Math.sqrt(x * x + y * y + z * z),
	        s, c, t,
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23,
	        b00, b01, b02,
	        b10, b11, b12,
	        b20, b21, b22;
	
	    if (Math.abs(len) < 0.000001) { return null; }
	    
	    len = 1 / len;
	    x *= len;
	    y *= len;
	    z *= len;
	
	    s = Math.sin(rad);
	    c = Math.cos(rad);
	    t = 1 - c;
	
	    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];
	
	    // Construct the elements of the rotation matrix
	    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
	    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
	    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
	
	    // Perform rotation-specific matrix multiplication
	    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
	
	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	    return out;
	};

/***/ },
/* 79 */
/*!******************************!*\
  !*** ./~/gl-mat4/rotateX.js ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = rotateX;
	
	/**
	 * Rotates a matrix by the given angle around the X axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateX(out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];
	
	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[0]  = a[0];
	        out[1]  = a[1];
	        out[2]  = a[2];
	        out[3]  = a[3];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	
	    // Perform axis-specific matrix multiplication
	    out[4] = a10 * c + a20 * s;
	    out[5] = a11 * c + a21 * s;
	    out[6] = a12 * c + a22 * s;
	    out[7] = a13 * c + a23 * s;
	    out[8] = a20 * c - a10 * s;
	    out[9] = a21 * c - a11 * s;
	    out[10] = a22 * c - a12 * s;
	    out[11] = a23 * c - a13 * s;
	    return out;
	};

/***/ },
/* 80 */
/*!******************************!*\
  !*** ./~/gl-mat4/rotateY.js ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = rotateY;
	
	/**
	 * Rotates a matrix by the given angle around the Y axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateY(out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];
	
	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[4]  = a[4];
	        out[5]  = a[5];
	        out[6]  = a[6];
	        out[7]  = a[7];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	
	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c - a20 * s;
	    out[1] = a01 * c - a21 * s;
	    out[2] = a02 * c - a22 * s;
	    out[3] = a03 * c - a23 * s;
	    out[8] = a00 * s + a20 * c;
	    out[9] = a01 * s + a21 * c;
	    out[10] = a02 * s + a22 * c;
	    out[11] = a03 * s + a23 * c;
	    return out;
	};

/***/ },
/* 81 */
/*!******************************!*\
  !*** ./~/gl-mat4/rotateZ.js ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = rotateZ;
	
	/**
	 * Rotates a matrix by the given angle around the Z axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateZ(out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7];
	
	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[8]  = a[8];
	        out[9]  = a[9];
	        out[10] = a[10];
	        out[11] = a[11];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	
	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c + a10 * s;
	    out[1] = a01 * c + a11 * s;
	    out[2] = a02 * c + a12 * s;
	    out[3] = a03 * c + a13 * s;
	    out[4] = a10 * c - a00 * s;
	    out[5] = a11 * c - a01 * s;
	    out[6] = a12 * c - a02 * s;
	    out[7] = a13 * c - a03 * s;
	    return out;
	};

/***/ },
/* 82 */
/*!**********************************************!*\
  !*** ./~/gl-mat4/fromRotationTranslation.js ***!
  \**********************************************/
/***/ function(module, exports) {

	module.exports = fromRotationTranslation;
	
	/**
	 * Creates a matrix from a quaternion rotation and vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	function fromRotationTranslation(out, q, v) {
	    // Quaternion math
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	
	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;
	
	    out[0] = 1 - (yy + zz);
	    out[1] = xy + wz;
	    out[2] = xz - wy;
	    out[3] = 0;
	    out[4] = xy - wz;
	    out[5] = 1 - (xx + zz);
	    out[6] = yz + wx;
	    out[7] = 0;
	    out[8] = xz + wy;
	    out[9] = yz - wx;
	    out[10] = 1 - (xx + yy);
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;
	    
	    return out;
	};

/***/ },
/* 83 */
/*!*******************************!*\
  !*** ./~/gl-mat4/fromQuat.js ***!
  \*******************************/
/***/ function(module, exports) {

	module.exports = fromQuat;
	
	/**
	 * Creates a matrix from a quaternion rotation.
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @returns {mat4} out
	 */
	function fromQuat(out, q) {
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	
	        xx = x * x2,
	        yx = y * x2,
	        yy = y * y2,
	        zx = z * x2,
	        zy = z * y2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;
	
	    out[0] = 1 - yy - zz;
	    out[1] = yx + wz;
	    out[2] = zx - wy;
	    out[3] = 0;
	
	    out[4] = yx - wz;
	    out[5] = 1 - xx - zz;
	    out[6] = zy + wx;
	    out[7] = 0;
	
	    out[8] = zx + wy;
	    out[9] = zy - wx;
	    out[10] = 1 - xx - yy;
	    out[11] = 0;
	
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	
	    return out;
	};

/***/ },
/* 84 */
/*!******************************!*\
  !*** ./~/gl-mat4/frustum.js ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = frustum;
	
	/**
	 * Generates a frustum matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Number} left Left bound of the frustum
	 * @param {Number} right Right bound of the frustum
	 * @param {Number} bottom Bottom bound of the frustum
	 * @param {Number} top Top bound of the frustum
	 * @param {Number} near Near bound of the frustum
	 * @param {Number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function frustum(out, left, right, bottom, top, near, far) {
	    var rl = 1 / (right - left),
	        tb = 1 / (top - bottom),
	        nf = 1 / (near - far);
	    out[0] = (near * 2) * rl;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = (near * 2) * tb;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = (right + left) * rl;
	    out[9] = (top + bottom) * tb;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (far * near * 2) * nf;
	    out[15] = 0;
	    return out;
	};

/***/ },
/* 85 */
/*!**********************************!*\
  !*** ./~/gl-mat4/perspective.js ***!
  \**********************************/
/***/ function(module, exports) {

	module.exports = perspective;
	
	/**
	 * Generates a perspective projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function perspective(out, fovy, aspect, near, far) {
	    var f = 1.0 / Math.tan(fovy / 2),
	        nf = 1 / (near - far);
	    out[0] = f / aspect;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = f;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (2 * far * near) * nf;
	    out[15] = 0;
	    return out;
	};

/***/ },
/* 86 */
/*!*************************************************!*\
  !*** ./~/gl-mat4/perspectiveFromFieldOfView.js ***!
  \*************************************************/
/***/ function(module, exports) {

	module.exports = perspectiveFromFieldOfView;
	
	/**
	 * Generates a perspective projection matrix with the given field of view.
	 * This is primarily useful for generating projection matrices to be used
	 * with the still experiemental WebVR API.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function perspectiveFromFieldOfView(out, fov, near, far) {
	    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
	        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
	        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
	        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
	        xScale = 2.0 / (leftTan + rightTan),
	        yScale = 2.0 / (upTan + downTan);
	
	    out[0] = xScale;
	    out[1] = 0.0;
	    out[2] = 0.0;
	    out[3] = 0.0;
	    out[4] = 0.0;
	    out[5] = yScale;
	    out[6] = 0.0;
	    out[7] = 0.0;
	    out[8] = -((leftTan - rightTan) * xScale * 0.5);
	    out[9] = ((upTan - downTan) * yScale * 0.5);
	    out[10] = far / (near - far);
	    out[11] = -1.0;
	    out[12] = 0.0;
	    out[13] = 0.0;
	    out[14] = (far * near) / (near - far);
	    out[15] = 0.0;
	    return out;
	}
	


/***/ },
/* 87 */
/*!****************************!*\
  !*** ./~/gl-mat4/ortho.js ***!
  \****************************/
/***/ function(module, exports) {

	module.exports = ortho;
	
	/**
	 * Generates a orthogonal projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} left Left bound of the frustum
	 * @param {number} right Right bound of the frustum
	 * @param {number} bottom Bottom bound of the frustum
	 * @param {number} top Top bound of the frustum
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function ortho(out, left, right, bottom, top, near, far) {
	    var lr = 1 / (left - right),
	        bt = 1 / (bottom - top),
	        nf = 1 / (near - far);
	    out[0] = -2 * lr;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = -2 * bt;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 2 * nf;
	    out[11] = 0;
	    out[12] = (left + right) * lr;
	    out[13] = (top + bottom) * bt;
	    out[14] = (far + near) * nf;
	    out[15] = 1;
	    return out;
	};

/***/ },
/* 88 */
/*!*****************************!*\
  !*** ./~/gl-mat4/lookAt.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(/*! ./identity */ 70);
	
	module.exports = lookAt;
	
	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	function lookAt(out, eye, center, up) {
	    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
	        eyex = eye[0],
	        eyey = eye[1],
	        eyez = eye[2],
	        upx = up[0],
	        upy = up[1],
	        upz = up[2],
	        centerx = center[0],
	        centery = center[1],
	        centerz = center[2];
	
	    if (Math.abs(eyex - centerx) < 0.000001 &&
	        Math.abs(eyey - centery) < 0.000001 &&
	        Math.abs(eyez - centerz) < 0.000001) {
	        return identity(out);
	    }
	
	    z0 = eyex - centerx;
	    z1 = eyey - centery;
	    z2 = eyez - centerz;
	
	    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;
	
	    x0 = upy * z2 - upz * z1;
	    x1 = upz * z0 - upx * z2;
	    x2 = upx * z1 - upy * z0;
	    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	    if (!len) {
	        x0 = 0;
	        x1 = 0;
	        x2 = 0;
	    } else {
	        len = 1 / len;
	        x0 *= len;
	        x1 *= len;
	        x2 *= len;
	    }
	
	    y0 = z1 * x2 - z2 * x1;
	    y1 = z2 * x0 - z0 * x2;
	    y2 = z0 * x1 - z1 * x0;
	
	    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	    if (!len) {
	        y0 = 0;
	        y1 = 0;
	        y2 = 0;
	    } else {
	        len = 1 / len;
	        y0 *= len;
	        y1 *= len;
	        y2 *= len;
	    }
	
	    out[0] = x0;
	    out[1] = y0;
	    out[2] = z0;
	    out[3] = 0;
	    out[4] = x1;
	    out[5] = y1;
	    out[6] = z1;
	    out[7] = 0;
	    out[8] = x2;
	    out[9] = y2;
	    out[10] = z2;
	    out[11] = 0;
	    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	    out[15] = 1;
	
	    return out;
	};

/***/ },
/* 89 */
/*!**************************!*\
  !*** ./~/gl-mat4/str.js ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = str;
	
	/**
	 * Returns a string representation of a mat4
	 *
	 * @param {mat4} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str(a) {
	    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
	                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
	                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
	                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
	};

/***/ },
/* 90 */
/*!****************************!*\
  !*** ./~/gl-vec3/index.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  create: __webpack_require__(/*! ./create */ 91)
	  , clone: __webpack_require__(/*! ./clone */ 92)
	  , angle: __webpack_require__(/*! ./angle */ 93)
	  , fromValues: __webpack_require__(/*! ./fromValues */ 94)
	  , copy: __webpack_require__(/*! ./copy */ 97)
	  , set: __webpack_require__(/*! ./set */ 98)
	  , add: __webpack_require__(/*! ./add */ 99)
	  , subtract: __webpack_require__(/*! ./subtract */ 100)
	  , multiply: __webpack_require__(/*! ./multiply */ 101)
	  , divide: __webpack_require__(/*! ./divide */ 102)
	  , min: __webpack_require__(/*! ./min */ 103)
	  , max: __webpack_require__(/*! ./max */ 104)
	  , scale: __webpack_require__(/*! ./scale */ 105)
	  , scaleAndAdd: __webpack_require__(/*! ./scaleAndAdd */ 106)
	  , distance: __webpack_require__(/*! ./distance */ 107)
	  , squaredDistance: __webpack_require__(/*! ./squaredDistance */ 108)
	  , length: __webpack_require__(/*! ./length */ 109)
	  , squaredLength: __webpack_require__(/*! ./squaredLength */ 110)
	  , negate: __webpack_require__(/*! ./negate */ 111)
	  , inverse: __webpack_require__(/*! ./inverse */ 112)
	  , normalize: __webpack_require__(/*! ./normalize */ 95)
	  , dot: __webpack_require__(/*! ./dot */ 96)
	  , cross: __webpack_require__(/*! ./cross */ 113)
	  , lerp: __webpack_require__(/*! ./lerp */ 114)
	  , random: __webpack_require__(/*! ./random */ 115)
	  , transformMat4: __webpack_require__(/*! ./transformMat4 */ 116)
	  , transformMat3: __webpack_require__(/*! ./transformMat3 */ 117)
	  , transformQuat: __webpack_require__(/*! ./transformQuat */ 118)
	  , rotateX: __webpack_require__(/*! ./rotateX */ 119)
	  , rotateY: __webpack_require__(/*! ./rotateY */ 120)
	  , rotateZ: __webpack_require__(/*! ./rotateZ */ 121)
	  , forEach: __webpack_require__(/*! ./forEach */ 122)
	}

/***/ },
/* 91 */
/*!*****************************!*\
  !*** ./~/gl-vec3/create.js ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = create;
	
	/**
	 * Creates a new, empty vec3
	 *
	 * @returns {vec3} a new 3D vector
	 */
	function create() {
	    var out = new Float32Array(3)
	    out[0] = 0
	    out[1] = 0
	    out[2] = 0
	    return out
	}

/***/ },
/* 92 */
/*!****************************!*\
  !*** ./~/gl-vec3/clone.js ***!
  \****************************/
/***/ function(module, exports) {

	module.exports = clone;
	
	/**
	 * Creates a new vec3 initialized with values from an existing vector
	 *
	 * @param {vec3} a vector to clone
	 * @returns {vec3} a new 3D vector
	 */
	function clone(a) {
	    var out = new Float32Array(3)
	    out[0] = a[0]
	    out[1] = a[1]
	    out[2] = a[2]
	    return out
	}

/***/ },
/* 93 */
/*!****************************!*\
  !*** ./~/gl-vec3/angle.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = angle
	
	var fromValues = __webpack_require__(/*! ./fromValues */ 94)
	var normalize = __webpack_require__(/*! ./normalize */ 95)
	var dot = __webpack_require__(/*! ./dot */ 96)
	
	/**
	 * Get the angle between two 3D vectors
	 * @param {vec3} a The first operand
	 * @param {vec3} b The second operand
	 * @returns {Number} The angle in radians
	 */
	function angle(a, b) {
	    var tempA = fromValues(a[0], a[1], a[2])
	    var tempB = fromValues(b[0], b[1], b[2])
	 
	    normalize(tempA, tempA)
	    normalize(tempB, tempB)
	 
	    var cosine = dot(tempA, tempB)
	
	    if(cosine > 1.0){
	        return 0
	    } else {
	        return Math.acos(cosine)
	    }     
	}


/***/ },
/* 94 */
/*!*********************************!*\
  !*** ./~/gl-vec3/fromValues.js ***!
  \*********************************/
/***/ function(module, exports) {

	module.exports = fromValues;
	
	/**
	 * Creates a new vec3 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} a new 3D vector
	 */
	function fromValues(x, y, z) {
	    var out = new Float32Array(3)
	    out[0] = x
	    out[1] = y
	    out[2] = z
	    return out
	}

/***/ },
/* 95 */
/*!********************************!*\
  !*** ./~/gl-vec3/normalize.js ***!
  \********************************/
/***/ function(module, exports) {

	module.exports = normalize;
	
	/**
	 * Normalize a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to normalize
	 * @returns {vec3} out
	 */
	function normalize(out, a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2]
	    var len = x*x + y*y + z*z
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len)
	        out[0] = a[0] * len
	        out[1] = a[1] * len
	        out[2] = a[2] * len
	    }
	    return out
	}

/***/ },
/* 96 */
/*!**************************!*\
  !*** ./~/gl-vec3/dot.js ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = dot;
	
	/**
	 * Calculates the dot product of two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	function dot(a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
	}

/***/ },
/* 97 */
/*!***************************!*\
  !*** ./~/gl-vec3/copy.js ***!
  \***************************/
/***/ function(module, exports) {

	module.exports = copy;
	
	/**
	 * Copy the values from one vec3 to another
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the source vector
	 * @returns {vec3} out
	 */
	function copy(out, a) {
	    out[0] = a[0]
	    out[1] = a[1]
	    out[2] = a[2]
	    return out
	}

/***/ },
/* 98 */
/*!**************************!*\
  !*** ./~/gl-vec3/set.js ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = set;
	
	/**
	 * Set the components of a vec3 to the given values
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} out
	 */
	function set(out, x, y, z) {
	    out[0] = x
	    out[1] = y
	    out[2] = z
	    return out
	}

/***/ },
/* 99 */
/*!**************************!*\
  !*** ./~/gl-vec3/add.js ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = add;
	
	/**
	 * Adds two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function add(out, a, b) {
	    out[0] = a[0] + b[0]
	    out[1] = a[1] + b[1]
	    out[2] = a[2] + b[2]
	    return out
	}

/***/ },
/* 100 */
/*!*******************************!*\
  !*** ./~/gl-vec3/subtract.js ***!
  \*******************************/
/***/ function(module, exports) {

	module.exports = subtract;
	
	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function subtract(out, a, b) {
	    out[0] = a[0] - b[0]
	    out[1] = a[1] - b[1]
	    out[2] = a[2] - b[2]
	    return out
	}

/***/ },
/* 101 */
/*!*******************************!*\
  !*** ./~/gl-vec3/multiply.js ***!
  \*******************************/
/***/ function(module, exports) {

	module.exports = multiply;
	
	/**
	 * Multiplies two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function multiply(out, a, b) {
	    out[0] = a[0] * b[0]
	    out[1] = a[1] * b[1]
	    out[2] = a[2] * b[2]
	    return out
	}

/***/ },
/* 102 */
/*!*****************************!*\
  !*** ./~/gl-vec3/divide.js ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = divide;
	
	/**
	 * Divides two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function divide(out, a, b) {
	    out[0] = a[0] / b[0]
	    out[1] = a[1] / b[1]
	    out[2] = a[2] / b[2]
	    return out
	}

/***/ },
/* 103 */
/*!**************************!*\
  !*** ./~/gl-vec3/min.js ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = min;
	
	/**
	 * Returns the minimum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function min(out, a, b) {
	    out[0] = Math.min(a[0], b[0])
	    out[1] = Math.min(a[1], b[1])
	    out[2] = Math.min(a[2], b[2])
	    return out
	}

/***/ },
/* 104 */
/*!**************************!*\
  !*** ./~/gl-vec3/max.js ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = max;
	
	/**
	 * Returns the maximum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function max(out, a, b) {
	    out[0] = Math.max(a[0], b[0])
	    out[1] = Math.max(a[1], b[1])
	    out[2] = Math.max(a[2], b[2])
	    return out
	}

/***/ },
/* 105 */
/*!****************************!*\
  !*** ./~/gl-vec3/scale.js ***!
  \****************************/
/***/ function(module, exports) {

	module.exports = scale;
	
	/**
	 * Scales a vec3 by a scalar number
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec3} out
	 */
	function scale(out, a, b) {
	    out[0] = a[0] * b
	    out[1] = a[1] * b
	    out[2] = a[2] * b
	    return out
	}

/***/ },
/* 106 */
/*!**********************************!*\
  !*** ./~/gl-vec3/scaleAndAdd.js ***!
  \**********************************/
/***/ function(module, exports) {

	module.exports = scaleAndAdd;
	
	/**
	 * Adds two vec3's after scaling the second operand by a scalar value
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec3} out
	 */
	function scaleAndAdd(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale)
	    out[1] = a[1] + (b[1] * scale)
	    out[2] = a[2] + (b[2] * scale)
	    return out
	}

/***/ },
/* 107 */
/*!*******************************!*\
  !*** ./~/gl-vec3/distance.js ***!
  \*******************************/
/***/ function(module, exports) {

	module.exports = distance;
	
	/**
	 * Calculates the euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} distance between a and b
	 */
	function distance(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2]
	    return Math.sqrt(x*x + y*y + z*z)
	}

/***/ },
/* 108 */
/*!**************************************!*\
  !*** ./~/gl-vec3/squaredDistance.js ***!
  \**************************************/
/***/ function(module, exports) {

	module.exports = squaredDistance;
	
	/**
	 * Calculates the squared euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	function squaredDistance(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2]
	    return x*x + y*y + z*z
	}

/***/ },
/* 109 */
/*!*****************************!*\
  !*** ./~/gl-vec3/length.js ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = length;
	
	/**
	 * Calculates the length of a vec3
	 *
	 * @param {vec3} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	function length(a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2]
	    return Math.sqrt(x*x + y*y + z*z)
	}

/***/ },
/* 110 */
/*!************************************!*\
  !*** ./~/gl-vec3/squaredLength.js ***!
  \************************************/
/***/ function(module, exports) {

	module.exports = squaredLength;
	
	/**
	 * Calculates the squared length of a vec3
	 *
	 * @param {vec3} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	function squaredLength(a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2]
	    return x*x + y*y + z*z
	}

/***/ },
/* 111 */
/*!*****************************!*\
  !*** ./~/gl-vec3/negate.js ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = negate;
	
	/**
	 * Negates the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to negate
	 * @returns {vec3} out
	 */
	function negate(out, a) {
	    out[0] = -a[0]
	    out[1] = -a[1]
	    out[2] = -a[2]
	    return out
	}

/***/ },
/* 112 */
/*!******************************!*\
  !*** ./~/gl-vec3/inverse.js ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = inverse;
	
	/**
	 * Returns the inverse of the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to invert
	 * @returns {vec3} out
	 */
	function inverse(out, a) {
	  out[0] = 1.0 / a[0]
	  out[1] = 1.0 / a[1]
	  out[2] = 1.0 / a[2]
	  return out
	}

/***/ },
/* 113 */
/*!****************************!*\
  !*** ./~/gl-vec3/cross.js ***!
  \****************************/
/***/ function(module, exports) {

	module.exports = cross;
	
	/**
	 * Computes the cross product of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function cross(out, a, b) {
	    var ax = a[0], ay = a[1], az = a[2],
	        bx = b[0], by = b[1], bz = b[2]
	
	    out[0] = ay * bz - az * by
	    out[1] = az * bx - ax * bz
	    out[2] = ax * by - ay * bx
	    return out
	}

/***/ },
/* 114 */
/*!***************************!*\
  !*** ./~/gl-vec3/lerp.js ***!
  \***************************/
/***/ function(module, exports) {

	module.exports = lerp;
	
	/**
	 * Performs a linear interpolation between two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	function lerp(out, a, b, t) {
	    var ax = a[0],
	        ay = a[1],
	        az = a[2]
	    out[0] = ax + t * (b[0] - ax)
	    out[1] = ay + t * (b[1] - ay)
	    out[2] = az + t * (b[2] - az)
	    return out
	}

/***/ },
/* 115 */
/*!*****************************!*\
  !*** ./~/gl-vec3/random.js ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = random;
	
	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec3} out
	 */
	function random(out, scale) {
	    scale = scale || 1.0
	
	    var r = Math.random() * 2.0 * Math.PI
	    var z = (Math.random() * 2.0) - 1.0
	    var zScale = Math.sqrt(1.0-z*z) * scale
	
	    out[0] = Math.cos(r) * zScale
	    out[1] = Math.sin(r) * zScale
	    out[2] = z * scale
	    return out
	}

/***/ },
/* 116 */
/*!************************************!*\
  !*** ./~/gl-vec3/transformMat4.js ***!
  \************************************/
/***/ function(module, exports) {

	module.exports = transformMat4;
	
	/**
	 * Transforms the vec3 with a mat4.
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec3} out
	 */
	function transformMat4(out, a, m) {
	    var x = a[0], y = a[1], z = a[2],
	        w = m[3] * x + m[7] * y + m[11] * z + m[15]
	    w = w || 1.0
	    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w
	    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w
	    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
	    return out
	}

/***/ },
/* 117 */
/*!************************************!*\
  !*** ./~/gl-vec3/transformMat3.js ***!
  \************************************/
/***/ function(module, exports) {

	module.exports = transformMat3;
	
	/**
	 * Transforms the vec3 with a mat3.
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m the 3x3 matrix to transform with
	 * @returns {vec3} out
	 */
	function transformMat3(out, a, m) {
	    var x = a[0], y = a[1], z = a[2]
	    out[0] = x * m[0] + y * m[3] + z * m[6]
	    out[1] = x * m[1] + y * m[4] + z * m[7]
	    out[2] = x * m[2] + y * m[5] + z * m[8]
	    return out
	}

/***/ },
/* 118 */
/*!************************************!*\
  !*** ./~/gl-vec3/transformQuat.js ***!
  \************************************/
/***/ function(module, exports) {

	module.exports = transformQuat;
	
	/**
	 * Transforms the vec3 with a quat
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec3} out
	 */
	function transformQuat(out, a, q) {
	    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
	
	    var x = a[0], y = a[1], z = a[2],
	        qx = q[0], qy = q[1], qz = q[2], qw = q[3],
	
	        // calculate quat * vec
	        ix = qw * x + qy * z - qz * y,
	        iy = qw * y + qz * x - qx * z,
	        iz = qw * z + qx * y - qy * x,
	        iw = -qx * x - qy * y - qz * z
	
	    // calculate result * inverse quat
	    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy
	    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz
	    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx
	    return out
	}

/***/ },
/* 119 */
/*!******************************!*\
  !*** ./~/gl-vec3/rotateX.js ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = rotateX;
	
	/**
	 * Rotate a 3D vector around the x-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	function rotateX(out, a, b, c){
	    var p = [], r=[]
	    //Translate point to the origin
	    p[0] = a[0] - b[0]
	    p[1] = a[1] - b[1]
	    p[2] = a[2] - b[2]
	
	    //perform rotation
	    r[0] = p[0]
	    r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c)
	    r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c)
	
	    //translate to correct position
	    out[0] = r[0] + b[0]
	    out[1] = r[1] + b[1]
	    out[2] = r[2] + b[2]
	
	    return out
	}

/***/ },
/* 120 */
/*!******************************!*\
  !*** ./~/gl-vec3/rotateY.js ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = rotateY;
	
	/**
	 * Rotate a 3D vector around the y-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	function rotateY(out, a, b, c){
	    var p = [], r=[]
	    //Translate point to the origin
	    p[0] = a[0] - b[0]
	    p[1] = a[1] - b[1]
	    p[2] = a[2] - b[2]
	  
	    //perform rotation
	    r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c)
	    r[1] = p[1]
	    r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c)
	  
	    //translate to correct position
	    out[0] = r[0] + b[0]
	    out[1] = r[1] + b[1]
	    out[2] = r[2] + b[2]
	  
	    return out
	}

/***/ },
/* 121 */
/*!******************************!*\
  !*** ./~/gl-vec3/rotateZ.js ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = rotateZ;
	
	/**
	 * Rotate a 3D vector around the z-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	function rotateZ(out, a, b, c){
	    var p = [], r=[]
	    //Translate point to the origin
	    p[0] = a[0] - b[0]
	    p[1] = a[1] - b[1]
	    p[2] = a[2] - b[2]
	  
	    //perform rotation
	    r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c)
	    r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c)
	    r[2] = p[2]
	  
	    //translate to correct position
	    out[0] = r[0] + b[0]
	    out[1] = r[1] + b[1]
	    out[2] = r[2] + b[2]
	  
	    return out
	}

/***/ },
/* 122 */
/*!******************************!*\
  !*** ./~/gl-vec3/forEach.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = forEach;
	
	var vec = __webpack_require__(/*! ./create */ 91)()
	
	/**
	 * Perform some operation over an array of vec3s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	function forEach(a, stride, offset, count, fn, arg) {
	        var i, l
	        if(!stride) {
	            stride = 3
	        }
	
	        if(!offset) {
	            offset = 0
	        }
	        
	        if(count) {
	            l = Math.min((count * stride) + offset, a.length)
	        } else {
	            l = a.length
	        }
	
	        for(i = offset; i < l; i += stride) {
	            vec[0] = a[i] 
	            vec[1] = a[i+1] 
	            vec[2] = a[i+2]
	            fn(vec, vec, arg)
	            a[i] = vec[0] 
	            a[i+1] = vec[1] 
	            a[i+2] = vec[2]
	        }
	        
	        return a
	}

/***/ },
/* 123 */
/*!**********************!*\
  !*** ./src/mouse.js ***!
  \**********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  x: 0,
	  y: 0,
	  set: function set(x, y) {
	    this.x = x;
	    this.y = y;
	  },
	  getNormalizedCoords: function getNormalizedCoords(width, height) {
	    return {
	      x: (this.x - 0.5 * width) / (0.5 * width),
	      y: (0.5 * height - this.y) / (0.5 * height)
	    };
	  }
	};

/***/ },
/* 124 */,
/* 125 */
/*!*****************************!*\
  !*** ./src/webgl/Engine.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(/*! ./utils */ 126);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Engine = function () {
	  function Engine($canvas) {
	    _classCallCheck(this, Engine);
	
	    this.$canvas = $canvas;
	    this.attributes = {};
	    this.uniforms = {};
	  }
	
	  _createClass(Engine, [{
	    key: 'initContext',
	    value: function initContext() {
	      this.gl = (0, _utils.getWebGLContext)(this.$canvas);
	      // Set clear color
	      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	    }
	  }, {
	    key: 'initProgram',
	    value: function initProgram() {
	      this.program = (0, _utils.createProgram)(this.gl, __webpack_require__(/*! ../shaders/main.vert */ 127), __webpack_require__(/*! ../shaders/main.frag */ 128));
	      if (!this.program) {
	        console.error('Failed to create program');
	      }
	      this.gl.useProgram(this.program);
	      this.gl.program = this.program;
	    }
	  }, {
	    key: 'bindAttributes',
	    value: function bindAttributes(attributes) {
	      var _this = this;
	
	      attributes.forEach(function (attribute) {
	        var ref = _this.gl.getAttribLocation(_this.gl.program, attribute);
	        if (ref < 0) {
	          console.error('Failed to locate attribute: ' + attribute);
	          return;
	        }
	        _this.attributes[attribute] = ref;
	      });
	    }
	  }, {
	    key: 'bindUniforms',
	    value: function bindUniforms(uniforms) {
	      var _this2 = this;
	
	      uniforms.forEach(function (uniform) {
	        var ref = _this2.gl.getUniformLocation(_this2.gl.program, uniform);
	        if (ref < 0) {
	          console.error('Failed to locate uniform: ' + uniform);
	          return;
	        }
	        _this2.uniforms[uniform] = ref;
	      });
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	    }
	  }, {
	    key: 'loadTexture',
	    value: function loadTexture(texture, image, uniform, unit) {
	      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
	      if (unit === 0) {
	        this.gl.activeTexture(this.gl.TEXTURE0);
	      } else if (unit === 1) {
	        this.gl.activeTexture(this.gl.TEXTURE1);
	      }
	      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
	      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, image);
	      this.gl.uniform1i(this.uniforms[uniform], unit);
	    }
	  }]);
	
	  return Engine;
	}();
	
	exports.default = Engine;

/***/ },
/* 126 */
/*!****************************!*\
  !*** ./src/webgl/utils.js ***!
  \****************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getWebGLContext = getWebGLContext;
	exports.loadShader = loadShader;
	exports.createProgram = createProgram;
	function getWebGLContext(canvas) {
	  // Get the rendering context for WebGL
	  var gl = canvas.getContext('webgl');
	
	  if (!gl) {
	    console.error('WebGL not supported');
	    return false;
	  }
	
	  return gl;
	}
	
	function loadShader(gl, type, source) {
	  // Create shader object
	  var shader = gl.createShader(type);
	  if (!shader) {
	    console.error('unable to create shader');
	    return false;
	  }
	  // Set the shader program
	  gl.shaderSource(shader, source);
	  // Compile the shader
	  gl.compileShader(shader);
	  // Check the result of compilation
	  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	  if (!compiled) {
	    var error = gl.getShaderInfoLog(shader);
	    console.error('Failed to compile shader: ' + error);
	    gl.deleteShader(shader);
	    return false;
	  }
	
	  return shader;
	}
	
	function createProgram(gl, vshader, fshader) {
	  // Create shader object
	  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
	  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
	  if (!vertexShader || !fragmentShader) {
	    return false;
	  }
	
	  // Create a program object
	  var program = gl.createProgram();
	  if (!program) {
	    return false;
	  }
	
	  // Attach the shader objects
	  gl.attachShader(program, vertexShader);
	  gl.attachShader(program, fragmentShader);
	  // Link the program object
	  gl.linkProgram(program);
	  // Check the result of linking
	  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	  if (!linked) {
	    var error = gl.getProgramInfoLog(program);
	    console.error('Failed to link program: ' + error);
	    gl.deleteProgram(program);
	    gl.deleteShader(fragmentShader);
	    gl.deleteShader(vertexShader);
	
	    return false;
	  }
	
	  return program;
	}

/***/ },
/* 127 */
/*!*******************************!*\
  !*** ./src/shaders/main.vert ***!
  \*******************************/
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\nattribute vec4 a_Position;\nattribute vec3 a_Color;\n\nuniform mat4 u_ViewMatrix;\nuniform mat4 u_TransformMatrix;\n\nvarying vec3 v_Color;\n\nvoid main()\n{\n  v_Color = a_Color;\n  gl_Position = u_ViewMatrix * a_Position;\n}\n"

/***/ },
/* 128 */
/*!*******************************!*\
  !*** ./src/shaders/main.frag ***!
  \*******************************/
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec3 v_Color;\n\nvoid main()\n{\n  gl_FragColor = vec4(v_Color, 1.0);\n}\n"

/***/ },
/* 129 */,
/* 130 */
/*!********************************************!*\
  !*** ./src/webgl/shapes/MultiTriangles.js ***!
  \********************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MultiTriangles = function MultiTriangles(gl, position, color) {
	  _classCallCheck(this, MultiTriangles);
	
	  this.drawMode = gl.TRIANGLES;
	
	  this.verticeCount = 9;
	  this.data = new Float32Array([0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // back greend triangle
	  -0.5, -0.5, -0.4, 0.4, 1.0, 0.4, 0.5, -0.5, -0.4, 1.0, 0.4, 0.4, 0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // middle yellow triangle
	  -0.5, 0.4, -0.2, 1.0, 1.0, 0.4, 0.0, -0.6, -0.2, 1.0, 1.0, 0.4, 0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // front blue triangle
	  -0.5, -0.5, 0.0, 0.4, 0.4, 1.0, 0.5, -0.5, 0.0, 1.0, 0.4, 0.4]);
	
	  this.vertexBuffer = gl.createBuffer();
	  if (!this.vertexBuffer) {
	    console.error('Failed to create buffer object');
	    return;
	  }
	
	  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
	
	  // Bind attributes
	  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, this.data.BYTES_PER_ELEMENT * 6, 0);
	  gl.enableVertexAttribArray(position);
	
	  gl.vertexAttribPointer(color, 3, gl.FLOAT, false, this.data.BYTES_PER_ELEMENT * 6, this.data.BYTES_PER_ELEMENT * 3);
	  gl.enableVertexAttribArray(color);
	};
	
	exports.default = MultiTriangles;

/***/ },
/* 131 */
/*!*****************************!*\
  !*** ./src/webgl/Camera.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _glVec = __webpack_require__(/*! gl-vec3 */ 90);
	
	var _glVec2 = _interopRequireDefault(_glVec);
	
	var _glMat = __webpack_require__(/*! gl-mat4 */ 66);
	
	var _glMat2 = _interopRequireDefault(_glMat);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Camera = function () {
	  function Camera() {
	    _classCallCheck(this, Camera);
	
	    this.eye = _glVec2.default.create();
	    this.lookAt = _glVec2.default.create();
	    this.up = _glVec2.default.create();
	    this.viewMatrix = _glMat2.default.create();
	  }
	
	  _createClass(Camera, [{
	    key: 'setEye',
	    value: function setEye(x, y, z) {
	      this.eye = _glVec2.default.set([], x, y, z);
	      this.setViewMatrix();
	    }
	  }, {
	    key: 'setLookAt',
	    value: function setLookAt(x, y, z) {
	      this.lookAt = _glVec2.default.set([], x, y, z);
	      this.setViewMatrix();
	    }
	  }, {
	    key: 'setUp',
	    value: function setUp(x, y, z) {
	      this.up = _glVec2.default.set([], x, y, z);
	      this.setViewMatrix();
	    }
	  }, {
	    key: 'setViewMatrix',
	    value: function setViewMatrix() {
	      this.viewMatrix = _glMat2.default.lookAt([], this.eye, this.lookAt, this.up);
	    }
	  }, {
	    key: 'getViewMatrix',
	    value: function getViewMatrix() {
	      return this.viewMatrix;
	    }
	  }]);
	
	  return Camera;
	}();
	
	exports.default = Camera;

/***/ }
/******/ ]);
//# sourceMappingURL=build.js.map