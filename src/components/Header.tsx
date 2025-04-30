import React from 'react';
import { CheckCircle2, ListTodo, List } from 'lucide-react';
import { FilterOptions } from '../types';

interface HeaderProps {
  setFilter: (filter: FilterOptions) => void;
  currentFilter: FilterOptions;
}

const Header: React.FC<HeaderProps> = ({ setFilter, currentFilter }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">
              <ListTodo size={28} />
            </span>
            <h1 className="text-xl font-bold text-gray-800">TaskFlow</h1>
          </div>
          
          <nav>
            <ul className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <li>
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    currentFilter === 'all' 
                      ? 'bg-white shadow-sm text-gray-800' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <List size={16} />
                    <span>All</span>
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    currentFilter === 'active' 
                      ? 'bg-white shadow-sm text-gray-800' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ListTodo size={16} />
                    <span>Active</span>
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    currentFilter === 'completed' 
                      ? 'bg-white shadow-sm text-gray-800' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Completed</span>
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;