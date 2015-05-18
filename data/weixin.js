var port = self.port;
var history = new Array(10);
var src_prefix = window.location.protocol + '//' + window.location.host;

// Send heartbeats
setInterval(function() {
  if ($('#chatMainPanel').length > 0) {
    port.emit('heartbeat', true);
  }
}, 3000);

// Listen to DOM mutations
new MutationObserver(function() {
  var i, msg = captureMessage();
  for (i = 0; i < history.length; i++) {
    if (history[i] == msg.id) {
      break;
    }
  }
  if (i == history.length) {
    port.emit('bullet', msg);
    history.shift();
    history.push(msg.id);
  }
}).observe(document.getElementById('chatMainPanel'), { 'childList': true, 'subtree': true });

/*
  An typical message looks like:

  {
    id: '',
    user: { name: '',  avatar: '' },
    time: '',
    content: { text: '', image: '' }
  };
*/
function captureMessage() {
  var text, img;

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
    id: $('.chatItem:last').attr('un'),
    user: {
      name: $('.chatItemContent:last .avatar').attr('title'),
      avatar: src_prefix + $('.chatItemContent:last .avatar').attr('src')
    },
    time: $('.chatItem:last .time').text().trim(),
    content: {
      text: text,
      image: img
    }
  };
  return msg;
}
