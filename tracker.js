var currentSeconds = 0,
	div = null,
	body = null,
	tab = null,
	timertoken = null,
	myport = null,
	last_move = null,
	data = {
		"clicks": {"left": 0, "right": 0},
		"scrolls": {"up": 0, "down": 0},
		"path": 0,
		"time_left": -1,
		"keyboard": []
	};

$(document).ready(function() {
	body = $("body");
	console.log($(window));
});

function insertResults() {
	if ($("#insertedResult")!=null) {
		div = $("<div></div>");
		div.attr("id", "insertedResult");
		body.prepend(div);
		div.css("font-family", "Menlo, Courier, monospace" );
		div.css("border", "3px solid red");
		div.css("height", "150px");
		div.css("overflow", "scroll");
	}
}

function updateResults() {
	div.append(JSON.stringify(data)+",");
	div.show();
}
	
function clickHandler(evt) {
	if (evt.button==0)
		data.clicks.left++;
	if (evt.button==1)
		data.clicks.right++;
}

function moveHandler(evt) {
	if ( last_move == null ) {
		last_move = [evt.offsetX, evt.offsetY];
		return;
	}
	var a = last_move[ 0 ] - evt.offsetX;
	var b = last_move[ 1 ] - evt.offsetY;
	var c = Math.sqrt( a*a + b*b );
	console.log( a, b, c );
	data.path += c;
	last_move = [ evt.offsetX, evt.offsetY ];
}

function scrollHandler(evt) {
	console.log("scroll");
	console.log(evt);
	
}

function keyboardHandler(evt) {
	data.keyboard.push(String.fromCharCode(evt.which));

	//keyboard shortcut for stop: strg+b
	var key_a = data.keyboard[data.keyboard.length-1];
	var key_b = data.keyboard[data.keyboard.length-2];
	if ( (key_a=="B" && key_b=="\u0011") ||
		 (key_a=="\u0011" && key_b=="B")) {
		 data.keyboard = data.keyboard.slice(0,-2);
		 intentionalStop();
	}
}	

function stopTimer(){
	clearInterval(timertoken);
}

function elapsedStop() {
	stopTimer();
	stopTracking();
	if (myport!=null)
		myport.postMessage({"command": "elapsed", "data": data});
	updateResults();
	console.log("timer elapsed");
}

function intentionalStop() {
	stopTimer();
	stopTracking();
	updateResults();
	if (myport!=null)
		myport.postMessage({"command": "stopped", "data": data});
	console.log("tracking stopped by user");
}
	
function tick() {
	currentSeconds--;
	data.time_left = currentSeconds;
	if (currentSeconds <= 0) {
		elapsedStop();
	}
	else if (myport!=null)
		myport.postMessage({"command": "tick", "data": data});
}	
	
function startTracking(seconds, tabid) {
	console.log("tracking started");
	body.on("click", clickHandler);
	body.on("mousemove", moveHandler);
	body.on("keyup", keyboardHandler);
	if (div==null) { //erster aufruf
		insertResults();
	}
	div.hide();
	data.time_left = seconds;
	data.clicks.left = 0;
	data.clicks.right = 0;
	data.scrolls.up = 0;
	data.scrolls.down = 0;
	data.path = 0;
	data.keyboard = [];
	tab = tabid;
	currentSeconds = seconds;
	timertoken = setInterval(tick, 1000);
}

function stopTracking() {
	body.off("click");
	body.off("mousemove");
	body.off("keyup");
}

chrome.extension.onConnect.addListener(function(port) {
	console.log("connection ahead");
	myport = port;
	console.assert(port.name == "comm");
	port.onMessage.addListener(function(msg) {
		if (msg.command=="start") {
			startTracking(msg.time);
			port.postMessage({"command":"started"});
		}
		else if (msg.command=="stop") {
			intentionalStop();
		}
	});
});
