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
#= require ui.js.coffee
#= require password.js.coffee
#= require handlebars.js.coffee
#= require chrome/templates.js

#= require app.js.coffee
#= require bootstrap.js.coffee

cryptobox.browser = {}
cryptobox.browser.sendTo = (tab, message, callback) ->
  chrome.tabs.sendMessage tab.id, message, (response) ->
    callback response

cryptobox.browser.sendToContentScript = (message, callback) ->
  chrome.tabs.getSelected null, (tab) ->
    cryptobox.browser.sendTo tab, message, callback


cryptobox.browser.copyToClipboard = (text) ->
  chrome.extension.getBackgroundPage().clipboardCopyNum++
  chrome.extension.sendRequest text: text

cryptobox.browser.cleanClipboard = (text) ->
  cryptobox.browser.copyToClipboard "<%= @text[:cleared_clipboard] %>"  unless chrome.extension.getBackgroundPage().clipboardCopyNum is 0

cryptobox.main = {}
cryptobox.main.show = (div) ->
  $("#div-locked").hide()
  $("#div-unlocked").hide()
  $("#div-details").hide()
  $("#div-generate").hide()
  if div is "#div-unlocked" or div is "#div-details" or div is "#div-generate"
    $("#div-navbar").fadeIn()  unless $("#div-locked").is(":visible")
  else
    $("#div-navbar").hide()
  $(div).fadeIn()

cryptobox.main.detailsClick = (el) ->
  copy = (value) ->
    "<a class=\"btn btn-mini btn-success button-copy\" href=\"#\" value=\"" + value + "\"><%= @text[:button_copy] %></a>"

  $("#div-details-body").html ""
  values =
    "<%= @text[:username] %>:": Cryptobox.bootstrap.collapsible(el.form.vars.user, copy(el.form.vars.user))
    "<%= @text[:password] %>:": Cryptobox.bootstrap.collapsible(el.form.vars.pass, copy(el.form.vars.pass))

  Cryptobox.bootstrap.createDetails $("#div-details-body"), values
  cryptobox.main.show "#div-details"

cryptobox.main.lock = ->
  chrome.extension.getBackgroundPage().json = null
  cryptobox.browser.cleanClipboard()
  Cryptobox.bootstrap.render "locked", this
  cryptobox.main.show "#div-locked"
  cryptobox.main.prepare()
  $("#input-password").focus()

cryptobox.main.prepare = ->
  cryptobox.dropbox.prepare ((url) ->
    Cryptobox.bootstrap.showAlert false, "Dropbox authentication required: <p><a href=\"" + url + "\" target=\"_blank\">" + url + "</a></p>"
  ), (error) ->
    if error
      Cryptobox.bootstrap.showAlert true, "Dropbox authentication error"
    else
      Cryptobox.bootstrap.showAlert false, "Successfully restored Dropbox credentials"


class ChromeAppDelegate extends Cryptobox.BootstrapAppDelegate
  constructor: ->
    super()

  restoreSession: ->
    if chrome.extension.getBackgroundPage().json?
      chrome.extension.getBackgroundPage().lock.rewind()
      return chrome.extension.getBackgroundPage().json

    null

  state: (state) ->
    super(state)

    switch state
      when Cryptobox.App::STATE_UNLOCKED
        chrome.extension.getBackgroundPage().lock = new Cryptobox.Lock(->
          chrome.extension.getBackgroundPage().lock.rewind()
        , cryptobox.config.lock_timeout_minutes, ->
          chrome.extension.getBackgroundPage().json = null
        )
        chrome.extension.getBackgroundPage().lock.start()

        $("#div-login-details").hide()
        cryptobox.main.show "#div-unlocked"

  prepare: ->
    $(".button-copy").live "click", ->
      cryptobox.browser.copyToClipboard $(this).attr("value")

    $(".button-login-matched").live "click", ->
      el = $.parseJSON($(this).parent().parent().attr("json"))
      cryptobox.browser.sendToContentScript
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
      cryptobox.main.detailsClick el

    $("#button-hide-generate").live "click", ->
      cryptobox.main.show "#div-unlocked"

    $("#button-generate-show").live "click", ->
      cryptobox.main.show "#div-generate"

    $("#button-generate").live "click", ->
      Cryptobox.bootstrap.dialogGenerateSubmit()

    $("#button-get-json").live "click", ->
      cryptobox.browser.sendToContentScript
        type: "getFormJson"
      , (text) ->
        $("#div-details-body").html "<textarea class=\"span6\" rows=\"20\">" + text + "</textarea>"
        cryptobox.main.show "#div-details"


    $("#button-hide-details").live "click", ->
      cryptobox.main.show "#div-unlocked"

  prepareJson: (json, callback) ->
    chrome.extension.getBackgroundPage().json = json

    chrome.tabs.getSelected null, (t) ->
      matched = []
      unmatched = []
      i = 0

      while i < json.length
        if json[i].type is "webform"
          if Cryptobox.form.sitename(json[i].address) is Cryptobox.form.sitename(t.url)
            matched.push json[i]
          else
            unmatched.push json[i]  if json[i].visible is true
        i++

      callback({ matched: matched, unmatched: unmatched })

$ ->
  chrome.extension.getBackgroundPage().clipboardCopyNum = 0

  delegate = new ChromeAppDelegate()
  app = new Cryptobox.App(delegate)
  app.run()
