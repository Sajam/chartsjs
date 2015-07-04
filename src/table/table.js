var Table = function () {
  this.rows = getArguments(arguments);
  this.cells = [];
  this.maxWidth = 0;
  this.maxHeight = 0;
  this.element = undefined;

  return this.init();
};

Table.prototype.init = function () {
  map(this.rows, function (row, i) {
    row.table = this;
    row.index = i;
    row.init();
  }, this);

  this.getElement();

  return this;
};

Table.prototype.setSizeBoundaries = function (maxWidth, maxHeight) {
  this.maxWidth = maxWidth;
  this.maxHeight = maxHeight;

  return this;
};

Table.prototype.getCellById = function (id) {
  return filterOne(this.cells, function (cell) {
    return cell.id === id;
  });
};

Table.prototype.getElement = function () {
  if (!this.element) {
    this.element = Group().append(
      map(this.rows, function (row) {
        return row.element;
      }, null, map.DO_NOT_MODIFY_INPUT)
    );
  }

  return this.element;
};

Table.prototype.reflow = function () {
  var move;
  var box;
  var increasingColsWidth = 0;
  var maxRowHeight = 0;
  var increasingRowsHeight = 0;

  map(this.rows, function (row) {
    map(row.cells, function (cell) {
      box = cell.element.getBox();
      move = cell.element.getMove();

      cell.element.setMove(move.x + increasingColsWidth, move.y);

      increasingColsWidth += box.width;
      maxRowHeight = box.height > maxRowHeight ? box.height : maxRowHeight;
    });

    box = row.element.getBox();
    move = row.element.getMove();

    row.element.setMove(move.x, move.y + increasingRowsHeight);

    increasingRowsHeight += maxRowHeight;
    increasingColsWidth = 0;
    maxRowHeight = 0;
  });

  return this;
};

Table = alias(Table);
