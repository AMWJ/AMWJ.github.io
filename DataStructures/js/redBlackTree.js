var Colors = { RED: true, BLACK: false };
RedBlackTree = function () {
    var RedBlackTreeNode = function (id, value, fake) {
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
            fake: function () {
                return fake || false;
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
            root = RedBlackTreeNode(id, value);
            root.setColor(false);
            currentlyFixing = null;
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
        clear: function () {
            size = 0;
            root = null;
            currentlyFixing = null;

        },
        deleteNodeAndReplace: function (value) {
            currentlyFixing = null;
            var nodeToDelete = root;
            while (nodeToDelete != null && nodeToDelete.value() != value) {
                nodeToDelete = nodeToDelete.value() > value ? nodeToDelete.left() : nodeToDelete.right();
            }
            if (nodeToDelete == null) {
                return;
            }
            size--;
            if (nodeToDelete.left() != null && nodeToDelete.right() != null) {
                var leftSuccessor = nodeToDelete.left();
                while (leftSuccessor.right() != null) {
                    var leftSuccessor = leftSuccessor.right();
                }
                if (leftSuccessor.parent() != nodeToDelete) {
                    if (leftSuccessor.left() != null) {
                        leftSuccessor.parent().setRight(leftSuccessor.left());
                        leftSuccessor.left().setParent(leftSuccessor.parent());
                        if (leftSuccessor.color() == Colors.BLACK && leftSuccessor.left().color() == Colors.RED) {
                            currentlyFixing = null;
                            leftSuccessor.left().setColor(Colors.BLACK);
                        }
                        else {
                            currentlyFixing = leftSuccessor.left();
                        }
                    }
                    else {
                        currentlyFixing = RedBlackTreeNode(null, null, true);
                        currentlyFixing.setParent(leftSuccessor.parent());
                        leftSuccessor.parent().setRight(currentlyFixing);
                    }
                    if (leftSuccessor.color() == Colors.RED) {
                        if (currentlyFixing.isLeftChild()) {
                            currentlyFixing.parent().setLeft(null);
                        } else {
                            currentlyFixing.parent().setRight(null);
                        }
                        currentlyFixing = null;
                    }
                    var parent = nodeToDelete.parent();
                    var left = nodeToDelete.left();
                    var right = nodeToDelete.right();
                    left.setParent(leftSuccessor);
                    leftSuccessor.setLeft(left);
                    right.setParent(leftSuccessor);
                    leftSuccessor.setRight(right);
                    if (nodeToDelete == root) {
                        root = leftSuccessor;
                        leftSuccessor.setParent(null);
                    }
                    else if (nodeToDelete.isLeftChild()) {
                        parent.setLeft(leftSuccessor);
                    }
                    else {
                        parent.setRight(leftSuccessor);
                    }
                    leftSuccessor.setParent(parent);
                    leftSuccessor.setColor(nodeToDelete.color());
                }
                else {
                    if (nodeToDelete == root) {
                        root = leftSuccessor;
                    }
                    else if (nodeToDelete.isLeftChild()) {
                        nodeToDelete.parent().setLeft(leftSuccessor);
                    } else {
                        nodeToDelete.parent().setRight(leftSuccessor);
                    }
                    leftSuccessor.setParent(nodeToDelete.parent());
                    leftSuccessor.setRight(nodeToDelete.right());
                    if (nodeToDelete.right() != null) {
                        nodeToDelete.right().setParent(leftSuccessor);
                    }
                    if (leftSuccessor.color() == Colors.BLACK) {
                        if (leftSuccessor.left() != null) {
                            currentlyFixing = leftSuccessor.left();
                        }
                        else {
                            currentlyFixing = RedBlackTreeNode(null, null, true);
                            currentlyFixing.setParent(leftSuccessor);
                            leftSuccessor.setLeft(currentlyFixing);
                        }
                    } else {
                        currentlyFixing = null;
                    }
                    leftSuccessor.setColor(nodeToDelete.color());
                }
            }
            else {
                if (nodeToDelete == root && nodeToDelete.left() == null && nodeToDelete.right() == null) {
                    root = null;
                    currentlyFixing = null;
                    return;
                }
                if (nodeToDelete.color() == Colors.BLACK) {
                    currentlyFixing = nodeToDelete.parent();
                }
                var child = nodeToDelete.left() || nodeToDelete.right();
                if (child != null) {
                    if (nodeToDelete == root) {
                        root = child;
                        child.setParent(null);
                    } else {
                        child.setParent(nodeToDelete.parent());
                        if (nodeToDelete.isLeftChild()) {
                            nodeToDelete.parent().setLeft(child);
                        }
                        else {
                            nodeToDelete.parent().setRight(child);
                        }
                    }
                    if (nodeToDelete.color() == Colors.BLACK && child.color() == Colors.BLACK) {
                        currentlyFixing = child;
                    }
                    else {
                        child.setColor(Colors.BLACK);
                        currentlyFixing = null;
                    }
                } else if (nodeToDelete.color() == Colors.BLACK) {
                    if (nodeToDelete == root) {
                        root = null;
                    }
                    else {
                        currentlyFixing = RedBlackTreeNode(null, null, true);
                        currentlyFixing.setParent(nodeToDelete.parent());
                        if (nodeToDelete.isLeftChild()) {
                            nodeToDelete.parent().setLeft(currentlyFixing);
                        }
                        else {
                            nodeToDelete.parent().setRight(currentlyFixing);
                        }
                    }
                } else {
                    if (nodeToDelete.isLeftChild()) {
                        nodeToDelete.parent().setLeft(null);
                    }
                    else {
                        nodeToDelete.parent().setRight(null);
                    }
                    currentlyFixing = null;
                }
            }
            if (currentlyFixing && currentlyFixing.color() == Colors.RED && !currentlyFixing.fake()) {
                currentlyFixing.setColor(Colors.BLACK);
                currentlyFixing = null;
            }
        },
        pushIssueUp: function () {
            var parent = currentlyFixing.parent();
            if (currentlyFixing.isLeftChild()) {
                if (parent.left().fake()) {
                    parent.setLeft(null);
                }
                if (parent.right() != null) {
                    parent.right().setColor(Colors.RED);
                }
            }
            else {
                if (parent.right().fake()) {
                    parent.setRight(null);
                }
                if (parent.left() != null) {
                    parent.left().setColor(Colors.RED);
                }
            }
            currentlyFixing = parent;
            if (currentlyFixing == root || currentlyFixing.color() == Colors.RED) {
                currentlyFixing.setColor(Colors.BLACK);
                currentlyFixing = null;
            }
        },
        rotateRedSibling: function () {
            var oldCurrFixing = currentlyFixing;
            if (currentlyFixing.isLeftChild()) {
                var parent = currentlyFixing.parent()
                var sibling = parent.right();
                var nephew = sibling.right();
                currentlyFixing = nephew;
                this.leftRotation();
            }
            else {
                var parent = currentlyFixing.parent()
                var sibling = parent.left();
                var nephew = sibling.left();
                currentlyFixing = nephew;
                this.rightRotation();
            }
            currentlyFixing = oldCurrFixing;
        },
        rotateRedNephew: function () {
            var oldCurrFixing = currentlyFixing;
            var parent = currentlyFixing.parent();
            var parentColor = parent.color();
            if (currentlyFixing.isLeftChild()) {
                var sibling = parent.right();
                var nephew = sibling.right();
                if (nephew == null || nephew.color() == Colors.BLACK) {
                    nephew = sibling.left();
                }
                currentlyFixing = nephew;
                this.leftRotation();
            }
            else {
                var sibling = parent.left();
                var nephew = sibling.left();
                if (nephew == null || nephew.color() == Colors.BLACK) {
                    nephew = sibling.right();
                }
                currentlyFixing = nephew;
                this.rightRotation();
            }
            parent.parent().setColor(parentColor);
            parent.setColor(Colors.BLACK);
            if (parent.isLeftChild()) {
                parent.parent().right().setColor(Colors.BLACK);
            } else {
                parent.parent().left().setColor(Colors.BLACK);
            }
            if (oldCurrFixing.fake()) {
                if (oldCurrFixing.isLeftChild()) {
                    oldCurrFixing.parent().setLeft(null);
                } else {
                    oldCurrFixing.parent().setRight(null);
                }
            }
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
                if (node.fake()) {
                    continue;
                }
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