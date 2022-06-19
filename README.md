<p align="center">
<strong>Dynamic variables based on environment/context (or anything else!)</strong><br />
<sub>dynamic-environment is a minimalist choice for switching values based on given conditions in your running app.</sub>
</p>

<p align="center">
  [ <a href="#getting-started">Getting started 🤓</a> | <a href="https://www.npmjs.com/package/dynamic-environment">Check it on NPM 👌</a> ]
</p>


![divider](.github/divider.png)

## Setting it up

### Installing it

You can install it from one of these options:

#### with NPM, Yarn, or PNPM

```bash
  $ npm install dynamic-environment

  $ yarn add dynamic-environment
  
  $ pnpm add dynamic-environment
```

#### manually
you may also install it as a development dependency in a package.json file:

```json
  // package.json
  "dependencies": {
    "dynamic-environment": "latest"
  }
```

Then install it with your package manager of choice.

![divider](.github/divider.png)

## Getting started

### Basic usage

```js
import Env from 'dynamic-environment'
import BROWSER from 'dynamic-environment/detectors/browser'
import DOCKER from 'dynamic-environment/detectors/docker'

// Initialize the environment with the contexts of interest
const env = new Env({ BROWSER, DOCKER })

// it will assign 'API_PUBLIC_ENDPOINT` in the browser
// and 'API_CONTAINER_ENDPOINT' in the server
const backendEndpoint = env.pick({
  BROWSER: process.env.API_PUBLIC_ENDPOINT,
  DOCKER: process.env.API_CONTAINER_ENDPOINT,
})
```

Check the list of [available detectors](https://github.com/zvictor/dynamic-environment/tree/main/detectors) for more options of contexts you can use, or [customize your own](#custom-contexts).

### Advanced usage

#### Require values

Throw an error if the value you need has not been provided
```typescript
import { demand } from 'dynamic-environment'

// either returns the value or throws `required variable 'API_SECRET' has not been defined`
const API_SECRET = demand(process.env.API_SECRET, 'API_SECRET')
```

#### Custom contexts

You can easily write your own context detector.
E.g. we can define different commands to be run in different types of machines, as shown below.
```js
import Env from 'dynamic-environment'
import { execaSync } from 'execa'

const env = new Env({
  LINUX: () => process.platform === 'linux',
  MAC: () => process.platform === 'darwin',
})

console.log(env.pick({
  LINUX: `This is what you got, FREE OF CHARGE:`,
  MAC: `This is what you PAID for:`
}))

const osVersion = env.pick({ LINUX: `lsb_release -a`, MAC: `sw_vers` })
execaSync(osVersion, { stdio: 'inherit' })

// This is what you PAID for:
// ProductName:	macOS
// ProductVersion:	12.4
// BuildVersion:	21F79
```

#### Env tree and delayed execution

You can put together all your data into one well organized object instead of having multiple variables spread around.

**Note: `env.tree` lazily executes functions inside objects.**

```typescript
const env = new DynamicEnvironment({
  BROWSER,
  SSR,
}).tree({
  uploader: {
    endpoint: env.pick({
      BROWSER: () => demand(process.env.UPLOADER_PUBLIC_ENDPOINT),
      SSR: 'uploader:8080',
    }),
    secret: env.pick({
      BROWSER: () => demand(process.env.UPLOADER_PUBLIC_SECRET),
      SSR: () => demand(process.env.UPLOADER_ADMIN_SECRET),
    }),
  },
})

console.log(
  env.uploader.endpoint, // uploader:8080
  env.uploader.secret // klajsdjDiJjaoasdSJDS
)
```
