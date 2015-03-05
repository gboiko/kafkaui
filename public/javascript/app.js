var socket = io.connect('http://localhost:3000');
socket.on('kafka-message', function (data) {
  var msg = "<span class='topic'>@" + data.topic + '.</span> ' + data.value
  var kafkaMessage = "<li class='list-group-item'>" + msg + "</li>";
  $('.message-board').prepend(kafkaMessage)
  console.log('received kafka message', data);
});

$(document).ready(function () {
  function sendMessage () {
    var message = $('.message-input').val();
    if (!message || message == '') { return false }

    var topic = $('.input-group-btn .selected-topic').html();
    if (socket.emit) {
      socket.emit('kafka-send-message', { messages: message, topic: topic});
      $('.message-input').val('');
    }
  }
  $('.message-sender').on('click', sendMessage);
  $('.message-input').keypress(function (e) {
    if (e.which == 13) {
      sendMessage();
      return false;
    }
  });

  $(".dropdown-menu li a").click(function(){
    var selText = $(this).text();
    $(this).parents('.input-group-btn').find('button[data-toggle="dropdown"]').html('<span class="selected-topic">'+ selText+'</span> <span class="caret"></span>');
  });
});