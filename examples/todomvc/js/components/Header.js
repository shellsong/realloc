import React, { Component, PropTypes } from 'react'
import TodoTextInput from './TodoTextInput'
import { createTodo } from '../actions'
const ENTER_KEY_CODE = 13;
export default class Header extends Component {
  render(){
    return (
      <header className="header">
        <h1>todos</h1>
        <TodoTextInput
          className="new-todo"
          placeholder="What needs to be done?"
          onSave={ createTodo }
          />
      </header>
    )
  }
}
