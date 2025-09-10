import React, { useState, useEffect } from 'react';
import api from '../../../api/api';

const INITIAL_FORM = {
  type: 'INCOME',
  categoryName: '',
  amount: '',
  date: '',
  description: ''
};

export default function TransactionForm({ onSuccess, transaction }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update formData when the transaction prop changes (for edit functionality)
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        categoryName: transaction.categoryName,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description || ''
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'categoryName' ? value.toUpperCase() : value
    }));
  };

  const validate = () => {
    const errors = {};
    const { type, categoryName, amount, date } = formData;

    if (!['INCOME', 'EXPENSE'].includes(type)) errors.type = 'Type must be INCOME or EXPENSE';
    if (!categoryName || categoryName !== categoryName.toUpperCase())
      errors.categoryName = 'Category name must be uppercase';

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) errors.amount = 'Amount must be greater than zero';

    const selectedDate = new Date(date);
    const now = new Date();
    if (!date || selectedDate > now || selectedDate.getFullYear() < 2021)
      errors.date = 'Date must not be in the future and year >= 2021';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (transaction) {
        // Update existing transaction
        await api.put(`/finance/transactions/${transaction.id}`, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
      } else {
        // Create new transaction
        await api.post('/finance/transactions', { ...formData, amount: parseFloat(formData.amount) });
      }
      setFormData(INITIAL_FORM); // Reset form data after submission
      onSuccess?.();
    } catch (err) {
      console.error('Error adding/updating transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label className="block mb-1 text-sm">Type<span className="text-red-500 ml-1">*</span></label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
          {formErrors.type && <p className="text-red-500 text-sm">{formErrors.type}</p>}
        </div>

        {/* Category Name */}
        <div>
          <label className="block mb-1 text-sm">Category Name<span className="text-red-500 ml-1">*</span></label>
          <input
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            maxLength={30}
            placeholder="E.g. SALARY"
            className="w-full border px-3 py-2 rounded uppercase"
          />
          {formErrors.categoryName && <p className="text-red-500 text-sm">{formErrors.categoryName}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className="block mb-1 text-sm">Amount<span className="text-red-500 ml-1">*</span></label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount in ₹"
            className="w-full border px-3 py-2 rounded"
          />
          {formErrors.amount && <p className="text-red-500 text-sm">{formErrors.amount}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 text-sm">Date<span className="text-red-500 ml-1">*</span></label>
          <input
            name="date"
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {formErrors.date && <p className="text-red-500 text-sm">{formErrors.date}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">Description (optional)</label>
          <input
            name="description"
            value={formData.description}
            maxLength={30}
            onChange={handleChange}
            placeholder="Optional description"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-4 px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
      >
        {isSubmitting ? 'Submitting...' : transaction ? 'Update Transaction' : 'Submit Transaction'}
      </button>
    </form>
  );
}
