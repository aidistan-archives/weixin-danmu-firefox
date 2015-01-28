var fontSize = 12;

var danmu = $('#weixin-danmu');
if (danmu.length == 0) {
  danmu = $('<div></div>').attr('id', 'weixin-danmu').css({
    "position": "fixed",
    "z-index": 10000,
    "overflow": "hidden"
  }).appendTo($('body'));
}
refresh();

self.port.on('bullet', shootMessage);
self.port.on("fontSize", function(size) {
  fontSize = size;
  refresh();
});

function refresh() {
  danmu.css({
    "width": window.innerWidth,
    "height": window.innerHeight,
    "padding": fontSize * 2
  });
}

function shootMessage(msg) {
  var bullet = $('<div>' + msg.content.text + '</div>');
  var win_width  = window.innerWidth;
  var win_height = window.innerHeight;

  bullet.hide().appendTo(danmu);
  bullet.css({
      'font-size': fontSize,
      position: 'absolute',
      top: Math.max(0,~~(Math.random() * win_height) - bullet.height()),
      left: win_width,
      color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16)
    }).show();
  bullet.animate({
    left: -bullet.width()
  }, ~~(Math.random() * 15) + 15000, 'linear', function() {
    if (-$(this).css('left').slice(0, -2) - 100 <= bullet.width()) {
      $(this).remove();
    }
  });
  console.log('已发射弹幕：' + bullet.html());
}
