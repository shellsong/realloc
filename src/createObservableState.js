import { parseJSONPath } from './parseJSONPath'
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
    currentState.$ = nextState
    if(triggerFlag === false){
      triggerFlag = true
      setTimeout(() => {
        subscribers.forEach((cb) => cb(currentState.$))
        triggerFlag = false
      }, 1)
    }
  })
  function watch(listenPath, keyPath, fn, opts){
    const parsedListenPath = parseJSONPath(listenPath).join('')
    const action = createAction(keyPath, fn, opts)
    if(!broadcastMap[parsedListenPath]){
      broadcastMap[parsedListenPath] = [action]
    }else{
      broadcastMap[parsedListenPath] = broadcastMap[parsedListenPath].concat([action])
    }
    return () => {
      broadcastMap[parsedListenPath] = broadcastMap[parsedListenPath].filter((a) => {
        return a !== action
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
