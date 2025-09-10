import React from 'react';
import { formatCurrency } from '../../../common/FormatCurrency';

export default function BudgetsGrid({ budgets, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {budgets.map((budget) => (
        <div key={budget.id} className="bg-white rounded-lg p-4 shadow-sm relative">
          <div className="text-sm text-gray-500">{budget.categoryName}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-lg">{formatCurrency(budget.amount)}</div>
            <div className="text-sm text-gray-400">
              {budget.month}/{budget.year}
            </div>
          </div>

          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => onEdit(budget)}
              className="text-blue-500 hover:text-blue-700"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(budget)}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
