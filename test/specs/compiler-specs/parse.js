const Compiler = require('../../../src/JSONPathCompiler')
const { lexers, parseJSONPath } = Compiler


describe('parse json path', () => {
  it('$', () => {
    expect(parseJSONPath('$')).toEqual(['$'])
  })
  it('$.store.book[*].author', () => {
    expect(parseJSONPath('$.store.book[*].author')).toEqual(['$','["store"]','["book"]','*','["author"]'])
  })
  it('$..author', () => {
    expect(parseJSONPath('$..author')).toEqual(['$','..','["author"]'])
  })
  it('$.store.*', () => {
    expect(parseJSONPath('$.store.*')).toEqual(['$','["store"]','*'])
  })
  it('$.store..price', () => {
    expect(parseJSONPath('$.store..price')).toEqual(['$','["store"]','..','["price"]'])
  })
  it('$..book[2]', () => {
    expect(parseJSONPath('$..book[2]')).toEqual(['$','..','["book"]','[2]'])
  })
  it('$..book[(@.length-1)]', () => {
    expect(parseJSONPath('$..book[(@.length-1)]')).toEqual(['$','..','["book"]','(@.length-1)'])
  })
  it('$..book[-1:]', () => {
    expect(parseJSONPath('$..book[-1:]')).toEqual(['$','..','["book"]','-1:'])
  })
  it('$..book[0,1]', () => {
    expect(parseJSONPath('$..book[0,1]')).toEqual(['$','..','["book"]','0,1'])
  })
  it('$..author', () => {
    expect(parseJSONPath('$..author')).toEqual(['$','..','["author"]'])
  })
  it('$..book[:2]', () => {
    expect(parseJSONPath('$..book[:2]')).toEqual(['$','..','["book"]',':2'])
  })
  it('$..book[?(@.isbn)]', () => {
    expect(parseJSONPath('$..book[?(@.isbn)]')).toEqual(['$','..','["book"]','?(@.isbn)'])
  })
  it('$..book[?(@.price<10)]', () => {
    expect(parseJSONPath('$..book[?(@.price<10)]')).toEqual(['$','..','["book"]','?(@.price<10)'])
  })
  it('$.store.{book}[?(@.price<{a.b})]', () => {
    expect(parseJSONPath('$.store.{book}[?(@.price<{a.b})]')).toEqual(['$','["store"]','[{book}]','?(@.price<{a.b})'])
  })
  it('$.store.{book}.{[0].a}', () => {
    expect(parseJSONPath('$.store.{book}.{[0].a}')).toEqual(['$','["store"]','[{book}]','[{[0].a}]'])
  })
})
