#= require extern/jquery/jquery.js
#= require extern/bootstrap/js/bootstrap.js
#= require extern/handlebars/handlebars.runtime.js

#= require extern/seedrandom/seedrandom.js
#= require extern/CryptoJS/components/core.js
#= require extern/CryptoJS/components/enc-base64.js
#= require extern/CryptoJS/components/cipher-core.js
#= require extern/CryptoJS/components/aes.js
#= require extern/CryptoJS/components/sha1.js
#= require extern/CryptoJS/components/hmac.js
#= require extern/CryptoJS/components/pbkdf2.js

#= require cryptobox.js.coffee
#= require lock.js.coffee
#= require form.js.coffee
#= require js/dropbox.js
#= require password.js.coffee
#= require handlebars.js.coffee
#= require chrome/templates.js

#= require app.js.coffee
#= require bootstrap.js.coffee

# Send `message` to given `tab` and execute `callback` upon response arrival.
sendTo = (tab, message, callback) ->
  chrome.tabs.sendMessage tab.id, message, (response) ->
    callback(response)

# Send `message` to content script and execute `callback` upon response arrival.
sendToContentScript = (message, callback) ->
  chrome.tabs.getSelected null, (tab) ->
    sendTo(tab, message, callback)

# Copy `text` to clipboard.
copyToClipboard = (text) ->
  chrome.extension.getBackgroundPage().clipboardCopyNum++
  chrome.extension.sendRequest({ text: text })

# Clean clipboard (actually paste some stub text)
cleanClipboard = () ->
  copyToClipboard "<%= @text[:cleared_clipboard] %>"  unless chrome.extension.getBackgroundPage().clipboardCopyNum is 0

# Show specified `div`.
show = (div) ->
  $("#div-locked").hide()
  $("#div-unlocked").hide()
  $("#div-details").hide()
  $("#div-generate").hide()
  if div is "#div-unlocked" or div is "#div-details" or div is "#div-generate"
    $("#div-navbar").fadeIn() unless $("#div-locked").is(":visible")
  else
    $("#div-navbar").hide()
  $(div).fadeIn()

# Handle row details click event.
detailsClick = (el) ->
  copy = (value) ->
    "<a class=\"btn btn-mini btn-success button-copy\" href=\"#\" value=\"" + value + "\"><%= @text[:button_copy] %></a>"

  $("#div-details-body").html ""
  values =
    "<%= @text[:username] %>:": Cryptobox.BootstrapAppDelegate.collapsible(el.form.vars.user, copy(el.form.vars.user))
    "<%= @text[:password] %>:": Cryptobox.BootstrapAppDelegate.collapsible(el.form.vars.pass, copy(el.form.vars.pass))

  Cryptobox.BootstrapAppDelegate.createDetails($("#div-details-body"), values)
  show("#div-details")

# Class that extends application delegate for Chrome extension.
class ChromeAppDelegate extends Cryptobox.BootstrapAppDelegate
  constructor: ->
    super()

  shutdown: (preserve) ->
    super(preserve)

    chrome.extension.getBackgroundPage().lock.stop()
    chrome.extension.getBackgroundPage().json = null unless preserve?
    cleanClipboard()
    show("#div-locked")

  restore: ->
    if chrome.extension.getBackgroundPage().json?
      return chrome.extension.getBackgroundPage().json

    null

  state: (state) ->
    super(state)

    switch state
      when Cryptobox.App::STATE_UNLOCKED
        chrome.extension.getBackgroundPage().lock = new Cryptobox.Lock(
          cryptobox.config.lock_timeout_minutes,
          => chrome.extension.getBackgroundPage().json = null)
        chrome.extension.getBackgroundPage().lock.start()

        $("#div-login-details").hide()
        show("#div-unlocked")

  prepare: ->
    super()

    $(".button-copy").live "click", ->
      copyToClipboard $(this).attr("value")

    $(".button-login-matched").live "click", ->
      el = $.parseJSON($(this).parent().parent().attr("json"))
      sendToContentScript
        type: "fillForm"
        data: el
      , ->

      window.close()

    $(".button-login-unmatched").live "click", ->
      el = $.parseJSON($(this).parent().parent().attr("json"))
      chrome.tabs.create
        url: el.address
        selected: true
      , (tab) ->
        chrome.extension.getBackgroundPage().fill[tab.id] = el


    $(".button-details").live "click", ->
      el = $.parseJSON($(this).parent().parent().attr("json"))
      detailsClick(el)

    $("#button-hide-generate").live "click", ->
      show("#div-unlocked")

    $("#button-generate-show").live "click", ->
      show("#div-generate")

    $("#button-generate").live "click", ->
      Cryptobox.BootstrapAppDelegate.dialogGenerateSubmit()

    $("#button-get-json").live "click", ->
      sendToContentScript
        type: "getFormJson"
      , (text) ->
        $("#div-details-body").html "<textarea class=\"span6\" rows=\"20\">" + text + "</textarea>"
        show("#div-details")


    $("#button-hide-details").live "click", ->
      show("#div-unlocked")

  prepareJson: (json, callback) ->
    chrome.extension.getBackgroundPage().json = json

    chrome.tabs.getSelected null, (t) ->
      matched = []
      unmatched = []
      i = 0

      while i < json.length
        if json[i].type is "webform"
          if Cryptobox.form.sitename(json[i].address) is Cryptobox.form.sitename(t.url)
            matched.push(json[i])
          else
            unmatched.push(json[i]) if json[i].visible is true
        i++

      callback({ matched: matched, unmatched: unmatched })

$ ->
  chrome.extension.getBackgroundPage().clipboardCopyNum = 0

  delegate = new ChromeAppDelegate()
  app = new Cryptobox.App(delegate)
  app.run()
