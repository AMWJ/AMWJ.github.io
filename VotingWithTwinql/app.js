/**
* The main app
*/
var solid = SolidClient;
var user = null;
var electionUri = null;
var boxUri = null;
var electionsFolder = 'Elections';
var votesStore = 'Votes';
var profile = '/profile/card#me';

function vote () {
	
    solid.web.get(boxUri + '/' + votesStore).then(function (voteData) {
        //solid.web.patch(meta.meta)
        var thisResource = $rdf.sym('');
        var graph = voteData.parsedGraph();
        var thisVote = $rdf.blankNode();
        graph.add(thisResource, solid.vocab.sioc('voted'), thisVote);
        graph.add(thisVote, solid.vocab.sioc('question'), $rdf.lit(electionUri));
        graph.add(thisVote, solid.vocab.sioc('choice'), $rdf.lit($("input[name='choice']:checked").val()));
        var data = new $rdf.Serializer(graph).toN3(graph);
        solid.web.put(boxUri + '/' + votesStore, data).then(function (meta) {
            window.location.reload();
        }).catch(function (err) {
            // do something with the error
            console.log(err)
        });
	}).catch(function(err) {
        // do something with the error
        console.log(err)
    });
}

createEmptyVoteGraph = function () {
    var graph = $rdf.graph();
    var thisResource = $rdf.sym('');

    graph.add(thisResource, solid.vocab.sioc('author'), $rdf.lit(user));
    return graph;
}

var loadElection = function () {
    queryText =
        '@prefix sioc http://rdfs.org/sioc/ns# \n' +
        electionUri +
        ' { \n' +
        'sioc:question \n' +
        '[ sioc:option ] \n' +
        'sioc:author \n' +
        'sioc:date \n' +
        '[ sioc:voter ] { \n' +
        'sioc:choice \n' +
        'sioc:question \n' +
        '}' +
        '}';

    const backend = new twinql.WebBackend({ proxyUri: 'https://databox.me/,proxy?uri=' })
    twinql.query(backend, queryText).then(function (data) {
        $(".question").html(data["sioc:question"]);
        $(".author").html(data["sioc:author"]);
        $(".date").attr("datetime",Date(data["sioc:date"]));
        $(".date").timeago();
        var canVote = data["sioc:voter"].some(function (voter) {
            return voter["@id"] == boxUri + '/' + votesStore;
        });
        if (canVote) {
            data["sioc:option"].forEach(function (option) {
                var radioBtn = $('<label><input type="radio" name="choice" value="' + option + '" /></label>').append(option);
                radioBtn.appendTo('.options');
            });
        }
        else {
            data["sioc:option"].forEach(function (option) {
                var radioBtn = $('<label><input disabled type="radio" name="choice" value="' + option + '" /></label>').append(option);
                radioBtn.appendTo('.options');
            });
            $(".submit").hide();
        }
    });
}

$(function () {
    electionUri = location.search.slice(1);
    signIn();
    $(".submit").click(function () {
        vote();
    });
});

var signIn = function(){
	solid.currentUser().then(function (currentWebId) {
		user = currentWebId;
        profileUriObject = parseURL(user);
        boxUri = profileUriObject.protocol + "//" + profileUriObject.host;

        solid.web.get(boxUri + "/" + votesStore).then(function (votesStore) {
        }).catch(function (e) {
            if (e.code == 404) {
                var graph = createEmptyVoteGraph();
                var data = new $rdf.Serializer(graph).toN3(graph);

                solid.web.post(boxUri, data, votesStore).then(function () {
                }).catch(function (err) {
                    // do something with the error
                    console.log(err)
                });
            }
            else {
                console.log(e);
            }
        });
		return solid.getProfile(user);
    }).then(function (profile) {
        if (electionUri) {
            loadElection();
        }
        else {
            $(".authorHeader").hide();
            $(".submit").hide();
        }
	}).then();
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
