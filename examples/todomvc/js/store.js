import { createObservableState } from 'realloc'


let initialState = {
  todos:[],
  visibility:'all'
}
// var localStorage
// if(localStorage){
//   let cache = localStorage.getItem('todoapp')
//   if(cache){
//     initialState = JSON.parse(cache)
//   }
// }

const store = createObservableState(initialState)
export default store

store.subscribe((a) => {
  // console.log(a.todos.map((a) => a.completed))
  // localStorage.setItem('todoapp', JSON.stringify(a))
})
