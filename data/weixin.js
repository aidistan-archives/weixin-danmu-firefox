var port = self.port;
var last = '';

new MutationObserver(function() {
  var msg = captureMessage();
  if (msg.id && msg.id !== last) {
    port.emit('notify', { title: '捕获消息', text: msg.content.text });
    port.emit('bullet', msg);
    last = msg.id;
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
        $(this).attr('src', 'https://wx.qq.com' + $(this).attr('src'));
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
    img = 'https://wx.qq.com' + $('.chatItemContent:last .img_wrap img').attr('rawsrc');
  } else if ($('.chatItemContent:last .customEmoji').length) {
    img = 'https://wx.qq.com' + $('.chatItemContent:last .customEmoji').attr('src');
  } else {
    img = '';
  }

  // Make message
  var msg = {
    id: $('.chatItem:last').attr('un'),
    user: {
      name: $('.chatItemContent:last .avatar').attr('title'),
      avatar: 'https://wx.qq.com' + $('.chatItemContent:last .avatar').attr('src')
    },
    time: $('.chatItem:last .time').text().trim(),
    content: {
      text: text,
      image: img
    }
  };
  return msg;
}
