'use client';

const TaskCard = ({ task, onStatusChange }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusOptions = ['todo', 'in-progress', 'done'];

  const handleStatusChange = (e) => {
    onStatusChange(task._id, e.target.value);
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          {task.assignee ? (
            <>
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium mr-2">
                {task.assignee.name?.charAt(0).toUpperCase()}
              </div>
              <span>{task.assignee.name}</span>
            </>
          ) : (
            <span className="text-gray-400">Unassigned</span>
          )}
        </div>
        
        {task.dueDate && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
