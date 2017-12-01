// Maintains all data structures, and makes changes incrementally.
DataStructures = function () {
    var redBlackTree = RedBlackTree();
    var bTree = BTree();
    var allNodes = {};
    var id = 0;
    var eventQueue = $.Deferred();
    var inProgress = false;

    eventQueue.done();
    var retObj;
    waitOn = function (func) {
        var deferred = $.Deferred();
        func();
        $(retObj).triggerHandler("bananas");
        setTimeout(function () {
            deferred.resolve();
        }, phase);
        return deferred.promise();
    }
    var retObj = {
        insertIntoNull: function (value) {
            return waitOn(function () {
                redBlackTree.insertIntoNull(id, value);
                bTree.insertIntoNull(id, value);
                id++;
            });
        },
        insertIntoNonNull: function (value) {
            return waitOn(function () {
                redBlackTree.insertIntoNonNull(id, value);
                bTree.insertIntoNonNull(id, value);
                id++;
            });
        },
        leftRotation: function () {
            return waitOn(function () {
                redBlackTree.leftRotation();
                bTree.leftRotation();
            });
        },
        rightRotation: function (value) {
            return waitOn(function () {
                redBlackTree.rightRotation();
                bTree.rightRotation();
            });
        },
        promotion: function () {
            return waitOn(function () {
                redBlackTree.promotion();
                bTree.promotion();
            });
        },
        insert: function (value) {
            inProgress = true;
            obj = this;

            if (redBlackTree.root() == null) {
                var promise = obj.insertIntoNull(value);
                promise.done(function () {
                    inProgress = false;
                });
                return promise;
            }
            else {
                // Insertion
                return obj.insertIntoNonNull(value).then(function () {
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
            }
        },
        traverseBTree: function () {
            return bTree.traverse();
        },
        traverseRedBlackTree: function () {
            return redBlackTree.traverse();
        },
    };
    return retObj;
}