export const calculateTimeFromExpectedDuration = ({
  hours,
  minutes,
  seconds,
}) => {
  hours = isNaN(hours) ? 0 : hours;
  minutes = isNaN(minutes) ? 0 : minutes;
  seconds = isNaN(seconds) ? 0 : seconds;

  return parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds);
};
