(function () {
    var selectedElement = null;
    var structureSelectedIn = null;
    var dataStructures = null;
    setSelectedElement = function (element, selectedIn) {
        if (selectedElement != null && structureSelectedIn == selectedIn && element.id() == selectedElement.id()) {
            selectedElement = null;
        } else {
            selectedElement = element;
        }
        structureSelectedIn = selectedIn;
        redisplayRedBlackTree();
        redisplayBTree();
        redisplaySkipList();
    };
    refreshTrees = function (target) {
        dataStructures = target;
        var traversedRedBlackTree = dataStructures.traverseRedBlackTree();
        redisplayRedBlackTree(traversedRedBlackTree.elements, traversedRedBlackTree.edges);
        var traversedBTree = dataStructures.traverseBTree();
        redisplayBTree(traversedBTree.elements, traversedBTree.edges);
        var traversedSkipList = dataStructures.traverseSkipList();
        redisplaySkipList(traversedSkipList.elements, traversedSkipList.edges);
    }
    var nodeColor = function (id) {
        if (selectedElement == null) {
            return null;
        }
        if (selectedElement.id() == id) {
            return "#000000"
        }
        switch (structureSelectedIn) {
            case 0:
                var parent = selectedElement.parent();
                while (parent != null) {
                    if (parent.id() == id) {
                        return "#269A26";
                    }
                    parent = parent.parent();
                }
                if (selectedElement.left() != null && (selectedElement.left().id() == id) || (selectedElement.right() != null && selectedElement.right().id() == id)) {
                    return "#77EE77";
                }
                break;
            case 1:
                var node = selectedElement.node();
                for (var i = 0; i < node.elements(); i++) {
                    if (node.getElement(i).id() == id) {
                        return "#99c3ff";
                    }
                }
                if (node.parent()) {
                    var index = node.parent().indexOfChild(node);
                    if ((index > 0 && node.parent().getElement(index - 1).id() == id) || (index < node.parent().elements() && node.parent().getElement(index).id() == id)) {
                        return "#4994ff";
                    }
                }
                if (!node.isLeaf()) {
                    var leftChild = node.getChild(node.indexOfElement(selectedElement));
                    for (var i = 0; i < leftChild.elements(); i++) {
                        if (leftChild.getElement(i).id() == id) {
                            return "#d8e8ff";
                        }
                    }
                    var rightChild = node.getChild(node.indexOfElement(selectedElement) + 1);
                    for (var i = 0; i < rightChild.elements(); i++) {
                        if (rightChild.getElement(i).id() == id) {
                            return "#d8e8ff";
                        }
                    }
                }
                break;
            case 2:
                var first = null;
                if (selectedElement.height() > 0 && ((selectedElement.pointer(selectedElement.height()) && selectedElement.pointer(selectedElement.height()).id() == id) || (selectedElement.backPointer(selectedElement.height()) && selectedElement.backPointer(selectedElement.height()).id() == id))) {
                    return "#ffbf56"
                }
                else if ((selectedElement.pointer(0) && selectedElement.pointer(0).id() == id) || (selectedElement.backPointer(0) && selectedElement.backPointer(0).id() == id)) {
                    return "#ffe4b7"
                }
        }
        return "#FFFFFF";
    }
    window.addEventListener("resize", function () {
        if (dataStructures != null) {
            redisplayRedBlackTree();
            redisplayBTree();
            redisplaySkipList();
        }
    });
    setBTreeColorFn(nodeColor);
    setRedBlackTreeColorFn(nodeColor);
    setSkipListColorFn(nodeColor);
})();