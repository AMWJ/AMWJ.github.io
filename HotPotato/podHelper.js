//From SandHawke's GroupChat Project
var etag=null;
var mainPod="http://fakepods.com";
var potatoes=[];
function podURL(id) {
	// temporary hack until we have a nice way for users to select their pod
	//return "http://"+document.getElementById("username").value+".fakepods.com";
	if(id)
	{
		return "http://"+id+".fakepods.com";
	}
	else
	{
		return mainPod;
	}
}
function setMainPod(id)
{
	mainPod ="http://"+id+".fakepods.com";
}
function reload(id) {

	var request = new XMLHttpRequest();
	var pod=mainPod;
	if(id)
	{
		pod=podURL(id);
	}
	// just fetch everything, for now, since queries don't work yet
	request.open("GET", pod+"/_active", true);
	if (etag !== null) {
		request.setRequestHeader("Wait-For-None-Match", etag);
	}

	request.onreadystatechange = function(e) {
		if (request.readyState==4 && request.status==200) {
    		handleResponse(request.responseText);
    	}
		if (request.readyState==4 && request.status==404) {
    		console.log("hi");
    	}
 	}

	request.send();
}

function handleResponse(responseText) {
	potatoes=[];
	var response=$.parseJSON(responseText);
	for(var i=0;i<response.length;i++)
	{
		if(response[i].potato==1)
		{
			potatoes.push(
				{
					runoutDuration : response[i].countdown,
					timeCreated : response[i].countdown,
					name: response[i].name,
					history: response[i].history
				});
		}
	}
	potatoes.push({
		runoutDuration : 300,
		timeCreated : 1412300709,
		name: "Test",
		history: {}
	});
	updatePotatoList();
}

function newmsg(object, id) {
	var request = new XMLHttpRequest();
	request.open("POST", podURL(id));
	request.onreadystatechange = function() {
		if (request.readyState==4 && request.status==201) {
			// why does this always print null, even though it's not?
			// console.log("Location:", request.getResponseHeader("Location"));
		}
	}
	request.setRequestHeader("Content-type", "application/json");
	var content = JSON.stringify(object);
	request.send(content);
}
