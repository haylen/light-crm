export const parseTime = (
  isWorkHoursEnabled: boolean,
  time: string | null | undefined,
) => {
  if (!isWorkHoursEnabled || !time) return undefined;
  const [hours, minutes] = time.split(':');
  return new Date(Date.UTC(2000, 0, 1, +hours, +minutes));
};
