// Maintains all data structures, and makes changes incrementally.
DataStructures = function () {
    var id = 0;
    var eventQueue = $.Deferred();
    var inProgress = false;
    var structures = [
        RedBlackTree(),
        BTree(),
        SkipList(),
    ];
    var redBlackTree = structures[0];

    eventQueue.done();
    var retObj;
    waitOnEach = function (func, incrementId) {
        var deferred = $.Deferred();
        for (var i = 0; i < structures.length; i++) {
            func(structures[i]);
        }
        if (incrementId) {
            id++;
        }
        $(retObj).triggerHandler("update");
        if (phase > 0) {
            setTimeout(function () {
                deferred.resolve();
            }, phase);
        }
        else {
            deferred.resolve();
        }
        return deferred.promise();
    }
    var retObj = {
        insertValue: function (value) {
            return waitOnEach(function (structure) {
                structure.insert(id, value);
            }, true);
        },
        leftRotation: function () {
            return waitOnEach(function (structure) {
                structure.leftRotation();
            });
        },
        rightRotation: function (value) {
            return waitOnEach(function (structure) {
                structure.rightRotation();
            });
        },
        promotion: function () {
            return waitOnEach(function (structure) {
                structure.promotion();
            });
        },
        clear: function () {
            return waitOnEach(function (structure) {
                structure.clear();
            });
        },
        pushIssueUp: function (goLeft) {
            return waitOnEach(function (structure) {
                structure.pushIssueUp(goLeft);
            });
        },
        rotateRedSibling: function () {
            return waitOnEach(function (structure) {
                structure.rotateRedSibling();
            });
        },
        rotateRedNephew: function (goLeft) {
            return waitOnEach(function (structure) {
                structure.rotateRedNephew(goLeft);
            });
        },
        insert: function (value) {
            console.log("insertNumber(" + value + ");");
            inProgress = true;
            obj = this;
            // Insertion
            return obj.insertValue(value).then(function () {
                // Rotation/Recoloring
                var rebalance = function () {
                    if (redBlackTree.finger() != null) {
                        var bottomConsidered = redBlackTree.finger();
                        var parent = bottomConsidered.parent();
                        if (!bottomConsidered.color() || !parent.color()) {
                            return true;
                        }
                        var grandparent = parent.parent();
                        var isParentLeftChild = parent.isLeftChild();
                        var uncle = isParentLeftChild ? grandparent.right() : grandparent.left();
                        if (uncle == null || uncle.color() == Colors.BLACK) {
                            if (isParentLeftChild) {
                                // Rotation needed clockwise
                                return obj.rightRotation();
                            }
                            else {
                                // Rotation needed counterclockwise
                                return obj.leftRotation();
                            }
                        }
                        else {
                            return obj.promotion().then(function () {
                                return rebalance();
                            });
                        }
                    }
                }
                return rebalance();
            });
        },
        remove: function (value) {
            console.log("removeNumber(" + value + ");");
            var obj = this;
            return obj.deleteNodeAndReplace(value).then(function () {
                var rebalance = function () {
                    if (redBlackTree.finger() != null) {
                        if (redBlackTree.finger().isLeftChild()) {
                            var sibling = redBlackTree.finger().parent().right()
                        }
                        else {
                            var sibling = redBlackTree.finger().parent().left()
                        }
                        if (sibling.color() == Colors.RED) {
                            return obj.rotateRedSibling().then(function () {
                                return rebalance();
                            });
                        }
                        else if (sibling.color() == Colors.BLACK && (sibling.left() == null || sibling.left().color() == Colors.BLACK) && (sibling.right() == null || sibling.right().color() == Colors.BLACK)) {
                            return obj.pushIssueUp(sibling.isLeftChild()).then(function () {
                                return rebalance();
                            });
                        }
                        else {
                            return obj.rotateRedNephew(sibling.isLeftChild());
                        }
                    }
                };
                return rebalance();
            });
        },
        deleteNodeAndReplace: function (value) {
            return waitOnEach(function (structure) {
                structure.deleteNodeAndReplace(value);
            });
        },
        traverseRedBlackTree: function () {
            return structures[0].traverse();
        },
        traverseBTree: function () {
            return structures[1].traverse();
        },
        traverseSkipList: function () {
            return structures[2].traverse();
        },
    };
    return retObj;
}