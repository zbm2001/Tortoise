v = require('vectorious')
M = v.Matrix
V = v.Vector
numeric = require('./numeric.js')

# https://ccl.northwestern.edu/netlogo/docs/matrix.html

# (Number, Number, Number) -> Matrix
makeConstant = (rows, cols, initialValue) ->
  M.fill(rows, cols, initialValue)

# Number -> Matrix
makeIdentity = (size) ->
  M.identity(size)

# List[List[Number]] -> Matrix
fromRowList = (nestedList) ->
  new M(nestedList)

# List[List[Number]] -> Matrix
fromColumnList = (nestedList) ->
  (new M(nestedList)).T

# Matrix -> List[List[Number]]
toRowList = (matrix) ->
  matrix.toArray()

# Matrix -> List[List[Number]]
toColumnList = (matrix) ->
  matrix.T.toArray()

# Matrix -> Matrix
copy = (matrix) ->
  new M(matrix.toArray())

# Matrix -> String
prettyPrintText = (matrix) ->
  [ rows, cols ] = matrix.shape
  itemStrs =
    [] for _ in [0...rows]
  longest =
    0 for _ in [0...cols]

  matrix.each((item, i, j) ->
    str = item.toString()
    len = str.length
    itemStrs[i][j] = str
    if len > longest[j]
      longest[j] = len)

  alignRow = (row) ->
    row
      .map((str, j) ->
        padSize = longest[j] - str.length
        pad = ' '.repeat(padSize)
        pad.concat(str))
      .join(' ')

  aligned = itemStrs
    .map((row) -> "[ #{alignRow(row)} ]")
    .join('\n ')

  # TODO: This should be logged, not just returned.
  "[#{aligned}]"

# (Matrix, Number, Number) -> Number
get = (matrix, i, j) ->
  matrix.get(i, j)

# (Matrix, Number) -> List[Number]
getRow = (matrix, i) ->
  cols = matrix.shape[1]
  matrix.get(i, j) for j in [0...cols]

# (Matrix, Number) -> List[Number]
getColumn = (matrix, j) ->
  rows = matrix.shape[0]
  matrix.get(i, j) for i in [0...rows]

# (Matrix, Number, Number, Number) -> Void
set = (matrix, i, j, newVal) ->
  matrix.set(i, j, newVal)
  return

# (Matrix, Number, Number) -> Void
setRow = (matrix, i, newVals) ->
  cols = matrix.shape[1]
  matrix.set(i, j, newVals[j]) for j in [0...cols]
  return

# (Matrix, Number, Number) -> Void
setColumn = (matrix, j, newVals) ->
  rows = matrix.shape[0]
  matrix.set(i, j, newVals[i]) for i in [0...rows]
  return

# (Matrix, Number, Number) -> Void
swapRows = (matrix, r1, r2) ->
  matrix.swap(r1, r2)
  return

# (Matrix, Number, Number) -> Void
swapColumns = (matrix, c1, c2) ->
  rows = matrix.shape[0]
  for i in [0...rows]
    oldC1 = matrix.get(i, c1)
    matrix.set(i, c1, matrix.get(i, c2))
    matrix.set(i, c2, oldC1)
  return

# (Matrix, Number, Number, Number) -> Matrix
setAndReport = (matrix, i, j, newVal) ->
  dupe = copy(matrix)
  set(dupe, i, j, newVal)
  dupe

# (Matrix) -> (Number, Number)
dimensions = (matrix) ->
  matrix.size

# (Matrix, Number, Number, Number, Number) -> Matrix
# TODO: Error checking for bounds
submatrix = (matrix, r1, c1, r2, c2) ->
  arr = matrix.toArray()
  subRows = r2 - r1
  subCols = c2 - c1
  subArr =
    [] for _ in [0...subRows]

  for i in [0...subRows]
    for j in [0...subCols]
      subArr[i][j] = arr[r1 + i][c1 + j]

  new M(subArr)

# (((Number...) -> Number), Matrix, List[Matrix]?) -> Matrix
map = (reporter, matrix, rest...) ->
  matrix.map((item, i, j) ->
    restItems = rest.map((m) -> m.get(i, j))
    reporter(item, restItems...))

_opReducer = (scalarOp, matrixOp, mixedOp) ->
  (m1, m2, rest...) ->
    operands = [m1, m2, rest...]
    operands.reduce((left, right) ->
      if typeof left is 'number'
        if typeof right is 'number'  # Scalar, Scalar
          scalarOp(left, right)
        else  # Scalar, Matrix
          mixedOp(right, left)
      else
        if typeof right is 'number'  # Matrix, Scalar
          mixedOp(left, right)
        else  # Matrix, Matrix
          matrixOp(left, right))

# ((Matrix | Number), (Matrix | Number), (Matrix | Number)*) -> Matrix
times = (m1, m2, rest...) ->
  matrixMultiplier = _opReducer(
    (s1, s2) -> s1 * s2,
    M.multiply,
    M.scale
  )
  matrixMultiplier(m1, m2, rest...)

# (Matrix, Matrix...) -> Matrix
timesElementWise = (m1, m2, rest...) ->
  pointwiseMultiplier = _opReducer(
    (s1, s2) -> s1 * s2,
    M.product,
    M.scale
  )
  pointwiseMultiplier(m1, m2, rest...)

plus = (m1, m2, rest...) ->
  adder = _opReducer(
    (s1, s2) -> s1 + s2,
    M.add,
    (m, s) -> m.map((x) -> x + s)
  )
  adder(m1, m2, rest...)

minus = (m1, m2, rest...) ->
  # Can't reuse _opReducer because order of arguments
  # matters in mixed scalar/vector operations.
  operands = [m1, m2, rest...]

  # Need to look ahead to find matrix dimensions, so
  # scalar values can be broadcast to the right size.
  [ rows, cols ] = operands.find((x) -> x instanceof M).shape
  broadcast = (n) -> M.fill(rows, cols, n)

  operands.reduce((left, right) ->
    leftMatrix = if typeof left is 'number' then broadcast(left) else left
    rightMatrix = if typeof right is 'number' then broadcast(right)  else right
    M.subtract(leftMatrix, rightMatrix))

# Matrix -> Matrix
inverse = (matrix) ->
  matrix.inverse()

# Matrix -> Matrix
transpose = (matrix) ->
  matrix.T

# realEigenvalues : Matrix -> List[Number]
# Reports a list containing the real eigenvalues of the matrix.
realEigenvalues = (A) ->
  { lambda } = numeric.eig(toRowList(A))
  new M(lambda.x)

# imaginaryEigenvalues : Matrix -> List[Number]
# Reports a list containing the imaginary eigenvalues of the matrix.
imaginaryEigenvalues = (A) ->
  throw new Error('Not implemented')

# eigenvectors : Matrix -> Matrix
# Reports a matrix containing the eigenvectors of the matrix.
# Each eigenvector is a column of the resulting matrix.
eigenvectors = (A) ->
  { E } = numeric.eig(toRowList(A))
  new M(E.x)

# Matrix -> Number
det = (matrix) ->
  # Apparently this is inefficient for large matrices,
  # but premature optimization is the root of all evil.
  matrix.determinant()

# Matrix -> Number
rank = (matrix) ->
  matrix.rank()

# Matrix -> Number
trace = (matrix) ->
  matrix.trace()

# (Matrix, Matrix) -> Matrix
# Apparently this yields approximate results.
# TODO: Fix that.
solve = (A, C) ->
  A.solve(C)

# # List -> (Number Number Number Number)
# forecastContinuousGrowth = (data) ->

_forecastGrowthHelper = (data) ->
  indepVar = [0...data.length]
  dataMatrix = fromColumnList([ data, indepVar ])
  [ coefficients, stats ] = regress(dataMatrix)
  [ constant, slope ] = coefficients
  [ r2 ] = stats
  [ constant, slope, r2 ]

forecastLinearGrowth = (data) ->
  [ constant, slope, r2 ] = _forecastGrowthHelper(data)
  x = data.length
  forecast = slope * x + constant
  [ forecast, constant, slope, r2 ]

forecastCompoundGrowth = (data) ->
  lnData = data.map(Math.log)
  [ c, p, r2 ] = _forecastGrowthHelper(lnData)
  constant = Math.exp(c)
  proportion = Math.exp(p)
  x = data.length
  forecast = constant * proportion ** x
  [ forecast, constant, proportion, r2 ]

forecastContinuousGrowth = (data) ->
  lnData = data.map(Math.log)
  [ c, rate, r2 ] = _forecastGrowthHelper(lnData)
  constant = Math.exp(c)
  x = data.length
  forecast = constant * Math.exp(rate * x)
  [ forecast, constant, rate, r2 ]

regress = (data) ->
  # y is a column vector [y1 ... yN].T
  # denoting the dependent variable observations.
  y = fromColumnList([ getColumn(data, 0) ])

  # To construct the matrix X, we replace the first
  # column (the dependent variable) of the input matrix
  # with all 1's:
  # [ 1 v1 s1 ]
  # [ 1 v2 s2 ] ...etc.
  [ nObservations, nVars ] = data.shape
  indepVars = submatrix(data, 0, 1, nObservations, nVars)
  ones = y.map((_) -> 1)
  X = M.augment(ones, indepVars)

  # Solve the system Xb = y for b, the row vector
  # of coefficients for each independent variable.
  # The following form ensures X does not need to
  # be square:
  # y.T * X * (X.T * X)^-1
  coefficients = times(y.T, X, inverse(times(X.T, X)))

  # Compute the total sum of squares for the
  # coefficients vector.
  ySum = y.reduce((a, b) -> a + b)
  yBar = ySum / nObservations
  yDiff = minus(y, M.fill(nObservations, 1, yBar))
  totalSumSq = times(yDiff.T, yDiff).get(0, 0)

  # Compute residual sum squares.
  resid = minus(times(X, coefficients.T), y)
  residSumSq = times(resid.T, resid).get(0, 0)

  # Compute the R^2 value and return all statistics.
  rSquared = 1 - (residSumSq / totalSumSq)
  stats = [ rSquared, totalSumSq, residSumSq ]

  [ getRow(coefficients, 0), stats ]

print = (x) -> console.log(prettyPrintText(x))


# Y
happiness = [2, 4, 5, 8, 10]
# X
snackFoodConsumed = [3, 4, 3, 7, 8]
goalsAccomplished = [2, 3, 5, 8, 9]

console.log('Expected:')
# Regression constant, coefficients on each independent var
console.log([[-0.14606741573033788, 0.3033707865168543, 0.8202247191011234],
# R^2                   Total sum sq        Residual sum sq
 [0.9801718440185063,   40.8,               0.8089887640449439]])
console.log('Actual:')
console.log(regress(fromColumnList([happiness, snackFoodConsumed, goalsAccomplished])))

data = [20, 25, 28, 32, 35, 39]

console.log('Linear growth')
console.log('Expected:')
console.log([42.733333333333334, 20.619047619047638, 3.6857142857142824, 0.9953743395474031])
console.log('Actual:')
console.log(forecastLinearGrowth(data))

console.log('Compound growth')
console.log('Expected:')
console.log([45.60964465307147, 21.15254147944863, 1.136621034423892, 0.9760867518334806])
console.log('Actual:')
console.log(forecastCompoundGrowth(data))

console.log('Continuous growth')
console.log('Expected:')
console.log([45.60964465307146, 21.15254147944863, 0.12805985615332668, 0.9760867518334806])
console.log('Actual:')
console.log(forecastContinuousGrowth(data))

# module.exports = {
#   name: "matrix",
#   prims: {
#     "MAKE-CONSTANT": makeConstant,
#     "MAKE-IDENTITY": makeIdentity,
#     "FROM-ROW-LIST": fromRowList,
#     "FROM-COLUMN-LIST": fromColumnList,
#     "TO-ROW-LIST": toRowList,
#     "TO-COLUMN-LIST": toColumnList,
#     "COPY": copy,
#     "PRETTY-PRINT-TEXT": prettyPrintText,
#     "SOLVE": solve,
#     "GET": get,
#     "GET-ROW": getRow,
#     "GET-COLUMN": getColumn,
#     "SET": set,
#     "SET-ROW": setRow,
#     "SET-COLUMN": setColumn,
#     "SWAP-ROWS": swapRows,
#     "SWAP-COLUMNS": swapColumns,
#     "SET-AND-REPORT": setAndReport,
#     "DIMENSIONS": dimensions,
#     "SUBMATRIX": submatrix,
#     "MAP": map,
#     "TIMES-SCALAR": times,
#     "TIMES": times,
#     "*": times,
#     "TIMES-ELEMENT-WISE": timesElementWise,
#     "PLUS-SCALAR": plus,
#     "PLUS": plus,
#     "+": plus,
#     "MINUS": minus,
#     "-": minus,
#     "INVERSE": inverse,
#     "TRANSPOSE": transpose,
#     "REAL-EIGENVALUES": realEigenvalues,
#     "IMAGINARY-EIGENVALUES": imaginaryEigenvalues,
#     "EIGENVECTORS": eigenvectors,
#     "DET": det,
#     "RANK": rank,
#     "TRACE": trace,
#   }
# }
