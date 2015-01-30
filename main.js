$(function() {
  var colors = ['#00aeef', '#ea428a', '#f5a70d', '#9962c1', '#333333'];

  var baseTop = parseInt($('h1.banner-title').css('top').slice(0, -2));
  var rangTop = $('.banner-btnbox').css('top').slice(0, -2) - $('h1.banner-title').css('top').slice(0, -2);

  // Setup
  var bullet = $('p.banner-title');
  bullet.css({
    width: bullet.children().width(),
    'text-shadow': '0 0 8px #ffffff'
  });
  // Start scrolling
  shoot(bullet);

  function shoot(bullet) {
    // Reset
    bullet.css({
      left: window.innerWidth,
      top: (baseTop + Math.floor(Math.random() * rangTop)),
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    // Animate
    bullet.animate({
        left: -bullet.width()
      }, ~~(Math.random() * 15) + 15000, 'linear', function() {
        shoot(bullet);
      }
    );
  }
});
