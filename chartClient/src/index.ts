import * as chartClient from './chartClient';
import * as d3 from 'd3';

//event listeners.
document.addEventListener("DOMContentLoaded", () => {
  if (typeof fin != "undefined") {
    fin.desktop.main(onMain);
  } else {
    let ofVersion: any = document.querySelector("#of-version");
    ofVersion.innerText =
      "OpenFin is not available - you are probably running in a browser.";
  }
});

//Once the DOM has loaded and the OpenFin API is ready
async function onMain() {
  const app = fin.desktop.Application.getCurrent();
  //fin.desktop.System.showDeveloperTools(app.uuid, app.uuid);
  fin.desktop.System.getVersion(version => {
    let ofVersion: any = document.querySelector("#of-version");
    ofVersion.innerText = version;
  });

  let drawBtn: any = document.querySelector("#drawChartBtn");
  drawBtn.onclick = renderChart;
}

function renderChart() {
  // clear any svg
  d3.select('svg').remove();

  var margin = {top: 30, right: 30, bottom: 40, left: 50},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  var formatPercent = d3.format("+.0%"),
      formatChange = function(x:any) { return formatPercent(x - 1); },
      parseDate = d3.time.format("%d-%b-%y").parse;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.log()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width, 0)
      .tickFormat(formatChange);

  var line = d3.svg.line()
      .x(function(d:any) { return x(d.date); })
      .y(function(d:any) { return y(d.ratio); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var gX = svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")");

  var gY = svg.append("g")
      .attr("class", "axis axis--y");

  gY.append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .text("Change in Price");

  // get tsv data from chart service
  var symbol = (document.getElementById('symbolId') as any).value;
  chartClient.getData('aapl').then((data: any) => {
  // Compute price relative to base value (hypothetical purchase price).
  var baseValue = +data[0].close;
  data.forEach(function(d:any) {
      d.date = parseDate(d.date);
      d.ratio = d.close / baseValue;
  });

  x.domain(d3.extent(data, function(d:any) { return d.date; }));
  y.domain(d3.extent(data, function(d:any) { return d.ratio; }));

  // Use a second linear scale for ticks.
  yAxis.tickValues(d3.scale.linear()
      .domain(y.domain())
      .ticks(20));

  gX.call(xAxis);

  gY.call(yAxis)
      .selectAll(".tick")
      .classed("tick--one", function(d) { return Math.abs(d - 1) < 1e-6; });

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  });    

}