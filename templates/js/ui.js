cryptobox.ui = {};

cryptobox.ui.addBr = function(text) {
	if (text)
		return text.replace(/\n/g, '<br />');
	else
		return "";
}

cryptobox.ui.measure = function(name, fn) {
//	var begin = Date.now(), end;
	var result = fn();
//	end = Date.now();
//	console.log(name + ' ' + (end - begin) + 'ms');
	return result;
}

cryptobox.ui.render = function (name, context) {
	return cryptobox.ui.measure('render ' + name, function(){
		return Handlebars.templates[name](context);
	});
}

cryptobox.ui.init = function(pwd) {
	var result = [];
	cryptobox.ui.measure('decrypt', function(){
	var text = cryptobox.cipher.decrypt(pwd, cryptobox.cfg.pbkdf2.salt, cryptobox.cfg.ciphertext, cryptobox.cfg.pbkdf2.iterations, cryptobox.cfg.aes.keylen, cryptobox.cfg.aes.iv);
	var data = $.parseJSON(text);
	var map = {};

	if (data[0].type != "magic" || data[0].value != "270389")
		throw "Wrong magic number";

	var pages = {};
	for (var i = 0; i < data.length; i++) {
		var el = data[i];

		if (el.type == 'magic')
			continue;

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
		var p = { id: page_key, name: cryptobox.cfg.page[page_key], tag: [] };

		for (var tag_key in pages[page_key])
			p.tag.push({ name: tag_key, item: pages[page_key][tag_key] });

		result.push(p);
	}

	});
	return result;
}
