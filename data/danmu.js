/*
  blue: '#00aeef',
  red: '#ea428a',
  yellow: '#eed500',
  orange: '#f5a70d',
  green: '#8bcb30',
  purple: '#9962c1',
  black: '#333333'
*/
var colors = ['#00aeef', '#ea428a', '#eed500', '#f5a70d', '#8bcb30', '#9962c1', '#333333'];
var fontSize = 12;
var colorCtl = RegExp("^:([蓝红黄橙绿紫黑])");

self.port.on('bullet',function(msg) {
  shoot(make(msg));
});

self.port.on("fontSize", function(size) {
  fontSize = size;
});

if ($('body').length == 0) {
  alert('非HTML标签页无法显示弹幕...');
}

function make(msg) {
  var color = colors[Math.floor(Math.random() * colors.length)];
  if (colorCtl.test(msg.content.text)) {
    switch (colorCtl.exec(msg.content.text)[1]) {
      case '蓝':
        color = '#00aeef';
        break;
      case '红':
        color = '#ea428a';
        break;
      case '黄':
        color = '#eed500';
        break;
      case '橙':
        color = '#f5a70d';
        break;
      case '绿':
        color = '#8bcb30';
        break;
      case '紫':
        color = '#9962c1';
        break;
      case '黑':
        color = '#333333';
        break;
    }
    msg.content.text = msg.content.text.replace(colorCtl, '');
  }

  var bullet = $('<div>' + msg.content.text + '</div>').addClass('danmu-bullet').css({
    'font-size': fontSize,
    'font-weight': 'bold',
    color: color
  });
  return bullet;
}

function shoot(bullet) {
  bullet.hide().prependTo($('body')); // Insert to get proper width
  bullet.css({
    'z-index': 10000,
    display: 'block',
    position: 'fixed',
    top: Math.max(0,~~(Math.random() * window.innerHeight) - bullet.height()),
    left: window.innerWidth,
    width: bullet.width()
  }).show();
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
