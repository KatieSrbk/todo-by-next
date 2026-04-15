import classNames from 'classnames';
import styles from './styles.module.scss';

const FilterGroup = () => {
  return (
    <div className={styles.controlsPanel}>
      <div className={styles.sortGroup}>
        <span className={styles.controlsLabel}>Сортировка:</span>
        <button className={classNames(styles.sortButton, styles.active)}>
          Новые ↑
        </button>
        <button className={styles.sortButton}>Старые ↓</button>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.controlsLabel}>Фильтрация:</span>
        <select className={styles.filterSelect}>
          <option value='all'>Все задачи</option>
          <option value='active'>Активные</option>
          <option value='completed'>Выполненные</option>
        </select>
      </div>
    </div>
  );
};

export default FilterGroup;
