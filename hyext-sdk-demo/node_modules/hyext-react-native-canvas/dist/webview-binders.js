Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webviewEvents = exports.webviewProperties = exports.webviewMethods = exports.webviewConstructor = exports.webviewTarget = exports.constructors = exports.WEBVIEW_TARGET = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _construct(Parent, args, Class) { if (typeof Reflect !== "undefined" && Reflect.construct) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Parent.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var WEBVIEW_TARGET = '@@WEBVIEW_TARGET';
exports.WEBVIEW_TARGET = WEBVIEW_TARGET;
var constructors = {};
exports.constructors = constructors;

var webviewTarget = function webviewTarget(targetName) {
  return function (target) {
    target.prototype[WEBVIEW_TARGET] = targetName;
  };
};

exports.webviewTarget = webviewTarget;

var ID = function ID() {
  return Math.random().toString(32).slice(2);
};

var SPECIAL_CONSTRUCTOR = {
  ImageData: {
    className: 'Uint8ClampedArray',
    paramNum: 0
  }
};

var webviewConstructor = function webviewConstructor(constructorName) {
  return function (target) {
    constructors[constructorName] = target;

    target.constructLocally = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _construct(target, args.concat([true]));
    };

    target.prototype.onConstruction = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (SPECIAL_CONSTRUCTOR[constructorName] !== undefined) {
        var _SPECIAL_CONSTRUCTOR$ = SPECIAL_CONSTRUCTOR[constructorName],
            className = _SPECIAL_CONSTRUCTOR$.className,
            paramNum = _SPECIAL_CONSTRUCTOR$.paramNum;
        args[paramNum] = {
          className: className,
          classArgs: [args[paramNum]]
        };
      }

      this[WEBVIEW_TARGET] = ID();
      this.postMessage({
        type: 'construct',
        payload: {
          constructor: constructorName,
          id: this[WEBVIEW_TARGET],
          args: args
        }
      });
    };

    target.prototype.toJSON = function () {
      return {
        __ref__: this[WEBVIEW_TARGET]
      };
    };
  };
};

exports.webviewConstructor = webviewConstructor;

var webviewMethods = function webviewMethods(methods) {
  return function (target) {
    var _loop = function _loop(method) {
      target.prototype[method] = function () {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return this.postMessage({
          type: 'exec',
          payload: {
            target: this[WEBVIEW_TARGET],
            method: method,
            args: args
          }
        });
      };
    };

    for (var _iterator = methods, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var method = _ref;

      _loop(method);
    }
  };
};

exports.webviewMethods = webviewMethods;

var webviewProperties = function webviewProperties(properties) {
  return function (target) {
    var _loop2 = function _loop2(key) {
      var initialValue = properties[key];
      var privateKey = "__" + key + "__";
      target.prototype[privateKey] = initialValue;
      Object.defineProperty(target.prototype, key, {
        get: function get() {
          return this[privateKey];
        },
        set: function set(value) {
          this.postMessage({
            type: 'set',
            payload: {
              target: this[WEBVIEW_TARGET],
              key: key,
              value: value
            }
          });

          if (this.forceUpdate) {
            this.forceUpdate();
          }

          return this[privateKey] = value;
        }
      });
    };

    var _arr = Object.keys(properties);

    for (var _i2 = 0; _i2 < _arr.length; _i2++) {
      var key = _arr[_i2];

      _loop2(key);
    }
  };
};

exports.webviewProperties = webviewProperties;

var webviewEvents = function webviewEvents(types) {
  return function (target) {
    var onConstruction = target.prototype.onConstruction;

    target.prototype.onConstruction = function () {
      if (onConstruction) {
        onConstruction.call(this);
      }

      this.postMessage({
        type: 'listen',
        payload: {
          types: types,
          target: this[WEBVIEW_TARGET]
        }
      });
    };

    target.prototype.addEventListener = function (type, callback) {
      var _this = this;

      this.addMessageListener(function (message) {
        if (message && message.type === 'event' && message.payload.target[WEBVIEW_TARGET] === _this[WEBVIEW_TARGET] && message.payload.type === type) {
          for (var key in message.payload.target) {
            var value = message.payload.target[key];

            if (key in _this && _this[key] !== value) {
              _this[key] = value;
            }
          }

          callback(_objectSpread({}, message.payload, {
            target: _this
          }));
        }
      });
    };
  };
};

exports.webviewEvents = webviewEvents;