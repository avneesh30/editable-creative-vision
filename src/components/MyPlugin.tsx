import React from 'react';
import { MyPluginProps } from '../types';

const MyPlugin: React.FC<MyPluginProps> = ({
  title,
  description,
  onClick
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Click Me
      </button>
    </div>
  );
};

export default MyPlugin;