import {createAction} from '../store'

export default createAction('$.todos[?(@.id === payload.id)]', (payload, todos, res) => {
  res(Object.assign({},todo,{text:payload.text}))
})
