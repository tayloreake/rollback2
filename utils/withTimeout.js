export function withTimeout(operation, timeoutMs, message = "Operation timed out") {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs)
  })
  return Promise.race([Promise.resolve().then(operation), timeout]).finally(() => clearTimeout(timer))
}
