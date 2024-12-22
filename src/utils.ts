import { Preference } from './types';

export const sortArticlesByImage = (articles: any) => {
  return articles.sort((a: any, b: any) => {
    if (a.urlToImage === null && b.urlToImage !== null) return 1;
    if (a.urlToImage !== null && b.urlToImage === null) return -1;
    return 0;
  });
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const getAuthor = (author: string) => {
  if (!author) return '-';
  let authorName = author.startsWith('By ') ? author.slice(3) : author;
  const authors = authorName.split(',');
  return authors[0].trim();
};

export const filterArticles = (articles: any, filters: Preference) => {
  return (articles || []).filter((article: any) => {
    const categoryMatch = filters.category.includes(article.category);
    const sourceMatch = filters.source.includes(article.source.name);
    return categoryMatch || sourceMatch;
  });
};
