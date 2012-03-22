# Tracker

This is a simple Chrome extension that allows you to track mouse and keyboard for *n* seconds. I used it for user testing, so may you. Or fork it and use it for something else.

## Installation

Look [here](http://code.google.com/chrome/extensions/getstarted.html#load).

## Usage

Click on the extension icon, then enter the amount of seconds you want to track the mouse and keyboard. It stops automatically when the time is over and inserts a DIV in your webpage that contains the recorded data in JSON format.

## JSON Format

data = {  
		"clicks": {  
			"left": int,  
			"right": int  
		},  
		"scrolls": {  
			"up": int,   
			"down": int  
		},  
		"path": int,  
		"time_left": int,  
		"keyboard": char array  
	}  
	
Please note that scrolls.up and scrolls.down do not work right now because MouseWheel Events are a pain in the ass.