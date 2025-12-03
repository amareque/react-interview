import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface NewTodoListFormProps {
  onCreateList: (name: string) => Promise<void>
  onCancel: () => void
}

export function NewTodoListForm({ onCreateList, onCancel }: NewTodoListFormProps) {
  const [newListName, setNewListName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateList = async () => {
    if (!newListName.trim() || isCreating) return
    
    setIsCreating(true)
    await onCreateList(newListName)
    setNewListName('')
    setIsCreating(false)
  }

  const handleCancel = () => {
    setNewListName('')
    onCancel()
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Input
        type="text"
        placeholder="List name..."
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCreateList()
          } else if (e.key === 'Escape') {
            handleCancel()
          }
        }}
        autoFocus
        disabled={isCreating}
        className="min-w-[200px]"
      />
      <Button
        onClick={handleCreateList}
        disabled={!newListName.trim() || isCreating}
      >
        Create
      </Button>
      <Button
        onClick={handleCancel}
        variant="outline"
        disabled={isCreating}
      >
        Cancel
      </Button>
    </div>
  )
}

