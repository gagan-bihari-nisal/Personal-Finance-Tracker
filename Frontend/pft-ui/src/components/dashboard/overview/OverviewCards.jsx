// src/components/dashboard/overview/OverviewCards.jsx
import React from 'react';
import { formatCurrency } from '../../../common/FormatCurrency';

export default function OverviewCards({ income, expenses, savings, overSpent }) {
  const cards = [
    { label: 'Income', value: income, bg: 'bg-blue-500', text: 'text-white' },
    { label: 'Expenses', value: expenses, bg: 'bg-yellow-400', text: 'text-gray-800' },
    { label: 'Savings', value: savings, bg: overSpent ? 'bg-red-400' : 'bg-green-400', text: 'text-white' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map(({ label, value, bg, text }) => (
        <div key={label} className={`${bg} ${text} rounded-lg p-4 shadow-lg`}>
          <div className="text-sm">{label}</div>
          <div className="text-2xl font-bold mt-2">{formatCurrency(value)}</div>
        </div>
      ))}
    </div>
  );
}
