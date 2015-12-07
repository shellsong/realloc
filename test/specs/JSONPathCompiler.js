import Compiler, { parseJSONPath, JSONPath } from '../../src/JSONPathCompiler'
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
    expect(parseJSONPath('$.store.{book}[?(@.price<{a.b})]')).toEqual(['$','["store"]','[{["book"]}]','?(@.price<{["a"]["b"]})'])
  })
  it('$.store.{book}.{0.a}', () => {
    expect(parseJSONPath('$.store.{book}.{0.a}')).toEqual(['$','["store"]','[{["book"]}]','[{[0]["a"]}]'])
  })
})
function matcherTestCaseFactory(expr, $, args, getTargetResults, getTarget){
  const results = ((new Compiler(expr)).createMatcher())($, args)
  const targetResults = getTargetResults(expr, $, args)
  results.forEach((result, i) => {
    const targetResult = targetResults[i]
    expect(result).toEqual(targetResult)
    expect(result.value).toBe(targetResult&&targetResult.value)
  })
  return {
    state:$,
    results:results
  }
}
describe('JSONPath Matcher', () => {
  let source
  beforeEach(() => {
    source = {
      store:{
        book:[{title:'Book A'},{title:'Book B'},{title:'Book C'}],
      },
      tree:{
        id:0,
        nodes:[{
          id:1,
          nodes:[{
            id:2,
            nodes:[{
              id:3
            }]
          }]
        },{
          id:4,
          nodes:[{
            id:5
          },{
            id:6
          }]
        },{
          id:7,
          nodes:[]
        }]
      }
    }
  })
  it('$', () => {
    matcherTestCaseFactory('$',source, [], (expr, $, args) => {
      return [{
        pwd:['$'],
        name:null,
        value:$
      }]
    })
  })
  it('match $.{name}.book', () => {
    matcherTestCaseFactory('$.{name}.book', source, [{
      name:'store'
    }], (expr, $, args) => {
      return [{
        pwd:['$', 'store'],
        name:'book',
        value:$.store.book
      }]
    })
  })
  it('should match $.store.{key}.{0.a}', () => {
    matcherTestCaseFactory('$.store.{key}.{0.a}', source, [{
      key:'book',
      a:1
    }], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book'],
        name:1,
        value:$.store.book[1]
      }]
    })
  })
  it('should match $.store.{key}[(@.length - 1)]', () => {
    matcherTestCaseFactory('$.store.{key}[(@.length - 1)]', source, [{
      key:'book'
    }], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book'],
        name:$.store.book.length - 1,
        value:$.store.book[$.store.book.length - 1]
      }]
    })
  })
  it('should match $.store.{key}[(@.length - {1})].title', () => {
    matcherTestCaseFactory('$.store.{key}[(@.length - 1)].title', source, [{
      key:'book'
    }, 1], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book', $.store.book.length - args[1]],
        name:'title',
        value:$.store.book[$.store.book.length - 1].title
      }]
    })
  })
  it('should match $.store.book[?(@.title[@.title.length - 1] === {0})]', () => {
    matcherTestCaseFactory('$.store.book[?(@.title[@.title.length - 1] === {0})]'
    , source, ['B'], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book'],
        name:1,
        value:$.store.book[1]
      }]
    })
  })
  it('should match $.store.book[?(@.title[@.title.length - 1] === {0})].title', () => {
    matcherTestCaseFactory('$.store.book[?(@.title[@.title.length - 1] === {0})].title'
    , source, ['B'], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book', 1],
        name:'title',
        value:'Book B'
      }]
    })
  })
  it('should match $.store.book[0,2]', () => {
    matcherTestCaseFactory('$.store.book[0,2]', source, [], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book'],
        name:0,
        value:$.store.book[0]
      },{
        pwd:['$', 'store', 'book'],
        name:2,
        value:$.store.book[2]
      }]
    })
  })
  it('should match $.store.book[0,2].undef', () => {
    matcherTestCaseFactory('$.store.book[0,2].undef', source, [], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book', 0],
        name:'undef',
        value:undefined
      },{
        pwd:['$', 'store', 'book', 2],
        name:'undef',
        value:undefined
      }]
    })
  })
  it('should match $.store.book[0,2].title', () => {
    matcherTestCaseFactory('$.store.book[0,2].title', source, [], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book', 0],
        name:'title',
        value:$.store.book[0].title
      },{
        pwd:['$', 'store', 'book', 2],
        name:'title',
        value:$.store.book[2].title
      }]
    })
  })
  it('should match $.store.book[0:2]', () => {
    matcherTestCaseFactory('$.store.book[0:2]', source, [], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book'],
        name:0,
        value:$.store.book[0]
      },{
        pwd:['$', 'store', 'book'],
        name:1,
        value:$.store.book[1]
      }]
    })
  })
  it('should match $.store.book[0:2].title', () => {
    matcherTestCaseFactory('$.store.book[0:2].title', source, [], (expr, $, args) => {
      return [{
        pwd:['$', 'store', 'book', 0],
        name:'title',
        value:$.store.book[0].title
      },{
        pwd:['$', 'store', 'book', 1],
        name:'title',
        value:$.store.book[1].title
      }]
    })
  })
  it('should match $.store.book.*.title', () => {
    matcherTestCaseFactory('$.store.book.*.title', source, [], (expr, $, args) => {
      return source.store.book.map((book, i) => {
        return {
          pwd:['$', 'store', 'book', i],
          name:'title',
          value:book.title
        }
      })
    })
  })
  it('should match $.store.book.*', () => {
    matcherTestCaseFactory('$.store.book.*', source, [], (expr, $, args) => {
      return source.store.book.map((book, i) => {
        return {
          pwd:['$', 'store', 'book'],
          name:i,
          value:book
        }
      })
    })
  })
  it('should match $.store.*', () => {
    matcherTestCaseFactory('$.store.*', source, [], (expr, $, args) => {
      return [{
        pwd:['$', 'store'],
        name:'book',
        value:$.store.book
      }]
    })
  })
  it('should match $..', () => {
    matcherTestCaseFactory('$..', source, [], (expr, $, args) => {
      return [{
        pwd:[],
        name:'$',
        value:$
      }, {
        pwd:['$'],
        name:'store',
        value:$.store
      }, {
        pwd:['$', 'store', 'book'],
        name:0,
        value:$.store.book[0]
      }, {
        pwd:['$', 'store', 'book'],
        name:1,
        value:$.store.book[1]
      }, {
        pwd:['$', 'store', 'book'],
        name:2,
        value:$.store.book[2]
      }, {
        pwd:['$'],
        name:'tree',
        value:$.tree
      }, {
        pwd:['$', 'tree', 'nodes'],
        name:0,
        value:$.tree.nodes[0]
      }, {
        pwd:['$', 'tree', 'nodes', 0, 'nodes'],
        name:0,
        value:$.tree.nodes[0].nodes[0]
      }, {
        pwd:['$', 'tree', 'nodes', 0, 'nodes', 0, 'nodes'],
        name:0,
        value:$.tree.nodes[0].nodes[0].nodes[0]
      }, {
        pwd:['$', 'tree', 'nodes'],
        name:1,
        value:$.tree.nodes[1]
      }, {
        pwd:['$', 'tree', 'nodes', 1, 'nodes'],
        name:0,
        value:$.tree.nodes[1].nodes[0]
      }, {
        pwd:['$', 'tree', 'nodes', 1, 'nodes'],
        name:1,
        value:$.tree.nodes[1].nodes[1]
      }, {
        pwd:['$', 'tree', 'nodes'],
        name:2,
        value:$.tree.nodes[2]
      }]
    })
  })
  it('should match $.tree..', () => {
    matcherTestCaseFactory('$.tree..', source, [], (expr, $, args) => {
      return [{
        pwd:['$'],
        name:'tree',
        value:$.tree
      },{
        pwd:['$', 'tree', 'nodes'],
        name:0,
        value:$.tree.nodes[0]
      },{
        pwd:['$', 'tree', 'nodes', 0, 'nodes'],
        name:0,
        value:$.tree.nodes[0].nodes[0]
      },{
        pwd:['$', 'tree', 'nodes', 0, 'nodes', 0, 'nodes'],
        name:0,
        value:$.tree.nodes[0].nodes[0].nodes[0]
      },{
        pwd:['$', 'tree', 'nodes'],
        name:1,
        value:$.tree.nodes[1]
      },{
        pwd:['$', 'tree', 'nodes', 1, 'nodes'],
        name:0,
        value:$.tree.nodes[1].nodes[0]
      },{
        pwd:['$', 'tree', 'nodes', 1, 'nodes'],
        name:1,
        value:$.tree.nodes[1].nodes[1]
      },{
        pwd:['$', 'tree', 'nodes'],
        name:2,
        value:$.tree.nodes[2]
      }]
    })
  })
  it('should match $.tree..id', () => {
    matcherTestCaseFactory('$.tree..id', source, [], (expr, $, args) => {
      return [{
        pwd:['$', 'tree'],
        name:'id',
        value:$.tree.id
      }, {
        pwd:['$', 'tree', 'nodes', 0],
        name:'id',
        value:$.tree.nodes[0].id
      }, {
        pwd:['$', 'tree', 'nodes', 0, 'nodes', 0],
        name:'id',
        value:$.tree.nodes[0].nodes[0].id
      }, {
        pwd:['$', 'tree', 'nodes', 0, 'nodes', 0, 'nodes', 0],
        name:'id',
        value:$.tree.nodes[0].nodes[0].nodes[0].id
      }, {
        pwd:['$', 'tree', 'nodes', 1],
        name:'id',
        value:$.tree.nodes[1].id
      }, {
        pwd:['$', 'tree', 'nodes', 1, 'nodes', 0],
        name:'id',
        value:$.tree.nodes[1].nodes[0].id
      }, {
        pwd:['$', 'tree', 'nodes', 1, 'nodes', 1],
        name:'id',
        value:$.tree.nodes[1].nodes[1].id
      }, {
        pwd:['$', 'tree', 'nodes', 2],
        name:'id',
        value:$.tree.nodes[2].id
      }]
    })
  })
})

describe('JSONPath legacy implment', () => {
  let source
  beforeEach(() => {
    source = {
      "store": {
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
        }
      }
    }
  })
  it('should return match values', () => {
    expect(JSONPath(source,'$.store.book.*.price')).toEqual([8.95, 12.99, 8.99, 22.99])
  })
  it('should return match paths', () => {
    expect(JSONPath(source,'$.store.book.*.price',{resultType:'path'})).toEqual([
      ['$', 'store', 'book', 0, 'price'],
      ['$', 'store', 'book', 1, 'price'],
      ['$', 'store', 'book', 2, 'price'],
      ['$', 'store', 'book', 3, 'price']
    ])
  })
})
