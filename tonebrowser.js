$.getJSON('tones/tones.json', function(data) {
	console.log(data)


	var items = [];
 
  $.each(data, function(key, val) {
	      items.push('<a href="#" class="list-group-item active">' + key + '</a>');
	        });
   
    $('<ul/>', {
	        'class': 'my-new-list',
	        html: items.join('')
	      }).appendTo('#gamelist');
});
