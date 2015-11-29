
/**
 *
 *
 *
 */

var ArrayProto = Array.prototype
  , ObjProto = Object.prototype
  , FuncProto = Function.prototype

var nativeIsArray      = Array.isArray
  , nativeKeys         = Object.keys
  , nativeBind         = FuncProto.bind
  , nativeCreate       = Object.create
  , hasOwnProperty     = ObjProto.hasOwnProperty
  , toString           = ObjProto.toString
  , push               = ArrayProto.push
  , slice              = ArrayProto.slice
  , nativeAssign       = Object.assign


export const isUndefined = function (obj){
  return obj === void 0
}

export const isObject = function (obj){
  var type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

export const isArray = nativeIsArray || function (obj){
  return toString.call(obj) === '[object Array]'
}

export const isFunction = function (obj){
  return typeof obj == 'function' || false
}

export const has = function (obj, key){
  return obj != null && hasOwnProperty.call(obj, key)
}

export const keys = nativeKeys || function (obj){
  var keys = []
  for (var key in obj) if (has(obj, key)) keys.push(key)
  return keys
}

export const assign = nativeAssign || function(target, ...sources){
  sources.forEach((source) => {
    keys(source).forEach((key) => {
      target[key] = source[key]
    })
  })
  return target
}

export const clone = function (obj){
  if(!obj) return obj
  if(isArray(obj)){
    return obj.slice()
  }else{
    return assign({}, obj)
  }
}

export const range = function range(start, stop, step){
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  step = step || 1;

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }
  return range;
}

export function stackProcess(expr, fns, context = {}){
  var head = fns[0]
    , tails = fns.slice(1)
    , preProcessor = head[0]
    , postProcessor = head[1] || ((a) => a)

  var preResult = preProcessor(expr, context)
  if(!tails.length){
    return postProcessor(preResult, context)
  }else{
    return postProcessor(stackProcess(preResult, tails, context), context)
  }
}
