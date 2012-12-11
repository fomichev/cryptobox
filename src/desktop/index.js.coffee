#= require extern/jquery/jquery.js
#= require extern/bootstrap/js/bootstrap.js
#= require extern/handlebars/handlebars.runtime.js
#
#= require extern/seedrandom/seedrandom.js
#= require extern/CryptoJS/components/core.js
#= require extern/CryptoJS/components/enc-base64.js
#= require extern/CryptoJS/components/cipher-core.js
#= require extern/CryptoJS/components/aes.js
#= require extern/CryptoJS/components/sha1.js
#= require extern/CryptoJS/components/hmac.js
#= require extern/CryptoJS/components/pbkdf2.js
#
#= require cryptobox.js.coffee
#= require lock.js.coffee
#= require form.js.coffee
#= require dropbox.js.coffee
#= require password.js.coffee
#= require handlebars.js.coffee
#= require desktop/templates.js
#= require app.js.coffee
#= require bootstrap.js.coffee

# Create HTML snippet which uses clippy to copy `text` into clipboard.
copyToClipboard = (text) ->
  path = "clippy.swf"
  """
  <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="110"
          height="14">
  <param name="movie" value="#{path}/>
  <param name="allowScriptAccess" value="always" />
  <param name="quality" value="high" />
  <param name="scale" value="noscale" />
  <param name="FlashVars" value="text=##{text}">
  <param name="bgcolor" value="#fff">
  <embed src="#{path}" width="110" height="14" name="clippy"
         quality="high" allowScriptAccess="always"
         type="application/x-shockwave-flash"
         pluginspage="http://www.macromedia.com/go/getflashplayer"
         FlashVars="text=#{text}" bgcolor="#fff" />
  </object>
  """

# Handle row header click event.
headerClick = (el) ->
  if Cryptobox.Form.withToken(el.form)
    $("#button-token").attr "href", el.form.action
    $("#div-token").modal()
  else
    Cryptobox.Form.login(true, el.form)

# Handle row details click event.
detailsClick = (el) ->
  if el.type is "webform"
    $("#div-details .modal-body").html ""
    values =
      "<%= @text[:address] %>:": $("<a>",
        target: "_blank"
        href: el.address
      ).text(el.address)
      "<%= @text[:username] %>:":
        Cryptobox.BootstrapAppDelegate.collapsible(el.form.vars.user,
        copyToClipboard(el.form.vars.user))
      "<%= @text[:password] %>:":
        Cryptobox.BootstrapAppDelegate.collapsible(el.form.vars.pass,
        copyToClipboard(el.form.vars.pass))

    values["<%= @text[:secret] %>"] = Cryptobox.addBr(forms.vars.secret)  if el.form.vars.secret
    values["<%= @text[:note] %>"] = Cryptobox.addBr(forms.vars.note)  if el.form.vars.note
    Cryptobox.BootstrapAppDelegate.createDetails $("#div-details .modal-body"), values
  else
    $("#div-details .modal-body").html el.text
  $("#div-details .modal-header h3").text el.name
  $("#div-details").modal()

# Initialize password generation dialog.
dialogGenerateInit = ->
  $("#button-generate-show").click (event) ->
    event.preventDefault()
    $("#div-generate").modal()

  $("#button-generate").click ->
    Cryptobox.BootstrapAppDelegate.dialogGenerateSubmit()

  $("#div-generate").keydown (event) ->
    Cryptobox.BootstrapAppDelegate.dialogGenerateSubmit() if event.keyCode is 13

# Handle submit event of token login dialog.
dialogTokenLoginSubmit = (url, name, keys, values, tokens) ->
  tokenJson = $.parseJSON($("#input-json").val())
  return  if not tokenJson or tokenJson is ""
  $("#input-json").val ""
  $("#div-token").modal "hide"
  formLogin true, el.form, tokenJson

# Initialize token login dialog.
dialogTokenLoginInit = ->
  $("#button-token-login").click ->
    dialogTokenLoginSubmit url, name, keys, values, tokens

  $("#div-token").keydown (event) ->
    dialogTokenLoginSubmit url, name, keys, values, tokens if event.keyCode is 13

class DesktopAppDelegate extends Cryptobox.BootstrapAppDelegate
  state: (state) ->
    super

    switch state
      when Cryptobox.App::STATE_UNLOCKED
        # try to select Sites tab; otherwise select first one
        if ($('div.tab-pane[id="webform"]'))
          $('div.tab-pane[id="webform"]').addClass('in').addClass('active')
          $('#ul-nav li a[href="#webform"]').parent().addClass('active')
        else
          $('div.tab-pane:first').addClass('in').addClass('active')
          $('#ul-nav li:first').addClass('active')

        dialogTokenLoginInit()
        dialogGenerateInit()

  prepare: ->
    super

    $('.button-login').live 'click', ->
      el = $.parseJSON($(this).parent().parent().attr('json'))
      headerClick(el)

    $('.button-details').live 'click', ->
      el = $.parseJSON($(this).parent().parent().attr('json'))
      detailsClick(el)

  shutdown: ->
    $("#div-token").modal("hide")
    $("#div-details").modal("hide")
    $("#div-generate").modal("hide")

    super

$ ->
  delegate = new DesktopAppDelegate()
  app = new Cryptobox.App(delegate)
  app.run()
