var SVGElement = function (options) {
  this.options = extend({}, this.defaultOptions, options || {});
  this.element = undefined;

  this.createElement();
  this.attr(this.options);

  return this;
};

SVGElement.NS = 'http://www.w3.org/2000/svg';

SVGElement.prototype.tagName = undefined;

SVGElement.prototype.notAttributeOptions = [
  // ...
];

SVGElement.prototype.defaultOptions = {
  // ...
};

SVGElement.prototype.createElement = function () {
  if (!this.tagName || (isString(this.tagName) && !this.tagName.trim().length)) {
    return logging.error('tagName property for SVGElement subclass is not set or it is invalid');
  }

  this.element = document.createElementNS(SVGElement.NS, this.tagName);

  return this;
};

SVGElement.prototype.attr = function (attr) {
  if (isString(attr)) {
    return this.element.getAttribute(attr);
  }

  map(attr, function (k, v) {
    if (this.notAttributeOptions.indexOf(k) === -1) {
      this.element.setAttribute(k, v);
    }
  }, this);

  return this;
};

SVGElement.prototype.getMove = function () {
  var move = this.attr('transform').replace('translate(', '').replace(')', '').split(',');

  return {
    x: parseFloat(move[0]),
    y: parseFloat(move[1])
  };
};

SVGElement.prototype.setMove = function (x, y) {
  this.attr({
    'transform': ['translate(', x, ',', y, ')'].join('')
  });

  return this;
};

SVGElement.prototype.getBox = function () {
  return this.element.getBBox();
};

SVGElement.prototype.append = function () {
  var args = getArguments(arguments);

  map(args, function (arg) {
    if (isArray(arg)) {
      map(arg, function (singleArg) {
        this.append(singleArg);
      }, this);
    } else {
      console.log(arg);
      this.element.appendChild(arg.element);
    }
  }, this);

  return this;
};

SVGElement.prototype.appendTo = function (parentElement) {
  parentElement.appendChild(this.element);

  return this;
};
