import { useEffect, useState, useRef } from 'react'
import { useTodoStore } from './store/todoStore'
import { AnimatedCard } from './components/AnimatedCard'
import { NewTodoListForm } from './components/NewTodoListForm'
import { Button } from './components/ui/button'
import { Plus } from 'lucide-react'
import './App.css'

function App() {
  const { todoLists, loading, error, fetchTodoLists, createTodoList } = useTodoStore()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [displayLists, setDisplayLists] = useState(todoLists)
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchTodoLists().then().catch()
  }, [fetchTodoLists])

  // Sync display lists with store, handling removals with animation
  useEffect(() => {
    setDisplayLists(prev => {
      // Initialize on first load
      if (prev.length === 0 && todoLists.length > 0) {
        return todoLists
      }
      
      const currentIds = new Set(todoLists.map(list => list.id))
      const displayIds = new Set(prev.map(list => list.id))
      
      // Add new lists immediately
      const newLists = todoLists.filter(list => !displayIds.has(list.id))
      if (newLists.length > 0) {
        return [...prev, ...newLists]
      }
      
      // Mark lists for removal that are no longer in store
      const toRemove = prev.filter(list => !currentIds.has(list.id))
      if (toRemove.length > 0) {
        setRemovingIds(new Set(toRemove.map(list => list.id)))
        // Remove from display after animation
        setTimeout(() => {
          setDisplayLists(current => current.filter(list => currentIds.has(list.id)))
          setRemovingIds(new Set())
        }, 300)
        return prev // Keep in display during animation
      }
      
      // Update existing lists
      return prev.map(list => {
        const updated = todoLists.find(l => l.id === list.id)
        return updated || list
      })
    })
  }, [todoLists])

  const handleCreateList = async (name: string) => {
    await createTodoList(name)
    setShowCreateForm(false)
  }

  const handleCancel = () => {
    setShowCreateForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin"></div>
        <p>Loading todo lists...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md space-y-4">
          <p className="text-destructive text-lg">Error: {error}</p>
          <p className="text-muted-foreground text-sm">
            Make sure the API is running on http://localhost:3000
          </p>
          <Button onClick={fetchTodoLists}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Todo Lists</h1>
            <p className="text-muted-foreground">Organize your tasks</p>
          </div>
          {!showCreateForm ? (
            <Button
              onClick={() => setShowCreateForm(true)}
            >
              <Plus />
              New List
            </Button>
          ) : (
            <NewTodoListForm
              onCreateList={handleCreateList}
              onCancel={handleCancel}
            />
          )}
        </div>
        {todoLists.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">No todo lists yet</p>
            <p className="text-sm text-muted-foreground">Create your first todo list to get started!</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-0">
            {displayLists.map((todoList) => (
              <AnimatedCard 
                key={todoList.id} 
                todoList={todoList}
                isRemoving={removingIds.has(todoList.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
