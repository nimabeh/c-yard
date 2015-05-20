// //video
// var os = require('os');
// var static = require('node-static');


//arduinoservo
var five = require("johnny-five")
    , board, servo;

// Global storage for Arduino Servos
var arduinoServos = {};
// Initialize express and server
var express = require('express')
var app = express()
  , server = require('http').createServer(app);
var oldPan = 90;
var oldTilt = 140;
  // var SerialPort = require('serialport')
  // var arduino = new SerialPort('/dev/tty1431', {baudrate: 9600})

// Access server through port 80
server.listen(3000);

// Set '/public' as the static folder. Any files there will be directly sent to the viewer
app.use(express.static(__dirname + '/public'));

// Set index.html as the base file
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
// Initialize connection to Arduino (will crash if none is attached)
board = new five.Board();

// When the connection is ready...
board.on("ready", function() {
  // Add a steering servo
  arduinoServos = {
    pan: new five.Servo({
      pin: 9,             // Send signal through Arduino Pin #9
      range: [0, 180],    // Servo value ranges: 0-180 (Check motors for actual range)
      type: "standard",   // Default "standard". "continuous" for cont. rotation servos
      startAt: oldPan,        // if you would like the servo to immediately move to degree
      center: false       // If true moves servo to center of range instead of starAt
    }),

    //this is were I was, replacing all steering with pan
    //and then add tilt or motor here
    
    tilt: new five.Servo({
      pin: 10,             // Send signal through Arduino Pin #9
      range: [0, 180],    // Servo value ranges: 0-180 (Check motors for actual range)
      type: "standard",   // Default "standard". "continuous" for cont. rotation servos
      startAt: oldTilt,        // if you would like the servo to immediately move to degree
      center: false       // If true moves servo to center of range instead of starAt
    })

  };
  // pan = arduinoServos.pan;

  // Inject the `servo` hardware into context; allows direct command line access
  board.repl.inject({
    s: arduinoServos
  });
});

var io = require('socket.io').listen(server);

// When someone has connected to me...
io.sockets.on('connection', function (socket) {
  // Send out a message (only to the one who connected)
  socket.emit('robot connected', { data: 'Connected' });

  // When I've received 'robot command' message from this connection...
  socket.on('robot command', function (data) {
    console.log(data);

var command = data.command;

if (command == 'turn-left') {
  var newPan = oldPan + 0.5;
  arduinoServos.pan.to(newPan);
oldPan = newPan;
  board.repl.inject({
    s: arduinoServos
  });
}
else if (command == 'turn-right') {
  var newPan = oldPan - 0.5;
  arduinoServos.pan.to(newPan);
oldPan = newPan;
  board.repl.inject({
    s: arduinoServos
  });
}

if (command == 'turn-up') {
var newTilt = oldTilt + 0.5;

  arduinoServos.tilt.to(newTilt);
oldTilt = newTilt

  board.repl.inject({
    s: arduinoServos
  });
}
else if (command == 'turn-down') {

var newTilt = oldTilt - 0.5;

  arduinoServos.tilt.to(newTilt);
oldTilt = newTilt
  board.repl.inject({
    s: arduinoServos
  });
}

  });
});

//... In the section: socket.on('robot command', function (data)...
// Update Arduino motor values if the received command is a 'turn-left' or 'turn-right'

//...


// var buffer = new Buffer(2)
// buffer[0] = 0x00 // --> off function for arduino
// buffer[1] = 0x01 // --> on function for arduino



