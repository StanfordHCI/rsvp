function plotGraph(data, divId, w) {
  var margin = {top: 20, right: 100, bottom: 30, left: 30},
      width = w - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d, i) { return x(i); })
      .y(function(d) { return y(d); });

  var sign = function(divId) {
    if (divId == 'precision') return 0.025;
    else return -0.05;
  }

  var divIdHash = '#' + divId;
  var svg = d3.select(divIdHash).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  color.domain(d3.keys(data).filter(function(key) { return key; }));

  x.domain(d3.extent(data[0], function(d, i) { return i; }));
  y.domain(d3.extent(data[data.length-1], function(d, i) { return d; }));

  //y.domain([0,1]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(divId);

  var city = svg.selectAll(".city")
      .data(data)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d); })
      .style("stroke", function(d, i) { return color(i); });

  city.append("text")
      .datum(function(d, i) { return {name: i + ' redundancy', x: d.length-1, y: d[d.length - 1] + sign(divId)*i}; })
      .style("fill", function(d, i) { return color(i); })
      .attr("transform", function(d, i) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
}
