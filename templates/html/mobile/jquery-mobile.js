function collapsible(name, value) {
	return '<div data-role="collapsible"><h3>' + name + '</h3><p>' + value + '</p></div>';
}

function page(id, header, data) {
	var t = '';

	t += '<div data-role="page" id="' + id + '" class="generated">';
	t += '<div data-role="header">';
	t += '<h1>' + header + '</h1>';
	t += '<a data-rel="back" href="#"><%= @text[:button_back] %></a>';
	t += '<a class="button-lock" href="#" data-icon="delete"><%= @text[:button_lock] %></a>';
	t += '</div>';
	t += '<div data-role="content">';
	t += data;
	t += '</div>';
	t += '</div>';

	return t;
}

function createLogin(id, name, address, form, vars) {
	var flat = flattenMap(form.fields);

	var title = name + " (" + vars.name + ")";
	var t = '';

	if (!loginBroken(form)) {
		if (withToken(form) == "") {
			t += '<a href="#todo" onClick=';
			t += '\'javascript:login(false, "' + form.method + '", "' + form.action + '", "' + name + '", ' + flat.k + ', ' + flat.v + '); return false;\'';
			t += 'data-role="button"><%= @text[:log_in] %></a>';
		}
	}

	t += '<a href="' + address + '" data-role="button"><%= @text[:goto] %></a>';
	t += collapsible("<%= @text[:username] %>", vars.name);
	t += collapsible("<%= @text[:password] %>", vars.password);

	if (vars.secret)
		t += '<p>' + collapsible("<%= @text[:secret] %>", vars.secret) + '</p>';

	if (vars.note)
		t += '<p>' + collapsible("<%= @text[:note] %>", addBr(vars.note)) + '</p>';

	return page(id, title, t);
}

function viewCreatePageEntry(id, type, data) {
	if (type == 'login')
		return createLogin(id, data.name, data.address, data.form, data.vars);
	else {
		if (data.mtext != undefined)
			return page(id, data.name, addBr(data.mtext));
		else
			return page(id, data.name, addBr(data.text));
	}
}

function viewCreateListEntry(id, type, data) {
	return '<li><a href="#' + id + '" class="generated">' + data.name + '</a></li>';
}

function viewWrapPageTag(tag, text) {
	return text;
}

function viewWrapListTag(tag, text) {
	if (tag != '__default__')
		tag = '<li data-role="list-divider">' + tag + '</li>';
	else
		tag = '';

	return tag + text;
}

function viewWrapPage(text) {
	return text;
}

function viewWrapList(text) {
	return '<ul data-role="listview" data-inset="true" data-filter="true">' + text + '</ul>';
}

function lock() {
	$.mobile.changePage("#div-locked", "slideup");

	$("#input-password").focus();
}

$(document).bind("pagebeforehide", function(event, data) {
	try {
		to = data.nextPage[0].id;
		if (to == 'div-locked') {
			lockTimeoutStop();

			$(".generated").remove();
		}
	} catch(e) { }
});

$(document).ready(function() {
	$("#form-unlock").submit(function(event) {
		event.preventDefault();

		try {
			var map = unlock($("#input-password").val());
			$("#input-password").val("");

			var pages_list = '';
			var pages = "";

			for (var key in map.page) {
				var name = key;
				if (cfg.page[key])
					name = cfg.page[key];

				pages_list += '<li><a href="#' + key + '">' + name + '</a></li>'
				pages += page(key, name, map.list[key]);
				pages += map.page[key];
			}

			var main_page = '';
			main_page += '<div data-role="page" id="div-main">';
			main_page += '<div data-role="header">';
			main_page += '<h1><%= @text[:title] %></h1>';
			main_page += '<a data-rel="back" href="#" data-icon="arrow-l"><%= @text[:button_back] %></a>';
			main_page += '<a class="button-lock" href="#" data-icon="delete"><%= @text[:button_lock] %></a>';
			main_page += '</div>';
			main_page += '<div data-role="content">';
			main_page += '<ul id="ul-pages-list" data-role="listview" data-inset="true"></ul>';
			main_page += '</div>';
			main_page += '</div>';
			$("#div-main").remove();
			$("body").append(main_page);

			$("#ul-pages-list").html(pages_list);
			$("body").append(pages);
			$(".button-lock").click(function () { lock(); });

			lockTimeoutStart();

			$.mobile.changePage("#div-main");
		} catch(e) {
			alert("<%= @text[:incorrect_password] %> " + e);
			return;
		}
	});

	$("#input-password").focus();
});
