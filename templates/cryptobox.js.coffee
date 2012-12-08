# Declare main namespace for cryptobox.
window.Cryptobox = {}
window.cryptobox = {}

# Encrypted cryptobox.json; it's null for Dropbox version and non-null
# (appended somewhere later) in `embedded` version.
window.Cryptobox.json = null

# Simple wrapper around `console.log`; just prints `s` on console.
window.p = (s) ->
  console?.log(s)

# Simple wrapper around `console.log` for debugging purposes.
window.dbg = (s) ->

# Measure execution time given function (`fn`) and print execution time
# on console with appropriate `name`. Result of the `fn` execution is returned.
window.Cryptobox.measure = (name, fn) ->
  begin = Date.now()
  result = fn()
  end = Date.now()

  p "#{name} #{end - begin}ms"

  return result

# Decrypt base64 encoded `ciphertext` using given password (`pass`) and cipher
# parameters: . base64 encoded PBKDF2 `salt`, number of PBKDF2 `iterations`,
# AES key length (`keylen`) and AES IV (`iv`). Decrypted plaintext is returned.
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

# Open a cryptobox using given `password` and execute `callback` when data has
# been decrypted. This function uses embedded cryptobox.json (`Cryptobox.json`)
# if available; otherwise it tries to read cryptobox.json from Dropbox.
window.Cryptobox.open = (password, callback) ->
  decrypt = (json, callback) ->
    # We need small timeout here because otherwise decryption
    # stuff will not let the UI to be redrawn.
    setTimeout ->
      try
        data = Cryptobox.measure 'decrypt', ->
          return JSON.parse(Cryptobox.decrypt(password,
            json.pbkdf2.salt,
            json.ciphertext,
            json.pbkdf2.iterations,
            json.aes.keylen,
            json.aes.iv))

        callback(data, null)
      catch e
        callback(null, "<%= @text[:incorrect_password] %> #{e}")
    , 10

  if Cryptobox.json
    decrypt(Cryptobox.json, callback)
  else
    cryptobox.dropbox.read (error, data) ->
      if error
        callback(null, "Can't read file 'cryptobox.json (#{error})'")
        return;

      decrypt($.parseJSON(data), callback)
