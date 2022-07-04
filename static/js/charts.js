function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
};

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = (result.sample_values.slice(0,10)).reverse();
    console.log(otu_ids);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    var top_otu_ids = (data.samples[0].otu_ids.slice(0,10)).reverse();
    var otu_id = top_otu_ids.map(d => "OTU " + d);
    console.log(`OTU IDS: ${otu_id}`)

    var yticks = otu_id;

    // 8. Create the trace for the bar chart.
    var trace = {
      x: sample_values,
      y: yticks,
      text: otu_labels,
      marker: {color: 'blue'},
      type: "bar",
      orientation: "h"
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart.
    var titleText = "<b>Top 10 Bacteria Cultures Found</b>"; 
    var barLayout = {
      title: titleText,
            yaxis:{
                tickmode:"linear"
            }
    };
    var config = {responsive: true};
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout, config);

    // 1. Create the trace for the bubble chart.
    var trace = {
      x: result.otu_ids,
      y: result.sample_values,
      mode: 'markers',
      marker: {
        size: result.sample_values,
        color: result.otu_ids,
        colorscale: 'Earth',
        
      },
      text: result.otu_labels
    };
    var bubbleData = [trace];

    // 2. Create the layout for the bubble chart.
    var titleText = "<b>Bacteria Cultures Per Sample</b>";
    var bubbleLayout = {
      title: titleText,
      hovermode: true,
      xaxis:{
        title: "OTU ID"},
        autosize: true
        //width: 1200, height: 500
    };
    var config = {responsive: true};

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, config);

    //Gauge chart
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);
  

    // 2. Create a variable that holds the first sample in the metadata array.
    var mresult = metadataArray[0];
    console.log(mresult);
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = (result.sample_values.slice(0,10)).reverse();
    console.log(otu_ids)


    // 3. Create a variable that holds the washing frequency.
    var wfreq = mresult.wfreq;
    console.log(wfreq);
   
    // Create the yticks for the bar chart.
    var top_otu_ids = (data.samples[0].otu_ids.slice(0,10)).reverse();
    var otu_id = top_otu_ids.map(d => "OTU " + d);
    console.log(`OTU IDS: ${otu_id}`)

    var yticks = otu_id;

    // 4a. Save the element that was changed as a variable.

    let changedElement = d3.select(this);

    // 4b. Save the value that was changed as a variable.
    let elementValue = changedElement.property("value")
    console.log(elementValue);

    var titleText = "<b>Belly Button Washing Frequency</b><br> Scrubs Per Week</br>";

    // 4c. Create the trace for the gauge chart.
    var trace = {
      type: "indicator",
      mode: "gauge+number",
      value: wfreq,
      gauge: { axis: { 
        visible: true, 
        range: [0, 10] },
        bar: { color: "black"},
        steps:[
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "darkorange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
         ] },
		  title: { text: titleText }
      //domain: { x: [0, 1], y: [0, 1] }
      
    };
    var gaugeData = [trace];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      autosize: true,
      //width: 1900, height: 450 
      //automargin: false
      //paper_bgcolor: "lightblue",
      margin: { t: 30, r: 30, l: 30, b: 30 }
    };

    var config = {responsive: true};

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);
  });
};
  
  