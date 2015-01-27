var fontSize = 12;

var danmu = $('.danmu');
if (danmu.length == 0) {
  danmu = $('<div></div>').addClass('danmu').css({
    "position": "fixed",
    "z-index": 10000,
    "overflow": "hidden"
  });
  $('body').append(danmu);
}
danmu.css({
  "width": window.innerWidth,
  "height": window.innerHeight,
  "padding": fontSize
});

self.port.on("fontSize", function(size) {
  fontSize = size;
  danmu.css("padding", fontSize);
});

var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;
self.port.on("bullet", function(msg) {
  console.log(msg);
  bullet = $('<div>' + msg.msg.text + '</div>').addClass('danmu-bullet');

  bullet.hide().appendTo(danmu);
  bullet
    .css({
      'font-size': fontSize,
      'position': 'absolute'
    }).css({
      top: Math.max(0,~~(Math.random() * HEIGHT) - bullet.height()),
      left: WIDTH + bullet.width(),
      color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16),
      width: bullet.width(),
    }).show();
  bullet.animate({
    left: -bullet.width()
  }, ~~(Math.random() * 15) + 15000, 'linear', function() {
    if (-$(this).css('left').slice(0, -2) - 100 <= bullet.width()) {
      $(this).remove();
    }
  });
});
