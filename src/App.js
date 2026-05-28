import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import PaymentsTable from './components/PaymentsTable';
import Header from './components/Header';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: studentsData } = await supabase
        .from('students')
        .select('*');
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*');
      setStudents(studentsData || []);
      setPayments(paymentsData || []);
    };
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <h1 className="app-title">Оплати по місяцях</h1>
        <hr className="title-line" />
        <PaymentsTable
          students={students}
          payments={payments}
        />
      </main>
    </div>
  );
}

export default App;
