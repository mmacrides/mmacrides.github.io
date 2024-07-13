document.getElementById("begin-button").addEventListener("click", function() {
    // Update header text and show relevant elements
    document.getElementById("header-text").innerText = "Income Distribution over the Years";
    document.getElementById("header-text").style.border = "1px solid #ddd";
    document.getElementById("header-text").style.borderRadius = "8px";
    document.getElementById("header-text").style.padding = "10px";
    document.getElementById("header-text").style.backgroundColor = "#f5f5f5"; // Optional: Add background color
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
        const filteredMetrics = metrics.filter(metric => !(metric.includes("Median") || metric.includes("Mean") || metric.includes("Top 10% share") || metric.includes("Bottom 10% share")));

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
    document.getElementById("header-text").style.border = "1px solid #ddd";
    document.getElementById("header-text").style.borderRadius = "8px";
    document.getElementById("header-text").style.padding = "10px";
    document.getElementById("header-text").style.backgroundColor = "#f5f5f5"; // Optional: Add background color
    document.getElementById("intro-text").style.display = "block";
    document.getElementById("begin-button").style.display = "block";
    document.getElementById("header-text2").style.display = "block";
    document.getElementById("back-button").style.display = "none";
    document.getElementById("metric-dropdown").style.display = "none";
    // Hide the chart and chart details
    document.getElementById("chart-container").style.display = "none";
    document.getElementById("chart-definition").style.display = "none";
});

document.getElementById("back-button-2").addEventListener("click", function() {
    // Go back to the line graph scene
    document.getElementById("header-text").innerText = "Income Distribution over the Years";
    document.getElementById("chart-definition").innerText = "Specific definition for the Eq. 90/10 Ratio";

    // Hide the dummy bar chart
    d3.select("#chart").html("");

    // Hide back-button-2 and show back-button
    document.getElementById("back-button-2").style.display = "none";
    document.getElementById("back-button").style.display = "block";

    // Load and process data for the line chart
    d3.csv("personal_income_formatted.csv").then(data => {
        const metrics = [...new Set(data.map(d => d.Metric).filter(d => d))];
        const filteredMetrics = metrics.filter(metric => !(metric.includes("Median") || metric.includes("Mean") || metric.includes("Top 10% share") || metric.includes("Bottom 10% share")));
        updateChart(data, filteredMetrics[0]);
    });
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
    const margin = {top: 20, right: 30, bottom: 50, left: 60}; // Increased bottom and left margins for labels
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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
    const yPadding = (yMax - yMin) * 0.35; // 35% padding
    const y = d3.scaleLinear()
        .domain([yMin - yPadding, yMax + yPadding]) // Adjusted to add padding
        .range([height, 0]);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40) // Positioning below the axis
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .style("font-size", "14px") // Increased font size
        .text("Year");

    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50) // Positioning to the left of the axis
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .style("font-size", "14px") // Increased font size
        .text(metric);

    // Draw line
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value));

    svg.append("path")
        .datum(pivotData)
        .attr("fill", "none")
        .attr("stroke", "#007bff")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Draw dots
    svg.selectAll("dot")
        .data(pivotData)
        .enter().append("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", "#007bff")
        .on("mouseover", function(event, d) {
            d3.select(".tooltip")
                .style("opacity", 1)
                .html(`${metric}, ${d.year}: ${d.value}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(".tooltip")
                .style("opacity", 0);
        })
        .on("click", function(event, d) {
            //showBarChart(d.year);
            window.location.href = `cloropleth.html?year=${d.year}`;

        });

    // Draw annotation for the 2014 data point
    const annotationData = pivotData.find(d => d.year === 2014);

    if (annotationData) {
        const annotation = svg.append("g")
            .attr("class", "annotation-group");

        annotation.append("line")
            .attr("x1", x(annotationData.year))
            .attr("y1", y(annotationData.value))
            .attr("x2", x(annotationData.year) + 60) // Adjusted based on text box position
            .attr("y2", y(annotationData.value) - 60) // Adjusted based on text box position
            .attr("stroke", "purple")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4");

        annotation.append("text")
            .attr("x", x(annotationData.year) + 65) // Adjusted based on text box position
            .attr("y", y(annotationData.value) - 70) // Adjusted based on text box position
            .attr("fill", "purple")
            .style("font-size", "12px")
            .text("Hover over the data points to see the exact values")
            .call(wrap, 75); // Increased width for text wrapping
    }

    // Draw annotation for the 2021 data point
    const annotationData2021 = pivotData.find(d => d.year === 2021);

    if (annotationData2021) {
        const annotation2021 = svg.append("g")
            .attr("class", "annotation-group");

        annotation2021.append("line")
            .attr("x1", x(annotationData2021.year))
            .attr("y1", y(annotationData2021.value))
            .attr("x2", x(annotationData2021.year) - 50) // Directly left of the data point
            .attr("y2", y(annotationData2021.value)) // Same y-coordinate as the data point
            .attr("stroke", "purple")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4");

        annotation2021.append("text")
            .attr("x", x(annotationData2021.year) - 105) // Directly left of the data point
            .attr("y", y(annotationData2021.value)) // Same y-coordinate as the data point
            .attr("fill", "purple")
            .style("font-size", "12px")
            .text("2021 had the lowest metrics across all years")
            .call(wrap, 100);
    }


    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    // Wrap function for text
    function wrap(text, width) {
        text.each(function() {
            const text = d3.select(this);
            const words = text.text().split(/\s+/).reverse();
            let word;
            let line = [];
            let lineNumber = 0;
            const lineHeight = 1.1; // ems
            const y = text.attr("y");
            const x = text.attr("x");
            const dy = parseFloat(text.attr("dy")) || 0;
            let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}

function showBarChart(year) {
    // Update the header text
    document.getElementById("header-text").innerText = "Another chart";
    document.getElementById("chart-definition").innerText = "Another chart details";

    // Hide back-button and show back-button-2
    document.getElementById("back-button").style.display = "none";
    document.getElementById("back-button-2").style.display = "block";

    // Clear the current chart
    d3.select("#chart").html("");
    
    // Create dummy data for the bar chart
    const data = [
        {category: "A", value: Math.random() * 100},
        {category: "B", value: Math.random() * 100},
        {category: "C", value: Math.random() * 100},
        {category: "D", value: Math.random() * 100},
    ];

    // Set up dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Draw bars
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#007bff");

    // Reinitialize tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll(".bar")
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1)
                .html(`Category: ${d.category}<br>Value: ${d.value.toFixed(2)}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });
}
