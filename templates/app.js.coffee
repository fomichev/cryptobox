# Class that implements framework specific behavior.
class AppDelegate
  constructor: ->
    p 'Initialize application delegate'

  # Return application lock.
  #lock: ->
  #  null

  # Prepare event handlers.
  prepare: ->

  # Render `template` with given `context`.
  render: (template, context) ->

  # Show alert box with given `message`. When `error` is true, the background
  # of alert box should be highlighted in red. When `message` is `null`, hide
  # alert box.
  alert: (error, message) ->

  # Notify delegate when application state is changed.
  state: (state) ->

  # Return data from saved session (may be used to preserve state between
  # multiple runs).
  restoreSession: ->
    null

  # Process cryptobox.json for handling and return object to be used
  # as handlebars context. `callback` is called with the context after
  # processing.
  prepareJson: (json, callback) ->
    callback({ page: Cryptobox.ui.init(json) })

# Class that implements main application instance.
class App
  STATE_LOCKED: 1
  STATE_LOADING: 2
  STATE_UNLOCKED: 3

  # Initialize application with `delegate`.
  constructor: (@delegate) ->
    p 'Initialize application'

  # Unlock cryptobox with given `cryptobox.json` data.
  unlock: (json) ->
    @delegate.prepareJson json, (context) =>
      @delegate.render('unlocked', context)

      $("#input-password").val("")
      $("#input-filter").focus()

      @delegate.state(@STATE_UNLOCKED)

  # Run application.
  run: ->
    @delegate.prepare()

    json = @delegate.restoreSession()
    if json
      @unlock(json)
    else
      @delegate.render('locked', this)
      $("#input-password").focus()

      @delegate.state(@STATE_LOCKED)

      $("#form-unlock").live 'submit', (event) =>
        event.preventDefault()

        cryptobox.dropbox.authenticate($("#input-remember").is(':checked'))

        @delegate.alert(false, null)
        @delegate.state(@STATE_LOADING)

        Cryptobox.open $("#input-password").val(), (json, error) =>
          if error
            @delegate.alert(true, error)
            @delegate.state(@STATE_LOCKED)
          else
            @unlock(json)

# Export class.
window.Cryptobox.App = App
window.Cryptobox.AppDelegate = AppDelegate
