cryptobox.form = {};

cryptobox.form.withToken = function(form) {
	if (form.action == '__token__')
		return true;

	for (var key in form.fields)
		if (form.fields[key] == '__token__')
			return true;

	return false;
}

cryptobox.form.login = function(newWindow, form, token) {
	if (form.broken)
		return;

	/* merge in token */
	if (token != undefined) {
		if (form.action == '__token__')
			form.action = token.form.action;

		for (var key in form.fields)
			if (form.fields[key] == '__token__')
				form.fields[key] = token.form.fields[key];
	}

	var w = null;
	if (newWindow) {
		w = window.open(form.action, form.name);
		if (!w)
			return;
	} else {
		w = window;
		document.close();
		document.open();
	}

	var html = "";
	html += "<html><head></head><body><%= @text[:wait_for_login] %><form id='formid' method='" + form.method + "' action='" + form.action + "'>";

	for (var key in form.fields)
		html += "<input type='hidden' name='" + key + "' value='" + form.fields[key] + "'/>";

	html += "</form><script type='text/javascript'>document.getElementById('formid').submit()</s";
//			&lt;/script&gt; screws everything up after embedding, so split it into multiple lines
	html += "cript></body></html>";

	w.document.write(html);
	return w;
}

cryptobox.form.fill = function(form) {
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

cryptobox.form.sitename = function(t) {
	return t.replace(/[^/]+\/\/([^/]+).+/, '$1').replace(/^www./, '');
}

cryptobox.form.toJson = function() {
	var address = document.URL;
	var name = document.title;
	var text = "";

	for (var i = 0; i < document.forms.length; i++) {
		var form = document.forms[i];

		var form_elements =  "";
		for (var j = 0; j < form.elements.length; j++) {
			var el = form.elements[j];

			if (el.name == "")
				continue;

			if (form_elements == "")
				form_elements = '\t\t\t"' + el.name + '": "' + el.value + '"';
			else
				form_elements += ',\n\t\t\t"' + el.name + '": "' + el.value + '"';
		}

		var method = form.method;
		if (method != 'get')
			method = 'post';

		var form_text = '\t\t"action": "' + form.action + '",\n\t\t"method": "' + method + '",\n\t\t"fields":\n\t\t{\n' + form_elements + '\n\t\t}';

		if (text == "")
			text += '[\n';
		else
			text += ',\n';
		text += '{\n\t"name": "' + name + '",\n\t"address": "' + address + '",\n\t"form":\n\t{\n' + form_text + '\n\t}\n}\n';
	}

	if (text)
		text += "]";

	return text;
}
