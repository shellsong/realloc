Realloc
----
[![build status](https://img.shields.io/travis/foomorrow/realloc.svg)](https://travis-ci.org/foomorrow/realloc)
[![Coverage Status](https://img.shields.io/coveralls/foomorrow/realloc.svg)](https://coveralls.io/r/foomorrow/realloc?branch=master)
[![npm version](https://img.shields.io/npm/v/realloc.svg)](https://www.npmjs.com/package/realloc)
[![npm downloads](https://img.shields.io/npm/dm/realloc.svg)](https://www.npmjs.com/package/realloc)
## Installation
```sh
npm i -S realloc
```
## Getting Started

### Tutorial
```javascript
import { createState } from 'realloc'
//create a counter store
const {
  getState,
  createAction,
  subscribe
} = createState({
  count:0
})
// create a increment action for the store
const incrementAction = createAction('$.count', (currentCount) => currentCount + 1)
// create a decrement action for the store
const decrementAction = createAction('$.count', (currentCount) => currentCount - 1)
// set a subscriber for the store
const unsubscribe = subscribe((nextState, prevState) => {
	console.log("log: ", nextState, prevState)
})
// call the increment action
incrementAction()
// state of the store will change,
// => log: {count:1} {count:0}

// call the increment action again
incrementAction()
// state of the store will change again
// => log: {count:2} {count:1}
getState() // {count:2}

// call the decrement action
decrementAction()
// => log: {count:1} {count:2}

// create a action that increment with params
const incrementNumAction = createAction('$.count', (num, currentCount) => currentCount + num)

incrementNumAction(5)
// => log: {count:6} {count:1}
```
### Using JSONPath
```javascript
import { createState } from 'realloc'
const initialState = {
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}
const {
  getState,
  createAction,
  createGetter,
  subscribe
} = createState(initialState)
const unsubscribe = subscribe((nextState, prevState) => {
	console.log("log: ", nextState, prevState)
})
const getBookTitlesByPriceGTTen = createGetter('$.store.book[?(@.price > 10)].title')
getBookByPriceGTTen()
// => ["Sword of Honour", "The Lord of the Rings"]

const updateBookCategoryWithPrice = createAction('$.store.book[?(@.price > {price})].category', (payload, currentCategory) => payload.text + currentCategory )
updateBookCategoryWithPrice({
  price:10,
  text:'famous '
})
getState().store.book

// => [{
//     "category": "reference",
//     "author": "Nigel Rees",
//     "title": "Sayings of the Century",
//     "price": 8.95
//   },
//   {
//     "category": "famous fiction",
//     "author": "Evelyn Waugh",
//     "title": "Sword of Honour",
//     "price": 12.99
//   },
//   {
//     "category": "fiction",
//     "author": "Herman Melville",
//     "title": "Moby Dick",
//     "isbn": "0-553-21311-3",
//     "price": 8.99
//   },
//   {
//     "category": "famous fiction",
//     "author": "J. R. R. Tolkien",
//     "title": "The Lord of the Rings",
//     "isbn": "0-395-19395-8",
//     "price": 22.99
//   }]

```
