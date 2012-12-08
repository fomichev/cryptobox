//= require cryptobox.js.coffee
//= require form.js.coffee

//= require js/popover.js

var ta = document.createElement('textarea');
ta.style.width = '100%';
ta.style.height = '100%';
ta.style.border = '0 none';
ta.style.background = '#000';
ta.style.color = '#fff';
ta.style.resize = 'none';

ta.appendChild(document.createTextNode(Cryptobox.form.toJson()));

cryptobox.popover.show('50%', '50%', ta);

ta.select();
