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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  
  const [selectedType, setSelectedType] = useState('ALL');

  const pageSize = 10;

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

// Fetch transactions with pagination
  const fetchTransactions = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/finance/transactions', {
        params: {
          page: page,
          size: pageSize
        }
      });
      setTransactions(res.data?.content || []);
      setTotalPages(res.data?.totalPages ?? 0);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(0);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchTransactions(newPage);
    }
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
      fetchTransactions(currentPage);
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
            fetchTransactions(0);
            setShowForm(false);
            setTransactionToEdit(null);
          }}
        />
      )}

{loading ? (
        <Loader message="Loading transactions..." />
      ) : error ? (
        <p className="text-red-500 text-center py-4">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No transactions to display</p>
      ) : (
        <>
          <TransactionsTable
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage + 1}
              onPageChange={(page) => handlePageChange(page - 1)}
            />
          )}
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
