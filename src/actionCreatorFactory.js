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
      return matcher(stateParent.$, payloads).map((result) => {
        return fn.apply(
          null,
          payloads.concat(
            depsGetters.map((get) => get(stateParent.$, payloads).map((r) => r.value))
          ).concat(
            [
              result.value,
              (newValue) => {
                var $ = clone(stateParent.$)
                  , newCur = $
                  , oldCur = stateParent.$
                  , pwd
                if(result.pwd[0] === '$'){
                  pwd = result.pwd.slice(1)
                }else{
                  pwd = result.pwd
                }
                pwd.forEach((key) => {
                  newCur[key] = clone(oldCur[key])
                  newCur = newCur[key]
                  oldCur = oldCur[key]
                })
                newCur[result.name] = newValue
                collect($)
                castFns.forEach((fn) => fn.apply(null, []))
              },
              result
            ]
          )
        )
      })
    }
  }
}
