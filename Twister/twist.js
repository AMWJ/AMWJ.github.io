Twist = function(t, auth, lics, d, attrib, uri) {
	if(!d) {
		d = Date.now();
	}
	var that = {};
	that.text = function(){
		return t;
	}
	that.setText = function(text){
		t = text;
	}
	that.author = function(){
		return auth;
	}
	that.licenses = function (){
		return lics;
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
			
			graph.add(thisResource, solid.vocab.sioc('license'), thisLicense);
			graph.add(thisLicense, solid.vocab.sioc('author'),$rdf.lit(lic.getUri()));
		})
		if(attrib){
			graph.add(thisResource, solid.vocab.sioc('source'), $rdf.lit(attrib.original));
			graph.add(thisResource, solid.vocab.sioc('modified'), $rdf.lit(attrib.modified));
			graph.add(thisResource, solid.vocab.sioc('sourceAuthor'), $rdf.lit(attrib.author));
		}
		return graph;
	}
	that.retwist = function(newLicenses, newText){
		if(mustAttribute(that)){
			return Twist(newText, user, newLicenses, Date.now(), {original:uri,modified:newText!=t,author:friendList[auth].name});
		}
		else{
			return Twist(newText, user, newLicenses, Date.now());
		}
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
						<a href='"+lics[0].getUri()+"' target='_blank'>\
							<img src='"+lics[0].getImage()+"'/></div>\
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
		if(that.attribution()){
			var attributionDiv = $("<div class='attribution'>").html("This work is a derivative of "+
			"<a target='_blank' href='"+that.attribution().source + "'>" + that.attribution().source +
			"</a> by " +
			that.attribution().author);
			ret.append(attributionDiv);
		}
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
	var licenseElem = graph.any(subject, solid.vocab.sioc('license'));
	var license = null;
	if(licenseElem) {
		license = License.fromUri(licenseElem.value);
	}
	var sourceElem = graph.any(subject, solid.vocab.sioc('source'));
	var source = null;
	var modified = null;
	var sourceAuthor = null;
	if(sourceElem){
		source = sourceElem.value;
		modified = graph.any(subject, solid.vocab.sioc('modified')).value;
		sourceAuthor = graph.any(subject, solid.vocab.sioc('sourceAuthor')).value;
		return Twist(text, author, [license], date, {source:source, modified: modified, author: sourceAuthor}, subject.value);
	}
	else {
		return Twist(text, author, [license], date, null, subject.value);
	}
}