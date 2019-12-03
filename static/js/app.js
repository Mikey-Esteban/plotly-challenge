function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Get metadata information for the specific sample from the metadata url/endpoint
  let sampleURL = "/metadata/" + sample;
  console.log(`sampleURL is: ${sampleURL}`);

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(sampleURL).then(function(data) {

    // Use d3 to select the panel with id of `#sample-metadata`
    let $panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    $panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (let [key, value] of Object.entries(data)) {
      d3.select("#sample-metadata").append("p")
      .text(`${key}: ${value}`);
    }
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let sampleURL = "/samples/" + sample;
  console.log(`sampleURL is: ${sampleURL}`);


  d3.json(sampleURL).then(function(data) {
    // set bubble chart data
    let bubbleX = data.otu_ids;
    let bubbleY = data.sample_values;
    let bubbleMarkerSize = data.sample_values;
    let bubbleMarkerColor = data.otu_ids;
    let bubbleText = data.otu_labels;
    // set pie chart
    let pieValues = data.sample_values.slice(0,10);
    let pieLabels = data.otu_ids.slice(0,10);
    let pieText = data.otu_labels.slice(0,10);


    // @TODO: Build a Bubble Chart using the sample data
    let traceBubble = {
      x: bubbleX,
      y: bubbleY,
      mode: 'markers',
      text: bubbleText,
      marker: {
        color: bubbleMarkerColor,
        colorscale: 'Rainbow',
        size: bubbleMarkerSize
      }
    };

    let bubbleData = [traceBubble];
    Plotly.newPlot("bubble", bubbleData);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    let tracePie = {
      values: pieValues,
      labels: pieLabels,
      hovertext: pieText,
      type: "pie"
    };

    let pieData = [tracePie];

    Plotly.newPlot("pie", pieData);

    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
