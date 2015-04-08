# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Cloner = require('./cloner')

module.exports =
  if StrictMath? # Nashorn
    StrictMath
  else
    obj = Cloner(Math)
    # For functions that are not "close enough," or that don't exist in the browser, manually define them here!
    obj.max       = Math.max
    obj.min       = Math.min
    obj.toRadians = (degrees) -> degrees * Math.PI / 180
    obj.toDegrees = (radians) -> radians * 180 / Math.PI
    obj.PI        = -> Math.PI # Scala forces it to be a function in Nashorn, so it's a function here --JAB (4/8/15)
    obj
