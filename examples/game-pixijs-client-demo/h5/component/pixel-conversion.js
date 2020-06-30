
function PixelConversion(defaultWidthPixel, realWidth) {
    this.defaultWidthPixel = defaultWidthPixel;
    this.realWidth = realWidth;
    this.ratio = function () {
        return this.realWidth / this.defaultWidthPixel;
    }
    console.log('PixelConversion ratio:' + this.ratio());
}

PixelConversion.prototype.convert = function (designPixel) {
    return designPixel * this.ratio();
}

PixelConversion.prototype.resize = function (realWidth) {
    this.realWidth = realWidth;
    console.log('PixelConversion ratio:' + this.ratio());
}



