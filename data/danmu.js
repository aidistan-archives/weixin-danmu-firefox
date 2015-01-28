var fontSize = 12;

self.port.on('bullet', shootMessage);
self.port.on("fontSize", function(size) { fontSize = size; });

if ($('body').length == 0) {
  alert('非HTML标签页无法显示弹幕...');
}

function shootMessage(msg) {
  var bullet = $('<div>' + msg.content.text + '</div>');
  bullet.addClass('danmu-bullet').css({
    'font-size': fontSize,
    position: 'fixed',
    top: Math.max(0,~~(Math.random() * window.innerHeight) - bullet.height()),
    left: window.innerWidth,
    color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16)
  }).prependTo($('body'));
  bullet.animate({
      left: -bullet.width()
    }, ~~(Math.random() * 15) + 15000, 'linear', function() {
      if (-$(this).css('left').slice(0, -2) - 100 <= bullet.width()) {
        $(this).remove();
      }
    }
  );
  console.log('发射弹幕：' + bullet.html());
}
