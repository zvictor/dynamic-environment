import test from 'ava'
import DynamicEnvironment from './index'

test('detects context while giving FIFO preference', (t) => {
  let a = true
  let b = true
  let c = true

  const env = new DynamicEnvironment({
    A: () => a,
    B: () => b,
    C: () => c,
  })

  t.is(env.revealContext(), 'A')
  t.is(env.pick({ A: 1, B: 2, C: 3 }), 1)

  a = false
  t.is(env.revealContext(), 'B')
  t.is(env.pick({ A: 1, B: 2, C: 3 }), 2)

  a = false
  b = false
  t.is(env.revealContext(), 'C')
  t.is(env.pick({ A: 1, B: 2, C: 3 }), 3)

  a = false
  b = false
  c = false
  t.is(env.revealContext(), null)
  t.throws(() => env.pick({ A: 1, B: 2, C: 3 }), {
    message: `No compatible context has been detected`,
  })
})

test('throws error when values are not found', (t) => {
  t.throws(
    () =>
      new DynamicEnvironment({
        A: () => false,
        B: () => true,
      }).pick({ A: 1 }),
    { message: `No respective value found for active context` }
  )
})

test('lists available contexts', (t) => {
  t.deepEqual(
    new DynamicEnvironment({
      A: () => {},
      B: () => {},
    }).contexts,
    { A: 'A', B: 'B' }
  )
})
