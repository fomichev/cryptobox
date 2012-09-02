function showPopover(width, height, node) {
	var popover = document.createElement('div');
	document.body.appendChild(popover);
	popover.style.position = 'absolute';
	popover.style.zIndex = 99999;
	popover.style.top = 0;
	popover.style.left = 0;
	popover.style.width = width;
	popover.style.height = height;

	var paddingDiv = document.createElement('div');
	popover.appendChild(paddingDiv);

	paddingDiv.style.paddingTop = '20px';
	paddingDiv.style.paddingLeft = '20px';
	paddingDiv.style.paddingRight = '40px';
	paddingDiv.style.paddingBottom = '20px';

	var bg = document.createElement('div');
	paddingDiv.appendChild(bg);

	bg.style.color = '#fff';
	bg.style.background = '#000';
	bg.style.opacity = 0.8;
	bg.style.width = '100%';
	bg.style.height = '100%';
	bg.style.padding = '10px';
	bg.style.border = '0 none';
	bg.style.borderRadius = '6px';
	bg.style.boxShadow = '0 0 8px rgba(0,0,0,.8)';

	bg.appendChild(node);

	popover.onclick = function(e) { e.stopPropagation(); }
	document.body.onclick = function() { popover.parentNode.removeChild(popover); }
}

function getFormsJson() {
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

		var form_text = '\t\t"action": "' + form.action + '",\n\t\t"method": "' + form.method + '",\n\t\t"fields":\n\t\t{\n' + form_elements + '\n\t\t}';

		if (text == "")
			text += '[\n';
		else
			text += ',\n';
		text += '{\n\t"type":"login",\n\t"name": "' + name + '",\n\t"address": "' + address + '",\n\t"form":\n\t{\n' + form_text + '\n\t}\n}\n';
	}

	if (text)
		text += "]";

	return text;
}
