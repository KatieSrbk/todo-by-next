import classNames from 'classnames';
import styles from './styles.module.scss';

const FilterGroup = ({ sortType, setSortType, filterType, setFilterType }) => {
  return (
    <div className={styles.controlsPanel}>
      <div className={styles.sortGroup}>
        <span className={styles.controlsLabel}>Сортировка:</span>
        <button
          className={classNames(styles.sortButton, {
            [styles.active]: sortType === 'new',
          })}
          onClick={() => setSortType('new')}
        >
          Новые ↑
        </button>
        <button
          className={classNames(styles.sortButton, {
            [styles.active]: sortType === 'old',
          })}
          onClick={() => setSortType('old')}
        >
          Старые ↓
        </button>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.controlsLabel}>Фильтрация:</span>
        <select
          className={styles.filterSelect}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value='all'>Все задачи</option>
          <option value='active'>Активные</option>
          <option value='completed'>Выполненные</option>
        </select>
      </div>
    </div>
  );
};

export default FilterGroup;
