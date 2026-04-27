import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

const TodosItems = ({ todos, deleteTodo, editTodo }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      editTodo(id, editText);
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  return (
    <div className={styles.todoList}>
      {todos.map((item) => {
        const isEditing = editingId === item.id;
        return (
          <div key={item.id} className={styles.todoItem}>
            {isEditing ? (
              <div className={styles.editWrapper}>
                <input
                  ref={inputRef}
                  type='text'
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={styles.editInput}
                />
                <div className={styles.editButtons}>
                  <button
                    className={styles.saveButton}
                    onClick={() => saveEdit(item.id)}
                  >
                    💾 Сохранить
                  </button>
                  <button className={styles.cancelButton} onClick={cancelEdit}>
                    ✖ Отмена
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.todoWrapper}>
                  <input className={styles.todoCheckbox} type='checkbox' />
                  <span className={styles.todoText}>{item.text}</span>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.editButton}
                    onClick={() => startEditing(item)}
                  >
                    Редактировать
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteTodo(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TodosItems;
