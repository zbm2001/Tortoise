{ foldl, tail, zip } = require('brazierjs/array')
{ pipeline         } = require('brazierjs/function')

parse = require('csv-parse/lib/sync')

# type ImpObj    = Object[Any]
# type ImpArr    = Array[ImpObj]
# type Converter = (String) => Any
# type Row       = Array[String]
# type Parser[T] = (Array[Row], Schema) => T
# type Schema    = Object[Converter]

class WorldState
  #            (ImpObj         , Object[String], String   , ImpArr  , ImpArr  , ImpArr, String , ImpArr, ImpObj     )
  constructor: (@builtInGlobals, @userGlobals  , @rngState, @turtles, @patches, @links, @output, @plots, @extensions) ->

# (String) => String
csvNameToSaneName = (csvName) ->

  replaceAll = (str, regex, f) ->
    match = str.match(regex)
    if match?
      { 0: fullMatch, 1: group, index } = match
      prefix  = str.slice(0, index)
      postfix = str.slice(index + fullMatch.length)
      replaceAll("#{prefix}#{f(group)}#{postfix}", regex, f)
    else
      str

  lowered    = csvName.toLowerCase()
  camelCased = replaceAll(lowered, /[ \-]+([a-z])/, (str) -> str.toUpperCase())

  qMatch = camelCased.match(/^(\w)(.*)\?$/, )
  if qMatch?
    { 1: firstLetter, 2: remainder } = qMatch
    "is#{firstLetter.toUpperCase()}#{remainder}"
  else
    camelCased



# START SCHEMA STUFF

# (String) => Boolean
parseBool = (x) ->
  x.toLowerCase() is "true"

# Only used to mark things that we should delay converting until later --JAB (4/6/17)
# [T] @ (T) => T
identity = (x) ->
  x

# (String) => String
parseString = (str) ->
  match = str.match(/^"(.*)"$/)
  if match?
    match[1]
  else
    throw new Error("Failed to match on #{str}")

# Object[Schema]
nameToSchema = {
  plots: {
    color:        parseFloat
  , currentPen:   parseString
  , interval:     parseFloat
  , isAutoplot:   parseBool
  , isLegendOpen: parseBool
  , isPenDown:    parseBool
  , mode:         parseInt
  , numberOfPens: parseInt
  , penName:      parseString
  , xMax:         parseFloat
  , xMin:         parseFloat
  , x:            parseFloat
  , yMax:         parseFloat
  , yMin:         parseFloat
  , y:            parseFloat
  }
  randomState: {
    value: identity
  }
  globals: {
    directedLinks: parseString
  , minPxcor:      parseInt
  , maxPxcor:      parseInt
  , minPycor:      parseInt
  , maxPycor:      parseInt
  , nextIndex:     parseInt
  , perspective:   parseInt
  , subject:       identity
  , ticks:         parseFloat
  }
  turtles: {
    breed:      identity
  , color:      parseFloat
  , heading:    parseFloat
  , isHidden:   parseBool
  , labelColor: parseFloat
  , label:      identity
  , penMode:    parseString
  , penSize:    parseFloat
  , shape:      parseString
  , size:       parseFloat
  , who:        parseInt
  , xcor:       parseFloat
  , ycor:       parseFloat
  }
  patches: {
    pcolor:      parseFloat
  , plabelColor: parseFloat
  , plabel:      identity
  , pxcor:       parseInt
  , pycor:       parseInt
  }
  links: {
    breed:      identity
  , color:      parseFloat
  , end1:       identity
  , end2:       identity
  , isHidden:   parseBool
  , labelColor: parseFloat
  , label:      identity
  , shape:      parseString
  , thickness:  parseFloat
  , tieMode:    parseString
  }
  output: {
    value: parseString
  }
  extensions: {}
}

# END SCHEMA STUFF



# START PARSER STUFF

# Parser[String]
singletonParse = (csvBucket, schema) ->
  schema.value(csvBucket[0][0])

# Parser[ImpArr]
arrayParse = (csvBucket, schema) ->

  [keys, rows...] = csvBucket

  f =
    (acc, row) ->
      obj = { extraVars: {} }
      for rawKey, index in keys
        key   = csvNameToSaneName(rawKey)
        value = row[index]
        if schema[key]?
          obj[key] = schema[key](value)
        else
          obj.extraVars[key] = value
      acc.concat([obj])

  foldl(f)([])(rows)

# Parser[ImpObj]
globalParse = (csvBucket, schema) ->
  head = arrayParse(csvBucket, schema)[0]
  delete head.extraVars
  head

# Parser[ImpObj]
plotParse = (csvBucket, schema) ->

  output = { default: csvBucket[0]?[0] ? null, plots: [] }

  # Iterate over every plot
  csvIndex = 1

  while csvIndex < csvBucket.length
    plot = { name: parseString(csvBucket[csvIndex++][0]) }

    #Parsing of the global attributes in each plot
    for plotAttributeIndex in [0...csvBucket[csvIndex].length]
      columnName       = csvNameToSaneName(csvBucket[csvIndex    ][plotAttributeIndex])
      value            =                   csvBucket[csvIndex + 1][plotAttributeIndex]
      plot[columnName] = schema[columnName](value)
    csvIndex += 2

    #Parsing of the attributes of each pen in a plot
    plot['pens'] = []
    numPens = parseInt(plot['number of pens'])
    for penIndex in [0...numPens]
      pen = {}
      for penAttributeIndex in [0...csvBucket[csvIndex].length]
        columnName       = csvNameToSaneName(csvBucket[csvIndex    ][penAttributeIndex])
        value            =                   csvBucket[csvIndex + 1][penAttributeIndex]
        pen[columnName] = schema[columName](value)
      pen['points'] = []
      plot['pens'].push(pen)
    csvIndex += 2 + numPens

    #For each pen, parsing of the list of points associated with the pen
    pointsIndex = 1
    while csvIndex + pointsIndex < csvBucket.length and csvBucket[csvIndex + pointsIndex].length != 1
      for penIndex in [0...numPens]
        point = {}
        length = csvBucket[csvIndex].length / numPens
        for pointAttributeIndex in [0...length]
          columnName        = csvNameToSaneName(csvBucket[csvIndex              ][pointAttributeIndex])
          value             =                   csvBucket[csvIndex + pointsIndex][pointAttributeIndex + penIndex * length]
          point[columnName] = schema[columnName](value)
        plot['pens'][penIndex]['points'].push(point)
      pointsIndex++
    csvIndex += pointsIndex

    output['plots'].push(plot)
  output

# Parser[ImpObj]
extensionParse = (csvBucket, schema) ->
  output = {}
  extension = ''
  for entry in csvBucket
    item = entry[0]
    if not item.startsWith('{{')
      extension = item
      output[extension] = []
    else
      output[extension].push(item)
  output

# Object[Parser[Any]]
buckets = {
  extensions:  extensionParse
, globals:     globalParse
, links:       arrayParse
, output:      singletonParse
, patches:     arrayParse
, plots:       plotParse
, randomState: singletonParse
, turtles:     arrayParse
}

# END PARSER STUFF



# (ImpObj, Array[String]) => (ImpObj, Object[String])
extractGlobals = (globals, knownNames) ->
  builtIn = {}
  user    = {}
  for key, value of globals
    if key in knownNames
      builtIn[key] = value
    else
      user[key] = value
  [builtIn, user]

# (String) => WorldState
module.exports =
  (csvText) ->

    parsedCSV = parse(csvText, {
      comment: '#'
      skip_empty_lines: true
      relax_column_count: true
    })

    clusterRows =
      ([acc, latestRows], row) ->

        saneName =
          try
            if row.length is 1
              csvNameToSaneName(row[0])
            else
              undefined
          catch ex
            undefined

        if saneName? and saneName of buckets
          rows = []
          acc[saneName] = rows
          [acc, rows]
        else if latestRows?
          latestRows.push(row)
          [acc, latestRows]
        else
          [acc, latestRows]

    [bucketToRows, _] = foldl(clusterRows)([{}, undefined])(parsedCSV)

    world = {}

    for name, bucketParser of buckets
      world[name] = bucketParser(bucketToRows[name], nameToSchema[name])

    { globals, randomState, turtles, patches, links, output, plots, extensions } = world

    builtInGlobalNames = Object.keys(nameToSchema.globals)
    [builtInGlobals, userGlobals] = extractGlobals(globals, builtInGlobalNames)

    new WorldState(builtInGlobals, userGlobals, randomState, turtles, patches, links, output, plots, extensions)
