
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with -
    .replace(/^-+|-+$/g, '')    // Remove leading/trailing -
    .replace(/&/g, '-and-');    // Replace & with 'and'
};
