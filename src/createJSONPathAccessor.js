import { parseJSONPath } from './parseJSONPath'
import * as _ from './utils'


export function compileJSONPath(expr){
  var normalized = expr.replace(/\{([^\{]*)\}/g, ($0, $1) => 'args' + (/^\[\d+\]/.test($1) ? '' : '[0].') + $1)
  if(/^\?\(.*\)$/.test(normalized)){
    return 'cur = cur[findIndex(cur, function(__i){return ' + normalized.substring(1).replace(/@/g,'__i') + ';})]'
  }else if(/^\(.*\)$/.test(normalized)){
    return 'cur = keys(cur, function(){return ' + normalized.replace(/@/g,'cur') + ';})'
  // }else if(false){
  //
  // }else if('*' === normalized){
  //
  // }else if('..' === normalized){
  //   return ''
  }else{
    return 'cur = cur' + normalized
  }
}
