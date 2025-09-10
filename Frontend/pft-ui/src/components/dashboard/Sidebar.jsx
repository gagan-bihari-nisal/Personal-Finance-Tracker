import React from 'react'


const menu = [
    { key: 'overview', label: 'Charts', icon: '📊' },
    { key: 'transactions', label: 'Transactions', icon: '💸' },
    { key: 'budgets', label: 'Budgets', icon: '🧾' },
    // { key: 'settings', label: 'Profile / Settings', icon: '⚙️' },
]


export default function Sidebar({ selected, onSelect = () => { } }) {
    return (
        <nav className="h-full p-4 overflow-y-auto">
            <div className="mb-6 px-2">
                <div className="text-sm text-gray-500 tracking-wide">Go To</div>
            </div>


            <ul className="space-y-2">
                {menu.map((m) => {
                    const active = selected === m.key
                    return (
                        <li key={m.key}>
                            <button
                                onClick={() => onSelect(m.key)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-xl">{m.icon}</span>
                                <span className="font-medium">{m.label}</span>
                            </button>
                        </li>
                    )
                })}
            </ul>


            <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500 px-3">
                Tip: Use the menu to navigate.
            </div>
        </nav>
    )
}