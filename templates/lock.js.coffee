# Class that implements auto locking on idle functionality.
class window.Cryptobox.Lock

  # Class constructor which requires callback (`moveCallback`) which is called
  # when mouse has been moved to update the lock and `timeout` which will
  # trigger `timeoutCallback` when the lock expires.
  constructor: (@moveCallback, @timeout, @timeoutCallback) ->
    @timeoutNow = 0
    @timeoutId = 0

  # Start auto lock (counting down towards reaching timeout).
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

  # Start lock again with programmed timeout. Mainly, should be called from
  # the `moveCallback` to update the lock.
  rewind: ->
    dbg "Rewind lock"
    dbg this

    @timeoutNow = @timeout

  # Stop lock immediately.
  stop: ->
    dbg "Stop lock"
    dbg this

    clearInterval(@timeoutId)
