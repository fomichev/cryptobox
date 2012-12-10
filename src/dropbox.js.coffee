# Class that is responsible for Dropbox integration.
class Cryptobox.Dropbox
  constructor: ->
    @client = null
    @ready = false
    @callback = null

  # Try to load Dropbox credentials from local storage.
  getCredentials: ->
    p "Dropbox.getCredentials"
    data = localStorage.getItem(@storageKey)
    try
      return JSON.parse(data)
    catch e
      return null

  # Store Dropbox credentials in the local storage.
  setCredentials: (data) ->
    p "Dropbox.setCredentials"
    localStorage.setItem(@storageKey, JSON.stringify(data))

  # Remove Dropbox credentials from the local storage.
  clearCredentials: ->
    p "Dropbox.clearCredentials"
    localStorage.removeItem(@storageKey)

  # Read `cryptobox.json` from the Dropbox and execute `callback` with this
  # file contents.
  read: (callback) ->
    timeout = 100
    p "Dropbox.read"
    if @ready is false
      if timeout-- and @client
        setTimeout (-> @read(callback)), 100
      else
        callback("Dropbox authentication error", null)
      return
    @client.readFile("cryptobox.json", callback)

  # Authenticate client in Dropbox.
  authenticate: (remember) ->
    p "Dropbox.authenticate"
    unless Cryptobox.json?
      @remember = remember
      unless remember
        console.log "Dropbox.authenticate - forget"
        @clearCredentials()
      unless @callback?
        console.log "Dropbox.authenticate - callback is null"

        # use save credentials 
        return
      @callback()

  # TODO
  prepare: (token_callback, auth_callback) ->
    unless Cryptobox.json?
      @client = new window.Dropbox.Client(
        key: "nEGVEjZUFiA=|o5O6VucOhZA5Fw39MGotRofoEXUIO0MjFU6dmDpYNA=="
        sandbox: true
      )
      @client.authDriver
        url: ->
          ""

        doAuthorize: (authUrl, token, tokenSecret, done) =>
          console.log "doAuthorize"
          console.log @getCredentials()
          console.log "use new"
          token_callback(authUrl)
          @callback = -> done()

        onAuthStateChange: (client, done) =>
          ERROR = 0
          RESET = 1
          REQUEST = 2
          AUTHORIZED = 3
          DONE = 4
          SIGNED_OFF = 5
          console.log "STATE=" + client.authState
          @storageKey = @client.appHash() + ":cryptobox.json"
          @ready = false
          if client.authState is RESET
            console.log "-> RESET"
            credentials = @getCredentials()
            console.log "credentials"
            console.log credentials
            return done()  unless credentials
            client.setCredentials(credentials)
            done()
          else if client.authState is REQUEST
            console.log "-> REQUEST"
            credentials = client.credentials()
            credentials.authState = AUTHORIZED
            @setCredentials(credentials)
            done()
          else if client.authState is DONE
            console.log "-> DONE"
            client.getUserInfo (error) =>
              if error
                client.reset()
                @clearCredentials()
              console.log "GOT USER INFO"
              if @remember
                credentials = @getCredentials()
                credentials.authState = DONE
                @setCredentials(credentials)
              else
                console.log "CLEAR"
                @clearCredentials()
              @ready = true
              done()

          else if client.authState is SIGNED_OFF
            console.log "-> SIGNED_OFF"
            @clearCredentials()
            done()
          else if client.authState is ERROR
            console.log "-> ERROR"
            @clearCredentials()
            @client = null
            done()
          else if client.authState is AUTHORIZED
            done()
          else
            console.log "-> ?"
            done()

      @client.authenticate (error, client) ->
        auth_callback error

  @instance: ->
    if Cryptobox.json?
      return null


    unless @__instance?
      @__instance = new Dropbox()

    @__instance
