# Declare and export module namespace.
form = {}
window.Cryptobox.form = form

# Return `true` when given `form` requires token for login.
form.withToken = (form) ->
  return true if form.action == '__token__'

  for key, value of form.fields
    return true if value == '__token__'

  return false

# Login to the site using given `form` and `token`. `newWindow` flag
# tells whether to create a new window (`true`) or not (`false`).
form.login = (newWindow, form, token) ->
  return if form.broken

  # Merge form with token.
  if token != undefined
    if form.action == '__token__'
      form.action = token.form.action

    for key, value of form.fields
      if value == '__token__'
        form.fields[key] = token.form.fields[key]

  w = null
  if newWindow
    w = window.open(form.action, form.name)
    return if !w
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
  return w

# Fill input fields of current page using given `form`.
form.fill = (form) ->
  for node in document.querySelectorAll("input[type=text], input[type=password]")
    value = null

    for field of form.fields
      value = form.fields[field] if field == node.attributes['name'].value

    node.value = value if value

# Return just name from given `url` (strip prefix and suffix).
form.sitename = (url) ->
  return url.replace(/[^/]+\/\/([^/]+).+/, '$1').replace(/^www./, '')

# Find all forms on current page; convert and return them in JSON format.
form.toJson = () ->
  address = document.URL
  name = document.title
  text = ""

  for form in document.forms
    form_elements =  "";

    for el in form.elements
      continue if el.name == ""

      if form_elements == ""
        form_elements = "\t\t\t\"#{el.name}\": \"#{el.value}\""
      else
        form_elements += ",\n\t\t\t\"#{el.name}\": \"#{el.value}\""

    method = form.method
    method = post unless method == 'get'

    form_text = "\t\t\"action\": \"#{form.action}\",\n\t\t\"method\": \"#{method}\",\n\t\t\"fields\":\n\t\t{\n#{form_elements}\n\t\t}"

    if text == ""
      text += '[\n'
    else
      text += ',\n';

    text += "{\n\t\"name\": \"#{name}\",\n\t\"address\": \"#{address}\",\n\t\"form\":\n\t{\n#{form_text}\n\t}\n}\n"

  text += "]" if text

  return text
