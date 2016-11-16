Twist = function(t, auth, lics, d, attrib, uri) {
	var that = {};
	if(!d){
		d = Date.now();
	}
	that.text = function(){
		return t;
	}
	that.author = function(){
		return auth;
	}
	that.uri = function(){
		return uri;
	}
	that.date = function (){
		return d;
	}
	that.attribution = function(){
		return attrib;
	}
	that.strictestLicensing = function(){
		return lics[lics.length-1];
	}
	that.licenses = function(){
		return lics.slice();
	}
	that.canRetwist = function(isCommercial){
		return canRedistribute(that, isCommercial);
	}
	that.toGraph = function(){
		var graph = $rdf.graph();
		var thisResource = $rdf.sym('');

		graph.add(thisResource, solid.vocab.sioc('content'), $rdf.lit(t));
		graph.add(thisResource, solid.vocab.sioc('author'), $rdf.lit(auth));
		graph.add(thisResource, solid.vocab.sioc('date'), $rdf.lit(d));
		lics.forEach(function(lic){
			var thisLicense = $rdf.blankNode();
			
			graph.add(thisResource, solid.vocab.sioc('licensing'), thisLicense);
			graph.add(thisLicense, solid.vocab.sioc('license'),$rdf.lit(lic.license().getUri()));
			graph.add(thisLicense, solid.vocab.sioc('author'),$rdf.lit(lic.author()));
			var originalSource = lic.original();
			graph.add(thisLicense, solid.vocab.sioc('original'), $rdf.lit(originalSource));
		})
		return graph;
	}
	that.retwist = function(newLicense, newText){
		var newLicensing = Licensing(user, newLicense);
		return Twist(newText, user,  lics.concat([newLicensing]), Date.now());
	}
	var userName = function(){
		if(user==auth){
			return "You";
		}
		else if(friendList[auth]) {
			return friendList[auth].name;
		}
		else {
			return auth;
		}
	}
	
	that.delete = function() {
		solid.web.del(uri).then(function(response) {
			window.location.reload();
		});
	}
	
	that.canDelete = function() {
		return user==auth;
	}
	
	that.toHTML = function(index) {
		var ret = $("<div class='twist listing' data-twist='"+index+"'>\
					<div class='floatLeft'>\
						<div class='authorBlock'>"+userName()+":</div>\
						<div class='contentBlock'>"+t+"</div>\
					</div>\
					<div class='floatRight'>\
						<div class='licenseImageBlock'>\
						<a href='"+that.strictestLicensing().license().getUri()+"' target='_blank'>\
							<img src='"+that.strictestLicensing().license().getImage()+"'/></div>\
						</a>\
						<time class='dateBlock' datetime='"+(new Date(Number(d))).toISOString()+"'></time>\
					</div>\
				  </div>");
		if(that.canRetwist(isCommercial)){
			ret.find(".floatLeft").append($("<button class='retwistButton'>Retwist</button>"));
		}
		if(that.canDelete()){
			ret.find(".floatLeft").append($("<button class='deleteButton'>Delete</button>"));
		}
		[].concat(that.licenses()).reverse().forEach(function(licensing){
			if(mustAttribute(licensing)){
				var author = friendList[licensing.author()]
				var attributionDiv = $("<div class='attribution'>").html("This work is a derivative of "+
				"<a target='_blank' href='"+
				(licensing.original()) + 
				"'>" + (licensing.original()) +
				"</a> by <a href='" +
				licensing.author() +
				"'>" +
				(author ? author.name : licensing.author())+"</a>, licensed under "+licensing.license().getId());
				ret.append(attributionDiv);
			}
		});
		return ret;
	}
	return that;
}

Twist.fromGraph = function(graph, subject){
	var text = graph.any(subject, solid.vocab.sioc('content')).value;
	var author = graph.any(subject, solid.vocab.sioc('author')).value;
	var dateElem = graph.any(subject, solid.vocab.sioc('date'));
	var date = null;
	if(dateElem){
		date = dateElem.value;
	}
	var licensingElems = graph.statementsMatching(subject, solid.vocab.sioc('licensing'));
	var licensings = [];
	if(licensingElems.length > 0) {
		licensings = licensingElems.map(function(licensingElem){
			var license = License.fromUri(graph.any(licensingElem.object, solid.vocab.sioc('license')).value);
			var originalElem = graph.any(licensingElem.object, solid.vocab.sioc('original'));
			var original = originalElem ? originalElem.value : subject.value;
			return Licensing(graph.any(licensingElem.object, solid.vocab.sioc('author')).value, license, original);
		});
	}
	var sourceElem = graph.any(subject, solid.vocab.sioc('source'));
	var source = null;
	var modified = null;
	var sourceAuthor = null;
	if(sourceElem){
		source = sourceElem.value;
		modified = graph.any(subject, solid.vocab.sioc('modified')).value;
		sourceAuthor = graph.any(subject, solid.vocab.sioc('sourceAuthor')).value;
		return Twist(text, author, licensings, date, {source:source, modified: modified, author: sourceAuthor}, subject.value);
	}
	else {
		return Twist(text, author, licensings, date, null, subject.value);
	}
}