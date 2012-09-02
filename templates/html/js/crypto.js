function decrypt(pass, salt, ciphertext, iterations, iv) {
	var secret = CryptoJS.PBKDF2(pass, CryptoJS.enc.Base64.parse(salt), { keySize: 256/32, iterations: iterations });
	var result = CryptoJS.AES.decrypt(ciphertext, secret, { mode: CryptoJS.mode.CBC, iv: CryptoJS.enc.Base64.parse(iv), padding: CryptoJS.pad.Pkcs7 });
	return result.toString(CryptoJS.enc.Utf8);
}
