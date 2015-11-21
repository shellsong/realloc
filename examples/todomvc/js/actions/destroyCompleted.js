import {createAction} from '../store'

export default createAction('$.todos', (payload, todos, res) => {
  res(todos.filter((todo) => !todo.complete))
})
