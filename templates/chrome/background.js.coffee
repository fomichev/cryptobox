#= require cryptobox.js.coffee

# This variable shares form fill information with content script of tab.
fill = {}

# Preserved `cryptobox.json`.
chrome.extension.getBackgroundPage().json = null

# Clipboard copy handler.
chrome.extension.onRequest.addListener (msg, sender, sendResponse) ->
  body = document.getElementsByTagName("body")[0]
  ta = document.createElement("textarea")
  body.appendChild(ta)
  ta.value = msg.text
  ta.select()
  document.execCommand("copy", false, null)
  body.removeChild(ta)
  sendResponse({})


# Unmatched form fill handler.
chrome.tabs.onUpdated.addListener (tabId, info, tab) ->
  if info.status is "complete" and tabId of fill
    msg =
      type: "fillForm"
      cfg: fill[tabId]

    chrome.tabs.sendMessage(tabId, msg, ->)

    delete fill[tabId]
