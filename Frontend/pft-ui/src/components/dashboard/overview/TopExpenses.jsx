// src/components/dashboard/overview/TopExpenses.jsx
import React from 'react';
import { formatCurrency } from '../../../common/FormatCurrency';
import { TOP_EXPENSE_COLORS } from '../../../common/constants';

export default function TopExpenses({ categoryData }) {
  const top5 = [...categoryData].sort((a, b) => b.amountSpent - a.amountSpent).slice(0, 5);
  const maxAmount = Math.max(...categoryData.map(c => c.amountSpent), 1);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Top 5 Expenses</h3>
          <p className="text-xs text-gray-500">Biggest spending categories this month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="space-y-5">
          {top5.map((item, index) => {
            const percent = (item.amountSpent / maxAmount) * 100;
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{item.categoryName}</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(item.amountSpent)}</span>
                </div>
                
                {/* Full bar wrapper that scales */}
                <div className="group transition-transform duration-300 hover:scale-y-105 origin-center">
                  <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className={`h-5 rounded-full ${TOP_EXPENSE_COLORS[index % TOP_EXPENSE_COLORS.length]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
