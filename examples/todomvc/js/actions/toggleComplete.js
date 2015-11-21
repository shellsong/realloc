import {createAction} from '../store'

export default createAction('$.todos[?(@.id === {id})].complete', (payload, complete, res) => {
  res(!complete)
})
