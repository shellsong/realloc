import {createAction} from '../store'

export default createAction('$.todos.*.complete', (allComplete, _, res) => {
  res(!allComplete.every((i) => i))
}, {
  deps:['$.todos.*.complete']
})
