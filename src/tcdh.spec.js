/* global test */
import {t} from 'germs'
import {tcdh} from './tcdh'

test(`tcdh should generate curried ts functions`, () => {
  const name = `quaternaryFn`
  const output = tcdh({
    name,
    args: `a$any#b$any#c$any#d$any~boolean`
  })
  const expected = ([
    `function quaternaryFn(a: any, b: any, c: any, d: any): boolean`,
    `function quaternaryFn(a: any): (b: any, c: any, d: any) => boolean`,
    `function quaternaryFn(a: any, b: any): (c: any, d: any) => boolean`,
    `function quaternaryFn(a: any, b: any, c: any): (d: any) => boolean`
  ]).join(`\n`)
  t.is(output, expected)
  const output2 = tcdh({
    name,
    args: `a$any#b$any#c$any#d$any`,
    returns: `boolean`
  })
  t.is(output2, expected)
  const output3 = tcdh({
    name,
    args: `a any, b any, c any, d any => boolean`,
    delimiters: {
      barrier: `, `,
      value: ` `,
      returns: ` => `
    }
  })
  t.is(output3, expected)
})
