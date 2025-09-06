function copyHeaders(source: Headers, destination?: Headers) {
  source.forEach((value, key) => {
    destination?.append(key, value)
  })
}

export { copyHeaders }
