import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import axios from "axios";
import { Patient, Diagnosis, Gender, NewEntry } from "../types";
import patientService from "../services/patients";
import diagnosisService from "../services/diagnoses";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const p = await patientService.getById(id);
        setPatient(p);
      }
    };
    void fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const d = await diagnosisService.getAll();
      setDiagnoses(d);
    };
    void fetchDiagnoses();
  }, []);

  if (!patient) {
    return null;
  }

  const submitEntry = async (values: NewEntry) => {
    if (!id) return;
    try {
      const newEntry = await patientService.createEntry(id, values);
      setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
      setShowForm(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const data: unknown = e.response?.data;
        if (data && typeof data === "object" && "error" in data && Array.isArray(data.error)) {
          setError(data.error.map((i: { message: string }) => i.message).join(", "));
        } else if (typeof data === "object" && data && "error" in data) {
          setError(String((data as { error: unknown }).error));
        } else {
          setError("Something went wrong");
        }
      } else {
        setError("Unknown error");
      }
    }
  };

  const genderIcon =
    patient.gender === Gender.Male ? <MaleIcon />
    : patient.gender === Gender.Female ? <FemaleIcon />
    : <TransgenderIcon />;

  return (
    <div>
      <Typography variant="h5" style={{ marginTop: "0.5em" }}>
        {patient.name} {genderIcon}
      </Typography>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      {showForm ? (
        <AddEntryForm
          onSubmit={submitEntry}
          onCancel={() => { setShowForm(false); setError(undefined); }}
          diagnoses={diagnoses}
          error={error}
        />
      ) : (
        <Button variant="contained" sx={{ marginTop: "1em" }} onClick={() => setShowForm(true)}>
          Add New Entry
        </Button>
      )}

      <Typography variant="h6" style={{ marginTop: "0.5em" }}>
        entries
      </Typography>
      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientPage;