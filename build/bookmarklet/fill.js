/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

var CryptoJS=CryptoJS||function(h,o){var f={},j=f.lib={},k=j.Base=function(){function a(){}return{extend:function(b){a.prototype=this;var c=new a;b&&c.mixIn(b);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),i=j.WordArray=k.extend({init:function(a,b){a=
this.words=a||[];this.sigBytes=b!=o?b:4*a.length},toString:function(a){return(a||p).stringify(this)},concat:function(a){var b=this.words,c=a.words,d=this.sigBytes,a=a.sigBytes;this.clamp();if(d%4)for(var e=0;e<a;e++)b[d+e>>>2]|=(c[e>>>2]>>>24-8*(e%4)&255)<<24-8*((d+e)%4);else if(65535<c.length)for(e=0;e<a;e+=4)b[d+e>>>2]=c[e>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-8*(b%4);a.length=h.ceil(b/4)},clone:function(){var a=
k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*h.random()|0);return i.create(b,a)}}),l=f.enc={},p=l.Hex={stringify:function(a){for(var b=a.words,a=a.sigBytes,c=[],d=0;d<a;d++){var e=b[d>>>2]>>>24-8*(d%4)&255;c.push((e>>>4).toString(16));c.push((e&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-4*(d%8);return i.create(c,b/2)}},n=l.Latin1={stringify:function(a){for(var b=
a.words,a=a.sigBytes,c=[],d=0;d<a;d++)c.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return i.create(c,b)}},q=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},m=j.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=i.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=q.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,d=b.sigBytes,e=this.blockSize,f=d/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0),a=f*e,d=h.min(4*a,d);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(c,g);g=c.splice(0,a);b.sigBytes-=d}return i.create(g,d)},clone:function(){var a=k.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=m.extend({init:function(){this.reset()},
reset:function(){m.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=m.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,c){return a.create(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return r.HMAC.create(a,c).finalize(b)}}});var r=f.algo={};return f}(Math);
/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

(function(){var h=CryptoJS,i=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();for(var b=[],a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var b=b.replace(/\s/g,""),e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));
for(var c=[],a=0,d=0;d<e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return i.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

CryptoJS.lib.Cipher||function(r){var f=CryptoJS,e=f.lib,i=e.Base,j=e.WordArray,o=e.BufferedBlockAlgorithm,p=f.enc.Base64,s=f.algo.EvpKDF,l=e.Cipher=o.extend({cfg:i.extend(),createEncryptor:function(a,b){return this.create(this._ENC_XFORM_MODE,a,b)},createDecryptor:function(a,b){return this.create(this._DEC_XFORM_MODE,a,b)},init:function(a,b,c){this.cfg=this.cfg.extend(c);this._xformMode=a;this._key=b;this.reset()},reset:function(){o.reset.call(this);this._doReset()},process:function(a){this._append(a);
return this._process()},finalize:function(a){a&&this._append(a);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){return function(a){return{encrypt:function(b,c,d){return("string"==typeof c?q:g).encrypt(a,b,c,d)},decrypt:function(b,c,d){return("string"==typeof c?q:g).decrypt(a,b,c,d)}}}}()});e.StreamCipher=l.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var k=f.mode={},t=e.BlockCipherMode=i.extend({createEncryptor:function(a,
b){return this.Encryptor.create(a,b)},createDecryptor:function(a,b){return this.Decryptor.create(a,b)},init:function(a,b){this._cipher=a;this._iv=b}}),k=k.CBC=function(){function a(a,b,m){var h=this._iv;h?this._iv=r:h=this._prevBlock;for(var e=0;e<m;e++)a[b+e]^=h[e]}var b=t.extend();b.Encryptor=b.extend({processBlock:function(b,d){var m=this._cipher,e=m.blockSize;a.call(this,b,d,e);m.encryptBlock(b,d);this._prevBlock=b.slice(d,d+e)}});b.Decryptor=b.extend({processBlock:function(b,d){var e=this._cipher,
h=e.blockSize,f=b.slice(d,d+h);e.decryptBlock(b,d);a.call(this,b,d,h);this._prevBlock=f}});return b}(),u=(f.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,e=[],f=0;f<c;f+=4)e.push(d);c=j.create(e,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};e.BlockCipher=l.extend({cfg:l.cfg.extend({mode:k,padding:u}),reset:function(){l.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;
else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=e.CipherParams=i.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),k=(f.format={}).OpenSSL=
{stringify:function(a){var b=a.ciphertext,a=a.salt,b=(a?j.create([1398893684,1701076831]).concat(a).concat(b):b).toString(p);return b=b.replace(/(.{64})/g,"$1\n")},parse:function(a){var a=p.parse(a),b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=j.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},g=e.SerializableCipher=i.extend({cfg:i.extend({format:k}),encrypt:function(a,b,c,d){var d=this.cfg.extend(d),e=a.createEncryptor(c,d),b=e.finalize(b),e=e.cfg;
return n.create({ciphertext:b,key:c,iv:e.iv,algorithm:a,mode:e.mode,padding:e.padding,blockSize:a.blockSize,formatter:d.format})},decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a):a}}),f=(f.kdf={}).OpenSSL={compute:function(a,b,c,d){d||(d=j.random(8));a=s.create({keySize:b+c}).compute(a,d);c=j.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,
salt:d})}},q=e.PasswordBasedCipher=g.extend({cfg:g.cfg.extend({kdf:f}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);c=d.kdf.compute(c,a.keySize,a.ivSize);d.iv=c.iv;a=g.encrypt.call(this,a,b,c.key,d);a.mixIn(c);return a},decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);c=d.kdf.compute(c,a.keySize,a.ivSize,b.salt);d.iv=c.iv;return g.decrypt.call(this,a,b,c.key,d)}})}();
/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

(function(){var r=CryptoJS,u=r.lib.BlockCipher,o=r.algo,g=[],v=[],w=[],x=[],y=[],z=[],p=[],q=[],s=[],t=[];(function(){for(var b=[],c=0;256>c;c++)b[c]=128>c?c<<1:c<<1^283;for(var a=0,f=0,c=0;256>c;c++){var d=f^f<<1^f<<2^f<<3^f<<4,d=d>>>8^d&255^99;g[a]=d;v[d]=a;var e=b[a],A=b[e],h=b[A],i=257*b[d]^16843008*d;w[a]=i<<24|i>>>8;x[a]=i<<16|i>>>16;y[a]=i<<8|i>>>24;z[a]=i;i=16843009*h^65537*A^257*e^16843008*a;p[d]=i<<24|i>>>8;q[d]=i<<16|i>>>16;s[d]=i<<8|i>>>24;t[d]=i;a?(a=e^b[b[b[h^e]]],f^=b[b[f]]):a=f=1}})();
var B=[0,1,2,4,8,16,32,64,128,27,54],o=o.AES=u.extend({_doReset:function(){for(var b=this._key,c=b.words,a=b.sigBytes/4,b=4*((this._nRounds=a+6)+1),f=this._keySchedule=[],d=0;d<b;d++)if(d<a)f[d]=c[d];else{var e=f[d-1];d%a?6<a&&4==d%a&&(e=g[e>>>24]<<24|g[e>>>16&255]<<16|g[e>>>8&255]<<8|g[e&255]):(e=e<<8|e>>>24,e=g[e>>>24]<<24|g[e>>>16&255]<<16|g[e>>>8&255]<<8|g[e&255],e^=B[d/a|0]<<24);f[d]=f[d-a]^e}c=this._invKeySchedule=[];for(a=0;a<b;a++)d=b-a,e=a%4?f[d]:f[d-4],c[a]=4>a||4>=d?e:p[g[e>>>24]]^q[g[e>>>
16&255]]^s[g[e>>>8&255]]^t[g[e&255]]},encryptBlock:function(b,c){this._doCryptBlock(b,c,this._keySchedule,w,x,y,z,g)},decryptBlock:function(b,c){var a=b[c+1];b[c+1]=b[c+3];b[c+3]=a;this._doCryptBlock(b,c,this._invKeySchedule,p,q,s,t,v);a=b[c+1];b[c+1]=b[c+3];b[c+3]=a},_doCryptBlock:function(b,c,a,f,d,e,g,h){for(var i=this._nRounds,k=b[c]^a[0],l=b[c+1]^a[1],m=b[c+2]^a[2],j=b[c+3]^a[3],n=4,r=1;r<i;r++)var o=f[k>>>24]^d[l>>>16&255]^e[m>>>8&255]^g[j&255]^a[n++],p=f[l>>>24]^d[m>>>16&255]^e[j>>>8&255]^
g[k&255]^a[n++],q=f[m>>>24]^d[j>>>16&255]^e[k>>>8&255]^g[l&255]^a[n++],j=f[j>>>24]^d[k>>>16&255]^e[l>>>8&255]^g[m&255]^a[n++],k=o,l=p,m=q;o=(h[k>>>24]<<24|h[l>>>16&255]<<16|h[m>>>8&255]<<8|h[j&255])^a[n++];p=(h[l>>>24]<<24|h[m>>>16&255]<<16|h[j>>>8&255]<<8|h[k&255])^a[n++];q=(h[m>>>24]<<24|h[j>>>16&255]<<16|h[k>>>8&255]<<8|h[l&255])^a[n++];j=(h[j>>>24]<<24|h[k>>>16&255]<<16|h[l>>>8&255]<<8|h[m&255])^a[n++];b[c]=o;b[c+1]=p;b[c+2]=q;b[c+3]=j},keySize:8});r.AES=u._createHelper(o)})();
/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

(function(){var d=CryptoJS,c=d.lib,l=c.WordArray,c=c.Hasher,j=[],k=d.algo.SHA1=c.extend({_doReset:function(){this._hash=l.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(c,m){for(var a=this._hash.words,e=a[0],f=a[1],h=a[2],i=a[3],d=a[4],b=0;80>b;b++){if(16>b)j[b]=c[m+b]|0;else{var g=j[b-3]^j[b-8]^j[b-14]^j[b-16];j[b]=g<<1|g>>>31}g=(e<<5|e>>>27)+d+j[b];g=20>b?g+((f&h|~f&i)+1518500249):40>b?g+((f^h^i)+1859775393):60>b?g+((f&h|f&i|h&i)-1894007588):g+((f^h^i)-
899497514);d=i;i=h;h=f<<30|f>>>2;f=e;e=g}a[0]=a[0]+e|0;a[1]=a[1]+f|0;a[2]=a[2]+h|0;a[3]=a[3]+i|0;a[4]=a[4]+d|0},_doFinalize:function(){var d=this._data,c=d.words,a=8*this._nDataBytes,e=8*d.sigBytes;c[e>>>5]|=128<<24-e%32;c[(e+64>>>9<<4)+15]=a;d.sigBytes=4*c.length;this._process()}});d.SHA1=c._createHelper(k);d.HmacSHA1=c._createHmacHelper(k)})();
/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

(function(){var c=CryptoJS,j=c.enc.Utf8;c.algo.HMAC=c.lib.Base.extend({init:function(a,b){a=this._hasher=a.create();"string"==typeof b&&(b=j.parse(b));var c=a.blockSize,e=4*c;b.sigBytes>e&&(b=a.finalize(b));for(var f=this._oKey=b.clone(),g=this._iKey=b.clone(),h=f.words,i=g.words,d=0;d<c;d++)h[d]^=1549556828,i[d]^=909522486;f.sigBytes=g.sigBytes=e;this.reset()},reset:function(){var a=this._hasher;a.reset();a.update(this._iKey)},update:function(a){this._hasher.update(a);return this},finalize:function(a){var b=
this._hasher,a=b.finalize(a);b.reset();return b.finalize(this._oKey.clone().concat(a))}})})();
/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

(function(){var b=CryptoJS,a=b.lib,d=a.Base,l=a.WordArray,a=b.algo,o=a.HMAC,k=a.PBKDF2=d.extend({cfg:d.extend({keySize:4,hasher:a.SHA1,iterations:1}),init:function(a){this.cfg=this.cfg.extend(a)},compute:function(a,b){for(var c=this.cfg,f=o.create(c.hasher,a),g=l.create(),d=l.create([1]),k=g.words,p=d.words,m=c.keySize,c=c.iterations;k.length<m;){var h=f.update(b).finalize(d);f.reset();for(var i=h.words,q=i.length,j=h,n=1;n<c;n++){j=f.finalize(j);f.reset();for(var r=j.words,e=0;e<q;e++)i[e]^=r[e]}g.concat(h);
p[0]++}g.sigBytes=4*m;return g}});b.PBKDF2=function(a,b,c){return k.create(c).compute(a,b)}})();
var cryptobox = {};
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
cryptobox.cipher = {};

cryptobox.cipher.decrypt = function(pass, salt, ciphertext, iterations, keylen, iv) {
	var secret = CryptoJS.PBKDF2(
			pass,
			CryptoJS.enc.Base64.parse(salt),
			{
				keySize: keylen / 32,
				iterations: iterations
			});
	var result = CryptoJS.AES.decrypt(
			ciphertext,
			secret,
			{
				mode: CryptoJS.mode.CBC,
				iv: CryptoJS.enc.Base64.parse(iv),
				padding: CryptoJS.pad.Pkcs7
			});

	return result.toString(CryptoJS.enc.Utf8);
}
;













cryptobox.cfg = getCryptoboxConfig();

function unlock(pwd, caption) {
	formToLink = function(name, form) {
		var divStyle = 'style="border: 0 none; border-radius: 6px; background-color: #111; padding: 10px; margin: 5px; text-align: left;"';
		var aStyle = 'style="color: #fff; font-size: 18px; text-decoration: none;"';

		return '<div ' + divStyle + '><a ' + aStyle + ' href="#" onClick=\'javascript:' +
			'cryptobox.form.fill(' + JSON.stringify(form) + ');' +
			'return false;\'>' + name + '</a></div>';
	}

	var text = cryptobox.cipher.decrypt(pwd, cryptobox.cfg.pbkdf2.salt, cryptobox.cfg.ciphertext, cryptobox.cfg.pbkdf2.iterations, cryptobox.cfg.aes.keylen, cryptobox.cfg.aes.iv);
	var data = eval(text);
	var matched = new Array();

	for (var i = 0; i < data.length; i++) {
		var el = data[i];
		if (el.type == "magic") {
			if (el.value != "270389")
				throw("<%= @text[:incorrect_password] %>");

			continue;
		}

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
