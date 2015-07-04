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
