import slugify from "slugify";

/**
 * Gets all the queryStrings from the URL
 * @param url The URL we are parsing to get the queryStrings
 * @return Object containing all the queryStrings
 */
export const getQueryStrings = (url: string | undefined): any => {
  if(url !== undefined && url.includes('?')){
    const splitUrl = String(url)?.split("?");
    const params = splitUrl[1].split("&");
    const strings = {};
    params.forEach((q) => {
      const s = q.split("=");
      strings[s[0]] = Number(s[1]);
    });
    return strings;
  }
  return undefined;
};

/**
 * Converts text to slug format
 * @param title Title we're converting to slug format
 * @returns Converted title to slug
 */
export const convertToSlug = (title: string) => {
  const options = {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: /[$*_+~.()'"!\-:@]/g, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    //strict: false,     // strip special characters except replacement, defaults to `false`
    locale: "pt", // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  };
  return slugify(title, options);
};

export default {
  getQueryStrings,
  convertToSlug,
};
