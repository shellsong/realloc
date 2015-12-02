import React, {Component} from 'react'
import Header from './Header'
import MainSection from './MainSection'
import Footer from './Footer'
import {getState, subscribe} from '../store'
export default class TodoApp extends Component{
  constructor(props, context){
    super(props)
    this.state = getState()
  }
  componentDidMount(){
    this._unsubscribe = subscribe((state) => {
      this.setState(state)
    })
  }
  componentWillUnmount(){
    this._unsubscribe()
  }
  render(){
    let {newTodo, todos, visibility} = this.state
    return (
      <div>
        <Header value={newTodo} />
        <MainSection
          allTodos={todos}
          visibility={visibility}
        />
        <Footer
          allTodos={todos}
          visibility={visibility}
        />
      </div>
    )
  }
}
