export interface TimeMessageConfig {
  startHour: number; // 0 - 23
  endHour: number;   // 0 - 23
  message: string;
}

export const TIME_MESSAGES: TimeMessageConfig[] = [
  { startHour: 0, endHour: 4, message: "LATE NIGHT CODING?" },
  { startHour: 5, endHour: 8, message: "EARLY BIRD MODE" },
  { startHour: 9, endHour: 17, message: "JUST BROWSING?" },
  { startHour: 18, endHour: 23, message: "EVENING SYSTEM ACTIVE" },
];

export const getTimeBasedMessage = (date: Date = new Date()): string => {
  const hour = date.getHours();
  const found = TIME_MESSAGES.find(
    (item) => hour >= item.startHour && hour <= item.endHour
  );
  return found ? found.message : "JUST BROWSING?";
};
