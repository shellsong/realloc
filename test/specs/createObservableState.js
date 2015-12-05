import createObservableState from '../../src/createObservableState'

describe('observable state', () => {
  it('with initial value', () => {
    expect(createObservableState({a:1}).getState()).toEqual({a:1})
  })
  it('without initial value', () => {
    expect(createObservableState().getState()).toEqual({})
  })
  it('subscribe and unsubscribe', () => {
    let callback0 = jasmine.createSpy('subscribeCallback0')
    let callback1 = jasmine.createSpy('subscribeCallback1')
    let {createAction, subscribe} = createObservableState()
    let action = createAction('$.a', (_, res) => 1)
    let unsubscribe0 = subscribe(callback0)
    let unsubscribe1 = subscribe(callback1)
    action()
    unsubscribe1()
    expect(callback0).toHaveBeenCalledWith({a:1}, {}, jasmine.any(Array))
    expect(callback1).toHaveBeenCalledWith({a:1}, {}, jasmine.any(Array))
  })
  it('create a state getter', () => {
    let source = {
      a:1,
      b:{
        c:2
      }
    }
    let { createGetter } = createObservableState(source)
    let getter0 = createGetter('$.a')()
    let getter1 = createGetter('$.b')()
    let getter2 = createGetter('$.{k}.c')({k:'b'})
    expect(getter0[0]).toBe(1)
    expect(getter1[0]).toBe(source.b)
    expect(getter2[0]).toBe(2)

  })
})
