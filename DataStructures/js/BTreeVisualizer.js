(function () {
    var visualizedElements = null;
    var visualizedEdges = null;
    var colorFn = function () { return null; };
    redisplayBTree = function (elements, edges) {
        visualizedElements = elements || visualizedElements;
        visualizedEdges = edges || visualizedEdges;
        elements = visualizedElements;
        edges = visualizedEdges;
        $bTree = $(".bTree");
        var maxDepth = 0;
        var svgWidth = $bTree.width();
        var lastElements = {};
        var blockSize = 30.0;
        var rowHeight = function (depth) {
            return Math.sqrt(blockSize) * 14 * depth;
        };
        for (var i = 0; i < elements.length; i++) {
            if (lastElements[elements[i].depth] == null || lastElements[elements[i].node.node().depth()].elementOnRow < elements[i].elementOnRow) {
                lastElements[elements[i].node.node().depth()] = elements[i];
            }
            maxDepth = Math.max(maxDepth, elements[i].node.node().depth());
        }
        var rowWidths = Array(Object.keys(lastElements).length);
        for (var i = 0; i < Object.keys(lastElements).length; i++) {
            rowWidths[i] = blockSize + lastElements[i].elementOnRow * blockSize + lastElements[i].indexOnRow * blockSize / 3 + 2;
        }
        var scalingFactor = 1;
        var maxRowWidth = rowWidths.reduce(function (a, b) { return Math.max(a, b) }, 0);
        if (maxRowWidth > svgWidth) {
            scalingFactor = svgWidth / maxRowWidth;
            blockSize = blockSize * scalingFactor;
        }
        var rowStartingPoints = rowWidths.map(function (width) { return (svgWidth - scalingFactor * width) / 2; });

        var svg = d3.select("body").select(".bTree").select("svg");

        /*
            Elements
        */
        var boxes = svg.selectAll("g").data(elements, function (d) { return d.node.id(); });
        boxes.exit().remove();
        var newGs = boxes.enter().append("g")
            .attr("class","bTreeElement");
        newGs.attr("opacity", 0)
            .transition()
            .duration(phase)
            .attr("opacity", 1);
        var rects = newGs.append("rect")
            .attr("x", function (d, i) { return rowStartingPoints[d.node.node().depth()] + blockSize * d.elementOnRow + blockSize / 3 * d.indexOnRow + 1; })
            .attr("y", function (d, i) { return rowHeight(d.node.node().depth()); })
            .attr("width", blockSize)
            .attr("height", blockSize)
            .attr("fill", function (d, i) {
                return colorFn(d.node.id()) || "#999999";
            })
            .attr("stroke", "black")
        var labels = newGs.append("text")
            .attr("x", function (d, i) { return rowStartingPoints[d.node.node().depth()] + blockSize * d.elementOnRow + blockSize / 3 * d.indexOnRow + blockSize / 2 + 1; })
            .attr("y", function (d, i) { return rowHeight(d.node.node().depth()) + blockSize / 2; })
            .attr("dy", ".35em")
            .attr("font-size", function (d) {
                if (d.node.value() > 0) {
                    var digits = Math.floor(Math.log10(d.node.value())) + 1;
                } else {
                    var digits = Math.floor(Math.log10(-d.node.value())) + 2;
                }
                return digits < 4 ? blockSize / 2 : blockSize * 1.8 / digits;
            })
            .attr("text-anchor", "middle")
            .attr("fill", function (d) {
                var nodeColor = colorFn(d.node.id()) || "#999999";
                return getContrast(nodeColor) > 127 ? "#000000" : "#FFFFFF";
            })
            .text(function (d) { return d.node.value(); });

        svg.selectAll("g").select("rect")
            .attr("fill", function (d, i) {
                return colorFn(d.node.id()) || "#999999";
            })
            .transition().duration(phase)
            .attr("x", function (d, i) { return rowStartingPoints[d.node.node().depth()] + blockSize * d.elementOnRow + blockSize / 3 * d.indexOnRow + 1; })
            .attr("y", function (d, i) { return rowHeight(d.node.node().depth()); })
            .attr("width", blockSize)
            .attr("height", blockSize)
            .attr("stroke", function () {return "#000000" });


        svg.selectAll("g").select("text")
            .attr("fill", function (d) {
                var nodeColor = colorFn(d.node.id()) || "#999999";
                return getContrast(nodeColor) > 127 ? "#000000" : "#FFFFFF";
            })
            .transition().duration(phase)
            .attr("x", function (d, i) { return rowStartingPoints[d.node.node().depth()] + blockSize * d.elementOnRow + blockSize / 3 * d.indexOnRow + blockSize / 2 + 1; })
            .attr("y", function (d, i) { return rowHeight(d.node.node().depth()) + blockSize / 2; })
            .attr("dy", ".35em")
            .attr("font-size", function (d) {
                if (d.node.value() > 0) {
                    var digits = Math.floor(Math.log10(d.node.value())) + 1;
                } else {
                    var digits = Math.floor(Math.log10(-d.node.value())) + 2;
                }
                return digits < 4 ? blockSize / 2 : blockSize * 1.8 / digits;
            })
            .attr("text-anchor", "middle")
            .text(function (d) { return d.node.value(); });
        svg.selectAll("g")
            .on("click", function (d, i, obj) {
                setSelectedElement(d.node, 1);
            });

        /*
            Edges
        */
        var edgeElements = svg.selectAll("line").data(edges, function (d) { return [d.to.node, maxDepth - d.depth]; });
        var newEdges = edgeElements.enter().append("line");
        newEdges.attr("opacity", 1)
            .attr("stroke", "black")
            .attr("stroke-width", function (d, i) { return blockSize / 15; })
            .attr("x1", function (d, i) { return rowStartingPoints[d.depth - 1] + blockSize * (d.from.elementOnRow + 1) + blockSize / 3 * d.from.nodeOnRow + 1; })
            .attr("y1", function (d, i) { return rowHeight(d.depth - 1) + blockSize; })
            .attr("x2", function (d, i) { return rowStartingPoints[d.depth - 1] + blockSize * (d.from.elementOnRow + 1) + blockSize / 3 * d.from.nodeOnRow + 1; })
            .attr("y2", function (d, i) { return rowHeight(d.depth - 1) + blockSize; })
            .transition().duration(phase)
            .attr("x2", function (d, i) { return rowStartingPoints[d.depth] + blockSize * (d.to.firstElement + d.to.lastElement) / 2 + blockSize / 3 * d.to.node + blockSize / 2 + 1; })
            .attr("y2", function (d, i) { return rowHeight(d.depth); });
        edgeElements
            .transition().duration(phase)
            .attr("stroke-width", function (d, i) { return blockSize / 15; })
            .attr("x1", function (d, i) { return rowStartingPoints[d.depth - 1] + blockSize * (d.from.elementOnRow + 1) + blockSize / 3 * d.from.nodeOnRow + 1; })
            .attr("y1", function (d, i) { return rowHeight(d.depth - 1) + blockSize; })
            .attr("x2", function (d, i) { return rowStartingPoints[d.depth] + blockSize * (d.to.firstElement + d.to.lastElement) / 2 + blockSize / 3 * d.to.node + blockSize / 2 + 1; })
            .attr("y2", function (d, i) { return rowHeight(d.depth); })
        edgeElements.exit().remove();
    };
    setBTreeColorFn = function (func) {
        colorFn = func;
    };
})();