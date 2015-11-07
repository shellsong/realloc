
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

export const pairs = function (obj){
  var arr = []
  for(var k in obj){
    if(has(obj, k)){
      arr.push([k, obj[k]])
    }
  }
  return arr
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

export const shallowClone = function (obj){
  if(!obj) return obj
  if(isArray(obj)){
    return obj.slice()
  }else{
    return assign({}, obj)
  }
}

export const findIndex = function (arr, predicate, context = null){
  var index
  for(index = 0;index < arr.length;index++){
    if(predicate.call(context, arr[index], index)) return index
  }
  return -1
}

export const compose = function compose(...fns){
  //TODO
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
