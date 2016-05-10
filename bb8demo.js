var mqtt = require('./mqtt-wrapper.js')();
var sphero = require("sphero"),
    bb8 = sphero("df5ee0d66b3b4eeba5bd9a944fc81ef4"); // change BLE address accordingly

bb8.connect(function() {

  console.log("**** Start debug info *****");
  console.log("Connected to BB-8");


  bb8.ping(function(err, data) {
    console.log("Output of ping command");
    console.log(err || data);
    console.log("End of ping data");
  });
  console.log("BB-8 is changing color to green to indicate that it is connected")
  bb8.color("green");
  console.log("**** End debug info *****");
  
  console.log("**** START CALIBRATION ****");
  bb8.startCalibration();
  setTimeout(function() {
    console.log("**** FINISH CALIBRATION ****");
    bb8.finishCalibration();
  }, 10000); //turning on the blue tail light for 10 seconds


  mqtt.connect(function(client, deviceId) {
		client.on('connect', function() {
			console.log('MQTT client connected to IBM IoT Cloud.');
			console.log('Connected Sphero ID: ' + deviceId);
			client.subscribe('iot-2/cmd/run/fmt/json', {
				qos : 0
			}, function(err, granted) {
				if (err) {
					throw err;
				}
				console.log("subscribed to iot-2/cmd/run/fmt/json");
			});
		});

		client.on('message', function(topic, message, packet) {
			console.log(topic);
			var msg = JSON.parse(message.toString());
			console.log(msg);
			if (msg.d.action === '#red') {
				console.log('Change color to RED');
        bb8.color("red");

			}

			else if (msg.d.action === '#blue') {
        console.log('Change color to BLUE');
        bb8.color("blue");


			}
            
            else if (msg.d.action === '#green') {
        console.log('Change color to green');
        bb8.color("green");
        
            }

			else if (msg.d.action === '#spherorun') {
				console.log('Get Sphero to run');
       
       bb8.detectCollisions({device: "bb8"});
       bb8.color("green");
  
       bb8.on("collision", function(data) {
       console.log("collision detected");

       bb8.roll(255, 180);
       setTimeout(function() {
       bb8.stop();
       }, 2000);
       });
       
       bb8.roll(255, 0);
        
		   }
           
           else if (msg.d.action === '#spheroright') {
        console.log('right');
        bb8.roll(200, 90);
        setTimeout(function() {
            bb8.stop();}, 1500);
        
            }
            
            else if (msg.d.action === '#spheroleft') {
        console.log('left');
        bb8.roll(200, 270);
        setTimeout(function() {
            bb8.stop();}, 1500);
            
            }
            
            else if (msg.d.action === '#spherogo') {
        console.log('go');
        bb8.roll(200, 0);
        setTimeout(function() {
            bb8.stop();}, 1500);
            
            }
            
            else if (msg.d.action === '#spheroback') {
        console.log('back');
        bb8.roll(200, 180);
        setTimeout(function() {
            bb8.stop();}, 1500);
            
            }
	});

});

});
