// List of cities with timezone information
const cities = [
  { name: 'Accra', timezone: 'Africa/Accra', offset: 0, timezoneName: 'GMT' },
  { name: 'Amsterdam', timezone: 'Europe/Amsterdam', offset: 1, timezoneName: 'CET' },
  { name: 'Athens', timezone: 'Europe/Athens', offset: 2, timezoneName: 'EET' },
  { name: 'Auckland', timezone: 'Pacific/Auckland', offset: 13, timezoneName: 'NZDT' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok', offset: 7, timezoneName: 'ICT' },
  { name: 'Barcelona', timezone: 'Europe/Madrid', offset: 1, timezoneName: 'CET' },
  { name: 'Beijing', timezone: 'Asia/Shanghai', offset: 8, timezoneName: 'CST' },
  { name: 'Berlin', timezone: 'Europe/Berlin', offset: 1, timezoneName: 'CET' },
  { name: 'Bogota', timezone: 'America/Bogota', offset: -5, timezoneName: 'COT' },
  { name: 'Boston', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Brazzaville', timezone: 'Africa/Brazzaville', offset: 1, timezoneName: 'WAT' },
  { name: 'Brussels', timezone: 'Europe/Brussels', offset: 1, timezoneName: 'CET' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', offset: -3, timezoneName: 'ART' },
  { name: 'Burlington', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Cairo', timezone: 'Africa/Cairo', offset: 2, timezoneName: 'EET' },
  { name: 'Cape Town', timezone: 'Africa/Johannesburg', offset: 2, timezoneName: 'SAST' },
  { name: 'Chicago', timezone: 'America/Chicago', offset: -6, timezoneName: 'CST' },
  { name: 'Copenhagen', timezone: 'Europe/Copenhagen', offset: 1, timezoneName: 'CET' },
  { name: 'Dakar', timezone: 'Africa/Dakar', offset: 0, timezoneName: 'GMT' },
  { name: 'Dallas', timezone: 'America/Chicago', offset: -6, timezoneName: 'CST' },
  { name: 'Delhi', timezone: 'Asia/Kolkata', offset: 5.5, timezoneName: 'IST' },
  { name: 'Denver', timezone: 'America/Denver', offset: -7, timezoneName: 'MST' },
  { name: 'Detroit', timezone: 'America/Detroit', offset: -5, timezoneName: 'EST' },
  { name: 'Dubai', timezone: 'Asia/Dubai', offset: 4, timezoneName: 'GST' },
  { name: 'Dublin', timezone: 'Europe/Dublin', offset: 0, timezoneName: 'GMT' },
  { name: 'Frankfurt', timezone: 'Europe/Berlin', offset: 1, timezoneName: 'CET' },
  { name: 'Granada', timezone: 'Europe/Madrid', offset: 1, timezoneName: 'CET' },
  { name: 'Helsinki', timezone: 'Europe/Helsinki', offset: 2, timezoneName: 'EET' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 8, timezoneName: 'HKT' },
  { name: 'Honolulu', timezone: 'Pacific/Honolulu', offset: -10, timezoneName: 'HST' },
  { name: 'Houston', timezone: 'America/Chicago', offset: -6, timezoneName: 'CST' },
  { name: 'Istanbul', timezone: 'Europe/Istanbul', offset: 3, timezoneName: 'TRT' },
  { name: 'Jakarta', timezone: 'Asia/Jakarta', offset: 7, timezoneName: 'WIB' },
  { name: 'Johannesburg', timezone: 'Africa/Johannesburg', offset: 2, timezoneName: 'SAST' },
  { name: 'Kyiv', timezone: 'Europe/Kiev', offset: 2, timezoneName: 'EET' },
  { name: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', offset: 8, timezoneName: 'MYT' },
  { name: 'Lagos', timezone: 'Africa/Lagos', offset: 1, timezoneName: 'WAT' },
  { name: 'Lima', timezone: 'America/Lima', offset: -5, timezoneName: 'PET' },
  { name: 'Lisbon', timezone: 'Europe/Lisbon', offset: 0, timezoneName: 'WET' },
  { name: 'London', timezone: 'Europe/London', offset: 0, timezoneName: 'GMT' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', offset: -8, timezoneName: 'PST' },
  { name: 'Madrid', timezone: 'Europe/Madrid', offset: 1, timezoneName: 'CET' },
  { name: 'Manila', timezone: 'Asia/Manila', offset: 8, timezoneName: 'PHT' },
  { name: 'Melbourne', timezone: 'Australia/Melbourne', offset: 11, timezoneName: 'AEDT' },
  { name: 'Mexico City', timezone: 'America/Mexico_City', offset: -6, timezoneName: 'CST' },
  { name: 'Miami', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Milan', timezone: 'Europe/Rome', offset: 1, timezoneName: 'CET' },
  { name: 'Moscow', timezone: 'Europe/Moscow', offset: 3, timezoneName: 'MSK' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata', offset: 5.5, timezoneName: 'IST' },
  { name: 'Munich', timezone: 'Europe/Berlin', offset: 1, timezoneName: 'CET' },
  { name: 'Nairobi', timezone: 'Africa/Nairobi', offset: 3, timezoneName: 'EAT' },
  { name: 'New Delhi', timezone: 'Asia/Kolkata', offset: 5.5, timezoneName: 'IST' },
  { name: 'New York', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Oslo', timezone: 'Europe/Oslo', offset: 1, timezoneName: 'CET' },
  { name: 'Paris', timezone: 'Europe/Paris', offset: 1, timezoneName: 'CET' },
  { name: 'Philadelphia', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Phoenix', timezone: 'America/Phoenix', offset: -7, timezoneName: 'MST' },
  { name: 'Prague', timezone: 'Europe/Prague', offset: 1, timezoneName: 'CET' },
  { name: 'Reykjavik', timezone: 'Atlantic/Reykjavik', offset: 0, timezoneName: 'GMT' },
  { name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo', offset: -3, timezoneName: 'BRT' },
  { name: 'Rome', timezone: 'Europe/Rome', offset: 1, timezoneName: 'CET' },
  { name: 'San Francisco', timezone: 'America/Los_Angeles', offset: -8, timezoneName: 'PST' },
  { name: 'Santiago', timezone: 'America/Santiago', offset: -3, timezoneName: 'CLST' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', offset: -3, timezoneName: 'BRT' },
  { name: 'Seattle', timezone: 'America/Los_Angeles', offset: -8, timezoneName: 'PST' },
  { name: 'Seoul', timezone: 'Asia/Seoul', offset: 9, timezoneName: 'KST' },
  { name: 'Shanghai', timezone: 'Asia/Shanghai', offset: 8, timezoneName: 'CST' },
  { name: 'Singapore', timezone: 'Asia/Singapore', offset: 8, timezoneName: 'SGT' },
  { name: 'Stockholm', timezone: 'Europe/Stockholm', offset: 1, timezoneName: 'CET' },
  { name: 'Sydney', timezone: 'Australia/Sydney', offset: 11, timezoneName: 'AEDT' },
  { name: 'Taipei', timezone: 'Asia/Taipei', offset: 8, timezoneName: 'CST' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', offset: 9, timezoneName: 'JST' },
  { name: 'Toronto', timezone: 'America/Toronto', offset: -5, timezoneName: 'EST' },
  { name: 'Vancouver', timezone: 'America/Vancouver', offset: -8, timezoneName: 'PST' },
  { name: 'Vienna', timezone: 'Europe/Vienna', offset: 1, timezoneName: 'CET' },
  { name: 'Warsaw', timezone: 'Europe/Warsaw', offset: 1, timezoneName: 'CET' },
  { name: 'Washington DC', timezone: 'America/New_York', offset: -5, timezoneName: 'EST' },
  { name: 'Zurich', timezone: 'Europe/Zurich', offset: 1, timezoneName: 'CET' },
];

export default cities; 