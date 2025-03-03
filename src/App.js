import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DateTime } from 'luxon';
import './App.css';
import cities from './data/cities';

// Define the type for our drag and drop
const ItemTypes = {
  TIMEZONE: 'timezone'
};

// Draggable timezone component
const DraggableTimezoneRow = ({ 
  city, 
  index, 
  moveTimezone, 
  removeCity, 
  hoveredTime, 
  hoveredTimeIndex, 
  getTimeForCity, 
  getTimeline, 
  referenceDateTime, 
  setHoveredTime, 
  setHoveredTimeIndex, 
  setHoveredTimeSlot, 
  use24HourFormat, 
  isSelected, 
  onRowSelect, 
  isHomeTimezone, 
  setHomeCity,
  currentTime,
  homeCity
}) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TIMEZONE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TIMEZONE,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveTimezone(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  // Initialize drag and drop into our ref
  drag(drop(ref));

  // Handle right-click to show context menu
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent default browser context menu
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Handle clicking outside to close context menu
  useEffect(() => {
    const handleClickOutside = () => {
      setShowContextMenu(false);
    };
    
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showContextMenu]);

  // Get the current time in this city's timezone
  const cityDateTime = currentTime.setZone(city.timezone);
  
  // Calculate offset from home timezone
  const getOffsetFromHome = () => {
    if (isHomeTimezone || !homeCity) return null;
    
    // Get the current time in both timezones
    const cityTime = DateTime.now().setZone(city.timezone);
    const homeTime = DateTime.now().setZone(homeCity.timezone);
    
    // Calculate the offset in hours
    const offsetMinutes = cityTime.offset - homeTime.offset;
    const offsetHours = offsetMinutes / 60;
    
    // Format the offset string
    const sign = offsetHours >= 0 ? '+' : '';
    const formattedOffset = offsetHours === 0 ? '±0' : `${sign}${offsetHours}`;
    
    return formattedOffset;
  };
  
  const offsetFromHome = getOffsetFromHome();
  
  return (
    <div 
      ref={ref}
      className={`timezone-row ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''} ${isHomeTimezone ? 'home-timezone' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={(e) => onRowSelect(index, e)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleContextMenu}
    >
      <div className="drag-handle">⋮⋮</div>
      <div className="city-info">
        <div className="city-header">
          <h2>
            {city.name} 
            <span className="timezone-badge">
              {city.timezoneName}
            </span>
            {offsetFromHome && (
              <span className="offset-badge">{offsetFromHome}</span>
            )}
            {isHomeTimezone && (
              <span className="home-indicator">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </span>
            )}
          </h2>
        </div>
        <div className="current-time">
          {getTimeForCity(city)} {cityDateTime.toLocaleString({ 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>
      <div className="timeline">
        {getTimeline(city, referenceDateTime).map((slot, i) => (
          <div 
            key={i} 
            className={`time-slot ${slot.timeOfDay} ${hoveredTimeIndex === i ? 'highlight' : ''} ${slot.isHalfHour ? 'half-hour' : ''}`}
            data-is-midnight={slot.isMidnight ? "true" : "false"}
            onMouseEnter={() => {
              setHoveredTime(slot.hour);
              setHoveredTimeIndex(i);
              setHoveredTimeSlot(slot);
            }}
            onMouseLeave={() => {
              setHoveredTime(null);
              setHoveredTimeIndex(null);
              setHoveredTimeSlot(null);
            }}
          >
            <div className="hour">{slot.time.split('\n')[0]}</div>
            <div className="period">{slot.time.split('\n')[1] || ''}</div>
          </div>
        ))}
      </div>
      <div className="row-actions">
        <button 
          className="close-btn" 
          onClick={(e) => {
            e.stopPropagation(); // Prevent row selection
            removeCity(city.name);
          }}
        >
          ×
        </button>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="context-menu"
          style={{ 
            position: 'fixed', 
            top: contextMenuPosition.y, 
            left: contextMenuPosition.x 
          }}
        >
          {isHomeTimezone ? (
            <button 
              className="context-menu-item"
              onClick={() => {
                setHomeCity(null); // Unset home timezone
                setShowContextMenu(false);
              }}
            >
              Unset as Home Timezone
            </button>
          ) : (
            <button 
              className="context-menu-item"
              onClick={() => {
                setHomeCity(city.name);
                setShowContextMenu(false);
              }}
            >
              Set as Home Timezone
            </button>
          )}
        </div>
      )}
    </div>
  );
};

function App() {
  // Load selected cities from localStorage or use defaults
  const [selectedCities, setSelectedCities] = useState(() => {
    const savedCities = localStorage.getItem('selectedCities');
    if (savedCities) {
      try {
        // Parse the saved city names and find the matching city objects
        const cityNames = JSON.parse(savedCities);
        const loadedCities = cityNames
          .map(name => cities.find(c => c.name === name))
          .filter(city => city !== undefined); // Filter out any undefined cities
        
        // If we have valid cities, return them
        if (loadedCities.length > 0) {
          return loadedCities;
        }
      } catch (e) {
        console.error('Error loading saved cities', e);
      }
    }
    
    // Default cities if nothing is saved or if there was an error
    return [
      cities.find(c => c.name === 'New York, NY') || cities[0],
      cities.find(c => c.name === 'Nairobi, Kenya') || cities[1],
      cities.find(c => c.name === 'Dakar, Senegal') || cities[2],
      cities.find(c => c.name === 'Jakarta, Indonesia') || cities[3],
      cities.find(c => c.name === 'San Francisco, CA') || cities[4]
    ].filter(Boolean); // Filter out any undefined cities
  });
  
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State for time and display preferences
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [hoveredTime, setHoveredTime] = useState(null);
  const [hoveredTimeIndex, setHoveredTimeIndex] = useState(null);
  const [hoveredTimeSlot, setHoveredTimeSlot] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // User preferences
  const [use24HourFormat, setUse24HourFormat] = useState(() => {
    // Check if user has a preference stored
    const savedFormat = localStorage.getItem('use24HourFormat');
    // Return the saved preference or default to false (AM/PM)
    return savedFormat === 'true';
  });
  
  // Add state for home timezone
  const [homeTimezone, setHomeTimezone] = useState(() => {
    const savedHomeTimezone = localStorage.getItem('homeTimezone');
    if (savedHomeTimezone) {
      // Check if the saved home timezone exists in our cities list
      const exists = cities.some(city => city.name === savedHomeTimezone);
      if (exists) {
        return savedHomeTimezone;
      }
    }
    // Default to the first selected city if no home timezone is set
    return selectedCities.length > 0 ? selectedCities[0].name : null;
  });
  
  // Add an effect to set the first city as home if no home is set
  useEffect(() => {
    // If no home timezone is set but we have cities, set the first one as home
    if (!homeTimezone && selectedCities.length > 0) {
      setHomeCity(selectedCities[0].name);
    }
  }, [homeTimezone, selectedCities]);
  
  // Reference DateTime - midnight in the home timezone
  const [referenceDateTime, setReferenceDateTime] = useState(() => {
    // Get current time
    const now = DateTime.now();
    
    // If we have a home timezone, set to midnight in that timezone
    if (homeTimezone) {
      const homeCity = cities.find(c => c.name === homeTimezone);
      if (homeCity) {
        // Create a DateTime at midnight in the home timezone
        return DateTime.now().setZone(homeCity.timezone).startOf('day');
      }
    }
    
    // Default to midnight in local timezone if no home timezone
    return now.startOf('day');
  });
  
  // Update reference time when home timezone changes
  useEffect(() => {
    if (homeTimezone) {
      const homeCity = cities.find(c => c.name === homeTimezone);
      if (homeCity) {
        // Set to midnight in the home timezone
        setReferenceDateTime(DateTime.now().setZone(homeCity.timezone).startOf('day'));
      }
    } else {
      // Default to midnight in local timezone if no home timezone
      setReferenceDateTime(DateTime.now().startOf('day'));
    }
  }, [homeTimezone]);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(DateTime.now());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);
  
  // Save cities to localStorage whenever the selection changes
  useEffect(() => {
    // Only save if we have cities selected
    if (selectedCities.length > 0) {
      // Save just the city names to keep the storage size small
      const cityNames = selectedCities.map(city => city.name);
      localStorage.setItem('selectedCities', JSON.stringify(cityNames));
    }
  }, [selectedCities]);
  
  // Save time format preference
  useEffect(() => {
    localStorage.setItem('use24HourFormat', use24HourFormat);
  }, [use24HourFormat]);
  
  // Save home timezone to localStorage when it changes
  useEffect(() => {
    if (homeTimezone) {
      localStorage.setItem('homeTimezone', homeTimezone);
    } else {
      localStorage.removeItem('homeTimezone');
    }
  }, [homeTimezone]);
  
  // Update the setHomeCity function to save to localStorage
  const setHomeCity = (cityName) => {
    setHomeTimezone(cityName);
    if (cityName) {
      localStorage.setItem('homeTimezone', cityName);
    } else {
      localStorage.removeItem('homeTimezone');
      
      // If unsetting the home city and we have cities, set the first one as home
      if (selectedCities.length > 0) {
        setHomeTimezone(selectedCities[0].name);
        localStorage.setItem('homeTimezone', selectedCities[0].name);
      }
    }
  };
  
  // Filter cities based on search term
  const filteredCities = cities.filter(city => {
    // Check if the city name includes the search term (case insensitive)
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if the city is already selected
    const isAlreadySelected = selectedCities.some(selectedCity => 
      selectedCity && selectedCity.name === city.name
    );
    
    // Only include cities that match the search and aren't already selected
    return matchesSearch && !isAlreadySelected;
  });
  
  // Add a city to the selected list
  const addCity = (city) => {
    // Check if city is already in the list
    if (!selectedCities.some(c => c.name === city.name)) {
      const newSelectedCities = [...selectedCities, city];
      setSelectedCities(newSelectedCities);
      
      // Save to localStorage
      localStorage.setItem('selectedCities', JSON.stringify(newSelectedCities.map(c => c.name)));
      
      // Reset search state
      setSearchTerm('');
      setIsDropdownOpen(false);
      setHighlightedIndex(0);
    }
  };
  
  // Remove a city from the selected list
  const removeCity = (cityName) => {
    // If removing the home timezone, unset it
    if (cityName === homeTimezone) {
      setHomeTimezone(null);
    }
    
    setSelectedCities(selectedCities.filter(city => city.name !== cityName));
  };
  
  // Move a timezone in the list (for drag and drop)
  const moveTimezone = (fromIndex, toIndex) => {
    const updatedCities = [...selectedCities];
    const [movedCity] = updatedCities.splice(fromIndex, 1);
    updatedCities.splice(toIndex, 0, movedCity);
    setSelectedCities(updatedCities);
  };
  
  // Add state for current time
  const [currentTime, setCurrentTime] = useState(DateTime.now());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Update the getTimeForCity function to match the timeline format for non-hour offsets
  const getTimeForCity = (city) => {
    // Get the current time in this city's timezone
    const cityTime = currentTime.setZone(city.timezone);
    
    // Check if the timezone has a non-hour offset (like India's +5:30)
    const hasNonHourOffset = cityTime.offset % 60 !== 0;
    
    // Format the time based on user preference and offset
    if (use24HourFormat) {
      if (hasNonHourOffset) {
        // For 24-hour format with non-hour offsets, show hour and minutes separately
        return `${cityTime.toFormat('HH')}:${cityTime.toFormat('mm')}`;
      } else if (cityTime.minute !== 0) {
        // For regular timezones with non-zero minutes
        return cityTime.toFormat('HH:mm');
      } else {
        // For regular timezones with zero minutes
        return cityTime.toFormat('HH');
      }
    } else {
      // For 12-hour format, always show minutes for non-hour offsets
      if (hasNonHourOffset || cityTime.minute !== 0) {
        return cityTime.toFormat('h:mm a');
      } else {
        return cityTime.toFormat('h a');
      }
    }
  };
  
  // Update the getTimeline function to display non-hour offset times in 24H mode with hour and minutes on separate lines
  const getTimeline = (city, referenceDateTime) => {
    const times = [];
    
    // Check if timezone has a non-hour offset
    const hasNonHourOffset = cityTime => cityTime.offset % 60 !== 0;
    
    // For each hour of the day (0-23)
    for (let i = 0; i < 24; i++) {
      // Create a DateTime for this hour in the reference timezone
      const slotDateTime = referenceDateTime.plus({ hours: i });
      
      // Convert to the city's timezone
      const localSlotTime = slotDateTime.setZone(city.timezone);
      
      // Get the hour and minute in the city's timezone
      const localHour = localSlotTime.hour;
      const localMinute = localSlotTime.minute;
      const isNonHourOffset = hasNonHourOffset(localSlotTime);
      
      // Format the time string based on user preference
      let timeStr;
      
      // Special case for midnight (when hour is 0) - show date instead
      if (localHour === 0 && localMinute === 0) {
        // Format as "Mar\n3" (month and day)
        const month = localSlotTime.toFormat('MMM');
        const day = localSlotTime.toFormat('d');
        
        timeStr = `${month}\n${day}`;
      } else {
        if (use24HourFormat) {
          // 24-hour format
          if (isNonHourOffset) {
            // For non-hour offsets in 24H mode, show hour and minutes on separate lines
            timeStr = `${localSlotTime.toFormat('HH')}\n${localSlotTime.toFormat('mm')}`;
          } else if (localMinute !== 0) {
            // For regular timezones with non-zero minutes
            timeStr = localSlotTime.toFormat('HH:mm\n');
          } else {
            // For regular timezones with zero minutes
            timeStr = localSlotTime.toFormat('HH\n');
          }
        } else {
          // 12-hour format
          const hour12 = localHour % 12 || 12; // Convert 0 to 12
          const period = localHour >= 12 ? 'PM' : 'AM';
          
          if (isNonHourOffset || localMinute !== 0) {
            timeStr = `${hour12}:${localSlotTime.toFormat('mm')}\n${period}`;
          } else {
            timeStr = `${hour12}\n${period}`;
          }
        }
      }
      
      // Determine time of day for coloring
      let timeOfDay;
      if (localHour >= 0 && localHour < 7) {
        timeOfDay = 'night';
      } else if (localHour >= 7 && localHour < 12) {
        timeOfDay = 'morning';
      } else if (localHour >= 12 && localHour < 18) {
        timeOfDay = 'afternoon';
      } else {
        timeOfDay = 'evening';
      }
      
      times.push({ 
        time: timeStr, 
        hour: i, 
        timeOfDay: timeOfDay,
        isHalfHour: isNonHourOffset,
        isMidnight: localHour === 0 && localMinute === 0,
        dateTime: localSlotTime
      });
    }
    
    return times;
  };
  
  // Handle row selection for multi-select
  const handleRowSelection = (index, event) => {
    if (event.metaKey || event.ctrlKey) {
      // Toggle selection with Cmd/Ctrl key
      if (selectedRows.includes(index)) {
        setSelectedRows(selectedRows.filter(i => i !== index));
      } else {
        setSelectedRows([...selectedRows, index]);
      }
    } else if (event.shiftKey && selectedRows.length > 0) {
      // Range selection with Shift key
      const lastSelected = selectedRows[selectedRows.length - 1];
      const start = Math.min(lastSelected, index);
      const end = Math.max(lastSelected, index);
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      
      // Merge with existing selection, avoiding duplicates
      const newSelection = [...new Set([...selectedRows, ...range])];
      setSelectedRows(newSelection);
    } else {
      // Single selection without modifier keys
      setSelectedRows([index]);
    }
  };
  
  // Handle copying time information
  const handleCopyTimeInfo = (e) => {
    // Check if Cmd+C (or Ctrl+C) is pressed
    if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
      // Only proceed if we have a hovered time and selected rows
      if (hoveredTimeSlot && selectedRows.length > 0) {
        // Build the text to copy
        let copyText = '';
        
        // Get the selected cities
        const citiesToCopy = selectedRows.map(index => selectedCities[index]);
        
        // For each selected city, get the time at the hovered slot
        citiesToCopy.forEach(city => {
          if (city) {
            // Get the time for this city at the hovered slot
            const timeAtSlot = hoveredTimeSlot.dateTime.setZone(city.timezone);
            
            // Format the time based on user preference
            const timeStr = use24HourFormat 
              ? timeAtSlot.toFormat('HH:mm')
              : timeAtSlot.toFormat('h:mm a');
            
            // Add the city and time to the copy text
            copyText += `${city.name}: ${timeStr}\n`;
          }
        });
        
        // Copy to clipboard
        navigator.clipboard.writeText(copyText)
          .then(() => {
            // Show the copied content in the toast
            setToastMessage(`Copied to clipboard!\n\n${copyText}`);
            setShowToast(true);
            
            // Hide toast after 5 seconds (increased from 3 seconds)
            setTimeout(() => {
              setShowToast(false);
            }, 5000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            setToastMessage('Failed to copy to clipboard');
            setShowToast(true);
            
            setTimeout(() => {
              setShowToast(false);
            }, 3000);
          });
      }
    }
  };
  
  // Add keyboard event listener for copy
  useEffect(() => {
    document.addEventListener('keydown', handleCopyTimeInfo);
    return () => {
      document.removeEventListener('keydown', handleCopyTimeInfo);
    };
  }, [selectedRows, hoveredTime, hoveredTimeIndex, hoveredTimeSlot, selectedCities, use24HourFormat]);
  
  // Add state for dark mode
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a preference stored
    const savedPreference = localStorage.getItem('darkMode');
    // Also check system preference if no stored preference
    if (savedPreference === null) {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedPreference === 'true';
  });
  
  // Apply dark mode
  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  // Add state to track if tips are visible
  const [showTips, setShowTips] = useState(() => {
    // Check localStorage for user preference
    const hideTips = localStorage.getItem('hideTips');
    // If user has explicitly hidden tips, don't show them
    return hideTips !== 'true';
  });
  
  // Function to handle closing tips
  const handleCloseTips = () => {
    setShowTips(false);
    // Save preference to localStorage
    localStorage.setItem('hideTips', 'true');
  };
  
  // Add a function to show tips
  const handleShowTips = () => {
    setShowTips(true);
    // Remove the "hidden" preference from localStorage
    localStorage.removeItem('hideTips');
  };
  
  // Add state for keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  // Reset highlighted index when search term changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);
  
  // Handle keyboard navigation in the dropdown
  const handleSearchKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); // Prevent scrolling the page
        setHighlightedIndex(prev => 
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault(); // Prevent scrolling the page
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : 0
        );
        break;
        
      case 'Enter':
        e.preventDefault(); // Prevent form submission
        if (filteredCities.length > 0) {
          const selectedCity = filteredCities[highlightedIndex];
          addCity(selectedCity);
          setSearchTerm('');
          setIsDropdownOpen(false);
          setHighlightedIndex(0); // Reset the highlighted index
          
          // Force the input to blur to reset focus state
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }
        break;
        
      case 'Escape':
        setIsDropdownOpen(false);
        setHighlightedIndex(0); // Reset the highlighted index
        
        // Force the input to blur
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        break;
        
      default:
        break;
    }
  };
  
  // Scroll the highlighted option into view
  useEffect(() => {
    if (isDropdownOpen && filteredCities.length > 0) {
      const highlightedElement = document.getElementById(`city-option-${highlightedIndex}`);
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isDropdownOpen, filteredCities.length]);
  
  // Add ref for the search dropdown
  const searchDropdownRef = useRef(null);
  
  // Handle clicks outside the search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchDropdownRef.current && 
        !searchDropdownRef.current.contains(event.target) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    }
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  // In the App component, find the home city object
  const homeCity = homeTimezone ? cities.find(c => c.name === homeTimezone) : null;
  
  return (
    <div className="app">
      <h1>TimeHopper</h1>
      
      {/* App header without toggles */}
      <div className="app-header">
        {/* Empty or can be removed if not needed */}
      </div>
      
      {/* City picker with search and controls on the same line */}
      <div className="city-picker-container">
        <div className="search-controls-row">
          <div className="search-dropdown" ref={searchDropdownRef}>
            <input
              type="text"
              placeholder="Add locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleSearchKeyDown}
              className="city-search"
            />
            {isDropdownOpen && (
              <div className="city-dropdown">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city, index) => (
                    <div 
                      key={city.name} 
                      id={`city-option-${index}`}
                      className={`city-option ${index === highlightedIndex ? 'highlighted' : ''}`}
                      onClick={() => {
                        addCity(city);
                        // No need to set these here as they're now handled in the addCity function
                        // setSearchTerm('');
                        // setIsDropdownOpen(false);
                        
                        // Force the input to blur
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {city.name} ({city.timezoneName})
                    </div>
                  ))
                ) : (
                  <div className="no-results">No cities found</div>
                )}
              </div>
            )}
          </div>
          
          <div className="app-controls">
            <button 
              className="help-button" 
              onClick={handleShowTips}
              aria-label="Show help tips"
            >
              Help
            </button>
            
            <div className="dark-mode-toggle">
              <label className="toggle-label">
                <button 
                  className={`toggle-button ${!darkMode ? 'active' : ''}`}
                  onClick={() => setDarkMode(false)}
                  aria-label="Light mode"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </button>
                <button 
                  className={`toggle-button ${darkMode ? 'active' : ''}`}
                  onClick={() => setDarkMode(true)}
                  aria-label="Dark mode"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </button>
              </label>
            </div>
            
            <div className="time-format-toggle">
              <label className="toggle-label">
                <button 
                  className={`toggle-button ${!use24HourFormat ? 'active' : ''}`}
                  onClick={() => setUse24HourFormat(false)}
                >
                  AM/PM
                </button>
                <button 
                  className={`toggle-button ${use24HourFormat ? 'active' : ''}`}
                  onClick={() => setUse24HourFormat(true)}
                >
                  24H
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <DndProvider backend={HTML5Backend}>
        <div className="timezone-container">
          {selectedCities.map((city, index) => (
            <DraggableTimezoneRow
              key={city.name}
              city={city}
              index={index}
              moveTimezone={moveTimezone}
              removeCity={removeCity}
              hoveredTime={hoveredTime}
              hoveredTimeIndex={hoveredTimeIndex}
              setHoveredTime={setHoveredTime}
              setHoveredTimeIndex={setHoveredTimeIndex}
              setHoveredTimeSlot={setHoveredTimeSlot}
              getTimeForCity={getTimeForCity}
              getTimeline={getTimeline}
              referenceDateTime={referenceDateTime}
              use24HourFormat={use24HourFormat}
              isSelected={selectedRows.includes(index)}
              onRowSelect={handleRowSelection}
              isHomeTimezone={city.name === homeTimezone}
              setHomeCity={setHomeCity}
              currentTime={currentTime}
              homeCity={homeCity}
            />
          ))}
        </div>
      </DndProvider>
      
      {/* Tips section */}
      {showTips && (
        <div className="tips-section">
          <div className="tips-header">
            <h3>Tips</h3>
            <button 
              className="close-tips-btn" 
              onClick={handleCloseTips}
              aria-label="Close tips"
            >
              ×
            </button>
          </div>
          <ul>
            <li>
              <kbd>⌘</kbd>+<kbd>Shift</kbd> to select timezones you want, then hover over time <kbd>⌘</kbd>+<kbd>C</kbd> to copy and paste.
            </li>
            <li>
              Right click to set home timezone.
            </li>
          </ul>
        </div>
      )}
      
      {/* Toast notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;