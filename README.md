Realloc
----
A Immutable State Manager Access By JSONPath  for Javascript Applications

[![build status](https://img.shields.io/travis/foomorrow/realloc.svg?style=flat-square)](https://travis-ci.org/foomorrow/realloc)
[![npm version](https://img.shields.io/npm/v/realloc.svg?style=flat-square)](https://www.npmjs.com/package/realloc)
[![npm downloads](https://img.shields.io/npm/dt/realloc.svg?style=flat-square)](https://www.npmjs.com/package/realloc)
## Install
```sh
npm i -S realloc
```
## Getting Start
```javascript
// store.js
// import
import { createObservableStore } from 'realloc'
// create
export default const store = createObservableStore({
  todos:[],
  visibilityTodoList:[],
  filterKey:'ALL'
})
```
```javascript
// actions.js
import { createAction } from './store'
export const addTodo = createAction('$.todos', (text,  todos, resolve) => {
  resolve(todos.concat({title:text, active:true }))
})
export const toggleTodoActive = createAction('$.todos.{id}.active', (payload, oldStateOfTodo, resolve) => {
  resolve(!oldStateOfTodo)
})
export const updateTodoText = createAction('$.todos.{id}.text', (payload, todo, resolve) => {
  resolve({
    id:todo.id,
    text:payload.text,
    active:todo.active
  })
})
export const removeTodo = createAction('$.todos', (payload, todos, () => {
  resolve(todos.filter((t) => t !== payload.todo )))
})
```
```javascript
// TodoApp.js
import React, { Component } from 'react'
import { subscribe, getState } from './store'
class TodoApp extends Component {
  constructor(props, context){
    super(props, context)
    this.state = getState()
  }
  componentDidMount(){
    this._unSubscribe = subscribe((nextState, prevState) => this.setState(nextState))
  }
  componentWillUnmount(){
    this._unSubscribe()
  }
  render(){
    return (
      ...
    )
  }

}
```
## Todo List

* Accessor By JSONPath
* ObservableStore
* actionCreatorFactory
*
* watch
* Examples &amp; Documents
