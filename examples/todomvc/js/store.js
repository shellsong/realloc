import { createObservableState } from 'realloc'
const store = createObservableState({
  todos:[],
  areAllComplete:true
})
store.watch([
  '$.todos'
],'$.areAllComplete', (todos, _, res) => {
  res(todos.every((todo) => todo.complete))
},{
  deps:['$.todos']
})
export default store
