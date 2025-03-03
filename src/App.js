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
  currentTime
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
            <span className="timezone-badge">{city.timezoneName}</span>
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
            {!use24HourFormat && <div className="period">{slot.time.split('\n')[1]}</div>}
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
        return cityNames.map(name => cities.find(c => c.name === name)).filter(Boolean);
      } catch (e) {
        console.error('Error loading saved cities', e);
      }
    }
    
    // Default cities if nothing is saved
    return [
      cities.find(c => c.name === 'Burlington'),
      cities.find(c => c.name === 'Nairobi'),
      cities.find(c => c.name === 'Dakar'),
      cities.find(c => c.name === 'Jakarta'),
      cities.find(c => c.name === 'San Francisco')
    ];
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
    // Load home timezone from localStorage or default to null
    const savedHomeTimezone = localStorage.getItem('homeTimezone');
    return savedHomeTimezone || null;
  });
  
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
  
  // Function to set home timezone
  const setHomeCity = (cityName) => {
    setHomeTimezone(cityName);
  };
  
  // Filter cities based on search term
  const filteredCities = cities.filter(city => 
    !selectedCities.some(c => c.name === city.name) && 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Add a city to the selected list
  const addCity = (city) => {
    if (!selectedCities.some(c => c.name === city.name)) {
      setSelectedCities([...selectedCities, city]);
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

  // Function to get formatted current time for a city
  const getTimeForCity = (city) => {
    const cityTime = currentTime.setZone(city.timezone);
    
    if (use24HourFormat) {
      return cityTime.toFormat('HH:mm:ss');
    } else {
      return cityTime.toFormat('h:mm:ss a');
    }
  };
  
  // Generate timeline for a city
  const getTimeline = (city, referenceDateTime) => {
    const times = [];
    
    // Check if timezone has a half-hour offset
    const hasHalfHourOffset = city.timezone.includes('30') || city.timezone.includes('45');
    
    // For each hour of the day (0-23)
    for (let i = 0; i < 24; i++) {
      // Create a DateTime for this hour in the reference timezone
      const slotDateTime = referenceDateTime.plus({ hours: i });
      
      // Convert to the city's timezone
      const localSlotTime = slotDateTime.setZone(city.timezone);
      
      // Get the hour in the city's timezone
      const localHour = localSlotTime.hour;
      
      // Format the time string based on user preference
      let timeStr;
      
      // Special case for midnight (when hour is 0) - show date instead for both formats
      if (localHour === 0) {
        // Format as "Mar\n3" (month and day)
        const month = localSlotTime.toFormat('MMM');
        const day = localSlotTime.toFormat('d');
        
        timeStr = `${month}\n${day}`;
      } else {
        if (use24HourFormat) {
          // 24-hour format: "01" to "23" (no ":00")
          timeStr = localSlotTime.toFormat('HH');
          
          // Add minutes if there's a half-hour offset
          if (hasHalfHourOffset) {
            timeStr = localSlotTime.toFormat('HH:mm');
          }
          
          // Add a newline for consistent layout
          timeStr = `${timeStr}\n`;
        } else {
          // 12-hour format: Single digit with AM/PM
          const hour12 = localHour % 12 || 12; // Convert 0 to 12
          const period = localHour >= 12 ? 'PM' : 'AM';
          
          // For half-hour timezones, include the minutes
          if (hasHalfHourOffset) {
            timeStr = `${hour12}:${localSlotTime.toFormat('mm')}\n${period}`;
          } else {
            timeStr = `${hour12}\n${period}`;
          }
        }
      }
      
      // Determine time of day for coloring
      let timeOfDay;
      if (localHour >= 0 && localHour < 4) {
        timeOfDay = 'night';
      } else if (localHour >= 4 && localHour < 7) {
        timeOfDay = 'night';
      } else if (localHour >= 7 && localHour < 10) {
        timeOfDay = 'morning';
      } else if (localHour >= 10 && localHour < 14) {
        timeOfDay = 'morning';
      } else if (localHour >= 14 && localHour < 17) {
        timeOfDay = 'afternoon';
      } else if (localHour >= 17 && localHour < 20) {
        timeOfDay = 'afternoon';
      } else if (localHour >= 20 && localHour < 22) {
        timeOfDay = 'evening';
      } else {
        timeOfDay = 'evening';
      }
      
      times.push({ 
        time: timeStr, 
        hour: i, 
        timeOfDay: timeOfDay,
        isHalfHour: hasHalfHourOffset,
        isMidnight: localHour === 0, // Now for both formats
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
          <div className="search-dropdown">
            <input
              type="text"
              placeholder="Add locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              className="city-search"
            />
            {isDropdownOpen && (
              <div className="city-dropdown">
                {filteredCities.length > 0 ? (
                  filteredCities.map(city => (
                    <div 
                      key={city.name} 
                      className="city-option"
                      onClick={() => {
                        const cityObj = cities.find(c => c.name === city.name);
                        addCity(cityObj);
                        setSearchTerm('');
                        setIsDropdownOpen(false);
                      }}
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