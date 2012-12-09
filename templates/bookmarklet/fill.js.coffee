#= require cryptobox.js.coffee
#= require form.js.coffee
#= require popover.js.coffee

#= require extern/CryptoJS/components/core.js
#= require extern/CryptoJS/components/enc-base64.js
#= require extern/CryptoJS/components/cipher-core.js
#= require extern/CryptoJS/components/aes.js
#= require extern/CryptoJS/components/sha1.js
#= require extern/CryptoJS/components/hmac.js
#= require extern/CryptoJS/components/pbkdf2.js

unlock = (pwd, caption) ->
  formToLink = (name, form) ->
    divStyle = "style=\"border: 0 none; border-radius: 6px; background-color: #111; padding: 10px; margin: 5px; text-align: left;\""
    aStyle = "style=\"color: #fff; font-size: 18px; text-decoration: none;\""
    "<div " + divStyle + "><a " + aStyle + " href=\"#\" onClick='javascript:" + "Cryptobox.form.fill(" + JSON.stringify(form) + ");" + "return false;'>" + name + "</a></div>"

  text = Cryptobox.decrypt(
    pwd,
    Cryptobox.json.pbkdf2.salt,
    Cryptobox.json.ciphertext,
    Cryptobox.json.pbkdf2.iterations,
    Cryptobox.json.aes.keylen,
    Cryptobox.json.aes.iv)

  data = JSON.parse(text)
  matched = new Array()
  i = 0

  while i < data.length
    el = data[i]
    continue  unless el.type is "webform"
    address = Cryptobox.form.sitename(document.URL)
    action = Cryptobox.form.sitename(el.form.action)
    matched.push(el) if address is action
    i++
  if matched.length is 0
    caption.innerHTML = "<%= @text[:login_not_found] %>"
    window.setTimeout (->
      document.body.click()
    ), 1000
  else if matched.length is 1
    caption.innerHTML = "<%= @text[:wait_for_login] %>"
    Cryptobox.form.fill(matched[0].form)
  else
    r = ""
    i = 0

    while i < matched.length
      el = matched[i]
      r += formToLink(el.name + " (" + el.form.vars.user + ")", el.form)
      i++
    caption.innerHTML = "<%= @text[:select_login] %>" + r

Cryptobox.json = openCryptobox()

div = document.createElement("div")
div.style.textAlign = "center"
caption = document.createElement("h1")
caption.appendChild(document.createTextNode("<%= @text[:locked_title] %>"))
div.appendChild caption
form = document.createElement("form")
input = document.createElement("input")
input.type = "password"
input.style.border = "1px solid #006"
input.style.fontSize = "18px"
buttonUnlock = document.createElement("input")
buttonUnlock.type = "submit"
buttonUnlock.style.border = "1px solid #006"
buttonUnlock.style.fontSize = "14px"
buttonUnlock.value = "<%= @text[:button_unlock] %>"
buttonDiv = document.createElement("div")
buttonDiv.style.marginTop = "20px"
buttonDiv.appendChild(buttonUnlock)
form.appendChild(input)
form.appendChild(buttonDiv)
div.appendChild(form)

form.onsubmit = ->
  try
    div.removeChild(form)
    unlock(input.value, caption)
  catch e
    caption.innerHTML = e
    window.setTimeout (->
      document.body.click()
    ), 1000
  false

popover = new Cryptobox.Popover("320", "165")
popover.add(div)
popover.show()

input.focus()
