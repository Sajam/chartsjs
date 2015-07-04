var Group = extend(SVGElement, function Group(options) {
  return this.super('constructor')(options);
});

Group.prototype.tagName = 'g';

Group.prototype.defaultOptions = {
  'transform': 'translate(0, 0)'
};

Group = alias(Group);
