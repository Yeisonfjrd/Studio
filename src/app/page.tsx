"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { v4 as uuidv4 } from "uuid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { suggestTaskTags } from "@/ai/flows/suggest-task-tags"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Pencil, Check } from "lucide-react"
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api"
import type { Task } from "@/types/task"

const initialData: Task[] = [
  {
    id: uuidv4(),
    title: "Plan project roadmap",
    description: "Define milestones and deadlines for the upcoming quarter.",
    status: "To Do",
    tags: ["planning", "roadmap"],
  },
  {
    id: uuidv4(),
    title: "Design UI components",
    description: "Create wireframes and mockups for key user interfaces.",
    status: "In Progress",
    tags: ["design", "ui"],
  },
  {
    id: uuidv4(),
    title: "Implement user authentication",
    description: "Integrate Clerk for secure user sign-in and registration.",
    status: "Done",
    tags: ["authentication", "clerk"],
  },
]

const fetchSuggestedTags = async (title: string, description: string): Promise<string[]> => {
  try {
    const result = await suggestTaskTags({ title, description })
    return result.tags
  } catch (error) {
    console.error("Failed to fetch suggested tags:", error)
    return []
  }
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (newTaskTitle || newTaskDescription) {
      fetchSuggestedTags(newTaskTitle, newTaskDescription).then((tags) => setSuggestedTags(tags))
    } else {
      setSuggestedTags([])
    }
  }, [newTaskTitle, newTaskDescription])

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Title cannot be empty.",
        variant: "destructive",
      })
      return
    }

    try {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        status: "To Do",
        tags: suggestedTags,
      }

      const createdTask = await createTask(newTask)
      setTasks([...tasks, createdTask])
      setNewTaskTitle("")
      setNewTaskDescription("")
      setSuggestedTags([])
      setIsCreateFormOpen(false)

      toast({
        title: "Success",
        description: "Task created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTask = async (taskId: string, updatedTaskData: Partial<Task>) => {
    try {
      // Optimistically update UI
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTaskData } : task)))
      setEditingTaskId(null)

      // Update on the server
      await updateTask(taskId, updatedTaskData)

      toast({
        title: "Success",
        description: "Task updated successfully.",
      })
    } catch (error) {
      // Revert optimistic update on failure
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task",
        variant: "destructive",
      })

      // Refresh tasks from server to ensure UI is in sync
      try {
        const refreshedTasks = await fetchTasks()
        setTasks(refreshedTasks)
      } catch (refreshError) {
        console.error("Failed to refresh tasks:", refreshError)
      }
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      // Optimistically update UI
      setTasks(tasks.filter((task) => task.id !== taskId))

      // Delete on the server
      await deleteTask(taskId)

      toast({
        title: "Success",
        description: "Task deleted successfully.",
      })
    } catch (error) {
      // Revert optimistic update on failure
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
        variant: "destructive",
      })

      // Refresh tasks from server to ensure UI is in sync
      try {
        const refreshedTasks = await fetchTasks()
        setTasks(refreshedTasks)
      } catch (refreshError) {
        console.error("Failed to refresh tasks:", refreshError)
      }
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const taskId = result.draggableId
    const newStatus = result.destination.droppableId as Task["status"]

    const taskToUpdate = tasks.find((task) => task.id === taskId)

    if (!taskToUpdate) {
      console.error(`Task with id ${taskId} not found`)
      return
    }

    try {
      // Optimistically update the UI
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status: newStatus }
        }
        return task
      })
      setTasks(updatedTasks)

      // Update on the server
      await updateTask(taskId, { status: newStatus })

      toast({
        title: "Success",
        description: `Task status updated to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task status",
        variant: "destructive",
      })

      // Refresh tasks from server to ensure UI is in sync
      try {
        const refreshedTasks = await fetchTasks()
        setTasks(refreshedTasks)
      } catch (refreshError) {
        console.error("Failed to refresh tasks:", refreshError)
      }
    }
  }

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const loadedTasks = await fetchTasks()
        if (loadedTasks.length > 0) {
          setTasks(loadedTasks)
        }
      } catch (error) {
        console.error("Failed to load tasks:", error)
        toast({
          title: "Error",
          description: "Failed to load tasks. Using sample data instead.",
          variant: "destructive",
        })
      }
    }

    loadTasks()
  }, [toast])

  return (
    <div className="flex min-h-screen bg-background antialiased">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">TaskMaster</h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <Droppable droppableId="To Do">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-secondary rounded p-4 min-h-[300px]"
                >
                  <h2 className="text-lg font-semibold mb-4">To Do</h2>
                  {getTasksByStatus("To Do").map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-4"
                        >
                          <TaskCard
                            task={task}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                            isEditing={editingTaskId === task.id}
                            setEditingTaskId={setEditingTaskId}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* In Progress Column */}
            <Droppable droppableId="In Progress">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-secondary rounded p-4 min-h-[300px]"
                >
                  <h2 className="text-lg font-semibold mb-4">In Progress</h2>
                  {getTasksByStatus("In Progress").map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-4"
                        >
                          <TaskCard
                            task={task}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                            isEditing={editingTaskId === task.id}
                            setEditingTaskId={setEditingTaskId}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Done Column */}
            <Droppable droppableId="Done">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-secondary rounded p-4 min-h-[300px]"
                >
                  <h2 className="text-lg font-semibold mb-4">
                    Done <Check className="inline-block text-accent h-5 w-5 ml-1" />
                  </h2>
                  {getTasksByStatus("Done").map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-4"
                        >
                          <TaskCard
                            task={task}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                            isEditing={editingTaskId === task.id}
                            setEditingTaskId={setEditingTaskId}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>

        {/* Task Creation Form */}
        {!isCreateFormOpen ? (
          <div className="text-center mt-8">
            <Button onClick={() => setIsCreateFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
            </Button>
          </div>
        ) : (
          <Card className="mt-8">
            <CardHeader>
              <h3 className="text-lg font-semibold">Create New Task</h3>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="newTaskTitle" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  type="text"
                  id="newTaskTitle"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="newTaskDescription" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="newTaskDescription"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>
              {suggestedTags.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Suggested Tags</p>
                  <div className="flex gap-2">
                    {suggestedTags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsCreateFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

interface TaskCardProps {
  task: Task
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  isEditing: boolean
  setEditingTaskId: (taskId: string | null) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateTask, onDeleteTask, isEditing, setEditingTaskId }) => {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)

  const handleSave = () => {
    onUpdateTask(task.id, { title, description })
    setEditingTaskId(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isEditing ? (
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        ) : (
          <div className="text-sm font-medium leading-none">{task.title}</div>
        )}
        <div>
          {!isEditing ? (
            <Button variant="ghost" size="sm" onClick={() => setEditingTaskId(task.id)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={() => setEditingTaskId(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        ) : (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
        {task.tags.length > 0 && (
          <div className="mt-4 flex gap-2">
            {task.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="destructive" size="sm" onClick={() => onDeleteTask(task.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
