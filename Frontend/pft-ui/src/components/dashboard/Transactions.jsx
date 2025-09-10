import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import Loader from '../../common/Loader';
import TransactionForm from './TransactionForm';
import Pagination from './Pagination';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const transactionsPerPage = 10;

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

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + transactionsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-emerald-700">Transactions</h2>

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        <button
          onClick={() => setShowForm(prev => !prev)}
          className={`px-4 py-2 rounded text-white ${showForm ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {showForm && (
        <TransactionForm
          onSuccess={() => {
            setSuccessMessage('Transaction added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchTransactions();
            setShowForm(false);
          }}
        />
      )}

      {loading ? (
        <Loader message="Loading transactions..." />
      ) : error ? (
        <p className="text-red-500 text-center py-4">{error}</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-3 text-sm text-gray-500">Type</th>
                  <th className="px-4 py-3 text-sm text-gray-500">Category</th>
                  <th className="px-4 py-3 text-sm text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-sm text-gray-500">Date</th>
                  <th className="px-4 py-3 text-sm text-gray-500">Description</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t) => (
                  <tr key={t.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 text-sm text-gray-700">{t.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.categoryName}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${t.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'}`}>
                      {t.type === 'EXPENSE' ? '-' : '+'}₹{Math.abs(t.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                      {t.description || 'No description'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </section>
  );
}
