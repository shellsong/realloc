import { stackProcess, range} from './utils'
import lexers from './lexers'
function JSONPath(source, expr,options = {}){
  let resultType = (options.resultType||'value').toUpperCase()
  let getResult = (v) => v;
  if(resultType === 'VALUE'){
    getResult = (v) => v.value
  }else if(resultType === 'PATH'){
    getResult = (v) => v.pwd.concat([v.name]).filter((v) => !!v)
  }
  return ((new Compiler(expr)).createMatcher())(source).map(getResult)
}
function parseJSONPath(expr){
  return stackProcess(expr, lexers)
}
export default class Compiler {
  static JSONPath = JSONPath
  static parseJSONPath = parseJSONPath
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
  createMatcher(){
    let lastIndex = this.exprArray.length - 1
    let processors = stackProcess("", this.exprArray.map((expr, i) => {
      if(i === 0){
        return [
          (input, ctx) => {
            return input +
                  'var matches = [], $0 = $, pwd0 = "$";\n' +
                  (i === lastIndex?(
                  'matches.push({' +
                    'pwd: [pwd0], ' +
                    'name: null, ' +
                    'value: $0' +
                  '});\n'
                  ):'')
          },
          (input, ctx) => {
            return input +
                  '\nreturn matches;'
          }
        ]
      }else{
        return this._parseExpr(expr, i, i === lastIndex)
      }
    }))
    try{
      return new Function('$', 'args', processors)
    }catch(e){
      throw new Error(e + '\nfunction matcher($, args){\n' + processors + '\n}')
    }
  }
  _parseExpr(expr, lv, isLast){
    if('..' === expr){
      return [
        (input,ctx) => {
          return input +
          '\n((function(){\n' +
              'var stop = false;var breakFn = function(){stop = true};\n' +
            '\nreturn function recurfn'+lv+'(visit, rootCur, pwd, key){\n' +
                'pwd = pwd || [];\n' +
                'key = key || null;\n' +
                'visit(rootCur, key, pwd, breakFn);\n' +
                'newPwd = key !== null ? pwd.concat(key) : pwd' +
              '\nif(stop === false && typeof rootCur === "object"){\n' +
                '\nfor(var i in rootCur){\n' +
                  '\nif(rootCur.hasOwnProperty(i) && typeof rootCur[i] === "object" && stop === false){\n' +
                    'recurfn'+lv+'(visit, rootCur[i], newPwd, i);\n' +
                  '}\n' +
                '}\n' +
              '}\n' +
            '}\n' +
          '}())(function(recur, key, pwd, breakFn){\n' +
            'var $'+lv+' = recur;\n' +
            (isLast?(
            'matches.push({' +
              'pwd: ['+range(0, lv - 1).map((i) => 'pwd' + i).join(', ')+'].concat(pwd),' +
              'name: key,'+
              'value: $' + lv +
            '});\n'
            ):(
            '\nif($'+lv+' !== (void 0)){'+
            'var pwd' + lv + ' = key;\n'
            ))
        },
        (input, ctx) => {
          return input +
                    (isLast?'':'\n}\n')+
                  '\n},$'+(lv - 1)+'))\n'
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
                      '\nif($'+lv+' !== (void 0)){'+
                      'var pwd' + lv + ' = i'+lv+';\n'
                      ))
        },
        (input, ctx) => {
          return input +
                  (isLast?'':'\n}\n')+
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
                    '\nif($'+lv+' !== (void 0)){'+
                    'var pwd' + lv + ' = k'+lv+'[i'+lv+'];\n'
                    ))
        },
        (input, ctx) => {
          return input +
                (isLast?'':'\n}\n')+
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
                    '\nif($'+lv+' !== (void 0)){'+
                    'var pwd' + lv + ' = k'+lv+'[i'+lv+'];\n'
                    ))
        },
        (input, ctx) => {
          return input +
                (isLast?'':'\n}\n')+
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
                      '\nif($'+lv+' !== (void 0)){'+
                      'var pwd' + lv + ' = i' + lv +';\n'
                      ))
        },
        (input, ctx) => {
          return input +
                  (isLast?'':'\n}\n')+
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
                '\nif($'+lv+' !== (void 0)){'+
                'var pwd' + lv + ' = k' + lv +';\n'
                ))
        },
        (input, ctx) => {
          return input +
                (isLast?'':'\n}\n')+
                ''
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
                  '\nif($'+lv+' !== (void 0)){'+
                'var pwd' + lv + ' = k' + lv +';\n'
                ))
        },
        (input, ctx) => {
          return input +
                (isLast?'':'\n}\n')+
                ''
        }
      ]
    }else{
      throw new Error('unexpected expression: '+expr+'')
    }
  }
}
