<%= incl(File.join(@config[:path][:templates], 'bookmarklet/common.js')) %>

var ta = document.createElement('textarea');
ta.style.width = '100%';
ta.style.height = '100%';
ta.style.border = '0 none';
ta.style.background = '#000';
ta.style.color = '#fff';
ta.style.resize = 'none';

ta.appendChild(document.createTextNode(getFormsJson()));

showPopover('50%', '50%', ta);

ta.select();
