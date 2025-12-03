import { useState } from 'react'
import { Input } from './ui/input'
import { Separator } from './ui/separator'

interface AddTodoFormProps {
  onAddTodo: (title: string) => Promise<void>
  hasTodos: boolean
}

export function AddTodoForm({ onAddTodo, hasTodos }: AddTodoFormProps) {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodoTitle.trim() && !isCreating) {
      setIsCreating(true)
      await onAddTodo(newTodoTitle)
      setNewTodoTitle('')
      setIsCreating(false)
    }
  }

  return (
    <div className={`flex items-start gap-2 ${hasTodos ? 'mt-2 pt-2 border-t' : ''}`}>
      <div className="w-4 h-4 shrink-0 mt-0.5" />
      <Input
        type="text"
        placeholder="Add a todo..."
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isCreating}
        className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto py-0.5 text-sm"
      />
    </div>
  )
}

