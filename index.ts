type DoubleRecord<K extends string | number | symbol> = { [P in K]: P }

type Detectors = {
  [key: string]: () => boolean | void
}

type Config = {
  revaluateContext: boolean
}

export const ERRORS = {
  UNDETECTABLE_CONTEXT: `No compatible context has been detected`,
  VALUE_NOT_FOUND: `No respective value found for active context`,
}

export const demand = (value: any, name?: string) => {
  if (value === undefined) {
    throw new Error(`required variable ${name ? `'${name}' ` : ''}has not been defined`)
  }

  return value
}

const runIfFunction = <T>(value: T): T extends (...args: any) => any ? ReturnType<T> : T =>
  value instanceof Function && typeof value === 'function' ? value() : value

export default class DynamicEnvironment<T extends Detectors> {
  private setup: Detectors
  private config: Config
  private pristine = true
  private activeContext: keyof T | null = null

  constructor(setup: T, config = { revaluateContext: false }) {
    this.setup = setup
    this.config = config
  }

  get contexts(): DoubleRecord<keyof T> {
    return <DoubleRecord<keyof T>>(
      Object.fromEntries(Object.keys(this.setup).map((key) => [key, key]))
    )
  }

  revealContext() {
    this.pristine = false

    for (const [env, detector] of Object.entries(this.setup)) {
      if (detector()) {
        this.activeContext = env
        return env
      }
    }

    this.activeContext = null
    return null
  }

  pick(data: Partial<Record<keyof T, unknown>>): unknown {
    if (this.pristine || this.config.revaluateContext) {
      this.revealContext()
    }

    if (!this.activeContext) {
      throw new Error(ERRORS.UNDETECTABLE_CONTEXT)
    }

    if (!data.hasOwnProperty(this.activeContext)) {
      console.warn(`The active context is '${String(this.activeContext)}'`)
      throw new Error(ERRORS.VALUE_NOT_FOUND)
    }

    return data[this.activeContext]
  }

  tree(obj: Record<PropertyKey, any>): unknown {
    const self = this

    try {
      return new Proxy(obj, {
        get(target, name) {
          if (!target.hasOwnProperty(name)) {
            return target[name]
          }

          return self.tree(runIfFunction(target[name]))
        },
      })
    } catch (e) {
      return obj
    }
  }
}
