'use client';

import TaskCard from './TaskCard';

const TaskColumn = ({ title, status, tasks, onStatusChange }) => {
  const columnStyles = {
    'todo': 'border-t-gray-400',
    'in-progress': 'border-t-blue-500',
    'done': 'border-t-green-500'
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-4 border-t-4 ${columnStyles[status]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 uppercase text-sm">
          {title}
        </h3>
        <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onStatusChange={onStatusChange}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
