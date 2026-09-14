import { Box, Typography } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Entry,
  Diagnosis,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
} from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const entryStyle = {
  border: "1px solid",
  borderRadius: 5,
  padding: "0.5em",
  marginBottom: "0.5em",
};

const DiagnosisCodes = ({
  codes,
  diagnoses,
}: {
  codes?: string[];
  diagnoses: Diagnosis[];
}) => {
  if (!codes || codes.length === 0) return null;
  return (
    <ul>
      {codes.map((code) => {
        const found = diagnoses.find((d) => d.code === code);
        return (
          <li key={code}>
            {code} {found?.name}
          </li>
        );
      })}
    </ul>
  );
};

const HospitalEntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box style={entryStyle}>
    <Typography>
      {entry.date} <LocalHospitalIcon />
    </Typography>
    <Typography style={{ fontStyle: "italic" }}>{entry.description}</Typography>
    <DiagnosisCodes codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>
      Discharge {entry.discharge.date}: {entry.discharge.criteria}
    </Typography>
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const OccupationalEntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box style={entryStyle}>
    <Typography>
      {entry.date} <WorkIcon /> {entry.employerName}
    </Typography>
    <Typography style={{ fontStyle: "italic" }}>{entry.description}</Typography>
    <DiagnosisCodes codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    {entry.sickLeave && (
      <Typography>
        sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
      </Typography>
    )}
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const healthColor = (rating: HealthCheckRating): string => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return "green";
    case HealthCheckRating.LowRisk:
      return "gold";
    case HealthCheckRating.HighRisk:
      return "orange";
    case HealthCheckRating.CriticalRisk:
      return "red";
    default:
      return "gray";
  }
};

const HealthCheckEntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box style={entryStyle}>
    <Typography>
      {entry.date} <MedicalServicesIcon />
    </Typography>
    <Typography style={{ fontStyle: "italic" }}>{entry.description}</Typography>
    <FavoriteIcon style={{ color: healthColor(entry.healthCheckRating) }} />
    <DiagnosisCodes codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalEntryDetails entry={entry} diagnoses={diagnoses} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;