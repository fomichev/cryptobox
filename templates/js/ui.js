cryptobox.ui = {};

cryptobox.ui.copyToClipboard = function(text) {
	var t = '';
	var pathToClippy = 'clippy.swf';

	t += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="110" height="14">';
	t += '<param name="movie" value="' + pathToClippy + '"/>';
	t += '<param name="allowScriptAccess" value="always" />';
	t += '<param name="quality" value="high" />';
	t += '<param name="scale" value="noscale" />';
	t += '<param name="FlashVars" value="text=#' + text + '">';
	t += '<param name="bgcolor" value="#fff">';
	t += '<embed src="' + pathToClippy + '" width="110" height="14" name="clippy" quality="high" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" FlashVars="text=' + text + '" bgcolor="#fff" />';
	t += '</object>';

	return t;
}

cryptobox.ui.addBr = function(text) {
	if (text)
		return text.replace(/\n/g, '<br />');
	else
		return "";
}

cryptobox.ui.init = function(pwd, createPage, createGroup, createEntry) {
	var text = cryptobox.cipher.decrypt(pwd, cryptobox.cfg.pbkdf2.salt, cryptobox.cfg.ciphertext, cryptobox.cfg.pbkdf2.iterations, cryptobox.cfg.aes.iv);
	var data = eval(text);
	var map = {};

	if (data[0].type != "magic" || data[0].value != "270389")
		throw "Wrong magic number";

	map.list = {};
	map.page = {};

	page = {};
	pageGroups = {};

	for (var i = 0; i < data.length; i++) {
		var el = data[i];
		var id = "u_" + i;

		if (el.type == 'magic')
			continue;

		if (el.visible == false)
			continue;

		if (!page[el.type]) {
			page[el.type] = createPage(id, el);
			pageGroups[el.type] = {};
		}

		if (!pageGroups[el.type][el.tag])
			pageGroups[el.type][el.tag] = createGroup(page[el.type], el);


		createEntry(pageGroups[el.type][el.tag], el);
	}
}
