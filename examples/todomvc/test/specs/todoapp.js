const {getState, createAction} = require('../../js/store')
const createTodo = require('../../js/actions/createTodo')
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
    createTodo({text:'test createTodo'})
    expect(getState().todos[0].text).toBe('test createTodo')
  })
  it('create several todos', () => {
    Array(10).join(',').split(',').forEach((_, i) => {
      createTodo({text:'test createTodo'+i})
    })
    expect(getState().todos.length).toBe(10)
    expect(getState().todos[0].text).toBe('test createTodo0')
  })
})
