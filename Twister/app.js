/**
* The main app
*/
var solid = require("solid");
var user = null;
var name = null;
var defaultContainer = null;
var twistList = [];
var friendList = {};
var isCommercial = null;
var twistsBin = '/twists';
var profile = '/profile/card#me';
var sourceTwist = null;

function publishNew () {
	var bin = {};
	bin.content = $("#newTwistText").val();
	var license = License.getCCLicense($("#licenseChoice").val());
	twist = Twist(bin.content, user, license);
	var graph = twist.toGraph();
    var data = new $rdf.Serializer(graph).toN3(graph);
	
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
		twistList.sort(function(first, second){
			return first.date() < second.date();
		});
		displayTwists();
		$(".dateBlock").timeago();
    });
}

var displayTwists = function(){
	$(".twist").remove();
	$(".retwistForm").remove();
	twistList.forEach(function(twist, index){
		var twistDiv = twist.toHTML(index);
		$("#twists").append(twistDiv);
	});
}

$(function(){
	isCommercial = localStorage.getItem("isCommercial");
	if(isCommercial==null){
		displaySignIn();
	}
	else{
		isCommercial = isCommercial=="true";
		signIn();
	}
});

var getRetwistForm = function(twist) {
	var ret = $(
		"<form class='retwistForm listing' id='retwistForm'>\
			<div class='authorBlock'>You:</div>\
			<div class='contentBlock'>\
				<textarea "+(mayMakeDerivative(twist)?"":"disabled ")+"class='retwistTwistText'>"+twist.text()+"</textarea>\
				<br/>\
				<label>\
					License:\
					<select class='retwistTwistLicenseChoice'>\
						<option value='CC_BY'>\
							CC BY\
						</option>\
						<option value='CC_BY_SA'>\
							CC BY-SA\
						</option>\
						<option value='CC_BY_ND'>\
							CC BY-ND\
						</option>\
						<option value='CC_BY_NC'>\
							CC BY-NC\
						</option>\
						<option value='CC_BY_NC_SA'>\
							CC BY-NC-SA\
						</option>\
						<option value='CC_BY_NC_ND'>\
							CC BY-NC-ND\
						</option>\
						<option value='CC0'>\
							CC0\
						</option>\
					</select>\
				</label>\
				<input type='submit' />\
			</div>\
		</form>"
	);
	return ret;
}

var signIn = function(){
	$(".modal").css("display","none");
	$("#newTwistForm").submit(function(e) {
		publishNew();
		e.preventDefault();
	});
	$("#logoutButton").click(function(e) {
		logout();
		e.preventDefault();
	});
	$("#newFriendForm").submit(function(e){
		newFriend($("#newFriendText").val());
		e.preventDefault();
	});
	$(document).on("click",".retwistButton", function(e) {
		$(".retwistForm").remove();
		var newSource = Number($(e.target).closest(".twist")[0].dataset.twist);
		if(newSource!=sourceTwist) {
			sourceTwist = newSource;
			$(e.target).closest(".twist").after(getRetwistForm(twistList[sourceTwist]));
		}
		else{
			sourceTwist = null;
		}
		e.preventDefault();
	});
	$(document).on("submit", ".retwistForm", function(e){
		e.preventDefault();
		var license = License.getCCLicense($(".retwistTwistLicenseChoice").val());
		var text = $(".retwistTwistText").val();
		var retwist = twistList[sourceTwist].retwist(license, text);
		var graph = retwist.toGraph();
		var data = new $rdf.Serializer(graph).toN3(graph);		
		$(".retwistForm").remove();
		solid.web.post(defaultContainer + twistsBin, data).then(function(meta) {
			sourceTwist = null;
			window.location.reload();
		}).catch(function(err) {
			// do something with the error
			console.log(err)
		});
	});
	solid.currentUser().then(function (currentWebId) {
		user = currentWebId;
		return solid.getProfile(user);
	}).then(function(profile) {
		defaultContainer = profile.parsedGraph.any($rdf.sym(user),solid.vocab.pim("storage")).value.replace(/\/$/, "");
		name = profile.parsedGraph.any($rdf.sym(user),solid.vocab.foaf("name")).value;
		refreshFriendList();
		loadAll();
		/*var twistsLocations = profile.typeRegistryForClass(solid.vocab.sioc('Post'))
		if(twistsLocations.length==0) {
			profile.registerType('twists', defaultContainer + '/twists', 'container', true);
		}*/
	});
}

var loadAll = function(){
	twistList = [];
	load(defaultContainer + twistsBin);
	$.each(friendList, function(friendProfile, friend){
		load(friend.pod + twistsBin);
	});
}

var refreshFriendList = function(){
	var friendSelect = $("#friendSelectBox");
	friendSelect.empty();
	friendSelect.append($("<option>Friends:</option>"))
	$.each(friendList, function(profile, friend){
		friendSelect.append($("<option>"+friend.name+"</option>"));
	});
}

var displaySignIn = function() {
	$("#signIn").submit(function(){
		isCommercial  = $("#isCommercial").is(":checked");
		localStorage.setItem("isCommercial", isCommercial)
		signIn();
		return false;
	});
	$(".modal").css("display","block");
}

var newFriend = function(friend) {
	getProfile(friend).then(function(friendProfile) {
		var name = friendProfile.profile.any($rdf.sym(friendProfile.uri),solid.vocab.foaf("name")).value;
		friendList[friendProfile.uri] = {name:name, pod:friend};
		refreshFriendList();
		loadAll();
	});
}

var logout = function() {
	localStorage.removeItem("isCommercial");
	window.location.reload();
}

var getProfile= function(friend){
	var deferred = $.Deferred()
	solid.getProfile(friend + profile).then(function(friendProfile){
		deferred.resolve({profile:friendProfile.parsedGraph, uri:friend+profile});
	});
	return deferred.promise();
}