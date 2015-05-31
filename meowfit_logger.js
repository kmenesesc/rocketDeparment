var Bean = require('ble-bean');

var intervalId;
var connectedBean;
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
    if( diffX < 0.4 && diffY < 0.4 && diffZ < 0.4){
      movement = false;
    } else {
      movement = true;
    }

    // output useful data to console
    console.log("[received] " + status + " accell ( " + x + ", " + y + ", " + z + " )");
    console.log("[diff] (" + diffX + ", " + diffY + ", " + diffZ + " )");
    console.log("Movement: " + movement);


    // update the last known values
    lastX = x;
    lastY = y;
    lastZ = z;

  });

  bean.on("temp", function(temp, valid){
    var status = valid ? "valid" : "invalid";
    console.log("[received] " + status + " temp:\t" + temp);
  });

  bean.on("disconnect", function(){
    process.exit();
  });

  bean.connectAndSetup(function(){

    var readData = function() {

      bean.requestAccell(
      function(){
        console.log("[request] accell data");
      });

      bean.requestTemp(
      function(){
        console.log("[request] temp sent");
      });

    }

    intervalId = setInterval(readData,1000);

  });

});