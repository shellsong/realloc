
import React, {Component, PropTypes} from 'react'
import destroyCompleted from '../actions/destroyCompleted'

export default class Footer extends Component {
  constructor(props, context){
    super(props, context)
    this._onClearCompletedClick = this._onClearCompletedClick.bind(this)
  }
  _onClearCompletedClick(){
    destroyCompleted()
  }
  render(){
    let {allTodos} = this.props
    let total = allTodos.length

    if (total === 0) {
      return null
    }
    let completed = allTodos.filter((todo) => todo.complete).length
    let itemsLeft = total - completed
    let itemsLeftPhrase = (itemsLeft === 1 ? ' item ' : ' items ')
    itemsLeftPhrase += 'left'
    let clearCompletedButton = !completed ? null :(
      <button
        id="clear-completed"
        onClick={this._onClearCompletedClick}>
        Clear completed ({completed})
      </button>
    )
    return (
      <footer id="footer">
        <span id="todo-count">
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
        </span>
        {clearCompletedButton}
      </footer>
    )
  }
}
