import {createAction} from '../store'

export default createAction('$.todos[?(@.id === {id})].text', (payload, oldText, res) => {
  res(payload.text)
})
