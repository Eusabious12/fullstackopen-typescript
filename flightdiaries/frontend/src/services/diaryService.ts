import axios from 'axios';
import type { NonSensitiveDiaryEntry, NewDiaryEntry, DiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllDiaries = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const { data } = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return data;
};

export const createDiary = async (object: NewDiaryEntry): Promise<DiaryEntry> => {
  const { data } = await axios.post<DiaryEntry>(baseUrl, object);
  return data;
};