import React from 'react';

export default function BudgetsHeader({ showForm, toggleForm, successMessage }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-emerald-700">Budgets</h2>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <button
        onClick={toggleForm}
        className={`px-4 py-2 rounded text-white ${
          showForm ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        {showForm ? 'Cancel' : 'Add Budget'}
      </button>
    </div>
  );
}
