import * as d3 from 'd3';

// @ts-ignore: type definition for service doesn't exist in openfin
const serviceClient: Promise<Client> = fin.desktop.Service.connect({uuid: "D3ChartService", name: "D3ChartService"});
// @ts-ignore: type definition for service doesn't exist in openfin
serviceClient.then((service: Client) => {
    console.log("Service ready " + Date.now());
    //(window as any).service = service;
}, () => console.log('could not connect to service'));  // set 'wait:false' in connection options will print out error message if the service is not started. By default, wait is set to true. 

export async function getData(symbol: string): Promise<any> {
    // @ts-ignore: type definition for service doesn't exist in openfin
    const service: Client = await serviceClient;
    return service.dispatch("D3Chart.getData", symbol).catch((err:any) => console.log(err));
}

export function renderChart(): void {
    // clear any svg
    d3.select('svg').remove();
  
    let margin = {top: 30, right: 30, bottom: 40, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  
    let formatPercent = d3.format("+.0%"),
        formatChange = function(x:any) { return formatPercent(x - 1); },
        parseDate = d3.time.format("%d-%b-%y").parse;
  
    let x = d3.time.scale().range([0, width]);
  
    let y = d3.scale.log().range([height, 0]);
  
    let xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
  
    let yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width, 0)
        .tickFormat(formatChange);
  
    let line = d3.svg.line()
        .x(function(d:any) { return x(d.date); })
        .y(function(d:any) { return y(d.ratio); });
  
    let svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    let gX = svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");
  
    let gY = svg.append("g")
        .attr("class", "axis axis--y");
  
    gY.append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .text("Change in Price");
  
    // get tsv data from chart service
    let symbolSelect = document.getElementById('symbolSelect') as any;
    let symbol = symbolSelect.options[symbolSelect.selectedIndex].text;    
    getData(symbol).then((data: any) => {
    // Compute price relative to base value (hypothetical purchase price).
    let baseValue = +data[0].Close;
    data.forEach(function(d:any) {
        d.date = parseDate(d.Date);
        d.ratio = d.Close / baseValue;
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