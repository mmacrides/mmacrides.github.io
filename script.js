document.getElementById("begin-button").addEventListener("click", function() {
    // Your D3 code to create the visualization goes here
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
});ß