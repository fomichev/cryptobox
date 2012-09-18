/* common functionality shared between chrome extension and desktop html */
cryptobox.bootstrap = {};

cryptobox.bootstrap.createPage = function(id, el) {
	if (cryptobox.cfg.page[el.name])
		el.name = cryptobox.cfg.page[el.name];

	$('<li>', { 'class': 'generated' }).html(
		$('<a>', { 'href': '#' + id, 'data-toggle': 'tab' }).text(el.name)
	).appendTo('#ul-nav');

	$('<div>', { 'id': id, 'class': 'tab-pane fade generated' }
	).appendTo('#div-tabs div.tab-content');

	return $('div#' + id);
}

cryptobox.bootstrap.createGroup = function(page, el) {
	$('<table>', { 'class': 'table table-hover' }).html(function() {
		if (el.tag != undefined || el.tag == '')
			return $('<caption>').text(el.tag).after($('<tbody>'))
		else
			return $('<tbody>')

	}).appendTo(page);

	return $('div.tab-pane table.table:last tbody');
}

cryptobox.bootstrap.createEntry = function(group, el, headerClickCallback, detailsClickCallback) {
	$('<tr>').
		append($('<td>').html(function() {
			if (el.type == 'login') {
				return $('<a>', { 'href': '#' }).text(el.name + ' (' + el.form.vars.user + ')').click(
					function() { headerClickCallback(el); });
			} else {
				return el.name;
			}
		})).
		append($('<td>').html(
			$('<button>', { 'class': 'btn btn-mini btn-primary pull-right', 'type': 'button' }
			).text('<%= @text[:button_details] %>').
			click(function() { detailsClickCallback(el); })
		)
	).appendTo(group);
}

cryptobox.bootstrap.filterInit = function() {
	$("#input-filter").keyup(function() {
		var text = $("#input-filter").val().toLowerCase();

		if (text == "") {
			$("table caption").show();
			$("tr").show();
		} else {
			$("table caption").hide();

			$("tr").hide();
			$("tr").filter(function() {
				if ($('td:first', this).text().toLowerCase().indexOf(text) >= 0)
					return true;
				else
					return false;
			}).show();
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

cryptobox.bootstrap.lockInit = function(onMove) {
	$("body").mousemove(onMove);

	$("#button-lock").click(function(event) {
		event.preventDefault();
		lock();
	});
}
