import { create } from 'zustand'
import type { TodoList, Todo } from '../types/todo'
import { todoApi } from '../services/api'

interface TodoStore {
  todoLists: TodoList[]
  loading: boolean
  error: string | null
  fetchTodoLists: () => Promise<void>
  createTodoList: (name: string) => Promise<void>
  addTodo: (todoListId: number, title: string) => Promise<void>
  toggleTodo: (todoId: number, completed: boolean) => Promise<void>
  deleteTodo: (todoId: number) => Promise<void>
  completeAllTodos: (todoListId: number) => Promise<void>
  deleteTodoList: (todoListId: number) => Promise<void>
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todoLists: [],
  loading: false,
  error: null,
  fetchTodoLists: async () => {
    set({ loading: true, error: null })
    try {
      const todoLists = await todoApi.getAllTodoLists()
      set({ todoLists, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch todo lists',
        loading: false 
      })
    }
  },
  createTodoList: async (name: string) => {
    if (!name.trim()) return
    
    try {
      const newTodoList = await todoApi.createTodoList(name.trim())
      
      // Add to local state
      set((state) => ({
        todoLists: [...state.todoLists, newTodoList],
      }))
    } catch (error) {
      console.error('Failed to create todo list:', error)
    }
  },
  addTodo: async (todoListId: number, title: string) => {
    if (!title.trim()) return
    
    try {
      const newTodo = await todoApi.createTodo(todoListId, title.trim())
      
      // Update the local state
      set((state) => ({
        todoLists: state.todoLists.map((list) =>
          list.id === todoListId
            ? { ...list, todos: [...list.todos, newTodo] }
            : list
        ),
      }))
    } catch (error) {
      console.error('Failed to create todo:', error)
      // Optionally set error state here if needed
    }
  },
  toggleTodo: async (todoId: number, completed: boolean) => {
    // Find the existing todo to preserve its properties
    const state = get()
    const existingTodo = state.todoLists
      .flatMap(list => list.todos)
      .find(todo => todo.id === todoId)
    
    if (!existingTodo) {
      console.error('Todo not found:', todoId)
      return
    }

    // Optimistic update
    set((state) => ({
      todoLists: state.todoLists.map((list) => ({
        ...list,
        todos: list.todos.map((todo) =>
          todo.id === todoId 
            ? { ...todo, completed } // Optimistic update
            : todo
        ),
      })),
    }))

    try {
      const updatedTodo = await todoApi.updateTodo(todoId, { completed })
      
      // Update with server response, ensuring we preserve all properties
      set((state) => ({
        todoLists: state.todoLists.map((list) => ({
          ...list,
          todos: list.todos.map((todo) =>
            todo.id === todoId 
              ? { 
                  id: updatedTodo.id,
                  title: updatedTodo.title || existingTodo.title, // Fallback to existing title
                  completed: updatedTodo.completed 
                }
              : todo
          ),
        })),
      }))
    } catch (error) {
      console.error('Failed to toggle todo:', error)
      // Revert on error
      set((state) => ({
        todoLists: state.todoLists.map((list) => ({
          ...list,
          todos: list.todos.map((todo) =>
            todo.id === todoId 
              ? { ...existingTodo } // Revert to original
              : todo
          ),
        })),
      }))
    }
  },
  deleteTodo: async (todoId: number) => {
    // Optimistic update - remove from UI immediately
    set((state) => ({
      todoLists: state.todoLists.map((list) => ({
        ...list,
        todos: list.todos.filter((todo) => todo.id !== todoId),
      })),
    }))

    try {
      await todoApi.deleteTodo(todoId)
      // Success - the optimistic update already removed it
    } catch (error) {
      console.error('Failed to delete todo:', error)
      // On error, refetch to restore correct state
      const state = get()
      state.fetchTodoLists()
    }
  },
  completeAllTodos: async (todoListId: number) => {
    try {
      const updatedTodoList = await todoApi.completeAllTodos(todoListId)
      
      // Update the local state with the updated todo list
      set((state) => ({
        todoLists: state.todoLists.map((list) =>
          list.id === todoListId ? updatedTodoList : list
        ),
      }))
    } catch (error) {
      console.error('Failed to complete all todos:', error)
    }
  },
  deleteTodoList: async (todoListId: number) => {
    // Optimistic update - remove from UI immediately
    set((state) => ({
      todoLists: state.todoLists.filter((list) => list.id !== todoListId),
    }))

    try {
      await todoApi.deleteTodoList(todoListId)
      // Success - the optimistic update already removed it
    } catch (error) {
      console.error('Failed to delete todo list:', error)
      // On error, refetch to restore correct state
      const state = get()
      state.fetchTodoLists()
    }
  },
}))

