Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _webviewBinders = require("./webview-binders");

var _dec, _dec2, _dec3, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CanvasRenderingContext2D = (_dec = (0, _webviewBinders.webviewTarget)('context2D'), _dec2 = (0, _webviewBinders.webviewProperties)({
  fillStyle: '#000',
  font: '10px sans-serif',
  globalAlpha: 1.0,
  globalCompositeOperation: 'source-over',
  lineCap: 'butt',
  lineDashOffset: 0.0,
  lineJoin: 'miter',
  lineWidth: 1.0,
  miterLimit: 10.0,
  shadowBlur: 0,
  shadowColor: 'rgba(0,0,0,0)',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  strokeStyle: '#000',
  textAlign: 'start',
  textBaseline: 'alphabetic'
}), _dec3 = (0, _webviewBinders.webviewMethods)(['arc', 'arcTo', 'beginPath', 'bezierCurveTo', 'clearRect', 'clip', 'closePath', 'createImageData', 'createLinearGradient', 'createPattern', 'createRadialGradient', 'drawFocusIfNeeded', 'drawImage', 'drawWidgetAsOnScreen', 'drawWindow', 'fill', 'fillRect', 'fillText', 'getImageData', 'getLineDash', 'isPointInPath', 'isPointInStroke', 'lineTo', 'measureText', 'moveTo', 'putImageData', 'quadraticCurveTo', 'rect', 'restore', 'rotate', 'save', 'scale', 'setLineDash', 'setTransform', 'stroke', 'strokeRect', 'strokeText', 'transform', 'translate']), _dec(_class = _dec2(_class = _dec3(_class = function () {
  function CanvasRenderingContext2D(canvas) {
    _classCallCheck(this, CanvasRenderingContext2D);

    this.canvas = canvas;
  }

  _createClass(CanvasRenderingContext2D, [{
    key: "postMessage",
    value: function postMessage(message) {
      return this.canvas.postMessage(message);
    }
  }]);

  return CanvasRenderingContext2D;
}()) || _class) || _class) || _class);
exports.default = CanvasRenderingContext2D;