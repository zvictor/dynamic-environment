module.exports = () => {
  // detects if app is running in SSR or not
  // `process.browser` is used by webpack, browserify, next.js, ...
  if ('browser' in process) {
    return !process.browser
  }
}
