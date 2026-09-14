import { useState, useEffect } from 'react';
import axios from 'axios';
import type { NonSensitiveDiaryEntry } from './types';
import { Weather, Visibility } from './types';
import { getAllDiaries, createDiary } from './services/diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void getAllDiaries().then(data => setDiaries(data));
  }, []);

  const notify = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const data = await createDiary({ date, weather, visibility, comment });
      setDiaries(diaries.concat(data));
      setDate('');
      setWeather(Weather.Sunny);
      setVisibility(Visibility.Great);
      setComment('');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const data: unknown = e.response?.data;
        if (data && typeof data === 'object' && 'error' in data && Array.isArray(data.error)) {
          const messages = data.error
            .map((issue: { message: string; path: string[] }) =>
              `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');
          notify(messages);
        } else {
          notify('Something went wrong');
        }
      } else {
        notify('Unknown error');
      }
    }
  };

  return (
    <div>
      <h1>Diary entries</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Add new entry</h2>
      <form onSubmit={(e) => void diaryCreation(e)}>
        <div>
          date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          weather{' '}
          {Object.values(Weather).map(w => (
            <span key={w}>
              <input
                type="radio"
                name="weather"
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}{' '}
            </span>
          ))}
        </div>
        <div>
          visibility{' '}
          {Object.values(Visibility).map(v => (
            <span key={v}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}{' '}
            </span>
          ))}
        </div>
        <div>
          comment <input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>

      {diaries.map(diary => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>
            visibility: {diary.visibility}<br />
            weather: {diary.weather}
          </p>
        </div>
      ))}
    </div>
  );
};

export default App;