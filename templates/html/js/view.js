function copyToClipboard(text) {
	var t = '';
	var pathToClippy = 'clippy.swf';

	t += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="110" height="14">';
	t += '<param name="movie" value="' + pathToClippy + '"/>';
	t += '<param name="allowScriptAccess" value="always" />';
	t += '<param name="quality" value="high" />';
	t += '<param name="scale" value="noscale" />';
	t += '<param NAME="FlashVars" value="text=#' + text + '">';
	t += '<param name="bgcolor" value="#fff">';
	t += '<embed src="' + pathToClippy + '" width="110" height="14" name="clippy" quality="high" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" FlashVars="text=' + text + '" bgcolor="#fff" />';
	t += '</object>';

	return t;
}

function addBr(text) {
	if (text)
		return text.replace(/\n/g, '<br />');
	else
		return "";
}

function unlock(pwd) {
	var text = decrypt(pwd, cfg.pbkdf2.salt, cfg.ciphertext, cfg.pbkdf2.iterations, cfg.aes.iv);
	var data = eval(text);
	var map = {};

	if (data[0].type != "magic" || data[0].value != "270389")
		throw "Wrong magic number";

	map.list = {};
	map.page = {};

	for (var i = 0; i < data.length; i++) {
		var el = data[i];
		var id = "u_" + i;

		if (el.type == 'magic')
			continue;

		if (el.visible == false)
			continue;

		if (!map.list[el.type]) {
			map.list[el.type] = {};
			map.page[el.type] = {};
		}
		if (map.list[el.type][el.tag] == undefined) {
			map.list[el.type][el.tag] = "";
			map.page[el.type][el.tag] = "";
		}

		map.list[el.type][el.tag] += viewCreateListEntry(id, el.type, el);
		map.page[el.type][el.tag] += viewCreatePageEntry(id, el.type, el);
	}

	for (var page in map.page) {
		var text = "";
		var list = "";

		var tags = new Array();
		for (tag in map.page[page])
			if (tag != '__default__')
			     tags.push(tag);
		tags.sort();

		if (map.page[page]['__default__'] != undefined) {
		     text += viewWrapPageTag('__default__', map.page[page]['__default__']);
		     list += viewWrapListTag('__default__', map.list[page]['__default__']);
		}

		for (var i = 0; i < tags.length; i++) {
		     text += viewWrapPageTag(tags[i], map.page[page][tags[i]]);
		     list += viewWrapListTag(tags[i], map.list[page][tags[i]]);
		}

		map.page[page] = viewWrapPage(text);
		map.list[page] = viewWrapList(list);
	}

	return map;
}
