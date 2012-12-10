# Declare and export module namespace.
Cryptobox.Form = {}

# Return `true` when given `form` requires token for login.
Cryptobox.Form.withToken = (form) ->
  return true if form.action == '__token__'

  for key, value of form.fields
    return true if value == '__token__'

  false

# Login to the site using given `form` and `token`. `newWindow` flag
# tells whether to create a new window (`true`) or not (`false`).
Cryptobox.Form.login = (newWindow, form, token) ->
  return if form.broken

  # Merge form with token.
  if token isnt undefined
    form.action = token.form.action if form.action is '__token__'

    for key, value of form.fields
      form.fields[key] = token.form.fields[key] if value is '__token__'

  w = null
  if newWindow
    w = window.open(form.action, form.name)
    return unless w
  else
    w = window
    document.close()
    document.open()

  html = "<html><head></head><body><%= @text[:wait_for_login] %><form id='formid' method='#{form.method}' action='#{form.action}'>"

  for key, value of form.fields
    html += "<input type='hidden' name='#{key}' value='#{form.fields[key]}' />"

  html += "</form><script type='text/javascript'>document.getElementById('formid').submit()</s"
  # &lt;/script&gt; screws everything up after embedding, so split it into multiple lines.
  html += "cript></body></html>"

  w.document.write(html)
  w

# Fill input fields of current page using given `form`.
Cryptobox.Form.fill = (form) ->
  for node in document.querySelectorAll("input[type=text], input[type=password]")
    value = null

    for field of form.fields
      value = form.fields[field] if field == node.attributes['name'].value

    node.value = value if value

# Return just name from given `url` (strip prefix and suffix).
Cryptobox.Form.sitename = (url) ->
  url.replace(/[^/]+\/\/([^/]+).+/, '$1').replace(/^www./, '')

# Find all forms on current page; convert and return them in JSON format.
Cryptobox.Form.toJson = () ->
  address = document.URL
  name = document.title
  text = ""

  for form in document.forms
    form_elements =  ""

    for el in form.elements
      continue if el.name is ""

      if form_elements == ""
        form_elements = "\t\t\t\"#{el.name}\": \"#{el.value}\""
      else
        form_elements += ",\n\t\t\t\"#{el.name}\": \"#{el.value}\""

    method = form.method
    method = post if method isnt 'get'

    form_text = "\t\t\"action\": \"#{form.action}\",\n\t\t\"method\": \"#{method}\",\n\t\t\"fields\":\n\t\t{\n#{form_elements}\n\t\t}"

    if text == ""
      text += '[\n'
    else
      text += ',\n';

    text += "{\n\t\"name\": \"#{name}\",\n\t\"address\": \"#{address}\",\n\t\"form\":\n\t{\n#{form_text}\n\t}\n}\n"

  text += "]" if text

  text
