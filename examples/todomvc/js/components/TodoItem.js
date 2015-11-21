import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'
import TodoTextInput from './TodoTextInput'
import updateTodo from '../actions/updateTodo'
import toggleComplete from '../actions/toggleComplete'
import destroy from '../actions/destroy'
export default class TodoItem extends Component {
  constructor(props, context){
    super(props, context)
    this.state = {
      isEditing: false
    }
    this._onSave = this._onSave.bind(this)
    this._onToggleComplete = this._onToggleComplete.bind(this)
    this._onDoubleClick = this._onDoubleClick.bind(this)
    this._onDestroyClick = this._onDestroyClick.bind(this)
  }
  _onSave(text){
    updateTodo({
      id:this.props.todo.id,
      text:text
    });
    this.setState({isEditing: false})
  }
  _onToggleComplete(){
    toggleComplete(this.props.todo)
  }
  _onDoubleClick(){
    this.setState({isEditing: true})
  }
  _onDestroyClick(){
    destroy(this.props.todo)
  }
  render(){
    let {todo} = this.props
    let {isEditing} = this.state
    let input = !isEditing ? null :(
      <TodoTextInput
        className="edit"
        onSave={this._onSave}
        defaultValue={todo.text}
      />
    )

    return (
      <li
        className={classNames({
          'completed': todo.complete,
          'editing': this.state.isEditing
        })}
        key={todo.id}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete}
          />
          <label onDoubleClick={this._onDoubleClick}>
            {todo.text}
          </label>
          <button className="destroy" onClick={this._onDestroyClick} />
        </div>
        {input}
      </li>
    );
  }
}
