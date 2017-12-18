import {
  range,
  curry,
  curryObjectKN,
  curryObjectK,
  pipe,
  split,
  map,
  join,
  merge,
  triplet,
  length,
  ap
} from 'f-utility'

const TILDE = `~`
const COMMA = `,`
const COLON = `:`
const HASH = `#`
const DOLLAR = `$`
const NEWLINE = `\n`
const ARROW = `=>`
const SPACE = ` `
const SPACE_ARROW = SPACE + ARROW
const COMMA_SPACE = COMMA + SPACE
const COLON_SPACE = COLON + SPACE
const comma = join(COMMA_SPACE)
const space = join(COLON_SPACE)
const lines = join(NEWLINE)

const add = curry((b, a) => a + b)

const box = (x) => ([x])

const cut = curry(
  (index, arr) => ([
    arr.slice(0, index),
    arr.slice(index)
  ])
)

const propify = curry((property, x) => ({[property]: x}))
const argify = propify(`args`)

const pullReturnValueFromStringByDelimiter = curry(
  (delim, str) => pipe(
    split(delim),
    (x) => x[1]
  )(str)
)

const hasInlineReturn = curry(
  (delim, input) => (
    input.indexOf(delim) === -1
  )
)
const stripInlineReturnByDelimiter = curry(
  (delim, str) => ({
    returns: pullReturnValueFromStringByDelimiter(delim, str),
    args: str.slice(0, str.indexOf(delim))
  })
)
const makeReturnObjectByDelimiter = curry(
  (delim, str) => triplet(
    hasInlineReturn(delim),
    stripInlineReturnByDelimiter(delim),
    argify
  )(str)
)

const focusedOperation = curry(
  (focalPoint, fn, o) => merge(o, {[focalPoint]: fn(o[focalPoint])})
)

const ARGS = `args`

const focusOnArgs = focusedOperation(ARGS)

const INTERFACE = [ARGS, `name`, `returns`]

const functionDefinition = curryObjectKN(
  {
    k: INTERFACE,
    n: 4
  },
  ({name, args, returns, arrow = SPACE_ARROW}) => `function ${name}(${args})${arrow} ${returns}`
)

const defaultFunctionDefinition = curryObjectK(
  INTERFACE,
  ({args, returns, name}) => pipe(
    map(space),
    comma,
    argify,
    functionDefinition({arrow: COLON, returns, name})
  )(args)
)

const sliceParamsAtIndex = curry(
  (index, params) => pipe(
    cut(index + 1),
    map(comma),
    join(`): (`),
    box
  )(params)
)

const generateCurriedFunctionDefinitions = curryObjectK(
  [...INTERFACE, `index`],
  ({index = 0, args, returns, name}) => pipe(
    map(space),
    sliceParamsAtIndex(index),
    comma,
    argify,
    functionDefinition({returns, name})
  )(args)
)

const splitArrayTwiceOnDelimiters = curry(
  (d1, d2, arr) => pipe(
    split(d1),
    map(split(d2))
  )(arr)
)

const makeCurriedFunctionByIndex = curry(
  (data, index) => pipe(
    merge(data),
    generateCurriedFunctionDefinitions
  )({index})
)

const allCurriedPermutations = curryObjectK(
  INTERFACE,
  (data) => pipe(
    length,
    add(-1),
    range(0),
    map(makeCurriedFunctionByIndex(data)),
    lines
  )(data.args)
)

export const tcdh = curryObjectKN(
  {
    k: [`name`, ARGS],
    n: 3
  }, ({
    name,
    args: outerArgs,
    delimiters = {barrier: HASH, value: DOLLAR, returns: TILDE},
    returns: outerReturns = `any`
    // generic = false
  }) => {
    const {
      barrier: X,
      value: Y,
      returns: Z
    } = delimiters
    const {returns: pulledReturns, args} = pipe(
      makeReturnObjectByDelimiter(Z),
      focusOnArgs(splitArrayTwiceOnDelimiters(X, Y))
    )(outerArgs)
    const returns = pulledReturns || outerReturns
    return pipe(
      box,
      ap([
        defaultFunctionDefinition,
        allCurriedPermutations
      ]),
      lines
    )({returns, name, args})
  }
)
