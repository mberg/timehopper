import React, { useState, useEffect } from 'react';
import './App.css';

const cities = [
  { name: 'Accra', timezone: 'Africa/Accra', offset: 0 },
  { name: 'Amsterdam', timezone: 'Europe/Amsterdam', offset: 1 },
  { name: 'Bangkok', timezone: 'Asia/Bangkok', offset: 7 },
  { name: 'Barcelona', timezone: 'Europe/Madrid', offset: 1 },
  { name: 'Beijing', timezone: 'Asia/Shanghai', offset: 8 },
  { name: 'Berlin', timezone: 'Europe/Berlin', offset: 1 },
  { name: 'Bogota', timezone: 'America/Bogota', offset: -5 },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', offset: -3 },
  { name: 'Burlington', timezone: 'America/New_York', offset: -5 },
  { name: 'Cairo', timezone: 'Africa/Cairo', offset: 2 },
  { name: 'Cape Town', timezone: 'Africa/Johannesburg', offset: 2 },
  { name: 'Chicago', timezone: 'America/Chicago', offset: -6 },
  { name: 'Dallas', timezone: 'America/Chicago', offset: -6 },
  { name: 'Dakar', timezone: 'Africa/Dakar', offset: 0 },
  { name: 'Delhi', timezone: 'Asia/Kolkata', offset: 5.5 },
  { name: 'Denver', timezone: 'America/Denver', offset: -7 },
  { name: 'Dhaka', timezone: 'Asia/Dhaka', offset: 6 },
  { name: 'Dubai', timezone: 'Asia/Dubai', offset: 4 },
  { name: 'Dublin', timezone: 'Europe/Dublin', offset: 0 },
  { name: 'Helsinki', timezone: 'Europe/Helsinki', offset: 2 },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 8 },
  { name: 'Istanbul', timezone: 'Europe/Istanbul', offset: 3 },
  { name: 'Jakarta', timezone: 'Asia/Jakarta', offset: 7 },
  { name: 'Johannesburg', timezone: 'Africa/Johannesburg', offset: 2 },
  { name: 'Karachi', timezone: 'Asia/Karachi', offset: 5 },
  { name: 'Lagos', timezone: 'Africa/Lagos', offset: 1 },
  { name: 'Lima', timezone: 'America/Lima', offset: -5 },
  { name: 'Lisbon', timezone: 'Europe/Lisbon', offset: 0 },
  { name: 'London', timezone: 'Europe/London', offset: 0 },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', offset: -8 },
  { name: 'Madrid', timezone: 'Europe/Madrid', offset: 1 },
  { name: 'Manila', timezone: 'Asia/Manila', offset: 8 },
  { name: 'Melbourne', timezone: 'Australia/Melbourne', offset: 10 },
  { name: 'Mexico City', timezone: 'America/Mexico_City', offset: -6 },
  { name: 'Miami', timezone: 'America/New_York', offset: -5 },
  { name: 'Moscow', timezone: 'Europe/Moscow', offset: 3 },
  { name: 'Mumbai', timezone: 'Asia/Kolkata', offset: 5.5 },
  { name: 'Nairobi', timezone: 'Africa/Nairobi', offset: 3 },
  { name: 'New Delhi', timezone: 'Asia/Kolkata', offset: 5.5 },
  { name: 'New York', timezone: 'America/New_York', offset: -5 },
  { name: 'Oslo', timezone: 'Europe/Oslo', offset: 1 },
  { name: 'Paris', timezone: 'Europe/Paris', offset: 1 },
  { name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo', offset: -3 },
  { name: 'Rome', timezone: 'Europe/Rome', offset: 1 },
  { name: 'San Francisco', timezone: 'America/Los_Angeles', offset: -8 },
  { name: 'Santiago', timezone: 'America/Santiago', offset: -4 },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', offset: -3 },
  { name: 'Seattle', timezone: 'America/Los_Angeles', offset: -8 },
  { name: 'Seoul', timezone: 'Asia/Seoul', offset: 9 },
  { name: 'Shanghai', timezone: 'Asia/Shanghai', offset: 8 },
  { name: 'Singapore', timezone: 'Asia/Singapore', offset: 8 },
  { name: 'Stockholm', timezone: 'Europe/Stockholm', offset: 1 },
  { name: 'Sydney', timezone: 'Australia/Sydney', offset: 10 },
  { name: 'Taipei', timezone: 'Asia/Taipei', offset: 8 },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', offset: 9 },
  { name: 'Toronto', timezone: 'America/Toronto', offset: -5 },
  { name: 'Vancouver', timezone: 'America/Vancouver', offset: -8 },
  { name: 'Vienna', timezone: 'Europe/Vienna', offset: 1 },
  { name: 'Warsaw', timezone: 'Europe/Warsaw', offset: 1 },
  { name: 'Washington DC', timezone: 'America/New_York', offset: -5 },
  { name: 'Zurich', timezone: 'Europe/Zurich', offset: 1 },
];

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
      hour12: true 
    };
    return currentDate.toLocaleTimeString('en-US', options);
  };

  const getTimeline = (city, day) => {
    // Create a date object for reference (current day in user's local timezone)
    const referenceDate = new Date(day);
    const times = [];
    
    // For each hour of the day (0-23)
    for (let i = 0; i < 24; i++) {
      // Create a new date object for this hour
      const timeAtHour = new Date(referenceDate);
      timeAtHour.setHours(i, 0, 0, 0);
      
      // Calculate what time it is in the city's timezone
      // Create a date that accounts for the timezone offset
      const cityTime = new Date(timeAtHour.getTime() + (city.offset * 60 * 60 * 1000));
      const cityHour = cityTime.getUTCHours();
      
      // Format using the city's timezone for display
      const options = { 
        timeZone: city.timezone,
        hour: 'numeric',
        hour12: true
      };
      
      // Get the time string in the city's timezone
      let timeStr = timeAtHour.toLocaleTimeString('en-US', options);
      
      // Extract hours for display
      const hourNum = timeStr.replace(/[^0-9]/g, '');
      const period = timeStr.includes('PM') ? 'PM' : 'AM';
      
      // Format with line break
      timeStr = `${hourNum}\n${period}`;
      
      // Determine time of day for coloring based on the city's local hour
      let timeOfDay;
      if (cityHour >= 0 && cityHour < 4) {
        timeOfDay = 'night'; // Deep night
      } else if (cityHour >= 4 && cityHour < 7) {
        timeOfDay = 'night'; // Pre-dawn
      } else if (cityHour >= 7 && cityHour < 10) {
        timeOfDay = 'morning'; // Early morning
      } else if (cityHour >= 10 && cityHour < 14) {
        timeOfDay = 'morning'; // Late morning
      } else if (cityHour >= 14 && cityHour < 17) {
        timeOfDay = 'afternoon'; // Afternoon
      } else if (cityHour >= 17 && cityHour < 20) {
        timeOfDay = 'afternoon'; // Early evening
      } else if (cityHour >= 20 && cityHour < 22) {
        timeOfDay = 'evening'; // Evening
      } else {
        timeOfDay = 'evening'; // Late night
      }
      
      times.push({ 
        time: timeStr, 
        hour: i, 
        timeOfDay: timeOfDay
      });
    }
    return times;
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
  
  return (
    <div className="app">
      <h1>TimeHopper</h1>
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
                    {city.name} (GMT{city.offset >= 0 ? `+${city.offset}` : city.offset})
                  </div>
                ))
              ) : (
                <div className="no-results">No cities found</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="timezone-container">
        {selectedCities.map(city => (
          <div key={city.name} className="timezone-row">
            <div className="city-info">
              <div className="city-header">
                <h2>{city.name} (GMT{city.offset >= 0 ? `+${city.offset}` : city.offset})</h2>
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
              {getTimeline(city, currentDate).map((slot, index) => (
                <div 
                  key={index} 
                  className={`time-slot ${slot.timeOfDay} ${hoveredTime === slot.hour ? 'highlight' : ''}`}
                  onMouseEnter={() => setHoveredTime(slot.hour)}
                  onMouseLeave={() => setHoveredTime(null)}
                >
                  <div className="hour">{slot.time.split('\n')[0]}</div>
                  <div className="period">{slot.time.split('\n')[1]}</div>
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => removeCity(city.name)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;