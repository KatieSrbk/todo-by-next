'use client';

import { useState } from 'react';
import styles from './styles.module.scss';

const AddSection = ({ addTodo }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    addTodo(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className={styles.addSection}>
      <input
        className={styles.addInput}
        type='text'
        placeholder='Напиши задачу'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.addButton} onClick={handleAdd}>
        Добавить
      </button>
    </div>
  );
};

export default AddSection;
