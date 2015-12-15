import {
  getState,
  createAction
} from '../../js/store'
import {
  createTodo,
  toggleTodo,
  toggleAllCompleted,
  updateTodo,
  destroyTodo,
  destroyCompleted
} from '../../js/actions'
const resetTodoApp = createAction('$', (_) => ({
  todos:[],
  visibility:'all'
}))
describe('todoapp', () => {
  beforeEach(() => {
    resetTodoApp()
    let {todos, visibility} = getState()
    expect(todos).toEqual([])
    expect(visibility).toBe('all')
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
  it('toggle a todo', () => {
    createTodo('test createTodo will change')
    createTodo('test createTodo')
    toggleTodo(getState().todos[0])
    expect(getState().todos[0].completed).toBe(true)
    expect(getState().todos[1].completed).toBe(false)
  })
  it('update a todo', () => {
    createTodo('test createTodo will change')
    createTodo('test createTodo')
    updateTodo(getState().todos[0], 'will change')
    expect(getState().todos[0].text).toBe('will change')
    expect(getState().todos[1].text).toBe('test createTodo')
  })
  it('delete a todo', () => {
    createTodo('test createTodo will destroy')
    createTodo('test createTodo')
    destroyTodo(getState().todos[0])
    expect(getState().todos.length).toBe(1)
    expect(getState().todos[0].text).toBe('test createTodo')
  })
  it('delete all completed todos', () => {
    Array(10).join(',').split(',').forEach((_, i) => {
      createTodo('test createTodo'+i)
    })
    toggleTodo(getState().todos[0])
    toggleTodo(getState().todos[4])
    destroyCompleted()
    expect(getState().todos.length).toBe(8)
  })
  describe('toggle all completed todos', () => {
    it('toggle all completed todos to true when all is false', () => {
      Array(10).join(',').split(',').forEach((_, i) => {
        createTodo('test createTodo'+i)
      })
      toggleAllCompleted()
      expect(getState().todos.map((t) => t.completed).every((c) => c)).toBe(true)
    })
    it('toggle all completed todos to true when some is true', () => {
      Array(10).join(',').split(',').forEach((_, i) => {
        createTodo('test createTodo'+i)
      })
      toggleTodo(getState().todos[0])
      toggleTodo(getState().todos[4])
      toggleAllCompleted()
      expect(getState().todos.map((t) => t.completed).every((c) => c)).toBe(true)
    })
    it('toggle all completed todos to false when all is true', () => {
      Array(10).join(',').split(',').forEach((_, i) => {
        createTodo('test createTodo'+i)
      })
      getState().todos.forEach((t) => toggleTodo(t))
      toggleAllCompleted()
      expect(getState().todos.map((t) => t.completed).every((c) => !c)).toBe(true)
    })
  })

})
