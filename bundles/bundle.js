(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":5}],2:[function(require,module,exports){
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],5:[function(require,module,exports){
(function (process,global){
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

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":4,"_process":2,"inherits":3}],6:[function(require,module,exports){
var choo = require('choo')
var html = require('choo/html')
var css = 0

;((require('sheetify/insert')("/*!\n * ress.css • v1.2.2\n * MIT License\n * github.com/filipelinhares/ress\n */html{box-sizing:border-box;overflow-y:scroll;-webkit-text-size-adjust:100%}*,:after,:before{background-repeat:no-repeat;box-sizing:inherit}:after,:before{text-decoration:inherit;vertical-align:inherit}*{padding:0;margin:0}audio:not([controls]){display:none;height:0}hr{overflow:visible}article,aside,details,figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}summary{display:list-item}small{font-size:80%}[hidden],template{display:none}abbr[title]{border-bottom:1px dotted;text-decoration:none}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}code,kbd,pre,samp{font-family:monospace,monospace}b,strong{font-weight:bolder}dfn{font-style:italic}mark{background-color:#ff0;color:#000}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}input{border-radius:0}[role=button],[type=button],[type=reset],[type=submit],button{cursor:pointer}[disabled]{cursor:default}[type=number]{width:auto}[type=search]{-webkit-appearance:textfield}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}textarea{overflow:auto;resize:vertical}button,input,optgroup,select,textarea{font:inherit}optgroup{font-weight:700}button{overflow:visible}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:0;padding:0}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button:-moz-focusring{outline:1px dotted ButtonText}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}button,select{text-transform:none}button,input,select,textarea{background-color:transparent;border-style:none;color:inherit}select{-moz-appearance:none;-webkit-appearance:none}select::-ms-expand{display:none}select::-ms-value{color:currentColor}legend{border:0;color:inherit;display:table;max-width:100%;white-space:normal}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}img{border-style:none}progress{vertical-align:baseline}svg:not(:root){overflow:hidden}audio,canvas,progress,video{display:inline-block}@media screen{[hidden~=screen]{display:inherit}[hidden~=screen]:not(:active):not(:focus):not(:target){position:absolute!important;clip:rect(0 0 0 0)!important}}[aria-busy=true]{cursor:progress}[aria-controls]{cursor:pointer}[aria-disabled]{cursor:default}::-moz-selection{background-color:#b3d4fc;color:#000;text-shadow:none}::selection{background-color:#b3d4fc;color:#000;text-shadow:none}") || true) && "_94f5a2f1")
;((require('sheetify/insert')("/*!\n * gr8.css • v3.1.3\n * github.com/jongacnik/gr8\n */\n.c1{width:8.33333%}\n.c2{width:16.66667%}\n.c3{width:25%}\n.c4{width:33.33333%}\n.c5{width:41.66667%}\n.c6{width:50%}\n.c7{width:58.33333%}\n.c8{width:66.66667%}\n.c9{width:75%}\n.c10{width:83.33333%}\n.c11{width:91.66667%}\n.c12{width:100%}\n.s1{width:100%}\n.s2{width:50%}\n.s3{width:33.33333%}\n.s4{width:25%}\n.s5{width:20%}\n.s6{width:16.66667%}\n.s7{width:14.28571%}\n.s8{width:12.5%}\n.s9{width:11.11111%}\n.s10{width:10%}\n.s11{width:9.09091%}\n.s12{width:8.33333%}\n.co0{margin-left:0}\n.co1{margin-left:8.33333%}\n.co2{margin-left:16.66667%}\n.co3{margin-left:25%}\n.co4{margin-left:33.33333%}\n.co5{margin-left:41.66667%}\n.co6{margin-left:50%}\n.co7{margin-left:58.33333%}\n.co8{margin-left:66.66667%}\n.co9{margin-left:75%}\n.co10{margin-left:83.33333%}\n.co11{margin-left:91.66667%}\n.co12{margin-left:100%}\n.m0{margin:0}\n.m1{margin:1rem}\n.m2{margin:2rem}\n.m3{margin:3rem}\n.m4{margin:4rem}\n.mt0{margin-top:0}\n.mt1{margin-top:1rem}\n.mt2{margin-top:2rem}\n.mt3{margin-top:3rem}\n.mt4{margin-top:4rem}\n.mr0{margin-right:0}\n.mr1{margin-right:1rem}\n.mr2{margin-right:2rem}\n.mr3{margin-right:3rem}\n.mr4{margin-right:4rem}\n.mb0{margin-bottom:0}\n.mb1{margin-bottom:1rem}\n.mb2{margin-bottom:2rem}\n.mb3{margin-bottom:3rem}\n.mb4{margin-bottom:4rem}\n.ml0{margin-left:0}\n.ml1{margin-left:1rem}\n.ml2{margin-left:2rem}\n.ml3{margin-left:3rem}\n.ml4{margin-left:4rem}\n.mx0{margin-left:0;margin-right:0}\n.mx1{margin-left:1rem;margin-right:1rem}\n.mx2{margin-left:2rem;margin-right:2rem}\n.mx3{margin-left:3rem;margin-right:3rem}\n.mx4{margin-left:4rem;margin-right:4rem}\n.my0{margin-top:0;margin-bottom:0}\n.my1{margin-top:1rem;margin-bottom:1rem}\n.my2{margin-top:2rem;margin-bottom:2rem}\n.my3{margin-top:3rem;margin-bottom:3rem}\n.my4{margin-top:4rem;margin-bottom:4rem}\n.p0{padding:0}\n.p1{padding:1rem}\n.p2{padding:2rem}\n.p3{padding:3rem}\n.p4{padding:4rem}\n.pt0{padding-top:0}\n.pt1{padding-top:1rem}\n.pt2{padding-top:2rem}\n.pt3{padding-top:3rem}\n.pt4{padding-top:4rem}\n.pr0{padding-right:0}\n.pr1{padding-right:1rem}\n.pr2{padding-right:2rem}\n.pr3{padding-right:3rem}\n.pr4{padding-right:4rem}\n.pb0{padding-bottom:0}\n.pb1{padding-bottom:1rem}\n.pb2{padding-bottom:2rem}\n.pb3{padding-bottom:3rem}\n.pb4{padding-bottom:4rem}\n.pl0{padding-left:0}\n.pl1{padding-left:1rem}\n.pl2{padding-left:2rem}\n.pl3{padding-left:3rem}\n.pl4{padding-left:4rem}\n.px0{padding-left:0;padding-right:0}\n.px1{padding-left:1rem;padding-right:1rem}\n.px2{padding-left:2rem;padding-right:2rem}\n.px3{padding-left:3rem;padding-right:3rem}\n.px4{padding-left:4rem;padding-right:4rem}\n.py0{padding-top:0;padding-bottom:0}\n.py1{padding-top:1rem;padding-bottom:1rem}\n.py2{padding-top:2rem;padding-bottom:2rem}\n.py3{padding-top:3rem;padding-bottom:3rem}\n.py4{padding-top:4rem;padding-bottom:4rem}\n.op0{opacity:0}\n.op25{opacity:0.25}\n.op50{opacity:0.5}\n.op75{opacity:0.75}\n.op100{opacity:1}\n.bgsc{background-size:cover}\n.bgsct{background-size:contain}\n.bgpc{background-position:center}\n.bgpt{background-position:top}\n.bgpr{background-position:right}\n.bgpb{background-position:bottom}\n.bgpl{background-position:left}\n.bgrn{background-repeat:no-repeat}\n.bgrx{background-repeat:repeat-x}\n.bgry{background-repeat:repeat-y}\n.x{display:flex}\n.xac{align-items:center}\n.xab{align-items:baseline}\n.xas{align-items:stretch}\n.xafs{align-items:flex-start}\n.xafe{align-items:flex-end}\n.xdr{flex-direction:row}\n.xdrr{flex-direction:row-reverse}\n.xdc{flex-direction:column}\n.xdcr{flex-direction:column-reverse}\n.xjc{justify-content:center}\n.xjb{justify-content:space-between}\n.xja{justify-content:space-around}\n.xjs{justify-content:flex-start}\n.xje{justify-content:flex-end}\n.xw{flex-wrap:wrap}\n.xwr{flex-wrap:wrap-reverse}\n.xwn{flex-wrap:nowrap}\n.xi{flex:initial}\n.xx{flex:1}\n.xa{flex:auto}\n.xn{flex:none}\n.xo0{order:0}\n.xo1{order:1}\n.xo2{order:2}\n.xo3{order:3}\n.xo4{order:4}\n.xot{order:-1}\n.xob{order:99}\n.df{display:flex}\n.db{display:block}\n.dib{display:inline-block}\n.di{display:inline}\n.dt{display:table}\n.dtc{display:table-cell}\n.dtr{display:table-row}\n.dn{display:none}\n.fl{float:left}\n.fr{float:right}\n.fn{float:none}\n.cf:after{content:\"\";display:block;clear:both}\n.oh{overflow:hidden}\n.os{overflow:scroll}\n.ov{overflow:visible}\n.oxh{overflow-x:hidden}\n.oxs{overflow-x:scroll}\n.oxv{overflow-x:visible}\n.oyh{overflow-y:hidden}\n.oys{overflow-y:scroll}\n.oyv{overflow-y:visible}\n.psa{position:absolute}\n.psr{position:relative}\n.psf{position:fixed}\n.pss{position:static}\n.t0{top:0}\n.r0{right:0}\n.b0{bottom:0}\n.l0{left:0}\n.z0{z-index:0}\n.z1{z-index:1}\n.z2{z-index:2}\n.z3{z-index:3}\n.z4{z-index:4}\n.w0{width:0}\n.w100{width:100%}\n.h0{height:0}\n.h100{height:100%}\n.vw50{width:50vw}\n.vw100{width:100vw}\n.vwmn50{min-width:50vw}\n.vwmn100{min-width:100vw}\n.vwmx50{max-width:50vw}\n.vwmx100{max-width:100vw}\n.vh50{height:50vh}\n.vh100{height:100vh}\n.vhmn50{min-height:50vh}\n.vhmn100{min-height:100vh}\n.vhmx50{max-height:50vh}\n.vhmx100{max-height:100vh}\n.ar25:before{padding-top:25%;content:\"\";display:block}\n.ar50:before{padding-top:50%;content:\"\";display:block}\n.ar75:before{padding-top:75%;content:\"\";display:block}\n.ar100:before{padding-top:100%;content:\"\";display:block}\n.fs1{font-size:1rem}\n.fs1-2{font-size:1.2rem}\n.fs1-6{font-size:1.6rem}\n.fs2-4{font-size:2.4rem}\n.fs3-2{font-size:3.2rem}\n.fs6-4{font-size:6.4rem}\n.lh1{line-height:1}\n.lh1-5{line-height:1.5}\n.fsn{font-style:normal}\n.fsi{font-style:italic}\n.fwn{font-weight:normal}\n.fwb{font-weight:bold}\n.tal{text-align:left}\n.tac{text-align:center}\n.tar{text-align:right}\n.taj{text-align:justify}\n.toi{text-overflow:initial}\n.toc{text-overflow:clip}\n.toe{text-overflow:ellipsis}\n.tdu{text-decoration:underline}\n.tdo{text-decoration:overline}\n.tdlt{text-decoration:line-through}\n.tdn{text-decoration:none}\n.ttu{text-transform:uppercase}\n.ttl{text-transform:lowercase}\n.ttc{text-transform:capitalize}\n.ttn{text-transform:none}\n.vabl{vertical-align:baseline}\n.vat{vertical-align:top}\n.vam{vertical-align:middle}\n.vab{vertical-align:bottom}\n.wsn{white-space:normal}\n.wsnw{white-space:nowrap}\n.wsp{white-space:pre}\n.wsi{white-space:inherit}\n.tc1{columns:1}\n.tc2{columns:2}\n.tc3{columns:3}\n.tc4{columns:4}\n.curp{cursor:pointer}\n.curd{cursor:default}\n.cura{cursor:alias}\n.curzi{cursor:zoom-in}\n.curzo{cursor:zoom-out}\n.usn{user-select:none}\n.usa{user-select:auto}\n.ust{user-select:text}\n.pen{pointer-events:none}\n.pea{pointer-events:auto}\n.vh{visibility:hidden}\n.vv{visibility:visible}\n.dev{outline:1px solid #912eff}\n.dev > * {outline:1px solid #5497ff}\n.dev > * > * {outline:1px solid #51feff}\n.dev > * > * > * {outline:1px solid #ff0000}\n.dev > * > * > * * {outline:1px solid #00ff00}\n@media (min-width:768px) {\n[sm~=\"c1\"]{width:8.33333%}\n[sm~=\"c2\"]{width:16.66667%}\n[sm~=\"c3\"]{width:25%}\n[sm~=\"c4\"]{width:33.33333%}\n[sm~=\"c5\"]{width:41.66667%}\n[sm~=\"c6\"]{width:50%}\n[sm~=\"c7\"]{width:58.33333%}\n[sm~=\"c8\"]{width:66.66667%}\n[sm~=\"c9\"]{width:75%}\n[sm~=\"c10\"]{width:83.33333%}\n[sm~=\"c11\"]{width:91.66667%}\n[sm~=\"c12\"]{width:100%}\n[sm~=\"s1\"]{width:100%}\n[sm~=\"s2\"]{width:50%}\n[sm~=\"s3\"]{width:33.33333%}\n[sm~=\"s4\"]{width:25%}\n[sm~=\"s5\"]{width:20%}\n[sm~=\"s6\"]{width:16.66667%}\n[sm~=\"s7\"]{width:14.28571%}\n[sm~=\"s8\"]{width:12.5%}\n[sm~=\"s9\"]{width:11.11111%}\n[sm~=\"s10\"]{width:10%}\n[sm~=\"s11\"]{width:9.09091%}\n[sm~=\"s12\"]{width:8.33333%}\n[sm~=\"co0\"]{margin-left:0}\n[sm~=\"co1\"]{margin-left:8.33333%}\n[sm~=\"co2\"]{margin-left:16.66667%}\n[sm~=\"co3\"]{margin-left:25%}\n[sm~=\"co4\"]{margin-left:33.33333%}\n[sm~=\"co5\"]{margin-left:41.66667%}\n[sm~=\"co6\"]{margin-left:50%}\n[sm~=\"co7\"]{margin-left:58.33333%}\n[sm~=\"co8\"]{margin-left:66.66667%}\n[sm~=\"co9\"]{margin-left:75%}\n[sm~=\"co10\"]{margin-left:83.33333%}\n[sm~=\"co11\"]{margin-left:91.66667%}\n[sm~=\"co12\"]{margin-left:100%}\n[sm~=\"m0\"]{margin:0}\n[sm~=\"m1\"]{margin:1rem}\n[sm~=\"m2\"]{margin:2rem}\n[sm~=\"m3\"]{margin:3rem}\n[sm~=\"m4\"]{margin:4rem}\n[sm~=\"mt0\"]{margin-top:0}\n[sm~=\"mt1\"]{margin-top:1rem}\n[sm~=\"mt2\"]{margin-top:2rem}\n[sm~=\"mt3\"]{margin-top:3rem}\n[sm~=\"mt4\"]{margin-top:4rem}\n[sm~=\"mr0\"]{margin-right:0}\n[sm~=\"mr1\"]{margin-right:1rem}\n[sm~=\"mr2\"]{margin-right:2rem}\n[sm~=\"mr3\"]{margin-right:3rem}\n[sm~=\"mr4\"]{margin-right:4rem}\n[sm~=\"mb0\"]{margin-bottom:0}\n[sm~=\"mb1\"]{margin-bottom:1rem}\n[sm~=\"mb2\"]{margin-bottom:2rem}\n[sm~=\"mb3\"]{margin-bottom:3rem}\n[sm~=\"mb4\"]{margin-bottom:4rem}\n[sm~=\"ml0\"]{margin-left:0}\n[sm~=\"ml1\"]{margin-left:1rem}\n[sm~=\"ml2\"]{margin-left:2rem}\n[sm~=\"ml3\"]{margin-left:3rem}\n[sm~=\"ml4\"]{margin-left:4rem}\n[sm~=\"mx0\"]{margin-left:0;margin-right:0}\n[sm~=\"mx1\"]{margin-left:1rem;margin-right:1rem}\n[sm~=\"mx2\"]{margin-left:2rem;margin-right:2rem}\n[sm~=\"mx3\"]{margin-left:3rem;margin-right:3rem}\n[sm~=\"mx4\"]{margin-left:4rem;margin-right:4rem}\n[sm~=\"my0\"]{margin-top:0;margin-bottom:0}\n[sm~=\"my1\"]{margin-top:1rem;margin-bottom:1rem}\n[sm~=\"my2\"]{margin-top:2rem;margin-bottom:2rem}\n[sm~=\"my3\"]{margin-top:3rem;margin-bottom:3rem}\n[sm~=\"my4\"]{margin-top:4rem;margin-bottom:4rem}\n[sm~=\"p0\"]{padding:0}\n[sm~=\"p1\"]{padding:1rem}\n[sm~=\"p2\"]{padding:2rem}\n[sm~=\"p3\"]{padding:3rem}\n[sm~=\"p4\"]{padding:4rem}\n[sm~=\"pt0\"]{padding-top:0}\n[sm~=\"pt1\"]{padding-top:1rem}\n[sm~=\"pt2\"]{padding-top:2rem}\n[sm~=\"pt3\"]{padding-top:3rem}\n[sm~=\"pt4\"]{padding-top:4rem}\n[sm~=\"pr0\"]{padding-right:0}\n[sm~=\"pr1\"]{padding-right:1rem}\n[sm~=\"pr2\"]{padding-right:2rem}\n[sm~=\"pr3\"]{padding-right:3rem}\n[sm~=\"pr4\"]{padding-right:4rem}\n[sm~=\"pb0\"]{padding-bottom:0}\n[sm~=\"pb1\"]{padding-bottom:1rem}\n[sm~=\"pb2\"]{padding-bottom:2rem}\n[sm~=\"pb3\"]{padding-bottom:3rem}\n[sm~=\"pb4\"]{padding-bottom:4rem}\n[sm~=\"pl0\"]{padding-left:0}\n[sm~=\"pl1\"]{padding-left:1rem}\n[sm~=\"pl2\"]{padding-left:2rem}\n[sm~=\"pl3\"]{padding-left:3rem}\n[sm~=\"pl4\"]{padding-left:4rem}\n[sm~=\"px0\"]{padding-left:0;padding-right:0}\n[sm~=\"px1\"]{padding-left:1rem;padding-right:1rem}\n[sm~=\"px2\"]{padding-left:2rem;padding-right:2rem}\n[sm~=\"px3\"]{padding-left:3rem;padding-right:3rem}\n[sm~=\"px4\"]{padding-left:4rem;padding-right:4rem}\n[sm~=\"py0\"]{padding-top:0;padding-bottom:0}\n[sm~=\"py1\"]{padding-top:1rem;padding-bottom:1rem}\n[sm~=\"py2\"]{padding-top:2rem;padding-bottom:2rem}\n[sm~=\"py3\"]{padding-top:3rem;padding-bottom:3rem}\n[sm~=\"py4\"]{padding-top:4rem;padding-bottom:4rem}\n[sm~=\"op0\"]{opacity:0}\n[sm~=\"op25\"]{opacity:0.25}\n[sm~=\"op50\"]{opacity:0.5}\n[sm~=\"op75\"]{opacity:0.75}\n[sm~=\"op100\"]{opacity:1}\n[sm~=\"bgsc\"]{background-size:cover}\n[sm~=\"bgsct\"]{background-size:contain}\n[sm~=\"bgpc\"]{background-position:center}\n[sm~=\"bgpt\"]{background-position:top}\n[sm~=\"bgpr\"]{background-position:right}\n[sm~=\"bgpb\"]{background-position:bottom}\n[sm~=\"bgpl\"]{background-position:left}\n[sm~=\"bgrn\"]{background-repeat:no-repeat}\n[sm~=\"bgrx\"]{background-repeat:repeat-x}\n[sm~=\"bgry\"]{background-repeat:repeat-y}\n[sm~=\"x\"]{display:flex}\n[sm~=\"xac\"]{align-items:center}\n[sm~=\"xab\"]{align-items:baseline}\n[sm~=\"xas\"]{align-items:stretch}\n[sm~=\"xafs\"]{align-items:flex-start}\n[sm~=\"xafe\"]{align-items:flex-end}\n[sm~=\"xdr\"]{flex-direction:row}\n[sm~=\"xdrr\"]{flex-direction:row-reverse}\n[sm~=\"xdc\"]{flex-direction:column}\n[sm~=\"xdcr\"]{flex-direction:column-reverse}\n[sm~=\"xjc\"]{justify-content:center}\n[sm~=\"xjb\"]{justify-content:space-between}\n[sm~=\"xja\"]{justify-content:space-around}\n[sm~=\"xjs\"]{justify-content:flex-start}\n[sm~=\"xje\"]{justify-content:flex-end}\n[sm~=\"xw\"]{flex-wrap:wrap}\n[sm~=\"xwr\"]{flex-wrap:wrap-reverse}\n[sm~=\"xwn\"]{flex-wrap:nowrap}\n[sm~=\"xi\"]{flex:initial}\n[sm~=\"xx\"]{flex:1}\n[sm~=\"xa\"]{flex:auto}\n[sm~=\"xn\"]{flex:none}\n[sm~=\"xo0\"]{order:0}\n[sm~=\"xo1\"]{order:1}\n[sm~=\"xo2\"]{order:2}\n[sm~=\"xo3\"]{order:3}\n[sm~=\"xo4\"]{order:4}\n[sm~=\"xot\"]{order:-1}\n[sm~=\"xob\"]{order:99}\n[sm~=\"df\"]{display:flex}\n[sm~=\"db\"]{display:block}\n[sm~=\"dib\"]{display:inline-block}\n[sm~=\"di\"]{display:inline}\n[sm~=\"dt\"]{display:table}\n[sm~=\"dtc\"]{display:table-cell}\n[sm~=\"dtr\"]{display:table-row}\n[sm~=\"dn\"]{display:none}\n[sm~=\"fl\"]{float:left}\n[sm~=\"fr\"]{float:right}\n[sm~=\"fn\"]{float:none}\n[sm~=\"cf\"]:after{content:\"\";display:block;clear:both}\n[sm~=\"oh\"]{overflow:hidden}\n[sm~=\"os\"]{overflow:scroll}\n[sm~=\"ov\"]{overflow:visible}\n[sm~=\"oxh\"]{overflow-x:hidden}\n[sm~=\"oxs\"]{overflow-x:scroll}\n[sm~=\"oxv\"]{overflow-x:visible}\n[sm~=\"oyh\"]{overflow-y:hidden}\n[sm~=\"oys\"]{overflow-y:scroll}\n[sm~=\"oyv\"]{overflow-y:visible}\n[sm~=\"psa\"]{position:absolute}\n[sm~=\"psr\"]{position:relative}\n[sm~=\"psf\"]{position:fixed}\n[sm~=\"pss\"]{position:static}\n[sm~=\"t0\"]{top:0}\n[sm~=\"r0\"]{right:0}\n[sm~=\"b0\"]{bottom:0}\n[sm~=\"l0\"]{left:0}\n[sm~=\"z0\"]{z-index:0}\n[sm~=\"z1\"]{z-index:1}\n[sm~=\"z2\"]{z-index:2}\n[sm~=\"z3\"]{z-index:3}\n[sm~=\"z4\"]{z-index:4}\n[sm~=\"w0\"]{width:0}\n[sm~=\"w100\"]{width:100%}\n[sm~=\"h0\"]{height:0}\n[sm~=\"h100\"]{height:100%}\n[sm~=\"vw50\"]{width:50vw}\n[sm~=\"vw100\"]{width:100vw}\n[sm~=\"vwmn50\"]{min-width:50vw}\n[sm~=\"vwmn100\"]{min-width:100vw}\n[sm~=\"vwmx50\"]{max-width:50vw}\n[sm~=\"vwmx100\"]{max-width:100vw}\n[sm~=\"vh50\"]{height:50vh}\n[sm~=\"vh100\"]{height:100vh}\n[sm~=\"vhmn50\"]{min-height:50vh}\n[sm~=\"vhmn100\"]{min-height:100vh}\n[sm~=\"vhmx50\"]{max-height:50vh}\n[sm~=\"vhmx100\"]{max-height:100vh}\n[sm~=\"ar25\"]:before{padding-top:25%;content:\"\";display:block}\n[sm~=\"ar50\"]:before{padding-top:50%;content:\"\";display:block}\n[sm~=\"ar75\"]:before{padding-top:75%;content:\"\";display:block}\n[sm~=\"ar100\"]:before{padding-top:100%;content:\"\";display:block}\n[sm~=\"fs1\"]{font-size:1rem}\n[sm~=\"fs1-2\"]{font-size:1.2rem}\n[sm~=\"fs1-6\"]{font-size:1.6rem}\n[sm~=\"fs2-4\"]{font-size:2.4rem}\n[sm~=\"fs3-2\"]{font-size:3.2rem}\n[sm~=\"fs6-4\"]{font-size:6.4rem}\n[sm~=\"lh1\"]{line-height:1}\n[sm~=\"lh1-5\"]{line-height:1.5}\n[sm~=\"fsn\"]{font-style:normal}\n[sm~=\"fsi\"]{font-style:italic}\n[sm~=\"fwn\"]{font-weight:normal}\n[sm~=\"fwb\"]{font-weight:bold}\n[sm~=\"tal\"]{text-align:left}\n[sm~=\"tac\"]{text-align:center}\n[sm~=\"tar\"]{text-align:right}\n[sm~=\"taj\"]{text-align:justify}\n[sm~=\"toi\"]{text-overflow:initial}\n[sm~=\"toc\"]{text-overflow:clip}\n[sm~=\"toe\"]{text-overflow:ellipsis}\n[sm~=\"tdu\"]{text-decoration:underline}\n[sm~=\"tdo\"]{text-decoration:overline}\n[sm~=\"tdlt\"]{text-decoration:line-through}\n[sm~=\"tdn\"]{text-decoration:none}\n[sm~=\"ttu\"]{text-transform:uppercase}\n[sm~=\"ttl\"]{text-transform:lowercase}\n[sm~=\"ttc\"]{text-transform:capitalize}\n[sm~=\"ttn\"]{text-transform:none}\n[sm~=\"vabl\"]{vertical-align:baseline}\n[sm~=\"vat\"]{vertical-align:top}\n[sm~=\"vam\"]{vertical-align:middle}\n[sm~=\"vab\"]{vertical-align:bottom}\n[sm~=\"wsn\"]{white-space:normal}\n[sm~=\"wsnw\"]{white-space:nowrap}\n[sm~=\"wsp\"]{white-space:pre}\n[sm~=\"wsi\"]{white-space:inherit}\n[sm~=\"tc1\"]{columns:1}\n[sm~=\"tc2\"]{columns:2}\n[sm~=\"tc3\"]{columns:3}\n[sm~=\"tc4\"]{columns:4}\n[sm~=\"curp\"]{cursor:pointer}\n[sm~=\"curd\"]{cursor:default}\n[sm~=\"cura\"]{cursor:alias}\n[sm~=\"curzi\"]{cursor:zoom-in}\n[sm~=\"curzo\"]{cursor:zoom-out}\n[sm~=\"usn\"]{user-select:none}\n[sm~=\"usa\"]{user-select:auto}\n[sm~=\"ust\"]{user-select:text}\n[sm~=\"pen\"]{pointer-events:none}\n[sm~=\"pea\"]{pointer-events:auto}\n[sm~=\"vh\"]{visibility:hidden}\n[sm~=\"vv\"]{visibility:visible}\n[sm~=\"dev\"]{outline:1px solid #912eff}\n[sm~=\"dev\"] > * {outline:1px solid #5497ff}\n[sm~=\"dev\"] > * > * {outline:1px solid #51feff}\n[sm~=\"dev\"] > * > * > * {outline:1px solid #ff0000}\n[sm~=\"dev\"] > * > * > * * {outline:1px solid #00ff00}\n}\n@media (min-width:1024px) {\n[md~=\"c1\"]{width:8.33333%}\n[md~=\"c2\"]{width:16.66667%}\n[md~=\"c3\"]{width:25%}\n[md~=\"c4\"]{width:33.33333%}\n[md~=\"c5\"]{width:41.66667%}\n[md~=\"c6\"]{width:50%}\n[md~=\"c7\"]{width:58.33333%}\n[md~=\"c8\"]{width:66.66667%}\n[md~=\"c9\"]{width:75%}\n[md~=\"c10\"]{width:83.33333%}\n[md~=\"c11\"]{width:91.66667%}\n[md~=\"c12\"]{width:100%}\n[md~=\"s1\"]{width:100%}\n[md~=\"s2\"]{width:50%}\n[md~=\"s3\"]{width:33.33333%}\n[md~=\"s4\"]{width:25%}\n[md~=\"s5\"]{width:20%}\n[md~=\"s6\"]{width:16.66667%}\n[md~=\"s7\"]{width:14.28571%}\n[md~=\"s8\"]{width:12.5%}\n[md~=\"s9\"]{width:11.11111%}\n[md~=\"s10\"]{width:10%}\n[md~=\"s11\"]{width:9.09091%}\n[md~=\"s12\"]{width:8.33333%}\n[md~=\"co0\"]{margin-left:0}\n[md~=\"co1\"]{margin-left:8.33333%}\n[md~=\"co2\"]{margin-left:16.66667%}\n[md~=\"co3\"]{margin-left:25%}\n[md~=\"co4\"]{margin-left:33.33333%}\n[md~=\"co5\"]{margin-left:41.66667%}\n[md~=\"co6\"]{margin-left:50%}\n[md~=\"co7\"]{margin-left:58.33333%}\n[md~=\"co8\"]{margin-left:66.66667%}\n[md~=\"co9\"]{margin-left:75%}\n[md~=\"co10\"]{margin-left:83.33333%}\n[md~=\"co11\"]{margin-left:91.66667%}\n[md~=\"co12\"]{margin-left:100%}\n[md~=\"m0\"]{margin:0}\n[md~=\"m1\"]{margin:1rem}\n[md~=\"m2\"]{margin:2rem}\n[md~=\"m3\"]{margin:3rem}\n[md~=\"m4\"]{margin:4rem}\n[md~=\"mt0\"]{margin-top:0}\n[md~=\"mt1\"]{margin-top:1rem}\n[md~=\"mt2\"]{margin-top:2rem}\n[md~=\"mt3\"]{margin-top:3rem}\n[md~=\"mt4\"]{margin-top:4rem}\n[md~=\"mr0\"]{margin-right:0}\n[md~=\"mr1\"]{margin-right:1rem}\n[md~=\"mr2\"]{margin-right:2rem}\n[md~=\"mr3\"]{margin-right:3rem}\n[md~=\"mr4\"]{margin-right:4rem}\n[md~=\"mb0\"]{margin-bottom:0}\n[md~=\"mb1\"]{margin-bottom:1rem}\n[md~=\"mb2\"]{margin-bottom:2rem}\n[md~=\"mb3\"]{margin-bottom:3rem}\n[md~=\"mb4\"]{margin-bottom:4rem}\n[md~=\"ml0\"]{margin-left:0}\n[md~=\"ml1\"]{margin-left:1rem}\n[md~=\"ml2\"]{margin-left:2rem}\n[md~=\"ml3\"]{margin-left:3rem}\n[md~=\"ml4\"]{margin-left:4rem}\n[md~=\"mx0\"]{margin-left:0;margin-right:0}\n[md~=\"mx1\"]{margin-left:1rem;margin-right:1rem}\n[md~=\"mx2\"]{margin-left:2rem;margin-right:2rem}\n[md~=\"mx3\"]{margin-left:3rem;margin-right:3rem}\n[md~=\"mx4\"]{margin-left:4rem;margin-right:4rem}\n[md~=\"my0\"]{margin-top:0;margin-bottom:0}\n[md~=\"my1\"]{margin-top:1rem;margin-bottom:1rem}\n[md~=\"my2\"]{margin-top:2rem;margin-bottom:2rem}\n[md~=\"my3\"]{margin-top:3rem;margin-bottom:3rem}\n[md~=\"my4\"]{margin-top:4rem;margin-bottom:4rem}\n[md~=\"p0\"]{padding:0}\n[md~=\"p1\"]{padding:1rem}\n[md~=\"p2\"]{padding:2rem}\n[md~=\"p3\"]{padding:3rem}\n[md~=\"p4\"]{padding:4rem}\n[md~=\"pt0\"]{padding-top:0}\n[md~=\"pt1\"]{padding-top:1rem}\n[md~=\"pt2\"]{padding-top:2rem}\n[md~=\"pt3\"]{padding-top:3rem}\n[md~=\"pt4\"]{padding-top:4rem}\n[md~=\"pr0\"]{padding-right:0}\n[md~=\"pr1\"]{padding-right:1rem}\n[md~=\"pr2\"]{padding-right:2rem}\n[md~=\"pr3\"]{padding-right:3rem}\n[md~=\"pr4\"]{padding-right:4rem}\n[md~=\"pb0\"]{padding-bottom:0}\n[md~=\"pb1\"]{padding-bottom:1rem}\n[md~=\"pb2\"]{padding-bottom:2rem}\n[md~=\"pb3\"]{padding-bottom:3rem}\n[md~=\"pb4\"]{padding-bottom:4rem}\n[md~=\"pl0\"]{padding-left:0}\n[md~=\"pl1\"]{padding-left:1rem}\n[md~=\"pl2\"]{padding-left:2rem}\n[md~=\"pl3\"]{padding-left:3rem}\n[md~=\"pl4\"]{padding-left:4rem}\n[md~=\"px0\"]{padding-left:0;padding-right:0}\n[md~=\"px1\"]{padding-left:1rem;padding-right:1rem}\n[md~=\"px2\"]{padding-left:2rem;padding-right:2rem}\n[md~=\"px3\"]{padding-left:3rem;padding-right:3rem}\n[md~=\"px4\"]{padding-left:4rem;padding-right:4rem}\n[md~=\"py0\"]{padding-top:0;padding-bottom:0}\n[md~=\"py1\"]{padding-top:1rem;padding-bottom:1rem}\n[md~=\"py2\"]{padding-top:2rem;padding-bottom:2rem}\n[md~=\"py3\"]{padding-top:3rem;padding-bottom:3rem}\n[md~=\"py4\"]{padding-top:4rem;padding-bottom:4rem}\n[md~=\"op0\"]{opacity:0}\n[md~=\"op25\"]{opacity:0.25}\n[md~=\"op50\"]{opacity:0.5}\n[md~=\"op75\"]{opacity:0.75}\n[md~=\"op100\"]{opacity:1}\n[md~=\"bgsc\"]{background-size:cover}\n[md~=\"bgsct\"]{background-size:contain}\n[md~=\"bgpc\"]{background-position:center}\n[md~=\"bgpt\"]{background-position:top}\n[md~=\"bgpr\"]{background-position:right}\n[md~=\"bgpb\"]{background-position:bottom}\n[md~=\"bgpl\"]{background-position:left}\n[md~=\"bgrn\"]{background-repeat:no-repeat}\n[md~=\"bgrx\"]{background-repeat:repeat-x}\n[md~=\"bgry\"]{background-repeat:repeat-y}\n[md~=\"x\"]{display:flex}\n[md~=\"xac\"]{align-items:center}\n[md~=\"xab\"]{align-items:baseline}\n[md~=\"xas\"]{align-items:stretch}\n[md~=\"xafs\"]{align-items:flex-start}\n[md~=\"xafe\"]{align-items:flex-end}\n[md~=\"xdr\"]{flex-direction:row}\n[md~=\"xdrr\"]{flex-direction:row-reverse}\n[md~=\"xdc\"]{flex-direction:column}\n[md~=\"xdcr\"]{flex-direction:column-reverse}\n[md~=\"xjc\"]{justify-content:center}\n[md~=\"xjb\"]{justify-content:space-between}\n[md~=\"xja\"]{justify-content:space-around}\n[md~=\"xjs\"]{justify-content:flex-start}\n[md~=\"xje\"]{justify-content:flex-end}\n[md~=\"xw\"]{flex-wrap:wrap}\n[md~=\"xwr\"]{flex-wrap:wrap-reverse}\n[md~=\"xwn\"]{flex-wrap:nowrap}\n[md~=\"xi\"]{flex:initial}\n[md~=\"xx\"]{flex:1}\n[md~=\"xa\"]{flex:auto}\n[md~=\"xn\"]{flex:none}\n[md~=\"xo0\"]{order:0}\n[md~=\"xo1\"]{order:1}\n[md~=\"xo2\"]{order:2}\n[md~=\"xo3\"]{order:3}\n[md~=\"xo4\"]{order:4}\n[md~=\"xot\"]{order:-1}\n[md~=\"xob\"]{order:99}\n[md~=\"df\"]{display:flex}\n[md~=\"db\"]{display:block}\n[md~=\"dib\"]{display:inline-block}\n[md~=\"di\"]{display:inline}\n[md~=\"dt\"]{display:table}\n[md~=\"dtc\"]{display:table-cell}\n[md~=\"dtr\"]{display:table-row}\n[md~=\"dn\"]{display:none}\n[md~=\"fl\"]{float:left}\n[md~=\"fr\"]{float:right}\n[md~=\"fn\"]{float:none}\n[md~=\"cf\"]:after{content:\"\";display:block;clear:both}\n[md~=\"oh\"]{overflow:hidden}\n[md~=\"os\"]{overflow:scroll}\n[md~=\"ov\"]{overflow:visible}\n[md~=\"oxh\"]{overflow-x:hidden}\n[md~=\"oxs\"]{overflow-x:scroll}\n[md~=\"oxv\"]{overflow-x:visible}\n[md~=\"oyh\"]{overflow-y:hidden}\n[md~=\"oys\"]{overflow-y:scroll}\n[md~=\"oyv\"]{overflow-y:visible}\n[md~=\"psa\"]{position:absolute}\n[md~=\"psr\"]{position:relative}\n[md~=\"psf\"]{position:fixed}\n[md~=\"pss\"]{position:static}\n[md~=\"t0\"]{top:0}\n[md~=\"r0\"]{right:0}\n[md~=\"b0\"]{bottom:0}\n[md~=\"l0\"]{left:0}\n[md~=\"z0\"]{z-index:0}\n[md~=\"z1\"]{z-index:1}\n[md~=\"z2\"]{z-index:2}\n[md~=\"z3\"]{z-index:3}\n[md~=\"z4\"]{z-index:4}\n[md~=\"w0\"]{width:0}\n[md~=\"w100\"]{width:100%}\n[md~=\"h0\"]{height:0}\n[md~=\"h100\"]{height:100%}\n[md~=\"vw50\"]{width:50vw}\n[md~=\"vw100\"]{width:100vw}\n[md~=\"vwmn50\"]{min-width:50vw}\n[md~=\"vwmn100\"]{min-width:100vw}\n[md~=\"vwmx50\"]{max-width:50vw}\n[md~=\"vwmx100\"]{max-width:100vw}\n[md~=\"vh50\"]{height:50vh}\n[md~=\"vh100\"]{height:100vh}\n[md~=\"vhmn50\"]{min-height:50vh}\n[md~=\"vhmn100\"]{min-height:100vh}\n[md~=\"vhmx50\"]{max-height:50vh}\n[md~=\"vhmx100\"]{max-height:100vh}\n[md~=\"ar25\"]:before{padding-top:25%;content:\"\";display:block}\n[md~=\"ar50\"]:before{padding-top:50%;content:\"\";display:block}\n[md~=\"ar75\"]:before{padding-top:75%;content:\"\";display:block}\n[md~=\"ar100\"]:before{padding-top:100%;content:\"\";display:block}\n[md~=\"fs1\"]{font-size:1rem}\n[md~=\"fs1-2\"]{font-size:1.2rem}\n[md~=\"fs1-6\"]{font-size:1.6rem}\n[md~=\"fs2-4\"]{font-size:2.4rem}\n[md~=\"fs3-2\"]{font-size:3.2rem}\n[md~=\"fs6-4\"]{font-size:6.4rem}\n[md~=\"lh1\"]{line-height:1}\n[md~=\"lh1-5\"]{line-height:1.5}\n[md~=\"fsn\"]{font-style:normal}\n[md~=\"fsi\"]{font-style:italic}\n[md~=\"fwn\"]{font-weight:normal}\n[md~=\"fwb\"]{font-weight:bold}\n[md~=\"tal\"]{text-align:left}\n[md~=\"tac\"]{text-align:center}\n[md~=\"tar\"]{text-align:right}\n[md~=\"taj\"]{text-align:justify}\n[md~=\"toi\"]{text-overflow:initial}\n[md~=\"toc\"]{text-overflow:clip}\n[md~=\"toe\"]{text-overflow:ellipsis}\n[md~=\"tdu\"]{text-decoration:underline}\n[md~=\"tdo\"]{text-decoration:overline}\n[md~=\"tdlt\"]{text-decoration:line-through}\n[md~=\"tdn\"]{text-decoration:none}\n[md~=\"ttu\"]{text-transform:uppercase}\n[md~=\"ttl\"]{text-transform:lowercase}\n[md~=\"ttc\"]{text-transform:capitalize}\n[md~=\"ttn\"]{text-transform:none}\n[md~=\"vabl\"]{vertical-align:baseline}\n[md~=\"vat\"]{vertical-align:top}\n[md~=\"vam\"]{vertical-align:middle}\n[md~=\"vab\"]{vertical-align:bottom}\n[md~=\"wsn\"]{white-space:normal}\n[md~=\"wsnw\"]{white-space:nowrap}\n[md~=\"wsp\"]{white-space:pre}\n[md~=\"wsi\"]{white-space:inherit}\n[md~=\"tc1\"]{columns:1}\n[md~=\"tc2\"]{columns:2}\n[md~=\"tc3\"]{columns:3}\n[md~=\"tc4\"]{columns:4}\n[md~=\"curp\"]{cursor:pointer}\n[md~=\"curd\"]{cursor:default}\n[md~=\"cura\"]{cursor:alias}\n[md~=\"curzi\"]{cursor:zoom-in}\n[md~=\"curzo\"]{cursor:zoom-out}\n[md~=\"usn\"]{user-select:none}\n[md~=\"usa\"]{user-select:auto}\n[md~=\"ust\"]{user-select:text}\n[md~=\"pen\"]{pointer-events:none}\n[md~=\"pea\"]{pointer-events:auto}\n[md~=\"vh\"]{visibility:hidden}\n[md~=\"vv\"]{visibility:visible}\n[md~=\"dev\"]{outline:1px solid #912eff}\n[md~=\"dev\"] > * {outline:1px solid #5497ff}\n[md~=\"dev\"] > * > * {outline:1px solid #51feff}\n[md~=\"dev\"] > * > * > * {outline:1px solid #ff0000}\n[md~=\"dev\"] > * > * > * * {outline:1px solid #00ff00}\n}\n@media (min-width:1280px) {\n[lg~=\"c1\"]{width:8.33333%}\n[lg~=\"c2\"]{width:16.66667%}\n[lg~=\"c3\"]{width:25%}\n[lg~=\"c4\"]{width:33.33333%}\n[lg~=\"c5\"]{width:41.66667%}\n[lg~=\"c6\"]{width:50%}\n[lg~=\"c7\"]{width:58.33333%}\n[lg~=\"c8\"]{width:66.66667%}\n[lg~=\"c9\"]{width:75%}\n[lg~=\"c10\"]{width:83.33333%}\n[lg~=\"c11\"]{width:91.66667%}\n[lg~=\"c12\"]{width:100%}\n[lg~=\"s1\"]{width:100%}\n[lg~=\"s2\"]{width:50%}\n[lg~=\"s3\"]{width:33.33333%}\n[lg~=\"s4\"]{width:25%}\n[lg~=\"s5\"]{width:20%}\n[lg~=\"s6\"]{width:16.66667%}\n[lg~=\"s7\"]{width:14.28571%}\n[lg~=\"s8\"]{width:12.5%}\n[lg~=\"s9\"]{width:11.11111%}\n[lg~=\"s10\"]{width:10%}\n[lg~=\"s11\"]{width:9.09091%}\n[lg~=\"s12\"]{width:8.33333%}\n[lg~=\"co0\"]{margin-left:0}\n[lg~=\"co1\"]{margin-left:8.33333%}\n[lg~=\"co2\"]{margin-left:16.66667%}\n[lg~=\"co3\"]{margin-left:25%}\n[lg~=\"co4\"]{margin-left:33.33333%}\n[lg~=\"co5\"]{margin-left:41.66667%}\n[lg~=\"co6\"]{margin-left:50%}\n[lg~=\"co7\"]{margin-left:58.33333%}\n[lg~=\"co8\"]{margin-left:66.66667%}\n[lg~=\"co9\"]{margin-left:75%}\n[lg~=\"co10\"]{margin-left:83.33333%}\n[lg~=\"co11\"]{margin-left:91.66667%}\n[lg~=\"co12\"]{margin-left:100%}\n[lg~=\"m0\"]{margin:0}\n[lg~=\"m1\"]{margin:1rem}\n[lg~=\"m2\"]{margin:2rem}\n[lg~=\"m3\"]{margin:3rem}\n[lg~=\"m4\"]{margin:4rem}\n[lg~=\"mt0\"]{margin-top:0}\n[lg~=\"mt1\"]{margin-top:1rem}\n[lg~=\"mt2\"]{margin-top:2rem}\n[lg~=\"mt3\"]{margin-top:3rem}\n[lg~=\"mt4\"]{margin-top:4rem}\n[lg~=\"mr0\"]{margin-right:0}\n[lg~=\"mr1\"]{margin-right:1rem}\n[lg~=\"mr2\"]{margin-right:2rem}\n[lg~=\"mr3\"]{margin-right:3rem}\n[lg~=\"mr4\"]{margin-right:4rem}\n[lg~=\"mb0\"]{margin-bottom:0}\n[lg~=\"mb1\"]{margin-bottom:1rem}\n[lg~=\"mb2\"]{margin-bottom:2rem}\n[lg~=\"mb3\"]{margin-bottom:3rem}\n[lg~=\"mb4\"]{margin-bottom:4rem}\n[lg~=\"ml0\"]{margin-left:0}\n[lg~=\"ml1\"]{margin-left:1rem}\n[lg~=\"ml2\"]{margin-left:2rem}\n[lg~=\"ml3\"]{margin-left:3rem}\n[lg~=\"ml4\"]{margin-left:4rem}\n[lg~=\"mx0\"]{margin-left:0;margin-right:0}\n[lg~=\"mx1\"]{margin-left:1rem;margin-right:1rem}\n[lg~=\"mx2\"]{margin-left:2rem;margin-right:2rem}\n[lg~=\"mx3\"]{margin-left:3rem;margin-right:3rem}\n[lg~=\"mx4\"]{margin-left:4rem;margin-right:4rem}\n[lg~=\"my0\"]{margin-top:0;margin-bottom:0}\n[lg~=\"my1\"]{margin-top:1rem;margin-bottom:1rem}\n[lg~=\"my2\"]{margin-top:2rem;margin-bottom:2rem}\n[lg~=\"my3\"]{margin-top:3rem;margin-bottom:3rem}\n[lg~=\"my4\"]{margin-top:4rem;margin-bottom:4rem}\n[lg~=\"p0\"]{padding:0}\n[lg~=\"p1\"]{padding:1rem}\n[lg~=\"p2\"]{padding:2rem}\n[lg~=\"p3\"]{padding:3rem}\n[lg~=\"p4\"]{padding:4rem}\n[lg~=\"pt0\"]{padding-top:0}\n[lg~=\"pt1\"]{padding-top:1rem}\n[lg~=\"pt2\"]{padding-top:2rem}\n[lg~=\"pt3\"]{padding-top:3rem}\n[lg~=\"pt4\"]{padding-top:4rem}\n[lg~=\"pr0\"]{padding-right:0}\n[lg~=\"pr1\"]{padding-right:1rem}\n[lg~=\"pr2\"]{padding-right:2rem}\n[lg~=\"pr3\"]{padding-right:3rem}\n[lg~=\"pr4\"]{padding-right:4rem}\n[lg~=\"pb0\"]{padding-bottom:0}\n[lg~=\"pb1\"]{padding-bottom:1rem}\n[lg~=\"pb2\"]{padding-bottom:2rem}\n[lg~=\"pb3\"]{padding-bottom:3rem}\n[lg~=\"pb4\"]{padding-bottom:4rem}\n[lg~=\"pl0\"]{padding-left:0}\n[lg~=\"pl1\"]{padding-left:1rem}\n[lg~=\"pl2\"]{padding-left:2rem}\n[lg~=\"pl3\"]{padding-left:3rem}\n[lg~=\"pl4\"]{padding-left:4rem}\n[lg~=\"px0\"]{padding-left:0;padding-right:0}\n[lg~=\"px1\"]{padding-left:1rem;padding-right:1rem}\n[lg~=\"px2\"]{padding-left:2rem;padding-right:2rem}\n[lg~=\"px3\"]{padding-left:3rem;padding-right:3rem}\n[lg~=\"px4\"]{padding-left:4rem;padding-right:4rem}\n[lg~=\"py0\"]{padding-top:0;padding-bottom:0}\n[lg~=\"py1\"]{padding-top:1rem;padding-bottom:1rem}\n[lg~=\"py2\"]{padding-top:2rem;padding-bottom:2rem}\n[lg~=\"py3\"]{padding-top:3rem;padding-bottom:3rem}\n[lg~=\"py4\"]{padding-top:4rem;padding-bottom:4rem}\n[lg~=\"op0\"]{opacity:0}\n[lg~=\"op25\"]{opacity:0.25}\n[lg~=\"op50\"]{opacity:0.5}\n[lg~=\"op75\"]{opacity:0.75}\n[lg~=\"op100\"]{opacity:1}\n[lg~=\"bgsc\"]{background-size:cover}\n[lg~=\"bgsct\"]{background-size:contain}\n[lg~=\"bgpc\"]{background-position:center}\n[lg~=\"bgpt\"]{background-position:top}\n[lg~=\"bgpr\"]{background-position:right}\n[lg~=\"bgpb\"]{background-position:bottom}\n[lg~=\"bgpl\"]{background-position:left}\n[lg~=\"bgrn\"]{background-repeat:no-repeat}\n[lg~=\"bgrx\"]{background-repeat:repeat-x}\n[lg~=\"bgry\"]{background-repeat:repeat-y}\n[lg~=\"x\"]{display:flex}\n[lg~=\"xac\"]{align-items:center}\n[lg~=\"xab\"]{align-items:baseline}\n[lg~=\"xas\"]{align-items:stretch}\n[lg~=\"xafs\"]{align-items:flex-start}\n[lg~=\"xafe\"]{align-items:flex-end}\n[lg~=\"xdr\"]{flex-direction:row}\n[lg~=\"xdrr\"]{flex-direction:row-reverse}\n[lg~=\"xdc\"]{flex-direction:column}\n[lg~=\"xdcr\"]{flex-direction:column-reverse}\n[lg~=\"xjc\"]{justify-content:center}\n[lg~=\"xjb\"]{justify-content:space-between}\n[lg~=\"xja\"]{justify-content:space-around}\n[lg~=\"xjs\"]{justify-content:flex-start}\n[lg~=\"xje\"]{justify-content:flex-end}\n[lg~=\"xw\"]{flex-wrap:wrap}\n[lg~=\"xwr\"]{flex-wrap:wrap-reverse}\n[lg~=\"xwn\"]{flex-wrap:nowrap}\n[lg~=\"xi\"]{flex:initial}\n[lg~=\"xx\"]{flex:1}\n[lg~=\"xa\"]{flex:auto}\n[lg~=\"xn\"]{flex:none}\n[lg~=\"xo0\"]{order:0}\n[lg~=\"xo1\"]{order:1}\n[lg~=\"xo2\"]{order:2}\n[lg~=\"xo3\"]{order:3}\n[lg~=\"xo4\"]{order:4}\n[lg~=\"xot\"]{order:-1}\n[lg~=\"xob\"]{order:99}\n[lg~=\"df\"]{display:flex}\n[lg~=\"db\"]{display:block}\n[lg~=\"dib\"]{display:inline-block}\n[lg~=\"di\"]{display:inline}\n[lg~=\"dt\"]{display:table}\n[lg~=\"dtc\"]{display:table-cell}\n[lg~=\"dtr\"]{display:table-row}\n[lg~=\"dn\"]{display:none}\n[lg~=\"fl\"]{float:left}\n[lg~=\"fr\"]{float:right}\n[lg~=\"fn\"]{float:none}\n[lg~=\"cf\"]:after{content:\"\";display:block;clear:both}\n[lg~=\"oh\"]{overflow:hidden}\n[lg~=\"os\"]{overflow:scroll}\n[lg~=\"ov\"]{overflow:visible}\n[lg~=\"oxh\"]{overflow-x:hidden}\n[lg~=\"oxs\"]{overflow-x:scroll}\n[lg~=\"oxv\"]{overflow-x:visible}\n[lg~=\"oyh\"]{overflow-y:hidden}\n[lg~=\"oys\"]{overflow-y:scroll}\n[lg~=\"oyv\"]{overflow-y:visible}\n[lg~=\"psa\"]{position:absolute}\n[lg~=\"psr\"]{position:relative}\n[lg~=\"psf\"]{position:fixed}\n[lg~=\"pss\"]{position:static}\n[lg~=\"t0\"]{top:0}\n[lg~=\"r0\"]{right:0}\n[lg~=\"b0\"]{bottom:0}\n[lg~=\"l0\"]{left:0}\n[lg~=\"z0\"]{z-index:0}\n[lg~=\"z1\"]{z-index:1}\n[lg~=\"z2\"]{z-index:2}\n[lg~=\"z3\"]{z-index:3}\n[lg~=\"z4\"]{z-index:4}\n[lg~=\"w0\"]{width:0}\n[lg~=\"w100\"]{width:100%}\n[lg~=\"h0\"]{height:0}\n[lg~=\"h100\"]{height:100%}\n[lg~=\"vw50\"]{width:50vw}\n[lg~=\"vw100\"]{width:100vw}\n[lg~=\"vwmn50\"]{min-width:50vw}\n[lg~=\"vwmn100\"]{min-width:100vw}\n[lg~=\"vwmx50\"]{max-width:50vw}\n[lg~=\"vwmx100\"]{max-width:100vw}\n[lg~=\"vh50\"]{height:50vh}\n[lg~=\"vh100\"]{height:100vh}\n[lg~=\"vhmn50\"]{min-height:50vh}\n[lg~=\"vhmn100\"]{min-height:100vh}\n[lg~=\"vhmx50\"]{max-height:50vh}\n[lg~=\"vhmx100\"]{max-height:100vh}\n[lg~=\"ar25\"]:before{padding-top:25%;content:\"\";display:block}\n[lg~=\"ar50\"]:before{padding-top:50%;content:\"\";display:block}\n[lg~=\"ar75\"]:before{padding-top:75%;content:\"\";display:block}\n[lg~=\"ar100\"]:before{padding-top:100%;content:\"\";display:block}\n[lg~=\"fs1\"]{font-size:1rem}\n[lg~=\"fs1-2\"]{font-size:1.2rem}\n[lg~=\"fs1-6\"]{font-size:1.6rem}\n[lg~=\"fs2-4\"]{font-size:2.4rem}\n[lg~=\"fs3-2\"]{font-size:3.2rem}\n[lg~=\"fs6-4\"]{font-size:6.4rem}\n[lg~=\"lh1\"]{line-height:1}\n[lg~=\"lh1-5\"]{line-height:1.5}\n[lg~=\"fsn\"]{font-style:normal}\n[lg~=\"fsi\"]{font-style:italic}\n[lg~=\"fwn\"]{font-weight:normal}\n[lg~=\"fwb\"]{font-weight:bold}\n[lg~=\"tal\"]{text-align:left}\n[lg~=\"tac\"]{text-align:center}\n[lg~=\"tar\"]{text-align:right}\n[lg~=\"taj\"]{text-align:justify}\n[lg~=\"toi\"]{text-overflow:initial}\n[lg~=\"toc\"]{text-overflow:clip}\n[lg~=\"toe\"]{text-overflow:ellipsis}\n[lg~=\"tdu\"]{text-decoration:underline}\n[lg~=\"tdo\"]{text-decoration:overline}\n[lg~=\"tdlt\"]{text-decoration:line-through}\n[lg~=\"tdn\"]{text-decoration:none}\n[lg~=\"ttu\"]{text-transform:uppercase}\n[lg~=\"ttl\"]{text-transform:lowercase}\n[lg~=\"ttc\"]{text-transform:capitalize}\n[lg~=\"ttn\"]{text-transform:none}\n[lg~=\"vabl\"]{vertical-align:baseline}\n[lg~=\"vat\"]{vertical-align:top}\n[lg~=\"vam\"]{vertical-align:middle}\n[lg~=\"vab\"]{vertical-align:bottom}\n[lg~=\"wsn\"]{white-space:normal}\n[lg~=\"wsnw\"]{white-space:nowrap}\n[lg~=\"wsp\"]{white-space:pre}\n[lg~=\"wsi\"]{white-space:inherit}\n[lg~=\"tc1\"]{columns:1}\n[lg~=\"tc2\"]{columns:2}\n[lg~=\"tc3\"]{columns:3}\n[lg~=\"tc4\"]{columns:4}\n[lg~=\"curp\"]{cursor:pointer}\n[lg~=\"curd\"]{cursor:default}\n[lg~=\"cura\"]{cursor:alias}\n[lg~=\"curzi\"]{cursor:zoom-in}\n[lg~=\"curzo\"]{cursor:zoom-out}\n[lg~=\"usn\"]{user-select:none}\n[lg~=\"usa\"]{user-select:auto}\n[lg~=\"ust\"]{user-select:text}\n[lg~=\"pen\"]{pointer-events:none}\n[lg~=\"pea\"]{pointer-events:auto}\n[lg~=\"vh\"]{visibility:hidden}\n[lg~=\"vv\"]{visibility:visible}\n[lg~=\"dev\"]{outline:1px solid #912eff}\n[lg~=\"dev\"] > * {outline:1px solid #5497ff}\n[lg~=\"dev\"] > * > * {outline:1px solid #51feff}\n[lg~=\"dev\"] > * > * > * {outline:1px solid #ff0000}\n[lg~=\"dev\"] > * > * > * * {outline:1px solid #00ff00}\n}") || true) && "_7ed94539")

;((require('sheetify/insert')("html {\n    font-size: 62.5%;\n  }\n\n  body {\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    font-family: Arial, Helvetica, sans-serif;\n  }\n\n  h1, h2, h3, h4, h5, h6, h7 {\n    font-size: inherit;\n    font-weight: inherit;\n    font-style: inherit;\n  }\n\n  button, input {\n    outline: none;\n  }\n\n  ul, ol, li { \n    list-style: none;\n  }\n\n  a {\n    color: inherit;\n    text-decoration: inherit;\n  }\n\n  img, video {\n    width: 100%;\n    height: auto;\n  }\n\n  .bb1-white {\n    border-bottom: 1px solid white;\n  }\n\n  /*.rows > * {\n    border-top: 1px dashed black;\n  }\n\n  .rows > *:last-child {\n    border-bottom: 1px dashed black;\n  }*/\n\n  a:hover {\n    display: inline-block;\n    transform: rotateY(180deg);\n  }\n\n  .external {\n    position: relative;\n  }\n  .external:after {\n    content: ' ➚';\n    display: block;\n    position: absolute;\n    right: -1em;\n    top: 0;\n    pointer-events: none;\n  }") || true) && "_b8fc7a0a")

var app = choo()

function mainview () {
  return html`
    <body class="x xjc xac xdc vhmn100 p1 fs2-4 tac rows psr" sm="fs3-2">
      <h1 class="p1 s1">
        monoequipment
      </h1>
      <p class="p1 s1">
        opinionated <a href="https://github.com/choojs/nanocomponent" target="_blank">nanocomponents</a> for websites
      </p>
      <ul class="p1 s1">
        <li><a class="external" target="_blank" href="https://github.com/jongacnik/monolazy">monolazy</a></li>
        <li><a class="external" target="_blank" href="https://github.com/jongacnik/monoimage">monoimage</a></li>
        <li><a class="external" target="_blank" href="https://github.com/jongacnik/monocontextual">monocontextual</a></li>
      </ul>
      <p class="p1 s1">
        more soon
      </p>
    </body>
  `
}

app.route('/', mainview)

app.mount('body')
},{"choo":11,"choo/html":10,"sheetify/insert":31}],7:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],8:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":7,"hyperx":14}],9:[function(require,module,exports){
var assert = require('assert')
var LRU = require('nanolru')

module.exports = ChooComponentCache

function ChooComponentCache (state, emit, lru) {
  assert.ok(this instanceof ChooComponentCache, 'ChooComponentCache should be created with `new`')

  assert.equal(typeof state, 'object', 'ChooComponentCache: state should be type object')
  assert.equal(typeof emit, 'function', 'ChooComponentCache: emit should be type function')

  if (typeof lru === 'number') this.cache = new LRU(lru)
  else this.cache = lru || new LRU(100)
  this.state = state
  this.emit = emit
}

// Get & create component instances.
ChooComponentCache.prototype.render = function (Component, id) {
  assert.equal(typeof Component, 'function', 'ChooComponentCache.render: Component should be type function')
  assert.ok(typeof id === 'string' || typeof id === 'number', 'ChooComponentCache.render: id should be type string or type number')

  var el = this.cache.get(id)
  if (!el) {
    var args = []
    for (var i = 2, len = arguments.length; i < len; i++) {
      args.push(arguments[i])
    }
    args.unshift(Component, id, this.state, this.emit)
    el = newCall.apply(newCall, args)
    this.cache.set(id, el)
  }

  return el
}

// Because you can't call `new` and `.apply()` at the same time. This is a mad
// hack, but hey it works so we gonna go for it. Whoop.
function newCall (Cls) {
  return new (Cls.bind.apply(Cls, arguments)) // eslint-disable-line
}

},{"assert":1,"nanolru":20}],10:[function(require,module,exports){
module.exports = require('bel')

},{"bel":8}],11:[function(require,module,exports){
var scrollToAnchor = require('scroll-to-anchor')
var documentReady = require('document-ready')
var nanolocation = require('nanolocation')
var nanotiming = require('nanotiming')
var nanorouter = require('nanorouter')
var nanomorph = require('nanomorph')
var nanoquery = require('nanoquery')
var nanohref = require('nanohref')
var nanoraf = require('nanoraf')
var nanobus = require('nanobus')
var assert = require('assert')
var xtend = require('xtend')

var Cache = require('./component/cache')

module.exports = Choo

var HISTORY_OBJECT = {}

function Choo (opts) {
  if (!(this instanceof Choo)) return new Choo(opts)
  opts = opts || {}

  assert.equal(typeof opts, 'object', 'choo: opts should be type object')

  var self = this

  // define events used by choo
  this._events = {
    DOMCONTENTLOADED: 'DOMContentLoaded',
    DOMTITLECHANGE: 'DOMTitleChange',
    REPLACESTATE: 'replaceState',
    PUSHSTATE: 'pushState',
    NAVIGATE: 'navigate',
    POPSTATE: 'popState',
    RENDER: 'render'
  }

  // properties for internal use only
  this._historyEnabled = opts.history === undefined ? true : opts.history
  this._hrefEnabled = opts.href === undefined ? true : opts.href
  this._hasWindow = typeof window !== 'undefined'
  this._createLocation = nanolocation
  this._cache = opts.cache
  this._loaded = false
  this._stores = []
  this._tree = null

  // state
  var _state = {
    events: this._events,
    components: {}
  }
  if (this._hasWindow) {
    this.state = window.initialState
      ? xtend(window.initialState, _state)
      : _state
    delete window.initialState
  } else {
    this.state = _state
  }

  // properties that are part of the API
  this.router = nanorouter({ curry: true })
  this.emitter = nanobus('choo.emit')
  this.emit = this.emitter.emit.bind(this.emitter)

  // listen for title changes; available even when calling .toString()
  if (this._hasWindow) this.state.title = document.title
  this.emitter.prependListener(this._events.DOMTITLECHANGE, function (title) {
    assert.equal(typeof title, 'string', 'events.DOMTitleChange: title should be type string')
    self.state.title = title
    if (self._hasWindow) document.title = title
  })
}

Choo.prototype.route = function (route, handler) {
  assert.equal(typeof route, 'string', 'choo.route: route should be type string')
  assert.equal(typeof handler, 'function', 'choo.handler: route should be type function')
  this.router.on(route, handler)
}

Choo.prototype.use = function (cb) {
  assert.equal(typeof cb, 'function', 'choo.use: cb should be type function')
  var self = this
  this._stores.push(function (state) {
    var msg = 'choo.use'
    msg = cb.storeName ? msg + '(' + cb.storeName + ')' : msg
    var endTiming = nanotiming(msg)
    cb(state, self.emitter, self)
    endTiming()
  })
}

Choo.prototype.start = function () {
  assert.equal(typeof window, 'object', 'choo.start: window was not found. .start() must be called in a browser, use .toString() if running in Node')

  var self = this
  if (this._historyEnabled) {
    this.emitter.prependListener(this._events.NAVIGATE, function () {
      self._matchRoute()
      if (self._loaded) {
        self.emitter.emit(self._events.RENDER)
        setTimeout(scrollToAnchor.bind(null, window.location.hash), 0)
      }
    })

    this.emitter.prependListener(this._events.POPSTATE, function () {
      self.emitter.emit(self._events.NAVIGATE)
    })

    this.emitter.prependListener(this._events.PUSHSTATE, function (href) {
      assert.equal(typeof href, 'string', 'events.pushState: href should be type string')
      window.history.pushState(HISTORY_OBJECT, null, href)
      self.emitter.emit(self._events.NAVIGATE)
    })

    this.emitter.prependListener(this._events.REPLACESTATE, function (href) {
      assert.equal(typeof href, 'string', 'events.replaceState: href should be type string')
      window.history.replaceState(HISTORY_OBJECT, null, href)
      self.emitter.emit(self._events.NAVIGATE)
    })

    window.onpopstate = function () {
      self.emitter.emit(self._events.POPSTATE)
    }

    if (self._hrefEnabled) {
      nanohref(function (location) {
        var href = location.href
        var currHref = window.location.href
        if (href === currHref) return
        self.emitter.emit(self._events.PUSHSTATE, href)
      })
    }
  }

  this._setCache(this.state)
  this._stores.forEach(function (initStore) {
    initStore(self.state)
  })

  this._matchRoute()
  this._tree = this._prerender(this.state)
  assert.ok(this._tree, 'choo.start: no valid DOM node returned for location ' + this.state.href)

  this.emitter.prependListener(self._events.RENDER, nanoraf(function () {
    var renderTiming = nanotiming('choo.render')
    var newTree = self._prerender(self.state)
    assert.ok(newTree, 'choo.render: no valid DOM node returned for location ' + self.state.href)

    assert.equal(self._tree.nodeName, newTree.nodeName, 'choo.render: The target node <' +
      self._tree.nodeName.toLowerCase() + '> is not the same type as the new node <' +
      newTree.nodeName.toLowerCase() + '>.')

    var morphTiming = nanotiming('choo.morph')
    nanomorph(self._tree, newTree)
    morphTiming()

    renderTiming()
  }))

  documentReady(function () {
    self.emitter.emit(self._events.DOMCONTENTLOADED)
    self._loaded = true
  })

  return this._tree
}

Choo.prototype.mount = function mount (selector) {
  if (typeof window !== 'object') {
    assert.ok(typeof selector === 'string', 'choo.mount: selector should be type String')
    this.selector = selector
    return this
  }

  assert.ok(typeof selector === 'string' || typeof selector === 'object', 'choo.mount: selector should be type String or HTMLElement')

  var self = this

  documentReady(function () {
    var renderTiming = nanotiming('choo.render')
    var newTree = self.start()
    if (typeof selector === 'string') {
      self._tree = document.querySelector(selector)
    } else {
      self._tree = selector
    }

    assert.ok(self._tree, 'choo.mount: could not query selector: ' + selector)
    assert.equal(self._tree.nodeName, newTree.nodeName, 'choo.mount: The target node <' +
      self._tree.nodeName.toLowerCase() + '> is not the same type as the new node <' +
      newTree.nodeName.toLowerCase() + '>.')

    var morphTiming = nanotiming('choo.morph')
    nanomorph(self._tree, newTree)
    morphTiming()

    renderTiming()
  })
}

Choo.prototype.toString = function (location, state) {
  this.state = xtend(this.state, state || {})

  assert.notEqual(typeof window, 'object', 'choo.mount: window was found. .toString() must be called in Node, use .start() or .mount() if running in the browser')
  assert.equal(typeof location, 'string', 'choo.toString: location should be type string')
  assert.equal(typeof this.state, 'object', 'choo.toString: state should be type object')

  var self = this
  this._setCache(this.state)
  this._stores.forEach(function (initStore) {
    initStore(self.state)
  })

  this._matchRoute(location)
  var html = this._prerender(this.state)
  assert.ok(html, 'choo.toString: no valid value returned for the route ' + location)
  assert(!Array.isArray(html), 'choo.toString: return value was an array for the route ' + location)
  return typeof html.outerHTML === 'string' ? html.outerHTML : html.toString()
}

Choo.prototype._matchRoute = function (locationOverride) {
  var location, queryString
  if (locationOverride) {
    location = locationOverride.replace(/\?.+$/, '')
    queryString = locationOverride
  } else {
    location = this._createLocation()
    queryString = window.location.search
  }
  var matched = this.router.match(location)
  this._handler = matched.cb
  this.state.href = location
  this.state.query = nanoquery(queryString)
  this.state.route = matched.route
  this.state.params = matched.params
  return this.state
}

Choo.prototype._prerender = function (state) {
  var routeTiming = nanotiming("choo.prerender('" + state.route + "')")
  var res = this._handler(state, this.emit)
  routeTiming()
  return res
}

Choo.prototype._setCache = function (state) {
  var cache = new Cache(state, this.emitter.emit.bind(this.emitter), this._cache)
  state.cache = renderComponent

  function renderComponent (Component, id) {
    assert.equal(typeof Component, 'function', 'choo.state.cache: Component should be type function')
    var args = []
    for (var i = 0, len = arguments.length; i < len; i++) {
      args.push(arguments[i])
    }
    return cache.render.apply(cache, args)
  }

  // When the state gets stringified, make sure `state.cache` isn't
  // stringified too.
  renderComponent.toJSON = function () {
    return null
  }
}

},{"./component/cache":9,"assert":1,"document-ready":12,"nanobus":17,"nanohref":18,"nanolocation":19,"nanomorph":21,"nanoquery":24,"nanoraf":25,"nanorouter":26,"nanotiming":28,"scroll-to-anchor":30,"xtend":34}],12:[function(require,module,exports){
'use strict'

var assert = require('assert')

module.exports = ready

function ready (callback) {
  assert.notEqual(typeof document, 'undefined', 'document-ready only runs in the browser')
  var state = document.readyState
  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0)
  }

  document.addEventListener('DOMContentLoaded', function onLoad () {
    callback()
  })
}

},{"assert":1}],13:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],14:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":13}],15:[function(require,module,exports){
var containers = []; // will store container HTMLElement references
var styleElements = []; // will store {prepend: HTMLElement, append: HTMLElement}

var usage = 'insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).';

function insertCss(css, options) {
    options = options || {};

    if (css === undefined) {
        throw new Error(usage);
    }

    var position = options.prepend === true ? 'prepend' : 'append';
    var container = options.container !== undefined ? options.container : document.querySelector('head');
    var containerId = containers.indexOf(container);

    // first time we see this container, create the necessary entries
    if (containerId === -1) {
        containerId = containers.push(container) - 1;
        styleElements[containerId] = {};
    }

    // try to get the correponding container + position styleElement, create it otherwise
    var styleElement;

    if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
        styleElement = styleElements[containerId][position];
    } else {
        styleElement = styleElements[containerId][position] = createStyleElement();

        if (position === 'prepend') {
            container.insertBefore(styleElement, container.childNodes[0]);
        } else {
            container.appendChild(styleElement);
        }
    }

    // strip potential UTF-8 BOM if css was read from a file
    if (css.charCodeAt(0) === 0xFEFF) { css = css.substr(1, css.length); }

    // actually add the stylesheet
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText += css
    } else {
        styleElement.textContent += css;
    }

    return styleElement;
};

function createStyleElement() {
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    return styleElement;
}

module.exports = insertCss;
module.exports.insertCss = insertCss;

},{}],16:[function(require,module,exports){
assert.notEqual = notEqual
assert.notOk = notOk
assert.equal = equal
assert.ok = assert

module.exports = assert

function equal (a, b, m) {
  assert(a == b, m) // eslint-disable-line eqeqeq
}

function notEqual (a, b, m) {
  assert(a != b, m) // eslint-disable-line eqeqeq
}

function notOk (t, m) {
  assert(!t, m)
}

function assert (t, m) {
  if (!t) throw new Error(m || 'AssertionError')
}

},{}],17:[function(require,module,exports){
var splice = require('remove-array-items')
var nanotiming = require('nanotiming')
var assert = require('assert')

module.exports = Nanobus

function Nanobus (name) {
  if (!(this instanceof Nanobus)) return new Nanobus(name)

  this._name = name || 'nanobus'
  this._starListeners = []
  this._listeners = {}
}

Nanobus.prototype.emit = function (eventName) {
  assert.equal(typeof eventName, 'string', 'nanobus.emit: eventName should be type string')

  var data = []
  for (var i = 1, len = arguments.length; i < len; i++) {
    data.push(arguments[i])
  }

  var emitTiming = nanotiming(this._name + "('" + eventName + "')")
  var listeners = this._listeners[eventName]
  if (listeners && listeners.length > 0) {
    this._emit(this._listeners[eventName], data)
  }

  if (this._starListeners.length > 0) {
    this._emit(this._starListeners, eventName, data, emitTiming.uuid)
  }
  emitTiming()

  return this
}

Nanobus.prototype.on = Nanobus.prototype.addListener = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.on: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.on: listener should be type function')

  if (eventName === '*') {
    this._starListeners.push(listener)
  } else {
    if (!this._listeners[eventName]) this._listeners[eventName] = []
    this._listeners[eventName].push(listener)
  }
  return this
}

Nanobus.prototype.prependListener = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.prependListener: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.prependListener: listener should be type function')

  if (eventName === '*') {
    this._starListeners.unshift(listener)
  } else {
    if (!this._listeners[eventName]) this._listeners[eventName] = []
    this._listeners[eventName].unshift(listener)
  }
  return this
}

Nanobus.prototype.once = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.once: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.once: listener should be type function')

  var self = this
  this.on(eventName, once)
  function once () {
    listener.apply(self, arguments)
    self.removeListener(eventName, once)
  }
  return this
}

Nanobus.prototype.prependOnceListener = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.prependOnceListener: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.prependOnceListener: listener should be type function')

  var self = this
  this.prependListener(eventName, once)
  function once () {
    listener.apply(self, arguments)
    self.removeListener(eventName, once)
  }
  return this
}

Nanobus.prototype.removeListener = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.removeListener: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.removeListener: listener should be type function')

  if (eventName === '*') {
    this._starListeners = this._starListeners.slice()
    return remove(this._starListeners, listener)
  } else {
    if (typeof this._listeners[eventName] !== 'undefined') {
      this._listeners[eventName] = this._listeners[eventName].slice()
    }

    return remove(this._listeners[eventName], listener)
  }

  function remove (arr, listener) {
    if (!arr) return
    var index = arr.indexOf(listener)
    if (index !== -1) {
      splice(arr, index, 1)
      return true
    }
  }
}

Nanobus.prototype.removeAllListeners = function (eventName) {
  if (eventName) {
    if (eventName === '*') {
      this._starListeners = []
    } else {
      this._listeners[eventName] = []
    }
  } else {
    this._starListeners = []
    this._listeners = {}
  }
  return this
}

Nanobus.prototype.listeners = function (eventName) {
  var listeners = eventName !== '*'
    ? this._listeners[eventName]
    : this._starListeners

  var ret = []
  if (listeners) {
    var ilength = listeners.length
    for (var i = 0; i < ilength; i++) ret.push(listeners[i])
  }
  return ret
}

Nanobus.prototype._emit = function (arr, eventName, data, uuid) {
  if (typeof arr === 'undefined') return
  if (arr.length === 0) return
  if (data === undefined) {
    data = eventName
    eventName = null
  }

  if (eventName) {
    if (uuid !== undefined) {
      data = [eventName].concat(data, uuid)
    } else {
      data = [eventName].concat(data)
    }
  }

  var length = arr.length
  for (var i = 0; i < length; i++) {
    var listener = arr[i]
    listener.apply(listener, data)
  }
}

},{"assert":1,"nanotiming":28,"remove-array-items":29}],18:[function(require,module,exports){
var assert = require('assert')

var safeExternalLink = /(noopener|noreferrer) (noopener|noreferrer)/
var protocolLink = /^[\w-_]+:/

module.exports = href

function href (cb, root) {
  assert.notEqual(typeof window, 'undefined', 'nanohref: expected window to exist')

  root = root || window.document

  assert.equal(typeof cb, 'function', 'nanohref: cb should be type function')
  assert.equal(typeof root, 'object', 'nanohref: root should be type object')

  window.addEventListener('click', function (e) {
    if ((e.button && e.button !== 0) ||
      e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ||
      e.defaultPrevented) return

    var anchor = (function traverse (node) {
      if (!node || node === root) return
      if (node.localName !== 'a' || node.href === undefined) {
        return traverse(node.parentNode)
      }
      return node
    })(e.target)

    if (!anchor) return

    if (window.location.origin !== anchor.origin ||
      anchor.hasAttribute('download') ||
      (anchor.getAttribute('target') === '_blank' &&
        safeExternalLink.test(anchor.getAttribute('rel'))) ||
      protocolLink.test(anchor.getAttribute('href'))) return

    e.preventDefault()
    cb(anchor)
  })
}

},{"assert":1}],19:[function(require,module,exports){
var assert = require('assert')

module.exports = nanolocation

function nanolocation () {
  assert.notEqual(typeof window, 'undefined', 'nanolocation: expected window to exist')
  var pathname = window.location.pathname.replace(/\/$/, '')
  var hash = window.location.hash.replace(/^#/, '/')
  return pathname + hash
}

},{"assert":16}],20:[function(require,module,exports){
module.exports = LRU

function LRU (opts) {
  if (!(this instanceof LRU)) return new LRU(opts)
  if (typeof opts === 'number') opts = {max: opts}
  if (!opts) opts = {}
  this.cache = {}
  this.head = this.tail = null
  this.length = 0
  this.max = opts.max || 1000
  this.maxAge = opts.maxAge || 0
}

Object.defineProperty(LRU.prototype, 'keys', {
  get: function () { return Object.keys(this.cache) }
})

LRU.prototype.clear = function () {
  this.cache = {}
  this.head = this.tail = null
  this.length = 0
}

LRU.prototype.remove = function (key) {
  if (typeof key !== 'string') key = '' + key
  if (!this.cache.hasOwnProperty(key)) return

  var element = this.cache[key]
  delete this.cache[key]
  this._unlink(key, element.prev, element.next)
  return element.value
}

LRU.prototype._unlink = function (key, prev, next) {
  this.length--

  if (this.length === 0) {
    this.head = this.tail = null
  } else {
    if (this.head === key) {
      this.head = prev
      this.cache[this.head].next = null
    } else if (this.tail === key) {
      this.tail = next
      this.cache[this.tail].prev = null
    } else {
      this.cache[prev].next = next
      this.cache[next].prev = prev
    }
  }
}

LRU.prototype.peek = function (key) {
  if (!this.cache.hasOwnProperty(key)) return

  var element = this.cache[key]

  if (!this._checkAge(key, element)) return
  return element.value
}

LRU.prototype.set = function (key, value) {
  if (typeof key !== 'string') key = '' + key

  var element

  if (this.cache.hasOwnProperty(key)) {
    element = this.cache[key]
    element.value = value
    if (this.maxAge) element.modified = Date.now()

    // If it's already the head, there's nothing more to do:
    if (key === this.head) return value
    this._unlink(key, element.prev, element.next)
  } else {
    element = {value: value, modified: 0, next: null, prev: null}
    if (this.maxAge) element.modified = Date.now()
    this.cache[key] = element

    // Eviction is only possible if the key didn't already exist:
    if (this.length === this.max) this.evict()
  }

  this.length++
  element.next = null
  element.prev = this.head

  if (this.head) this.cache[this.head].next = key
  this.head = key

  if (!this.tail) this.tail = key
  return value
}

LRU.prototype._checkAge = function (key, element) {
  if (this.maxAge && (Date.now() - element.modified) > this.maxAge) {
    this.remove(key)
    return false
  }
  return true
}

LRU.prototype.get = function (key) {
  if (typeof key !== 'string') key = '' + key
  if (!this.cache.hasOwnProperty(key)) return

  var element = this.cache[key]

  if (!this._checkAge(key, element)) return

  if (this.head !== key) {
    if (key === this.tail) {
      this.tail = element.next
      this.cache[this.tail].prev = null
    } else {
      // Set prev.next -> element.next:
      this.cache[element.prev].next = element.next
    }

    // Set element.next.prev -> element.prev:
    this.cache[element.next].prev = element.prev

    // Element is the new head
    this.cache[this.head].next = key
    element.prev = this.head
    element.next = null
    this.head = key
  }

  return element.value
}

LRU.prototype.evict = function () {
  if (!this.tail) return
  this.remove(this.tail)
}

},{}],21:[function(require,module,exports){
var assert = require('assert')
var morph = require('./lib/morph')

var TEXT_NODE = 3
// var DEBUG = false

module.exports = nanomorph

// Morph one tree into another tree
//
// no parent
//   -> same: diff and walk children
//   -> not same: replace and return
// old node doesn't exist
//   -> insert new node
// new node doesn't exist
//   -> delete old node
// nodes are not the same
//   -> diff nodes and apply patch to old node
// nodes are the same
//   -> walk all child nodes and append to old node
function nanomorph (oldTree, newTree) {
  // if (DEBUG) {
  //   console.log(
  //   'nanomorph\nold\n  %s\nnew\n  %s',
  //   oldTree && oldTree.outerHTML,
  //   newTree && newTree.outerHTML
  // )
  // }
  assert.equal(typeof oldTree, 'object', 'nanomorph: oldTree should be an object')
  assert.equal(typeof newTree, 'object', 'nanomorph: newTree should be an object')
  var tree = walk(newTree, oldTree)
  // if (DEBUG) console.log('=> morphed\n  %s', tree.outerHTML)
  return tree
}

// Walk and morph a dom tree
function walk (newNode, oldNode) {
  // if (DEBUG) {
  //   console.log(
  //   'walk\nold\n  %s\nnew\n  %s',
  //   oldNode && oldNode.outerHTML,
  //   newNode && newNode.outerHTML
  // )
  // }
  if (!oldNode) {
    return newNode
  } else if (!newNode) {
    return null
  } else if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
    return oldNode
  } else if (newNode.tagName !== oldNode.tagName) {
    return newNode
  } else {
    morph(newNode, oldNode)
    updateChildren(newNode, oldNode)
    return oldNode
  }
}

// Update the children of elements
// (obj, obj) -> null
function updateChildren (newNode, oldNode) {
  // if (DEBUG) {
  //   console.log(
  //   'updateChildren\nold\n  %s\nnew\n  %s',
  //   oldNode && oldNode.outerHTML,
  //   newNode && newNode.outerHTML
  // )
  // }
  var oldChild, newChild, morphed, oldMatch

  // The offset is only ever increased, and used for [i - offset] in the loop
  var offset = 0

  for (var i = 0; ; i++) {
    oldChild = oldNode.childNodes[i]
    newChild = newNode.childNodes[i - offset]
    // if (DEBUG) {
    //   console.log(
    //   '===\n- old\n  %s\n- new\n  %s',
    //   oldChild && oldChild.outerHTML,
    //   newChild && newChild.outerHTML
    // )
    // }
    // Both nodes are empty, do nothing
    if (!oldChild && !newChild) {
      break

    // There is no new child, remove old
    } else if (!newChild) {
      oldNode.removeChild(oldChild)
      i--

    // There is no old child, add new
    } else if (!oldChild) {
      oldNode.appendChild(newChild)
      offset++

    // Both nodes are the same, morph
    } else if (same(newChild, oldChild)) {
      morphed = walk(newChild, oldChild)
      if (morphed !== oldChild) {
        oldNode.replaceChild(morphed, oldChild)
        offset++
      }

    // Both nodes do not share an ID or a placeholder, try reorder
    } else {
      oldMatch = null

      // Try and find a similar node somewhere in the tree
      for (var j = i; j < oldNode.childNodes.length; j++) {
        if (same(oldNode.childNodes[j], newChild)) {
          oldMatch = oldNode.childNodes[j]
          break
        }
      }

      // If there was a node with the same ID or placeholder in the old list
      if (oldMatch) {
        morphed = walk(newChild, oldMatch)
        if (morphed !== oldMatch) offset++
        oldNode.insertBefore(morphed, oldChild)

      // It's safe to morph two nodes in-place if neither has an ID
      } else if (!newChild.id && !oldChild.id) {
        morphed = walk(newChild, oldChild)
        if (morphed !== oldChild) {
          oldNode.replaceChild(morphed, oldChild)
          offset++
        }

      // Insert the node at the index if we couldn't morph or find a matching node
      } else {
        oldNode.insertBefore(newChild, oldChild)
        offset++
      }
    }
  }
}

function same (a, b) {
  if (a.id) return a.id === b.id
  if (a.isSameNode) return a.isSameNode(b)
  if (a.tagName !== b.tagName) return false
  if (a.type === TEXT_NODE) return a.nodeValue === b.nodeValue
  return false
}

},{"./lib/morph":23,"assert":16}],22:[function(require,module,exports){
module.exports = [
  // attribute events (can be set with attributes)
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'onmouseenter',
  'onmouseleave',
  'ontouchcancel',
  'ontouchend',
  'ontouchmove',
  'ontouchstart',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  // other common events
  'oncontextmenu',
  'onfocusin',
  'onfocusout'
]

},{}],23:[function(require,module,exports){
var events = require('./events')
var eventsLength = events.length

var ELEMENT_NODE = 1
var TEXT_NODE = 3
var COMMENT_NODE = 8

module.exports = morph

// diff elements and apply the resulting patch to the old node
// (obj, obj) -> null
function morph (newNode, oldNode) {
  var nodeType = newNode.nodeType
  var nodeName = newNode.nodeName

  if (nodeType === ELEMENT_NODE) {
    copyAttrs(newNode, oldNode)
  }

  if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue
    }
  }

  // Some DOM nodes are weird
  // https://github.com/patrick-steele-idem/morphdom/blob/master/src/specialElHandlers.js
  if (nodeName === 'INPUT') updateInput(newNode, oldNode)
  else if (nodeName === 'OPTION') updateOption(newNode, oldNode)
  else if (nodeName === 'TEXTAREA') updateTextarea(newNode, oldNode)

  copyEvents(newNode, oldNode)
}

function copyAttrs (newNode, oldNode) {
  var oldAttrs = oldNode.attributes
  var newAttrs = newNode.attributes
  var attrNamespaceURI = null
  var attrValue = null
  var fromValue = null
  var attrName = null
  var attr = null

  for (var i = newAttrs.length - 1; i >= 0; --i) {
    attr = newAttrs[i]
    attrName = attr.name
    attrNamespaceURI = attr.namespaceURI
    attrValue = attr.value
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName
      fromValue = oldNode.getAttributeNS(attrNamespaceURI, attrName)
      if (fromValue !== attrValue) {
        oldNode.setAttributeNS(attrNamespaceURI, attrName, attrValue)
      }
    } else {
      if (!oldNode.hasAttribute(attrName)) {
        oldNode.setAttribute(attrName, attrValue)
      } else {
        fromValue = oldNode.getAttribute(attrName)
        if (fromValue !== attrValue) {
          // apparently values are always cast to strings, ah well
          if (attrValue === 'null' || attrValue === 'undefined') {
            oldNode.removeAttribute(attrName)
          } else {
            oldNode.setAttribute(attrName, attrValue)
          }
        }
      }
    }
  }

  // Remove any extra attributes found on the original DOM element that
  // weren't found on the target element.
  for (var j = oldAttrs.length - 1; j >= 0; --j) {
    attr = oldAttrs[j]
    if (attr.specified !== false) {
      attrName = attr.name
      attrNamespaceURI = attr.namespaceURI

      if (attrNamespaceURI) {
        attrName = attr.localName || attrName
        if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          oldNode.removeAttributeNS(attrNamespaceURI, attrName)
        }
      } else {
        if (!newNode.hasAttributeNS(null, attrName)) {
          oldNode.removeAttribute(attrName)
        }
      }
    }
  }
}

function copyEvents (newNode, oldNode) {
  for (var i = 0; i < eventsLength; i++) {
    var ev = events[i]
    if (newNode[ev]) {           // if new element has a whitelisted attribute
      oldNode[ev] = newNode[ev]  // update existing element
    } else if (oldNode[ev]) {    // if existing element has it and new one doesnt
      oldNode[ev] = undefined    // remove it from existing element
    }
  }
}

function updateOption (newNode, oldNode) {
  updateAttribute(newNode, oldNode, 'selected')
}

// The "value" attribute is special for the <input> element since it sets the
// initial value. Changing the "value" attribute without changing the "value"
// property will have no effect since it is only used to the set the initial
// value. Similar for the "checked" attribute, and "disabled".
function updateInput (newNode, oldNode) {
  var newValue = newNode.value
  var oldValue = oldNode.value

  updateAttribute(newNode, oldNode, 'checked')
  updateAttribute(newNode, oldNode, 'disabled')

  if (newValue !== oldValue) {
    oldNode.setAttribute('value', newValue)
    oldNode.value = newValue
  }

  if (newValue === 'null') {
    oldNode.value = ''
    oldNode.removeAttribute('value')
  }

  if (!newNode.hasAttributeNS(null, 'value')) {
    oldNode.removeAttribute('value')
  } else if (oldNode.type === 'range') {
    // this is so elements like slider move their UI thingy
    oldNode.value = newValue
  }
}

function updateTextarea (newNode, oldNode) {
  var newValue = newNode.value
  if (newValue !== oldNode.value) {
    oldNode.value = newValue
  }

  if (oldNode.firstChild && oldNode.firstChild.nodeValue !== newValue) {
    // Needed for IE. Apparently IE sets the placeholder as the
    // node value and vise versa. This ignores an empty update.
    if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) {
      return
    }

    oldNode.firstChild.nodeValue = newValue
  }
}

function updateAttribute (newNode, oldNode, name) {
  if (newNode[name] !== oldNode[name]) {
    oldNode[name] = newNode[name]
    if (newNode[name]) {
      oldNode.setAttribute(name, '')
    } else {
      oldNode.removeAttribute(name)
    }
  }
}

},{"./events":22}],24:[function(require,module,exports){
var reg = /([^?=&]+)(=([^&]*))?/g
var assert = require('assert')

module.exports = qs

function qs (url) {
  assert.equal(typeof url, 'string', 'nanoquery: url should be type string')

  var obj = {}
  url.replace(/^.*\?/, '').replace(reg, function (a0, a1, a2, a3) {
    obj[decodeURIComponent(a1)] = decodeURIComponent(a3)
  })

  return obj
}

},{"assert":16}],25:[function(require,module,exports){
'use strict'

var assert = require('assert')

module.exports = nanoraf

// Only call RAF when needed
// (fn, fn?) -> fn
function nanoraf (render, raf) {
  assert.equal(typeof render, 'function', 'nanoraf: render should be a function')
  assert.ok(typeof raf === 'function' || typeof raf === 'undefined', 'nanoraf: raf should be a function or undefined')

  if (!raf) raf = window.requestAnimationFrame
  var redrawScheduled = false
  var args = null

  return function frame () {
    if (args === null && !redrawScheduled) {
      redrawScheduled = true

      raf(function redraw () {
        redrawScheduled = false

        var length = args.length
        var _args = new Array(length)
        for (var i = 0; i < length; i++) _args[i] = args[i]

        render.apply(render, _args)
        args = null
      })
    }

    args = arguments
  }
}

},{"assert":1}],26:[function(require,module,exports){
var assert = require('assert')
var wayfarer = require('wayfarer')

// electron support
var isLocalFile = (/file:\/\//.test(
  typeof window === 'object' &&
  window.location &&
  window.location.origin
))

/* eslint-disable no-useless-escape */
var electron = '^(file:\/\/|\/)(.*\.html?\/?)?'
var protocol = '^(http(s)?(:\/\/))?(www\.)?'
var domain = '[a-zA-Z0-9-_\.]+(:[0-9]{1,5})?(\/{1})?'
var qs = '[\?].*$'
/* eslint-enable no-useless-escape */

var stripElectron = new RegExp(electron)
var prefix = new RegExp(protocol + domain)
var normalize = new RegExp('#')
var suffix = new RegExp(qs)

module.exports = Nanorouter

function Nanorouter (opts) {
  if (!(this instanceof Nanorouter)) return new Nanorouter(opts)
  opts = opts || {}
  this.router = wayfarer(opts.default || '/404')
}

Nanorouter.prototype.on = function (routename, listener) {
  assert.equal(typeof routename, 'string')
  routename = routename.replace(/^[#/]/, '')
  this.router.on(routename, listener)
}

Nanorouter.prototype.emit = function (routename) {
  assert.equal(typeof routename, 'string')
  routename = pathname(routename, isLocalFile)
  return this.router.emit(routename)
}

Nanorouter.prototype.match = function (routename) {
  assert.equal(typeof routename, 'string')
  routename = pathname(routename, isLocalFile)
  return this.router.match(routename)
}

// replace everything in a route but the pathname and hash
function pathname (routename, isElectron) {
  if (isElectron) routename = routename.replace(stripElectron, '')
  else routename = routename.replace(prefix, '')
  return decodeURI(routename.replace(suffix, '').replace(normalize, '/'))
}

},{"assert":16,"wayfarer":32}],27:[function(require,module,exports){
var assert = require('assert')

var hasWindow = typeof window !== 'undefined'

function createScheduler () {
  var scheduler
  if (hasWindow) {
    if (!window._nanoScheduler) window._nanoScheduler = new NanoScheduler(true)
    scheduler = window._nanoScheduler
  } else {
    scheduler = new NanoScheduler()
  }
  return scheduler
}

function NanoScheduler (hasWindow) {
  this.hasWindow = hasWindow
  this.hasIdle = this.hasWindow && window.requestIdleCallback
  this.method = this.hasIdle ? window.requestIdleCallback.bind(window) : this.setTimeout
  this.scheduled = false
  this.queue = []
}

NanoScheduler.prototype.push = function (cb) {
  assert.equal(typeof cb, 'function', 'nanoscheduler.push: cb should be type function')

  this.queue.push(cb)
  this.schedule()
}

NanoScheduler.prototype.schedule = function () {
  if (this.scheduled) return

  this.scheduled = true
  var self = this
  this.method(function (idleDeadline) {
    var cb
    while (self.queue.length && idleDeadline.timeRemaining() > 0) {
      cb = self.queue.shift()
      cb(idleDeadline)
    }
    self.scheduled = false
    if (self.queue.length) self.schedule()
  })
}

NanoScheduler.prototype.setTimeout = function (cb) {
  setTimeout(cb, 0, {
    timeRemaining: function () {
      return 1
    }
  })
}

module.exports = createScheduler

},{"assert":16}],28:[function(require,module,exports){
var scheduler = require('nanoscheduler')()
var assert = require('assert')

var perf
nanotiming.disabled = true
try {
  perf = window.performance
  nanotiming.disabled = window.localStorage.DISABLE_NANOTIMING === 'true' || !perf.mark
} catch (e) { }

module.exports = nanotiming

function nanotiming (name) {
  assert.equal(typeof name, 'string', 'nanotiming: name should be type string')

  if (nanotiming.disabled) return noop

  var uuid = (perf.now() * 10000).toFixed() % Number.MAX_SAFE_INTEGER
  var startName = 'start-' + uuid + '-' + name
  perf.mark(startName)

  function end (cb) {
    var endName = 'end-' + uuid + '-' + name
    perf.mark(endName)

    scheduler.push(function () {
      var err = null
      try {
        var measureName = name + ' [' + uuid + ']'
        perf.measure(measureName, startName, endName)
        perf.clearMarks(startName)
        perf.clearMarks(endName)
      } catch (e) { err = e }
      if (cb) cb(err, name)
    })
  }

  end.uuid = uuid
  return end
}

function noop (cb) {
  if (cb) {
    scheduler.push(function () {
      cb(new Error('nanotiming: performance API unavailable'))
    })
  }
}

},{"assert":16,"nanoscheduler":27}],29:[function(require,module,exports){
'use strict'

/**
 * Remove a range of items from an array
 *
 * @function removeItems
 * @param {Array<*>} arr The target array
 * @param {number} startIdx The index to begin removing from (inclusive)
 * @param {number} removeCount How many items to remove
 */
module.exports = function removeItems(arr, startIdx, removeCount)
{
  var i, length = arr.length

  if (startIdx >= length || removeCount === 0) {
    return
  }

  removeCount = (startIdx + removeCount > length ? length - startIdx : removeCount)

  var len = length - removeCount

  for (i = startIdx; i < len; ++i) {
    arr[i] = arr[i + removeCount]
  }

  arr.length = len
}

},{}],30:[function(require,module,exports){
module.exports = scrollToAnchor

function scrollToAnchor (anchor, options) {
  if (anchor) {
    try {
      var el = document.querySelector(anchor)
      if (el) el.scrollIntoView(options)
    } catch (e) {}
  }
}

},{}],31:[function(require,module,exports){
module.exports = require('insert-css')

},{"insert-css":15}],32:[function(require,module,exports){
var assert = require('assert')
var trie = require('./trie')

module.exports = Wayfarer

// create a router
// str -> obj
function Wayfarer (dft) {
  if (!(this instanceof Wayfarer)) return new Wayfarer(dft)

  var _default = (dft || '').replace(/^\//, '')
  var _trie = trie()

  emit._trie = _trie
  emit.on = on
  emit.emit = emit
  emit.match = match
  emit._wayfarer = true

  return emit

  // define a route
  // (str, fn) -> obj
  function on (route, fn) {
    assert.equal(typeof route, 'string')
    assert.equal(typeof fn, 'function')

    var cb = fn._wayfarer && fn._trie ? fn : proxy
    route = route || '/'
    cb.route = route

    if (cb._wayfarer && cb._trie) {
      _trie.mount(route, cb._trie.trie)
    } else {
      var node = _trie.create(route)
      node.cb = cb
    }

    return emit

    function proxy () {
      return fn.apply(this, Array.prototype.slice.call(arguments))
    }
  }

  // match and call a route
  // (str, obj?) -> null
  function emit (route) {
    var matched = match(route)

    var args = new Array(arguments.length)
    args[0] = matched.params
    for (var i = 1; i < args.length; i++) {
      args[i] = arguments[i]
    }

    return matched.cb.apply(matched.cb, args)
  }

  function match (route) {
    assert.notEqual(route, undefined, "'route' must be defined")

    var matched = _trie.match(route)
    if (matched && matched.cb) return new Route(matched)

    var dft = _trie.match(_default)
    if (dft && dft.cb) return new Route(dft)

    throw new Error("route '" + route + "' did not match")
  }

  function Route (matched) {
    this.cb = matched.cb
    this.route = matched.cb.route
    this.params = matched.params
  }
}

},{"./trie":33,"assert":1}],33:[function(require,module,exports){
var mutate = require('xtend/mutable')
var assert = require('assert')
var xtend = require('xtend')

module.exports = Trie

// create a new trie
// null -> obj
function Trie () {
  if (!(this instanceof Trie)) return new Trie()
  this.trie = { nodes: {} }
}

// create a node on the trie at route
// and return a node
// str -> null
Trie.prototype.create = function (route) {
  assert.equal(typeof route, 'string', 'route should be a string')
  // strip leading '/' and split routes
  var routes = route.replace(/^\//, '').split('/')

  function createNode (index, trie) {
    var thisRoute = (routes.hasOwnProperty(index) && routes[index])
    if (thisRoute === false) return trie

    var node = null
    if (/^:|^\*/.test(thisRoute)) {
      // if node is a name match, set name and append to ':' node
      if (!trie.nodes.hasOwnProperty('$$')) {
        node = { nodes: {} }
        trie.nodes['$$'] = node
      } else {
        node = trie.nodes['$$']
      }

      if (thisRoute[0] === '*') {
        trie.wildcard = true
      }

      trie.name = thisRoute.replace(/^:|^\*/, '')
    } else if (!trie.nodes.hasOwnProperty(thisRoute)) {
      node = { nodes: {} }
      trie.nodes[thisRoute] = node
    } else {
      node = trie.nodes[thisRoute]
    }

    // we must recurse deeper
    return createNode(index + 1, node)
  }

  return createNode(0, this.trie)
}

// match a route on the trie
// and return the node
// str -> obj
Trie.prototype.match = function (route) {
  assert.equal(typeof route, 'string', 'route should be a string')

  var routes = route.replace(/^\//, '').split('/')
  var params = {}

  function search (index, trie) {
    // either there's no match, or we're done searching
    if (trie === undefined) return undefined
    var thisRoute = routes[index]
    if (thisRoute === undefined) return trie

    if (trie.nodes.hasOwnProperty(thisRoute)) {
      // match regular routes first
      return search(index + 1, trie.nodes[thisRoute])
    } else if (trie.name) {
      // match named routes
      try {
        params[trie.name] = decodeURIComponent(thisRoute)
      } catch (e) {
        return search(index, undefined)
      }
      return search(index + 1, trie.nodes['$$'])
    } else if (trie.wildcard) {
      // match wildcards
      try {
        params['wildcard'] = decodeURIComponent(routes.slice(index).join('/'))
      } catch (e) {
        return search(index, undefined)
      }
      // return early, or else search may keep recursing through the wildcard
      return trie.nodes['$$']
    } else {
      // no matches found
      return search(index + 1)
    }
  }

  var node = search(0, this.trie)

  if (!node) return undefined
  node = xtend(node)
  node.params = params
  return node
}

// mount a trie onto a node at route
// (str, obj) -> null
Trie.prototype.mount = function (route, trie) {
  assert.equal(typeof route, 'string', 'route should be a string')
  assert.equal(typeof trie, 'object', 'trie should be a object')

  var split = route.replace(/^\//, '').split('/')
  var node = null
  var key = null

  if (split.length === 1) {
    key = split[0]
    node = this.create(key)
  } else {
    var head = split.join('/')
    key = split[0]
    node = this.create(head)
  }

  mutate(node.nodes, trie.nodes)
  if (trie.name) node.name = trie.name

  // delegate properties from '/' to the new node
  // '/' cannot be reached once mounted
  if (node.nodes['']) {
    Object.keys(node.nodes['']).forEach(function (key) {
      if (key === 'nodes') return
      node[key] = node.nodes[''][key]
    })
    mutate(node.nodes, node.nodes[''].nodes)
    delete node.nodes[''].nodes
  }
}

},{"assert":1,"xtend":34,"xtend/mutable":35}],34:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],35:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[6]);
