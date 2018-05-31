var TwitterStream = require('twitter-stream-api');
var express = require('express');
var app = express();
var server = app.listen(9966);
var io = require('socket.io').listen(server);
var keys = require('./config');
var Twitter = new TwitterStream(keys);

app.use(express.static(__dirname));

//Create web sockets connection.
io.sockets.on('connection', function (socket) {
  socket.emit('connected');

  socket.on("tweetStream", function() {
    Twitter.stream('statuses/filter', {
      // Filter for the USA
      locations: '-125.0011, 24.9493, -66.9326, 49.5904'
    });

    Twitter.on('connect', function() {
      console.log('connected on twitter');
    });

    Twitter.on('data', function(obj) {
      if(obj.coordinates) {
        socket.emit('tweet', obj);
      }
    });

  });
});
