SkipList = function () {
    var SkipListNode = function (id, value, fake) {
        var height = 0;
        var pointers = [];
        var backPointers = [];
        var pointerUp = null;
        var retObj = {
            id: function () {
                return id;
            },
            value: function () {
                return value;
            },
            height: function () {
                return height;
            },
            fake: function () {
                return fake;
            },
            pointer: function (index) {
                return pointers[index];
            },
            backPointer: function (index) {
                return backPointers[index];
            },
            setPointer: function (index, node) {
                pointers[index] = node;
            },
            setBackPointer: function (index, node) {
                backPointers[index] = node;
            },
            promote: function () {
                height++;
                pointers.push(null);
                backPointers.push(null);
            },
            demote: function () {
                height--;
                pointers.pop();
                backPointers.pop();
            },
            up: function () {
                var back = backPointers[height];
                if (back == null || back.height() > height) {
                    return back;
                }
                else {
                    return back.up();
                }
            },
            setHeight: function (newHeight) {
                height = newHeight;
            }
        }
        return retObj;
    }

    var pointers = [];
    var size = 0;
    var currentlyFixing = null;

    var retObj = {
        size: function () {
            return size;
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
            pointers = [SkipListNode(id, value)];
            currentlyFixing = null;
        },
        insertIntoNonNull: function (id, value) {
            currentlyFixing = SkipListNode(id, value);
            var previousNode = null;
            var height = pointers.length - 1;
            var consideredNode = pointers[height];
            while (height >= 0) {
                if (consideredNode == null || consideredNode.value() > value) {
                    height--;
                } else {
                    previousNode = consideredNode;
                }
                if (height < 0) {
                    break;
                }
                if (previousNode != null) {
                    consideredNode = previousNode.pointer(height);
                }
                else {
                    consideredNode = pointers[height];
                }
            }
            if (previousNode == null) {
                currentlyFixing.setPointer(0, consideredNode);
                if (consideredNode) {
                    consideredNode.setBackPointer(0, currentlyFixing);
                }
                pointers[0] = currentlyFixing;
            } else {
                currentlyFixing.setPointer(0, consideredNode);
                if (consideredNode) {
                    consideredNode.setBackPointer(0, currentlyFixing);
                }
                currentlyFixing.setBackPointer(0, previousNode);
                if (previousNode) {
                    previousNode.setPointer(0, currentlyFixing);
                }
            }
        },
        leftRotation: function () {
        },
        rightRotation: function () {
        },
        promotion: function () {
            var height = currentlyFixing.height();
            var index = 0;
            var total = 0;
            var current = currentlyFixing.up();
            var first = null;
            if (current == null) {
                first = pointers[height];
            } else {
                first = current.pointer(height);
            }
            current = first;
            while (current != null && current.height() == height) {
                total++;
                current = current.pointer(height);
                if (current == currentlyFixing) {
                    index = total;
                }
            }
            var target = 0;
            if (total % 2 == 1 || total / 2 > index) {
                target = total / 2;
            }
            else {
                target = total / 2 - 1;
            }
            currentlyFixing = first;
            for (var i = 0; i < target; i++) {
                currentlyFixing = currentlyFixing.pointer(height);
            }
            var up = currentlyFixing.up();
            var after = up == null ? pointers[currentlyFixing.height() + 1] || null : up.pointer(currentlyFixing.height() + 1);
            currentlyFixing.promote();
            if (up == null) {
                if (pointers.length <= currentlyFixing.height()) {
                    pointers.push(currentlyFixing);
                }
                else {
                    pointers[currentlyFixing.height()] = currentlyFixing;
                }
            }
            else {
                currentlyFixing.setBackPointer(currentlyFixing.height(), up);
                up.setPointer(currentlyFixing.height(), currentlyFixing);
            }

            currentlyFixing.setPointer(currentlyFixing.height(), after);
            if (after != null) {
                after.setBackPointer(currentlyFixing.height(), currentlyFixing);
            }
        },
        clear: function () {
            pointers = [];
            size = 0;
            currentlyFixing = null;
        },
        deleteNodeAndReplace: function (value) {
            var previousNode = null;
            var height = pointers.length - 1;
            var consideredNode = pointers[height];
            while (height >= 0) {
                if (previousNode && previousNode.value() == value) {
                    break;
                }
                if (consideredNode == null || consideredNode.value() > value) {
                    height--;
                } else {
                    previousNode = consideredNode;
                }
                if (height < 0) {
                    break;
                }
                if (previousNode != null) {
                    consideredNode = previousNode.pointer(height);
                }
                else {
                    consideredNode = pointers[height];
                }
            }
            if (previousNode == null || previousNode.value() != value) {
                currentlyFixing = null;
                return;
            }
            if (previousNode.height() > 0) {
                var leftSuccessor = previousNode.backPointer(0);
                for (var i = leftSuccessor.height() + 1; i <= previousNode.height(); i++) {
                    leftSuccessor.promote();
                    leftSuccessor.setBackPointer(i, previousNode.backPointer(i));
                    if (previousNode.backPointer(i)) {
                        previousNode.backPointer(i).setPointer(i, leftSuccessor);
                    }
                    else {
                        pointers[i] = leftSuccessor;
                    }
                }
                for (var i = 0; i <= previousNode.height(); i++) {
                    leftSuccessor.setPointer(i, previousNode.pointer(i));
                    if (previousNode.pointer(i)) {
                        previousNode.pointer(i).setBackPointer(i, leftSuccessor);
                    }
                }
                currentlyFixing = null;
                if (leftSuccessor.backPointer(0) == null || leftSuccessor.backPointer(0).height() > 0) {
                    currentlyFixing = SkipListNode(null, null, true);
                    currentlyFixing.setPointer(0, leftSuccessor);
                    currentlyFixing.setBackPointer(0, leftSuccessor.backPointer(0));
                }
            }
            else {
                for (var i = 0; i <= previousNode.height(); i++) {
                    if (previousNode.pointer(i)) {
                        previousNode.pointer(i).setBackPointer(i, previousNode.backPointer(i));
                    }
                    if (previousNode.backPointer(i)) {
                        previousNode.backPointer(i).setPointer(i, previousNode.pointer(i));
                    } else {
                        pointers[i] = previousNode.pointer(i);
                    }
                }
                if ((previousNode.backPointer(0) == null || previousNode.backPointer(0).height() > 0) && (previousNode.pointer(0) == null || previousNode.pointer(0).height() > 0)) {
                    currentlyFixing = SkipListNode(null, null, true);
                    currentlyFixing.setPointer(0, previousNode.pointer(0));
                    currentlyFixing.setBackPointer(0, previousNode.backPointer(0));
                }
                else {
                    if (previousNode.backPointer(0) == null || previousNode.backPointer(0).height() > 0) {
                        currentlyFixing = previousNode.pointer(0);
                    }
                    else {
                        currentlyFixing = previousNode.backPointer(0);
                    }
                }
            }
        },
        pushIssueUp: function (rotateLeft) {
            if (rotateLeft) {
                currentlyFixing = currentlyFixing.up();
            }
            else {
                if (currentlyFixing.up()) {
                    currentlyFixing = currentlyFixing.up().pointer(currentlyFixing.height() + 1);
                }
                else {
                    currentlyFixing = pointers[currentlyFixing.height() + 1];
                }
            }

            if (currentlyFixing.pointer(currentlyFixing.height())) {
                currentlyFixing.pointer(currentlyFixing.height()).setBackPointer(currentlyFixing.height(), currentlyFixing.backPointer(currentlyFixing.height()));
            }
            if (currentlyFixing.backPointer(currentlyFixing.height())) {
                currentlyFixing.backPointer(currentlyFixing.height()).setPointer(currentlyFixing.height(), currentlyFixing.pointer(currentlyFixing.height()));
            }
            else {
                pointers[currentlyFixing.height()] = currentlyFixing.pointer(currentlyFixing.height());
            }
            currentlyFixing.demote();
        },
        rotateRedSibling: function () {
        },
        rotateRedNephew: function (rotateLeft) {
            var up = currentlyFixing.up();
            if (!rotateLeft) {
                if (up != null) {
                    up = up.pointer(currentlyFixing.height() + 1);
                }
                else {
                    up = pointers[currentlyFixing.height() + 1];
                }
            }
            var next = null;
            if (!rotateLeft) {
                next = up.pointer(up.height() - 1);
                if (next.pointer(up.height() - 1)
                    && next.pointer(up.height() - 1).height() == up.height() - 1
                    && next.pointer(up.height() - 1).pointer(up.height() - 1)
                    && next.pointer(up.height() - 1).pointer(up.height() - 1).height() == up.height() - 1) {
                    next = next.pointer(up.height() - 1);
                }
            }
            else {
                next = up.backPointer(up.height() - 1);
                if (next.backPointer(up.height() - 1)
                    && next.backPointer(up.height() - 1).height() == up.height() - 1
                    && next.backPointer(up.height() - 1).backPointer(up.height() - 1)
                    && next.backPointer(up.height() - 1).backPointer(up.height() - 1).height() == up.height() - 1) {
                    next = next.backPointer(up.height() - 1);
                }
            }
            next.promote();
            next.setPointer(up.height(), up.pointer(up.height()));
            if (up.pointer(up.height())) {
                up.pointer(up.height()).setBackPointer(up.height(), next);
            }
            next.setBackPointer(up.height(), up);
            up.setPointer(up.height(), next);
            if (up.pointer(up.height())) {
                up.pointer(up.height()).setBackPointer(up.height(), up.backPointer(up.height()));
            }
            if (up.backPointer(up.height())) {
                up.backPointer(up.height()).setPointer(up.height(), up.pointer(up.height()));
            }
            else {
                pointers[up.height()] = up.pointer(up.height());
            }
            up.demote();
        },
        traverse: function () {
            var nodeArray = [];
            var edgeArray = [];
            var node = pointers[0];
            while (node != null) {
                nodeArray.push(node);
                for (var i = 1; i <= node.height(); i++) {
                    var back = node.backPointer(i);
                    if (back != null) {
                        edgeArray.push({
                            from: {
                                node: node.backPointer(i),
                                index: nodeArray.indexOf(node.backPointer(i)),
                            },
                            to: {
                                node: node,
                                index: nodeArray.indexOf(node),
                            },
                            height: i,
                        });
                    } else {
                        edgeArray.push({
                            to: {
                                node: node,
                                index: nodeArray.indexOf(node),
                            },
                            height: i,
                        });
                    }
                }
                node = node.pointer(0);
            }
            return { elements: nodeArray, edges: edgeArray };
        },
    }
    return retObj;
}