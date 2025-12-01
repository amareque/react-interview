import { useEffect, useState } from 'react'
import { useTodoStore } from './store/todoStore'
import { TodoListCard } from './components/TodoListCard'
import { Button } from './components/ui/button'
import { Plus } from 'lucide-react'
import './App.css'

function App() {
  const { todoLists, loading, error, fetchTodoLists, createTodoList } = useTodoStore()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchTodoLists()
  }, [fetchTodoLists])

  const handleCreateList = async () => {
    if (!newListName.trim() || isCreating) return
    
    setIsCreating(true)
    await createTodoList(newListName)
    setNewListName('')
    setShowCreateForm(false)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setNewListName('')
    setShowCreateForm(false)
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading todo lists...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <div className="error-content">
          <p className="error-message">Error: {error}</p>
          <p className="error-hint">
            Make sure the API is running on http://localhost:3000
          </p>
          <Button onClick={fetchTodoLists}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="app-container">
        <div className="app-header">
          <div>
            <h1 className="app-title">Todo Lists</h1>
            <p className="app-subtitle">Organize your tasks</p>
          </div>
          {!showCreateForm ? (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="create-list-button"
            >
              <Plus className="create-list-icon" />
              New List
            </Button>
          ) : (
            <div className="create-list-form">
              <input
                type="text"
                className="create-list-input"
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
              />
              <Button
                onClick={handleCreateList}
                disabled={!newListName.trim() || isCreating}
                className="create-list-submit"
              >
                Create
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="create-list-cancel"
                disabled={isCreating}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
        {todoLists.length === 0 ? (
          <div className="app-empty">
            <p className="empty-title">No todo lists yet</p>
            <p className="empty-subtitle">Create your first todo list to get started!</p>
          </div>
        ) : (
          <div className="todo-grid">
            {todoLists.map((todoList) => (
              <TodoListCard key={todoList.id} todoList={todoList} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
