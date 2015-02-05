var port = self.port;
var fontSize = { min: 10, ref: 24, max: window.innerHeight / 4 };
var imageSize = { width: window.innerWidth/3, height: window.innerHeight/3 };
/*
  Predefined colors

  blue: '#00aeef',
  red: '#ea428a',
  yellow: '#eed500',
  orange: '#f5a70d',
  green: '#8bcb30',
  purple: '#9962c1',
  black: '#333333'
  white: '#eeeeee'
*/
var allCtlPtns   = RegExp('^:([蓝红黄橙绿紫黑白巨大小顶底])');
var fontColors   = ['#00aeef', '#ea428a', '#eed500', '#f5a70d', '#8bcb30', '#9962c1', '#333333', '#eeeeee'];
var fontColorCtl = RegExp('^:([蓝红黄橙绿紫黑白])');
var fontSizeCtl  = RegExp('^:([巨大小])');
var positionCtl  = RegExp('^:([顶底])');

port.on('fontSize', function(size) {
  fontSize.ref = size;
});

port.on('bullet', function(msg) {
  // Defaults
  var size   = fontSize.ref;
  var color  = fontColors[Math.floor(Math.random() * fontColors.length)];
  var top    = 'auto';
  var bottom = 'auto';

  while (allCtlPtns.test(msg.content.text)) {
    // Color controls
    if (fontColorCtl.test(msg.content.text)) {
      switch (fontColorCtl.exec(msg.content.text)[1]) {
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
        case '白':
          color = '#eeeeee';
          break;
      }
      msg.content.text = msg.content.text.replace(fontColorCtl, '');
    }

    // Size controls
    if (fontSizeCtl.test(msg.content.text)) {
      switch (fontSizeCtl.exec(msg.content.text)[1]) {
        case '大':
          size *= 1.5;
          size = (size > fontSize.max) ? fontSize.max : size;
          break;
        case '小':
          size /= 1.5;
          size = (size < fontSize.min) ? fontSize.min : size;
          break;
        case '巨':
          size = fontSize.max;
          break;
      }
      msg.content.text = msg.content.text.replace(fontSizeCtl, '');
    }

    // Position controls
    if (positionCtl.test(msg.content.text)) {
      if (positionCtl.exec(msg.content.text)[1] == '顶') {
        top = 12;
      }
      else {
        bottom = 12;
      }
      msg.content.text = msg.content.text.replace(positionCtl, '');
    }
  }

  // Make bullet
  var bullet;
  if (msg.content.image === '') {
    bullet = $('<div>' + msg.content.text.replace(/<img/g, '<img height=' + size) + '</div>');
  }
  else {
    var img = $('<img src="' + msg.content.image + '" />').css({
      'max-width': imageSize.width,
      'max-height': imageSize.height
    });
    bullet = $('<div></div>').append(img);
  }
  bullet.addClass('danmu-bullet').css({
    color: color,
    'font-size': size,
    'font-weight': 'bold',
    'white-space': 'nowrap',
    'overflow-y': 'visible'
  });

  // Insert first to get proper width and height
  var fullElement = document.mozFullScreenElement;
  bullet.hide().appendTo(fullElement ? $(fullElement) : $('body'));
  if (top == 'auto' && bottom == 'auto') {
    top = ~~(Math.random() * (window.innerHeight - bullet.height()));
  }

  // Place at the right place
  bullet.css({
    'z-index': 10000,
    display: 'block',
    position: 'fixed',
    top: top,
    bottom: bottom,
    left: window.innerWidth,
    width: bullet.width()
  }).show();

  // Fire the animation
  bullet.animate({
      left: -bullet.width()
    }, ~~(Math.random() * 15) + 15000, 'linear', function() {
      if (-$(this).css('left').slice(0, -2) - 100 <= bullet.width()) {
        $(this).remove();
      }
    }
  );
});
