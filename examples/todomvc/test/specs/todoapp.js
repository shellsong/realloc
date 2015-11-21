const {getState} = require('../../js/store')
const createTodo = require('../../js/actions/createTodo')

describe('todoapp', () => {
  it('create a todo', () => {
    createTodo({text:'test createTodo'})
    expect(getState().todos[0].text).toBe('test createTodo')
  })
})
