(function() {

  window.Cryptobox = {};

  window.cryptobox = {};

  window.Cryptobox.json = null;

  window.p = function(s) {
    return typeof console !== "undefined" && console !== null ? console.log(s) : void 0;
  };

  window.dbg = function(s) {};

  window.Cryptobox.measure = function(name, fn) {
    var begin, end, result;
    begin = Date.now();
    result = fn();
    end = Date.now();
    p("" + name + " " + (end - begin) + "ms");
    return result;
  };

  window.Cryptobox.decrypt = function(pass, salt, ciphertext, iterations, keylen, iv) {
    var result, secret;
    secret = CryptoJS.PBKDF2(pass, CryptoJS.enc.Base64.parse(salt), {
      keySize: keylen / 32,
      iterations: iterations
    });
    result = CryptoJS.AES.decrypt(ciphertext, secret, {
      mode: CryptoJS.mode.CBC,
      iv: CryptoJS.enc.Base64.parse(iv),
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString(CryptoJS.enc.Utf8);
  };

  window.Cryptobox.open = function(password, callback) {
    var decrypt;
    decrypt = function(json, callback) {
      return setTimeout(function() {
        var data;
        try {
          data = Cryptobox.measure('decrypt', function() {
            return JSON.parse(Cryptobox.decrypt(password, json.pbkdf2.salt, json.ciphertext, json.pbkdf2.iterations, json.aes.keylen, json.aes.iv));
          });
          return callback(data, null);
        } catch (e) {
          return callback(null, "<%= @text[:incorrect_password] %> " + e);
        }
      }, 10);
    };
    if (Cryptobox.json) {
      return decrypt(Cryptobox.json, callback);
    } else {
      return cryptobox.dropbox.read(function(error, data) {
        if (error) {
          callback(null, "Can't read file 'cryptobox.json (" + error + ")'");
          return;
        }
        return decrypt($.parseJSON(data), callback);
      });
    }
  };

}).call(this);
cryptobox.popover = {};

cryptobox.popover.show = function(width, height, node) {
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
;
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
;





var ta = document.createElement('textarea');
ta.style.width = '100%';
ta.style.height = '100%';
ta.style.border = '0 none';
ta.style.background = '#000';
ta.style.color = '#fff';
ta.style.resize = 'none';

ta.appendChild(document.createTextNode(cryptobox.form.toJson()));

cryptobox.popover.show('50%', '50%', ta);

ta.select();
