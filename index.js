// PREDIFINED TOPICS
var TOPICS = [
  { topic: 'kafkaui', partition: 0 },
  { topic: 'toNotificationService', partition: 0 }
];

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer( client, TOPICS, { autoCommit: false });

var Producer = kafka.Producer,
    producer = new Producer(client),
    producerReady = false;

producer.on('ready', function () { producerReady = true; });
producer.on('error', function (err) { console.log('Producer error', err)});


app.get('/', function(req, res){
  res.render('index', {topics: TOPICS});
});


app.set('views', './views');
app.set('view engine', 'jade');
app.use('/static', express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'))

io.on('connection', function (socket) {
  consumer.on('message', function(message){
    socket.emit('kafka-message', message);
  });

  socket.on('kafka-send-message', function (data) {
    if (producerReady) {
      producer.send([data], function (err, res) { console.log(err, res) });
    }
  });
});

server.listen(3000);

