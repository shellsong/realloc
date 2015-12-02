import actionCreatorFactory from './actionCreatorFactory'
import Compiler from './JSONPathCompiler'
export default function createObservableState(initialState = {}, options = {}){
  let currentState = {
    $:initialState
  }
  let subscribers = []
  function subscribe(callback){
    subscribers = subscribers.concat(callback)
    return () => {
      subscribers = subscribers.filter((cb) => cb !== callback)
    }
  }
  function getState(){
    return currentState.$
  }
  function createGetter(path){
    const compiler = new Compiler(path)
    const matcher = compiler.createMatcher()
    return (...args) => {
      return matcher(currentState.$, args).map((v) => v.value)
    };
  }
  let triggerFlag = false
  const createAction = actionCreatorFactory(() => currentState.$, (nextState, keyPath) => {
    let prevState = currentState.$
    currentState.$ = nextState
    if(triggerFlag === false){
      triggerFlag = true
      setTimeout(() => {
        subscribers.forEach((cb) => cb(currentState.$, prevState))
        triggerFlag = false
      }, 0)
    }
  })
  return {
    getState,
    createGetter,
    subscribe,
    createAction
  }
}
