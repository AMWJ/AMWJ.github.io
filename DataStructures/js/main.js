var phase = 1;
$(function () {
    var dataStructures = DataStructures();

    $(dataStructures).on('bananas', function (e) {
        refreshTrees(e.currentTarget);
    });

    var insertAll = function (array) {
        first = array.pop()
        dataStructures.insert(first).done(function () {
            if (array.length > 0) {
                insertAll(array);
            }
            else {
                return true;
            }
        });
    }


    var insertRandom = function () {
        var randomNum = Math.random();
        dataStructures.insert(Math.floor(randomNum*2)).done(function () {
            insertRandom();
        });

    }
    //var array = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
    array = Array.apply(null, Array(1000)).map(function (_, i) { return i; });
    array = shuffle(array);
    array.reverse();
    //insertRandom();
    insertAll(array);
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