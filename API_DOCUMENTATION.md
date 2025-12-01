# API Documentation

This document provides examples of all available endpoints in the NestJS Todo API.

## Base URL
```
http://localhost:3000
```

---

## Todo Lists Endpoints

### 1. Get All Todo Lists
**GET** `/api/todolists`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Shopping List",
    "todos": [
      {
        "id": 1,
        "title": "Buy milk",
        "completed": false
      },
      {
        "id": 2,
        "title": "Buy eggs",
        "completed": true
      }
    ]
  },
  {
    "id": 2,
    "name": "Work Tasks",
    "todos": []
  }
]
```

---

### 2. Get Single Todo List
**GET** `/api/todolists/:todoListId`

**Example:** `GET /api/todolists/1`

**Response:**
```json
{
  "id": 1,
  "name": "Shopping List",
  "todos": [
    {
      "id": 1,
      "title": "Buy milk",
      "completed": false
    },
    {
      "id": 2,
      "title": "Buy eggs",
      "completed": true
    }
  ]
}
```

---

### 3. Create Todo List
**POST** `/api/todolists`

**Request Body:**
```json
{
  "name": "My New List"
}
```

**Response:**
```json
{
  "id": 3,
  "name": "My New List",
  "todos": []
}
```

---

### 4. Update Todo List
**PUT** `/api/todolists/:todoListId`

**Example:** `PUT /api/todolists/1`

**Request Body:**
```json
{
  "name": "Updated List Name"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated List Name",
  "todos": [
    {
      "id": 1,
      "title": "Buy milk",
      "completed": false
    }
  ]
}
```

---

### 5. Delete Todo List
**DELETE** `/api/todolists/:todoListId`

**Example:** `DELETE /api/todolists/1`

**Response:**
```
204 No Content
```

---

### 6. Complete All Todos in a List
**PATCH** `/api/todolists/:todoListId/complete-all`

**Example:** `PATCH /api/todolists/1`

**Response:**
```json
{
  "id": 1,
  "name": "Shopping List",
  "todos": [
    {
      "id": 1,
      "title": "Buy milk",
      "completed": true
    },
    {
      "id": 2,
      "title": "Buy eggs",
      "completed": true
    }
  ]
}
```

---

## Todos Endpoints

### 1. Create Todo
**POST** `/api/todos`

**Request Body:**
```json
{
  "todoListId": 1,
  "title": "Buy bread"
}
```

**Response:**
```json
{
  "id": 3,
  "title": "Buy bread",
  "completed": false
}
```

---

### 2. Update Todo
**PUT** `/api/todos/:todoId`

**Example:** `PUT /api/todos/1`

**Request Body:**
```json
{
  "title": "Buy organic milk",
  "completed": true
}
```

**Note:** Both `title` and `completed` are optional fields. You can update just one or both.

**Response:**
```json
{
  "id": 1,
  "title": "Buy organic milk",
  "completed": true
}
```

---

### 3. Delete Todo
**DELETE** `/api/todos/:todoId`

**Example:** `DELETE /api/todos/1`

**Response:**
```
204 No Content
```

---

## Summary

### Todo Lists (`/api/todolists`)
- `GET /api/todolists` - List all todo lists
- `GET /api/todolists/:todoListId` - Get a specific todo list
- `POST /api/todolists` - Create a new todo list
- `PUT /api/todolists/:todoListId` - Update a todo list
- `DELETE /api/todolists/:todoListId` - Delete a todo list
- `PATCH /api/todolists/:todoListId/complete-all` - Mark all todos in a list as completed

### Todos (`/api/todos`)
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:todoId` - Update a todo
- `DELETE /api/todos/:todoId` - Delete a todo

