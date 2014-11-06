//From SandHawke's GroupChat Project
var etag=null;
var mainPod="http://fakepods.com";
var potatoes=[];
var etag=null;
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

	var pod=mainPod;
	if(id)
	{
		pod=podURL(id);
	}
	// just fetch everything, for now, since queries don't work yet
	$.ajax(pod+"/_nearby", 
	{
		dataType: "json",
		beforeSend: function(request) {
			if(etag!== null)
			{
				request.setRequestHeader("Wait-For-None-Match", etag);
			}
		},
		success: function(response) {
			receivedPotatoes=[];
			sentPotatoes=[];
			currentPotatoes=[];
			etag=response._etag;
			for(var i=0;i<response.length;i++)
			{
				if(response[i].potato==1.0)
				{
					if(response[i].receiver==id)
					{
						receivedPotatoes.push(
						{
							sender: response[i].sender,
							runoutDuration : response[i].duration,
							timeSent : response[i].sent,
							name: response[i].name,
							receiver: response[i].receiver
						});
					}
					else if(response[i].sender==id)
					{
						sentPotatoes.push(
						{
							sender: response[i].sender,
							runoutDuration : response[i].duration,
							timeSent : response[i].sent,
							name: response[i].name,
							receiver: response[i].receiver
						});
					}
				}
			}
			for(var i=0;i<receivedPotatoes.length;i++)
			{
				var potato=receivedPotatoes[i];
				for(var j=0;j<sentPotatoes.length;j++)
				{
					var found=false;
					if(sentPotatoes[j].name==potato.name&&sentPotatoes[j].timeSent>potato.timeSent)
					{
						found=true;
						break;
					}
				}
				if(!found)
				{
					currentPotatoes.append(potato);
				}
			}
			currentPotatoes.push({
				runoutDuration : 30000,
				timeSent : 1413300709,
				name: "Test",
				receiver: "ariel",
				sender: "somebody"
			});
			updatePotatoList();
			reload(id);

		}
	});
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
