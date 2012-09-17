function formWithToken(form) {
	if (form.action == '__token__')
		return true;

	for (var key in form.fields)
		if (form.fields[key] == '__token__')
			return true;

	return false;
}

function formLogin(newWindow, form, token) {
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
<%#			&lt;/script&gt; screws everything up after embedding, so split it into multiple lines %>
	html += "cript></body></html>";

	w.document.write(html);
	return w;
}
