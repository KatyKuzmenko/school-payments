import React, { useState } from 'react';
import { supabase } from '../supabase';
import './PaymentsTable.css';

function PaymentsTable({
  students,
  payments,
  refreshPayments,
  refreshStudents,
}) {
  const [receipts, setReceipts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTelegram, setNewTelegram] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const months = [
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень',
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
  ];

  const showReceipts = async (studentId) => {
    const studentPayments = payments
      .filter((p) => p.student_id === studentId)
      .map((p) => p.id);

    const { data } = await supabase
      .from('receipts')
      .select('file_url, payment_id')
      .in('payment_id', studentPayments);

    setReceipts(data || []);
    setShowModal(true);
  };

  const togglePayment = async (studentId, month, isPaid) => {
    if (isPaid) {
      await supabase
        .from('payments')
        .delete()
        .eq('student_id', studentId)
        .eq('month', month);
    } else {
      await supabase
        .from('payments')
        .upsert([
          { student_id: studentId, month, status: 'paid', amount: 400 },
        ]);
    }
    refreshPayments();
  };

  const addStudent = async () => {
    if (!newName.trim()) {
      alert('Введіть ім’я учня');
      return;
    }
    const { data, error } = await supabase
      .from('students')
      .insert([{ name: newName, telegram_url: newTelegram || null }])
      .select();

    if (error) {
      alert('Помилка при додаванні учня: ' + error.message);
    } else {
      const newStudent = data[0];
      const paymentsData = months.map((m) => ({
        student_id: newStudent.id,
        month: m,
        status: 'unpaid',
        amount: 400,
      }));
      await supabase.from('payments').insert(paymentsData);

      setNewName('');
      setNewTelegram('');
      setAddMode(false);
      refreshStudents();
      refreshPayments();
    }
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити учня?')) return;

    await supabase
      .from('receipts')
      .delete()
      .in(
        'payment_id',
        payments.filter((p) => p.student_id === studentId).map((p) => p.id),
      );

    await supabase.from('payments').delete().eq('student_id', studentId);
    await supabase.from('students').delete().eq('id', studentId);

    refreshStudents();
    refreshPayments();
  };

  return (
    <div className="payments-container">
      <table className="table">
        <thead>
          <tr>
            <th>Учень</th>
            {months.map((m) => (
              <th key={m}>{m}</th>
            ))}
            <th>Додатково</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>
                {deleteMode && (
                  <span
                    className="delete-icon"
                    onClick={() => deleteStudent(s.id)}
                    title="Видалити учня"
                  >
                    ❌
                  </span>
                )}
                {s.name}
              </td>
              {months.map((m) => {
                const payment = payments.find(
                  (p) => p.student_id === s.id && p.month === m,
                );
                const isPaid = payment?.status === 'paid';
                return (
                  <td
                    key={m}
                    className={`payment-cell ${isPaid ? 'paid' : 'unpaid'}`}
                    onClick={() => togglePayment(s.id, m, isPaid)}
                  >
                    {isPaid ? '✔' : '✖'}
                  </td>
                );
              })}
              <td>
                <button
                  className="btn"
                  onClick={() => showReceipts(s.id)}
                >
                  Чеки
                </button>
                {s.telegram_url && (
                  <a
                    href={s.telegram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="telegram-link"
                    title="Telegram батьків"
                  >
                    📲
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* кнопки керування */}
      <div className="controls">
        <button
          className="btn btn-primary"
          onClick={() => setAddMode(!addMode)}
        >
          {addMode ? 'Скасувати додавання' : 'Додати учня+'}
        </button>
        <button
          className="btn btn-danger"
          onClick={() => setDeleteMode(!deleteMode)}
        >
          {deleteMode ? 'Вийти з режиму видалення' : 'Видалити'}
        </button>
      </div>

      {/* форма додавання учня */}
      {addMode && (
        <div className="add-student">
          <h3>Новий учень</h3>
          <input
            type="text"
            placeholder="Ім’я учня"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Telegram батьків (необов’язково)"
            value={newTelegram}
            onChange={(e) => setNewTelegram(e.target.value)}
          />
          <button
            className="btn"
            onClick={addStudent}
          >
            Зберегти
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Завантажені чеки</h3>
            {receipts.length > 0 ? (
              <ul>
                {receipts.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Переглянути чек {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Немає завантажених чеків</p>
            )}
            <button
              className="btn"
              onClick={() => setShowModal(false)}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsTable;
