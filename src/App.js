import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const cities = [
  { name: 'Accra', timezone: 'Africa/Accra', offset: 0, timezoneName: 'GMT' },
  { name: 'Amsterdam', timezone: 'Europe/Amsterdam', offset: 1, timezoneName: 'CET' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok', offset: 7, timezoneName: 'ICT' },
  { name: 'Barcelona', timezone: 'Europe/Madrid', offset: 1, timezoneName: 'CET' },
  { name: 'Beijing', timezone: 'Asia/Shanghai', offset: 8, timezoneName: 'CST' },
  { name: 'Berlin', timezone: 'Europe/Berlin', offset: 1, timezoneName: 'CET' },
  { name: 'Bogota', timezone: 'America/Bogota', offset: -5, timezoneName: 'COT' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', offset: -3, timezoneName: 'ART' },
  { name: 'Burlington', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Cairo', timezone: 'Africa/Cairo', offset: 2, timezoneName: 'EET' },
  { name: 'Cape Town', timezone: 'Africa/Johannesburg', offset: 2, timezoneName: 'SAST' },
  { name: 'Chicago', timezone: 'America/Chicago', offset: -6, timezoneName: 'CST' },
  { name: 'Dallas', timezone: 'America/Chicago', offset: -6, timezoneName: 'CST' },
  { name: 'Dakar', timezone: 'Africa/Dakar', offset: 0, timezoneName: 'GMT' },
  { name: 'Delhi', timezone: 'Asia/Kolkata', offset: 5.5, timezoneName: 'IST' },
  { name: 'Denver', timezone: 'America/Denver', offset: -7, timezoneName: 'MST' },
  { name: 'Dhaka', timezone: 'Asia/Dhaka', offset: 6, timezoneName: 'BST' },
  { name: 'Dubai', timezone: 'Asia/Dubai', offset: 4, timezoneName: 'GST' },
  { name: 'Dublin', timezone: 'Europe/Dublin', offset: 0, timezoneName: 'GMT' },
  { name: 'Geneva', timezone: 'Europe/Zurich', offset: 1, timezoneName: 'CET' },
  { name: 'Helsinki', timezone: 'Europe/Helsinki', offset: 2, timezoneName: 'EET' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 8, timezoneName: 'HKT' },
  { name: 'Istanbul', timezone: 'Europe/Istanbul', offset: 3, timezoneName: 'TRT' },
  { name: 'Jakarta', timezone: 'Asia/Jakarta', offset: 7, timezoneName: 'WIB' },
  { name: 'Johannesburg', timezone: 'Africa/Johannesburg', offset: 2, timezoneName: 'SAST' },
  { name: 'Karachi', timezone: 'Asia/Karachi', offset: 5, timezoneName: 'PKT' },
  { name: 'Lagos', timezone: 'Africa/Lagos', offset: 1, timezoneName: 'WAT' },
  { name: 'Lima', timezone: 'America/Lima', offset: -5, timezoneName: 'PET' },
  { name: 'Lisbon', timezone: 'Europe/Lisbon', offset: 0, timezoneName: 'WET' },
  { name: 'London', timezone: 'Europe/London', offset: 0, timezoneName: 'GMT' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', offset: -8, timezoneName: 'PST' },
  { name: 'Madrid', timezone: 'Europe/Madrid', offset: 1, timezoneName: 'CET' },
  { name: 'Manila', timezone: 'Asia/Manila', offset: 8, timezoneName: 'PHT' },
  { name: 'Melbourne', timezone: 'Australia/Melbourne', offset: 10, timezoneName: 'AEST' },
  { name: 'Mexico City', timezone: 'America/Mexico_City', offset: -6, timezoneName: 'CST' },
  { name: 'Miami', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Moscow', timezone: 'Europe/Moscow', offset: 3, timezoneName: 'MSK' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata', offset: 5.5, timezoneName: 'IST' },
  { name: 'Nairobi', timezone: 'Africa/Nairobi', offset: 3, timezoneName: 'EAT' },
  { name: 'New Delhi', timezone: 'Asia/Kolkata', offset: 5.5, timezoneName: 'IST' },
  { name: 'New York', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Oslo', timezone: 'Europe/Oslo', offset: 1, timezoneName: 'CET' },
  { name: 'Paris', timezone: 'Europe/Paris', offset: 1, timezoneName: 'CET' },
  { name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo', offset: -3, timezoneName: 'BRT' },
  { name: 'Rome', timezone: 'Europe/Rome', offset: 1, timezoneName: 'CET' },
  { name: 'San Francisco', timezone: 'America/Los_Angeles', offset: -8, timezoneName: 'PST' },
  { name: 'Santiago', timezone: 'America/Santiago', offset: -4, timezoneName: 'CLT' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', offset: -3, timezoneName: 'BRT' },
  { name: 'Seattle', timezone: 'America/Los_Angeles', offset: -8, timezoneName: 'PST' },
  { name: 'Seoul', timezone: 'Asia/Seoul', offset: 9, timezoneName: 'KST' },
  { name: 'Shanghai', timezone: 'Asia/Shanghai', offset: 8, timezoneName: 'CST' },
  { name: 'Singapore', timezone: 'Asia/Singapore', offset: 8, timezoneName: 'SGT' },
  { name: 'Stockholm', timezone: 'Europe/Stockholm', offset: 1, timezoneName: 'CET' },
  { name: 'Sydney', timezone: 'Australia/Sydney', offset: 10, timezoneName: 'AEST' },
  { name: 'Taipei', timezone: 'Asia/Taipei', offset: 8, timezoneName: 'CST' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', offset: 9, timezoneName: 'JST' },
  { name: 'Toronto', timezone: 'America/Toronto', offset: -5, timezoneName: 'EST' },
  { name: 'Vancouver', timezone: 'America/Vancouver', offset: -8, timezoneName: 'PST' },
  { name: 'Vienna', timezone: 'Europe/Vienna', offset: 1, timezoneName: 'CET' },
  { name: 'Warsaw', timezone: 'Europe/Warsaw', offset: 1, timezoneName: 'CET' },
  { name: 'Washington DC', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Zurich', timezone: 'Europe/Zurich', offset: 1, timezoneName: 'CET' },
];

// Define the type for our drag and drop
const ItemTypes = {
  TIMEZONE: 'timezone'
};

// Draggable timezone component
const DraggableTimezoneRow = ({ city, index, moveTimezone, removeCity, hoveredTime, hoveredTimeIndex, getTimeForCity, getTimeline, currentDate, setHoveredTime, setHoveredTimeIndex, setHoveredTimeSlot, use24HourFormat, isSelected, onRowSelect }) => {
  const ref = useRef(null);

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

  return (
    <div 
      ref={ref}
      className={`timezone-row ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={(e) => onRowSelect(index, e)}
    >
      <div className="drag-handle">⋮⋮</div>
      <div className="city-info">
        <div className="city-header">
          <h2>
            {city.name} 
            <span className="timezone-badge">{city.timezoneName}</span>
          </h2>
        </div>
        <div className="current-time">
          {getTimeForCity(city)} {currentDate.toLocaleDateString('en-US', { 
            timeZone: city.timezone, 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>
      <div className="timeline">
        {getTimeline(city, currentDate).map((slot, i) => (
          <div 
            key={i} 
            className={`time-slot ${slot.timeOfDay} ${hoveredTimeIndex === i ? 'highlight' : ''} ${slot.isHalfHour ? 'half-hour' : ''}`}
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
      <button className="close-btn" onClick={() => removeCity(city.name)}>×</button>
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredTime, setHoveredTime] = useState(null); // Track the hovered time (in 24-hour format)
  const [use24HourFormat, setUse24HourFormat] = useState(() => {
    // Check if user has a preference stored
    const savedFormat = localStorage.getItem('use24HourFormat');
    // Return the saved preference or default to false (AM/PM)
    return savedFormat === 'true';
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
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
  
  // Add this effect to save time format preference
  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('use24HourFormat', use24HourFormat);
  }, [use24HourFormat]);

  const addCity = (city) => {
    if (!selectedCities.find(c => c.name === city.name)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (cityName) => {
    const updatedCities = selectedCities.filter(city => city.name !== cityName);
    setSelectedCities(updatedCities);
    
    // If we removed the last city, clear localStorage
    if (updatedCities.length === 0) {
      localStorage.removeItem('selectedCities');
    }
  };

  const getTimeForCity = (city) => {
    const options = { 
      timeZone: city.timezone, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: !use24HourFormat 
    };
    return currentDate.toLocaleTimeString('en-US', options);
  };

  const getTimeline = (city, day) => {
    // Create a date object for reference (current day in user's local timezone)
    const referenceDate = new Date(day);
    const times = [];
    
    // Check if timezone has a half-hour offset
    const hasHalfHourOffset = city.offset % 1 !== 0;
    
    // For each hour of the day (0-23)
    for (let i = 0; i < 24; i++) {
      // Create a new date object for this hour
      const timeAtHour = new Date(referenceDate);
      timeAtHour.setHours(i, 0, 0, 0);
      
      // Format using the city's timezone for display
      const options = { 
        timeZone: city.timezone,
        hour: 'numeric',
        minute: hasHalfHourOffset ? 'numeric' : undefined,
        hour12: !use24HourFormat
      };
      
      // Get the time string in the city's timezone
      let timeStr = timeAtHour.toLocaleTimeString('en-US', options);
      
      // For 12-hour format, split into hours and period
      // For 24-hour format, just use the time
      if (!use24HourFormat) {
        const [time, period] = timeStr.split(' ');
        // Format with line break
        timeStr = `${time}\n${period}`;
      } else {
        timeStr = `${timeStr}\n`; // Still use newline for consistent layout
      }
      
      // Calculate what time it is in the city's timezone for coloring
      const cityTime = new Date(timeAtHour.getTime() + (city.offset * 60 * 60 * 1000));
      const cityHour = cityTime.getUTCHours();
      
      // Determine time of day for coloring
      let timeOfDay;
      if (cityHour >= 0 && cityHour < 4) {
        timeOfDay = 'night';
      } else if (cityHour >= 4 && cityHour < 7) {
        timeOfDay = 'night';
      } else if (cityHour >= 7 && cityHour < 10) {
        timeOfDay = 'morning';
      } else if (cityHour >= 10 && cityHour < 14) {
        timeOfDay = 'morning';
      } else if (cityHour >= 14 && cityHour < 17) {
        timeOfDay = 'afternoon';
      } else if (cityHour >= 17 && cityHour < 20) {
        timeOfDay = 'afternoon';
      } else if (cityHour >= 20 && cityHour < 22) {
        timeOfDay = 'evening';
      } else {
        timeOfDay = 'evening';
      }
      
      times.push({ 
        time: timeStr, 
        hour: i, 
        timeOfDay: timeOfDay,
        isHalfHour: hasHalfHourOffset
      });
    }
    return times;
  };

  // Move timezone handler for drag and drop
  const moveTimezone = (dragIndex, hoverIndex) => {
    const dragTimezone = selectedCities[dragIndex];
    const newCities = [...selectedCities];
    newCities.splice(dragIndex, 1);
    newCities.splice(hoverIndex, 0, dragTimezone);
    setSelectedCities(newCities);
  };

  // State for city search filter
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.search-dropdown')) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Filter available cities based on search term
  const filteredCities = cities
    .filter(city => !selectedCities.find(c => c.name === city.name))
    .filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Add these state variables to your App component
  const [selectedRows, setSelectedRows] = useState([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

  // Update the handleRowSelection function
  const handleRowSelection = (index, event) => {
    // Prevent default browser behavior
    event.preventDefault();
    
    // Handle Shift + Click to add to selection without selecting rows in between
    if (event.shiftKey) {
      // If this is the first selection with shift, just select this row
      if (selectedRows.length === 0) {
        setSelectedRows([index]);
        setLastSelectedIndex(index);
        return;
      }
      
      // Otherwise, add this row to the existing selection
      if (!selectedRows.includes(index)) {
        setSelectedRows([...selectedRows, index]);
      } else {
        // If already selected, deselect it
        setSelectedRows(selectedRows.filter(i => i !== index));
      }
      
      setLastSelectedIndex(index);
      return;
    }
    
    // Handle Command/Ctrl + Click for toggling selection
    if (event.metaKey || event.ctrlKey) {
      const isSelected = selectedRows.includes(index);
      
      if (isSelected) {
        setSelectedRows(selectedRows.filter(i => i !== index));
      } else {
        setSelectedRows([...selectedRows, index]);
      }
      
      setLastSelectedIndex(index);
      return;
    }
    
    // Default single click behavior - select only this row
    setSelectedRows([index]);
    setLastSelectedIndex(index);
  };

  // Add this state to track the currently hovered time slot
  const [hoveredTimeSlot, setHoveredTimeSlot] = useState(null);

  // Add these state variables for the toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Add this state to track the hovered time slot index
  const [hoveredTimeIndex, setHoveredTimeIndex] = useState(null);

  // Update the handleCopyTimeInfo function to fix 24H mode
  const handleCopyTimeInfo = (event) => {
    // Check if it's a copy command (Cmd+C or Ctrl+C)
    if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
      // Only proceed if we have selected rows and a hovered time index
      if (selectedRows.length > 0 && hoveredTimeIndex !== null) {
        // Build the copy text
        let copyText = '';
        
        // For each selected row, add the city info
        selectedRows.forEach(rowIndex => {
          const city = selectedCities[rowIndex];
          if (city) {
            // Get the timeline for this city
            const cityTimeline = getTimeline(city, currentDate);
            
            // Get the time slot at the hovered index
            const timeSlot = cityTimeline[hoveredTimeIndex];
            
            if (timeSlot) {
              // Format time according to current format setting
              let timeString;
              
              if (use24HourFormat) {
                // For 24-hour format, use the time directly from the slot
                // This is the same approach as the AM/PM mode but formatted for 24H
                const hourParts = timeSlot.time.split('\n')[0].trim();
                
                // Convert the hour to 24-hour format
                let hour = parseInt(hourParts, 10);
                const isPM = timeSlot.time.includes('PM') && hour < 12;
                const isAM = timeSlot.time.includes('AM') && hour === 12;
                
                if (isPM) hour += 12;
                if (isAM) hour = 0;
                
                // Format with leading zero
                const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
                
                // Add minutes
                timeString = `${hourStr}:00`;
                
                // Handle half-hour timezones
                if (timeSlot.isHalfHour) {
                  timeString = `${hourStr}:30`;
                }
              } else {
                // For 12-hour format, use the original time with AM/PM
                timeString = timeSlot.time.replace('\n', ' ');
              }
              
              copyText += `• ${city.name} (${city.timezoneName}) - ${timeString}\n`;
            }
          }
        });
        
        // Copy to clipboard
        if (copyText) {
          navigator.clipboard.writeText(copyText.trim())
            .then(() => {
              // Show toast notification with copied content
              setToastMessage(`Copied to clipboard!\n\n${copyText.trim()}`);
              setShowToast(true);
              
              // Hide toast after 4 seconds (longer to allow reading)
              setTimeout(() => {
                setShowToast(false);
              }, 4000);
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
    }
  };

  // Update the useEffect dependency array
  useEffect(() => {
    document.addEventListener('keydown', handleCopyTimeInfo);
    return () => {
      document.removeEventListener('keydown', handleCopyTimeInfo);
    };
  }, [selectedRows, hoveredTime, hoveredTimeIndex, hoveredTimeSlot, selectedCities, use24HourFormat]);

  // Add this state for dark mode
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a preference stored
    const savedPreference = localStorage.getItem('darkMode');
    // Also check system preference if no stored preference
    if (savedPreference === null) {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedPreference === 'true';
  });

  // Add this effect to apply dark mode
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

  return (
    <div className="app">
      <h1>Time Zone Hopper</h1>
      <div className="app-header">
        <div className="city-selector">
          <h3>Add City</h3>
          <div className="search-dropdown">
            <input
              type="text"
              placeholder="Type to search cities..."
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
        </div>
        <div className="app-controls">
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
              currentDate={currentDate}
              use24HourFormat={use24HourFormat}
              isSelected={selectedRows.includes(index)}
              onRowSelect={handleRowSelection}
            />
          ))}
        </div>
      </DndProvider>
      
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