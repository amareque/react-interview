import { useState, useRef, useEffect } from 'react'
import { CheckCircle2, Trash2 } from 'lucide-react'
import type { TodoList } from '../types/todo'
import { useTodoStore } from '../store/todoStore'
import { TodoItem } from './TodoItem'
import { AddTodoForm } from './AddTodoForm'
import { Card, CardHeader, CardTitle, CardContent, CardAction } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface TodoListCardProps {
  todoList: TodoList
}

export function TodoListCard({ todoList }: TodoListCardProps) {
  const addTodo = useTodoStore((state) => state.addTodo)
  const updateTodoList = useTodoStore((state) => state.updateTodoList)
  const updateTodoTitle = useTodoStore((state) => state.updateTodoTitle)
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const deleteTodo = useTodoStore((state) => state.deleteTodo)
  const completeAllTodos = useTodoStore((state) => state.completeAllTodos)
  const deleteTodoList = useTodoStore((state) => state.deleteTodoList)
  
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitleValue, setEditTitleValue] = useState(todoList.name)
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const completedCount = todoList.todos.filter(t => t.completed).length
  const totalCount = todoList.todos.length

  useEffect(() => {
    setEditTitleValue(todoList.name)
  }, [todoList.name])

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  const handleAddTodo = async (title: string) => {
    await addTodo(todoList.id, title)
  }

  const handleTitleClick = () => {
    if (!isEditingTitle) {
      setIsEditingTitle(true)
    }
  }

  const handleTitleSave = async () => {
    if (editTitleValue.trim() && editTitleValue.trim() !== todoList.name && !isUpdatingTitle) {
      setIsUpdatingTitle(true)
      await updateTodoList(todoList.id, editTitleValue.trim())
      setIsUpdatingTitle(false)
    }
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setEditTitleValue(todoList.name)
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await handleTitleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleTitleCancel()
    }
  }

  const handleUpdateTodoTitle = async (todoId: number, title: string) => {
    await updateTodoTitle(todoId, title)
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
    <Card className="break-inside-avoid mb-4 gap-4 py-4 w-full">
      <CardHeader className="pb-3">
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            type="text"
            value={editTitleValue}
            onChange={(e) => setEditTitleValue(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleSave}
            disabled={isUpdatingTitle}
            className="text-base font-semibold border-0 shadow-none focus-visible:ring-0 px-0 h-auto py-0"
          />
        ) : (
          <CardTitle 
            className="text-base cursor-text"
            onClick={handleTitleClick}
          >
            {todoList.name}
          </CardTitle>
        )}
        {totalCount > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {completedCount} of {totalCount} completed
          </p>
        )}
        <CardAction>
          <div className="flex gap-1">
            {totalCount > 0 && completedCount < totalCount && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCompleteAll}
                aria-label="Complete all todos"
                title="Complete all"
              >
                <CheckCircle2 className="size-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDeleteList}
              aria-label="Delete todo list"
              title="Delete list"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {todoList.todos.length > 0 && (
          <ul className="space-y-1.5">
            {todoList.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onUpdateTitle={handleUpdateTodoTitle}
              />
            ))}
          </ul>
        )}
        <AddTodoForm
          onAddTodo={handleAddTodo}
          hasTodos={todoList.todos.length > 0}
        />
      </CardContent>
    </Card>
  )
}
