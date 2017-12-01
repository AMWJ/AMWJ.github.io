(function (tree) {
    var visualizedElements = null;
    var visualizedEdges = null;
    var colorFn = function () { return "black"; };
    redisplayRedBlackTree = function (elements, edges) {
        visualizedElements = elements || visualizedElements;
        visualizedEdges = edges || visualizedEdges;
        elements = visualizedElements;
        edges = visualizedEdges;
        $redBlackTree = $(".redBlackTree");
        var maxDepth = 0;
        var svgWidth = $redBlackTree.width();
        var lastElements = {};
        var blockSize = 30.0;

        var svg = d3.select("body").select(".redBlack").select("svg");

        /*
            Elements
        */
        var nodes = svg.selectAll("g").data(elements, function (d) { return d.node.id(); });
        var newGs = nodes.enter().append("g")
            .attr("class", "redBlackTreeElement");
        newGs.attr("opacity", 0)
            .transition()
            .duration(phase)
            .attr("opacity", 1);
        var circles = newGs.append("circle")
            .attr("cx", function (d, i) { return blockSize; })
            .attr("cy", function (d, i) { return blockSize * 3 * d.depth + blockSize / 2; })
            .attr("r", blockSize/2)
            .attr("fill", function (d, i) {
                return colorFn(d.node.id()) || "#FF7777";
            })
            .attr("stroke", "black");

        var labels = newGs.append("text")
            .attr("x", function (d, i) { return blockSize; })
            .attr("y", function (d, i) { return blockSize * 3 * d.depth + blockSize / 2; })
            .attr("dy", ".35em")
            .attr("font-size", blockSize / 2)
            .attr("text-anchor", "middle")
            .text(function (d) { return d.node.value(); });

        svg.selectAll("g").select("circle")
            .attr("fill", function (d, i) {
                return colorFn(d.node.id()) || "#FF7777";
            })
            .transition().duration(phase)
            .attr("cx", function (d, i) { return blockSize; })
            .attr("cy", function (d, i) { return blockSize * 3 * d.depth + blockSize / 2; })
            .attr("r", blockSize/2)
            .attr("stroke", "black");

        svg.selectAll("g").select("text")
            .transition().duration(phase)
            .attr("x", function (d, i) { return blockSize; })
            .attr("y", function (d, i) { return blockSize * 3 * d.depth + blockSize / 2; })
            .attr("dy", ".35em")
            .attr("font-size", blockSize / 2)
            .attr("text-anchor", "middle")
            .text(function (d) { return d.node.value(); });

        svg.selectAll("g")
            .on("click", function (d, i, obj) {
                setSelectedElement(d.node.id());
            });
    };
})();