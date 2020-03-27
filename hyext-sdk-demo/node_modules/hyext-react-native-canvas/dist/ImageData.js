Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Canvas = _interopRequireDefault(require("./Canvas"));

var _webviewBinders = require("./webview-binders");

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageData = (_dec = (0, _webviewBinders.webviewConstructor)('ImageData'), _dec(_class = function ImageData(canvas, array, width, height, noOnConstruction) {
  var _this = this;

  _classCallCheck(this, ImageData);

  this.postMessage = function (message) {
    return _this.canvas.postMessage(message);
  };

  this.addMessageListener = function (listener) {
    return _this.canvas.addMessageListener(listener);
  };

  if (!(canvas instanceof _Canvas.default)) {
    throw new Error('ImageData must be initialized with a Canvas instance');
  }

  this.canvas = canvas;

  if (this.onConstruction && !noOnConstruction) {
    this.onConstruction(array, width, height);
  }
}) || _class);
exports.default = ImageData;