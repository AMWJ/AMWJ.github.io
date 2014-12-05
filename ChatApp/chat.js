"use strict";
$(function(){
	//Based on http://crosscloud.org/0.1.1/example/hello
	$("#error").html("");  // clear the "Missing Javascript" error message
	var myStatusPod=null;
	var pod = crosscloud.connect();
	var myStatus=""
	var displayMessages;
	var messages=[]
	var displayedPosts=[]
	var myAvailability=false
	messages[pod.loggedInURL]=[]
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
	var newAvailability=function(available)
	{
		myAvailability=available;
		var newStat = { isChatStatus: 0.15,
						status: myStatus,
						available: available,
						when: (new Date()).toISOString(),
					  };	//Data to be stored on your pod
		if(myStatusPod!==null)
		{
			newStat["_id"]=myStatusPod
		}
        pod.push(newStat,podStored);
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
        var newStat = { isChatStatus: 0.15,
						status: myStatus,
						available: myAvailability,
						when: (new Date()).toISOString(),
                      };	//Data to be stored on your pod
        var status = $("#status").val()
		newStat.status=status
		if(myStatusPod!==null)
		{
			newStat["_id"]=myStatusPod
		}
        pod.push(newStat,podStored);
        $("#message").val("")	//Ideally this only happens when the message has been sent successfully
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
				myStatusPod=items[i]._id;
				myStatus=items[i].status
				myAvailability=items[i].available
				break;
			}
		}
		if(myAvailability)
		{	
			$("#availability").text("Available");
		}
		else
		{	
			$("#availability").text("Not Available");
		}
        $("#status").val(myStatus)
	}
	var updateMessages=function(items)
	{
		organizeMessages(items);
		updateRecipientList()
		displayMessages();
	}
	var updateRecipientList=function()
	{
		$("#recipients").html("");
		var rs = Object.keys(messages);
		if(rs.length==0)
		{
			$("#recipients").append(newRecipientOption("(None)"));
		}
		rs.forEach(function(recipient)
		{
			$("#recipients").append(newRecipientOption(recipient));

		});
		var theTemplateScript = $("#recipientListItem").html(); 
		var theTemplate = Handlebars.compile (theTemplateScript); 
		$("#contactList").html(theTemplate(rs));

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
		if(currentRecipient=="")
		{
			$("#send").prop('disabled', true);
			$("#send").attr('disabled', true);
		}
		else
		{
			$("#send").prop('disabled', false);
			$("#send").attr('disabled', false);
		}
		//Databind messages
		var theTemplateScript = $("#chatHistory").html(); 
		var theTemplate = Handlebars.compile (theTemplateScript); 
		$(".messages").html(theTemplate(displayedPosts));
		$(".contact").click(changeRecipient)
		if(isBottom)
		{
			window.scrollTo(0,document.body.scrollHeight);
		}
    };

    pod.onLogin(function () {
        $("#out").html("waiting for data...");
		$("#send").removeAttr('disabled');
		$("#send").removeProp('disabled');
        pod.onLogout(function () {
            updateMessages([])
			$("#recipient").off("input");
			$("#send").attr('disabled', true);
			$("#send").prop('disabled', true);
			//clearInterval(displayLoop)
			myStatusPod=null;
			myAvailability=false
			myStatus=""
        });
		//var displayLoop=setInterval(displayMessages,1000)
        pod.query()
            .filter( { isChatMessage:0.15 } )
            .onAllResults(updateMessages)
            .start();
        pod.query()
            .filter( { isChatStatus:0.15 } )
            .onAllResults(updateStatuses)
            .start();
		//$("#recipient").on("input",displayMessages);
    });
	var refreshList=function()
	{
		
	}
    $("#newMessage").click(newMessage);

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