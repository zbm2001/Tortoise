# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class WorldConfig
  # Unit -> Unit
  constructor: (@resizeWorld = (->)) ->

Dump             = require('./dump')
Hasher           = require('./hasher')
readNetLogoValue = require('./readnetlogovalue')
Updater          = require('./updater')
BreedManager     = require('./core/breedmanager')
World            = require('./core/world')
SelfManager      = require('./core/structure/selfmanager')
PlotManager      = require('./plot/plotmanager')
LayoutManager    = require('./prim/layoutmanager')
LinkPrims        = require('./prim/linkprims')
ListPrims        = require('./prim/listprims')
Prims            = require('./prim/prims')
SelfPrims        = require('./prim/selfprims')
convertCSV       = require('util/worldcsvtojson')
RNG              = require('util/rng')
Timer            = require('util/timer')

{ Config: ExportConfig,     Prims: ExportPrims }     = require('./prim/exportprims')
{ Config: MouseConfig,      Prims: MousePrims }      = require('./prim/mouseprims')
{ Config: OutputConfig,     Prims: OutputPrims }     = require('./prim/outputprims')
{ Config: PrintConfig,      Prims: PrintPrims }      = require('./prim/printprims')
{ Config: UserDialogConfig, Prims: UserDialogPrims } = require('./prim/userdialogprims')

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
      { globals, links, patches, plots, output, turtles } = worldState

      # We can safely do breeds beforehand, but not labels or variables or link ends --JAB (4/6/17)
      for turtle in turtles
        turtle.breed = readFromString(turtle.breed)

      for link in links
        link.breed = readFromString(link.breed)

      reifyLinkEnds = (linkState) ->
        for link in linkState
          link.end1 = readFromString(link.end1)
          link.end2 = readFromString(link.end2)
        return

      world.importState(worldState, reifyLinkEnds, readFromString)

      for turtle in turtles
        trueTurtle = world.turtleManager.getTurtle(turtle.who)
        pairs      = Object.keys(turtle.extraVars).map((k) -> [k, turtle.extraVars[k]])
        mappings   = pairs.concat([['label', turtle.label]])
        mappings.forEach(([key, value]) -> trueTurtle.setVariable(key, readFromString(value)))

      for patch in patches
        truePatch = world.getPatchAt(patch.pxcor, patch.pycor)
        pairs     = Object.keys(patch.extraVars).map((k) -> [k, patch.extraVars[k]])
        mappings  = pairs.concat([['plabel', patch.plabel]])
        mappings.forEach(([key, value]) -> truePatch.setVariable(key, readFromString(value)))

      for link in links
        trueLink = world.linkManager.getLink(link.end1.id, link.end2.id, link.breed.name)
        pairs    = Object.keys(link.extraVars).map((k) -> [k, link.extraVars[k]])
        mappings = pairs.concat([['label', link.label]])
        mappings.forEach(([key, value]) -> trueLink.setVariable(key, readFromString(value)))

      plotManager.importState(plots)
      outputConfig.write(output)

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
