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
  const [pagesCount, setPagesCount] = useState(1);
  const [totalTodosCount, setTotalTodosCount] = useState(0);

  // Загрузка задач с сервера (с фильтрацией, сортировкой и пагинацией)
  const handleGetTodos = async (page = currentPage) => {
    try {
      const data = await getTodos(filterType, sortType, page, TODOS_PER_PAGE);
      console.log('data:::', data);
      setTodos(data.rows);
      setCurrentPage(data.pagination.currentPage);
      setPagesCount(data.pagination.pagesCount);
      setTotalTodosCount(data.pagination.totalCount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTodo = async (text) => {
    if (!text.trim()) return;

    try {
      await addTodo(text);
      await handleGetTodos(1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (uuid) => {
    try {
      await deleteTodo(uuid);
      // Проверяем, нужно ли перейти на предыдущую страницу
      if (todos.length === 1 && currentPage > 1) {
        await handleGetTodos(currentPage - 1);
      } else {
        await handleGetTodos(currentPage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTodo = async (uuid, newText) => {
    if (!newText.trim()) return;

    try {
      await updateTodo(uuid, { text: newText.trim() });
      await handleGetTodos(currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async (uuid, currentStatus) => {
    try {
      await updateTodo(uuid, { isChecked: !currentStatus });
      await handleGetTodos(currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAllTodos = async () => {
    if (totalTodosCount === 0) return;

    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить ВСЕ задачи? Это действие нельзя отменить.'
    );
    if (!confirmed) return;

    try {
      await deleteAllTodos();
      await handleGetTodos(1);
    } catch (err) {
      console.error(err);
    }
  };

  // Загружаем задачи при изменении фильтров, сортировки или страницы
  useEffect(() => {
    handleGetTodos(currentPage);
  }, [filterType, sortType, currentPage]);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

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
        todos={todos}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodo={handleEditTodo}
        toggleComplete={handleToggleComplete}
      />

      <Pagination
        currentPage={currentPage}
        pagesCount={pagesCount}
        onPageChange={handleChangePage}
        allTodosCount={totalTodosCount}
        maxPagesToShow={5}
      />

      <div className={styles.deleteAllWrapper}>
        <button
          className={styles.deleteAllButton}
          onClick={handleDeleteAllTodos}
          disabled={totalTodosCount === 0}
        >
          🗑️ Удалить всё
        </button>
        {totalTodosCount > 0 && (
          <span className={styles.taskCount}>({totalTodosCount} задач)</span>
        )}
      </div>
    </div>
  );
};

export default TodoList;
