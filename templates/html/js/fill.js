function sitename(t) {
	return t.replace(/[^/]+\/\/([^/]+).+/, '$1').replace(/^www./, '');
}

function formToLink(name, vars, form) {
	var divStyle = 'style="border: 0 none; border-radius: 6px; background-color: #111; padding: 10px; margin: 5px; text-align: left;"';
	var aStyle = 'style="color: #fff; font-size: 18px; text-decoration: none;"';

	return '<div ' + divStyle + '><a ' + aStyle + ' href="#" onClick=\'javascript:' +
		'formFill(' + JSON.stringify(form) + ');' +
		'return false;\'>' + vars.username + '</a></div>';
}

function formFill(form) {
	var nodes = document.querySelectorAll("input[type=text], input[type=password]");
	for (var i = 0; i < nodes.length; i++) {
		var value = null;

		for (var field in form.fields)
			if (field == nodes[i].attributes['name'].value)
				value = form.fields[field];

		if (value)
			nodes[i].value = value;
	}
}
