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
      this.setState(state, () => {console.log(getState())})
    })
  }
  componentWillUnmount(){
    this._unsubscribe()
  }
  render(){
    let {todos, areAllComplete} = this.state
    return (
      <div>
        <Header />
        <MainSection
          allTodos={todos}
          areAllComplete={areAllComplete}
        />
        <Footer allTodos={todos} />
      </div>
    )
  }
}
