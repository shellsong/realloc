import { clone, assign } from './utils'
import Compiler from './JSONPathCompiler'

function syncUpdate(pwd, name, $old, newValue){
  const $new = clone($old)
  const cur = pwd.reduce((pair, key) => {
    pair[0][key] = clone(pair[1][key])
    return [
      pair[0][key],
      pair[1][key]
    ]
  }, [$new, $old])
  cur[0][name] = newValue
  return $new
}

function makeCallers(actionObj){
  const {
    expr,
    callback,
    options
  } = actionObj
  const opts = assign({}, options)
  const compiler = new Compiler(expr)
  const matcher = compiler.createMatcher()
  return (current, payloads) => {
    return matcher(current.state, payloads).reduce((cur, result) => {
      const pwd = result.pwd.slice(1)
      const name = result.name
      const value = callback.apply(result, payloads.concat(
        [result.value]
      ))
      if(value !== (void 0)){
        return {
          state:name !== null ? syncUpdate(pwd, name, cur.state, value) : value,
          results:current.results.concat(result)
        }
      }else{
        return cur
      }
    }, current)
  }
}
export default function actionCreatorFactory(select, collect){
  const createActions = (...actions) => {
    const callers = actions.map(makeCallers)
    return (...payloads) => {
      const current = {
        state:select(),
        results:[]
      }
      const next = callers.reduce((car, caller) => {
        return caller(car, payloads, select, collect)
      }, current)
      if(current.state !== next.state){
        collect(next.state, next.results)
      }
      return next
    }
  }
  const createAction = (expr, callback, options = {}) => createActions({
    expr,
    callback,
    options
  })
  return {
    createAction,
    createActions
  }
}
