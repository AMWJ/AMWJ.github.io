(function () {
    var selectedElement = null;
    var dataStructures = null;
    setSelectedElement = function (id) {
        selectedElement = id;
        redisplayBTree();
    };
    refreshTrees = function (target) {
        dataStructures = target;
        var traversedRedBlackTree = dataStructures.traverseRedBlackTree();
        redisplayRedBlackTree(traversedRedBlackTree.elements, traversedRedBlackTree.edges);
        var traversedBTree = dataStructures.traverseBTree();
        redisplayBTree(traversedBTree.elements, traversedBTree.edges);
    }
    var nodeColor = function (id) {
        return selectedElement == id ? "#FFAAAA" : null;
    }
    window.addEventListener("resize", function () {
        if (dataStructures != null) {
            refreshTrees(dataStructures);
        }
    });
    setBTreeColorFn(nodeColor);
})();