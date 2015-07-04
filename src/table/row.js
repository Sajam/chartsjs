var Row = function () {
  this.table = undefined;
  this.index = undefined;
  this.cells = getArguments(arguments);
  this.element = undefined;

  return this;
};

Row.prototype.init = function () {
  map(this.cells, function (cell, i) {
    cell.table = this.table;
    cell.row = this;
    cell.col = i;
    cell.init();
  }, this);

  this.element = Group({
      'id': 'row-' + this.index
    }).append(
      map(this.cells, function (cell) {
        return cell.element;
      }, null, map.DO_NOT_MODIFY_INPUT)
    );

  return this;
};

Row = alias(Row);
