import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import Loader from '../../../common/Loader';
import TransactionForm from './TransactionForm';
import Pagination from './Pagination';
import TransactionsHeader from './TransactionsHeader';
import TransactionsFilters from './TransactionsFilters';
import TransactionsTable from './TransactionsTable';
import DeleteModal from '../../../common/DeleteModal';
import { MONTHS, START_YEAR } from '../../../common/constants';
import { getYears } from '../Overview/utils';

export default function Transactions() {
  

  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  
  const [selectedType, setSelectedType] = useState('ALL');

  const transactionsPerPage = 10;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  // Years array
  const years = getYears(currentYear, START_YEAR);

  // Months array
  const filteredMonths =
    selectedYear === currentYear
      ? MONTHS.slice(0, currentMonth)
      : MONTHS;

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/finance/transactions');
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const yearMatch = selectedYear === transactionDate.getFullYear();
    const monthMatch = selectedMonth === transactionDate.getMonth() + 1;
    const typeMatch = selectedType === 'ALL' || t.type === selectedType;
    return yearMatch && monthMatch && typeMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEdit = (transaction) => {
    setTransactionToEdit(transaction);
    setShowForm(true);
  };

  const handleDelete = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/finance/transactions/${transactionToDelete.id}`);
      setSuccessMessage('Transaction deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError('Failed to delete transaction.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <section>
      <TransactionsHeader
        showForm={showForm}
        toggleForm={() => setShowForm(prev => !prev)}
        successMessage={successMessage}
      />

      <TransactionsFilters
        years={years}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        filteredMonths={filteredMonths}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        currentYear={currentYear}
        currentMonth={currentMonth}
      />

      {showForm && (
        <TransactionForm
          transaction={transactionToEdit}
          onSuccess={() => {
            setSuccessMessage('Transaction added/edited successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchTransactions();
            setShowForm(false);
            setTransactionToEdit(null);
          }}
        />
      )}

      {loading ? (
        <Loader message="Loading transactions..." />
      ) : error ? (
        <p className="text-red-500 text-center py-4">{error}</p>
      ) : filteredTransactions.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No transactions to display</p>
      ) : (
        <>
          <TransactionsTable
            transactions={paginatedTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete this transaction?`}
      />
    </section>
  );
}
