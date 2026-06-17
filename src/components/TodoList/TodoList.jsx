'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { logout, checkAuth } from '@/services/authApi';

const TODOS_PER_PAGE = 5;

const TodoList = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [sortType, setSortType] = useState('new');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);
  const [totalTodosCount, setTotalTodosCount] = useState(0);

  // Проверка авторизации
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userData = await checkAuth();
        if (!userData) {
          router.push('/login');
        } else {
          setUser(userData.user);
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Загрузка задач с сервера (с фильтрацией, сортировкой и пагинацией)
  const handleGetTodos = async (page = currentPage) => {
    try {
      const data = await getTodos(filterType, sortType, page, TODOS_PER_PAGE);
      setTodos(data.rows);
      setTotalTodosCount(data.totalTasksCount);

      const pagesCount = Math.ceil(data.totalTasksCount / TODOS_PER_PAGE);
      setPagesCount(pagesCount);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTodo = async (text) => {
    if (!text.trim()) return;

    try {
      await addTodo(text);
      setCurrentPage(1);
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

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Список дел</h1>
        <div className={styles.userInfo}>
          <span>Привет, {user?.email}!</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className={styles.logoutIcon}>🚪</span>
            Выйти
          </button>
        </div>
      </div>

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
