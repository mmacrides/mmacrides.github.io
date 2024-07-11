document.getElementById("begin-button").addEventListener("click", function() {
    // Update header text and show relevant elements
    document.getElementById("header-text").innerText = "Income Distributions over the Years";
    document.getElementById("intro-text").style.display = "none";
    document.getElementById("begin-button").style.display = "none";
    document.getElementById("header-text2").style.display = "none";
    document.getElementById("back-button").style.display = "block";
    document.getElementById("metric-dropdown").style.display = "block";
    // Show the chart and chart details
    document.getElementById("chart-container").style.display = "flex";
    document.getElementById("chart-definition").style.display = "block";
    
    // Load and process data
    d3.csv("personal_income_formatted.csv").then(data => {
        // Filter out blank metrics and remove specific metrics
        const metrics = [...new Set(data.map(d => d.Metric).filter(d => d))];
        const filteredMetrics = metrics.filter(metric => !(metric.includes("Median") || metric.includes("Mean")));

        // Populate dropdown
        const dropdown = d3.select("#metric-dropdown");
        dropdown.selectAll("option")
            .data(filteredMetrics)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        // Event listener for dropdown change
        dropdown.on("change", function() {
            const selectedMetric = this.value;
            updateChart(data, selectedMetric);
        });

        // Initial chart rendering
        updateChart(data, filteredMetrics[0]);
    });
});

document.getElementById("back-button").addEventListener("click", function() {
    // Update header text and show intro elements
    document.getElementById("header-text").innerText = "Welcome to My Interactive Data Visualization";
    document.getElementById("intro-text").style.display = "block";
    document.getElementById("begin-button").style.display = "block";
    document.getElementById("header-text2").style.display = "block";
    document.getElementById("back-button").style.display = "none";
    document.getElementById("metric-dropdown").style.display = "none";
    // Hide the chart and chart details
    document.getElementById("chart-container").style.display = "none";
    document.getElementById("chart-definition").style.display = "none";
});

function updateChart(data, metric) {
    // Clear the current SVG
    d3.select("#chart").html("");

    // Filter data by selected metric
    const filteredData = data.filter(d => d.Metric === metric);

    // Check if there is data for the selected metric
    if (filteredData.length === 0) {
        console.error("No data available for the selected metric.");
        return;
    }

    // Pivot data (years are in columns D-N, which are 2012-2022)
    const years = d3.range(2012, 2023); // Generates [2012, 2013, ..., 2022]
    const pivotData = years.map(year => ({
        year: year,
        value: +filteredData[0][year]
    }));

    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom; // Reduced height

    // Create SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleLinear()
        .domain([2012, 2022])
        .range([0, width]);
    
    // Add padding to the Y-axis domain
    const yMin = d3.min(pivotData, d => d.value);
    const yMax = d3.max(pivotData, d => d.value);
    const yPadding = (yMax - yMin) * 0.1; // 10% padding
    const y = d3.scaleLinear()
        .domain([yMin - yPadding, yMax + yPadding]) // Adjusted to add padding
        .range([height, 0]);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add line
    svg.append("path")
        .datum(pivotData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.year))
            .y(d => y(d.value))
        );
}
