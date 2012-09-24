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
