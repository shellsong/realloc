Realloc
----
[![build status](https://img.shields.io/travis/foomorrow/realloc.svg)](https://travis-ci.org/foomorrow/realloc)
[![Coverage Status](https://img.shields.io/coveralls/foomorrow/realloc.svg)](https://coveralls.io/r/foomorrow/realloc?branch=master)
[![npm version](https://img.shields.io/npm/v/realloc.svg)](https://www.npmjs.com/package/realloc)
[![npm downloads](https://img.shields.io/npm/dm/realloc.svg)](https://www.npmjs.com/package/realloc)
## Install
```sh
npm i -S realloc
```
## Getting Started
```javascript
import { createObservableStore } from 'realloc'
//create a counter store
const { 
  getState, 
  createAction, 
  subscribe 
} = createObservableStore({
  count:0
})
// create a increment action for the store
const incrementAction = createAction('$.count', (currentCount) => currentCount + 1)
// create a decrement action for the store
const decrementAction = createAction('$.count', (currentCount) => currentCount - 1)
// set a subscriber for the store
const unsubscribe = subscribe((nextState, prevState) => {
	console.log("log: ", nextState, prevState)
})
// call the increment action
incrementAction()
// state of the store will change, 
// => log: {count:1} {count:0}

// call the increment action again
incrementAction()
// state of the store will change again
// => log: {count:2} {count:1}
getState() // {count:2}

// call the decrement action
decrementAction()
// => log: {count:1} {count:2}

```
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
export const createTodo = createAction('$.todos[(@.length)]', (text,  _, done) => {
  return {
    text:text,
    complete:false
  }
})
export const toggleTodoActive = createAction('$.todos[?(@.id === {id})].complete',
(payload, currentCompleteState, done) => !complete
)
export const updateTodoText = createAction('$.todos[?(@.id === {id})].text', (payload, prevText, done) => payload.text)
export const removeTodo = createAction('$.todos', (payload, todos, () => todos.filter((todo) => todo !== payload))
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


