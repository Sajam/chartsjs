var Text = extend(SVGElement, function Text(options) {
  this.super('constructor')(options);

  this.lines = isArray(this.options.text) ? this.options.text : [this.options.text];
  this.elements = [];

  return this.render();
});

Text.prototype.tagName = 'text';

Text.prototype.notAttributeOptions = [
  'text'
];

Text.prototype.defaultOptions = {
  text: [
    ''
  ],
  'font-family': 'Verdana, Arial, Helvetica, sans-serif',
  'font-size': 14
};

Text.prototype.render = function () {
  map(this.lines, function (line) {
    this.elements.push(TSpan({
      text: line
    }));
  }, this);

  return this.append(this.elements);
};

Text = alias(Text);
