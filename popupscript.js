var port;
var time, 
	timetoken, 
	bg;


$(document).ready(function() {
	bg = chrome.extension.getBackgroundPage();
	console.log( bg );
	$(".button").hover(function() {
		$(this).css("opacity", parseFloat($(this).css("opacity"))-0.3);	
	},
	function(){
		$(this).css("opacity", parseFloat($(this).css("opacity"))+0.3);	
	});
	$("#start").click(function() {
		console.log( "starting..." );
		var $time = $("#time");
		if (!bg.running && $time.val().length ) {
			time = parseInt( $("#time").val() );
			bg.connectAndStart(time);
		}
	});
	$("#stop").click(function() {
		console.log( "stopping..." );
		if (bg.running) {
			bg.stopTracking();
		}
	});
});