import actionCreatorFactory from './actionCreatorFactory'
import { createJSONPathMatcher } from './JSONPathCompiler'
export default function createObservableState(initialState = {}, options = {}){
  const currentState = {
    $:initialState
  }
  var subscribers = []
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
    const matcher = createJSONPathMatcher(path)
    return (...args) => {
      return matcher(currentState.$, args).map((v) => v.value)
    }
  }
  const {createAction, createActions} = actionCreatorFactory(
    () => currentState.$,
    (nextState, results) => {
      const prevState = currentState.$
      currentState.$ = nextState
      subscribers.forEach((cb) => cb(currentState.$, prevState, results))
    }
  )
  return {
    getState,
    createGetter,
    subscribe,
    createAction,
    createActions
  }
}
