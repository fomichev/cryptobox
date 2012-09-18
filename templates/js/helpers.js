/*
Handlebars.registerHelper('nl2br', function(text) {
	var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
	return new Handlebars.SafeString(nl2br);
});
*/

Handlebars.registerHelper('stringify', function(obj) {
	return JSON.stringify(obj);
});

Handlebars.registerHelper("each_key_value", function(obj, options) {
	var buffer = "";

	for (var key in obj)
		if (obj.hasOwnProperty(key))
			buffer += options.fn({key: key, value: obj[key]});

return buffer;
});

Handlebars.registerHelper('if_eq', function(context, options) {
	if (context == options.hash.to)
		return options.fn(this);
	return options.inverse(this);
});
