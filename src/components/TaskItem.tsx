import React, { useState } from 'react';
import { 
  Trash2, 
  Edit, 
  CheckCircle, 
  Circle, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleComplete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onDelete, 
  onEdit, 
  onToggleComplete 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const isOverdue = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && !task.completed;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button 
            onClick={() => onToggleComplete(task.id)} 
            className="mt-1 text-blue-500 hover:text-blue-700 transition-colors"
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          
          {/* Task content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className={`text-lg font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-800'
              }`}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2 flex-wrap">
                {/* Priority badge */}
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                
                {/* Due date */}
                <span className={`text-xs flex items-center gap-1 ${
                  isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
                }`}>
                  <Calendar className="h-3 w-3" />
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
            
            {/* Task actions */}
            <div className="flex items-center justify-between mt-3">
              <button 
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Hide details</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Show details</span>
                  </>
                )}
              </button>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(task)}
                  className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Edit task"
                >
                  <Edit className="h-4 w-4" />
                </button>
                
                <button 
                  onClick={() => {
                    if (confirmDelete) {
                      onDelete(task.id);
                    } else {
                      setConfirmDelete(true);
                    }
                  }}
                  onMouseLeave={() => setTimeout(() => setConfirmDelete(false), 2000)}
                  className={`p-1 rounded-full transition-colors ${
                    confirmDelete 
                      ? 'bg-red-100 text-red-600' 
                      : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
                  }`}
                  aria-label={confirmDelete ? "Confirm delete" : "Delete task"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 ml-8 border-t border-gray-100">
          <p className="text-gray-700 mb-3 whitespace-pre-line">{task.description}</p>
          
          {task.image && (
            <div className="mt-3 relative rounded-lg overflow-hidden bg-gray-50">
              <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                <span>Attachment</span>
              </div>
              <img 
                src={task.image} 
                alt="Task attachment" 
                className="max-h-64 object-contain w-full"
              />
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-4">
            Created: {formatDate(task.createdAt)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;