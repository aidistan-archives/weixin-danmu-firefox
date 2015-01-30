// $(function() {
  var colors = ['#00aeef', '#ea428a', '#f5a70d', '#9962c1', '#333333'];
  var bullet = $('p.banner-title');

  // Setup
  bullet.css({
    width: bullet.children().width(),
    'text-shadow': '0 0 8px #ffffff'
  });
  // Start scrolling
  shoot(bullet);

  function shoot(bullet) {
    // Reset
    bullet.css({
      left: window.window.innerWidth,
      top: 125 + Math.floor(Math.random() * 75),
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    // Animate
    bullet.animate({
        left: -bullet.width()
      }, ~~(Math.random() * 5000) + 10000, 'linear', function() {
        shoot(bullet);
      }
    );
  }


// });
