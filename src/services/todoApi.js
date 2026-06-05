const BASE_URL = 'http://localhost:5000';

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

// Удаление одной задачи
export const deleteTodo = async (uuid) => {
  try {
    const response = await fetch(`${BASE_URL}/task/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Ошибка удаления задачи');
    }
  } catch (error) {
    console.error('deleteTodo error:', error);
    throw error;
  }
};

// Удаление всех задач
export const deleteAllTodos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Ошибка удаления всех задач');
    }
  } catch (error) {
    console.error('deleteAllTodos error:', error);
    throw error;
  }
};

export const updateTodo = async (uuid, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/task/${uuid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Ошибка обновления задачи');
    }

    return await response.json();
  } catch (error) {
    console.error('updateTodo error:', error);
    throw error;
  }
};
