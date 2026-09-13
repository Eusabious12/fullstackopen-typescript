export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}
export interface Entry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
  entries: Entry[];
}
export type PatientFormValues = Omit<Patient, "id" | "entries">;
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;