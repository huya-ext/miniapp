var scale = function scale(ratio) {
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
};