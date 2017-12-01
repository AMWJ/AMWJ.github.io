var Colors = { RED: true, BLACK: false };
RedBlackTree = function () {
    var RedBlackTreeNode = function (id, value) {
        var left = null;
        var right = null;
        var parent = null;
        var red = true;
        var retObj = {
            right: function () {
                return right;
            },
            left: function () {
                return left;
            },
            parent: function () {
                return parent;
            },
            color: function () {
                return red;
            },
            value: function () {
                return value;
            },
            id: function () {
                return id;
            },
            setParent: function (node) {
                parent = node;
            },
            setLeft: function (node) {
                left = node;
            },
            setRight: function (node) {
                right = node;
            },
            setColor: function (newColor) {
                red = newColor;
            },
            isLeftChild: function () {
                return parent.left() == this;
            },
            minInTree: function () {
                if (right == null) {
                }
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
    var allNodes = {};
    var currentlyFixing = null;

    var retObj = {
        size: function () {
            return size;
        },
        root: function () {
            return root;
        },
        getNodeById: function (id) {
            return allNodes[id];
        },
        finger: function () {
            return currentlyFixing;
        },
        insertIntoNull: function (id, value) {
            size++;
            currentlyFixing = RedBlackTreeNode(id, value);
            allNodes[id] = currentlyFixing;
            root = currentlyFixing;
            root.setColor(false);
        },
        insertIntoNonNull: function (id, value) {
            size++;
            currentlyFixing = RedBlackTreeNode(id, value);
            allNodes[id] = currentlyFixing;
            var consideredNode = root;
            var consideredValue = null;
            while (true) {
                consideredValue = consideredNode.value();
                var nextNode = value > consideredValue ? consideredNode.right() : consideredNode.left();
                if (nextNode == null) {
                    break;
                }
                consideredNode = nextNode;
            }
            if (value > consideredValue) {
                consideredNode.setRight(currentlyFixing);
            }
            else {
                consideredNode.setLeft(currentlyFixing);
            }
            currentlyFixing.setParent(consideredNode);
        },
        leftRotation: function () {
            var parent = currentlyFixing.parent();
            var grandparent = parent.parent();
            if (currentlyFixing.isLeftChild()) {
                parent.setLeft(currentlyFixing.right());
                if (currentlyFixing.right() != null) {
                    currentlyFixing.right().setParent(parent);
                }
                parent.setParent(currentlyFixing);
                currentlyFixing.setRight(parent);
                grandparent.setRight(currentlyFixing);
                currentlyFixing.setParent(grandparent);
                //Swap parent and bottom
                var temp_parent = parent;
                parent = currentlyFixing;
                currentlyFixing = temp_parent;
            }
            parent.setColor(false);
            grandparent.setColor(true);
            if (grandparent.parent() == null) {
                root = parent;
                parent.setParent(null);
            }
            else {
                parent.setParent(grandparent.parent());
                if (grandparent.isLeftChild()) {
                    grandparent.parent().setLeft(parent);
                }
                else {
                    grandparent.parent().setRight(parent);
                }
            }
            var sibling = parent.left();
            grandparent.setRight(sibling);
            if (sibling != null) {
                sibling.setParent(grandparent);
            }
            parent.setLeft(grandparent);
            grandparent.setParent(parent);
            currentlyFixing = null;
        },
        rightRotation: function () {
            var parent = currentlyFixing.parent();
            var grandparent = parent.parent();
            if (!currentlyFixing.isLeftChild()) {
                parent.setRight(currentlyFixing.left());
                if (currentlyFixing.left() != null) {
                    currentlyFixing.left().setParent(parent);
                }
                parent.setParent(currentlyFixing);
                currentlyFixing.setLeft(parent);
                grandparent.setLeft(currentlyFixing);
                currentlyFixing.setParent(grandparent);
                //Swap parent and bottom
                var temp_parent = parent;
                parent = currentlyFixing;
                currentlyFixing = temp_parent;
            }
            parent.setColor(false);
            grandparent.setColor(true);
            if (grandparent.parent() == null) {
                root = parent;
                parent.setParent(null);
            }
            else {
                parent.setParent(grandparent.parent());
                if (grandparent.isLeftChild()) {
                    grandparent.parent().setLeft(parent);
                }
                else {
                    grandparent.parent().setRight(parent);
                }
            }
            var sibling = parent.right();
            grandparent.setLeft(sibling);
            if (sibling != null) {
                sibling.setParent(grandparent);
            }
            parent.setRight(grandparent);
            grandparent.setParent(parent);
            currentlyFixing = null;
        },
        promotion: function () {
            var parent   = currentlyFixing.parent();
            var grandparent = parent.parent();
            var uncle = parent.isLeftChild() ? grandparent.right() : grandparent.left();
            grandparent.setColor(grandparent != root);
            parent.setColor(false);
            uncle.setColor(false);
            currentlyFixing = grandparent;
        },
        insert: function (value) {
            if (root == null) {
                this.insertIntoNull(value);
            }
            else {
                // Insertion
                this.insertIntoNonNull(value);

                // Rotation/Recoloring
                while (this.finger() != null) {
                    var bottomConsidered = this.finger();
                    var parent = bottomConsidered.parent();
                    if (!bottomConsidered.color() || !parent.color()) {
                        currentlyFixing = bottomConsidered.parent();
                        continue;
                    }
                    var grandparent = parent.parent();
                    var isParentLeftChild = parent.isLeftChild();
                    var uncle = isParentLeftChild ? grandparent.right() : grandparent.left();
                    if (uncle == null || uncle.color() == Colors.BLACK) {
                        if (isParentLeftChild) {
                            // Rotation needed clockwise
                            this.rightRotation();
                        }
                        else{
                            // Rotation needed counterclockwise
                            this.leftRotation();
                        }
                        break;
                    }
                    else {
                        this.promotion();
                    }
                }
            }
        },
        traverse: function () {
            var nodeArray = new Array(size);
            var edgeArray = new Array(size - 1);
            var firstNode = { node: root, rowIndex: 0 };
            var nodes = [firstNode];
            var depth = -1;
            var writeIndex = 0;
            while (nodes.length > 0) {
                var queueElement = nodes.pop();
                var node = queueElement.node;

                if (node.depth() > depth) {
                    depth = node.depth();
                }
                nodeArray[writeIndex] = { node: node, depth: depth, rowIndex: queueElement.rowIndex };
                writeIndex++;

                if (root != node) {
                    edgeArray.push({
                        depth: node.depth(),
                        from: {
                            node: node.parent(),
                            nodeOnRow: queueElement.parentNodeIndex,
                            elementOnRow: queueElement.parentElementIndex,
                        },
                        to: {
                            node: node,
                        },
                    });
                }

                if (node.left() != null) {
                    var childNode = {
                        node: node.left(),
                        rowIndex: queueElement.rowIndex * 2,
                    }
                    nodes.splice(0, 0, childNode);
                }
                if (node.right() != null) {
                    var childNode = {
                        node: node.right(),
                        rowIndex: queueElement.rowIndex * 2 + 1,
                    }
                    nodes.splice(0, 0, childNode);
                }
            }
            return { elements: nodeArray, edges: edgeArray };

        }
    }
    return retObj;
}