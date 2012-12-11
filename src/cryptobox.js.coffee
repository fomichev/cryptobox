# Declare and export main namespace for cryptobox.
Cryptobox = {}
@Cryptobox = Cryptobox

# This variable stores encrypted cryptobox.json; it's `null` for Dropbox
# version and `non-null` (appended somewhere later) in `embedded` version.
Cryptobox.json = null

# Simple wrapper around `console.log`; just prints `s` on console.
@p = (s) ->
  console?.log(s)

# Measure execution time of given function (`fn`) and print it on console
# with appropriate `name`. Result of the `fn` execution is returned.
Cryptobox.measure = (name, fn) ->
  begin = Date.now()
  result = fn()
  end = Date.now()

  p "#{name} #{end - begin}ms"

  result

# Decrypt base64 encoded `ciphertext` using given password (`pass`) and cipher
# parameters: base64 encoded PBKDF2 `salt`, number of PBKDF2 `iterations`,
# AES key length (`keylen`) and AES IV (`iv`). Decrypted plaintext is returned.
Cryptobox.decrypt = (pass, salt, ciphertext, iterations, keylen, iv) ->
  secret = CryptoJS.PBKDF2(pass, CryptoJS.enc.Base64.parse(salt),
    keySize: keylen / 32
    iterations: iterations
  )

  result = CryptoJS.AES.decrypt(ciphertext, secret,
    mode: CryptoJS.mode.CBC
    iv: CryptoJS.enc.Base64.parse(iv)
    padding: CryptoJS.pad.Pkcs7
  )

  result.toString CryptoJS.enc.Utf8

# Open a cryptobox using given `password` and execute `callback` when data has
# been decrypted. This function gets ciphertext from `Cryptobox.json`
# if available; otherwise it tries to read `cryptobox.json` from Dropbox.
Cryptobox.open = (password, callback) ->
  decrypt = (json, callback) ->
    # We need small timeout here because otherwise decryption
    # stuff will not let the UI to be redrawn.
    setTimeout ->
      try
        data = Cryptobox.measure 'decrypt', ->
          JSON.parse(Cryptobox.decrypt(password,
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
        return

      decrypt($.parseJSON(data), callback)

# Convert `\n` to `<br />` in `text` and return it.
Cryptobox.addBr = (text) ->
  return text.replace(/\n/g, '<br />') if text
  ''

# Render and return `template` in given `context`.
Cryptobox.render = (template, context) ->
  Cryptobox.measure 'render ' + template, ->
    Handlebars.templates[template] context
