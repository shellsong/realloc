import {getState, createAction} from '../../js/store'
import {createTodo, toggleTodo, toggleAllCompleted} from '../../js/actions'
const resetTodoApp = createAction('$', (_, res) => {
  res({
    todos:[],
    areAllComplete:true
  })
})
describe('todoapp', () => {
  beforeEach(() => {
    resetTodoApp()
    let {todos, areAllComplete} = getState()
    expect(todos).toEqual([])
    expect(areAllComplete).toBe(true)
  })
  it('create a todo', () => {
    createTodo('test createTodo')
    expect(getState().todos[0].text).toBe('test createTodo')
  })
  it('create several todos', () => {
    Array(10).join(',').split(',').forEach((_, i) => {
      createTodo('test createTodo'+i)
    })
    expect(getState().todos.length).toBe(10)
    getState().todos.forEach((todo, i) => {
      expect(todo.text).toBe('test createTodo'+i)
    })
  })
  it('toggleAllCompleted to true when all is false', () => {
    Array(10).join(',').split(',').forEach((_, i) => {
      createTodo('test createTodo'+i)
    })
    toggleAllCompleted()
    expect(getState().todos.map((t) => t.completed).every((c) => c)).toBe(true)
  })
  it('toggleAllCompleted to true when some is true', () => {
    Array(10).join(',').split(',').forEach((_, i) => {
      createTodo('test createTodo'+i)
    })
    toggleTodo(getState().todos[0])
    toggleTodo(getState().todos[4])
    toggleAllCompleted()
    expect(getState().todos.map((t) => t.completed).every((c) => c)).toBe(true)
  })
  it('toggleAllCompleted to false when all is true', () => {
    Array(10).join(',').split(',').forEach((_, i) => {
      createTodo('test createTodo'+i)
    })
    getState().todos.forEach((t) => toggleTodo(t))
    toggleAllCompleted()
    expect(getState().todos.map((t) => t.completed).every((c) => !c)).toBe(true)
  })
})
