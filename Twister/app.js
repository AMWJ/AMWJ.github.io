/**
* The main app
*/
var solid = require("solid");
var user = null;
var twistList = [];
var defaultContainer = 'https://ariel.databox.me';
var twistsBin = '/twists';
var profile = '/profile/card#me';

function publishNew () {
	var bin = {};
	bin.content = $("#newTwistText").val();
	twist = Twist(bin.content, defaultContainer, false);
	var graph = twist.toGraph();
    var data = new $rdf.Serializer(graph).toN3(graph)
	
	solid.web.post(defaultContainer + twistsBin, data).then(function(meta) {
		window.location.reload();
	}).catch(function(err) {
        // do something with the error
        console.log(err)
    });
}

function load (url) {
    solid.web.get(url).then(function(response) {
        var graph = response.parsedGraph();
        var subject = $rdf.sym(response.url);

		var twistContainers = graph.statements
			.filter(
				function(statement){
					return statement.predicate.value==solid.vocab.ldp("contains").value;
				})
			.map(
				function(statement){
					return statement.object.uri;
				});
		twistContainers.forEach(function(twistUri){
			loadTwist(twistUri);
		});
	}).catch(function(err) {
        // do something with the error
        console.log(err)
    });
}

var loadTwist = function(url) {
	solid.web.get(url).then(function(response) {
        var graph = response.parsedGraph();
        var subject = $rdf.sym(response.url);
		twistList.push(Twist.fromGraph(graph, subject));
		displayTwists();
		$(".dateBlock").timeago();
    });
}

var displayTwists = function(){
	$(".twist").remove()
	twistList.forEach(function(twist){
		var twistDiv = twist.toHTML();
		$("#twists").append(twistDiv);
	});
}

$(function(){
	$("#newTwistForm").submit(function(e){
		publishNew();
		e.preventDefault();
	});
	if(user===null){
		solid.currentUser().then(function (currentWebId) {
			load(defaultContainer + twistsBin);
			user = currentWebId;
			solid.getProfile(user);
		}).then(function(profile) {
			/*var twistsLocation = profile.typeRegistryForClass(solid.vocab.sioc('Post'))
			if(!twistsLocation) {
				profile.registerType(vocab.sioc('Post'), user + '/twists', 'container', true);
			}*/
		});
	}
	else {
		load(defaultContainer)
	}
});