import { z } from 'zod';

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export type Gender = 'male' | 'female' | 'other';

export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

export type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];
const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  BaseEntrySchema.extend({
    type: z.literal('HealthCheck'),
    healthCheckRating: z.union([
      z.literal(HealthCheckRating.Healthy),
      z.literal(HealthCheckRating.LowRisk),
      z.literal(HealthCheckRating.HighRisk),
      z.literal(HealthCheckRating.CriticalRisk),
    ]),
  }),
  BaseEntrySchema.extend({
    type: z.literal('Hospital'),
    discharge: z.object({ date: z.iso.date(), criteria: z.string() }),
  }),
  BaseEntrySchema.extend({
    type: z.literal('OccupationalHealthcare'),
    employerName: z.string(),
    sickLeave: z.object({ startDate: z.iso.date(), endDate: z.iso.date() }).optional(),
  }),
]);

export type NewEntry = z.infer<typeof NewEntrySchema>;
export type Entry = NewEntry & { id: string };

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
export type NewPatient = Omit<Patient, 'id' | 'entries'>;