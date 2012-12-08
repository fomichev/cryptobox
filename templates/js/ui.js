cryptobox.ui = {};

cryptobox.ui.addBr = function(text) {
	if (text)
		return text.replace(/\n/g, '<br />');
	else
		return "";
}

cryptobox.ui.render = function (name, context) {
	return Cryptobox.measure('render ' + name, function(){
		return Handlebars.templates[name](context);
	});
}

cryptobox.ui.init = function(data) {
	var result = [];
	Cryptobox.measure('ui.init', function(){
	var map = {};

	var pages = {};
	for (var i = 0; i < data.length; i++) {
		var el = data[i];

		if (el.visible == false)
			continue;

		if (!(el.type in pages))
			pages[el.type] = {};

		if (!(el.tag in pages[el.type]))
			pages[el.type][el.tag] = [];

		el.id = i;
		pages[el.type][el.tag].push(el);
	}

	for (var page_key in pages) {
		var p = { id: page_key, name: cryptobox.config.i18n.page[page_key], tag: [] };

		for (var tag_key in pages[page_key])
			p.tag.push({ name: tag_key, item: pages[page_key][tag_key] });

		p.tag.sort(function(a, b) { return a.name > b.name; });

		result.push(p);
	}

	result.sort(function(a, b) { return a.name > b.name; });

	});
	return result;
}
