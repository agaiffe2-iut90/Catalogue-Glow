import React, { useState } from 'react';

export const DropdownMenu = ({ children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`relative inline-block text-left ${className}`}>
      {React.Children.map(children, child => {
        if (!child) return null;
        return React.cloneElement(child, { isOpen, setIsOpen });
      })}
    </div>
  );
};

export const DropdownMenuTrigger = ({ isOpen, setIsOpen, children, className = '' }) => {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`inline-flex items-center justify-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded ${className}`}
    >
      {children}
    </button>
  );
};

export const DropdownMenuContent = ({ isOpen, setIsOpen, children, className = '' }) => {
  return (
    isOpen && (
      <div className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 ${className}`}>
        {React.Children.map(children, child => {
          if (!child) return null;
          return React.cloneElement(child, { setIsOpen });
        })}
      </div>
    )
  );
};

export const DropdownMenuItem = ({ onClick, setIsOpen, children, className = '' }) => {
  const handleClick = () => {
    onClick && onClick();
    setIsOpen && setIsOpen(false);
  };
  
  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  );
};

export const DropdownMenuSeparator = ({ className = '' }) => {
  return (
    <div className={`border-t border-gray-200 my-1 ${className}`} />
  );
};

