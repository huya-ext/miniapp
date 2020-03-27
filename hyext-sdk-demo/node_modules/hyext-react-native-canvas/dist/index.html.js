export default `<html><head>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scaleable=no" name="viewport">
    <style>
      html {
        -ms-content-zooming: none;
        -ms-touch-action: pan-x pan-y;
      }
      body {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      * {
        user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
      }
    </style>
  </head>
  <body>
    <script>(function () {
  if (CanvasRenderingContext2D.useSVGMatrix === void 0) {
    CanvasRenderingContext2D.useSVGMatrix = false;
  }

  CanvasRenderingContext2D.arrayToSVGMatrix = function (matrix) {
    if (matrix instanceof SVGMatrix) {
      return matrix;
    } else if (matrix instanceof Array) {
      var _matrix = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();

      _matrix.a = array[0];
      _matrix.b = array[1];
      _matrix.c = array[2];
      _matrix.d = array[3];
      _matrix.e = array[4];
      _matrix.f = array[5];
      return _matrix;
    } else {
      throw new Error('Matrix is not an Array');
    }
  };

  CanvasRenderingContext2D.svgMatrixToArray = function (matrix) {
    if (matrix instanceof Array) {
      return matrix;
    } else if (matrix instanceof SVGMatrix) {
      return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
    } else {
      throw new Error('Matrix is not a SVGMatrix');
    }
  };
})();

(function () {
  var canvasRenderingContext2DPrototype = CanvasRenderingContext2D.prototype;
  var HTMLCanvasElementPrototype = HTMLCanvasElement.prototype;

  if (!('resetTransform' in canvasRenderingContext2DPrototype)) {
    canvasRenderingContext2DPrototype.resetTransform = function () {
      this.setTransform(1, 0, 0, 1, 0, 0);
    };
  }

  if (!('currentTransform' in canvasRenderingContext2DPrototype)) {
    if ('mozCurrentTransform' in canvasRenderingContext2DPrototype) {
      Object.defineProperty(canvasRenderingContext2DPrototype, 'currentTransform', {
        get: function () {
          return this.mozCurrentTransform;
        },
        set: function (matrix) {
          this.mozCurrentTransform = matrix;
        },
        enumerable: true,
        configurable: true
      });
    } else {
      var getContext = HTMLCanvasElementPrototype.getContext;

      HTMLCanvasElementPrototype.getContext = function (contextType, contextAttributes) {
        var context = getContext.call(this, contextType, contextAttributes);

        switch (contextType) {
          case '2d':
            Object.defineProperties(context, {
              '_transformStack': {
                value: [],
                configurable: true,
                writable: true
              },
              '_transformMatrix': {
                value: [1, 0, 0, 1, 0, 0],
                configurable: true,
                writable: true
              }
            });
            break;
        }

        return context;
      };

      Object.defineProperty(canvasRenderingContext2DPrototype, 'currentTransform', {
        get: function () {
          return this._transformMatrix;
        },
        set: function (matrix) {
          this._transformMatrix = matrix;
          this.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        },
        enumerable: true,
        configurable: true
      });
      var translate = canvasRenderingContext2DPrototype.translate;

      canvasRenderingContext2DPrototype.translate = function (x, y) {
        var matrix = this._transformMatrix;
        matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
        matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
        translate.call(this, x, y);
      };

      var scale = canvasRenderingContext2DPrototype.scale;

      canvasRenderingContext2DPrototype.scale = function (x, y) {
        var matrix = this._transformMatrix;
        matrix[0] *= x;
        matrix[1] *= x;
        matrix[2] *= y;
        matrix[3] *= y;
        scale.call(this, x, y);
      };

      var rotate = canvasRenderingContext2DPrototype.rotate;

      canvasRenderingContext2DPrototype.rotate = function (angle) {
        var cosValue = Math.cos(angle);
        var sinValue = Math.sin(angle);
        var matrix = this._transformMatrix;
        this._transformMatrix = [matrix[0] * cosValue + matrix[2] * sinValue, matrix[1] * cosValue + matrix[3] * sinValue, matrix[0] * -sinValue + matrix[2] * cosValue, matrix[1] * -sinValue + matrix[3] * cosValue, matrix[4], matrix[5]];
        rotate.call(this, angle);
      };

      var transform = canvasRenderingContext2DPrototype.transform;

      canvasRenderingContext2DPrototype.transform = function (a, b, c, d, e, f) {
        var matrix = this._transformMatrix;
        this._transformMatrix = [matrix[0] * a + matrix[2] * b, matrix[1] * a + matrix[3] * b, matrix[0] * c + matrix[2] * d, matrix[1] * c + matrix[3] * d, matrix[0] * e + matrix[2] * f + matrix[4], matrix[1] * e + matrix[3] * f + matrix[5]];
        transform.call(this, a, b, c, d, e, f);
      };

      var setTransform = canvasRenderingContext2DPrototype.setTransform;

      canvasRenderingContext2DPrototype.setTransform = function (a, b, c, d, e, f) {
        this._transformMatrix = [a, b, c, d, e, f];
        setTransform.call(this, a, b, c, d, e, f);
      };

      var resetTransform = canvasRenderingContext2DPrototype.resetTransform;

      canvasRenderingContext2DPrototype.resetTransform = function () {
        this._transformMatrix = [1, 0, 0, 1, 0, 0];
        resetTransform.call(this);
      };

      var save = canvasRenderingContext2DPrototype.save;

      canvasRenderingContext2DPrototype.save = function () {
        this._transformStack.push(this._transformMatrix);

        this._transformMatrix = this._transformMatrix.slice(0, 6);
        save.call(this);
      };

      var restore = canvasRenderingContext2DPrototype.restore;

      canvasRenderingContext2DPrototype.restore = function () {
        var matrix = this._transformStack.pop();

        if (matrix) {
          this._transformMatrix = matrix;
        }

        restore.call(this);
      };
    }
  }

  var currentTransform = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'currentTransform');
  var currentTransformIsSVGMatrix = document.createElement('canvas').getContext('2d').currentTransform instanceof SVGMatrix;
  Object.defineProperty(canvasRenderingContext2DPrototype, 'currentTransform', {
    get: function () {
      var value = currentTransform.get.call(this);
      return CanvasRenderingContext2D.useSVGMatrix ? CanvasRenderingContext2D.arrayToSVGMatrix(value) : CanvasRenderingContext2D.svgMatrixToArray(value);
    },
    set: function (matrix) {
      currentTransform.set.call(this, currentTransformIsSVGMatrix ? CanvasRenderingContext2D.svgMatrixToArray(matrix) : CanvasRenderingContext2D.svgMatrixToArray(matrix));
    },
    enumerable: true,
    configurable: true
  });

  if (!('imageSmoothingEnabled' in canvasRenderingContext2DPrototype)) {
    Object.defineProperty(canvasRenderingContext2DPrototype, 'imageSmoothingEnabled', {
      get: function () {
        if (this.mozImageSmoothingEnabled !== void 0) {
          return this.mozImageSmoothingEnabled;
        } else if (this.webkitImageSmoothingEnabled !== void 0) {
          return this.webkitImageSmoothingEnabled;
        } else if (this.msImageSmoothingEnabled !== void 0) {
          return this.msImageSmoothingEnabled;
        } else {
          return true;
        }
      },
      set: function (enable) {
        if (this.mozImageSmoothingEnabled !== void 0) {
          this.mozImageSmoothingEnabled = enable;
        } else if (this.webkitImageSmoothingEnabled !== void 0) {
          this.webkitImageSmoothingEnabled = enable;
        } else if (this.msImageSmoothingEnabled !== void 0) {
          this.msImageSmoothingEnabled = enable;
        }
      },
      enumerable: true,
      configurable: true
    });
  }

  if (!('ellipse' in canvasRenderingContext2DPrototype)) {
    canvasRenderingContext2DPrototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
      this.save();
      this.translate(x, y);
      this.rotate(rotation);
      this.scale(radiusX, radiusY);
      this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
      this.restore();
    };
  }
})();

(function () {
  if (!('Path2D' in window) || !('addPath' in window.Path2D.prototype)) {
    var _Path2D = window.Path2D;

    var Path2D = function (path2D) {
      Object.defineProperty(this, '_operations', {
        value: [],
        configurable: true,
        writable: true
      });

      if (path2D instanceof Path2D) {
        if (path2D._original && _Path2D) {
          Object.defineProperty(this, '_original', {
            value: new _Path2D(path2D._original),
            configurable: true,
            writable: true
          });
          this._operations = path2D._operations.slice(0);
        } else {
          this.addPath(path2D);
        }
      } else if (_Path2D) {
        Object.defineProperty(this, '_original', {
          value: new _Path2D(path2D),
          configurable: true,
          writable: true
        });
      }
    };

    window.Path2D = Path2D;
    var path2DPrototype = Path2D.prototype;
    ['arc', 'arcTo', 'bezierCurveTo', 'closePath', 'ellipse', 'lineTo', 'moveTo', 'quadraticCurveTo', 'rect'].forEach(function (attributeName) {
      path2DPrototype[attributeName] = function () {
        this._operations.push({
          type: attributeName,
          arguments: Array.prototype.slice.call(arguments, 0)
        });

        if (this._original) _Path2D.prototype[attributeName].apply(this._original, arguments);
      };
    });
    var canvasRenderingContext2DPrototype = CanvasRenderingContext2D.prototype;
    ['fill', 'stroke', 'clip', 'isPointInPath', 'isPointInStroke'].forEach(function (attributeName) {
      var original = canvasRenderingContext2DPrototype[attributeName];

      canvasRenderingContext2DPrototype[attributeName] = function (path2D) {
        if (path2D instanceof Path2D) {
          if (path2D._original) {
            return original.apply(this, [path2D._original].concat(Array.prototype.slice.call(arguments, 1)));
          } else {
            this.beginPath();
            var operation;

            for (var i = 0, l = path2D._operations.length; i < l; i++) {
              operation = path2D._operations[i];
              canvasRenderingContext2DPrototype[operation.type].apply(this, operation.arguments);
            }

            return original.apply(this, Array.prototype.slice.call(arguments, 1));
          }
        } else {
          return original.apply(this, arguments);
        }
      };
    });

    if (!('addPath' in path2DPrototype)) {
      path2DPrototype.addPath = function (path2D, transform) {
        if (transform !== void 0) {
          if (path2D._original) delete path2D._original;

          this._operations.push({
            type: 'save',
            arguments: []
          });

          this._operations.push({
            type: 'transform',
            arguments: CanvasRenderingContext2D.svgMatrixToArray(transform)
          });
        }

        var operation;

        for (var i = 0, l = path2D._operations.length; i < l; i++) {
          operation = path2D._operations[i];
          path2DPrototype[operation.type].apply(this, operation.arguments);
        }

        if (transform !== void 0) {
          this._operations.push({
            type: 'restore',
            arguments: []
          });
        }
      };
    }
  }
})();</script>
    <script>var scale = function scale(ratio) {
  return function (item) {
    if (typeof item === 'number') {
      return item * ratio;
    }

    return item;
  };
};

window.autoScaleCanvas = function autoScaleCanvas(canvas) {
  var ctx = canvas.getContext('2d');
  var ratio = window.devicePixelRatio || 1;

  if (ratio != 1) {
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width *= ratio;
    canvas.height *= ratio;
    ctx.scale(ratio, ratio);

    ctx.isPointInPath = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return CanvasRenderingContext2D.prototype.isPointInPath.apply(ctx, args.map(scale(ratio)));
    };
  }

  return canvas;
};</script>
    <script>function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _construct(Parent, args, Class) {
  if (typeof Reflect !== "undefined" && Reflect.construct) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Parent.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if ((typeof Symbol === "function" ? Symbol.iterator : "@@iterator") in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var WEBVIEW_TARGET = '@@WEBVIEW_TARGET';

var ID = function ID() {
  return Math.random().toString(32).slice(2);
};

var flattenObjectCopyValue = function flattenObjectCopyValue(flatObj, srcObj, key) {
  var value = srcObj[key];

  if (typeof value === 'function') {
    return;
  }

  if (typeof value === 'object' && value instanceof Node) {
    return;
  }

  flatObj[key] = flattenObject(value);
};

var flattenObject = function flattenObject(object) {
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  var flatObject = {};

  for (var key in object) {
    flattenObjectCopyValue(flatObject, object, key);
  }

  for (var _key in Object.getOwnPropertyNames(object)) {
    flattenObjectCopyValue(flatObject, object, _key);
  }

  return flatObject;
};

var AutoScaledCanvas = function () {
  function AutoScaledCanvas(element) {
    _classCallCheck(this, AutoScaledCanvas);

    this.element = element;
  }

  _createClass(AutoScaledCanvas, [{
    key: "toDataURL",
    value: function toDataURL() {
      var _this$element;

      return (_this$element = this.element).toDataURL.apply(_this$element, arguments);
    }
  }, {
    key: "autoScale",
    value: function autoScale() {
      if (this.savedHeight !== undefined) {
        this.element.height = this.savedHeight;
      }

      if (this.savedWidth !== undefined) {
        this.element.width = this.savedWidth;
      }

      window.autoScaleCanvas(this.element);
    }
  }, {
    key: "width",
    get: function get() {
      return this.element.width;
    },
    set: function set(value) {
      this.savedWidth = value;
      this.autoScale();
      return value;
    }
  }, {
    key: "height",
    get: function get() {
      return this.element.height;
    },
    set: function set(value) {
      this.savedHeight = value;
      this.autoScale();
      return value;
    }
  }]);

  return AutoScaledCanvas;
}();

var toMessage = function toMessage(result) {
  if (result instanceof Blob) {
    return {
      type: 'blob',
      payload: btoa(result),
      meta: {}
    };
  }

  if (result instanceof Object) {
    if (!result[WEBVIEW_TARGET]) {
      var id = ID();
      result[WEBVIEW_TARGET] = id;
      targets[id] = result;
    }

    return {
      type: 'json',
      payload: flattenObject(result),
      args: toArgs(flattenObject(result)),
      meta: {
        target: result[WEBVIEW_TARGET],
        constructor: result.__constructorName__ || result.constructor.name
      }
    };
  }

  return {
    type: 'json',
    payload: JSON.stringify(result),
    meta: {}
  };
};

var toArgs = function toArgs(result) {
  var args = [];

  for (var key in result) {
    if (result[key] !== undefined && key !== '@@WEBVIEW_TARGET') {
      if (typedArrays[result[key].constructor.name] !== undefined) {
        result[key] = Array.from(result[key]);
      }

      args.push(result[key]);
    }
  }

  return args;
};

var createObjectsFromArgs = function createObjectsFromArgs(args) {
  for (var index = 0; index < args.length; index += 1) {
    var currentArg = args[index];

    if (currentArg && currentArg.className !== undefined) {
      var className = currentArg.className,
          classArgs = currentArg.classArgs;

      var object = _construct(constructors[className], _toConsumableArray(classArgs));

      args[index] = object;
    }
  }

  return args;
};

var print = function print() {
  for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var message = JSON.stringify({
    type: 'log',
    payload: args
  });
  window.ReactNativeWebView.postMessage(message);
};

var canvas = document.createElement('canvas');
var autoScaledCanvas = new AutoScaledCanvas(canvas);
var targets = {
  canvas: autoScaledCanvas,
  context2D: canvas.getContext('2d')
};
var constructors = {
  Image: Image,
  Path2D: Path2D,
  CanvasGradient: CanvasGradient,
  ImageData: ImageData,
  Uint8ClampedArray: Uint8ClampedArray
};
var typedArrays = {
  Uint8ClampedArray: Uint8ClampedArray
};

Image.bind = Image.bind || function () {
  return Image;
};

Path2D.bind = Path2D.bind || function () {
  return Path2D;
};

ImageData.bind = ImageData.bind || function () {
  return ImageData;
};

Uint8ClampedArray.bind = Uint8ClampedArray.bind || function () {
  return Uint8ClampedArray;
};

var populateRefs = function populateRefs(arg) {
  if (arg && arg.__ref__) {
    return targets[arg.__ref__];
  }

  return arg;
};

document.body.appendChild(canvas);

function handleMessage(_ref) {
  var id = _ref.id,
      type = _ref.type,
      payload = _ref.payload;

  switch (type) {
    case 'exec':
      {
        var _targets$target;

        var target = payload.target,
            method = payload.method,
            args = payload.args;

        var result = (_targets$target = targets[target])[method].apply(_targets$target, _toConsumableArray(args.map(populateRefs)));

        var message = toMessage(result);

        if (typeof result === 'object' && !message.meta.constructor) {
          for (var constructorName in constructors) {
            if (result instanceof constructors[constructorName]) {
              message.meta.constructor = constructorName;
            }
          }
        }

        window.ReactNativeWebView.postMessage(JSON.stringify(_objectSpread({
          id: id
        }, message)));
        break;
      }

    case 'set':
      {
        var _target = payload.target,
            key = payload.key,
            value = payload.value;
        targets[_target][key] = populateRefs(value);
        break;
      }

    case 'construct':
      {
        var _constructor = payload.constructor,
            _target2 = payload.id,
            _payload$args = payload.args,
            _args = _payload$args === void 0 ? [] : _payload$args;

        var newArgs = createObjectsFromArgs(_args);
        var object;

        try {
          object = _construct(constructors[_constructor], _toConsumableArray(newArgs));
        } catch (error) {
          throw new Error("Error while constructing " + _constructor + " " + error.message);
        }

        object.__constructorName__ = _constructor;

        var _message = toMessage({});

        targets[_target2] = object;
        window.ReactNativeWebView.postMessage(JSON.stringify(_objectSpread({
          id: id
        }, _message)));
        break;
      }

    case 'listen':
      {
        var _ret = function () {
          var types = payload.types,
              target = payload.target;

          for (var _iterator = types, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"]();;) {
            var _ref2;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref2 = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref2 = _i.value;
            }

            var _eventType = _ref2;
            targets[target].addEventListener(_eventType, function (e) {
              var message = toMessage({
                type: 'event',
                payload: {
                  type: e.type,
                  target: _objectSpread({}, flattenObject(targets[target]), _defineProperty({}, WEBVIEW_TARGET, target))
                }
              });
              window.ReactNativeWebView.postMessage(JSON.stringify(_objectSpread({
                id: id
              }, message)));
            });
          }

          return "break";
        }();

        if (_ret === "break") break;
      }
  }
}

var handleError = function handleError(err, message) {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    id: message.id,
    type: 'error',
    payload: {
      message: err.message,
      stack: err.stack
    }
  }));
  document.removeEventListener('message', handleIncomingMessage);
};

function handleIncomingMessage(e) {
  var data = JSON.parse(e.data);

  if (Array.isArray(data)) {
    for (var _iterator2 = data, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var _message2 = _ref3;

      try {
        handleMessage(_message2);
      } catch (err) {
        handleError(err, _message2);
      }
    }
  } else {
    try {
      handleMessage(data);
    } catch (err) {
      handleError(err, data);
    }
  }
}

window.addEventListener('message', handleIncomingMessage);
document.addEventListener('message', handleIncomingMessage);</script>
  

</body></html>`