import styles from './styles.module.scss';

const arrayOfTodos = [
  'Пример задачи 1',
  'Пример задачи 2',
  'Пример задачи 3',
  'Пример задачи 4',
];

const TodosItems = () => {
  return (
    <div className={styles.todoList}>
      {arrayOfTodos.map((item, index) => {
        return (
          <div key={index} className={styles.todoItem}>
            <div className={styles.todoWrapper}>
              <input className={styles.todoCheckbox} type='checkbox' />
              <span className={styles.todoText}>{item}</span>
            </div>
            <button className={styles.deleteButton}>Удалить</button>
          </div>
        );
      })}
    </div>
  );
};

export default TodosItems;
