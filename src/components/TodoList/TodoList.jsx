'use client';

import { useEffect, useState } from 'react';
import AddSection from '../AddSection';
import FilterGroup from '../FilterGroup';
import TodosItems from '../TodosItems';
import styles from './styles.module.scss';

const TODOS_MOCK = [
  { id: 1, text: 'Пример задачи 1', completed: false, createdAt: Date.now() },
  {
    id: 2,
    text: 'Пример задачи 2',
    completed: false,
    createdAt: Date.now() + 1000,
  },
  {
    id: 3,
    text: 'Пример задачи 3',
    completed: true,
    createdAt: Date.now() + 2000,
  },
  {
    id: 4,
    text: 'Пример задачи 4',
    completed: false,
    createdAt: Date.now() + 3000,
  },
];

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [];
  });
  const [sortType, setSortType] = useState('new');
  const [filterType, setFilterType] = useState('all');
  const [processedTodos, setProcessedTodos] = useState([]);

  const addTodo = (text) => {
    if (text.trim()) {
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      setTodos([...todos, newTodo]);
    }
  };

  const deleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  const editTodo = (id, newText) => {
    if (newText.trim()) {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      );
      setTodos(updatedTodos);
    }
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteAllTodos = () => {
    if (todos.length === 0) return;

    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить ВСЕ задачи? Это действие нельзя отменить.'
    );
    if (confirmed) {
      setTodos([]);
    }
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    let processed = todos.filter((todo) => {
      if (filterType === 'active') return !todo.completed;
      if (filterType === 'completed') return todo.completed;
      return true;
    });

    processed.sort((a, b) => {
      if (sortType === 'new') {
        return b.createdAt - a.createdAt;
      } else {
        return a.createdAt - b.createdAt;
      }
    });

    setProcessedTodos(processed);
  }, [todos, sortType, filterType]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Список дел</h1>
      <AddSection addTodo={addTodo} />
      <FilterGroup
        sortType={sortType}
        setSortType={setSortType}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      <TodosItems
        todos={processedTodos}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
        toggleComplete={toggleComplete}
      />
      <div className={styles.deleteAllWrapper}>
        <button
          className={styles.deleteAllButton}
          onClick={deleteAllTodos}
          disabled={todos.length === 0}
        >
          🗑️ Удалить всё
        </button>
        {todos.length > 0 && (
          <span className={styles.taskCount}>({todos.length} задач)</span>
        )}
      </div>
    </div>
  );
};

export default TodoList;
