# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('engine.core.topology.torus')

goog.require('engine.core.topology.topology')
goog.require('shim.lodash')
goog.require('shim.strictmath')

  class Torus extends Topology

    _wrapInX: true # Boolean
    _wrapInY: true # Boolean

    # (Number) => Number
    wrapX: (pos) ->
      @_wrap(pos, @minPxcor - 0.5, @maxPxcor + 0.5)

    # (Number) => Number
    wrapY: (pos) ->
      @_wrap(pos, @minPycor - 0.5, @maxPycor + 0.5)

    # (String, Number) => Unit
    diffuse: (varName, coefficient) ->
      scratch = _(0).range(@width).map(-> []).value()

      @_getPatches().forEach((patch) =>
        scratch[patch.pxcor - @minPxcor][patch.pycor - @minPycor] = patch.getVariable(varName)
        return
      )

      @_getPatches().forEach((patch) =>
        pxcor = patch.pxcor
        pycor = patch.pycor
        # We have to order the neighbors exactly how Torus.java:diffuse does them so we don't get floating discrepancies.  FD 10/19/2013
        orderedNeighbors =
          [@_getPatchSouthWest(pxcor, pycor), @_getPatchWest(pxcor, pycor),
           @_getPatchNorthWest(pxcor, pycor), @_getPatchSouth(pxcor, pycor),
           @_getPatchNorth(pxcor, pycor), @_getPatchSouthEast(pxcor, pycor),
           @_getPatchEast(pxcor, pycor), @_getPatchNorthEast(pxcor, pycor)]
        diffusalSum = _(orderedNeighbors).map((nb) => scratch[nb.pxcor - @minPxcor][nb.pycor - @minPycor]).reduce((acc, x) -> acc + x)
        patch.setVariable(varName, patch.getVariable(varName) * (1.0 - coefficient) + (diffusalSum / 8) * coefficient)
        return
      )

      return


    # (Number, Number) => Patch|Boolean
    _getPatchNorth: (pxcor, pycor) ->
      if pycor is @maxPycor
        @_getPatchAt(pxcor, @minPycor)
      else
        @_getPatchAt(pxcor, pycor + 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouth: (pxcor, pycor) ->
      if pycor is @minPycor
        @_getPatchAt(pxcor, @maxPycor)
      else
        @_getPatchAt(pxcor, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchEast: (pxcor, pycor) ->
      if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor)
      else
        @_getPatchAt(pxcor + 1, pycor)

    # (Number, Number) => Patch|Boolean
    _getPatchWest: (pxcor, pycor) ->
      if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor)
      else
        @_getPatchAt(pxcor - 1, pycor)

    # (Number, Number) => Patch|Boolean
    _getPatchNorthWest: (pxcor, pycor) ->
      if pycor is @maxPycor
        if pxcor is @minPxcor
          @_getPatchAt(@maxPxcor, @minPycor)
        else
          @_getPatchAt(pxcor - 1, @minPycor)
      else if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor + 1)
      else
        @_getPatchAt(pxcor - 1, pycor + 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouthWest: (pxcor, pycor) ->
      if pycor is @minPycor
        if pxcor is @minPxcor
          @_getPatchAt(@maxPxcor, @maxPycor)
        else
          @_getPatchAt(pxcor - 1, @maxPycor)
      else if pxcor is @minPxcor
        @_getPatchAt(@maxPxcor, pycor - 1)
      else
        @_getPatchAt(pxcor - 1, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchSouthEast: (pxcor, pycor) ->
      if pycor is @minPycor
        if pxcor is @maxPxcor
          @_getPatchAt(@minPxcor, @maxPycor)
        else
          @_getPatchAt(pxcor + 1, @maxPycor)
      else if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor - 1)
      else
        @_getPatchAt(pxcor + 1, pycor - 1)

    # (Number, Number) => Patch|Boolean
    _getPatchNorthEast: (pxcor, pycor) ->
      if pycor is @maxPycor
        if pxcor is @maxPxcor
          @_getPatchAt(@minPxcor, @minPycor)
        else
          @_getPatchAt(pxcor + 1, @minPycor)
      else if pxcor is @maxPxcor
        @_getPatchAt(@minPxcor, pycor + 1)
      else
        @_getPatchAt(pxcor + 1, pycor + 1)

    # (Number, Number) => Number
    _shortestX: (x1, x2) ->
      if StrictMath.abs(x1 - x2) > @width / 2
        (@width - StrictMath.abs(x1 - x2)) * (if x2 > x1 then -1 else 1)
      else
        Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)

    # (Number, Number) => Number
    _shortestY: (y1, y2) ->
      if StrictMath.abs(y1 - y2) > @height / 2
        (@height - StrictMath.abs(y1 - y2)) * (if y2 > y1 then -1 else 1)
      else
        Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
