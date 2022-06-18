import * as fs from 'fs'
import test from 'ava'
import DOCKER from './docker'
import DynamicEnvironment, { ERRORS } from '../index'

const inDocker = fs.existsSync('/.dockerenv')

if (inDocker) {
  test('checks positive condition', (t) => {
    t.true(DOCKER())

    t.is(
      new DynamicEnvironment({
        DOCKER,
      }).pick({ DOCKER: 1 }),
      1
    )
  })
} else {
  test('checks negative condition', (t) => {
    t.falsy(DOCKER())

    t.throws(
      () =>
        new DynamicEnvironment({
          DOCKER,
        }).pick({ DOCKER: 1 }),
      { message: ERRORS.UNDETECTABLE_CONTEXT }
    )
  })
}
