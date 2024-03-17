export const convertYYYYMMDDToDate = (dateString: string) =>
  dateString ? new Date(`${dateString}T00:00:00Z`) : null;

export const getYYYYMMDD = (date?: Date) => {
  if (!date) return null;

  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', {
    month: '2-digit',
  });
  const day = date.toLocaleString('default', { day: '2-digit' });

  return [year, month, day].join('-');
};

export const getCurrentTimezone = () =>
  (new Date().getTimezoneOffset() / 60) * -1;

export const getHHMMFromDateString = (date: string | null | undefined) => {
  if (!date) return null;

  const dateObj = new Date(date);
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};
