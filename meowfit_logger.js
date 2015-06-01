var Bean = require('ble-bean');
var fs = require('fs');

var intervalId;
var connectedBean;
var tempData = 0;
var movement = false;

var lastX = 0;
var lastY = 0;
var lastZ = 0;

Bean.discover(function(bean){
  connectedBean = bean;

  bean.on("accell", function(x, y, z, valid){
    var status = valid ? "valid" : "invalid";

    diffX = Math.abs(x - lastX);
    diffY = Math.abs(y - lastY);
    diffZ = Math.abs(z - lastZ);

    // check for movement
    if( diffX < 0.06 && diffY < 0.06 && diffZ < 0.06){
      movement = false;
    } else {
      movement = true;
    }

    var now = new Date();
    var jsonDate = now.toJSON();

    var data = {
      "datetime" : jsonDate,
      "diffX" : diffX,
      "diffY" : diffY,
      "diffZ" : diffZ,
      "movement" : movement,
      "temp" : tempData
    };

    // output useful data to console
    console.log(data);

    //write to log file
    fs.appendFile('log.txt', JSON.stringify(data, null, 4), function(err){
    })

    // update the last known values
    lastX = x;
    lastY = y;
    lastZ = z;

  });

  bean.on("temp", function(temp, valid){
    var status = valid ? "valid" : "invalid";
    tempData = temp
  });

  bean.on("disconnect", function(){
    process.exit();
  });

  bean.connectAndSetup(function(){

    fs.writeFile('log.txt', '### Start Log ###\n', function(err){
      if (err) throw err;
      console.log('Logfile created');
    });

    var readData = function() {

      bean.requestAccell(
      function(){
      });

      bean.requestTemp(
      function(){
      });

    }

    intervalId = setInterval(readData,1000);

  });

});