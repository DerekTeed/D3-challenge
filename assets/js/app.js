const svgWidth = 660;
const svgHeight = 460;

const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Calculate chart width and height
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

// Append SVG group
const chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Initial params
var chosenXaxis = "age";
var chosenYaxis = "smokes";




// function used for updating x-scale const upon click on axis label
function xScale(healthData, chosenXaxis) {
    // create scales
    const xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXaxis]*0.8),
        d3.max(healthData, d => d[chosenXaxis]*1.2)
      ])
      .range([0, width]);
    return xLinearScale;
}

function yScale(healthData, chosenYaxis) {
    // create scales
    const yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d=>d[chosenYaxis])*0.8, d3.max(healthData, d=>d[chosenYaxis])*1.2 ])
      .range([height, 0]);
    return yLinearScale;
}


// Retrieve data from the CSV file and execute everything below
(async function(){
    const healthData = await d3.csv("assets/data/data.csv");

    // parse data to integer from string
    healthData.forEach(function(data){
        
        data.age = +data.age;
     
        data.smokes = +data.smokes;
    })

    // xLinearScale function after csv import
    let xLinearScale = xScale(healthData, chosenXaxis);

    // yLinearScale function after csv import
    let yLinearScale = yScale(healthData, chosenYaxis)

    // Create initial axis functions
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // append X-axis
    let xAxis = chartGroup.append("g")
                        .classed("x-axis", true)
                        .attr("transform", `translate(0, ${height})`)
                        .call(bottomAxis)
    
    let yAxis = chartGroup.append("g")
                        .classed("y-axis", true)
                        .call(leftAxis)
    
    let crlTxtGroup = chartGroup.selectAll("mycircles")
                      .data(healthData)
                      .enter()
                      .append("g")
    
    let circlesGroup = crlTxtGroup.append("circle")
                            .attr("cx", d=>xLinearScale(d[chosenXaxis]))
                            .attr("cy", d=>yLinearScale(d[chosenYaxis]))
                            .classed("stateCircle", true)
                            .attr("r", 8)
                            .attr("opacity", "1");

    let txtGroup = crlTxtGroup.append("text")
                              .text(d=>d.abbr)
                              .attr("x", d=>xLinearScale(d[chosenXaxis]))
                              .attr("y", d=>yLinearScale(d[chosenYaxis])+3)
                              .classed("stateText", true)
                              .style("font-size", "7px")
                              .style("font-weight", "800")

     // Create group for  3 x- axis labels
     const xlabelsGroup = chartGroup.append("g")
                                .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);
    
    // Create group for  3 y- axis labels
    const ylabelsGroup = chartGroup.append("g")
                                .attr("transform", `translate(${0-margin.left/4}, ${height/2})`);

  
    const ageLabel = xlabelsGroup.append("text")
                                .attr("x", 0)
                                .attr("y", 20)
                                .attr("value", "age") // value to grab for event listener
                                .classed("inactive", false)
                                .classed("aText", true)
                                .text("Age (Median)");

   
   
    const smokeLabel = ylabelsGroup.append("text")
                                .attr("y", 0 - 40)
                                .attr("x", 0)
                                .attr("transform", "rotate(-90)")
                                .attr("dy", "1em")
                                .attr("value", "smokes")
                                .classed("inactive", false)
                                .classed("aText", true)
                                .text("Smokes (%)");
                                
   
// y axis labels event listener
ylabelsGroup.selectAll("text")
.on("click", function() {
// get value of selection
const value = d3.select(this).attr("value");
console.log(`${value} click`)
if (value == chosenYaxis) {
     // update tooltip with new info after changing y-axis 
     circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup); 
  }})

})()