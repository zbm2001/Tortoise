// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise
package dock

import org.nlogo.tortoise.tags.SlowTest

class TestImportWorld extends DockingSuite {

  test("Import World Fresh", SlowTest) { implicit fixture => import fixture._
    open("models/Sample Models/Social Science/Unverified/Prisoner's Dilemma/PD Two Person Iterated.nlogo", None)
    testCommand("import-world \"../../../../../resources/test/export-world/pd-two-person-iterated.csv\"")
  }

  test("Import World Clobber", SlowTest) { implicit fixture => import fixture._
    open("models/Sample Models/Social Science/Unverified/Prisoner's Dilemma/PD Two Person Iterated.nlogo", None)
    testCommand("setup")
    testCommand("import-world \"../../../../../resources/test/export-world/pd-two-person-iterated.csv\"")
  }

}
