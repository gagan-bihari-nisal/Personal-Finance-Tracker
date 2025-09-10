export default function TransactionsTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="border-b">
          <tr>
            <th className="px-4 py-3 text-sm text-gray-500">Type</th>
            <th className="px-4 py-3 text-sm text-gray-500">Category</th>
            <th className="px-4 py-3 text-sm text-gray-500">Amount</th>
            <th className="px-4 py-3 text-sm text-gray-500">Date</th>
            <th className="px-4 py-3 text-sm text-gray-500">Description</th>
            <th className="px-4 py-3 text-sm text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b last:border-b-0">
              <td className="px-4 py-3 text-sm text-gray-700">{t.type}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{t.categoryName}</td>
              <td
                className={`px-4 py-3 text-sm font-medium ${
                  t.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {t.type === 'EXPENSE' ? '-' : '+'}₹{Math.abs(t.amount)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{t.date}</td>
              <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                {t.description || 'No description'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <span
                  onClick={() => onEdit(t)}
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                  title="Edit Transaction"
                >
                  ✏️
                </span>
                <span
                  onClick={() => onDelete(t)}
                  className="cursor-pointer text-red-600 hover:text-red-800 ml-2"
                  title="Delete Transaction"
                >
                  🗑️
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
