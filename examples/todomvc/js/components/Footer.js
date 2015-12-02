
import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import {destroyCompleted, switchFilter} from '../actions'

export default class Footer extends Component {
  constructor(props, context){
    super(props, context)
    this._onClearCompletedClick = this._onClearCompletedClick.bind(this)
  }
  _onClearCompletedClick(){
    destroyCompleted()
  }
  render(){
    let {allTodos, visibility} = this.props
    let total = allTodos.length

    if (total === 0) {
      return null
    }
    let completed = allTodos.filter((todo) => todo.completed).length
    let itemsLeft = total - completed
    let itemsLeftPhrase = (itemsLeft === 1 ? ' item ' : ' items ') + 'left'
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
        </span>
        <ul className="filters">
					<li><a href="#/all" className={cx({selected:visibility === 'all'})} onClick={(e) => switchFilter('all')}>All</a></li>
					<li><a href="#/active" className={cx({selected:visibility === 'active'})} onClick={(e) => switchFilter('active')}>Active</a></li>
					<li><a href="#/completed"  className={cx({selected:visibility === 'completed'})} onClick={(e) => switchFilter('completed')}>Completed</a></li>
				</ul>
        {
          !completed ? null : (
            <button
              className="clear-completed"
              onClick={this._onClearCompletedClick}>
              Clear completed ({completed})
            </button>
          )
        }
      </footer>
    )
  }
}
