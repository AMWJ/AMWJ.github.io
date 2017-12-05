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
        $(retObj).triggerHandler("bananas");
        setTimeout(function () {
            deferred.resolve();
        }, phase);
        return deferred.promise();
    }
    var retObj = {
        insertIntoNull: function (value) {
            return waitOnEach(function (structure) {
                structure.insertIntoNull(id, value);
            }, true);
        },
        insertIntoNonNull: function (value) {
            return waitOnEach(function (structure) {
                structure.insertIntoNonNull(id, value);
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
        remove: function (value) {
            structure.deleteNodeAndReplace(value);
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