#= require extern/jquery/jquery.js
#= require mobile/jquery.mobile.js.coffee
#= require extern/jquery.mobile/jquery.mobile.js
#= require extern/handlebars/handlebars.runtime.js

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
#= require handlebars.js.coffee
#= require mobile/templates.js

#= require app.js.coffee

cryptobox.main = {}
Cryptobox.main = {}
cryptobox.main.lock = ->
  cryptobox.lock.stop()
  $.mobile.changePage "#div-locked", "slideup"
  cryptobox.main.prepare()
  $("#input-password").focus()

cryptobox.main.render = (name, context) ->
  $("body").append Cryptobox.ui.render(name, context)

cryptobox.main.prepare = ->
  cryptobox.dropbox.prepare ((url) ->
    Cryptobox.main.showAlert false, "Dropbox authentication required: <p><a href=\"" + url + "\" target=\"_blank\">" + url + "</a></p>"
  ), (error) ->
    if error
      Cryptobox.main.showAlert true, "Dropbox authentication error"
    else
      Cryptobox.main.showAlert false, "Successfully restored Dropbox credentials"


Cryptobox.main.showAlert = (error, text) ->
  $("#div-alert").html text
  $("#div-alert").show()

Cryptobox.main.hideAlert = ->
  $("#div-alert").hide()

class MobileAppDelegate extends Cryptobox.AppDelegate
  constructor: ->
    super()

  render: (template, context) ->
    $("body").append Cryptobox.ui.render(template, context)

    if template == 'locked'
      $.mobile.initializePage()

  alert: (error, message) ->
    if message
      Cryptobox.main.showAlert(error, message)
    else
      Cryptobox.main.hideAlert()

  state: (state) ->
    switch state
      when Cryptobox.App::STATE_LOCKED
        $('#button-unlock').val('<%= @text[:button_unlock] %>')
        $("#button-unlock").button("refresh")
      when Cryptobox.App::STATE_LOADING
        $('#button-unlock').val('<%= @text[:button_unlock_decrypt] %>')
        $("#button-unlock").button("refresh")
      when Cryptobox.App::STATE_UNLOCKED
        $('#button-unlock').val('<%= @text[:button_unlock] %>')
        $("#button-unlock").button("refresh")

        $.mobile.changePage("#div-main")

  prepare: ->
    p 'here'
    cryptobox.main.prepare()
    p 'there'

    cryptobox.lock = new Cryptobox.Lock(
      -> cryptobox.lock.rewind(),
      cryptobox.config.lock_timeout_minutes,
      cryptobox.main.lock)

    $("#div-locked").live "pageshow", (event, data) ->
      $(".generated").remove()

    $(".button-lock").live "click", (event) ->
      event.preventDefault()
      cryptobox.main.lock()

    $(".button-login").live "click", ->
      el = $.parseJSON($(this).attr("json"))
      if Cryptobox.form.withToken(el.form)
        Cryptobox.main.showAlert true, "<%= @text[:no_login_with_token] %>"
      else
        Cryptobox.form.login true, el.form

$ ->
  delegate = new MobileAppDelegate()
  app = new Cryptobox.App(delegate)
  app.run()
