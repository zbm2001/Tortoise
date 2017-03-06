v = require('vectorious')
M = v.Matrix
V = v.Vector

# https://ccl.northwestern.edu/netlogo/docs/matrix.html

print = (m) -> console.log(prettyPrintText(m))  # temp

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

# List[Number] -> Number
# Euclidean norm
_euclideanNorm = (v) ->
  sum = 0
  for n in v
    sum += n * n
  result = Math.sqrt(sum)

# Number -> -1 | 1
_sgn = (n) ->
  if n >= 0 then 1 else -1

roundZeros = (n) ->
  epsilon = 1e-13
  if Math.abs(n) < epsilon then 0 else n

pad = (A, n) ->
  I = M.identity(n)
  diff = n - A.shape[0]
  for row, i in toRowList(A)
    zeros = Array(diff).fill(0)
    setRow(I, diff + i, [zeros..., row...])
  I

qrDecomposition = (A) ->
  n = A.shape[0]
  I = M.identity(n)
  # Initialize Q = I, R = A
  [ Q, R ] = _qrDecomp(A, I, A)
  [ Q.map(roundZeros), R.map(roundZeros) ]

_qrDecomp = (A, Q, R) ->
  AT = toColumnList(A)
  n = AT.length

  # Don't compute for 1x1 matrices.
  if n < 2
    return [ Q, R ]

  # x <- first column of A
  x = new V(AT[0])

  # alpha * e1 <- [|x|, 0, ..., 0]
  # To get the same results as numpy, don't flip signs:
  # alpha = (-1 * _sgn(x.get(0))) * x.magnitude()
  alpha = x.magnitude()
  alphaE1 = new V([alpha, Array(n - 1).fill(0)...])

  # v <- normalize(x + alphaE1)
  # Need to convert it to a matrix to allow multiplication
  v = V.add(x, alphaE1).normalize()
  vM = new M(v, { shape: [n, 1] })

  # Compute Householder matrix H = I - 2vvT.
  vvT = M.multiply(vM, vM.T)
  H = M.subtract(M.identity(n), vvT.scale(2))

  # Hx reflects x over the plane given by v,
  # which reflects x onto the standard basis vector e1,
  # which zeros all the entries except x[0].
  # So HA zeros all subdiagonal elements of x.

  # Q = H1H2...Hn
  # R = Hn...H2H1A
  # Need to first pad H for multiplication.
  padH = pad(H, Q.shape[0])
  Q_ = times(Q, padH)
  R_ = times(padH, R)

  # Note that the principal submatrix of padH * R is
  # equivalent to the matrix product H * A.
  A_ = submatrix(R_, 1, 1, n, n)

  _qrDecomp(A_, Q_, R_)


# realEigenvalues : Matrix -> List[Number]
# Reports a list containing the real eigenvalues of the matrix.

# imaginaryEigenvalues : Matrix -> List[Number]
# Reports a list containing the imaginary eigenvalues of the matrix.

# eigenvectors : Matrix -> Matrix
# Reports a matrix containing the eigenvectors of the matrix.
# Each eigenvector is a column of the resulting matrix.

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

module.exports =
  {
    name: "matrix"
  , prims: {
    #   "FROM-LIST": fromList
    # ,   "TO-LIST": toList
    # ,   "IS-MAP?": isMap
    # ,       "ADD": add
    # ,       "GET": get
    # ,    "REMOVE": remove
    }
  }

A = new M([[1, 3, 4], [3, 1, 2], [4, 2, 1]])
B = new M([ [ -1, -1, 1 ], [ 1, 3, 3 ], [ -1, -1, 5 ], [ 1, 3, 7 ] ])
C = new M([[4, 2, 22, 1], [2, 3, 2, 13], [22, 2, 4, -5], [1, 13, -5, 1]])
D = new M([[12, -51, 4], [6, 167, -68], [-4, 24, -41]])

# array([[ -14.,  -21.,   14.],
#        [   0., -175.,   70.],
#        [   0.,    0.,  -35.]])
