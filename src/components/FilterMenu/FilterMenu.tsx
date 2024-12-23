import React, { useState } from 'react';
import { capitalizeFirstLetter } from '../../utils';
import { MdSettings } from 'react-icons/md';
import { DATES, SOURCE } from '../../constants';
import styles from './filterMenu.module.css';

interface SelectedFilter {
  category: string;
  source: string;
  dateRange: {
    type: string;
  };
}

interface FilterMenu {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  selectedFilter: SelectedFilter;
  isMobile: boolean;
  setOpenPreferences: (preference: boolean) => void;
}

const FilterMenu = ({
  filters,
  onFilterChange,
  selectedFilter,
  isMobile,
  setOpenPreferences,
}: FilterMenu) => {
  const [selectedDateRange, setSelectedDateRange] = useState('alltime');
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange(key, value);
  };

  const handleDateRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedDateRange(value);
    onFilterChange('dateRange', calculateDateRange(value));
  };

  const calculateDateRange = (rangeType: string) => {
    const today = new Date();
    let startDate = '';
    let endDate = '';

    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
      ).padStart(2, '0')}`;

    switch (rangeType) {
      case 'today':
        startDate = endDate = formatDate(today);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        startDate = endDate = formatDate(yesterday);
        break;
      case 'last7days':
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 6);
        startDate = formatDate(last7Days);
        endDate = formatDate(today);
        break;
      case 'lastweek':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        startDate = formatDate(lastWeekStart);
        endDate = formatDate(lastWeekEnd);
        break;
      case 'thismonth':
        startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        endDate = formatDate(today);
        break;
      case 'lastmonth':
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = formatDate(firstDayLastMonth);
        endDate = formatDate(lastDayLastMonth);
        break;
      case 'alltime':
        startDate = '';
        endDate = '';
        break;
      default:
        break;
    }

    return { startDate, endDate, type: rangeType };
  };

  return (
    <div className={styles.filterMenu}>
      {!isMobile && (
        <div className={styles.navItems}>
          {filters.categories.map((category: string) => (
            <button
              key={category}
              onClick={() => handleFilterChange('category', category)}
              className={
                selectedFilter?.category === category ? styles.selectedNavIcon : styles.navItem
              }
            >
              {capitalizeFirstLetter(category)}
            </button>
          ))}
        </div>
      )}
      <div className={styles.dropdownFilters}>
        <div className={styles.source}>
          {!isMobile && <p className={styles.sourceFilter}>{SOURCE}</p>}
          <select
            onChange={e => handleFilterChange('source', e.target.value)}
            value={selectedFilter?.source || ''}
            className={styles.selector}
          >
            {filters.sources.map((source: string) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <select
          className={styles.dateFilter}
          value={selectedDateRange}
          onChange={handleDateRangeChange}
        >
          {DATES?.map(item => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
        <MdSettings
          className={styles.settings}
          size={28}
          color='#ff6200'
          onClick={() => setOpenPreferences(true)}
        />
      </div>
    </div>
  );
};

export default FilterMenu;
