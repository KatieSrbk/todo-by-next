import styles from './styles.module.scss';

const TodosItems = ({ todos }) => {
  return (
    <div className={styles.todoList}>
      {todos.map((item, index) => {
        return (
          <div key={index} className={styles.todoItem}>
            <div className={styles.todoWrapper}>
              <input className={styles.todoCheckbox} type='checkbox' />
              <span className={styles.todoText}>{item.text}</span>
            </div>
            <button className={styles.deleteButton}>Удалить</button>
          </div>
        );
      })}
    </div>
  );
};

export default TodosItems;
