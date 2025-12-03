import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Todo } from '../types/todo'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface TodoItemProps {
  todo: Todo
  onToggle: (todoId: number, currentCompleted: boolean) => void
  onDelete: (todoId: number, e: React.MouseEvent) => void
  onUpdateTitle: (todoId: number, title: string) => Promise<void>
}

export function TodoItem({ todo, onToggle, onDelete, onUpdateTitle }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const [isUpdating, setIsUpdating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(todo.title)
  }, [todo.title])

  const handleToggle = (checked: boolean) => {
    onToggle(todo.id, !checked)
  }

  const handleDelete = (e: React.MouseEvent) => {
    onDelete(todo.id, e)
  }

  const handleClick = () => {
    if (!todo.completed && !isEditing) {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (editValue.trim() && editValue.trim() !== todo.title && !isUpdating) {
      setIsUpdating(true)
      await onUpdateTitle(todo.id, editValue.trim())
      setIsUpdating(false)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(todo.title)
    setIsEditing(false)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  return (
    <li className="flex items-start gap-2 group">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        className="mt-0.5 shrink-0"
      />
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={isUpdating}
          className="flex-1 min-w-0 border-0 shadow-none focus-visible:ring-0 px-0 h-auto py-0.5 text-sm"
        />
      ) : (
        <span 
          onClick={handleClick}
          className={`flex-1 min-w-0 text-sm leading-relaxed break-words ${todo.completed ? 'line-through text-muted-foreground cursor-default' : 'cursor-text'}`}
        >
          {todo.title}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        aria-label="Delete todo"
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      >
        <X className="size-3.5" />
      </Button>
    </li>
  )
}

