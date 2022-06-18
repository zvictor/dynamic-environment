import test from 'ava'
import expect from 'expect'
import DynamicEnvironment, { demand } from './index'

const sample = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]!

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

test('returns demanded values when possible', (t) => {
  t.deepEqual(demand(1), 1)
  t.deepEqual(demand(2, 'MY_VAR'), 2)
  t.deepEqual(demand(false, 'MY_VAR'), false)
  t.deepEqual(demand('undefined', 'MY_VAR'), 'undefined')
})

test('throws error when demanded values are not found', (t) => {
  let a: string
  t.throws(() => demand(a), { message: `required variable has not been defined` })
  t.throws(() => demand(undefined, 'MY_VAR'), {
    message: `required variable 'MY_VAR' has not been defined`,
  })
})

test('builds a static tree with no magic', (t) => {
  const env = new DynamicEnvironment({
    WRONG: () => false,
    RIGHT: () => true,
  })

  let best = 'nextjs'
  let worst = () => sample(['angularjs', 'angular'])

  t.deepEqual(
    {
      framework: {
        best: env.pick({
          RIGHT: demand(best),
          WRONG: 'meteor',
        }),
        worst: env.pick({
          WRONG: 'emberjs',
          RIGHT: worst,
        }),
      },
    },
    {
      framework: {
        best: 'nextjs',
        worst,
      },
    }
  )
})

test('builds a static tree executing the functions', (t) => {
  const env = new DynamicEnvironment({
    WRONG: () => false,
    RIGHT: () => true,
  })

  let best = 'nextjs'
  let worst = () => sample(['angularjs', 'angular'])

  expect(
    env.tree({
      framework: {
        best: env.pick({
          RIGHT: demand(best),
          WRONG: 'meteor',
        }),
        worst: env.pick({
          WRONG: 'emberjs',
          RIGHT: worst,
        }),
      },
    })
  ).toEqual({
    framework: {
      best: 'nextjs',
      worst: expect.stringMatching(/angular(js)?/),
    },
  })

  t.pass()
})
