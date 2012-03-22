var data, time, port, running;

function tick(data) {
	this.data = data;	
	this.time = data.time_left;
}

function stopTracking() {
	if (port!=null)	{
		alert("Tracking gestoppt!");
		this.running = false;
		port.postMessage({"command":"stop"});
	}
}

function connectAndStart(time) {	
	chrome.tabs.getSelected(null, function(tab) {
		port = chrome.tabs.connect(tab.id, {name: "comm"});
		port.postMessage({command: "start", "time": time});	
		port.onMessage.addListener(function(msg) {
			console.log("new message!");
			console.log(msg);
			if (msg.command=="started")
				running = true;
			else if (msg.command=="tick")
				tick(msg.data);
			else if (msg.command=="elapsed") {
				alert("Zeit ist abgelaufen!");
				running = false;
			}
			else if (msg.command=="stopped") {
				alert("Tracking gestoppt!");
				running=false;
			}
		});
	});	
}

