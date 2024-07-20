import { DateTime } from 'luxon';

export default function HomePage() {
  const now = DateTime.now().toLocaleString(DateTime.DATETIME_FULL);
  const date = '2024-01-02';
  const format = DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);

  return (
    <div>
      <h1>DATE: {now}</h1>
      <h1>Format: {format}</h1>
    </div>
  );
}
