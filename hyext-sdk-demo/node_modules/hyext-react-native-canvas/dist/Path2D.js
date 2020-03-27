Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _webviewBinders = require("./webview-binders");

var _dec, _dec2, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path2D = (_dec = (0, _webviewBinders.webviewMethods)(['addPath', 'closePath', 'moveTo', 'lineTo', 'bezierCurveTo', 'quadraticCurveTo', 'arc', 'arcTo', 'ellipse', 'rect']), _dec2 = (0, _webviewBinders.webviewConstructor)('Path2D'), _dec(_class = _dec2(_class = function Path2D(canvas, pathOrD, noOnConstruction) {
  var _this = this;

  _classCallCheck(this, Path2D);

  this.postMessage = function (message) {
    return _this.canvas.postMessage(message);
  };

  this.addMessageListener = function (listener) {
    return _this.canvas.addMessageListener(listener);
  };

  this.canvas = canvas;

  if (this.onConstruction && !noOnConstruction) {
    this.onConstruction(pathOrD);
  }
}) || _class) || _class);
exports.default = Path2D;