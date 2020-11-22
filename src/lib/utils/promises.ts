export function delay(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(true);
    }, ms);
  })
}