var test = require('tape')

test('something cool', function(t){
  t.plan(2)
  t.equal(1, 1, '1 and 1 should be equal')
  t.notEqual(1+2, 5)
})
