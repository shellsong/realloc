const { stackProcess } = require('../../src/utils')

describe('test stack process', () => {
  it('call stack', () => {
    expect(stackProcess('', [
      [
        (input, ctx) => input + '+0',
        (input, ctx) => input + '-0'
      ],
      [
        (input, ctx) => input + '+1',
        (input, ctx) => input + '-1'
      ],
      [
        (input, ctx) => input + '+2',
        (input, ctx) => input + '-2'
      ],
      [
        (input, ctx) => input + '+3',
        (input, ctx) => input + '-3'
      ]
    ])).toBe('+0+1+2+3-3-2-1-0')
  })
})
