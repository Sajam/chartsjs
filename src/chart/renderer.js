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
