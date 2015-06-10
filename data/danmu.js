var prefs;

var colors   = [
  '#00aeef', // blue
  '#ea428a', // red
  '#eed500', // yellow
  '#f5a70d', // orange
  '#8bcb30', // green
  '#9962c1', // purple
  '#333333', // black
  '#e8e8e8'  // white
];

var ctlptn = {
  all: RegExp('^[:：]([蓝红黄橙绿紫黑白巨大小顶底])'),
  color: RegExp('^[:：]([蓝红黄橙绿紫黑白])'),
  size: RegExp('^[:：]([巨大小])'),
  position: RegExp('^[:：]([顶底])')
}

var limit = {
  font:  { min: 10, max: window.innerHeight/4 },
  image: { width: window.innerWidth/3, height: window.innerHeight/3 }
}

$(window).resize(function() {
  limit.font.max     = window.innerHeight / 4;
  limit.image.width  = window.innerWidth / 3;
  limit.image.height = window.innerHeight / 3;
});

self.port.on('setup', function(msg) { prefs = msg; });

self.port.on('bullet', function(msg) {
  // Defaults
  var fontSize = prefs.defaultfontSize;
  var color  = colors[Math.floor(Math.random() * colors.length)];
  var top    = 'auto';
  var bottom = 'auto';

  while (ctlptn.all.test(msg.content.text)) {
    // Color controls
    if (ctlptn.color.test(msg.content.text)) {
      switch (ctlptn.color.exec(msg.content.text)[1]) {
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
      msg.content.text = msg.content.text.replace(ctlptn.color, '');
    }

    // Size controls
    if (ctlptn.size.test(msg.content.text)) {
      switch (ctlptn.size.exec(msg.content.text)[1]) {
        case '大':
          fontSize *= 1.5;
          fontSize = (fontSize > limit.font.max) ? limit.font.max : fontSize;
          break;
        case '小':
          fontSize /= 1.5;
          fontSize = (fontSize < limit.font.min) ? limit.font.min : fontSize;
          break;
        case '巨':
          fontSize = limit.font.max;
          break;
      }
      msg.content.text = msg.content.text.replace(ctlptn.size, '');
    }

    // Position controls
    if (ctlptn.position.test(msg.content.text)) {
      if (ctlptn.position.exec(msg.content.text)[1] == '顶') {
        top = 12;
      }
      else {
        bottom = 12;
      }
      msg.content.text = msg.content.text.replace(ctlptn.position, '');
    }
  }

  // Make bullet
  var bullet;
  if (msg.content.image === '') {
    bullet = $('<div>' + msg.content.text.replace(/<img/g, '<img height=' + fontSize) + '</div>');
  }
  else {
    var img = $('<img src="' + msg.content.image + '" />').css({
      'max-width': limit.image.width,
      'max-height': limit.image.height
    });
    bullet = $('<div></div>').append(img);

    // To fix image position issue
    fontSize = limit.image.height;
  }
  if (prefs.showUsername) {
    bullet.prepend($('<span>' + msg.user.name + ' : </span>'));
  }
  bullet.addClass('danmu-bullet').css({
    color: color,
    'font-size': fontSize,
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
