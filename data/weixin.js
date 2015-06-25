var port = self.port;
var sent = new Array(10);
var src_prefix = window.location.protocol + '//' + window.location.host;

// Send heartbeats
setInterval(function() {
  if (
    $('#chatMainPanel').css('visibility') == 'visible' ||
    $('#chatArea').length > 0
  ) {
    port.emit('heartbeat', true);
  }
}, 3000);

// Listen to DOM mutations
if (document.getElementById('chatMainPanel')) {
  new MutationObserver(function() {
    sendMessage(captureMessage);
  }).observe(document.getElementById('chatMainPanel'), { 'childList': true, 'subtree': true });
} else if (document.getElementById('chatArea')) {
  new MutationObserver(function() {
    sendMessage(captureMessage2);
  }).observe(document.getElementById('chatArea'), { 'childList': true, 'subtree': true });
}

function sendMessage(callback) {
  var i, msg = callback();

  console.log(msg); // FIXME

  if (msg !== null) {
    port.emit('bullet', msg);
    sent.shift();
    sent.push(msg.id);
  }
}

/*
  An typical message looks like:

  {
    id: '',
    user: { name: '',  avatar: '' },
    content: { text: '', image: '' }
  };
*/

function captureMessage() {
  var i, id, text, img;

  // Check message id
  id = $('.chatItem:last').attr('un');
  for (i = 0; i < sent.length; i++) {
    if (sent[i] == id) {
      return null;
    }
  }

  // Handle text message
  if ($('.chatItemContent:last pre img').length) {
    $('.chatItemContent:last pre img').each(function() {
      if (/^\//.test($(this).attr('src'))) {
        $(this).attr('src', src_prefix + $(this).attr('src'));
      }
    });
  }
  if ($('.chatItemContent:last pre span.emoji').length) {
    $('.chatItemContent:last pre span.emoji').each(function() {
      $(this).replaceWith('<img height=24 src="http://cdn.bootcss.com/twemoji/1.2.0/svg/' + /emoji(\w+)/.exec(this.className)[1] + '.svg" />');
    });
  }
  text = $('.chatItemContent:last pre').html();

  // Handle image message
  if ($('.chatItemContent:last .img_wrap img').length) {
    img = src_prefix + $('.chatItemContent:last .img_wrap img').attr('rawsrc');
  } else if ($('.chatItemContent:last .customEmoji').length) {
    img = src_prefix + $('.chatItemContent:last .customEmoji').attr('src');
  } else {
    img = '';
  }

  // Make message
  var msg = {
    id: id,
    user: {
      name: $('.chatItemContent:last .avatar').attr('title'),
      avatar: src_prefix + $('.chatItemContent:last .avatar').attr('src')
    },
    content: {
      text: text,
      image: img
    }
  };
  return msg;
}

function captureMessage2() {
  var id, text = '', img = '';

  // Check message id
  id = $.parseJSON($('#chatArea .message:last > .content > .ng-scope[data-cm]').attr('data-cm')).msgId;
  for (i = 0; i < sent.length; i++) {
    if (sent[i] == id) {
      return null;
    }
  }

  // Handle text message
  if ($('#chatArea .message:last .plain').length) {
    if ($('#chatArea .message:last .plain pre img').length) {
      $('#chatArea .message:last .plain pre img').each(function() {
        if (/^\//.test($(this).attr('src'))) {
          $(this).attr('src', src_prefix + $(this).attr('src'));
        }
      });
    }
    if ($('#chatArea .message:last .plain pre img.emoji').length) {
      $('#chatArea .message:last .plain pre img.emoji').each(function() {
        $(this).replaceWith('<img height=24 src="http://cdn.bootcss.com/twemoji/1.2.0/svg/' + /emoji(\w+)/.exec(this.className)[1] + '.svg" />');
      });
    }
    text = $('#chatArea .message:last .plain pre').html();

  // Handle image message
  } else if ($('#chatArea .message:last .picture .msg-img').length &&
  /^\//.test($('#chatArea .message:last .picture .msg-img').attr('src'))) {
    img = src_prefix + $('#chatArea .message:last .picture .msg-img').attr('src').split('&type=slave')[0];

  // Handle custom_emoji message
  } else if ($('#chatArea .message:last .emoticon .custom_emoji').length) {
    img = src_prefix + $('#chatArea .message:last .custom_emoji').attr('src');

  // Capture nothing
  } else {
    return null;
  }

  // Make message
  var msg = {
    id: id,
    user: {
      name: $('#chatArea .message:last .avatar').attr('title'),
      avatar: src_prefix + $('#chatArea .message:last .avatar').attr('src')
    },
    content: {
      text: text,
      image: img
    }
  };
  return msg;
}
