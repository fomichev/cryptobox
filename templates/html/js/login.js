function loginBroken(form) {
	if (form.broken == true)
		return true;

	return false;
}

function withToken(form) {
	var tokens = "";

	if (form.action == '__token__')
		return "__form_action__";

	for (var key in form.fields) {
		var value = form.fields[key];

		if (value == "__token__") {
			if (tokens == "")
				tokens = '"' + key + '"';
			else
				tokens += ', "' + key + '"';
		}
	}

	return tokens;
}

function flattenMap(map) {
	var k = "";
	var v = "";

	for (var key in map) {
		if (map[key] == "__token__")
			continue;

		if (k == "") {
			k = "new Array(\"" + key +"\"";
			v = "new Array(\"" + map[key] +"\"";
		} else {
			k += ", \"" + key +"\"";
			v += ", \"" + map[key] +"\"";
		}
	}
	if (k != "")
		k += ")";

	if (v != "")
		v += ")";

	var r = {};
	r.k = k;
	r.v = v;

	return r;
}

function loginWithTokenData(url, name, keys, values, formJson)
{
	try {
		var data = eval(formJson);
		for (var i = 0; i < data.length; i++) {
			for (var field in data[i].form.fields) {
				if (tokens.indexOf(field) >= 0) {
					keys.push(field);
					values.push(data[i].form.fields[field]);
				}
			}
		}
	} catch(e) {
		return;
	}

	login("post", url, name, keys, values);
}

function login(withNewWindow, method, url, name, keys, values) {
	var newWindow = null;
	if (withNewWindow) {
		var newWindow = window.open(url, name);
		if (!newWindow)
			return false;
	} else {
		newWindow = window;
		document.close();
		document.open();
	}

	var html = "";
	html += "<html><head></head><body><%= @text[:wait_for_login] %><form id='formid' method='" + method + "' action='" + url + "'>";

	if (keys && values && (keys.length == values.length))
		for (var i=0; i < keys.length; i++)
			html += "<input type='hidden' name='" + keys[i] + "' value='" + values[i] + "'/>";
			html += "</form><script type='text/javascript'>document.getElementById('formid').submit()</s";
<%#			&lt;/script&gt; screws everything up after embedding, so split it into multiple lines %>
			html += "cript></body></html>";

	newWindow.document.write(html);
	return newWindow;
}
