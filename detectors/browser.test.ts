import test from 'ava'
import BROWSER from './browser'
import DynamicEnvironment, { ERRORS } from '../index'

test('checks standard conditions', (t) => {
  t.is(typeof window, 'undefined', 'the tests are not running in the browser')
  t.falsy(BROWSER())

  t.throws(
    () =>
      new DynamicEnvironment({
        BROWSER,
      }).pick({ BROWSER: 1 }),
    { message: ERRORS.UNDETECTABLE_ENVIRONMENT }
  )
})

test('checks negative condition', (t) => {
  Object.defineProperty(globalThis, 'window', { value: undefined })
  t.is(typeof window, 'undefined', 'the tests are not running in the browser')
  t.falsy(BROWSER())

  t.throws(
    () =>
      new DynamicEnvironment({
        BROWSER,
      }).pick({ BROWSER: 1 }),
    { message: ERRORS.UNDETECTABLE_ENVIRONMENT }
  )
})

// test('checks positive condition', (t) => {
//   // Can't fake window object:
//   // "Cannot redefine property: window"
//   Object.defineProperty(globalThis, 'window', { value: {} })
//   t.is(typeof window, 'object', 'the tests are now running in the browser')
//   t.true(BROWSER())

//   t.is(
//     new DynamicEnvironment({
//       BROWSER,
//     }).pick({ BROWSER: 1 }),
//     1
//   )
// })
