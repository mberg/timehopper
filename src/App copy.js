import React, { useState, useEffect } from 'react';
import './App.css';

const cities = [
  { name: 'London', timezone: 'Europe/London', offset: 0 },
  { name: 'Cairo', timezone: 'Africa/Cairo', offset: 2 },
  { name: 'Moscow', timezone: 'Europe/Moscow', offset: 3 },
  { name: 'Nairobi', timezone: 'Africa/Nairobi', offset: 3 },
  { name: 'New York', timezone: 'America/New_York', offset: -5 },
  { name: 'Dhaka', timezone: 'Asia/Dhaka', offset: 6 },
];

function App() {
  const [selectedCities, setSelectedCities] = useState([cities[0], cities[4]]); // Default: London and New York
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addCity = (city) => {
    if (selectedCities.length < 6 && !selectedCities.find(c => c.name === city.name)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (cityName) => {
    setSelectedCities(selectedCities.filter(city => city.name !== cityName));
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
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);
    const times = [];
    for (let i = 0; i < 24; i++) {
      const time = new Date(startOfDay);
      time.setHours(i);
      time.setMinutes(city.offset * 60); // Adjust for timezone offset
      const timeStr = time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        hour12: true 
      }).replace(':00', '');
      times.push(timeStr);
    }
    return times;
  };

  return (
    <div className="app">
      <h1>Time Zone Comparator</h1>
      <div className="city-selector">
        <h3>Add City</h3>
        <select onChange={(e) => addCity(cities.find(c => c.name === e.target.value))}>
          <option value="">Select a city</option>
          {cities.filter(city => !selectedCities.find(c => c.name === city.name)).map(city => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
        </select>
      </div>
      <div className="timezone-container">
        {selectedCities.map(city => (
          <div key={city.name} className="timezone-row">
            <div className="city-header">
              <h2>{city.name} (GMT{city.offset >= 0 ? `+${city.offset}` : city.offset})</h2>
              <button onClick={() => removeCity(city.name)}>×</button>
            </div>
            <div className="current-time">
              {getTimeForCity(city)} {currentDate.toLocaleDateString('en-US', { 
                timeZone: city.timezone, 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="timeline">
              {getTimeline(city, currentDate).map((time, index) => (
                <span key={index} className="time-slot">{time}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;