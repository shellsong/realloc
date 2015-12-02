import { createAction, createGetter } from './store'

export const createTodo = createAction(
  '$.todos[(@.length)]',
  (text = '' , _, res) => {
    let value = text.trim()
    if(value){
      res({
        id:getNewId(),
        text:value,
        completed:false
      })
    }
  }
)
export const toggleTodo = createAction(
  '$.todos[?(@ === {[0]})].completed',
  (todo, currentComplete, res) => res(!currentComplete)
)
export const updateTodo = createAction(
  '$.todos[?(@ === {[0]})].text',
  (todo, text, currentText, res) => res(text)
)
export const destroyTodo = createAction(
  '$.todos',
  (todo, todos, res) => res(todos.filter((t) => todo !== t))
)
export const destroyCompleted = createAction(
  '$.todos',
  (todos, res) => res(todos.filter((todo) => !todo.completed))
)
const activeTodos = createGetter('$.todos[?(!@.completed)]')
const toggleAllCompletedAction = createAction(
  '$.todos.*.completed',
  (completed, _, res) => {
    res(completed)
  }
)
export const toggleAllCompleted = () => {
  toggleAllCompletedAction(activeTodos().length > 0)
}
export const switchFilter = createAction(
  '$.visibility',
  (newKey, oldKey, res) => res(newKey)
)

function getNewId(){
  return (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
}
