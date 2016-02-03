// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.literal

import
  scala.scalajs.js.annotation.{ JSExport, JSExportAll }

// Inclusion of `ask` is inspired by the fact that, since a primitive like `create-link-with` can
// return `nobody`, and it can also take an initialization block for the to-be-created thing, either
// the init block must be branched against or `nobody` must ignore it  --JAB (7/18/14)
@JSExport("org.nlogo.tortoise.literal.Nobody")
@JSExportAll
object Nobody {
  def ask(): Unit         = {}
  def id                  = -1
  def isDead()            = true
  override def toString() = "nobody"
}
