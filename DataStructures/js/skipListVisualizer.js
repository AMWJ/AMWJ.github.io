(function () {
    var visualizedElements = null;
    var visualizedEdges = null;
    var colorFn = function () { return null; };
    redisplaySkipList = function (elements, edges) {
        visualizedElements = elements || visualizedElements;
        visualizedEdges = edges || visualizedEdges;
        elements = visualizedElements;
        edges = visualizedEdges;
        $skipList = $(".skipList");
        var maxHeight = 0;
        var svgWidth = $skipList.width();
        var svgHeight = $skipList.height();
        var bottom = svgHeight - 10;
        var blockSize = 30.0;
        for (var i = 0; i < elements.length; i++) {
            maxHeight = Math.max(maxHeight, elements[i].height());
        }
        var scalingFactor = 1;
        var widthNeeded = elements.length * blockSize + 2;
        if (widthNeeded > svgWidth) {
            scalingFactor = svgWidth / widthNeeded;
            blockSize = blockSize * scalingFactor;
        }

        var svg = d3.select("body").select(".skipList").select("svg");

        /*
            Elements
        */
        var boxes = svg.selectAll("g").data(elements, function (d) { return d.id(); });
        boxes.exit().remove();
        var newGs = boxes.enter().append("g")
            .attr("class", "skipListElement");
        newGs.attr("opacity", 0)
            .transition()
            .duration(phase)
            .attr("opacity", 1);
        var rects = newGs.append("rect")
            .attr("fill", function (d, i) {
                return colorFn(d.id()) || "#FFFFFF";
            })
            .attr("x", function (d, i) { return i * blockSize + 1; })
            .attr("y", function (d, i) { return bottom - (d.height() + 1) * blockSize; })
            .attr("width", blockSize)
            .attr("height", function (d, i) { return (d.height() + 1) * blockSize; })
        svg.selectAll("g").select("rect")
            .attr("fill", function (d, i) {
                return colorFn(d.id()) || "#FFFFFF";
            })
            .transition().duration(phase)
            .attr("x", function (d, i) { return i * blockSize + 1; })
            .attr("y", function (d, i) { return bottom - (d.height() + 1) * blockSize; })
            .attr("width", blockSize)
            .attr("height", function (d, i) { return (d.height() + 1) * blockSize; })
            .attr("stroke", "black")
        var labels = newGs.append("text")
            .attr("x", function (d, i) { return i * blockSize + blockSize / 2 + 1; })
            .attr("y", function (d, i) {
                return bottom - blockSize / 2;
            })
            .attr("dy", ".35em")
            .attr("fill", function (d) {
                var nodeColor = colorFn(d.id()) || "#FFFFFF";
                return getContrast(nodeColor) > 127 ? "#000000" : "#FFFFFF";
            })
            .attr("font-size", function (d) {
                var ret = blockSize / 2;
                if (d.value() > 0) {
                    var digits = Math.floor(Math.log10(d.value())) + 1;
                } else {
                    var digits = Math.floor(Math.log10(-d.value())) + 2;
                }
                return digits * 10 < blockSize ? ret : ret * 3 / digits;
            })
            .attr("text-anchor", "middle")
            .text(function (d) { return d.value(); });
        svg.selectAll("g").select("text")
            .attr("fill", function (d) {
                var nodeColor = colorFn(d.id()) || "#FFFFFF";
                return getContrast(nodeColor) > 127 ? "#000000" : "#FFFFFF";
            })
            .transition().duration(phase)
            .attr("x", function (d, i) { return i * blockSize + blockSize / 2 + 1; })
            .attr("y", function (d, i) {
                return bottom - blockSize / 2;
            })
            .attr("font-size", function (d) {
                var ret = blockSize / 2;
                if (d.value() > 0) {
                    var digits = Math.floor(Math.log10(d.value())) + 1;
                } else {
                    var digits = Math.floor(Math.log10(-d.value())) + 2;
                }
                return digits * 10 < blockSize ? ret : ret * 3 / digits;
            });

        svg.selectAll("g")
            .on("click", function (d, i, obj) {
                setSelectedElement(d, 2);
            });

        /*
            Edges
        */
        var edgeElements = svg.selectAll("line").data(edges, function (d) { return [d.from ? d.from.node.id() : -1, d.height]; });
        var newEdges = edgeElements.enter().append("line");
        newEdges.attr("opacity", 1)
            .attr("stroke", "black")
            .attr("stroke-width", function (d, i) { return blockSize / 20; })
            .attr("stroke-dasharray", "2, 1")
            .attr("x1", function (d, i) {
                if (d.from) {
                    return (d.from.index + 1) * blockSize
                } else {
                    return 0;
                }
            })
            .attr("y1", function (d, i) { return bottom - d.height * blockSize - blockSize / 2; })
            .attr("x2", function (d, i) {
                if (d.from) {
                    return (d.from.index + 1) * blockSize
                } else {
                    return 0;
                }            })
            .attr("y2", function (d, i) { return bottom - d.height * blockSize - blockSize / 2; })
            .transition().duration(phase)
            .attr("x2", function (d, i) { return d.to.index * blockSize; })
        edgeElements
            .transition().duration(phase)
            .attr("stroke-width", function (d, i) { return blockSize / 15; })
            .attr("x1", function (d, i) {
                if (d.from) {
                    return (d.from.index + 1) * blockSize
                } else {
                    return 0;
                }
            })
            .attr("y1", function (d, i) { return bottom - d.height * blockSize - blockSize / 2; })
            .attr("x2", function (d, i) { return d.to.index * blockSize; })
            .attr("y2", function (d, i) { return bottom - d.height * blockSize - blockSize / 2; })
        edgeElements.exit().remove();
    };
    setSkipListColorFn = function (func) {
        colorFn = func;
    };
})();