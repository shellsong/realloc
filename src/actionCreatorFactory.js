import { clone } from './utils'
import Compiler from './JSONPathCompiler'

export default function actionCreatorFactory(stateGetter, collect){
  return (keyPath, fn, opts) => {
    const options = Object.assign({deps:[]}, opts)
    const compiler = new Compiler(keyPath)
    const matcher = compiler.createMatcher()
    return (...payloads) => {
      let $ = stateGetter()
      return matcher($, payloads).map((result) => {
        //TODO collect之后应该clone新的state，循环使用，减少collect
        let $ = stateGetter()
        let pwd = result.pwd.slice(1)
        const setter = (newValue) => {
          let oldCur = $
          let newCur = clone($)
          let cur = newCur
          pwd.forEach((key) => {
            if(key !== null){
              cur[key] = clone(oldCur[key])
              cur = cur[key]
              oldCur = oldCur[key]
            }
          })
          if(result.name !== null){
            cur[result.name] = newValue
            collect(newCur, result.pwd, result.name)
          }else{
            collect(newValue, result.pwd)
          }
        }
        const args = payloads.concat([result.value, setter])
        return fn.apply(result, args)
      })
    }
  }
}
