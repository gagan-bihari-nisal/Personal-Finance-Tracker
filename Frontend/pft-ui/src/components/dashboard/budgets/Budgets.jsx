import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import Loader from '../../../common/Loader';
import { formatCurrency } from '../../../common/FormatCurrency';
import DeleteModal from '../../../common/DeleteModal';
import { getYears } from '../Overview/utils';
import { START_YEAR, MONTHS } from '../../../common/constants';
import Pagination from './Pagination';
import BudgetsForm from './BudgetsForm';
import BudgetsFilters from './BudgetsFilters';
import BudgetsGrid from './BudgetsGrid';
import BudgetsHeader from './BudgetsHeader';
export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [message, setMessage] = useState('');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const years = getYears(currentYear, START_YEAR);

  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);


  const filteredFilterMonths =
    filterYear === currentYear ? MONTHS.slice(0, currentMonth) : MONTHS;


  // Pagination  
  const [currentPage, setCurrentPage] = useState(1);
  const budgetsPerPage = 6;

  const filteredBudgets = budgets.filter(
    (b) =>
      parseInt(b.year) === parseInt(filterYear) &&
      parseInt(b.month) === parseInt(filterMonth)
  );

  const totalPages = Math.ceil(filteredBudgets.length / budgetsPerPage);
  const indexOfLastBudget = currentPage * budgetsPerPage;
  const indexOfFirstBudget = indexOfLastBudget - budgetsPerPage;
  const currentBudgets = filteredBudgets.slice(indexOfFirstBudget, indexOfLastBudget);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = () => {
    setLoading(true);
    api
      .get('/finance/budgets')
      .then((response) => {
        setBudgets(response.data || []);
        setCurrentPage(1); // Reset to first page on new fetch
      })
      .catch((err) => {
        console.error('Error fetching budgets:', err);
        setError('Failed to fetch budgets.');
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDeleteClick = (budget) => {
    setBudgetToDelete(budget);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!budgetToDelete) return;

    try {
      await api.delete(`/finance/budgets/${budgetToDelete.id}`);
      showMessage('Budget deleted successfully!');

      fetchBudgets();
      setShowDeleteModal(false);
      setBudgetToDelete(null);
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  const resetForm = () => {
    setEditingBudget(null);
    setShowForm(false);
  };


  return (
    <section>
      <BudgetsHeader
        showForm={showForm}
        successMessage={message}
        toggleForm={() => {
          setShowForm((prev) => !prev);
          setEditingBudget(null);
        }}
      />

      {showForm && (
        <BudgetsForm
          budget={editingBudget}
          currentYear={currentYear}
          onSuccess={(msg) => {
            fetchBudgets();
            setShowForm(false);
            setEditingBudget(null);
            showMessage(msg);
          }}
        />
      )}

      {loading && <Loader message="Loading budgets..." />}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}


      <BudgetsFilters
        years={years}
        selectedYear={filterYear}
        setSelectedYear={(y) => {
          setFilterYear(y);
          setCurrentPage(1);
        }}
        filteredMonths={filteredFilterMonths}
        selectedMonth={filterMonth}
        setSelectedMonth={(m) => {
          setFilterMonth(m);
          setCurrentPage(1);
        }}
        currentYear={currentYear}
        currentMonth={currentMonth}
      />

      {!loading && !error && currentBudgets.length === 0 && (
        <p className="text-gray-500 text-center py-4">No budgets found.</p>
      )}


      {!loading && !error && (
        <BudgetsGrid
          budgets={currentBudgets}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}



      {!loading && !error && currentBudgets.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Budget"
        message={`Are you sure you want to delete the budget for "${budgetToDelete?.categoryName}"?`}
      />
    </section>
  );
}
