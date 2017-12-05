var phase = 300;
$(function () {
    var dataStructures = DataStructures();

    $(dataStructures).on('bananas', function (e) {
        refreshTrees(e.currentTarget);
    });

    var deferred = $.Deferred();
    deferred.resolve();
    var currentStack = deferred.promise();

    var insertNumber = function () {
        var insertInput = $("#insertControl > input[type=number]");
        var insertValue = parseInt(insertInput.val());
        insertInput.val("");
        if (!isNaN(insertValue)) {
            currentStack = currentStack.then(function () {
                return dataStructures.insert(insertValue)
            });
        }
    }

    $("#insertControl > input[type=number]").keypress(function (e) {
        if (e.keyCode == 13) {
            insertNumber()
        }
    });

    $("#insertControl > button").click(function (e) {
        insertNumber();
    });

    $("#clearControl > button").click(function (e) {
        currentStack = currentStack.then(function () {
            setSelectedElement(null, null);
            return dataStructures.clear();
        });
    });

    var insertAll = function (array) {
        for (var i = 0; i < array.length; i++) {
            $("#insertControl > input[type=number]").val(array[i])
            insertNumber(array[i]);
        }
    }

    var array = [];
    array = shuffle(Array.apply(null, Array(10000)).map(function (_, i) { return i; }));
    //array.reverse();
    //insertRandom();
    //insertAll(array);

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