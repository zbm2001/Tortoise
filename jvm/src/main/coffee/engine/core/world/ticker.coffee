# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Exception = require('util/exception')

EvilSentinel = -1

module.exports =
  class Ticker

    _count:   undefined # Number
    _onReset: undefined # () => Unit
    _onTick:  undefined # () => Unit

    # (() => Unit, () => Unit, (String*) => Unit) => Ticker
    constructor: (onReset, onTick, @_updateFunc) ->

      # You might make a fair argument that we don't want to entirely ignore errors
      # in on-tick/on-reset events, but we also certainly don't want to stop the entire
      # execution of the model for them, and, in my experience, they seem to come from
      # calculating values in widgets, which will be updated correctly soon enough.
      # So let's just log the errors and move on. --JAB (1/27/16)
      scaffoldOfIgnorance =
        (f) ->
          ->
            try f()
            catch ex
              console?.warn?("Proceeding despite error on tick-related event: ", ex)

      @_count   = EvilSentinel
      @_onReset = scaffoldOfIgnorance(onReset)
      @_onTick  = scaffoldOfIgnorance(onTick)

    # () => Unit
    reset: ->
      @_updateTicks(-> 0)
      @_onReset()
      @_onTick()
      return

    # () => Unit
    clear: ->
      @_updateTicks(-> EvilSentinel)
      return

    # () => Unit
    tick: ->
      if @ticksAreStarted()
        @_updateTicks((counter) -> counter + 1)
      else
        throw new Error("The tick counter has not been started yet. Use RESET-TICKS.")
      @_onTick()
      return

    # (Number) => Unit
    tickAdvance: (n) ->
      if n < 0
        throw new Error("Cannot advance the tick counter by a negative amount.")
      else if @ticksAreStarted()
        @_updateTicks((counter) -> counter + n)
      else
        throw new Error("The tick counter has not been started yet. Use RESET-TICKS.")

    # () => Boolean
    ticksAreStarted: ->
      @_count isnt EvilSentinel

    # () => Number
    tickCount: ->
      if @ticksAreStarted()
        @_count
      else
        throw new Error("The tick counter has not been started yet. Use RESET-TICKS.")

    # ((Number) => Number) => Unit
    _updateTicks: (updateCountFunc) ->
      @_count = updateCountFunc(@_count)
      @_updateFunc("ticks")
      return
