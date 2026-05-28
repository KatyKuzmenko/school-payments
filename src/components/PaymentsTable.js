import React, { useState } from "react";
import { supabase } from "../supabase";
import "./PaymentsTable.css";

function PaymentsTable({ students, payments }) {
  const [receipts, setReceipts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const months = [
    "Вересень","Жовтень","Листопад",
    "Грудень","Січень","Лютий",
    "Березень","Квітень","Травень"
  ];

  const showReceipts = async (studentId) => {
    const studentPayments = payments
      .filter(p => p.student_id === studentId)
      .map(p => p.id);

    const { data } = await supabase
      .from("receipts")
      .select("file_url, payment_id")
      .in("payment_id", studentPayments);

    setReceipts(data || []);
    setShowModal(true);
  };

  return (
    <div className="payments-container">
      <table className="table">
        <thead>
          <tr>
            <th>Учень</th>
            {months.map((m) => <th key={m}>{m}</th>)}
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              {months.map((m) => {
                const payment = payments.find(
                  (p) => p.student_id === s.id && p.month === m
                );
                return (
                  <td key={m} className={payment?.status === "paid" ? "paid" : "unpaid"}>
                    {payment?.status === "paid" ? "✅ Сплачено" : "❌ Не сплачено"}
                  </td>
                );
              })}
              <td>
                <button className="btn" onClick={() => showReceipts(s.id)}>Чеки</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Завантажені чеки</h3>
            {receipts.length > 0 ? (
              <ul>
                {receipts.map((r, i) => (
                  <li key={i}>
                    <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                      Переглянути чек {i+1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Немає завантажених чеків</p>
            )}
            <button className="btn" onClick={() => setShowModal(false)}>Закрити</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsTable;
