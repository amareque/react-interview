import type { TodoList, Todo } from '../types/todo'

const API_BASE_URL = 'http://localhost:3000/api'

export const todoApi = {
  async getAllTodoLists(): Promise<TodoList[]> {
    const response = await fetch(`${API_BASE_URL}/todolists`)
    if (!response.ok) {
      throw new Error('Failed to fetch todo lists')
    }
    return response.json()
  },

  async getTodoList(id: number): Promise<TodoList> {
    const response = await fetch(`${API_BASE_URL}/todolists/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch todo list')
    }
    return response.json()
  },

  async createTodoList(name: string): Promise<TodoList> {
    const response = await fetch(`${API_BASE_URL}/todolists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
    if (!response.ok) {
      throw new Error('Failed to create todo list')
    }
    return response.json()
  },

  async updateTodoList(id: number, name: string): Promise<TodoList> {
    const response = await fetch(`${API_BASE_URL}/todolists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
    if (!response.ok) {
      throw new Error('Failed to update todo list')
    }
    return response.json()
  },

  async deleteTodoList(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todolists/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete todo list')
    }
  },

  async createTodo(todoListId: number, title: string): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todoListId, title }),
    })
    if (!response.ok) {
      throw new Error('Failed to create todo')
    }
    return response.json()
  },

  async updateTodo(id: number, updates: { title?: string; completed?: boolean }): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      throw new Error('Failed to update todo')
    }
    return response.json()
  },

  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete todo')
    }
  },

  async completeAllTodos(todoListId: number): Promise<TodoList> {
    const response = await fetch(`${API_BASE_URL}/todolists/${todoListId}/complete-all`, {
      method: 'PATCH',
    })
    if (!response.ok) {
      throw new Error('Failed to complete all todos')
    }
    return response.json()
  },
}

