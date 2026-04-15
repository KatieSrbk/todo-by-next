import AddSection from '../AddSection';
import FilterGroup from '../FilterGroup';
import TodosItems from '../TodosItems';
import styles from './styles.module.scss';

const TodoList = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Список дел</h1>
      <AddSection />
      <FilterGroup />
      <TodosItems />
    </div>
  );
};

export default TodoList;
