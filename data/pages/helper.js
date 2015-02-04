(function(){
  $('#join textarea').keypress(function(e) {
    if (e.key == 'Enter') {
      $('#join').addClass('cover').addClass('h');
      $('#join h2').hide();
      $('#join form').replaceWith('<img src="' + $(this).val() + '" /></div>');
    }
  });
}).call(this);
