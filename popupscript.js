var port;
var time, 
	timetoken, 
	bg;


$(document).ready(function() {
	bg = chrome.extension.getBackgroundPage();
	$(".button").hover(function() {
		$(this).css("opacity", parseFloat($(this).css("opacity"))-0.3);	
	},
	function(){
		$(this).css("opacity", parseFloat($(this).css("opacity"))+0.3);	
	});
	$("#start").click(function() {
		if (!bg.running) {
			do {
				time = prompt("Enter amount of seconds to track.");
			}
			while(time.length<=0 || isNaN(parseInt(time)));
			alert("Tracking is starting after this click!");
			bg.connectAndStart(time);
		}
	});
	$("#stop").click(function() {
		if (bg.running) {
			bg.stopTracking();
		}
	});
});