$(function(){
  var slides = $('section.slide');
  var slide = { no: 0, max: slides.size() - 1 }

  resizeSlide();
  $(window).scrollTop(0).resize(resizeSlide);

  $('body').click(function() {
    slideUp();
  }).on('wheel', function(e) {
    e.originalEvent.deltaY > 0 ? slideUp(): slideDown();
    return false;
  })

  var Hammer = $.AMUI.Hammer;
  var hammertime = new Hammer(document.getElementById('main'));
  hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  hammertime.on('swipeup', slideUp).on('swipedown', slideDown);

  function resizeSlide() {
    ($('section.slide')).css({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  function slideUp() {
    if (slide.no < slide.max) {
      $(window).smoothScroll({
        position: $(slides[++slide.no]).position().top
      });
    } else {
      slides.fadeOut(slideOver);
    }
  }

  function slideDown() {
    if (slide.no > 0) {
      $(window).smoothScroll({
        position: $(slides[--slide.no]).position().top
      });
    }
  }

  function slideOver() {
    location.href = 'index.html'
  }
});
