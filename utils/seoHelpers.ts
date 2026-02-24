
export const generateMetaTitle = (title: string) => `${title} | KarirKita`;

export const generateMetaDescription = (description: string) => {
  return description.length > 160 ? description.substring(0, 157) + '...' : description;
};