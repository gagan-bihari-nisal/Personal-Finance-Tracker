import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { formatCurrency } from '../../../common/FormatCurrency';
import { COLORS } from '../../../common/constants';

export default function ChartPie({ categoryData, hoveredCategory, setHoveredCategory }) {
  const handleMouseEnter = (_, index) => setHoveredCategory(index);
  const handleMouseLeave = () => setHoveredCategory(null);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { categoryName, amountSpent } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 rounded shadow">
          <p className="label m-0">{categoryName}</p>
          <p className="amount m-0">{formatCurrency(amountSpent)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 bg-white rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-4 [&_svg:focus]:outline-none [&_g:focus]:outline-none">
      <div className="flex-1">
        <div className="text-sm text-gray-500 mb-2 ">Spending by Category</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amountSpent"
                nameKey="categoryName"
                outerRadius="80%"
                activeIndex={hoveredCategory}
                activeShape={props => (
                  <Sector
                    {...props}
                    outerRadius={props.outerRadius + 1} // Grow on hover
                  />
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                label={false}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{
                      filter:
                        hoveredCategory === index
                          ? 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))'
                          : 'none',
                    }}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="md:w-60 flex flex-col justify-center gap-2 text-sm">
        {categoryData.map((entry, index) => (
          <div key={index} className="flex items-center justify-start">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-700">{entry.categoryName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
