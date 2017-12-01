// Generates 2-3-4 Tree from a Red/Black Tree
BTree = function (redBlackTree) {
    var BTreeElement = function (id, value) {
        var node = null;
        var retObj = {
            id: function () {
                return id;
            },
            value: function (index) {
                return value;
            },
            node: function () {
                return node;
            },
            setNode: function (n) {
                node = n;
            },
            indexInNode: function () {
                return this.node().indexOfElement(this);
            },
        };
        return retObj;
    }
    var BTreeNode = function (parent, leaf) {
        var size = 0;
        var elements = [];
        var children = [];
        var retObj = {
            elements: function () {
                return size;
            },
            parent: function () {
                return parent;
            },
            getElement: function (index) {
                return elements[index];
            },
            getChild: function (index) {
                return children[index];
            },
            addElement: function (element) {
                size++;
                elements.push(element);
            },
            addChild: function (child) {
                children.push(child);
            },
            isLeaf: function () {
                return leaf;
            },
            insertChild: function (index, child) {
                children.splice(index, 0, child);
            },
            insertElement: function (index, element) {
                size++;
                elements.splice(index, 0, element);
            },
            removeElement: function (element) {
                size--;
                var index = this.indexOfElement(element);
                if (index > -1) {
                    elements.splice(index, 1);
                }
            },
            removeChild: function (child) {
                var index = this.indexOfChild(child);
                if (index > -1) {
                    children.splice(index, 1);
                }
            },
            setParent: function (node) {
                parent = node;
            },
            indexOfElement: function (element) {
                return elements.indexOf(element);
            },
            indexOfChild: function (child) {
                return children.indexOf(child);
            },
            depth: function () {
                if (parent == null) {
                    return 0;
                } else {
                    return parent.depth() + 1;
                }
            },
        };
        return retObj;
    }
    var size = 0;
    var root = null;
    var allElements = {};
    var currentlyFixing = null;

    var retObj = {
        insertIntoNull: function (id, value) {
            size++;
            currentlyFixing = BTreeElement(id, value);
            var newNode = BTreeNode(null, true);
            newNode.addElement(currentlyFixing);
            currentlyFixing.setNode(newNode);
            allElements[id] = currentlyFixing;
            root = newNode;
        },
        insertIntoNonNull: function (id, value) {
            size++;
            currentlyFixing = BTreeElement(id, value);
            var consideredNode = root;
            var i;
            while (consideredNode != null) {
                for (i = 0; i < consideredNode.elements(); i++) {
                    if (consideredNode.getElement(i).value() > value) {
                        break;
                    }
                }
                var nextNode = consideredNode.getChild(i);
                if (nextNode == null) {
                    break;
                }
                consideredNode = nextNode;
            }
            consideredNode.insertElement(i, currentlyFixing);
            currentlyFixing.setNode(consideredNode);
        },
        leftRotation: function () {
        },
        rightRotation: function () {
        },
        promotion: function () {
            var promotedIndex;
            var node = currentlyFixing.node();
            if (currentlyFixing.indexInNode() < node.elements() / 2) {
                promotedIndex = node.elements() / 2; 
            }
            else {
                promotedIndex = node.elements() / 2 - 1;
            }
            var promoted = node.getElement(promotedIndex);
            node.removeElement(promoted);
            var parentNode;
            if (node == root) {
                parentNode = BTreeNode(null, false);
                root = parentNode;
                node.setParent(parentNode);
                parentNode.addChild(node);
            } else {
                parentNode = node.parent();
            }
            var newNode = BTreeNode(parentNode, node.isLeaf());
            var i;
            for (i = 0; i < parentNode.elements(); i++) {
                if (parentNode.getElement(i).value() > promoted.value()) {
                    break;
                }
            }
            parentNode.insertElement(i, promoted);
            promoted.setNode(parentNode);
            parentNode.insertChild(i + 1, newNode);
            newNode.setParent(parentNode);
            while (node.getElement(promotedIndex) != null) {
                var elementToMove = node.getElement(promotedIndex);
                node.removeElement(elementToMove);
                newNode.addElement(elementToMove);
                elementToMove.setNode(newNode);
                if (!node.isLeaf()) {
                    var childToMove = node.getChild(promotedIndex + 1);
                    node.removeChild(childToMove);
                    newNode.addChild(childToMove);
                    childToMove.setParent(newNode);
                }
            }
            if (!node.isLeaf()) {
                var childToMove = node.getChild(promotedIndex + 1);
                node.removeChild(childToMove);
                newNode.addChild(childToMove);
                childToMove.setParent(newNode);
            }
            currentlyFixing = promoted;
        },
        traverse: function () {
            var elementArray = new Array(size);
            var edgeArray = [];
            var nodes = [{ node: root }];
            var depth = -1;
            var nodeOnRow = 0;
            var elementOnRow = 0;
            var writeIndex = 0;
            while (nodes.length > 0) {
                var queueElement = nodes.pop();
                var node = queueElement.node;
                    
                if (node.depth() > depth) {
                    nodeOnRow = 0;
                    elementOnRow = 0;
                    depth = node.depth();
                }
                else {
                    nodeOnRow++;
                }

                if (root != node) {
                    edgeArray.push({
                        depth: node.depth(),
                        from: {
                            nodeOnRow: queueElement.parentNodeIndex,
                            elementOnRow: queueElement.parentElementIndex,
                        },
                        to: {
                            node: nodeOnRow,
                            firstElement: elementOnRow,
                            lastElement: elementOnRow + node.elements() - 1,
                        },
                    });
                }

                if (!node.isLeaf()) {
                    for (var i = 0; i <= node.elements(); i++) {
                        var childNode = {
                            node: node.getChild(i),
                            parentNodeIndex: nodeOnRow,
                            parentElementIndex: elementOnRow + i - 1
                        };
                        nodes.splice(0, 0, childNode);
                    }
                }
                for (var i = 0; i < node.elements(); i++) {
                    elementArray[writeIndex] = {
                        value: node.getElement(i).value(),
                        id: node.getElement(i).id(),
                        depth: node.depth(),
                        indexOnRow: nodeOnRow,
                        elementOnRow: elementOnRow,
                    };
                    elementOnRow++;
                    writeIndex++;
                }
            }
            return { elements: elementArray, edges: edgeArray };
        },
        root: function () {
            return root;
        }
    };
    return retObj;
}