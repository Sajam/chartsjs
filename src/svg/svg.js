var SVG = extend(SVGElement, function SVG(options) {
  options = options || {};
  options.width = getOrDefault(options, 'width', this.defaultOptions.width);
  options.height = getOrDefault(options, 'height', this.defaultOptions.height);
  options.viewBox = getOrDefault(options, 'viewBox', [0, 0, options.width, options.height].join(' '));

  this.super('constructor')(options);

  return this;
});

SVG.prototype.tagName = 'svg';

SVG.prototype.defaultOptions = {
  version: '1.1',
  baseProfile: 'full',
  xmlns: SVGElement.NS,
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
  'xmlns:ev': 'http://www.w3.org/2001/xml-events',
  preserveAspectRatio: 'none',
  width: 500,
  height: 500
};

SVG = alias(SVG);
