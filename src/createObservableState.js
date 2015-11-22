import { parseJSONPath } from './JSONPathCompiler'
import actionCreatorFactory from './actionCreatorFactory'
export default function createObservableState(initialState = {}, options = {}){
  let currentState = {
    $:initialState
  }
  let subscribers = []
  let broadcastMap = {}
  function subscribe(callback){
    subscribers = subscribers.concat(callback)
    return () => {
      subscribers = subscribers.filter((cb) => cb !== callback)
    }
  }
  function getState(path){
    if(!path){
      return currentState.$
    }else{
      return ;
    }
  }
  let triggerFlag = false
  const createAction = actionCreatorFactory(currentState, broadcastMap, (nextState) => {
    var prevState = currentState.$
    currentState.$ = nextState
    if(triggerFlag === false){
      triggerFlag = true
      setTimeout(() => {
        subscribers.forEach((cb) => cb(nextState, prevState))
        triggerFlag = false
      }, 1)
    }
  })
  function watch(listenPaths, keyPath, fn, opts){
    const parsedListenPaths = listenPaths.map((listenPath) => {
      return parseJSONPath(listenPath).join('')
    })
    const action = createAction(keyPath, fn, opts)
    parsedListenPaths.forEach((parsedListenPath) => {
      if(!broadcastMap[parsedListenPath]){
        broadcastMap[parsedListenPath] = [action]
      }else{
        broadcastMap[parsedListenPath] = broadcastMap[parsedListenPath].concat([action])
      }
    })
    return () => {
      parsedListenPaths.forEach((parsedListenPath) => {
        broadcastMap[parsedListenPath] = broadcastMap[parsedListenPath].filter((a) => {
          return a !== action
        })
      })
    }
  }
  return {
    getState,
    subscribe,
    createAction,
    watch
  }
}
