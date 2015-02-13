// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

case class Model(
    path: String,
    variation: String = "",
    dimensions: Option[(Int, Int, Int, Int)] = None,
    setup: String = "setup",
    go: String = "go",
    repetitions: Int,
    metrics: Seq[String] = Seq()) {
  def filename = new java.io.File(path).getName.stripSuffix(".nlogo")
  def name =
    if (variation.isEmpty)
      filename
    else
      s"$filename (${variation})"
}

object Model {
  // benchmarks, then Code Examples, then Sample Models
  val models = Seq[Model](
    Model(path = "models/Curricular Models/Connected Chemistry/Connected Chemistry Reversible Reaction.nlogo", repetitions = 20),
    Model(path = "models/Sample Models/Biology/Evolution/Mimicry.nlogo", repetitions = 20)
  )
}
