import React from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkLightToggle = ({ theme, onToggle }) => (
  <button
    className="theme-toggle"
    onClick={onToggle}
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    id="theme-toggle-btn"
  >
    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
  </button>
);

export default DarkLightToggle;
