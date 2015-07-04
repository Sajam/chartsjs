var is = function is(what) {
  var f = function (o) {
    return Object.prototype.toString.call(o) === '[object ' + what + ']';
  };

  f.name = is + what;

  return f;
};

var isObject = is('Object');
var isFunction = is('Function');
var isArray = is('Array');
var isString = is('String');

var getArguments = function getArguments(arguments) {
  return Array.prototype.slice.call(arguments);
};

var extend = function extend() {
  var args = getArguments(arguments);
  var current = args.shift();

  if (isFunction(current)) {
    var newConstructor = args.shift();

    newConstructor.prototype = Object.create(current.prototype);
    newConstructor.prototype.constructor = newConstructor;

    newConstructor.prototype.super = function (f) {
      if (isFunction(current.prototype[f])) {
        return current.prototype[f].bind(this);
      }

      return current.prototype[f];
    };

    return newConstructor;
  }

  function walk(current, updates) {
    var key;

    for (key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (isObject(updates[key])) {
          if (!current.hasOwnProperty(key)) {
            current[key] = {};
          }

          walk(current[key], updates[key]);
        } else {
          current[key] = updates[key];
        }
      }
    }

    return current;
  }

  args.map(function (arg) {
    walk(current, arg);
  });

  return current;
};

var skipKeys = function skipKeys(o, keysToSkip) {
  var result = {};
  var key;

  for (key in o) {
    if (o.hasOwnProperty(key) && keysToSkip.indexOf(key) === -1) {
      result[key] = o[key];
    }
  }

  return result;
};

var map = function map(o, callback, context, doNotModifyInput) {
  var mapObject = isObject(o);
  var result = mapObject ? {} : [];
  var key;
  var i = 0;
  var callbackResult;

  context = context || this;

  for (key in o) {
    if (mapObject && o.hasOwnProperty(key)) {
      callbackResult = callback.call(context, key, o[key], i);

      if (callbackResult) {
        if (!doNotModifyInput) {
          o[key] = callbackResult;
        }

        result[key] = callbackResult;
      }

      i += 1;
    } else {
      callbackResult = callback.call(context, o[key], parseInt(key, 10));

      if (callbackResult) {
        if (!doNotModifyInput) {
          o[key] = callbackResult;
        }

        result[key] = callbackResult;
      }
    }
  }

  return result;
};

map.DO_NOT_MODIFY_INPUT = true;


var getOrDefault = function getOrDefault(object, key, fallback) {
  return object.hasOwnProperty(key) ? object[key] : fallback;
};

var alias = function alias(target) {
  return function () {
    var args = getArguments(arguments);
    var curriedTarget = Function.prototype.bind.apply(target, [null].concat(args));

    return new curriedTarget();
  };
};

var filterOne = function filterOne(o, callback, context) {
  var result;

  context = context || this;

  map(o, function (item, i) {
    if (callback.call(context, item, i)) {
      result = item;
    }
  });

  return result;
};
var logging = {};

logging.error = function (message) {
  console.log(message);
};
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
var Group = extend(SVGElement, function Group(options) {
  return this.super('constructor')(options);
});

Group.prototype.tagName = 'g';

Group.prototype.defaultOptions = {
  'transform': 'translate(0, 0)'
};

Group = alias(Group);
var Rect = extend(SVGElement, function Rect(options) {
  return this.super('constructor')(options);
});

Rect.prototype.tagName = 'rect';

Rect.prototype.defaultOptions = {
  'width': 10,
  'height': 10
};

Rect = alias(Rect);
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
var Renderer = function (chart) {
  this.chart = chart;
  this.svg = undefined;
  this.table = undefined;
  this.title = undefined;

  return this;
};

Renderer.prototype.render = function () {
  this.svg = SVG({
    width: this.chart.options.width,
    height: this.chart.options.height
  });

  this.table = Table(
    Row(
      Cell('top')
    ),
    Row(
      Cell('left'),
      Cell('center'),
      Cell('right')
    ),
    Row(
      Cell('bottom-left'),
      Cell('bottom-center'),
      Cell('bottom-right')
    ),
    Row(
      Cell('bottom')
    )
  );

  this.table.setSizeBoundaries(this.chart.options.width, this.chart.options.height);

  if (this.chart.options.title.enabled) {
    this.title = Text({
      text: this.chart.options.title.text
    });

    this.table.getCellById('top').add(this.title);
  }

  this.table.getCellById('bottom').add(Text({
    text: 'powered by daniel kowalczyk'
  }));
  this.table.getCellById('right').add(Rect());
  this.table.getCellById('left').add(Rect());
  this.table.getCellById('center').add(Text({
    text: 'foo bar'
  }));
  this.table.getCellById('left').add(Rect({
    x: 5,
    y: 5,
    width: 20,
    height: 30
  }));

  this.svg.append(this.table.element);
  this.svg.appendTo(this.chart.options.target);

  this.table.reflow();
};

Renderer = alias(Renderer);
var Chart = function Chart(options) {
  this.options = extend({}, {
    render: false,
    target: undefined,
    width: 500,
    height: 500,
    title: {
      enabled: true,
      text: 'My first chart'
    },
    series: []
  }, options);

  this.renderer = undefined;

  return this.init();
};

Chart.prototype.init = function () {
  if (this.options.render) {
    this.render();
  }

  return this;
};

Chart.prototype.render = function () {
  if (!this.renderer) {
    this.renderer = Renderer(this);
  }

  this.renderer.render();

  return this;
};

Chart = alias(Chart);
;(function () {
  //var svg = SVG({
  //  width: 600,
  //  height: 300
  //});
  //
  //console.log(svg);
  //
  //svg.appendTo(document.getElementById('chart'));
  //
  //var table = Table(
  //  Row(Cell({'colspan': 3})),
  //  Row(Cell(), Cell(), Cell()),
  //  Row(Cell(), Cell(), Cell()),
  //  Row(Cell({'colspan': 3}))
  //);
  //
  //console.log(table);
  //
  //svg.append(table.node());

  var chart = Chart({
    render: true,
    target: document.getElementById('chart'),
    width: 600,
    height: 400,
    series: [
      {
        data: [10, 5, 15, 6, 9, 11]
      }
    ]
  });

  console.log(chart);
}());
