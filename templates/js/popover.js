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
