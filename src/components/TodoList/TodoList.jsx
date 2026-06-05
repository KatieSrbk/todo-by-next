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
  const [processedTodos, setProcessedTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Загрузка задач с сервера
  const handleGetTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data.rows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  // Удаление задачи
  const handleDeleteTodo = async (uuid) => {
    try {
      await deleteTodo(uuid);
      setTodos((prev) => prev.filter((todo) => todo.uuid !== uuid));
    } catch (err) {
      console.error(err);
    }
  };

  // Редактирование задачи
  const handleEditTodo = async (uuid, newText) => {
    if (!newText.trim()) return;

    try {
      await updateTodo(uuid, { text: newText.trim() });
      setTodos((prev) =>
        prev.map((todo) =>
          todo.uuid === uuid ? { ...todo, text: newText.trim() } : todo
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = (uuid) => {
    const updatedTodos = todos.map((todo) =>
      todo.uuid === uuid ? { ...todo, isChecked: !todo.isChecked } : todo
    );
    setTodos(updatedTodos);
  };

  const handleDeleteAllTodos = async () => {
    if (todos.length === 0) return;

    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить ВСЕ задачи? Это действие нельзя отменить.'
    );
    if (!confirmed) return;

    try {
      await deleteAllTodos();
      setTodos([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleGetTodos();
  }, []);

  useEffect(() => {
    let processed = todos.filter((todo) => {
      if (filterType === 'active') return !todo.isChecked;
      if (filterType === 'completed') return todo.isChecked;
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

  useEffect(() => {
    setCurrentPage(1);
  }, [sortType, filterType]);

  // Получаем текущие задачи для отображения
  const indexOfLastTodo = currentPage * TODOS_PER_PAGE;
  const indexOfFirstTodo = indexOfLastTodo - TODOS_PER_PAGE;
  const currentTodos = processedTodos.slice(indexOfFirstTodo, indexOfLastTodo);
  const pagesCount = Math.ceil(processedTodos.length / TODOS_PER_PAGE);

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

      {loading && <p>Загрузка...</p>}
      <TodosItems
        todos={currentTodos}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodo={handleEditTodo}
        toggleComplete={toggleComplete}
      />

      <Pagination
        currentPage={currentPage}
        pagesCount={pagesCount}
        onPageChange={setCurrentPage}
        allTodosCount={processedTodos.length}
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
