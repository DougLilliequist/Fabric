// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../vendor/ogl/src/math/functions/Vec3Func.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.length = length;
exports.copy = copy;
exports.set = set;
exports.add = add;
exports.subtract = subtract;
exports.multiply = multiply;
exports.divide = divide;
exports.scale = scale;
exports.distance = distance;
exports.squaredDistance = squaredDistance;
exports.squaredLength = squaredLength;
exports.negate = negate;
exports.inverse = inverse;
exports.normalize = normalize;
exports.dot = dot;
exports.cross = cross;
exports.lerp = lerp;
exports.transformMat4 = transformMat4;
exports.scaleRotateMat4 = scaleRotateMat4;
exports.transformMat3 = transformMat3;
exports.transformQuat = transformQuat;
exports.exactEquals = exactEquals;
exports.angle = void 0;
var EPSILON = 0.000001;
/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */


function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
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
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */


function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */


function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */


function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */


function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */


function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */


function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */


function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */


function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
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
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
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
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Same as above but doesn't apply translation.
 * Useful for rays.
 */


function scaleRotateMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */


function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */


function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var x = a[0],
      y = a[1],
      z = a[2];
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var uvx = qy * z - qz * y;
  var uvy = qz * x - qx * z;
  var uvz = qx * y - qy * x;
  var uuvx = qy * uvz - qz * uvy;
  var uuvy = qz * uvx - qx * uvz;
  var uuvz = qx * uvy - qy * uvx;
  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */


var angle = function () {
  var tempA = [0, 0, 0];
  var tempB = [0, 0, 0];
  return function (a, b) {
    copy(tempA, a);
    copy(tempB, b);
    normalize(tempA, tempA);
    normalize(tempB, tempB);
    var cosine = dot(tempA, tempB);

    if (cosine > 1.0) {
      return 0;
    } else if (cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  };
}();
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


exports.angle = angle;

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
},{}],"../vendor/ogl/src/math/Vec3.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vec3 = void 0;

var Vec3Func = _interopRequireWildcard(require("./functions/Vec3Func.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Vec3 = /*#__PURE__*/function (_Array) {
  _inherits(Vec3, _Array);

  var _super = _createSuper(Vec3);

  function Vec3() {
    var _this;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;

    _classCallCheck(this, Vec3);

    _this = _super.call(this, x, y, z);
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(Vec3, [{
    key: "set",
    value: function set(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
      var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
      if (x.length) return this.copy(x);
      Vec3Func.set(this, x, y, z);
      return this;
    }
  }, {
    key: "copy",
    value: function copy(v) {
      Vec3Func.copy(this, v);
      return this;
    }
  }, {
    key: "add",
    value: function add(va, vb) {
      if (vb) Vec3Func.add(this, va, vb);else Vec3Func.add(this, this, va);
      return this;
    }
  }, {
    key: "sub",
    value: function sub(va, vb) {
      if (vb) Vec3Func.subtract(this, va, vb);else Vec3Func.subtract(this, this, va);
      return this;
    }
  }, {
    key: "multiply",
    value: function multiply(v) {
      if (v.length) Vec3Func.multiply(this, this, v);else Vec3Func.scale(this, this, v);
      return this;
    }
  }, {
    key: "divide",
    value: function divide(v) {
      if (v.length) Vec3Func.divide(this, this, v);else Vec3Func.scale(this, this, 1 / v);
      return this;
    }
  }, {
    key: "inverse",
    value: function inverse() {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
      Vec3Func.inverse(this, v);
      return this;
    } // Can't use 'length' as Array.prototype uses it

  }, {
    key: "len",
    value: function len() {
      return Vec3Func.length(this);
    }
  }, {
    key: "distance",
    value: function distance(v) {
      if (v) return Vec3Func.distance(this, v);else return Vec3Func.length(this);
    }
  }, {
    key: "squaredLen",
    value: function squaredLen() {
      return Vec3Func.squaredLength(this);
    }
  }, {
    key: "squaredDistance",
    value: function squaredDistance(v) {
      if (v) return Vec3Func.squaredDistance(this, v);else return Vec3Func.squaredLength(this);
    }
  }, {
    key: "negate",
    value: function negate() {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
      Vec3Func.negate(this, v);
      return this;
    }
  }, {
    key: "cross",
    value: function cross(va, vb) {
      if (vb) Vec3Func.cross(this, va, vb);else Vec3Func.cross(this, this, va);
      return this;
    }
  }, {
    key: "scale",
    value: function scale(v) {
      Vec3Func.scale(this, this, v);
      return this;
    }
  }, {
    key: "normalize",
    value: function normalize() {
      Vec3Func.normalize(this, this);
      return this;
    }
  }, {
    key: "dot",
    value: function dot(v) {
      return Vec3Func.dot(this, v);
    }
  }, {
    key: "equals",
    value: function equals(v) {
      return Vec3Func.exactEquals(this, v);
    }
  }, {
    key: "applyMatrix4",
    value: function applyMatrix4(mat4) {
      Vec3Func.transformMat4(this, this, mat4);
      return this;
    }
  }, {
    key: "scaleRotateMatrix4",
    value: function scaleRotateMatrix4(mat4) {
      Vec3Func.scaleRotateMat4(this, this, mat4);
      return this;
    }
  }, {
    key: "applyQuaternion",
    value: function applyQuaternion(q) {
      Vec3Func.transformQuat(this, this, q);
      return this;
    }
  }, {
    key: "angle",
    value: function angle(v) {
      return Vec3Func.angle(this, v);
    }
  }, {
    key: "lerp",
    value: function lerp(v, t) {
      Vec3Func.lerp(this, this, v, t);
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Vec3(this[0], this[1], this[2]);
    }
  }, {
    key: "fromArray",
    value: function fromArray(a) {
      var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this[0] = a[o];
      this[1] = a[o + 1];
      this[2] = a[o + 2];
      return this;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      a[o] = this[0];
      a[o + 1] = this[1];
      a[o + 2] = this[2];
      return a;
    }
  }, {
    key: "transformDirection",
    value: function transformDirection(mat4) {
      var x = this[0];
      var y = this[1];
      var z = this[2];
      this[0] = mat4[0] * x + mat4[4] * y + mat4[8] * z;
      this[1] = mat4[1] * x + mat4[5] * y + mat4[9] * z;
      this[2] = mat4[2] * x + mat4[6] * y + mat4[10] * z;
      return this.normalize();
    }
  }, {
    key: "x",
    get: function get() {
      return this[0];
    },
    set: function set(v) {
      this[0] = v;
    }
  }, {
    key: "y",
    get: function get() {
      return this[1];
    },
    set: function set(v) {
      this[1] = v;
    }
  }, {
    key: "z",
    get: function get() {
      return this[2];
    },
    set: function set(v) {
      this[2] = v;
    }
  }]);

  return Vec3;
}( /*#__PURE__*/_wrapNativeSuper(Array));

exports.Vec3 = Vec3;
},{"./functions/Vec3Func.js":"../vendor/ogl/src/math/functions/Vec3Func.js"}],"World3d/VerletTrianglesWorker/threads/simulationThread.js":[function(require,module,exports) {
var _require = require("../../../../vendor/ogl/src/math/Vec3"),
    Vec3 = _require.Vec3;

self.onmessage = function (event) {
  var state = event.data[0];

  switch (state) {
    case "init":
      init(event.data[1]);
      break;

    case "simulate":
      simulate(event.data[1]);
      break;

    default:
      console.error("input event does not exist");
      break;
  }
};

init = function init(eventData) {
  self.timestep = 18.0 / 1000.0; //I suppose self is hardcoded delta time, from what I could gather from logging delta time

  self.timeStepSQ = self.timestep * self.timestep;
  self.windForce = new Vec3(0.0, 0.0, 0.0);
  self.forceDir = new Vec3(0.0, 0.0, 0.0);
  self.toAttractionPoint = new Vec3(0.0, 0.0, 0.0); // self.gravity = new Vec3(0.0, -0.0005, 0.0);

  self.gravity = new Vec3(0.0, 0, 0.0);
  self.t = 0;
  var inputGeoAttribData = eventData.inputGeoAttribData,
      widthSegments = eventData.widthSegments,
      heightSegments = eventData.heightSegments;
  self.widthSegments = widthSegments;
  self.heightSegments = heightSegments;
  self.faces = []; //will be used for normals

  self.particles = [];
  self.sticks = [];
  var position = inputGeoAttribData.position,
      index = inputGeoAttribData.index; //have each vertex in the plane act as a particle that we apply physics to
  //and later update plane's local positions with the said data

  var topRightIndex = self.widthSegments;
  var topLeftIndex = 0;
  var bottomLeftIndex = (self.heightSegments + 1) * self.widthSegments;
  var bottomRightIndex = (self.heightSegments + 1) * (self.widthSegments + 1) - 1.0;

  for (var i = 0; i < position.length / 3; i++) {
    var x = position[i * 3 + 0];
    var y = position[i * 3 + 1];
    var z = position[i * 3 + 2];
    var offsetX = Math.random() * 2.0 - 1.0;
    var offsetY = Math.random() * 2.0 - 1.0;
    var offsetZ = Math.random() * 2.0 - 1.0;
    self.particles.push({
      currentPos: new Vec3(x, y, z),
      prevPos: new Vec3(x + offsetX * 0, y + offsetY * 0, z + offsetZ * 0),
      tmpPos: new Vec3(0.0, 0.0, 0.0),
      delta: new Vec3(0.0, 0.0, 0.0),
      normal: new Vec3(0.0, 0.0, 0.0),
      acc: new Vec3(0.0, 0.0, 0.0),
      // pinned: false
      pinned: i === topLeftIndex || i === topRightIndex || i === bottomRightIndex || i === bottomLeftIndex ? true : false //the conditions assumes index points at vertices that are on top row
      // pinned: i === topLeftIndex || i === topRightIndex ? true : false //the conditions assumes index points at vertices that are on top row
      // pinned: i === topLeftIndex ? true : false //the conditions assumes index points at vertices that are on top row
      // pinned: false //the conditions assumes index points at vertices that are on top row

    });
  }

  self.cb = new Vec3(0.0, 0.0, 0.0);
  self.ab = new Vec3(0.0, 0.0, 0.0); //compute faces

  for (var _i = 0; _i < index.length; _i += 3) {
    var indexA = index[_i];
    var indexB = index[_i + 1];
    var indexC = index[_i + 2];
    self.faces.push({
      a: indexA,
      b: indexB,
      c: indexC
    });
  } //init sticks which contains neighbours on the vertical and horizontal axis
  //  0 - 1 - 2 - 3
  //  |   |   |   |
  //  4 - 5 - 6 - 7
  //  |   |   |   |
  //  8 - 9 - 10 -11
  //  |   |   |   |
  //  12 -13 -14 -15
  // horizontal sticks


  var indexOffset = 0;

  for (var _y = 0; _y < self.heightSegments + 1; _y++) {
    indexOffset = _y * (self.heightSegments + 1);

    for (var _x = 0; _x < self.widthSegments; _x++) {
      var _index = _x + indexOffset;

      var pointA = self.particles[_index].currentPos;
      var pointB = self.particles[_index + 1].currentPos;
      var restLength = pointB.distance(pointA);
      self.sticks.push({
        pointA: _index,
        pointB: _index + 1,
        delta: new Vec3(0.0, 0.0, 0.0),
        restLength: restLength
      });
    }
  } //vertical sticks


  indexOffset = 0;

  for (var _x2 = 0; _x2 < self.widthSegments + 1; _x2++) {
    indexOffset = _x2 * self.widthSegments;

    for (var _y2 = 0; _y2 < self.heightSegments; _y2++) {
      var _index2 = _y2 + indexOffset;

      var _pointA = self.particles[_index2].currentPos;
      var _pointB = self.particles[_index2 + self.widthSegments + 1].currentPos;

      var _restLength = _pointB.distance(_pointA);

      self.sticks.push({
        pointA: _index2,
        pointB: _index2 + (self.widthSegments + 1),
        delta: new Vec3(0.0, 0.0, 0.0),
        restLength: _restLength
      });
    }
  }

  updateNormals();
  postMessage(self.particles);
};

simulate = function simulate(eventData) {
  var windForce = eventData.windForce,
      isInteracting = eventData.isInteracting,
      attractionPoint = eventData.attractionPoint; // applyWindForce({windForce});

  applyVerlet();
  applyConstraints();
  if (isInteracting) applyInputForce({
    attractionPoint: attractionPoint
  });
  updateNormals();
  postMessage(self.particles);
};

applyInputForce = function applyInputForce(_ref) {
  var attractionPoint = _ref.attractionPoint;
  var minDistSq = 0.1 * 0.1;
  console.log(attractionPoint);
  self.particles.forEach(function (particle) {
    self.toAttractionPoint.set(attractionPoint[0], attractionPoint[1], attractionPoint[2]).sub(particle.currentPos);
    var distSq = self.toAttractionPoint.squaredLen();

    if (distSq < minDistSq) {
      console.log(self.toAttractionPoint);
      particle.currentPos.add(self.toAttractionPoint.normalize() * 0.5);
    }
  });
};

applyWindForce = function applyWindForce(_ref2) {
  var windForce = _ref2.windForce;
  self.particles.forEach(function (particle) {
    self.forceDir.copy(particle.normal).normalize().multiply(particle.normal.dot(windForce));
    particle.acc.add(self.forceDir);
    particle.acc.add(self.gravity);
  });
};

applyVerlet = function applyVerlet() {
  for (var i = 0; i < self.particles.length; i++) {
    var particle = self.particles[i];
    if (particle.pinned) continue;
    particle.tmpPos.copy(particle.currentPos);
    particle.delta.sub(particle.currentPos, particle.prevPos);
    particle.delta.multiply(1.0);
    particle.currentPos.add(particle.delta);
    particle.currentPos.add(particle.acc);
    particle.prevPos.copy(particle.tmpPos);
    particle.acc.multiply(0.0);
  }
};

applyConstraints = function applyConstraints() {
  for (var i = 0; i < self.sticks.length; i++) {
    var stick = self.sticks[i]; // let delta = self.particles[stick.pointB].currentPos.clone().sub(self.particles[stick.pointA].currentPos);

    stick.delta.sub(self.particles[stick.pointB].currentPos, self.particles[stick.pointA].currentPos);
    var distSq = stick.delta.squaredLen(); //let dist = stick.delta.len();

    if (distSq === 0.0) continue; //we don't want to divide by 0...
    // let percentage = dist / (dist + (stick.restLength * stick.restLength));
    //let percentage = (stick.restLength - dist) / dist; //dist should be equal to rest length when "restored"

    var percentage = stick.restLength * stick.restLength / (distSq + stick.restLength * stick.restLength); //the correct way of using squared numbers

    percentage -= 0.5;
    stick.delta.multiply(percentage);

    if (self.particles[stick.pointA].pinned === false) {
      self.particles[stick.pointA].currentPos.sub(stick.delta);
    }

    if (self.particles[stick.pointB].pinned === false) {
      self.particles[stick.pointB].currentPos.add(stick.delta);
    }
  }
}; //based on: https://www.iquilezles.org/www/articles/normals/normals.htm
//used on THREE's example, but instead of creating new vectors, I simply reset
//the normal to 0, accumleate the normal and normalize


updateNormals = function updateNormals() {
  self.particles.forEach(function (particle) {
    particle.normal.multiply(0);
  });
  self.faces.forEach(function (face) {
    var a = self.particles[face.a].currentPos;
    var b = self.particles[face.b].currentPos;
    var c = self.particles[face.c].currentPos;
    self.cb.sub(c, b);
    self.ab.sub(a, b);
    self.cb.cross(self.ab);
    self.particles[face.a].normal.add(self.cb);
    self.particles[face.b].normal.add(self.cb);
    self.particles[face.c].normal.add(self.cb);
  });
  self.particles.forEach(function (particle) {
    particle.normal.normalize();
  });
};
},{"../../../../vendor/ogl/src/math/Vec3":"../vendor/ogl/src/math/Vec3.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50442" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","World3d/VerletTrianglesWorker/threads/simulationThread.js"], null)
//# sourceMappingURL=/simulationThread.f95f5ecf.js.map