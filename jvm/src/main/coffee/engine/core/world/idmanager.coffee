# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class IDManager

    # Number
    _count: undefined

    # () => IDManager
    constructor: ->
      @reset()

    # () => Unit
    reset: ->
      @_count = 0
      return

    # Number
    next: ->
      @_count++

    # (Number) => Unit
    setNextIndex: (nextIndex) ->
      @_count = nextIndex
      return

    # (() => Any) => Unit
    suspendDuring: (f) ->
      oldCount = @_count
      f()
      @_count = oldCount
      return
