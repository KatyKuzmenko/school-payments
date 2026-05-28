import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import PaymentsTable from './components/PaymentsTable';
import Header from './components/Header';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchPayments();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
      console.error('Помилка при завантаженні учнів:', error.message);
    } else {
      setStudents(data || []);
    }
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase.from('payments').select('*');
    if (error) {
      console.error('Помилка при завантаженні оплат:', error.message);
    } else {
      setPayments(data || []);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <h1 className="app-title">Оплати по місяцях</h1>
        <hr className="title-line" />
        <PaymentsTable
          students={students}
          payments={payments}
          refreshPayments={fetchPayments}
          refreshStudents={fetchStudents}
        />
      </main>
    </div>
  );
}

export default App;
