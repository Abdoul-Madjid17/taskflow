import React, { useState, useEffect } from 'react';
import { PlusCircle, LayoutDashboard, CheckSquare, Clock, Settings, Menu, X } from 'lucide-react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Header from './components/Header';
import { Task } from './types';
import { FilterOptions } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterOptions>('all');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
    setIsFormOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    const overdue = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return !task.completed && dueDate < new Date();
    }).length;

    return { total, completed, active, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white fixed md:static inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-200 ease-in-out z-30 w-64 border-r border-gray-200`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <LayoutDashboard size={24} />
              <span className="text-xl font-bold text-gray-800">TaskFlow</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'dashboard' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActiveView('tasks');
                setFilter('all');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'tasks' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckSquare size={20} />
              <span>All Tasks</span>
            </button>
            <button
              onClick={() => {
                setActiveView('upcoming');
                setFilter('active');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'upcoming' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock size={20} />
              <span>Upcoming</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setActiveView('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'settings' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <PlusCircle size={20} />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Active Tasks</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.active}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Overdue</h3>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdue}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Tasks</h2>
                  <TaskList 
                    tasks={tasks.slice(0, 5)}
                    onDelete={handleDeleteTask}
                    onEdit={setEditingTask}
                    onToggleComplete={handleToggleComplete}
                  />
                </div>
              </div>
            </div>
          )}

          {(activeView === 'tasks' || activeView === 'upcoming') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  {activeView === 'tasks' ? 'All Tasks' : 'Upcoming Tasks'}
                </h1>
              </div>
              <TaskList 
                tasks={filteredTasks()}
                onDelete={handleDeleteTask}
                onEdit={setEditingTask}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {(isFormOpen || editingTask) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <TaskForm 
              onSubmit={editingTask ? handleEditTask : handleAddTask}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTask(null);
              }}
              initialTask={editingTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;