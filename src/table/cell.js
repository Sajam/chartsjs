var Cell = function (id, options) {
  this.id = id;
  this.options = extend({}, options || {});

  this.table = undefined;
  this.row = undefined;
  this.col = undefined;

  this.content = [];
  this.element = undefined;

  return this;
};

Cell.prototype.init = function () {
  this.table.cells.push(this);

  this.element = Group({
    id: this.id,
    'data-location': this.row.index + ',' + this.col
  });

  return this;
};

Cell.prototype.add = function (element) {
  this.content.push(element);
  this.element.append(element);

  return this;
};

Cell = alias(Cell);
