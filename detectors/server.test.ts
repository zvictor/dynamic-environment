import test from 'ava'
import SERVER from './server'
import DynamicEnvironment, { ERRORS } from '../index'

test('checks negative condition', (t) => {
  //@ts-ignore
  delete process.platform
  t.false('platform' in process, 'the tests are NOT running in the server')
  t.falsy(SERVER())

  t.throws(
    () =>
      new DynamicEnvironment({
        SERVER,
      }).pick({ SERVER: 1 }),
    { message: ERRORS.UNDETECTABLE_CONTEXT }
  )
})

test('checks positive condition', (t) => {
  //@ts-ignore
  process.platform = 'darwin'
  t.true('platform' in process, 'the tests are running in the server')
  t.true(SERVER())

  t.is(
    new DynamicEnvironment({
      SERVER,
    }).pick({ SERVER: 1 }),
    1
  )
})
