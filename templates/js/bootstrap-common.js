/* common functionality shared between chrome extension and desktop html */

function uiCreatePage(id, el) {
	if (cfg.page[el.name])
		el.name = cfg.page[el.name];

	$('<li>', { 'class': 'generated' }).html(
		$('<a>', { 'href': '#' + id, 'data-toggle': 'tab' }).text(el.name)
	).appendTo('#ul-nav');

	$('<div>', { 'id': id, 'class': 'tab-pane fade generated' }
	).appendTo('#div-tabs div.tab-content');

	return $('div#' + id);
}

function uiCreateGroup(page, el) {
	$('<table>', { 'class': 'table table-hover' }).html(function() {
		if (el.tag != undefined || el.tag == '')
			return $('<caption>').text(el.tag).after($('<tbody>'))
		else
			return $('<tbody>')

	}).appendTo(page);

	return $('div.tab-pane table.table:last tbody');
}

function uiCreateEntry(group, el) {
	$('<tr>').
		append($('<td>').html(function() {
			if (el.type == 'login') {
				return $('<a>', { 'href': '#' }).text(el.name + ' (' + el.form.vars.user + ')').click(
					function() { __headerClick(el); });
			} else {
				return el.name;
			}
		})).
		append($('<td>').html(
			$('<button>', { 'class': 'btn btn-mini btn-primary pull-right', 'type': 'button' }
			).text('<%= @text[:button_details] %>').
			click(function() { __detailsClick(el); })
		)
	).appendTo(group);
}

function filterInit() {
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
