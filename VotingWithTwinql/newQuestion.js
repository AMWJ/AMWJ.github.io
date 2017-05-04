/**
* The main app
*/
var solid = SolidClient;
var user = null;
var name = null;
var boxUri = null;
var electionsFolder = 'Elections';
var profile = '/profile/card#me';
var sourceTwist = null;

function publishNew () {
    var graph = createNewGraph();
    var data = new $rdf.Serializer(graph).toN3(graph);
	
	solid.web.post(boxUri + '/' + electionsFolder, data).then(function(meta) {
        window.location.href = '/index.html?' + meta.url;
	}).catch(function(err) {
        // do something with the error
        console.log(err)
    });
}

createNewGraph = function () {
    var graph = $rdf.graph();
    var thisResource = $rdf.sym('');

    graph.add(thisResource, solid.vocab.sioc('question'), $rdf.lit($("#question").val()));
    graph.add(thisResource, solid.vocab.sioc('author'), $rdf.lit(user));
    graph.add(thisResource, solid.vocab.sioc('date'), $rdf.lit(Date.now()));
    options = $("#options").val().split("\n");
    options.forEach(function (option) {
        if (option.length > 0) {
            graph.add(thisResource, solid.vocab.sioc('option'), $rdf.lit(option));
        }
    });
    voters = $("#voters").val().split("\n");
    voters.forEach(function (voter) {
        if (voter.length > 0) {
            graph.add(thisResource, solid.vocab.sioc('voter'), $rdf.lit(voter));
        }
    });
    return graph;
}

$(function () {
    $("#submit").click(function () {
        signIn();
    });
});


var signIn = function(){
	solid.currentUser().then(function (currentWebId) {
        user = currentWebId;
        profileUriObject = parseURL(user);
        boxUri = profileUriObject.protocol+"//"+profileUriObject.host
        solid.web.get(boxUri + "/" + electionsFolder).then(function (response) {
            publishNew();
        }).catch(function (e) {
            if (e.code == 404) {
                solid.web.createContainer(boxUri, electionsFolder).then(function (twistsNewFolder) {
                    return twistsNewFolder.addPermission(solid.acl.EVERYONE, solid.acl.READ).save()
                }).then(function () {
                    console.log("Permissions saved successfully.");
                    }).then(function (electionsNewFolder) {
                        publishNew();
                    })
            }
            else {
                console.log(e);
            }
        });
	});
}

function parseURL(url) {
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for (i = 0; i < queries.length; i++) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash
    };
}
