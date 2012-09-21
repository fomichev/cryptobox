var cryptobox = {};
cryptobox.cfg = <%= incl(@config[:path][:db_json]) %>;

<%= incl_plain(File.join(@config[:path][:templates], 'extern/CryptoJS/components/core-min.js')) %>
<%= incl_plain(File.join(@config[:path][:templates], 'extern/CryptoJS/components/enc-base64-min.js')) %>
<%= incl_plain(File.join(@config[:path][:templates], 'extern/CryptoJS/components/cipher-core-min.js')) %>
<%= incl_plain(File.join(@config[:path][:templates], 'extern/CryptoJS/components/aes-min.js')) %>
<%= incl_plain(File.join(@config[:path][:templates], 'extern/CryptoJS/components/sha1-min.js')) %>
<%= incl_plain(File.join(@config[:path][:templates], 'extern/CryptoJS/components/hmac-min.js')) %>
<%= incl_plain(File.join(@config[:path][:templates], 'extern/CryptoJS/components/pbkdf2-min.js')) %>

<%= incl(File.join(@config[:path][:templates], 'js/popover.js')) %>
<%= incl(File.join(@config[:path][:templates], 'js/form.js')) %>
<%= incl(File.join(@config[:path][:templates], 'js/cipher.js')) %>

function unlock(pwd, caption) {
	formToLink = function(name, form) {
		var divStyle = 'style="border: 0 none; border-radius: 6px; background-color: #111; padding: 10px; margin: 5px; text-align: left;"';
		var aStyle = 'style="color: #fff; font-size: 18px; text-decoration: none;"';

		return '<div ' + divStyle + '><a ' + aStyle + ' href="#" onClick=\'javascript:' +
			'cryptobox.form.fill(' + JSON.stringify(form) + ');' +
			'return false;\'>' + name + '</a></div>';
	}

	var text = cryptobox.cipher.decrypt(pwd, cryptobox.cfg.pbkdf2.salt, cryptobox.cfg.ciphertext, cryptobox.cfg.pbkdf2.iterations, cryptobox.cfg.aes.iv);
	var data = eval(text);
	var matched = new Array();

	for (var i = 0; i < data.length; i++) {
		var el = data[i];
		if (el.type == "magic") {
			if (el.value != "270389")
				throw("<%= @text[:incorrect_password] %>");

			continue;
		}

		if (el.type != 'login')
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
caption.appendChild(document.createTextNode('<%= @text[:enter_password] %>'));
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
