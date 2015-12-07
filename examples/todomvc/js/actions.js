import { createAction, createGetter } from './store'

export const createTodo = createAction(
  '$.todos[(@.length)]',
  (text = '' , _) => {
    let value = text.trim()
    if(value){
      return {
        id:getNewId(),
        text:value,
        completed:false
      }
    }
  }
)
export const toggleTodo = createAction(
  '$.todos[?(@ === {0})].completed',
  (todo, currentComplete) => !currentComplete
)
export const updateTodo = createAction(
  '$.todos[?(@ === {0})].text',
  (todo, text, currentText) => text
)
export const destroyTodo = createAction(
  '$.todos',
  (todo, todos) => todos.filter((t) => todo !== t)
)
export const destroyCompleted = createAction(
  '$.todos',
  (todos) => todos.filter((todo) => !todo.completed)
)
const activeTodos = createGetter('$.todos[?(!@.completed)]')
const toggleAllCompletedAction = createAction(
  '$.todos.*.completed',
  (completed, _) => completed
)
export const toggleAllCompleted = () => {
  toggleAllCompletedAction(activeTodos().length > 0)
}
export const switchFilter = createAction(
  '$.visibility',
  (newKey, oldKey) => newKey
)

function getNewId(){
  return (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
}
