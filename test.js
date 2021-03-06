var test = require('tape')
var forOf = require('./')

var obj = {
  input: { // --> type
    in1: // --> port
    'i1', // --> val
    // Calls: fn('input', 'in1', 'i1', 0)

    in2: // --> port
    'i2' // --> val
  // Calls: fn('input', 'in1', 'i2', 1)
  },
  output: { // --> type
    out1: // --> port
    'o1', // --> val
    // Calls: fn('output', 'out1', 'o1', 2)

    out2: // --> port
    'o2' // --> val
  // Calls: fn('output', 'out2', 'o2', 3)
  }
}

var expected = [
  ['input', 'in1', 'i1'],
  ['input', 'in2', 'i2'],
  ['output', 'out1', 'o1'],
  ['output', 'out2', 'o2']
]

var filtered = [
  {type: 'input', val: 'i1'},
  {type: 'input', val: 'i2'}
]

function pushIt (res) {
  return function (type, port, val) { res.push([type, port, val]) }
}

function pushItReturn (res) {
  return function (type, port, val) {
    var ret = [type, port, val]
    res.push(ret)
    return ret
  }
}

test('Should work', function (t) {
  var res = []
  var ret = forOf(pushIt(res), obj)
  t.deepEqual(res, expected)
  t.deepEqual(ret, [])
  t.end()
})

test('Should return array of values', function (t) {
  var res = []
  var ret = forOf(pushItReturn(res), obj)
  t.deepEqual(res, expected)
  t.deepEqual(ret, expected)
  t.end()
})

test('undefined return is not included', function (t) {
  var ret = forOf((type, port, val) => {
    return type === 'input' ? {type: type, val: val} : undefined
  }, obj)
  t.deepEqual(ret, filtered)
  t.end()
})

test('one argument will iterate just the keys', function (t) {
  var ret = forOf((type) => type, obj)
  t.deepEqual(ret, Object.keys(obj))
  t.end()
})

test('filter fun', function (t) {
  var ret = forOf((type, port, val) => ({type: type, val: val}), obj)
    .filter((val) => {
      return val.type === 'input'
    })
  t.deepEqual(ret, filtered)
  t.end()
})

test('hetrogenous (simple)', function (t) {
  const pkg = require('./package.json')
  const ret = forOf((pos1, pos2, pos3) => {
    if (pos1 === 'homepage') return pos2
    else if (pos2 === 'url') return pos3
  }, pkg)
  t.deepEqual(ret, [pkg.repository.url, pkg.bugs.url, pkg.homepage])
  t.end()
})
