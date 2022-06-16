import test from 'ava'
import DynamicEnvironment from './index'

test('detects environments while giving FIFO preference', (t) => {
  let a = true
  let b = true
  let c = true

  const env = new DynamicEnvironment({
    A: () => a,
    B: () => b,
    C: () => c,
  })

  t.is(env.revealEnvironment(), 'A')
  t.is(env.pick({ A: 1, B: 2, C: 3 }), 1)

  a = false
  t.is(env.revealEnvironment(), 'B')
  t.is(env.pick({ A: 1, B: 2, C: 3 }), 2)

  a = false
  b = false
  t.is(env.revealEnvironment(), 'C')
  t.is(env.pick({ A: 1, B: 2, C: 3 }), 3)

  a = false
  b = false
  c = false
  t.is(env.revealEnvironment(), null)
  t.throws(() => env.pick({ A: 1, B: 2, C: 3 }), {
    message: `No compatible environment has been detected`,
  })
})

test('throws error when values are not found', (t) => {
  t.throws(
    () =>
      new DynamicEnvironment({
        A: () => false,
        B: () => true,
      }).pick({ A: 1 }),
    { message: `No respective value found for active environment` }
  )
})

test('lists available environments', (t) => {
  t.deepEqual(
    new DynamicEnvironment({
      A: () => {},
      B: () => {},
    }).environments,
    { A: 'A', B: 'B' }
  )
})
