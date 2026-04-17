import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';

const SearchSortBar = ({ searchQuery, onSearch, sortBy, onSort }) => {
  return (
    <div className="search-sort-bar glass-panel">
      <div className="search-input-wrap">
        <Search size={15} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, description or tag…"
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          aria-label="Search tasks"
          id="task-search-input"
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => onSearch('')} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>
      <div className="sort-wrap">
        <ArrowUpDown size={13} />
        <select
          className="sort-select"
          value={sortBy}
          onChange={e => onSort(e.target.value)}
          aria-label="Sort tasks"
          id="task-sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="deadline">Deadline ↑</option>
          <option value="priority">Priority ↓</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>
    </div>
  );
};

export default SearchSortBar;
