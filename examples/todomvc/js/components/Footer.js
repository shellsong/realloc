
import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import {destroyCompleted, switchFilter} from '../actions'

function onHashChange(){
  switchFilter(window.location.hash.replace(/^#/,''))
}

export default class Footer extends Component {
  constructor(props, context){
    super(props, context)
    this._onClearCompletedClick = this._onClearCompletedClick.bind(this)
  }
  _onClearCompletedClick(){
    destroyCompleted()
  }
  componentDidMount(){
    window.addEventListener('hashchange', onHashChange)
  }
  componentWillUnmount(){
    window.removeEventListener('hashchange', onHashChange)
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
					<li><a href="#all" className={cx({selected:visibility === 'all'})}>All</a></li>
					<li><a href="#active" className={cx({selected:visibility === 'active'})}>Active</a></li>
					<li><a href="#completed"  className={cx({selected:visibility === 'completed'})}>Completed</a></li>
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
