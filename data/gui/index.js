(function(){
  $('#join input').keypress(function(e) {
    if (e.key == 'Enter') {
      $('#join form').replaceWith('<img height=500 src="' + $('#join input').val() + '"/>');
    }
  });
}).call(this);
