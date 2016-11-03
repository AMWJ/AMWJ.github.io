Twist = function(t, auth, license, d) {
	if(!d) {
		d = new Date();
	}
	that = {};
	that.text = function(){
		return t;
	}
	that.setText = function(text){
		t = text;
	}
	that.author = function(){
		return auth;
	}
	that.date = function (){
		return d;
	}
	that.toGraph = function(){
		var graph = $rdf.graph();
		var thisResource = $rdf.sym('');

		graph.add(thisResource, solid.vocab.sioc('content'), $rdf.lit(t));
		graph.add(thisResource, solid.vocab.sioc('author'), $rdf.lit(auth + profile));
		graph.add(thisResource, solid.vocab.sioc('date'), $rdf.lit(d));
		
		graph.add(thisResource, solid.vocab.sioc('nc'), $rdf.lit(license.nc))
		return graph;
	}
	that.toHTML = function(){
			return $("<div class='twist'>\
    <div class='authorBlock'>"+auth+":</div>\
    <time class='dateBlock' datetime='"+d+"'></time>\
    <div class='contentBlock'>"+t+"</div>\
	</div>");

	}
	return that;
}

Twist.fromGraph = function(graph, subject){
	var text = graph.any(subject, solid.vocab.sioc('content')).value;
	var author = graph.any(subject, solid.vocab.sioc('author')).value;
	var dateElem = graph.any(subject, solid.vocab.sioc('date'));
	var licenseElem = graph.any(subject, solid.vocab.sioc('nc'));
	license = null;
	if(licenseElem) {
		license = {nc:licenseElem.value};
	}
	date = null;
	if(dateElem){
		date = dateElem.value;
	}
	return Twist(text, author, license, date);
}