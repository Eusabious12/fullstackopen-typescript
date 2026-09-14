import { useState, SyntheticEvent } from "react";
import { NewEntry, Diagnosis, HealthCheckRating } from "../types";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
  diagnoses: Diagnosis[];
  error?: string;
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const AddEntryForm = ({ onSubmit, onCancel, diagnoses, error }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [dischargeDate, setDischargeDate] = useState("");
  const [criteria, setCriteria] = useState("");
  const [employer, setEmployer] = useState("");
  const [sickStart, setSickStart] = useState("");
  const [sickEnd, setSickEnd] = useState("");

  const submit = (e: SyntheticEvent) => {
    e.preventDefault();
    const base = { description, date, specialist, diagnosisCodes: codes };
    let entry: NewEntry;
    if (type === "Hospital") {
      entry = { ...base, type, discharge: { date: dischargeDate, criteria } };
    } else if (type === "OccupationalHealthcare") {
      entry = { ...base, type, employerName: employer,
        ...(sickStart && sickEnd ? { sickLeave: { startDate: sickStart, endDate: sickEnd } } : {}) };
    } else {
      entry = { ...base, type, healthCheckRating: rating as HealthCheckRating };
    }
    onSubmit(entry);
  };

  const row = { display: "block", margin: "0.5em 0" };

  return (
    <div style={{ border: "1px dashed", borderRadius: 5, padding: "1em", margin: "1em 0" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>New entry</h3>
      <form onSubmit={submit}>
        <label style={row}>Type
          <select value={type} onChange={(e) => setType(e.target.value as EntryType)}>
            <option value="HealthCheck">HealthCheck</option>
            <option value="Hospital">Hospital</option>
            <option value="OccupationalHealthcare">OccupationalHealthcare</option>
          </select>
        </label>
        <label style={row}>Description <input value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        <label style={row}>Date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label style={row}>Specialist <input value={specialist} onChange={(e) => setSpecialist(e.target.value)} /></label>

        {type === "HealthCheck" &&
          <label style={row}>Healthcheck rating
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={0}>Healthy</option>
              <option value={1}>Low risk</option>
              <option value={2}>High risk</option>
              <option value={3}>Critical risk</option>
            </select>
          </label>}
        {type === "Hospital" && <>
          <label style={row}>Discharge date <input type="date" value={dischargeDate} onChange={(e) => setDischargeDate(e.target.value)} /></label>
          <label style={row}>Discharge criteria <input value={criteria} onChange={(e) => setCriteria(e.target.value)} /></label>
        </>}
        {type === "OccupationalHealthcare" && <>
          <label style={row}>Employer name <input value={employer} onChange={(e) => setEmployer(e.target.value)} /></label>
          <label style={row}>Sick leave start <input type="date" value={sickStart} onChange={(e) => setSickStart(e.target.value)} /></label>
          <label style={row}>Sick leave end <input type="date" value={sickEnd} onChange={(e) => setSickEnd(e.target.value)} /></label>
        </>}

        <label style={row}>Diagnosis codes
          <select multiple value={codes}
            onChange={(e) => setCodes(Array.from(e.target.selectedOptions).map((o) => o.value))}>
            {diagnoses.map((d) => <option key={d.code} value={d.code}>{d.code} {d.name}</option>)}
          </select>
        </label>

        <div style={{ marginTop: "1em" }}>
          <button type="button" onClick={onCancel}>Cancel</button>{" "}
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddEntryForm;