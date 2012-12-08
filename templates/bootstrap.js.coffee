# This module contains common functionality shared between chrome extension
# and desktop HTML.

# Declare and export module namespace.
bootstrap = {}
window.Cryptobox.bootstrap = bootstrap

# Global internal counter (and id) for collapsible items.
bootstrap.__collapsibleId = 0

# Create and return string containing HTML for collapsible item. Value that
# is hidden or shown is passed via `value` and HTML snippet that contains
# copy\paste source is passed via `copy`.
bootstrap.collapsible = (value, copy) ->
  id = Cryptobox.bootstrap.__collapsibleId++;

  """
  "<button type="button" class="btn btn-mini" data-toggle="collapse" data-target="#collapsible-#{id}">
    <%= @text[:button_hide_reveal] %>
  </button>
  &nbsp;#{copy}
  <div id="collapsible-#{id}" class="collapse">#{value}</div>
  """

# Create bootstrap details from `map` and attach it to `entry` DOM element.
bootstrap.createDetails = (entry, map) ->
  items = $();
  $.each map, (k, v) ->
    items = items.add($('<dt>').html(k))
    items = items.add($('<dd>').html(v))

  $('<dl>', { 'class': 'dl-horizontal' }).html(items).appendTo(entry)

# Initialize filter functionality.
bootstrap.filterInit = ->
  $("#input-filter").keyup ->
    text = $("#input-filter").val().toLowerCase()

    if text == ""
      $("table").show()
      $("tr").show()
    else
      $("table").show()

      $("tr").hide()

      $("tr").filter(->
        return true if $('td:first', this).text().toLowerCase().indexOf(text) >= 0
        false
      ).show()

      $('div.active table').each ->
        $(this).hide() if $('tr:visible', this).length == 0

# Event handler for submit button of password dialog.
bootstrap.dialogGenerateSubmit = ->
  $("#intput-generated-password").val(Cryptobox.password.generate(
    $("#input-password-length").val(),
    $("#input-include-num").is(":checked"),
    $("#input-include-punc").is(":checked"),
    $("#input-include-uc").is(":checked"),
    $("#input-pronounceable").is(":checked")))

# Initialize auto lock.
bootstrap.lockInit = (moveCallback, timeout, timeoutCallback) ->
  cryptobox.lock = new Cryptobox.Lock(moveCallback, timeout, timeoutCallback)
  cryptobox.lock.start()

  $("#button-lock").click (event) ->
    event.preventDefault()
    timeoutCallback()

# Render and return `template` in given `context`.
bootstrap.render = (name, context) ->
  $('#content').hide()
  $('#content').html(Cryptobox.ui.render(name, context))
  $('#content').fadeIn()

# Show alert box with given `text`. If error is `true` alert background color
# is red, otherwise it blue.
bootstrap.showAlert = (error, text) ->
  if error
    $('#div-alert').addClass('alert-error')
  else
    $('#div-alert').addClass('alert-info')

  $("#div-alert").html(text)
  $("#div-alert").fadeIn()

# Hide alert box.
bootstrap.hideAlert = ->
  $('#div-alert').removeClass('alert-error')
  $('#div-alert').removeClass('alert-info')
  $("#div-alert").fadeOut()
