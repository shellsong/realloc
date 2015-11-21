import {createAction} from '../store'

export default createAction('$.todos', (todos, res) => {
  res(todos.filter((todo) => !todo.complete))
})
