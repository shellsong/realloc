
import React, {Component, PropTypes} from 'react'
import TodoItem from './TodoItem'

import toggleCompleteAll from '../actions/toggleCompleteAll'

export default class MainSection extends Component {
  constructor(props, context){
    super(props, context)
    this._onToggleCompleteAll = this._onToggleCompleteAll.bind(this)
  }
  _onToggleCompleteAll(){
    toggleCompleteAll()
  }
  render(){
    let {allTodos} = this.props;
    if (allTodos.length < 1) {
      return null;
    }

    let todos = allTodos.map((todo) => {
      return (
        <TodoItem key={todo.id} todo={todo} />
      )
    });
    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          defaultChecked={this.props.areAllComplete ? true : false}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todos}</ul>
      </section>
    )
  }
}
