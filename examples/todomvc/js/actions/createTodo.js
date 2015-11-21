import {createAction} from '../store'
function getNewId(){
  return (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
}

export default createAction('$.todos[(@.length)]', (payload, _, res) => {
  res({
    id:getNewId(),
    text:payload.text,
    complete:false
  })
})
