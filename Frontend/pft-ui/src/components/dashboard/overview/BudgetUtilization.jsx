import React from 'react';
import { formatCurrency } from '../../../common/FormatCurrency';
import { getUtilization } from './utils';

export default function BudgetUtilization({ budgets }) {
  return (
    <div className="mt-8">
      <div className="text-sm text-gray-500 mb-4">Budget Utilization</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {budgets.map((b, index) => {
          const utilization = getUtilization(b.spent, b.budget);
          const radius = 40;
          const strokeWidth = 8;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (utilization / 100) * circumference;

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center group hover:shadow-md transition-shadow duration-300"
            >
              {/* Circular Progress */}
              <div className="relative w-24 h-24 mb-3 transition-transform duration-300 group-hover:scale-110">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="lightgray"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={b.exceeded ? "#ef4444" : "#10b981"}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                  {Math.round(utilization)}%
                </div>
              </div>

              {/* Budget Info */}
              <div className="text-center">
                <div className="font-medium text-gray-700">{b.category}</div>
                <div className={`text-sm ${b.exceeded ? "text-red-600 font-semibold" : "text-gray-600"}`}>
                  {formatCurrency(b.spent)} / {formatCurrency(b.budget)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Remaining:{" "}
                  <span className={b.exceeded ? "text-red-600 font-medium" : ""}>
                    {formatCurrency(b.remaining)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
