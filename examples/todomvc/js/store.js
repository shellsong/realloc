import { createObservableState } from 'realloc'
import {visibilityFilters} from './constants'

let visibility = window.location.hash.replace(/^#/,'')
if(Object.keys(visibilityFilters).indexOf(visibility) == -1){
  visibility = 'all'
  window.location.hash = '#all'
}

let initialState = {
  todos:[],
  visibility:window.location.hash?window.location.hash.replace(/^#/,''):'all'
}

export default createObservableState(initialState)
