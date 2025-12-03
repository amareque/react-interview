import { useEffect, useState } from 'react'
import { TodoListCard } from './TodoListCard'
import type { TodoList } from '../types/todo'

interface AnimatedCardProps {
  todoList: TodoList
  isRemoving?: boolean
}

export function AnimatedCard({ todoList, isRemoving = false }: AnimatedCardProps) {
  const [mounted, setMounted] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    // Trigger enter animation on mount
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isRemoving) {
      // Start exit animation
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isRemoving])

  if (!shouldRender) {
    return null
  }

  return (
    <div className={isRemoving ? 'card-exit' : mounted ? 'card-enter' : ''}>
      <TodoListCard todoList={todoList} />
    </div>
  )
}

