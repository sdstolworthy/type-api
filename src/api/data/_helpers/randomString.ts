export default (length: number = 6): string => {
  return Math.random().toString(36).substring(length)
}
