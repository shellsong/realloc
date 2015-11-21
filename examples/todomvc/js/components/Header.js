
import React, {Component, PropTypes} from 'react'
import TodoTextInput from './TodoTextInput'
import createTodo from '../actions/createTodo'

export default class Header extends Component {
  constructor(props, context){
    super(props, context)
    this._onSave = this._onSave.bind(this)
  }
  _onSave(text){
    if(text.trim()){
      createTodo({text:text})
    }
  }
  render(){
    return (
      <header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this._onSave}
        />
      </header>
    )
  }
}
