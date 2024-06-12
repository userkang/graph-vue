export function isEqualWith(obj1, obj2, customizer) {
  if (customizer && typeof customizer === 'function') {
    const result = customizer(obj1, obj2)
    if (result !== undefined) {
      return result
    }
  }
  if (obj1 === obj2) {
    return true
  }
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false
  }
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false
  }
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) {
    return false
  }
  for (const key of keys1) {
    if (!isEqualWith(obj1[key], obj2[key], customizer)) {
      return false
    }
  }
  return true
}
