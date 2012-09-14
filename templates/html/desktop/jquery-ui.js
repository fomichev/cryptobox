function accordionItem(header, body) {
	return '<h3><a href="#">' + header + '</a></h3><div>' + body + '</div>';
}

function createLogin(id, name, address, form) {
	var hocid = 0;
	function collapsible(name, value, cp) {
		var copy = '';
		if (cp)
			copy = copyToClipboard(value);

		return '<div class="expand"><span style="float:left;" class="ui-icon ui-icon-circlesmall-plus"></span><a href="#" onClick="javascript:return false;"><strong>' + name + '</strong></a>&nbsp;' + copy + '</div><div>' + value + '</div>';
	}

	var title = name + " (" + form.vars.user + ")"

	var r = "";

	if (!loginBroken(form)) {
		var flat = flattenMap(form.fields);

		var token = withToken(form);
		if (token != "") {
			r += '<a class="button-bookmark" href="' + address + '" target="_blank"><%= @text[:get_token] %></a>';
			r += '<a class="button-login" href="#" onClick=\'javascript:loginWithToken(true, "' + form.action + '", "' + name + '", ' + flat.k + ', ' + flat.v + ', new Array(' + token + ')); return false;\'><%= @text[:log_in] %></a>';
		} else {
			r += '<a class="button-login" href="#" onClick=\'javascript:login(true, "' + form.method + '", "' + form.action + '", "' + name + '", ' + flat.k + ', ' + flat.v + '); return false;\'><%= @text[:log_in] %></a>';
		}
	}

	r += '<a class="button-goto" href="' + address + '" target="_blank"><%= @text[:goto] %></a>';
	r += '<p>' + collapsible("<%= @text[:username] %>", form.vars.user, true) + '</p>';
	r += '<p>' + collapsible("<%= @text[:password] %>", form.vars.pass, true) + '</p>';

	if (form.vars.secret)
		r += '<p>' + collapsible("<%= @text[:secret] %>", form.vars.secret, false) + '</p>';

	if (form.vars.note)
		r += '<p>' + collapsible("<%= @text[:note] %>", addBr(form.vars.note), false) + '</p>';

	return accordionItem(title, r);
}

function viewCreatePageEntry(id, type, data) {
	if (type == 'login')
		return createLogin(id, data.name, data.address, data.form);
	else
		return accordionItem(data.name, addBr(data.text));
}

function viewCreateListEntry(id, type, data) {
	return "";
}

function viewWrapPageTag(tag, text) {
	if (tag != '__default__')
		tag = '<h4 class="tag-header">' + tag + '</h4>';
	else
		tag = '';

	return tag + '<div class="generated"><div class="accordion">' + text + '</div></div>';
}

function viewWrapListTag(tag, text) {
	return text;
}

function viewWrapPage(text) {
	return text;
}

function viewWrapList(text) {
	return text;
}

function lock() {
	lockTimeoutStop();

	if ($("#div-locked").is(":visible") && $("#div-unlocked").is(":visible")) {
		$("#div-generate").hide();
		$("#div-token").hide();
		$("#div-unlocked").hide();
	} else {
		$("#div-generate").dialog('close');
		$("#div-token").dialog('close');

		$("#div-locked").fadeIn();
		$("#div-unlocked").hide();
	}

	$(".generated").remove();
	$("#tabs").html('');
	$("#tabs").removeClass();

	$("#input-password").focus();
}

function dialogGenerateSubmit() {
	$("#intput-generated-password").val(generatePassword(
		$("#input-password-length").val(),
		$("#input-include-num").is(":checked"),
		$("#input-include-punc").is(":checked"),
		$("#input-include-uc").is(":checked"),
		$("#input-pronounceable").is(":checked")));
}

function dialogLoginSubmit(url, name, keys, values, tokens) {
	var formJson = $("#input-json").val();

	if (!formJson || formJson == "")
		return;

	$("#input-json").val("");
	$("#div-token").dialog('close');

	loginWithTokenData(url, name, keys, values, formJson);
}

function loginWithToken(url, name, keys, values, tokens) {
	$("#div-token").dialog({
		height: 140,
		width: 280,
		modal: true,
		buttons: {
			"Login": function() { dialogLoginSubmit(url, name, keys, values, tokens); },
			"Cancel": function() { $(this).dialog('close'); }
		}
	});

	$("#div-token").keydown(function(event) {
		if (event.keyCode == $.ui.keyCode.ENTER) {
			dialogLoginSubmit(url, name, keys, values, tokens);
		}
	});
}

$(document).ready(function() {
	lock();

	$(".button").button();

	$("#button-unlock").button({ icons: { primary: "ui-icon-unlocked" } });
	$("#button-lock").button({ icons: { primary: "ui-icon-locked" } });
	$("#button-generate-show").button({ icons: { primary: "ui-icon-gear" } });

	$("#form-unlock").submit(function(event) {
		event.preventDefault();
		try {
			var map = unlock($("#input-password").val());
			$("#input-password").val("");

			var tabs_list = '';
			var tabs = "";
			for (var key in map.page) {
				var name = key;
				if (cfg.page[key])
					name = cfg.page[key];

				tabs_list += '<li><a href="#div-' + key + '">' + name + '</a></li>';
				tabs += '<div id="div-' + key +'" class="generated">' + map.page[key] + '</div>';
			}

			$("#div-tabs").html('<div id="tabs"><ul class="generated">' + tabs_list + '</ul>' + tabs + '</div>');

			$(".button").button();
			$(".accordion").accordion({
				autoHeight: false,
				navigation: false,
				active: false,
				/* animated: false, */
				collapsible: true
			});
			$('.expand').click(function() {
				event.preventDefault();

				$(this).children().toggleClass('ui-icon-circlesmall-plus ui-icon-circlesmall-minus');
				$(this).next().toggle();
			}).next().hide();

			$("#tabs").tabs();
			$("#tabs").tabs('select', 0);

			$(".button-bookmark").button({ icons: { primary: "ui-icon-contact" } });
			$(".button-goto").button({ icons: { primary: "ui-icon-newwin" } });
			$(".button-login").button({ icons: { primary: "ui-icon-key" } });

			lockTimeoutStart();

			$("#div-locked").hide();
			$("#div-unlocked").fadeIn();

			$("#input-filter").focus();
		} catch(e) {
			alert("<%= @text[:incorrect_password] %> " + e);
			return;
		}
	});

	$("body").mousemove(function() { lockTimeoutUpdate(); });

	$("#button-lock").click(function(event) {
		event.preventDefault();
		lock();
	});

	$("#button-generate-show").click(function(event) {
		event.preventDefault();
		$("#div-generate").dialog({
			resizable: false,
			buttons: {
				"Generate": function() { dialogGenerateSubmit(); },
				"Cancel": function() { $(this).dialog('close'); }
			}
		});
		$("#div-generate").keydown(function(event) {
			if (event.keyCode == $.ui.keyCode.ENTER) {
				dialogGenerateSubmit();
			}
		});
	});

	$("#input-pronounceable").click(function() {
		if ($("#input-pronounceable").is(":checked")) {
			$("#input-include-num").attr("disabled", true);
			$("#input-include-punc").attr("disabled", true);
		} else {
			$("#input-include-num").removeAttr("disabled");
			$("#input-include-punc").removeAttr("disabled");
		}
	});

	$("#input-filter").keyup(function() {
		var text = $("#input-filter").val().toLowerCase();

		if (text == "") {
			$("h3.ui-accordion-header").show();
			$("h4.tag-header").show();
		} else {
			$(".accordion").accordion('activate', false);
			$("h3.ui-accordion-header").hide();
			$("h4.tag-header").hide();
			$("h3.ui-accordion-header").filter(function() {
				if ($('a', this).html().toLowerCase().indexOf(text) >= 0)
					return true;
				else
					return false;
			}).show();
		}
	});
});
