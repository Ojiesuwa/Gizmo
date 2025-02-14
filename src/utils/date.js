export function formatDate(seconds) {
  const date = new Date(seconds * 1000); // Convert seconds to milliseconds
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Function to get the ordinal suffix (e.g., "st", "nd", "rd", "th")
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th'; // For 11th to 20th
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

export function formatDateWithTime(seconds) {
  // Convert seconds to milliseconds and create a Date object
  const date = new Date(seconds * 1000);

  // Helper function to get the ordinal suffix (st, nd, rd, th)
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  // Month names array
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Get the day, month, and year
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Format the time
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // Convert to 12-hour format

  // Construct the formatted date string
  const formattedDate = `${day}${getOrdinalSuffix(
    day
  )} ${month} ${year}, ${hours}:${minutes}${ampm}`;

  return formattedDate;
}
