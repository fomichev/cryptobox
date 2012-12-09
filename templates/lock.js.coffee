# Class that implements auto locking on idle functionality.
class Lock
  # Create a new lock with `moveCallback` that is called when move is moved
  # and `timeoutCallback` that is called when lock `timeout` expires.
  constructor: (@moveCallback, @timeout, @timeoutCallback) ->
    @timeoutNow = 0
    @timeoutId = 0

  # Start auto lock (start counting down towards reaching timeout).
  start: ->
    dbg "Start lock"
    dbg this

    body = document.getElementsByTagName('body')[0]
    body.addEventListener('mousemove', @moveCallback)

    @timeoutNow = @timeout
    @timeoutId = window.setInterval =>
      dbg "Tick lock"

      @timeoutNow--

      if @timeoutNow <= 0
        @stop()
        @timeoutCallback()

      dbg this

    , 1000 * 60

  # Reset lock timeout. Mainly should be called from the `moveCallback`
  # to indicate that user still interacts with the application and we
  # don't need to lock it.
  rewind: ->
    dbg "Rewind lock"
    dbg this

    @timeoutNow = @timeout

  # Stop lock immediately.
  stop: ->
    dbg "Stop lock"
    dbg this

    clearInterval(@timeoutId)

# Export class.
window.Cryptobox.Lock = Lock
