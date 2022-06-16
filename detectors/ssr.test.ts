import test from 'ava'
import SSR from './ssr'
import DynamicEnvironment, { ERRORS } from '../index'

test('checks negative condition - no bundle', (t) => {
  delete (process as any).browser
  t.false('browser' in process, 'the tests are NOT running in SSR')
  t.falsy(SSR())

  t.throws(
    () =>
      new DynamicEnvironment({
        SSR,
      }).pick({ SSR: 1 }),
    { message: ERRORS.UNDETECTABLE_ENVIRONMENT }
  )
})

test('checks negative condition - browser', (t) => {
  ;(process as any).browser = true
  t.true('browser' in process, 'the tests allow SSR')
  t.falsy(SSR())

  t.throws(
    () =>
      new DynamicEnvironment({
        SSR,
      }).pick({ SSR: 1 }),
    { message: ERRORS.UNDETECTABLE_ENVIRONMENT }
  )
})

test('checks positive condition', (t) => {
  ;(process as any).browser = false
  t.true('browser' in process, 'the tests allow SSR')
  t.false((process as any).browser, 'the tests are running in the SSR')
  t.true(SSR())

  t.is(
    new DynamicEnvironment({
      SSR,
    }).pick({ SSR: 1 }),
    1
  )
})
