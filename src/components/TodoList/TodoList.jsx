'use client';

import { useState } from 'react';
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
  const [todos, setTodos] = useState(TODOS_MOCK);

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

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Список дел</h1>
      <AddSection addTodo={addTodo} />
      <FilterGroup />
      <TodosItems todos={todos} deleteTodo={deleteTodo} />
    </div>
  );
};

export default TodoList;
