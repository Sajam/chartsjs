var Rect = extend(SVGElement, function Rect(options) {
  return this.super('constructor')(options);
});

Rect.prototype.tagName = 'rect';

Rect.prototype.defaultOptions = {
  'width': 10,
  'height': 10
};

Rect = alias(Rect);
