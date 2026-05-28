import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import PaymentsTable from "./components/PaymentsTable";
import "./App.css"; // підключаємо стилі

function App() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*");

      if (studentsError) {
        console.error("Помилка при отриманні учнів:", studentsError);
      } else {
        setStudents(studentsData || []);
      }

      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*");

      if (paymentsError) {
        console.error("Помилка при отриманні оплат:", paymentsError);
      } else {
        setPayments(paymentsData || []);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">Оплати по місяцях</h1>
      <PaymentsTable students={students} payments={payments} />
    </div>
  );
}

export default App;
