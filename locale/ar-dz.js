import { defineLocale } from 'fullcalendar';

defineLocale("ar-dz", {
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 4  // The week that contains Jan 1st is the first week of the year.
  },
  isRtl: true,
  buttonText: {
    prev: "السابق",
    next: "التالي",
    today: "اليوم",
    month: "شهر",
    week: "أسبوع",
    day: "يوم",
    list: "أجندة"
  },
  weekLabel: "أسبوع",
  allDayText: "اليوم كله",
  eventLimitText: "أخرى",
  noEventsMessage: "أي أحداث لعرض"
});
