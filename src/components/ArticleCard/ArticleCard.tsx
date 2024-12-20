import React from 'react';
import moment from 'moment';
import noImage from './../../assest/images/noImage.svg';
import styles from './articleCard.module.css';
import { getAuthor } from '../../utils';
import { BY, PUBLISHED_AT, READ_MORE, SOURCE } from '../../constants';

const ArticleCard = ({ article }: any) => {
  return (
    <div className={styles.articleCard}>
      <h3 className={styles.articleTitle}>{article.title}</h3>
      {article.urlToImage ? (
        <img src={article.urlToImage} alt={article.title} className={styles.articleImage} />
      ) : (
        <img src={noImage} alt='noImage' className={styles.articleImage} />
      )}
      <p className={styles.articleDescription}>{article.description}</p>
      <div className={styles.source}>
        <div className={styles.articleInfo}>
          <p className={styles.articleSource}>
            {SOURCE}
            {article?.source?.name}
          </p>
          <p className={styles.articleDate}>
            {PUBLISHED_AT}
            {moment(article?.publishedAt).format('MMM D, YYYY')}
          </p>
          <p className={styles.articleDate}>
            {BY}
            {getAuthor(article?.author)}
          </p>
        </div>
        <a href={article.url} target='_blank' rel='noopener noreferrer' className={styles.readMore}>
          {READ_MORE}
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
