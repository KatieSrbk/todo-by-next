'use client';

import { useEffect, useState } from 'react';
import AddSection from '../AddSection';
import FilterGroup from '../FilterGroup';
import TodosItems from '../TodosItems';
import Pagination from '../Pagination';
import styles from './styles.module.scss';
import {
  getTodos,
  addTodo,
  deleteTodo,
  deleteAllTodos,
  updateTodo,
} from '@/services/todoApi';

const TODOS_PER_PAGE = 5;

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [sortType, setSortType] = useState('new');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Загрузка задач с сервера (с фильтрацией и сортировкой)
  const handleGetTodos = async () => {
    try {
      const data = await getTodos(filterType, sortType);
      setTodos(data.rows);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTodo = async (text) => {
    if (!text.trim()) return;

    try {
      await addTodo(text);
      await handleGetTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (uuid) => {
    try {
      await deleteTodo(uuid);
      await handleGetTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTodo = async (uuid, newText) => {
    if (!newText.trim()) return;

    try {
      await updateTodo(uuid, { text: newText.trim() });
      await handleGetTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async (uuid, currentStatus) => {
    try {
      await updateTodo(uuid, { isChecked: !currentStatus });
      await handleGetTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAllTodos = async () => {
    if (todos.length === 0) return;

    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить ВСЕ задачи? Это действие нельзя отменить.'
    );
    if (!confirmed) return;

    try {
      await deleteAllTodos();
      await handleGetTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // Загружаем задачи при монтировании и при изменении фильтров/сортировки
  useEffect(() => {
    handleGetTodos();
  }, [filterType, sortType]);

  // Пагинация (теперь todos уже отфильтрованы и отсортированы на бэке)
  const indexOfLastTodo = currentPage * TODOS_PER_PAGE;
  const indexOfFirstTodo = indexOfLastTodo - TODOS_PER_PAGE;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
  const pagesCount = Math.ceil(todos.length / TODOS_PER_PAGE);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Список дел</h1>
      <AddSection handleAddTodo={handleAddTodo} />
      <FilterGroup
        sortType={sortType}
        setSortType={setSortType}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      <TodosItems
        todos={currentTodos}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodo={handleEditTodo}
        toggleComplete={handleToggleComplete}
      />

      <Pagination
        currentPage={currentPage}
        pagesCount={pagesCount}
        onPageChange={setCurrentPage}
        allTodosCount={todos.length}
        maxPagesToShow={5}
      />

      <div className={styles.deleteAllWrapper}>
        <button
          className={styles.deleteAllButton}
          onClick={handleDeleteAllTodos}
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
