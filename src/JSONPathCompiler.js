import { stackProcess, range} from './utils'

export class Compiler {
  constructor(exprs, notNormalized){
    if(notNormalized !== false){
      exprs = parseJSONPath(exprs)
    }
    this.exprArray = exprs.map((lex) => {
      return lex.replace(/\{([^\{]*)\}/g, ($0, $1) => {
        return 'args' + (/^\[\d+\]/.test($1) ? '' : '[0].') + $1 + ''
      })
    })
  }
  _parseExpr(expr, lv, isLast){
    if('..' === expr){
      return [
        (input,ctx) => {
          // TODO recursive
          return input + ''
        }
      ]
    }else if('*' === expr){
      return [
        (input,ctx) => {
          return input +
                '\nfor(var i'+lv+' in $'+(lv - 1)+'){\n'+
                    'if($'+(lv - 1)+'.hasOwnProperty(i'+lv+')){\n'+
                      'var $' + lv + ' = $'+(lv - 1)+'[i'+lv+'];\n' +
                      (isLast?(
                      'matches.push({' +
                        'pwd: ['+range(0, lv).map((i) => 'pwd' + i).join(', ')+'],' +
                        'name: i'+lv+','+
                        'value: $' + lv +
                      '});\n'
                      ):(
                      'var pwd' + lv + ' = i'+lv+';\n'
                      ))
        },
        (input, ctx) => {
          return input +
                  '\n}\n'+
                '\n}\n'
        }
      ]
    }else if(/^\d+(,\d+)*$/.test(expr)){
      return [
        (input,ctx) => {
          return input +
                '\nvar k'+lv+' = ['+expr+'];\n'+
                '\nfor(var i'+lv+' = 0; i'+lv+' < k'+lv+'.length; i'+lv+'++){\n'+
                    'var $' + lv + ' = $'+(lv - 1)+'[k'+lv+'[i'+lv+']];\n' +
                    (isLast?(
                    'matches.push({' +
                      'pwd: ['+range(0, lv).map((i) => 'pwd' + i).join(', ')+'],' +
                      'name: k'+lv+'[i'+lv+'],'+
                      'value: $' + lv +
                    '});\n'
                    ):(
                    'var pwd' + lv + ' = k'+lv+'[i'+lv+'];\n'
                    ))
        },
        (input, ctx) => {
          return input +
                '\n}\n'
        }
      ]
    }else if(/^\d+(:\d+){0,2}$/.test(expr)){
      return [
        (input,ctx) => {
          var indexes = range.apply(null, expr.split(':').map((i) => parseInt(i)))
          return input +
                '\nvar k'+lv+' = ['+indexes.join(', ')+'];\n'+
                '\nfor(var i'+lv+' = 0; i'+lv+' < k'+lv+'.length; i'+lv+'++){\n'+
                    'var $' + lv + ' = $'+(lv - 1)+'[k'+lv+'[i'+lv+']];\n' +
                    (isLast?(
                    'matches.push({' +
                      'pwd: ['+range(0, lv).map((i) => 'pwd' + i).join(', ')+'],' +
                      'name: k'+lv+'[i'+lv+'],'+
                      'value: $' + lv +
                    '});\n'
                    ):(
                    'var pwd' + lv + ' = k'+lv+'[i'+lv+'];\n'
                    ))
        },
        (input, ctx) => {
          return input +
                '\n}\n'
        }
      ]
    }else if(/^\?\(.*\)$/.test(expr)){
      return [
        (input, ctx) => {
          return input +
                '\nfor(var i'+lv+' = 0; i' + lv + ' < $' + (lv - 1) + '.length; i'+lv+'++){\n' +
                    'if(' +
                      expr.substring(1).replace(/@/g,'$'+(lv - 1)+'[i'+lv+']') +
                    '){\n'+
                      'var $' + lv + ' = $'+(lv - 1)+'[i'+lv+'];\n' +
                      (isLast?(
                      'matches.push({' +
                        'pwd: ['+range(0, lv).map((i) => 'pwd' + i).join(', ')+'],' +
                        'name: i'+lv+','+
                        'value: $' + lv +
                      '});\n'
                      ):(
                      'var pwd' + lv + ' = i' + lv +';\n'
                      ))
        },
        (input, ctx) => {
          return input +
                  '\n}\n'+
                '\n}\n'
        }
      ]
    }else if(/^\(.*\)$/.test(expr)){
      return [
        (input, ctx) => {
          return input +
                'var k'+lv+ ' = ' + expr.replace(/@/g,'$' + (lv - 1)) + ';\n' +
                'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '];\n' +
                (isLast?(
                'matches.push({' +
                  'pwd: ['+range(0, lv).map((i) => 'pwd' + i).join(', ')+'],' +
                  'name: k'+lv+',' +
                  'value: $' + lv +
                '});\n'
                ):(
                'var pwd' + lv + ' = k' + lv +';\n'
                ))
        }
      ]
    }else if(/^\[.*\]$/.test(expr)){
      return [
        (input, ctx) => {
          var key = expr.substring(1, expr.length - 1)
          return input +
                'var k'+lv+' = ' + key + ';\n' +
                'var $' + lv + ' = $' + (lv - 1) + expr +';\n' +
                (isLast?(
                'matches.push({' +
                  'pwd: ['+range(0, lv).map((i) => 'pwd' + i).join(', ')+'], ' +
                  'name: k'+lv+', ' +
                  'value: $' + lv +
                '});\n'
                ):(
                'var pwd' + lv + ' = k' + lv +';\n'
                ))
        }
      ]
    }else{
      throw new Error('unexpected expression: '+expr+'')
    }
  }
  createMatcher(){
    let lastIndex = this.exprArray.length - 1
    let processors = this.exprArray.map((expr, i) => {
      if(i === 0){
        return [
          (input, ctx) => {
            return input +
                  'var matches = [], $0 = $, pwd0 = "$";\n'
          },
          (input, ctx) => {
            return input +
                  '\nreturn matches;'
          }
        ]
      }else{
        return this._parseExpr(expr, i, i === lastIndex)
      }
    })
    // console.log(stackProcess("", processors))
    return new Function('$', 'args', stackProcess("", processors))
  }
}
export const lexers = [
  [
    (input, ctx) => { // braces
      var paramExprs = ctx.paramExprs = []
      return input.replace(/\{([^\{]*)\}/g, ($0, $1) => '#{' + (paramExprs.push($1) - 1) +'}')
    },
    (input, ctx) => {
      var {paramExprs} = ctx
      return input.map((p) => p.replace(/^#\{(\d+)\}$/,($0, $1) => '[{' + paramExprs[$1] + '}]')
                              //FIXME .replace(/(?=\w+)#\{(\d+)\}(?=\w+)/g,($0, $1) => '"+{' + paramExprs[$1] + '}+"')
                              .replace(/#\{(\d+)\}/g, ($0, $1) => '{' + paramExprs[$1] + '}'))
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
