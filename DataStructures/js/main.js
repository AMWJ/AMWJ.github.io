var phase = 200;
$(function () {
    var dataStructures = DataStructures();

    $(dataStructures).on('update', function (e) {
        refreshTrees(e.currentTarget);
    });

    var deferred = $.Deferred();
    deferred.resolve();
    var currentStack = deferred.promise();

    var insertNumber = function (insertValue) {
        var insertInput = $("#insertControl > input[type=number]");
        if (insertValue == undefined) {
            insertValue = parseInt(insertInput.val());
        }
        insertInput.val("");
        if (!isNaN(insertValue)) {
            currentStack = currentStack.then(function () {
                return dataStructures.insert(insertValue);
            });
        }
    }

    var removeNumber = function (removeValue) {
        var removeInput = $("#removeControl > input[type=number]");
        if (removeValue == undefined) {
            removeValue = parseInt(removeInput.val());
        }
        removeInput.val("");
        if (!isNaN(removeValue)) {
            currentStack = currentStack.then(function () {
                return dataStructures.remove(removeValue);
            });
        }
    }

    $("#insertControl > input[type=number]").keypress(function (e) {
        if (e.keyCode == 13) {
            insertNumber()
        }
    });

    $("#removeControl > input[type=number]").keypress(function (e) {
        if (e.keyCode == 13) {
            removeNumber()
        }
    });

    $("#insertControl > button").click(function (e) {
        insertNumber();
    });


    $("#removeControl > button").click(function (e) {
        removeNumber();
    });

    $("#clearControl > button").click(function (e) {
        currentStack = currentStack.then(function () {
            setSelectedElement(null, null);
            return dataStructures.clear();
        });
    });

    $("#speedControl > button").click(function (e) {
        if (phase > 200) {
            phase = 200;
            $("#speedControl > button").text("Slow");
        }
        else {
            phase = 2000;
            $("#speedControl > button").text("Fast");
        }
    });

    itemTemplates = [{
        name: "Sequential integers",
        first: 0,
        next: function (i) {
            return i + 1;
        }
    }, {
        name: "Alternating Signs",
        first: 0,
        next: function (i) {
            if (i > 0) {
                return -i;
            }
            else {
                return -i + 1;
            }
        }
        }, {
            name: "Random",
            first: 0,
            next: function (prev) {
                for (i = 0; i < 5; i++) {
                    prev = (prev * 8171 + 183) % 1000;
                }
                return prev;
            }
        }];
    for (var i = 0; i < itemTemplates.length; i++) {
        var option = $("<option>").text(itemTemplates[i].name);
        $("#itemTemplates").append(option);
    }

    $("#itemTemplates").change(function (e) {
        var value = $(e.target).val();
        for (var i = 0; i < itemTemplates.length; i++) {
            if (itemTemplates[i].name == value) {
                var element = itemTemplates[i].first;
                var next = function () {
                    currentStack.done(function () {
                        currentStack = currentStack.then(function () {
                            return dataStructures.insert(element);
                        }).done(function () {
                            element = itemTemplates[i].next(element);
                            next();
                        });
                    });
                }
                next();
                break;
            }
        }
        $("#itemTemplates").val("");
    });

    var insertAll = function (array) {
        var i = 0;
        while (i < array.length) {
            $("#insertControl > input[type=number]").val(array[i])
            insertNumber();
            i++;
        }
    }
    //insertAll([4, 6, 3, 7, 1, 9, 0, 2, 91, 492, 193, 19, 53, 139]);
});


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}