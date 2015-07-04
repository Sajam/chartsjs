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
