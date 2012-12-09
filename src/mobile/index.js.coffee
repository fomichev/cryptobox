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
#= require dropbox.js.coffee
#= require handlebars.js.coffee
#= require mobile/templates.js

#= require app.js.coffee

class MobileAppDelegate extends Cryptobox.AppDelegate
  constructor: ->
    super()

  alert: (error, message) ->
    if message?
      $("#div-alert").html(message)
      $("#div-alert").show()
    else
      $("#div-alert").hide()

  shutdown: (preserve) ->
    # Ignore the `preserve` argument and don't preserve state.
    super(preserve)

    $.mobile.changePage "#div-locked", "slideup"

  render: (template, context) ->
    $("body").append Cryptobox.render(template, context)

    if template == 'locked'
      $.mobile.initializePage()

  state: (state) ->
    super(state)

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
    super()

    $("#div-locked").live "pageshow", (event, data) ->
      $(".generated").remove()

    $(".button-lock").live "click", (event) =>
      event.preventDefault()
      @shutdown(true)

    $(".button-login").live "click", =>
      el = $.parseJSON($(this).attr("json"))
      if Cryptobox.form.withToken(el.form)
        @alert true, "<%= @text[:no_login_with_token] %>"
      else
        Cryptobox.form.login true, el.form

$ ->
  delegate = new MobileAppDelegate()
  app = new Cryptobox.App(delegate)
  app.run()
