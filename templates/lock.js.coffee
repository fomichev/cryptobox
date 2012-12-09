# Class that implements auto locking.
class Lock
  # Create a new lock with `timeoutCallback` that is called when
  # lock `timeoutSec` expires.
  constructor: (@timeoutSec, @timeoutCallback) ->
    @timeoutNow = 0
    @timeoutId = 0

  # Start auto lock (start counting down towards reaching timeout).
  start: ->
    body = document.getElementsByTagName('body')[0]
    body.addEventListener('mousemove', => @rewind())

    clearInterval(@timeoutId) if @timeoutId != 0

    @timeoutNow = @timeoutSec
    @timeoutId = setInterval =>
      dbg "Tick lock"

      @timeoutNow--

      if @timeoutNow <= 0
        @stop()
        @timeoutCallback()

    , 1000 * 60

    p "Start lock #{@timeoutId}"

  # Reset lock timeout. Called when mouse has been moved to indicate that user
  # still interacts with the application and we don't need to lock it.
  rewind: ->
    @timeoutNow = @timeoutSec

  # Stop lock immediately.
  stop: ->
    p "Stop lock #{@timeoutId}"

    clearInterval(@timeoutId) if @timeoutId != 0
    @timeoutId = 0

# Export class.
window.Cryptobox.Lock = Lock
