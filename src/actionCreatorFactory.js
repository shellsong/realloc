import { clone } from './utils'
import Compiler from './JSONPathCompiler'

export default function actionCreatorFactory(stateGetter, collect){
  // const createActions = (...actions) => {
  //   actions.map((action) => {
  //     const options = Object.assign({deps:[]}, action.options)
  //     const compiler = new Compiler(action.keyPath)
  //     const matcher = compiler.createMatcher()
  //     return (...payloads) => {
  //
  //     }
  //   })
  //   return (...payloads) => {
  //
  //   }
  // }
  // const createAction = (keyPath, callback, options) => createActions({
  //   keyPath,
  //   callback,
  //   options
  // })
  // return {
  //   createAction,
  //   createActions
  // }
  return (keyPath, fn, opts) => {
    const options = Object.assign({deps:[]}, opts)
    const compiler = new Compiler(keyPath)
    const matcher = compiler.createMatcher()
    return (...payloads) => {
      let $ = stateGetter()
      let value = matcher($, payloads).reduce((accValue, result) => {
        let pwd = result.pwd.slice(1)
        const set = (newValue) => {
          const $old = accValue.$
          let oldCur = $old
          let $new = clone(accValue.$)
          let newCur = $new
          pwd.forEach((key) => {
            if(key !== null){
              newCur[key] = clone(oldCur[key])
              newCur = newCur[key]
              oldCur = oldCur[key]
            }
          })
          if(result.name !== null){
            newCur[result.name] = newValue
          }else{
            $new = newValue
          }
          return $new
        }
        const done = (newValue) => {
          //TODO async set : check value, do collect
        }
        const args = payloads.concat([result.value, done])
        const newValue = fn.apply(result, args)
        if(newValue !== (void 0)){
          return {
            $:set(newValue),
            results:accValue.results.concat(result)
          }
        }else{
          return accValue
        }
      }, {
        $:$,
        results:[]
      })
      if(value.$ !== $){
        collect(value.$, value.results)
      }
      return value
    }
  }
}
