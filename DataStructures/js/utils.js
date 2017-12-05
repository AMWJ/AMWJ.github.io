var getContrast = function(hexColor) {
    var color = hexToRgb(hexColor);
    // http://www.w3.org/TR/AERT#color-contrast
    return Math.round(((parseInt(color.r) * 299) +
        (parseInt(color.g) * 587) +
        (parseInt(color.b) * 114)) / 1000);
}
var hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};