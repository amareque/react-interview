export interface Todo {
  id: number
  title: string
  completed: boolean
}

export interface TodoList {
  id: number
  name: string
  todos: Todo[]
}

