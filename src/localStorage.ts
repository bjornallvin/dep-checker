export const getLocalStorage = (key: string) =>
  new Promise<string>((resolve, reject) => {
    if (typeof window !== 'undefined') {
      resolve(window.localStorage.getItem(key) as string)
    }
    reject(null)
  })

export const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value)
  }
}

export const removeLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key)
  }
}
