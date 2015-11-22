import { clone } from './utils'
import { Compiler, parseJSONPath } from './JSONPathCompiler'

export default function actionCreatorFactory(stateParent, broadcastMap, collect){
  return (keyPath, fn, opts) => {
    const options = Object.assign({deps:[]}, opts)
    const parsedKeyPath = parseJSONPath(keyPath)
    const parsedKeyPathStr = parsedKeyPath.join('')
    const compiler = new Compiler(parsedKeyPath, false)
    const matcher = compiler.createMatcher()
    const depsGetters = options.deps.map((kp) => (new Compiler(kp)).createMatcher())
    const castFns = Object.keys(broadcastMap)
                           .filter((v) => parsedKeyPathStr.indexOf(v) === 0)
                           .map((k) => broadcastMap[k])
                           .reduce((acc,i) => acc.concat(i), [])
    return (...payloads) => {
      var matchDeps = depsGetters.map((get) => get(stateParent.$, payloads).map((r) => r.value))
      var execResults = matcher(stateParent.$, payloads).map((result) => {
        return fn.apply(
          null,
          payloads.concat(
            matchDeps
          ).concat(
            [
              result.value,
              (newValue) => {
                var newCur = stateParent.$
                  , oldCur = stateParent.$
                result.pwd.slice(1).forEach((key) => {
                  if(key !== null){
                    newCur[key] = clone(oldCur[key])
                    newCur = newCur[key]
                    oldCur = oldCur[key]
                  }
                })
                if(result.name !== null){
                  newCur[result.name] = newValue
                  collect(stateParent.$)
                }else{
                  collect(newValue)
                }

              },
              result
            ]
          )
        )
      })
      castFns.forEach((fn) => fn.apply(null, []))
      return execResults
    }
  }
}
