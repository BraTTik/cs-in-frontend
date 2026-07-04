const regex = /(.+?)\1+/g;

export const zipStr = (str: string) => {
  let prev: string;

  do {
    prev = str;
    str = str.replaceAll(regex, "$1");
  } while(str !== prev);

  return str;
}
