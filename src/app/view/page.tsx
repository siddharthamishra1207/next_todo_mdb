"use client"; // Enables client-side rendering in Next.js app

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Interface for task objects
interface Task {
  _id: string;
  taskTitle: string;
  taskDetails: string;
}

export default function ViewPage() {
  const router = useRouter();

  // State to store user information
  const [user, setUser] = useState<{ email: string; username: string } | null>(null);

  // State to store the list of tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // States for adding a new task
  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");

  // States for editing a task
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetails, setEditDetails] = useState("");

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    const res = await axios.get("/api/run/taskview");
    if (res.data.success) setTasks(res.data.tasks);
  };

  // Fetch current logged-in user's info
  const fetchUser = async () => {
    const res = await axios.get("/api/userinfo");
    setUser(res.data.user);
  };

  // Run once on component mount to fetch user and tasks
  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, []);

  // Add new task
  const handleAdd = async () => {
    await axios.post("/api/run/tasksave", { taskTitle: newTitle, taskDetails: newDetails });
    setNewTitle("");
    setNewDetails("");
    fetchTasks(); // Refresh task list
  };

  // Delete task by ID
  const handleDelete = async (id: string) => {
    await axios.delete(`/api/run/taskdel/${id}`);
    fetchTasks(); // Refresh task list
  };

  // Populate edit states with task data
  const handleEdit = (task: Task) => {
    setEditTaskId(task._id);
    setEditTitle(task.taskTitle);
    setEditDetails(task.taskDetails);
  };

  // Update task with new values
  const handleUpdate = async () => {
    if (editTaskId) {
      await axios.put(`/api/run/taskedit/${editTaskId}`, {
        taskTitle: editTitle,
        taskDetails: editDetails,
      });
      setEditTaskId(null); // Close edit modal
      fetchTasks(); // Refresh list
    }
  };

  // Logout user and clear token cookie
  const handleLogout = async () => {
    await axios.get(`/api/auth/logout`);
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full bg-amber-400 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center p-4">
      {/* Main container */}
      <div className="w-full max-w-2xl mt-5 bg-amber-200 dark:bg-gray-800 shadow-xl rounded-xl p-6">

        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Hello, {user?.username}</h2>
          <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Email: {user?.email}</p>

        {/* Add Task Inputs */}
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Details"
          className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600"
          value={newDetails}
          onChange={(e) => setNewDetails(e.target.value)}
        ></textarea>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mb-4" onClick={handleAdd}>
          Add Task
        </button>

        {/* Task List Display */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="relative border dark:border-gray-600 p-4 rounded bg-amber-200 dark:bg-gray-700">
              <h3 className="font-semibold">{task.taskTitle}</h3>
              <p>{task.taskDetails}</p>
              {/* Edit/Delete buttons */}
              <div className=" absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Go back navigation */}
        <button onClick={() => router.back()} className="mt-6 text-blue-600 text-sm hover:underline">
          ← Go Back
        </button>
      </div>

      {/* Modal for Editing Task */}
      {editTaskId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Edit Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              placeholder="Task Details"
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600"
              value={editDetails}
              onChange={(e) => setEditDetails(e.target.value)}
            ></textarea>
            <div className="flex justify-between">
              {/* Cancel and Update buttons */}
              <button onClick={() => setEditTaskId(null)} className="text-gray-500 hover:underline">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
