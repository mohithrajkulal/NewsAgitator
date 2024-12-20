import axios from 'axios';
import Parser from 'rss-parser/dist/rss-parser.min.js';
import { categoryKeywords } from './../constants';
import { capitalizeFirstLetter } from './../utils';
const parser = new Parser();

export const fetchArticles = async (query, category, source) => {
  try {
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    const baseUrl = process.env.REACT_APP_NEWS_BASE_URL;
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (source) params.append('sources', source);
    params.append('apiKey', apiKey);
    const url = `${baseUrl}/top-headlines?${params.toString()}`;
    const response = await axios.get(url);
    const filteredData = response.data.articles?.filter(item => item?.urlToImage && item.title !== '[Removed]');
    return filteredData;
  } catch (error) {
    // added this to check if the limit has exceeded
    console.log('Error fetching articles by categories:', error);
    return [];
  }
};

export const fetchByCategory = async categories => {
  try {
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    const baseUrl = process.env.REACT_APP_NEWS_BASE_URL;
    const promises = categories.map(category =>
      axios.get(`${baseUrl}/top-headlines?category=${category}&apiKey=${apiKey}`).then(response =>
        response.data.articles.map(article => ({
          ...article,
          category,
        }))
      )
    );
    const results = await Promise.all(promises);
    const allArticles = results.flat();
    const filteredData = allArticles?.filter(item => item?.urlToImage && item.title !== '[Removed]');
    return filteredData;
  } catch (error) {
    // added this to check if the limit has exceeded
    console.log('Error fetching articles by categories:', error);
    return [];
  }
};

export const fetchNYArticles = async (query, category, source) => {
  try {
    const apiKey = process.env.REACT_APP_NEWYORK_TIMES_API_KEY;
    const response = await axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
      params: {
        'api-key': apiKey,
        ...(category !== 'home' && { fq: `section_name:"${capitalizeFirstLetter(category)}"` }),
      },
    });

    const filteredLists = response.data.response.docs?.filter(item => {
      const title = item?.headline.main?.toLowerCase() || '';
      const description = item?.snippet?.toLowerCase() || '';
      const author = item?.byline?.original?.toLowerCase() || '';
      const queryLower = query.toLowerCase();
      return title.includes(queryLower) || description.includes(queryLower) || author?.includes(queryLower);
    });
    const filteredDocs = filteredLists.map(item => ({
      ...item,
      urlToImage: item?.multimedia?.[0]?.url
        ? `https://www.nytimes.com/${item?.multimedia?.[0]?.url}`
        : null,
      title: item?.headline.main,
      source: {
        id: '',
        name: item?.source || 'The New York Times',
      },
      author: item.byline?.original,
      url: item?.web_url,
      description: item?.snippet || item?.abstract,
      publishedAt: item?.pub_date,
    }));
    return filteredDocs;
  } catch (error) {
    // added this to check if the limit has exceeded
    console.log('Error fetching articles:', error);
    return [];
  }
};

export const fetchBBCNews = async (query, category, source) => {
  const proxy = 'https://thingproxy.freeboard.io/fetch/';
  const url = 'http://feeds.bbci.co.uk/news/rss.xml';

  try {
    const response = await axios.get(proxy + url);
    const mediaThumbnailRegex = /<media:thumbnail[^>]*url="([^"]+)"/g;
    const thumbnails = [];
    let match;
    while ((match = mediaThumbnailRegex.exec(response.data)) !== null) {
      thumbnails.push(match[1]);
    }
    const feed = await parser.parseString(response.data);
    const filteredItems = feed?.items?.filter(item => {
      const title = item.title?.toLowerCase() || '';
      const description = (item?.content || item?.contentSnippet)?.toLowerCase() || '';
      const queryLower = query?.toLowerCase();
      const link = item?.link?.toLowerCase();
      const author = item?.author?.toLowerCase();
      const categoryMatch =
        category && category !== 'home'
          ? categoryKeywords[category?.toLowerCase()]?.some(
              keyword =>
                title.includes(keyword?.toLowerCase()) ||
                description.includes(keyword?.toLowerCase()) ||
                link.includes(keyword?.toLowerCase())
            )
          : true;
      return (title.includes(queryLower) || description.includes(queryLower) || author.includes(queryLower)) && categoryMatch;
    });
    filteredItems.forEach((item, index) => {
      item.urlToImage = thumbnails[index] || null;
      item.publishedAt = item?.isoDate || '';
      item.url = item?.link || '';
      item.source = {
        id: 'bbc-news',
        name: 'BBC News',
      };
      item.description = item?.content || item?.contentSnippet;
    });

    return filteredItems;
  } catch (error) {
    // added this to check if the limit has exceeded
    console.log('Error fetching or parsing the RSS feed:', error);
    return [];
  }
};
