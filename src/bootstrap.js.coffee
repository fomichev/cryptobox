# This module contains common functionality shared between chrome extension
# and desktop HTML and uses Twitter Bootstrap framework.

# Initialize filter functionality.
filterInit = ->
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

class Cryptobox.BootstrapAppDelegate extends Cryptobox.AppDelegate
  prepare: ->
    super()

    $("#button-lock").live "click", (event) =>
      event.preventDefault()
      @shutdown(false)

  state: (state) ->
    super(state)

    switch state
      when Cryptobox.App::STATE_LOCKED
        $('#button-unlock').button('reset')
      when Cryptobox.App::STATE_LOADING
        $('#button-unlock').button('loading')
      when Cryptobox.App::STATE_UNLOCKED
        $('#button-unlock').button('reset')

        filterInit()

  render: (template, context) ->
    $('#content').hide()
    $('#content').html(Cryptobox.render(template, context))
    $('#content').fadeIn()

  alert: (error, message) ->
    if message
      if error
        $('#div-alert').addClass('alert-error')
      else
        $('#div-alert').addClass('alert-info')

      $("#div-alert").html(message)
      $("#div-alert").fadeIn()
    else
      $('#div-alert').removeClass('alert-error')
      $('#div-alert').removeClass('alert-info')
      $("#div-alert").fadeOut()

  # STATIC METHODS #

  # Global internal counter (and id) for collapsible items.
  @__collapsibleId: 0

  # Create and return string containing HTML for collapsible item. Value that
  # is hidden or shown is passed via `value` and HTML snippet that contains
  # copy\paste source is passed via `copy`.
  @collapsible = (value, copy) ->
    id = @__collapsibleId++;

    """
    <button type="button" class="btn btn-mini" data-toggle="collapse" data-target="#collapsible-#{id}">
      <%= @text[:button_hide_reveal] %>
    </button>
    &nbsp;#{copy}
    <div id="collapsible-#{id}" class="collapse">#{value}</div>
    """

  # Create bootstrap details from `map` and attach it to `entry` DOM element.
  @createDetails = (entry, map) ->
    items = $();
    $.each map, (k, v) ->
      items = items.add($('<dt>').html(k))
      items = items.add($('<dd>').html(v))

    $('<dl>', { 'class': 'dl-horizontal' }).html(items).appendTo(entry)

  # Event handler for submit button of password dialog.
  @dialogGenerateSubmit = ->
    $("#intput-generated-password").val(Cryptobox.Password.generate(
      $("#input-password-length").val(),
      $("#input-include-num").is(":checked"),
      $("#input-include-punc").is(":checked"),
      $("#input-include-uc").is(":checked")))
