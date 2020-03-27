Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bus = function () {
  function Bus(send) {
    _classCallCheck(this, Bus);

    this._paused = false;
    this._messageListeners = {};
    this._queue = [];
    this._send = send;
  }

  _createClass(Bus, [{
    key: "post",
    value: function post(message) {
      var _this = this;

      return new Promise(function (resolve) {
        _this._messageListeners[message.id] = resolve;

        if (!_this._paused) {
          _this._send(message);
        } else {
          _this._queue.push(message);
        }
      });
    }
  }, {
    key: "handle",
    value: function handle(message) {
      var handler = this._messageListeners[message.id];

      if (handler) {
        handler(message);
      } else {
        console.warn('Received unexpected message', message);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      this._paused = true;
    }
  }, {
    key: "resume",
    value: function resume() {
      this._paused = false;

      this._send(this._queue);

      this._queue = [];
    }
  }]);

  return Bus;
}();

exports.default = Bus;