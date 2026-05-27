const BASE_URL = 'https://back-todo-zf3r.onrender.com';

// Получение всех задач
export const getTodos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки задач');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('getTodos error:', error);
    throw error;
  }
};

// Добавление задачи
export const addTodo = async (text) => {
  try {
    const response = await fetch(`${BASE_URL}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, isChecked: false }),
    });

    if (!response.ok) {
      throw new Error('Ошибка добавления задачи');
    }

    return await response.json();
  } catch (error) {
    console.error('addTodo error:', error);
    throw error;
  }
};
