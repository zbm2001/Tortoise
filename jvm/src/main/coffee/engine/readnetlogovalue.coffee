Nobody = require('./core/nobody')

# (String) => Array[String]
tokenizeList = (listStr) ->
  listMatch = listStr.trim().match(/^\[(.*)\]$/)
  helper =
    (acc, currentString) ->
      trimmed = currentString.trim()
      if trimmed.length is 0
        acc
      else
        { 1: newToken, 2: remainder } =
          switch trimmed[0]
            when "["
              if trimmed.match(/\[ *\]/)?
                { 1: "[]", 2: "" }
              else
                throw new Error("I cannot parse nested lists")
            when '"' # Read until unescaped "
              findIndexOfClosingQuote =
                (str, indexOffset) ->
                  index = str.indexOf('"')
                  if index is -1
                    throw new Error("The value <#{trimmed}> is an unclosed string!")
                  else if str[index - 1] isnt "\\"
                    indexOffset + index
                  else
                    findIndexOfClosingQuote(str.slice(index + 1), indexOffset + index)
              i = findIndexOfClosingQuote(trimmed.slice(1), 1) + 1
              { 1: trimmed.slice(0, i + 1), 2: trimmed.slice(i + 1) }
            when "{"
              trimmed.match(/^({[^}]*})(.*)$/) # Read until }
            else
              trimmed.match(/^([^ ]*) (.*)$/) # Read until space
        helper(acc.concat([newToken]), remainder)
  helper([], listMatch[1])

# ((String) => Any, String) => Array[Any]
readList = (readNetLogoValue, listStr) ->
  tokenizeList(listStr).map(
    (s) ->
      listMatch = s.match(/^\[.*\]$/)
      if listMatch?
        readList(readNetLogoValue, s)
      else
        readNetLogoValue(s)
  )

# Should be thrown out in favor of proper `read-from-string` from the compiler, when we have it. --JAB (4/6/17)
#
# ((String, Number) => Turtle, (Number, Number) => Patch, (Number, Number, String) => Link, (String) => Breed, (String) => Breed) => (String) => (() => Any)
readNetLogoValue = (getTurtle, getPatchAt, getLink, getBreed, getBreedSingular) ->

  primary = (x) ->

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
      lambdaMatch = x.match(/^(\w+|\[[^\]"]*\]) *->.*$/)
      if lambdaMatch?
        throw new Error("Haha, you gave me the lambda #{x}.  I can't parse that, and `export-world` doesn't support them to begin with.")
      else # Not a lambda
        listMatch = x.match(/^\[.*\]$/)
        if listMatch?
          readList(primary, x)
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
              { 1: xStr, 2: yStr } = patchMatch
              getPatchAt(parseInt(xStr), parseInt(yStr))
            else # Not a patch
              linkMatch = lowerCased.match(/{([^ ]+) (\d+) (\d+)}/)
              if linkMatch?
                { 1: breedName, 2: end1IDStr, 3: end2IDStr } = linkMatch
                getLink(parseInt(end1IDStr), parseInt(end2IDStr), getBreedSingular(breedName).name)
              else # Not a link
                turtleMatch = lowerCased.match(/{([^ ]+) (\d+)}/)
                if turtleMatch?
                  { 1: breedName, 2: idStr } = turtleMatch
                  getTurtle(getBreedSingular(breedName).name, parseInt(idStr))
                else # Not a turtle
                  parsedNum = parseFloat(x)
                  if not isNaN(parsedNum)
                    parsedNum
                  else # Not a number
                    stringMatch = x.match(/^"(.*)"$/)
                    if stringMatch?
                      stringMatch[1]
                    else # Not a string
                      throw new Error("You supplied #{x}, and I don't know what the heck that is!")

    else
      result.value

  primary

module.exports = readNetLogoValue
