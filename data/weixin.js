var port = self.port;
var last = '';

$('body').bind('DOMNodeInserted', function() {
  var msg = captureMessage();
  if (msg.id && msg.id !== last) {
    console.log('捕获消息[' + msg.id + ']');
    port.emit('bullet', msg);
    last = msg.id;
  }
});

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
  if ($('.chatItemContent:last pre img').length) { // 带表情的文本消息
    $('.chatItemContent:last pre img').each(function() {
      var src = $(this).attr('src');
      $(this).attr('src', 'https://wx.qq.com' + src);
    });
    var text = $('.chatItemContent:last pre').html();
  } else {
    var text = $('.chatItemContent:last pre').text();
  }
  if ($('.chatItemContent:last .img_wrap img').length) { // 图片消息（照片）
    var img = 'https://wx.qq.com' + $('.chatItemContent:last .img_wrap img').attr('src');
  } else if ($('.chatItemContent:last .customEmoji').length) {
    var img = 'https://wx.qq.com' + $('.chatItemContent:last .customEmoji').attr('src');
  } else {
    var img = '';
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
