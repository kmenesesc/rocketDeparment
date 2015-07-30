"use strict";
require('events').EventEmitter.prototype._maxListeners = 100;


var Bean = require('ble-bean'); //Include #BLE-Bean Non Official API for the LightBlue Bean
var fs = require('fs');//Include file manipulation library

var intervalId;
var connectedBean;
var tempData = 0;
var movement = 0;

var lastX = 0;
var lastY = 0;
var lastZ = 0;
var diffX = 0;
var diffY =0 ;
var diffZ = 0;

Bean.discover(function(bean){ //discover a bean pass on the bean object
	console.log("Bean Discovered");  //log into the console that a bean was discovered
	connectedBean = bean;  //have a reference to the discovered bean											

	bean.on("accell", function(x, y, z, valid){ 
	var status = valid ? "valid" : "invalid"; //turn on accelerometer,
	
	// find difference between current and last x,y,z coordinates.
	diffX = Math.abs(x - lastX).toFixed(5); 
	diffY = Math.abs(y - lastY).toFixed(5);
	diffZ = Math.abs(z - lastZ).toFixed(5);
	// check for movement
	if( diffX < 0.06 && diffY < 0.06 && diffZ < 0.06){ //Log as no activity
	movement = 0;
	} else if ( diffX > 0.8 || diffY > 0.8 || diffZ > 0.8) {//Log as intense activity
	movement = 2;
	} else { //if in between 0.06 and  0.8 then Log as moderate activity
	movement = 1;
	}

	var now = new Date(); // Create a new date and time for this instant
	var jsonDate = now.toJSON(); // convert this date to JSON format
	//log into the console the time/date and the difference between the coordinates as well as the movement intensity and temperature data 
	var data = jsonDate + ", " + diffX + ", " + diffY + ", " + diffZ + ", " + movement + ", " + tempData + "\n";

	// output useful data to console
	console.log(data);

	//write to log file
	fs.appendFile(global.logFile, data, function(err){})

	// update the last known values
	lastX = x;
	lastY = y;
	lastZ = z;
	});

	bean.on("temp", function(temp, valid){//activate temp sensor
		var status = valid ? "valid" : "invalid"; 
		tempData = temp // store the temperature into tempData variable
	}); 

	bean.on("disconnect", function(){  //if the status is disconnected then
		console.log("Bean Disconnected");//prompt so in the console
		process.exit(1); //exit with code one to know that the exit was from this place in the code
	});


	 bean.connectAndSetup(function(){ 
		console.log("Connect and Setup")
		var now = new Date(); //create new date
		var jsonDate = now.toJSON(); //convert it to JSON format
		global.logFile = '/home/pi/meowfit/data/' + jsonDate + '_log.csv'; //create a file log of data

		fs.writeFile(global.logFile, '', function(err){ //store that file in the designated location
			if (err) throw err;
			console.log('Logfile created'); //print console that logfile was created
		});

	
	
	//
	
		var readData = function() {
		bean.requestAccell(function(){}); //activate the accelerometer
		bean.requestTemp(function(){}); //activate the thermometer 

		}
		
		intervalId = setInterval(readData,1000); //set the interval to 1000 miliseconds
		

  }); 

  
  return (0); //return zero from this place in the code
  
  });

