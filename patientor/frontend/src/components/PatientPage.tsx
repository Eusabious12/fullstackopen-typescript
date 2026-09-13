import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

import { Patient } from "../types";
import patientService from "../services/patients";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
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

  if (!patient) {
    return null;
  }

  return (
    <div>
      <Typography variant="h5" sx={{ marginTop: "0.5em" }}>
        {patient.name}
      </Typography>
      <div>gender: {patient.gender}</div>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <Typography variant="h6" sx={{ marginTop: "0.5em" }}>
        entries
      </Typography>
        {patient.entries?.map((entry) => (        <div key={entry.id}>
          <div>{entry.date} <em>{entry.description}</em></div>
          <ul>
            {entry.diagnosisCodes?.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PatientPage;