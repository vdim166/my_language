export const readCode = async (path: string) => {
  const file = Bun.file(path)
  return await file.text()
}
