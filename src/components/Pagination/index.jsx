import React from 'react';
import styles from './styles.module.scss';

const Pagination = ({
  currentPage,
  pagesCount,
  onPageChange,
  allTodosCount,
  maxPagesToShow, // максимальное количество видимых номеров страниц
}) => {
  // Если всего одна страница или нет элементов, не показываем пагинацию
  if (pagesCount <= 1 || allTodosCount === 0) {
    return null;
  }

  // Функция для генерации номеров страниц с многоточием
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (pagesCount <= maxPagesToShow) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= pagesCount; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(pagesCount - 1, currentPage + 1);

      // Добавляем многоточие после первой страницы если нужно
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Добавляем страницы вокруг текущей
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Добавляем многоточие перед последней страницей если нужно
      if (endPage < pagesCount - 1) {
        pageNumbers.push('...');
      }

      // Всегда показываем последнюю страницу
      if (pagesCount > 1) {
        pageNumbers.push(pagesCount);
      }
    }

    return pageNumbers;
  };

  const goToNextPage = () => {
    if (currentPage < pagesCount) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (typeof pageNumber === 'number') {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pagination}>
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          ← Назад
        </button>

        <div className={styles.pageNumbers}>
          {getPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => goToPage(pageNumber)}
              className={`${styles.pageButton} ${
                currentPage === pageNumber ? styles.activePage : ''
              } ${typeof pageNumber !== 'number' ? styles.dots : ''}`}
              disabled={typeof pageNumber !== 'number'}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage === pagesCount}
          className={styles.paginationButton}
        >
          Вперёд →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
