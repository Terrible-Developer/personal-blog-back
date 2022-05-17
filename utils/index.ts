/**
 * Gets all the queryStrings from the URL
 * @param url The URL we are parsing to get the queryStrings
 * @return Object containing all the queryStrings
 */
export const getQueryStrings = (url: string | undefined): any => {
  const splitUrl = String(url)?.split('?');
  const params = splitUrl[1].split('&');
  const strings = {}
  params.forEach(q=> {
    const s = q.split('=');
    strings[s[0]] = Number(s[1])
  })
  return strings
}

export default {
  getQueryStrings
}
