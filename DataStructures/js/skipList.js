SkipList = function () {
    var SkipListNode = function (id, value) {
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
            pointer: function (index) {
                return pointers[index];
            },
            backPointer: function (index) {
                return backPointers[index];
            },
            setPointer: function (index, node) {
                pointers[index] = node;
                if (node != null) {
                    node.setBackPointer(index, this);
                }
            },
            setBackPointer: function (index, node) {
                backPointers[index] = node;
            },
            promote: function () {
                height++;
                pointers.push(null);
                backPointers.push(null);
            },
            up: function () {
                return pointerUp;
            },
            setUp: function (up) {
                pointerUp = up;
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
        insertIntoNull: function (id, value) {
            size++;
            currentlyFixing = SkipListNode(id, value);
            pointers.push(currentlyFixing);
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
                pointers[0] = currentlyFixing;
            } else {
                currentlyFixing.setPointer(0, consideredNode);
                previousNode.setPointer(0, currentlyFixing);
                currentlyFixing.setUp(previousNode.height() > 0 ? previousNode : previousNode.up());
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
            currentlyFixing.promote();
            if (currentlyFixing.up() == null) {
                if (pointers.length <= height + 1) {
                    pointers.push(currentlyFixing);
                }
                else {
                    currentlyFixing.setPointer(currentlyFixing.height(), pointers[currentlyFixing.height()]);
                    pointers[currentlyFixing.height()] = currentlyFixing;
                }
            }
            else if (currentlyFixing.up().height() == currentlyFixing.height()) {
                var next = currentlyFixing.up();
                while (next.pointer(currentlyFixing.height()) != null && next.pointer(currentlyFixing.height()).value() < currentlyFixing.value()) {
                    next = next.pointer(currentlyFixing.height());
                }
                currentlyFixing.setPointer(currentlyFixing.height(), next.pointer(currentlyFixing.height()));
                next.setPointer(currentlyFixing.height(), currentlyFixing);
                currentlyFixing.setUp(currentlyFixing.up().up());
            }
            else {
                var up = currentlyFixing.up();
                currentlyFixing.setPointer(currentlyFixing.height(), up.pointer(currentlyFixing.height()));
                up.setPointer(currentlyFixing.height(), currentlyFixing);
            }
            var next = currentlyFixing.pointer(height);
            while (next != null && next.height() < currentlyFixing.height()) {
                next.setUp(currentlyFixing);
                next = next.pointer(height);
            }
        },
        clear: function () {
            pointers = [];
            size = 0;
            currentlyFixing = null;
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