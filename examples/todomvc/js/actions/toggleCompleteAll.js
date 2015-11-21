import {createAction} from '../store'

export default createAction('$.todos.*.complete', (areAllComplete, _, res) => {
  res(areAllComplete[0])
}, {
  deps:['$.areAllComplete']
})
