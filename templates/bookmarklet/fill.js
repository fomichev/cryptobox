//= require extern/CryptoJS/components/core.js
//= require extern/CryptoJS/components/enc-base64.js
//= require extern/CryptoJS/components/cipher-core.js
//= require extern/CryptoJS/components/aes.js
//= require extern/CryptoJS/components/sha1.js
//= require extern/CryptoJS/components/hmac.js
//= require extern/CryptoJS/components/pbkdf2.js

//= require js/cryptobox.js
//= require js/popover.js
//= require js/form.js
//= require js/cipher.js

cryptobox.json = openCryptobox();

function unlock(pwd, caption) {
	formToLink = function(name, form) {
		var divStyle = 'style="border: 0 none; border-radius: 6px; background-color: #111; padding: 10px; margin: 5px; text-align: left;"';
		var aStyle = 'style="color: #fff; font-size: 18px; text-decoration: none;"';

		return '<div ' + divStyle + '><a ' + aStyle + ' href="#" onClick=\'javascript:' +
			'cryptobox.form.fill(' + JSON.stringify(form) + ');' +
			'return false;\'>' + name + '</a></div>';
	}

	var text = cryptobox.cipher.decrypt(pwd, cryptobox.json.pbkdf2.salt, cryptobox.json.ciphertext, cryptobox.json.pbkdf2.iterations, cryptobox.json.aes.keylen, cryptobox.json.aes.iv);
	var data = eval(text);
	var matched = new Array();

	for (var i = 0; i < data.length; i++) {
		var el = data[i];

		if (el.type != 'webform')
			continue;

		var address = cryptobox.form.sitename(document.URL);
		var action = cryptobox.form.sitename(el.form.action);

		if (address == action)
			matched.push(el);
	}

	if (matched.length == 0) {
		caption.innerHTML = '<%= @text[:login_not_found] %>';
		window.setTimeout(function () { document.body.click(); }, 1000)
	} else if (matched.length == 1) {
		caption.innerHTML = '<%= @text[:wait_for_login] %>';
		cryptobox.form.fill(matched[0].form);
	} else {
		var r = ''
		for (var i = 0; i < matched.length; i++) {
			var el = matched[i];
			r += formToLink(el.name + ' (' + el.form.vars.user + ')', el.form);
		}

		caption.innerHTML = '<%= @text[:select_login] %>' + r;
	}
}

var div = document.createElement('div');
div.style.textAlign = 'center';

var caption = document.createElement('h1');
caption.appendChild(document.createTextNode('<%= @text[:locked_title] %>'));
div.appendChild(caption);

var form = document.createElement('form');

var input = document.createElement('input');
input.type = "password";
input.style.border = "1px solid #006";
input.style.fontSize = '18px';

var buttonUnlock = document.createElement('input');
buttonUnlock.type = "submit";
buttonUnlock.style.border = "1px solid #006";
buttonUnlock.style.fontSize = '14px';
buttonUnlock.value = "<%= @text[:button_unlock] %>";

var buttonDiv = document.createElement('div');
buttonDiv.style.marginTop = '20px';
buttonDiv.appendChild(buttonUnlock);

form.appendChild(input);
form.appendChild(buttonDiv);
div.appendChild(form);

form.onsubmit = function() {
	try {
		div.removeChild(form);

		unlock(input.value, caption);
	} catch(e) {
		caption.innerHTML = e;

		window.setTimeout(function () { document.body.click(); }, 1000);
	}
	return false;
}

cryptobox.popover.show('320', '165', div);

input.focus();
