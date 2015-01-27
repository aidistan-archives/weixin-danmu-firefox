var port = self.port;
var last_msg = {
  id: '',
  user: {
    name: '',
    avatar: ''
  },
  time: '',
  msg: {
    text: '',
    image: ''
  }
};

function takeMsg() {
  if ($('.chatItemContent:last pre img').length) { //微信发带表情的内容
    $('.chatItemContent:last pre img').each(function() {
      var src = $(this).attr('src');
      $(this).attr('src', 'https://wx.qq.com' + src);
    });
    var text = $('.chatItemContent:last pre').html();
  } else {
    var text = $('.chatItemContent:last pre').text();
  }
  if ($('.chatItemContent:last .img_wrap img').length) { //微信发照片
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
    msg: {
      text: text,
      image: img
    }
  };
  return msg;
}

$('body').bind("DOMNodeInserted", function() {
  // console.log('尝试提取消息...');
  var msg = takeMsg();
  if (msg.id && msg.id !== last_msg.id) {
    console.log('消息提取成功');
    port.emit('bullet', msg);
    last_msg = msg;
  }
});
