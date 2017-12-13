(function (tree) {
    var visualizedElements = null;
    var visualizedEdges = null;
    var colorFn = function () { return "black"; };
    var maxDepth = 0;
    redisplayRedBlackTree = function (elements, edges) {
        var duration = elements == null ? 0 : phase;
        visualizedElements = elements || visualizedElements;
        visualizedEdges = edges || visualizedEdges;
        elements = visualizedElements;
        edges = visualizedEdges;
        $redBlackTree = $(".redBlack");
        var svgWidth = $redBlackTree.width();
        var svgHeight = $redBlackTree.height() - 2;
        var lastElements = {};
        var blockSize = 30.0;
        for (var i = 0; i < elements.length; i++) {
            maxDepth = Math.max(maxDepth, elements[i].depth());
        }

        var svg = d3.select("body").select(".redBlack").select("svg");

        if (svgHeight > 0) {
            /*
                Elements
            */
            var nodes = svg.selectAll("g").data(elements, function (d) { return d.id(); });
            var newGs = nodes.enter().append("g")
                .attr("class", "redBlackTreeElement");
            newGs.attr("opacity", 0)
                .transition().duration(duration * 3 / 4)
                .attr("opacity", 1);
            var circles = newGs.append("circle")
                .attr("cx", function (d, i) { return (svgWidth / (Math.pow(2, d.depth()) + 1)) * (d.rowIndex() + 1); })
                .attr("cy", function (d, i) {
                    if (maxDepth * blockSize * 3 + blockSize < svgHeight) {
                        return blockSize * 3 * d.depth() + blockSize / 2 + 1;
                    }
                    else {
                        var betweenRows = (svgHeight - blockSize) / maxDepth;
                        return betweenRows * d.depth() + blockSize / 2 + 1;
                    }
                })
                .attr("r", function (d) {
                    var spacing = (svgWidth / (Math.pow(2, d.depth()) + 1));
                    if (spacing < blockSize) {
                        return Math.max(spacing / 2 - 1, 1);
                    }
                    else {
                        return blockSize / 2;
                    }
                })
                .attr("fill", function (d, i) {
                    return colorFn(d.id()) || (d.color() ? "#FFCCCC" : "#000000");
                })
                .attr("stroke", "black");

            var labels = newGs.append("text")
                .attr("x", function (d, i) { return (svgWidth / (Math.pow(2, d.depth()) + 1)) * (d.rowIndex() + 1); })
                .attr("y", function (d, i) {
                    if (maxDepth * blockSize * 3 + blockSize < svgHeight) {
                        return blockSize * 3 * d.depth() + blockSize / 2 + 1;
                    }
                    else {
                        var betweenRows = (svgHeight - blockSize) / maxDepth;
                        return betweenRows * d.depth() + blockSize / 2 + 1;
                    }
                })
                .attr("dy", ".35em")
                .attr("fill", function (d) {
                    var nodeColor = colorFn(d.id()) || (d.color() ? "#FFCCCC" : "#000000");
                    return getContrast(nodeColor) > 127 ? "#000000" : "#FFFFFF";
                })
                .attr("font-size", function (d) {
                    var spacing = (svgWidth / (Math.pow(2, d.depth()) + 1));
                    var ret = spacing < blockSize ? Math.max(spacing / 2 - 1, 1) : blockSize / 2;
                    if (d.value() > 0) {
                        var digits = Math.floor(Math.log10(d.value())) + 1;
                    } else {
                        var digits = Math.floor(Math.log10(-d.value())) + 2;
                    }
                    return digits < 3 ? ret : ret * 3 / digits;
                })
                .attr("text-anchor", "middle")
                .text(function (d) { return d.value(); });

            svg.selectAll("g").select("circle")
                .transition().duration(duration * 3 / 4)
                .attr("fill", function (d, i) {
                    return colorFn(d.id()) || (d.color() ? "#FFCCCC" : "#000000");
                })
                .attr("cx", function (d, i) { return (svgWidth / (Math.pow(2, d.depth()) + 1)) * (d.rowIndex() + 1); })
                .attr("cy", function (d, i) {
                    if (maxDepth * blockSize * 3 + blockSize < svgHeight) {
                        return blockSize * 3 * d.depth() + blockSize / 2 + 1;
                    }
                    else {
                        var betweenRows = (svgHeight - blockSize) / maxDepth;
                        return betweenRows * d.depth() + blockSize / 2 + 1;
                    }
                })
                .attr("r", function (d) {
                    var spacing = (svgWidth / (Math.pow(2, d.depth()) + 1));
                    if (spacing < blockSize) {
                        return Math.max(spacing / 2 - 1, 1);
                    }
                    else {
                        return blockSize / 2;
                    }
                })
                .attr("stroke", "black");

            svg.selectAll("g").select("text")
                .transition().duration(duration * 3 / 4)
                .attr("fill", function (d) {
                    var nodeColor = colorFn(d.id()) || (d.color() ? "#FFCCCC" : "#000000");
                    return getContrast(nodeColor) > 127 ? "#000000" : "#FFFFFF";
                })
                .attr("x", function (d, i) { return (svgWidth / (Math.pow(2, d.depth()) + 1)) * (d.rowIndex() + 1); })
                .attr("y", function (d, i) {
                    if (maxDepth * blockSize * 3 + blockSize < svgHeight) {
                        return blockSize * 3 * d.depth() + blockSize / 2 + 1;
                    }
                    else {
                        var betweenRows = (svgHeight - blockSize) / maxDepth;
                        return betweenRows * d.depth() + blockSize / 2 + 1;
                    }
                })
                .attr("dy", ".35em")
                .attr("font-size", function (d) {
                    var spacing = (svgWidth / (Math.pow(2, d.depth()) + 1));
                    var ret = spacing < blockSize ? Math.max(spacing / 2 - 1, 1) : blockSize / 2;
                    if (d.value() > 0) {
                        var digits = Math.floor(Math.log10(d.value())) + 1;
                    } else {
                        var digits = Math.floor(Math.log10(-d.value())) + 2;
                    }
                    return digits < 3 ? ret : ret * 3 / digits;
                })
                .attr("text-anchor", "middle")
                .text(function (d) { return d.value(); });
            nodes.exit().transition().duration(duration * 1 / 4).attr("opacity", 0).remove();
            svg.selectAll("g")
                .on("click", function (d, i, obj) {
                    setSelectedElement(d, 0);
                });
            /*
                Edges
            */
            var edgeElements = svg.selectAll("line").data(edges, function (d) {
                return [d.from.id(), d.to.id()];
            });
            var newEdges = edgeElements.enter().append("line");
            newEdges.attr("opacity", 1)
                .attr("stroke", "black")
                .attr("stroke-width", function (d, i) { return d.depth < 3 ? blockSize / 15 : blockSize / Math.pow(2, d.depth + 1); })
                .attr("x1", function (d, i) { return (svgWidth / (Math.pow(2, d.from.depth()) + 1)) * (d.from.rowIndex() + 1); })
                .attr("y1", function (d, i) {
                    if (maxDepth * blockSize * 3 + blockSize < svgHeight) {
                        return blockSize * 3 * d.from.depth() + blockSize / 2 + 1;
                    }
                    else {
                        var betweenRows = (svgHeight - blockSize) / maxDepth;
                        return betweenRows * d.from.depth() + blockSize / 2 + 1;
                    }
                })
                .attr("x2", function (d, i) { return (svgWidth / (Math.pow(2, d.from.depth()) + 1)) * (d.from.rowIndex() + 1); })
                .attr("y2", function (d, i) {
                    if (maxDepth * blockSize * 3 + blockSize < svgHeight) {
                        return blockSize * 3 * d.from.depth() + blockSize / 2 + 1;
                    }
                    else {
                        var betweenRows = (svgHeight - blockSize) / maxDepth;
                        return betweenRows * d.from.depth() + blockSize / 2 + 1;
                    }
                })
                .call(function (lines) {
                    lines.moveToBack();
                })
                .transition().duration(duration * 3 / 4)
                .transition().duration(duration * 1 / 4)
                .attr("x2", function (d, i) { return (svgWidth / (Math.pow(2, d.to.depth()) + 1)) * (d.to.rowIndex() + 1); })
                .attr("y2", function (d, i) {
                    if (maxDepth * blockSize * 3 + blockSize < svgHeight) {
                        return blockSize * 3 * d.to.depth() + blockSize / 2;
                    }
                    else {
                        var betweenRows = (svgHeight - blockSize) / maxDepth;
                        return betweenRows * d.to.depth() + blockSize / 2;
                    }
                })
            edgeElements
                .transition().duration(duration * 3 / 4)
                .attr("stroke-width", function (d, i) { return d.depth < 3 ? blockSize / 15 : blockSize / Math.pow(2, d.depth + 1); })
                .attr("x1", function (d, i) { return (svgWidth / (Math.pow(2, d.from.depth()) + 1)) * (d.from.rowIndex() + 1); })
                .attr("y1", function (d, i) {
                    if (maxDepth * blockSize * 3 + blockSize < svgHeight) {
                        return blockSize * 3 * d.from.depth() + blockSize / 2 + 1;
                    }
                    else {
                        var betweenRows = (svgHeight - blockSize) / maxDepth;
                        return betweenRows * d.from.depth() + blockSize / 2 + 1;
                    }
                })
                .attr("x2", function (d, i) { return (svgWidth / (Math.pow(2, d.to.depth()) + 1)) * (d.to.rowIndex() + 1); })
                .attr("y2", function (d, i) {
                    if (maxDepth * blockSize * 3 + blockSize < svgHeight) {
                        return blockSize * 3 * d.to.depth() + blockSize / 2 + 1;
                    }
                    else {
                        var betweenRows = (svgHeight - blockSize) / maxDepth;
                        return betweenRows * d.to.depth() + blockSize / 2 + 1;
                    }
                })
            edgeElements.exit().transition().duration(duration * 1 / 4).attr("opacity", 0).remove();
        }
    };
    setRedBlackTreeColorFn = function (func) {
        colorFn = func;
    };
})();