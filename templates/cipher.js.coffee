window.Cryptobox.decrypt = (pass, salt, ciphertext, iterations, keylen, iv) ->
  secret = CryptoJS.PBKDF2(
    pass,
    CryptoJS.enc.Base64.parse(salt),
    {
      keySize: keylen / 32,
      iterations: iterations
    })

  result = CryptoJS.AES.decrypt(
    ciphertext,
    secret,
    {
      mode: CryptoJS.mode.CBC,
      iv: CryptoJS.enc.Base64.parse(iv),
      padding: CryptoJS.pad.Pkcs7
    })

  return result.toString(CryptoJS.enc.Utf8);
