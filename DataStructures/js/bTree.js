// Generates 2-3-4 Tree from a Red/Black Tree
BTree = function () {
    var BTreeElement = function (id, value, fake) {
        var node = null;
        var retObj = {
            id: function () {
                return id;
            },
            value: function (index) {
                return value;
            },
            fake: function (fake) {
                return fake;
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
            lastChild: function () {
                return children[children.length - 1];
            },
            lastElement: function () {
                return elements[elements.length - 1];
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
    var currentlyFixing = null;

    var retObj = {
        insert: function (id, value) {
            if (size == 0) {
                this.insertIntoNull(id, value);
            }
            else {
                this.insertIntoNonNull(id, value);
            }
        },
        insertIntoNull: function (id, value) {
            size++;
            currentlyFixing = BTreeElement(id, value);
            var newNode = BTreeNode(null, true);
            newNode.addElement(currentlyFixing);
            currentlyFixing.setNode(newNode);
            root = newNode;
            currentlyFixing = null;
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
        clear: function () {
            size = 0;
            root = null;
            currentlyFixing = null;
        },
        deleteNodeAndReplace: function (value) {
            currentlyFixing = null;
            var elementToDelete = root.getElement(0);
            var i;
            var lastPerfectMatch = null;
            while (true) {
                if (elementToDelete.value() == value) {
                    lastPerfectMatch = elementToDelete;
                }
                var indexInNode = elementToDelete.indexInNode();
                if (elementToDelete.value() > value) {
                    if (!elementToDelete.node().isLeaf()) {
                        elementToDelete = elementToDelete.node().getChild(indexInNode).getElement(0);
                        continue;
                    }
                    else {
                        break;
                    }
                }
                else if (elementToDelete.node().elements() - 1 > indexInNode) {
                    if (elementToDelete.node().getElement(indexInNode + 1).value() <= value) {
                        elementToDelete = elementToDelete.node().getElement(indexInNode + 1);
                        continue;
                    }
                }
                if (!elementToDelete.node().isLeaf()) {
                    elementToDelete = elementToDelete.node().getChild(indexInNode + 1).getElement(0);
                    continue;
                }
                else {
                    break;
                }
            }
            elementToDelete = lastPerfectMatch;
            if (elementToDelete != null) {
                currentlyFixing = elementToDelete.node();
                if (!elementToDelete.node().isLeaf()) {
                    var leftSuccessor = elementToDelete.node().getChild(elementToDelete.indexInNode()).lastElement();
                    while (!leftSuccessor.node().isLeaf()) {
                        leftSuccessor = leftSuccessor.node().lastChild().lastElement();
                    }
                    currentlyFixing = leftSuccessor.node();
                    leftSuccessor.node().removeElement(leftSuccessor);
                    elementToDelete.node().insertElement(elementToDelete.indexInNode(), leftSuccessor);
                    leftSuccessor.setNode(elementToDelete.node());
                }
                elementToDelete.node().removeElement(elementToDelete);
            }
            size--;
        },
        pushIssueUp: function (rotateLeft) {
            var parent = currentlyFixing.parent();
            if (rotateLeft) {
                var sibling = parent.getChild(parent.indexOfChild(currentlyFixing) - 1);
                var demoted = parent.getElement(parent.indexOfChild(currentlyFixing) - 1);
                sibling.addElement(demoted);
                if (!currentlyFixing.isLeaf()) {
                    currentlyFixing.getChild(0).setParent(sibling);
                    sibling.addChild(currentlyFixing.getChild(0));
                }
            }
            else {
                var sibling = parent.getChild(parent.indexOfChild(currentlyFixing) + 1);
                var demoted = parent.getElement(parent.indexOfChild(currentlyFixing));
                sibling.insertElement(0, demoted);
                if (!currentlyFixing.isLeaf()) {
                    currentlyFixing.getChild(0).setParent(sibling);
                    sibling.insertChild(0, currentlyFixing.getChild(0));
                }
            }
            parent.removeElement(demoted);
            demoted.setNode(sibling);
            parent.removeChild(currentlyFixing);
            currentlyFixing = parent;

            if (parent == root && parent.elements() == 0) {
                currentlyFixing = null;
                root = sibling;
                sibling.setParent(null);
            }
        },
        rotateRedSibling: function () {
        },
        rotateRedNephew: function (rotateLeft) {
            var parent = currentlyFixing.parent();
            if (rotateLeft) {
                var sibling = parent.getChild(parent.indexOfChild(currentlyFixing) - 1);
                if (!currentlyFixing.isLeaf()) {
                    var movedEdge = sibling.lastChild();
                    sibling.removeChild(movedEdge);
                    currentlyFixing.insertChild(0, movedEdge);
                    movedEdge.setParent(currentlyFixing);
                }
                var demoted = parent.getElement(parent.indexOfChild(currentlyFixing) - 1);
                parent.removeElement(demoted);
                demoted.setNode(currentlyFixing);
                currentlyFixing.insertElement(0, demoted);
                var closestSibling = sibling.lastElement();
                if (sibling.elements() > 2) {
                    sibling.removeElement(closestSibling);
                    currentlyFixing.insertElement(0, closestSibling);
                    closestSibling.setNode(currentlyFixing);
                    closestSibling = sibling.lastElement();
                }
                sibling.removeElement(closestSibling);
                parent.insertElement(parent.indexOfChild(currentlyFixing) - 1, closestSibling);
                closestSibling.setNode(parent);
            } else {
                var sibling = parent.getChild(parent.indexOfChild(currentlyFixing) + 1);
                if (!currentlyFixing.isLeaf()) {
                    var movedEdge = sibling.getChild(0);
                    sibling.removeChild(movedEdge);
                    currentlyFixing.addChild(movedEdge);
                    movedEdge.setParent(currentlyFixing);
                }
                var demoted = parent.getElement(parent.indexOfChild(currentlyFixing));
                parent.removeElement(demoted);
                demoted.setNode(currentlyFixing);
                currentlyFixing.addElement(demoted);
                var closestSibling = sibling.getElement(0);
                if (sibling.elements() > 2) {
                    sibling.removeElement(closestSibling);
                    currentlyFixing.addElement(closestSibling);
                    closestSibling.setNode(currentlyFixing);
                    closestSibling = sibling.getElement(0);
                }
                sibling.removeElement(closestSibling);
                parent.insertElement(parent.indexOfChild(currentlyFixing), closestSibling);
                closestSibling.setNode(parent);
            }
            currentlyFixing = null;
        },
        traverse: function () {
            var elementArray = new Array(size);
            var edgeArray = [];
            if (root == null) {
                return { elements: [], edges: [] };
            }
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
                        node: node.getElement(i),
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