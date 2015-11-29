import actionCreatorFactory from '../../src/actionCreatorFactory'
describe('create actionCreator', () => {
  it('should create a actionCreator', () => {
    var propsOfA = {b:1}
      , setterSpy = jasmine.createSpy('setterSpy')
      , actionFnSpy = jasmine.createSpy('actionFnSpy');
    var obj = {
      state:{
        a:propsOfA
      }
    }

    let actionCreator = actionCreatorFactory(() => obj.state, setterSpy)
    let action = actionCreator('$.a',(b, res) => {
      res({b:2})
      actionFnSpy(b, res)
    })
    action();
    expect(actionFnSpy).toHaveBeenCalledWith(propsOfA, jasmine.any(Function));
    expect(setterSpy).toHaveBeenCalledWith({a:{b:2}},['$'],'a');
  })
  it('deep update', () => {
    var propsOfA = {b:{c:1},d:{e:2}}
      , setterSpy = jasmine.createSpy('setterSpy')
    var nextState
    setterSpy.and.callFake((a) => {
      nextState = a
    })
    var obj = {
      state:{
        a:propsOfA
      }
    }

    let actionCreator = actionCreatorFactory(() => obj.state, setterSpy)
    let action = actionCreator('$.a.{[0]}.{[1]}', (k1, k2, c, res) => {
      res(2)
    })
    action('b','c');
    expect(setterSpy).toHaveBeenCalled();
    expect(nextState.a.d).toBe(propsOfA.d);
    expect(nextState.a.b.c).toBe(2)
  })
})
