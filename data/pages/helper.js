(function(){
  $('#join textarea').keypress(function(e) {
    if (e.key == 'Enter') {
      $('#join').addClass('cover').addClass('h');
      $('#join h2').hide();
      $('#join form').replaceWith('<img src="' + $(this).val() + '" /></div>');
    }
  });

  $('#thanks div').children().each(function(){ $(this).hide(); });
  $('#thanks div h2').show();
  $('#thanks a').click(function() {
    $('#thanks').removeClass('shout');
    $('#thanks h2').html($('#thanks h2').text());
    $('#thanks div').children().each(function(){ $(this).show(); });
    return false; // Stop bubbling
  });
}).call(this);
