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

  if ($('.chatItemContent:last pre img').length) { // Text msg with Emoji
    $('.chatItemContent:last pre img').each(function() {
      var src = $(this).attr('src');
      $(this).attr('src', 'https://wx.qq.com' + src);
    });
    text = $('.chatItemContent:last pre').html();
  } else {
    text = $('.chatItemContent:last pre').text();
  }
  if ($('.chatItemContent:last .img_wrap img').length) { // Image msg
    img = 'https://wx.qq.com' + $('.chatItemContent:last .img_wrap img').attr('src');
  } else if ($('.chatItemContent:last .customEmoji').length) {
    img = 'https://wx.qq.com' + $('.chatItemContent:last .customEmoji').attr('src');
  } else {
    img = '';
  }

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
