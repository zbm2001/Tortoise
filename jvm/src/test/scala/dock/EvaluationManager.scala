// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise
package dock

import
  org.nlogo.core.{ CompilerException, FrontEndInterface, Program },
    FrontEndInterface.ProceduresMap

import
  jsengine.Nashorn

// Needed for `run` and `run-result`
trait EvaluationManager {

  protected def evaluationEngine:            Nashorn
  protected def currentProcedures: ProceduresMap
  protected def currentProgram:    Program

  private object Evaluator {

    def evalCommand(code: String): Unit = {
      handlingCompilerErrors {
        evaluationEngine.eval(Compiler.compileCommands(code, currentProcedures, currentProgram))
      }
      ()
    }

    def evalReporter(code: String): AnyRef = {
      handlingCompilerErrors {
        evaluationEngine.eval(Compiler.compileReporter(code, currentProcedures, currentProgram))
      }
    }

    private def handlingCompilerErrors[T](block: => T): T = {
      try block
      catch {
        case ex: CompilerException =>
          val message = ex.getMessage.replaceAll("'", "\\\\'")
          evaluationEngine.eval(s"throw new Error('$message');").asInstanceOf[Nothing]
      }
    }

  }

  evaluationEngine.engine.put("Evaluator", Evaluator)

}
