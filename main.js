// $(function() {
  var colors = ['#00aeef', '#ea428a', '#f5a70d', '#9962c1', '#333333'];

  start($('.banner-title'));
  start($('.banner-subtitle'));

  function start(obj) {
    // Setup
    obj.css({
      width: obj.children().width(),
      'text-shadow': '0 0 8px #ffffff'
    });
    // Start scrolling
    scroll(obj);
  }

  function scroll(obj) {
    // Reset
    obj.css({
      left: window.window.innerWidth,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    // Animate
    obj.animate({
        left: -obj.width()
      }, ~~(Math.random() * 10000) + 10000, 'linear', function() {
        scroll(obj);
      }
    );
  }


// });
