import React, { useState, useRef, useEffect } from 'react';
import { MdClear, MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

// Dropdown Item type to give the id and the label of the dropdown item
interface DropdownItem {
  id: string | number;
  label: string;
}

// The dropdown props to allow for this component to be reusable
interface DropdownProps {
  items: DropdownItem[] | string[];
  selectedItems: DropdownItem[] | string[];
  onSelect: (items: DropdownItem[] | string[]) => void;
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectedItems,
  onSelect,
  isMulti = false,
  className = '',
  placeholder = 'Select an Item',
  disabled = false,
  clearable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allSelected = isMulti && selectedItems.length === items.length;

  const isItemSelected = (item: DropdownItem | string) => {
    return selectedItems.some(selected => 
      typeof item === 'object' && typeof selected === 'object'
        ? selected.id === item.id
        : selected === item
    );
  };

  // handling selecting items in dropdown
  const handleItemClick = (item: DropdownItem | string) => {
    if (isMulti === false) {
      onSelect([item as (string | DropdownItem)] as DropdownItem[] | string[]);
      setIsOpen(false);
    } else {
      const isSelected = isItemSelected(item);
      let newSelected: DropdownItem[] | string[];
      
      if (isSelected) {
        newSelected = selectedItems.filter(selected => 
          typeof item === 'object' && typeof selected === 'object'
            ? selected.id !== item.id
            : selected !== item
        ) as DropdownItem[] | string[];
      } else {
        newSelected = [...selectedItems, item] as DropdownItem[] | string[];
      }
      
      onSelect(newSelected);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect([]);
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allSelected){
      onSelect([]);
    }
    else {
      onSelect([...items] as DropdownItem[] | string[]);
    }
}
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const getTriggerContent = () => {
    if (selectedItems.length === 0) {
      return <span className="text-gray-400">{placeholder}</span>;
    }
    
    if (isMulti === false) {
      const item = selectedItems[0];
      return <span className="truncate">{typeof item === 'object' ? item.label : item}</span>;
    }
    
      return (
        <div className="flex flex-wrap gap-1 overflow-hidden">
          {selectedItems.map((item, index) => (
            <span 
              key={typeof item === 'object' ? item.id : index}
              className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 rounded whitespace-nowrap"
            >
              {typeof item === 'object' ? item.label : item}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item);
                }}
                className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <MdClear />
              </button>
          
            </span>
          ))}
        </div>
      );
    
    
  };

  return (
    <div 
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      {/* Trigger shows selected options */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px] ${
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''
        }`}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex-1 overflow-hidden mr-2">
          {getTriggerContent()}
        </div>
        
        <div className="flex items-center gap-1">
          {isMulti && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={disabled}
            >
              {allSelected ? (
                <MdCheckBox />
              ) : (
                <MdCheckBoxOutlineBlank  />
              )}
            </button>
          )}
          
          {clearable && selectedItems.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={disabled}
            >
              <MdClear  />
            </button>
          )}
          
         
        </div>
      </div>
      
      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div
          className={`absolute z-50 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black origin-top-left left-0 mt-1 max-h-60 overflow-auto`}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <div
                key={typeof item === 'object' ? item.id : index}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  isItemSelected(item) ? 'bg-gray-100 font-medium' : ''
                } ${activeIndex === index ? 'bg-gray-100' : ''}`}
                role="option"
                tabIndex={0}
              >
                {isMulti  && (
                  <input
                    type="checkbox"
                    checked={isItemSelected(item)}
                    readOnly
                    className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                )}
                <span>{typeof item === 'object' ? item.label : item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;