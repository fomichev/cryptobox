class window.Cryptobox.Lock
  constructor: (@onMove, @timeout, @lockCallback) ->
    @timeoutNow = 0
    @timeoutId = 0

  start: ->
    #console.log "Start lock"
    #console.log this

    body = document.getElementsByTagName('body')[0]
    body.addEventListener('mousemove', @onMove)

    @timeoutNow = @timeout
    @timeoutId = window.setInterval =>
      #console.log "Tick lock"

      @timeoutNow--

      if @timeoutNow <= 0
        @stop()
        @lockCallback()

      #console.log this

    #, 1000
    , 1000 * 60

  rewind: ->
    #console.log "Rewind lock"
    #console.log this

    @timeoutNow = @timeout

  stop: ->
    #console.log "Stop lock"
    #console.log this

    clearInterval(@timeoutId)
