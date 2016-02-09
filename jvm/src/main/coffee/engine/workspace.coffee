# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Dump          = require('./dump')
Hasher        = require('./hasher')
Updater       = require('./updater')
BreedManager  = require('./core/breedmanager')
World         = require('./core/world')
SelfManager   = require('./core/structure/selfmanager')
PlotManager   = require('./plot/plotmanager')
LayoutManager = require('./prim/layoutmanager')
LinkPrims     = require('./prim/linkprims')
ListPrims     = require('./prim/listprims')
Prims         = require('./prim/prims')
SelfPrims     = require('./prim/selfprims')
RNG           = require('util/rng')
Timer         = require('util/timer')

{ Config: EvalConfig                         }       = require('./prim/evalprims')
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

    dialogConfig  = modelConfig?.dialog  ? new UserDialogConfig
    evalConfig    = modelConfig?.eval    ? new EvalConfig
    mouseConfig   = modelConfig?.mouse   ? new MouseConfig
    outputConfig  = modelConfig?.output  ? new OutputConfig
    plots         = modelConfig?.plots   ? []
    printConfig   = modelConfig?.print   ? new PrintConfig

    rng         = new RNG

    selfManager  = new SelfManager
    breedManager = new BreedManager(breedObjs, turtlesOwns, linksOwns)
    plotManager  = new PlotManager(plots)
    prims        = new Prims(Dump, Hasher, rng)
    selfPrims    = new SelfPrims(selfManager.self)
    timer        = new Timer
    updater      = new Updater

    world           = new World(new MiniWorkspace(selfManager, updater, breedManager, rng, plotManager), worldArgs...)
    layoutManager   = new LayoutManager(world, rng.nextDouble)

    linkPrims       = new LinkPrims(world)
    listPrims       = new ListPrims(Hasher, prims.equality.bind(prims), rng.nextInt)

    mousePrims      = new MousePrims(mouseConfig)
    outputPrims     = new OutputPrims(outputConfig, Dump)
    printPrims      = new PrintPrims(printConfig, Dump)
    userDialogPrims = new UserDialogPrims(dialogConfig)

    {
      selfManager
      breedManager
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
    }
