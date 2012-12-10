(function() {
  var Cryptobox;

  Cryptobox = {};

  this.Cryptobox = Cryptobox;

  this.cryptobox = {};

  Cryptobox.json = null;

  this.p = function(s) {
    return typeof console !== "undefined" && console !== null ? console.log(s) : void 0;
  };

  Cryptobox.measure = function(name, fn) {
    var begin, end, result;
    begin = Date.now();
    result = fn();
    end = Date.now();
    p("" + name + " " + (end - begin) + "ms");
    return result;
  };

  Cryptobox.decrypt = function(pass, salt, ciphertext, iterations, keylen, iv) {
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

  Cryptobox.open = function(password, callback) {
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

  Cryptobox.addBr = function(text) {
    if (text) {
      return text.replace(/\n/g, '<br />');
    }
    return '';
  };

  Cryptobox.render = function(template, context) {
    return Cryptobox.measure('render ' + template, function() {
      return Handlebars.templates[template](context);
    });
  };

}).call(this);
(function() {
  var form;

  form = {};

  this.Cryptobox.form = form;

  form.withToken = function(form) {
    var key, value, _ref;
    if (form.action === '__token__') {
      return true;
    }
    _ref = form.fields;
    for (key in _ref) {
      value = _ref[key];
      if (value === '__token__') {
        return true;
      }
    }
    return false;
  };

  form.login = function(newWindow, form, token) {
    var html, key, value, w, _ref, _ref1;
    if (form.broken) {
      return;
    }
    if (token !== void 0) {
      if (form.action === '__token__') {
        form.action = token.form.action;
      }
      _ref = form.fields;
      for (key in _ref) {
        value = _ref[key];
        if (value === '__token__') {
          form.fields[key] = token.form.fields[key];
        }
      }
    }
    w = null;
    if (newWindow) {
      w = window.open(form.action, form.name);
      if (!w) {
        return;
      }
    } else {
      w = window;
      document.close();
      document.open();
    }
    html = "<html><head></head><body><%= @text[:wait_for_login] %><form id='formid' method='" + form.method + "' action='" + form.action + "'>";
    _ref1 = form.fields;
    for (key in _ref1) {
      value = _ref1[key];
      html += "<input type='hidden' name='" + key + "' value='" + form.fields[key] + "' />";
    }
    html += "</form><script type='text/javascript'>document.getElementById('formid').submit()</s";
    html += "cript></body></html>";
    w.document.write(html);
    return w;
  };

  form.fill = function(form) {
    var field, node, value, _i, _len, _ref, _results;
    _ref = document.querySelectorAll("input[type=text], input[type=password]");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      value = null;
      for (field in form.fields) {
        if (field === node.attributes['name'].value) {
          value = form.fields[field];
        }
      }
      if (value) {
        _results.push(node.value = value);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  form.sitename = function(url) {
    return url.replace(/[^/]+\/\/([^/]+).+/, '$1').replace(/^www./, '');
  };

  form.toJson = function() {
    var address, el, form_elements, form_text, method, name, text, _i, _j, _len, _len1, _ref, _ref1;
    address = document.URL;
    name = document.title;
    text = "";
    _ref = document.forms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      form = _ref[_i];
      form_elements = "";
      _ref1 = form.elements;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        el = _ref1[_j];
        if (el.name === "") {
          continue;
        }
        if (form_elements === "") {
          form_elements = "\t\t\t\"" + el.name + "\": \"" + el.value + "\"";
        } else {
          form_elements += ",\n\t\t\t\"" + el.name + "\": \"" + el.value + "\"";
        }
      }
      method = form.method;
      if (method !== 'get') {
        method = post;
      }
      form_text = "\t\t\"action\": \"" + form.action + "\",\n\t\t\"method\": \"" + method + "\",\n\t\t\"fields\":\n\t\t{\n" + form_elements + "\n\t\t}";
      if (text === "") {
        text += '[\n';
      } else {
        text += ',\n';
      }
      text += "{\n\t\"name\": \"" + name + "\",\n\t\"address\": \"" + address + "\",\n\t\"form\":\n\t{\n" + form_text + "\n\t}\n}\n";
    }
    if (text) {
      text += "]";
    }
    return text;
  };

}).call(this);
(function() {
  var Popover;

  Popover = (function() {

    function Popover(width, height) {
      var bg, paddingDiv;
      this.popover = document.createElement("div");
      this.popover.style.position = "absolute";
      this.popover.style.zIndex = 99999;
      this.popover.style.top = 0;
      this.popover.style.left = 0;
      this.popover.style.width = width;
      this.popover.style.height = height;
      paddingDiv = document.createElement("div");
      this.popover.appendChild(paddingDiv);
      paddingDiv.style.paddingTop = "20px";
      paddingDiv.style.paddingLeft = "20px";
      paddingDiv.style.paddingRight = "40px";
      paddingDiv.style.paddingBottom = "20px";
      bg = document.createElement("div");
      paddingDiv.appendChild(bg);
      bg.style.color = "#fff";
      bg.style.background = "#000";
      bg.style.opacity = 0.8;
      bg.style.width = "100%";
      bg.style.height = "100%";
      bg.style.padding = "10px";
      bg.style.border = "0 none";
      bg.style.borderRadius = "6px";
      bg.style.boxShadow = "0 0 8px rgba(0,0,0,.8)";
    }

    Popover.prototype.add = function(node) {
      bg.appendChild(node);
      this.popover.onclick = function(e) {
        return e.stopPropagation();
      };
      return document.body.onclick = function() {
        return this.popover.parentNode.removeChild(this.popover);
      };
    };

    Popover.prototype.show = function() {
      return document.body.appendChild(this.popover);
    };

    return Popover;

  })();

  this.Cryptobox.Popover = Popover;

}).call(this);
(function() {
  var popover, ta;

  ta = document.createElement("textarea");

  ta.style.width = "100%";

  ta.style.height = "100%";

  ta.style.border = "0 none";

  ta.style.background = "#000";

  ta.style.color = "#fff";

  ta.style.resize = "none";

  ta.appendChild(document.createTextNode(Cryptobox.form.toJson()));

  popover = new Cryptobox.Popover("50%", "50%");

  popover.add(ta);

  popover.show();

  ta.select();

}).call(this);
