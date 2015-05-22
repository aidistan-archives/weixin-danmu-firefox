(function(){
  $('#join textarea').keypress(function(e) {
    if (e.key == 'Enter') {
      $('#join textarea').replaceWith('<img src="' + $(this).val() + '" height=500 /></div>');
    }
  });

  $('#thanks div').children().each(function(){ $(this).hide(); });
  $('#thanks div h2').show();
  $('#thanks div h2 a').click(function() {
    $('#thanks').removeClass('shout');
    $('#thanks h2').html($('#thanks h2').text());
    $('#thanks div').children().each(function(){ $(this).show(); });
    return false; // Stop bubbling
  });
}).call(this);
