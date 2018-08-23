(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('dist/argon2.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'dist/argon2.js'], factory) :
	(factory((global.keygen = {}),global.argon2));
}(this, (function (exports,argon2) { 'use strict';

argon2 = argon2 && argon2.hasOwnProperty('default') ? argon2['default'] : argon2;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var empty = {};


var empty$1 = Object.freeze({
	default: empty
});

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

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
}

// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}

// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}


// path.relative(from, to)
// posix version
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

var sep = '/';
var delimiter = ':';

function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

function basename(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


function extname(path) {
  return splitPath(path)[3];
}
var path = {
  extname: extname,
  basename: basename,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join,
  isAbsolute: isAbsolute,
  normalize: normalize,
  resolve: resolve
};
function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    };


var path$1 = Object.freeze({
	resolve: resolve,
	normalize: normalize,
	isAbsolute: isAbsolute,
	join: join,
	relative: relative,
	sep: sep,
	delimiter: delimiter,
	dirname: dirname,
	basename: basename,
	extname: extname,
	default: path
});

var require$$0 = ( empty$1 && empty ) || empty$1;

var require$$1 = ( path$1 && path ) || path$1;

var argon2$1 = createCommonjsModule(function (module) {
!function(globalRoot, factory) {
  if ('function' === typeof undefined && undefined.amd)
    undefined('mymodule', [], function() { return (globalRoot.mymodule = factory()) });
  else if ('object' === 'object' && module.exports)
    module.exports = factory();
  else
    globalRoot.argon2 = factory();
}(commonjsGlobal, function() {
  'use strict';

// require('./base64.js')

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens (b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4);

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

  var curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen;

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = (tmp >> 16) & 0xFF;
    arr[curByte++] = (tmp >> 8) & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[curByte++] = (tmp >> 8) & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    );
  }

  return parts.join('')
}

// end base64.js

  var isBrowser = typeof window !== 'undefined';
  var g = isBrowser ? window : commonjsGlobal;
  var base64js = { //require('./base64.js');
    byteLength,
    toByteArray,
    fromByteArray
  };

  /**
   * Argon2 hash
   * @param {string} params.pass - password string
   * @param {string} params.salt - salt string
   * @param {float}  [params.time=1] - the number of iterations
   * @param {float}  [params.mem=1024] - used memory, in KiB
   * @param {float}  [params.hashLen=24] - desired hash length
   * @param {float}  [params.parallelism=1] - desired parallelism (will be computed in parallel only for PNaCl)
   * @param {number} [params.type=argon2.ArgonType.Argon2d] - hash type: argon2.ArgonType.Argon2d, .Argon2i, .Argon2id or .Argon2u
   * @param {number} [params.distPath=.] - asm.js script location, without trailing slash
   *
   * @return Promise
   *
   * @example
   *  argon2.hash({ pass: 'password', salt: 'somesalt' })
   *      .then(h => console.log(h.hash, h.hashHex, h.encoded))
   *      .catch(e => console.error(e.message, e.code))
   */
  function argon2$$1(args) {
      if (!WebAssembly) {
          return new Promise((resolve, reject) => {
              reject({message: 'WebAssembly not supported here.', code:-4040});
          });
      }

      if (g.Module && g.Module._argon2_hash) {
          return new Promise((resolve, reject) => {
              try {
                  resolve(calcHash(args));
              } catch(e) {
                  reject(e);
              }
          });
      }

      const runDist = (Module) => {
        var moduleOverrides = {};
        var key;
        for (key in Module) {
            if (Module.hasOwnProperty(key)) {
                moduleOverrides[key] = Module[key];
            }
        }
        Module["arguments"] = [];
        Module["thisProgram"] = "./this.program";
        Module["quit"] = (function(status, toThrow) {
            throw toThrow
        });
        Module["preRun"] = [];
        Module["postRun"] = [];
        var ENVIRONMENT_IS_WEB = false;
        var ENVIRONMENT_IS_WORKER = false;
        var ENVIRONMENT_IS_NODE = false;
        var ENVIRONMENT_IS_SHELL = false;
        ENVIRONMENT_IS_WEB = typeof window === "object";
        ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
        ENVIRONMENT_IS_NODE = typeof process === "object" && typeof commonjsRequire === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
        ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (Module["ENVIRONMENT"]) {
            throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)")
        }
        if (ENVIRONMENT_IS_NODE) {
            var nodeFS;
            var nodePath;
            Module["read"] = function shell_read(filename, binary) {
                var ret;
                if (!nodeFS) nodeFS = require$$0;
                if (!nodePath) nodePath = require$$1;
                filename = nodePath["normalize"](filename);
                ret = nodeFS["readFileSync"](filename);
                return binary ? ret : ret.toString()
            };
            Module["readBinary"] = function readBinary(filename) {
                var ret = Module["read"](filename, true);
                if (!ret.buffer) {
                    ret = new Uint8Array(ret);
                }
                assert(ret.buffer);
                return ret
            };
            if (process["argv"].length > 1) {
                Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/");
            }
            Module["arguments"] = process["argv"].slice(2);
            {
                module["exports"] = Module;
            }
            process["on"]("uncaughtException", (function(ex) {
                if (!(ex instanceof ExitStatus)) {
                    throw ex
                }
            }));
            process["on"]("unhandledRejection", (function(reason, p) {
                err("node.js exiting due to unhandled promise rejection");
                process["exit"](1);
            }));
            Module["quit"] = (function(status) {
                process["exit"](status);
            });
            Module["inspect"] = (function() {
                return "[Emscripten Module object]"
            });
        } else if (ENVIRONMENT_IS_SHELL) {
            if (typeof read != "undefined") {
                Module["read"] = function shell_read(f) {
                    return read(f)
                };
            }
            Module["readBinary"] = function readBinary(f) {
                var data;
                if (typeof readbuffer === "function") {
                    return new Uint8Array(readbuffer(f))
                }
                data = read(f, "binary");
                assert(typeof data === "object");
                return data
            };
            if (typeof scriptArgs != "undefined") {
                Module["arguments"] = scriptArgs;
            } else if (typeof arguments != "undefined") {
                Module["arguments"] = arguments;
            }
            if (typeof quit === "function") {
                Module["quit"] = (function(status) {
                    quit(status);
                });
            }
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            Module["read"] = function shell_read(url) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.send(null);
                return xhr.responseText
            };
            if (ENVIRONMENT_IS_WORKER) {
                Module["readBinary"] = function readBinary(url) {
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, false);
                    xhr.responseType = "arraybuffer";
                    xhr.send(null);
                    return new Uint8Array(xhr.response)
                };
            }
            Module["readAsync"] = function readAsync(url, onload, onerror) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function xhr_onload() {
                    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                        onload(xhr.response);
                        return
                    }
                    onerror();
                };
                xhr.onerror = onerror;
                xhr.send(null);
            };
            Module["setWindowTitle"] = (function(title) {
                document.title = title;
            });
        } else {
            throw new Error("environment detection error")
        }
        var out = Module["print"] || (typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null);
        var err = Module["printErr"] || (typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || out);
        for (key in moduleOverrides) {
            if (moduleOverrides.hasOwnProperty(key)) {
                Module[key] = moduleOverrides[key];
            }
        }
        moduleOverrides = undefined;
        var STACK_ALIGN = 16;
        stackSave = stackRestore = stackAlloc = setTempRet0 = getTempRet0 = (function() {
            abort("cannot use the stack before compiled code is ready to run, and has provided stack access");
        });

        function staticAlloc(size) {
            assert(!staticSealed);
            var ret = STATICTOP;
            STATICTOP = STATICTOP + size + 15 & -16;
            assert(STATICTOP < TOTAL_MEMORY, "not enough memory for static allocation - increase TOTAL_MEMORY");
            return ret
        }

        function dynamicAlloc(size) {
            assert(DYNAMICTOP_PTR);
            var ret = HEAP32[DYNAMICTOP_PTR >> 2];
            var end = ret + size + 15 & -16;
            HEAP32[DYNAMICTOP_PTR >> 2] = end;
            if (end >= TOTAL_MEMORY) {
                var success = enlargeMemory();
                if (!success) {
                    HEAP32[DYNAMICTOP_PTR >> 2] = ret;
                    return 0
                }
            }
            return ret
        }

        function alignMemory(size, factor) {
            if (!factor) factor = STACK_ALIGN;
            var ret = size = Math.ceil(size / factor) * factor;
            return ret
        }

        function getNativeTypeSize(type) {
            switch (type) {
                case "i1":
                case "i8":
                    return 1;
                case "i16":
                    return 2;
                case "i32":
                    return 4;
                case "i64":
                    return 8;
                case "float":
                    return 4;
                case "double":
                    return 8;
                default:
                    {
                        if (type[type.length - 1] === "*") {
                            return 4
                        } else if (type[0] === "i") {
                            var bits = parseInt(type.substr(1));
                            assert(bits % 8 === 0);
                            return bits / 8
                        } else {
                            return 0
                        }
                    }
            }
        }

        function warnOnce(text) {
            if (!warnOnce.shown) warnOnce.shown = {};
            if (!warnOnce.shown[text]) {
                warnOnce.shown[text] = 1;
                err(text);
            }
        }
        var asm2wasmImports = {
            "f64-rem": (function(x, y) {
                return x % y
            }),
            "debugger": (function() {
                debugger
            })
        };
        var GLOBAL_BASE = 1024;
        var ABORT = 0;
        function assert(condition, text) {
            if (!condition) {
                abort("Assertion failed: " + text);
            }
        }

        function setValue(ptr, value, type, noSafe) {
            type = type || "i8";
            if (type.charAt(type.length - 1) === "*") type = "i32";
            switch (type) {
                case "i1":
                    HEAP8[ptr >> 0] = value;
                    break;
                case "i8":
                    HEAP8[ptr >> 0] = value;
                    break;
                case "i16":
                    HEAP16[ptr >> 1] = value;
                    break;
                case "i32":
                    HEAP32[ptr >> 2] = value;
                    break;
                case "i64":
                    tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
                    break;
                case "float":
                    HEAPF32[ptr >> 2] = value;
                    break;
                case "double":
                    HEAPF64[ptr >> 3] = value;
                    break;
                default:
                    abort("invalid type for setValue: " + type);
            }
        }
        var ALLOC_NORMAL = 0;
        var ALLOC_STATIC = 2;
        var ALLOC_NONE = 4;

        function allocate(slab, types, allocator, ptr) {
            var zeroinit, size;
            if (typeof slab === "number") {
                zeroinit = true;
                size = slab;
            } else {
                zeroinit = false;
                size = slab.length;
            }
            var singleType = typeof types === "string" ? types : null;
            var ret;
            if (allocator == ALLOC_NONE) {
                ret = ptr;
            } else {
                ret = [typeof _malloc === "function" ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
            }
            if (zeroinit) {
                var stop;
                ptr = ret;
                assert((ret & 3) == 0);
                stop = ret + (size & ~3);
                for (; ptr < stop; ptr += 4) {
                    HEAP32[ptr >> 2] = 0;
                }
                stop = ret + size;
                while (ptr < stop) {
                    HEAP8[ptr++ >> 0] = 0;
                }
                return ret
            }
            if (singleType === "i8") {
                if (slab.subarray || slab.slice) {
                    HEAPU8.set(slab, ret);
                } else {
                    HEAPU8.set(new Uint8Array(slab), ret);
                }
                return ret
            }
            var i = 0,
                type, typeSize, previousType;
            while (i < size) {
                var curr = slab[i];
                type = singleType || types[i];
                if (type === 0) {
                    i++;
                    continue
                }
                assert(type, "Must know what type to store in allocate!");
                if (type == "i64") type = "i32";
                setValue(ret + i, curr, type);
                if (previousType !== type) {
                    typeSize = getNativeTypeSize(type);
                    previousType = type;
                }
                i += typeSize;
            }
            return ret
        }

        function Pointer_stringify(ptr, length) {
            if (length === 0 || !ptr) return "";
            var hasUtf = 0;
            var t;
            var i = 0;
            while (1) {
                assert(ptr + i < TOTAL_MEMORY);
                t = HEAPU8[ptr + i >> 0];
                hasUtf |= t;
                if (t == 0 && !length) break;
                i++;
                if (length && i == length) break
            }
            if (!length) length = i;
            var ret = "";
            if (hasUtf < 128) {
                var MAX_CHUNK = 1024;
                var curr;
                while (length > 0) {
                    curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
                    ret = ret ? ret + curr : curr;
                    ptr += MAX_CHUNK;
                    length -= MAX_CHUNK;
                }
                return ret
            }
            return UTF8ToString(ptr)
        }
        var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

        function UTF8ArrayToString(u8Array, idx) {
            var endPtr = idx;
            while (u8Array[endPtr]) ++endPtr;
            if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
                return UTF8Decoder.decode(u8Array.subarray(idx, endPtr))
            } else {
                var u0, u1, u2, u3, u4, u5;
                var str = "";
                while (1) {
                    u0 = u8Array[idx++];
                    if (!u0) return str;
                    if (!(u0 & 128)) {
                        str += String.fromCharCode(u0);
                        continue
                    }
                    u1 = u8Array[idx++] & 63;
                    if ((u0 & 224) == 192) {
                        str += String.fromCharCode((u0 & 31) << 6 | u1);
                        continue
                    }
                    u2 = u8Array[idx++] & 63;
                    if ((u0 & 240) == 224) {
                        u0 = (u0 & 15) << 12 | u1 << 6 | u2;
                    } else {
                        u3 = u8Array[idx++] & 63;
                        if ((u0 & 248) == 240) {
                            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3;
                        } else {
                            u4 = u8Array[idx++] & 63;
                            if ((u0 & 252) == 248) {
                                u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4;
                            } else {
                                u5 = u8Array[idx++] & 63;
                                u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5;
                            }
                        }
                    }
                    if (u0 < 65536) {
                        str += String.fromCharCode(u0);
                    } else {
                        var ch = u0 - 65536;
                        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
                    }
                }
            }
        }

        function UTF8ToString(ptr) {
            return UTF8ArrayToString(HEAPU8, ptr)
        }

        function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
            if (!(maxBytesToWrite > 0)) return 0;
            var startIdx = outIdx;
            var endIdx = outIdx + maxBytesToWrite - 1;
            for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
                if (u <= 127) {
                    if (outIdx >= endIdx) break;
                    outU8Array[outIdx++] = u;
                } else if (u <= 2047) {
                    if (outIdx + 1 >= endIdx) break;
                    outU8Array[outIdx++] = 192 | u >> 6;
                    outU8Array[outIdx++] = 128 | u & 63;
                } else if (u <= 65535) {
                    if (outIdx + 2 >= endIdx) break;
                    outU8Array[outIdx++] = 224 | u >> 12;
                    outU8Array[outIdx++] = 128 | u >> 6 & 63;
                    outU8Array[outIdx++] = 128 | u & 63;
                } else if (u <= 2097151) {
                    if (outIdx + 3 >= endIdx) break;
                    outU8Array[outIdx++] = 240 | u >> 18;
                    outU8Array[outIdx++] = 128 | u >> 12 & 63;
                    outU8Array[outIdx++] = 128 | u >> 6 & 63;
                    outU8Array[outIdx++] = 128 | u & 63;
                } else if (u <= 67108863) {
                    if (outIdx + 4 >= endIdx) break;
                    outU8Array[outIdx++] = 248 | u >> 24;
                    outU8Array[outIdx++] = 128 | u >> 18 & 63;
                    outU8Array[outIdx++] = 128 | u >> 12 & 63;
                    outU8Array[outIdx++] = 128 | u >> 6 & 63;
                    outU8Array[outIdx++] = 128 | u & 63;
                } else {
                    if (outIdx + 5 >= endIdx) break;
                    outU8Array[outIdx++] = 252 | u >> 30;
                    outU8Array[outIdx++] = 128 | u >> 24 & 63;
                    outU8Array[outIdx++] = 128 | u >> 18 & 63;
                    outU8Array[outIdx++] = 128 | u >> 12 & 63;
                    outU8Array[outIdx++] = 128 | u >> 6 & 63;
                    outU8Array[outIdx++] = 128 | u & 63;
                }
            }
            outU8Array[outIdx] = 0;
            return outIdx - startIdx
        }

        function lengthBytesUTF8(str) {
            var len = 0;
            for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
                if (u <= 127) {
                    ++len;
                } else if (u <= 2047) {
                    len += 2;
                } else if (u <= 65535) {
                    len += 3;
                } else if (u <= 2097151) {
                    len += 4;
                } else if (u <= 67108863) {
                    len += 5;
                } else {
                    len += 6;
                }
            }
            return len
        }
        var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

        function demangle(func) {
            warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
            return func
        }

        function demangleAll(text) {
            var regex = /__Z[\w\d_]+/g;
            return text.replace(regex, (function(x) {
                var y = demangle(x);
                return x === y ? x : x + " [" + y + "]"
            }))
        }

        function jsStackTrace() {
            var err = new Error;
            if (!err.stack) {
                try {
                    throw new Error(0)
                } catch (e) {
                    err = e;
                }
                if (!err.stack) {
                    return "(no stack trace available)"
                }
            }
            return err.stack.toString()
        }

        function stackTrace() {
            var js = jsStackTrace();
            if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
            return demangleAll(js)
        }
        var WASM_PAGE_SIZE = 65536;
        var ASMJS_PAGE_SIZE = 16777216;

        function alignUp(x, multiple) {
            if (x % multiple > 0) {
                x += multiple - x % multiple;
            }
            return x
        }
        var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

        function updateGlobalBuffer(buf) {
            Module["buffer"] = buffer = buf;
        }

        function updateGlobalBufferViews() {
            Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
            Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
            Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
            Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
            Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
            Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
            Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
            Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer);
        }
        var STATIC_BASE, STATICTOP, staticSealed;
        var STACK_BASE, STACKTOP, STACK_MAX;
        var DYNAMIC_BASE, DYNAMICTOP_PTR;
        STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
        staticSealed = false;

        function writeStackCookie() {
            assert((STACK_MAX & 3) == 0);
            HEAPU32[(STACK_MAX >> 2) - 1] = 34821223;
            HEAPU32[(STACK_MAX >> 2) - 2] = 2310721022;
        }

        function checkStackCookie() {
            if (HEAPU32[(STACK_MAX >> 2) - 1] != 34821223 || HEAPU32[(STACK_MAX >> 2) - 2] != 2310721022) {
                abort("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x" + HEAPU32[(STACK_MAX >> 2) - 2].toString(16) + " " + HEAPU32[(STACK_MAX >> 2) - 1].toString(16));
            }
            if (HEAP32[0] !== 1668509029) throw "Runtime error: The application has corrupted its heap memory area (address zero)!"
        }

        function abortStackOverflow(allocSize) {
            abort("Stack overflow! Attempted to allocate " + allocSize + " bytes on the stack, but stack has only " + (STACK_MAX - stackSave() + allocSize) + " bytes available!");
        }

        function abortOnCannotGrowMemory() {
            abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ");
        }

        function enlargeMemory() {
            abortOnCannotGrowMemory();
        }
        var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
        var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 1073741824;
        if (TOTAL_MEMORY < TOTAL_STACK) err("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
        assert(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined, "JS engine does not provide full typed array support");
        if (Module["buffer"]) {
            buffer = Module["buffer"];
            assert(buffer.byteLength === TOTAL_MEMORY, "provided buffer should be " + TOTAL_MEMORY + " bytes, but it is " + buffer.byteLength);
        } else {
            if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") {
                assert(TOTAL_MEMORY % WASM_PAGE_SIZE === 0);
                Module["wasmMemory"] = new WebAssembly.Memory({
                    "initial": TOTAL_MEMORY / WASM_PAGE_SIZE,
                    "maximum": TOTAL_MEMORY / WASM_PAGE_SIZE
                });
                buffer = Module["wasmMemory"].buffer;
            } else {
                buffer = new ArrayBuffer(TOTAL_MEMORY);
            }
            assert(buffer.byteLength === TOTAL_MEMORY);
            Module["buffer"] = buffer;
        }
        updateGlobalBufferViews();

        function getTotalMemory() {
            return TOTAL_MEMORY
        }
        HEAP32[0] = 1668509029;
        HEAP16[1] = 25459;
        if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99) throw "Runtime error: expected the system to be little-endian!";

        function callRuntimeCallbacks(callbacks) {
            while (callbacks.length > 0) {
                var callback = callbacks.shift();
                if (typeof callback == "function") {
                    callback();
                    continue
                }
                var func = callback.func;
                if (typeof func === "number") {
                    if (callback.arg === undefined) {
                        Module["dynCall_v"](func);
                    } else {
                        Module["dynCall_vi"](func, callback.arg);
                    }
                } else {
                    func(callback.arg === undefined ? null : callback.arg);
                }
            }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeExited = false;

        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                while (Module["preRun"].length) {
                    addOnPreRun(Module["preRun"].shift());
                }
            }
            callRuntimeCallbacks(__ATPRERUN__);
        }

        function ensureInitRuntime() {
            checkStackCookie();
            if (runtimeInitialized) return;
            runtimeInitialized = true;
            callRuntimeCallbacks(__ATINIT__);
        }

        function preMain() {
            checkStackCookie();
            callRuntimeCallbacks(__ATMAIN__);
        }

        function postRun() {
            checkStackCookie();
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                while (Module["postRun"].length) {
                    addOnPostRun(Module["postRun"].shift());
                }
            }
            callRuntimeCallbacks(__ATPOSTRUN__);
        }

        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb);
        }

        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb);
        }
        assert(Math["imul"] && Math["fround"] && Math["clz32"] && Math["trunc"], "this is a legacy browser, build with LEGACY_VM_SUPPORT");
        var Math_abs = Math.abs;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_min = Math.min;
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        var runDependencyTracking = {};

        function addRunDependency(id) {
            runDependencies++;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies);
            }
            if (id) {
                assert(!runDependencyTracking[id]);
                runDependencyTracking[id] = 1;
                if (runDependencyWatcher === null && typeof setInterval !== "undefined") {
                    runDependencyWatcher = setInterval((function() {
                        if (ABORT) {
                            clearInterval(runDependencyWatcher);
                            runDependencyWatcher = null;
                            return
                        }
                        var shown = false;
                        for (var dep in runDependencyTracking) {
                            if (!shown) {
                                shown = true;
                                err("still waiting on run dependencies:");
                            }
                            err("dependency: " + dep);
                        }
                        if (shown) {
                            err("(end of list)");
                        }
                    }), 1e4);
                }
            } else {
                err("warning: run dependency added without ID");
            }
        }

        function removeRunDependency(id) {
            runDependencies--;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies);
            }
            if (id) {
                assert(runDependencyTracking[id]);
                delete runDependencyTracking[id];
            } else {
                err("warning: run dependency removed without ID");
            }
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback();
                }
            }
        }
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        var FS = {
            error: (function() {
                abort("Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1");
            }),
            init: (function() {
                FS.error();
            }),
            createDataFile: (function() {
                FS.error();
            }),
            createPreloadedFile: (function() {
                FS.error();
            }),
            createLazyFile: (function() {
                FS.error();
            }),
            open: (function() {
                FS.error();
            }),
            mkdev: (function() {
                FS.error();
            }),
            registerDevice: (function() {
                FS.error();
            }),
            analyzePath: (function() {
                FS.error();
            }),
            loadFilesFromDB: (function() {
                FS.error();
            }),
            ErrnoError: function ErrnoError() {
                FS.error();
            }
        };
        Module["FS_createDataFile"] = FS.createDataFile;
        Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
        var dataURIPrefix = "data:application/octet-stream;base64,";

        function isDataURI(filename) {
            return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0
        }

        function integrateWasmJS() {
            var wasmTextFile = "argon2.wast";
            var wasmBinaryFile = "argon2.wasm";
            var asmjsCodeFile = "argon2.temp.asm.js";
            if (typeof Module["locateFile"] === "function") {
                if (!isDataURI(wasmTextFile)) {
                    wasmTextFile = Module["locateFile"](wasmTextFile);
                }
                if (!isDataURI(wasmBinaryFile)) {
                    wasmBinaryFile = Module["locateFile"](wasmBinaryFile);
                }
                if (!isDataURI(asmjsCodeFile)) {
                    asmjsCodeFile = Module["locateFile"](asmjsCodeFile);
                }
            }
            var wasmPageSize = 64 * 1024;
            var info = {
                "global": null,
                "env": null,
                "asm2wasm": asm2wasmImports,
                "parent": Module
            };
            var exports = null;

            function mergeMemory(newBuffer) {
                var oldBuffer = Module["buffer"];
                if (newBuffer.byteLength < oldBuffer.byteLength) {
                    err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");
                }
                var oldView = new Int8Array(oldBuffer);
                var newView = new Int8Array(newBuffer);
                newView.set(oldView);
                updateGlobalBuffer(newBuffer);
                updateGlobalBufferViews();
            }

            function fixImports(imports) {
                return imports
            }

            function getBinary() {
                try {
                    if (Module["wasmBinary"]) {
                        return new Uint8Array(Module["wasmBinary"])
                    }
                    if (Module["readBinary"]) {
                        return Module["readBinary"](wasmBinaryFile)
                    } else {
                        throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)"
                    }
                } catch (err) {
                    abort(err);
                }
            }

            function getBinaryPromise() {
                if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
                    return fetch(wasmBinaryFile, {
                        credentials: "same-origin"
                    }).then((function(response) {
                        if (!response["ok"]) {
                            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                        }
                        return response["arrayBuffer"]()
                    })).catch((function() {
                        return getBinary()
                    }))
                }
                return new Promise((function(resolve, reject) {
                    resolve(getBinary());
                }))
            }

            function doNativeWasm(global, env, providedBuffer) {
                if (typeof WebAssembly !== "object") {
                    abort("No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead.");
                    err("no native wasm support detected");
                    return false
                }
                if (!(Module["wasmMemory"] instanceof WebAssembly.Memory)) {
                    err("no native wasm Memory in use");
                    return false
                }
                env["memory"] = Module["wasmMemory"];
                info["global"] = {
                    "NaN": NaN,
                    "Infinity": Infinity
                };
                info["global.Math"] = Math;
                info["env"] = env;

                function receiveInstance(instance, module) {
                    exports = instance.exports;
                    if (exports.memory) mergeMemory(exports.memory);
                    Module["asm"] = exports;
                    Module["usingWasm"] = true;
                    removeRunDependency("wasm-instantiate");
                }
                addRunDependency("wasm-instantiate");
                if (Module["instantiateWasm"]) {
                    try {
                        return Module["instantiateWasm"](info, receiveInstance)
                    } catch (e) {
                        err("Module.instantiateWasm callback failed with error: " + e);
                        return false
                    }
                }
                var trueModule = Module;

                function receiveInstantiatedSource(output) {
                    assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
                    trueModule = null;
                    receiveInstance(output["instance"], output["module"]);
                }

                function instantiateArrayBuffer(receiver) {
                    getBinaryPromise().then((function(binary) {
                        return WebAssembly.instantiate(binary, info)
                    })).then(receiver).catch((function(reason) {
                        err("failed to asynchronously prepare wasm: " + reason);
                        abort(reason);
                    }));
                }
                if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
                    WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, {
                        credentials: "same-origin"
                    }), info).then(receiveInstantiatedSource).catch((function(reason) {
                        err("wasm streaming compile failed: " + reason);
                        err("falling back to ArrayBuffer instantiation");
                        instantiateArrayBuffer(receiveInstantiatedSource);
                    }));
                } else {
                    instantiateArrayBuffer(receiveInstantiatedSource);
                }
                return {}
            }
            Module["asmPreload"] = Module["asm"];
            var asmjsReallocBuffer = Module["reallocBuffer"];
            var wasmReallocBuffer = (function(size) {
                var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
                size = alignUp(size, PAGE_MULTIPLE);
                var old = Module["buffer"];
                var oldSize = old.byteLength;
                if (Module["usingWasm"]) {
                    try {
                        var result = Module["wasmMemory"].grow((size - oldSize) / wasmPageSize);
                        if (result !== (-1 | 0)) {
                            return Module["buffer"] = Module["wasmMemory"].buffer
                        } else {
                            return null
                        }
                    } catch (e) {
                        console.error("Module.reallocBuffer: Attempted to grow from " + oldSize + " bytes to " + size + " bytes, but got error: " + e);
                        return null
                    }
                }
            });
            Module["reallocBuffer"] = (function(size) {
                if (finalMethod === "asmjs") {
                    return asmjsReallocBuffer(size)
                } else {
                    return wasmReallocBuffer(size)
                }
            });
            var finalMethod = "";
            Module["asm"] = (function(global, env, providedBuffer) {
                env = fixImports(env);
                if (!env["table"]) {
                    var TABLE_SIZE = Module["wasmTableSize"];
                    if (TABLE_SIZE === undefined) TABLE_SIZE = 1024;
                    var MAX_TABLE_SIZE = Module["wasmMaxTableSize"];
                    if (typeof WebAssembly === "object" && typeof WebAssembly.Table === "function") {
                        if (MAX_TABLE_SIZE !== undefined) {
                            env["table"] = new WebAssembly.Table({
                                "initial": TABLE_SIZE,
                                "maximum": MAX_TABLE_SIZE,
                                "element": "anyfunc"
                            });
                        } else {
                            env["table"] = new WebAssembly.Table({
                                "initial": TABLE_SIZE,
                                element: "anyfunc"
                            });
                        }
                    } else {
                        env["table"] = new Array(TABLE_SIZE);
                    }
                    Module["wasmTable"] = env["table"];
                }
                if (!env["memoryBase"]) {
                    env["memoryBase"] = Module["STATIC_BASE"];
                }
                if (!env["tableBase"]) {
                    env["tableBase"] = 0;
                }
                var exports;
                exports = doNativeWasm(global, env, providedBuffer);
                assert(exports, "no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods");
                return exports
            });
        }
        integrateWasmJS();
        STATIC_BASE = GLOBAL_BASE;
        STATICTOP = STATIC_BASE + 3424;
        __ATINIT__.push();
        var STATIC_BUMP = 3424;
        Module["STATIC_BASE"] = STATIC_BASE;
        Module["STATIC_BUMP"] = STATIC_BUMP;
        var tempDoublePtr = STATICTOP;
        STATICTOP += 16;
        assert(tempDoublePtr % 8 == 0);

        function _emscripten_memcpy_big(dest, src, num) {
            HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
            return dest
        }

        function _pthread_join() {}

        function ___setErrNo(value) {
            if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
            else err("failed to set errno from JS");
            return value
        }
        DYNAMICTOP_PTR = staticAlloc(4);
        STACK_BASE = STACKTOP = alignMemory(STATICTOP);
        STACK_MAX = STACK_BASE + TOTAL_STACK;
        DYNAMIC_BASE = alignMemory(STACK_MAX);
        HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
        staticSealed = true;
        assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

        function intArrayFromString(stringy, dontAddNull, length) {
            var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
            var u8array = new Array(len);
            var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
            if (dontAddNull) u8array.length = numBytesWritten;
            return u8array
        }
        Module["wasmTableSize"] = 0;
        Module["wasmMaxTableSize"] = 0;
        Module.asmGlobalArg = {};
        Module.asmLibraryArg = {
            "enlargeMemory": enlargeMemory,
            "getTotalMemory": getTotalMemory,
            "abortOnCannotGrowMemory": abortOnCannotGrowMemory,
            "abortStackOverflow": abortStackOverflow,
            "___setErrNo": ___setErrNo,
            "_emscripten_memcpy_big": _emscripten_memcpy_big,
            "_pthread_join": _pthread_join,
            "DYNAMICTOP_PTR": DYNAMICTOP_PTR,
            "STACKTOP": STACKTOP,
            "STACK_MAX": STACK_MAX
        };
        var asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer);
        var real__argon2_error_message = asm["_argon2_error_message"];
        asm["_argon2_error_message"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real__argon2_error_message.apply(null, arguments)
        });
        var real__argon2_hash = asm["_argon2_hash"];
        asm["_argon2_hash"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real__argon2_hash.apply(null, arguments)
        });
        var real__free = asm["_free"];
        asm["_free"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real__free.apply(null, arguments)
        });
        var real__malloc = asm["_malloc"];
        asm["_malloc"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real__malloc.apply(null, arguments)
        });
        var real__sbrk = asm["_sbrk"];
        asm["_sbrk"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real__sbrk.apply(null, arguments)
        });
        var real_establishStackSpace = asm["establishStackSpace"];
        asm["establishStackSpace"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real_establishStackSpace.apply(null, arguments)
        });
        var real_getTempRet0 = asm["getTempRet0"];
        asm["getTempRet0"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real_getTempRet0.apply(null, arguments)
        });
        var real_setTempRet0 = asm["setTempRet0"];
        asm["setTempRet0"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real_setTempRet0.apply(null, arguments)
        });
        var real_setThrew = asm["setThrew"];
        asm["setThrew"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real_setThrew.apply(null, arguments)
        });
        var real_stackAlloc = asm["stackAlloc"];
        asm["stackAlloc"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real_stackAlloc.apply(null, arguments)
        });
        var real_stackRestore = asm["stackRestore"];
        asm["stackRestore"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real_stackRestore.apply(null, arguments)
        });
        var real_stackSave = asm["stackSave"];
        asm["stackSave"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return real_stackSave.apply(null, arguments)
        });
        Module["asm"] = asm;
        var _argon2_error_message = Module["_argon2_error_message"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["_argon2_error_message"].apply(null, arguments)
        });
        var _argon2_hash = Module["_argon2_hash"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["_argon2_hash"].apply(null, arguments)
        });
        var _free = Module["_free"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["_free"].apply(null, arguments)
        });
        var _malloc = Module["_malloc"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["_malloc"].apply(null, arguments)
        });
        var _sbrk = Module["_sbrk"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["_sbrk"].apply(null, arguments)
        });
        var establishStackSpace = Module["establishStackSpace"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["establishStackSpace"].apply(null, arguments)
        });
        var getTempRet0 = Module["getTempRet0"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["getTempRet0"].apply(null, arguments)
        });
        var setTempRet0 = Module["setTempRet0"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["setTempRet0"].apply(null, arguments)
        });
        var setThrew = Module["setThrew"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["setThrew"].apply(null, arguments)
        });
        var stackAlloc = Module["stackAlloc"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["stackAlloc"].apply(null, arguments)
        });
        var stackRestore = Module["stackRestore"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["stackRestore"].apply(null, arguments)
        });
        var stackSave = Module["stackSave"] = (function() {
            assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
            assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
            return Module["asm"]["stackSave"].apply(null, arguments)
        });
        Module["asm"] = asm;
        Module["intArrayFromString"] = intArrayFromString;
        if (!Module["intArrayToString"]) Module["intArrayToString"] = (function() {
            abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["ccall"]) Module["ccall"] = (function() {
            abort("'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["cwrap"]) Module["cwrap"] = (function() {
            abort("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["setValue"]) Module["setValue"] = (function() {
            abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["getValue"]) Module["getValue"] = (function() {
            abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        Module["allocate"] = allocate;
        if (!Module["getMemory"]) Module["getMemory"] = (function() {
            abort("'getMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        Module["Pointer_stringify"] = Pointer_stringify;
        if (!Module["AsciiToString"]) Module["AsciiToString"] = (function() {
            abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["stringToAscii"]) Module["stringToAscii"] = (function() {
            abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["UTF8ArrayToString"]) Module["UTF8ArrayToString"] = (function() {
            abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["UTF8ToString"]) Module["UTF8ToString"] = (function() {
            abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["stringToUTF8Array"]) Module["stringToUTF8Array"] = (function() {
            abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["stringToUTF8"]) Module["stringToUTF8"] = (function() {
            abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["lengthBytesUTF8"]) Module["lengthBytesUTF8"] = (function() {
            abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["UTF16ToString"]) Module["UTF16ToString"] = (function() {
            abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["stringToUTF16"]) Module["stringToUTF16"] = (function() {
            abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["lengthBytesUTF16"]) Module["lengthBytesUTF16"] = (function() {
            abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["UTF32ToString"]) Module["UTF32ToString"] = (function() {
            abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["stringToUTF32"]) Module["stringToUTF32"] = (function() {
            abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["lengthBytesUTF32"]) Module["lengthBytesUTF32"] = (function() {
            abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["allocateUTF8"]) Module["allocateUTF8"] = (function() {
            abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["stackTrace"]) Module["stackTrace"] = (function() {
            abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["addOnPreRun"]) Module["addOnPreRun"] = (function() {
            abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["addOnInit"]) Module["addOnInit"] = (function() {
            abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["addOnPreMain"]) Module["addOnPreMain"] = (function() {
            abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["addOnExit"]) Module["addOnExit"] = (function() {
            abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["addOnPostRun"]) Module["addOnPostRun"] = (function() {
            abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["writeStringToMemory"]) Module["writeStringToMemory"] = (function() {
            abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["writeArrayToMemory"]) Module["writeArrayToMemory"] = (function() {
            abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["writeAsciiToMemory"]) Module["writeAsciiToMemory"] = (function() {
            abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["addRunDependency"]) Module["addRunDependency"] = (function() {
            abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["removeRunDependency"]) Module["removeRunDependency"] = (function() {
            abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["FS"]) Module["FS"] = (function() {
            abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["FS_createFolder"]) Module["FS_createFolder"] = (function() {
            abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["FS_createPath"]) Module["FS_createPath"] = (function() {
            abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["FS_createDataFile"]) Module["FS_createDataFile"] = (function() {
            abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["FS_createPreloadedFile"]) Module["FS_createPreloadedFile"] = (function() {
            abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["FS_createLazyFile"]) Module["FS_createLazyFile"] = (function() {
            abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["FS_createLink"]) Module["FS_createLink"] = (function() {
            abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["FS_createDevice"]) Module["FS_createDevice"] = (function() {
            abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["FS_unlink"]) Module["FS_unlink"] = (function() {
            abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
        });
        if (!Module["GL"]) Module["GL"] = (function() {
            abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["staticAlloc"]) Module["staticAlloc"] = (function() {
            abort("'staticAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["dynamicAlloc"]) Module["dynamicAlloc"] = (function() {
            abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["warnOnce"]) Module["warnOnce"] = (function() {
            abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["loadDynamicLibrary"]) Module["loadDynamicLibrary"] = (function() {
            abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["loadWebAssemblyModule"]) Module["loadWebAssemblyModule"] = (function() {
            abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["getLEB"]) Module["getLEB"] = (function() {
            abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["getFunctionTables"]) Module["getFunctionTables"] = (function() {
            abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["alignFunctionTables"]) Module["alignFunctionTables"] = (function() {
            abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["registerFunctions"]) Module["registerFunctions"] = (function() {
            abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["addFunction"]) Module["addFunction"] = (function() {
            abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["removeFunction"]) Module["removeFunction"] = (function() {
            abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["getFuncWrapper"]) Module["getFuncWrapper"] = (function() {
            abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["prettyPrint"]) Module["prettyPrint"] = (function() {
            abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["makeBigInt"]) Module["makeBigInt"] = (function() {
            abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["dynCall"]) Module["dynCall"] = (function() {
            abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["getCompilerSetting"]) Module["getCompilerSetting"] = (function() {
            abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["stackSave"]) Module["stackSave"] = (function() {
            abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["stackRestore"]) Module["stackRestore"] = (function() {
            abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["stackAlloc"]) Module["stackAlloc"] = (function() {
            abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["establishStackSpace"]) Module["establishStackSpace"] = (function() {
            abort("'establishStackSpace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["print"]) Module["print"] = (function() {
            abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        if (!Module["printErr"]) Module["printErr"] = (function() {
            abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        });
        Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
        if (!Module["ALLOC_STACK"]) Object.defineProperty(Module, "ALLOC_STACK", {
            get: (function() {
                abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
            })
        });
        if (!Module["ALLOC_STATIC"]) Object.defineProperty(Module, "ALLOC_STATIC", {
            get: (function() {
                abort("'ALLOC_STATIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
            })
        });
        if (!Module["ALLOC_DYNAMIC"]) Object.defineProperty(Module, "ALLOC_DYNAMIC", {
            get: (function() {
                abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
            })
        });
        if (!Module["ALLOC_NONE"]) Object.defineProperty(Module, "ALLOC_NONE", {
            get: (function() {
                abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
            })
        });

        function ExitStatus(status) {
            this.name = "ExitStatus";
            this.message = "Program terminated with exit(" + status + ")";
            this.status = status;
        }
        ExitStatus.prototype = new Error;
        ExitStatus.prototype.constructor = ExitStatus;
        dependenciesFulfilled = function runCaller() {
            if (!Module["calledRun"]) run();
            if (!Module["calledRun"]) dependenciesFulfilled = runCaller;
        };

        function run(args) {
            args = args || Module["arguments"];
            if (runDependencies > 0) {
                return
            }
            writeStackCookie();
            preRun();
            if (runDependencies > 0) return;
            if (Module["calledRun"]) return;

            function doRun() {
                if (Module["calledRun"]) return;
                Module["calledRun"] = true;
                if (ABORT) return;
                ensureInitRuntime();
                preMain();
                if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                assert(!Module["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
                postRun();
            }
            if (Module["setStatus"]) {
                Module["setStatus"]("Running...");
                setTimeout((function() {
                    setTimeout((function() {
                        Module["setStatus"]("");
                    }), 1);
                    doRun();
                }), 1);
            } else {
                doRun();
            }
            checkStackCookie();
        }
        Module["run"] = run;
        var abortDecorators = [];

        function abort(what) {
            if (Module["onAbort"]) {
                Module["onAbort"](what);
            }
            if (what !== undefined) {
                out(what);
                err(what);
                what = JSON.stringify(what);
            } else {
                what = "";
            }
            ABORT = true;
            var extra = "";
            var output = "abort(" + what + ") at " + stackTrace() + extra;
            if (abortDecorators) {
                abortDecorators.forEach((function(decorator) {
                    output = decorator(output, what);
                }));
            }
            throw output
        }
        Module["abort"] = abort;
        if (Module["preInit"]) {
            if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
            while (Module["preInit"].length > 0) {
                Module["preInit"].pop()();
            }
        }
        Module["noExitRuntime"] = true;
        run();
      };

      const KB = 1024 * 1024;
      const MB = 1024 * KB;
      const GB = 1024 * MB;
      const WASM_PAGE_SIZE = 64 * 1024;

      const totalMemory = (2*GB - 64*KB) / 1024 / WASM_PAGE_SIZE;
      const mem = args.mem || +(1024);
      const initialMemory = Math.min(Math.max(Math.ceil(mem * 1024 / WASM_PAGE_SIZE), 256) + 256, totalMemory);
      const wasmMemory = new WebAssembly.Memory({
          initial: initialMemory,
          maximum: totalMemory
      });

      g.Module = {
          print: console.log,
          printErr: console.error,
          setStatus: console.log,
          wasmBinary: null,
          // wasmBinaryFile: root + 'dist/argon2.wasm',
          locateFile: function(file) { return (args.distPath || '') + '/' + file; }
      };

      return new Promise((resolve, reject) => {
          g.Module.onRuntimeInitialized = function() {
              try {
                  resolve(calcHash(args));
              } catch(e) {
                  reject(e);
              }
          };

          if (isBrowser) {
            let wasmBinaryBase64 = "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AAAABQAAAAoAAAACAAAACAAAAAQAAAAHAAAABgAAAAEAAAAFAAAADwAAAAsAAAAJAAAADgAAAAMAAAAMAAAADQBBxA0LmwkBAAAAAgAAAAMAAAAEAAAABQAAAAYAAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAAOAAAACgAAAAQAAAAIAAAACQAAAA8AAAANAAAABgAAAAEAAAAMAAAAAAAAAAIAAAALAAAABwAAAAUAAAADAAAAYXJnb24yZABBcmdvbjJkAGFyZ29uMmkAQXJnb24yaQBhcmdvbjJpZABBcmdvbjJpZABhcmdvbjJ1AEFyZ29uMnUAVW5rbm93biBlcnJvciBjb2RlAFRoZSBwYXNzd29yZCBkb2VzIG5vdCBtYXRjaCB0aGUgc3VwcGxpZWQgaGFzaABTb21lIG9mIGVuY29kZWQgcGFyYW1ldGVycyBhcmUgdG9vIGxvbmcgb3IgdG9vIHNob3J0AFRocmVhZGluZyBmYWlsdXJlAERlY29kaW5nIGZhaWxlZABFbmNvZGluZyBmYWlsZWQATWlzc2luZyBhcmd1bWVudHMAVG9vIG1hbnkgdGhyZWFkcwBOb3QgZW5vdWdoIHRocmVhZHMAT3V0cHV0IHBvaW50ZXIgbWlzbWF0Y2gAVGhlcmUgaXMgbm8gc3VjaCB2ZXJzaW9uIG9mIEFyZ29uMgBBcmdvbjJfQ29udGV4dCBjb250ZXh0IGlzIE5VTEwAVGhlIGFsbG9jYXRlIG1lbW9yeSBjYWxsYmFjayBpcyBOVUxMAFRoZSBmcmVlIG1lbW9yeSBjYWxsYmFjayBpcyBOVUxMAE1lbW9yeSBhbGxvY2F0aW9uIGVycm9yAEFzc29jaWF0ZWQgZGF0YSBwb2ludGVyIGlzIE5VTEwsIGJ1dCBhZCBsZW5ndGggaXMgbm90IDAAU2VjcmV0IHBvaW50ZXIgaXMgTlVMTCwgYnV0IHNlY3JldCBsZW5ndGggaXMgbm90IDAAU2FsdCBwb2ludGVyIGlzIE5VTEwsIGJ1dCBzYWx0IGxlbmd0aCBpcyBub3QgMABQYXNzd29yZCBwb2ludGVyIGlzIE5VTEwsIGJ1dCBwYXNzd29yZCBsZW5ndGggaXMgbm90IDAAVG9vIG1hbnkgbGFuZXMAVG9vIGZldyBsYW5lcwBNZW1vcnkgY29zdCBpcyB0b28gbGFyZ2UATWVtb3J5IGNvc3QgaXMgdG9vIHNtYWxsAFRpbWUgY29zdCBpcyB0b28gbGFyZ2UAVGltZSBjb3N0IGlzIHRvbyBzbWFsbABTZWNyZXQgaXMgdG9vIGxvbmcAU2VjcmV0IGlzIHRvbyBzaG9ydABBc3NvY2lhdGVkIGRhdGEgaXMgdG9vIGxvbmcAQXNzb2NpYXRlZCBkYXRhIGlzIHRvbyBzaG9ydABTYWx0IGlzIHRvbyBsb25nAFNhbHQgaXMgdG9vIHNob3J0AFBhc3N3b3JkIGlzIHRvbyBsb25nAFBhc3N3b3JkIGlzIHRvbyBzaG9ydABPdXRwdXQgaXMgdG9vIGxvbmcAT3V0cHV0IGlzIHRvbyBzaG9ydABPdXRwdXQgcG9pbnRlciBpcyBOVUxMAE9LADAxMjM0NTY3ODk=";
            g.Module['wasmBinary'] = base64js.toByteArray(wasmBinaryBase64);

          } else {
            Module = argon2;
          }

          runDist(g.Module);
      }).catch(err => {
        console.log(err);
      });
  }

  function calcHash(arg) {
      if (!Module._argon2_hash) {
          return console.error('Error: _argon2_hash not available');
      }
      var t_cost = arg && arg.time || 10;
      var m_cost = arg && arg.mem || 1024;
      var parallelism = arg && arg.parallelism || 1;
      var pwd = allocateArray(arg && arg.pass || 'password');
      var pwdlen = arg && arg.pass ? arg.pass.length : 8;
      var salt = allocateArray(arg && arg.salt || 'somesalt');
      var saltlen = arg && arg.salt ? arg.salt.length : 8;
      var hash = Module.allocate(new Array(arg && arg.hashLen || 32), 'i8', Module.ALLOC_NORMAL);
      var hashlen = arg && arg.hashLen || 32;
      var encoded = Module.allocate(new Array(512), 'i8', Module.ALLOC_NORMAL);
      var encodedlen = 512;
      var argon2_type = arg && arg.type || 0;
      var version = 0x13;
      var err;
      try {
          var res = Module._argon2_hash(t_cost, m_cost, parallelism, pwd, pwdlen, salt, saltlen,
              hash, hashlen, encoded, encodedlen,
              argon2_type, version);
      } catch (e) {
          err = e;
      }
      var result;
      if (res === 0 && !err) {
          var hashStr = '';
          var hashArr = new Uint8Array(hashlen);
          for (var i = 0; i < hashlen; i++) {
              var byte = Module.HEAP8[hash + i];
              hashArr[i] = byte;
              hashStr += ('0' + (0xFF & byte).toString(16)).slice(-2);
          }
          var encodedStr = Module.Pointer_stringify(encoded);
          result = { hash: hashArr, hashHex: hashStr, encoded: encodedStr };
      } else {
          try {
              if (!err) {
                  err = Module.Pointer_stringify(Module._argon2_error_message(res));
              }
          } catch (e) {
          }
          result = { message: err, code: res };
      }
      try {
          Module._free(pwd);
          Module._free(salt);
          Module._free(hash);
          Module._free(encoded);
      } catch (e) { }
      if (err) {
          throw result;
      } else {
          return result;
      }
  }

  function allocateArray(strOrArr) {
      var arr = strOrArr instanceof Uint8Array || strOrArr instanceof Array ? strOrArr
          : Module.intArrayFromString(strOrArr);
      return Module.allocate(arr, 'i8', Module.ALLOC_NORMAL);
  }

  return argon2$$1;
});
});

// export function myAdd(a, b) {
//   return a + b;
// }

// import crypto from 'isomorphic-webcrypto'


// argon2({
//   pass: 'supfam', // string or Uint8Array
//   salt: 'urbitkeygen',
//   distPath: 'dist',
// }).then(console.log)

// import bip32 from 'bip32';
// import nacl from 'tweetnacl';
// import {bip32} from 'bip32'
// let bip32 = require('bip32')
// let nacl = require('tweetnacl')

// const buf2hex = buffer => {
//   return Array.from(new Uint8Array(buffer))
//     .map(b => b.toString(16).padStart(2, '0'))
//     .join('');
// };
//
// function hash() {
//   // any number of arguments
//   return crypto.subtle.digest(
//     { name: 'SHA-512' },
//     Buffer.concat(Array.from(arguments).map(Buffer.from))
//   );
// }
//
// function argon2u(entropy, ticketSize) {
//   return argon2({
//     pass: entropy, // string or Uint8Array
//     salt: 'urbitkeygen',
//     type: 10, // argon2.ArgonType.Argon2u,
//     hashLen: +ticketSize,
//     distPath: 'node_modules/argon2-wasm/dist',
//     parallelism: +4,
//     mem: +512000,
//     time: +1,
//   });
// }
//
// async function childSeedFromSeed(
//   seed,
//   type,
//   revision,
//   ship,
//   password // Uint8Array, string, ...
// ) {
//   let salt = type + '-' + revision;
//   if (typeof ship === 'number') salt = salt + '-' + ship;
//   //TODO the Buffer.from is needed for ArrayBuffer seeds, but... why?
//   //     we already to Buffer.from within hash()...
//   return (await hash(Buffer.from(seed), salt, password || '')).slice(
//     0,
//     seed.length || seed.byteLength
//   );
// }
//
// async function walletFromSeed(seed, password) {
//   // we hash the seed with SHA-512 before doing BIP32 wallet generation,
//   // because BIP32 doesn't support seeds of bit-lengths < 128 or > 512.
//   let wallet = bip32.fromSeed(
//     Buffer.from(
//       //TODO why Buffer.from? also see childSeedFromSeed().
//       await hash(Buffer.from(seed), password || '')
//     )
//   );
//   return {
//     public: buf2hex(wallet.publicKey),
//     private: buf2hex(wallet.privateKey),
//     chain: buf2hex(wallet.chainCode),
//   };
// }
//
// // matches ++pit:nu:crub:crypto
// function urbitKeysFromSeed(seed, password) {
//   seed = Buffer.concat([seed, Buffer.from(password || '')]);
//   let hash = [];
//   nacl.lowlevel.crypto_hash(hash, seed.reverse(), seed.length);
//   let c = hash.slice(32);
//   let a = hash.slice(0, 32);
//   let crypt = nacl.sign.keyPair.fromSeed(Buffer.from(c));
//   let auth = nacl.sign.keyPair.fromSeed(Buffer.from(a));
//   return {
//     crypt: {
//       private: buf2hex(c.reverse()),
//       public: buf2hex(crypt.publicKey.reverse()),
//     },
//     auth: {
//       private: buf2hex(a.reverse()),
//       public: buf2hex(auth.publicKey.reverse()),
//     },
//   };
// }
//
// async function childNodeFromSeed(seed, type, revision, ship, password) {
//   let result = {};
//   revision = revision || 0;
//
//   result.meta = { type: type, revision: revision };
//   if (typeof ship !== 'undefined' && ship !== null) result.meta.ship = ship;
//   let childSeed = await childSeedFromSeed(seed, type, revision, ship, password);
//   result.seed = buf2hex(childSeed);
//   result.keys = await walletFromSeed(childSeed, password);
//   return result;
// }
//
// async function fullWalletFromTicket(ticket, seedSize, ships, password, revs) {
//   let ownerSeed = Buffer.from((await argon2u(ticket, seedSize)).hash);
//   return fullWalletFromSeed(ownerSeed, ships, password, revs);
// }
//
// async function fullWalletFromSeed(ownerSeed, ships, password, revisions) {
//   let result = {};
//   let seedSize = ownerSeed.length;
//   revisions = revisions || {};
//   revisions.transfer = revisions.transfer || 0;
//   revisions.spawn = revisions.spawn || 0;
//   revisions.delegate = revisions.delegate || 0;
//   revisions.manage = revisions.manage || 0;
//   revisions.network = revisions.network || 0;
//
//   result.owner = {};
//   result.owner.seed = buf2hex(ownerSeed);
//   let ownerPromise = walletFromSeed(ownerSeed, password);
//
//   let delegatePromise = childNodeFromSeed(
//     ownerSeed,
//     'delegate',
//     revisions.delegate,
//     null,
//     password
//   );
//
//   let manageSeed = await childSeedFromSeed(
//     ownerSeed,
//     'manage',
//     revisions.manage,
//     null,
//     password
//   );
//   result.manage = {};
//   result.manage.meta = { type: 'manage', revision: revisions.manage };
//   result.manage.seed = buf2hex(manageSeed);
//   let managePromise = walletFromSeed(manageSeed, password);
//
//   result.transfer = [];
//   result.spawn = [];
//   result.network = [];
//   let transferPromises = [];
//   let spawnPromises = [];
//   let networkPromises = [];
//   for (i = 0; i < ships.length; i++) {
//     let ship = ships[i];
//
//     transferPromises[i] = childNodeFromSeed(
//       ownerSeed,
//       'transfer',
//       revisions.transfer,
//       ship,
//       password
//     );
//
//     spawnPromises[i] = childNodeFromSeed(
//       ownerSeed,
//       'spawn',
//       revisions.spawn,
//       ship,
//       password
//     );
//
//     result.network[i] = {};
//     result.network[i].meta = {
//       type: 'network',
//       revision: revisions.network,
//       ship: ship,
//     };
//     networkPromises[i] = childSeedFromSeed(
//       manageSeed,
//       'network',
//       revisions.network,
//       ship,
//       password
//     );
//   }
//
//   result.owner.keys = await ownerPromise;
//   result.delegate = await delegatePromise;
//   result.manage.keys = await managePromise;
//
//   for (i = 0; i < ships.length; i++) {
//     result.transfer[i] = await transferPromises[i];
//     result.spawn[i] = await spawnPromises[i];
//
//     let networkSeed = await networkPromises[i];
//     result.network[i].seed = buf2hex(networkSeed);
//     result.network[i].keys = urbitKeysFromSeed(
//       Buffer.from(networkSeed),
//       password
//     );
//   }
//
//   return result;
// }
//
// module.exports = {
//   fullWalletFromTicket,
//   fullWalletFromSeed,
//   childNodeFromSeed,
//   childSeedFromSeed,
//   walletFromSeed,
//   urbitKeysFromSeed,
// };

exports.argon2 = argon2$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
