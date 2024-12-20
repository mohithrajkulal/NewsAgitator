import React, { useState } from 'react';
import ArticleCard from '../ArticleCard/ArticleCard';
import { NEXT, NO_NEWS, PREVIOUS } from '../../constants';
import { DynamicObject } from '../../types';
import styles from './newsCard.module.css';

interface NewsCard {
  articles: DynamicObject;
}

const NewsCard = ({ articles }: NewsCard) => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastArticle = currentPage * itemsPerPage;
  const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <div className={styles.newsCard}>
        {currentArticles.length > 0 ? (
          currentArticles.map((article: any, index: number) => (
            <ArticleCard key={index} article={article} />
          ))
        ) : (
          <p className={styles.noArticle}>{NO_NEWS}</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButtons}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {PREVIOUS}
          </button>
          <span className={styles.paginationNumbers}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.paginationButtons}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {NEXT}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsCard;
