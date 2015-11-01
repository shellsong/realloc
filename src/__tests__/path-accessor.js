jest.dontMock('../path-accessor')
jest.dontMock('../utils')

const {
  parseJSONPath,
  createGetter,
  createSetter
} = require('../keyPath')

describe('parse json path', () => {
  it('$ ', () => {
    expect(parseJSONPath('$')).toEqual(['$'])
  })
  it('$.$_p({]@rop0', () => {
    expect(parseJSONPath('$.$_p({]@rop0')).toEqual(['$','$_p({]@rop0'])
  })
  it('$["$_p({]@rop0!"]', () => {
    expect(parseJSONPath('$["$_p({]@rop0!"]')).toEqual(['$','$_p({]@rop0!'])
  })
  it('$.{(prop1', () => {
    expect(parseJSONPath('$.{(prop1')).toEqual(['$','{(prop1'])
  })
  it('$["a"]["b"]["c"]', () => {
    expect(parseJSONPath('$["a"]["b"]["c"]')).toEqual(['$','a','b','c'])
  })
  it('$["a"]["b.c"]["d"]', () => {
    expect(parseJSONPath('$["a"]["b.c"]["d"]')).toEqual(['$','a','b.c','d'])
  })
  it('$["a"]["b.c"][(!@.length)]', () => {
    expect(parseJSONPath('$["a"]["b.c"][(!@.length)]')).toEqual(['$','a','b.c','(!@.length)'])
  })
  it('$.ab.(@.a === 0)', () => {
    expect(parseJSONPath('$.ab.(@.a === 0)')).toEqual(['$','ab','(@.a === 0)'])
  })
  it('$..nodes.(@.a === 0).a', () => {
    expect(parseJSONPath('$..nodes.(@.a === 0).a')).toEqual(['$','..','nodes','(@.a === 0)','a'])
  })
  it('$.ab.?(@.a === 0)', () => {
    expect(parseJSONPath('$.ab.?(@.a === 0)')).toEqual(['$','ab','?(@.a === 0)'])
  })
  it('$.ab.(@.a === {0})', () => {
    expect(parseJSONPath('$.ab.(@.a === {0})')).toEqual(['$','ab','(@.a === {0})'])
  })
  it('$.ab.?(@.a === {0})', () => {
    expect(parseJSONPath('$.ab.?(@.a === {0})')).toEqual(['$','ab','?(@.a === {0})'])
  })
  it('$.{ab}.(@.a === {0})', () => {
    expect(parseJSONPath('$.{a.b}.(@.a === {0})')).toEqual(['$','{a.b}','(@.a === {0})'])
  })
})


describe('no param', () => {
  it('access {a:{b:1}} ', () => {
    var obj = {a:{b:1}}
    expect(createGetter('$')(obj)).toBe(obj)
    expect(createSetter('$')(obj,{c:{d:2}})).toEqual({c:{d:2}})

  })
})
