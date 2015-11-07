import Compiler, { parseJSONPath } from './JSONPathCompiler'
import { createGetter, createSetter, evalJSONPath } from './createJSONPathAccessor'

export default function actionCreatorFactory(stateParent, broadcastMap, collect){
  return (keyPath, fn, opts) => {
    const options = Object.assign({deps:[]}, opts)
    const parsedKeyPath = parseJSONPath(keyPath).join('')
    const get = createGetter(keyPath)
    const set = createSetter(keyPath)
    const depsGetters = options.deps.map(evalJSONPath)
    const castFns = Object.keys(broadcastMap)
                           .filter((v) => parsedKeyPath.indexOf(v) > -1)
                           .map((k) => broadcastMap[k])
                           .reduce((acc,i) => acc.concat(i), [])
    return (...payloads) => {
      return fn.apply(
        null,
        payloads.concat(
          depsGetters.map((get) => rs(stateParent.$, payloads))
        ).concat(
          [
            getter(stateParent.$, payloads),
            (newValue) => {
              collect(set(stateParent, newValue, payloads))
              castFns.forEach((fn) => fn.apply(null, payloads))
            }
          ]
        )
      )
    }
  }

}
