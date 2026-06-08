import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

const TodosItems = ({
  todos,
  handleDeleteTodo,
  handleEditTodo,
  toggleComplete,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);

  const startEditing = (todo) => {
    setEditingId(todo.uuid);
    setEditText(todo.text);
  };

  const saveEdit = (uuid) => {
    if (editText.trim()) {
      handleEditTodo(uuid, editText);
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyDown = (e, uuid) => {
    if (e.key === 'Enter') {
      saveEdit(uuid);
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
        const itemId = item.uuid;
        const isEditing = editingId === item.uuid;
        return (
          <div key={itemId} className={styles.todoItem}>
            {isEditing ? (
              <div className={styles.editWrapper}>
                <input
                  ref={inputRef}
                  type='text'
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, item.uuid)}
                  className={styles.editInput}
                />
                <div className={styles.editButtons}>
                  <button
                    className={styles.saveButton}
                    onClick={() => saveEdit(item.uuid)}
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
                  <input
                    className={styles.todoCheckbox}
                    type='checkbox'
                    checked={item.isChecked}
                    onChange={() => toggleComplete(itemId, item.isChecked)}
                  />
                  <span
                    className={classNames(styles.todoText, {
                      [styles.completed]: item.isChecked,
                    })}
                  >
                    {item.text}
                  </span>
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
                    onClick={() => handleDeleteTodo(itemId)}
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
