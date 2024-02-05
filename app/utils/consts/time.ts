export const HOURS_SELECT_OPTIONS = [
  { label: '00 - 12 AM', value: '00' },
  { label: '01 - 01 AM', value: '01' },
  { label: '02 - 02 AM', value: '02' },
  { label: '03 - 03 AM', value: '03' },
  { label: '04 - 04 AM', value: '04' },
  { label: '05 - 05 AM', value: '05' },
  { label: '06 - 06 AM', value: '06' },
  { label: '07 - 07 AM', value: '07' },
  { label: '08 - 08 AM', value: '08' },
  { label: '09 - 09 AM', value: '09' },
  { label: '10 - 10 AM', value: '10' },
  { label: '11 - 11 AM', value: '11' },
  { label: '12 - 12 PM', value: '12' },
  { label: '13 - 01 PM', value: '13' },
  { label: '14 - 02 PM', value: '14' },
  { label: '15 - 03 PM', value: '15' },
  { label: '16 - 04 PM', value: '16' },
  { label: '17 - 05 PM', value: '17' },
  { label: '18 - 06 PM', value: '18' },
  { label: '19 - 07 PM', value: '19' },
  { label: '20 - 08 PM', value: '20' },
  { label: '21 - 09 PM', value: '21' },
  { label: '22 - 10 PM', value: '22' },
  { label: '23 - 11 PM', value: '23' },
];

export const MINUTES_SELECT_OPTIONS = Array.from(
  { length: 60 },
  (_value, index) => ({
    label: index.toString().padStart(2, '0'),
    value: index.toString().padStart(2, '0'),
  }),
);

export const TIMEZONE_MIN = -11;

export const TIMEZONE_MAX = 12;

export const TIMEZONE_SELECT_OPTIONS = [
  { label: 'GMT-11:00', value: -11 },
  { label: 'GMT-10:00', value: -10 },
  { label: 'GMT-09:00', value: -9 },
  { label: 'GMT-08:00', value: -8 },
  { label: 'GMT-07:00', value: -7 },
  { label: 'GMT-06:00', value: -6 },
  { label: 'GMT-05:00', value: -5 },
  { label: 'GMT-04:00', value: -4 },
  { label: 'GMT-03:00', value: -3 },
  { label: 'GMT-02:00', value: -2 },
  { label: 'GMT-01:00', value: -1 },
  { label: 'GMT+00:00', value: 0 },
  { label: 'GMT+01:00', value: 1 },
  { label: 'GMT+02:00', value: 2 },
  { label: 'GMT+03:00', value: 3 },
  { label: 'GMT+04:00', value: 4 },
  { label: 'GMT+05:00', value: 5 },
  { label: 'GMT+06:00', value: 6 },
  { label: 'GMT+07:00', value: 7 },
  { label: 'GMT+08:00', value: 8 },
  { label: 'GMT+09:00', value: 9 },
  { label: 'GMT+10:00', value: 10 },
  { label: 'GMT+11:00', value: 11 },
  { label: 'GMT+12:00', value: 12 },
];
