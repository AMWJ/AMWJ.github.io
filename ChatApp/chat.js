"use strict";
$(function(){
	//Based on http://crosscloud.org/0.1.1/example/hello
	$("#error").html("");  // clear the "Missing Javascript" error message
	var myStatusPod=null;
	var pod = crosscloud.connect();
	var myProfile={
		isProfile:0.1,
		available:false,
		status:""
	};
	var profiles={};
	var myStatus=""
	var displayMessages;
	var messages=[]
	var displayedPosts=[]
	var myAvailability=false
	var statusState="Unreal"
	messages[pod.loggedInURL]=[]
	Handlebars.registerHelper('defaultUserName', function(userID) {
		return moment(date).fromNow();
	});
	Handlebars.registerHelper('relativeTime', function(date) {
		return moment(date).fromNow();
	});
	Handlebars.registerHelper('isOwner', function(sender, options) {
		if(sender==pod.loggedInURL)
		{
			return options.fn(this);
		}
		else
		{
			return options.inverse(this);
		}
	});
	var newMessage = function()
	{
		$("#recipient").removeAttr('disabled');
		$("#recipient").removeProp('disabled');
		$("#recipient").val("");
		$(".messages").html("");
	};
    var sendMessage = function () {
		var thisMessage = { isChatMessage: 0.15,
							body: "Hello, World!",
							recipients: [],
                            when: (new Date()).toISOString()
                          };	//Data to be stored on your pod
        
        var recipients = $("#recipient").val()
        var body = $("#message").val()
		thisMessage.recipients=[recipients]	//For now, this can only have one recipient
		thisMessage.body=body
        
        pod.push(thisMessage);
        $("#message").val("");	//Ideally this only happens when the message has been sent successfully
		$("#recipient").prop('disabled', true);
		$("#recipient").attr('disabled', true);
    };
	$("#send").click(sendMessage);
	var newUserName=function(userName)
	{
		myProfile.userName=userName;
		myProfile.lastUpdated=(new Date()).toISOString()
        pod.push(myProfile,podStored);
	}
	var newAvailability=function(available)
	{
		myProfile.available=available;
		myProfile.lastUpdated=(new Date()).toISOString()
        pod.push(myProfile,podStored);
        $("#profileSaveStatus").text(statusState);
	}
	var changeRecipient = function(recipient)
	{
		$("#recipient").prop('disabled', true);
		$("#recipient").attr('disabled', true);
		$("#recipient").val(recipient.target.innerHTML.trim());
		displayMessages()
		return false;
	}
    var newStatus = function (status)
	{
        var status = $("#status").val()
		myProfile.status=status
		myProfile.lastUpdated=(new Date()).toISOString()
        pod.push(myProfile,podStored);
		statusState="Updating ...";
        $("#profileSaveStatus").text(statusState);
    }
	var podStored=function(item)
	{
		if(item._id)
		{
			myStatusPod=item._id;
		}
	}

    // allow the enter key to be a submit as well
    $("#message").keypress(function (e) {
        if (e.which == 13) {
            $("#send").click();
            return false;
        }
    });
    
	$("#status").keypress(function (e) {
        if (e.which == 13) {
            $("#statusUpdate").click();
            return false;
        }
    });
	$("#statusUpdate").click(newStatus);
	$("#availability").on('click', function () {
		if ($(this).text()=="Available") {
			newAvailability(false);
		}
		else {
			newAvailability(true);
		}
});

    var show = 5;
	var updateStatuses=function(items)
	{
		for(var i=0;i<items.length;i++)
		{
			if(items[i]._owner==pod.loggedInURL)
			{
				myProfile=items[i];
			}
			else
			{
				profiles[items[i]._owner.replace("http://","")]=items[i];
			}
		}
		if(myProfile.available)
		{	
			$("#availability").text("Available");
		}
		else
		{	
			$("#availability").text("Not Available");
		}
		if(statusState!="Editing")
		{
			$("#status").val(myProfile.status);
			statusState="Saved";
			$("#profileSaveStatus").text(statusState);
		}
		if(Object.keys(messages).length)
		{
			updateRecipientList()
		}
	}
	var updateMessages=function(items)
	{
		organizeMessages(items);
		updateRecipientList()
		displayMessages();
	}
	var updateRecipientList=function()
	{
		var recipients=[]
		$("#contactList").html("");
		var ids = Object.keys(messages);
		ids.forEach(function(id,i)
		{
			var recipient={};
			recipient.id=id;
			if(profiles[id])
			{
				recipient.status=profiles[id].status;
				recipient.available=profiles[id].available;
				recipient.lastUpdated=profiles[id].lastUpdated;
			}
			recipients.push(recipient);
		});
		var theTemplateScript = $("#recipientListItem").html(); 
		var theTemplate = Handlebars.compile (theTemplateScript); 
		$("#contactList").html(theTemplate(recipients));
		
		
		var theTemplateScript = $("#currentUserTemplate").html(); 
		var theTemplate = Handlebars.compile (theTemplateScript); 
		$("#currentUser").html(theTemplate(myProfile));
		
		$(".contact").click(changeRecipient);
		// save changes to userName
		$("#currentUserName").keydown(function (e) {
			if (e.which == 13) {
				newUserName($("#currentUserName").text());
				return false;
			}
			if (e.which == 27) {
				updateRecipientList();
			}
		});
	}
	var newRecipientOption=function(recipient)
	{
		return $("<option>").html(recipient);
	}
	var organizeMessages = function (items)	//Sort all messages by other party
	{
		messages=[]
		items.forEach(function(item)
		{
			if(item._owner==pod.loggedInURL)
			{
				item.recipients.forEach(function(recipient)
				{
					if(messages[recipient.replace("http://","")])
					{
						messages[recipient.replace("http://","")].push(item)
					}
					else
					{
						messages[recipient.replace("http://","")]=[item]
					}
				});
			}
			else
			{
				item.recipients.forEach(function (recipient)
				{
					if(recipient==pod.loggedInURL.replace("http://",""))
					{
						if(messages[item._owner.replace("http://","")])
						{
							messages[item._owner.replace("http://","")].push(item)
						}
						else
						{
							messages[item._owner.replace("http://","")]=[item]
						}
					}
				});
			}
		});
	}
    displayMessages = function ()
	{
		$("#out").html("");
		var table = $("#results");
		var currentRecipient=$("#recipient").val()
		displayedPosts=messages[currentRecipient]||[]
		displayedPosts.sort(function(a,b){return a.when<b.when?-1:(a.when===b.when?0:1)});
		var isBottom=false;
		if ($(window).height() + $(window).scrollTop() == $(document).height())
		{
				isBottom=true;
		}
		//Databind messages
		var theTemplateScript = $("#chatHistory").html(); 
		var theTemplate = Handlebars.compile (theTemplateScript); 
		$(".messages").html(theTemplate(displayedPosts));
		if(isBottom)
		{
			window.scrollTo(0,document.body.scrollHeight);
		}
    };

    pod.onLogin(function () {
        $("#out").html("waiting for data...");
		$("#send").removeAttr('disabled');
		$("#send").removeProp('disabled');
		var theTemplateScript = $("#currentUserTemplate").html(); 
		var theTemplate = Handlebars.compile (theTemplateScript); 
		$("#currentUser").html(theTemplate(pod));
        pod.onLogout(function () {
            updateMessages([])
			$("#recipient").off("input");
			$("#send").attr('disabled', true);
			$("#send").prop('disabled', true);
			myStatusPod=null;
			myAvailability=false;
			myProfile={};
			$("#currentUser").html(theTemplate(pod));
			statusState="Unreal"
			$("#status").val("");
			profiles={}
		});
        pod.query()
            .filter( { isChatMessage:0.15 } )
            .onAllResults(updateMessages)
            .start();
        pod.query()
            .filter( { isProfile:0.1 } )
            .onAllResults(updateStatuses)
            .start();
		//$("#recipient").on("input",displayMessages);
    });
	var refreshList=function()
	{
		
	}
    $("#newMessage").click(newMessage);
	$("#status").on("input",function()
	{
		statusState="Editing";
        $("#profileSaveStatus").text(statusState);
	});

});
function recipientList(recipients)
{
	var str=""
	for(var i=0;i<recipients.length;i++)
	{
		if(i!=0)
		{
			str+=" & "
		}
		str+=recipients[i]
	}
	return str
}