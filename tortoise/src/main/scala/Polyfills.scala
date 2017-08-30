// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import TortoiseSymbol.JsPolyfill

object Polyfills {

  def getAll: Seq[JsPolyfill] =
    Seq(
      // `slice` and `copyWithin` are needed by the `swap` method in Vectorious (used by the Matrix extension).
      // Both are in the ES6 spec and should be directly implemented in Nashorn at some point. --JAB (8/26/17)
      JsPolyfill("Float64Array", "slice",      "function() { return new Float64Array(Array.prototype.slice.apply(this, arguments)); }")
    , JsPolyfill("Float64Array", "copyWithin", copyWithinJS)
    )

  // Courtesy of: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
  private def copyWithinJS =
    """function(target, start, end) {
      |  if (this == null) {
      |    throw new TypeError('this is null or not defined');
      |  }
      |
      |  var O = Object(this);
      |
      |  var len = O.length >>> 0;
      |
      |  var relativeTarget = target >> 0;
      |
      |  var to = relativeTarget < 0 ?
      |    Math.max(len + relativeTarget, 0) :
      |    Math.min(relativeTarget, len);
      |
      |  var relativeStart = start >> 0;
      |
      |  var from = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
      |
      |  var end = arguments[2];
      |  var relativeEnd = end === undefined ? len : end >> 0;
      |
      |  var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
      |
      |  var count = Math.min(final - from, len - to);
      |
      |  var direction = 1;
      |
      |  if (from < to && to < (from + count)) {
      |    direction = -1;
      |    from += count - 1;
      |    to += count - 1;
      |  }
      |
      |  while (count > 0) {
      |    if (from in O) {
      |      O[to] = O[from];
      |    } else {
      |      delete O[to];
      |    }
      |
      |    from += direction;
      |    to += direction;
      |    count--;
      |  }
      |
      |  return O;
      |}
    """.stripMargin

}
