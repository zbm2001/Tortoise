# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class WorldConfig
  # Unit -> Unit
  constructor: (@resizeWorld = (->)) ->

Dump          = require('./dump')
Hasher        = require('./hasher')
Updater       = require('./updater')
BreedManager  = require('./core/breedmanager')
Nobody        = require('./core/nobody')
World         = require('./core/world')
SelfManager   = require('./core/structure/selfmanager')
PlotManager   = require('./plot/plotmanager')
LayoutManager = require('./prim/layoutmanager')
LinkPrims     = require('./prim/linkprims')
ListPrims     = require('./prim/listprims')
Prims         = require('./prim/prims')
SelfPrims     = require('./prim/selfprims')
convertCSV    = require('util/worldcsvtojson')
RNG           = require('util/rng')
Timer         = require('util/timer')

{ Config: ExportConfig,     Prims: ExportPrims }     = require('./prim/exportprims')
{ Config: MouseConfig,      Prims: MousePrims }      = require('./prim/mouseprims')
{ Config: OutputConfig,     Prims: OutputPrims }     = require('./prim/outputprims')
{ Config: PrintConfig,      Prims: PrintPrims }      = require('./prim/printprims')
{ Config: UserDialogConfig, Prims: UserDialogPrims } = require('./prim/userdialogprims')


# Should be replaced with `read-from-string` when we have it. --JAB (4/6/17)
#
# ((String, Number) => Turtle, (Number, Number) => Patch, (Number, Number, String) => Link, (String) => Breed, (String) => Breed) => (String) => (() => Any)
readNetLogoValue = (getTurtle, getPatchAt, getLink, getBreed, getBreedSingular) -> (x) ->

  lowerCased = x.toLowerCase()

  pass = (x) -> { value: x, success: true  }
  fail =        {           success: false }

  result =
    switch lowerCased
      when "e"         then pass(Math.E)
      when "pi"        then pass(Math.PI)
      when "true"      then pass(true)
      when "false"     then pass(false)
      when "nobody"    then pass(Nobody)
      when "black"     then pass(  0)
      when "gray"      then pass(  5)
      when "white"     then pass(9.9)
      when "red"       then pass( 15)
      when "orange"    then pass( 25)
      when "brown"     then pass( 35)
      when "yellow"    then pass( 45)
      when "green"     then pass( 55)
      when "lime"      then pass( 65)
      when "turquoise" then pass( 75)
      when "cyan"      then pass( 85)
      when "sky"       then pass( 95)
      when "blue"      then pass(105)
      when "violet"    then pass(115)
      when "magenta"   then pass(125)
      when "pink"      then pass(135)
      else fail

  if result is fail
    evalWrapper =
      try pass(eval(x))
      catch ex
        fail
    if evalWrapper isnt fail
      evalled = evalWrapper.value
      if typeof(evalled) is "number" or typeof(evalled) is "string"
        evalled
      else
        throw new Error("Successfully used `eval` on #{x} to make #{evalled}, but I don't know what that is.")
    else # Not string, not number
      listMatch = x.match(/^\[.*\]$/)
      if listMatch?
        throw new Error("You supplied the list or lambda #{x}, and there's no chance that I'm parsing that!")
      else # Not a list

        breedNameWrapper =
          switch x
            when "{all-turtles}" then pass("TURTLES")
            when "{all-patches}" then pass("PATCHES")
            when "{all-links}"   then pass("LINKS")
            else
              breedMatches = lowerCased.match(/{breed (.*)}/)
              if breedMatches?
                pass(breedMatches[1].toUpperCase())
              else
                fail

        if breedNameWrapper isnt fail
          getBreed(breedNameWrapper.value)
        else # Not a breed set
          patchMatch = lowerCased.match(/{patch (\d+) (\d+)}/)
          if patchMatch?
            [_, xStr, yStr] = patchMatch
            getPatchAt(parseInt(xStr), parseInt(yStr))
          else # Not a patch
            linkMatch = lowerCased.match(/{([^ ]+) (\d+) (\d+)}/)
            if linkMatch?
              [_, breedName, end1IDStr, end2IDStr] = linkMatch
              getLink(parseInt(end1IDStr), parseInt(end2IDStr), getBreedSingular(breedName).name)
            else # Not a link
              turtleMatch = lowerCased.match(/{([^ ]+) (\d+)}/)
              if turtleMatch?
                [_, breedName, idStr] = turtleMatch
                getTurtle(getBreedSingular(breedName).name, parseInt(idStr))
              else # Not a turtle
                throw new Error("You supplied #{x}, and I don't know what the heck that is!")

  else
    result.value

class MiniWorkspace
  # (SelfManager, Updater, BreedManager, RNG, PlotManager) => MiniWorkspace
  constructor: (@selfManager, @updater, @breedManager, @rng, @plotManager) ->

module.exports =
  (modelConfig) -> (breedObjs) -> (turtlesOwns, linksOwns) -> () -> # World args; see constructor for `World` --JAB (4/17/14)

    worldArgs = arguments # If you want `Workspace` to take more parameters--parameters not related to `World`--just keep returning new functions

    dialogConfig  = modelConfig?.dialog    ? new UserDialogConfig
    exportConfig  = modelConfig?.exporting ? new ExportConfig
    mouseConfig   = modelConfig?.mouse     ? new MouseConfig
    outputConfig  = modelConfig?.output    ? new OutputConfig
    plots         = modelConfig?.plots     ? []
    printConfig   = modelConfig?.print     ? new PrintConfig
    worldConfig   = modelConfig?.world     ? new WorldConfig

    rng         = new RNG

    selfManager  = new SelfManager
    breedManager = new BreedManager(breedObjs, turtlesOwns, linksOwns)
    plotManager  = new PlotManager(plots)
    prims        = new Prims(Dump, Hasher, rng)
    selfPrims    = new SelfPrims(selfManager.self)
    timer        = new Timer
    updater      = new Updater

    world           = new World(new MiniWorkspace(selfManager, updater, breedManager, rng, plotManager), worldConfig, worldArgs...)
    layoutManager   = new LayoutManager(world, rng.nextDouble)

    linkPrims       = new LinkPrims(world)
    listPrims       = new ListPrims(Hasher, prims.equality.bind(prims), rng.nextInt)

    exportPrims     = new ExportPrims(exportConfig)
    mousePrims      = new MousePrims(mouseConfig)
    outputPrims     = new OutputPrims(outputConfig, Dump)
    printPrims      = new PrintPrims(printConfig, Dump)
    userDialogPrims = new UserDialogPrims(dialogConfig)

    readFromString =
      readNetLogoValue(
        world.turtleManager.getTurtleOfBreed.bind(world.turtleManager)
      , world.getPatchAt.bind(world)
      , world.linkManager.getLink.bind(world.linkManager)
      , breedManager.get.bind(breedManager)
      , breedManager.getSingular.bind(breedManager)
      )

    # There's something funky going on here, for sure.  You might wonder why we have to run `readFromString` at such weird times.
    # Well, it's a bit tricky, actually.  Imagine, however, that we have an `export-world` file where `turtle 0` has `turtle 1` as its
    # label, and vice versa.  If we try to reify the values up front, we'll fail to retrieve both turtles, since no turtles have actually
    # been imported into the world yet.  If we try to reify them when we create the turtles, we'll run into a problem where the first one
    # instantiated won't have its label's turtle instantiated yet.  So we need to run this after the rest of the world has been set up. --JAB (4/6/17)
    importWorld = (importFile) =>

      worldState = convertCSV()

      # We can safely do breeds beforehand, but not labels or variables or link ends --JAB (4/6/17)
      for turtle in worldState.TURTLES
        turtle.breed = readFromString(turtle.breed)

      for link in worldState.LINKS
        link.breed = readFromString(link.breed)

      reifyLinkEnds = (linkState) ->
        for link in linkState
          link.end1 = readFromString(link.end1)
          link.end2 = readFromString(link.end2)
        return

      world.importWorld(worldState, reifyLinkEnds, readFromString)

      for turtle in worldState.TURTLES
        trueTurtle = world.turtleManager.getTurtle(turtle.who)
        pairs      = Object.keys(turtle.extraVars).map((k) -> [k, turtle.extraVars[k]])
        mappings   = pairs.concat([['label', turtle.label]])
        mappings.forEach(([key, value]) -> trueTurtle.setVariable(key, readFromString(value)))

      for patch in worldState.PATCHES
        truePatch = world.getPatchAt(patch.pxcor, patch.pycor)
        pairs     = Object.keys(patch.extraVars).map((k) -> [k, patch.extraVars[k]])
        mappings  = pairs.concat([['plabel', patch.plabel]])
        mappings.forEach(([key, value]) -> truePatch.setVariable(key, readFromString(value)))

      for link in worldState.LINKS
        trueLink = world.linkManager.getLink(link.end1.id, link.end2.id, link.breed.name)
        pairs    = Object.keys(link.extraVars).map((k) -> [k, link.extraVars[k]])
        mappings = pairs.concat([['label', link.label]])
        mappings.forEach(([key, value]) -> trueLink.setVariable(key, readFromString(value)))

      plotManager.importPlots(worldState)
      outputConfig.write(worldState["OUTPUT"])

    {
      selfManager
      breedManager
      exportPrims
      layoutManager
      linkPrims
      listPrims
      mousePrims
      outputPrims
      plotManager
      prims
      printPrims
      rng
      selfPrims
      timer
      updater
      userDialogPrims
      world
      importWorld
    }
