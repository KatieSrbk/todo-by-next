'use client';

import { useEffect, useState } from 'react';
import AddSection from '../AddSection';
import FilterGroup from '../FilterGroup';
import TodosItems from '../TodosItems';
import Pagination from '../Pagination';
import styles from './styles.module.scss';

const TODOS_PER_PAGE = 5;

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
  const [currentPage, setCurrentPage] = useState(1);

  const addTodo = (text) => {
    if (text.trim()) {
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      setTodos([...todos, newTodo]);
      setCurrentPage(1);
    }
  };

  const deleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
    const newPagesCount = Math.ceil(filteredTodos.length / TODOS_PER_PAGE);

    if (currentPage > newPagesCount && newPagesCount > 0) {
      setCurrentPage(newPagesCount);
    } else if (newPagesCount === 0) {
      setCurrentPage(1);
    }
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
      setCurrentPage(1);
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
      <AddSection addTodo={addTodo} />
      <FilterGroup
        sortType={sortType}
        setSortType={setSortType}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <TodosItems
        todos={currentTodos}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
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
