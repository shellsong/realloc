import {
  stackProcess,
  range,
  isPlainObject,
  isArray,
  hasOwnProperty
} from './utils'
import lexers from './lexers'
function JSONPath(source, expr,options = {}){
  let resultType = (options.resultType||'value').toUpperCase()
  let getResult
  if(resultType === 'VALUE'){
    getResult = (v) => v.value
  }else if(resultType === 'PATH'){
    getResult = (v) => v.pwd.concat([v.name])
  }
  return ((new Compiler(expr)).createMatcher())(source).map(getResult)
}
function parseJSONPath(expr){
  return stackProcess(expr, lexers)
}
export default class Compiler {
  static JSONPath = JSONPath
  static parseJSONPath = parseJSONPath
  constructor(exprStr){
    this.exprArray = parseJSONPath(exprStr).map((lex) => {
      return lex.replace(/\{([^\{]*)\}/g, ($0, $1) => {
        return 'args' + (/^\[\d+\]/.test($1) ? '' : '[0]') + $1 + ''
      })
    })
  }
  createMatcher(){
    let lastIndex = this.exprArray.length - 1
    let body = stackProcess('', this.exprArray.map((expr, i) => {
      if(i === 0){
        return [
          (input, ctx) => {
            return input +
                  'var matches = [], $0 = $, pwd0 = ["$"];\n' +
                  (i === lastIndex?(
                  'matches.push({' +
                    'pwd: pwd0, ' +
                    'name: null, ' +
                    'value: $0' +
                  '});\n'
                  ):'')
          },
          (input, ctx) => {
            return input +
                  'return matches;'
          }
        ]
      }else{
        return this._parseExpr(expr, i, i === lastIndex)
      }
    }))
    try{
      var fn = new Function('isPlainObject', 'isArray', 'hasOwnProperty', 'range', '$', 'args', body)
      return function matcher($, args){
        return fn(isPlainObject, isArray, hasOwnProperty, range, $, args)
      }
    }catch(e){
      // istanbul ignore next
      throw new Error(e + '\nfunction matcher($, args){\n' + body + '\n}')
    }
  }
  _parseExpr(expr, lv, isLast){
    if('..' === expr){
      return [
        (input,ctx) => {
          return input +
          '\n((function(){\n' +
              'var stop = false;var breakFn = function(){stop = true};\n' +
            '\nreturn function recurfn'+lv+'(visit, parentCur, pwd, key){\n' +
                'visit(parentCur, key, pwd, breakFn);\n' +
              '\nif(stop === false && (isPlainObject(parentCur)||isArray(parentCur))){\n' +
                '\nvar newPwd = key === null ? pwd : pwd.concat([key]);\n' +
                '\nvar parentCurKeys;\n'+
                '\nif(isArray(parentCur)){\n'+
                  'parentCurKeys = range(parentCur.length);'+
                '\n}else{\n'+
                  'parentCurKeys = [];'+
                  '\nfor(var k in parentCur){\n'+
                    '\nif(hasOwnProperty.call(parentCur,k)){\n'+
                      'parentCurKeys.push(k);\n'+
                    '\n}\n'+
                  '\n}\n'+
                '\n}\n'+
                '\nfor(var i = 0; i < parentCurKeys.length; i++){\n' +
                  '\nif(stop === false ){\n' +
                    'recurfn'+lv+'(visit, parentCur[parentCurKeys[i]], newPwd, parentCurKeys[i]);' +
                  '\n}\n' +
                '}\n' +
              '}\n' +
            '}\n' +
          '}())(function(recur, key, pwd, breakFn){\n' +
            'var $'+lv+' = recur;\n' +
            '\nif(isPlainObject($'+lv+')){\n'+
            (isLast?(
            'matches.push({' +
              'pwd: key === null && $' + lv + ' !== $0 ? pwd.slice(0, pwd.length - 1) : pwd,' +
              'name: key === null && $' + lv + ' !== $0 ? pwd[pwd.length - 1] : key,'+
              'value: $' + lv +
            '});\n'
            ):(
            'var pwd' + lv + ' = key === null ? pwd : pwd.concat([key]);\n'
            ))
        },
        (input, ctx) => {
          return input +
              ('\n}\n')+
            '\n},$'+(lv - 1)+', pwd'+(lv - 1)+', null))\n'
        }
      ]
    }else if('*' === expr){
      return [
        (input,ctx) => {
          return input +
                '\nvar $$'+(lv - 1)+';\n'+
                '\nif(isArray($'+(lv - 1)+')){\n'+
                  '$$'+(lv - 1)+' = range($'+(lv - 1)+'.length);'+
                '\n}else{\n'+
                  '$$'+(lv - 1)+' = [];'+
                  '\nfor(var k'+lv+' in $'+(lv - 1)+'){\n'+
                    '\nif(hasOwnProperty.call($'+(lv - 1)+',k'+lv+')){\n'+
                      '$$'+(lv - 1)+'.push(k'+lv+');\n'+
                    '\n}\n'+
                  '\n}\n'+
                '\n}\n'+
                '\nfor(var i'+lv+' = 0;i'+lv+' < $$'+(lv-1)+'.length;i'+lv+'++){\n'+
                    'var $' + lv + ' = $'+(lv - 1)+'[$$'+(lv-1)+'[i'+lv+']];\n' +
                    (isLast?(
                    'matches.push({' +
                      'pwd: pwd' + (lv - 1) + ',' +
                      'name: $$'+(lv - 1)+'[i'+lv+'],'+
                      'value: $' + lv +
                    '});\n'
                    ):(
                    '\nif(isPlainObject($'+lv+')||isArray($'+lv+')){\n'+
                    'var pwd' + lv + ' = pwd'+(lv - 1)+'.concat([$$'+(lv - 1)+'[i'+lv+']]);\n'
                    ))
        },
        (input, ctx) => {
          return input +
                  (isLast?'':'\n}\n')+
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
                      'pwd: pwd' + (lv - 1) + ',' +
                      'name: k'+lv+'[i'+lv+'],'+
                      'value: $' + lv +
                    '});\n'
                    ):(
                    '\nif(isPlainObject($'+lv+')||isArray($'+lv+')){\n'+
                    'var pwd' + lv + ' = pwd'+(lv - 1)+'.concat([k' + lv +'[i'+lv+']]);\n'
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
                      'pwd: pwd' + (lv - 1) + ',' +
                      'name: k'+lv+'[i'+lv+'],'+
                      'value: $' + lv +
                    '});\n'
                    ):(
                    '\nif(isPlainObject($'+lv+')||isArray($'+lv+')){\n'+
                    'var pwd' + lv + ' = pwd'+(lv - 1)+'.concat([k' + lv +'[i'+lv+']]);\n'
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
                      expr.substring(1).replace(/@/g, '$'+(lv - 1)+'[i'+lv+']') +
                    '){\n'+
                      'var $' + lv + ' = $'+(lv - 1)+'[i'+lv+'];\n' +
                      (isLast?(
                      'matches.push({' +
                        'pwd: pwd' + (lv - 1) + ',' +
                        'name: i'+lv+','+
                        'value: $' + lv +
                      '});\n'
                      ):(
                      '\nif(isPlainObject($'+lv+')||isArray($'+lv+')){\n'+
                      'var pwd' + lv + ' = pwd'+(lv - 1)+'.concat([i' + lv +']);\n'
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
                'var k'+lv+ ' = ' + expr.replace(/@/g, '$' + (lv - 1)) + ';\n' +
                'var $' + lv + ' = $' + (lv - 1) + '[k' + lv + '];\n' +
                (isLast?(
                'matches.push({' +
                  'pwd: pwd' + (lv - 1) + ',' +
                  'name: k'+lv+',' +
                  'value: $' + lv +
                '});\n'
                ):(
                '\nif(isPlainObject($'+lv+')||isArray($'+lv+')){\n'+
                'var pwd' + lv + ' = pwd'+(lv - 1)+'.concat([k' + lv +']);;\n'
                ))
        },
        (input, ctx) => {
          return input +
                (isLast?'':'\n}\n')+
                ''
        }
      ]
    }else if(/^\[.+\]$/.test(expr)){
      return [
        (input, ctx) => {
          var key = expr.substring(1, expr.length - 1)
          return input +
                'var k'+lv+' = ' + key + ';\n' +
                'var $' + lv + ' = $' + (lv - 1) + expr +';\n' +
                (isLast?(
                'matches.push({' +
                  'pwd: pwd' + (lv - 1) + ', ' +
                  'name: k'+lv+', ' +
                  'value: $' + lv +
                '});\n'
                ):(
                '\nif(isPlainObject($'+lv+')||isArray($'+lv+')){\n'+
                'var pwd' + lv + ' = pwd'+(lv - 1)+'.concat([k' + lv +']);\n'
                ))
        },
        (input, ctx) => {
          return input +
                (isLast?'':'\n}\n')+
                ''
        }
      ]
    }else{
      // istanbul ignore next
      throw new Error('unexpected expression: '+expr+'')
    }
  }
}
