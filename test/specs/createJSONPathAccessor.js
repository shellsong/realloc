const {
  createGetter,
  createSetter
} = require('../../src/createJSONPathAccessor')



xdescribe('no param', () => {
  it('access {a:{b:1}} ', () => {
    var obj = {a:{b:1}}
    expect(createGetter('$')(obj)).toBe(obj)
    expect(createSetter('$')(obj,{c:{d:2}})).toEqual({c:{d:2}})
  })
})
