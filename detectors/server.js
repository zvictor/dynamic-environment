module.exports = () => {
  // detects if app is running in the server side or not
  if ('platform' in process) {
    return true
  }
}
