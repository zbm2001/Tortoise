# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

scalaJSReadFromString = (str) ->
  try org.nlogo.tortoise.literal.Converter().nlStrToJS(str)
  catch ex
    throw new Error(ex.message)

scalaJSEvalCommand = (str) ->
  ???

scalaJSEvalReporter = (str) ->
  ???

module.exports.Config =
  class EvalConfig
    # ((String) => Unit, (String) => Any, (String) => Any) => EvalConfig
    constructor: (@evalCommand    = scalaJSEvalCommand
                , @evalReporter   = scalaJSEvalReporter
                , @readFromString = scalaJSReadFromString) ->
