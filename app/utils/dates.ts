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
