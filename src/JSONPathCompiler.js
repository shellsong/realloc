import { stackProcess } from './utils'

export default class Compiler {
  constructor(expr){
    this._pathArray = parseJSONPath(expr)
    this._normalizedExpression = this._pathArray.join('')
  }
  _getExprGroups(){
    var exprGroups = []
    this._pathArray
      .map((lex) => {
        return lex.replace(/\{([^\{]*)\}/g, ($0, $1) => {
          return 'args' + (/^\[\d+\]/.test($1) ? '' : '[0].') + $1
        })
      })
      .forEach((i) => {
        if(i === '$'|| i === '..'){
          exprGroups.push([])
        }else{
          exprGroups[exprGroups.length - 1].push(i)
        }
      })
    return exprGroups
  }
  toMultiGetter(){

  }
  toGetter(){
    let exprGroups = this._getExprGroups()
    return exprGroups.map((exprGroup) => {
      return exprGroup.map((expr) => {
        if(/^\?\(.*\)$/.test(expr)){
          return 'cur = cur[findIndex(cur, function(__i){return ' + expr.substring(1).replace(/@/g,'__i') + ';})]'
        }else if(/^\(.*\)$/.test(expr)){
          return 'cur = cur[findKey(cur, function(){return ' + expr.replace(/@/g,'cur') + ';})]'
        }else if(/^\d+(,\d+)*$/.test(expr)){
          return 'cur = cur' + '[' + expr.split(',')[0] + ']'
        }else if(/^\d+(:\d+){0,2}$/.test(expr)){
          return 'cur = cur' + '['+expr.split(':')[0]+']'
        }else if('*' === expr){
          return 'cur = values(cur)[0]'
        }else{
          return 'cur = cur' + expr
        }
      }).join(';' + '\nif(!cur){return ;}\n')
    })
  }
  toMultiSetter(){

  }
  toSetter(){

  }
}
export const lexers = [
  [
    (input, ctx) => { // braces
      var paramExprs = ctx.paramExprs = []
      return input.replace(/\{([^\{]*)\}/g, ($0, $1) => '#' + (paramExprs.push($1) - 1))
    },
    (input, ctx) => {
      var {paramExprs} = ctx
      return input.map((p) => p.replace(/^#(\d+)$/,($0, $1) => '["{' + paramExprs[$1] + '}"]')
                              .replace(/#(\d+)/g, ($0, $1) => '{' + paramExprs[$1] + '}'))
    }
  ],
  [
    (input, ctx) => { // predict [(...)],[?(...)]
      var predictExprs = ctx.predictExprs = []
      return input.replace(/[\['](\??\(.*?\))[\]']/g, ($0, $1) => ';##' + (predictExprs.push($1) - 1))
    },
    (input, ctx) => {
      var {predictExprs} = ctx
      return input.map((p) => p.replace(/^##(\d+)$/, ($0, $1) => predictExprs[$1]))
    }
  ],
  [
    (input, ctx) => { // dot identifer
      var identifers = ctx.identifers = []
      return input.replace(/(?:\.)([A-Z_$]+[0-9A-Z_$]*)/ig, ($0, $1) => ';###' + (identifers.push($1) - 1))
    },
    (input, ctx) => {
      var {identifers} = ctx
      return input.map((p) => p.replace(/^###(\d+)$/, ($0, $1) => '["' + identifers[$1] + '"]'))
    }
  ],
  [
    (input, ctx) => {
      return input.replace(/[\.\[]/g, ';')
    }
  ],
  [
    (input, ctx) => {
      return input.replace(/;;;|;;/g, ';..;').replace(/;$|'?\]|'$/g, '')
    }
  ],
  [
    (input, ctx) => {
      return input.split(';')
    },
    (input, ctx) => {
      return input.map((p) => p.replace(/^(\d+)$/, '[$1]'))
    }
  ]
]
export function parseJSONPath(expr){
  return stackProcess(expr, lexers)
}
