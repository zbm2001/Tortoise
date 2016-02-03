var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Dump = tortoise_require('engine/dump');
var Exception = tortoise_require('util/exception');
var Link = tortoise_require('engine/core/link');
var LinkSet = tortoise_require('engine/core/linkset');
var Meta = tortoise_require('meta');
var NLMath = tortoise_require('util/nlmath');
var NLType = tortoise_require('engine/core/typechecker');
var PatchSet = tortoise_require('engine/core/patchset');
var PenBundle = tortoise_require('engine/plot/pen');
var Plot = tortoise_require('engine/plot/plot');
var PlotOps = tortoise_require('engine/plot/plotops');
var Random = tortoise_require('shim/random');
var StrictMath = tortoise_require('shim/strictmath');
var Tasks = tortoise_require('engine/prim/tasks');
var Turtle = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var notImplemented = tortoise_require('util/notimplemented');
var Nobody = ScalaNobody();
var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"curviness":0.0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0.0,1.0]},{"x-offset":0.0,"is-visible":true,"dash-pattern":[1.0,0.0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0.0,1.0]}]}};
var modelConfig = (typeof window.modelConfig !== "undefined" && window.modelConfig !== null) ? window.modelConfig : {};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"f0-0000":{"name":"f0-0000","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f1-0001":{"name":"f1-0001","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f1-0010":{"name":"f1-0010","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f1-0100":{"name":"f1-0100","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f1-1000":{"name":"f1-1000","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f2-0011":{"name":"f2-0011","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f2-0101":{"name":"f2-0101","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f2-0110":{"name":"f2-0110","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f2-1001":{"name":"f2-1001","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f2-1010":{"name":"f2-1010","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f2-1100":{"name":"f2-1100","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f3-0111":{"name":"f3-0111","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f3-1011":{"name":"f3-1011","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f3-1101":{"name":"f3-1101","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f3-1110":{"name":"f3-1110","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"f4-1111":{"name":"f4-1111","editableColorIndex":0,"rotate":false,"elements":[{"xmin":0,"ymin":0,"xmax":150,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":0,"xmax":295,"ymax":150,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":0,"ymin":150,"xmax":150,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"xmin":150,"ymin":150,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(44, 209, 59, 1.0)","filled":true,"marked":false},{"x1":150,"y1":0,"x2":150,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":0,"x2":295,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":295,"x2":0,"y2":0,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":295,"x2":0,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":295,"y1":0,"x2":295,"y2":295,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"x1":0,"y1":150,"x2":295,"y2":150,"type":"line","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"fish-blue-fin":{"name":"fish-blue-fin","editableColorIndex":0,"rotate":true,"elements":[{"xmin":105,"ymin":90,"xmax":135,"ymax":90,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[117,109,100,92,84,82,80,84,91,100,112,131,149,168,179,193,206,212,215,213,206,195,184,173,209,89,124],"ycors":[180,174,162,149,131,116,98,76,61,54,50,48,80,48,50,53,62,77,97,118,139,158,172,188,255,255,186],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[120,105],"ycors":[180,165],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":97,"y":68,"diam":30,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":108,"y":79,"diam":8,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[105,125,165,190,105],"ycors":[150,105,105,150,150],"type":"polygon","color":"rgba(52, 93, 169, 1.0)","filled":true,"marked":false},{"xcors":[105,125,165,190,105],"ycors":[150,105,105,150,150],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"xcors":[117,109,100,92,84,82,80,84,91,100,112,131,149,168,179,193,206,212,215,213,206,195,184,173,209,89,124],"ycors":[180,174,162,149,131,116,98,76,61,54,50,48,80,48,50,53,62,77,97,118,139,158,172,188,255,255,186],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"fish-eye-fin":{"name":"fish-eye-fin","editableColorIndex":0,"rotate":true,"elements":[{"xmin":105,"ymin":90,"xmax":135,"ymax":90,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,210,171,127,90],"ycors":[255,255,179,180,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[120,105],"ycors":[180,165],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"xcors":[118,110,101,93,85,83,81,85,92,101,113,132,150,169,180,194,207,213,216,214,207,196,185,171,128],"ycors":[180,174,162,149,131,116,98,76,61,54,50,48,80,48,50,53,62,77,97,118,139,158,172,185,188],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":97,"y":68,"diam":30,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":108,"y":79,"diam":8,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[108,138,153,183,108],"ycors":[144,114,114,144,144],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"fish-green-fin":{"name":"fish-green-fin","editableColorIndex":0,"rotate":true,"elements":[{"xmin":105,"ymin":90,"xmax":135,"ymax":90,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[117,109,100,92,84,82,80,84,91,100,112,131,149,168,179,193,206,212,215,213,206,195,184,173,209,89,124],"ycors":[180,174,162,149,131,116,98,76,61,54,50,48,80,48,50,53,62,77,97,118,139,158,172,188,255,255,186],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[120,105],"ycors":[180,165],"type":"polygon","color":"rgba(215, 50, 41, 1.0)","filled":true,"marked":false},{"x":97,"y":68,"diam":30,"type":"circle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"x":108,"y":79,"diam":8,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[105,125,165,190,105],"ycors":[150,105,105,150,150],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,125,165,190,105],"ycors":[150,105,105,150,150],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false},{"xcors":[117,109,100,92,84,82,80,84,91,100,112,131,149,168,179,193,206,212,215,213,206,195,184,173,209,89,124],"ycors":[180,174,162,149,131,116,98,76,61,54,50,48,80,48,50,53,62,77,97,118,139,158,172,188,255,255,186],"type":"polygon","color":"rgba(255, 255, 255, 1.0)","filled":false,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false}]},"frame":{"name":"frame","editableColorIndex":14,"rotate":false,"elements":[{"xmin":-8,"ymin":2,"xmax":18,"ymax":298,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":true},{"xmin":1,"ymin":0,"xmax":300,"ymax":16,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":true},{"xmin":283,"ymin":2,"xmax":299,"ymax":300,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":true},{"xmin":1,"ymin":285,"xmax":300,"ymax":299,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":true}]},"frame-thicker":{"name":"frame-thicker","editableColorIndex":0,"rotate":false,"elements":[{"xmin":5,"ymin":7,"xmax":38,"ymax":295,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":7,"ymin":5,"xmax":296,"ymax":38,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":256,"ymin":7,"xmax":295,"ymax":295,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":5,"ymin":256,"xmax":293,"ymax":295,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":5,"y1":5,"x2":5,"y2":295,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":5,"y1":5,"x2":295,"y2":5,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":295,"y1":5,"x2":295,"y2":295,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":5,"y1":295,"x2":295,"y2":295,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":38,"y1":256,"x2":38,"y2":38,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":38,"y1":38,"x2":256,"y2":38,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":256,"y1":256,"x2":256,"y2":38,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false},{"x1":38,"y1":256,"x2":256,"y2":256,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1.0)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"plus":{"name":"plus","editableColorIndex":0,"rotate":false,"elements":[{"xmin":120,"ymin":45,"xmax":180,"ymax":255,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":45,"ymin":120,"xmax":255,"ymax":180,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1.0)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1.0)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1.0)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1.0)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1.0)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1.0)","filled":true,"marked":true}]}};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
if (typeof javax !== "undefined") {
  modelConfig.dialog = {
    confirm: function(str) { return true; },
    notify:  function(str) {}
  }
}
if (typeof javax !== "undefined") {
  modelConfig.output = {
    clear: function() {},
    write: function(str) { context.getWriter().print(str); }
  }
}
modelConfig.plots = [(function() {
  var name    = '4-Block Distribution';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('Count', plotOps.makePenOps, false, new PenBundle.State(0.0, 1.0, PenBundle.DisplayMode.Bar), function() {}, function() {}),
  new PenBundle.Pen('Average', plotOps.makePenOps, false, new PenBundle.State(15.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "# green squares in block", "occurrences", true, true, 0.0, 5.0, 0.0, 10.0, setup, update);
})(), (function() {
  var name    = 'Percent Fish by Properties';
  var plotOps = (typeof modelPlotOps[name] !== "undefined" && modelPlotOps[name] !== null) ? modelPlotOps[name] : new PlotOps(function() {}, function() {}, function() {}, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; }, function() { return function() {}; });
  var pens    = [new PenBundle.Pen('G-body G-fin', plotOps.makePenOps, false, new PenBundle.State(55.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('G-body B-fin', plotOps.makePenOps, false, new PenBundle.State(35.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('B-body G-fin', plotOps.makePenOps, false, new PenBundle.State(44.7, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {}),
  new PenBundle.Pen('B-body B-fin', plotOps.makePenOps, false, new PenBundle.State(105.0, 1.0, PenBundle.DisplayMode.Line), function() {}, function() {})];
  var setup   = function() {};
  var update  = function() {};
  return new Plot(name, pens, plotOps, "# of iterations", "Percentage", true, true, 0.0, 10.0, 0.0, 100.0, setup, update);
})()];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "OUTPUT-SHAPES", singular: "outer-shape", varNames: [] }, { name: "FISH", singular: "a-fish", varNames: ["age", "my-genes"] }])([], [])(["life-span", "mate-with", "z-distr", "dom-color", "res-color", "dom-shape", "res-shape", "prev-x", "prev-y"], ["life-span", "mate-with"], ["orig-color", "family"], -5, 5, -9, 1, 40.0, false, false, turtleShapes, linkShapes, function(){});
var BreedManager = workspace.breedManager;
var LayoutManager = workspace.layoutManager;
var LinkPrims = workspace.linkPrims;
var ListPrims = workspace.listPrims;
var MousePrims = workspace.mousePrims;
var OutputPrims = workspace.outputPrims;
var Prims = workspace.prims;
var PrintPrims = workspace.printPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
var procedures = (function() {
  var setup = function() {
    world.clearAll();
    world.observer.setGlobal("dom-color", 55);
    world.observer.setGlobal("res-color", 105);
    world.observer.setGlobal("dom-shape", "fish-green-fin");
    world.observer.setGlobal("res-shape", "fish-blue-fin");
    world.patches().ask(function() { SelfManager.self().setPatchVariable("pcolor", (15 + Prims.random(3))); }, true);
    world.patches().agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("pycor"), 0); }).ask(function() { SelfManager.self().setPatchVariable("pcolor", 9.9); }, true);
    world.patches().ask(function() {
      SelfManager.self().setPatchVariable("orig-color", SelfManager.self().getPatchVariable("pcolor"));
      SelfManager.self().setPatchVariable("family", []);
    }, true);
    world.ticker.reset();
    procedures.updateGraphs(false);
  };
  var addFish = function(x) {
    for (var _index_899_905 = 0, _repeatcount_899_905 = StrictMath.floor(x); _index_899_905 < _repeatcount_899_905; _index_899_905++){
      var k = procedures.addCustomFish(procedures.chooseRandomNZ());
    }
    procedures.updateGraphs(true);
  };
  var addCustomFish = function(child) {
    try {
      var whoChild = 0;
      world.turtleManager.createTurtles(1, "FISH").ask(function() {
        SelfManager.self().setVariable("my-genes", child);
        if ((Prims.equality(Prims.readFromString(ListPrims.item(3, SelfManager.self().getVariable("my-genes"))), 1) || Prims.equality(Prims.readFromString(ListPrims.item(4, SelfManager.self().getVariable("my-genes"))), 1))) {
          SelfManager.self().setVariable("color", world.observer.getGlobal("dom-color"));
        }
        else {
          SelfManager.self().setVariable("color", world.observer.getGlobal("res-color"));
        }
        if ((Prims.equality(Prims.readFromString(ListPrims.item(5, SelfManager.self().getVariable("my-genes"))), 1) || Prims.equality(Prims.readFromString(ListPrims.item(6, SelfManager.self().getVariable("my-genes"))), 1))) {
          SelfManager.self().setVariable("shape", world.observer.getGlobal("dom-shape"));
        }
        else {
          SelfManager.self().setVariable("shape", world.observer.getGlobal("res-shape"));
        }
        SelfManager.self().setXY(Prims.randomCoord(world.topology.minPxcor, world.topology.maxPxcor), Prims.randomFloat(world.topology.minPycor));
        var p = SelfManager.self().patchAhead(1);
        while ((Prims.equality(p, Nobody) || Prims.gt(p.projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); }), (world.topology.maxPycor - 1)))) {
          SelfManager.self().right(Prims.random(360));
          p = SelfManager.self().patchAhead(1);
        }
        whoChild = SelfManager.self().getVariable("who");
      }, true);
      throw new Exception.ReportInterrupt(whoChild);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var chooseRandomNZ = function() {
    try {
      var combination = [];
      for (var _index_1746_1752 = 0, _repeatcount_1746_1752 = StrictMath.floor(4); _index_1746_1752 < _repeatcount_1746_1752; _index_1746_1752++){
        combination = ListPrims.lput(Prims.random(2), combination);
      }
      var _name_ = "";
      _name_ = (Dump('') + Dump(_name_) + Dump(ListPrims.length(combination.filter(Tasks.reporterTask(function() {
        var taskArguments = arguments;
        return Prims.equality(taskArguments[0], 1);
      })))) + Dump("-"));
      Tasks.forEach(Tasks.commandTask(function() {
        var taskArguments = arguments;
        _name_ = (Dump('') + Dump(_name_) + Dump(taskArguments[0]));
      }), combination);
      throw new Exception.ReportInterrupt((Dump('') + Dump("f") + Dump(_name_)));
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var go = function() {
    world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() { return Prims.gte(SelfManager.self().getVariable("age"), world.observer.getGlobal("life-span")); }).ask(function() { SelfManager.self().die(); }, true);
    world.turtleManager.turtlesOfBreed("FISH").ask(function() { SelfManager.self().setVariable("age", (SelfManager.self().getVariable("age") + 1)); }, true);
    world.patches().agentFilter(function() {
      return (Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 45) || Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 9.9));
    }).ask(function() {
      SelfManager.self().setPatchVariable("pcolor", SelfManager.self().getPatchVariable("orig-color"));
      SelfManager.self().setPatchVariable("family", []);
    }, true);
    var toCollide = [];
    world.patches().ask(function() { SelfManager.self().setPatchVariable("family", []); }, true);
    world.turtleManager.turtlesOfBreed("FISH").ask(function() { procedures.wanderAround(); }, true);
    world.patches().ask(function() {
      if (Prims.gt(SelfManager.self().breedHere("FISH").size(), 1)) {
        toCollide = ListPrims.lput(ListPrims.nOf(2, SelfManager.self().breedHere("FISH")), toCollide);
      }
    }, true);
    Tasks.forEach(Tasks.commandTask(function() {
      var taskArguments = arguments;
      procedures.collide(ListPrims.first(ListPrims.sort(taskArguments[0])),ListPrims.last(ListPrims.sort(taskArguments[0])));
    }), toCollide);
    world.ticker.tick();
    procedures.updateGraphs(false);
  };
  var collide = function(parent1, parent2) {
    if (procedures.matingRulesCheck(parent1,parent2)) {
      var child = procedures.createChild(parent1.projectionBy(function() { return SelfManager.self().getPatchHere(); }),parent1.projectionBy(function() { return SelfManager.self().getVariable("my-genes"); }),parent2.projectionBy(function() { return SelfManager.self().getVariable("my-genes"); }));
      parent1.projectionBy(function() { return SelfManager.self().getPatchHere(); }).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
      var whoChild = procedures.addCustomFish(child);
      parent1.projectionBy(function() { return SelfManager.self().getPatchHere(); }).ask(function() {
        SelfManager.self().setPatchVariable("family", ListPrims.fput(world.turtleManager.getTurtle(whoChild), SelfManager.self().getPatchVariable("family")));
      }, true);
      parent1.projectionBy(function() { return SelfManager.self().getPatchHere(); }).ask(function() {
        SelfManager.self().setPatchVariable("family", ListPrims.fput(parent2, SelfManager.self().getPatchVariable("family")));
      }, true);
      parent1.projectionBy(function() { return SelfManager.self().getPatchHere(); }).ask(function() {
        SelfManager.self().setPatchVariable("family", ListPrims.fput(parent1, SelfManager.self().getPatchVariable("family")));
      }, true);
    }
  };
  var matingRulesCheck = function(parent1, parent2) {
    try {
      if (Prims.equality(world.observer.getGlobal("mate-with"), "Any Fish")) {
        throw new Exception.ReportInterrupt(true);
      }
      if (Prims.equality(world.observer.getGlobal("mate-with"), "Same Body")) {
        throw new Exception.ReportInterrupt(Prims.equality(parent1.projectionBy(function() { return SelfManager.self().getVariable("color"); }), parent2.projectionBy(function() { return SelfManager.self().getVariable("color"); })));
      }
      if (Prims.equality(world.observer.getGlobal("mate-with"), "Same Fin")) {
        throw new Exception.ReportInterrupt(Prims.equality(parent1.projectionBy(function() { return SelfManager.self().getVariable("shape"); }), parent2.projectionBy(function() { return SelfManager.self().getVariable("shape"); })));
      }
      if (Prims.equality(world.observer.getGlobal("mate-with"), "Same Both")) {
        throw new Exception.ReportInterrupt((Prims.equality(parent1.projectionBy(function() { return SelfManager.self().getVariable("color"); }), parent2.projectionBy(function() { return SelfManager.self().getVariable("color"); })) && Prims.equality(parent1.projectionBy(function() { return SelfManager.self().getVariable("shape"); }), parent2.projectionBy(function() { return SelfManager.self().getVariable("shape"); }))));
      }
      throw new Exception.ReportInterrupt(false);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var createChild = function(yellowPatch, genes1, genes2) {
    try {
      var cList = [];
      var newGenes = [];
      var rand = Prims.random(2);
      newGenes = ListPrims.lput(rand, newGenes);
      cList = ListPrims.lput(ListPrims.item((3 + rand), genes1), cList);
      rand = Prims.random(2);
      newGenes = ListPrims.lput(rand, newGenes);
      cList = ListPrims.lput(ListPrims.item((3 + rand), genes2), cList);
      rand = Prims.random(2);
      newGenes = ListPrims.lput(rand, newGenes);
      cList = ListPrims.lput(ListPrims.item((5 + rand), genes1), cList);
      rand = Prims.random(2);
      newGenes = ListPrims.lput(rand, newGenes);
      cList = ListPrims.lput(ListPrims.item((5 + rand), genes2), cList);
      var child = "";
      child = (Dump('') + Dump("f") + Dump(ListPrims.length(cList.filter(Tasks.reporterTask(function() {
        var taskArguments = arguments;
        return Prims.equality(taskArguments[0], "1");
      })))) + Dump("-"));
      Tasks.forEach(Tasks.commandTask(function() {
        var taskArguments = arguments;
        child = (Dump('') + Dump(child) + Dump(taskArguments[0]));
      }), cList);
      yellowPatch.ask(function() { SelfManager.self().setPatchVariable("family", newGenes); }, true);
      throw new Exception.ReportInterrupt(child);
      throw new Error("Reached end of reporter procedure without REPORT being called.");
    } catch (e) {
      if (e instanceof Exception.ReportInterrupt) {
        return e.message;
      } else {
        throw e;
      }
    }
  };
  var revealGenes = function() {
    if (MousePrims.isDown()) {
      if (!(Prims.equality(world.observer.getGlobal("prev-x"), MousePrims.getX()) && Prims.equality(world.observer.getGlobal("prev-y"), MousePrims.getY()))) {
        world.observer.setGlobal("prev-x", MousePrims.getX());
        world.observer.setGlobal("prev-y", MousePrims.getY());
        if (Prims.equality(world.getPatchAt(MousePrims.getX(), MousePrims.getY()).projectionBy(function() { return SelfManager.self().getPatchVariable("pcolor"); }), 45)) {
          world.turtleManager.turtlesOfBreed("FISH").ask(function() { SelfManager.self().setVariable("hidden?", true); }, true);
          Tasks.forEach(Tasks.commandTask(function() {
            var taskArguments = arguments;
            taskArguments[0].ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
          }), world.getPatchAt(MousePrims.getX(), MousePrims.getY()).projectionBy(function() { return SelfManager.self().getPatchVariable("family"); }).filter(Tasks.reporterTask(function() {
            var taskArguments = arguments;
            return NLType(taskArguments[0]).isValidTurtle();
          })));
          world.patches().ask(function() { SelfManager.self().setPatchVariable("pcolor", SelfManager.self().getPatchVariable("orig-color")); }, true);
          world.getPatchAt(MousePrims.getX(), MousePrims.getY()).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
          procedures.outputGenetics(world.getPatchAt(MousePrims.getX(), MousePrims.getY()));
        }
        else {
          var minD = -1;
          var dist = 3;
          Prims.breedOn("FISH", world.getPatchAt(NLMath.round(MousePrims.getX()), NLMath.round(MousePrims.getY()))).ask(function() {
            if (Prims.gt(dist, SelfManager.self().distanceXY(MousePrims.getX(), MousePrims.getY()))) {
              dist = SelfManager.self().distanceXY(MousePrims.getX(), MousePrims.getY());
              minD = SelfManager.self().getVariable("who");
            }
          }, true);
          if (!Prims.equality(minD, -1)) {
            world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("who"), minD); }).ask(function() { SelfManager.self().setVariable("shape", SelfManager.self().getVariable("my-genes")); }, true);
          }
        }
      }
    }
    else {
      world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() { return Prims.equality(SelfManager.self().getVariable("hidden?"), true); }).ask(function() { SelfManager.self().setVariable("hidden?", false); }, true);
      if (Prims.gt(world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() {
        return (!Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("res-shape")) && !Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("dom-shape")));
      }).size(), 0)) {
        world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() {
          return (Prims.equality(Prims.readFromString(ListPrims.item(5, SelfManager.self().getVariable("my-genes"))), 1) || Prims.equality(Prims.readFromString(ListPrims.item(6, SelfManager.self().getVariable("my-genes"))), 1));
        }).ask(function() { SelfManager.self().setVariable("shape", world.observer.getGlobal("dom-shape")); }, true);
        world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() {
          return !(Prims.equality(Prims.readFromString(ListPrims.item(5, SelfManager.self().getVariable("my-genes"))), 1) || Prims.equality(Prims.readFromString(ListPrims.item(6, SelfManager.self().getVariable("my-genes"))), 1));
        }).ask(function() { SelfManager.self().setVariable("shape", world.observer.getGlobal("res-shape")); }, true);
      }
      if (!Prims.equality(world.turtleManager.turtlesOfBreed("OUTPUT-SHAPES").size(), 0)) {
        world.turtleManager.turtlesOfBreed("OUTPUT-SHAPES").ask(function() { SelfManager.self().die(); }, true);
      }
      world.patches().agentFilter(function() {
        return (!Prims.equality(SelfManager.self().getPatchVariable("family"), []) && !Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 45));
      }).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
    }
    notImplemented('display', undefined)();
  };
  var outputGenetics = function(yellowPatch) {
    var shape1 = ListPrims.item(0, yellowPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("family"); })).projectionBy(function() { return SelfManager.self().getVariable("my-genes"); });
    var shape2 = ListPrims.item(1, yellowPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("family"); })).projectionBy(function() { return SelfManager.self().getVariable("my-genes"); });
    var child = ListPrims.item(2, yellowPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("family"); })).projectionBy(function() { return SelfManager.self().getVariable("my-genes"); });
    var tLeft = ListPrims.item(3, yellowPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("family"); }));
    var tRight = ListPrims.item(4, yellowPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("family"); }));
    var bLeft = ListPrims.item(5, yellowPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("family"); }));
    var bRight = ListPrims.item(6, yellowPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("family"); }));
    world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
      SelfManager.self().setVariable("shape", shape1);
      SelfManager.self().setXY(world.topology.minPxcor, world.topology.maxPycor);
    }, true);
    world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
      SelfManager.self().setVariable("shape", shape2);
      SelfManager.self().setXY((world.topology.minPxcor + 1.5), world.topology.maxPycor);
    }, true);
    world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
      SelfManager.self().setVariable("shape", "arrow");
      SelfManager.self().setXY((world.topology.minPxcor + 2.5), world.topology.maxPycor);
      SelfManager.self().setVariable("heading", 90);
    }, true);
    world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
      SelfManager.self().setVariable("shape", child);
      SelfManager.self().setXY((world.topology.minPxcor + 3.5), world.topology.maxPycor);
    }, true);
    if (Prims.equality(tLeft, 0)) {
      world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
        SelfManager.self().setVariable("shape", "frame-thicker");
        SelfManager.self().setVariable("size", 0.5);
        SelfManager.self().setXY( -5.25, 1.25);
        SelfManager.self().setVariable("color", 25);
      }, true);
    }
    if (Prims.equality(tLeft, 1)) {
      world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
        SelfManager.self().setVariable("shape", "frame-thicker");
        SelfManager.self().setVariable("size", 0.5);
        SelfManager.self().setXY( -4.75, 1.25);
        SelfManager.self().setVariable("color", 25);
      }, true);
    }
    if (Prims.equality(tRight, 0)) {
      world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
        SelfManager.self().setVariable("shape", "frame-thicker");
        SelfManager.self().setVariable("size", 0.5);
        SelfManager.self().setXY( -3.75, 1.25);
        SelfManager.self().setVariable("color", 25);
      }, true);
    }
    if (Prims.equality(tRight, 1)) {
      world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
        SelfManager.self().setVariable("shape", "frame-thicker");
        SelfManager.self().setVariable("size", 0.5);
        SelfManager.self().setXY( -3.25, 1.25);
        SelfManager.self().setVariable("color", 25);
      }, true);
    }
    if (Prims.equality(bLeft, 0)) {
      world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
        SelfManager.self().setVariable("shape", "frame-thicker");
        SelfManager.self().setVariable("size", 0.5);
        SelfManager.self().setXY( -5.25, 0.75);
        SelfManager.self().setVariable("color", 74);
      }, true);
    }
    if (Prims.equality(bLeft, 1)) {
      world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
        SelfManager.self().setVariable("shape", "frame-thicker");
        SelfManager.self().setVariable("size", 0.5);
        SelfManager.self().setXY( -4.75, 0.75);
        SelfManager.self().setVariable("color", 74);
      }, true);
    }
    if (Prims.equality(bRight, 0)) {
      world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
        SelfManager.self().setVariable("shape", "frame-thicker");
        SelfManager.self().setVariable("size", 0.5);
        SelfManager.self().setXY( -3.75, 0.75);
        SelfManager.self().setVariable("color", 74);
      }, true);
    }
    if (Prims.equality(bRight, 1)) {
      world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
        SelfManager.self().setVariable("shape", "frame-thicker");
        SelfManager.self().setVariable("size", 0.5);
        SelfManager.self().setXY( -3.25, 0.75);
        SelfManager.self().setVariable("color", 74);
      }, true);
    }
    world.turtleManager.createTurtles(1, "OUTPUT-SHAPES").ask(function() {
      SelfManager.self().setVariable("shape", "plus");
      SelfManager.self().setXY((world.topology.minPxcor + 0.75), world.topology.maxPycor);
      SelfManager.self().setVariable("size", 0.5);
    }, true);
  };
  var wanderAround = function() {
    if (Prims.isThrottleTimeElapsed("wanderAround_0", workspace.selfManager.self(), 0.1)) {
      Prims.resetThrottleTimerFor("wanderAround_0", workspace.selfManager.self());
      SelfManager.self().fd(1);
      SelfManager.self().right(Prims.random(360));
      var p = SelfManager.self().patchAhead(1);
      while ((Prims.equality(p, Nobody) || Prims.gt(p.projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); }), (world.topology.maxPycor - 1)))) {
        SelfManager.self().right(Prims.random(360));
        p = SelfManager.self().patchAhead(1);
      }
    }
  };
  var updateGraphs = function(justHistogram_p) {
    world.observer.setGlobal("z-distr", []);
    world.turtleManager.turtlesOfBreed("FISH").ask(function() {
      world.observer.setGlobal("z-distr", ListPrims.lput(Prims.readFromString(ListPrims.item(1, SelfManager.self().getVariable("my-genes"))), world.observer.getGlobal("z-distr")));
    }, true);
    plotManager.setCurrentPlot("4-Block Distribution");
    plotManager.setCurrentPen("Count");
    plotManager.resetPen();
    plotManager.drawHistogramFrom(world.observer.getGlobal("z-distr"));
    var maxbar = ListPrims.modes(world.observer.getGlobal("z-distr"));
    var maxrange = ListPrims.length(world.observer.getGlobal("z-distr").filter(Tasks.reporterTask(function() {
      var taskArguments = arguments;
      return Prims.equality(taskArguments[0], ListPrims.item(0, maxbar));
    })));
    plotManager.setYRange(0, ListPrims.max(ListPrims.list(10, maxrange)));
    plotManager.setCurrentPen("Average");
    plotManager.resetPen();
    if (!Prims.equality(world.observer.getGlobal("z-distr"), [])) {
      plotManager.plotPoint(ListPrims.mean(world.observer.getGlobal("z-distr")), plotManager.getPlotYMin());
      plotManager.lowerPen();
      plotManager.plotPoint(ListPrims.mean(world.observer.getGlobal("z-distr")), plotManager.getPlotYMax());
      plotManager.raisePen();
    }
    if (!justHistogram_p) {
      plotManager.setCurrentPlot("Percent Fish by Properties");
      if (!Prims.equality(world.turtleManager.turtlesOfBreed("FISH").size(), 0)) {
        plotManager.setCurrentPen("G-body G-fin");
        plotManager.plotValue(((100 * world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("color"), 55) && Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("dom-shape")));
        }).size()) / world.turtleManager.turtlesOfBreed("FISH").size()));
        plotManager.setCurrentPen("G-body B-fin");
        plotManager.plotValue(((100 * world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("color"), 55) && Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("res-shape")));
        }).size()) / world.turtleManager.turtlesOfBreed("FISH").size()));
        plotManager.setCurrentPen("B-body G-fin");
        plotManager.plotValue(((100 * world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("color"), 105) && Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("dom-shape")));
        }).size()) / world.turtleManager.turtlesOfBreed("FISH").size()));
        plotManager.setCurrentPen("B-body B-fin");
        plotManager.plotValue(((100 * world.turtleManager.turtlesOfBreed("FISH").agentFilter(function() {
          return (Prims.equality(SelfManager.self().getVariable("color"), 105) && Prims.equality(SelfManager.self().getVariable("shape"), world.observer.getGlobal("res-shape")));
        }).size()) / world.turtleManager.turtlesOfBreed("FISH").size()));
      }
      else {
        plotManager.setCurrentPen("G-body G-fin");
        plotManager.plotValue(0);
        plotManager.setCurrentPen("G-body B-fin");
        plotManager.plotValue(0);
        plotManager.setCurrentPen("B-body G-fin");
        plotManager.plotValue(0);
        plotManager.setCurrentPen("B-body B-fin");
        plotManager.plotValue(0);
      }
    }
  };
  return {
    "ADD-CUSTOM-FISH":addCustomFish,
    "ADD-FISH":addFish,
    "CHOOSE-RANDOM-N-Z":chooseRandomNZ,
    "COLLIDE":collide,
    "CREATE-CHILD":createChild,
    "GO":go,
    "MATING-RULES-CHECK":matingRulesCheck,
    "OUTPUT-GENETICS":outputGenetics,
    "REVEAL-GENES":revealGenes,
    "SETUP":setup,
    "UPDATE-GRAPHS":updateGraphs,
    "WANDER-AROUND":wanderAround,
    "addCustomFish":addCustomFish,
    "addFish":addFish,
    "chooseRandomNZ":chooseRandomNZ,
    "collide":collide,
    "createChild":createChild,
    "go":go,
    "matingRulesCheck":matingRulesCheck,
    "outputGenetics":outputGenetics,
    "revealGenes":revealGenes,
    "setup":setup,
    "updateGraphs":updateGraphs,
    "wanderAround":wanderAround
  };
})();
world.observer.setGlobal("life-span", 5);
world.observer.setGlobal("mate-with", "Any Fish");
