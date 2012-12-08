/* common functionality shared between chrome extension and desktop html */
cryptobox.bootstrap = {};

cryptobox.bootstrap._collapsible_id = 0;
cryptobox.bootstrap.collapsible = function(value, copy) {
	var id = cryptobox.bootstrap._collapsible_id++;

	return '<button type="button" class="btn btn-mini" data-toggle="collapse" data-target="#collapsible-' + id + '"><%= @text[:button_hide_reveal] %></button>&nbsp;' + copy + '<div id="collapsible-' + id + '" class="collapse">' + value + '</div>';
}

cryptobox.bootstrap.createDetails = function(entry, map) {
	var items = $();
	$.each(map, function(k, v) {
		items = items.add($('<dt>').html(k));
		items = items.add($('<dd>').html(v));
	});

	$('<dl>', { 'class': 'dl-horizontal' }).html(items).appendTo(entry);
}

cryptobox.bootstrap.filterInit = function() {
	$("#input-filter").keyup(function() {
		var text = $("#input-filter").val().toLowerCase();

		if (text == "") {
			$("table").show();
			$("tr").show();
		} else {
			$("table").show();

			$("tr").hide();
			$("tr").filter(function() {
				if ($('td:first', this).text().toLowerCase().indexOf(text) >= 0)
					return true;
				else
					return false;
			}).show();

			$('div.active table').each(function() {
				if ($('tr:visible', this).length == 0)
					$(this).hide();
			});
		}
	});
}

cryptobox.bootstrap.dialogGenerateSubmit = function() {
	$("#intput-generated-password").val(Cryptobox.password.generate(
		$("#input-password-length").val(),
		$("#input-include-num").is(":checked"),
		$("#input-include-punc").is(":checked"),
		$("#input-include-uc").is(":checked"),
		$("#input-pronounceable").is(":checked")));
}

cryptobox.bootstrap.lockInit = function(onMove, timeout, lockCallback) {
	cryptobox.lock = new Cryptobox.Lock(onMove, timeout, lockCallback);
	cryptobox.lock.start();

	$("#button-lock").click(function(event) {
		event.preventDefault();
		lockCallback();
	});
}

cryptobox.bootstrap.render = function(name, context) {
	$('#content').hide();
	$('#content').html(Cryptobox.ui.render(name, context));
	$('#content').fadeIn();
}

cryptobox.bootstrap.showAlert = function(error, text) {
	if (error)
		$('#div-alert').addClass('alert-error');
	else
		$('#div-alert').addClass('alert-info');

	$("#div-alert").html(text);
	$("#div-alert").fadeIn();
}

cryptobox.bootstrap.hideAlert = function() {
	$('#div-alert').removeClass('alert-error');
	$('#div-alert').removeClass('alert-info');
	$("#div-alert").fadeOut();
}
