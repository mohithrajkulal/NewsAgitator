import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import { capitalizeFirstLetter, filterArticles, sortArticlesByImage } from '../utils';
import { Loader } from '../components/Loader/Loader';
import {
  CATEGORIES,
  CLEAR_PREFERENCES,
  COPY_RIGHTS,
  MAIN_HEADING,
  PREFERED_CATEGORIES,
  PREFERED_SOURCES,
  SELECT_PREFERENCES,
  SOURCES,
} from '../constants';
import FilterMenu from '../components/FilterMenu/FilterMenu';
import NewsFeed from './../components/Newscard/NewsCard';
import { FaArrowLeft, FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import MainIcon from './../assest/images/headlineHub.svg';
import {
  fetchArticles,
  fetchBBCNews,
  fetchByCategory,
  fetchNYArticles,
} from './../services/newsAPIService';
import { DynamicObject, Preference } from '../types';
import CustomModal from '../components/CustomModal/CustomModal';
import Preferences from '../components/Preferences/Preferences';
import handleStorageCheck from './../services/clearCache';
import styles from './homePage.module.css';

const HomePage = () => {
  const [articles, setArticles] = useState<DynamicObject>([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'home',
    source: 'All Sources',
    dateRange: {
      type: 'alltime',
    },
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openPreferences, setOpenPreferences] = useState(false);
  const initialData = localStorage.getItem('initialData');
  const parsedData = initialData ? JSON.parse(initialData) : [];
  const cachedPreferences = localStorage.getItem('preferences');
  const [preferences, setPreferences] = useState<Preference>({
    category: [],
    source: [],
  });

  useEffect(() => {
    if (cachedPreferences) {
      const parsedPreferences = JSON.parse(cachedPreferences);
      setPreferences(parsedPreferences);
    }
    handleStorageCheck();
  }, []);

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = window.innerWidth <= 768;
  const prevQuery = useRef(query);
  const prevFilters = useRef(filters);

  const updateFilters = (key: any, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const data =
    preferences && Array.isArray(parsedData) ? filterArticles(parsedData, preferences) : [];

  const filterByDate = (articles: any[]) => {
    const { type } = filters.dateRange;
    if (!type) return articles;
    return articles.filter(article => {
      const articleDate = article.publishedAt.split('T')[0];
      return articleDate;
    });
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
    type: keyof Preference
  ) => {
    setPreferences(prevPreferences => {
      const updatedArray = e.target.checked
        ? [...prevPreferences[type], value]
        : prevPreferences[type].filter(item => item !== value);

      return {
        ...prevPreferences,
        [type]: updatedArray,
      };
    });
  };

  const submitPreferences = () => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
    setOpenPreferences(false);
  };

  const clearPreferences = () => {
    setPreferences({
      category: [],
      source: [],
    });
    localStorage.removeItem('preferences');
  };

  const fetchAndSetArticles = async () => {
    setLoading(true);
    try {
      let data = [] as any;
      if (filters.category === 'home') {
        const categoryData = await fetchByCategory(CATEGORIES, query);
        data = data.concat(categoryData || []);

        const nyTimesData = await fetchNYArticles(query, filters.category, filters.source);
        data = data.concat(nyTimesData);

        const bbcNewsData = await fetchBBCNews(query, filters.category, filters.source);
        data = data.concat(bbcNewsData);
      } else {
        const articlesData = await fetchArticles(query, filters.category, filters.source);
        data = data.concat(articlesData);

        const nyTimesData = await fetchNYArticles(query, filters.category, filters.source);
        data = data.concat(nyTimesData);

        const bbcNewsData = await fetchBBCNews(query, filters.category, filters.source);
        data = data.concat(bbcNewsData);
      }
      if (filters.source !== 'All Sources') {
        data = data.filter((item: any) => item.source?.name === filters.source);
      }
      const sortedArticles = sortArticlesByImage(data);
      const storedData = JSON.parse(localStorage.getItem('initialData') as any);
      !storedData && localStorage.setItem('initialData', JSON.stringify(data));
      const filteredArticles = filterByDate(sortedArticles) as any;
      setArticles(filteredArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedArticles = localStorage.getItem('initialData');
    if (
      prevQuery.current !== query ||
      prevFilters.current.category !== filters.category ||
      prevFilters.current.source !== filters.source ||
      prevFilters.current.dateRange.type !== filters.dateRange.type
    ) {
      fetchAndSetArticles();
    } else if (!storedArticles) {
      fetchAndSetArticles();
    } else {
      if (storedArticles) {
        setArticles(JSON.parse(storedArticles));
        setLoading(false);
      }
    }
    prevQuery.current = query;
    prevFilters.current = filters;
  }, [query, filters]);

  return (
    <div className={styles.homePageContainer}>
      <header className={styles.header}>
        {showSearchBar ? (
          <FaArrowLeft
            color='#ccc'
            className={styles.searchIcon}
            onClick={() => {
              setQuery('');
              setShowSearchBar(false);
            }}
          />
        ) : isMobile ? (
          <FaBars
            color='#ccc'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={styles.sidebarIcon}
          />
        ) : (
          <img src={MainIcon} alt='mainIcon' height={48} width={48} className={styles.mainIcon} />
        )}
        {!showSearchBar && <h1 className={styles.mainHeader}>{MAIN_HEADING}</h1>}
        {isMobile && !showSearchBar ? (
          <FaSearch
            color='#ccc'
            className={styles.searchIcon}
            onClick={() => setShowSearchBar(!showSearchBar)}
          />
        ) : (
          <SearchBar onSearch={(value: string) => setQuery(value)} />
        )}
      </header>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <button className={styles.closeButton}>
          <FaTimes
            className={styles.closeButton}
            onClick={() => setIsSidebarOpen(false)}
            role='button'
            aria-label='Clear search'
            color='#ccc'
          />
        </button>
        <nav>
          <ul>
            {CATEGORIES?.map(category => (
              <li
                key={category}
                onClick={() => {
                  setIsSidebarOpen(false);
                  updateFilters('category', category);
                }}
                className={filters?.category === category ? styles.selectedNavIcon : styles.navItem}
              >
                {capitalizeFirstLetter(category)}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <FilterMenu
        filters={{
          categories: CATEGORIES,
          sources: SOURCES,
        }}
        onFilterChange={updateFilters}
        selectedFilter={filters}
        isMobile={isMobile}
        setOpenPreferences={setOpenPreferences}
      />
      <Preferences articles={data || []} />
      {loading ? <Loader /> : <NewsFeed articles={articles} />}
      {
        <CustomModal isOpen={openPreferences}>
          <h2 className={styles.preferencesHeader}>{SELECT_PREFERENCES}</h2>
          <div className={styles.preferencesSection}>
            <p className={styles.preferencesTitle}>{PREFERED_CATEGORIES}</p>
            <div className={styles.preferencesOptions}>
              {CATEGORIES.map(category => {
                if (category !== 'home') {
                  return (
                    <label key={category} className={styles.preferencesLabel}>
                      <input
                        type='checkbox'
                        value={category}
                        className={styles.preferencesCheckbox}
                        checked={preferences?.category?.includes(category)}
                        onChange={e => handleCheckboxChange(e, category, 'category')}
                      />
                      {category}
                    </label>
                  );
                }
              })}
            </div>
          </div>
          <div className={styles.preferencesSection}>
            <p className={styles.preferencesTitle}>{PREFERED_SOURCES}</p>
            <div className={styles.preferencesOptions}>
              {SOURCES.map(source => {
                if (source !== 'All Sources') {
                  return (
                    <label key={source} className={styles.preferencesLabel}>
                      <input
                        type='checkbox'
                        value={source}
                        className={styles.preferencesCheckbox}
                        checked={preferences?.source?.includes(source)}
                        onChange={e => handleCheckboxChange(e, source, 'source')}
                      />
                      {source}
                    </label>
                  );
                }
              })}
            </div>
          </div>
          <div className={styles.modalButtonContainer}>
            <button className={styles.submitBtn} onClick={submitPreferences}>
              Submit
            </button>
            <button className={styles.clearBtn} onClick={clearPreferences}>
              Clear
            </button>
            <button
              className={styles.closeBtn}
              onClick={() => {
                if (cachedPreferences) {
                  const parsedPreferences = JSON.parse(cachedPreferences);
                  setPreferences(parsedPreferences);
                } else {
                  setPreferences({
                    category: [],
                    source: [],
                  });
                }
                setOpenPreferences(false);
              }}
            >
              Close
            </button>
          </div>
          <p className={styles.clearIndication}>{CLEAR_PREFERENCES}</p>
        </CustomModal>
      }
      <footer className={styles.footer}>
        <p className={styles.copyRights}>{COPY_RIGHTS}</p>
      </footer>
    </div>
  );
};

export default HomePage;
