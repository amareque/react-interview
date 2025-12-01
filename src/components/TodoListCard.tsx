import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Check, X, CheckCircle2, Trash2 } from 'lucide-react'
import type { TodoList } from '../types/todo'
import { cn } from '../lib/utils'
import { useTodoStore } from '../store/todoStore'

interface TodoListCardProps {
  todoList: TodoList
}

export function TodoListCard({ todoList }: TodoListCardProps) {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const addTodo = useTodoStore((state) => state.addTodo)
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const deleteTodo = useTodoStore((state) => state.deleteTodo)
  const completeAllTodos = useTodoStore((state) => state.completeAllTodos)
  const deleteTodoList = useTodoStore((state) => state.deleteTodoList)
  
  const completedCount = todoList.todos.filter(t => t.completed).length
  const totalCount = todoList.todos.length

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodoTitle.trim() && !isCreating) {
      setIsCreating(true)
      await addTodo(todoList.id, newTodoTitle)
      setNewTodoTitle('')
      setIsCreating(false)
    }
  }

  const handleToggleTodo = async (todoId: number, currentCompleted: boolean) => {
    await toggleTodo(todoId, !currentCompleted)
  }

  const handleDeleteTodo = async (todoId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteTodo(todoId)
  }

  const handleCompleteAll = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await completeAllTodos(todoList.id)
  }

  const handleDeleteList = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${todoList.name}"?`)) {
      await deleteTodoList(todoList.id)
    }
  }

  return (
    <Card className="todo-card">
      <CardHeader className="todo-card-header">
        <div className="todo-card-header-content">
          <div>
            <CardTitle className="todo-card-title">
              {todoList.name}
            </CardTitle>
            {totalCount > 0 && (
              <p className="todo-card-subtitle">
                {completedCount} of {totalCount} completed
              </p>
            )}
          </div>
          <div className="todo-card-actions">
            {totalCount > 0 && completedCount < totalCount && (
              <button
                className="todo-card-action-button"
                onClick={handleCompleteAll}
                aria-label="Complete all todos"
                type="button"
                title="Complete all"
              >
                <CheckCircle2 className="todo-card-action-icon" />
              </button>
            )}
            <button
              className="todo-card-action-button todo-card-action-button-delete"
              onClick={handleDeleteList}
              aria-label="Delete todo list"
              type="button"
              title="Delete list"
            >
              <Trash2 className="todo-card-action-icon" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="todo-card-content">
        {todoList.todos.length > 0 && (
          <ul className="todo-list">
            {todoList.todos.map((todo) => (
              <li
                key={todo.id}
                className={cn(
                  "todo-item",
                  todo.completed && "todo-item-completed"
                )}
              >
                <div
                  className={cn(
                    "todo-checkbox",
                    todo.completed && "todo-checkbox-checked"
                  )}
                  onClick={() => handleToggleTodo(todo.id, todo.completed)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleToggleTodo(todo.id, todo.completed)
                    }
                  }}
                  aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {todo.completed && (
                    <Check className="todo-check-icon" />
                  )}
                </div>
                <span className="todo-text">{todo.title}</span>
                <button
                  className="todo-delete-button"
                  onClick={(e) => handleDeleteTodo(todo.id, e)}
                  aria-label="Delete todo"
                  type="button"
                >
                  <X className="todo-delete-icon" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className={cn("todo-input-container", todoList.todos.length > 0 && "todo-input-container-with-border")}>
          <div className="todo-checkbox-placeholder"></div>
          <input
            type="text"
            className="todo-input"
            placeholder="Add a todo..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isCreating}
          />
        </div>
      </CardContent>
    </Card>
  )
}
