var port = self.port;
var src_pref;
var msg_read;
var username;
var MSG_QUEUE_SIZE = 1000;

// Whether is the target page
if (document.getElementById('chatArea')) {
  // Initialize
  src_pref = window.location.protocol + '//' + window.location.host;
  msg_read = new Array(MSG_QUEUE_SIZE);

  // Send heartbeats
  setInterval(function() {
    if ($('#chatArea').css('visibility') == 'visible') {
      port.emit('heartbeat', true);
    }
  }, 3000);

  // Listen to DOM mutations
  new MutationObserver(function() {
    sendMessage(captureMessage());
  }).observe(document.getElementById('chatArea'), { 'childList': true, 'subtree': true });
}

function captureMessage() {
  username = username || /username=(@\w+)&/.exec($('.header .avatar img').attr('src'))[1];

  var msg = {
    id: '',
    user: {
      name: $('#chatArea .message:last .avatar').attr('title'),
      avatar: src_pref + $('#chatArea .message:last .avatar').attr('src')
    },
    content: {
      text: '',
      image: ''
    },
    selector: $('#chatArea .message:last > .content > .ng-scope[data-cm]').attr('data-cm')
  };

  // Get unique selector
  var json = $.parseJSON(msg.selector);
  msg.id = json.msgId;
  msg.user.isSelf = username === json.actualSender;

  // HACK for issue #18
  if (msg.id.length < 18) return null;

  // Check the message if read
  for (i = 0; i < msg_read.length; i++) {
    if (msg_read[i] === msg.id) return null;
  }

  // Mark as read
  msg_read.shift();
  msg_read.push(msg.id);

  // Handle text message
  if ($('#chatArea .message:last .plain').length) {
    if ($('#chatArea .message:last .plain pre img').length) {
      $('#chatArea .message:last .plain pre img').each(function() {
        if (/^\//.test($(this).attr('src'))) {
          $(this).attr('src', src_pref + $(this).attr('src'));
        }
      });
    }
    if ($('#chatArea .message:last .plain pre img.emoji').length) {
      $('#chatArea .message:last .plain pre img.emoji').each(function() {
        $(this).replaceWith('<img height=24 src="http://cdn.bootcss.com/twemoji/1.2.0/svg/' + /emoji(\w+)/.exec(this.className)[1] + '.svg" />');
      });
    }
    msg.content.text = $('#chatArea .message:last .plain pre').html();

    // HACK for aidistan/browser-weixin-danmu#1
    if (
      /^\[Received a sticker. View on phone\]$/.test(msg.content.text) ||
      /^\[Sent a sticker. View on phone\]$/.test(msg.content.text)
    ) {
      return null;
    }

  // Handle image message
  } else if ($('#chatArea .message:last .picture .msg-img').length &&
  /^\//.test($('#chatArea .message:last .picture .msg-img').attr('src'))) {
    msg.content.img = src_pref + $('#chatArea .message:last .picture .msg-img').attr('src').split('&type=slave')[0];

  // Handle custom_emoji message
  } else if ($('#chatArea .message:last .emoticon .custom_emoji').length) {
    msg.content.img = src_pref + $('#chatArea .message:last .custom_emoji').attr('src');

  // Capture nothing
  } else {
    return null;
  }

  return msg;
}

function sendMessage(msg) {
  if (msg) {
    setTimeout(function() {
      msg.room = $("[data-cm='" + msg.selector + "']").length > 0 ? 'inside' : 'outside';
      port.emit('weixin', msg);
    }, 100);
  }
}
