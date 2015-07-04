var TSpan = extend(SVGElement, function TSpan(options) {
  this.super('constructor')(options);

  return this.render();
});

TSpan.prototype.tagName = 'tspan';

TSpan.prototype.notAttributeOptions = [
  'text'
];

TSpan.prototype.defaultOptions = {
  'text': '',
  'dominant-baseline': 'text-before-edge'
};

TSpan.prototype.render = function () {
  this.element.textContent = this.options.text;

  return this;
};

TSpan = alias(TSpan);
