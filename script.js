document.getElementById("begin-button").addEventListener("click", function() {
    // Update header text
    document.getElementById("header-text").innerText = "Here it is";
    
    // Hide intro text and begin button, show back button
    document.getElementById("intro-text").style.display = "none";
    document.getElementById("begin-button").style.display = "none";
    document.getElementById("back-button").style.display = "block";
    
    // Your D3 code to create the visualization
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", 800)
        .attr("height", 600);

    // Example D3 code to create a simple bar chart (replace with your actual D3 visualization)
    svg.selectAll("rect")
        .data([30, 86, 168, 281, 303, 365])
        .enter()
        .append("rect")
        .attr("width", 40)
        .attr("height", d => d)
        .attr("x", (d, i) => i * 45)
        .attr("y", d => 600 - d);
});

document.getElementById("back-button").addEventListener("click", function() {
    // Update header text
    document.getElementById("header-text").innerText = "Welcome to My Interactive Data Visualization";
    
    // Show intro text and begin button, hide back button
    document.getElementById("intro-text").style.display = "block";
    document.getElementById("begin-button").style.display = "block";
    document.getElementById("back-button").style.display = "none";
    
    // Remove the current SVG to reset the chart
    d3.select("#chart").select("svg").remove();
});
