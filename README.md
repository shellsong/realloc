Realloc
----
[![build status](https://img.shields.io/travis/foomorrow/realloc.svg?style=flat-square)](https://travis-ci.org/foomorrow/realloc)
[![npm version](https://img.shields.io/npm/v/realloc.svg?style=flat-square)](https://www.npmjs.com/package/realloc)
[![Coverage Status](https://img.shields.io/coveralls/foomorrow/realloc.svg)](https://coveralls.io/r/foomorrow/realloc?branch=master)
[![NPM](https://nodei.co/npm/realloc.png?downloads=true)](https://nodei.co/npm/realloc/)
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
export const createTodo = createAction('$.todos[(@.length)]', (text,  _, resolve) => {
  resolve({
    text:text,
    complete:false
  })
})
export const toggleTodoActive = createAction('$.todos[?(@.id === {id})].complete', (payload, currentCompleteState, resolve) => {
  resolve(!complete)
})
export const updateTodoText = createAction('$.todos[?(@.id === {id})].text', (payload, prevText, resolve) => {
  resolve(payload.text)
})
export const removeTodo = createAction('$.todos', (payload, todos, () => {
  resolve(todos.filter((todo) => todo !== payload))
})
```
```javascript
// TodoApp.js
import React, { Component } from 'react'
import { subscribe, getState } from './store'
import { createTodo } from 'actions'
const ENTER_KEY_CODE = 13;
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
      <input onKeyDown={(ev) => {
        if (ev.keyCode === ENTER_KEY_CODE) {
          createTodo(ev.target.value)
        }
      }}/>
    )
  }

}
```
## Todo List

* unit tests
* Examples &amp; Documents
