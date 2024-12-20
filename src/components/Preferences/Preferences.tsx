import React, { useState } from 'react';
import noImage from './../../assest/images/noImage.svg';
import { NO_PREFERENCES } from '../../constants';
import { DynamicObject } from '../../types';
import styles from './preferences.module.css';

interface NewsCard {
  articles: DynamicObject;
}

const Preferences = ({ articles }: NewsCard) => {
  return (
    <div className={styles.preferences}>
      <p className={styles.preferenceHeader}>Your Preferences</p>
      <div className={styles.newsCard}>
        {articles.length > 0 ? (
          articles.map((article: any, index: number) => (
            <div className={styles.articleCard}>
              <a
                href={article.url}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.linkTag}
              >
                <h6 className={styles.articleTitle}>{article.title}</h6>
              </a>
              {article.urlToImage ? (
                <a href={article.url} target='_blank' rel='noopener noreferrer'>
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className={styles.articleImage}
                  />
                </a>
              ) : (
                <img src={noImage} alt='noImage' className={styles.articleImage} />
              )}
            </div>
          ))
        ) : (
          <p className={styles.noArticle}>{NO_PREFERENCES}</p>
        )}
      </div>
    </div>
  );
};

export default Preferences;
