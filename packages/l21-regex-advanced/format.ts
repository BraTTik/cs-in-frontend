

export const format = (str: string, template: Record<string, string | number>) => {
  const regex = /\$\{(.+?)}/g
  return str.replaceAll(regex, (_, name) => {
    return template[name] as string;
  })
}
