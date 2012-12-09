#= require cryptobox.js.coffee
#= require form.js.coffee

chrome.extension.onMessage.addListener (msg, sender, sendResponse) ->
  if msg.type is "fillForm"
    Cryptobox.form.fill(msg.data.form)
    sendResponse({})
  else if msg.type is "getFormJson"
    sendResponse(Cryptobox.form.toJson())
  else
    # Unknown message, handle it?
    sendResponse({})

# Ctrl-\ shortcut 
window.addEventListener "keyup", ((e) ->
  e.keyCode is 220  if e.ctrlKey and e.keyCode

# TODO: we need to add our overlay with popup.html
#			 * to the current window because it's not possible
#			 * just to show browser action 
), false
