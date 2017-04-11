// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise
package dock

import java.nio.file.Paths

import org.nlogo.tortoise.tags.SlowTest

class TestImportWorld extends DockingSuite {

  private val csvPath = s"${Paths.get("").toAbsolutePath}/resources/test/export-world/pd-two-person-iterated.csv"

  test("Import World Fresh", SlowTest) { implicit fixture => import fixture._
    open("models/Sample Models/Social Science/Unverified/Prisoner's Dilemma/PD Two Person Iterated.nlogo", None)
    testCommand(s"""import-world "$csvPath"""")
  }

  test("Import World Clobber", SlowTest) { implicit fixture => import fixture._
    open("models/Sample Models/Social Science/Unverified/Prisoner's Dilemma/PD Two Person Iterated.nlogo", None)
    testCommand("setup")
    testCommand(s"""import-world "$csvPath"""")
  }

}
