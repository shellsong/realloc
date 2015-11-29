import Compiler, { parseJSONPath, jsonPath } from '../../src/JSONPathCompiler'
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
var source = {
  store:{
    "book": [
      { "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      { "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      { "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      { "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    },
    "tree":{
      "nodes":[{
        nodes:[{
          id:2
        },{
          id:3
        }],
        id:1
      },{
        id:4
      }],
      id:0
    }
  }
}
describe('create compiler', () => {

  it('$', () => {
    var compiler = new Compiler('$')
    var fn = compiler.createMatcher()
    var result = fn({a:1}, [])
    expect(result.length).toBe(1)
    expect(result[0]).toEqual({
      pwd:['$'],
      name:null,
      value:{a:1}
    })
  })
  it('only key with args', () => {
    var compiler = new Compiler('$.store.{key}.{[0].a}')
    var args = [{
      key:'book',
      a:1
    }]
    var fn = compiler.createMatcher()
    // console.log(fn.toString())
    var result = fn(source, args)
    expect(result.length).toBe(1)
    expect(result[0]).toEqual({
      pwd:['$', 'store', 'book'],
      name:1,
      value:{
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      }
    })
  })
  it('filter', () => {
    var compiler = new Compiler('$.store.book[?(@.price<{c})]')
    var args = [{
      c:10
    }]
    var fn = compiler.createMatcher()
    // console.log(fn.toString())
    var result = fn(source, args)
    expect(result).toEqual([{
      pwd:['$', 'store', 'book'],
      name:0,
      value:{ "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      }
    },{
      pwd:['$', 'store', 'book'],
      name:2,
      value:{ "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      }
    }])
  })
  it('[,]', () => {
    var compiler = new Compiler('$.store.book[0,2].price')
    var fn = compiler.createMatcher()
    // console.log(fn.toString())
    var result = fn(source)
    expect(result).toEqual([{
      pwd:['$', 'store', 'book', 0],
      name:'price',
      value:8.95
    },{
      pwd:['$', 'store', 'book', 2],
      name:'price',
      value:8.99
    }])
  })
  it('range', () => {
    var compiler = new Compiler('$.store.book[0:3].price')
    var fn = compiler.createMatcher()
    // console.log(fn.toString())
    var result = fn(source)
    expect(result).toEqual([{
      pwd:['$', 'store', 'book', 0],
      name:'price',
      value:8.95
    },{
      pwd:['$', 'store', 'book', 1],
      name:'price',
      value:12.99
    },{
      pwd:['$', 'store', 'book', 2],
      name:'price',
      value:8.99
    }])
  })
  it('*, all values', () => {
    var compiler = new Compiler('$.store.book.*.price')
    var fn = compiler.createMatcher()
    // console.log(fn.toString())
    var result = fn(source)
    expect(result.map((r) => r.value)).toEqual([8.95, 12.99, 8.99, 22.99])
  })
  it('recursive descent', () => {
    var compiler = new Compiler('$.store.tree..nodes[?(@.id === 1)].id')
    var fn = compiler.createMatcher()
    // console.log(fn.toString())
    var result = fn(source)
    expect(result.map((r) => r.value)).toEqual([1])
  })
})

describe('json path function impl', () => {
  it('should return matches', () => {
    expect(jsonPath(source,'$.store.book.*.price')).toEqual([8.95, 12.99, 8.99, 22.99])
  })
})
