import { createAction, createGetter } from './store'

export const createTodo = createAction(
  '$.todos[(@.length)]',
  (text = '' , _, done) => {
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
  (todo, currentComplete, done) => !currentComplete
)
export const updateTodo = createAction(
  '$.todos[?(@ === {0})].text',
  (todo, text, currentText, done) => text
)
export const destroyTodo = createAction(
  '$.todos',
  (todo, todos, done) => todos.filter((t) => todo !== t)
)
export const destroyCompleted = createAction(
  '$.todos',
  (todos, done) => todos.filter((todo) => !todo.completed)
)
const activeTodos = createGetter('$.todos[?(!@.completed)]')
const toggleAllCompletedAction = createAction(
  '$.todos.*.completed',
  (completed, _, done) => completed
)
export const toggleAllCompleted = () => {
  toggleAllCompletedAction(activeTodos().length > 0)
}
export const switchFilter = createAction(
  '$.visibility',
  (newKey, oldKey, done) => newKey
)

function getNewId(){
  return (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
}
