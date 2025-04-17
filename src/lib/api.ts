import type { Task } from "@/types/task"

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch("/api/tasks")

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}

export async function createTask(newTask: Omit<Task, "id">): Promise<Task> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create task")
  }

  const data = await response.json()
  return data.task
}

export async function updateTask(taskId: string, updatedTask: Partial<Task>): Promise<Task> {
  const response = await fetch("/api/tasks", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: taskId, ...updatedTask }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update task")
  }

  const data = await response.json()
  return data.task
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`/api/tasks?id=${taskId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete task")
  }
}
