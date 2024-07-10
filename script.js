document.getElementById("begin-button").addEventListener("click", function() {
    // Update header text
    document.getElementById("header-text").innerText = "Here it is";
    
    // Hide intro text and begin button, show back button and dropdown
    document.getElementById("intro-text").style.display = "none";
    document.getElementById("begin-button").style.display = "none";
    document.getElementById("back-button").style.display = "block";
    document.getElementById("metric-dropdown").style.display = "block";
    
    // Load and process data
    d3.csv("personal_income.csv").then(data => {
        // Process data
        const metrics = [...new Set(data.map(d => d.Metric))];
        
        // Populate dropdown
        const dropdown = d3.select("#metric-dropdown");
        dropdown.selectAll("option")
            .data(metrics)
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
        updateChart(data, metrics[0]);
    });
});

document.getElementById("back-button").addEventListener("click", function() {
    // Update header text
    document.getElementById("header-text").innerText = "Welcome to My Interactive Data Visualization";
    
    // Show intro text and begin button, hide back button and dropdown
    document.getElementById("intro-text").style.display = "block";
    document.getElementById("begin-button").style.display = "block";
    document.getElementById("back-button").style.display = "none";
    document.getElementById("metric-dropdown").style.display = "none";
    
    // Remove the current SVG to reset the chart
    d3.select("#chart").select("svg").remove();
});

function updateChart(data, metric) {
    // Remove any existing SVG
    d3.select("#chart").select("svg").remove();

    // Filter data by selected metric
    const filteredData = data.filter(d => d.Metric === metric);

    // Pivot data
    const years = d3.keys(filteredData[0]).filter(d => d !== "Metric");
    const pivotData = years.map(year => ({
        year: year,
        value: +filteredData[0][year]
    }));

    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleLinear()
        .domain(d3.extent(pivotData, d => d.year))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(pivotData, d => d.value)])
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
