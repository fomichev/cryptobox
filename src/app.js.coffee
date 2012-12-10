# Class that implements framework specific behavior. This basic implementation
# includes auto-lock functionality and used as a base class for all delegates.
class Cryptobox.AppDelegate
  constructor: ->

  # Application delegate should call this method whenever it wants to shutdown
  # the application (lock it).
  shutdown: (preserve) ->
    @alert(false, null)
    @render("locked", this)
    @state(Cryptobox.App::STATE_LOCKED)

  # Notify delegate that it should prepare event handlers.
  prepare: ->
    @lock = new Cryptobox.Lock(Cryptobox.config.lock_timeout_minutes,
                               => @shutdown(true))

  # Notify delegate when application state is changed.
  state: (state) ->
    switch state
      when Cryptobox.App::STATE_LOCKED
        @lock.stop()

        p 'focus input field'
        $("#input-password").focus()

        Cryptobox.Dropbox.instance()?.prepare ((url) =>
          @alert false, "Dropbox authentication required: <p><a href=\"#{url}\" target=\"_blank\">#{url}</a></p>"
        ), (error) ->
          if error
            @alert true, "Dropbox authentication error"
          else
            @alert false, "Successfully restored Dropbox credentials"
      when Cryptobox.App::STATE_UNLOCKED
        @lock.start()

  # Do some application specific processing of `cryptobox.json` and call
  # `callback` with the context afterwards.
  prepareJson: (json, callback) ->
    result = []
    Cryptobox.measure "ui.init", ->
      map = {}
      pages = {}

      for el, index in json
        continue  if el.visible is false
        pages[el.type] = {}  unless el.type of pages
        pages[el.type][el.tag] = []  unless el.tag of pages[el.type]
        el.id = index
        pages[el.type][el.tag].push el

      for page_key of pages
        p =
          id: page_key
          name: Cryptobox.config.i18n.page[page_key]
          tag: []

        for tag_key of pages[page_key]
          p.tag.push
            name: tag_key
            item: pages[page_key][tag_key]

        p.tag.sort (a, b) ->
          a.name > b.name

        result.push p

      result.sort (a, b) ->
        a.name > b.name

    callback({ page: result })

  # Return preserved `cryptobox.json` data from saved session (may be used to
  # preserve state between multiple runs).
  restore: ->
    null

  # Render `template` with given `context`.
  render: (template, context) ->

  # Show alert box with given `message`. When `error` is true, the background
  # of alert box should be highlighted in red (or use some other way to
  # indicate error condition). When `message` is `null`, hide the alert box.
  alert: (error, message) ->

# Class that implements main application instance.
class Cryptobox.App
  # Application has been locked.
  STATE_LOCKED: 1
  # Application has been unlocked and will start decrypting data.
  STATE_LOADING: 2
  # Application has been unlocked.
  STATE_UNLOCKED: 3

  # Initialize application with `delegate`.
  constructor: (@delegate) ->
    p 'Initialize application'

  # Unlock cryptobox with given `cryptobox.json` data. This is private method
  # and should not be called.
  unlock: (json) ->
    @delegate.prepareJson json, (context) =>
      @delegate.render('unlocked', context)

      $("#input-password").val("")
      $("#input-filter").focus()

      @delegate.state(@STATE_UNLOCKED)

  # Run application.
  run: ->
    @delegate.prepare()

    json = @delegate.restore()
    if json
      @unlock(json)
    else
      @delegate.render('locked', this)
      @delegate.state(@STATE_LOCKED)

      $("#form-unlock").live 'submit', (event) =>
        event.preventDefault()

        Cryptobox.Dropbox.instance()?.authenticate($("#input-remember").is(':checked'))

        @delegate.alert(false, null)
        @delegate.state(@STATE_LOADING)

        Cryptobox.open $("#input-password").val(), (json, error) =>
          if error
            @delegate.alert(true, error)
            @delegate.state(@STATE_LOCKED)
          else
            @unlock(json)
