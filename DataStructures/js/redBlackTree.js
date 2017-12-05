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
            rowIndex: function () {
                if (parent == null) {
                    return 0;
                } else if (this.isLeftChild()) {
                    return parent.rowIndex() * 2;
                }
                else {
                    return parent.rowIndex() * 2 + 1;
                }
            },
        };
        return retObj;
    }
    var size = 0;
    var root = null;
    var currentlyFixing = null;

    var retObj = {
        size: function () {
            return size;
        },
        root: function () {
            return root;
        },
        finger: function () {
            return currentlyFixing;
        },
        insertIntoNull: function (id, value) {
            size++;
            currentlyFixing = RedBlackTreeNode(id, value);
            root = currentlyFixing;
            root.setColor(false);
        },
        insertIntoNonNull: function (id, value) {
            size++;
            currentlyFixing = RedBlackTreeNode(id, value);
            var consideredNode = root;
            var consideredValue = null;
            while (true) {
                consideredValue = consideredNode.value();
                var nextNode = value < consideredValue ? consideredNode.left() : consideredNode.right();
                if (nextNode == null) {
                    break;
                }
                consideredNode = nextNode;
            }
            if (value < consideredValue) {
                consideredNode.setLeft(currentlyFixing);
            }
            else {
                consideredNode.setRight(currentlyFixing);
            }
            currentlyFixing.setParent(consideredNode);
        },
        findNode: function (value) {
            var node = root;
            while (node != null) {
                if (node.value() == value) {
                    return node;
                }
                else {
                    node = node.value() > value ? node.left() : node.right();
                }
            }
            return null;
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
        clear: function () {
            size = 0;
            root = null;
            currentlyFixing = null;

        },
        traverse: function () {
            var nodeArray = new Array(size);
            var edgeArray = new Array();
            if (root == null) {
                return { elements: [], edges: [] };
            }
            var firstNode = root;
            var nodes = [firstNode];
            var depth = -1;
            var writeIndex = 0;
            while (nodes.length > 0) {
                var node = nodes.pop();

                if (node.depth() > depth) {
                    depth = node.depth();
                }
                nodeArray[writeIndex] = node;
                writeIndex++;

                if (root != node) {
                    if (node.parent().id() < node.id()) {
                        edgeArray.push({
                            depth: node.parent().depth(),
                            from: node.parent(),
                            to: node,
                        });
                    }
                    else {
                        edgeArray.push({
                            depth: node.parent().depth(),
                            from: node,
                            to: node.parent(),
                        });
                    }
                }

                if (node.left() != null) {
                    var childNode = node.left();
                    nodes.splice(0, 0, childNode);
                }
                if (node.right() != null) {
                    var childNode = node.right()
                    nodes.splice(0, 0, childNode);
                }
            }
            return { elements: nodeArray, edges: edgeArray };

        }
    }
    return retObj;
}