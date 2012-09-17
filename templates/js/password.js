function isVowel(c) {
	c = c.toLowerCase();

	if (c == 'a')
		return true;
	else if (c == 'e')
		return true;
	else if (c == 'i')
		return true;
	else if (c == 'o')
		return true;
	else if (c == 'u')
		return true;
	else
		return false;
}

function generatePassword(length, includeNumbers, includePunc, includeUc, pronounceable) {
	Math.seedrandom();

	var pass = "";

	if (pronounceable) {
		includeNumbers = false;
		includePunc = false;
	}

	for (var i = 0; i < length;) {
		var num = Math.random() * 1000;
		num = Math.floor(num);
		/* 33 .. 126 */
		num = (num % 93) + 33;

		if (includeNumbers == false) {
			if (num >= 48 && num <= 57)
			       continue;
		}

		if (includePunc == false) {
			if (num >= 33 && num <= 47)
			       continue;

			if (num >= 58 && num <= 64)
			       continue;

			if (num >= 91 && num <= 96)
			       continue;

			if (num >= 123 && num <= 126)
			       continue;
		}

		if (includeUc == false) {
			if (num >= 65 && num <= 90)
			       continue;
		}

		var ch = String.fromCharCode(num);

		if (pronounceable == true) {
			if (pass.length >= 1) {
				var prevCh = pass.charAt(i - 1);

				var aV = isVowel(ch);
				var bV = isVowel(prevCh);

				if (isVowel(ch) && !isVowel(prevCh)) {
				} else if (!isVowel(ch) && isVowel(prevCh)) {
				} else {
					continue;
				}
			}
		}

		pass += ch;

		i++;
	}

	return pass;
}
