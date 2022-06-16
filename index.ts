type DoubleRecord<K extends string | number | symbol> = { [P in K]: P }

type Detectors = {
  [key: string]: () => boolean | void
}

export const ERRORS = {
  UNDETECTABLE_ENVIRONMENT: `No compatible environment has been detected`,
  VALUE_NOT_FOUND: `No respective value found for active environment`,
}

export default class DynamicEnvironment<T extends Detectors> {
  private setup: Detectors
  private activeEnv: keyof T | null = null

  constructor(setup: T) {
    this.setup = setup
    this.activeEnv = this.revealEnvironment()
  }

  get environments(): DoubleRecord<keyof T> {
    return <DoubleRecord<keyof T>>(
      Object.fromEntries(Object.keys(this.setup).map((key) => [key, key]))
    )
  }

  revealEnvironment() {
    for (const [env, detector] of Object.entries(this.setup)) {
      if (detector()) {
        this.activeEnv = env
        return env
      }
    }

    this.activeEnv = null
    return null
  }

  pick(data: Partial<Record<keyof T, unknown>>): unknown {
    if (!this.activeEnv) {
      throw new Error(ERRORS.UNDETECTABLE_ENVIRONMENT)
    }

    if (!data.hasOwnProperty(this.activeEnv)) {
      throw new Error(ERRORS.VALUE_NOT_FOUND)
    }

    return data[this.activeEnv]
  }
}
