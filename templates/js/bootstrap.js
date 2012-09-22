/* common functionality shared between chrome extension and desktop html */
cryptobox.bootstrap = {};

cryptobox.bootstrap.collapsible = function(value, copy) {
	return '<div><a href="#" class="collapsible btn btn-mini" data-toggle="button" onClick="javascript:return false;"><%= @text[:button_hide_reveal] %></a>&nbsp;' + copy + '</div><div style="display: none">' + value + '</div>';
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
	$("#intput-generated-password").val(cryptobox.password.generate(
		$("#input-password-length").val(),
		$("#input-include-num").is(":checked"),
		$("#input-include-punc").is(":checked"),
		$("#input-include-uc").is(":checked"),
		$("#input-pronounceable").is(":checked")));
}

cryptobox.bootstrap.lockInit = function(onMove, timeout, lockCallback) {
	cryptobox.lock.startTimeout(onMove, timeout, lockCallback);

	$("#button-lock").click(function(event) {
		event.preventDefault();
		lockCallback();
	});
}

cryptobox.bootstrap.render = function(name, context) {
	$('#content').hide();
	$('#content').html(cryptobox.ui.render(name, context));
	$('#content').fadeIn();
}

$(function() {
	$('.collapsible').live('click', function() {
		event.preventDefault();

		$(this).parent().next().toggle();
	});
});
